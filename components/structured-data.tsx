import Script from 'next/script'

interface StructuredDataProps {
  data: any
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

import { getTranslations } from 'next-intl/server'

interface FAQStructuredDataProps {
  locale: string
}

export async function FAQStructuredData({ locale }: FAQStructuredDataProps) {
  const t = await getTranslations({ locale, namespace: 'FAQ' })
  
  const faqData = [
    {
      question: t('howToUse.question'),
      answer: t('howToUse.answer')
    },
    {
      question: t('formats.question'),
      answer: t('formats.answer')
    },
    {
      question: t('storage.question'),
      answer: t('storage.answer')
    },
    {
      question: t('privacy.question'),
      answer: t('privacy.answer')
    },
    {
      question: t('limitations.question'),
      answer: t('limitations.answer')
    },
    {
      question: t('popups.question'),
      answer: t('popups.answer')
    },
    {
      question: t('slow.question'),
      answer: t('slow.answer')
    },
    {
      question: t('accuracy.question'),
      answer: t('accuracy.answer')
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

interface WebsiteStructuredDataProps {
  locale: string
}

export async function WebsiteStructuredData({ locale }: WebsiteStructuredDataProps) {
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WebsiteScreenshot",
    "description": t('subtitle'),
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://websitescreenshot.online",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Full page screenshots",
      "Multiple output formats (PNG, JPEG, PDF)",
      "Device simulation",
      "Ad blocking",
      "Cookie popup handling",
      "No registration required"
    ],
    "browserRequirements": "Requires JavaScript enabled"
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
