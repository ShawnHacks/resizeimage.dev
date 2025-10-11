'use client';

import { Download, FileArchive, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { downloadImage, downloadImagesAsZip, type ProcessedImage } from '@/lib/image-resize-utils';
import { useState } from 'react';

interface DownloadButtonProps {
  processedImages: ProcessedImage[];
  onDownloadComplete?: () => void;
}

export function DownloadButton({ processedImages, onDownloadComplete }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (processedImages.length === 0) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      if (processedImages.length === 1) {
        // Single image download
        downloadImage(processedImages[0]);
      } else {
        // Multiple images - download as ZIP
        await downloadImagesAsZip(processedImages);
      }
      
      onDownloadComplete?.();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download images. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const isSingle = processedImages.length === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#34C759] text-white text-lg font-semibold rounded-xl hover:bg-[#28A745] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            {isSingle ? (
              <Download className="w-6 h-6" />
            ) : (
              <FileArchive className="w-6 h-6" />
            )}
            <span>
              {isSingle ? 'Download Image' : `Download All ${processedImages.length} Images as ZIP`}
            </span>
          </>
        )}
      </button>
    </motion.div>
  );
}

function formatTotalSize(images: ProcessedImage[], type: 'original' | 'new' = 'new'): string {
  const totalBytes = images.reduce((sum, img) => {
    return sum + (type === 'original' ? img.originalFileSize : img.newFileSize);
  }, 0);

  if (totalBytes < 1024) {
    return `${totalBytes} B`;
  } else if (totalBytes < 1024 * 1024) {
    return `${(totalBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

function calculateSpaceSaved(images: ProcessedImage[]): string {
  const originalTotal = images.reduce((sum, img) => sum + img.originalFileSize, 0);
  const newTotal = images.reduce((sum, img) => sum + img.newFileSize, 0);
  const saved = originalTotal - newTotal;
  const percentage = ((saved / originalTotal) * 100).toFixed(0);

  if (saved > 0) {
    return `${formatBytes(saved)} (${percentage}%)`;
  } else {
    return '0 B';
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
