'use client';

import { CheckCircle, Shield, ThumbsUp, Upload, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ImageUploader } from '@/components/image-uploader';
import type {
  ConvertibleFormat,
  OutputConvertibleFormat,
} from '@/lib/image-convert-utils';
import { ConversionLinks, type ConversionLinkItem } from '@/components/image-converter/conversion-links';

interface HeroSectionProps {
  fromFormat: ConvertibleFormat;
  toFormat: OutputConvertibleFormat;
  onFilesSelected: (files: File[]) => void;
  otherConversions: ConversionLinkItem[];
  showHeading?: boolean;
}

export function HeroSection({
  fromFormat,
  toFormat,
  onFilesSelected,
  otherConversions,
  showHeading = true,
}: HeroSectionProps) {
  const t = useTranslations('ImageConverterTool');

  const features = [
    { icon: CheckCircle, text: t('features.free'), color: 'text-white' },
    { icon: Zap, text: t('features.lightningFast'), color: 'text-white' },
  ];

  return (
    <section className="space-y-8">
      {showHeading && (
        <div className="space-y-4 text-center lg:text-left">
          <p className="mx-auto inline-flex rounded-full border border-border/80 bg-background px-4 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('hero.badge', {
              from: t(`formats.${fromFormat}`),
              to: t(`formats.${toFormat}`),
            })}
          </p>
          <h1 className="text-balance text-4xl font-heading font-bold text-foreground md:text-5xl">
            {t('hero.title', {
              from: t(`formats.${fromFormat}`),
              to: t(`formats.${toFormat}`),
            })}
          </h1>
          <p className="mx-auto max-w-3xl text-balance text-base text-muted-foreground md:text-lg">
            {t('hero.description', {
              from: t(`formats.${fromFormat}`),
              to: t(`formats.${toFormat}`),
            })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <ImageUploader
          className="md:col-span-2"
          multiple={false}
          maxFiles={1}
          onFilesSelected={onFilesSelected}
        />

        <div className="relative bg-background shadow-lg dark:shadow-white/30 rounded-3xl px-4 py-6 md:py-8 md:px-6">
          <div className="absolute -z-10 top-0 left-0 w-full h-full  rounded-3xl bg-gradient-to-br from-primary to-primary -rotate-5"></div>

          <div className="grid gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  {/* <div className="w-6 h-6 rounded-full bg-[#F06DAD] flex items-center justify-center flex-shrink-0"> */}
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-base text-foreground">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* {otherConversions.length > 0 && (
            <div className="border-border/60 mt-6">
              <div className="mb-3 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {t('moreOptions.title')}
                </p>
              </div>
              <ConversionLinks items={otherConversions} className="mt-2" />
            </div>
          )} */}
        </div>
      </div>

      {/* <div className="mt-6">
        <p className="text-sm font-semibold text-foreground">
          {t('moreOptions.title')}
        </p>
        <ConversionLinks items={otherConversions} className="grid sm:grid-cols-3 md:grid-cols-5 mt-2" />
      </div> */}
    </section>
  );
}
