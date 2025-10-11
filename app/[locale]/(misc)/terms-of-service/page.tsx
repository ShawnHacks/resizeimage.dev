import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export const runtime = "edge";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'TermsPage' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    alternates: {
      canonical: locale === 'en' ? '/terms-of-service' : `/${locale}/terms-of-service`,
      languages: 
      Object.fromEntries(
        routing.locales.map((loc: string) => [
          loc,
          loc === 'en' ? '/terms-of-service' : `/${loc}/terms-of-service`
        ])
      ),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  
  let Content
  
  try {
    // Try to load the locale-specific MDX file
    Content = (await import(`./${locale}.mdx`)).default
  } catch (error) {
    console.warn(`MDX file for locale '${locale}' not found, falling back to English`)
    try {
      // Fallback to English version
      Content = (await import(`./en.mdx`)).default
    } catch (fallbackError) {
      console.error('English fallback MDX file not found:', fallbackError)
      notFound()
    }
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <Content />
        </article>
      </div>
    </main>
  )
}
