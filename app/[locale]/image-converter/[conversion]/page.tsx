import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  IMAGE_CONVERSIONS,
  getConversionBySlug,
  getOtherConversions,
  type ConversionSlug,
} from '@/components/image-converter/image-converter';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import { ImageConverterPageClient } from './page-client';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; conversion: ConversionSlug }>;
}): Promise<Metadata> {
  const { locale, conversion } = await params;
  const conversionDef = getConversionBySlug(conversion);

  if (!conversionDef) {
    return {};
  }

  const siteConfig = await getLocalizedSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'ImageConverterTool' });

  const title = t(`conversions.${conversion}.metadata.title`, {
    from: t(`formats.${conversionDef.from}`),
    to: t(`formats.${conversionDef.to}`),
  });

  const description = t(`conversions.${conversion}.metadata.description`, {
    from: t(`formats.${conversionDef.from}`),
    to: t(`formats.${conversionDef.to}`),
  });

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}/image-converter/${conversion}`;

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
              `${urlString}${loc === 'en' ? '' : `/${loc}`}/image-converter/${conversion}`,
            ])
        ),
        'x-default': `${urlString}/image-converter/${conversion}`,
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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; conversion: string }>;
}) {
  const { locale, conversion } = await params;
  setRequestLocale(locale);

  if (!conversion) {
    notFound();
  }

  const conversionDef = getConversionBySlug(conversion);
  if (!conversionDef) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'ImageConverterTool' });
  const formatLabel = (format: typeof conversionDef.from) => t(`formats.${format}`);

  const heroTitle = t('hero.title', {
    from: formatLabel(conversionDef.from),
    to: formatLabel(conversionDef.to),
  });

  const heroDescription = t('hero.description', {
    from: formatLabel(conversionDef.from),
    to: formatLabel(conversionDef.to),
  });

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}/image-converter/${conversionDef.slug}`;

  const featureList = [
    t('features.lightningFast'),
    t('features.free'),
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: heroTitle,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'ImageConversion',
    operatingSystem: 'Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: heroDescription,
    url: canonicalPath,
    inLanguage: locale,
    featureList,
  };

  const relatedConversions = getOtherConversions(conversionDef.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ImageConverterPageClient
        conversion={conversionDef}
        relatedConversions={relatedConversions}
      />
    </>
  );
}
