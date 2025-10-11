import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

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
  
  // Add security headers for better SEO
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // - … sitemap.xml and robots.txt
  matcher: '/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)'
};