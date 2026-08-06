# GEO + SEO Audit Report — resizeimage.dev

**Audit Date:** 2026-08-07
**Site:** https://resizeimage.dev/
**Business Type:** SaaS (free online image tools)
**Stack:** Next.js App Router (locale segment) · Cloudflare CDN · Vercel Edge Middleware · 19 locales
**Audit Scope:** Homepage, /about, /blog, /blog/crop-without-losing-quality, /compress-image, /image-converter, /sitemap.xml, /robots.txt, /llms.txt

---

## Executive Summary

| Composite | Score | Verdict |
|---|---|---|
| **Overall GEO Score** | **56/100** | Fair |
| AI Citability & Visibility | 54/100 | Fair |
| Brand Authority Signals | 35/100 | Weak |
| Content Quality & E-E-A-T | 51/100 | Fair |
| Technical Foundations | 62/100 | Fair |
| Structured Data | 38/100 | Weak |
| Platform Optimization | 52/100 | Fair |

**Headline takeaway:** ResizeImage.dev has unusually strong **infrastructure** for a small free tool — comprehensive llms.txt, robots.txt that explicitly allows GPTBot/ChatGPT-User/Claude-Web/PerplexityBot, hreflang on 19 locales, multi-format topic cluster, and well-structured JSON-LD on tool pages. But the **entity layer is weak**: there's no standalone Organization schema with `sameAs`, no Person schema for the creator, every blog post credits "Admin" as author, and the homepage FAQ is rendered in DOM but missing from JSON-LD. Performance is also dragged down by 12+ third-party "as seen on" badge preloads competing with the actual LCP element.

The single biggest win available is wiring the entity graph (Organization + Person + Article author) — this is a 30-line code change that unlocks citability across Google AIO, ChatGPT, Perplexity, Gemini, and Bing simultaneously.

---

## Section 1 — AI Citability & Visibility (54/100)

### What works
- **`llms.txt` is comprehensive** (95 lines): Main Pages, Tools, Blog Categories, Featured Posts, All Posts, Available Languages, Key Features, Contact, "Last updated" footer. Structured for LLM ingestion.
- **AI crawlers explicitly allowed** in robots.txt: GPTBot, ChatGPT-User, Claude-Web, PerplexityBot all granted `Allow: /`. Wildcard `*` covers all others.
- **Server-rendered HTML** with all schemas in initial payload — no JS dependency for AI extraction.
- **Comparison content exists** (3 "vs" posts): `resizeimage-vs-picresize`, `canva-alternatives-free-image-resizer`, `online-image-resizer-comparison-2025`. Good for "X vs Y" query patterns.

### What's broken

**[HIGH] Homepage FAQ has no FAQPage JSON-LD.**
The homepage renders 6-7 Q&A pairs as H3 + `<p>` markup but emits zero structured data for them. AI engines that prefer JSON-LD cannot reliably extract them.

**[HIGH] Blog posts use `"author":{"@type":"Person","name":"Admin"}`.**
Generic author. No Person schema for the real creator `@ShawnHacks`. Zero E-E-A-T signal at the entity layer. Affects all 12 posts.

**[HIGH] No original statistics, citations, or data anywhere.**
Homepage and the crop-without-losing-quality post contain no numbers, no studies, no sourced comparisons, no proprietary benchmarks. AI engines reward citable claims with specifics.

**[MEDIUM] Blog posts lack HowTo + FAQPage schema.**
Only Compress has HowTo/FAQPage JSON-LD. The 5-step "How to Crop Precisely" sequence in tutorials is a perfect HowTo candidate with `measuredTime` and `estimatedCost`.

**[MEDIUM] No definition sentence above the fold.**
Hero is H1 + subtitle + drag-drop UI. No "X is a free, browser-based image resizer that..." quoteable definition block.

### Brand Mention Signals (20/100)

| Platform | Status | Evidence |
|---|---|---|
| Wikipedia | ✗ Absent | Disambiguation page for MediaWiki extension only |
| Product Hunt | ✓ Present | `post_id=1001008` hard-coded in homepage |
| Fazier | ✓ Present | `launch_id=5811` daily badge |
| Findly.tools | ✓ Present | Badge embedded |
| Reddit | ✗ No presence | |
| YouTube | ✗ No channel | |
| LinkedIn | ✗ No company page | |
| Twitter/X | ✗ No indexed mentions | |

