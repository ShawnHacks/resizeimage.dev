import type { MetadataRoute } from 'next'
import { routing } from "@/i18n/routing"
import { getBlogPosts } from '@/lib/blog-simple'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://websitescreenshot.online'
  
  const locales = routing.locales
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.8, changeFreq: 'weekly' as const },
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

// 导出 sitemap 生成器配置
// export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 每天重新生成一次