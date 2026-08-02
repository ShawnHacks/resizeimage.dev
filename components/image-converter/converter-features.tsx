'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Zap, Infinity as InfinityIcon, Star } from 'lucide-react';

interface ConverterFeaturesProps {
  from?: string;
  to?: string;
}

export function ConverterFeatures({ from, to }: ConverterFeaturesProps) {
  const t = useTranslations('ImageConverterTool.converterFeatures');
  const rawItems = t.raw('items') as Array<{ title: string; description: string }>;

  const icons = [ShieldCheck, Zap, InfinityIcon, Star];

  const title = from && to ? t('title', { from, to }) : t('title', { from: '', to: '' });

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading">{title}</h2>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {rawItems?.map((_, idx) => {
          const Icon = icons[idx] || Star;
          const itemTitle = from && to ? t(`items.${idx}.title`, { from, to }) : t(`items.${idx}.title`);
          const itemDesc = from && to ? t(`items.${idx}.description`, { from, to }) : t(`items.${idx}.description`);
          return (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-semibold text-xl">{itemTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">{itemDesc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
