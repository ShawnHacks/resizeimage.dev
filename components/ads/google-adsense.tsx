"use client"

import { useEffect } from "react"

export const GoogleAdsense = () => {
  useEffect(() => {
    // Only load Google Adsense in production
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3414178915048488'

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"][data-ad-client="${clientId}"]`
    )
    
    if (existingScript) {
      return
    }

    // Create and insert the AdSense script
    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-ad-client', clientId)
    
    document.head.appendChild(script)

    // Cleanup function
    return () => {
      // Optional: remove script on unmount if needed
      // document.head.removeChild(script)
    }
  }, [])

  // Return meta tag for AdSense account verification
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <meta name="google-adsense-account" content="ca-pub-3414178915048488" />
  )
}