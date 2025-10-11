"use client"

import React from "react"
import Image from "next/image"
import { Link } from '@/i18n/navigation'
import logo from "@/public/logo.png"
import { NavItem } from "@/types"
// import { ChevronDown, Sprout } from "lucide-react"
// import { useSession } from "next-auth/react"

import { useLocalizedSiteConfig } from "@/config/site-i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useScroll } from "@/lib/hooks/use-scroll"
import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"

// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { UserAccountNav } from "@/components/layouts/user-account-nav"

interface SiteHeaderProps {
  navItems?: NavItem[]
  className?: string
  scroll?: boolean
}

export function SiteHeader({
  navItems = [],
  className,
  scroll = false,
}: SiteHeaderProps) {

  const scrolled = useScroll(50)
  // const router = useRouter()
  // const { data: session, status } = useSession()

  const siteConfig = useLocalizedSiteConfig()

  return (
    <header
      className={cn(
        "bg-background/60 sticky top-0 z-40 w-full backdrop-blur-xl transition-all px-2 md:px-0",
        scroll
          ? scrolled
            ? "border-b backdrop-blur-xl"
            : "bg-transparent"
          : "border-b",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* <div className="flex gap-6 md:gap-10"> */}
          {/* Logo */}
        <div className="flex items-center space-x-1">
          <Image src={logo} width={32} height={32} alt={siteConfig.name} />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter">
              {siteConfig.name}
              <sup className="ml-1 text-xs text-muted-foreground">Online</sup>
            </span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
          {navItems.map((item) => {
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="items-center space-x-4 hidden md:flex">
          {/* <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 font-medium text-green-600 dark:text-green-400 px-3 py-1.5 text-sm cursor-pointer transition-all hover:bg-green-500/20 animate-in fade-in-0 zoom-in-95 duration-300">Test1</div>
          <div className="flex items-center gap-1.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 text-sm cursor-pointer transition-all hover:bg-amber-500/20 animate-in fade-in-0 zoom-in-95 duration-300">Test2</div> */}
          <LanguageSwitcher />

          <ModeToggle />
        </div>

        {/* <div className="flex items-center space-x-4">
          {session ? (
            <div className="hidden md:block">
              <UserAccountNav />
            </div>
          ) : status === "unauthenticated" ? (
            <Button
              className="hidden gap-2 rounded-full px-5 md:flex"
              variant="default"
              size="sm"
              onClick={() => {
                const currentPath =
                  window.location.pathname + window.location.search
                router.push(
                  `/login?redirect=${encodeURIComponent(currentPath)}`
                )
              }}
            >
              <span>Sign In</span>
              <Icons.ArrowRight className="size-4" />
            </Button>
          ) : (
            <Skeleton className="hidden h-9 w-28 rounded-full lg:flex" />
          )}
        </div> */}
      </div>
    </header>
  )
}