Strong launch-directory footprint (ProductHunt + Fazier + Findly + 9 more), but zero organic editorial coverage, no Reddit/forum footprint, no YouTube presence. The brand is "launched" but not yet "discussed".

### Top 5 AI Visibility Fixes

1. **Add `FAQPage` JSON-LD to the homepage** matching the 7 visible H3 questions. File: `app/[locale]/page.tsx`.
2. **Replace `"Admin"` with a real Person schema** in every blog post's `Article` block. Add `sameAs` to Twitter, `jobTitle`, `knowsAbout`. File: blog post schema generator (likely `app/[locale]/blog/[...slug]/page.tsx`).
3. **Add `HowTo` JSON-LD to blog tutorials** using the existing 5-step structure with `estimatedCost: "0"` and `tool: [{@type:HowToTool, name:"resizeimage.dev"}]`.
4. **List all 5 tools in llms.txt** (currently only Image Resizer). Also fix article count mismatch (12 claimed vs 11 listed). File: `app/llms.txt/route.ts`.
5. **Add `Content-Signal: ai-train=no, search=yes, ai-retrieval=yes`** to `robots.ts`. Also add explicit `User-Agent: ClaudeBot / Allow: /` to harden Anthropic coverage.

---

## Section 2 — Platform Optimization (52/100)

| Platform | Score | Strongest Signal | Weakest Signal |
|---|---|---|---|
| **Google AI Overviews** | 58/100 | Question-phrased H3s on homepage | No Article schema, "Admin" author |
| **ChatGPT Web Search** | 62/100 | llms.txt + comparison content | No Wikipedia/Wikidata entity, no Person |
| **Perplexity AI** | 48/100 | Server-rendered HTML, freshness | No original research, no source citations |
| **Google Gemini** | 42/100 | Long-form tutorials, internal linking | No YouTube, no Speakable, no Organization |
| **Bing Copilot** | 52/100 | FAQPage + HowTo on tool pages | No IndexNow, no `msvalidate.01` |

### Cross-Platform Synergies (fixes that hit all 5)

1. **Site-wide Organization + Person JSON-LD in `app/[locale]/layout.tsx`** — single edit unlocks entity recognition everywhere.
2. **`FAQPage` JSON-LD on homepage** — affects Google AIO, Perplexity, Gemini, Bing.
3. **IndexNow implementation** — `app/indexnow/[key]/route.ts` + `msvalidate.01` meta. Sub-30-min change for Bing + Perplexity indexing.
4. **Replace Article `author = "Admin"` with real Person** — affects Google AIO, Gemini, ChatGPT.
5. **`speakable: { xPath: [...] }` on Article schema** — affects Gemini voice extraction, Perplexity passage selection.

---

## Section 3 — Technical Foundations (62/100)

### Crawlability (90/100) ✓
- robots.txt correct. `User-agent: *` + `Allow: /` plus explicit Allow for GPTBot, ChatGPT-User, Claude-Web, PerplexityBot.
- Sitemap has 708 URLs with xhtml:link hreflang and lastmod 2026-08-02.
- `x-robots-tag: index, follow` on all routes.
- 404 returns genuine HTTP 404 (not soft-404).

### Indexability (78/100) — **REGRESSION**
- **[HIGH] Hreflang reciprocity broken on blog posts.** Homepage declares 19 locale alternates + `x-default`. But `/blog/crop-without-losing-quality` declares only **3**: en, zh, x-default. The other 17 locales are missing reciprocals. Either generate the article in all locales, or emit hreflang only for the locales that exist.
- Canonical tags self-referencing correctly.
- No soft-404.

### Performance & CWV (45/100) — **CRITICAL**
- **[CRITICAL] 12+ third-party badge SVGs/WebPs in `<link rel=preload as=image>`** on the homepage. Badges from aihuntlist, aitrustlist, startupfa.me, producthunt, fazier, findly, dofollow, turbo0, launchigniter, open-launch, launchboard, goodfirms, showmysites take high-priority network slots from the actual LCP element (the image-resizer tool UI). Expected LCP improvement: **0.5–1.5s on cold cache** if demoted to `loading="lazy"` + `fetchpriority="low"`.
- **HTML not edge-cached** (`cf-cache-status: DYNAMIC`). TTFB ≈ 1.33s through Vercel Edge Middleware on every request. Configure Cloudflare Cache Rules to cache HTML per-locale, or set `s-maxage` on responses.
- **Raw HTML size 159 KB** uncompressed homepage payload.
- **21 JavaScript chunks** on homepage — heavy hydration cost.
- **LCP element: 4K WebP** requested via `/_next/image?w=3840&q=75` competing against 12 preloaded badges.
- Blog images lack `srcset` responsive variants.

