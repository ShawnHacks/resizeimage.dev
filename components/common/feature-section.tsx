'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface FeatureSectionProps {
  title: string;
  description: string | string[];
  image: string;
  imageAlt: string;
  layout?: 'image-left' | 'image-right';
  className?: string;
}

export function FeatureSection({
  title,
  description,
  image,
  imageAlt,
  layout = 'image-left',
  className,
}: FeatureSectionProps) {
  const isImageLeft = layout === 'image-left';
  const descriptionArray = Array.isArray(description) ? description : [description];

  return (
    <section className={cn("py-8 md:py-8 bg-background", className)}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid lg:grid-cols-2 gap-8 lg:gap-8 items-center max-w-4xl mx-auto",
          isImageLeft ? "" : "lg:grid-flow-dense"
        )}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn(
              "relative",
              isImageLeft ? "lg:col-start-1" : "lg:col-start-2"
            )}
          >
            <div className="relative aspect-[1/1] w-full rounded-2xl overflow-hidden">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              isImageLeft ? "lg:col-start-2" : "lg:col-start-1"
            )}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              {title}
            </h2>
            
            <div className="space-y-4">
              {descriptionArray.map((text, index) => (
                <p key={index} className="text-base md:text-lg text-foreground leading-relaxed">
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
