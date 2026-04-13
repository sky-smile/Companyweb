# Server - 后端 API 服务

基于 NestJS 10 的 RESTful API 服务，提供认证、内容管理和文件上传功能。

## 技术栈

- **框架**: NestJS 10
- **ORM**: TypeORM 0.3.24
- **数据库**: MariaDB / MySQL
- **认证**: JWT (passport-jwt)
- **验证**: class-validator + class-transformer
- **语言**: TypeScript

## 快速开始

### 环境要求

- Node.js >= 20 LTS
- pnpm
- MariaDB / MySQL

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入数据库配置：

```env
SERVER_PORT=3000
SERVER_GLOBAL_PREFIX=api

DB_TYPE=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=company_web
DB_USER=root
DB_PASSWORD=

JWT_ACCESS_SECRET=your_secret_at_least_16_chars
JWT_REFRESH_SECRET=your_secret_at_least_16_chars
JWT_ACCESS_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

UPLOAD_DIR=uploads
UPLOAD_BASE_URL=http://localhost:3000/uploads
```

### 数据库初始化

```bash
# 1. 启动数据库服务
..\scripts\start-database.bat

# 2. 创建数据库（首次）
mysql -u root -p
CREATE DATABASE company_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. 运行迁移和种子
..\scripts\migrate-and-seed.bat
# 或
pnpm run db:migrate-and-seed
```

### 启动服务

```bash
# 开发模式（热重载）
pnpm run start:dev

# 调试模式
pnpm run start:debug

# 生产模式
pnpm run build
pnpm run start:prod
```

服务启动后访问：http://localhost:3000/api

## 数据库管理

### 迁移命令

```bash
pnpm run migration:run       # 运行所有待执行的迁移
pnpm run migration:revert    # 回滚最后一次迁移
pnpm run migration:show      # 查看迁移状态
```

### 种子命令

```bash
pnpm run seed:auth           # 运行认证种子（创建管理员和权限）
```

### 一键命令

```bash
pnpm run db:migrate-and-seed  # 迁移 + 种子
pnpm run db:reset             # 重置数据库
```

> 💡 更多数据库管理命令请查看 [docs/DATABASE_MIGRATION.md](../docs/DATABASE_MIGRATION.md)

## 架构设计

### 全局中间件

1. **ResponseInterceptor**: 自动包装响应为 `{ code: 0, message: "ok", data: T }`
2. **AllExceptionsFilter**: 统一错误处理和错误码映射
3. **ValidationPipe**: 全局启用白名单、转换和严格验证
4. **CORS**: 全局启用

### 双控制器模式

每个内容模块都有两个控制器：

- `*.controller.ts` - 管理端 API (`/api/admin/*`)，需要 JWT + 权限
- `public-*.controller.ts` - 公开 API (`/api/public/*`)，无需认证

### 认证与权限

- JWT Token：accessToken (2h) + refreshToken (7d)
- RBAC 权限模型：用户 → 角色 → 权限
- 权限格式：`module:action`（如 `news:create`）
- 超级管理员：`isSuperAdmin=1` 或 `*:*` 权限绕过所有检查

### Repository 模式

每个模块使用自定义 Repository 封装 TypeORM 查询逻辑。

## 项目结构

```
src/
├── modules/
│   ├── auth/              # 认证模块（登录、Token、权限守卫）
│   ├── admin-user/        # 管理员管理
│   ├── role/              # 角色管理
│   ├── news/              # 新闻模块
│   ├── announcement/      # 公告模块
│   ├── product/           # 产品模块
│   ├── site-content/      # 站点内容模块
│   ├── upload/            # 文件上传模块
│   └── ...
├── database/
│   ├── entities/          # TypeORM 实体定义
│   ├── migrations/        # 数据库迁移文件
│   ├── seeds/             # 种子脚本
│   ├── data-source.ts     # TypeORM 数据源配置
│   └── typeorm.config.ts  # TypeORM 配置
├── config/
│   └── app.config.ts      # 应用配置
├── common/
│   ├── interceptors/      # 响应拦截器
│   ├── filters/           # 异常过滤器
│   └── guards/            # 权限守卫
└── main.ts                # 应用入口
```

## API 模块

| 模块 | 接口前缀 | 说明 |
|------|----------|------|
| 认证授权 | `/api/auth` | 登录、登出、刷新 Token、修改密码 |
| 管理员 | `/api/admin-users` | 管理员 CRUD、状态管理、角色分配 |
| 角色 | `/api/roles` | 角色 CRUD、权限管理 |
| 新闻 | `/api/news` | 新闻 CRUD、分类管理 |
| 公告 | `/api/announcements` | 公告 CRUD |
| 产品 | `/api/products` | 产品 CRUD、分类管理 |
| 站点内容 | `/api/site-pages`, `/api/site-settings` | 静态页面和站点设置 |
| 文件上传 | `/api/upload` | 图片/文件上传 |
| 公开接口 | `/api/public/*` | 首页、关于、联系、新闻、公告、产品 |

## 开发规范

### 代码规范

- 语言: TypeScript
- 代码风格: ESLint + Prettier
- 类型检查: `pnpm run lint`

### DTO 验证注意事项

- `@IsOptional()` 只对 `null/undefined` 跳过验证
- 空字符串 `''` 会触发 `@IsEmail()` 等验证错误
- 前端发送空值时必须转为 `undefined`

### 提交规范

使用语义化提交信息：

```
feat: add news category API
fix: handle empty string in email field
docs: update API documentation
chore: update dependencies
```

## 测试

```bash
# 单元测试
pnpm run test

# E2E 测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

## 常用命令

```bash
pnpm run start            # 启动服务
pnpm run start:dev        # 开发模式（热重载）
pnpm run start:debug      # 调试模式
pnpm run start:prod       # 生产模式
pnpm run build            # 构建项目
pnpm run lint             # ESLint 检查
pnpm run format           # 格式化代码
```

## 默认账号

种子脚本执行后创建的管理员账号：

- 用户名：`admin`
- 密码：`Admin123`
- 角色：超级管理员

> ⚠️ 首次登录后请及时修改默认密码

## 相关文档

- [API 接口文档](../docs/api-overview.md)
- [数据库设计](../docs/db-design.md)
- [数据库迁移指南](../docs/DATABASE_MIGRATION.md)
- [项目主 README](../README.md)
- [完整技术架构](../CODEBUDDY.md)
