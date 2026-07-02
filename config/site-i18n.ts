import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { FooterColumn, FooterLink, NavItem, SiteConfig } from "@/types"

// Resolve site URL safely for Edge runtime (avoid throwing in new URL)
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev'

// Extract domain name from siteUrl safely
let domainName = 'resizeimage.dev'
try {
  domainName = new URL(siteUrl).hostname.replace(/^www\./, "")
} catch { }

// Base site configuration (non-localized parts)
export const baseSiteConfig = {
  name: "ResizeImage.dev",
  companyName: "Crownbyte LTD",
  domainName: domainName,
  url: siteUrl,
  creator: "ShawnHacks",
  ogImage: `${siteUrl}/og.png`,
  links: {
    twitter: "https://x.com/intent/user?&region=follow&screen_name=ShawnHacks",
  },
  mailSupport: "support@resizeimage.dev",
}

/**
 * Get localized site configuration for server components
 * @param locale - The locale to get translations for
 * @returns Promise<SiteConfig> - Localized site configuration
 */
export async function getLocalizedSiteConfig(locale: string): Promise<SiteConfig> {
  const t = await getTranslations({ locale, namespace: 'SiteConfig' })

  // Convert keywords object to array
  const keywordsArray: string[] = []
  for (let i = 0; i < 6; i++) {
    try {
      const keyword = t(`keywords.${i}`)
      if (keyword) {
        keywordsArray.push(keyword)
      }
    } catch {
      // Stop when no more keywords
      break
    }
  }

  return {
    ...baseSiteConfig,
    title: t('title'),
    description: t('description'),
    keywords: keywordsArray,
    installApp: t('installApp'),
  }
}

/**
 * Hook to get localized site configuration for client components
 * @returns SiteConfig - Localized site configuration
 */
export function useLocalizedSiteConfig(): SiteConfig {
  const t = useTranslations('SiteConfig')

  // Convert keywords object to array
  const keywordsArray: string[] = []
  for (let i = 0; i < 6; i++) {
    try {
      const keyword = t(`keywords.${i}`)
      if (keyword) {
        keywordsArray.push(keyword)
      }
    } catch {
      // Stop when no more keywords
      break
    }
  }

  return {
    ...baseSiteConfig,
    title: t('title'),
    description: t('description'),
    keywords: keywordsArray,
    installApp: t('installApp')
  }
}

// Navigation items with translation keys
export const siteMainNavKeys: Array<{
  titleKey: string;
  href: string;
  children?: Array<{ titleKey: string; href: string; descKey?: string }>
}> = [
    {
      titleKey: "Tools.resizeimage",
      href: "/",
    },
    {
      titleKey: "Tools.bulkresizeimages",
      href: "/bulk-resize-images",
    },
    {
      titleKey: "Tools.stitchimages",
      href: "/stitch-images",
    },
    {
      titleKey: "Tools.imagecompressor",
      href: "/compress-image",
    },
    {
      titleKey: "GeminiWatermarkRemover.header.title",
      href: "/gemini-watermark-remover",
    },
    // {
    //   titleKey: "Header.Blog",
    //   href: "/blog",
    // },
    // {
    //   titleKey: "Header.About",
    //   href: "/about",
    // },
    // {
    //   titleKey: "Header.Blog",
    //   href: "/blog",
    // },
  ]

/**
 * Get localized navigation items for server components
 * @param locale - The locale to get translations for
 * @returns Promise<NavItem[]> - Localized navigation items
 */
export async function getLocalizedNavItems(locale: string): Promise<NavItem[]> {
  const t = await getTranslations({ locale })

  return siteMainNavKeys.map(item => ({
    title: t(item.titleKey as any),
    href: item.href,
    children: item.children?.map(child => ({
      title: t(child.titleKey as any),
      href: child.href,
      description: child.descKey ? t(child.descKey as any) : undefined
    }))
  }))
}

/**
 * Hook to get localized navigation items for client components
 * @returns NavItem[] - Localized navigation items
 */
export function useLocalizedNavItems(): NavItem[] {
  const t = useTranslations()

  return siteMainNavKeys.map(item => ({
    title: t(item.titleKey as any),
    href: item.href,
    children: item.children?.map(child => ({
      title: t(child.titleKey as any),
      href: child.href,
      description: child.descKey ? t(child.descKey as any) : undefined
    }))
  }))
}

