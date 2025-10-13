'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ImagePreview } from '@/components/resize/image-preview';
import { ResizeControls, type ResizeOptionsState } from '@/components/resize/resize-controls';
import { ProcessedList } from '@/components/resize/processed-list';
import { DownloadButton } from '@/components/resize/download-button';
import { HeroSection } from '@/components/resize/hero-section';
import { ToolsGrid } from '@/components/resize/tools-grid';
import { batchResizeImages, getImageDimensions, type ProcessedImage } from '@/lib/image-resize-utils';
import type { ImageFile } from '@/types/resize';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResizeImagePage() {
  const t = useTranslations('ResizeTool');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // Track blob URLs for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set());
  
  // Track if we're currently loading files to prevent concurrent calls
  const isLoadingRef = useRef(false);

  // Cleanup all blob URLs on unmount or when images change
  useEffect(() => {
    console.log('[ResizeImagePage] Component mounted');
    
    return () => {
      console.log('[ResizeImagePage] Component unmounting, cleaning up', blobUrlsRef.current.size, 'blob URLs');
      // Cleanup all tracked blob URLs when component unmounts
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          // Ignore errors during cleanup
        }
      });
      blobUrlsRef.current.clear();
    };
  }, []);
  
  // Debug: Log images state changes
  useEffect(() => {
    console.log('[ResizeImagePage] Images state changed:', images.length, 'images');
  }, [images]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    console.log('[handleFilesSelected] Called with', files.length, 'files');
    
    if (files.length === 0) {
      console.log('[handleFilesSelected] No files, returning');
      return;
    }

    // Prevent concurrent calls
    if (isLoadingRef.current) {
      console.warn('[handleFilesSelected] Already loading files, ignoring duplicate call');
      return;
    }
    
    isLoadingRef.current = true;
    console.log('[handleFilesSelected] Set loading flag to true');

    try {
      // Clear previous images and their blob URLs
      console.log('[handleFilesSelected] Cleaning up', blobUrlsRef.current.size, 'previous blob URLs');
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('[handleFilesSelected] Error revoking URL:', err);
        }
      });
      blobUrlsRef.current.clear();
      
      // Reset state
      console.log('[handleFilesSelected] Resetting processed images');
      setProcessedImages([]);
      
      console.log('[handleFilesSelected] Starting to process files...');
      const imageFiles: ImageFile[] = await Promise.all(
        files.map(async (file, index) => {
          console.log(`[handleFilesSelected] Processing file ${index + 1}/${files.length}:`, file.name);
          
          const preview = URL.createObjectURL(file);
          console.log(`[handleFilesSelected] Created blob URL for ${file.name}:`, preview);
          
          // Track the blob URL for cleanup
          blobUrlsRef.current.add(preview);
          
          const dimensions = await getImageDimensions(file);
          console.log(`[handleFilesSelected] Got dimensions for ${file.name}:`, dimensions);
          
          return {
            file,
            preview,
            dimensions,
            fileSize: file.size,
          };
        })
      );

      console.log('[handleFilesSelected] All files processed:', imageFiles.length);
      
      if (imageFiles.length > 0) {
        console.log('[handleFilesSelected] Setting images state with', imageFiles.length, 'images');
        setImages(imageFiles);
        
        // Use setTimeout to ensure state update completes
        setTimeout(() => {
          console.log('[handleFilesSelected] Toast success');
          toast.success(t('toast.imagesLoaded', { count: files.length }));
        }, 0);
      } else {
        console.warn('[handleFilesSelected] No valid images after processing');
        toast.error(t('toast.noValidImages'));
      }
    } catch (error) {
      console.error('[handleFilesSelected] Error processing images:', error);
      toast.error(t('toast.error'));
      
      // Clean up any blob URLs that were created before the error
      console.log('[handleFilesSelected] Cleaning up after error');
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          // Ignore errors
        }
      });
      blobUrlsRef.current.clear();
      
      // Ensure images state is cleared on error
      setImages([]);
    } finally {
      isLoadingRef.current = false;
      console.log('[handleFilesSelected] Set loading flag to false');
    }
  }, [t]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const removedUrl = newImages[index].preview;
      
      // Clean up the blob URL
      try {
        URL.revokeObjectURL(removedUrl);
        blobUrlsRef.current.delete(removedUrl);
      } catch (err) {
        // Ignore errors
      }
      
      newImages.splice(index, 1);
      return newImages;
    });
    
    if (images.length === 1) {
      setProcessedImages([]);
    }
  }, [images.length]);

  const handleAddMore = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) {
      return;
    }

    try {
      const imageFiles: ImageFile[] = await Promise.all(
        newFiles.map(async (file) => {
          const preview = URL.createObjectURL(file);
          // Track the blob URL for cleanup
          blobUrlsRef.current.add(preview);
          
          const dimensions = await getImageDimensions(file);
          
          return {
            file,
            preview,
            dimensions,
            fileSize: file.size,
          };
        })
      );

      if (imageFiles.length > 0) {
        setImages((prev) => [...prev, ...imageFiles]);
        toast.success(t('toast.imagesAdded', { count: newFiles.length }));
      }
    } catch (error) {
      console.error('Failed to add images:', error);
      toast.error(t('toast.error'));
    }
  }, [t]);

  const handleResize = useCallback(async (options: ResizeOptionsState) => {
    if (images.length === 0) {
      toast.error(t('toast.selectImagesFirst'));
      return;
    }

    // Validate options
    if (options.mode === 'dimensions') {
      if (!options.width && !options.height) {
        toast.error(t('toast.enterWidthOrHeight'));
        return;
      }
    } else if (options.mode === 'width' || options.mode === 'height' || options.mode === 'longestSide') {
      if (!options.targetValue) {
        toast.error(t('toast.enterTargetValue'));
        return;
      }
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: images.length });

    try {
      const results = await batchResizeImages(
        images.map(img => img.file),
        options,
        (current, total) => {
          setProgress({ current, total });
        }
      );

      setProcessedImages(results);
      toast.success(t('toast.imagesResizedSuccess'));
    } catch (error) {
      console.error('Resize failed:', error);
      toast.error(t('toast.error'));
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [images]);

  const handleDownloadComplete = useCallback(() => {
    toast.success(t('toast.downloadComplete'));
  }, [t]);

  const handleBack = useCallback(() => {
    // Clean up all blob URLs
    blobUrlsRef.current.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (err) {
        // Ignore errors
      }
    });
    blobUrlsRef.current.clear();
    
    setImages([]);
    setProcessedImages([]);
  }, []);

  return (
    <div className="min-h-[calc(100vh-rem)]">
      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              {t('pageTitle')}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('pageDescription')}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero section - shown when no images */}
          {images.length === 0 && processedImages.length === 0 && (
            <>
              <HeroSection onFilesSelected={handleFilesSelected} />
              <ToolsGrid />
            </>
          )}

          {/* Preview section */}
          {images.length > 0 && processedImages.length === 0 && (
            <ImagePreview 
              images={images} 
              onRemove={handleRemoveImage}
              onAddMore={handleAddMore}
            />
          )}

          {/* Controls section */}
          {images.length > 0 && processedImages.length === 0 && (
            <>
              <ResizeControls onResize={handleResize} disabled={isProcessing} />
              <div className="flex justify-start">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('backButton')}
                </Button>
              </div>
            </>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl border border-border p-8 shadow-sm"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('processing.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('processing.progress', { current: progress.current, total: progress.total })}
                </p>
                <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results section */}
          {processedImages.length > 0 && (
            <>
              {/* Processed list with statistics */}
              <ProcessedList processedImages={processedImages} />
              
              {/* Download section */}
              <DownloadButton 
                processedImages={processedImages} 
                onDownloadComplete={handleDownloadComplete}
              />
              
              {/* Reset button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    // Clean up all blob URLs
                    blobUrlsRef.current.forEach(url => {
                      try {
                        URL.revokeObjectURL(url);
                      } catch (err) {
                        // Ignore errors
                      }
                    });
                    blobUrlsRef.current.clear();
                    
                    setImages([]);
                    setProcessedImages([]);
                  }}
                  className="px-6 py-2.5 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Resize More Images
                </button>
              </div>
            </>
          )}
        </div>
      </main>

    </div>
  );
}