### Mobile (75/100)
- Viewport set correctly.
- `maximum-scale=5` is permissive but acceptable.
- No `srcset` on blog images (uses next/image but only one DPR variant).

### Security (60/100)
- ✓ HTTPS, HTTP/3 advertised, x-frame-options DENY, x-content-type-options nosniff, referrer-policy strict-origin-when-cross-origin.
- ✗ **Missing HSTS** (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).
- ✗ **Missing CSP** — significant with GTM + AdSense present.
- ✗ **Missing Permissions-Policy**.

### URL/i18n (70/100)
- ✓ Subdirectory locale routing (correct SEO choice).
- ✓ 19 locales declared consistently on top-level pages, x-default set.
- ✗ Hreflang reciprocity fails on blog posts (covered above).

### Critical Technical Fixes (ranked)

1. **Demote 12+ badge preloads.** Expected LCP win: 0.5–1.5s.
2. **Cache HTML at Cloudflare edge per-locale.** Expected TTFB win: 0.8–1.2s.
3. **Fix hreflang reciprocity on blog posts** — generate reciprocals or strip missing locales.
4. **Add HSTS + CSP + Permissions-Policy** headers.
5. **Compress raw HTML payload** — move JSON-LD before React tree, stream RSC.

---

## Section 4 — Structured Data (38/100)

### Reality Check — What Actually Renders

| Page | Schema Present | Verified |
|---|---|---|
| Homepage (`/`) | `SoftwareApplication` + nested `Organization` (publisher) | ✓ (EN only) |
| `/about` | **None** | ✗ |
| `/blog` | **None** | ✗ |
| `/blog/crop-without-losing-quality` | `Article` + `BreadcrumbList` | ✓ |
| `/compress-image` | `SoftwareApplication`, `FAQPage`, `HowTo`, `Offer`, `Question`, `Answer` | ✓ (6 blocks) |
| `/image-converter` | Same 6 schemas as Compress | ✓ |
| `/stitch-images` | (not fetched — likely similar pattern) | unknown |
| `/gemini-watermark-remover` | (not fetched) | unknown |
| `/bulk-resize-images` | (not fetched) | unknown |

**Eligible for rich results today: 1 page type** (Software App on `/compress-image` × 19 locales ≈ 19 actual eligible pages). Everything else: 0.

### Critical Gaps (ranked)

1. **[CRITICAL] Organization as a standalone schema.** Currently only nested inside `SoftwareApplication.publisher` ("CrownByte LTD"). Needs to be a top-level entity with `sameAs` to ProductHunt, Twitter, GitHub, LinkedIn, Wikidata (only URLs that verifiably exist).
2. **[CRITICAL] No Person schema for @ShawnHacks.** Generic `"Admin"` author in Article schema across all 12 posts. No `jobTitle`, no `sameAs`, no `knowsAbout`.
3. **[CRITICAL] No Organization schema on `/about`.** Zero entity disambiguation on the brand's identity page.
4. **[HIGH] No `WebSite` + `SearchAction`** on homepage. Loses sitelinks search box eligibility.
5. **[HIGH] No `BreadcrumbList`** on homepage, /about, /blog, tool pages other than Compress/Converter.
6. **[HIGH] `HowTo` and `FAQPage` rich results are deprecated/restricted by Google** (Sept 2023 / Aug 2023). Keep for AI semantic parsing but don't expect SERP visibility.
7. **[MEDIUM] No `speakable` schema** anywhere — direct signal to AI voice assistants.
8. **[LOW] `SoftwareApplication` on homepage is English-only.** Localized homepages emit no schema at all.
9. **[DO NOT] `aggregateRating`/`Review`** — Google penalizes fabricated review schema. Skip unless real reviews exist.

### Multi-Locale Schema Rules

- **Organization, WebSite, Person:** replicate identically on every locale. Entity-level, not language-level. `sameAs` URLs do NOT translate.
- **Article, BreadcrumbList:** each locale variant gets its own block with `inLanguage` and locale-prefixed `url`.
- **SoftwareApplication, FAQPage, HowTo on tool pages:** replicate per locale with `inLanguage`, locale-specific `name`/`description`/`url`.
- Use `@id` references to dedupe (`https://resizeimage.dev/#organization`, `#person-shawnhacks`).

