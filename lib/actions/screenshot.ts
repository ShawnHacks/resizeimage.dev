"use server"

import { chromium } from 'playwright'
import { mkdir, readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'
import { ScreenshotConfig, ScreenshotResult } from '@/types/screenshot'
import { getLocale, getTranslations } from 'next-intl/server'
import { verifyTurnstileToken } from '@/lib/turnstile'
import type { Page } from 'playwright'
import { env } from '@/env.mjs'

/**
 * Handle common cookie/GDPR consent popups
 */
async function handleCookiePopups(page: Page): Promise<void> {
  try {
    // Common selectors for cookie consent buttons
    const cookieSelectors = [
      // Generic accept buttons
      '[data-testid*="accept"]',
      '[data-testid*="consent"]',
      '[id*="accept"]',
      '[id*="consent"]',
      '[class*="accept"]',
      '[class*="consent"]',
      
      // Common cookie banner frameworks
      '#onetrust-accept-btn-handler', // OneTrust
      '.ot-sdk-show-settings', // OneTrust
      '#cookieChoiceDismiss', // Google Cookie Choice
      '.cc-dismiss', // Cookie Consent
      '.cookie-accept', // Generic
      '.accept-cookies', // Generic
      '.gdpr-accept', // GDPR specific
      
      // Text-based selectors (case insensitive)
      'button:has-text("Accept")',
      'button:has-text("Accept All")',
      'button:has-text("I Accept")',
      'button:has-text("Agree")',
      'button:has-text("Got it")',
      'button:has-text("Continue")',
      'a:has-text("Accept")',
      'a:has-text("Accept All")',
      'a:has-text("I Accept")',
      'a:has-text("Agree")',
      'a:has-text("Got it")',
      'a:has-text("Continue")',
      
      // Multi-language support
      'button:has-text("Accepter")', // French
      'button:has-text("Akzeptieren")', // German
      'button:has-text("Aceptar")', // Spanish
      'button:has-text("Accetta")', // Italian
      'button:has-text("Aceitar")', // Portuguese
      'button:has-text("接受")', // Chinese
      'button:has-text("同意")', // Chinese
    ]

    // Wait a short time for popups to appear
    await page.waitForTimeout(1000)

    // Try each selector
    for (const selector of cookieSelectors) {
      try {
        const element = await page.locator(selector).first()
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click()
          // Wait for popup to disappear
          await page.waitForTimeout(1000)
          break
        }
      } catch (error) {
        // Continue to next selector if this one fails
        console.log('Cookie popup handling failed:', error)
        continue
      }
    }

    // Additional wait to ensure popup is fully dismissed
    await page.waitForTimeout(500)
  } catch (error) {
    // If cookie popup handling fails, continue with screenshot
    console.log('Cookie popup handling failed:', error)
  }
}

/**
 * Block ads and tracking scripts
 */
