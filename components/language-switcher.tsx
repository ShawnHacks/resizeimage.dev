"use client"

import { useLocale } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { Languages } from "lucide-react"

import { localeNames, routing } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          {/* <span className="hidden sm:inline-block">
            {localeNames[locale] || locale}
          </span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {routing.locales.map((availableLocale) => (
          <DropdownMenuItem key={availableLocale} asChild>
            <Link
              href={pathname}
              locale={availableLocale}
              className={`cursor-pointer w-full ${
                locale === availableLocale 
                  ? "bg-accent text-accent-foreground" 
                  : ""
              }`}
            >
              <span className="flex items-center gap-2 w-full">
                {localeNames[availableLocale] || availableLocale}
                {locale === availableLocale && (
                  <span className="ml-auto text-xs opacity-60">✓</span>
                )}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
