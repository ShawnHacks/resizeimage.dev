'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ImagePreview } from '@/components/resize/image-preview';
import { ResizeControls, type ResizeOptionsState } from '@/components/resize/resize-controls';
import { ProcessedList } from '@/components/resize/processed-list';
import { DownloadButton } from '@/components/resize/download-button';
import { HeroSection } from '@/components/resize/hero-section';
// import { ToolsGrid } from '@/components/resize/tools-grid';
import { HowToSection } from '@/components/common/how-to-section';
// import { ShowcaseSection } from '@/components/common/showcase-section';
import { FAQSection } from '@/components/common/faq-section';
import { FeatureSection } from '@/components/common/feature-section';
import { batchResizeImages, getImageDimensions, type ProcessedImage } from '@/lib/image-resize-utils';
import type { ImageFile } from '@/types/resize';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, Upload, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from "next/navigation"

export default function ResizeImagePage() {
  const t = useTranslations('ResizeTool');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const searchParams = useSearchParams();
  // Track blob URLs for cleanup
  const blobUrlsRef = useRef<Set<string>>(new Set());
  
  // Track if we're currently loading files to prevent concurrent calls
  const isLoadingRef = useRef(false);

  // Clear images and processed images when URL parameters are cleared
  // This allow click back home 
  useEffect(() => {
    if (searchParams.size === 0) {
      setImages([]);
      setProcessedImages([]);
    }
  }, [searchParams]);

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ResizeImagePage] Component mounted');
    }
    
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ResizeImagePage] Component unmounting, cleaning up', blobUrlsRef.current.size, 'blob URLs');
      }
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
  
  // Debug: Log images state changes (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ResizeImagePage] Images state changed:', images.length, 'images');
    }
  }, [images]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[handleFilesSelected] Called with', files.length, 'files');
    }
    
    if (files.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[handleFilesSelected] No files, returning');
      }
      return;
    }

    // Prevent concurrent calls
    if (isLoadingRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[handleFilesSelected] Already loading files, ignoring duplicate call');
      }
      return;
    }
    
    isLoadingRef.current = true;

    try {
      // Clear previous images and their blob URLs
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          // Ignore cleanup errors
        }
      });
      blobUrlsRef.current.clear();
      
      // Reset state
      setProcessedImages([]);
      
      // Process files with proper error handling
      const imageFiles: ImageFile[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[handleFilesSelected] Processing ${i + 1}/${files.length}:`, file.name);
          }
          
          // Create preview blob URL
          const preview = URL.createObjectURL(file);
          blobUrlsRef.current.add(preview);
          
          // Get dimensions (this will timeout after 10s if image fails to load)
          const dimensions = await getImageDimensions(file);
          
          imageFiles.push({
            file,
            preview,
            dimensions,
            fileSize: file.size,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`${file.name}: ${errorMessage}`);
          
          // Log in development, but don't spam in production
          if (process.env.NODE_ENV === 'development') {
            console.error(`[handleFilesSelected] Failed to process ${file.name}:`, error);
          }
        }
      }

      // Show results
      if (imageFiles.length > 0) {
        setImages(imageFiles);
        toast.success(t('toast.imagesLoaded', { count: imageFiles.length }));
        
        // Show warning if some files failed
        if (errors.length > 0) {
          setTimeout(() => {
            toast.warning(`${errors.length} file(s) failed to load`);
          }, 500);
        }
      } else {
        // All files failed
        toast.error(errors.length > 0 ? `Failed to load images: ${errors[0]}` : t('toast.noValidImages'));
        
        // Log all errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('[handleFilesSelected] All files failed:', errors);
        }
      }
    } catch (error) {
      // Unexpected error in the try block
      console.error('[handleFilesSelected] Unexpected error:', error);
      toast.error(t('toast.error'));
      
      // Clean up any blob URLs that were created before the error
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          // Ignore cleanup errors
        }
      });
      blobUrlsRef.current.clear();
      
      // Ensure images state is cleared on error
      setImages([]);
    } finally {
      isLoadingRef.current = false;
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
      // scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
              {t('pageTitle')}
            </h1>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('pageDescription')}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 mb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Hero section - shown when no images */}
          {images.length === 0 && processedImages.length === 0 && (
            <HeroSection onFilesSelected={handleFilesSelected} />
          )}

         

          {/* Controls section */}
          {images.length > 0 && processedImages.length === 0 && (
            <>
              <ResizeControls onResize={handleResize} disabled={isProcessing}>
                {/* Preview */}
                {images.length > 0 && processedImages.length === 0 && (
                  <ImagePreview 
                    images={images} 
                    onRemove={handleRemoveImage}
                    onAddMore={handleAddMore}
                  />
                )}
              </ResizeControls>
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
              
              {/* Action buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => {
                    // Keep images, only clear processed images to return to edit mode
                    setProcessedImages([]);
                  }}
                  variant="outline"
                  className="px-6 py-2.5 text-primary hover:text-primary/80 font-bold transition-colors"
                >
                  {t('results.backToEdit')}
                </Button>
                <Button
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
                  variant="outline"
                  className="px-6 py-2.5 hover:text-primary/80 font-bold transition-colors"
                >
                  {t('results.resizeMore')}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* <div className='container mx-auto max-w-4xl pb-16'>
        <ToolsGrid />
      </div> */}

      {/* How To Section */}
      <HowToSection
        title={t('howTo.title')}
        // subtitle={t('howTo.subtitle')}
        steps={[
          {
            number: t('howTo.step1.number'),
            title: t('howTo.step1.title'),
            description: t('howTo.step1.description'),
            icon: Upload,
          },
          {
            number: t('howTo.step2.number'),
            title: t('howTo.step2.title'),
            description: t('howTo.step2.description'),
            icon: ImageIcon,
          },
          {
            number: t('howTo.step3.number'),
            title: t('howTo.step3.title'),
            description: t('howTo.step3.description'),
            icon: Download,
          },
        ]}
      />

      <div className="pt-16 md:pt-24">
        <FeatureSection
          title={t('featureSections.feature1.title')}
          description={t.raw('featureSections.feature1.description')}
          image="/illustration/resizeimages.webp"
          imageAlt="Bulk resize images online"
          layout="image-left"
        />

        <FeatureSection
          title={t('featureSections.feature2.title')}
          description={t.raw('featureSections.feature2.description')}
          image="/illustration/resizedimensions.webp"
          imageAlt="Resize images dimensions online"
          layout="image-right"
          // className="bg-muted/30"
        />

        <FeatureSection
          title={t('featureSections.feature3.title')}
          description={t.raw('featureSections.feature3.description')}
          image="/illustration/resizefilesize.webp"
          imageAlt="Resize images file size online"
          layout="image-left"
          // className="bg-muted/30"
        />
      </div>

      {/* FAQ Section */}
      <FAQSection
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        faqs={t.raw('faq.items')}
      />
    </div>
  );
}