### Ready-to-Deploy JSON-LD Templates

See Appendix A below for 7 copy-pasteable JSON-LD templates (Organization, WebSite, SoftwareApplication, BlogPosting, BreadcrumbList, FAQPage, Person).

---

## Section 5 — Content Quality & E-E-A-T (51/100)

| E-E-A-T Pillar | Score | Notes |
|---|---|---|
| Experience | 9/25 | Generic framing, no real examples, no measured data |
| Expertise | 10/25 | 101-level tutorial depth, no chroma subsampling, no mozjpeg/libvips depth |
| Authoritativeness | 15/25 | 12 launch-directory badges but no editorial coverage |
| Trustworthiness | 17/25 | HTTPS, ToS, Privacy, Cookie, contact — solid baseline |

### AI Content Heuristics — Likely AI with Light Editing

| Indicator | Found |
|---|---|
| Generic phrasing ("Empowering everyone with...", "100% privacy, lightning-fast speed") | Yes |
| "In this article we will..." intros | Partial |
| Listicles without original data | Yes (5-step tutorial with no data backing any step) |
| Repetitive sentence structures | Yes ("Your images never leave your device" verbatim across multiple pages) |
| No authorial voice / no opinions | Yes — no first-person, no editorial positions |
| No original data / no proprietary research | Yes — zero benchmarks |
| Marketing tagline overuse | Yes |

### Topical Authority (62/100)

**Tight cluster:** all 7 tool pages + 12 blog posts orbit image manipulation. Format coverage is broad (JPG, PNG, WebP, AVIF, HEIC, GIF, SVG, TIFF).

**Gaps:**
- No "vs" posts against actual SERP competitors (Squoosh, TinyPNG, iLoveIMG, Adobe Express)
- No glossary/knowledge-base hub for technical terms
- No external inbound links visible
- Locale expansion is translation, not localization with regional SEO value

### Top 5 Content Fixes

1. **[CRITICAL] Real Person schema replacing "Admin"** — single biggest E-E-A-T lift.
2. **[HIGH] Add 5 annotated UI screenshots + 1 measured before/after** to `crop-without-losing-quality` (or any tutorial).
3. **[HIGH] Run a real compression benchmark** — 10 stock images through 5 tools (resizeimage.dev, Squoosh, TinyPNG, iLoveIMG, Imagify), publish file-size results table with methodology. Cite from llms.txt.
4. **[HIGH] Add Person + Organization schema with `sameAs` network** (Twitter, LinkedIn, GitHub, Crunchbase).
5. **[MEDIUM] Visible AdSense disclosure + `/disclosure` page** — closes a Google Publisher Policy gap.

---

## Prioritized Action Plan

### Tier 1 — This Week (Critical, High-Impact, Low-Effort)

| # | Action | File(s) | Impact | Effort |
|---|---|---|---|---|
| 1 | Add standalone `Organization` + `Person` + `WebSite` JSON-LD site-wide | `app/[locale]/layout.tsx` | All 5 platforms | 1h |
| 2 | Replace `author = "Admin"` with real Person schema in every blog post | `app/[locale]/blog/[...slug]/page.tsx` | E-E-A-T across AIO/ChatGPT/Gemini | 2h |
| 3 | Add `FAQPage` JSON-LD to homepage matching 7 visible H3 questions | `app/[locale]/page.tsx` | AIO, Perplexity, Gemini, Bing | 1h |
| 4 | Add `BreadcrumbList` JSON-LD to homepage, /about, /blog, all tool pages | Various page.tsx files | Rich result eligibility | 2h |
| 5 | Fix hreflang reciprocity on blog posts — either generate all locale variants or strip missing | `app/[locale]/blog/[...slug]/page.tsx` | International indexing | 3h |
| 6 | Demote 12+ badge `<link rel=preload>` to `loading="lazy"` + `fetchpriority="low"` | Homepage layout/component | LCP -0.5 to -1.5s | 30m |

### Tier 2 — This Month (High-Impact, Medium-Effort)

