'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { ProcessedImage } from '@/lib/image-resize-utils';

interface ProcessedListProps {
  processedImages: ProcessedImage[];
}

export function ProcessedList({ processedImages }: ProcessedListProps) {
  const t = useTranslations('BulkResizeTool.results');
  if (processedImages.length === 0) return null;

  // Calculate totals
  const totalOriginalSize = processedImages.reduce((sum, img) => sum + img.originalFileSize, 0);
  const totalNewSize = processedImages.reduce((sum, img) => sum + img.newFileSize, 0);
  const totalSaved = totalOriginalSize - totalNewSize;
  const savedPercentage = ((totalSaved / totalOriginalSize) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
    >
      {/* Header with totals */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b border-border p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t('title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('imagesResized', { count: processedImages.length })}
            </p>
          </div>
        </div>

        {/* Total size comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card rounded-xl p-2 sm:p-4 border border-border">
            <p className="text-[11px] sm:text-xs text-muted-foreground/80 mb-2 font-medium uppercase tracking-wide">{t('originalSize')}</p>
            <p className="text-base sm:text-xl font-bold text-foreground">
              {formatBytes(totalOriginalSize)}
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-2 sm:p-4 border border-border">
            <p className="text-[11px] sm:text-xs text-muted-foreground/80 mb-2 font-medium uppercase tracking-wide">{t('newSize')}</p>
            <p className="text-base sm:text-xl font-bold text-primary">
              {formatBytes(totalNewSize)}
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-2 sm:p-4 border border-border">
            <p className="text-[11px] sm:text-xs text-muted-foreground/80 mb-2 font-medium uppercase tracking-wide">{t('spaceSaved')}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-base sm:text-xl font-bold text-green-600">
                {totalSaved > 0 ? formatBytes(totalSaved) : '0 B'}
              </p>
              {totalSaved > 0 && (
                <span className="text-sm sm:text-base font-semibold text-green-600/70">
                  ({savedPercentage}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image list */}
      <div className="p-4 sm:p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">{t('processedImages')}</h4>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {processedImages.map((img, index) => {
            const saved = img.originalFileSize - img.newFileSize;
            const percentage = ((saved / img.originalFileSize) * 100).toFixed(1);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col md:flex-row md:justify-between gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {/* Left: Number + Filename + Dimensions */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate mb-0.5">
                      {img.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {img.originalSize.width} × {img.originalSize.height} → {img.newSize.width} × {img.newSize.height}
                    </p>
                  </div>
                </div>

                {/* Right: Size info */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 pl-11 md:pl-0">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs whitespace-nowrap">{formatBytes(img.originalFileSize)}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-primary text-xs whitespace-nowrap">{formatBytes(img.newFileSize)}</span>
                  </div>
                  
                  {saved !== 0 && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                      saved > 0 
                        ? 'bg-green-500/10' 
                        : 'bg-red-500/10'
                    }`}>
                      <span className={`text-xs font-semibold whitespace-nowrap ${
                        saved > 0 
                          ? 'text-green-600 dark:text-green-500' 
                          : 'text-red-600 dark:text-red-500'
                      }`}>
                        {saved > 0 ? `-${formatBytes(saved)}` : `+${formatBytes(Math.abs(saved))}`}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {Math.abs(parseFloat(percentage))}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
