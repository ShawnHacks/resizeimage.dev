'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';
import {
  convertImage,
  deriveConvertedFilename,
  type ConvertibleFormat,
  type OutputConvertibleFormat,
} from '@/lib/image-convert-utils';
import {
  ConversionLinks,
  type ConversionLinkItem,
} from '@/components/image-converter/conversion-links';

interface ConverterWorkspaceProps {
  file: File;
  originalUrl: string;
  fromFormat: ConvertibleFormat;
  toFormat: OutputConvertibleFormat;
  onReset: () => void;
  otherConversions?: ConversionLinkItem[];
}

interface ConvertedState {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export function ConverterWorkspace({
  file,
  originalUrl,
  fromFormat,
  toFormat,
  onReset,
  otherConversions = [],
}: ConverterWorkspaceProps) {
  const t = useTranslations('ImageConverterTool');
  const formatLabel = useCallback(
    (format: ConvertibleFormat) => t(`formats.${format}`),
    [t]
  );

  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState<ConvertedState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const convertedUrlRef = useRef<string | null>(null);
  const downloadName = useMemo(
    () => deriveConvertedFilename(file.name, toFormat),
    [file.name, toFormat]
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsConverting(true);
      setError(null);
      setConverted(null);

      try {
        const result = await convertImage(file, toFormat);
        if (cancelled) {
          return;
        }

        if (convertedUrlRef.current) {
          try {
            URL.revokeObjectURL(convertedUrlRef.current);
          } catch {
            // No-op
          }
        }

        const blobUrl = URL.createObjectURL(result.blob);
        convertedUrlRef.current = blobUrl;
        setConverted({
          blob: result.blob,
          url: blobUrl,
          width: result.width,
          height: result.height,
        });
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Unknown error');
        toast.error(
          err instanceof Error ? err.message : t('workspace.error.generic')
        );
      } finally {
        if (!cancelled) {
          setIsConverting(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [file, t, toFormat]);

  useEffect(() => {
    return () => {
      if (convertedUrlRef.current) {
        try {
          URL.revokeObjectURL(convertedUrlRef.current);
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const convertedSizeLabel = useMemo(() => {
    if (!converted) return '--';
    return formatFileSize(converted.blob.size);
  }, [converted]);

  const originalSizeLabel = useMemo(() => formatFileSize(file.size), [file.size]);
  const originalFormatLabel = useMemo(() => {
    if (file.type.startsWith('image/')) {
      return file.type.slice(6).toUpperCase();
    }
    return 'Unknown';
  }, [file.type]);

  const handleDownload = useCallback(() => {
    if (!converted) return;

    const link = document.createElement('a');
    link.href = converted.url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [converted, downloadName]);

  const previewAlt = useMemo(
    () =>
      t('workspace.previewAlt', {
        from: formatLabel(fromFormat),
        to: formatLabel(toFormat),
      }),
    [formatLabel, fromFormat, t, toFormat]
  );

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/40 p-4 md:p-6">
            <div className="flex flex-col gap-3 pb-4 text-sm md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 text-foreground">
                <div className="flex items-center justify-between gap-6">
                  <span>
                    {t('workspace.info.original', {
                      format: originalFormatLabel,
                    })}
                  </span>
                  <span>{originalSizeLabel}</span>
                </div>
              </div>
              <Button variant="outline" onClick={onReset}>
                {t('workspace.reset')}
              </Button>
            </div>
            <div className="relative flex min-h-[300px] max-h-[480px] items-center justify-center">
              {isConverting && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/80 backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <div className="text-center text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {t('workspace.processing.title', {
                        from: formatLabel(fromFormat),
                        to: formatLabel(toFormat),
                      })}
                    </p>
                    <p>{t('workspace.processing.description')}</p>
                  </div>
                </div>
              )}

              {!isConverting && error && (
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <RotateCcw className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {t('workspace.error.title')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('workspace.error.description')}
                    </p>
                  </div>
                  <Button variant="outline" onClick={onReset}>
                    {t('workspace.error.cta')}
                  </Button>
                </div>
              )}

              {!error && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={converted?.url || originalUrl}
                  alt={previewAlt}
                  className="max-h-[480px] w-full rounded-2xl object-contain"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
            <div className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-primary">
                {t('workspace.badge', {
                  from: formatLabel(fromFormat),
                  to: formatLabel(toFormat),
                })}
              </h2>
              {converted && (
                <p className="text-sm text-foreground">
                  {t('workspace.info.dimensions', {
                    width: converted.width,
                    height: converted.height,
                  })}
                </p>
              )}
              <p className="text-sm text-foreground">
                {t('workspace.subtitle', {
                  size: converted ? convertedSizeLabel : t('workspace.sizePending'),
                })}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <Button
                onClick={handleDownload}
                disabled={isConverting || !converted}
                className="w-full h-12 justify-center text-base font-semibold"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('workspace.download.pending')}
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    {t('workspace.download.ready', {
                      to: formatLabel(toFormat),
                    })}
                  </>
                )}
              </Button>
            </div>

            {/* {otherConversions.length > 0 && (
              <div className="border-border/60 pt-8">
                <div className="mb-3 space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {t('moreOptions.title')}
                  </p>
                </div>
                <ConversionLinks items={otherConversions} className="mt-2" />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
