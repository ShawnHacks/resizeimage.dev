# 精简MDX博客系统架构

## 1. 目录结构
```
content/
├── blog/
│   ├── tutorials/
│   │   ├── how-to-screenshot-entire-website/
│   │   │   ├── en.mdx
│   │   │   └── zh.mdx
│   │   ├── best-screenshot-tools-2025/
│   │   │   ├── en.mdx
│   │   │   └── zh.mdx
│   │   └── category.json
│   ├── tools-comparison/
│   │   ├── screenshot-tools-comparison/
│   │   │   ├── en.mdx
│   │   │   └── zh.mdx
│   │   └── category.json
│   ├── seo-guides/
│   │   ├── website-seo-with-screenshots/
│   │   │   ├── en.mdx
│   │   │   └── zh.mdx
│   │   └── category.json
│   └── web-development/
│       ├── responsive-design-testing/
│       │   ├── en.mdx
│       │   └── zh.mdx
│       └── category.json
```

## 2. 简化的类型定义
```typescript
export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  language: string
  availableLanguages: string[]
  featuredImage?: string
  featured?: boolean
}

export interface BlogCategory {
  slug: string
  name: string
  description: string
  color: string
  icon: string
  translations: Record<string, { name: string; description: string }>
}
```

## 3. MDX文件格式
```yaml
---
title: "How to Screenshot an Entire Website: Complete Guide 2025"
description: "Learn the best methods to capture full-page website screenshots with our step-by-step guide."
category: "tutorials"
tags: ["screenshot", "tutorial", "web-tools"]
author: "WebsiteScreenshot Team"
publishedAt: "2025-01-15"
updatedAt: "2025-01-15"
featuredImage: "/blog/images/screenshot-guide.jpg"
featured: true
---
```

## 4. 分类配置文件
```json
// content/blog/tutorials/category.json
{
  "slug": "tutorials",
  "color": "#10B981",
  "icon": "BookOpen",
  "translations": {
    "en": {
      "name": "Tutorials",
      "description": "Step-by-step guides and how-to articles"
    },
    "zh": {
      "name": "教程",
      "description": "分步指南和操作教程"
    }
  }
}
```

## 5. 核心功能
- ✅ MDX文件解析和渲染
- ✅ 多语言支持（en, zh-CN等）
- ✅ 分类系统
- ✅ 博客列表页面
- ✅ 单篇文章页面
- ✅ SEO优化（meta标签、结构化数据）
- ✅ 响应式设计
- ✅ 阅读时间计算

## 6. 页面路由
- `/blog` - 博客首页（所有文章）
- `/blog/category/[category]` - 分类页面
- `/blog/[slug]` - 单篇文章
- `/zh/blog` - 中文博客首页
- `/zh/blog/category/[category]` - 中文分类页面
- `/zh/blog/[slug]` - 中文文章

## 7. 实现重点
1. **文件系统路由**: 基于目录结构自动生成路由
2. **静态生成**: 所有页面预渲染，优化SEO和性能
3. **增量更新**: 新增文章时自动重新生成相关页面
4. **简单维护**: 只需添加MDX文件即可发布新文章
