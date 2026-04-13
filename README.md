# 企业官网系统 (CompanyWeb)

现代化企业官网解决方案，包含面向公众的品牌官网、功能完备的内容管理后台和 RESTful API 服务。

## ✨ 核心特性

- 🌐 **品牌官网** - Next.js SSR 渲染，响应式设计，SEO 友好
- 📝 **内容管理** - 新闻、公告、产品、页面内容可视化编辑
- 🔐 **权限管理** - 基于 RBAC 模型的细粒度权限控制
- 🚀 **高性能** - 静态生成 + ISR 缓存，加载速度快
- 📱 **移动适配** - 全站响应式布局，支持 PC 和移动端
- 🎨 **现代 UI** - Tailwind CSS + Ant Design，界面美观易用

## 🏗️ 技术栈

| 模块 | 技术栈 | 端口 | 说明 |
|------|--------|------|------|
| **官网前端** | Next.js 16 + React 19 + Tailwind CSS 4 | 3001 | 面向公众的品牌官网 |
| **后台管理** | React 19 + Vite + Ant Design 6 | 3100 | 内容管理系统后台 |
| **后端 API** | NestJS 10 + TypeORM + MariaDB | 3000 | RESTful API 服务 |

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

# 2. 安装依赖
cd frontend && pnpm install
cd ../admin && pnpm install
cd ../server && pnpm install
```

### 配置环境变量

```bash
# 后端配置
cp server/.env.example server/.env
# 编辑 server/.env 填入数据库配置

# 前端配置（如有需要）
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

**后端关键配置：**

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=company_web
DB_USER=root
DB_PASSWORD=

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 数据库初始化

```bash
# 1. 启动数据库
scripts\start-database.bat

# 2. 创建数据库（首次）
mysql -u root -p
CREATE DATABASE company_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. 运行迁移和种子（一键完成）
scripts\migrate-and-seed.bat
```

> 💡 更多数据库管理命令请查看 [docs/DATABASE_MIGRATION.md](./docs/DATABASE_MIGRATION.md)

### 启动开发环境

**一键启动（推荐）：**

```bash
scripts\start-all.bat
```

**手动启动：**

```bash
# 终端 1: 后端服务
cd server && pnpm run start:dev

# 终端 2: 后台管理
cd admin && pnpm run dev

# 终端 3: 官网前端
cd frontend && pnpm run dev
```

### 访问地址

- 🌐 **官网前端**: http://localhost:3001
- 📊 **后台管理**: http://localhost:3100
- 🔌 **后端 API**: http://localhost:3000/api

### 默认账号

- 用户名：`admin`
- 密码：`Admin123`

> ⚠️ 首次登录后请及时修改默认密码

### 停止服务

```bash
scripts\stop-all.bat
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

## 📐 开发规范

### 代码规范

- 语言：TypeScript
- 代码风格：ESLint + Prettier
- 提交规范：使用语义化提交信息 (feat/fix/docs/chore)

### API 响应格式

**成功响应：**

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

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [数据库迁移指南](./docs/DATABASE_MIGRATION.md) | 数据库迁移、种子脚本、常见问题 |
| [API 接口文档](./docs/api-overview.md) | 所有后端 API 接口说明 |
| [数据库设计](./docs/db-design.md) | 表结构和字段定义 |
| [站点地图](./docs/site-map.md) | 官网页面路由结构 |
| [部署指南](./docs/deployment.md) | 生产环境部署文档 |
| [后台管理优化记录](./docs/admin-changelog.md) | 后台管理系统优化历史 |

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

---

**Built with ❤️ using Next.js, React, NestJS and TypeScript**
