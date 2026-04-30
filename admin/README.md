# Admin - 后台管理系统

基于 React 19 + Ant Design 6 的内容管理后台，用于管理新闻、公告、产品、用户等内容。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 库**: Ant Design 6
- **路由**: React Router v6
- **HTTP 客户端**: Axios
- **富文本**: Tiptap
- **语言**: TypeScript

## 快速开始

### 环境要求

- Node.js >= 20 LTS
- pnpm
- 后端 API 服务运行中

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_API_BASE_URL=http://127.0.0.1:4000/api
VITE_APP_TITLE=Company Web Admin
```

### 启动开发服务器

```bash
pnpm run dev
```

访问：http://localhost:3000

### 构建生产版本

```bash
pnpm run build
```

构建产物输出到 `dist/` 目录。

## 项目结构

```
src/
├── pages/                    # 页面组件
│   ├── LoginPage.tsx         # 登录页
│   ├── DashboardPage.tsx     # 仪表盘
│   ├── AdminUsersPage.tsx    # 账号管理
│   ├── RolesPage.tsx         # 角色管理
│   ├── NewsPage.tsx          # 新闻管理
│   ├── AnnouncementsPage.tsx # 公告管理
│   ├── ProductsPage.tsx      # 产品管理
│   ├── SiteContentPage.tsx   # 页面内容
│   ├── BannersPage.tsx       # Banner 管理
│   ├── SiteSettingsPage.tsx  # 站点设置
│   ├── MediaCenterPage.tsx   # 媒体中心
│   ├── ProfilePage.tsx       # 个人资料
│   └── SettingsPage.tsx      # 账号设置
├── components/
│   └── common/               # 通用组件
│       ├── EnhancedUploadField.tsx  # 增强上传组件
│       ├── RichTextEditor.tsx       # 富文本编辑器
│       ├── StatusSwitch.tsx         # 状态开关
│       ├── PublishStatus.tsx        # 发布状态选择器
│       └── SortInput.tsx            # 排序输入器
├── layouts/
│   └── AdminLayout.tsx       # 管理后台布局（侧边栏+顶栏）
├── router/
│   └── index.tsx             # 路由配置
├── services/                 # API 服务层
│   ├── http.ts               # HTTP 客户端封装
│   ├── authService.ts        # 认证服务
│   ├── adminUserService.ts   # 管理员服务
│   ├── roleService.ts        # 角色服务
│   ├── newsService.ts        # 新闻服务
│   ├── announcementService.ts# 公告服务
│   ├── productService.ts     # 产品服务
│   ├── siteContentService.ts # 站点内容服务
│   └── uploadService.ts      # 上传服务
├── stores/                   # 状态管理
│   └── authStore.ts          # 认证状态管理
├── config/
│   └── permissions.ts        # 权限中文映射
└── types/                    # TypeScript 类型定义
```

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/login` | LoginPage | 登录页 |
| `/` | DashboardPage | 仪表盘（数据统计） |
| `/account/admin-users` | AdminUsersPage | 账号管理 |
| `/account/roles` | RolesPage | 角色管理 |
| `/account/profile` | ProfilePage | 个人资料 |
| `/account/settings` | SettingsPage | 账号设置 |
| `/content/news` | NewsPage | 新闻管理 |
| `/content/announcements` | AnnouncementsPage | 公告管理 |
| `/content/products` | ProductsPage | 产品管理 |
| `/site/pages` | SiteContentPage | 页面内容 |
| `/site/banners` | BannersPage | Banner 管理 |
| `/site/settings` | SiteSettingsPage | 站点设置 |
| `/media/upload` | MediaCenterPage | 媒体中心 |

## 功能特性

### 布局优化

- ✅ 侧边栏菜单分组（主导航、系统管理、内容管理、站点配置）
- ✅ 侧边栏可折叠（80px / 260px）
- ✅ 固定侧边栏和粘性顶栏
- ✅ 动态面包屑导航
- ✅ 全屏切换功能
- ✅ 用户下拉菜单

### 通用组件

| 组件 | 说明 |
|------|------|
| `EnhancedUploadField` | 图片预览、拖拽上传、文件大小验证、删除 |
| `RichTextEditor` | Tiptap 富文本编辑器 |
| `StatusSwitch` | 状态切换开关（启用/禁用） |
| `PublishStatus` | 发布状态下拉选择（草稿/已发布） |
| `SortInput` | 排序输入器 |

### 列表页功能

所有列表页（新闻、公告、产品、管理员等）统一支持：

- ✅ 搜索和筛选
- ✅ 分页（每页 10 条，可调整）
- ✅ 富文本编辑（新闻、公告、产品详情）
- ✅ 增强上传（图片预览、拖拽）

### 权限管理

- ✅ 基于 RBAC 模型的权限控制
- ✅ 菜单根据权限动态过滤
- ✅ 按钮级别权限保护

## 状态管理

使用简单的 `authStore` 对象模式，不使用 Redux/Zustand：

```typescript
// 认证状态存储在 localStorage
const authStore = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  clearSession: () => { /* ... */ },
  hasPermission: (code: string) => {
    return isSuperAdmin || 
           permissions.includes('*:*') || 
           permissions.includes(code);
  }
};
```

## HTTP 客户端

使用 Axios 封装，自动处理：

- 请求拦截：注入 `Authorization: Bearer <token>`
- 响应拦截：401 自动清除会话并重定向到登录
- 响应解包：自动提取 `{ code: 0, data: T }` 中的 `data`

```typescript
// 使用示例
const news = await http.get<News[]>('/api/admin/news');
const result = await http.post<News>('/api/admin/news', payload);
```

## 开发规范

### 代码规范

- 语言: TypeScript
- 代码风格: ESLint + Prettier
- 类型检查: `pnpm run type-check`

### 表单验证注意事项

- 邮箱字段：空字符串需转为 `undefined`，否则触发 `@IsEmail()` 验证错误
- 角色编辑：权限代码需转换为 ID 后再设置表单值
- PATCH 请求：置顶字段只发送 `isTop`，不发送完整记录

### 提交规范

使用语义化提交信息：

```
feat: add product category filter
fix: handle empty email field
docs: update component documentation
chore: update Ant Design to v6
```

## 常用命令

```bash
pnpm run dev              # 启动开发服务器
pnpm run build            # 构建生产版本
pnpm run preview          # 预览生产版本
pnpm run lint             # ESLint 检查
pnpm run type-check       # TypeScript 类型检查
pnpm run format           # 格式化代码
```

## 默认账号

- 用户名：`admin`
- 密码：`Admin123`

> ⚠️ 首次登录后请及时修改默认密码

## 相关文档

- [后台管理优化记录](../docs/admin-changelog.md)
- [API 接口文档](../docs/api-overview.md)
- [数据库设计](../docs/db-design.md)
- [项目主 README](../README.md)
- [完整技术架构](../CODEBUDDY.md)
