'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({ 
  multiple = true,
  onFilesSelected, 
  maxFiles = 50,
  maxSizeMB = 50,
  className 
}: ImageUploaderProps) {
  const t = useTranslations('ImageUploader');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.error(t('errorInvalidFiles'), {
        description: t('supportedFormats'),
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    if (files.length > maxFiles) {
      toast.error(t('errorTooManyFiles'), {
        description: t('maxFiles').replace('{max}', maxFiles.toString()),
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      const validFiles = files.filter(file => file.size <= maxSizeMB * 1024 * 1024);
      toast.warning(t('errorFileSizeExceeded'), {
        description: t('maxSizeMB').replace('{size}', maxSizeMB.toString()),
        icon: <AlertCircle className="h-4 w-4" />,
      });
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      return;
    }

    toast.success(t('filesSelected'), {
      description: `${files.length} ${files.length === 1 ? t('file') : t('files')}`
    });
    onFilesSelected(files);
  }, [onFilesSelected, maxFiles, maxSizeMB]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (files.length > maxFiles) {
      toast.error(t('errorTooManyFiles'), {
        description: t('maxFiles').replace('{max}', maxFiles.toString()),
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      const validFiles = files.filter(file => file.size <= maxSizeMB * 1024 * 1024);
      toast.warning(t('errorFileSizeExceeded'), {
        description: t('maxSizeMB').replace('{size}', maxSizeMB.toString()),
        icon: <AlertCircle className="h-4 w-4" />,
      });
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      return;
    }

    toast.success(t('filesSelected'), {
      description: `${files.length} ${files.length === 1 ? t('file') : t('files')}`
    });
    onFilesSelected(files);
    
    // Reset input
    e.target.value = '';
  }, [onFilesSelected, maxFiles, maxSizeMB, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
    >
      <div className='md:p-6 rounded-2xl bg-background md:rounded-4xl shadow-xl dark:shadow-purple-700 hover:bg-muted transition-all duration-200'>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          // // border-6 border-dashed border-muted-foreground/80
          className={`
            relative p-4 md:p-0 border-4 border-dashed md:border-0 rounded-2xl transition-all duration-200 md:bg-[url('/svgs/dash-rectangle.svg')] bg-no-repeat bg-size-[100%_100%]
            ${isDragging 
              ? 'border-primary bg-primary/10 scale-[1.02]' 
              : 'border-primary/30 bg-card hover:border-primary/50 dark:border-primary/50 dark:bg-card/50'
            }
          `}
        >
          <label className="flex flex-col items-center justify-center md:p-6 cursor-pointer">
            <AnimatePresence mode="wait">
              <motion.div
                key="idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] dark:from-[#1D1D1F] dark:to-[#1D1D1F] flex items-center justify-center mb-6 shadow-sm">
                  <ImageIcon className="w-6 h-6 text-[#86868B] dark:text-[#86868B]" />
                </div>
                <h3 className="text-xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  {multiple ? t('titleMultiple') : t('titleSingle')}
                </h3>
                <p className="text-sm md:text-xl text-primary font-heading font-bold mb-6">
                  {t('subtitleSingle')}
                </p>
                <div className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-br from-primary to-[#5c5ce0] text-white text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                  {multiple ? t('selectImagesMultiple') : t('selectImagesSingle')}
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <p className="text-sm text-foreground">
                    {t('supportedFormats')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('maxSizeMB', {size: maxSizeMB})} 
                    {multiple && ` • ${t('maxFiles', {max: maxFiles})}`}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <input
              type="file"
              multiple={multiple}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </motion.div>
  );
}
