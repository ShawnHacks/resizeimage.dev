import { routing, EN as DEFAULT_LOCALE, localeNames } from "@/i18n/routing"
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

const getCategoryName = (categorySlug: string): string => {
  const categoryNames: Record<string, string> = {
    'tutorials': 'Tutorials',
    'tools-comparison': 'Tools Comparison',
    'optimization-guides': 'Optimization Guides',
    'use-cases': 'Use Cases',
  }
  return categoryNames[categorySlug] || categorySlug
}

async function generateLLMsTxt(): Promise<string> {
  const baseUrl = baseSiteConfig.url
  const locales = routing.locales
  
  const mainRoutes = [
    { path: '', title: 'Home', description: 'Free online image resizer - resize images instantly in your browser' },
    { path: '/about', title: 'About', description: 'Learn about ResizeImage.dev' },
    { path: '/blog', title: 'Blog', description: 'Image resizing tutorials, guides, and tips' },
  ]

  const posts = await getBlogPosts()
  const postsBySlug = groupPostsBySlug(posts)
  const categories = await getCategories()
  
  const postsByCategory = posts.reduce<Map<string, SimpleBlogPost[]>>((map, post) => {
    const list = map.get(post.category) ?? []
    list.push(post)
    map.set(post.category, list)
    return map
  }, new Map<string, SimpleBlogPost[]>())

  let content = `# ${baseSiteConfig.name}\n\n`
  content += `> Best free image resizer online tool. Resize image, instantly in your browser. Professional photo resizer free with no uploads.\n\n`

  // Main pages
  content += `## Main Pages\n\n`
  for (const route of mainRoutes) {
    const url = buildUrl(baseUrl, defaultLocale, route.path)
    content += `- [${route.title}](${url}): ${route.description}\n`
  }
  content += `\n`

  // Tools
  content += `## Tools\n\n`
  content += `- [Image Resizer](${baseUrl}/resize-image): Single image resizer with visual crop editor\n`
  // content += `- [Bulk Resize Images](${baseUrl}/bulk-resize-images): Batch resize multiple images at once\n`
  // content += `- [Image Converter](${baseUrl}/image-converter): Convert images between formats (JPG, PNG, WebP)\n`
  content += `\n`

  // Blog categories
  content += `## Blog Categories\n\n`
  for (const category of categories) {
    const categoryPosts = postsByCategory.get(category.slug) ?? []
    const enPosts = categoryPosts.filter(post => post.language === 'en')
    const url = buildUrl(baseUrl, defaultLocale, `/blog/category/${category.slug}`)
    content += `- [${getCategoryName(category.slug)}](${url}): ${category.description} (${enPosts.length} articles)\n`
  }
  content += `\n`

  // Featured blog posts (English only)
  content += `## Featured Blog Posts\n\n`
  const enPosts = posts.filter(post => post.language === 'en')
  const featuredPosts = enPosts.filter(post => post.featured).slice(0, 5)
  const recentPosts = featuredPosts.length < 5 
    ? [...featuredPosts, ...enPosts.filter(post => !post.featured).slice(0, 5 - featuredPosts.length)]
    : featuredPosts

  for (const post of recentPosts) {
    const url = buildUrl(baseUrl, defaultLocale, `/blog/${post.slug}`)
    content += `- [${post.title}](${url}): ${post.description}\n`
  }
  content += `\n`

  // All blog posts by category
  content += `## All Blog Posts\n\n`
  for (const category of categories) {
    const categoryPosts = postsByCategory.get(category.slug) ?? []
    const enCategoryPosts = categoryPosts.filter(post => post.language === 'en')
    
    if (enCategoryPosts.length > 0) {
      content += `### ${getCategoryName(category.slug)}\n\n`
      for (const post of enCategoryPosts) {
        const url = buildUrl(baseUrl, defaultLocale, `/blog/${post.slug}`)
        content += `- [${post.title}](${url})\n`
      }
      content += `\n`
    }
  }

  // Multilingual content
  content += `## Available Languages\n\n`
  for (const locale of locales) {
    if (locale === defaultLocale) continue
    const localeName = localeNames[locale] || locale
    const homeUrl = buildUrl(baseUrl, locale, '')
    content += `- [${localeName}](${homeUrl})\n`
  }
  content += `\n`

  // Key features
  content += `## Key Features\n\n`
  content += `- **Client-side Processing**: All image processing happens in your browser - images never leave your device\n`
  content += `- **100% Free**: No limitations, watermarks, or hidden fees\n`
  content += `- **No Upload Required**: Your images stay on your device for complete privacy\n`
  content += `- **Multiple Formats**: Support for JPG, PNG, and WebP\n`
  content += `- **Batch Processing**: Resize multiple images at once\n`
  content += `- **Social Media Presets**: Quick presets for Instagram, Facebook, Twitter, YouTube, and more\n`
  content += `- **No Registration**: Use all features without creating an account\n`
  content += `\n`

  // Contact
  content += `## Contact\n\n`
  content += `- Email: ${baseSiteConfig.mailSupport}\n`
  content += `- Website: ${baseUrl}\n`
  content += `\n`

  // Footer
  content += `---\n\n`
  content += `Last updated: ${new Date().toISOString().split('T')[0]}\n`

  return content
}

export async function GET() {
  try {
    const content = await generateLLMsTxt()
    
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('Error generating llms.txt:', error)
    return new Response('Error generating llms.txt', { status: 500 })
  }
}

// Revalidate every day
export const revalidate = 86400
