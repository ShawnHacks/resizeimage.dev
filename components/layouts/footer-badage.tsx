'use client'
import { usePathname } from "@/i18n/navigation"
import { useLocale } from 'next-intl';
import Image from 'next/image'

export default function FooterBadges() {
  const locale = useLocale()

  // x-invoke-path gives the path without the locale, e.g., /tools/website-screenshots
  const pathname = usePathname()

  // All third-party badges: lazy-load and deprioritize so they never
  // compete with the actual LCP element (the image-resizer UI above the fold).
  const lazyBadgeProps = {
    loading: 'lazy' as const,
    decoding: 'async' as const,
    fetchPriority: 'low' as const,
    // Disable Next.js preload-link generation for these offscreen assets.
    preload: false,
  };

  const BadgeList = () => (
    <div className="flex items-center gap-4 px-4 shrink-0">
      <a href="https://aihuntlist.com?utm_source=resizeimage.dev" target="_blank" rel="noopener noreferrer" className="block dark:hidden">
        <img src="https://aihuntlist.com/badge-light.svg" alt="Featured on aihuntlist.com" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://aihuntlist.com?utm_source=resizeimage.dev" target="_blank" rel="noopener noreferrer" className="hidden dark:block">
        <img src="https://aihuntlist.com/badge-dark.svg" alt="Featured on aihuntlist.com" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://aitrustlist.com?utm_source=resizeimage.dev" target="_blank" rel="noopener noreferrer" className="block dark:hidden">
        <img src="https://aitrustlist.com/badge-light.svg" alt="Featured on AITrustList" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://aitrustlist.com?utm_source=resizeimage.dev" target="_blank" rel="noopener noreferrer" className="hidden dark:block">
        <img src="https://aitrustlist.com/badge-dark.svg" alt="Featured on AITrustList" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://twelve.tools" target="_blank" rel="noopener" className="hidden dark:block">
        <Image src="/partners/twelve.tools.dark.svg" alt="Featured on Twelve Tools" width={120} height={32} className="h-8 w-auto max-w-40" loading="lazy" />
      </a>
      <a href="https://twelve.tools" target="_blank" rel="noopener" className="block dark:hidden">
        <Image src="/partners/twelve.tools.light.svg" alt="Featured on Twelve Tools" width={120} height={32} className="h-8 w-auto max-w-40" loading="lazy" />
      </a>

      <a href="https://startupfa.me/s/resizeimagedev?utm_source=resizeimage.dev" target="_blank" rel="noopener" className="hidden dark:block">
        <img src="https://startupfa.me/badges/featured/dark.webp" alt="ResizeImage.dev - Featured on Startup Fame" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://startupfa.me/s/resizeimagedev?utm_source=resizeimagedev" target="_blank" rel="noopener" className="block dark:hidden">
        <img src="https://startupfa.me/badges/featured-badge.webp" alt="ResizeImage.dev - Featured on Startup Fame" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://www.producthunt.com/products/resizeimage-dev?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-resizeimage-dev" target="_blank" rel="noopener" className="hidden dark:block">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1001008&theme=dark" alt="ResizeImage.dev - Featured on Product Hunt" className="h-8" {...lazyBadgeProps} />
      </a>
      <a href="https://www.producthunt.com/products/resizeimage-dev?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-resizeimage-dev" target="_blank" rel="noopener" className="block dark:hidden">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1001008&theme=light" alt="ResizeImage.dev - Featured on Product Hunt" className="h-8" {...lazyBadgeProps} />
      </a>

      <a href="https://fazier.com/launches/resizeimage.dev" target="_blank" rel="noopener" className="block dark:hidden">
        <img src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5811&badge_type=daily&theme=neutral" className="h-8 w-auto max-w-40" alt="Fazier badge" {...lazyBadgeProps} />
      </a>
      <a href="https://fazier.com/launches/resizeimage.dev" target="_blank" rel="noopener" className="hidden dark:block">
        <img src="https://fazier.com/api/v1/public/badges/embed_image.svg?launch_id=5811&badge_type=daily&theme=dark" className="h-8 w-auto max-w-40" alt="Fazier badge" {...lazyBadgeProps} />
      </a>

      <a href="https://findly.tools/resizeimage-dev?utm_source=resizeimage-dev" target="_blank" className="block dark:hidden">
        <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on findly.tools" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://findly.tools/resizeimage-dev?utm_source=resizeimage-dev" target="_blank" className="hidden dark:block">
        <img src="https://findly.tools/badges/findly-tools-badge-dark.svg" alt="Featured on findly.tools" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://dofollow.tools" target="_blank" className="hidden dark:block"><img src="https://dofollow.tools/badge/badge_dark.svg" alt="Featured on Dofollow.Tools" className="h-8 w-auto max-w-40" {...lazyBadgeProps} /></a>
      <a href="https://dofollow.tools" target="_blank" className="block dark:hidden"><img src="https://dofollow.tools/badge/badge_light.svg" alt="Featured on Dofollow.Tools" className="h-8 w-auto max-w-40" {...lazyBadgeProps} /></a>

      <a href="https://turbo0.com/item/resizeimagedev" target="_blank" rel="noopener noreferrer" className="block dark:hidden">
        <img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://turbo0.com/item/resizeimagedev" target="_blank" rel="noopener noreferrer" className="hidden dark:block">
        <img src="https://img.turbo0.com/badge-listed-dark.svg" alt="Listed on Turbo0" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://launchigniter.com/product/resizeimage-dev?ref=badge-resizeimage-dev" target="_blank" rel="noopener noreferrer" className="block dark:hidden">
        <img src="https://launchigniter.com/api/badge/resizeimage-dev?theme=neutral" alt="Featured on LaunchIgniter" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://launchigniter.com/product/resizeimage-dev?ref=badge-resizeimage-dev" target="_blank" rel="noopener noreferrer" className="hidden dark:block">
        <img src="https://launchigniter.com/api/badge/resizeimage-dev?theme=dark" alt="Featured on LaunchIgniter" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://open-launch.com/projects/resizeimage-dev" target="_blank" title="Open-Launch Top 2 Daily Winner" className="block dark:hidden">
        <img src="https://open-launch.com/images/badges/top2-light.svg" alt="Open-Launch Top 2 Daily Winner" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>
      <a href="https://open-launch.com/projects/resizeimage-dev" target="_blank" title="Open-Launch Top 2 Daily Winner" className="hidden dark:block">
        <img src="https://open-launch.com/images/badges/top2-dark.svg" alt="Open-Launch Top 2 Daily Winner" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://launchboard.dev" target="_blank" rel="noopener noreferrer">
        <img src="https://launchboard.dev/launchboard-badge.png" alt="Launched on LaunchBoard - Product Launch Platform" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a target="_blank" href="https://www.goodfirms.co/photo-editing-software/">
        <img src="https://assets.goodfirms.co/badges/color-badge/photo-editing-software.svg" title="Top Photo Editing Software" alt="Top Photo Editing Software" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

      <a href="https://www.showmysites.com" target="_blank" rel="noopener noreferrer">
        <img src="https://www.showmysites.com/static/backlink/gray_border.webp" alt="ShowMySites Badge" className="h-8 w-auto max-w-40" {...lazyBadgeProps} />
      </a>

    </div>
  )

  return (pathname === '/' || pathname === `/${locale}`) ? (
    <div className="container overflow-hidden mb-4">
      <div className="flex animate-scroll">
        <BadgeList />
        <BadgeList />
      </div>
    </div>
  ) : null
}