# Site Configuration with Internationalization

This directory contains configuration files for the website with internationalization support.

## Files

- `site.ts` - **Deprecated** configuration with hardcoded English text
- `site-i18n.ts` - **New** internationalized configuration that supports multiple languages

## Usage

### For Server Components

```typescript
import { getLocalizedSiteConfig, getLocalizedNavItems, getLocalizedFooterConfig } from '@/config/site-i18n'

// In your server component or API route
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const siteConfig = await getLocalizedSiteConfig(locale)
  
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    // ... other metadata
  }
}

// Get localized navigation
const navItems = await getLocalizedNavItems(locale)

// Get localized footer
const footerConfig = await getLocalizedFooterConfig(locale)
```

### For Client Components

```typescript
'use client'

import { useLocalizedSiteConfig, useLocalizedNavItems, useLocalizedFooterConfig } from '@/config/site-i18n'

export function MyComponent() {
  const siteConfig = useLocalizedSiteConfig()
  const navItems = useLocalizedNavItems()
  const footerConfig = useLocalizedFooterConfig()
  
  return (
    <div>
      <h1>{siteConfig.title}</h1>
      <p>{siteConfig.description}</p>
      {/* Use navItems and footerConfig */}
    </div>
  )
}
```

## Translation Keys

The configuration uses the following translation keys from your message files:

### Site Configuration
- `SiteConfig.title` - Site title
- `SiteConfig.description` - Site description  
- `SiteConfig.keywords` - Array of SEO keywords

### Navigation
- `Header.Home` - Home navigation item
- `Header.Features` - Features navigation item
- `Header.FAQ` - FAQ navigation item
- `Header.About` - About navigation item
- `Header.Blog` - Blog navigation item

### Footer
- `Footer.Product` - Product column title
- `Footer.Resources` - Resources column title
- `Footer.Company` - Company column title
- `Footer.Features` - Features link
- `Footer.FAQ` - FAQ link
- `Footer.About` - About link
- `Footer.SiteMap` - Site map link
- `Footer.Pricing` - Pricing link
- `Footer.License` - License link
- `Footer.Contact` - Contact link
- `Footer.Roadmap` - Roadmap link
- `Footer.Documentation` - Documentation link
- `Footer.Blog` - Blog link
- `Footer.Cookie Policy` - Cookie policy link
- `Footer.Privacy Policy` - Privacy policy link
- `Footer.Terms of Service` - Terms of service link

## Migration Guide

If you're currently using the old `site.ts` configuration:

1. **Replace imports:**
   ```typescript
   // Old
   import { siteConfig } from '@/config/site'
   
   // New (server components)
   import { getLocalizedSiteConfig } from '@/config/site-i18n'
   const siteConfig = await getLocalizedSiteConfig(locale)
   
   // New (client components)
   import { useLocalizedSiteConfig } from '@/config/site-i18n'
   const siteConfig = useLocalizedSiteConfig()
   ```

2. **Update your translation files** to include the `SiteConfig` section with `title`, `description`, and `keywords`.

3. **Test thoroughly** to ensure all text is properly localized.

## Benefits

- ✅ **SEO-friendly**: Different titles, descriptions, and keywords for each language
- ✅ **Type-safe**: Full TypeScript support with proper types
- ✅ **Server & Client**: Works in both server and client components
- ✅ **Maintainable**: Centralized configuration with clear separation of concerns
- ✅ **Scalable**: Easy to add new languages by adding translation files
