"use client"

import { useState, useTransition, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Turnstile } from '@marsidev/react-turnstile'
import { Download, Camera, Globe, Monitor, Smartphone, Square, Maximize, AlertCircle, Shield, Cookie, Ban, X, Timer } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from "@/components/ui/switch"
import { Progress } from '@/components/ui/progress'
import { BorderBeam } from "@/components/magicui/border-beam";
import { takeScreenshot } from '@/lib/actions/screenshot'
import { env } from '@/env.mjs'
import { 
  ScreenshotConfig, 
  ScreenshotResult, 
  AVAILABLE_RESOLUTIONS,
} from '@/types/screenshot'

interface ScreenshotToolProps {
  presetConfig?: Partial<ScreenshotConfig>;
  hideTitle?: boolean;
}

export function ScreenshotTool({ presetConfig = {}, hideTitle = false }: ScreenshotToolProps) {
  const t = useTranslations('ScreenshotTool')
  const [isPending, startTransition] = useTransition()
  const turnstileRef = useRef<any>(null)
  
  // Initialize config with defaults and override with presetConfig
  const [config, setConfig] = useState<ScreenshotConfig>(() => {
    const defaultConfig: ScreenshotConfig = {
      url: '',
      resolution: AVAILABLE_RESOLUTIONS[4], // Default to 1600×900
      fullSize: false,
      format: 'png',
      blockCookiesGdpr: true,
      blockAds: true,
      delay: 2,
    };
    
    // Deep merge to ensure nested objects are properly merged
    return {
      ...defaultConfig,
      ...presetConfig,
      // Ensure resolution is properly set if provided in presetConfig
      resolution: presetConfig.resolution || defaultConfig.resolution,
    };
  })
  
  const [result, setResult] = useState<ScreenshotResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [turnstileError, setTurnstileError] = useState<string>('')
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  // Function to proceed with screenshot after Turnstile verification
  const proceedWithScreenshot = (token: string) => {
    startTransition(async () => {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      try {
        const configWithToken = {
          ...config,
          turnstileToken: token
        }
        const screenshotResult = await takeScreenshot(configWithToken)
        clearInterval(progressInterval)
        setProgress(100)
        
        // Check if the result indicates token verification failure
        if (!screenshotResult.success && 
            (screenshotResult.error?.includes('Security verification failed') || 
             screenshotResult.error?.includes('Security verification required'))) {
          // Token expired or invalid, clear it and show Turnstile again
          setTurnstileToken('')
          setShowTurnstile(true)
          setTurnstileError(t('captchaExpired'))
          setProgress(0)
          // Reset Turnstile widget if available
          if (turnstileRef.current) {
            turnstileRef.current.reset()
          }
          return
        }
        
        setResult(screenshotResult)
        
        // Reset token after successful screenshot to prevent reuse
        if (screenshotResult.success) {
          setTurnstileToken('')
          if (turnstileRef.current) {
            turnstileRef.current.reset()
          }
        }
      } catch (error) {
        console.error('Error taking screenshot:', error)
        clearInterval(progressInterval)
        setProgress(0)
        setResult({
          success: false,
          error: 'Failed to take screenshot'
        })
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!config.url) {
      return
    }

    // If no Turnstile token, show Turnstile verification
    if (!turnstileToken) {
      setShowTurnstile(true)
      setTurnstileError('')
      return
    }

    setResult(null)
    setProgress(0)
    setTurnstileError('')

    proceedWithScreenshot(turnstileToken)
  }

  // Turnstile callback functions
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token)
    setTurnstileError('')
    setIsVerifying(false)
    setShowTurnstile(false) // Hide Turnstile after success
    // Auto-submit after successful verification
    setTimeout(() => {
      if (config.url) {
        proceedWithScreenshot(token)
      }
    }, 100)
  }

  const handleTurnstileError = () => {
    setTurnstileToken('')
    setTurnstileError(t('captchaFailed'))
    setIsVerifying(false)
  }

  const handleTurnstileExpire = () => {
    setTurnstileToken('')
    setTurnstileError(t('captchaExpired'))
    setIsVerifying(false)
  }

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a')
      link.href = result.imageUrl
      link.download = result.filename || 'screenshot'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageModal) {
        setShowImageModal(false)
      }
    }

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [showImageModal])

  const getResolutionIcon = (iconType: string) => {
    switch (iconType) {
      case 'monitor':
        return <Monitor className="h-4 w-4" />
      case 'square':
        return <Square className="h-4 w-4" />
      case 'smartphone':
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pt-6">
      {/* URL Input */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          {/* <label htmlFor="url" className="text-sm font-medium">
            {t('urlLabel')}
          </label> */}
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="url"
              type="url"
              placeholder={t('urlPlaceholder')}
              value={config.url}
              onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Output Settings */}
          <div className="lg:col-span-2 space-y-4">
            {/* Resolution & Format */}
            <div className="bg-card border rounded-lg p-4">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {t('outputSettings')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resolution Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('resolution')}</label>
                  <Select
                    value={`${config.resolution.width}x${config.resolution.height}`}
                    onValueChange={(value) => {
                      const resolution = AVAILABLE_RESOLUTIONS.find(r => `${r.width}x${r.height}` === value)
                      if (resolution) {
                        setConfig(prev => ({ ...prev, resolution }))
                      }
                    }}
                  >
                    <SelectTrigger className="h-10" aria-label={t('selectResolution')}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_RESOLUTIONS.map((resolution) => (
                        <SelectItem key={`${resolution.width}x${resolution.height}`} value={`${resolution.width}x${resolution.height}`}>
                          <div className="flex items-center gap-2">
                            {getResolutionIcon(resolution.icon)}
                            <span>{resolution.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Output Format */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('format')}</label>
                  <div className="flex gap-1 p-1 bg-muted rounded-lg">
                    {(['png', 'jpeg', 'pdf'] as const).map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setConfig(prev => ({ ...prev, format }))}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                          config.format === format
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Size Toggle */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium">{t('fullSize')}</label>
                      <p className="text-xs text-muted-foreground">
                        {config.fullSize ? t('fullSizeOn') : t('fullSizeOff')}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.fullSize}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, fullSize: checked }))
                    }
                    aria-label={t('fullSize')}
                  />
                </div>
              </div>
            </div>

            {/* Optimization Options */}
            <div className="bg-card border rounded-lg p-4">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t('optimizationOptions')}
              </h2>
              <div className="space-y-4">
                {/* Cookie Handling */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cookie className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium">{t('blockCookiesGdpr')}</label>
                      <p className="text-xs text-muted-foreground">
                        {config.blockCookiesGdpr ? t('blockCookiesGdprOn') : t('blockCookiesGdprOff')}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.blockCookiesGdpr}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, blockCookiesGdpr: checked }))
                    }
                    aria-label={t('blockCookiesGdpr')}
                  />
                </div>

                {/* Ad Blocking */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium">{t('blockAds')}</label>
                      <p className="text-xs text-muted-foreground">
                        {config.blockAds ? t('blockAdsOn') : t('blockAdsOff')}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.blockAds}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, blockAds: checked }))
                    }
                    aria-label={t('blockAds')}
                  />
                </div>

                {/* Capture Delay */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium">{t('captureDelay')}</label>
                      <p className="text-xs text-muted-foreground">
                        {t('captureDelayDescription')}
                      </p>
                    </div>
                  </div>
                  <Select
                    value={String(config.delay)}
                    onValueChange={(value) =>
                      setConfig(prev => ({ ...prev, delay: Number(value) }))
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select delay" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0s</SelectItem>
                      <SelectItem value="2">2s</SelectItem>
                      <SelectItem value="5">5s</SelectItem>
                      <SelectItem value="10">10s</SelectItem>
                      <SelectItem value="20">20s</SelectItem>
                      <SelectItem value="30">30s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 h-full flex flex-col justify-center">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                    {t('readyToCapture')}
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {t('captureDescription')}
                  </p>
                </div>
                
                {/* Turnstile Security Verification - Only show when needed */}
                {showTurnstile && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('captchaRequired')}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                        onSuccess={handleTurnstileSuccess}
                        onError={handleTurnstileError}
                        onExpire={handleTurnstileExpire}
                        options={{
                          theme: 'auto',
                          size: 'flexible'
                        }}
                      />
                    </div>
                    {turnstileError && (
                      <div className="flex items-center justify-center text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {turnstileError}
                      </div>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isPending || !config.url || showTurnstile}
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-medium"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/80 border-t-transparent mr-2" />
                      {t('taking')}
                    </>
                  ) : showTurnstile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/80 border-t-transparent mr-2" />
                      {t('captchaRequired')}
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      {t('takeSnapshot')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Progress Bar */}
      {isPending && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('processing')}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {result.success && result.imageUrl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('result')}</h2>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t('download')}
                </Button>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                {config.format === 'pdf' ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-muted-foreground">{t('pdfGenerated')}</p>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowImageModal(true)}
                    title="Click to view full size"
                  >
                    <Image 
                      src={result.imageUrl} 
                      alt="Screenshot" 
                      width={800}
                      height={600}
                      className="w-full h-auto max-h-96 object-contain"
                      unoptimized
                    />
                  </div>
                )}

                <BorderBeam
                  duration={6}
                  size={400}
                  className="from-transparent via-green-600 dark:via-white to-transparent"
                />
                <BorderBeam
                  duration={6}
                  delay={3}
                  size={400}
                  borderWidth={2}
                  className="from-transparent via-green-600 dark:via-white to-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-destructive mb-1">{t('errorTitle')}</h3>
                    <p className="text-destructive/80 text-sm">{result.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && result?.success && result.imageUrl && config.format !== 'pdf' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-4 overflow-y-auto">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background/75 text-foreground rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                setShowImageModal(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image 
              src={result.imageUrl} 
              alt="Screenshot - Full Size" 
              width={1920}
              height={1080}
              className="max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  )
}
