import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { fontVariables } from '@/assets/fonts/fonts';
import { Providers, ThemeScript } from '@/components/providers';
import { Toaster } from 'sonner'

import {NextIntlClientProvider, hasLocale, Locale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
// import { getTranslations } from 'next-intl/server';
import { getLocalizedSiteConfig } from '@/config/site-i18n'
// import { CookieConsent } from "@/components/cookie-consent";

import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { MicrosoftClarityAnalytics } from "@/components/analytics/microsoft-clarity"
import { PWARegister } from "@/components/pwa-register"
import { GoogleAdsense } from "@/components/ads/google-adsense"

import "@/app/globals.css";
import { SiteLayout } from "@/components/layouts/site-layout";

type Props = {
  children: ReactNode;
  params: Promise<{locale: Locale}>;
};

export const viewport: Viewport = {
  themeColor: "#007AFF",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
  const {locale} = await props.params;

  const siteConfig = await getLocalizedSiteConfig(locale)
  const title = siteConfig.title
  const description = siteConfig.description

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator || 'ShawnHacks' }],
    creator: siteConfig.creator || 'ShawnHacks',
    publisher: siteConfig.name || 'BulkResizeImages',
    openGraph: {
      type: 'website',
      url: siteConfig.url || 'https://bulkresizeimages.online',
      locale: locale,
      title: title,
      description: description,
      siteName: siteConfig.name || 'BulkResizeImages',
      images: [
        {
          url: siteConfig.ogImage || 'https://bulkresizeimages.online/og.png',
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
      images: [siteConfig.ogImage || 'https://bulkresizeimages.online/og.png'],
      creator: '@ShawnHacks',
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
    icons: {
      icon: [
        // { url: `${siteConfig.url}/favicon.ico`, type: 'image/x-icon' }, 
        { url: `${siteConfig.url}/logo.svg`, type: 'image/svg+xml' }, 
        { url: `${siteConfig.url}/icon-192.png`, type: 'image/png' }
      ],
      shortcut: `${siteConfig.url}/icon-192.png`,
      apple: `${siteConfig.url}/apple-touch-icon.png`,
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'BulkResizeImages',
    },
  }
}

export default async function RootLayout({
  children,
  params
}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Adsense */}
        {/* <meta name="google-adsense-account" content="ca-pub-3414178915048488" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3414178915048488"
     crossOrigin="anonymous"></script> */}

        <GoogleAdsense />
        
        <ThemeScript />
        <GoogleAnalytics />
        <MicrosoftClarityAnalytics />
      </head>
      <body className={`${fontVariables} antialiased`}>
        <Providers>
          <NextIntlClientProvider>
            <PWARegister />
            <SiteLayout>{children}</SiteLayout>
            {/* <CookieConsent /> */}
            <Toaster richColors />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
