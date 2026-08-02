import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getLocalizedSiteConfig } from '@/config/site-i18n';
import { JsonLd, getSoftwareAppSchema, getHowToSchema } from '@/components/common/json-ld';

import { routing } from '@/i18n/routing';
import { PageClient } from './page-client';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteConfig = await getLocalizedSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'ImageConverterTool' });
  const title = t('title');
  const description = t('description');
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev';
  const basePath = locale === 'en' ? '' : `/${locale}`;
  const canonicalPath = `${urlString}${basePath}`;

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
              `${urlString}${loc === 'en' ? '' : `/${loc}`}`,
            ])
        ),
        'x-default': urlString,
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
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ImageConverterTool' });

  return (

    <PageClient>
      <JsonLd data={getSoftwareAppSchema({
        name: t('title'),
        description: t('description'),
        url: `${process.env.NEXT_PUBLIC_APP_URL}${locale === 'en' ? '' : `/${locale}`}`,
        image: `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
      })} />
      {/* <JsonLd data={getHowToSchema({
        name: t('howTo.title'),
        description: t('description'),
        steps: [
          { title: t('howTo.steps.0.title'), text: t('howTo.steps.0.description') },
          { title: t('howTo.steps.1.title'), text: t('howTo.steps.1.description') },
          { title: t('howTo.steps.2.title'), text: t('howTo.steps.2.description') },
        ],
      })} /> */}
      <></>
    </PageClient>

  );

}


