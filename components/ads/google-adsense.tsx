"use client"

import Script from "next/script"

export const GoogleAdsense = () => {
  // Only load Google Adsense in production
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <meta name="google-adsense-account" content="ca-pub-3414178915048488" />
      <Script
        id="adsense-script"
        async
        strategy="lazyOnload"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3414178915048488'}`}
        crossOrigin="anonymous"
      />
    </>
  )
}