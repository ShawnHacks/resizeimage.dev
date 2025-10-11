'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { ProcessedImage } from '@/lib/image-resize-utils';

interface ProcessedListProps {
  processedImages: ProcessedImage[];
}

export function ProcessedList({ processedImages }: ProcessedListProps) {
  const t = useTranslations('ResizeTool.results');
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
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b border-border p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t('title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('imagesResized', { count: processedImages.length })}
            </p>
          </div>
        </div>

        {/* Total size comparison */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('originalSize')}</p>
            <p className="text-lg font-semibold text-foreground">
              {formatBytes(totalOriginalSize)}
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('newSize')}</p>
            <p className="text-lg font-semibold text-primary">
              {formatBytes(totalNewSize)}
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('spaceSaved')}</p>
            <p className="text-lg font-semibold text-green-600">
              {totalSaved > 0 ? `${formatBytes(totalSaved)} (${savedPercentage}%)` : '0 B'}
            </p>
          </div>
        </div>
      </div>

      {/* Image list */}
      <div className="p-6">
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
                className="flex items-center gap-4 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {/* File number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>

                {/* File name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {img.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {img.originalSize.width} × {img.originalSize.height} → {img.newSize.width} × {img.newSize.height}
                  </p>
                </div>

                {/* Size comparison */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{formatBytes(img.originalFileSize)}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-primary">{formatBytes(img.newFileSize)}</span>
                </div>

                {/* Saved */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-green-600">
                    {saved > 0 ? `-${formatBytes(saved)}` : '0 B'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {saved > 0 ? `${percentage}%` : '0%'}
                  </p>
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
