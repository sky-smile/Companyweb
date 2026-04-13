# AGENTS.md - 项目规划与 Agent 指引

> 本文档提供项目的整体规划、二期功能和开发指引，供 AI 助手和开发者参考。

## 📋 目录

- [项目概述](#项目概述)
- [一期完成情况](#一期完成情况)
- [二期规划](#二期规划)
- [开发指引](#开发指引)
- [文档结构](#文档结构)

---

## 项目概述

**CompanyWeb** 是一个现代化企业官网系统，包含：

- 🌐 **官网前端** (Next.js 16) - 面向公众的品牌官网
- 📊 **后台管理** (React 19 + Ant Design 6) - 内容管理后台
- 🔌 **后端 API** (NestJS 10 + TypeORM) - RESTful API 服务

**技术栈**: TypeScript + Next.js + React + NestJS + MariaDB

**详细文档**:
- [项目主 README](./README.md) - 快速入门指南
- [CODEBUDDY.md](./CODEBUDDY.md) - 完整技术架构手册
- [QWEN.md](./QWEN.md) - AI 助手上下文

---

## 一期完成情况

### ✅ 已完成功能

**后端 API**:
- 认证授权 (JWT + RBAC)
- 管理员和角色管理
- 新闻、公告、产品 CRUD
- 站点内容和 Banner 管理
- 文件上传
- 所有公开 API

**后台管理**:
- 登录和权限管理
- 账号和角色管理
- 新闻、公告、产品管理（搜索/分页/富文本）
- 站点内容和媒体中心
- 仪表盘和数据统计
- 响应式布局（侧边栏分组/可折叠）

**官网前端**:
- 首页、关于、联系
- 产品中心（列表/详情/筛选）
- 新闻中心（列表/详情/分类）
- 公告中心（列表/详情/置顶）
- SSR 渲染和 SEO 优化
- 响应式布局

**基础设施**:
- 数据库设计和迁移
- 开发环境脚本
- 完整文档

> 详细查看：[docs/dev-progress.md](./docs/dev-progress.md)

---

## 二期规划

### 高优先级

#### 1. 下载中心

**需求**:
- 文件下载列表（产品手册、技术文档、白皮书等）
- 分类管理（文档类型、产品线）
- 文件大小和下载计数
- 支持 PDF 在线预览

**API 设计**:
- `/api/public/downloads` - 公开下载列表
- `/api/admin/downloads` - 管理端 CRUD

#### 2. SEO 增强

**需求**:
- 自动生成 sitemap.xml（已实现基础功能）
- robots.txt 配置（已实现）
- JSON-LD 结构化数据（已实现基础）
- 页面加载速度优化
- 图片懒加载
- 关键渲染路径优化

#### 3. 图片压缩与 CDN 集成

**需求**:
- 上传图片自动压缩（tinypng API 或 sharp）
- 生成多种尺寸缩略图
- CDN 域名替换
- WebP 格式自动转换

**技术方案**:
- 使用 `sharp` 库进行图片处理
- 集成阿里云/腾讯云 CDN
- 更新 `UPLOAD_BASE_URL` 为 CDN 域名

### 中优先级

#### 4. 多语言支持 (中英文)

**需求**:
- 后台支持多语言内容录入
- 前端根据浏览器语言自动切换
- URL 语言前缀 (`/en/`, `/zh/`)
- 数据库表增加语言字段

**技术方案**:
- 使用 `next-intl` (Next.js) 和 `react-i18next` (Admin)
- 数据库表增加 `locale` 字段
- API 增加语言参数

#### 5. 内容审核流程

**需求**:
- 内容提交后进入审核队列
- 审核状态：草稿 → 待审核 → 已发布 / 已拒绝
- 审核意见和驳回原因
- 审核历史记录

**数据库变更**:
- 内容表增加 `review_status`, `reviewed_by`, `reviewed_at`, `review_comment` 字段
- 新增审核日志表

#### 6. 操作日志与审计

**需求**:
- 记录管理员操作（创建、编辑、删除）
- 操作时间、IP 地址、用户代理
- 操作日志查看和筛选
- 敏感操作二次确认

**技术方案**:
- NestJS 拦截器自动记录操作日志
- 新增 `operation_logs` 表
- 后台管理页面查看日志

### 低优先级

#### 7. 性能监控

**需求**:
- API 响应时间监控
- 错误率统计
- 数据库慢查询日志
- 服务器资源监控

#### 8. 缓存优化

**需求**:
- Redis 缓存热点数据
- API 响应缓存
- 数据库查询缓存
- 缓存失效策略

#### 9. 批量操作

**需求**:
- 批量删除/发布/置顶
- Excel 导入导出
- 批量图片上传

---

## 开发指引

### Git 工作流

```bash
# 创建功能分支
git checkout -b feature/download-center

# 提交代码
git add .
git commit -m "feat: add download center backend"

# 推送（手动执行）
git push origin feature/download-center
```

### 提交规范

使用语义化提交信息：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
chore: 构建/工具链更新
refactor: 代码重构
test: 测试相关
```

### 开发顺序建议

1. **先做后端 API** - 定义数据模型和接口
2. **再做管理后台** - 内容录入界面
3. **最后做官网前端** - 公开展示

### 测试策略

- 后端：单元测试 + E2E 测试
- 前端：组件测试 + 集成测试
- 手动测试：所有用户流程

---

## 文档结构

```
CompanyWeb/
├── README.md              # 项目快速入门指南
├── CODEBUDDY.md           # 完整技术架构手册
├── QWEN.md                # AI 助手上下文
├── AGENTS.md              # 本文件：项目规划和开发指引
└── docs/
    ├── DATABASE_MIGRATION.md   # 数据库迁移指南
    ├── api-overview.md         # API 接口文档
    ├── db-design.md            # 数据库设计
    ├── site-map.md             # 站点地图
    ├── deployment.md           # 部署指南
    ├── dev-progress.md         # 开发进度
    ├── admin-changelog.md      # 后台管理优化记录
    └── requirements-phase1.md  # 一期需求文档
```

---

## 快速参考

### 常用命令

```bash
# 一键启动
scripts\start-all.bat

# 数据库迁移和种子
scripts\migrate-and-seed.bat

# 停止所有服务
scripts\stop-all.bat
```

### 访问地址

- 官网前端: http://localhost:3001
- 后台管理: http://localhost:3100
- 后端 API: http://localhost:3000/api

### 默认账号

- 用户名: `admin`
- 密码: `Admin123`

---

**最后更新**: 2026-04-13  
**版本**: v2.0.0
