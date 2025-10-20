
'use client'
import { usePathname } from "@/i18n/navigation"
import {useLocale} from 'next-intl';
import Image from 'next/image'

export default function FooterBadges() {
  const locale = useLocale()
  
  // x-invoke-path gives the path without the locale, e.g., /tools/website-screenshots
  const pathname = usePathname()

  const BadgeList = () => (
      <div className="flex items-center gap-4 px-4 shrink-0">
        <a href="https://aihuntlist.com" target="_blank" rel="noopener noreferrer" className="block dark:hidden">
          <img src="https://aihuntlist.com/badge-light.svg" alt="Featured on aihuntlist.com" className="h-8 w-auto max-w-40"  />
        </a>
        <a href="https://aihuntlist.com" target="_blank" rel="noopener noreferrer" className="hidden dark:block">
          <img src="https://aihuntlist.com/badge-dark.svg" alt="Featured on aihuntlist.com" className="h-8 w-auto max-w-40"  />
        </a>

        <a href="https://twelve.tools" target="_blank" rel="noopener" className="hidden dark:block">
          <Image src="/partners/twelve.tools.dark.svg" alt="Featured on Twelve Tools" width={120} height={32} className="h-8 w-auto max-w-40" />
        </a>
        <a href="https://twelve.tools" target="_blank" rel="noopener" className="block dark:hidden">
          <Image src="/partners/twelve.tools.light.svg" alt="Featured on Twelve Tools" width={120} height={32} className="h-8 w-auto max-w-40" />
        </a>

        {/* <a href="https://bestdirectories.org" target="_blank" rel="noopener" className="hidden dark:block">
          <img src="https://bestdirectories.org/feature-badge-dark.svg" alt="Featured on Best Directories" className="h-8" />
        </a>
        <a href="https://bestdirectories.org" target="_blank" rel="noopener" className="block dark:hidden">
          <img src="https://bestdirectories.org/feature-badge.svg" alt="Featured on Best Directories" className="h-8" />
        </a> */}

        {/* <a href="https://aiwith.me/tools/open-launch-com/?utm_source=badge-featured&amp;utm_medium=badge&amp;ref=embed" target="_blank" rel="noopener" className="hidden dark:block" title="Open Launch - Featured on AI With Me">
          <img src="https://aiwith.me/ai_with_me_dark_badge.svg" alt="Open Launch - Featured on AI With Me" className="h-8" />
        </a>
        <a href="https://aiwith.me/tools/open-launch-com/?utm_source=badge-featured&amp;utm_medium=badge&amp;ref=embed" target="_blank" rel="noopener" className="block dark:hidden" title="Open Launch - Featured on AI With Me">
          <img src="https://aiwith.me/ai_with_me_light_badge.svg" alt="Open Launch - Featured on AI With Me" className="h-8" />
        </a> */}
        
        <a href="https://startupfa.me/s/bulkresizeimages.online?utm_source=bulkresizeimages.online" target="_blank" rel="noopener" className="hidden dark:block">
          <img src="https://startupfa.me/badges/featured/dark.webp" alt="BulkResizeImages - Featured on Startup Fame" className="h-8 w-auto max-w-40" />
        </a>
        {/* <a href="https://startupfa.me/s/bulkresizeimages.online?utm_source=bulkresizeimages.online" target="_blank" rel="noopener" className="block dark:hidden">
          <img src="https://startupfa.me/badges/featured/light.webp" alt="BulkResizeImages - Featured on Startup Fame" className="h-8 w-auto max-w-40" />
        </a> */}

        <a href="https://startupfa.me/s/bulkresizeimages.online?utm_source=bulkresizeimages.online" target="_blank" rel="noopener" className="block dark:hidden">
          <img src="https://startupfa.me/badges/featured-badge.webp" alt="BulkResizeImages - Featured on Startup Fame" className="h-8 w-auto max-w-40" />
        </a>

        <a href="https://www.producthunt.com/products/bulkresizeimage-online?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-bulkresizeimages&#0045;online" target="_blank" rel="noopener" className="hidden dark:block">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1001008&theme=dark" alt="BulkResizeImages&#0046;online - Batch&#0032;resize&#0032;images&#0032;fast&#0044;&#0032;private&#0044;&#0032;works&#0032;entirely&#0032;in&#0032;browser | Product Hunt" className="h-8" />
        </a>
        <a href="https://www.producthunt.com/products/bulkresizeimage-online?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-bulkresizeimages&#0045;online" target="_blank" rel="noopener" className="block dark:hidden">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1001008&theme=light" alt="BulkResizeImages&#0046;online - Batch&#0032;resize&#0032;images&#0032;fast&#0044;&#0032;private&#0044;&#0032;works&#0032;entirely&#0032;in&#0032;browser | Product Hunt" className="h-8" />
        </a>

        {/* <a href="https://magicbox.tools" target="_blank" rel="noopener" className="hidden dark:block">
          <img src="https://magicbox.tools/badge-dark.svg" alt="Featured on MagicBox.tools" className="h-8" />
        </a>
        <a href="https://magicbox.tools" target="_blank" rel="noopener" className="block dark:hidden">
          <img src="https://magicbox.tools/badge.svg" alt="Featured on MagicBox.tools" className="h-8" />
        </a> */}

        <a href="https://fazier.com/launches/bulkresizeimages.online" target="_blank" rel="noopener" className="block dark:hidden">
          <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=neutral" className="h-8 w-auto max-w-40" alt="Fazier badge" />
        </a>
        <a href="https://fazier.com/launches/bulkresizeimages.online" target="_blank" rel="noopener" className="hidden dark:block">
          <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=dark" className="h-8 w-auto max-w-40" alt="Fazier badge" />
        </a>

        <a href="https://similarlabs.com/?ref=embed" target="_blank" className="block dark:hidden">
          <img src="https://similarlabs.com/similarlabs-embed-badge-light.svg" alt="SimilarLabs Embed Badge" className="h-8 w-auto max-w-40" />
        </a>
        <a href="https://similarlabs.com/?ref=embed" target="_blank" className="hidden dark:block">
          <img src="https://similarlabs.com/similarlabs-embed-badge-dark.svg" alt="SimilarLabs Embed Badge" className="h-8 w-auto max-w-40" />
        </a>

        {/* <a title="ai tools code.market" href="https://code.market?code.market=verified" className="block dark:hidden">
          <img alt="ai tools code.market" title="ai tools code.market" src="https://code.market/assets/manage-product/featured-logo-bright.svg" className="h-8 w-auto max-w-40" />
        </a>
        <a title="ai tools code.market" href="https://code.market?code.market=verified" className="hidden dark:block">
          <img alt="ai tools code.market" title="ai tools code.market" src="https://code.market/assets/manage-product/featured-logo-dark.svg" className="h-8 w-auto max-w-40" />
        </a> */}

        <a href="https://findly.tools/bulkresizeimages-online?utm_source=bulkresizeimages-online" target="_blank" className="block dark:hidden">
          <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on findly.tools" className="h-8 w-auto max-w-40" />
        </a>
        <a href="https://findly.tools/bulkresizeimages-online?utm_source=bulkresizeimages-online" target="_blank" className="hidden dark:block">
          <img src="https://findly.tools/badges/findly-tools-badge-dark.svg" alt="Featured on findly.tools" className="h-8 w-auto max-w-40" />
        </a>

        <a href="https://dofollow.tools" target="_blank" className="hidden dark:block"><img src="https://dofollow.tools/badge/badge_dark.svg" alt="Featured on Dofollow.Tools" className="h-8 w-auto max-w-40" /></a>
        <a href="https://dofollow.tools" target="_blank" className="block dark:hidden"><img src="https://dofollow.tools/badge/badge_light.svg" alt="Featured on Dofollow.Tools" className="h-8 w-auto max-w-40" /></a>

        <a href="https://turbo0.com/item/bulkresizeimagesonline" target="_blank" rel="noopener noreferrer" className="block dark:hidden">
          <img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" className="h-8 w-auto max-w-40" />
        </a>
        <a href="https://turbo0.com/item/bulkresizeimagesonline" target="_blank" rel="noopener noreferrer" className="hidden dark:block">
          <img src="https://img.turbo0.com/badge-listed-dark.svg" alt="Listed on Turbo0" className="h-8 w-auto max-w-40" />
        </a>

        <a href="https://launchboard.dev" target="_blank" rel="noopener noreferrer">
          <img src="https://launchboard.dev/launchboard-badge.png" alt="Launched on LaunchBoard - Product Launch Platform" className="h-8 w-auto max-w-40"  />
        </a>

        <a target="_blank" href="https://www.goodfirms.co/photo-editing-software/">
          <img src="https://assets.goodfirms.co/badges/color-badge/photo-editing-software.svg" title="Top Photo Editing Software" alt="Top Photo Editing Software" className="h-8 w-auto max-w-40" />
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