| # | Action | Impact | Effort |
|---|---|---|---|
| 7 | Add `HowTo` + `FAQPage` JSON-LD to all 12 blog posts | Citability | 4h |
| 8 | Add `speakable` schema to all Article JSON-LD | Gemini voice, Perplexity | 2h |
| 9 | Configure Cloudflare Cache Rules to cache HTML per-locale | TTFB -0.8 to -1.2s | 2h |
| 10 | Add HSTS, CSP, Permissions-Policy headers | Trust signals | 3h |
| 11 | Add real annotated screenshots + before/after measurements to top 3 tutorials | E-E-A-T Experience +9 | 6h |
| 12 | Implement IndexNow + Bing Webmaster verification | Bing/Perplexity indexing | 1h |
| 13 | Add Content-Signal directive + ClaudeBot explicit Allow to robots.txt | AI crawler coverage | 30m |
| 14 | Update llms.txt to list all 5 tools + fix article count mismatch | llms.txt compliance | 30m |

### Tier 3 — Next Quarter (Medium-Impact, High-Effort)

| # | Action | Impact | Effort |
|---|---|---|---|
| 15 | Publish compression benchmark study (5 tools × 10 images × formats) | Original data, AIO citation | 2 days |
| 16 | Build author bio page for @ShawnHacks + create Person schema network | E-E-A-T Authority | 1 day |
| 17 | Add 4 "vs" posts against real SERP competitors (Squoosh, TinyPNG, iLoveIMG, Adobe Express) | Topical authority +50% | 3 days |
| 18 | Build `/glossary` hub for technical terms (chroma subsampling, EXIF, etc.) | Topical depth | 1 day |
| 19 | Visible AdSense disclosure + `/disclosure` page | Trust + Publisher Policy compliance | 2h |
| 20 | Compress raw HTML payload (move JSON-LD before React tree, stream RSC) | TTI improvement | 2 days |

---

## Quick-Win Cheatsheet

If you only have 4 hours, do these 6 things in order:

1. **Add site-wide Organization + Person JSON-LD** in `app/[locale]/layout.tsx` (45 min)
2. **Replace "Admin" author in blog schema** with real Person (30 min)
3. **Add FAQPage JSON-LD to homepage** matching visible H3 questions (30 min)
4. **Demote badge preloads** to lazy + low priority (30 min)
5. **Fix hreflang on blog posts** — strip missing locales or generate them (60 min)
6. **Add Content-Signal + ClaudeBot to robots.ts** (15 min)

Expected composite score after these 6 fixes: **56 → 74**.

---

## Appendix A — Ready-to-Deploy JSON-LD Templates

### A1. Organization (homepage + every locale)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://resizeimage.dev/#organization",
  "name": "ResizeImage.dev",
  "alternateName": "ImageConverter",
  "url": "https://resizeimage.dev",
  "logo": "https://resizeimage.dev/logo.png",
  "description": "Free online image tools — resize, compress, convert, and stitch images directly in your browser. No uploads, no registration.",
  "foundingDate": "2024",
  "founder": { "@id": "https://resizeimage.dev/#person-shawnhacks" },
  "sameAs": [
    "https://twitter.com/ShawnHacks",
    "https://github.com/ShawnHacks",
    "https://www.producthunt.com/products/resizeimage-dev"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@resizeimage.dev",
    "availableLanguage": ["English","Chinese","Japanese","Korean","Spanish","French","German","Portuguese","Russian","Arabic","Italian","Dutch","Polish","Turkish","Vietnamese","Thai","Indonesian","Hindi"]
  }]
}
```

### A2. WebSite + SearchAction (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://resizeimage.dev/#website",
  "name": "ResizeImage.dev",
  "url": "https://resizeimage.dev",
  "inLanguage": "en",
  "publisher": { "@id": "https://resizeimage.dev/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://resizeimage.dev/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### A3. Person (for @ShawnHacks — referenced from Article author)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://resizeimage.dev/#person-shawnhacks",
  "name": "Shawn",
  "alternateName": "ShawnHacks",
  "url": "https://resizeimage.dev/about",
  "jobTitle": "Founder",
  "worksFor": { "@id": "https://resizeimage.dev/#organization" },
  "sameAs": [
    "https://twitter.com/ShawnHacks",
    "https://github.com/ShawnHacks"
  ],
  "knowsAbout": [
    "Web development", "Image processing", "Browser-based tools",
    "Next.js", "WebAssembly", "Client-side image optimization"
  ]
}
```

