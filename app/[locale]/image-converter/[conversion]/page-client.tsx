'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Wand2, Download } from 'lucide-react';

import type { ImageConversionDefinition } from '@/components/image-converter/image-converter';
import type { ConvertibleFormat } from '@/lib/image-convert-utils';
import { HeroSection } from '@/components/image-converter/hero-section';
import { ConverterWorkspace } from '@/components/image-converter/converter-workspace';
import { ToolsGrid } from '@/components/tools-grid';
import { HowToSection } from '@/components/common/how-to-section';
import { FAQSection } from '@/components/common/faq-section';
import { ConversionLinks, type ConversionLinkItem } from '@/components/image-converter/conversion-links';
import { FormatInfoSection } from '@/components/image-converter/format-info-section';
import { ConverterFeatures } from '@/components/image-converter/converter-features';

interface ImageConverterPageClientProps {
  conversion: ImageConversionDefinition;
  relatedConversions: ImageConversionDefinition[];
}

export function ImageConverterPageClient({
  conversion,
  relatedConversions,
}: ImageConverterPageClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const t = useTranslations('ImageConverterTool');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [previewUrl]);

  const formatLabel = useCallback(
    (format: ConvertibleFormat) => t(`formats.${format}`),
    [t]
  );

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {
        // Ignore cleanup errors
      }
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleReset = () => {
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {
        // Ignore cleanup errors
      }
    }
    setPreviewUrl(null);
    setFile(null);
  };

  const badge = t('hero.badge', {
    from: formatLabel(conversion.from),
    to: formatLabel(conversion.to),
  });
  const pageTitle = t('hero.title', {
    from: formatLabel(conversion.from),
    to: formatLabel(conversion.to),
  });
  const pageDescription = t('hero.description', {
    from: formatLabel(conversion.from),
    to: formatLabel(conversion.to),
  });

  const moreOptions = useMemo<ConversionLinkItem[]>(() => {
    return relatedConversions.map((item) => ({
      href: `/image-converter/${item.slug}`,
      label: t(`conversions.${item.slug}.label`, {
        from: formatLabel(item.from),
        to: formatLabel(item.to),
      }),
      description: t(`conversions.${item.slug}.shortDescription`),
    }));
  }, [formatLabel, relatedConversions, t]);

  const howToSteps = useMemo(() => {
    const rawSteps = t.raw('howTo.steps') as Array<{
      number: string;
      title: string;
      description: string;
    }>;
    const icons = [Upload, Wand2, Download];

    return rawSteps.map((_, index) => ({
      number: t(`howTo.steps.${index}.number`),
      title: t(`howTo.steps.${index}.title`, {
        from: formatLabel(conversion.from),
        to: formatLabel(conversion.to),
      }),
      description: t(`howTo.steps.${index}.description`, {
        from: formatLabel(conversion.from),
        to: formatLabel(conversion.to),
      }),
      icon: icons[index] ?? Upload,
    }));
  }, [conversion.from, conversion.to, formatLabel, t]);

  return (
    <div className="mx-auto w-full">
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-4">
            <span className="inline-flex items-center rounded-full border border-border/60 bg-card px-4 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {badge}
            </span>
            <h1 className="text-balance text-4xl font-heading font-bold text-foreground md:text-5xl">
              {pageTitle}
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {pageDescription}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {!file || !previewUrl ? (
            <HeroSection
              fromFormat={conversion.from}
              toFormat={conversion.to}
              onFilesSelected={handleFilesSelected}
              showHeading={false}
              otherConversions={moreOptions}
            />
          ) : (
            <ConverterWorkspace
              file={file}
              originalUrl={previewUrl}
              fromFormat={conversion.from}
              toFormat={conversion.to}
              onReset={handleReset}
              otherConversions={moreOptions}
            />
          )}
        </div>

        <div className="mx-auto max-w-4xl mt-12">
          <p className="font-bold text-lg text-foreground">
            {t('moreOptions.title')}
          </p>
          <ConversionLinks items={moreOptions} className="grid sm:grid-cols-3 md:grid-cols-5 mt-2" />
        </div>
      </main>

      <div className="container mx-auto max-w-4xl px-4 pb-16">
        {/* <ToolsGrid /> */}
      </div>

      <HowToSection
        title={t('howTo.title', {
          from: formatLabel(conversion.from),
          to: formatLabel(conversion.to),
        })}
        steps={howToSteps}
      />

      <div className="mx-auto max-w-4xl mt-20 grid gap-8">
        <FormatInfoSection format={conversion.from} />
        <FormatInfoSection format={conversion.to} />
      </div>

      <div className="mx-auto mt-8 max-w-7xl">
        <ConverterFeatures />
      </div>

      <FAQSection
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        faqs={t.raw('faq.items')}
      />

    </div>
  );
}
