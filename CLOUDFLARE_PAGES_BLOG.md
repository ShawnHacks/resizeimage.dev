# Cloudflare Pages 博客部署方案

## 📋 问题背景

Cloudflare Pages 使用 Edge Runtime，不支持 Node.js 的文件系统 API (`fs`, `path`)。原有的 `blog-simple.ts` 在运行时读取文件系统，无法在 Cloudflare Pages 上运行。

## ✅ 解决方案

采用**构建时静态化**方案：

1. **构建时生成静态数据**：在 `pnpm build` 之前，通过 `prebuild` 脚本读取所有博客内容，生成 JSON 文件
2. **运行时导入静态数据**：使用新的 `blog-static.ts` 从生成的 JSON 文件导入数据
3. **Edge Runtime 兼容**：所有页面添加 `export const runtime = "edge"`

## 📁 文件结构

```
project/
├── content/blog/           # 原始博客 MDX 文件
├── scripts/
│   └── generate-blog-data.mjs  # 构建脚本
├── generated/              # 构建时生成的 JSON 文件（自动生成）
│   ├── blog-categories.json
│   ├── blog-posts.json
│   ├── blog-category-{slug}.json
│   └── blog-related-{slug}.json
├── lib/
│   ├── blog-simple.ts      # 旧版（依赖 Node.js fs）
│   └── blog-static.ts      # 新版（Edge Runtime 兼容）✅
```

## 🔄 工作流程

### 1. 构建流程

```bash
pnpm build
# ↓ 自动触发
# 1. prebuild: node scripts/generate-blog-data.mjs
#    - 读取 content/blog/ 目录
#    - 生成 generated/*.json 文件
# 2. next build
#    - 将 JSON 文件打包进 bundle
#    - 生成静态页面
```

### 2. 迁移步骤

将所有使用 `blog-simple.ts` 的地方改为 `blog-static.ts`：

```typescript
// 旧代码
import { getBlogPosts, getCategories } from '@/lib/blog-simple'

// 新代码
import { getBlogPosts, getCategories } from '@/lib/blog-static'
```

### 3. 部署到 Cloudflare Pages

```bash
# 构建 Cloudflare Pages 版本
pnpm pages:build

# 本地预览
pnpm preview

# 部署到 Cloudflare Pages
pnpm deploy
```

## 🎯 优势

1. **Edge Runtime 兼容** - 不依赖 Node.js API
2. **性能优秀** - 数据在构建时生成，运行时直接导入
3. **类型安全** - TypeScript 支持 JSON 导入
4. **开发体验好** - API 与原版完全一致
5. **自动化** - `prebuild` 脚本自动运行

## 📝 API 对比

两个版本 API 完全一致：

```typescript
// 所有函数签名相同
export async function getCategories(): Promise<BlogCategory[]>
export async function getCategory(slug: string): Promise<BlogCategory | null>
export async function getBlogPosts(locale?: string): Promise<SimpleBlogPost[]>
export async function getBlogPost(slug: string): Promise<SimpleBlogPost | null>
export async function getPostsByCategory(categorySlug: string, locale?: string): Promise<SimpleBlogPost[]>
export async function getRelatedPosts(slug: string, limit?: number): Promise<SimpleBlogPost[]>
```

## ⚠️ 注意事项

1. **首次运行**：首次克隆项目后需要运行 `pnpm prebuild` 或 `pnpm build` 生成数据
2. **内容更新**：修改博客内容后需要重新运行构建脚本
3. **Git 管理**：
   - 方案 A（推荐）：将 `generated/` 提交到 git，确保部署时有数据
   - 方案 B：不提交 `generated/`，确保 CI/CD 运行 `pnpm build`

## 🚀 Cloudflare Pages 配置

在 Cloudflare Pages 项目设置中：

- **构建命令**：`pnpm build && pnpm pages:build`
- **构建输出目录**：`.vercel/output/static`
- **Node.js 版本**：20.x 或更高

## 🔍 验证

构建成功后检查：

```bash
# 1. 检查生成的文件
ls -la generated/

# 2. 检查文件内容
cat generated/blog-categories.json
cat generated/blog-posts.json

# 3. 本地测试
pnpm preview
```

## 📚 相关文件

- `scripts/generate-blog-data.mjs` - 构建脚本
- `lib/blog-static.ts` - Edge Runtime 兼容的博客数据加载器
- `lib/blog-simple.ts` - 原版（仅供参考）
- `package.json` - 包含 `prebuild` 脚本

## 🎉 结论

通过这个方案，博客系统可以完美运行在 Cloudflare Pages 上，享受：
- ⚡ 全球 CDN 加速
- 🛡️ DDoS 保护
- 💰 免费额度充足
- 🚀 无服务器架构

所有处理都在构建时完成，运行时无需文件系统访问！
