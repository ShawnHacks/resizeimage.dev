# PWA 安装功能说明

## 🎯 **功能概述**

已在 site header 添加了 PWA (Progressive Web App) 安装按钮，允许用户将网站安装到电脑或手机上，像原生应用一样使用。

---

## ✨ **添加的功能**

### 1. **智能显示**
- ✅ 只在浏览器支持 PWA 且应用未安装时显示
- ✅ 安装后按钮自动隐藏
- ✅ 响应式设计（桌面端显示）

### 2. **安装按钮**
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={handleInstallClick}
  className="gap-2"
>
  <Download className="h-4 w-4" />
  <span>Install App</span>
</Button>
```

### 3. **PWA 安装逻辑**
```tsx
// 监听 beforeinstallprompt 事件
useEffect(() => {
  const handler = (e: Event) => {
    e.preventDefault()
    setDeferredPrompt(e)
    setIsInstallable(true)
  }

  window.addEventListener('beforeinstallprompt', handler)

  return () => {
    window.removeEventListener('beforeinstallprompt', handler)
  }
}, [])

// 处理安装点击
const handleInstallClick = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    setIsInstallable(false)
    setDeferredPrompt(null)
  }
}
```

---

## 📋 **PWA 配置要求**

为了让安装按钮正常工作，确保以下文件已配置：

### 1. **manifest.json**
位置：`/public/manifest.json`

```json
{
  "name": "ToolSites Online",
  "short_name": "ToolSites",
  "description": "Online Tools Collection",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007AFF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. **在 HTML 中引用 manifest**
位置：`app/layout.tsx` 或 `pages/_document.tsx`

```tsx
<link rel="manifest" href="/manifest.json" />
```

### 3. **Service Worker**（可选但推荐）
位置：`/public/sw.js`

```js
// 简单的 Service Worker 示例
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // 处理网络请求
});
```

### 4. **注册 Service Worker**
位置：创建 hook 或在组件中注册

```tsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  }
}, []);
```

---

## 🔍 **支持的浏览器**

PWA 安装提示支持：
- ✅ Chrome/Edge（桌面端和移动端）
- ✅ Samsung Internet
- ⚠️ Safari（iOS 需要手动添加到主屏幕）
- ⚠️ Firefox（需要手动添加）

---

## 🎨 **按钮样式**

使用了 shadcn Button 组件：
- **variant="outline"** - 边框样式
- **size="sm"** - 小尺寸
- **Download icon** - 下载图标
- **自动主题适配**

---

## 📱 **用户体验**

### **桌面端**
1. 用户首次访问网站时，header 右侧会出现 "Install App" 按钮
2. 点击按钮后，浏览器显示原生安装提示
3. 用户确认后，应用安装到桌面
4. 按钮自动消失（已安装）

### **移动端**
- Chrome/Edge：显示安装横幅或按钮
- Safari：需要手动点击"添加到主屏幕"

---

## 🚀 **安装后的优势**

### **用户体验**
- ✅ 独立窗口运行（无浏览器 UI）
- ✅ 可从桌面/开始菜单启动
- ✅ 更快的加载速度（Service Worker 缓存）
- ✅ 离线访问（如果配置了 SW）

### **开发者优势**
- ✅ 提高用户粘性
- ✅ 增加回访率
- ✅ 提供类原生应用体验
- ✅ 无需应用商店审核

---

## 🧪 **测试步骤**

### **本地测试**
1. 确保使用 HTTPS（或 localhost）
2. 启动开发服务器：`npm run dev`
3. 在 Chrome 中打开
4. 检查是否出现 "Install App" 按钮

### **生产测试**
1. 部署到生产环境（必须 HTTPS）
2. 在 Chrome DevTools > Application > Manifest 检查配置
3. 在 Chrome DevTools > Application > Service Workers 检查注册
4. 测试安装流程

---

## 🐛 **常见问题**

### **Q: 按钮不显示？**
A: 检查：
- 网站是否使用 HTTPS
- manifest.json 是否正确配置
- 应用是否已经安装
- 浏览器是否支持

### **Q: Safari 不支持？**
A: Safari 需要用户手动操作：
1. 点击分享按钮
2. 选择"添加到主屏幕"

### **Q: 如何测试安装流程？**
A: Chrome DevTools:
1. Application > Manifest > "Add to home screen"
2. 或者在地址栏右侧点击安装图标

---

## 📊 **当前状态**

- ✅ site-header.tsx 已添加安装按钮
- ✅ 使用 shadcn Button 组件
- ✅ 智能显示/隐藏逻辑
- ✅ TypeScript 类型安全
- ⏳ 需要配置 manifest.json（如果还没有）
- ⏳ 需要配置 Service Worker（可选）

---

## 🎉 **完成！**

PWA 安装功能已成功添加到 site header！用户现在可以将网站安装为桌面应用。

确保配置好 manifest.json 和相关资源，即可在生产环境中使用。
