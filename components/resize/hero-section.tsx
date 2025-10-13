'use client';

import { Upload, Zap, Infinity, ThumbsUp, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
  onFilesSelected: (files: File[]) => void;
}

export function HeroSection({ onFilesSelected }: HeroSectionProps) {
  const t = useTranslations('ResizeTool');
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
    e.preventDefault();
    const files = Array.from(e.target.files || []);
    
    // Reset input value to allow selecting the same files again
    e.target.value = '';
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const features = [
    { icon: Zap, text: t('features.lightningFast'), color: 'text-orange-500' },
    { icon: CheckCircle, text: t('features.free'), color: 'text-green-500' },
    { icon: Shield, text: t('features.secure'), color: 'text-blue-500' },
    { icon: ThumbsUp, text: t('features.noSignup'), color: 'text-purple-500' },
    { icon: Infinity, text: t('features.unlimited'), color: 'text-indigo-500' },
    { icon: Upload, text: t('features.browser'), color: 'text-gray-600' },
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
        
        <div className="text-2xl font-bold text-foreground mb-2">
          {t('hero.title')}
        </div>
        
        <div className="text-sm text-muted-foreground mb-6">
          {t('hero.subtitle')}
        </div>
        
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="px-8 py-3 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/80 transition-colors shadow-lg">
            {t('hero.selectImages')}
          </div>
        </label>
        
        <div className="text-xs text-muted-foreground mt-4">
          {t('hero.supportedFormats')}
        </div>
      </div>

      {/* Right: Features */}
      <div className="bg-muted/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-3 text-center leading-tight">
          {t('features.title')}
        </h2>
        
        <p className="text-sm text-muted-foreground mb-8 text-center">
          {t('features.description')}
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
