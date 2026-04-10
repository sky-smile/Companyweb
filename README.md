# 企业官网系统 (CompanyWeb)

现代化企业官网解决方案，包含面向公众的品牌官网、功能完备的内容管理后台和 RESTful API 服务。

## ✨ 项目简介

本项目是一个完整的企业官网系统，旨在帮助企业快速搭建对外展示平台。系统采用前后端分离架构，支持内容动态管理，满足企业品牌展示、产品推广、新闻发布等核心业务需求。

### 核心特性

- 🌐 **品牌官网** - 响应式设计，支持首页、关于我们、产品中心、新闻公告、联系我们等核心页面
- 📝 **内容管理** - 功能强大的后台管理系统，支持新闻、公告、产品、页面内容可视化编辑
- 🔐 **权限管理** - 基于 RBAC 模型的细粒度权限控制，保障系统安全
- 🚀 **高性能** - Next.js SSR 渲染，SEO 友好，加载速度快
- 📱 **移动适配** - 全站响应式布局，完美支持 PC 和移动端访问
- 🎨 **现代 UI** - Tailwind CSS + Ant Design，界面美观易用

## 🏗️ 技术架构

### 技术栈

| 模块 | 技术栈 | 端口 | 说明 |
|------|--------|------|------|
| **官网前端** | Next.js 16 + React 19 + Tailwind CSS 4 | 3001 | 面向公众的品牌官网 |
| **后台管理** | React 19 + TypeScript + Ant Design 6 | 3100 | 内容管理系统后台 |
| **后端 API** | NestJS 10 + TypeORM + MariaDB | 3000 | RESTful API 服务 |

### 项目结构

```text
CompanyWeb/
├── frontend/           # 官网前端 (Next.js)
│   ├── src/
│   │   ├── app/       # 页面路由 (首页、关于、产品、新闻等)
│   │   ├── components/# 公共组件 (Header、Footer、Banner等)
│   │   ├── services/  # API 服务层
│   │   ├── lib/       # 工具库 (SEO、请求封装等)
│   │   └── types/     # TypeScript 类型定义
│   └── ...
├── admin/             # 后台管理 (React + Vite)
│   ├── src/
│   │   ├── pages/     # 页面组件 (登录、仪表盘、CRUD页面)
│   │   ├── components/# UI 组件
│   │   ├── services/  # API 服务层
│   │   ├── stores/    # 状态管理
│   │   └── router/    # 路由配置
│   └── ...
├── server/            # 后端服务 (NestJS)
│   └── src/
│       ├── modules/   # 业务模块
│       │   ├── auth/           # 认证授权
│       │   ├── admin-user/     # 管理员管理
│       │   ├── role/           # 角色管理
│       │   ├── news/           # 新闻模块
│       │   ├── announcement/   # 公告模块
│       │   ├── product/        # 产品模块
│       │   ├── site-content/   # 站点内容
│       │   └── upload/         # 文件上传
│       └── database/  # 数据库配置和迁移
├── scripts/           # 便捷启动脚本
├── docs/              # 项目文档
│   ├── api-overview.md       # API 接口文档
│   ├── db-design.md          # 数据库设计
│   ├── requirements-phase1.md # 需求文档
│   ├── site-map.md           # 站点地图
│   ├── deployment.md         # 部署文档
│   └── dev-progress.md       # 开发进度
└── README.md          # 本文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20 LTS
- pnpm (推荐包管理器)
- MariaDB / MySQL

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd CompanyWeb

# 2. 安装依赖 (各项目目录)
cd frontend && pnpm install
cd ../admin && pnpm install
cd ../server && pnpm install
```

### 配置环境变量

每个子项目都提供了 `.env.example` 配置文件，复制并根据实际情况修改：

```bash
# 后端配置
cp server/.env.example server/.env
# 编辑 server/.env 填入数据库配置

# 前端配置 (如有需要)
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

**后端环境变量关键配置：**

```env
# 数据库配置
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=company_web
DB_USER=root
DB_PASSWORD=your_password

# JWT 配置
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 数据库初始化

```bash
# 1. 启动 MariaDB 数据库
scripts\start-database.bat

# 2. 运行数据库迁移 (server 目录)
cd server
pnpm run migration:run

# 3. 导入初始数据 (可选)
mysql -u root -p company_web < seed-demo-data.sql
```

### 启动开发环境

#### 方式一：一键启动（推荐）

```bash
# Windows 系统使用批处理脚本
scripts\start-all.bat

# 该脚本会自动：
# 1. 启动 MariaDB 数据库
# 2. 启动后端 API 服务 (端口 3000)
# 3. 启动后台管理系统 (端口 3100)
# 4. 启动官网前端 (端口 3001)
```

#### 方式二：手动启动

在不同终端分别启动各个服务：

