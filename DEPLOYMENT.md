# CompanyWeb 生产环境部署文档

## 项目概述

CompanyWeb 是一个基于 NestJS + React + Next.js 的全栈企业网站系统，使用 Docker Compose 进行容器化部署。

**技术栈：**
- 后端：NestJS (4000端口) + TypeORM + MariaDB 11.4
- 管理后台：React + Vite (构建后由 Nginx 代理到 `/admin/`)
- 前端：Next.js (3001端口，SSR)
- 反向代理：Nginx 1.27-alpine (宿主机 80/443端口)

---

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- WSL / Linux / macOS

---

## 目录结构

```
Companyweb/
├── server/              # NestJS 后端
├── admin/               # React 管理后台
├── frontend/            # Next.js 前端
├── docker/
│   └── nginx/
│       └── docker-compose.conf  # Nginx 配置
├── docker-compose.yml   # 编排文件
├── .env                 # 环境变量（不提交到版本库）
└── DEPLOYMENT.md        # 本文档
```

---

## 配置文件说明

### 1. 环境变量 (.env)

复制 `.env.example` 或创建 `.env` 文件：

```bash
# 数据库配置
DB_ROOT_PASSWORD=[REDACTED]
DB_DATABASE=company_web

# JWT 配置
JWT_ACCESS_SECRET=[REDACTED]
JWT_ACCESS_EXPIRES_IN=2h
JWT_REFRESH_SECRET=[REDACTED]
JWT_REFRESH_EXPIRES_IN=7d

# 应用配置
APP_URL=http://localhost
CORS_ORIGINS=http://localhost

# 管理员账号（首次启动自动创建）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=[REDACTED]
ADMIN_EMAIL=admin@example.com
```

**⚠️ 安全提示：**
- 生产环境请使用强密码替换 `[REDACTED]` 占位符
- `.env` 文件不应提交到版本控制系统
- 定期轮换 JWT 密钥

### 2. Docker Compose 服务

| 服务名 | 镜像 | 容器内端口 | 宿主机端口 | 说明 |
|--------|------|-----------|-----------|------|
| mariadb | mariadb:11.4 | 3306 | 无映射 | 数据库，仅容器网络可访问 |
| server | 本地构建 | 4000 | 无映射 | NestJS API 服务 |
| admin | 本地构建 | 80/3000 | 无映射 | React 管理后台 |
| frontend | 本地构建 | 3001 | 无映射 | Next.js 前端 |
| nginx | nginx:1.27-alpine | 80/443 | 80/443 | 反向代理入口 |

---

## 部署步骤

### 第一步：准备环境

```bash
cd /home/sky/GitHub/Companyweb

# 确认 Docker 正常运行
docker --version
docker compose version
```

### 第二步：配置环境变量

```bash
# 创建 .env 文件（如果不存在）
cat > .env << 'EOF'
DB_ROOT_PASSWORD=[REDACTED]
DB_DATABASE=company_web

JWT_ACCESS_SECRET=[REDACTED]
JWT_ACCESS_EXPIRES_IN=2h
JWT_REFRESH_SECRET=[REDACTED]
JWT_REFRESH_EXPIRES_IN=7d

APP_URL=http://localhost
CORS_ORIGINS=http://localhost

ADMIN_USERNAME=admin
ADMIN_PASSWORD=[REDACTED]
ADMIN_EMAIL=admin@example.com
EOF
```

### 第三步：构建并启动服务

```bash
# 构建所有镜像并后台启动
docker compose up -d

# 查看启动日志
docker compose logs -f

# 等待所有服务就绪（约 1-2 分钟）
```

### 第四步：验证部署

```bash
# 1. 检查服务状态
docker compose ps

# 2. 测试 API 健康状态
curl http://localhost/api/health
# 预期输出：{"code":0,"message":"ok","data":{"status":"ok","database":"ok"}}

# 3. 测试前端访问
curl -I http://localhost/
# 预期：HTTP/1.1 200 OK

# 4. 测试管理后台
curl -I http://localhost/admin/login
# 预期：HTTP/1.1 200 OK
```

### 第五步：初始化管理员账号

服务首次启动时会自动：
- 创建数据库表结构（仅首次）
- 创建 Super Admin 角色并分配所有权限
- 创建管理员账号（如果不存在）

验证管理员账号：

```bash
# 登录获取 token
TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# 测试获取用户信息
curl -s http://localhost/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  | grep username
# 预期输出包含："username":"admin"
```

---

## Nginx 路由规则

| 访问路径 | 转发目标 | 说明 |
|----------|----------|------|
| `/` | frontend:3001 | Next.js 前端（SSR） |
| `/api/*` | server:4000 | NestJS API 接口 |
| `/admin/*` | admin:80 | React 管理后台 |
| `/admin/assets/*` | admin:80 (去除 `/admin` 前缀) | 后台静态资源 |
| `/assets/*` | admin:80 | 兼容旧路径的静态资源 |

---

## 已修复问题记录

### 1. Admin 静态资源路径错误

**问题：** 访问 `/admin/` 时 CSS/JS 返回 `text/html` 而非正确 MIME 类型

**原因：** Vite 未配置 base path，Nginx 未正确匹配 `/admin/assets/` 路径

**修复：**
- `admin/vite.config.ts`：添加 `base: '/admin/'`
- `docker/nginx/docker-compose.conf`：添加 `/admin/assets/` 路由规则

