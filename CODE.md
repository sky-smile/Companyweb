# CODEB.md - 项目技术架构手册

> 本文档面向 AI 助手和深度开发者，提供完整的技术架构、开发规范和最佳实践。

## 📋 目录

- [常用命令](#常用命令)
- [架构概览](#架构概览)
- [后端架构 (NestJS)](#后端架构-nestjs)
- [后台管理架构 (React)](#后台管理架构-react)
- [官网前端架构 (Next.js)](#官网前端架构-nextjs)
- [环境变量配置](#环境变量配置)
- [开发规范与陷阱](#开发规范与陷阱)

---

## 常用命令

### 启动所有服务

```bash
scripts\start-all.bat        # 一键启动：数据库 + 后端 + 管理后台 + 官网
scripts\start-database.bat   # 仅启动数据库
scripts\stop-all.bat         # 停止所有服务
```

### 单独启动服务

```bash
cd server && pnpm run start:dev    # 后端 API (端口 4000)
cd admin && pnpm run dev           # 管理后台 (端口 4100)
cd frontend && pnpm run dev        # 官网前端 (端口 3001)
```

### 数据库管理

```bash
# 运行迁移和种子
scripts\migrate-and-seed.bat       # 一键迁移 + 种子
pnpm run db:migrate-and-seed       # 同上（pnpm 方式）

# 单独操作
pnpm run db:migrate                # 运行迁移
pnpm run db:revert                 # 回滚最后一次迁移
pnpm run db:seed                   # 运行种子
pnpm run db:reset                  # 重置数据库（删除所有表 → 迁移 → 种子）

# 查看迁移状态
cd server && pnpm run migration:show
```

### 代码质量

```bash
cd admin && npx tsc --noEmit          # TypeScript 检查
cd server && npx tsc --noEmit
cd frontend && npx tsc --noEmit

cd admin && pnpm run lint             # ESLint 检查
cd server && pnpm run lint
cd frontend && pnpm run lint
```

### 默认管理员账号

- 用户名：`admin`
- 密码：`Admin123`

---

## 架构概览

### Monorepo 结构

本项目是 Monorepo，包含三个独立的子项目，没有使用 pnpm workspaces 或 turborepo 等工具。每个子项目有独立的 `package.json` 和依赖。

| 子项目 | 技术栈 | 端口 | API 前缀 |
|--------|--------|------|----------|
| **server** | NestJS 10 + TypeORM + MariaDB | 4000 | `/api` |
| **admin** | React 19 + Vite + Ant Design 6 | 4100 | 调用 `/api/admin/*` |
| **frontend** | Next.js 16 + Tailwind CSS 4 | 3001 | 调用 `/api/public/*` |

### 数据流

- **Admin → Server**: 管理 API `/api/admin/*`，需要 JWT Bearer Token + RBAC 权限
- **Frontend → Server**: 公开只读 API `/api/public/*`，无需认证
- 两个前端从不直接通信，Server 是唯一数据源

### API 响应格式

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

**错误码规范：**

| 范围 | 说明 |
|------|------|
| `0` | 成功 |
| `10000-10999` | 通用请求和验证错误 |
| `11000-11999` | 认证和授权错误 |
| `12000-12999` | 管理员和 RBAC 错误 |
| `13000-13999` | 内容管理错误 |
| `14000-14999` | 上传和媒体错误 |
| `15000-15999` | 系统和第三方依赖错误 |

---

## 后端架构 (NestJS)

### 全局中间件管道

1. **ResponseInterceptor**: 自动包装返回值到 `{ code: 0, message: "ok", data: T }`。如果响应已包含 `code/message/data` 字段则跳过包装。
2. **AllExceptionsFilter**: 将 HTTP 错误映射为业务错误码。500+ 错误会记录堆栈跟踪到日志。
3. **ValidationPipe**: 全局启用 `whitelist` + `transform` + `forbidNonWhitelisted`。
4. **CORS**: 全局启用；静态文件服务在 `/uploads`。

### 模块结构 — 双控制器模式

每个内容模块（News, Announcement, Product, SiteContent）都有**两个控制器**：

- `*.controller.ts` 在 `/admin/*` 下 — JWT + 权限守卫，包含草稿内容
- `public-*.controller.ts` 在 `/public/*` 下 — 无需认证，只返回已发布内容

两个控制器共享同一个 Service，Service 有独立的方法处理管理员和公开查询（例如 `listNews` vs `listPublicNews`）。

### 认证与 RBAC

**JWT 流程**: 登录 → accessToken(2h) + refreshToken(7d)。JWT 载荷包含 `{ sub, username, isSuperAdmin, roles[], permissions[] }`。**权限嵌入在 Token 中** — 角色/权限变更需要刷新 Token 后才生效。

**RBAC 表结构**: `admin_users ←→ admin_user_roles ←→ roles ←→ role_permissions ←→ permissions`

- 权限代码格式为 `module:action`（例如 `news:create`, `admin-users:view`）
- 超级管理员: `isSuperAdmin=1` 或拥有 `*:*` 权限的用户绕过所有检查
- `PermissionsGuard` 需要**所有**列出的权限（`@Permissions()` 装饰器，AND 语义）

**认证回退**: 当数据库不可用时，`AuthRepository` 回退到硬编码的模拟管理员用户 (admin/Admin123) — 确保在数据库播种前也能登录。

### Repository 模式

每个模块都有自定义 `*.repository.ts` 封装 TypeORM 查询。Services 依赖这些自定义 repository，而非直接使用 TypeORM 的 Repository。

### 数据库与迁移

- 14 个实体，都使用 `bigint unsigned` 主键（除 `media_files` 使用 int）
- 6 个迁移文件：auth-rbac → news → announcements → site-content → products → media-files
- `DB_SYNCHRONIZE=false` 即使在开发环境 — 始终使用迁移
- 种子: `auth.seed.ts` 创建超级管理员角色 + 44 个权限 + admin 用户（幂等操作通过 `ON DUPLICATE KEY UPDATE`）

### 文件上传

- Multer 使用**内存存储**，10MB 限制
- 文件名格式：`{timestamp}-{random8char}{ext}`，存储在 `uploads/{folder}/`
- `fixFilenameEncoding()` 处理中文文件名编码问题（busboy 的 Latin-1 解码）
- 需要 `upload:image` 或 `upload:file` 权限

### 关键陷阱

- **DTO 验证**: `@IsOptional()` 只对 `null/undefined` 跳过验证，**不是**空字符串。`@IsEmail()` 会拒绝 `''`。前端发送空值时必须转为 `undefined`。
- **分页问题**: 某些服务（如 NewsService）加载所有记录然后在内存中过滤 — 不适用于大数据集。
- **上传控制器**: UploadController 手动构造响应而不是依赖 ResponseInterceptor 自动包装。

---

## 后台管理架构 (React)

### 启动流程

`main.tsx → App.tsx → ConfigProvider(Ant Design) + BrowserRouter + AppBootstrap → AppRouter`

**AppBootstrap** 检查 localStorage 中的 token，调用 `GET /auth/profile` 验证，如果无效则清除会话。

### 状态管理

不使用 Redux/Zustand。简单的 `authStore` 对象模式：

```typescript
// 权限检查
hasPermission(code): boolean {
  return isSuperAdmin || 
         permissions.includes('*:*') || 
         permissions.includes(code);
}
```

菜单过滤通过 `filterMenuByPermission()` 在 AdminLayout 中实现。

### HTTP 层 (`services/http.ts`)

Axios 封装，包含：

- 请求拦截器: 注入 `Authorization: Bearer <token>`
- 响应拦截器: 401 → 清除会话 + 重定向到 `/login`（**不使用** refreshToken 自动刷新）
- `unwrapResponse<T>()`: 从 `{ code: 0, data: T }` 中提取 `data`，非零代码时抛出

### 权限配置 (`config/permissions.ts`)

**双重定义问题**: 权限在后端种子和前端配置中都有定义。前端有 11 个分组带中文名称/描述。**添加新权限时必须同时更新** `server/src/database/seeds/auth.seed.ts` 和 `admin/src/config/permissions.ts`。

### 路由结构

```
/login                          → LoginPage
/ (ProtectedRoute → AdminLayout)
  /                             → DashboardPage
  /account/admin-users          → AdminUsersPage
  /account/roles                → RolesPage
  /account/profile              → ProfilePage
  /account/settings             → SettingsPage
  /content/news                 → NewsPage
  /content/announcements        → AnnouncementsPage
  /content/products             → ProductsPage
  /site/pages                   → SiteContentPage
  /site/banners                 → BannersPage
  /site/settings                → SiteSettingsPage
  /media/upload                 → MediaCenterPage
```

### 通用组件 (`admin/src/components/common/`)

| 组件 | 说明 |
|------|------|
| `RichTextEditor` | wangEditor 5.x 集成 |
| `EnhancedUploadField` | 图片预览、拖拽上传、文件大小验证、删除 |
| `StatusSwitch` | 状态切换开关 |
| `PublishStatus` | 发布状态下拉选择 |
| `SortInput` | 排序输入器 |

### 关键陷阱

- **角色编辑**: 必须将权限代码转换为 ID 后再设置表单值
- **置顶字段**: PATCH 请求只发送 `isTop` 字段，不是完整记录
- **邮箱字段**: 过滤空字符串为 `undefined` 避免 `@IsEmail()` 验证错误
- **Token 刷新**: 后端有 refreshToken 机制但管理后台**未使用** — 401 总是重定向到登录页

---

## 官网前端架构 (Next.js)

### App Router 结构

```
app/
  layout.tsx         → 全局布局 (Header + Footer + BackToTop + JSON-LD)
  page.tsx           → 首页 (聚合 Banner + Products + News + Announcements)
  sitemap.ts         → 动态 sitemap.xml
  robots.ts          → robots.txt
  about/page.tsx     → 关于我们
  contact/page.tsx   → 联系我们
  news/page.tsx + NewsListClient.tsx + [id]/page.tsx
  announcements/page.tsx + AnnouncementListClient.tsx + [id]/page.tsx
  products/page.tsx + ProductListClient.tsx + [id]/page.tsx
```

### Server/Client 组件模式

列表页使用**分离模式**: `page.tsx` 作为 Server Component 获取数据 + 生成 Metadata，然后将数据传递给 `*Client.tsx` Client Component 用于交互渲染（分页、筛选）。

### 数据获取与缓存 (`lib/api.ts`)

`fetchApi<T>()` 使用 Next.js `fetch` 配合 `next.revalidate` 实现 ISR：

- SHORT = 60s（新闻列表）
- MEDIUM = 300s（产品）
- LONG = 3600s（静态页面）
- VERY_LONG = 86400s

支持 `tags` 用于按需重新验证。

解包 `{ code: 0, data: T }`，非零代码时抛出 `ApiError`。

**重要**: 根布局有 `export const dynamic = 'force-dynamic'` 强制每次请求重新渲染，覆盖 ISR 缓存策略。**生产部署前应移除此设置**。

### SEO

- `lib/seo.ts`: `buildMetadata()` 生成统一的 Metadata (标题、描述、canonical、OpenGraph、Twitter Card)
- `components/JsonLd.tsx`: 结构化数据组件 (Organization, NewsArticle, Product, BreadcrumbList)
- 每个页面使用 `generateMetadata()` 从 API 获取 SEO 字段，回退到内容摘要

### 工具函数 (`lib/public-content.ts`)

- `parseStringArray`: 处理 JSON 字符串数组的边界情况
- `parseProductParameters`: 支持对象数组、键值对和 `label:value` 文本格式
- `formatPublicDate`: 中文日期格式化

### 关键约束

- 没有表单、用户提交、询盘表单、分析数据收集
- 所有 API 调用使用 `/api/public/*` — 无需认证

---

## 环境变量配置

### Server (server/.env)

```env
SERVER_PORT=4000
SERVER_GLOBAL_PREFIX=api

DB_TYPE=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=company_web
DB_USER=root
DB_PASSWORD=

JWT_ACCESS_SECRET=           # >= 16 字符
JWT_REFRESH_SECRET=          # >= 16 字符
JWT_ACCESS_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

UPLOAD_DIR=uploads
UPLOAD_BASE_URL=http://localhost:4000/uploads
```

### Admin (admin/.env)

```env
VITE_API_BASE_URL=http://127.0.0.1:4000/api
VITE_APP_TITLE=Company Web Admin
```

### Frontend (frontend/.env)

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4000/api
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3001
```

---

## 开发规范与陷阱

### 代码规范

- 语言: TypeScript
- 代码风格: ESLint + Prettier
- 提交规范: 使用语义化提交信息 (feat/fix/docs/chore)

### 分支管理

```
main              # 主分支 (生产环境)
├── feature/xxx   # 功能分支
├── fix/xxx       # 修复分支
├── chore/xxx     # 维护分支
└── docs/xxx      # 文档分支
```

### 常见陷阱

1. **DTO 空字符串验证**: 前端发送空值时必须转为 `undefined`，否则会触发 `@IsEmail()` 等验证错误
2. **Token 权限更新**: 修改角色/权限后需要刷新 Token 或重新登录才能生效
3. **ISR 缓存**: 根布局的 `force-dynamic` 覆盖缓存设置，生产部署前需移除
4. **中文文件名**: 上传时需用 `fixFilenameEncoding()` 处理编码问题
5. **邮箱字段**: 前端过滤空字符串为 `undefined` 避免验证错误

### 关键文件路径

| 文件 | 说明 |
|------|------|
| `server/src/database/seeds/auth.seed.ts` | 权限种子脚本 |
| `server/src/database/data-source.ts` | TypeORM 数据源配置 |
| `admin/src/config/permissions.ts` | 前端权限中文映射 |
| `admin/src/layouts/AdminLayout.tsx` | 管理后台布局组件 |
| `admin/src/router/index.tsx` | 管理后台路由配置 |
| `frontend/app/layout.tsx` | 官网全局布局 |
| `frontend/lib/api.ts` | 官网 API 封装 |

---

**最后更新**: 2026-04-13
**版本**: v2.0.0
