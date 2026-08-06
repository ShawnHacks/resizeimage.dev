import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing'
import ResizeImageClient from './page-client';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import {
  JsonLd,
  getSoftwareAppSchema,
  getHowToSchema,
  getFaqSchema,
  getBreadcrumbListSchema,
} from '@/components/common/json-ld';

export const runtime = 'edge'
// export const revalidate = 3600

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale = 'en' } = await params
  const siteConfig = await getLocalizedSiteConfig(locale)
  const t = await getTranslations({ locale, namespace: 'BulkResizeTool' });
  const title = t('pageTitle');
  const description = t('pageDescription');
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev'

  return {
    title,
    description,
    alternates: {
      canonical: `${urlString}${locale === 'en' ? '' : `/${locale}`}/bulk-resize-images`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((loc: string) => [
            loc,
            `${urlString}${loc === 'en' ? '' : `/${loc}`}/bulk-resize-images`
          ])
        ),
        'x-default': `${urlString}/bulk-resize-images`,
      }
    },
    openGraph: {
      title,
      description,
      url: `${urlString}${locale === 'en' ? '' : `/${locale}`}/bulk-resize-images`,
      images: [
        {
          url: siteConfig.ogImage || `${urlString}/og.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    manifest: '/manifest.json',
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'BulkResizeTool' });
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalUrl = `${urlString}${basePath}/bulk-resize-images`;

  const softwareAppSchema = getSoftwareAppSchema({
    name: t('pageTitle'),
    description: t('pageDescription'),
    url: canonicalUrl,
    image: `${urlString}/og.png`,
  });

  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;
  const faqSchema = getFaqSchema(faqItems);

  const howToSchema = getHowToSchema({
    name: t('howTo.title'),
    description: t('howTo.subtitle'),
    steps: [
      { title: t('howTo.step1.title'), text: t('howTo.step1.description') },
      { title: t('howTo.step2.title'), text: t('howTo.step2.description') },
      { title: t('howTo.step3.title'), text: t('howTo.step3.description') },
    ],
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: 'Home', item: urlString },
    { name: 'Tools', item: `${urlString}${basePath}` },
    { name: t('pageTitle'), item: canonicalUrl },
  ]);

  return (
    <>
      <JsonLd data={softwareAppSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ResizeImageClient />
    </>
  );
}