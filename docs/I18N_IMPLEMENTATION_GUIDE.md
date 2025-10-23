# 🌐 i18n Implementation Guide for Resize Tool

## ✅ **已完成：英语翻译文件**

已在 `/messages/en.json` 中添加完整的 `BulkResizeTool` 翻译部分，包含所有需要的文本。

---

## 📋 **需要更新的组件列表**

### **1. 页面组件**
- ✅ `/app/page-resize.tsx` - 主页面

### **2. 功能组件**
- ⏳ `/components/resize/hero-section.tsx` - Hero 区域
- ⏳ `/components/resize/image-preview.tsx` - 图片预览
- ⏳ `/components/resize/resize-controls.tsx` - 调整控制面板
- ⏳ `/components/resize/processed-list.tsx` - 处理结果列表
- ⏳ `/components/resize/tools-grid.tsx` - 工具网格

---

## 🔧 **实施步骤**

### **步骤 1: 导入 useTranslations**

在每个组件顶部添加：

```tsx
import { useTranslations } from 'next-intl';
```

### **步骤 2: 在组件中使用**

```tsx
export function MyComponent() {
  const t = useTranslations('BulkResizeTool');
  
  return (
    <div>
      <h1>{t('pageTitle')}</h1>
      <p>{t('pageDescription')}</p>
    </div>
  );
}
```

### **步骤 3: 嵌套翻译键**

```tsx
// 访问嵌套的翻译
<h2>{t('hero.title')}</h2>
<p>{t('hero.subtitle')}</p>
<button>{t('hero.selectImages')}</button>
```

### **步骤 4: 带参数的翻译**

```tsx
// 在翻译中使用变量
{t('controls.percentage.description', { percentage: 50 })}

// 复数形式
{t('results.imagesResized', { count: processedImages.length })}
```

---

## 📝 **组件更新示例**

### **示例 1: page-resize.tsx**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function ResizeImagePage() {
  const t = useTranslations('BulkResizeTool');
  
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              {t('pageTitle')}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('pageDescription')}
            </p>
          </div>
        </div>
      </header>
      
      {/* Processing indicator */}
      {isProcessing && (
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('processing.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('processing.progress', { 
                current: progress.current, 
                total: progress.total 
              })}
            </p>
          </div>
        </div>
      )}
      
      {/* ... rest of component */}
    </div>
  );
}
```

### **示例 2: hero-section.tsx**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function HeroSection({ onFilesSelected }: HeroSectionProps) {
  const t = useTranslations('BulkResizeTool');
  
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Drop Zone */}
      <div className="...">
        <Upload className="w-16 h-16 text-primary mb-6" />
        
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t('hero.title')}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          {t('hero.subtitle')}
        </p>
        
        <label className="cursor-pointer">
          <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          <div className="px-8 py-3 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/80 transition-colors shadow-lg">
            {t('hero.selectImages')}
          </div>
        </label>
        
        <p className="text-xs text-muted-foreground mt-4">
          {t('hero.supportedFormats')}
        </p>
      </div>

      {/* Features */}
      <div className="bg-muted/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-3 text-center leading-tight">
          {t('features.title')}
        </h2>
        
        <p className="text-sm text-muted-foreground mb-8 text-center">
          {t('features.description')}
        </p>
        
        {/* Features list */}
      </div>
    </div>
  );
}
```

### **示例 3: image-preview.tsx**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ImagePreview({ images, onRemove, onAddMore }: ImagePreviewProps) {
  const t = useTranslations('BulkResizeTool.imagePreview');
  
  if (images.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {images.length} {images.length === 1 ? t('selected') : t('selectedPlural')} {t('selectedCount')}
        </h3>
        
        {onAddMore && (
          <Button variant="outline" size="sm" className="text-primary hover:bg-primary/5">
            <Plus className="w-4 h-4" />
            {t('addMore')}
          </Button>
        )}
      </div>
      
      {/* ... rest of component */}
    </div>
  );
}
```

### **示例 4: resize-controls.tsx**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ResizeControls({ onResize, disabled }: ResizeControlsProps) {
  const t = useTranslations('BulkResizeTool.controls');
  
  return (
    <div className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Mode selector */}
        <aside className="w-full md:w-56 bg-muted border-b md:border-b-0 md:border-r border-border">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {t('resizeMode')}
            </h3>
            {/* ... modes */}
          </div>
        </aside>

        {/* Percentage Mode */}
        {mode === 'percentage' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {t('percentage.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('percentage.description', { percentage })}
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="percentage-input">{t('percentage.title')}</Label>
              {/* ... input */}
              <p className="text-xs text-muted-foreground">
                {t('percentage.rangeLabel')}
              </p>
            </div>
            
            <div>
              <Label htmlFor="format-percentage">{t('format.label')}</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                <SelectTrigger id="format-percentage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">{t('format.jpeg')}</SelectItem>
                  <SelectItem value="png">{t('format.png')}</SelectItem>
                  <SelectItem value="webp">{t('format.webp')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quality-percentage">{t('quality.label')}</Label>
              {/* ... quality slider */}
              <p className="text-xs text-muted-foreground mt-2">
                {t('quality.description')}
              </p>
            </div>
          </div>
        )}
        
        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">
              {t('presets.title')}
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button onClick={() => applyPreset(preset)} className="...">
              <p className="text-xs font-medium text-foreground">{t('presets.instagram')}</p>
              <p className="text-xs text-muted-foreground">{t('presets.instagramDesc')}</p>
            </button>
            {/* ... more presets */}
          </div>
        </div>
        
        {/* Resize Button */}
        <Button onClick={handleResize} disabled={disabled} className="w-full mt-6" size="lg">
          {mode === 'percentage' 
            ? t('resizeButton', { percentage }) 
            : t('resizeButtonDefault')}
        </Button>
      </div>
      
      {/* Configuration URL */}
      <div className="pb-6 bg-background border-border">
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {t('../config.title')}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t('../config.description')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Input type="text" value={getCurrentUrl()} readOnly className="flex-1 text-xs font-mono" />
            
            <Button variant={urlCopied ? "default" : "outline"} size="sm">
              {urlCopied ? t('../config.copied') : t('../config.copy')}
            </Button>
            
            <Button onClick={openInNewTab} variant="outline" size="sm">
              {t('../config.link')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **示例 5: processed-list.tsx**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ProcessedList({ processedImages }: ProcessedListProps) {
  const t = useTranslations('BulkResizeTool.results');
  
  if (processedImages.length === 0) return null;

  return (
    <div className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header with totals */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-b border-border p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t('title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('imagesResized', { count: processedImages.length })}
            </p>
          </div>
        </div>

        {/* Total size comparison */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('originalSize')}</p>
            <p className="text-lg font-semibold text-foreground">
              {formatBytes(totalOriginalSize)}
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('newSize')}</p>
            <p className="text-lg font-semibold text-primary">
              {formatBytes(totalNewSize)}
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('spaceSaved')}</p>
            <p className="text-lg font-semibold text-green-600">
              {/* ... */}
            </p>
          </div>
        </div>
      </div>

      {/* Image list */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">
          {t('processedImages')}
        </h4>
        {/* ... image list */}
      </div>
    </div>
  );
}
```

