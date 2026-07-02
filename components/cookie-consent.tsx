"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Link } from '@/i18n/navigation'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  // We can't use translations yet because we haven't added them to the messages files
  // But for now we'll use hardcoded text or fallback to ensure it works immediately
  // Ideally we should add these keys to en.json etc.

  useEffect(() => {
    setMounted(true)
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay to not annoy user immediately on load
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true")
    setIsVisible(false)
  }

  const handleDecline = () => {
    // Even if declined, we save a state so we don't ask again this session/period
    // For simple compliance, acknowledging is often enough, but "Accept" is standard
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!mounted) return null

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6",
        "transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
      ].join(" ")}
      aria-hidden={!isVisible}
    >
      <div className="mx-auto max-w-4xl bg-background/95 backdrop-blur-md border rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 ring-1 ring-border">
        <div className="flex-1 text-sm text-muted-foreground text-center md:text-left">
          <p>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            <Link href="/cookie-policy" className="underline underline-offset-4 hover:text-foreground ml-1">
              Read our Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecline}
            className="text-muted-foreground"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
