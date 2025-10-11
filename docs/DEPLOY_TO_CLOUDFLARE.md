# 🚀 部署到 Cloudflare Pages 快速指南

## ✅ 已完成的配置

### 1. **Edge Runtime 配置**
所有页面已添加 `export const runtime = "edge"`：
- ✅ `app/[locale]/page.tsx`
- ✅ `app/[locale]/blog/page.tsx`
- ✅ `app/[locale]/blog/[...slug]/page.tsx`
- ✅ `app/[locale]/blog/category/[category]/page.tsx`
- ✅ `app/[locale]/(misc)/about/page.tsx`
- ✅ `app/[locale]/(misc)/privacy-policy/page.tsx`
- ✅ `app/[locale]/(misc)/terms-of-service/page.tsx`
- ✅ `app/[locale]/(misc)/cookie-policy/page.tsx`
- ✅ `app/[locale]/[...rest]/page.tsx`

### 2. **博客系统静态化**
- ✅ 创建 `scripts/generate-blog-data.mjs` - 构建时生成静态数据
- ✅ 创建 `lib/blog-static.ts` - Edge Runtime 兼容的数据加载器
- ✅ 所有博客页面已迁移到 `blog-static.ts`
- ✅ `package.json` 添加 `prebuild` 脚本

### 3. **Cloudflare Pages 工具**
- ✅ 安装 `@cloudflare/next-on-pages`
- ✅ 创建 `wrangler.toml` 配置
- ✅ 更新 `next.config.mjs` 支持 Cloudflare
- ✅ 添加部署脚本：`pages:build`, `preview`, `deploy`

## 📦 部署步骤

### 方式 1：本地部署

```bash
# 1. 构建项目（自动运行 prebuild 生成博客数据）
pnpm build

# 2. 构建 Cloudflare Pages 版本
pnpm pages:build

# 3. 本地预览（可选）
pnpm preview

# 4. 部署到 Cloudflare Pages
pnpm deploy

# 或者一步完成（推荐）
pnpm build && pnpm deploy
```

### 方式 2：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** > **Create a project**
3. 连接 Git 仓库
4. 配置构建设置：
   - **构建命令**：`pnpm build && pnpm pages:build`
   - **构建输出目录**：`.vercel/output/static`
   - **Node.js 版本**：20.x
5. 点击 **Save and Deploy**

### 方式 3：通过 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build && pnpm pages:build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .vercel/output/static --project-name=bulkresizeimages
```

## 🔍 验证部署

### 本地验证

```bash
# 1. 检查生成的静态数据
ls -la generated/
cat generated/blog-categories.json
cat generated/blog-posts.json

# 2. 本地预览
pnpm preview
```

### 线上验证

部署后访问以下页面确认：
- ✅ 首页：`https://your-domain.com`
- ✅ 博客列表：`https://your-domain.com/blog`
- ✅ 多语言：`https://your-domain.com/zh/blog`
- ✅ 关于页面：`https://your-domain.com/about`

## 🎯 关键配置文件

| 文件 | 作用 |
|------|------|
| `wrangler.toml` | Cloudflare Pages 配置 |
| `next.config.mjs` | Next.js 配置，支持 Cloudflare |
| `scripts/generate-blog-data.mjs` | 构建时生成博客数据 |
| `lib/blog-static.ts` | Edge Runtime 兼容的博客加载器 |
| `generated/` | 构建时生成的静态数据（自动生成） |

## ⚠️ 注意事项

1. **首次部署**：确保运行过 `pnpm build` 生成 `generated/` 目录
2. **环境变量**：在 Cloudflare Dashboard 中配置需要的环境变量
3. **域名配置**：在 Cloudflare Pages 设置中配置自定义域名
4. **博客内容**：修改博客内容后需要重新构建和部署

## 🌟 优势

- ⚡ **全球 CDN** - Cloudflare 全球 300+ 数据中心
- 🛡️ **DDoS 保护** - 自动防护
- 💰 **免费额度** - 每月 500 次构建，无限请求
- 🚀 **自动 HTTPS** - 免费 SSL 证书
- 📈 **无限扩展** - 自动处理流量峰值

## 📚 相关文档

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [博客静态化详细说明](./CLOUDFLARE_PAGES_BLOG.md)

## 🆘 故障排查

### 问题：构建失败，找不到 `generated/` 目录

**解决方案**：
```bash
# 手动运行 prebuild
pnpm prebuild
# 或者
node scripts/generate-blog-data.mjs
```

### 问题：部署后页面报错 `Cannot find module 'fs'`

**解决方案**：确保所有页面都使用 `blog-static.ts` 而不是 `blog-simple.ts`

### 问题：博客内容不显示

**解决方案**：
1. 检查 `content/blog/` 目录是否有内容
2. 重新运行 `pnpm build` 生成数据
3. 确认 `generated/` 目录中有数据文件

---

✨ **准备就绪！现在可以部署到 Cloudflare Pages 了！**
