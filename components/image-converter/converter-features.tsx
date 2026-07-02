'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Zap, Infinity as InfinityIcon, Star } from 'lucide-react';

export function ConverterFeatures() {
  const t = useTranslations('ImageConverterTool.converterFeatures');
  const items = t.raw('items') as Array<{ title: string; description: string }>;

  const icons = [ShieldCheck, Zap, InfinityIcon, Star];

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading">{t('title')}</h2>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items?.map((item, idx) => {
          const Icon = icons[idx] || Star;
          return (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-semibold text-xl">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
