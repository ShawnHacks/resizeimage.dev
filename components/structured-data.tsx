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

// interface FAQStructuredDataProps {
//   locale: string
// }

// export async function FAQStructuredData({ locale }: FAQStructuredDataProps) {
//   const t = await getTranslations({ locale, namespace: 'FAQ' })
  
//   const faqData = [
//     {
//       question: t('faq1.question'),
//       answer: t('faq1.answer')
//     },
//     {
//       question: t('faq2.question'),
//       answer: t('faq2.answer')
//     },
//     {
//       question: t('faq3.question'),
//       answer: t('faq3.answer')
//     },
//     {
//       question: t('faq4.question'),
//       answer: t('faq4.answer')
//     },
//     {
//       question: t('faq5.question'),
//       answer: t('faq5.answer')
//     },
//     {
//       question: t('faq6.question'),
//       answer: t('faq6.answer')
//     },
//     {
//       question: t('faq7.question'),
//       answer: t('faq7.answer')
//     },
//     {
//       question: t('faq8.question'),
//       answer: t('faq8.answer')
//     }
//   ]

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     "mainEntity": faqData.map(faq => ({
//       "@type": "Question",
//       "name": faq.question,
//       "acceptedAnswer": {
//         "@type": "Answer",
//         "text": faq.answer
//       }
//     }))
//   }

//   return (
//     <Script
//       id="faq-structured-data"
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{
//         __html: JSON.stringify(structuredData)
//       }}
//     />
//   )
// }

interface WebsiteStructuredDataProps {
  locale: string
}

export async function WebsiteStructuredData({ locale }: WebsiteStructuredDataProps) {
  const t = await getTranslations({ locale, namespace: 'SiteConfig' })
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('title'),
    "description": t('description'),
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://resizeimage.dev",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "No registration required",
      "image resizer online",
      "free image resizer",
      "resize multiple",
      "resize image online",
      "photo resizer",
      "image dimensions tool"
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
