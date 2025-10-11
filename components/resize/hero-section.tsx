'use client';

import { Upload, Zap, Infinity, ThumbsUp, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface HeroSectionProps {
  onFilesSelected: (files: File[]) => void;
}

export function HeroSection({ onFilesSelected }: HeroSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const features = [
    { icon: Zap, text: 'Lightning-fast processing', color: 'text-orange-500' },
    { icon: CheckCircle, text: '100% free forever', color: 'text-green-500' },
    { icon: Shield, text: 'Secure & private', color: 'text-blue-500' },
    { icon: ThumbsUp, text: 'No sign-up required', color: 'text-purple-500' },
    { icon: Infinity, text: 'Process unlimited images', color: 'text-indigo-500' },
    { icon: Upload, text: 'Works in your browser', color: 'text-gray-600' },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Left: Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-4 border-dashed rounded-2xl p-12 shadow-2xl
          flex flex-col items-center justify-center
          min-h-[320px] transition-all
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-primary/30 bg-card hover:border-primary/50'
          }
        `}
      >
        <Upload className="w-16 h-16 text-primary mb-6" />
        
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Drag & Drop Your Images
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          or click below to browse
        </p>
        
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="px-8 py-3 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/80 transition-colors shadow-lg">
            Select Images
          </div>
        </label>
        
        <p className="text-xs text-muted-foreground mt-4">
          Support: JPG, PNG, WebP, GIF
        </p>
      </div>

      {/* Right: Features */}
      <div className="bg-muted/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-3 text-center leading-tight">
          Batch Resize Images<br />Online & Free
        </h2>
        
        <p className="text-sm text-muted-foreground mb-8 text-center">
          Resize multiple images at once without uploading to any server
        </p>
        
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${feature.color} flex-shrink-0`} />
                <span className="text-base text-foreground">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
