import { useTranslations } from 'next-intl'
import { Camera, Zap, Shield, Download, Monitor, Smartphone } from 'lucide-react'

export function Features() {
  const t = useTranslations('Features')

  const features = [
    {
      icon: Camera,
      title: t('fullPage.title'),
      description: t('fullPage.description')
    },
    {
      icon: Zap,
      title: t('instant.title'),
      description: t('instant.description')
    },
    {
      icon: Shield,
      title: t('privacy.title'),
      description: t('privacy.description')
    },
    {
      icon: Download,
      title: t('formats.title'),
      description: t('formats.description')
    },
    {
      icon: Monitor,
      title: t('devices.title'),
      description: t('devices.description')
    },
    {
      icon: Smartphone,
      title: t('responsive.title'),
      description: t('responsive.description')
    }
  ]

  return (
    <section id="features" className="py-20" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 id="features-heading" className="text-3xl font-bricolage font-semibold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/30 transition-colors">
                    <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
