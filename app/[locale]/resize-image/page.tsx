import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import SingleResizePageClient from './page-client';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale = 'en' } = await params;
  const siteConfig = await getLocalizedSiteConfig(locale);
  const t = await getTranslations({ locale, namespace: 'SingleResize' });

  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://bulkresizeimages.online';
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

  return <SingleResizePageClient />;
}
