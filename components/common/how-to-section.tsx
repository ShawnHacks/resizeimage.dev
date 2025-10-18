'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HowToStep {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface HowToSectionProps {
  title: string;
  subtitle?: string;
  steps: HowToStep[];
  className?: string;
}

export function HowToSection({ title, subtitle, steps, className }: HowToSectionProps) {
  return (
    <section 
      className={cn("py-16 md:py-24 relative overflow-hidden", className)}
      style={{
        background: 'linear-gradient(15deg, #7c84fc, #ff4dd2)'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            {title}
          </h2>
          {/* {subtitle && (
            <p className="text-lg text-white/90">
              {subtitle}
            </p>
          )} */}
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 md:gap-6">
                  {/* Icon */}
                  {Icon && (
                    <div className="flex-shrink-0">
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-foreground" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    {/* Title with step number */}
                    <h3 className="text-lg md:text-2xl font-heading font-bold text-foreground mb-2">
                      {step.number}. {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm md:text-lg text-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
