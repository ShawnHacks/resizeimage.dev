import { Geist as FontSans, Geist_Mono, Bricolage_Grotesque } from "next/font/google"
import localFont from "next/font/local"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const fontBricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})

const fontHeading = localFont({
  src: [
    {
      path: './ac-regular.woff2',
      weight: '400',
    },
    {
      path: './ac-semibold.woff2',
      weight: '600',
    },
    {
      path: './ac-bold.woff2',
      weight: '700',
    },
  ],
  variable: "--font-heading",
  display: 'swap',
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontBricolage.variable,
  fontHeading.variable
)
