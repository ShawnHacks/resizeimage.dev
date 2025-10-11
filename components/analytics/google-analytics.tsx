"use client"

import Script from "next/script"
// import { useEffect, useState } from "react"

export const GoogleAnalytics = () => {
  // const [hasConsent, setHasConsent] = useState(false)

  // useEffect(() => {
  //   const checkConsent = () => {
  //     const consent = localStorage.getItem('cookie-consent')
  //     if (consent) {
  //       const preferences = JSON.parse(consent)
  //       setHasConsent(preferences.analytics === true)
  //     }
  //   }

  //   checkConsent()

  //   const handleConsentChange = (event: CustomEvent) => {
  //     setHasConsent(event.detail.analytics === true)
  //   }

  //   window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener)
    
  //   return () => {
  //     window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener)
  //   }
  // }, [])

  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-0SQXW4K14K`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-0SQXW4K14K');
                    `,
        }}
      />
    </>
  )
}
