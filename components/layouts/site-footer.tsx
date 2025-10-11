import React from "react"
import Image from "next/image"
import NextLink from "next/link"
import { Link } from '@/i18n/navigation'
import logo from "@/public/logo.png"
import FooterBadges from "./footer-badage"
import { getLocalizedSiteConfig, getLocalizedFooterConfig } from "@/config/site-i18n"
import { localeNames } from "@/i18n/routing"

import { Mail, Twitter } from "lucide-react"

import { cn } from "@/lib/utils"

interface SiteFooterProps {
  locale: string
  copyright?: string
  className?: string
}

export async function SiteFooter({
  locale,
  copyright,
  className,
}: SiteFooterProps) {

  const siteConfig = await getLocalizedSiteConfig(locale)
  const footerColumns = await getLocalizedFooterConfig(locale)
  
  const defaultCopyright = `© ${new Date().getFullYear()} ${siteConfig.companyName}. All rights reserved.`
  return (
    <footer
      className={cn("bg-background w-full border-t pt-12 px-2 md:px-0 text-sm", className)}
    >
      <div className="container pb-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-2">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={logo}
                  width={20}
                  height={20}
                  alt="Site logo"
                  className="h-6 w-6"
                />
                <span className="text-lg font-bold">{siteConfig.name}</span>
              </Link>
            </div>
            <p className="text-muted-foreground mb-4 max-w-sm leading-loose">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex items-center space-x-4">
              {/* twitter link */}
              {siteConfig.links?.twitter && (
                <Link href={siteConfig.links?.twitter} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </Link>
              )}
              {/* email link */}
              {siteConfig.mailSupport && (
                <Link href={`mailto:${siteConfig.mailSupport}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Link>
              )}
            </div>
          </div>

          {/* Footer columns */}
          {footerColumns.map((column, index) => (
            <div key={index} className="col-span-1">
              <h3 className="mb-3 text-base font-medium">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => {
                  const isExternal = link.href.startsWith('http')
                  const LinkComponent = isExternal ? NextLink : Link
                  
                  return (
                    <li key={linkIndex}>
                      <LinkComponent
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target={isExternal ? '_blank' : '_self'}
                      >
                        {link.label}
                      </LinkComponent>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <FooterBadges locale={locale} />

      {/* Language selector */}
      <div className="border-t border-b py-4">
        <div className="container flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {Object.entries(localeNames).map(([localeCode, localeName]) => (
            <Link
              key={localeCode}
              href="/"
              locale={localeCode}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                locale === localeCode 
                  ? "font-medium text-foreground underline underline-offset-4" 
                  : "text-muted-foreground"
              )}
            >
              {localeName}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom section with copyright and links */}
      <div className="py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-center text-sm">
            {copyright || defaultCopyright}
          </p>

          {/* <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {bottomLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                target={link.href.startsWith('http') ? '_blank' : '_self'}
              >
                {link.hasTranslation ? t(link.label) : link.label}
              </Link>
            ))}
            <ModeToggle />
          </nav> */}
        </div>
      </div>
    </footer>
  )
}
