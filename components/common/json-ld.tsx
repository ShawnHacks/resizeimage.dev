/**
 * Backwards-compatible wrapper around the typed schema helpers in
 * `./structured-data`. Existing tool pages import from this file —
 * the helpers below delegate to the centralized module so all
 * schema blocks share stable @id references and consistent shape.
 */

import React from 'react';
import * as SD from './structured-data';

export function JsonLd({ data }: { data: unknown }): React.ReactElement {
  return <SD.JsonLdScript data={data} />;
}

export function getSoftwareAppSchema(opts: SD.SoftwareAppOptions) {
  return SD.getSoftwareApplicationSchema(opts);
}

export function getHowToSchema(opts: {
  name: string;
  description: string;
  steps: SD.HowToStep[];
}) {
  return SD.getHowToSchema(opts);
}

export function getBlogPostingSchema(opts: SD.BlogPostingOptions) {
  return SD.getBlogPostingSchema(opts);
}

export function getFaqSchema(items: SD.FaqItem[]) {
  return SD.getFaqSchema(items);
}

export function getBreadcrumbListSchema(items: SD.BreadcrumbItem[]) {
  return SD.getBreadcrumbSchema(items);
}