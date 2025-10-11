# Deployment Guide - BulkresizeImage

## 📦 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All dependencies installed (`pnpm install`)
- [ ] Code builds successfully (`pnpm build`)
- [ ] Domain name configured in code
- [ ] PWA manifest updated with production URL
- [ ] Icons generated (192x192, 512x512)
- [ ] Service worker tested
- [ ] SEO meta tags configured
- [ ] robots.txt and sitemap.xml configured

## 🌐 Update Domain Configuration

### 1. Update Metadata (`app/[locale]/page.tsx`)

```typescript
const urlString = 'https://bulkresizeimage.com' // Change to your domain
```

### 2. Update Manifest (`public/manifest.json`)

```json
{
  "name": "BulkresizeImage - Resize Images Online",
  "start_url": "https://bulkresizeimage.com",
  ...
}
```

### 3. Update Sitemap (`app/sitemap.ts`)

```typescript
const baseUrl = 'https://bulkresizeimage.com'
```

### 4. Update Robots.txt (`public/robots.txt`)

```
Sitemap: https://bulkresizeimage.com/sitemap.xml
```

### 5. Update Layout Metadata (`app/[locale]/layout.tsx`)

Check icons URLs in metadata configuration.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Zero-config, automatic HTTPS, global CDN, PWA support

#### Steps:

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel --prod
```

4. **Configure Domain**:
   - Go to Vercel Dashboard
   - Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

5. **Environment Variables** (if needed):
   - None required for basic functionality

### Option 2: Cloudflare Pages

**Pros**: Free tier, fast global CDN, DDoS protection

#### Steps:

1. **Connect GitHub Repository**:
   - Go to Cloudflare Dashboard
   - Pages → Create a project
   - Connect your repository

2. **Build Settings**:
   - Build command: `pnpm build`
   - Build output directory: `.next`
   - Root directory: `/`
   - Environment variables: None needed

3. **Deploy**:
   - Click "Save and Deploy"
   - Wait for build to complete

4. **Custom Domain**:
   - Pages → Custom domains
   - Add your domain
   - Update DNS (automatic if using Cloudflare DNS)

### Option 3: Netlify

**Pros**: Easy deployment, free SSL, continuous deployment

#### Steps:

1. **Install Netlify CLI**:
```bash
npm i -g netlify-cli
```

2. **Login**:
```bash
netlify login
```

3. **Deploy**:
```bash
netlify deploy --prod
```

4. **Build Settings** (in `netlify.toml`):
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Option 4: Self-Hosted (VPS/Docker)

#### Using PM2:

1. **Install PM2**:
```bash
npm i -g pm2
```

2. **Build**:
```bash
pnpm build
```

3. **Start with PM2**:
```bash
pm2 start npm --name "bulkresizeimage" -- start
pm2 save
pm2 startup
```

4. **Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name bulkresizeimage.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        proxy_pass http://localhost:3000/sw.js;
    }

    # Manifest
    location /manifest.json {
        add_header Cache-Control "public, max-age=86400";
        proxy_pass http://localhost:3000/manifest.json;
    }
}
```

5. **SSL with Let's Encrypt**:
```bash
sudo certbot --nginx -d bulkresizeimage.com
```

## 🔒 SSL/HTTPS Configuration

**Required for PWA!** PWA features only work on HTTPS.

### Vercel/Cloudflare/Netlify
SSL is automatic. No configuration needed.

### Self-Hosted
Use Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d bulkresizeimage.com -d www.bulkresizeimage.com

# Auto-renewal (already set up)
sudo certbot renew --dry-run
```

## 🎨 Generate PWA Icons

Use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):

```bash
npx pwa-asset-generator logo.svg ./public/icons \
  --manifest ./public/manifest.json \
  --index ./app/[locale]/layout.tsx \
  --favicon
```

Or manually create:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `favicon.ico` (32x32)

## 📊 Post-Deployment Testing

### 1. Lighthouse Audit
```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse https://bulkresizeimage.com --view
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95
- PWA: 100

### 2. PWA Testing

**Desktop (Chrome)**:
1. Open DevTools → Application → Manifest
2. Check manifest loads correctly
3. Check Service Worker status
4. Try "Add to Home Screen"

**Mobile**:
1. Visit site on mobile browser
2. Check install banner appears
3. Install and test offline mode

### 3. Browser Testing

Test on:
- Chrome (Desktop + Mobile)
- Safari (Desktop + iOS)
- Firefox
- Edge

### 4. Functionality Testing

- [ ] Upload images (single + multiple)
- [ ] All 6 resize modes work
- [ ] Download single image
- [ ] Download ZIP (multiple images)
- [ ] Presets work correctly
- [ ] Responsive design on mobile
- [ ] Offline mode works

## 🔍 SEO Configuration

### 1. Google Search Console

1. Add property: https://bulkresizeimage.com
2. Verify ownership (HTML tag method)
3. Submit sitemap: `https://bulkresizeimage.com/sitemap.xml`

### 2. Bing Webmaster Tools

1. Add site
2. Verify ownership
3. Submit sitemap

### 3. Google Analytics (Optional)

Already configured in `components/analytics/google-analytics.tsx`.

Update tracking ID if needed.

## 🚦 Monitoring

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### Error Tracking (Optional)

- Sentry
- LogRocket
- Bugsnag

## 🔄 Update Process

### Rolling Updates (Zero Downtime)

1. Test changes locally
2. Deploy to staging (if available)
3. Deploy to production
4. Monitor for errors

### Rollback

**Vercel**:
```bash
vercel rollback
```

**Self-Hosted**:
```bash
git revert <commit>
pnpm build
pm2 restart bulkresizeimage
```

## 📈 Performance Optimization

### 1. Enable Compression (Nginx)

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Cache Static Assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Service Worker Caching

Already configured in `public/sw.js`.

## 🛡️ Security Headers

Add to Nginx config:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

Or use `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ]
}
```

## ✅ Deployment Complete!

Your BulkresizeImage tool is now live. Monitor traffic and user feedback for improvements.

## 📞 Support

For deployment issues:
1. Check build logs
2. Verify all configuration files
3. Test locally first
4. Review error messages carefully
