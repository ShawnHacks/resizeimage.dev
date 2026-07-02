'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Download, RefreshCw, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/image-uploader';
import { formatFileSize } from '@/lib/utils';
import { FAQSection } from '@/components/common/faq-section';
import { WatermarkEngine } from '@/app/lib/gemini-watermark/core/watermarkEngine';

interface ProcessedImage {
  id: number;
  file: File;
  name: string;
  originalImg: HTMLImageElement;
  processedBlob: Blob | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  info?: {
    size: number;
    position: { x: number; y: number };
  };
}

export function GeminiWatermarkClient() {
  const t = useTranslations('GeminiWatermarkRemover');
  const [engine, setEngine] = useState<any>(null);
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      try {
        const eng = await WatermarkEngine.create();
        setEngine(eng);
        setIsEngineReady(true);
      } catch (error) {
        console.error('Failed to initialize watermark engine:', error);
        toast.error(t('status.failed'));
      }
    };
    initEngine();
  }, [t]);

  const handleFilesSelected = useCallback((files: File[]) => {
    if (!files.length) return;

    const validFiles = files.filter(file => {
      // Basic validation matching the original logic
      if (!file.type.match('image/(jpeg|png|webp|jpg)')) {
        // Note: original code only checked type, but accepted anything matching regex. 
        // 'image/jpeg' covers jpg.
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.error(t('upload.hint'));
      return;
    }

    const newImages = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      originalImg: null as any,
      processedBlob: null,
      status: 'pending' as const
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [t]);

  // Process queue effect
  useEffect(() => {
    if (!isEngineReady || !engine || processing) return;

    const pendingImage = images.find(img => img.status === 'pending');
    if (!pendingImage) return;

    const processImage = async (item: ProcessedImage) => {
      setProcessing(true);

      // Update status to processing
      setImages(prev => prev.map(img => img.id === item.id ? { ...img, status: 'processing' } : img));

      try {
        // Load image if not loaded
        let imgElement = item.originalImg;
        if (!imgElement) {
          imgElement = await loadImage(item.file);
        }

        const info = engine.getWatermarkInfo(imgElement.width, imgElement.height);

        const resultCanvas = await engine.removeWatermarkFromImage(imgElement);
        const blob = await new Promise<Blob | null>(resolve => resultCanvas.toBlob(resolve, 'image/png'));

        if (!blob) throw new Error('Failed to generate blob');

        setImages(prev => prev.map(img => img.id === item.id ? {
          ...img,
          status: 'completed',
          processedBlob: blob,
          originalImg: imgElement,
          info: {
            size: info.size,
            position: info.position
          }
        } : img));

      } catch (error) {
        console.error('Processing error:', error);
        setImages(prev => prev.map(img => img.id === item.id ? { ...img, status: 'error' } : img));
        toast.error(`${t('status.failed')}: ${item.name}`);
      } finally {
        setProcessing(false);
      }
    };

    processImage(pendingImage);
  }, [images, isEngineReady, engine, processing, t]);

  const downloadImage = (item: ProcessedImage) => {
    if (!item.processedBlob) return;
    const url = URL.createObjectURL(item.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unwatermarked_${item.name.replace(/\.[^.]+$/, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const completed = images.filter(img => img.status === 'completed');
    if (completed.length === 0) return;

    const zip = new JSZip();
    completed.forEach(item => {
      if (item.processedBlob) {
        zip.file(`unwatermarked_${item.name.replace(/\.[^.]+$/, '')}.png`, item.processedBlob);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unwatermarked_all_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setImages([]);
    setProcessing(false);
  };

  // Render helpers
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        // @ts-expect-error: e.target.result can be string | ArrayBuffer | null, but img.src expects string
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-12 pt-16 pb-12">
      <header className="space-y-4 text-center">
        <h1 className="text-balance text-4xl font-heading font-bold text-foreground md:text-5xl">
          {t('title')}
        </h1>
        <p className="text-base text-foreground md:text-lg">
          {t('main.subtitle')}
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 mb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-8">
            {images.length === 0 ? (
              <ImageUploader
                className="min-h-[300px]"
                multiple={true}
                maxFiles={50} // increased limit
                onFilesSelected={handleFilesSelected}
                title={t('upload.text')}
              // description={t('upload.hint')}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{t('panel.title')}</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset} size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t('btn.reset')}
                    </Button>
                    {images.some(i => i.status === 'completed') && (
                      <Button onClick={downloadAll} size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        {t('btn.downloadAll')}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  {images.map(item => (
                    <div key={item.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Preview Area */}
                        <div className="shrink-0 flex gap-4 overflow-x-auto pb-2 md:pb-0">
                          <div className="w-[150px] aspect-square relative bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center border border-border/50">
                            <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10">{t('preview.original')}</span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={URL.createObjectURL(item.file)}
                              alt="Original"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="w-[150px] aspect-square relative bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center border border-border/50">
                            <span className="absolute top-1 left-1 bg-primary/80 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10">{t('preview.result')}</span>
                            {item.processedBlob ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={URL.createObjectURL(item.processedBlob)}
                                alt="Processed"
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : item.status === 'processing' ? (
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            ) : item.status === 'error' ? (
                              <AlertCircle className="h-8 w-8 text-destructive" />
                            ) : (
                              <span className="text-xs text-muted-foreground">{t('status.pending')}</span>
                            )}
                          </div>
                        </div>

                        {/* Info & Actions */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="font-medium text-foreground truncate mb-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>

                            {item.info && (
                              <div className="mt-3 text-sm text-foreground space-y-1 bg-muted/20 p-2 rounded">
                                <p><span className="text-muted-foreground">{t('info.watermark')}:</span> {item.info.size}x{item.info.size} px</p>
                                <p><span className="text-muted-foreground">{t('info.position')}:</span> ({item.info.position.x}, {item.info.position.y})</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm">
                              {item.status === 'processing' && (
                                <span className="flex items-center text-primary">
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  {t('status.processing')}
                                </span>
                              )}
                              {item.status === 'completed' && <span className="text-green-600 font-medium">{t('status.success')}</span>}
                              {item.status === 'error' && <span className="text-destructive font-medium">{t('status.failed')}</span>}
                              {item.status === 'pending' && <span className="text-muted-foreground">{t('status.pending')}</span>}
                            </div>

                            {item.status === 'completed' && (
                              <Button onClick={() => downloadImage(item)} size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                {t('btn.download')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">{t('feature.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.raw('feature.items').map((item: any, index: number) => (
              <div key={index} className="text-center p-6 bg-background rounded-xl shadow-sm border border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-xl">
                  {index === 0 ? '💻' : index === 1 ? '🔒' : index === 2 ? '🧮' : index === 3 ? '🔍' : index === 4 ? '✨' : '🌐'}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TechnicalDetails />

      <div className="container mx-auto px-4 max-w-4xl pb-16">
        <FAQSection
          title={t('faq.title')}
          subtitle={t('faq.subtitle')}
          faqs={t.raw('faq.items')}
        />
      </div>
    </div>
  );
}

function TechnicalDetails() {
  const t = useTranslations('GeminiWatermarkRemover.techDetails');

  return (
    <div className="bg-background py-16 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>

        <div className="space-y-16">
          {/* Watermark Size Detection */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm">01</span>
              {t('sizeDetection.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('sizeDetection.description')}
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t('sizeDetection.table.dims')}</th>
                    <th className="px-6 py-4 font-medium">{t('sizeDetection.table.size')}</th>
                    <th className="px-6 py-4 font-medium">{t('sizeDetection.table.margin')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-background">
                    <td className="px-6 py-4">{t('sizeDetection.table.small')}</td>
                    <td className="px-6 py-4 font-mono">{t('sizeDetection.table.pixelSmall')}</td>
                    <td className="px-6 py-4 font-mono">{t('sizeDetection.table.marginSmall')}</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="px-6 py-4">{t('sizeDetection.table.large')}</td>
                    <td className="px-6 py-4 font-mono">{t('sizeDetection.table.pixelLarge')}</td>
                    <td className="px-6 py-4 font-mono">{t('sizeDetection.table.marginLarge')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Reverse Alpha Blending */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm">02</span>
              {t('reverseAlpha.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('reverseAlpha.description')}
            </p>

            <div className="bg-muted/30 rounded-2xl p-8 space-y-6 border border-border/50">
              <div className="space-y-4">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">{t('reverseAlpha.formulaTitle')}</p>
                <div className="bg-background p-6 rounded-xl border border-border text-center shadow-inner">
                  <code className="text-lg md:text-xl font-mono text-foreground break-all italic">
                    {t('reverseAlpha.formula')}
                  </code>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <p className="text-muted-foreground">
                  {t('reverseAlpha.formulaDesc')}
                </p>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center shadow-sm">
                  <code className="text-lg md:text-xl font-mono text-primary font-bold break-all italic">
                    {t('reverseAlpha.reverseFormula')}
                  </code>
                </div>
                <p className="text-sm font-medium text-center text-foreground pt-2 italic">
                  ✨ {t('reverseAlpha.result')}
                </p>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm">03</span>
              {t('comparison.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('comparison.intro')}
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {t.raw('comparison.items').map((item: any, idx: number) => (
                <div key={idx} className="bg-background p-6 rounded-xl border border-border hover:border-primary/30 transition-colors shadow-sm">
                  <h4 className="font-bold mb-2 text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Edge Handling */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm">04</span>
              {t('edgeHandling.title')}
            </h3>
            <div className="bg-muted/30 p-6 rounded-xl border border-border/50 border-l-4 border-l-primary">
              <p className="text-muted-foreground leading-relaxed italic">
                {t('edgeHandling.description')}
              </p>
            </div>
          </section>

          {/* Reference Link */}
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-muted-foreground mb-4">
              {t('reference.text')}
            </p>
            <a
              href="https://allenkuo.medium.com/removing-gemini-ai-watermarks-a-deep-dive-into-reverse-alpha-blending-bbbd83af2a3f"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary font-medium hover:underline gap-1 group"
            >
              🚀 {t('reference.linkText')}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
