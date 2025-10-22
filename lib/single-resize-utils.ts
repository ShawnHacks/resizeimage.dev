import type { LengthUnit, SelectionRect } from '@/types/single-resize';

export const UNIT_FACTORS: Record<LengthUnit, number> = {
  px: 1,
  pt: 96 / 72,
  in: 96,
  cm: 37.7952755906,
  mm: 3.77952755906,
};

export function toPixels(value: number, unit: LengthUnit): number {
  return value * (UNIT_FACTORS[unit] ?? 1);
}

export function fromPixels(value: number, unit: LengthUnit): number {
  return value / (UNIT_FACTORS[unit] ?? 1);
}

export function clampSelection(
  selection: SelectionRect,
  imageWidth: number,
  imageHeight: number
): SelectionRect {
  const width = Math.max(1, Math.min(selection.width, imageWidth));
  const height = Math.max(1, Math.min(selection.height, imageHeight));
  const x = Math.min(Math.max(selection.x, 0), imageWidth - width);
  const y = Math.min(Math.max(selection.y, 0), imageHeight - height);

  return { x, y, width, height };
}

export function centerSelection(
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number
): SelectionRect {
  const clamped = clampSelection(
    {
      x: (imageWidth - width) / 2,
      y: (imageHeight - height) / 2,
      width,
      height,
    },
    imageWidth,
    imageHeight
  );

  return clamped;
}

export function fitSelectionToAspect(
  aspect: number,
  imageWidth: number,
  imageHeight: number
): SelectionRect {
  const imageAspect = imageWidth / imageHeight;
  if (imageAspect > aspect) {
    // image is wider than aspect => height constrained
    const height = imageHeight;
    const width = height * aspect;
    return centerSelection(width, height, imageWidth, imageHeight);
  }

  const width = imageWidth;
  const height = width / aspect;
  return centerSelection(width, height, imageWidth, imageHeight);
}

export function ensureMinimumSize(
  selection: SelectionRect,
  minSize = 20
): SelectionRect {
  const width = Math.max(selection.width, minSize);
  const height = Math.max(selection.height, minSize);
  return {
    ...selection,
    width,
    height,
  };
}

export function getAspectRatio(selection: SelectionRect): number {
  return selection.width / selection.height;
}