async function blockAds(page: Page): Promise<void> {
  try {
    // Block common ad domains and tracking scripts
    await page.route('**/*', (route) => {
      const url = route.request().url()
      const resourceType = route.request().resourceType()
      
      // Block known ad domains
      const adDomains = [
        'googlesyndication.com',
        'googleadservices.com',
        'doubleclick.net',
        'googletagmanager.com',
        'google-analytics.com',
        'facebook.com/tr',
        'facebook.net',
        'amazon-adsystem.com',
        'adsystem.amazon.com',
        'ads.yahoo.com',
        'bing.com/ads',
        'outbrain.com',
        'taboola.com',
        'criteo.com',
        'adsrvr.org',
        'adnxs.com',
        'rubiconproject.com',
        'pubmatic.com',
        'openx.net',
        'adsystem.amazon.co.uk',
        'adsystem.amazon.de',
        'adsystem.amazon.fr',
        'adsystem.amazon.it',
        'adsystem.amazon.es',
        'adsystem.amazon.ca',
        'adsystem.amazon.com.au',
        'adsystem.amazon.co.jp',
        'scorecardresearch.com',
        'quantserve.com',
        'addthis.com',
        'sharethis.com',
        'disqus.com/embed',
        'zergnet.com',
        'mgid.com',
        'revcontent.com',
        'contentad.net',
        'adskeeper.co.uk',
        'propellerads.com',
        'popads.net',
        'popcash.net',
        'popunder.net'
      ]
      
      // Check if URL contains any ad domain
      const isAdDomain = adDomains.some(domain => url.includes(domain))
      
      // Block ads, tracking scripts, and other unwanted resources
      if (isAdDomain || 
          resourceType === 'image' && (url.includes('/ads/') || url.includes('/ad/')) ||
          resourceType === 'script' && (url.includes('analytics') || url.includes('tracking') || url.includes('/ads/')) ||
          url.includes('/ads.') ||
          url.includes('/ad.') ||
          url.includes('_ads.') ||
          url.includes('_ad.') ||
          // url.includes('/banner') ||
          url.includes('/popup') ||
          url.includes('/popunder')) {
        route.abort()
      } else {
        route.continue()
      }
    })

    // Inject CSS to hide common ad elements
    await page.addInitScript(() => {
      // Add CSS to hide common ad selectors
      const style = document.createElement('style')
      style.textContent = `
        /* Hide common ad containers */
        [class*="ad-"], [class*="ads-"], [class*="advertisement"],
        [id*="ad-"], [id*="ads-"], [id*="advertisement"],
        .ad, .ads, .advertisement, .banner, .popup, .popunder,
        .google-ads, .adsense, .adsbygoogle,
        iframe[src*="ads"], iframe[src*="doubleclick"],
        iframe[src*="googlesyndication"], iframe[src*="amazon-adsystem"],
        div[data-ad], div[data-ads], div[data-advertisement],
        .sidebar-ad, .header-ad, .footer-ad, .content-ad,
        .sponsored, .promotion, .promo,
        [aria-label*="advertisement" i], [aria-label*="sponsored" i],
        .outbrain, .taboola, .mgid, .revcontent,
        .native-ad, .native-ads, .recommended-content
        {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `
      document.head.appendChild(style)
    })

    console.log('Ad blocking enabled')
  } catch (error) {
    console.log('Ad blocking setup failed:', error)
  }
}

// Clean up expired screenshot files (older than 24 hours)
async function cleanupExpiredScreenshots(): Promise<void> {
  try {
    // Use environment variable for screenshots directory, fallback to public/screenshots for development
    const screenshotsDir = env.SCREENSHOTS_DIR || join(process.cwd(), 'public', 'screenshots')
    
    // Check if directory exists
    try {
      await stat(screenshotsDir)
    } catch {
      // Directory doesn't exist, nothing to clean
      return
    }

    const files = await readdir(screenshotsDir)
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    let deletedCount = 0
    
    for (const file of files) {
      const filePath = join(screenshotsDir, file)
      
      try {
        // Skip non-image files
        if (!file.match(/\.(png|jpeg|jpg|pdf)$/i)) {
          continue
        }
        
        let shouldDelete = false
        
        // Try to extract timestamp from filename (new format: domain-YYYY-MM-DD-timestamp.ext)
        const timestampMatch = file.match(/-([0-9]{13})\.[^.]+$/)
        if (timestampMatch) {
          // New format with Unix timestamp
          const fileTimestamp = parseInt(timestampMatch[1])
          const fileAge = now - fileTimestamp
          shouldDelete = fileAge > maxAge
        } else {
          // Fallback to file system modification time for old format files
          const fileStats = await stat(filePath)
          const fileAge = now - fileStats.mtime.getTime()
          shouldDelete = fileAge > maxAge
        }
        
        if (shouldDelete) {
          await unlink(filePath)
          deletedCount++
          console.log(`Deleted expired screenshot: ${file}`)
        }
      } catch (error) {
        console.warn(`Failed to process file ${file}:`, error)
      }
    }
    
    if (deletedCount > 0) {
      console.log(`Cleanup completed: deleted ${deletedCount} expired screenshot(s)`)
    }
  } catch (error) {
    console.error('Screenshot cleanup failed:', error)
  }
}

