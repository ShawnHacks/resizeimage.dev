export type VideoFormat = 'webm' | 'mp4' | 'gif'

export const AVAILABLE_VIDEO_FORMATS: VideoFormat[] = ['webm', 'mp4', 'gif']

export interface VideoRecordingConfig {
  url: string
  resolution: Resolution
  format: VideoFormat
  scrollDistance: number
  scrollDelay: number
  blockCookiesGdpr: boolean
  blockAds: boolean
  turnstileToken?: string
  delay?: number
}

export interface VideoRecordingResult {
  success: boolean
  videoUrl?: string
  error?: string
  filename?: string
}

export interface Resolution {
  width: number
  height: number
  label: string
  category: 'desktop' | 'mobile'
  icon: string
}

export const AVAILABLE_VIDEO_RESOLUTIONS: Resolution[] = [
  // Desktop - optimized for video recording
  { width: 1280, height: 720, label: '1280×720 (HD)', category: 'desktop', icon: 'monitor' },
  { width: 1600, height: 900, label: '1600×900 (HD+)', category: 'desktop', icon: 'monitor' },
  { width: 1920, height: 1080, label: '1920×1080 (Full HD)', category: 'desktop', icon: 'monitor' },
  
  // Mobile
  { width: 375, height: 667, label: 'iPhone 6/7/8 (375×667)', category: 'mobile', icon: 'smartphone' },
  { width: 375, height: 812, label: 'iPhone X (375×812)', category: 'mobile', icon: 'smartphone' },
  { width: 414, height: 896, label: 'iPhone XR (414×896)', category: 'mobile', icon: 'smartphone' },
]

export const SCROLL_DISTANCES = [
  { value: 200, label: '200px (slow)' },
  { value: 300, label: '300px (slow)' },
  { value: 400, label: '400px (Normal)' },
  { value: 500, label: '500px (Normal)' },
  { value: 600, label: '600px (Fast)' },
  { value: 800, label: '800px (Very Fast)' },
]

export const SCROLL_DELAYS = [
  { value: 200, label: '200ms (Very Fast)' },
  { value: 500, label: '500ms (Fast)' },
  { value: 1000, label: '1000ms (Normal)' },
  { value: 1200, label: '1200ms (Normal)' },
  { value: 1500, label: '1500ms (Slow)' },
  { value: 2000, label: '2000ms (Very Slow)' },
  { value: 3000, label: '3000ms (Very Very Slow)' },
]
