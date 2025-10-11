/**
 * Image Resize Utilities
 * Supports 6 resize modes: Percentage, File Size, Dimensions, Width, Height, Longest Side
 */

import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export type ResizeMode = 
  | 'percentage'
  | 'fileSize'
  | 'dimensions'
  | 'width'
  | 'height'
  | 'longestSide';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export interface ResizeOptions {
  mode: ResizeMode;
  
  // Percentage mode
  percentage?: number; // 10-200
  
  // File Size mode
  targetFileSize?: number; // KB
  format?: ImageFormat;
  quality?: number; // 0-100
  
  // Dimensions mode
  width?: number;
  height?: number;
  lockAspectRatio?: boolean;
  usePadding?: boolean; // Add padding instead of stretching
  backgroundColor?: string; // Background color for padding
  
  // Width/Height/Longest Side mode
  targetValue?: number; // pixels
}

export interface ProcessedImage {
  blob: Blob;
  filename: string;
  originalSize: { width: number; height: number };
  newSize: { width: number; height: number };
  originalFileSize: number;
  newFileSize: number;
}

/**
 * Load image from File
 */
async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate new dimensions based on resize mode
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  options: ResizeOptions
): { width: number; height: number } {
  const { mode } = options;

  switch (mode) {
    case 'percentage': {
      const scale = (options.percentage || 100) / 100;
      return {
        width: Math.round(originalWidth * scale),
        height: Math.round(originalHeight * scale),
      };
    }

    case 'dimensions': {
      const targetWidth = options.width || originalWidth;
      const targetHeight = options.height || originalHeight;
      
      if (options.usePadding && options.width && options.height) {
        // With padding: return target dimensions (canvas size)
        // The actual image will be scaled to fit inside these dimensions
        return {
          width: targetWidth,
          height: targetHeight,
        };
      }
      
      if (options.lockAspectRatio) {
        const aspectRatio = originalWidth / originalHeight;
        
        if (options.width && !options.height) {
          return {
            width: options.width,
            height: Math.round(options.width / aspectRatio),
          };
        } else if (options.height && !options.width) {
          return {
            width: Math.round(options.height * aspectRatio),
            height: options.height,
          };
        } else if (options.width && options.height) {
          // Both specified, maintain ratio based on width
          return {
            width: options.width,
            height: Math.round(options.width / aspectRatio),
          };
        }
      }
      
      return {
        width: targetWidth,
        height: targetHeight,
      };
    }

    case 'width': {
      const aspectRatio = originalWidth / originalHeight;
      const targetWidth = options.targetValue || originalWidth;
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio),
      };
    }

    case 'height': {
      const aspectRatio = originalWidth / originalHeight;
      const targetHeight = options.targetValue || originalHeight;
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight,
      };
    }

    case 'longestSide': {
      const targetSize = options.targetValue || Math.max(originalWidth, originalHeight);
      const aspectRatio = originalWidth / originalHeight;
      
      if (originalWidth > originalHeight) {
        return {
          width: targetSize,
          height: Math.round(targetSize / aspectRatio),
        };
      } else {
        return {
          width: Math.round(targetSize * aspectRatio),
          height: targetSize,
        };
      }
    }

    case 'fileSize': {
      // For file size mode, start with 90% of original dimensions
      // Will be adjusted in resizeToFileSize function
      return {
        width: Math.round(originalWidth * 0.9),
        height: Math.round(originalHeight * 0.9),
      };
    }

    default:
      return { width: originalWidth, height: originalHeight };
  }
}

/**
 * Resize image using Canvas API
 */
function resizeWithCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  usePadding: boolean = false,
  backgroundColor: string = '#FFFFFF'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (usePadding) {
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate scaled dimensions to fit inside target while maintaining aspect ratio
    const imgAspectRatio = img.width / img.height;
    const targetAspectRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspectRatio > targetAspectRatio) {
      // Image is wider than target
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgAspectRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    } else {
      // Image is taller than target
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgAspectRatio;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    }

    // Draw the image centered with padding
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    // Draw the resized image (may stretch/squash)
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  }

  return canvas;
}