```bash
# 终端 1: 启动数据库
scripts\start-database.bat

# 终端 2: 启动后端服务
cd server && pnpm run start:dev

# 终端 3: 启动后台管理
cd admin && pnpm run dev

# 终端 4: 启动官网前端
cd frontend && pnpm run dev
```

### 访问地址

服务启动成功后，可通过以下地址访问：

- 🌐 **官网前端**: http://localhost:3001
- 📊 **后台管理**: http://localhost:3100
- 🔌 **API 文档**: http://localhost:3000/api

### 默认账号

后台管理系统默认登录信息：

- 用户名：`admin`
- 密码：`Admin1234567`

> ⚠️ 首次登录后请及时修改默认密码

### 停止服务

```bash
# 停止所有服务
scripts\stop-all.bat

# 或手动停止数据库
taskkill /F /IM mysqld.exe
```

## 📖 功能模块

### 官网前端

| 页面 | 路由 | 功能说明 |
|------|------|----------|
| 首页 | `/` | Hero Banner、公司简介、产品推荐、最新新闻公告 |
| 关于我们 | `/about` | 企业介绍、发展历程、企业文化 |
| 产品中心 | `/products` | 产品分类列表、筛选、分页 |
| 产品详情 | `/products/:id` | 产品详细信息、参数规格、图片展示 |
| 新闻中心 | `/news` | 新闻列表、分类筛选、分页浏览 |
| 新闻详情 | `/news/:id` | 新闻正文、发布时间、相关内容推荐 |
| 公告中心 | `/announcements` | 公告列表、置顶公告、分页浏览 |
| 公告详情 | `/announcements/:id` | 公告详细内容 |
| 联系我们 | `/contact` | 联系方式、公司地址、地图嵌入 |

### 后台管理

| 模块 | 功能说明 |
|------|----------|
| 仪表盘 | 数据统计、快捷入口、最近发布内容概览 |
| 账号管理 | 管理员列表、新增/编辑/禁用、密码重置、角色分配 |
| 角色管理 | 角色列表、权限配置、角色分配 |
| 新闻管理 | 完整 CRUD、分类管理、草稿/发布状态、置顶设置、富文本编辑 |
| 公告管理 | 完整 CRUD、发布状态切换、置顶设置 |
| 产品管理 | 完整 CRUD、分类管理、上下架状态、图片上传 |
| 站点内容 | 首页 Banner、关于我们、联系我们、企业优势等静态内容管理 |
| 媒体中心 | 图片上传、文件管理、链接复制与回填 |

### 后端 API

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

## 📐 开发规范

### 代码规范

- 语言：TypeScript
- 代码风格：ESLint + Prettier
- 提交规范：使用语义化提交信息

### 分支管理

```
main              # 主分支 (生产环境)
├── feature/xxx   # 功能分支
├── fix/xxx       # 修复分支
├── chore/xxx     # 维护分支
└── docs/xxx      # 文档分支
```

### API 响应格式

**成功响应：**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    // 业务数据
  }
}
```

**失败响应：**

```json
{
  "code": 10001,
  "message": "Validation failed",
  "data": null,
  "requestId": "trace-id"
}
```

### 错误码规范

| 范围 | 说明 |
|------|------|
| `0` | 成功 |
| `10000-10999` | 通用请求和验证错误 |
| `11000-11999` | 认证和授权错误 |
| `12000-12999` | 管理员和 RBAC 错误 |
| `13000-13999` | 内容管理错误 |
| `14000-14999` | 上传和媒体错误 |
| `15000-15999` | 系统和第三方依赖错误 |

## 📋 开发进度

### ✅ 一期已完成

- [x] 后端 API 服务 (认证、权限、内容管理、文件上传)
- [x] 后台管理系统 (登录、账号管理、内容 CRUD、媒体中心)
- [x] 官网前端 (首页、关于、产品、新闻、公告、联系)
- [x] 数据库设计与迁移
- [x] 开发环境脚本

### 📝 二期规划

- [ ] 下载中心
- [ ] 多语言支持 (中英文)
- [ ] SEO 增强 (sitemap, robots.txt, 结构化数据)
- [ ] 图片压缩与 CDN 集成
- [ ] 内容审核流程
- [ ] 操作日志与审计

详细规划请查看 [AGENTS.md](./AGENTS.md) 和 [docs/requirements-phase1.md](./docs/requirements-phase1.md)

## 🚢 部署指南

生产环境部署请参考 [docs/deployment.md](./docs/deployment.md)，包含：

- Nginx 配置
- PM2 进程管理
- 数据库备份策略
- SSL 证书配置
- CDN 集成

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目采用 [LICENSE](./LICENSE) 协议。

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 查看文档: [docs/](./docs/)
- 查看开发进度: [docs/dev-progress.md](./docs/dev-progress.md)

---

**Built with ❤️ using Next.js, React, NestJS and TypeScript**
