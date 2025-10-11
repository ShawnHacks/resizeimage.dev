import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    // NEXTAUTH_URL: z.string().url().optional(),
    // AUTH_SECRET: z.string().min(1),
    // GOOGLE_CLIENT_ID: z.string().min(1),
    // GOOGLE_CLIENT_SECRET: z.string().min(1),
    // GITHUB_CLIENT_ID: z.string().min(1),
    // GITHUB_CLIENT_SECRET: z.string().min(1),
    // DATABASE_URL: z.string().min(1),
    TURNSTILE_SECRET_KEY: z.string().min(1),
    SCREENSHOTS_DIR: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // AUTH_SECRET: process.env.AUTH_SECRET,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    // GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    // DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    SCREENSHOTS_DIR: process.env.SCREENSHOTS_DIR,
  },
})
