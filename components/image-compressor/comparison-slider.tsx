
"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { useTranslations } from "next-intl";

interface ComparisonSliderProps {
  originalUrl: string | null;
  compressedUrl: string | null;
  className?: string;
  aspectRatio?: number;
}

export function ComparisonSlider({ originalUrl, compressedUrl, className, aspectRatio }: ComparisonSliderProps) {
  const t = useTranslations('ImageCompressor');

  if (!originalUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-muted bg-muted/20 text-muted-foreground p-12 text-center rounded-xl">
        <div className="space-y-4">
          <p className="text-lg font-medium">{t('dropImage')}</p>
          <p className="text-sm">{t('supports')}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-background mx-auto ${className}`}
      style={aspectRatio ? {
        aspectRatio: `${aspectRatio}`,
        maxHeight: '100%',
        maxWidth: '100%',
        height: 'auto',
        width: 'auto'
      } : { height: '100%', width: '100%' }}
    >
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={originalUrl} alt={t('original')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
        itemTwo={
          compressedUrl ? (
            <ReactCompareSliderImage src={compressedUrl} alt={t('compressed')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-background/50 backdrop-blur-sm">
              <span className="animate-pulse">{t('compressing')}</span>
            </div>
          )
        }
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      />

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-10 rounded-md bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
        {t('original')}
      </div>
      <div className="absolute bottom-4 right-4 z-10 rounded-md bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
        {t('compressed')}
      </div>
    </div>
  );
}
