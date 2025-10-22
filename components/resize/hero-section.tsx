'use client';

import { Zap, Infinity, ThumbsUp, Shield, CheckCircle, Upload, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ImageUploader } from '@/components/image-uploader';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onFilesSelected: (files: File[]) => void;
}

export function HeroSection({ onFilesSelected }: HeroSectionProps) {
  const t = useTranslations('ResizeTool');

  const features = [
    { icon: CheckCircle, text: t('features.free'), color: 'text-white' },
    { icon: Zap, text: t('features.lightningFast'), color: 'text-white' },
    { icon: ThumbsUp, text: t('features.noSignup'), color: 'text-white' },
    { icon: Infinity, text: t('features.unlimited'), color: 'text-white' },
    { icon: Upload, text: t('features.browser'), color: 'text-white' },
    { icon: Shield, text: t('features.secure'), color: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left: Image Uploader */}
      <ImageUploader className="md:col-span-2" onFilesSelected={onFilesSelected} multiple maxFiles={50} maxSizeMB={50} />

      {/* Right: Features */}
      {/* bg-muted/50  */}
      <div className="relative bg-background shadow-lg dark:shadow-purple-700 rounded-3xl px-4 py-6 md:py-10 md:px-6">
        {/* <div className="absolute -z-10 top-0 left-0 w-full h-full  rounded-3xl bg-gradient-to-br from-[#F06DAD] to-[#F06DAD]/50 rotate-5"></div> */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full  rounded-3xl bg-gradient-to-br from-primary to-pink-500 -rotate-5"></div>
        {/* <h2 className="text-3xl font-bold text-foreground mb-3 text-center leading-tight">
          {t('features.title')}
        </h2> */}
        
        {/* <p className="text-sm text-muted-foreground mb-8 text-center">
          {t('features.description')}
        </p> */}
        
        <div className="grid gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F06DAD] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <span className="text-base text-foreground">{feature.text}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/resize-image">
              {t('features.singleImageCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
