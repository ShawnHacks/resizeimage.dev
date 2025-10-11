import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { FooterColumn, FooterLink, NavItem, SiteConfig } from "@/types"
import { env } from "@/env.mjs"

const siteUrl = env.NEXT_PUBLIC_APP_URL

// Extract domain name from siteUrl
const domainName = new URL(siteUrl).hostname.replace(/^www\./, "")

// Base site configuration (non-localized parts)
export const baseSiteConfig = {
  name: "BulkResizeImages",
  companyName: "Crownbyte LTD",
  domainName: domainName,
  url: siteUrl,
  creator: "ShawnHacks",
  ogImage: `${siteUrl}/og.png`,
  links: {
    twitter: "https://x.com/intent/user?&region=follow&screen_name=ShawnHacks",
  },
  mailSupport: "support@nestsaas.com",
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
  }
}

// Navigation items with translation keys
export const siteMainNavKeys: Array<{ titleKey: string; href: string }> = [
  // {
  //   titleKey: "Header.Features", 
  //   href: "/#features",
  // },
  // {
  //   titleKey: "Header.FAQ",
  //   href: "/#faq",
  // },
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
  }))
}

// Footer configuration with translation keys
export const siteFooterConfigKeys: Array<{ titleKey: string; links: Array<{ labelKey: string; href: string; noTranslation?: boolean }> }> = [
  {
    titleKey: "Footer.Product",
    links: [
      // {
      //   labelKey: "Footer.Features",
      //   href: "/#features",
      // },
      // {
      //   labelKey: "Footer.FAQ",
      //   href: "/#faq",
      // },
      {
        labelKey: "Footer.About",
        href: "/about",
      },
      {
        labelKey: "Footer.SiteMap",
        href: `${siteUrl}/sitemap.xml`,
      },
    ],
  },
  {
    titleKey: "Footer.Resources",
    links: [
      {
        labelKey: "NestSaaS",
        href: "https://nestsaas.com",
        noTranslation: true,
      },
      {
        labelKey: "AIHuntList",
        href: "https://aihuntlist.com",
        noTranslation: true,
      },
      {
        labelKey: "TweetCloner",
        href: "https://tweetcloner.com",
        noTranslation: true,
      },
      {
        labelKey: "Gemlink.app",
        href: "https://gemlink.app",
        noTranslation: true,
      },
      {
        labelKey: "Twitter Video Downloader",
        href: "https://twittervideodownloader.top",
        noTranslation: true,
      },
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
        labelKey: "Footer.Cookie Policy",
        href: "/cookie-policy",
      },
      {
        labelKey: "Footer.Privacy Policy",
        href: "/privacy-policy",
      },
      {
        labelKey: "Footer.Terms of Service",
        href: "/terms-of-service",
      },
    ],
  },
]


// export const bottomLinksKeys: Array<{ labelKey: string; href: string }> = [
//   { labelKey: "Footer.Cookie Policy", href: "/cookie-policy" },
//   { labelKey: "Footer.Privacy Policy", href: "/privacy" },
//   { labelKey: "Footer.Terms of Service", href: "/terms" },
// ]

/**
 * Get localized footer configuration for server components
 * @param locale - The locale to get translations for
 * @returns Promise<FooterColumn[]> - Localized footer configuration
 */
export async function getLocalizedFooterConfig(locale: string): Promise<FooterColumn[]> {
  const t = await getTranslations({ locale })
  
  return siteFooterConfigKeys.map(column => ({
    title: t(column.titleKey as any),
    links: column.links.map(link => ({
      label: link.noTranslation ? link.labelKey : t(link.labelKey as any),
      href: link.href,
    })),
  }))
}

/**
 * Hook to get localized footer configuration for client components
 * @returns FooterColumn[] - Localized footer configuration
 */
export function useLocalizedFooterConfig(): FooterColumn[] {
  const t = useTranslations()
  
  return siteFooterConfigKeys.map(column => ({
    title: t(column.titleKey as any),
    links: column.links.map(link => ({
      label: link.noTranslation ? link.labelKey : t(link.labelKey as any),
      href: link.href,
    })),
  }))
}


