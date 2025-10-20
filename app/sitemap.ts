import type { MetadataRoute } from 'next'
import { routing } from "@/i18n/routing"
import { getBlogPosts, getCategories } from '@/lib/blog-static'
import { baseSiteConfig } from "@/config/site-i18n"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = baseSiteConfig.url
  
  const locales = routing.locales
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    // { path: '/pricing', priority: 1.0, changeFreq: 'daily' as const },
    // { path: '/docs', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/blog', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/about', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/privacy-policy', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/terms-of-service', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/cookie-policy', priority: 0.6, changeFreq: 'monthly' as const },
  ]
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  routes.forEach(route => {
    // Add localized routes for each locale
    locales.forEach(locale => {
      const url = `${baseUrl}/${locale}${route.path}`
      const alternateLanguages: Record<string, string> = {}
      
      // Create alternate language entries
      locales.forEach(altLocale => {
        alternateLanguages[altLocale] = `${baseUrl}/${altLocale}${route.path}`
      })
      
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
    locales.forEach(locale => {
      const url = `${baseUrl}/${locale}/blog/category/${category.slug}`
      const alternateLanguages: Record<string, string> = {}
      
      // Create alternate language entries
      locales.forEach(altLocale => {
        alternateLanguages[altLocale] = `${baseUrl}/${altLocale}/blog/category/${category.slug}`
      })
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: alternateLanguages,
        },
      })
    })
  })
  
  const posts = await getBlogPosts()
  
  posts.forEach(post => {
    locales.forEach(locale => {
      const url = `${baseUrl}/${locale}/blog/${post.slug}`
      const alternateLanguages: Record<string, string> = {}
      
      // Create alternate language entries
      locales.forEach(altLocale => {
        alternateLanguages[altLocale] = `${baseUrl}/${altLocale}/blog/${post.slug}`
      })
    
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
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