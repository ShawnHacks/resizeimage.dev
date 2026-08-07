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
  const t = await getTranslations({ locale, namespace: 'ContactPage' })

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: locale === 'en' ? '/contact' : `/${locale}/contact`,
      languages:
      Object.fromEntries(
        routing.locales.map((loc: string) => [
          loc,
          loc === 'en' ? '/contact' : `/${loc}/contact`
        ])
      ),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ContactPage' })

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
  const pageUrl = `${baseUrl}${localePrefix}/contact`

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: t('metaTitle'),
    description: t('metaDescription'),
    inLanguage: locale,
    isPartOf: { '@id': `${baseUrl}/#website` },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${baseUrl}/og.png` },
  }

  const breadcrumbSchema = {
    ...getBreadcrumbSchema([
      { name: 'Home', item: baseUrl },
      { name: 'Contact', item: pageUrl },
    ]),
    '@id': `${pageUrl}#breadcrumb`,
  }

  return (
    <>
      <JsonLdScript id="contact-page-structured-data" data={contactPageSchema} />
      <JsonLdScript id="breadcrumb-structured-data-contact" data={breadcrumbSchema} />
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