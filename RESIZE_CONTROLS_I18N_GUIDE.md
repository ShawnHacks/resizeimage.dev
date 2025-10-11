# resize-controls.tsx 国际化完成指南

## ✅ 已完成部分

### 1. 基础设置
- ✅ 导入 `useTranslations`
- ✅ 添加翻译 hooks (`t` 和 `tConfig`)
- ✅ MODES 数组国际化（6种模式标题）
- ✅ "Resize Mode" 标题

### 2. Percentage Mode
- ✅ 标题和描述
- ✅ Range Label
- ✅ Format Label 和选项（JPEG, PNG, WebP）
- ✅ Quality Label
- ✅ Background Color Label

### 3. 所有模式的通用部分
- ✅ 所有 Format Select 选项已翻译
- ✅ 所有 Quality Label 已翻译

---

## ⏳ 剩余工作清单

### 需要手动更新的部分：

#### 1. File Size Mode（约第308-375行）
```tsx
// 当前（行312-316）:
<h3>File Size</h3>
<p>Images will be resized to <strong>{targetFileSize.toFixed(1)} kB</strong> or less.</p>

// 替换为:
<h3>{t('fileSize.title')}</h3>
<p>{t('fileSize.description', { size: targetFileSize.toFixed(1) })}</p>
```

#### 2. Dimensions Mode（约第378-470行）
```tsx
// 当前（行382-387）:
<h3>Image Dimensions</h3>
<p>Make images <strong>{width || 800}</strong> × <strong>{height || 600}</strong> Width × Height</p>

// 替换为:
<h3>{t('dimensions.title')}</h3>
<p>{t('dimensions.description')}</p>

// Width and Height Labels（行392, 403）:
<Label htmlFor="width-dimensions">Width (px)</Label>
<Label htmlFor="height-dimensions">Height (px)</Label>

// 替换为:
<Label htmlFor="width-dimensions">{t('dimensions.width')}</Label>
<Label htmlFor="height-dimensions">{t('dimensions.height')}</Label>

// Maintain Aspect Ratio（约行414）:
<Label>Maintain Aspect Ratio</Label>

// 替换为:
<Label>{t('dimensions.maintainRatio')}</Label>

// Use Padding（约行424）:
<Label>Use padding to avoid stretching or squashing images.</Label>

// 替换为:
<Label>{t('dimensions.paddingNote')}</Label>
```

#### 3. Width Mode（约第475-535行）
```tsx
// 当前:
<h3>Width</h3>
<p>Resize images to specific width...</p>
<Label>Target Width (px)</Label>

// 替换为:
<h3>{t('width.title')}</h3>
<p>{t('width.description')}</p>
<Label>{t('width.targetWidth')}</Label>
```

#### 4. Height Mode（约第540-605行）
```tsx
// 当前:
<h3>Height</h3>
<p>Resize images to specific height...</p>
<Label>Target Height (px)</Label>

// 替换为:
<h3>{t('height.title')}</h3>
<h3>{t('height.description')}</h3>
<Label>{t('height.targetHeight')}</Label>
```

#### 5. Longest Side Mode（约第610-675行）
```tsx
// 当前:
<h3>Longest Side</h3>
<p>Resize based on the longest dimension...</p>
<Label>Target Longest Side (px)</Label>

// 替换为:
<h3>{t('longestSide.title')}</h3>
<p>{t('longestSide.description')}</p>
<Label>{t('longestSide.targetLongest')}</Label>
```

#### 6. Quick Presets（约第678-697行）
```tsx
// 当前:
<h4>Quick Presets</h4>
{RESIZE_PRESETS.map((preset) => (
  <button>
    <p>{preset.name}</p>
    <p>{preset.description}</p>
  </button>
))}

// 替换为:
<h4>{t('presets.title')}</h4>

// 然后更新 RESIZE_PRESETS 中每个预设的名称和描述：
// Instagram Post → t('presets.instagram') / t('presets.instagramDesc')
// Twitter Header → t('presets.twitter') / t('presets.twitterDesc')
// Facebook Cover → t('presets.facebook') / t('presets.facebookDesc')
// YouTube Thumbnail → t('presets.youtube') / t('presets.youtubeDesc')
// Email Friendly → t('presets.email') / t('presets.emailDesc')
// Compress Small → t('presets.compress') / t('presets.compressDesc')
```

