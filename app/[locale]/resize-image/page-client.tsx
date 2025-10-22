'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImageUploader } from '@/components/image-uploader';
import { SingleResizeWorkspace } from '@/components/single-resize/resize-workspace';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';

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

  if (!file || !previewUrl) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="mb-4 inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t('landing.badge')}
          </p>
          <h1 className="text-balance text-3xl font-heading font-semibold text-foreground md:text-5xl">
            {t('landing.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            {t('landing.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full max-w-3xl"
        >
          <ImageUploader
            multiple={false}
            maxFiles={1}
            onFilesSelected={handleFilesSelected}
            className="w-full"
          />
        </motion.div>

        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-4 text-sm text-muted-foreground md:text-base">
          <p>
            {t('landing.helperText')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 py-10 md:py-16">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button variant="ghost" size="sm" onClick={handleResetImage} className="mb-2 inline-flex items-center gap-2 px-0 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {t('actions.back')}
            </Button>
            <h1 className="text-2xl font-heading font-semibold text-foreground md:text-4xl">
              {t('editor.title')}
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              {t('editor.subtitle', { size: originalSizeLabel })}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/bulk-resize-images">
              {t('actions.bulkTool')}
            </Link>
          </Button>
        </div>
      </div>

      <SingleResizeWorkspace
        file={file}
        previewUrl={previewUrl}
        onReset={handleResetImage}
      />
    </div>
  );
}
