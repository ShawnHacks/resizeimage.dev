import { join } from 'path'
import { readFileSync, readdirSync, existsSync } from 'fs'
import matter from 'gray-matter'
import { calculateReadingTime } from './utils'

// 简化的博客类型定义
export interface SimpleBlogPost {
  slug: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  language: string
  availableLanguages: string[]
  featuredImage?: string
  featured?: boolean
  keywords?: string[]
  ogImage?: string
}

export interface BlogCategory {
  slug: string
  name: string
  description: string
  color: string
  icon: string
  translations: Record<string, { name: string; description: string }>
  postCount: number
}

const CONTENT_DIR = join(process.cwd(), 'content', 'blog')

// 获取所有分类
export async function getCategories(): Promise<BlogCategory[]> {
  try {
    if (!existsSync(CONTENT_DIR)) {
      return []
    }

    const categoryDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const categories: BlogCategory[] = []

    for (const categorySlug of categoryDirs) {
      const categoryPath = join(CONTENT_DIR, categorySlug)
      const categoryConfigPath = join(categoryPath, 'category.json')
      
      if (existsSync(categoryConfigPath)) {
        const configContent = readFileSync(categoryConfigPath, 'utf-8')
        const config = JSON.parse(configContent)
        
        // 计算该分类下的文章数量
        const postDirs = readdirSync(categoryPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
        
        categories.push({
          slug: categorySlug,
          ...config,
          postCount: postDirs.length
        })
      }
    }

    return categories
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

// 获取分类信息
export async function getCategory(slug: string): Promise<BlogCategory | null> {
  const categories = await getCategories()
  return categories.find(cat => cat.slug === slug) || null
}

// 获取所有博客文章
export async function getBlogPosts(language?: string): Promise<SimpleBlogPost[]> {
  try {
    if (!existsSync(CONTENT_DIR)) {
      return []
    }

    const posts: SimpleBlogPost[] = []
    const categoryDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    for (const categoryDir of categoryDirs) {
      const categoryPath = join(CONTENT_DIR, categoryDir.name)
      const postDirs = readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())

      for (const postDir of postDirs) {
        const postPath = join(categoryPath, postDir.name)
        const availableLanguages: string[] = []
        let postData: SimpleBlogPost | null = null

        // 检查可用语言
        const files = readdirSync(postPath)
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const lang = file.replace('.mdx', '')
            availableLanguages.push(lang)
          }
        }

        // 获取指定语言或默认语言的内容
        const targetLang = language || 'en'
        const fallbackLang = availableLanguages.includes('en') ? 'en' : availableLanguages[0]
        const useLang = availableLanguages.includes(targetLang) ? targetLang : fallbackLang

        if (useLang) {
          const filePath = join(postPath, `${useLang}.mdx`)
          if (existsSync(filePath)) {
            const fileContent = readFileSync(filePath, 'utf-8')
            const { data, content } = matter(fileContent)

            postData = {
              slug: postDir.name,
              title: data.title || '',
              description: data.description || '',
              content,
              category: categoryDir.name,
              tags: data.tags || [],
              author: data.author || 'Admin',
              publishedAt: data.publishedAt || new Date().toISOString(),
              updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
              readingTime: calculateReadingTime(content),
              language: useLang,
              availableLanguages,
              featuredImage: data.featuredImage,
              featured: data.featured || false
            }

            posts.push(postData)
          }
        }
      }
    }

    // 按发布日期排序（最新的在前）
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

// 获取单篇文章
export async function getBlogPost(slug: string, language: string = 'en'): Promise<SimpleBlogPost | null> {
  try {
    if (!existsSync(CONTENT_DIR)) {
      return null
    }

    const categoryDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    for (const categoryDir of categoryDirs) {
      const categoryPath = join(CONTENT_DIR, categoryDir.name)
      const postPath = join(categoryPath, slug)
      
      if (existsSync(postPath)) {
        const availableLanguages: string[] = []
        const files = readdirSync(postPath)
        
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const lang = file.replace('.mdx', '')
            availableLanguages.push(lang)
          }
        }

        // 尝试获取指定语言，如果不存在则使用英文或第一个可用语言
        const targetLang = availableLanguages.includes(language) ? language : 
                          availableLanguages.includes('en') ? 'en' : 
                          availableLanguages[0]

        if (targetLang) {
          const filePath = join(postPath, `${targetLang}.mdx`)
          if (existsSync(filePath)) {
            const fileContent = readFileSync(filePath, 'utf-8')
            const { data, content } = matter(fileContent)

            return {
              slug,
              title: data.title || '',
              description: data.description || '',
              content,
              category: categoryDir.name,
              tags: data.tags || [],
              author: data.author || 'Admin',
              publishedAt: data.publishedAt || new Date().toISOString(),
              updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
              readingTime: calculateReadingTime(content),
              language: targetLang,
              availableLanguages,
              featuredImage: data.featuredImage,
              featured: data.featured || false,
              keywords: data.keywords || [],
              ogImage: data.ogImage || data.featuredImage
            }
          }
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

// 按分类获取文章
export async function getPostsByCategory(categorySlug: string, language?: string): Promise<SimpleBlogPost[]> {
  const allPosts = await getBlogPosts(language)
  return allPosts.filter(post => post.category === categorySlug)
}

// 获取相关文章（同分类或同标签）
export async function getRelatedPosts(currentPost: SimpleBlogPost, limit: number = 3): Promise<SimpleBlogPost[]> {
  const allPosts = await getBlogPosts(currentPost.language)
  
  // 首先尝试获取相关文章（同分类或同标签）
  const relatedPosts = allPosts
    .filter(post => 
      post.slug !== currentPost.slug && (
        post.category === currentPost.category ||
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
    )
    .slice(0, limit)
  
  // 如果相关文章不足，从其他文章中补充
  if (relatedPosts.length < limit) {
    const otherPosts = allPosts
      .filter(post => 
        post.slug !== currentPost.slug && 
        !relatedPosts.some(related => related.slug === post.slug)
      )
      .slice(0, limit - relatedPosts.length)
    
    return [...relatedPosts, ...otherPosts]
  }
  
  return relatedPosts
}

// 获取精选文章
export async function getFeaturedPosts(language?: string, limit: number = 6): Promise<SimpleBlogPost[]> {
  const allPosts = await getBlogPosts(language)
  return allPosts.filter(post => post.featured).slice(0, limit)
}
