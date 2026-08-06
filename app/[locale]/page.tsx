import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import SingleResizePageClient from './resize-image/page-client';
import {
  JsonLdScript,
  getBreadcrumbSchema,
  getFaqSchema,
  getSoftwareApplicationSchema,
  ORG_ID,
  PERSON_ID,
} from '@/components/common/structured-data';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale = 'en' } = await params;
  const siteConfig = await getLocalizedSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'SingleResizeTool' });

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}`;

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...Object.fromEntries(
          routing.locales
            .map((loc: string) => [
              loc,
              `${urlString}${loc === 'en' ? '' : `/${loc}`}`,
            ])
        ),
        'x-default': `${urlString}`,
      },
    },
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: canonicalPath,
      images: [
        {
          url: siteConfig.ogImage || `${urlString}/og.png`,
          width: 1200,
          height: 630,
          alt: t('metadata.title'),
        },
      ],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteConfig = await getLocalizedSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'SingleResizeTool' });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev';

  const faqItems = (t.raw('faq.items') as Array<{ question: string; answer: string }>) ?? [];
  const howSteps = (t.raw('howTo') as {
    step1: { title: string; description: string };
    step2: { title: string; description: string };
    step3: { title: string; description: string };
  }) ?? null;

  const softwareStructuredData = getSoftwareApplicationSchema({
    name: siteConfig.title,
    description: siteConfig.description,
    url: appUrl,
    image: `${appUrl}/og.png`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any modern browser (Chrome, Firefox, Safari, Edge)',
    featureList: [
      'Resize image at once directly in the browser',
      'No uploads required—privacy safe processing',
      'Support for JPG, PNG, WebP, SVG, HEIC, HEIF, GIF, and AVIF formats',
      'Target dimensions or file size with instant previews',
      'Free tool with no account or registration needed',
    ],
  });

  // Reference Person/Org by @id so the entity graph stays consistent.
  const softwareWithRefs = {
    ...softwareStructuredData,
    publisher: { '@id': ORG_ID },
    author: { '@id': PERSON_ID },
  };

  const faqStructuredData = faqItems.length > 0 ? getFaqSchema(faqItems) : null;

  const howToStructuredData = howSteps
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: t('howTo.title'),
        description: t('howTo.subtitle'),
        totalTime: 'PT1M',
        estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: howSteps.step1.title,
            text: howSteps.step1.description,
            url: `${appUrl}/#step1`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: howSteps.step2.title,
            text: howSteps.step2.description,
            url: `${appUrl}/#step2`,
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: howSteps.step3.title,
            text: howSteps.step3.description,
            url: `${appUrl}/#step3`,
          },
        ],
      }
    : null;

  const breadcrumbStructuredData = getBreadcrumbSchema([
    { name: 'Home', item: appUrl },
  ]);

  return (
    <>
      <JsonLdScript id="software-application-structured-data" data={softwareWithRefs} />
      {faqStructuredData && (
        <JsonLdScript id="faq-structured-data-home" data={faqStructuredData} />
      )}
      {howToStructuredData && (
        <JsonLdScript id="howto-structured-data-home" data={howToStructuredData} />
      )}
      <JsonLdScript id="breadcrumb-structured-data-home" data={breadcrumbStructuredData} />
      <SingleResizePageClient />
    </>
  );
}