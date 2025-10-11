'use client';

import { useState, useCallback } from 'react';
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
import { Loader2 } from 'lucide-react';

export default function ResizeImagePage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setProcessedImages([]); // Clear previous results
    
    const imageFiles: ImageFile[] = await Promise.all(
      files.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const dimensions = await getImageDimensions(file);
        
        return {
          file,
          preview,
          dimensions,
          fileSize: file.size,
        };
      })
    );

    setImages(imageFiles);
    toast.success(`${files.length} image${files.length > 1 ? 's' : ''} loaded`);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    
    if (images.length === 1) {
      setProcessedImages([]);
    }
  }, [images.length]);

  const handleAddMore = useCallback(async (newFiles: File[]) => {
    const imageFiles: ImageFile[] = await Promise.all(
      newFiles.map(async (file) => {
        const preview = URL.createObjectURL(file);
        const dimensions = await getImageDimensions(file);
        
        return {
          file,
          preview,
          dimensions,
          fileSize: file.size,
        };
      })
    );

    setImages((prev) => [...prev, ...imageFiles]);
    toast.success(`Added ${newFiles.length} more image${newFiles.length > 1 ? 's' : ''}`);
  }, []);

  const handleResize = useCallback(async (options: ResizeOptionsState) => {
    if (images.length === 0) {
      toast.error('Please select images first');
      return;
    }

    // Validate options
    if (options.mode === 'dimensions') {
      if (!options.width && !options.height) {
        toast.error('Please enter width or height');
        return;
      }
    } else if (options.mode === 'width' || options.mode === 'height' || options.mode === 'longestSide') {
      if (!options.targetValue) {
        toast.error('Please enter a target value');
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
      toast.success('Images resized successfully!');
    } catch (error) {
      console.error('Resize failed:', error);
      toast.error('Failed to resize images. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [images]);

  const handleDownloadComplete = useCallback(() => {
    toast.success('Download completed!');
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Bulk Resize Images Online
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Free online tool to batch resize multiple images at once. Fast, secure, and works entirely in your browser — no upload needed.
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
            <ResizeControls onResize={handleResize} disabled={isProcessing} />
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
                  Processing Images...
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {progress.current} of {progress.total} images processed
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
                    setImages([]);
                    setProcessedImages([]);
                    images.forEach(img => URL.revokeObjectURL(img.preview));
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
