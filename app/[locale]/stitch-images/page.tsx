import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import ImageStitcherPageClient from './page-client';
import StructuredData from '@/components/structured-data'

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale = 'en' } = await params;
  const siteConfig = await getLocalizedSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'ImageStitcherTool' });

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}/stitch-images`;

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
              `${urlString}${loc === 'en' ? '' : `/${loc}`}/stitch-images`,
            ])
        ),
        'x-default': `${urlString}/stitch-images`,
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
  const siteConfig = await getLocalizedSiteConfig(locale)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev'
  const t = await getTranslations({ locale, namespace: 'ImageStitcherTool' });

  const softwareStructuredData = siteConfig ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": t('metadata.title'),
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "description": t('metadata.description'),
    "inLanguage": locale,
    "url": `${appUrl}${locale === 'en' ? '' : `/${locale}`}/stitch-images`,
    "image": [`${appUrl}/og.png`],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.companyName || siteConfig.name,
      "url": siteConfig.url,
      logo: {
        "@type": "ImageObject",
        "url": `${appUrl}/logo.png`
      }
    },
    "featureList": [
      "Combine multiple images on a custom canvas",
      "No uploads required—privacy safe processing",
      "Support for JPG, PNG, WebP, and SVG formats",
      "Rotate, resize, and reorder layers",
      "Free tool with no account or registration needed"
    ]
  } : null

  const faqT = await getTranslations({ locale, namespace: 'ImageStitcherTool.faq' });
  const faqItems = faqT.raw('items') as Array<{ question: string; answer: string }>;

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }

  return (
    <>
      {softwareStructuredData && (
        <StructuredData
          id="software-application-structured-data"
          data={softwareStructuredData}
        />
      )}
      {faqStructuredData && (
        <StructuredData
          id="faq-structured-data"
          data={faqStructuredData}
        />
      )}
      <ImageStitcherPageClient />
    </>
  );
}
