'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Link from 'next/link';
import { Download, Loader2, RotateCcw, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ImageUploader } from '@/components/image-uploader';
import { ToolsGrid } from '@/components/tools-grid';
import { formatFileSize } from '@/lib/utils';
import {
  convertImage,
  deriveConvertedFilename,
  inferFormatFromFile,
  type ConvertibleFormat,
  type OutputConvertibleFormat,
} from '@/lib/image-convert-utils';
import { ConversionLinkItem, ConversionLinks } from '@/components/image-converter/conversion-links';
import { IMAGE_CONVERSIONS } from '@/components/image-converter/image-converter';
import { useDebounce } from '@/lib/hooks/use-debounce';
// import { HowToSection } from '@/components/common/how-to-section';
import { FAQSection } from '@/components/common/faq-section';
import { HowToSection, HowToStep } from '@/components/common/how-to-section';

interface ConvertedState {
  url: string;
  blob: Blob;
  width: number;
  height: number;
  filename: string;
}

const OUTPUT_FORMATS: OutputConvertibleFormat[] = ['jpg', 'png', 'webp'];

function revokeUrl(url: string | null) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Ignore cleanup errors
  }
}

export function PageClient({ children }: { children: React.ReactNode }) {
  const t = useTranslations('HomePage');
  const imageT = useTranslations('ImageConverterTool');
  const genericErrorText = imageT('workspace.error.generic');

  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<ConvertibleFormat | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<OutputConvertibleFormat>('jpg');
  const [quality, setQuality] = useState(0.92);
  const debouncedQuality = useDebounce(quality, 500);
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState<ConvertedState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertedUrlRef = useRef<string | null>(null);
  const conversionRunRef = useRef(0);
  const lossyQualityRef = useRef(0.92);

  // const formatLabel = useCallback(
  //   (format: ConvertibleFormat) => imageT(`formats.${format}`),
  //   [imageT]
  // );
  const formatLabel = useCallback(
    (format: ConvertibleFormat | null) => {
      if (!format) {
        return t('unknownFormat');
      }

      try {
        return imageT(`formats.${format}`);
      } catch {
        return format.toUpperCase();
      }
    },
    [imageT, t]
  );
  const moreOptions = useMemo<ConversionLinkItem[]>(() => {
    return IMAGE_CONVERSIONS.map((item) => ({
      href: `/image-converter/${item.slug}`,
      label: imageT(`conversions.${item.slug}.label`, {
        from: formatLabel(item.from),
        to: formatLabel(item.to),
      }),
      description: imageT(`conversions.${item.slug}.shortDescription`),
    }));
  }, [formatLabel, imageT]);

  useEffect(() => {
    return () => {
      revokeUrl(previewUrl);
      revokeUrl(convertedUrlRef.current);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      revokeUrl(convertedUrlRef.current);
    };
  }, []);

  const resetConverted = () => {
    revokeUrl(convertedUrlRef.current);
    convertedUrlRef.current = null;
    setConverted(null);
  };

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);
    const detectedFormat = inferFormatFromFile(selected);
    setSourceFormat(detectedFormat);

    const suggested =
      detectedFormat === 'png'
        ? 'jpg'
        : detectedFormat === 'jpg'
          ? 'png'
          : detectedFormat === 'webp'
            ? 'jpg'
            : detectedFormat === 'svg' || detectedFormat === 'tiff' || detectedFormat === 'gif'
              ? 'png'
              : 'jpg';
    setTargetFormat(suggested);
    const nextPreviewUrl = URL.createObjectURL(selected);
    setPreviewUrl((prev) => {
      revokeUrl(prev);
      return nextPreviewUrl;
    });
    setQuality(0.92);
    lossyQualityRef.current = 0.92;
    resetConverted();
    setError(null);
  };

  const handleReset = () => {
    setFile(null);
    setSourceFormat(null);
    revokeUrl(previewUrl);
    setPreviewUrl(null);
    setTargetFormat('jpg');
    setQuality(0.92);
    lossyQualityRef.current = 0.92;
    resetConverted();
    setIsConverting(false);
    setError(null);
  };

  useEffect(() => {
    if (!file) {
      resetConverted();
      setIsConverting(false);
      setError(null);
      return;
    }

    const runId = conversionRunRef.current + 1;
    conversionRunRef.current = runId;
    setIsConverting(true);
    setError(null);
    resetConverted();

    let cancelled = false;
    const performConversion = async () => {
      try {
        const result = await convertImage(file, targetFormat, {
          quality: targetFormat === 'png' ? undefined : debouncedQuality,
        });

        if (cancelled || conversionRunRef.current !== runId) {
          return;
        }

        const url = URL.createObjectURL(result.blob);
        revokeUrl(convertedUrlRef.current);
        convertedUrlRef.current = url;
        setConverted({
          url,
          blob: result.blob,
          width: result.width,
          height: result.height,
          filename: deriveConvertedFilename(file.name, targetFormat),
        });
        setIsConverting(false);
      } catch (err) {
        if (cancelled || conversionRunRef.current !== runId) {
          return;
        }
        const message = err instanceof Error ? err.message : genericErrorText;
        setError(message);
        toast.error(message);
        setIsConverting(false);
      }
    };

    performConversion();

    return () => {
      cancelled = true;
    };
  }, [file, debouncedQuality, targetFormat]);


  const handleDownload = () => {
    if (!converted) return;

    const link = document.createElement('a');
    link.href = converted.url;
    link.download = converted.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qualityDisabled = targetFormat === 'png';
  const sliderValue = useMemo(
    () => (qualityDisabled ? 100 : Math.round(quality * 100)),
    [quality, qualityDisabled]
  );

  const downloadLabel = t('downloadCta', {
    format: imageT(`formats.${targetFormat}`),
  });

  const benefits = t.raw('benefits.items') as string[];
  const howSteps = t.raw('howSteps') as Array<{
    title: string;
    description: string;
  }>
  // const formats = t.raw('formatsList') as string[];

  return (
    <div className="mx-auto flex w-full flex-col gap-12 py-12">
      <header className="space-y-3 text-center">
        <h1 className="text-balance text-4xl font-heading font-bold text-foreground md:text-5xl">
          {t('title')}
        </h1>
        <p className="text-base text-foreground md:text-lg">
          {t('localHint')}
        </p>
      </header>

      <main id="main" className="container mx-auto px-4 pb-8 mb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {!file ? (
            <section className="space-y-8">
              <ImageUploader
                className=""
                multiple={false}
                maxFiles={1}
                onFilesSelected={handleFilesSelected}
              />
            </section>
          ) : (
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="rounded-3xl border border-border bg-card/70">
                <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-4 text-sm md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1 text-foreground">
                    <p className="font-semibold max-w-[300px] overflow-hidden text-ellipsis">{file.name}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-foreground flex-shrink-0">
                      <span>
                        {imageT('workspace.info.original', {
                          format: formatLabel(sourceFormat),
                        })}
                      </span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t('reset')}
                  </Button>
                </div>
                <div className="flex flex-col gap-4 px-6 py-4 text-sm text-foreground">
                  <div className="flex items-center justify-between text-foreground">
                    <span>
                      {imageT('workspace.info.converted', {
                        format: imageT(`formats.${targetFormat}`),
                      })}
                    </span>
                    <span className='text-primary font-semibold'>
                      {converted ? `${converted.width} × ${converted.height}px • ${formatFileSize(converted.blob.size)}` : isConverting ? '…' : '—'}
                    </span>
                  </div>
                </div>
                <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden rounded-b-3xl px-4 pb-8">
                  {isConverting && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-b-3xl bg-background/80 backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <div className="text-center text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">
                          {imageT('workspace.processing.title', {
                            from: formatLabel(sourceFormat),
                            to: imageT(`formats.${targetFormat}`),
                          })}
                        </p>
                        <p>{imageT('workspace.processing.description')}</p>
                      </div>
                    </div>
                  )}
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt={t('previewAlt')}
                      className="max-h-[450px] w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                      <span>{t('previewAlt')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-border bg-card/70 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {t('settingsTitle')}
                  </h3>

                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="output-format">{t('formatLabel')}</Label>
                      <Select
                        value={targetFormat}
                        onValueChange={(value) => {
                          setTargetFormat(value as OutputConvertibleFormat);
                        }}
                      >
                        <SelectTrigger id="output-format" className="w-[160px]">
                          <SelectValue placeholder={t('formatPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {OUTPUT_FORMATS.map((format) => (
                            <SelectItem key={format} value={format}>
                              {imageT(`formats.${format}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Label>{t('qualityLabel')}</Label>
                        <span className="text-sm font-medium text-foreground">
                          {qualityDisabled ? '—' : `${sliderValue}%`}
                        </span>
                      </div>
                      <Slider
                        min={30}
                        max={100}
                        step={1}
                        value={[sliderValue]}
                        onValueChange={([value]) => {
                          const nextQuality = value / 100;
                          setQuality(nextQuality);
                          lossyQualityRef.current = nextQuality;
                        }}
                        disabled={qualityDisabled}
                      />
                      <p className="text-xs text-foreground">
                        {qualityDisabled ? t('qualityDisabled') : t('qualityHint')}
                      </p>
                    </div>

                    {error && (
                      <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </p>
                    )}

                    <Button
                      type="button"
                      className="w-full justify-center gap-2"
                      disabled={!converted || isConverting}
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                      {downloadLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="max-w-4xl">
            <p className="font-bold text-lg text-foreground">
              {t('quickImageConverters')}
            </p>
            <ConversionLinks items={moreOptions} className="w-full grid sm:grid-cols-3 md:grid-cols-5 mt-2" />
          </div>

          {/* <div className="py-4">
            <div id="tools-grid">
              <ToolsGrid />
            </div>
          </div> */}
        </div>




      </main>

      <HowToSection
        title={t('howTitle')}
        steps={howSteps.map((step, index) => ({
          ...step,
          number: index + 1,
        } as any))}
      />

      {children}

      <div className='max-w-4xl mx-auto'>

        <section className="space-y-6 rounded-3xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              {t('benefitsTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('benefitsDescription')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/60 bg-background/70 p-4 text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* <section className="space-y-6 rounded-3xl p-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              {t('formatsTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('formatsDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {formats.map((format) => (
              <span
                key={format}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {format}
              </span>
            ))}
          </div>
        </section> */}

        <FAQSection
          title={imageT('mainFaq.title')}
          subtitle={imageT('mainFaq.subtitle')}
          faqs={imageT.raw('mainFaq.items')}
        />

        {/* SEO Content Section */}
        <section className="py-16 md:py-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            {imageT('mainSeoContent.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {imageT('mainSeoContent.body')}
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-primary/5 p-6 text-center">
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            {t('ctaTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('ctaDescription')}</p>
          <Button asChild className="mt-4">
            <Link href="#main">{t('ctaButton')}</Link>
          </Button>
        </section>

      </div>


    </div>
  );
}
