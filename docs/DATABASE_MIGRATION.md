# 数据库迁移和种子脚本指南

本文档介绍如何使用数据库迁移和种子脚本。

## 📋 目录

- [快速开始](#快速开始)
- [命令行脚本](#命令行脚本)
- [数据库管理命令](#数据库管理命令)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 前置要求：创建数据库

在首次运行迁移之前，需要先创建数据库：

```bash
# 方式一：使用启动数据库脚本（推荐）
scripts\start-database.bat

# 方式二：手动创建数据库
# 1. 登录 MariaDB
mysql -u root -p

# 2. 创建数据库
CREATE DATABASE company_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. 退出
exit
```

### 方式一：一键脚本（推荐）

在项目根目录运行：

```bash
scripts\migrate-and-seed.bat
```

该脚本会自动：
1. 检查环境配置
2. 运行所有待执行的数据库迁移
3. 执行种子数据脚本
4. 显示默认管理员账号信息

### 方式二：pnpm 命令

在项目根目录运行：

```bash
# 运行迁移和种子
pnpm run db:migrate-and-seed

# 或者分开执行
pnpm run db:migrate    # 仅运行迁移
pnpm run db:seed       # 仅运行种子
```

---

## 💻 命令行脚本

### 根目录命令（CompanyWeb/）

| 命令 | 说明 |
|------|------|
| `pnpm run db:migrate` | 运行所有待执行的数据库迁移 |
| `pnpm run db:revert` | 回滚最后一次迁移 |
| `pnpm run db:seed` | 运行种子脚本（创建管理员账号和权限） |
| `pnpm run db:migrate-and-seed` | 运行迁移 + 种子（推荐） |
| `pnpm run db:reset` | **重置数据库**：删除所有表 → 重新迁移 → 重新种子 |

### Server 目录命令（server/）

进入 `server` 目录后可直接运行：

| 命令 | 说明 |
|------|------|
| `pnpm run migration:run` | 运行所有待执行的数据库迁移 |
| `pnpm run migration:revert` | 回滚最后一次迁移 |
| `pnpm run migration:show` | 查看所有迁移状态 |
| `pnpm run seed:auth` | 运行种子脚本 |
| `pnpm run db:migrate-and-seed` | 运行迁移 + 种子 |
| `pnpm run db:reset` | 重置整个数据库 |

---

## 🛠️ 数据库管理命令

### 查看迁移状态

```bash
cd server
pnpm run migration:show
```

输出示例：
```
Migration Table: migrations
Migration Name          | Status
----------------------------------------
InitAuthRbac1712600000000      | Y
AddNewsTables1712603600000     | Y
AddAnnouncementsTable1712607200000 | N
...
```

- `Y` = 已执行
- `N` = 未执行

### 生成新迁移

当你修改了实体类后，可以自动生成迁移文件：

```bash
cd server
pnpm run migration:generate -- src/database/migrations/YourMigrationName
```

**注意**：生成的迁移文件需要手动检查并注册到 `data-source.ts` 中。

### 手动创建迁移

在 `server/src/database/migrations/` 目录下创建新的 TypeScript 文件，参考现有迁移文件的结构。

---

## ❓ 常见问题

### Q1: 迁移失败怎么办？

1. 检查数据库连接配置（`server/.env`）
2. 确保数据库服务已启动：`scripts\start-database.bat`
3. 查看详细错误信息：查看迁移日志或开启 SQL 日志（`DB_LOGGING=true`）

### Q2: 如何完全重置数据库？

```bash
# 方式一：使用一键重置命令
pnpm run db:reset

# 方式二：手动删除并重建
# 1. 登录 MariaDB
mysql -u root -p

# 2. 删除并重建数据库
DROP DATABASE company_web;
CREATE DATABASE company_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. 运行迁移和种子
pnpm run db:migrate-and-seed
```

### Q3: 种子脚本执行失败？

种子脚本会检查数据是否已存在，如果管理员账号已存在可能会报错。解决方法：

```bash
# 先回滚迁移，再重新执行
pnpm run db:reset
```

### Q4: 如何查看执行的 SQL？

在 `server/.env` 中设置：

```env
DB_LOGGING=true
```

重启服务后，所有 SQL 语句都会输出到控制台。

### Q5: 迁移文件没有按顺序执行？

TypeORM 按迁移文件名中的时间戳排序。确保新迁移的时间戳**大于**所有已有迁移。

---

## 📁 相关文件

| 文件 | 说明 |
|------|------|
| `scripts/migrate-and-seed.bat` | 一键迁移和种子脚本 |
| `server/src/database/data-source.ts` | TypeORM 数据源配置 |
| `server/src/database/run-migrations.ts` | 迁移执行脚本 |
| `server/src/database/seeds/auth.seed.ts` | 认证种子脚本 |
| `server/src/database/migrations/` | 所有迁移文件目录 |

---

## 🔐 默认账号

执行种子脚本后，可以使用以下账号登录后台：

- **用户名**: `admin`
- **密码**: `Admin123`
- **角色**: 超级管理员（拥有所有权限）

---

## 📝 迁移文件清单

| 迁移文件 | 说明 |
|---------|------|
| `1712600000000-init-auth-rbac.ts` | 初始化认证和 RBAC 表 |
| `1712603600000-add-news-tables.ts` | 新闻相关表 |
| `1712607200000-add-announcements-table.ts` | 公告表 |
| `1712610800000-add-site-content-table.ts` | 站点内容表 |
| `1712614400000-add-product-tables.ts` | 产品相关表 |
| `1712620000000-add-media-files-table.ts` | 媒体文件表 |

---

**最后更新**: 2026-04-13