### **示例 6: tools-grid.tsx**

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ToolsGrid() {
  const t = useTranslations('BulkResizeTool.tools');
  
  const tools = [
    {
      icon: Minimize2,
      name: t('compress'),
      description: t('compressDesc'),
      href: '/tools/compress-image',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-white',
    },
    {
      icon: Crop,
      name: t('crop'),
      description: t('cropDesc'),
      href: '/tools/crop-image',
      iconBg: 'bg-white border-2 border-dashed border-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      icon: Camera,
      name: t('screenshot'),
      description: t('screenshotDesc'),
      href: 'https://websitescreenshot.online',
      iconBg: 'bg-green-600 border-2 border-green-600',
      iconColor: 'text-white',
    },
    {
      icon: ImagePlus,
      name: t('watermark'),
      description: t('watermarkDesc'),
      href: '/tools/watermark-image',
      iconBg: 'bg-gradient-to-br from-blue-500 to-red-500',
      iconColor: 'text-white',
    },
  ];
  
  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.href} target="_blank" className="...">
            {/* ... tool card */}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 **Toast 消息翻译**

在使用 toast 的地方：

```tsx
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('BulkResizeTool.toast');
  
  // 成功消息
  toast.success(t('imagesLoaded', { count: files.length }));
  
  // 下载完成
  toast.success(t('downloadComplete'));
  
  // URL 复制
  toast.success(t('urlCopied'));
  
  // 错误消息
  toast.error(t('error'));
}
```

---

## 📌 **注意事项**

### **1. 相对路径访问**

当需要访问父级翻译时，使用 `..`：

```tsx
const t = useTranslations('BulkResizeTool.controls');

// 访问 BulkResizeTool.config
{t('../config.title')}

// 访问 BulkResizeTool.toast
{t('../toast.imagesLoaded', { count: 5 })}
```

### **2. 复数形式**

使用 ICU 消息格式：

```json
{
  "imagesResized": "{count} {count, plural, one {image} other {images}} successfully resized"
}
```

使用：
```tsx
{t('results.imagesResized', { count: processedImages.length })}
```

### **3. 变量插值**

翻译文件中：
```json
{
  "description": "Scale images to {percentage}% of the original dimensions."
}
```

使用：
```tsx
{t('percentage.description', { percentage: 50 })}
```

### **4. 条件渲染**

```tsx
{images.length === 1 ? t('imagePreview.selected') : t('imagePreview.selectedPlural')}
```

---

## ✅ **完成清单**

更新每个组件后，请检查：

- [ ] 导入 `useTranslations`
- [ ] 使用 `const t = useTranslations('BulkResizeTool...')`
- [ ] 替换所有硬编码文本
- [ ] 测试所有翻译键是否正确
- [ ] 测试参数替换是否正常
- [ ] 测试复数形式是否正常
- [ ] Toast 消息使用翻译

---

## 🚀 **下一步**

1. **更新组件** - 按照上面的示例更新所有组件
2. **测试** - 确保所有文本正确显示
3. **其他语言**（可选）- 未来可以添加其他语言翻译

**注意：** 当前只需要英语翻译，所以只更新了 `en.json`。未来如需添加其他语言，只需在对应的语言文件（如 `zh.json`）中添加相同的翻译键即可。

---

## 📝 **总结**

✅ 英语翻译文件已完成 (`/messages/en.json`)  
⏳ 需要更新 6 个组件文件  
📖 已提供详细的实施指南和示例代码  

现在可以开始逐个更新组件，使其支持国际化！
