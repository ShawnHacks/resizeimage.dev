import { Link } from '@/i18n/navigation'
import { Calendar, Clock, User, Tag, BookOpen, ChevronRight, Twitter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { SimpleBlogPost } from '@/lib/blog-static'
import { JsonLdScript, getBlogPostingSchema, getBreadcrumbSchema } from '@/components/common/structured-data'
import { getLocale, getTranslations } from 'next-intl/server'
import { BlogPostActions } from './blog-post-actions'

import "@/app/article-content.css"

export interface BlogPostTemplateProps {
  post: SimpleBlogPost
  relatedPosts: SimpleBlogPost[]
  children: React.ReactNode
}

export async function BlogPostTemplate({ post, relatedPosts, children }: BlogPostTemplateProps) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'BlogPost' })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev'
  const articleUrl = `${baseUrl}/blog/${post.slug}`
  const categoryUrl = `${baseUrl}/blog/category/${post.category}`

  const articleStructuredData = getBlogPostingSchema({
    headline: post.title,
    description: post.description,
    image: post.ogImage ? [post.ogImage] : [`${baseUrl}/og.png`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: articleUrl,
    inLanguage: locale,
    articleSection: post.tags?.join(', '),
    keywords: post.keywords,
  })

  const breadcrumbStructuredData = getBreadcrumbSchema([
    { name: 'Blog', item: `${baseUrl}/blog` },
    { name: post.category, item: categoryUrl },
    { name: post.title, item: articleUrl },
  ])

  return (
    <>
      <JsonLdScript
        id={`article-structured-data-${post.slug}-${locale}`}
        data={articleStructuredData}
      />
      <JsonLdScript
        id={`breadcrumb-structured-data-${post.slug}-${locale}`}
        data={breadcrumbStructuredData}
      />
      
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="relative">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                <Link href={`/blog`} className="hover:text-foreground transition-colors shrink-0">
                  {t('blog')}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/blog/category/${post.category}`} className="capitalize shrink-0">{post.category}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium truncate">{post.title}</span>
              </nav>

              {/* Article Header */}
              <header className="text-center mb-12">
                {/* Category Badge */}
                <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
                  <Tag className="h-3 w-3 mr-2" />
                  {post.category}
                </Badge>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6 text-foreground py-2">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
                  {post.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{post.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt, locale)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} {t('minRead')}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-8">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </header>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container mx-auto px-4 mt-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl border bg-white dark:bg-gray-900">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="">
            {/* Article Content */}
            <article className="md:col-span-3">
              <div className="blog-content prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl">
                {children}
              </div>

              {/* Article Actions */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <BlogPostActions
                      title={post.title}
                      description={post.description}
                      shareLabel={t('share')}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('lastUpdated')}
                    {formatDate(post.updatedAt, locale)}
                  </div>
                </div>
              </div>

              {/* Author Bio Card — visible E-E-A-T signal at the end of every post */}
              <aside className="mt-10 p-6 md:p-8 rounded-2xl border bg-card/50 not-prose">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/avatar/shawn.webp"
                      alt="Shawn H. — Founder of ResizeImage.dev"
                      width={88}
                      height={88}
                      className="w-22 h-22 rounded-full object-cover border-2 border-background shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                      Written by
                    </p>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      {post.author || 'Shawn H.'}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Founder of ResizeImage.dev. Builds privacy-first browser-based
                      image tools that run entirely in your browser — no uploads, no
                      accounts, no tracking. Focused on Next.js, WebAssembly, and
                      client-side image optimization.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Link
                        href="/about"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                      >
                        <User className="h-3.5 w-3.5" />
                        About Shawn
                      </Link>
                      <span className="text-muted-foreground">·</span>
                      <a
                        href="https://twitter.com/ShawnHacks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Twitter className="h-3.5 w-3.5" />
                        @ShawnHacks
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </article>
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t('relatedArticles')}
              </h2>
              <p className="text-muted-foreground">
                {t('continueExploring')}
              </p>
            </div>
            
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow py-0">
                      <CardContent className="p-6">
                        {relatedPost.featuredImage ? (
                          <div className="aspect-video overflow-hidden rounded-lg mb-4">
                            <img
                              src={relatedPost.featuredImage}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/10 dark:from-primary/10 dark:to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {relatedPost.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{relatedPost.readingTime} {t('minRead')}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {relatedPost.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('continueExploring')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