### 2. 路由跳转异常

**问题：** 登录失效或密码修改后跳转到 `/login` 显示前端错误页

**原因：** 前端跳转路径硬编码为 `/login`，未考虑 admin 部署在 `/admin/` 路径下

**修复：**
- `admin/src/services/http.ts`：401 跳转改为 `/admin/login`
- `admin/src/pages/SettingsPage.tsx`：修改密码后跳转改为 `/admin/login`

### 3. 请求限流 429 错误

**问题：** Profile 请求频繁导致 429 Too Many Requests

**原因：** `AppBootstrap.tsx` 的 useEffect 依赖 `location.pathname`，每次路由变化都重复请求

**修复：**
- 仅在组件挂载时请求一次 profile
- 已加载 profile 则不重复请求
- 适配 `/admin/login` 路径判断

### 4. 前端 API 地址配置错误

**问题：** Next.js SSR 时请求 `http://127.0.0.1:3000/api` 导致 `ERR_CONNECTION_REFUSED`

**原因：** 服务端渲染无法使用相对路径 `/api`，需要容器内部地址

**修复：**
- `frontend/src/lib/api.ts`：区分服务端（`http://server:4000/api`）和客户端（`/api`）地址
- `frontend/Dockerfile`：添加构建参数 `NEXT_PUBLIC_API_BASE_URL` 和 `NEXT_PUBLIC_SITE_URL`
- `docker-compose.yml`：注入 `API_BASE_URL_SERVER=http://server:4000/api`

### 5. Admin 构建时 API 地址缺失

**问题：** Admin 打包时未注入 API 地址，导致请求失败

**修复：**
- `admin/Dockerfile`：添加 `ARG VITE_API_BASE_URL` 和 `ENV VITE_API_BASE_URL`
- `docker-compose.yml`：admin 服务添加 build arg `VITE_API_BASE_URL: ${APP_URL:-http://localhost}/api`

---

## 生产环境配置清理

以下配置已针对生产环境优化：

| 配置项 | 开发环境 | 生产环境 | 说明 |
|--------|----------|----------|------|
| DB_SYNCHRONIZE | true | **false** | 关闭自动建表，避免意外修改表结构 |
| 数据库端口映射 | 3306:3306 | **已移除** | 数据库不再暴露到宿主机 |
| CORS_ORIGINS | 包含 localhost:3000/3001/4000/4100 | **http://localhost** | 清理开发环境地址 |

---

## 常用运维命令

```bash
# 查看所有服务状态
docker compose ps

# 查看服务日志
docker compose logs -f [service_name]  # 可选：server/admin/frontend/nginx/mariadb

# 重启单个服务
docker compose restart server

# 重新构建并启动
docker compose up -d --build

# 停止所有服务
docker compose down

# 停止并删除数据卷（慎用，会清空数据库）
docker compose down -v

# 进入容器调试
docker compose exec server sh
docker compose exec mariadb mysql -u root -p
```

---

## 数据库初始化数据

首次启动自动插入的测试数据：

- **权限：** 40 个系统权限
- **角色：** Super Admin（拥有所有权限）
- **管理员：** admin（关联 Super Admin 角色）
- **新闻分类：** 5 条示例分类
- **新闻：** 5 条示例新闻
- **产品分类：** 5 条示例分类
- **产品：** 6 条示例产品
- **公告：** 3 条示例公告

---

## 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端网站 | http://localhost/ | Next.js 前端首页 |
| 管理后台 | http://localhost/admin/login | React 管理后台 |
| API 文档 | http://localhost/api/docs | Swagger API 文档（如果启用） |

**默认管理员账号：**
- 用户名：`admin`
- 密码：`Admin123`（首次登录后请立即修改）

---

## 故障排查

### API 返回 502 Bad Gateway

```bash
# 检查 server 服务是否正常运行
docker compose ps server

# 查看 server 日志
docker compose logs server

# 检查数据库连接
docker compose exec server sh -c "nc -zv mariadb 3306"
```

### 前端页面空白或报错

```bash
# 检查 frontend 服务日志
docker compose logs frontend

# 确认 Nginx 配置正确
docker compose exec nginx nginx -t

# 重新加载 Nginx 配置
docker compose exec nginx nginx -s reload
```

### 数据库连接失败

```bash
# 检查 MariaDB 是否健康
docker compose ps mariadb

# 查看 MariaDB 日志
docker compose logs mariadb

# 手动连接测试
docker compose exec mariadb mysql -u root -p${DB_ROOT_PASSWORD} ${DB_DATABASE}
```

---

## 安全建议

1. **修改默认密码：** 首次部署后立即修改 admin 密码和数据库密码
2. **启用 HTTPS：** 生产环境应配置 SSL 证书（可放在 `docker/nginx/ssl/` 目录）
3. **定期备份：** 设置数据库定时备份
   ```bash
   # 示例备份命令
   docker compose exec mariadb mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_DATABASE} > backup_$(date +%Y%m%d).sql
   ```
4. **限制访问：** 生产环境 CORS_ORIGINS 应设置为实际域名，而非 `http://localhost`
5. **监控日志：** 定期检查服务日志，关注异常访问和错误

---

## 更新部署

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker compose up -d --build

# 3. 验证更新
curl http://localhost/api/health
```

---

**文档生成时间：** 2026-05-08  
**项目路径：** /home/sky/GitHub/Companyweb  
**维护者：** CompanyWeb Team
