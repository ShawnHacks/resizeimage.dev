一个专注于「**Resize Image**」的极简工具网站，
关键词单一、体验直接、可以像原生 App 一样安装（PWA）。

> 💎 **极简版“Resize Image”工具网站 PRD + 设计要点**

---

# 📄 产品需求文档（PRD）

## 项目名称

**ResizeIt.app**（暂定名）
一个可安装、离线可用、超简洁的本地图片缩放工具。

---

## 🎯 一、产品定位与核心目标

| 项目        | 内容                                   |
| --------- | ------------------------------------ |
| **目标**    | 用户可在数秒内缩放任意图片，无需上传、无需登录。             |
| **关键词焦点** | “resize image online”                |
| **主要场景**  | 用户临时想压缩/缩放图片上传网站、社媒、或嵌入文章时。          |
| **产品理念**  | ✨ *No clutter. No ads. Just resize.* |
| **独特卖点**  | 🧠 零上传、零学习曲线、可离线运行（PWA）。             |

---

## 🧭 二、用户使用流程（最短路径）

1. 打开网站或桌面快捷方式
2. 拖拽图片（或点击选择）
3. 输入目标宽度/高度（或选择预设）
4. 点击 “Resize”
5. 下载结果

✅ 只需 **两步操作**（上传 → 输出）
✅ 所有处理在浏览器本地完成

---

## ⚙️ 三、核心功能（MVP 范围）

| 功能    | 描述                            | 技术实现                             |
| ----- | ----------------------------- | -------------------------------- |
| 上传图片  | 支持拖拽或点击上传单张/多张                | FileReader + `<input type=file>` |
| 预览    | 显示缩略图与尺寸信息                    | createImageBitmap / Canvas       |
| 缩放    | 输入宽/高或选择比例（50%、75%、自定义）       | Canvas API + Pica                |
| 保持比例  | 自动锁定长宽比                       | 数学计算                             |
| 输出格式  | 默认与原图一致，可选导出 JPG / PNG / WebP | `canvas.toBlob()`                |
| 下载    | 自动触发下载 / 批量 ZIP               | FileSaver.js + JSZip             |
| 安装到桌面 | 支持 PWA（Add to Home Screen）    | manifest.json + service worker   |
| 离线可用  | 首次加载后可离线打开                    | Cache API                        |

---

## 🧩 四、界面与交互设计（极简原则）

### 🎨 设计理念

> “单屏完成操作，不解释、不干扰。”

| 区域      | 内容                                                  |
| ------- | --------------------------------------------------- |
| **顶部**  | Logo（文字型） + 简短副标题，如：*Resize your images instantly.* |
| **主区**  | 拖拽上传区（占中间 70%）→ 上传后切换成预览 + 参数输入区                    |
| **控制区** | 宽、高、保持比例复选框、格式选择、[Resize] 按钮                        |
| **结果区** | 缩略图 + 下载按钮                                          |
| **底部**  | 小字说明：“All images processed locally. No upload.”     |

### 🧠 交互细节

* 拖拽图片时高亮边框（动画提示）
* 上传后立即显示预览与原始尺寸
* 调整参数后实时显示新尺寸预览
* 点击“Resize”后出现下载按钮
* 移动端：输入框自动靠上（便于单手操作）

---

## 🧰 五、技术实现（前端架构）

| 模块     | 技术                                     |
| ------ | -------------------------------------- |
| 框架     | **React + Vite**（或纯 Vanilla JS + HTML） |
| 图像缩放   | **Canvas + Pica**（高质量、性能好）             |
| 文件导出   | FileSaver.js / JSZip                   |
| PWA 支持 | manifest.json + service worker         |
| UI 框架  | TailwindCSS（快速实现极简风）                   |
| 动效     | Framer Motion（轻动效）                     |
| 部署     | Cloudflare Pages / Vercel              |

---

## 📱 六、PWA 配置要点

**manifest.json**

```json
{
  "name": "ResizeIt",
  "short_name": "ResizeIt",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**service-worker.js**

```js
self.addEventListener("install", e => {
  e.waitUntil(caches.open("resizeit").then(c => c.addAll(["/", "/index.html", "/main.js"])));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
```

---

## 💡 七、UI 风格建议

| 元素  | 风格说明               |
| --- | ------------------ |
| 字体  | Inter / Noto Sans  |
| 主色调 | 蓝 (#2563eb) + 灰白   |
| 按钮  | 圆角 + 阴影 + hover 浮动 |
| 图标  | lucide-react       |
| 动效  | 轻微缩放/淡入，不超 200ms   |

简约配色参考：

```css
body {
  background-color: #f9fafb;
  color: #111827;
}
button {
  background: #2563eb;
  color: white;
  border-radius: 12px;
}
```

---

## 🧱 八、页面结构建议

```
src/
 ├── components/
 │    ├── DropZone.tsx
 │    ├── ImagePreview.tsx
 │    ├── ResizeControls.tsx
 │    └── DownloadButton.tsx
 ├── utils/
 │    ├── resizeImage.js
 │    ├── pwa.js
 │    └── fileUtils.js
 ├── service-worker.js
 ├── manifest.json
 └── App.tsx
```

---

## 📊 九、SEO 与性能

| 指标            | 目标                                                                              |
| ------------- | ------------------------------------------------------------------------------- |
| Lighthouse 分数 | ≥ 95                                                                            |
| 页面体积          | ≤ 300KB（gzip）                                                                   |
| 关键词           | “resize image”, “online image resizer”, “resize photo online”                   |
| 元描述           | “Resize your images instantly, right in your browser. 100% private, no upload.” |
| Schema        | WebApplication JSON-LD                                                          |

---

## 🚀 十、版本规划

| 阶段       | 内容                      |
| -------- | ----------------------- |
| v1.0     | 单图/多图缩放 + 下载 + PWA 支持   |
| v1.1     | 批量 ZIP 下载 + 保持比例 + 格式转换 |
| v1.2     | 离线模式优化 + 移动端 UI 调整      |
| v2.0（可选） | 简单滤镜 / 压缩率调整 / 批处理参数保存  |

---

是否希望我帮你 **生成这个网站的前端原型代码结构（React + Tailwind + PWA）**？
可以直接在 Vite 中运行、几乎等于可用 MVP。
