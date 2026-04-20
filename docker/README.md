# =============================================
# Docker 部署说明
# =============================================

## 快速开始

### 1. 准备环境

确保已安装：
- Docker Engine 24.0+
- Docker Compose Plugin 2.20+

### 2. 配置环境变量

```bash
# 复制环境变量配置
cp .env.secrets .env

# 编辑生产密钥（必须修改！）
nano .env
```

**重要**：在生产环境中必须修改以下密钥：
- `DB_ROOT_PASSWORD` - 数据库 root 密码
- `JWT_ACCESS_SECRET` - JWT 访问密钥（至少 16 字符）
- `JWT_REFRESH_SECRET` - JWT 刷新密钥（至少 16 字符）

### 3. SSL 证书（可选，用于 HTTPS）

```bash
# 创建 SSL 目录
mkdir -p docker/nginx/ssl

# 使用 Let's Encrypt（推荐）
certbot certonly --nginx -d yourdomain.com

# 或使用自签名证书（仅用于测试）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/nginx/ssl/key.pem \
  -out docker/nginx/ssl/cert.pem
```

### 4. 构建和启动

```bash
# 构建镜像
docker compose build

# 启动服务
docker compose up -d

# 查看日志
docker compose logs -f

# 查看服务状态
docker compose ps
```

### 5. 初始化数据库

```bash
# 进入 server 容器
docker compose exec server sh

# 运行迁移
npx prisma migrate deploy

# 运行种子（可选）
npx prisma db seed

# 退出
exit
```

## 服务访问

| 服务 | 地址 | 说明 |
|------|------|------|
| 官网 | http://localhost | 通过 Nginx 访问 |
| 管理后台 | http://localhost/admin | 通过 Nginx 访问 |
| API | http://localhost/api | 通过 Nginx 访问 |
| 直接访问 admin | http://localhost:3100 | 仅开发模式 |
| 直接访问 frontend | http://localhost:3001 | 仅开发模式 |

## 常用命令

```bash
# 停止服务
docker compose down

# 停止并删除数据卷（慎用！）
docker compose down -v

# 重启服务
docker compose restart

# 重新构建（代码更新后）
docker compose up -d --build

# 进入容器调试
docker compose exec server sh
docker compose exec admin sh
docker compose exec frontend sh

# 查看资源使用
docker stats

# 清理未使用的镜像和卷
docker system prune -f
```

## 数据持久化

以下数据存储在 Docker 卷中：
- `mariadb_data` - 数据库文件
- `server_uploads` - 上传的文件
- `nginx_logs` - Nginx 日志

## 健康检查

所有服务都配置了健康检查：
- MariaDB: 检查数据库连接
- Server: 检查 `/api/health` 端点
- Frontend: 检查 HTTP 端口
- Admin: 检查 HTTP 端口

```bash
# 检查健康状态
docker compose ps
```

## 日志管理

```bash
# 查看所有日志
docker compose logs

# 查看特定服务日志
docker compose logs server
docker compose logs admin
docker compose logs frontend

# 实时跟踪日志
docker compose logs -f

# 查看最近 100 行
docker compose logs --tail=100
```

## 性能优化

1. **增加 Docker 资源限制**：在 Docker Desktop/Engine 设置中分配更多 CPU 和内存

2. **MariaDB 调优**：编辑 `docker/mariadb/my.cnf`

3. **Nginx 缓存**：可添加静态资源缓存配置

## 安全建议

1. 修改所有默认密码和密钥
2. 配置防火墙规则
3. 使用 HTTPS（配置 SSL 证书）
4. 定期更新 Docker 镜像
5. 启用日志审计
6. 设置备份策略

## 备份与恢复

### 备份数据库

```bash
docker compose exec mariadb mysqldump -u root -p company_web > backup_$(date +%Y%m%d).sql
```

### 恢复数据库

```bash
docker compose exec -T mariadb mysql -u root -p company_web < backup_20240101.sql
```

## 故障排除

### 服务启动失败

```bash
# 查看详细日志
docker compose logs <service_name>

# 检查配置
docker compose config
```

### 数据库连接问题

```bash
# 检查 MariaDB 状态
docker compose exec mariadb mysql -u root -p -e "SHOW DATABASES;"

# 检查连接日志
docker compose logs mariadb
```

### 权限问题

```bash
# 修复上传目录权限
docker compose exec server chown -R nodejs:nodejs /app/uploads
```
