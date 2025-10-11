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

export const RESIZE_PRESETS: ResizePreset[] = [
  {
    name: 'Instagram Post',
    description: '1080×1080 px',
    mode: 'dimensions',
    value: 1080,
  },
  {
    name: 'Twitter Header',
    description: '1500×500 px',
    mode: 'width',
    value: 1500,
  },
  {
    name: 'Facebook Cover',
    description: '820×312 px',
    mode: 'width',
    value: 820,
  },
  {
    name: 'YouTube Thumbnail',
    description: '1280×720 px',
    mode: 'width',
    value: 1280,
  },
  {
    name: 'Email Friendly',
    description: '800 px width',
    mode: 'width',
    value: 800,
  },
  {
    name: 'Compress Small',
    description: '< 100 KB',
    mode: 'fileSize',
    value: 100,
  },
];
