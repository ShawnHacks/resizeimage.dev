# URL Parameters Fix

## 🐛 Bug Fixed: URL Parameters Not Loading on Initial Visit

### Problem
When visiting a URL with parameters (e.g., `?mode=percentage&percentage=75`), the page would always default to "Image Dimensions" mode instead of loading the parameters from the URL.

### Root Cause
The issue was with React's `useState` initialization:

```typescript
// ❌ BEFORE - This only runs once on mount
const [mode, setMode] = useState<ResizeMode>(
  (searchParams.get('mode') as ResizeMode) || 'dimensions'
);
```

**Why it failed:**
1. `useState` initial value is only calculated **once** when component first mounts
2. In Next.js App Router, `useSearchParams()` may not be immediately available during SSR
3. Parameters were read before they were actually available
4. Result: Always fell back to default value `'dimensions'`

---

## ✅ Solution

Separated state initialization from URL reading using `useEffect`:

### Step 1: Initialize with Defaults
```typescript
// State with default values (no URL reading)
const [mode, setMode] = useState<ResizeMode>('dimensions');
const [percentage, setPercentage] = useState(50);
const [quality, setQuality] = useState(68);
// ... etc
```

### Step 2: Read URL Parameters in useEffect
```typescript
useEffect(() => {
  // Read all URL parameters
  const urlMode = searchParams.get('mode') as ResizeMode;
  const urlPercentage = searchParams.get('percentage');
  // ... etc
  
  // Update state only if parameter exists
  if (urlMode) setMode(urlMode);
  if (urlPercentage) setPercentage(Number(urlPercentage));
  // ... etc
  
  setIsInitialized(true);
}, [searchParams]);
```

### Step 3: Prevent Loop in URL Update
```typescript
useEffect(() => {
  // Only update URL after initial load is complete
  if (!isInitialized) return;
  
  // Build and update URL
  const params = new URLSearchParams();
  params.set('mode', mode);
  // ... etc
  
  router.replace(`?${params.toString()}`, { scroll: false });
}, [isInitialized, mode, percentage, /* other deps */]);
```

---

## 🔄 How It Works Now

### Scenario 1: Fresh Visit (No URL Params)
1. Component mounts with defaults
2. First `useEffect` runs → no URL params found → no state changes
3. `isInitialized` set to `true`
4. Second `useEffect` runs → creates URL with default values
5. **Result**: URL shows `?mode=dimensions&quality=68&...`

### Scenario 2: Visit with URL Params
1. Component mounts with defaults
2. First `useEffect` runs → reads URL params → updates state
   - `?mode=percentage&percentage=75`
   - `setMode('percentage')`
   - `setPercentage(75)`
3. `isInitialized` set to `true`
4. Second `useEffect` runs → URL already has correct params
5. **Result**: Mode shows "Percentage", slider shows 75%

### Scenario 3: User Changes Parameters
1. User moves percentage slider to 80
2. `setPercentage(80)` called
3. Second `useEffect` triggers (dependency changed)
4. URL updates to `?mode=percentage&percentage=80&...`
5. **Result**: URL stays in sync with UI

---

## 🎯 Key Changes

### Before
```typescript
❌ useState reads from searchParams directly
   → Only works on first render
   → searchParams might not be ready
   → Always falls back to defaults
```

### After
```typescript
✅ useState has static defaults
✅ useEffect reads URL after mount
✅ State updates with URL params
✅ Separate flag prevents update loop
```

---

## 🔍 Technical Details

### Why Two useEffects?

#### First useEffect (Read from URL)
```typescript
useEffect(() => {
  // Runs when URL changes
  // Updates component state
  // Sets initialization flag
}, [searchParams]);
```

#### Second useEffect (Write to URL)
```typescript
useEffect(() => {
  // Only runs after initialization
  // Prevents loop during initial load
  // Keeps URL in sync with state changes
}, [isInitialized, mode, percentage, ...]);
```

### Initialization Flag
```typescript
const [isInitialized, setIsInitialized] = useState(false);

// First effect sets this to true after reading URL
// Second effect only runs when this is true
// Prevents circular updates during initial load
```

---

## 🧪 Test Cases

### Test 1: Direct URL Visit
```
Visit: /?mode=percentage&percentage=80&quality=90

Expected:
✅ Mode selector shows "Percentage" (not "Image Dimensions")
✅ Percentage slider shows 80
✅ Quality slider shows 90
```

### Test 2: Bookmark with Dimensions
```
Visit: /?mode=dimensions&width=800&height=600&padding=true

Expected:
✅ Mode selector shows "Image Dimensions"
✅ Width input shows 800
✅ Height input shows 600
✅ Padding checkbox is checked
```

### Test 3: Change Parameters
```
1. Visit with percentage=50
2. Move slider to 75
3. Check URL

Expected:
✅ URL updates to percentage=75
✅ No page reload
✅ No infinite loop
```

### Test 4: Copy URL Button
```
1. Set mode to "Width", target=1920
2. Click "Copy" button
3. Open new tab with copied URL

Expected:
✅ New tab shows Width mode
✅ Target value is 1920
```

---

## 📊 Comparison

| Aspect | Before | After |
|--------|--------|-------|
| URL Params Load | ❌ Never | ✅ Always |
| Mode Selection | ❌ Always "dimensions" | ✅ Correct from URL |
| State Updates | ❌ Lost on refresh | ✅ Persisted in URL |
| Performance | ⚠️ One read attempt | ✅ Proper lifecycle |
| Reliability | ❌ Race condition | ✅ Deterministic |

---

## 🔧 Code Pattern

This is a common pattern for URL-synchronized state in Next.js:

```typescript
// 1. Declare state with defaults
const [value, setValue] = useState(defaultValue);
const [initialized, setInitialized] = useState(false);

// 2. Read from URL
useEffect(() => {
  const urlValue = searchParams.get('key');
  if (urlValue) setValue(urlValue);
  setInitialized(true);
}, [searchParams]);

// 3. Write to URL (only after init)
useEffect(() => {
  if (!initialized) return;
  const params = new URLSearchParams();
  params.set('key', value);
  router.replace(`?${params.toString()}`);
}, [initialized, value, router]);
```

---

## ✅ Verification

### Before Fix
```bash
# Visit URL with params
open "http://localhost:3000?mode=percentage&percentage=75"

# Result: Shows "Image Dimensions" mode ❌
```

### After Fix
```bash
# Visit URL with params
open "http://localhost:3000?mode=percentage&percentage=75"

# Result: Shows "Percentage" mode with 75% ✅
```

---

## 🎉 Result

All URL parameters now load correctly on initial visit:
✅ Mode selection works
✅ All parameter values preserved
✅ Shareable links function properly
✅ Bookmarks load with correct settings
✅ No infinite loops
✅ Clean, predictable behavior

Users can now confidently share configuration URLs knowing they'll work correctly for everyone! 🚀
