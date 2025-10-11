# Shadcn UI 表单组件迁移指南

## 📦 需要安装的依赖

```bash
npm install @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-checkbox
```

或使用 pnpm:
```bash
pnpm add @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-checkbox
```

---

## ✅ 已创建的 Shadcn 组件

以下组件已经创建在 `/components/ui/` 目录：

1. ✅ `label.tsx` - Label 组件
2. ✅ `slider.tsx` - Slider 组件  
3. ✅ `checkbox.tsx` - Checkbox 组件
4. ✅ `input.tsx` - Input 组件 (已存在)
5. ✅ `select.tsx` - Select 组件 (已存在)
6. ✅ `button.tsx` - Button 组件 (已存在)

---

## 🔄 表单重构示例

### 原有代码（HTML Input）

```tsx
<div>
  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
    Image Format
  </label>
  <select
    value={format}
    onChange={(e) => setFormat(e.target.value as ImageFormat)}
    className="w-full px-3 py-2 border border-[#D2D2D7] rounded-lg..."
  >
    <option value="jpeg">JPEG</option>
    <option value="png">PNG</option>
    <option value="webp">WebP</option>
  </select>
</div>
```

### 使用 Shadcn 组件

```tsx
<div className="space-y-2">
  <Label htmlFor="format-percentage">Image Format</Label>
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
</div>
```

---

## 📝 完整重构示例

### 1. Percentage Mode - 滑块输入

#### 原有代码
```tsx
<div className="flex items-center gap-4">
  <input
    type="range"
    min="10"
    max="200"
    step="5"
    value={percentage}
    onChange={(e) => setPercentage(Number(e.target.value))}
    className="flex-1 h-2 bg-[#D2D2D7] rounded-lg..."
  />
  <input
    type="number"
    min="10"
    max="200"
    value={percentage}
    onChange={(e) => setPercentage(Number(e.target.value))}
    className="w-20 px-3 py-2 border..."
  />
</div>
```

#### Shadcn 版本
```tsx
<div className="space-y-3">
  <div className="flex items-center gap-4">
    <Slider
      min={10}
      max={200}
      step={5}
      value={[percentage]}
      onValueChange={(value) => setPercentage(value[0])}
      className="flex-1"
    />
    <Input
      type="number"
      min={10}
      max={200}
      value={percentage}
      onChange={(e) => setPercentage(Number(e.target.value))}
      className="w-20"
    />
  </div>
  <p className="text-xs text-muted-foreground">
    Range: 10% to 200%
  </p>
</div>
```

---

### 2. 质量滑块

#### 原有代码
```tsx
<div>
  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
    Image Quality: {quality}%
  </label>
  <input
    type="range"
    min="0"
    max="100"
    value={quality}
    onChange={(e) => setQuality(Number(e.target.value))}
    className="w-full h-2 bg-[#D2D2D7] rounded-lg..."
  />
</div>
```

#### Shadcn 版本
```tsx
<div className="space-y-2">
  <Label htmlFor="quality">Image Quality: {quality}%</Label>
  <Slider
    id="quality"
    min={0}
    max={100}
    value={[quality]}
    onValueChange={(value) => setQuality(value[0])}
  />
</div>
```

---

### 3. 数字输入框

#### 原有代码
```tsx
<div>
  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
    Width (px)
  </label>
  <input
    type="number"
    value={width || ''}
    onChange={(e) => setWidth(Number(e.target.value))}
    placeholder="800"
    className="w-full px-3 py-2 border border-[#D2D2D7]..."
  />
</div>
```

#### Shadcn 版本
```tsx
<div className="space-y-2">
  <Label htmlFor="width">Width (px)</Label>
  <Input
    id="width"
    type="number"
    value={width || ''}
    onChange={(e) => setWidth(Number(e.target.value))}
    placeholder="800"
  />
</div>
```

---

### 4. Checkbox（带 Padding 选项）

#### 原有代码
```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={usePadding}
    onChange={(e) => setUsePadding(e.target.checked)}
    className="w-4 h-4 text-primary border-[#D2D2D7]..."
  />
  <span className="text-sm text-[#1D1D1F]">
    Use padding to avoid stretching or squashing images.
  </span>
</label>
```

#### Shadcn 版本
```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="padding"
    checked={usePadding}
    onCheckedChange={setUsePadding}
  />
  <Label
    htmlFor="padding"
    className="text-sm font-normal cursor-pointer"
  >
    Use padding to avoid stretching or squashing images.
  </Label>
</div>
```

---

## 🎨 完整的 Percentage Mode 重构

