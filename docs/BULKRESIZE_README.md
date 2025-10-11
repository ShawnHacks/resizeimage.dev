# BulkresizeImage - Resize Images Online

A privacy-focused, client-side image resizing tool that supports 6 different resize modes.

## 🎯 Features

- **6 Resize Modes**:
  - Percentage: Resize to a percentage of original size (10%-200%)
  - File Size: Resize to target file size (KB)
  - Image Dimensions: Custom width × height
  - Width: Fixed width, auto height
  - Height: Fixed height, auto width
  - Longest Side: Limit longest side, auto scale

- **Privacy First**: 100% client-side processing, no upload required
- **Batch Processing**: Resize multiple images at once
- **PWA Support**: Install as desktop/mobile app
- **Offline Capable**: Works without internet after first load
- **Format Support**: JPEG, PNG, WebP
- **Quick Presets**: Instagram, Twitter, Facebook, YouTube, Email

## 🚀 Tech Stack

- **Framework**: Next.js 15 + React 19
- **Styling**: TailwindCSS (Apple Design System colors)
- **Image Processing**: Pica (high-quality resizing)
- **File Handling**: FileSaver.js + JSZip
- **UI Components**: shadcn/ui + Lucide Icons
- **Animation**: Motion (Framer Motion)
- **PWA**: Service Worker + Manifest

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎨 Design System

### Colors (Apple Style)
- **Primary**: `#007AFF` (Apple Blue)
- **Background**: `#F5F5F7` (Light Gray)
- **Card**: `#FFFFFF` (White)
- **Text Primary**: `#1D1D1F` (Dark)
- **Text Secondary**: `#86868B` (Gray)
- **Border**: `#D2D2D7` (Light Border)
- **Success**: `#34C759` (Green)
- **Error**: `#FF3B30` (Red)

### Typography
- System font stack (-apple-system, SF Pro)
- Font sizes: text-xs to text-4xl
- Font weights: normal (400), medium (500), semibold (600), bold (700)

### Spacing
- Rounded corners: 8px, 12px, 16px
- Padding/Margin: 4px increments (4, 8, 12, 16, 24, 32)

## 📁 Project Structure

```
app/
├── [locale]/
│   ├── layout.tsx          # Root layout with PWA support
│   └── page.tsx            # Main page (imports page-resize)
├── page.tsx                # Root redirect
└── page-resize.tsx         # Main resize tool page

components/
├── resize/
│   ├── image-preview.tsx     # Image preview grid
│   ├── resize-controls.tsx   # Control panel (6 modes)
│   ├── download-button.tsx   # Download/ZIP button
│   └── structured-data.tsx   # SEO structured data
└── pwa-register.tsx          # PWA service worker registration

lib/
└── image-resize-utils.ts     # Core resize logic

types/
└── resize.ts                 # TypeScript types & presets

public/
├── manifest.json             # PWA manifest
└── sw.js                     # Service worker
```

## 🔧 Configuration

### PWA Manifest (`public/manifest.json`)
- Update `name`, `short_name`, `start_url`
- Configure `theme_color` and `background_color`
- Add app icons (192x192, 512x512)

### Service Worker (`public/sw.js`)
- Caches static assets
- Enables offline functionality
- Updates cache on new versions

### Environment Variables
None required for basic functionality. All processing is client-side.

## 🌐 SEO

### Meta Tags (in `app/[locale]/page.tsx`)
```typescript
title: 'BulkresizeImage - Resize Images Online Free'
description: 'Resize multiple images at once right in your browser...'
keywords: ['bulk resize image', 'resize image online', ...]
```

### Structured Data
- WebApplication schema
- Feature list
- Ratings (when available)

### Sitemap & Robots
- Generate sitemap.xml
- Configure robots.txt for SEO

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Cloudflare Pages
1. Connect GitHub repository
2. Build command: `pnpm build`
3. Output directory: `.next`

### Custom Domain
1. Add domain in hosting platform
2. Update `manifest.json` URLs
3. Update meta tags in layout.tsx
4. Configure SSL certificate

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit website
2. Click install icon in address bar
3. Confirm installation

### Mobile (iOS Safari)
1. Visit website
2. Tap Share button
3. Select "Add to Home Screen"

### Mobile (Android Chrome)
1. Visit website
2. Tap "Add to Home Screen" prompt
3. Confirm installation

## 🧪 Testing

### Manual Testing Checklist
- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Test each resize mode (6 modes)
- [ ] Test download single image
- [ ] Test download multiple images (ZIP)
- [ ] Test PWA installation
- [ ] Test offline mode
- [ ] Test mobile responsiveness

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari
- ✅ Android Chrome

## 🔐 Privacy

- **No uploads**: All processing happens in your browser
- **No tracking**: No analytics or user tracking
- **No data collection**: We don't store any images or data
- **Offline capable**: Works without internet connection

## 📄 License

© 2025 BulkresizeImage. Built with privacy in mind.

## 🙏 Credits

- Image processing: [Pica](https://github.com/nodeca/pica)
- UI framework: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- Framework: [Next.js](https://nextjs.org/)

## 🐛 Known Issues

None currently. Report issues as they're discovered.

## 🚀 Future Enhancements

- [ ] Add more presets (LinkedIn, Pinterest, etc.)
- [ ] Support HEIC/HEIF formats
- [ ] Add image quality comparison preview
- [ ] Add before/after slider
- [ ] Multi-language support (i18n)
- [ ] Dark mode support
- [ ] Batch rename options
- [ ] EXIF data preservation option

## 📞 Support

For questions or issues, please refer to the documentation or create an issue in the repository.
