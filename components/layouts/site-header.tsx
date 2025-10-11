"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Link } from '@/i18n/navigation'
import logo from "@/public/logo.png"
import { NavItem } from "@/types"
import { Download } from "lucide-react"
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
import { Button } from "@/components/ui/button"

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

  // PWA Install
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // 检查是否已经安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: App already installed')
    } else {
      console.log('PWA: Waiting for install prompt...')
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('PWA: No install prompt available')
      return
    }

    console.log('PWA: Showing install prompt')
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    console.log('PWA: Install outcome:', outcome)
    if (outcome === 'accepted') {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
  }

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

        <div className="items-center space-x-2 hidden md:flex">
          {/* PWA Install Button */}
          {isInstallable && (
            <Button
              variant="default"
              size="sm"
              onClick={handleInstallClick}
              className="gap-2 animate-in fade-in-50 slide-in-from-top-2 duration-300"
            >
              <Download className="h-4 w-4" />
              <span>Install App</span>
            </Button>
          )}

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
