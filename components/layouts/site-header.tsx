"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Link } from '@/i18n/navigation'
import logo from "@/public/logo.png"
import { NavItem } from "@/types"
import { Download } from "lucide-react"
// import { ChevronDown, Sprout } from "lucide-react"
// import { useSession } from "next-auth/react"

// PWA 类型定义
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

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
// import { ModeToggle } from "./mode-toggle"
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
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // 检查是否已经安装
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      console.log('PWA: App already installed')
      return
    }

    let hasHandled = false
    
    const handler = (e: Event) => {
      // 防止重复处理
      if (hasHandled) return
      
      console.log('PWA: beforeinstallprompt event fired')
      const installEvent = e as BeforeInstallPromptEvent
      
      // 阻止浏览器默认的 PWA 安装横幅
      installEvent.preventDefault()
      
      // 保存事件以便后续手动触发
      setDeferredPrompt(installEvent)
      setIsInstallable(true)
      hasHandled = true
    }

    window.addEventListener('beforeinstallprompt', handler)
    console.log('PWA: Waiting for install prompt...')

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
    
    // 无论用户接受或取消，都需要清理已使用的 prompt
    // beforeinstallprompt 事件只能使用一次
    setDeferredPrompt(null)
    
    if (outcome === 'accepted') {
      // 安装成功，隐藏按钮
      setIsInstallable(false)
    } else {
      // 用户取消了，暂时隐藏按钮，等待浏览器再次触发 beforeinstallprompt
      // 注意：浏览器可能会延迟触发或不再触发该事件（通常需要几天后）
      setIsInstallable(false)
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
          <Image src={logo} width={32} height={32} alt={siteConfig.title} />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter">
              {siteConfig.name}
              {/* <sup className="ml-1 text-xs text-muted-foreground">Online</sup> */}
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
              <span>{siteConfig.installApp}</span>
            </Button>
          )}

          <LanguageSwitcher />

          {/* <ModeToggle /> */}
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