export async function takeScreenshot(config: ScreenshotConfig): Promise<ScreenshotResult> {
  let browser
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'ScreenshotTool.errors' })
  
  try {
    // Verify Turnstile token first
    if (config.turnstileToken) {
      const turnstileResult = await verifyTurnstileToken(config.turnstileToken)
      if (!turnstileResult.success) {
        return {
          success: false,
          error: turnstileResult.error || 'Security verification failed'
        }
      }
    } else {
      return {
        success: false,
        error: 'Security verification required'
      }
    }
    // Validate URL
    const url = new URL(config.url)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        success: false,
        error: 'Invalid URL protocol. Only HTTP and HTTPS are supported.'
      }
    }

    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const context = await browser.newContext()
    const page = await context.newPage()

    // Block ads if requested
    if (config.blockAds) {
      await blockAds(page)
    }

    // Set viewport based on resolution
    const resolution = config.resolution

    await page.setViewportSize({
      width: resolution.width,
      height: resolution.height
    })

    // Navigate to the URL
    await page.goto(config.url, {
      waitUntil: 'networkidle',
      timeout: 60000
    })

    // Wait a bit for any dynamic content
    // Wait for the specified delay, default to 3 seconds
    const delayInMs = (config.delay || 3) * 1000;
    await page.waitForTimeout(delayInMs);

    // Handle cookie/GDPR popups if enabled
    if (config.blockCookiesGdpr) {
      await handleCookiePopups(page)
    }

    // Create screenshots directory if it doesn't exist
    // Use environment variable for screenshots directory, fallback to public/screenshots for development
    const screenshotsDir = env.SCREENSHOTS_DIR || join(process.cwd(), 'public', 'screenshots')
    await mkdir(screenshotsDir, { recursive: true })

    // Generate filename with Unix timestamp for easier parsing
    const now = new Date()
    const timestamp = now.getTime() // Unix timestamp in milliseconds
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
    const domain = url.hostname.replace(/[^a-zA-Z0-9]/g, '-')
    const filename = `${domain}-${dateStr}-${timestamp}.${config.format}`
    const filepath = join(screenshotsDir, filename)

    // Take screenshot
    const screenshotOptions: any = {
      path: filepath,
      type: config.format === 'jpeg' ? 'jpeg' : 'png',
      quality: config.format === 'jpeg' ? 90 : undefined
    }

    if (config.fullSize) {
      screenshotOptions.fullPage = true
    }

    if (config.format === 'pdf') {
      await page.pdf({
        path: filepath,
        // format: 'A4',
        format: 'Letter',
        printBackground: true
      })
    } else {
      await page.screenshot(screenshotOptions)
    }

    // Clean up expired screenshots in the background
    // Don't await this to avoid slowing down the response
    cleanupExpiredScreenshots().catch(error => {
      console.error('Background cleanup failed:', error)
    })

    // Generate URL based on whether we're using custom screenshots directory
    const imageUrl = env.SCREENSHOTS_DIR 
      ? `/screenshots/${filename}` // Production: nginx will serve from custom directory
      : `/screenshots/${filename}` // Development: served from public/screenshots
    
    return {
      success: true,
      imageUrl,
      filename
    }

  } catch (error) {
    console.error('Screenshot error:', error)
    
    // Provide user-friendly error messages using translations
    let userError = t('unexpected')
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      
      if (errorMessage.includes('timeout') || errorMessage.includes('navigation timeout')) {
        userError = t('timeout')
      } else if (errorMessage.includes('net::err_name_not_resolved') || errorMessage.includes('getaddrinfo enotfound')) {
        userError = t('dnsResolution')
      } else if (errorMessage.includes('net::err_connection_refused')) {
        userError = t('connectionRefused')
      } else if (errorMessage.includes('net::err_cert_') || errorMessage.includes('ssl') || errorMessage.includes('certificate')) {
        userError = t('sslCertificate')
      } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
        userError = t('accessDenied')
      } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        userError = t('pageNotFound')
      } else if (errorMessage.includes('500') || errorMessage.includes('internal server error')) {
        userError = t('serverError')
      }
    }
    
    return {
      success: false,
      error: userError
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
