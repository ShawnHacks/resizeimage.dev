import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { BlogPostTemplate } from '@/components/blog/blog-post-template'
import { getBlogPost, getBlogPosts, getRelatedPosts } from '@/lib/blog-static'
import type { SimpleBlogPost } from '@/lib/blog-static'
import { getTranslations } from 'next-intl/server'
import { baseSiteConfig } from '@/config/site-i18n'

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string[] }>
}

export const runtime = "edge";

// export async function generateStaticParams() {
//   const posts = await getBlogPosts()
//   return routing.locales.flatMap((locale) =>
//     posts.map((post: SimpleBlogPost) => ({
//       locale,
//       slug: post.slug.split('/'),
//     }))
//   )
// }

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'BlogPost' })
  const slugPath = slug?.join('/') || ''
  const post = await getBlogPost(slugPath, locale)

  if (!post) {
    return {
      title: t('postNotFound'),
      description: t('postNotFoundDescription'),
    }
  }

  return {
    title: `${post.title} - Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author || 'Admin' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'Admin'],
      images: post.ogImage ? [
        {
          url: post.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
    alternates: {
      canonical: post.language === 'en'
        ? `${baseSiteConfig.url}/blog/${post.slug}`
        : `${baseSiteConfig.url}/${post.language}/blog/${post.slug}`,
      languages: {
        ...Object.fromEntries(
          routing.locales
            .filter((loc: string) => loc === 'en' || post.availableLanguages.includes(loc))
            .map((loc: string) => [
              loc,
              loc === 'en' ? `${baseSiteConfig.url}/blog/${post.slug}` : `${baseSiteConfig.url}/${loc}/blog/${post.slug}`,
            ])
        ),
        'x-default': `${baseSiteConfig.url}/blog/${post.slug}`
      }
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const slugPath = slug?.join('/') || ''
  const post = await getBlogPost(slugPath, locale)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post, 3)

  return <BlogPostTemplate post={post} relatedPosts={relatedPosts} />
}