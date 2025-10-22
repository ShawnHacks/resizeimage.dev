import type { Icon } from "lucide-react"

import { Icons } from "@/components/shared/icons"

export type SiteConfig = {
  name: string
  companyName: string
  domainName: string
  title: string
  description: string
  creator: string
  keywords: string[]
  url: string
  ogImage: string
  mailSupport: string
  links: {
    twitter: string
  },
  installApp?: string
}

export type BaseNavItem = {
  title: string
  href: string
}
export type NavItem = BaseNavItem & {
  external?: boolean
  defaultOpen?: boolean
  icon?: keyof typeof Icons
  badge?: number
  disabled?: boolean
  authorizeOnly?: UserRole
  children?: NavItem[]
}

export type MainNavItem = NavItem

export type FooterLink = {
  label: string
  href: string
  hasTranslation?: boolean
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}
