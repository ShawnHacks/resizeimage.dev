import { Link } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
 
export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
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
  )
}