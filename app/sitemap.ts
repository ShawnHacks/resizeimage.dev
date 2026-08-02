import type { MetadataRoute } from 'next'
import { routing, EN as DEFAULT_LOCALE } from "@/i18n/routing"
import { getBlogPosts, getCategories } from '@/lib/blog-static'
import type { SimpleBlogPost } from '@/lib/blog-static'
import { baseSiteConfig } from "@/config/site-i18n"

const defaultLocale = routing.defaultLocale ?? DEFAULT_LOCALE

const normalisePath = (path: string): string => {
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

const buildUrl = (baseUrl: string, locale: string, path: string): string => {
  const localePrefix = locale === defaultLocale ? '' : `/${locale}`
  const normalizedPath = normalisePath(path)
  return `${baseUrl}${localePrefix}${normalizedPath}`
}

const toDate = (value?: string): Date | undefined => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const getLatestDate = (posts: SimpleBlogPost[]): Date | undefined =>
  posts.reduce<Date | undefined>((latest, post) => {
    const candidate = toDate(post.updatedAt) ?? toDate(post.publishedAt)
    if (!candidate) {
      return latest
    }
    if (!latest || candidate.getTime() > latest.getTime()) {
      return candidate
    }
    return latest
  }, undefined)

const groupPostsBySlug = (posts: SimpleBlogPost[]): Map<string, SimpleBlogPost[]> => {
  return posts.reduce((map, post) => {
    const list = map.get(post.slug) ?? []
    list.push(post)
    map.set(post.slug, list)
    return map
  }, new Map<string, SimpleBlogPost[]>())
}

const pickPostForLocale = (posts: SimpleBlogPost[], locale: string): SimpleBlogPost | undefined => {
  return posts.find(post => post.language === locale)
    ?? posts.find(post => post.language === defaultLocale)
    ?? posts[0]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = baseSiteConfig.url
  const locales = routing.locales
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/bulk-resize-images', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/stitch-images', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/image-converter', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/gemini-watermark-remover', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/compress-image', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/image-converter/png-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/png-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/jpg-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/jpg-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/webp-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/webp-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/svg-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/svg-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/svg-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/heic-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/heic-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/heic-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/avif-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/avif-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/avif-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/tiff-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/tiff-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/tiff-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/gif-to-png', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/gif-to-jpg', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/image-converter/gif-to-webp', priority: 0.6, changeFreq: 'monthly' as const },
    // { path: '/pricing', priority: 1.0, changeFreq: 'daily' as const },
    // { path: '/docs', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/blog', priority: 0.5, changeFreq: 'weekly' as const },
    { path: '/about', priority: 0.3, changeFreq: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFreq: 'monthly' as const },
    { path: '/terms-of-service', priority: 0.3, changeFreq: 'monthly' as const },
    { path: '/cookie-policy', priority: 0.3, changeFreq: 'monthly' as const },
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  const posts = await getBlogPosts()
  const postsBySlug = groupPostsBySlug(posts)
  const postsByCategory = posts.reduce<Map<string, SimpleBlogPost[]>>((map, post) => {
    const list = map.get(post.category) ?? []
    list.push(post)
    map.set(post.category, list)
    return map
  }, new Map<string, SimpleBlogPost[]>())

  routes.forEach(route => {
    locales.forEach(locale => {
      const url = buildUrl(baseUrl, locale, route.path)
      const alternateLanguages: Record<string, string> = {}

      locales.forEach(altLocale => {
        alternateLanguages[altLocale] = buildUrl(baseUrl, altLocale, route.path)
      })
      alternateLanguages['x-default'] = buildUrl(baseUrl, defaultLocale, route.path)

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
        alternates: {
          languages: alternateLanguages,
        },
      })
    })
  })

  const categories = await getCategories()

  categories.forEach(category => {
    const categoryPosts = postsByCategory.get(category.slug) ?? []

    locales.forEach(locale => {
      const localePosts = categoryPosts.filter(post => post.language === locale)
      const fallbackPosts = localePosts.length > 0
        ? localePosts
        : categoryPosts.filter(post => post.language === defaultLocale)
      const relevantPosts = fallbackPosts.length > 0 ? fallbackPosts : categoryPosts
      const lastModified = getLatestDate(relevantPosts) ?? new Date()

      const path = `/blog/category/${category.slug}`
      const url = buildUrl(baseUrl, locale, path)
      const alternateLanguages: Record<string, string> = {}

      locales.forEach(altLocale => {
        alternateLanguages[altLocale] = buildUrl(baseUrl, altLocale, path)
      })
      alternateLanguages['x-default'] = buildUrl(baseUrl, defaultLocale, path)

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: alternateLanguages,
        },
      })
    })
  })

  postsBySlug.forEach((slugPosts, slug) => {
    locales.forEach(locale => {
      const localizedPost = pickPostForLocale(slugPosts, locale)
      if (!localizedPost) {
        return
      }

      // If the post language doesn't match the current locale (and it's not the default locale),
      // it means we are checking a fallback post. We should NOT include this in the sitemap
      // to avoid duplicate content issues (serving English content on /es/ URL).
      if (locale !== defaultLocale && localizedPost.language !== locale) {
        return
      }

      const path = `/blog/${localizedPost.slug}`
      const url = buildUrl(baseUrl, locale, path)
      const alternateLanguages: Record<string, string> = {}

      locales.forEach(altLocale => {
        const altPost = pickPostForLocale(slugPosts, altLocale) ?? localizedPost
        alternateLanguages[altLocale] = buildUrl(baseUrl, altLocale, `/blog/${altPost.slug}`)
      })
      alternateLanguages['x-default'] = buildUrl(baseUrl, defaultLocale, `/blog/${slug}`)

      sitemapEntries.push({
        url,
        lastModified: toDate(localizedPost.updatedAt) ?? toDate(localizedPost.publishedAt) ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: alternateLanguages,
        },
      })
    })
  })

  return sitemapEntries
}

// regenerate sitemap every day
export const revalidate = 86400;
