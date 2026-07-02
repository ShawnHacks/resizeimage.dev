import React from 'react';

interface JsonLdProps {
  data: any;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getSoftwareAppSchema({
  name,
  description,
  url,
  image,
  applicationCategory = 'MultimediaApplication',
  operatingSystem = 'Windows, MacOS, Android, iOS',
}: {
  name: string;
  description: string;
  url: string;
  image: string;
  applicationCategory?: string;
  operatingSystem?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    image,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function getHowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { title: string; text: string; image?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.text,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/#step${index + 1}`,
      ...(step.image && { image: step.image }),
    })),
  };
}

export function getBlogPostingSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: [image],
    datePublished,
    dateModified,
    author: [
      {
        '@type': 'Person',
        name: authorName,
        url: authorUrl,
      },
    ],
  };
}

export function getFaqSchema(items: { question: string; answer: string }[]) {
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