```tsx
{mode === 'percentage' && (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Percentage
      </h3>
      <p className="text-sm text-muted-foreground">
        Scale images to <strong>{percentage}%</strong> of the original dimensions.
      </p>
    </div>

    {/* Percentage Slider */}
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Slider
          min={10}
          max={200}
          step={5}
          value={[percentage]}
          onValueChange={(value) => setPercentage(value[0])}
          className="flex-1"
        />
        <Input
          type="number"
          min={10}
          max={200}
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          className="w-20"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Range: 10% to 200%
      </p>
    </div>

    {/* Format & Quality */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="format-percentage">Image Format</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="quality-percentage">Image Quality: {quality}%</Label>
        <Slider
          id="quality-percentage"
          min={0}
          max={100}
          value={[quality]}
          onValueChange={(value) => setQuality(value[0])}
        />
      </div>
    </div>

    {/* Background Color */}
    <div className="space-y-2">
      <Label htmlFor="bg-color">Image Background</Label>
      <div className="flex items-center gap-3">
        <input
          id="bg-color"
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-12 h-10 border border-input rounded cursor-pointer"
        />
        <span className="text-sm text-muted-foreground">
          {backgroundColor.toUpperCase()}
        </span>
      </div>
    </div>
  </div>
)}
```

---

## 🎯 Tailwind 颜色类替换

使用 shadcn 的语义化颜色类：

| 原有类 | Shadcn 类 | 说明 |
|--------|-----------|------|
| `text-[#1D1D1F]` | `text-foreground` | 主文本颜色 |
| `text-[#86868B]` | `text-muted-foreground` | 次要文本颜色 |
| `bg-white` | `bg-background` | 背景色 |
| `bg-[#F5F5F7]` | `bg-muted` | 静音背景色 |
| `border-[#D2D2D7]` | `border-border` | 边框颜色 |
| `text-[#007AFF]` | `text-primary` | 主题色文本 |
| `bg-[#007AFF]` | `bg-primary` | 主题色背景 |

---

## ✅ 优势

### 1. **一致性**
- 统一的设计系统
- 颜色自动适配亮/暗模式
- 组件样式标准化

### 2. **可访问性**
- 内置 ARIA 属性
- 键盘导航支持
- 屏幕阅读器友好

### 3. **可维护性**
- 集中管理组件样式
- 易于全局更新
- 更少的重复代码

### 4. **类型安全**
- TypeScript 完整支持
- 更好的 IDE 提示
- 编译时错误检测

---

## 🔄 迁移步骤

### Step 1: 安装依赖
```bash
npm install @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-checkbox
```

### Step 2: 重构一个模式（如 Percentage）
- 替换 `<input type="range">` 为 `<Slider>`
- 替换 `<input type="number">` 为 `<Input>`
- 替换 `<select>` 为 `<Select>`
- 替换 `<label>` 为 `<Label>`

### Step 3: 测试功能
- 验证值的变化
- 验证样式正确
- 验证响应式布局

### Step 4: 重复其他模式
- File Size
- Dimensions
- Width
- Height
- Longest Side

### Step 5: 统一颜色类
- 替换硬编码颜色为语义化类
- 测试亮/暗模式

---

## 🎨 Resize Button 使用 Shadcn

#### 原有代码
```tsx
<button
  onClick={handleResize}
  disabled={disabled}
  className="w-full mt-6 px-6 py-3 bg-[#007AFF] text-white..."
>
  Resize Images
</button>
```

#### Shadcn 版本
```tsx
<Button
  onClick={handleResize}
  disabled={disabled}
  className="w-full mt-6"
  size="lg"
>
  Resize {mode === 'percentage' ? `to ${percentage}%` : 'Images'}
</Button>
```

---

## 📊 完成度

- [x] Label 组件创建
- [x] Slider 组件创建
- [x] Checkbox 组件创建
- [ ] 安装 Radix UI 依赖
- [ ] 重构 Percentage Mode
- [ ] 重构 File Size Mode
- [ ] 重构 Dimensions Mode
- [ ] 重构 Width/Height/Longest Side Modes
- [ ] 统一颜色类为语义化类
- [ ] 测试所有功能
- [ ] 测试暗模式

---

## 🚀 开始迁移

1. 先安装依赖：
   ```bash
   npm install @radix-ui/react-label @radix-ui/react-slider @radix-ui/react-checkbox
   ```

2. 然后按照上面的示例逐个模式重构

3. 完成后测试所有功能确保正常工作

使用 shadcn 组件后，表单将更加一致、可访问和易于维护！🎉
