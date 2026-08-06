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

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … sitemap.xml and robots.txt
  matcher: '/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)'
};