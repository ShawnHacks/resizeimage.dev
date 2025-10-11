// Enhanced blog system types for SEO-driven content

export interface BlogSEO {
  title: string
  description: string
  keywords: string[]
  canonical: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
}

export interface BlogTranslations {
  [locale: string]: {
    title?: string
    description?: string
    slug?: string
  }
}

export interface BlogFeaturedImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export interface BlogSchema {
  type: 'Article' | 'HowTo' | 'FAQ' | 'Review'
  steps?: number
  totalTime?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  rating?: {
    value: number
    bestRating: number
    worstRating: number
    ratingCount: number
  }
  [key: string]: any
}

export interface BlogAuthor {
  id: string
  name: string
  bio: string
  avatar?: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
  expertise: string[]
}

export interface BlogPost {
  // Basic info
  slug: string
  title: string
  description: string
  excerpt: string
  content: string
  
  // SEO optimization
  seo: BlogSEO
  
  // Categorization
  category: string
  tags: string[]
  
  // Multi-language support
  language: string
  availableLanguages: string[]
  translations: BlogTranslations
  
  // Metadata
  author: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  wordCount: number
  
  // Media
  featuredImage?: BlogFeaturedImage
  gallery?: BlogFeaturedImage[]
  
  // Structured data
  schema?: BlogSchema
  
  // Content status
  status: 'draft' | 'published' | 'archived' | 'scheduled'
  featured: boolean
  priority: number
  
  // Relationships
  related: string[]
  series?: string
  
  // Analytics
  views?: number
  shares?: number
  
  // Social sharing
  social?: {
    twitter?: string
    linkedin?: string
    facebook?: string
  }
}

export interface BlogCategory {
  slug: string
  name: string
  description: string
  seo: BlogSEO
  translations: Record<string, {
    name: string
    description: string
  }>
  color: string
  icon: string
  postCount: number
  featured: boolean
  order: number
}

export interface BlogTag {
  slug: string
  name: string
  description?: string
  postCount: number
  color?: string
}

export interface BlogSeries {
  slug: string
  title: string
  description: string
  posts: string[]
  status: 'active' | 'completed'
  order: number
}

export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  totalViews: number
  totalShares: number
  topCategories: Array<{
    category: string
    count: number
  }>
  topTags: Array<{
    tag: string
    count: number
  }>
  recentPosts: BlogPost[]
  popularPosts: BlogPost[]
}

export interface BlogSearchResult {
  post: BlogPost
  score: number
  matches: {
    title?: boolean
    description?: boolean
    content?: boolean
    tags?: boolean
  }
}

export interface BlogFilter {
  category?: string
  tags?: string[]
  author?: string
  language?: string
  status?: BlogPost['status']
  featured?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

export interface BlogSortOptions {
  field: 'publishedAt' | 'updatedAt' | 'title' | 'views' | 'priority'
  order: 'asc' | 'desc'
}

export interface BlogPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface BlogListResponse {
  posts: BlogPost[]
  pagination: BlogPagination
  filters: BlogFilter
  sort: BlogSortOptions
}

// Content management interfaces
export interface BlogContentManager {
  // CRUD operations
  createPost(post: Partial<BlogPost>): Promise<BlogPost>
  updatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost>
  deletePost(slug: string): Promise<void>
  getPost(slug: string, language?: string): Promise<BlogPost | null>
  
  // Listing and filtering
  getPosts(filter?: BlogFilter, sort?: BlogSortOptions, pagination?: Partial<BlogPagination>): Promise<BlogListResponse>
  getPostsByCategory(category: string, language?: string): Promise<BlogPost[]>
  getPostsByTag(tag: string, language?: string): Promise<BlogPost[]>
  getPostsByAuthor(author: string, language?: string): Promise<BlogPost[]>
  
  // Search
  searchPosts(query: string, language?: string): Promise<BlogSearchResult[]>
  
  // Categories and tags
  getCategories(language?: string): Promise<BlogCategory[]>
  getTags(language?: string): Promise<BlogTag[]>
  getAuthors(): Promise<BlogAuthor[]>
  
  // Analytics
  getStats(language?: string): Promise<BlogStats>
  incrementViews(slug: string): Promise<void>
  
  // SEO utilities
  generateSitemap(): Promise<string>
  generateRSSFeed(language?: string): Promise<string>
  validateSEO(post: BlogPost): Promise<{
    score: number
    issues: string[]
    suggestions: string[]
  }>
}

// SEO analysis types
export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: SEOSuggestion[]
  keywordDensity: Record<string, number>
  readabilityScore: number
  internalLinks: number
  externalLinks: number
  imageOptimization: {
    total: number
    withAlt: number
    optimized: number
  }
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  field?: string
  severity: number
}

export interface SEOSuggestion {
  type: 'title' | 'description' | 'keywords' | 'content' | 'images' | 'links'
  message: string
  impact: 'high' | 'medium' | 'low'
}
