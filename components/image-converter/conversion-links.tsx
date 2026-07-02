'use client';
'use client';

import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export interface ConversionLinkItem {
  label: string;
  href: string;
  description?: string;
}

interface ConversionLinksProps {
  items: ConversionLinkItem[];
  className?: string;
}

export function ConversionLinks({ items, className }: ConversionLinksProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          className="group flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            <ArrowRight className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="font-medium">{option.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
