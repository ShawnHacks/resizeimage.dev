'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ShowcaseItem {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

interface ShowcaseSectionProps {
  title: string;
  subtitle?: string;
  items?: ShowcaseItem[];
  children?: React.ReactNode;
  className?: string;
}

export function ShowcaseSection({ 
  title, 
  subtitle, 
  items,
  children,
  className 
}: ShowcaseSectionProps) {
  return (
    <section className={cn("py-16 md:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Custom Content */}
        {children}

        {/* Grid Items */}
        {items && items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                {item.image && (
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
