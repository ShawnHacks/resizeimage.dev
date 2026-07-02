'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import type { ConvertibleFormat } from '@/lib/image-convert-utils';

interface FormatInfoSectionProps {
  format: ConvertibleFormat;
}

export function FormatInfoSection({ format }: FormatInfoSectionProps) {
  const t = useTranslations('ImageConverterTool');

  // We rely on next-intl to handle missing keys gracefully or we should ensure they exist.
  // Using t.raw for arrays.

  const title = t(`formatInfo.${format}.title`);
  const description = t(`formatInfo.${format}.description`);
  const bestFor = t(`formatInfo.${format}.bestFor`);
  const pros = t.raw(`formatInfo.${format}.pros`) as string[];

  return (
    <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold font-heading">{title}</h2>
      <p className="mb-6 text-muted-foreground leading-relaxed">{description}</p>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold text-foreground text-lg">Best For</h3>
          <p className="text-muted-foreground">{bestFor}</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-foreground text-lg">Key Advantages</h3>
          <ul className="space-y-3">
            {pros?.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                <Check className="mt-1 h-4 w-4 text-green-500 shrink-0" strokeWidth={3} />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
