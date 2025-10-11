/**
 * Static blog data loader - Works with Cloudflare Pages
 * Uses pre-generated JSON data from build time
 */

import blogCategories from '@/generated/blog-categories.json'
import blogPosts from '@/generated/blog-posts.json'

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

// 获取所有分类
export async function getCategories(): Promise<BlogCategory[]> {
  return (blogCategories as any[]).map(category => ({
    ...category,
    name: category.translations.en.name,
    description: category.translations.en.description,
  })) as BlogCategory[]
}

// 获取单个分类
export async function getCategory(slug: string): Promise<BlogCategory | null> {
  const categories = await getCategories()
  return categories.find(cat => cat.slug === slug) || null
}

// 获取所有博客文章
export async function getBlogPosts(locale?: string): Promise<SimpleBlogPost[]> {
  let posts = blogPosts as SimpleBlogPost[]
  
  // 如果指定了语言，过滤文章
  if (locale) {
    posts = posts.filter(post => post.language === locale)
  }
  
  return posts
}

// 获取单篇文章
export async function getBlogPost(slug: string, language: string = 'en'): Promise<SimpleBlogPost | null> {
  const posts = await getBlogPosts(language)
  return posts.find(post => post.slug === slug) || null
}

// 按分类获取文章
export async function getPostsByCategory(
  categorySlug: string,
  locale?: string
): Promise<SimpleBlogPost[]> {
  const posts = await getBlogPosts(locale)
  return posts.filter(post => post.category === categorySlug)
}

// 获取特色文章
export async function getFeaturedPosts(
  limit: number = 3,
  locale?: string
): Promise<SimpleBlogPost[]> {
  const posts = await getBlogPosts(locale)
  return posts.filter(post => post.featured).slice(0, limit)
}

// 获取最新文章
export async function getRecentPosts(
  limit: number = 5,
  locale?: string
): Promise<SimpleBlogPost[]> {
  const posts = await getBlogPosts(locale)
  return posts.slice(0, limit)
}

// 获取相关文章（同分类或同标签）
export async function getRelatedPosts(
  currentPost: SimpleBlogPost,
  limit: number = 3
): Promise<SimpleBlogPost[]> {
  try {
    // 尝试加载预生成的相关文章
    const relatedPosts = await import(`@/generated/blog-related-${currentPost.slug}.json`)
    return (relatedPosts.default || relatedPosts).slice(0, limit) as SimpleBlogPost[]
  } catch (error) {
    // 如果没有预生成的数据，回退到动态计算
    const allPosts = await getBlogPosts(currentPost.language)
    const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug)
    
    // 优先推荐同分类的文章
    const sameCategoryPosts = otherPosts.filter(
      post => post.category === currentPost.category
    )
    
    const related = sameCategoryPosts.slice(0, limit)
    if (related.length < limit) {
      const remaining = otherPosts
        .filter(post => post.category !== currentPost.category)
        .slice(0, limit - related.length)
      related.push(...remaining)
    }
    
    return related
  }
}

// 按标签搜索文章
export async function getPostsByTag(
  tag: string,
  locale?: string
): Promise<SimpleBlogPost[]> {
  const posts = await getBlogPosts(locale)
  return posts.filter(post => post.tags.includes(tag))
}

// 搜索文章
export async function searchPosts(
  query: string,
  locale?: string
): Promise<SimpleBlogPost[]> {
  const posts = await getBlogPosts(locale)
  const lowerQuery = query.toLowerCase()
  
  return posts.filter(
    post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
