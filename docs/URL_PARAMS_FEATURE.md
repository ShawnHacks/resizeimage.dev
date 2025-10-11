# URL Parameters Feature

## ✨ Feature: Shareable Configuration URLs

Users can now share their resize configuration via URL parameters. All settings are automatically saved to the URL and can be shared with others.

---

## 🎯 Benefits

### 1. **Shareable Links**
- Copy a configuration URL and share with team members
- Everyone gets the exact same settings
- Perfect for standardized image processing workflows

### 2. **Bookmarkable Settings**
- Save favorite configurations as browser bookmarks
- Quick access to commonly used settings
- No need to manually configure each time

### 3. **Persistent State**
- Settings survive page refresh
- URL updates automatically when you change parameters
- No data loss when navigating away

### 4. **Easy Collaboration**
- Share resize recipes with colleagues
- Document image processing workflows
- Create preset libraries via URL collection

---

## 📐 URL Parameter Structure

### Example URLs

#### Percentage Mode
```
?mode=percentage&percentage=75&format=jpeg&quality=85&bgColor=FFFFFF
```

#### File Size Mode
```
?mode=fileSize&fileSize=150&format=webp&quality=80&bgColor=FFFFFF
```

#### Image Dimensions Mode (with padding)
```
?mode=dimensions&width=800&height=600&format=png&quality=90&lockRatio=false&padding=true&bgColor=F5F5F7
```

#### Width Mode
```
?mode=width&target=1920&format=jpeg&quality=75&bgColor=FFFFFF
```

#### Height Mode
```
?mode=height&target=1080&format=jpeg&quality=80&bgColor=FFFFFF
```

#### Longest Side Mode
```
?mode=longestSide&target=2048&format=webp&quality=85&bgColor=000000
```

---

## 🗂️ Parameter Reference

### Common Parameters (All Modes)

