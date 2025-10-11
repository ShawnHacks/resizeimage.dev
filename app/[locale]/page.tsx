import { Metadata } from 'next'
import {setRequestLocale, getTranslations} from 'next-intl/server';
import { ScreenshotTool } from '@/components/home/screenshot-tool';
import { Features } from '@/components/home/features';
import { FAQ } from '@/components/home/faq';
import { FAQStructuredData, WebsiteStructuredData } from '@/components/structured-data';
// import { getLocalizedSiteConfig } from '@/config/site-i18n'
import { routing } from '@/i18n/routing'

export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-dynamic' // Force dynamic rendering for metadata

// generateMetadata must be defined directly in the page file for SSR to work properly
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale = 'en' } = await params
  
  // const siteConfig = await getLocalizedSiteConfig(locale)
  // const title = siteConfig.title
  // const description = siteConfig.description

  // 定义一个确定的生产环境 URL
  const urlString = 'https://websitescreenshot.online'

  // 返回严格符合 Next.js 类型的 metadata 对象
  return {
    // title,
    // description,
    // keywords: siteConfig.keywords || [],
    // openGraph: {
    //   type: 'website',
    //   url: urlString,
    //   locale: locale,
    //   title: title,
    //   description: description,
    //   siteName: siteConfig.name || 'WebsiteScreenshot',
    //   images: [
    //     {
    //       url: siteConfig.ogImage || 'https://websitescreenshot.online/og.jpg',
    //       width: 1200,
    //       height: 630,
    //       alt: title,
    //     },
    //   ],
    // },
    // twitter: {
    //   card: 'summary_large_image',
    //   title: title,
    //   description: description,
    //   images: [siteConfig.ogImage || 'https://websitescreenshot.online/og.jpg'],
    //   creator: '@ShawnHacks',
    // },
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
  }
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'HomePage' })
  
  return (
    <>
      {/* Structured Data for SEO */}
      <WebsiteStructuredData locale={locale} />
      <FAQStructuredData locale={locale} />
      
      <div className='container mx-auto py-8 px-4'>
        {/* Hero Section */}
        <header className="text-center mb-12 pt-6">
          {/* whitespace-nowrap */}
          <h1 className="text-4xl font-bricolage font-semibold lg:text-5xl xl:text-6xl 2xl:text-[4rem] bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent lg:whitespace-normal mb-6">
            {t('title')}
          </h1>
          <div className="relative mx-auto max-w-4xl">
            <p className="text-balance text-lg text-muted-foreground">
              <span>{t('subtitle')}</span>
            </p>
          </div>
        </header>

        <main>
          {/* Screenshot Tool */}
          <section aria-labelledby="screenshot-tool-heading" className="mb-12">
            <ScreenshotTool />
          </section>

          {/* Features */}
          <Features />

          {/* FAQ */}
          <FAQ />
        </main>
      </div>
    </>
  );
}