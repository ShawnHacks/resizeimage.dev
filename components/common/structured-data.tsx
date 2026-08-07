/**
 * Site-wide structured data (JSON-LD) helpers.
 *
 * Every locale shares the same Organization + Person + WebSite identity.
 * Schema blocks reference each other via stable @id values so AI crawlers
 * and Google can resolve them as one entity graph.
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resizeimage.dev';
const AUTHOR_AVATAR = `${SITE_URL}/avatar/shawn.webp`;

/** Stable @id for the Organization entity. Referenced everywhere. */
export const ORG_ID = `${SITE_URL}/#organization`;

/** Stable @id for the Person entity (founder / author). */
export const PERSON_ID = `${SITE_URL}/#person-shawn`;

/** Stable @id for the WebSite entity. */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Stable @id for the primary SoftwareApplication product. */
export const APP_ID = `${SITE_URL}/#software-application`;

export interface OrganizationOptions {
  sameAs?: string[];
  description?: string;
}

export function getOrganizationSchema(opts: OrganizationOptions = {}) {
  const sameAs = opts.sameAs ?? [
    'https://twitter.com/ShawnHacks',
    'https://x.com/ShawnHacks',
    'https://www.producthunt.com/products/resizeimage-dev',
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Crownbyte LTD',
    alternateName: 'ResizeImage.dev',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og.png`,
    description:
      opts.description ??
      'Free online image tools — resize, compress, convert, stitch, and remove watermarks from images directly in your browser. No uploads, no registration.',
    foundingDate: '2024',
    founder: { '@id': PERSON_ID },
    sameAs,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@resizeimage.dev',
        availableLanguage: [
          'English', 'Chinese', 'Japanese', 'Korean', 'Spanish',
          'French', 'German', 'Portuguese', 'Russian', 'Arabic',
          'Italian', 'Vietnamese', 'Thai', 'Turkish', 'Indonesian',
          'Hindi', 'Bengali',
        ],
      },
    ],
  };
}

export interface PersonOptions {
  sameAs?: string[];
}

export function getPersonSchema(opts: PersonOptions = {}) {
  const sameAs = opts.sameAs ?? [
    'https://twitter.com/ShawnHacks',
    'https://x.com/ShawnHacks',
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Shawn H.',
    alternateName: ['Shawn', 'ShawnHacks'],
    url: `${SITE_URL}/about`,
    image: AUTHOR_AVATAR,
    jobTitle: 'Founder',
    worksFor: { '@id': ORG_ID },
    sameAs,
    knowsAbout: [
      'Web development',
      'Image processing',
      'Browser-based tools',
      'Next.js',
      'WebAssembly',
      'Client-side image optimization',
      'Web performance',
      'Privacy-first software',
    ],
    description:
      'Founder of ResizeImage.dev. Builds privacy-first browser-based image tools that run entirely in the user\'s browser.',
  };
}

export interface WebSiteOptions {
  inLanguage?: string;
}

export function getWebSiteSchema(opts: WebSiteOptions = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'ResizeImage.dev',
    url: SITE_URL,
    inLanguage: opts.inLanguage ?? 'en',
    description:
      'Free online image resizer, compressor, converter, stitcher, and watermark remover — runs 100% in your browser.',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

/**
 * Convenience helpers for the homepage FAQ. The FAQ items live in
 * i18n messages under SingleResizeTool.faq.items — pass the localized
 * items straight from getTranslations(...).raw('faq.items').
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export interface HowToStep {
  title: string;
  text: string;
}

export function getHowToSchema({
  name,
  description,
  steps,
  totalTime,
  estimatedCost,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    ...(estimatedCost ? { estimatedCost: { '@type': 'MonetaryAmount', value: estimatedCost, currency: 'USD' } } : {}),
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.title,
      text: step.text,
      url: `${SITE_URL}/#step${idx + 1}`,
    })),
  };
}

export interface SoftwareAppOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  featureList?: string[];
  screenshot?: string;
}

export function getSoftwareApplicationSchema(opts: SoftwareAppOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image ?? `${SITE_URL}/og.png`,
    ...(opts.screenshot ? { screenshot: opts.screenshot } : {}),
    applicationCategory: opts.applicationCategory ?? 'MultimediaApplication',
    operatingSystem: opts.operatingSystem ?? 'Any modern browser (Chrome, Firefox, Safari, Edge)',
    browserRequirements: 'Requires JavaScript enabled',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    ...(opts.featureList ? { featureList: opts.featureList } : {}),
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
  };
}

export interface BlogPostingOptions {
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  url: string;
  inLanguage: string;
  articleSection?: string;
  keywords?: string[];
  wordCount?: number;
}

export function getBlogPostingSchema(opts: BlogPostingOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    url: opts.url,
    inLanguage: opts.inLanguage,
    ...(opts.articleSection ? { articleSection: opts.articleSection } : {}),
    ...(opts.keywords ? { keywords: opts.keywords.join(', ') } : {}),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['head title', 'article h1', 'article > p:first-of-type'],
    },
  };
}

/**
 * Render any JSON-LD data as a server-rendered <script> tag.
 * Server-side rendered (not lazy-loaded) so AI crawlers can extract without JS.
 */
export function JsonLdScript({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}