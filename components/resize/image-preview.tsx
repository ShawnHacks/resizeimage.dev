'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Plus, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatFileSize } from '@/lib/utils';
import type { ImageFile } from '@/types/resize';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ShineBorder } from "@/components/ui/shine-border"
import { useTheme } from "next-themes"
// import { BorderBeam } from '@/components/magicui/border-beam';

interface ImagePreviewProps {
  images: ImageFile[];
  onRemove: (index: number) => void;
  onAddMore?: (files: File[]) => void;
}

export function ImagePreview({ images, onRemove, onAddMore }: ImagePreviewProps) {
  const t = useTranslations('BulkResizeTool.imagePreview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useTheme();
  
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="rounded-lg space-y-4 p-4 text-center relative overflow-hidden border bg-background">
        {/* <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B", "#FE8FB5", "#A07CFE"]} /> */}
        {/* <ShineBorder shineColor={theme.theme === "dark" ? "white" : "black"} /> */}

        {/* Left: Clickable images count */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full justify-center cursor-pointer">
              {/* <Images className="w-4 h-4" /> */}
              <span>
                <span className="font-semibold text-3xl text-pink-500">{images.length}</span> {images.length === 1 ? t('selected') : t('selectedPlural')} {t('selectedCount')}
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{t('dialogTitle')}</DialogTitle>
              <DialogDescription className="text-sm text-foreground">
                {t('dialogDescription', { count: images.length })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                <AnimatePresence mode="popLayout">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-[#F5F5F7] border border-[#D2D2D7]">
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
            </div>

            {/* Add more button in dialog */}
            {onAddMore && (
              <div className="pt-4">
                <label className="cursor-pointer">
                  <Button variant="outline" className="w-full" asChild>
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
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Right: Add more button */}
        {onAddMore && (
          <label className="cursor-pointer">
            <Button variant="secondary" size="sm" className="" asChild>
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
    </motion.div>
  );
}
