import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing'
import ResizeImageClient from './page-client';
import { getLocalizedSiteConfig } from '@/config/site-i18n';
import { JsonLd, getSoftwareAppSchema, getHowToSchema } from '@/components/common/json-ld';

export const runtime = 'edge'
// export const revalidate = 3600

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale = 'en' } = await params
  const siteConfig = await getLocalizedSiteConfig(locale)
  const t = await getTranslations({ locale, namespace: 'BulkResizeTool' });
  const title = t('pageTitle');
  const description = t('pageDescription');
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://imageconverter.dev'

  return {
    title,
    description,
    alternates: {
      canonical: `${urlString}${locale === 'en' ? '' : `/${locale}`}/bulk-resize-images`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((loc: string) => [
            loc,
            `${urlString}${loc === 'en' ? '' : `/${loc}`}/bulk-resize-images`
          ])
        ),
        'x-default': `${urlString}/bulk-resize-images`,
      }
    },
    openGraph: {
      title,
      description,
      url: `${urlString}${locale === 'en' ? '' : `/${locale}`}/bulk-resize-images`,
      images: [
        {
          url: siteConfig.ogImage || `${urlString}/og.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    manifest: '/manifest.json',
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResizeImageClient />;
}