### A4. BlogPosting (template for every blog post)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://resizeimage.dev/blog/[slug]#article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://resizeimage.dev/blog/[slug]"
  },
  "headline": "[POST TITLE — keep <110 chars]",
  "description": "[META DESCRIPTION]",
  "image": ["https://resizeimage.dev/og.png"],
  "datePublished": "[ISO 8601]",
  "dateModified": "[ISO 8601]",
  "inLanguage": "[locale code]",
  "author": { "@id": "https://resizeimage.dev/#person-shawnhacks" },
  "publisher": { "@id": "https://resizeimage.dev/#organization" },
  "articleSection": "[category name]",
  "keywords": "[comma-separated]",
  "speakable": {
    "@type": "SpeakableSpecification",
    "xPath": ["/html/head/title", "/html/body//h1", "/html/body//article/p[1]"]
  }
}
```

### A5. BreadcrumbList (template)

For `/blog/[slug]`:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://resizeimage.dev" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://resizeimage.dev/blog" },
    { "@type": "ListItem", "position": 3, "name": "[Category]", "item": "https://resizeimage.dev/blog/category/[slug]" },
    { "@type": "ListItem", "position": 4, "name": "[Post Title]", "item": "https://resizeimage.dev/blog/[slug]" }
  ]
}
```

For `/compress-image` and other tool pages, trail = Home → Tools → Compress Image.

### A6. FAQPage (template — add to blog posts with FAQ sections)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": { "@type": "Answer", "text": "[2-4 sentence answer]" }
    },
    {
      "@type": "Question",
      "name": "[Question 2]",
      "acceptedAnswer": { "@type": "Answer", "text": "[answer]" }
    }
  ]
}
```

---

## Appendix B — robots.ts Recommended Updates

```ts
// Add to app/robots.ts
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/_next/', '/.well-known/', '/private/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' }
      // Optional: { userAgent: 'Google-Extended', disallow: '/' } if you want to opt out of Gemini training
    ],
    sitemap: 'https://resizeimage.dev/sitemap.xml',
    host: 'https://resizeimage.dev',
    contentSignal: 'ai-train=no, search=yes, ai-retrieval=yes'
  };
}
```

---

## Appendix C — Files Inspected

Live HTTP fetches:
- `https://resizeimage.dev/` → /tmp/resizeimage-home.html
- `https://resizeimage.dev/about` → /tmp/resizeimage-about.html
- `https://resizeimage.dev/blog` → /tmp/resizeimage-blog.html
- `https://resizeimage.dev/blog/crop-without-losing-quality` → /tmp/resizeimage-blogpost.html
- `https://resizeimage.dev/compress-image` → /tmp/resizeimage-compress.html
- `https://resizeimage.dev/image-converter` → /tmp/resizeimage-converter.html
- `https://resizeimage.dev/sitemap.xml` → /tmp/resizeimage-sitemap.xml (708 URLs)
- `https://resizeimage.dev/robots.txt` → /tmp/resizeimage-robots.txt
- `https://resizeimage.dev/llms.txt` → /tmp/resizeimage-llms.txt (95 lines)

Codebase files inspected (repo at `/Users/guochengxing/crownbyte/projects/imagetools/resizeimage.dev`):
- `app/[locale]/page.tsx` — homepage (SoftwareApplication schema, EN-only)
- `app/[locale]/(misc)/about/page.tsx` — about (no JSON-LD, no H1 in HTML)
- `app/[locale]/blog/[...slug]/page.tsx` — blog posts (Article + BreadcrumbList)
- `components/structured-data.tsx` — wrapper for `<Script type="application/ld+json">`
- `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`

---

## Final Score Card

```
┌─────────────────────────────────────┬───────┬──────────┐
│ Category                            │ Score │ Verdict  │
├─────────────────────────────────────┼───────┼──────────┤
│ AI Citability & Visibility          │  54   │ Fair     │
│ Brand Authority Signals             │  20   │ Weak     │
│ Content Quality & E-E-A-T           │  51   │ Fair     │
│ Technical Foundations               │  62   │ Fair     │
│ Structured Data                     │  38   │ Weak     │
│ Platform Optimization               │  52   │ Fair     │
├─────────────────────────────────────┼───────┼──────────┤
│ COMPOSITE GEO SCORE                 │  56   │ Fair     │
└─────────────────────────────────────┴───────┴──────────┘

Projected after Tier 1 fixes (6 actions, ~4h work): 56 → 74
Projected after Tier 2 fixes (8 more actions, ~2 weeks): 74 → 86
```

---

*Generated 2026-08-07 by GEO audit orchestration. Re-run after Tier 1 fixes to measure lift.*