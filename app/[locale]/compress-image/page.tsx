
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import { CompressorView } from '@/components/image-compressor/compressor-view';
import { JsonLd, getSoftwareAppSchema, getHowToSchema, getFaqSchema } from '@/components/common/json-ld';
import { FAQSection } from '@/components/common/faq-section';
import { HowToSection } from '@/components/common/how-to-section';

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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ImageCompressor' });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';

  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;
  const faqSchema = getFaqSchema(faqItems);

  const howToSchema = getHowToSchema({
    name: t('howTo.title'),
    description: t('description'),
    steps: [
      { title: t('howTo.step1.title'), text: t('howTo.step1.description') },
      { title: t('howTo.step2.title'), text: t('howTo.step2.description') },
      { title: t('howTo.step3.title'), text: t('howTo.step3.description') },
    ],
  });

  const softwareSchema = getSoftwareAppSchema({
    name: t('metaTitle'),
    description: t('metaDescription'),
    url: `${appUrl}${locale === 'en' ? '' : `/${locale}`}/compress-image`,
    image: `${appUrl}/og.png`,
  });

  return (
    <div className="mx-auto w-full gap-4 pt-8">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={howToSchema} />

      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
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

      {/* How To Section */}
      <HowToSection
        title={t('howTo.title')}
        steps={[
          {
            number: t('howTo.step1.number'),
            title: t('howTo.step1.title'),
            description: t('howTo.step1.description'),
          },
          {
            number: t('howTo.step2.number'),
            title: t('howTo.step2.title'),
            description: t('howTo.step2.description'),
          },
          {
            number: t('howTo.step3.number'),
            title: t('howTo.step3.title'),
            description: t('howTo.step3.description'),
          },
        ]}
      />

      {/* FAQ Section */}
      <FAQSection
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        faqs={faqItems}
      />

      {/* SEO Content Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            {t('seoContent.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('seoContent.body')}
          </p>
        </div>
      </section>
    </div>
  );
}