| Parameter | Type | Values | Example | Description |
|-----------|------|--------|---------|-------------|
| `mode` | string | `percentage`, `fileSize`, `dimensions`, `width`, `height`, `longestSide` | `mode=dimensions` | Resize mode |
| `format` | string | `jpeg`, `png`, `webp` | `format=webp` | Output image format |
| `quality` | number | 0-100 | `quality=85` | Image quality percentage |
| `bgColor` | string | Hex color (no #) | `bgColor=FFFFFF` | Background color |

### Mode-Specific Parameters

#### Percentage Mode
| Parameter | Type | Range | Example |
|-----------|------|-------|---------|
| `percentage` | number | 10-200 | `percentage=50` |

#### File Size Mode
| Parameter | Type | Range | Example |
|-----------|------|-------|---------|
| `fileSize` | number | 10-5000 | `fileSize=100` |

#### Dimensions Mode
| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `width` | number | Any positive integer | `width=800` |
| `height` | number | Any positive integer | `height=600` |
| `lockRatio` | boolean | `true`, `false` | `lockRatio=false` |
| `padding` | boolean | `true`, `false` | `padding=true` |

#### Width/Height/Longest Side Modes
| Parameter | Type | Values | Example |
|-----------|------|--------|---------|
| `target` | number | Any positive integer | `target=1920` |

---

## 🔄 How It Works

### 1. Initial Load
```typescript
// Read URL parameters
const searchParams = useSearchParams();
const mode = searchParams.get('mode') || 'dimensions';
const quality = Number(searchParams.get('quality')) || 68;
// ... etc
```

### 2. Auto-Update URL
```typescript
// Every time a parameter changes, URL updates
useEffect(() => {
  const params = new URLSearchParams();
  params.set('mode', mode);
  params.set('quality', quality.toString());
  // ... add other params
  
  router.replace(`?${params.toString()}`, { scroll: false });
}, [mode, quality, /* other dependencies */]);
```

### 3. Copy URL Button
```typescript
const copyConfigUrl = async () => {
  const url = window.location.href;
  await navigator.clipboard.writeText(url);
  toast.success('Configuration URL copied!');
};
```

---

## 🎨 UI Components

### Copy Configuration URL Button

```
┌────────────────────────────────────┐
│   [🔗] Copy Configuration URL      │
└────────────────────────────────────┘
```

After clicking:
```
┌────────────────────────────────────┐
│   [✓] URL Copied!                  │
└────────────────────────────────────┘
```

**Location**: Below the "Resize Images" button

**Features**:
- Icon changes from link to checkmark
- Green checkmark on success
- Toast notification
- Auto-resets after 2 seconds

---

## 💡 Use Cases

### 1. Team Workflows
**Scenario**: Design team needs standardized social media images

**Setup**:
```
?mode=dimensions&width=1200&height=630&format=jpeg&quality=85&padding=true&bgColor=F5F5F7
```

**Benefit**: Share one link, everyone uses same settings

### 2. Client Deliverables
**Scenario**: Client wants all images at specific quality

**Setup**:
```
?mode=longestSide&target=2048&format=webp&quality=90&bgColor=FFFFFF
```

**Benefit**: Send client a link to resize their own images

### 3. Bulk Processing
**Scenario**: Process 100+ product photos identically

**Setup**: Configure once, bookmark URL

**Benefit**: Instant access to exact settings

### 4. Documentation
**Scenario**: Create image processing guide

**Example**:
- Instagram Post: `?mode=dimensions&width=1080&height=1080...`
- Facebook Cover: `?mode=dimensions&width=820&height=312...`
- Email Header: `?mode=width&target=600...`

### 5. A/B Testing
**Scenario**: Compare different quality settings

**URLs**:
- High Quality: `?quality=95`
- Medium Quality: `?quality=75`
- Low Quality: `?quality=50`

---

## 🔍 Implementation Details

### State Management
```typescript
// Read from URL on component mount
const [mode, setMode] = useState<ResizeMode>(
  (searchParams.get('mode') as ResizeMode) || 'dimensions'
);

// Update URL when state changes
useEffect(() => {
  const params = new URLSearchParams();
  params.set('mode', mode);
  router.replace(`?${params.toString()}`, { scroll: false });
}, [mode]);
```

### URL Building Logic
```typescript
// Common parameters (always included)
params.set('mode', mode);
params.set('format', format);
params.set('quality', quality.toString());
params.set('bgColor', backgroundColor.replace('#', ''));

// Mode-specific parameters
if (mode === 'percentage') {
  params.set('percentage', percentage.toString());
} else if (mode === 'dimensions') {
  if (width) params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  params.set('lockRatio', lockAspectRatio.toString());
  params.set('padding', usePadding.toString());
}
// ... etc
```

### Color Handling
```typescript
// Save to URL: Remove # prefix
params.set('bgColor', backgroundColor.replace('#', ''));

// Read from URL: Add # prefix
const [backgroundColor, setBackgroundColor] = useState(
  searchParams.get('bgColor') ? `#${searchParams.get('bgColor')}` : '#FFFFFF'
);
```

---

## 🎯 Edge Cases Handled

### 1. Invalid Parameters
- Default to safe values if parameter is invalid
- Example: `quality=abc` → defaults to 68

### 2. Missing Parameters
- Use sensible defaults
- Example: No `mode` → defaults to 'dimensions'

### 3. Partial Configuration
- Only specified parameters in URL
- Others use defaults
- Example: `?mode=percentage` → uses default quality, format, etc.

### 4. URL Too Long
- Omit optional parameters when possible
- Only include non-default values (future enhancement)

---

## 📊 Examples

### Social Media Presets

#### Instagram Post (1:1)
```
?mode=dimensions&width=1080&height=1080&format=jpeg&quality=85&padding=true&bgColor=FFFFFF
```

#### Twitter Header
```
?mode=dimensions&width=1500&height=500&format=jpeg&quality=90&padding=true&bgColor=F5F5F7
```

#### Facebook Post
```
?mode=dimensions&width=1200&height=630&format=jpeg&quality=85&padding=true&bgColor=FFFFFF
```

### Professional Workflows

#### High-Quality Print
```
?mode=longestSide&target=4096&format=png&quality=100&bgColor=FFFFFF
```

#### Web Optimization
```
?mode=longestSide&target=1920&format=webp&quality=75&bgColor=FFFFFF
```

#### Email-Friendly
```
?mode=fileSize&fileSize=200&format=jpeg&quality=80&bgColor=FFFFFF
```

### Compression Tests

#### Maximum Compression
```
?mode=fileSize&fileSize=50&format=webp&quality=60&bgColor=FFFFFF
```

#### Balanced Quality
```
?mode=percentage&percentage=75&format=webp&quality=80&bgColor=FFFFFF
```

---

## 🚀 User Flow

### Creating a Shareable Link

1. **User configures settings**
   - Select mode
   - Adjust parameters
   - Choose format, quality, etc.

2. **URL updates automatically**
   - No manual action needed
   - URL reflects current state

3. **Copy configuration URL**
   - Click "Copy Configuration URL" button
   - Toast notification confirms copy
   - Button shows checkmark

4. **Share the link**
   - Paste in email, Slack, documentation
   - Anyone with link gets same settings

### Using a Shared Link

1. **Recipient clicks link**
   - Opens page with pre-configured settings

2. **Settings load from URL**
   - All parameters populated
   - Ready to upload images

3. **Process images**
   - Upload images
   - Click Resize
   - Download results

---

## ✅ Testing Checklist

- [x] URL updates when mode changes
- [x] URL updates when percentage changes
- [x] URL updates when file size changes
- [x] URL updates when dimensions change
- [x] URL updates when quality changes
- [x] URL updates when format changes
- [x] URL updates when background color changes
- [x] URL updates when padding toggles
- [x] Loading page with URL params works
- [x] Copy URL button copies to clipboard
- [x] Toast notification appears
- [x] Checkmark shows after copy
- [x] Invalid params use defaults
- [x] Missing params use defaults
- [x] Page refresh preserves settings

---

## 🔧 Technical Notes

### Router.replace vs Router.push
- Using `router.replace()` to avoid creating history entries
- `scroll: false` prevents page jump on URL update

### Performance
- `useEffect` dependencies optimized to prevent infinite loops
- URL only updates when relevant state changes

### Browser Compatibility
- Uses standard URLSearchParams API
- Clipboard API with fallback handling
- Tested on Chrome, Firefox, Safari

---

## 🎉 Result

Users can now:
✅ **Share** resize configurations via URL
✅ **Bookmark** favorite settings
✅ **Collaborate** with preset links
✅ **Document** processing workflows
✅ **Persist** settings across sessions

Perfect for teams, workflows, and documentation! 🚀
