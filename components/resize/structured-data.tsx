export function ResizeToolStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BulkresizeImages',
    description: 'Resize multiple images at once right in your browser. No upload needed. 100% free and private.',
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
      ratingValue: '4.8',
      ratingCount: '1250',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
