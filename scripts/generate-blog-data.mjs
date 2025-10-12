#!/usr/bin/env node

/**
 * Build-time script to generate static blog data
 * This runs during `next build` and generates JSON files
 * that can be imported at runtime without Node.js fs module
 */

import { join } from 'path'
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CONTENT_DIR = join(process.cwd(), 'content', 'blog')
const OUTPUT_DIR = join(process.cwd(), 'generated')

// 确保输出目录存在
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 计算阅读时间
function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// 获取所有分类
function getCategories() {
  try {
    if (!existsSync(CONTENT_DIR)) {
      return []
    }

    const categoryDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const categories = []

    for (const categorySlug of categoryDirs) {
      const categoryPath = join(CONTENT_DIR, categorySlug)
      const categoryConfigPath = join(categoryPath, 'category.json')
      
      if (existsSync(categoryConfigPath)) {
        const configContent = readFileSync(categoryConfigPath, 'utf-8')
        const config = JSON.parse(configContent)
        
        // 计算该分类下的文章数量（只计算目录，不包括 category.json）
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
    console.error('Error getting categories:', error)
    return []
  }
}

// 获取单个分类
function getCategory(slug) {
  const categories = getCategories()
  return categories.find(cat => cat.slug === slug) || null
}

// 获取所有博客文章
function getBlogPosts() {
  try {
    if (!existsSync(CONTENT_DIR)) {
      return []
    }

    const posts = []
    const categoryDirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    for (const categoryDir of categoryDirs) {
      const categoryPath = join(CONTENT_DIR, categoryDir.name)
      const postDirs = readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())

      for (const postDir of postDirs) {
        const postPath = join(categoryPath, postDir.name)
        const availableLanguages = []

        // 检查可用语言
        const files = readdirSync(postPath)
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const lang = file.replace('.mdx', '')
            availableLanguages.push(lang)
          }
        }

        // 为每种语言创建一个文章条目
        for (const lang of availableLanguages) {
          const filePath = join(postPath, `${lang}.mdx`)
          
          if (existsSync(filePath)) {
            const fileContent = readFileSync(filePath, 'utf-8')
            const { data, content } = matter(fileContent)

            posts.push({
              slug: postDir.name,
              title: data.title,
              description: data.description,
              content,
              category: categoryDir.name,
              tags: data.tags || [],
              author: data.author || 'Anonymous',
              publishedAt: data.publishedAt,
              updatedAt: data.updatedAt || data.publishedAt,
              readingTime: calculateReadingTime(content),
              language: lang,
              availableLanguages: availableLanguages,
              featuredImage: data.featuredImage,
              featured: data.featured || false,
              keywords: data.keywords || [],
              ogImage: data.ogImage,
            })
          }
        }
      }
    }

    // 按发布日期降序排序
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return posts
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return []
  }
}

// 获取单篇文章
function getBlogPost(slug) {
  const posts = getBlogPosts()
  return posts.find(post => post.slug === slug) || null
}

// 按分类获取文章（保留所有语言版本，在使用时由前端过滤）
function getPostsByCategory(categorySlug) {
  const posts = getBlogPosts()
  return posts.filter(post => post.category === categorySlug)
}

// 获取相关文章（带语言过滤）
function getRelatedPosts(slug, language, limit = 3) {
  const allPosts = getBlogPosts()
  const currentPost = allPosts.find(post => post.slug === slug && post.language === language)
  if (!currentPost) return []

  // 获取所有唯一的 slug（去重）
  const uniqueSlugs = Array.from(new Set(allPosts.map(post => post.slug)))
  
  // 为每个唯一 slug 选择合适语言的版本
  const postsWithLanguageFallback = []
  for (const postSlug of uniqueSlugs) {
    // 跳过当前文章
    if (postSlug === slug) continue
    
    // 优先使用相同语言的版本
    let selectedPost = allPosts.find(post => post.slug === postSlug && post.language === language)
    
    // 如果没有相同语言的版本，fallback 到英文
    if (!selectedPost) {
      selectedPost = allPosts.find(post => post.slug === postSlug && post.language === 'en')
    }
    
    if (selectedPost) {
      postsWithLanguageFallback.push(selectedPost)
    }
  }
  
  // 优先推荐同分类的文章
  const sameCategoryPosts = postsWithLanguageFallback.filter(
    post => post.category === currentPost.category
  )
  
  // 如果同分类文章不足，用其他文章补充
  const related = sameCategoryPosts.slice(0, limit)
  if (related.length < limit) {
    const remaining = postsWithLanguageFallback
      .filter(post => post.category !== currentPost.category)
      .slice(0, limit - related.length)
    related.push(...remaining)
  }
  
  return related
}

// 生成所有数据
console.log('🚀 Generating static blog data...')

const categories = getCategories()
const posts = getBlogPosts()

console.log(`✅ Found ${categories.length} categories`)
console.log(`✅ Found ${posts.length} blog posts`)

// 写入分类数据
writeFileSync(
  join(OUTPUT_DIR, 'blog-categories.json'),
  JSON.stringify(categories, null, 2)
)

// 写入文章列表数据
writeFileSync(
  join(OUTPUT_DIR, 'blog-posts.json'),
  JSON.stringify(posts, null, 2)
)

// 为每个分类生成文章列表
for (const category of categories) {
  const categoryPosts = getPostsByCategory(category.slug)
  writeFileSync(
    join(OUTPUT_DIR, `blog-category-${category.slug}.json`),
    JSON.stringify(categoryPosts, null, 2)
  )
}

// 为每篇文章的每种语言版本生成相关文章
for (const post of posts) {
  const relatedPosts = getRelatedPosts(post.slug, post.language)
  writeFileSync(
    join(OUTPUT_DIR, `blog-related-${post.slug}-${post.language}.json`),
    JSON.stringify(relatedPosts, null, 2)
  )
}

console.log('✨ Blog data generation complete!')
console.log(`📁 Output directory: ${OUTPUT_DIR}`)
