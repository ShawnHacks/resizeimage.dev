
"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ComparisonSlider } from "./comparison-slider";
import { ImageUploader } from "@/components/image-uploader";
import { compressImage, type OutputFormat, type CompressionOptions } from "@/lib/compression";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Download, Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CompressorView() {
  const t = useTranslations('ImageCompressor');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  const [isCompressing, setIsCompressing] = useState(false);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [quality, setQuality] = useState(75);

  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      // Get dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;

      // Reset compressed state
      setCompressedBlob(null);
      setCompressedUrl(null);
    }
  };

  // Run Compression Effect
  useEffect(() => {
    if (!originalFile) return;

    let active = true;

    async function process() {
      try {
        setIsCompressing(true);
        // Add a small delay for UI responsiveness
        await new Promise(r => setTimeout(r, 100));

        const output = await compressImage(originalFile!, {
          format,
          quality
        });

        if (!active) return;

        setCompressedBlob(output);
        const url = URL.createObjectURL(output);
        setCompressedUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (err) {
        console.error("Compression failed", err);
        toast.error(t('toast.error'));
      } finally {
        if (active) setIsCompressing(false);
      }
    }

    process();

    return () => {
      active = false;
    };
  }, [originalFile, format, quality]);


  // Calculate savings
  const savings = originalFile && compressedBlob
    ? ((originalFile.size - compressedBlob.size) / originalFile.size) * 100
    : 0;

  const handleDownload = () => {
    if (!compressedBlob) return;
    const a = document.createElement('a');
    a.href = compressedUrl!;
    a.download = `compressed-image.${format === 'jpeg' ? 'jpg' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(t('toast.success'));
  };

  return (
    <div className="grid max-h-[660px] h-[calc(100vh-6rem)] grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
      {/* Main Preview Area */}
      <div className="relative md:col-span-2 flex flex-col items-center justify-center border-r bg-muted/5 p-0 md:p-6 border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

        <div className="relative flex flex-1 items-center justify-center min-h-0 w-full max-w-4xl overflow-hidden bg-background">
          <ComparisonSlider
            originalUrl={originalUrl}
            compressedUrl={compressedUrl}
            aspectRatio={imageDimensions ? imageDimensions.width / imageDimensions.height : undefined}
            className="h-full w-full"
          />
        </div>

        {/* Empty State Overlay / Upload Button */}
        {!originalFile && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-6">
            <ImageUploader
              multiple={false}
              onFilesSelected={(files) => {
                if (files[0]) {
                  // Reuse existing logic manually since event signature differs
                  const file = files[0];
                  setOriginalFile(file);
                  const url = URL.createObjectURL(file);
                  setOriginalUrl(url);

                  const img = new Image();
                  img.onload = () => {
                    setImageDimensions({ width: img.width, height: img.height });
                  };
                  img.src = url;

                  setCompressedBlob(null);
                  setCompressedUrl(null);
                }
              }}
              className="max-w-xl"
            />
          </div>
        )}
      </div>

      {/* Sidebar Controls */}
      <div className="flex flex-col bg-background p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-xl font-bold">{t('settings')}</h3>
          {isCompressing && <span className="animate-pulse text-xs font-medium text-primary">{t('processing')}</span>}
        </div>

        <div className="space-y-8">
          {/* Format Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-muted-foreground/80">{t('outputFormat')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['jpeg', 'png', 'webp', 'avif'] as const).map((f) => (
                <Button
                  key={f}
                  variant={format === f ? "default" : "outline"}
                  className={`w-full justify-start capitalize ${format === f ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => setFormat(f)}
                >
                  {f === 'jpeg' ? 'JPG' : f}
                </Button>
              ))}
            </div>
          </div>

          {/* Quality Slider */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground/80">{t('quality')}</Label>
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-medium">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={(vals) => setQuality(vals[0])}
              min={1}
              max={100}
              step={1}
              className="py-2"
              disabled={!originalFile || format === 'png'}
            />
            <p className="text-xs text-muted-foreground">
              {format === 'png'
                ? t('qualityPng')
                : t('qualityHint')}
            </p>
          </div>

          {/* Stats */}
          {originalFile && compressedBlob && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('original')}:</span>
                <span className="font-mono">{formatFileSize(originalFile.size)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-muted-foreground">{t('compressed')}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{formatFileSize(compressedBlob.size)}</span>
                  <span className={`text-xs ${savings > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({savings > 0 ? '-' : '+'}{Math.abs(savings).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t">
          <Button
            className="w-full h-12 text-base font-semibold"
            disabled={!compressedBlob || isCompressing}
            onClick={handleDownload}
            variant="default"
          >
            <Download className="mr-2 h-5 w-5" />
            {isCompressing ? t('compressing') : t('download')}
          </Button>

          {originalFile && (
            <Button
              variant="ghost"
              className="mt-2 w-full text-muted-foreground"
              onClick={() => {
                setOriginalFile(null);
                setOriginalUrl(null);
                setCompressedBlob(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              {t('startOver')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
