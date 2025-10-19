import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { getPostsByCategory, getCategory, getCategories } from '@/lib/blog-static'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ArrowLeft, FolderOpen, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { baseSiteConfig } from '@/config/site-i18n'

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>
}

export const runtime = "edge";

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params
  const t = await getTranslations({locale, namespace: 'BlogPost'})
  const categoryData = await getCategory(category)
  
  if (!categoryData) {
    return {
      title: t('categoryNotFound'),
      description: t('categoryNotFoundDescription'),
    }
  }

  const categoryName = categoryData.translations[locale]?.name || categoryData.translations['en']?.name
  const categoryDesc = categoryData.translations[locale]?.description || categoryData.translations['en']?.description

  return {
    title: `${categoryName} - Blog`,
    description: categoryDesc,
    openGraph: {
      title: `${categoryName} - Blog - ${baseSiteConfig.name}`,
      description: categoryDesc,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - Blog - ${baseSiteConfig.name}`,
      description: categoryDesc,
    },
    alternates: {
      canonical: locale === 'en' ? `/blog/category/${category}` : `/${locale}/blog/category/${category}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          loc === 'en' ? `/blog/category/${category}` : `/${loc}/blog/category/${category}`,
        ])
      ),
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params
  const t = await getTranslations({locale, namespace: 'BlogPost'})
  const categoryData = await getCategory(category)
  const posts = await getPostsByCategory(category, locale)

  if (!categoryData) {
    notFound()
  }

  const categoryName = categoryData.translations[locale]?.name || categoryData.translations['en']?.name
  const categoryDesc = categoryData.translations[locale]?.description || categoryData.translations['en']?.description

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                <Link href={`/blog`} className="hover:text-foreground transition-colors shrink-0">
                  {t('blog')}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium truncate">{categoryName}</span>
              </nav>
            {/* <Button variant="ghost" asChild className="mb-4">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === 'zh' ? '返回博客' : 'Back to Blog'}
              </Link>
            </Button> */}
          </nav>

          {/* Category Header */}
          <div className="text-center mb-12">
            <div 
              className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${categoryData.color}20` }}
            >
              <FolderOpen 
                className="h-8 w-8" 
                style={{ color: categoryData.color }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
              {categoryName}
            </h1>
            <p className="text-xl text-foreground max-w-2xl mx-auto mb-4">
              {categoryDesc}
            </p>
            <Badge 
              variant="secondary" 
              className="text-sm"
              style={{ backgroundColor: `${categoryData.color}20`, color: categoryData.color }}
            >
              {t('articles', { count: posts.length })}
            </Badge>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('noArticles')}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.slug} className="flex flex-col hover:shadow-lg transition-shadow pt-0">
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt, locale)}</span>
                      <span className="text-muted-foreground">•</span>
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime} {locale === 'zh' ? '分钟阅读' : 'min read'}</span>
                    </div>

                    <CardTitle className="text-xl mb-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blog/${post.slug}`}>
                          {t('readMore')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// export async function generateStaticParams() {
//   const categories = await getCategories()
//   const paths: { locale: string; category: string }[] = []

//   for (const category of categories) {
//     for (const locale of routing.locales) {
//       paths.push({ locale, category: category.slug })
//     }
//   }

//   return paths
// }
