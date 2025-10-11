"use server"

import { chromium } from 'playwright'
import type { Page, Browser } from 'playwright'
import { stat, mkdir, readdir, unlink, rename } from 'fs/promises'
import { exec } from 'child_process'
import { join } from 'path'
import { VideoRecordingConfig, VideoRecordingResult } from '@/types/video-recording'
import { getLocale, getTranslations } from 'next-intl/server'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { env } from '@/env.mjs'
import { promisify } from 'util'

const execAsync = promisify(exec);

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
          console.log(`=== Found cookie popup: ${selector}`)
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
    // If cookie popup handling fails, continue with video recording
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

/**
 * Auto-scroll through the page with configurable distance and delay
 */
async function autoScroll(page: Page, scrollDistance: number, scrollDelay: number, maxScrollTime: number): Promise<void> {
  await page.evaluate(async ({ scrollDistance, scrollDelay, maxScrollTime }) => {
    const startTime = Date.now();
    const scrollableHeight = document.body.scrollHeight;
    const steps = Math.ceil(scrollableHeight / scrollDistance);

    for (let i = 0; i < steps; i++) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > maxScrollTime) {
        console.log(`Auto-scrolling timed out after ${maxScrollTime / 1000}s.`);
        break;
      }

      const atBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
      if (atBottom) {
        break;
      }

      window.scrollBy({ top: scrollDistance, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, scrollDelay));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));

  }, { scrollDistance, scrollDelay, maxScrollTime });
}

// Clean up expired video files (older than 24 hours)
async function cleanupExpiredVideos(): Promise<void> {
  try {
    // Use environment variable for videos directory, fallback to public/screenshots for development
    const videosDir = env.SCREENSHOTS_DIR || join(process.cwd(), 'public', 'screenshots')
    // Check if directory exists
    try {
      await stat(videosDir)
    } catch {
      // Directory doesn't exist, nothing to clean
      return
    }

    const files = await readdir(videosDir)
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    let deletedCount = 0
    
    for (const file of files) {
      const filePath = join(videosDir, file)
      
      try {
        // Skip non-video files
        if (!file.match(/\.(webm|mp4)$/i)) {
          continue
        }
        
        let shouldDelete = false
        
        // Try to extract timestamp from filename (format: domain-YYYY-MM-DD-timestamp.ext)
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
          console.log(`Deleted expired video: ${file}`)
        }
      } catch (error) {
        console.warn(`Failed to process file ${file}:`, error)
      }
    }
    
    if (deletedCount > 0) {
      console.log(`Video cleanup completed: deleted ${deletedCount} expired video(s)`)
    }
  } catch (error) {
    console.error('Video cleanup failed:', error)
  }
}

