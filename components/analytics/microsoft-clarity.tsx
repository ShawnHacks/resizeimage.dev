"use client"

import Script from "next/script"
// import { useEffect, useState } from "react"

export const MicrosoftClarityAnalytics = () => {
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
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "toti0mz4im");
          `,
        }}
      />
    </>
  )
}
