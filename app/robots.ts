import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/',
          '/.well-known/',
          '/private/',
        ],
      },
      // OpenAI
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      // Anthropic
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-User',
        allow: '/',
      },
      // Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Perplexity-User',
        allow: '/',
      },
      // Google — Google-Extended is opt-in for Gemini training;
      // we DO allow Gemini training (default) but keep explicit allow for clarity.
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      // Apple
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      // Common Crawl
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      // Meta
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
      },
      // Cohere
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
      {
        userAgent: 'cohere-training-data-crawler',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}