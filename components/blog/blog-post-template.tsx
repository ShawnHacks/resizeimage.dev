"use client"

import { Link } from '@/i18n/navigation'
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen, Twitter, Linkedin, Facebook, Copy, Eye, Heart, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { SimpleBlogPost } from '@/lib/blog-static'
import StructuredData from '@/components/structured-data'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'


import "@/app/article-content.css"

interface BlogPostTemplateProps {
  post: SimpleBlogPost
  relatedPosts: SimpleBlogPost[]
}

export function BlogPostTemplate({ post, relatedPosts }: BlogPostTemplateProps) {
  const locale = useLocale();
  const t = useTranslations('BlogPost')
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        throw new Error('Web Share API not supported')
      }
    } catch (err) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link Copied!", {
        description: "The article URL has been copied to your clipboard.",
      })
    }
  }


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author || "CrownByte LTD"
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "image": post.ogImage || "https://resizeimage.dev/og.png",
    "url": `https://resizeimage.dev/${locale === 'en' ? '' : locale + '/'}blog/${post.slug}`,
    "keywords": post.keywords?.join(", ") || "",
    "articleSection": post.tags?.join(", ") || "",
    "publisher": {
      "@type": "Organization",
      "name": "CrownByte LTD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://resizeimage.dev/logo.png"
      }
    }
  }

  return (
    <>
      <StructuredData data={structuredData} />
      
      {/* Hero Section with Background */}
      {/* bg-gradient-to-br from-primary/20 via-primary/10 to-pink-50 dark:from-primary dark:via-primary/80 dark:to-primary/50 */}
      <div className="relative bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="relative">
          {/* <div className="absolute inset-0 bg-grid-pattern"></div> */}

          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/10" /> */}

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

              {/* Back Button */}
              {/* <Button variant="ghost" asChild className="mb-8 -ml-4">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('backToBlog')}
                </Link>
              </Button> */}

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
                  {/* <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>1.2k {t('views')}</span>
                  </div> */}
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
              <div className="blog-content">
                <MDXRemote 
                  source={post.content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                  components={{
                    h1: () => null, // 不渲染 h1 标签
                    table: (props) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                      </div>
                    ),
                    thead: (props) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
                    tbody: (props) => <tbody {...props} />,
                    tr: (props) => <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />,
                    th: (props) => (
                      <th 
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 last:border-r-0" 
                        {...props} 
                      />
                    ),
                    td: (props) => (
                      <td 
                        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0" 
                        {...props} 
                      />
                    ),
                  }}
                />
              </div>

              {/* Article Actions */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('share')}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('lastUpdated')} 
                    {formatDate(post.updatedAt, locale)}
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            {/* <aside className="md:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardContent className="px-4">
                    <h3 className="font-semibold mb-4">{t('quickActions')}</h3>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('shareArticle')}
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Copy className="h-4 w-4 mr-2" />
                        {t('copyLink')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="px-4">
                    <h3 className="font-semibold mb-4">{t('socialShare')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-center">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="justify-center">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="justify-center">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="justify-center">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>


              </div>
            </aside> */}
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
                  // <Link key={relatedPost.slug} href={`/${locale === 'en' ? '' : locale + '/'}blog/${relatedPost.slug}`}>
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