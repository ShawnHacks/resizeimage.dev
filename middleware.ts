import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Content Security Policy — allow our analytics, ads, and inline schemas.
// Keep restrictive: only the origins we actually need.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://pagead2.googlesyndication.com https://*.adnxs.com https://*.doubleclick.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://pagead2.googlesyndication.com https://*.adnxs.com https://*.doubleclick.net",
  "frame-src 'self' https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.doubleclick.net",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Add X-Robots-Tag headers for specific paths
  const pathname = request.nextUrl.pathname;

  // Block indexing of screenshot files and dynamic content
  if (pathname.startsWith('/screenshots/') ||
      pathname.includes('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.includes('.png') ||
      pathname.includes('.jpg') ||
      pathname.includes('.jpeg') ||
      pathname.includes('.pdf') ||
      pathname.includes('.gif') ||
      pathname.includes('.svg') ||
      pathname.includes('.webp') ||
      pathname.includes('.ico')) {

    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    // Allow caching for static pages to improve bfcache
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

  } else {
    response.headers.set('X-Robots-Tag', 'index, follow');
    // Allow Cloudflare / shared caches to serve HTML for 5 minutes,
    // serve stale while revalidating for up to 24 hours. Cuts TTFB.
    // Bot users and human visitors alike benefit; content stays fresh.
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
    );
  }

  // Soft-404 protection — any 4xx/5xx response must not be indexable.
  if (response.status >= 400) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  // Security headers for better SEO & trust
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS — 1 year, include subdomains, eligible for preload list.
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Permissions Policy — restrict powerful features by default.
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy (allow analytics + ads; restrict everything else).
  response.headers.set('Content-Security-Policy', csp);

  // IETF draft-romm-aipref-contentsignals: forward-compatible AI preference
  // signal. Sent as both a Content-Signal header and (on robots.txt responses)
  // a body directive so it works with current and future scrapers.
  response.headers.set(
    'Content-Signal',
    'ai-train=no, search=yes, ai-retrieval=yes'
  );

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … sitemap.xml and robots.txt
  matcher: '/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)'
};