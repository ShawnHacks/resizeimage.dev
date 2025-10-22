'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImageUploader } from '@/components/image-uploader';
import { SingleResizeWorkspace } from '@/components/single-resize/resize-workspace';
import { motion } from 'motion/react';
import { HeroSection } from '@/components/single-resize/hero-section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ImageIcon, Upload } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { HowToSection } from '@/components/common/how-to-section';
import { FeatureSection } from '@/components/common/feature-section';
import { FAQSection } from '@/components/common/faq-section';

export default function SingleResizePageClient() {
  const t = useTranslations('SingleResize');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const originalSizeLabel = useMemo(() => {
    if (!file) return '--';
    const bytes = file.size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [file]);

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const firstFile = files[0];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(firstFile);
    setPreviewUrl(URL.createObjectURL(firstFile));
  };

  const handleResetImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFile(null);
  };

  // if (!file || !previewUrl) {
  //   return (
  //     <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 py-12 md:py-20">
  //       <motion.div
  //         initial={{ opacity: 0, y: 24 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.4 }}
  //         className="text-center"
  //       >
  //         <p className="mb-4 inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
  //           {t('badge')}
  //         </p>
  //         <h1 className="text-balance text-3xl font-heading font-bold text-foreground md:text-5xl">
  //           {t('pageTitle')}
  //         </h1>
  //         <p className="mt-4 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
  //           {t('pageDescription')}
  //         </p>
  //       </motion.div>

  //       <motion.div
  //         initial={{ opacity: 0, scale: 0.95 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ duration: 0.3, delay: 0.1 }}
  //         className="w-full max-w-3xl"
  //       >
  //         <ImageUploader
  //           multiple={false}
  //           maxFiles={1}
  //           onFilesSelected={handleFilesSelected}
  //           className="w-full"
  //         />
  //       </motion.div>

  //       <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-4 text-sm text-muted-foreground md:text-base">
  //         <p>
  //           {t('helperText')}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

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

      
      <main className="container mx-auto px-4 py-8 mb-8">
          <div className="max-w-5xl mx-auto space-y-4">
            {!file || !previewUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full max-w-4xl"
            >
              <HeroSection onFilesSelected={handleFilesSelected}  />
            </motion.div>) : (
              <SingleResizeWorkspace
                file={file}
                previewUrl={previewUrl}
                onReset={handleResetImage}
              />
            )}
          </div>
        </main>

      {/* How To Section */}
      <HowToSection
        title={t('howTo.title')}
        // subtitle={t('howTo.subtitle')}
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

      <div className="pt-16 md:pt-24">
        <FeatureSection
          title={t('featureSections.feature1.title')}
          description={t.raw('featureSections.feature1.description')}
          image="/illustration/image-resizer.webp"
          imageAlt="Bulk resize images online"
          layout="image-left"
        />

        <FeatureSection
          title={t('featureSections.feature2.title')}
          description={t.raw('featureSections.feature2.description')}
          image="/illustration/image-sizes-presets.webp"
          imageAlt="Resize image dimensions online"
          layout="image-right"
          // className="bg-muted/30"
        />

        <FeatureSection
          title={t('featureSections.feature3.title')}
          description={t.raw('featureSections.feature3.description')}
          image="/illustration/crop-image.webp"
          imageAlt="Resize image dimensions online"
          layout="image-left"
          // className="bg-muted/30"
        />
      </div>

      {/* FAQ Section */}
      <FAQSection
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        faqs={t.raw('faq.items')}
      />
    </div>
  );
}