// Footer configuration with translation keys
export const siteFooterConfigKeys: Array<{ titleKey: string; links: Array<{ labelKey: string; href: string; noTranslation?: boolean }> }> = [
  // {
  //   titleKey: "ImageConverterTool.title",
  //   links: conversions,
  // },
  {
    titleKey: "Footer.Tools",
    links: [
      {
        labelKey: "Tools.imageconverter",
        href: "/",
      },
      {
        labelKey: "Tools.imagecompressor",
        href: "/compress-image",
      },
      // {
      //   titleKey: "GeminiWatermarkRemover.title",
      //   href: "/gemini-watermark-remover",
      //   descKey: "GeminiWatermarkRemover.main.subtitle",
      // },
      {
        labelKey: "Tools.resizeimage",
        href: "/resize-image",
      },
      {
        labelKey: "Image Stitcher",
        href: "/stitch-images",
        noTranslation: true,
      },
      {
        labelKey: "Tools.bulkresizeimages",
        href: "/bulk-resize-images",
      },
      // {
      //   labelKey: "Footer.Features",
      //   href: "/#features",
      // },
      // {
      //   labelKey: "Footer.FAQ",
      //   href: "/#faq",
      // },
      // {
      //   labelKey: "Footer.About",
      //   href: "/about",
      // },
      // {
      //   labelKey: "Footer.Blog",
      //   href: "/blog",
      // },
      // {
      //   labelKey: "Footer.SiteMap",
      //   // note：must use absolute url，sitemap no locale prefix
      //   href: `${baseSiteConfig.url}/sitemap.xml`,
      // },
    ],
  },
  {
    titleKey: "Footer.Product",
    links: [
      {
        labelKey: "Screentell",
        href: "https://screentell.com",
        noTranslation: true,
      },
      {
        labelKey: "Beautyface AI",
        href: "https://beautyface.app",
        noTranslation: true,
      },
      {
        labelKey: "Bulk Resize Images Online",
        href: "https://bulkresizeimages.online",
        noTranslation: true,
      },
      {
        labelKey: "Website Screenshot Online",
        href: "https://websitescreenshot.online/",
        noTranslation: true,
      },
      {
        labelKey: "Cute Wallpaper",
        href: "https://cutewallpaper.site",
        noTranslation: true,
      },

      // {
      //   labelKey: "AIHuntList",
      //   href: "https://aihuntlist.com",
      //   noTranslation: true,
      // },
      // {
      //   labelKey: "TweetCloner",
      //   href: "https://tweetcloner.com",
      //   noTranslation: true,
      // },
      // {
      //   labelKey: "Gemlink.app",
      //   href: "https://gemlink.app",
      //   noTranslation: true,
      // },
      // {
      //   labelKey: "Footer.License",
      //   href: "/license",
      // },
      // {
      //   labelKey: "Footer.Contact",
      //   href: "/contact",
      // },
      // {
      //   labelKey: "Footer.Roadmap",
      //   href: "/roadmap",
      // },
    ],
  },
  {
    titleKey: "Footer.Company",
    links: [
      // {
      //   labelKey: "Footer.Documentation",
      //   href: "/docs",
      // },
      // {
      //   labelKey: "Footer.Blog",
      //   href: "/blog",
      // },
      {
        labelKey: "Footer.About",
        href: "/about",
      },
      {
        labelKey: "Footer.Contact",
        href: "/contact",
        noTranslation: false
      },
      // {
      //   labelKey: "Footer.Cookie Policy",
      //   href: "/cookie-policy",
      // },
      // {
      //   labelKey: "Footer.Privacy Policy",
      //   href: "/privacy-policy",
      // },
      // {
      //   labelKey: "Footer.Terms of Service",
      //   href: "/terms-of-service",
      // },
      // {
      //   labelKey: "Stripe Climate Member",
      //   href: "https://climate.stripe.com/4JAKCs",
      //   noTranslation: true,
      // },

      {
        labelKey: "Footer.Blog",
        href: "/blog",
      },
      {
        labelKey: "Footer.SiteMap",
        // note：must use absolute url，sitemap no locale prefix
        href: `${baseSiteConfig.url}/sitemap.xml`,
      },
    ],
  },
]



export const bottomLinksKeys: Array<{ labelKey: string; href: string, noTranslation?: boolean }> = [
  { labelKey: "Footer.Cookie Policy", href: "/cookie-policy", noTranslation: false },
  { labelKey: "Footer.Privacy Policy", href: "/privacy-policy", noTranslation: false },
  { labelKey: "Footer.Terms of Service", href: "/terms-of-service", noTranslation: false },
]

/**
 * Get localized footer configuration for server components
 * @param locale - The locale to get translations for
 * @returns Promise<{ footerConfig: FooterColumn[], bottomLinks: { label: string; href: string }[] }> - Localized footer configuration
 */
export async function getLocalizedFooterConfig(locale: string): Promise<{ footerColumns: FooterColumn[], bottomLinks: { label: string; href: string }[] }> {
  const t = await getTranslations({ locale })

  const footerColumns = siteFooterConfigKeys.map(column => ({
    title: t(column.titleKey as any),
    links: column.links.map(link => ({
      label: link.noTranslation ? link.labelKey : t(link.labelKey as any),
      href: link.href,
    })),
  }))

  const bottomLinks = bottomLinksKeys.map(link => ({
    label: link.noTranslation ? link.labelKey : t(link.labelKey as any),
    href: link.href,
  }))

  return { footerColumns, bottomLinks }
}

/**
 * Hook to get localized footer configuration for client components
 * @returns { footerConfig: FooterColumn[], bottomLinks: { label: string; href: string }[] } - Localized footer configuration
 */
export function useLocalizedFooterConfig(): { footerColumns: FooterColumn[], bottomLinks: { label: string; href: string }[] } {
  const t = useTranslations()

  return {
    footerColumns: siteFooterConfigKeys.map(column => ({
      title: t(column.titleKey as any),
      links: column.links.map(link => ({
        label: link.noTranslation ? link.labelKey : t(link.labelKey as any),
        href: link.href,
      })),
    })),
    bottomLinks: bottomLinksKeys.map(link => ({
      label: link.noTranslation ? link.labelKey : t(link.labelKey as any),
      href: link.href,
    })),
  }
}


