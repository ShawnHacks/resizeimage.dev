"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cookie, X, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  // Try to use translations, fall back to English if not available
  const t = useTranslations('CookieConsent')
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay to avoid layout shift
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: prefs 
    }))
    
    setShowBanner(false)
    setShowDetails(false)
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    savePreferences(necessaryOnly)
  }

  const acceptSelected = () => {
    savePreferences(preferences)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg border-2">
        <CardContent className="px-4">
          {!showDetails ? (
            // Simple banner
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cookie className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{t('title')}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('description')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-medium"
                  aria-label="Accept All Cookies"
                >
                  {t('acceptAll')}
                </Button>
                <Button
                  onClick={acceptNecessary}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  aria-label="Accept Necessary Cookies"
                >
                  {t('necessary')}
                </Button>
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  aria-label="Customize Cookies"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {t('customize')}
                </Button>
              </div>
            </div>
          ) : (
            // Detailed preferences
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{t('preferences')}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="h-6 w-6 p-0"
                  aria-label="Close"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium">{t('necessaryTitle')}</label>
                    <p className="text-xs text-muted-foreground">{t('necessaryDesc')}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{t('required')}</div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="analytics-cookies" className="text-xs font-medium cursor-pointer">{t('analyticsTitle')}</label>
                    <p id="analytics-desc" className="text-xs text-muted-foreground">{t('analyticsDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    id="analytics-cookies"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      analytics: e.target.checked
                    }))}
                    className="rounded"
                    aria-describedby="analytics-desc"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="marketing-cookies" className="text-xs font-medium cursor-pointer">{t('marketingTitle')}</label>
                    <p id="marketing-desc" className="text-xs text-muted-foreground">{t('marketingDesc')}</p>
                  </div>
                  <input
                    type="checkbox"
                    id="marketing-cookies"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      marketing: e.target.checked
                    }))}
                    className="rounded"
                    aria-describedby="marketing-desc"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={acceptSelected}
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-medium"
                  aria-label="Save Preferences"
                >
                  {t('savePreferences')}
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  size="sm"
                  aria-label="Cancel"
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
