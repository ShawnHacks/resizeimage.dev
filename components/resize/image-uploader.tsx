'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function ImageUploader({ 
  onFilesSelected, 
  maxFiles = 50,
  maxSizeMB = 50 
}: ImageUploaderProps) {
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

    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit and will be skipped`);
      const validFiles = files.filter(file => file.size <= maxSizeMB * 1024 * 1024);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      return;
    }

    onFilesSelected(files);
  }, [onFilesSelected, maxFiles, maxSizeMB]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit and will be skipped`);
      const validFiles = files.filter(file => file.size <= maxSizeMB * 1024 * 1024);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      return;
    }

    onFilesSelected(files);
    
    // Reset input
    e.target.value = '';
  }, [onFilesSelected, maxFiles, maxSizeMB]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-200
          ${isDragging 
            ? 'border-[#007AFF] bg-[#007AFF]/5 scale-[1.02]' 
            : 'border-[#D2D2D7] bg-white hover:border-[#007AFF]/50'
          }
        `}
      >
        <label className="flex flex-col items-center justify-center px-6 py-16 cursor-pointer">
          <AnimatePresence mode="wait">
            {isDragging ? (
              <motion.div
                key="dragging"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#007AFF]/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-[#007AFF]" />
                </div>
                <p className="text-lg font-medium text-[#007AFF]">
                  Drop your images here
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-[#86868B]" />
                </div>
                <p className="text-lg font-medium text-[#1D1D1F] mb-2">
                  Drag & drop images here
                </p>
                <p className="text-sm text-[#86868B] mb-4">
                  or click to browse
                </p>
                <div className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#007AFF] text-white text-sm font-medium hover:bg-[#0051D5] transition-colors">
                  Select Images
                </div>
                <p className="text-xs text-[#86868B] mt-4">
                  Supports JPG, PNG, WebP • Max {maxSizeMB}MB per file • Up to {maxFiles} files
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>
    </motion.div>
  );
}
