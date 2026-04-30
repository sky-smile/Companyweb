# 部署指南

本文档介绍企业官网系统的生产环境部署流程。

## 📋 目录

- [目标技术栈](#目标技术栈)
- [部署单元](#部署单元)
- [环境变量配置](#环境变量配置)
- [部署流程](#部署流程)
- [Nginx 配置](#nginx-配置)
- [PM2 进程管理](#pm2-进程管理)
- [SSL 证书配置](#ssl-证书配置)
- [数据库备份策略](#数据库备份策略)
- [初始检查清单](#初始检查清单)

---

## 目标技术栈

- **Web 服务器**: Nginx
- **进程管理**: PM2
- **数据库**: MariaDB
- **运行环境**: Node.js 20 LTS

---

## 部署单元

本项目包含三个独立的部署单元：

| 项目 | 说明 | 部署方式 |
|------|------|----------|
| **frontend** | Next.js 官网前端 | Node.js 服务器运行 |
| **admin** | React 管理后台 | 静态文件（Nginx 托管） |
| **server** | NestJS API 服务 | Node.js 服务器运行 |

---

## 环境变量配置

### 官网前端 (frontend/.env)

```env
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 后台管理 (admin/.env)

```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_APP_TITLE=企业管理后台
```

### 后端服务 (server/.env)

```env
SERVER_PORT=4000
SERVER_GLOBAL_PREFIX=api

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=company_web
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

JWT_ACCESS_SECRET=your_access_secret_at_least_16_chars
JWT_REFRESH_SECRET=your_refresh_secret_at_least_16_chars
JWT_ACCESS_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

UPLOAD_DIR=/path/to/your/app/uploads
UPLOAD_BASE_URL=https://your-domain.com/uploads
```

> ⚠️ **安全提示**: 生产环境请使用强密码和独立的 JWT 密钥。

---

## 部署流程

### 1. 准备服务器环境

```bash
# 安装 Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2
npm install -g pm2

# 安装 Nginx
sudo apt-get install -y nginx

# 安装 MariaDB
sudo apt-get install -y mariadb-server
```

### 2. 配置数据库

```bash
# 启动 MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# 安全初始化
sudo mysql_secure_installation

# 创建数据库和用户
mysql -u root -p << EOF
CREATE DATABASE company_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'web_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON company_web.* TO 'web_user'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### 3. 构建项目

```bash
# 克隆项目代码
git clone <repository-url> /path/to/your/app
cd /path/to/your/app

# 安装依赖
cd frontend && pnpm install && cd ..
cd admin && pnpm install && cd ..
cd server && pnpm install && cd ..

# 构建后端服务
cd server
pnpm run build
cd ..

# 构建后台管理（静态文件）
cd admin
pnpm run build
cd ..

# 构建官网前端
cd frontend
pnpm run build
cd ..
```

### 4. 运行数据库迁移和种子

```bash
# 方式一：使用一键脚本
scripts/migrate-and-seed.sh  # 如果有 Linux 版本脚本

# 方式二：手动执行
cd server
pnpm run db:migrate-and-seed
```

### 5. 启动服务

参考下方的 [PM2 进程管理](#pm2-进程管理) 部分。

### 6. 配置 Nginx

参考下方的 [Nginx 配置](#nginx-配置) 部分。

### 7. 验证部署

- ✅ 访问官网首页: https://your-domain.com
- ✅ 访问管理后台: https://your-domain.com/admin
- ✅ 测试 API 健康检查: https://your-domain.com/api/health
- ✅ 测试管理员登录
- ✅ 测试文件上传功能

---

## Nginx 配置

### 基础配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 官网前端 (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 后台管理 (静态文件)
    location /admin {
        alias /path/to/your/app/admin/dist;
        try_files $uri $uri/ /admin/index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 后端 API
    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 文件上传大小限制（10MB）
        client_max_body_size 10M;
    }

    # 上传文件目录
    location /uploads {
        alias /path/to/your/app/server/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 日志
    access_log /var/log/nginx/companyweb-access.log;
    error_log /var/log/nginx/companyweb-error.log;
}
```

### 路由说明

| 路径 | 目标 | 说明 |
|------|------|------|
| `/` | 官网前端 (3001) | Next.js SSR 渲染 |
| `/admin` | 管理后台静态文件 | 构建后的静态资源 |
| `/api` | 后端 API (4000) | NestJS 服务 |
| `/uploads` | 上传文件目录 | 媒体资源 |

---

## PM2 进程管理

### 创建 PM2 配置文件

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'companyweb-server',
      cwd: '/path/to/your/app/server',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/server-error.log',
      out_file: '/var/log/pm2/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'companyweb-frontend',
      cwd: '/path/to/your/app/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/frontend-error.log',
      out_file: '/var/log/pm2/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

### 启动和管理服务

```bash
# 启动所有服务
pm2 start ecosystem.config.js

# 查看服务状态
pm2 status

# 查看日志
pm2 logs companyweb-server
pm2 logs companyweb-frontend

# 重启服务
pm2 restart companyweb-server
pm2 restart companyweb-frontend

# 停止服务
pm2 stop all

# 设置开机自启动
pm2 startup
pm2 save
```

---

## SSL 证书配置

### 使用 Let's Encrypt (推荐)

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

### 手动配置证书

如果已有证书文件，直接配置到 Nginx：

```nginx
ssl_certificate /path/to/fullchain.pem;
ssl_certificate_key /path/to/privkey.pem;
```

> 💡 **提示**: 建议配置自动续期，Let's Encrypt 证书有效期为 90 天。

---

## 数据库备份策略

### 创建备份脚本

创建 `/usr/local/bin/backup-companyweb-db.sh`：

```bash
#!/bin/bash

# 配置
DB_NAME="company_web"
DB_USER="web_user"
DB_PASS="your_secure_password"
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_FILE

# 保留最近 30 天的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "备份完成: $BACKUP_FILE"
```

### 设置定时任务

```bash
# 添加权限
chmod +x /usr/local/bin/backup-companyweb-db.sh

# 编辑 crontab
crontab -e

# 添加每日凌晨 2 点备份
0 2 * * * /usr/local/bin/backup-companyweb-db.sh >> /var/log/db-backup.log 2>&1
```

### 恢复数据库

```bash
# 解压备份文件
gunzip company_web_20260413_020000.sql.gz

# 恢复数据库
mysql -u web_user -p company_web < company_web_20260413_020000.sql
```

---

## 初始检查清单

在正式上线前，请确认以下项目：

- [ ] 环境变量已配置（使用生产值）
- [ ] 数据库已迁移并初始化
- [ ] 超级管理员账号已创建
- [ ] 上传目录有写入权限
- [ ] HTTPS 已配置
- [ ] Nginx 反向代理已配置
- [ ] PM2 进程管理已设置
- [ ] 日志轮转已配置（Nginx + PM2）
- [ ] 数据库自动备份已设置
- [ ] 文件上传大小限制已配置
- [ ] 安全头已添加（X-Frame-Options 等）
- [ ] 监控和告警已设置（可选）

---

## 常见问题

### Q1: 文件上传失败？

检查：
- 上传目录权限：`chmod 755 /path/to/your/app/server/uploads`
- Nginx 配置：`client_max_body_size 10M;`
- 后端配置：`UPLOAD_DIR` 路径正确

### Q2: 管理后台刷新 404？

Nginx 配置中确保：
```nginx
try_files $uri $uri/ /admin/index.html;
```

### Q3: API 跨域错误？

确保后端 `.env` 中配置了正确的 CORS 设置，或通过 Nginx 统一处理跨域。

### Q4: 如何查看服务日志？

```bash
# PM2 日志
pm2 logs companyweb-server
pm2 logs companyweb-frontend

# Nginx 日志
tail -f /var/log/nginx/companyweb-access.log
tail -f /var/log/nginx/companyweb-error.log
```

---

**最后更新**: 2026-04-13  
**版本**: v2.0.0
