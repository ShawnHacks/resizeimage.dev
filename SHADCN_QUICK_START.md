# Shadcn 表单重构 - 快速开始

## ✅ 已完成

### 1. Shadcn 组件已创建
- ✅ `/components/ui/label.tsx`
- ✅ `/components/ui/slider.tsx`
- ✅ `/components/ui/checkbox.tsx`
- ✅ `/components/ui/input.tsx` (已存在)
- ✅ `/components/ui/select.tsx` (已存在)
- ✅ `/components/ui/button.tsx` (已存在)

### 2. Percentage Mode 已重构 ✨
已成功将 Percentage 模式的表单重构为使用 shadcn 组件！

---

## 📦 需要安装的依赖

```bash
npm install @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-checkbox
```

或

```bash
pnpm add @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-checkbox
```

---

## 🎯 重构对比

### Slider（滑块）

**之前:**
```tsx
<input
  type="range"
  min="10"
  max="200"
  value={percentage}
  onChange={(e) => setPercentage(Number(e.target.value))}
  className="flex-1 h-2 bg-[#D2D2D7] rounded-lg..."
/>
```

**现在:**
```tsx
<Slider
  min={10}
  max={200}
  step={5}
  value={[percentage]}
  onValueChange={(value) => setPercentage(value[0])}
  className="flex-1"
/>
```

### Select（下拉框）

**之前:**
```tsx
<select
  value={format}
  onChange={(e) => setFormat(e.target.value as ImageFormat)}
  className="w-full px-3 py-2 border..."
>
  <option value="jpeg">JPEG</option>
  <option value="png">PNG</option>
  <option value="webp">WebP</option>
</select>
```

**现在:**
```tsx
<Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
  <SelectTrigger id="format-percentage">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="jpeg">JPEG</SelectItem>
    <SelectItem value="png">PNG</SelectItem>
    <SelectItem value="webp">WebP</SelectItem>
  </SelectContent>
</Select>
```

### Label + Input

**之前:**
```tsx
<div>
  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
    Width (px)
  </label>
  <input
    type="number"
    value={width}
    onChange={(e) => setWidth(Number(e.target.value))}
    className="w-full px-3 py-2 border..."
  />
</div>
```

**现在:**
```tsx
<div className="space-y-2">
  <Label htmlFor="width">Width (px)</Label>
  <Input
    id="width"
    type="number"
    value={width}
    onChange={(e) => setWidth(Number(e.target.value))}
  />
</div>
```

---

## 🎨 语义化颜色类

| 硬编码颜色 | Shadcn 类 |
|-----------|----------|
| `text-[#1D1D1F]` | `text-foreground` |
| `text-[#86868B]` | `text-muted-foreground` |
| `border-[#D2D2D7]` | `border-input` |

---

## 📝 下一步

需要重构的其他模式：

1. ⏳ File Size Mode
2. ⏳ Dimensions Mode (包括 Checkbox)
3. ⏳ Width Mode
4. ⏳ Height Mode
5. ⏳ Longest Side Mode

每个模式的重构方式类似，主要替换：
- `<input type="range">` → `<Slider>`
- `<select>` → `<Select>`
- `<input type="number">` → `<Input>`
- `<label>` → `<Label>`
- `<input type="checkbox">` → `<Checkbox>`

---

## 🚀 测试

安装依赖后，测试 Percentage Mode：
1. 切换到 Percentage 模式
2. 拖动滑块，查看值变化
3. 在数字输入框输入值
4. 切换格式下拉框
5. 拖动质量滑块
6. 测试响应式布局

---

## ✨ 优势

使用 shadcn 组件后：
- ✅ 更好的可访问性（ARIA 属性）
- ✅ 统一的设计语言
- ✅ 自动适配主题色
- ✅ 键盘导航支持
- ✅ 更少的自定义样式代码
- ✅ TypeScript 类型安全

开始享受现代化的表单组件吧！🎉
