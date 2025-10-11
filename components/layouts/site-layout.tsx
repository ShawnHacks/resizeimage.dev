import { NavItem } from "@/types"
import { getLocalizedNavItems } from "@/config/site-i18n"
import { NavMobile } from "@/components/layouts/mobile-nav"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface SiteLayoutProps {
  locale: string
  navItems?: NavItem[]
  children: React.ReactNode
}

export async function SiteLayout({ locale, children, navItems }: SiteLayoutProps) {
  const finalNavItems = navItems || await getLocalizedNavItems(locale)

  return (
    <div className="min-h-screen relative">
      <NavMobile navItems={finalNavItems} />
      <SiteHeader navItems={finalNavItems} scroll={true} />
      <main className="flex-1 px-2 md:px-0">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  )
}
