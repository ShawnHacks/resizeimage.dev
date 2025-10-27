import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import SingleResizePageClient from './page-client';
import StructuredData from '@/components/structured-data'

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
  const canonicalPath = `${urlString}${basePath}/resize-image`;

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...Object.fromEntries(
          routing.locales
            .filter((loc: string) => loc !== locale)
            .map((loc: string) => [
              loc,
              `${urlString}${loc === 'en' ? '' : `/${loc}`}/resize-image`,
            ])
        ),
        'x-default': `${urlString}/resize-image`,
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
  const isEnglish = locale === 'en'
  const siteConfig = isEnglish ? await getLocalizedSiteConfig(locale) : null
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev'

  const softwareStructuredData = isEnglish && siteConfig ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": siteConfig.title,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "description": siteConfig.description,
    "inLanguage": "en",
    "url": appUrl,
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
      "logo": {
        "@type": "ImageObject",
        "url": `${appUrl}/logo.png`
      }
    },
    "featureList": [
      "Resize image at once directly in the browser",
      "No uploads required—privacy safe processing",
      "Support for JPG, PNG, WebP, SVG, HEIC, HEIF, GIF, and AVIF formats",
      "Target dimensions or file size with instant previews",
      "Free tool with no account or registration needed"
    ]
  } : null

  return (
    <>
      {softwareStructuredData && (
        <StructuredData
          id="software-application-structured-data"
          data={softwareStructuredData}
        />
      )}
      <SingleResizePageClient />
    </>
  );
  // return <SingleResizePageClient />;
}
