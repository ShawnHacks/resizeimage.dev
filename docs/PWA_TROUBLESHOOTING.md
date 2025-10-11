# PWA 安装按钮不显示 - 故障排查指南

## 🔍 **为什么看不到安装按钮？**

`beforeinstallprompt` 事件只在满足**所有**以下条件时才会触发：

### ✅ **必要条件清单**

1. **HTTPS 连接**
   - ❌ HTTP 不行
   - ✅ HTTPS 可以
   - ✅ localhost 可以（开发环境）

2. **有效的 manifest.json**
   - ✅ 你的文件已存在并配置正确
   - ✅ 包含必要的字段（name, icons, start_url, display）

3. **应用未安装**
   - ⚠️ 如果已经安装过，不会再显示
   - 解决：卸载后重试

4. **浏览器支持**
   - ✅ Chrome/Edge（最佳支持）
   - ❌ Safari（不支持此 API）
   - ⚠️ Firefox（需手动安装）

5. **用户参与度**
   - Chrome 要求用户在页面上有一定互动
   - 可能需要点击几次、滚动页面等

6. **Service Worker（可选但推荐）**
   - ✅ 你已经有 `/public/sw.js`
   - ⚠️ 需要确认是否已注册

---

## 🧪 **立即诊断步骤**

### **步骤 1: 打开 Chrome DevTools**

1. 按 `F12` 或 `Cmd+Option+I`
2. 打开 **Console** 标签页
3. 刷新页面
4. 查看控制台输出

**你应该看到：**
```
PWA: Waiting for install prompt...
PWA: beforeinstallprompt event fired  // 如果可安装
```

或者：
```
PWA: App already installed  // 如果已安装
```

### **步骤 2: 检查 Manifest**

1. DevTools > **Application** 标签
2. 左侧 **Manifest** 部分
3. 检查是否有错误

**应该看到：**
- ✅ Name: BulkresizeImage - Resize Images Online
- ✅ Icons: icon-192.png, icon-512.png
- ✅ Start URL: /
- ✅ Display: standalone

### **步骤 3: 检查 Service Worker**

1. DevTools > **Application** 标签
2. 左侧 **Service Workers** 部分
3. 查看是否已注册

**如果没有注册，添加注册代码：**

创建 `/app/register-sw.tsx`:
```tsx
'use client'

import { useEffect } from 'react'

export function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }
  }, [])

  return null
}
```

在 `app/layout.tsx` 中使用：
```tsx
import { RegisterServiceWorker } from './register-sw'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  )
}
```

### **步骤 4: 手动触发安装**

如果条件都满足但按钮不显示，可以手动测试：

1. DevTools > **Application** > **Manifest**
2. 点击 "**Add to home screen**" 按钮
3. 查看是否能安装

---

## 🔧 **常见问题及解决方案**

### **问题 1: 已经安装过**

**检测方法：**
```tsx
// 检查是否在 standalone 模式（已安装）
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Already installed')
}
```

**解决方法：**
1. **Chrome**: `chrome://apps` → 右键应用 → 卸载
2. **Mac**: 在 Applications 或 Dock 中删除
3. **Windows**: 开始菜单 → 右键 → 卸载

### **问题 2: 本地开发环境（localhost）**

**确认环境：**
```bash
# 确保在 localhost 运行
npm run dev
# 访问 http://localhost:3000
```

✅ localhost 也会触发 PWA 安装提示（不需要 HTTPS）

### **问题 3: 浏览器缓存**

**清除缓存：**
1. DevTools > **Application** > **Storage**
2. 点击 "**Clear site data**"
3. 刷新页面

### **问题 4: manifest.json 没有链接**

**检查 `app/layout.tsx` 或 `pages/_document.tsx`：**
```tsx
export const metadata = {
  manifest: '/manifest.json',  // 确保这行存在
}

// 或者在 HTML head 中：
<link rel="manifest" href="/manifest.json" />
```

### **问题 5: 图标路径错误**

**验证图标：**
```bash
# 直接访问图标 URL
http://localhost:3000/icon-192.png
http://localhost:3000/icon-512.png
```

应该能看到图标图片。

---

## 🎯 **推荐的完整配置**

### **1. 确保 layout.tsx 包含 manifest**

`app/layout.tsx`:
```tsx
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#007AFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BulkresizeImage',
  },
}
```

### **2. 注册 Service Worker**

创建 `hooks/use-service-worker.ts`:
```tsx
'use client'

import { useEffect } from 'react'

export function useServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          console.log('New content is available')
        } else {
          console.log('Content is cached for offline use')
        }
      })

      wb.register()
    }
  }, [])
}
```

在 site-header 中使用：
```tsx
import { useServiceWorker } from '@/hooks/use-service-worker'

export function SiteHeader() {
  useServiceWorker()
  // ... 其他代码
}
```

### **3. 添加调试面板（临时）**

在 header 中添加调试信息：
```tsx
{/* 调试信息 - 生产环境移除 */}
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
    <div>PWA Status:</div>
    <div>Installable: {isInstallable ? '✅' : '❌'}</div>
    <div>Standalone: {window.matchMedia('(display-mode: standalone)').matches ? '✅' : '❌'}</div>
  </div>
)}
```

---

## 📱 **不同浏览器的行为**

### **Chrome/Edge (推荐)**
- ✅ 完全支持 `beforeinstallprompt`
- ✅ 自动显示安装横幅（移动端）
- ✅ 地址栏会显示安装图标

### **Safari (iOS/Mac)**
- ❌ 不支持 `beforeinstallprompt`
- ⚠️ 需要用户手动操作：分享 → 添加到主屏幕
- 💡 可以显示提示文本引导用户

### **Firefox**
- ⚠️ 部分支持
- 需要用户手动：菜单 → 安装

---

## 🚀 **强制显示按钮（测试用）**

如果想在开发时强制显示按钮进行 UI 测试：

```tsx
const [isInstallable, setIsInstallable] = useState(
  process.env.NODE_ENV === 'development' ? true : false
)
```

这样在开发环境中按钮会一直显示，但点击时不会有实际效果。

---

## ✅ **验证清单**

完成以下检查：

- [ ] 使用 HTTPS 或 localhost
- [ ] manifest.json 存在且配置正确
- [ ] 图标文件存在（192x192 和 512x512）
- [ ] 在 layout 中链接了 manifest
- [ ] 应用未安装（或已卸载重试）
- [ ] 使用 Chrome/Edge 浏览器
- [ ] 清除浏览器缓存
- [ ] 查看 Console 日志输出
- [ ] 检查 Application > Manifest 无错误
- [ ] Service Worker 已注册（可选）

---

## 🎯 **现在就做**

1. **打开 Chrome DevTools Console**
2. **刷新页面**
3. **查看输出内容，告诉我你看到了什么**

应该看到：
```
PWA: Waiting for install prompt...
```

如果看到：
```
PWA: beforeinstallprompt event fired
```
说明可以安装了，按钮应该显示！

如果看到：
```
PWA: App already installed
```
说明已经安装过了，需要先卸载。

---

## 💡 **提示**

如果一切配置正确但仍不显示：
1. 尝试在**无痕模式**打开（排除缓存/已安装的影响）
2. 在页面上**多点击几次**（Chrome 需要用户参与）
3. 等待几秒钟（事件可能延迟触发）

告诉我 Console 显示的内容，我可以进一步帮你诊断！
