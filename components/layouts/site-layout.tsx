import { NavItem } from "@/types"
import { getLocalizedNavItems } from "@/config/site-i18n"
import { NavMobile } from "@/components/layouts/mobile-nav"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
import { getLocale } from "next-intl/server"

interface SiteLayoutProps {
  navItems?: NavItem[]
  children: React.ReactNode
}

export async function SiteLayout({ children, navItems }: SiteLayoutProps) {
  const locale = await getLocale()
  const finalNavItems = navItems || await getLocalizedNavItems(locale)

  return (
    <div className="min-h-screen relative">
      <NavMobile navItems={finalNavItems} />
      <SiteHeader navItems={finalNavItems} scroll={true} />
      <main className="flex-1 px-2 md:px-0">{children}</main>
      <SiteFooter />
    </div>
  )
}
