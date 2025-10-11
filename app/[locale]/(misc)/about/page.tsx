import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Image, Monitor, Smartphone, Zap, Shield, Globe, Users, Award, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export const runtime = "edge";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    alternates: {
      canonical: locale === 'en' ? '/about' : `/${locale}/about`,
      languages: Object.fromEntries(
        routing.locales.map((loc: string) => [
          loc,
          loc === 'en' ? '/about' : `/${loc}/about`
        ])
      ),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function AboutPage() {
  const t = useTranslations('AboutPage')

  const features = [
    {
      icon: Maximize2,
      title: t('features.highQuality.title'),
      description: t('features.highQuality.description'),
    },
    {
      icon: Monitor,
      title: t('features.multipleFormats.title'),
      description: t('features.multipleFormats.description'),
    },
    {
      icon: Smartphone,
      title: t('features.responsive.title'),
      description: t('features.responsive.description'),
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
    },
    {
      icon: Shield,
      title: t('features.privacy.title'),
      description: t('features.privacy.description'),
    },
    {
      icon: Globe,
      title: t('features.noLimits.title'),
      description: t('features.noLimits.description'),
    },
  ]

  const stats = [
    {
      icon: Users,
      number: t('stats.users.number'),
      label: t('stats.users.label'),
    },
    {
      icon: Image,
      number: t('stats.screenshots.number'),
      label: t('stats.screenshots.label'),
    },
    {
      icon: Globe,
      number: t('stats.websites.number'),
      label: t('stats.websites.label'),
    },
    {
      icon: Award,
      number: t('stats.uptime.number'),
      label: t('stats.uptime.label'),
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bricolage font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/80">
                <Link href="/">
                  <Image className="h-5 w-5 mr-2" />
                  {t('cta.button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bricolage font-semibold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('mission.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t('mission.description')}
            </p>
            <div className="bg-card border rounded-lg p-8">
              <blockquote className="text-xl italic text-foreground">
                "{t('mission.quote')}"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bricolage font-semibold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('stats.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('stats.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary dark:text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary dark:text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bricolage font-semibold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 dark:bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary dark:text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bricolage font-semibold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('technology.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('technology.description')}
              </p>
            </div>
            {/* <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{t('technology.frontend.title')}</h3>
                <p className="text-muted-foreground mb-4">{t('technology.frontend.description')}</p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'React', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{t('technology.backend.title')}</h3>
                <p className="text-muted-foreground mb-4">{t('technology.backend.description')}</p>
                <div className="flex flex-wrap gap-2">
                  {['Playwright', 'Node.js', 'Server Actions'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bricolage font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              <Link href="/">
                <Image className="h-5 w-5 mr-2" />
                {t('cta.button')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
