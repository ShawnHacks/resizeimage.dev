import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://websitescreenshot.online'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/screenshots/',
          '/_next/',
          '/.well-known/',
          '/admin/',
          '/private/',
        ],
        crawlDelay: 1, // 1 second delay to be respectful
      },
      {
        userAgent: 'GPTBot', // OpenAI's bot
        allow: '/',
        disallow: ['/screenshots/', '/api/'], // Only block sensitive paths
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing
        allow: '/',
        disallow: ['/screenshots/', '/api/'],
      },
      {
        userAgent: 'Claude-Web', // Anthropic's Claude
        allow: '/',
        disallow: ['/screenshots/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
        disallow: ['/screenshots/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
