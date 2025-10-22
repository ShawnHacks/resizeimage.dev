export type SingleImageFormat = 'jpeg' | 'png' | 'webp';

export type LengthUnit = 'px' | 'pt' | 'in' | 'cm' | 'mm';

export interface AspectPreset {
  id: string;
  label: string;
  width: number;
  height: number;
  description?: string;
}

export interface AspectCategory {
  id: string;
  label: string;
  presets: AspectPreset[];
}

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
