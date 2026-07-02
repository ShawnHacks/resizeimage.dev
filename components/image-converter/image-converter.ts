import type {
  ConvertibleFormat,
  OutputConvertibleFormat,
} from '@/lib/image-convert-utils';

export interface ImageConversionDefinition {
  slug: string;
  from: ConvertibleFormat;
  to: OutputConvertibleFormat;
}

export const IMAGE_CONVERSIONS = [
  { slug: 'png-to-jpg', from: 'png', to: 'jpg' },
  { slug: 'jpg-to-png', from: 'jpg', to: 'png' },
  { slug: 'png-to-webp', from: 'png', to: 'webp' },
  { slug: 'jpg-to-webp', from: 'jpg', to: 'webp' },
  { slug: 'webp-to-png', from: 'webp', to: 'png' },
  { slug: 'webp-to-jpg', from: 'webp', to: 'jpg' },
  { slug: 'svg-to-png', from: 'svg', to: 'png' },
  { slug: 'svg-to-jpg', from: 'svg', to: 'jpg' },
  { slug: 'svg-to-webp', from: 'svg', to: 'webp' },
  { slug: 'heic-to-png', from: 'heic', to: 'png' },
  { slug: 'heic-to-jpg', from: 'heic', to: 'jpg' },
  { slug: 'heic-to-webp', from: 'heic', to: 'webp' },
  { slug: 'avif-to-png', from: 'avif', to: 'png' },
  { slug: 'avif-to-jpg', from: 'avif', to: 'jpg' },
  { slug: 'avif-to-webp', from: 'avif', to: 'webp' },
  { slug: 'tiff-to-png', from: 'tiff', to: 'png' },
  { slug: 'tiff-to-jpg', from: 'tiff', to: 'jpg' },
  { slug: 'tiff-to-webp', from: 'tiff', to: 'webp' },
  { slug: 'gif-to-png', from: 'gif', to: 'png' },
  { slug: 'gif-to-jpg', from: 'gif', to: 'jpg' },
  { slug: 'gif-to-webp', from: 'gif', to: 'webp' },
] as const satisfies readonly ImageConversionDefinition[];

export type ConversionSlug = (typeof IMAGE_CONVERSIONS)[number]['slug'];

const CONVERSION_MAP = new Map<ConversionSlug, ImageConversionDefinition>(
  IMAGE_CONVERSIONS.map((conversion) => [conversion.slug, conversion])
);

export function isValidConversionSlug(slug: string): slug is ConversionSlug {
  return CONVERSION_MAP.has(slug as ConversionSlug);
}

export function getConversionBySlug(slug: string): ImageConversionDefinition | null {
  return CONVERSION_MAP.get(slug as ConversionSlug) ?? null;
}

export function getOtherConversions(slug: string): ImageConversionDefinition[] {
  return IMAGE_CONVERSIONS.filter((conversion) => conversion.slug !== slug);
}
