import type { AspectCategory } from '@/types/single-resize';

export const ASPECT_RATIO_CATEGORIES: AspectCategory[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    presets: [
      { id: 'ig-story', label: 'Story', width: 1080, height: 1920, description: '9:16' },
      { id: 'ig-square', label: 'Square', width: 1080, height: 1080, description: '1:1' },
      { id: 'ig-portrait', label: 'Portrait', width: 1080, height: 1350, description: '4:5' },
      { id: 'ig-landscape', label: 'Landscape', width: 1080, height: 566, description: '1.91:1' },
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    presets: [
      { id: 'yt-thumb', label: 'Thumbnail', width: 1280, height: 720, description: '16:9' },
      { id: 'yt-landscape', label: 'Landscape', width: 1920, height: 1080, description: '16:9' },
      { id: 'yt-shorts', label: 'Shorts', width: 1080, height: 1920, description: '9:16' },
    ],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    presets: [
      { id: 'fb-post', label: 'Post', width: 1200, height: 628, description: '1.91:1' },
      { id: 'fb-feed-landscape', label: 'Feed Landscape', width: 1280, height: 720, description: '16:9' },
      { id: 'fb-feed-portrait', label: 'Feed Portrait', width: 720, height: 1280, description: '9:16' },
      { id: 'fb-story', label: 'Story', width: 720, height: 1280, description: '9:16' },
    ],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    presets: [
      { id: 'li-blog', label: 'Blog Post', width: 1200, height: 628, description: '1.91:1' },
      { id: 'li-post', label: 'Post', width: 1920, height: 1920, description: '1:1' },
      { id: 'li-landscape', label: 'Landscape', width: 1920, height: 1080, description: '16:9' },
      { id: 'li-vertical', label: 'Vertical', width: 1080, height: 1920, description: '9:16' },
    ],
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    presets: [
      { id: 'sc-story', label: 'Story', width: 1080, height: 1920, description: '9:16' },
      { id: 'sc-standard', label: 'Standard', width: 1080, height: 1920, description: '9:16' },
    ],
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    presets: [
      { id: 'tw-post', label: 'Post', width: 1200, height: 670, description: '16:9' },
      { id: 'tw-landscape', label: 'Landscape', width: 1280, height: 720, description: '16:9' },
      { id: 'tw-portrait', label: 'Portrait', width: 720, height: 1280, description: '9:16' },
      { id: 'tw-square', label: 'Square', width: 1200, height: 1200, description: '1:1' },
    ],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    presets: [
      { id: 'pin', label: 'Pin', width: 735, height: 1102, description: '2:3' },
      { id: 'pin-standard', label: 'Standard Pins', width: 1080, height: 1620, description: '2:3' },
      { id: 'pin-square', label: 'Pin Square', width: 1080, height: 1080, description: '1:1' },
      { id: 'pin-vertical', label: 'Pin Vertical', width: 1080, height: 1920, description: '9:16' },
    ],
  },
  {
    id: 'standard',
    label: 'Standard',
    presets: [
      { id: 'std-widescreen', label: 'Widescreen', width: 1920, height: 1080, description: '16:9' },
      { id: 'std-phone', label: 'Phone', width: 1170, height: 2532, description: '9:16' },
      { id: 'std-slide', label: 'Presentation Slide', width: 1600, height: 1200, description: '4:3' },
      { id: 'std-square', label: 'Square', width: 1080, height: 1080, description: '1:1' },
      { id: 'std-landscape', label: 'Landscape', width: 1800, height: 1200, description: '3:2' },
      { id: 'std-portrait', label: 'Portrait', width: 1200, height: 1800, description: '2:3' },
    ],
  },
];

export const DEFAULT_CUSTOM_PRESET = {
  id: 'custom',
  label: 'Custom',
};
