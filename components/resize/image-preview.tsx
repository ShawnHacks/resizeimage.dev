'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatFileSize } from '@/lib/image-resize-utils';
import type { ImageFile } from '@/types/resize';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  images: ImageFile[];
  onRemove: (index: number) => void;
  onAddMore?: (files: File[]) => void;
}

export function ImagePreview({ images, onRemove, onAddMore }: ImagePreviewProps) {
  const t = useTranslations('ResizeTool.imagePreview');
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (images.length === 0) return null;

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = Array.from(e.target.files || []);
    
    // Reset input to allow selecting the same files again
    e.target.value = '';
    
    if (files.length > 0 && onAddMore) {
      onAddMore(files);
    }
  };

  // Calculate how many images to show in one row (based on grid cols)
  const imagesPerRow = 5; // lg:grid-cols-5
  const shouldShowExpandButton = images.length > imagesPerRow;
  const displayedImages = isExpanded ? images : images.slice(0, imagesPerRow);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {images.length} {images.length === 1 ? t('selected') : t('selectedPlural')} {t('selectedCount')}
        </h3>
        
        {onAddMore && (
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" className='text-primary hover:bg-primary/5' asChild>
              <span className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('addMore')}
              </span>
            </Button>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <AnimatePresence mode="popLayout">
          {displayedImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
            <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#D2D2D7]">
              <img
                src={image.preview}
                alt={image.file.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[#D70015]"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image info */}
            <div className="mt-2 space-y-0.5">
              <p className="text-xs font-medium text-foreground truncate">
                {image.file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {image.dimensions.width} × {image.dimensions.height}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(image.fileSize)}
              </p>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse button */}
      {shouldShowExpandButton && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>{t('showLess')}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>{t('showAll', { count: images.length - imagesPerRow })}</span>
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
