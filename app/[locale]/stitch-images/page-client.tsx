'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ToolsGrid } from '@/components/tools-grid';
import { HowToSection } from '@/components/common/how-to-section';
import { FAQSection } from '@/components/common/faq-section';
import { Download, ImageIcon, Upload } from 'lucide-react';
import { ImageStitcherWorkspace } from '@/components/stitch-images/stitch-workspace';

export default function ImageStitcherPageClient() {
  const t = useTranslations('ImageStitcherTool');

  return (
    <div className="mx-auto w-full gap-4 pt-8">
      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
              {t('pageTitle')}
            </h1>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('pageDescription')}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 mb-8">
        <div className="max-w-8xl mx-auto space-y-12">
          <ImageStitcherWorkspace />

          {/* Intro Section */}
          <section className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {t('intro.title')}
            </h2>
            <div className="text-muted-foreground leading-relaxed">
              {t('intro.content')}
            </div>
          </section>
        </div>
      </main>

      {/* <div className='container mx-auto max-w-4xl pb-16'>
        <ToolsGrid />
      </div> */}

      {/* How To Section */}
      <HowToSection
        title={t('howTo.title')}
        steps={[
          {
            number: t('howTo.step1.number'),
            title: t('howTo.step1.title'),
            description: t('howTo.step1.description'),
            icon: Upload,
          },
          {
            number: t('howTo.step2.number'),
            title: t('howTo.step2.title'),
            description: t('howTo.step2.description'),
            icon: ImageIcon,
          },
          {
            number: t('howTo.step3.number'),
            title: t('howTo.step3.title'),
            description: t('howTo.step3.description'),
            icon: Download,
          },
        ]}
      />

      {/* FAQ Section */}
      <FAQSection
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        faqs={t.raw('faq.items')}
      />

      {/* SEO Content Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            {t('seoContent.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('seoContent.body')}
          </p>
        </div>
      </section>
    </div>
  );
}
