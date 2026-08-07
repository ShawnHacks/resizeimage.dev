import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import {
  JsonLdScript,
  getBreadcrumbSchema,
} from '@/components/common/structured-data'
import { baseSiteConfig } from '@/config/site-i18n'

type Props = {
  params: Promise<{ locale: string }>
}

export const runtime = "edge";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicyPage' })

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
      canonical: locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`,
      languages:
      Object.fromEntries(
        routing.locales.map((loc: string) => [
          loc,
          loc === 'en' ? '/privacy-policy' : `/${loc}/privacy-policy`
        ])
      ),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicyPage' })

  let Content

  try {
    Content = (await import(`./${locale}.mdx`)).default
  } catch (error) {
    console.warn(`MDX file for locale '${locale}' not found, falling back to English`)
    try {
      Content = (await import(`./en.mdx`)).default
    } catch (fallbackError) {
      console.error('English fallback MDX file not found:', fallbackError)
      notFound()
    }
  }

  const baseUrl = baseSiteConfig.url
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const pageUrl = `${baseUrl}${localePrefix}/privacy-policy`

  const privacyPolicySchema = {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: t('metaTitle'),
    description: t('metaDescription'),
    inLanguage: locale,
    isPartOf: { '@id': `${baseUrl}/#website` },
  }

  const breadcrumbSchema = {
    ...getBreadcrumbSchema([
      { name: 'Home', item: baseUrl },
      { name: 'Privacy Policy', item: pageUrl },
    ]),
    '@id': `${pageUrl}#breadcrumb`,
  }

  return (
    <>
      <JsonLdScript id="privacy-policy-structured-data" data={privacyPolicySchema} />
      <JsonLdScript id="breadcrumb-structured-data-privacy-policy" data={breadcrumbSchema} />
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <Content />
          </article>
        </div>
      </main>
    </>
  )
}