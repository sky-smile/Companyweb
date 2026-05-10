# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

### 开发环境启动

```bash
cd server && pnpm run start:dev    # 后端 API (端口 4000)
cd admin && pnpm run dev           # 管理后台 (端口 4100)
cd frontend && pnpm run dev        # 官网前端 (端口 3001)
# 一键启动所有服务
bash scripts/start-all.sh
```

### 数据库管理

```bash
pnpm run db:migrate-and-seed       # 迁移 + 种子（一键初始化）
pnpm run db:migrate                # 仅运行迁移
pnpm run db:revert                 # 回滚最近一次迁移
pnpm run db:seed                   # 仅运行种子
pnpm run db:reset                  # 重置数据库（删表 → 迁移 → 种子）
cd server && pnpm run migration:show  # 查看迁移状态
```

### 代码质量

```bash
cd server && npx tsc --noEmit && pnpm run lint
cd admin && npx tsc --noEmit && pnpm run lint
cd frontend && npx tsc --noEmit && pnpm run lint
```

### Docker 部署

```bash
docker compose up -d                # 构建并启动所有服务
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d mariadb  # 仅启动数据库（开发用）
docker compose logs -f [service]    # 查看服务日志
docker compose ps                   # 查看服务状态
curl http://localhost/api/health    # 验证 API 健康状态
```

### 默认管理员账号

- 用户名：`admin`
- 密码：`Admin123`

## 架构概览

### Monorepo 结构（pnpm workspace）

| 子项目 | 技术栈 | 端口 | 用途 |
|--------|--------|------|------|
| `server/` | NestJS 10 + TypeORM + MariaDB | 4000 | RESTful API，全局前缀 `/api` |
| `admin/` | React 19 + Vite + Ant Design 6 | 4100 | 管理后台，调用 `/api/admin/*` |
| `frontend/` | Next.js 16 + Tailwind CSS 4 (App Router) | 3001 | 公开官网，调用 `/api/public/*` |

重要：三个子项目有独立的 `package.json` 和依赖，根目录 pnpm workspace 仅用于编排数据库脚本。

### 数据流

- **Admin → Server**：JWT Bearer Token + RBAC 权限守卫
- **Frontend → Server**：公开只读 API，无需认证
- 两个前端不直接通信，Server 是唯一数据源

### API 响应格式

```json
{ "code": 0, "message": "ok", "data": {} }
```

错误码范围：`10000-10999` 通用验证、`11000-11999` 认证授权、`12000-12999` RBAC、`13000-13999` 内容管理、`14000-14999` 上传媒体、`15000-15999` 系统错误。

## 后端架构 (server/)

### 全局管道/中间件（main.ts 启动顺序）

1. `ResponseInterceptor` — 自动包装返回值为 `{ code: 0, message: "ok", data: T }`；已包含这些字段则跳过
2. `AllExceptionsFilter` — HTTP 异常映射为业务错误码
3. `ValidationPipe` — 全局 `whitelist` + `transform` + `forbidNonWhitelisted`
4. CORS 全局启用，静态文件服务 `/uploads`

### 双控制器模式

每个内容模块（News, Announcement, Product, SiteContent）都有两个控制器：

- `*.controller.ts` → `/api/admin/*` — JWT + 权限守卫，包含草稿内容
- `public-*.controller.ts` → `/api/public/*` — 无需认证，仅发布内容

两个控制器共享同一个 Service，Service 分别提供 admin 和 public 方法。

### 认证与 RBAC

- JWT 流程：登录 → accessToken(2h) + refreshToken(7d)
- JWT 载荷：`{ sub, username, isSuperAdmin, roles[], permissions[] }`
- 权限嵌入 Token 中，角色/权限变更需重新登录后才生效
- RBAC 表：`admin_users ←→ admin_user_roles ←→ roles ←→ role_permissions ←→ permissions`
- 权限格式 `module:action`（如 `news:create`）
- 超级管理员（`isSuperAdmin=1` 或拥有 `*:*`）绕过所有检查
- `@Permissions()` 装饰器使用 AND 语义（需要全部权限）

### Repository 模式

每个模块有自定义 `*.repository.ts` 封装 TypeORM 查询。Services 依赖这些 repository，不直接使用 TypeORM Repository。

### 数据库与迁移

- 14 个实体，9 个迁移文件
- `DB_SYNCHRONIZE=false` 始终使用迁移
- 主键统一使用 `bigint unsigned`（除 `media_files` 用 int）
- 种子脚本 `auth.seed.ts` 创建超级管理员 + 44 个权限 + admin 用户（`ON DUPLICATE KEY UPDATE` 幂等）

## 关键陷阱

1. **DTO 空字符串验证**：`@IsOptional()` 只跳过 `null/undefined`，不跳过空字符串。`@IsEmail()` 会拒绝 `''`。前端发送空值时必须转为 `undefined`
2. **Token 权限更新**：修改角色/权限后需刷新 Token 或重新登录
3. **ISR 缓存**：frontend 根布局有 `export const dynamic = 'force-dynamic'`，覆盖所有 ISR 缓存策略，生产部署前应移除
4. **中文文件名**：上传时需 `fixFilenameEncoding()` 处理 busboy Latin-1 解码问题
5. **权限双重定义**：添加新权限必须同时更新 `server/src/database/seeds/auth.seed.ts` 和 `admin/src/config/permissions.ts`
6. **Admin 路径前缀**：管理后台部署在 `/admin/` 路径下，路由跳转必须使用 `/admin/login` 而非 `/login`
7. **服务端渲染 API 地址**：Next.js SSR 时需使用容器内部地址（`http://server:4000/api`），客户端使用相对路径（`/api`）

## 关键文件路径

| 文件 | 说明 |
|------|------|
| `server/src/database/seeds/auth.seed.ts` | 权限和超级管理员种子 |
| `server/src/database/data-source.ts` | TypeORM 数据源和迁移列表 |
| `server/src/config/app.config.ts` | 应用配置 |
| `admin/src/config/permissions.ts` | 前端权限中文映射（需与种子同步） |
| `admin/src/services/http.ts` | Axios 封装（请求/响应拦截器） |
| `admin/src/layouts/AdminLayout.tsx` | 管理后台布局和菜单过滤 |
| `frontend/app/layout.tsx` | 官网全局布局（Header/Footer/SEO） |
| `frontend/lib/api.ts` | 官网 ISR 数据获取封装 |
| `docker/nginx/docker-compose.conf` | Nginx 反向代理路由规则 |
