import { Link } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import { JsonLdScript, getBreadcrumbSchema } from '@/components/common/structured-data';
import { baseSiteConfig } from '@/config/site-i18n';

// Soft-404 protection. Middleware can't see the final 404 status before the
// page renders, so we set noindex directives here at two layers:
//   1. <meta name="robots" content="noindex,nofollow"> via generateMetadata (honored by Google + Bing + AI crawlers)
//   2. <meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet"> for stricter Googlebot compliance
// Both are server-rendered into the HTML, so AI crawlers (GPTBot, ClaudeBot, PerplexityBot) also see them.
export function generateMetadata() {
  return {
    title: 'Page Not Found',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
      },
    },
  };
}

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  const baseUrl = baseSiteConfig.url;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', item: baseUrl },
    { name: '404', item: `${baseUrl}/404` },
  ]);

  return (
    <>
      <JsonLdScript id="breadcrumb-structured-data-404" data={breadcrumbSchema} />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] py-20">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">{t('title')}</h2>
          <p className="px-4 text-center text-lg text-muted-foreground max-w-md mx-auto">
            {t('description')}
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}