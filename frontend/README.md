# Frontend - 官网前端

基于 Next.js 16 的企业官网前端，提供 SSR 渲染、SEO 优化和响应式布局。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: React 19 + Tailwind CSS 4
- **SEO**: 动态 Metadata + JSON-LD 结构化数据
- **缓存**: ISR (Incremental Static Regeneration)
- **语言**: TypeScript

## 快速开始

### 环境要求

- Node.js >= 20 LTS
- pnpm
- 后端 API 服务运行中

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000/api
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3001
```

### 启动开发服务器

```bash
pnpm run dev
```

访问：http://localhost:3001

### 构建生产版本

```bash
pnpm run build
pnpm run start
```

## 项目结构

```
app/
├── layout.tsx              # 全局布局（Header + Footer + BackToTop + JSON-LD）
├── page.tsx                # 首页
├── sitemap.ts              # 动态 sitemap.xml
├── robots.ts               # robots.txt
├── about/
│   └── page.tsx            # 关于我们
├── contact/
│   └── page.tsx            # 联系我们
├── news/
│   ├── page.tsx            # 新闻列表（Server Component）
│   ├── NewsListClient.tsx  # 新闻列表（Client Component）
│   └── [id]/
│       └── page.tsx        # 新闻详情
├── announcements/
│   ├── page.tsx            # 公告列表
│   ├── AnnouncementListClient.tsx
│   └── [id]/
│       └── page.tsx        # 公告详情
└── products/
    ├── page.tsx            # 产品列表
    ├── ProductListClient.tsx
    └── [id]/
        └── page.tsx        # 产品详情
```

## 页面路由

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | Hero Banner、公司简介、产品推荐、最新新闻公告 |
| 关于我们 | `/about` | 企业介绍、发展历程、企业文化 |
| 产品中心 | `/products` | 产品分类列表、筛选、分页 |
| 产品详情 | `/products/:id` | 产品详细信息、参数规格、图片展示 |
| 新闻中心 | `/news` | 新闻列表、分类筛选、分页浏览 |
| 新闻详情 | `/news/:id` | 新闻正文、发布时间、相关内容推荐 |
| 公告中心 | `/announcements` | 公告列表、置顶公告、分页浏览 |
| 公告详情 | `/announcements/:id` | 公告详细内容 |
| 联系我们 | `/contact` | 联系方式、公司地址 |

## 架构设计

### Server/Client 组件分离

列表页使用**分离模式**：

- `page.tsx` - Server Component：获取数据 + 生成 Metadata
- `*Client.tsx` - Client Component：交互渲染（分页、筛选）

**优势**：

- 首屏 SEO 友好（服务端渲染 HTML）
- 交互体验好（客户端处理分页/筛选）
- 减少客户端 JavaScript 体积

### 数据获取与缓存

使用 Next.js `fetch` 配合 ISR 实现增量静态再生：

```typescript
// lib/api.ts
const CACHE_TIMES = {
  SHORT: 60,        // 新闻列表
  MEDIUM: 300,      // 产品
  LONG: 3600,       // 静态页面
  VERY_LONG: 86400, // 关于我们/联系我们
};

// 使用示例
const data = await fetchApi('/api/public/news', {
  next: { revalidate: CACHE_TIMES.SHORT },
});
```

### SEO 优化

#### 动态 Metadata

每个页面使用 `generateMetadata()` 生成 SEO 信息：

```typescript
export async function generateMetadata() {
  const data = await fetchApi('/api/public/site-settings');
  return {
    title: `${data.title} - 公司名称`,
    description: data.description,
    openGraph: { /* ... */ },
    twitter: { /* ... */ },
  };
}
```

#### JSON-LD 结构化数据

使用 `components/JsonLd.tsx` 组件：

- Organization - 组织信息
- NewsArticle - 新闻文章
- Product - 产品信息
- BreadcrumbList - 面包屑导航

#### 动态 Sitemap

`app/sitemap.ts` 自动生成 sitemap.xml：

```typescript
export default async function sitemap() {
  const news = await fetchApi('/api/public/news');
  return [
    { url: '/', lastModified: new Date() },
    { url: '/about', lastModified: new Date() },
    ...news.map(n => ({
      url: `/news/${n.id}`,
      lastModified: new Date(n.updatedAt),
    })),
  ];
}
```

## 工具函数

### `lib/api.ts`

API 请求封装：

- 自动解包 `{ code: 0, data: T }`
- 错误时抛出 `ApiError`
- 支持 ISR 缓存配置

### `lib/seo.ts`

SEO 工具：

- `buildMetadata()` - 生成统一的 Metadata
- 支持标题、描述、canonical、OpenGraph、Twitter Card

### `lib/public-content.ts`

内容解析工具：

- `parseStringArray()` - 解析 JSON 字符串数组
- `parseProductParameters()` - 解析产品参数
- `formatPublicDate()` - 中文日期格式化

## 开发规范

### 代码规范

- 语言: TypeScript
- 代码风格: ESLint + Prettier
- 类型检查: `pnpm run type-check`

### 注意事项

1. **根布局 dynamic 设置**: 根布局有 `export const dynamic = 'force-dynamic'` 强制每次请求重新渲染，**生产部署前需移除**。

2. **无用户提交表单**: 官网前端没有表单、用户提交、询盘表单、分析数据收集。

3. **所有 API 调用使用 `/api/public/*`**: 无需认证。

### 提交规范

使用语义化提交信息：

```
feat: add product detail page
fix: handle news list pagination
docs: update SEO documentation
chore: update Next.js to v16
```

## 常用命令

```bash
pnpm run dev              # 启动开发服务器
pnpm run build            # 构建生产版本
pnpm run start            # 启动生产服务器
pnpm run lint             # ESLint 检查
pnpm run type-check       # TypeScript 类型检查
pnpm run format           # 格式化代码
```

## 相关文档

- [站点地图](../docs/site-map.md)
- [API 接口文档](../docs/api-overview.md)
- [部署指南](../docs/deployment.md)
- [项目主 README](../README.md)
- [完整技术架构](../CODEBUDDY.md)
