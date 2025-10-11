# Quick Start Guide - BulkresizeImage

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Test the Tool

1. **Upload Images**: Drag & drop or click to select images
2. **Choose Resize Mode**: Select from 6 available modes
3. **Configure Settings**: Adjust parameters as needed
4. **Resize**: Click the "Resize" button
5. **Download**: Download single image or ZIP archive

## 📋 Available Resize Modes

### 1. Percentage
Resize to a percentage of original size.
- **Range**: 10% - 200%
- **Use case**: Quick proportional scaling

### 2. File Size
Resize to target file size.
- **Range**: 10 KB - 5000 KB
- **Use case**: Meeting upload size limits
- **Note**: Adjusts both quality and dimensions

### 3. Image Dimensions
Custom width and height.
- **Lock aspect ratio**: Maintain proportions
- **Use case**: Exact size requirements

### 4. Width
Fixed width, auto height.
- **Use case**: Responsive web images

### 5. Height
Fixed height, auto width.
- **Use case**: Thumbnail grids

### 6. Longest Side
Limit longest dimension.
- **Use case**: Social media uploads (Instagram: 1080px)

## 🎯 Quick Presets

Pre-configured settings for common use cases:

- **Instagram Post**: 1080×1080 px
- **Twitter Header**: 1500×500 px
- **Facebook Cover**: 820×312 px
- **YouTube Thumbnail**: 1280×720 px
- **Email Friendly**: 800 px width
- **Compress Small**: < 100 KB

## 🔧 Configuration

### Update Domain (for Production)

1. Edit `app/[locale]/page.tsx`:
```typescript
const urlString = 'https://your-domain.com'
```

2. Edit `public/manifest.json`:
```json
{
  "start_url": "https://your-domain.com"
}
```

3. Edit `app/sitemap.ts`:
```typescript
const baseUrl = 'https://your-domain.com'
```

### Customize Theme Colors

Edit colors in components (Apple Blue by default):

- Primary: `#007AFF`
- Success: `#34C759`
- Error: `#FF3B30`

Search and replace `#007AFF` with your brand color.

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables

None required! All processing is client-side.

## 🧪 Testing Checklist

Before deployment, test:

- [ ] Single image upload
- [ ] Multiple image upload (10+ images)
- [ ] All 6 resize modes
- [ ] Download single image
- [ ] Download ZIP (multiple images)
- [ ] Mobile responsive design
- [ ] PWA installation (Chrome/Edge)
- [ ] Offline functionality

## 📱 Install as PWA

### Desktop (Chrome/Edge)
1. Click install icon (⊕) in address bar
2. Click "Install"

### Mobile (iOS)
1. Safari → Share → "Add to Home Screen"

### Mobile (Android)
1. Chrome → Menu → "Install app"

## 🐛 Troubleshooting

### Images not processing?
- Check browser console for errors
- Ensure image files are valid (JPG/PNG/WebP)
- File size limit: 50MB per image

### PWA not installing?
- Ensure HTTPS (required for PWA)
- Check manifest.json is accessible
- Clear browser cache

### Offline mode not working?
- Service worker may not be registered
- Check browser DevTools → Application → Service Workers
- Refresh page and try again

## 📚 Documentation

- [Full README](./BULKRESIZE_README.md)
- [Requirements](./requirements.md)

## 💡 Tips

1. **Batch Processing**: Upload up to 50 images at once
2. **Format Conversion**: Change output format (JPEG/PNG/WebP)
3. **Quality Control**: Adjust quality slider (File Size mode)
4. **Quick Reset**: Click "Resize More Images" to start over

## 🎉 Ready to Go!

Your BulkresizeImage tool is ready. Start resizing images with privacy and ease!
