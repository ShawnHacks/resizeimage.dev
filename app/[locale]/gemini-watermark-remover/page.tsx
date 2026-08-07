import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GeminiWatermarkClient } from './client';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import { routing } from '@/i18n/routing';
import {
  JsonLd,
  getSoftwareAppSchema,
  getFaqSchema,
  getBreadcrumbListSchema,
  getHowToSchema,
} from '@/components/common/json-ld';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GeminiWatermarkRemover' });
  const title = t('title');
  const description = t('main.subtitle');
  const siteConfig = await getLocalizedSiteConfig(locale);

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}/gemini-watermark-remover`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...Object.fromEntries(
          routing.locales
            .map((loc) => [
              loc,
              `${urlString}${loc === 'en' ? '' : `/${loc}`}/gemini-watermark-remover`,
            ])
        ),
        'x-default': `${urlString}/gemini-watermark-remover`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: [
        {
          url: siteConfig.ogImage || `${urlString}/og.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function GeminiWatermarkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'GeminiWatermarkRemover' });
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const canonicalUrl = `${urlString}${locale === 'en' ? '' : `/${locale}`}/gemini-watermark-remover`;

  let faqItems = [];
  try {
    faqItems = t.raw('faq.items') || [];
  } catch (e) {
    console.error('Failed to load FAQ items:', e);
  }

  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: 'Home', item: urlString },
    { name: 'Tools', item: `${urlString}${localePrefix}` },
    { name: t('title'), item: canonicalUrl },
  ]);

  const howToSchema = getHowToSchema({
    name: t('main.title'),
    description: t('main.subtitle'),
    steps: [
      { title: t('step.1'), text: t('upload.text') },
      { title: t('step.2'), text: t('loading.text') },
      { title: t('step.3'), text: t('header.title') },
    ],
  });

  return (
    <>
      <JsonLd data={getSoftwareAppSchema({
        name: t('title'),
        description: t('main.subtitle'),
        url: canonicalUrl,
        image: `${urlString}/og.png`,
      })} />
      {faqItems.length > 0 && (
        <JsonLd data={getFaqSchema(faqItems.map((f: any) => ({
          question: f.question,
          answer: f.answer
        })))} />
      )}
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />
      <GeminiWatermarkClient />
    </>
  );
}
