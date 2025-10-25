'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  Accordion,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
}

function FAQItem({ question, answer }: FAQItem) {
  return (
    <details className="group border rounded-lg bg-card">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors list-none">
        <h3 className="text-xl !font-heading font-bold pr-4 text-foreground">{question}</h3>
        <svg
          className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="px-6 pb-4">
        <div className="text-foreground leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      </div>
    </details>
  )
}

export function FAQSection({ title, subtitle, faqs, className }: FAQSectionProps) {
  return (
    <section id='faq' className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="max-w-4xl mx-auto space-y-4">
          {/* <Accordion type="single" collapsible className="w-full space-y-4"> */}
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          {/* </Accordion> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
