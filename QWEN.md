# QWEN.md - CompanyWeb 项目上下文

> 本文档为 AI 助手提供项目核心信息，详细内容请参考 [CODEBUDDY.md](./CODEBUDDY.md)。

## 项目概述

**CompanyWeb** 是一个现代化企业官网系统 Monorepo 项目，包含三个独立但相互关联的子项目：

| 子项目 | 技术栈 | 端口 | 说明 |
|--------|--------|------|------|
| **frontend** | Next.js 16 + React 19 + Tailwind CSS 4 | 3001 | 面向公众的品牌官网 |
| **admin** | React 19 + Vite + Ant Design 6 | 3100 | 内容管理后台 |
| **server** | NestJS 10 + TypeORM + MariaDB | 3000 | RESTful API 服务 |

**数据库**: MariaDB（端口 3306，库名 `company_web`）

## 项目结构

```
CompanyWeb/
├── frontend/              # 官网前端 (Next.js)
├── admin/                 # 后台管理 (React + Vite)
├── server/                # 后端服务 (NestJS)
├── scripts/               # 便捷启动脚本
│   ├── start-all.bat      # 一键启动所有服务
│   ├── start-database.bat # 启动数据库
│   ├── stop-all.bat       # 停止所有服务
│   └── migrate-and-seed.bat # 数据库迁移和种子
└── docs/                  # 项目文档
```

## 构建和运行

### 环境要求
- Node.js >= 20 LTS
- pnpm (包管理器)
- MariaDB / MySQL

### 快速启动

**一键启动（推荐）:**
```bash
scripts\start-all.bat
```

**手动启动:**
```bash
# 1. 数据库
scripts\start-database.bat

# 2. 后端 (终端 1)
cd server && pnpm run start:dev

# 3. 后台管理 (终端 2)
cd admin && pnpm run dev

# 4. 官网前端 (终端 3)
cd frontend && pnpm run dev
```

### 访问地址
- 官网前端: http://localhost:3001
- 后台管理: http://localhost:3100
- 后端 API: http://localhost:3000/api

### 默认账号
- 用户名: `admin`
- 密码: `Admin123`

### 停止服务
```bash
scripts\stop-all.bat
```

## 开发规范

### 代码规范
- 语言: TypeScript
- 代码风格: ESLint + Prettier
- 提交: 语义化提交 (feat/fix/docs/chore)

### API 响应格式
```json
{ "code": 0, "message": "ok", "data": {} }
```

### 错误码
- `0`: 成功
- `10000-10999`: 通用错误
- `11000-11999`: 认证授权错误
- `12000-12999`: 管理员和 RBAC 错误
- `13000-13999`: 内容管理错误
- `14000-14999`: 上传和媒体错误
- `15000-15999`: 系统和第三方依赖错误

## 后台管理关键信息

### 页面清单
- `AdminUsersPage.tsx` - 账号管理（CRUD、重置密码、角色分配）
- `RolesPage.tsx` - 角色管理（权限分组选择）
- `NewsPage.tsx` - 新闻管理（搜索/分页/富文本）
- `AnnouncementsPage.tsx` - 公告管理（搜索/分页/富文本）
- `ProductsPage.tsx` - 产品管理（搜索/分页/富文本）
- `BannersPage.tsx` - Banner 管理
- `SiteContentPage.tsx` - 页面内容（富文本编辑）
- `SiteSettingsPage.tsx` - 站点设置
- `DashboardPage.tsx` - 仪表盘（数据统计）
- `ProfilePage.tsx` - 个人资料
- `SettingsPage.tsx` - 账号设置（修改密码）

### 通用组件 (admin/src/components/common/)
- `EnhancedUploadField` - 增强上传（预览/删除/拖拽/文件大小验证）
- `RichTextEditor` - 富文本编辑器 (wangEditor)
- `StatusSwitch` - 状态开关
- `PublishStatus` - 发布状态下拉选择
- `SortInput` - 排序输入器

### 权限配置 (admin/src/config/permissions.ts)
集中化的权限中文映射，包含 11 个分组共 44 条权限。

### 后端 DTO 注意事项
- `@IsOptional()` 只在 `null/undefined` 时跳过验证
- 空字符串 `''` 会触发 `@IsEmail()` 等验证
- 前端发送空值时应转为 `undefined`

## 关键文件路径
- 权限配置: `admin/src/config/permissions.ts`
- 权限种子: `server/src/database/seeds/auth.seed.ts`
- 布局组件: `admin/src/layouts/AdminLayout.tsx`
- 路由配置: `admin/src/router/index.tsx`
- TypeORM 数据源: `server/src/database/data-source.ts`

## Git 操作偏好
- 只执行 `git add` 和 `git commit`
- **不自动执行** `git push`
- 需要 push 时由用户手动指示
