export interface Resolution {
  width: number
  height: number
  label: string
  category: 'desktop' | 'mobile'
  icon: string
}

export type OutputFormat = 'png' | 'jpeg' | 'pdf'

export interface ScreenshotConfig {
  url: string
  resolution: Resolution
  fullSize: boolean
  format: OutputFormat
  blockCookiesGdpr: boolean
  blockAds: boolean
  turnstileToken?: string
  delay?: number
}

export interface ScreenshotResult {
  success: boolean
  imageUrl?: string
  error?: string
  filename?: string
}

export const AVAILABLE_RESOLUTIONS: Resolution[] = [
  // Desktop
  { width: 1280, height: 720, label: '1280×720 (16:9)', category: 'desktop', icon: 'monitor' },
  { width: 1280, height: 800, label: '1280×800 (16:10)', category: 'desktop', icon: 'monitor' },
  { width: 1280, height: 1024, label: '1280×1024 (5:4)', category: 'desktop', icon: 'monitor' },
  { width: 1366, height: 768, label: '1366×768 (16:9)', category: 'desktop', icon: 'monitor' },
  { width: 1600, height: 900, label: '1600×900 (16:9)', category: 'desktop', icon: 'monitor' },
  { width: 1920, height: 1080, label: '1920×1080 (16:9)', category: 'desktop', icon: 'monitor' },
  { width: 1080, height: 1080, label: '1080×1080 (1:1)', category: 'desktop', icon: 'square' },
  
  // Mobile
  { width: 360, height: 640, label: 'Galaxy S10 (360×640)', category: 'mobile', icon: 'smartphone' },
  { width: 375, height: 667, label: 'iPhone 6/7/8 (375×667)', category: 'mobile', icon: 'smartphone' },
  { width: 375, height: 812, label: 'iPhone X (375×812)', category: 'mobile', icon: 'smartphone' },
  { width: 414, height: 736, label: 'iPhone 6+/7+/8+ (414×736)', category: 'mobile', icon: 'smartphone' },
  { width: 414, height: 896, label: 'iPhone XR (414×896)', category: 'mobile', icon: 'smartphone' },
]
