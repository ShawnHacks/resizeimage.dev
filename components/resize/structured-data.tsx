import { getTranslations } from 'next-intl/server'

export async function ResizeToolStructuredData({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'SiteConfig' })

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('title'),
    description: t('description'),
    url: 'https://bulkresizeimages.online',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Resize by percentage',
      'Resize to target file size',
      'Custom dimensions',
      'Resize by width or height',
      'Batch processing',
      'No upload required',
      'Privacy-focused',
      'Works offline',
    ],
    screenshot: 'https://bulkresizeimages.online/og.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '12500',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
