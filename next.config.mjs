import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
 
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // htmlLimitedBots
//   htmlLimitedBots: /Mediapartners-Google|Googlebot|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview/i
// ,
  
  // Optimize for bfcache compatibility
  async headers() {
    return [
      {
        // Apply to all pages except API routes and static assets
        source: '/((?!api|_next/static|_next/image|favicon.ico|screenshots).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Static assets can be cached longer
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'video.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'similarlabs.com',
      },
      {
        protocol: 'https',
        hostname: 'findly.tools',
      },
      {
        protocol: 'https',
        hostname: 'code.market',
      },
      {
        protocol: 'https',
        hostname: 'turbo0.com',
      },
      {
        protocol: 'https',
        hostname: 'startupfa.me',
      },
    ],
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withMDX(nextConfig));