/**
 * Convert canvas to blob with specified format and quality
 */
async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  const mimeType = `image/${format}`;
  const qualityValue = quality / 100;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      qualityValue
    );
  });
}

/**
 * Resize image to target file size (iterative approach)
 */
async function resizeToFileSize(
  file: File,
  targetKB: number,
  format: ImageFormat,
  quality: number
): Promise<{ blob: Blob; dimensions: { width: number; height: number } }> {
  const img = await loadImage(file);
  const targetBytes = targetKB * 1024;
  
  let scale = 1.0;
  let currentBlob: Blob;
  let canvas: HTMLCanvasElement;

  // Try with original dimensions first, just adjust quality
  canvas = resizeWithCanvas(img, img.width, img.height);
  currentBlob = await canvasToBlob(canvas, format, quality);

  // If still too large, reduce dimensions
  while (currentBlob.size > targetBytes && scale > 0.1) {
    scale -= 0.1;
    const newWidth = Math.round(img.width * scale);
    const newHeight = Math.round(img.height * scale);
    
    canvas = resizeWithCanvas(img, newWidth, newHeight);
    currentBlob = await canvasToBlob(canvas, format, quality);
  }

  return {
    blob: currentBlob,
    dimensions: { width: canvas.width, height: canvas.height },
  };
}

/**
 * Main resize function
 */
export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<ProcessedImage> {
  const img = await loadImage(file);
  const originalSize = { width: img.width, height: img.height };

  let blob: Blob;
  let newSize: { width: number; height: number };

  // Special handling for file size mode
  if (options.mode === 'fileSize') {
    const result = await resizeToFileSize(
      file,
      options.targetFileSize || 100,
      options.format || 'jpeg',
      options.quality || 85
    );
    blob = result.blob;
    newSize = result.dimensions;
  } else {
    // Calculate target dimensions
    const dimensions = calculateDimensions(img.width, img.height, options);
    newSize = dimensions;

    // Resize image
    const usePadding = options.mode === 'dimensions' && options.usePadding === true;
    const backgroundColor = options.backgroundColor || '#FFFFFF';
    const canvas = resizeWithCanvas(
      img, 
      dimensions.width, 
      dimensions.height,
      usePadding,
      backgroundColor
    );

    // Convert to blob
    const format = options.format || 'jpeg';
    const quality = options.quality || 85;
    blob = await canvasToBlob(canvas, format, quality);
  }

  // Generate filename
  const filenameParts = file.name.split('.');
  const extension = options.format || filenameParts[filenameParts.length - 1];
  const basename = filenameParts.slice(0, -1).join('.');
  const filename = `${basename}_resized.${extension}`;

  // Clean up
  URL.revokeObjectURL(img.src);

  return {
    blob,
    filename,
    originalSize,
    newSize,
    originalFileSize: file.size,
    newFileSize: blob.size,
  };
}

/**
 * Batch resize images
 */
export async function batchResizeImages(
  files: File[],
  options: ResizeOptions,
  onProgress?: (current: number, total: number) => void
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await resizeImage(files[i], options);
      results.push(result);
      onProgress?.(i + 1, files.length);
    } catch (error) {
      console.error(`Failed to resize ${files[i].name}:`, error);
      // Continue with other images
    }
  }

  return results;
}

/**
 * Download single image
 */
export function downloadImage(processedImage: ProcessedImage): void {
  saveAs(processedImage.blob, processedImage.filename);
}

/**
 * Download multiple images as ZIP
 */
export async function downloadImagesAsZip(
  processedImages: ProcessedImage[],
  zipFilename: string = 'resized-images.zip'
): Promise<void> {
  const zip = new JSZip();

  processedImages.forEach((img) => {
    zip.file(img.filename, img.blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipFilename);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Get image dimensions from file
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  const dimensions = { width: img.width, height: img.height };
  URL.revokeObjectURL(img.src);
  return dimensions;
}