export async function recordWebsiteVideo(config: VideoRecordingConfig): Promise<VideoRecordingResult> {
  let browser: Browser | undefined;
  const locale = await getLocale()
  // const t = await getTranslations({ locale, namespace: 'VideoRecordingTool' })
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
      args: ['--disable-gpu', '--enable-hardware-acceleration']
    })

    // Create videos directory if it doesn't exist
    const videosDir = env.SCREENSHOTS_DIR || join(process.cwd(), 'public', 'screenshots')
    await mkdir(videosDir, { recursive: true })

    // --- Single Context Recording with Post-Trimming ---
    const context = await browser.newContext({
      viewport: { width: config.resolution.width, height: config.resolution.height },
      recordVideo: {
        dir: videosDir,
        size: { width: config.resolution.width, height: config.resolution.height },
      }
    })

    const page = await context.newPage()
    const video = page.video()
    if (!video) throw new Error('Could not start video recording.')

    // Block ads if requested
    if (config.blockAds) {
      await blockAds(page)
    }

    const startTime = Date.now()

    await page.goto(config.url, { waitUntil: 'load', timeout: 60000 })

    // Disable animations and transitions for a cleaner recording
    // await page.evaluate(() => {
    //   const style = document.createElement('style')
    //   style.textContent = `
    //     * {
    //       transition-property: none !important;
    //       transition-duration: 0s !important;
    //       transform: none !important;
    //       animation: none !important;
    //     }
    //   `
    //   document.head.appendChild(style)
    // })

    const delayInMs = (config.delay || 0) * 1000
    if (delayInMs > 0) {
      await page.waitForTimeout(delayInMs)
    }
    
    // Handle cookie/GDPR popups if enabled
    if (config.blockCookiesGdpr) {
      await handleCookiePopups(page)
    }
    await page.evaluate(() => { window.scrollTo(0, 0); })

    const endTime = Date.now()
    const trimDuration = (endTime - startTime) / 1000 // Duration to trim in seconds

    // Add a brief pause to ensure the top of the page is visible before scrolling
    await page.waitForTimeout(1000)

    const maxScrollTime = 60000; // 60 seconds max scroll time
    await autoScroll(page, config.scrollDistance, config.scrollDelay, maxScrollTime)
    await context.close()

    const webmPath = await video.path()

    // Generate filename
    const now = new Date()
    const timestamp = now.getTime()
    const dateStr = now.toISOString().split('T')[0]
    const domain = url.hostname.replace(/[^a-zA-Z0-9]/g, '-')
    const baseFilename = `${domain}-${dateStr}-${timestamp}`

    const outputFilename = `${baseFilename}.${config.format}`
    const outputFilePath = join(videosDir, outputFilename)
    const tempTrimmedPath = `${webmPath}.trimmed.${config.format}`

    try {
      if (config.format === 'mp4') {
        const trimCommand = `ffmpeg -ss ${trimDuration} -i "${webmPath}" -y -c:v libx264 -pix_fmt yuv420p "${outputFilePath}"`
        await execAsync(trimCommand);
      } else if (config.format === 'gif') {
        const convertGifCommand = `ffmpeg -ss ${trimDuration} -i "${webmPath}" -y -vf "fps=10,scale=w=${config.resolution.width}:h=-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${outputFilePath}"`
        await execAsync(convertGifCommand)
      } else { // webm
        const trimCommand = `ffmpeg -ss ${trimDuration} -i "${webmPath}" -y -c copy "${tempTrimmedPath}"`
        await execAsync(trimCommand)
        await rename(tempTrimmedPath, outputFilePath)
      }

      await unlink(webmPath)
    } catch (error) {
      // Cleanup original file on error
      try {
        await unlink(webmPath);
      } catch (cleanupError) {
        console.error('Failed to cleanup original video file:', cleanupError);
      }
      console.error(`ffmpeg error: ${error}`);
      throw new Error(`FFmpeg execution failed: ${error}`);
    }

    const videoUrl = `/screenshots/${outputFilename}`

    const result = {
      success: true,
      filename: outputFilename,
      videoUrl,
    }

    console.log('Video recording result:', result)

    // Clean up expired videos in the background
    setTimeout(() => {
      cleanupExpiredVideos().catch(error => {
        console.error('Background video cleanup failed:', error)
      })
    }, 1000)

    return result

  } catch (error) {
    let userError = 'An unexpected error occurred while recording the video'

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('timeout')) {
        userError = t('errors.timeout')
      } else if (errorMessage.includes('net::err_name_not_resolved')) {
        userError = t('errors.dnsResolution')
      } else if (errorMessage.includes('net::err_connection_refused')) {
        userError = t('errors.connectionRefused')
      } else if (errorMessage.includes('certificate')) {
        userError = t('errors.sslCertificate')
      } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
        userError = t('errors.accessDenied')
      } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        userError = t('errors.pageNotFound')
      } else if (errorMessage.includes('500') || errorMessage.includes('internal server error')) {
        userError = t('errors.serverError')
      }
    }
    console.error('Video recording error:', error)
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
