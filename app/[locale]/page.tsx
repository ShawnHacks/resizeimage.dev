import { Metadata } from 'next'
import {setRequestLocale} from 'next-intl/server';
import { routing } from '@/i18n/routing'
import ResizeImagePage from '@/app/page-resize';

export const runtime = 'edge'
// export const revalidate = 3600

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale = 'en' } = await params
  
  const urlString = process.env.NEXT_PUBLIC_APP_URL || 'https://bulkresizeimages.online'
  const title = 'BulkresizeImage - Resize Images Online Free'
  const description = 'Resize multiple images at once right in your browser. No upload needed. 100% free and private. Support percentage, file size, dimensions, width, height modes.'

  return {
    title,
    description,
    keywords: ['bulk resize image', 'resize image online', 'image resizer', 'batch resize photos', 'resize photos online', 'compress image'],
    authors: [{ name: 'BulkresizeImage' }],
    creator: 'BulkresizeImage',
    publisher: 'BulkresizeImage',
    openGraph: {
      type: 'website',
      url: urlString,
      locale: locale,
      title: title,
      description: description,
      siteName: 'BulkresizeImage',
      images: [
        {
          url: `${urlString}/og.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${urlString}/og.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
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
  
  // return <ResizeImagePage />;
  return <div>Hello {locale}</div>
}