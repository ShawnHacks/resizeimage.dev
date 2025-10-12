import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { getBlogPosts, getCategories } from '@/lib/blog-static'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, FolderOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export const runtime = "edge";

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'BlogPage' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: locale === 'en' ? '/blog' : `/${locale}/blog`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          loc === 'en' ? '/blog' : `/${loc}/blog`,
        ])
      ),
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const t = await getTranslations('BlogPage')
  const posts = await getBlogPosts(locale)
  const categories = await getCategories()

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent py-2">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('categories')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.reverse().map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105 py-0">
                    <CardContent className="py-4 px-2 text-center">
                      <div 
                        className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <FolderOpen 
                          className="h-6 w-6" 
                          style={{ color: category.color }}
                        />
                      </div>
                      <h3 className="font-semibold mb-1">
                        {category.translations[locale]?.name || category.translations['en']?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {category.translations[locale]?.description || category.translations['en']?.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {category.postCount} {t('posts')}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('recentPosts')}</h2>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t('noPosts')}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const category = categories.find(cat => cat.slug === post.category)
                  return (
                    <Card key={`${post.slug}-${post.language}`} className="pt-0 flex flex-col hover:shadow-lg transition-shadow">
                      {post.featuredImage && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader className="">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt, locale)}</span>
                          <span className="text-muted-foreground">•</span>
                          <Clock className="h-4 w-4" />
                          <span>{post.readingTime} {t('minRead')}</span>
                        </div>
                        
                        {category && (
                          <Link href={`/blog/category/${category.slug}`}>
                            <Badge 
                              variant="secondary" 
                              className="mb-2 w-fit"
                              style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                              {category.translations[locale]?.name || category.translations['en']?.name}
                            </Badge>
                          </Link>
                        )}

                        <CardTitle className="text-xl mb-2">
                          <Link 
                            href={`/${post.language === 'en' ? '' : post.language + '/'}blog/${post.slug}`}
                            className="hover:text-emerald-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/${post.language === 'en' ? '' : post.language + '/'}blog/${post.slug}`}>
                              {t('readMore')}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}