#### 7. Resize Button（约第699-706行）
```tsx
// 当前:
<Button>
  Resize {mode === 'percentage' ? `to ${percentage}%` : 'Images'}
</Button>

// 替换为:
<Button>
  {mode === 'percentage' 
    ? t('resizeButton', { percentage }) 
    : t('resizeButtonDefault')}
</Button>
```

#### 8. Shareable Configuration（约第712-750行）
```tsx
// 当前:
<h4>Shareable Configuration</h4>
<p>Use these settings automatically with this URL.</p>
<Button>{urlCopied ? 'Copied!' : 'Copy'}</Button>
<Button>Link</Button>

// 替换为:
<h4>{tConfig('title')}</h4>
<p>{tConfig('description')}</p>
<Button>{urlCopied ? tConfig('copied') : tConfig('copy')}</Button>
<Button>{tConfig('link')}</Button>
```

---

## 🚀 快速完成方法

### 方法 1: 使用查找替换

在编辑器中使用查找替换功能，按照上面的示例逐个替换。

### 方法 2: 完整更新脚本

由于文件较大，这里提供所有需要替换的内容：

```bash
# File Size Mode
行312: "File Size" → {t('fileSize.title')}
行315: "Images will be resized to..." → {t('fileSize.description', { size: targetFileSize.toFixed(1) })}

# Dimensions Mode
行382: "Image Dimensions" → {t('dimensions.title')}
行385-386: 替换为 {t('dimensions.description')}
行392: "Width (px)" → {t('dimensions.width')}
行403: "Height (px)" → {t('dimensions.height')}
行414: "Maintain Aspect Ratio" → {t('dimensions.maintainRatio')}
行424: "Use padding..." → {t('dimensions.paddingNote')}

# Width Mode
行478: "Width" → {t('width.title')}
行481: 描述 → {t('width.description')}
行487: "Target Width (px)" → {t('width.targetWidth')}

# Height Mode
行547: "Height" → {t('height.title')}
行550: 描述 → {t('height.description')}
行556: "Target Height (px)" → {t('height.targetHeight')}

# Longest Side Mode
行616: "Longest Side" → {t('longestSide.title')}
行619: 描述 → {t('longestSide.description')}
行625: "Target Longest Side (px)" → {t('longestSide.targetLongest')}

# Quick Presets
行681: "Quick Presets" → {t('presets.title')}
行682: "Quick Presets" (Star) → 保持不变
行691: preset.name → 使用 t('presets.xxx')
行692: preset.description → 使用 t('presets.xxxDesc')

# Resize Button
行705: "Resize to {percentage}%" → t('resizeButton', { percentage })
行705: "Resize Images" → t('resizeButtonDefault')

# Shareable Config
行715: "Shareable Configuration" → tConfig('title')
行718: "Use these settings..." → tConfig('description')
行738: "Copied!" → tConfig('copied')
行738: "Copy" → tConfig('copy')
行746: "Link" → tConfig('link')
```

---

## ✅ 验证清单

完成后检查：

- [ ] 所有模式的标题使用 t('xxx.title')
- [ ] 所有模式的描述使用 t('xxx.description')
- [ ] 所有表单标签使用翻译
- [ ] Format 选项（JPEG, PNG, WebP）已翻译
- [ ] Quality Label 已翻译
- [ ] Background Color Label 已翻译
- [ ] Quick Presets 标题和内容已翻译
- [ ] Resize 按钮使用翻译
- [ ] Shareable Configuration 部分已翻译
- [ ] 没有遗漏的硬编码英文文本

---

## 📝 提示

1. **使用编辑器的多光标功能**可以快速替换相似的内容
2. **所有翻译键都已在 `messages/en.json` 中准备好**，直接使用即可
3. **建议一次更新一个模式**，然后测试，避免出错
4. **Quality Label** 在6个地方重复，可以使用查找替换全部更新

---

## 🎯 估计时间

- File Size Mode: 3分钟
- Dimensions Mode: 5分钟
- Width/Height/Longest Side Mode: 各2分钟 (共6分钟)
- Quick Presets: 5分钟
- Resize Button: 2分钟
- Shareable Config: 3分钟

**总计：约25分钟**

---

**所有翻译键都已准备好，只需要将硬编码文本替换为翻译函数调用！** 🚀
