export type ResizeMode = 
  | 'percentage'
  | 'fileSize'
  | 'dimensions'
  | 'width'
  | 'height'
  | 'longestSide';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export interface ImageFile {
  file: File;
  preview: string;
  dimensions: { width: number; height: number };
  fileSize: number;
}

export interface ResizePreset {
  name: string;
  description: string;
  mode: ResizeMode;
  value: number;
}
