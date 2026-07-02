
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import { CompressorView } from '@/components/image-compressor/compressor-view';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale = 'en' } = await params;
  const t = await getTranslations({ locale, namespace: 'ImageCompressor' });
  const siteConfig = await getLocalizedSiteConfig(locale);

  const title = t('metaTitle');
  const description = t('metaDescription');

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}/compress-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...Object.fromEntries(
          routing.locales
            .map((loc: string) => [
              loc,
              `${urlString}${loc === 'en' ? '' : `/${loc}`}/compress-image`,
            ])
        ),
        'x-default': `${urlString}/compress-image`,
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

import StructuredData from '@/components/structured-data';
import { FAQSection } from '@/components/common/faq-section';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ImageCompressor' });
  const siteConfig = await getLocalizedSiteConfig(locale);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';

  const softwareStructuredData = siteConfig ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": t('metaTitle'),
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "description": t('metaDescription'),
    "inLanguage": locale,
    "url": `${appUrl}${locale === 'en' ? '' : `/${locale}`}/compress-image`,
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
      "Compress JPG, PNG, WebP, and AVIF images",
      "Privacy-first processing entirely in the browser",
      "No file uploads to servers",
      "Adjustable quality for perfect balance of size and clarity",
      "Fast and free with no registration needed"
    ]
  } : null;

  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;

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
  };

  return (
    <div className="mx-auto w-full gap-4">
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

      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 pt-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
              {t('title')}
            </h1>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 mb-8">
        <div className="max-w-8xl mx-auto space-y-12">
          <CompressorView />

          {/* Intro Section */}
          <section className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {t('intro.title')}
            </h2>
            <div className="text-muted-foreground leading-relaxed">
              {t('intro.content')}
            </div>
          </section>
        </div>
      </main>

      {/* FAQ Section */}
      <FAQSection
        title={t('faq.title')}
        faqs={faqItems}
      />
    </div>
  );
}
