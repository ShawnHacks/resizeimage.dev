import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { BlogPostTemplate } from '@/components/blog/blog-post-template'
import { getBlogPost, getBlogPosts, getRelatedPosts } from '@/lib/blog-static'
import type { SimpleBlogPost } from '@/lib/blog-static'

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
  const slugPath = slug?.join('/') || ''
  const post = await getBlogPost(slugPath, locale)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} - Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author || 'Crownbyte LTD' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'Crownbyte LTD'],
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
      canonical: locale === 'en' ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          loc === 'en' ? `/blog/${post.slug}` : `/${loc}/blog/${post.slug}`,
        ])
      ),
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