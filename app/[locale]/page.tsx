import { Metadata } from 'next'
import {setRequestLocale} from 'next-intl/server';
import { routing } from '@/i18n/routing'
import ResizeImagePage from './page-resize';

export const runtime = 'edge'
// export const revalidate = 3600

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale = 'en' } = await params
  
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://bulkresizeimages.online'

  return {
    alternates: {
      canonical: locale === 'en' ? urlString : `${urlString}/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.filter((loc: string) => loc !== locale).map((loc: string) => [
            loc,
            loc === 'en' ? urlString : `${urlString}/${loc}`
          ])
        ),
        'x-default': urlString,
      }
    },
    manifest: '/manifest.json',
  }
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  
  return <ResizeImagePage />;
}