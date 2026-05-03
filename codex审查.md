# Codex 项目审查报告

审查时间：2026-05-03  
审查范围：NestJS 后端、Next.js 前台、Vite/React 管理端、数据库迁移与脚本。

## 总体结论

项目三端职责清晰，后端已启用全局 DTO 白名单校验、RBAC 权限守卫、登录限流、JWT tokenVersion 撤销机制、富文本入库清理和基础测试。但当前仍存在几处需要优先处理的问题：默认管理员种子会反复重置密码、前台富文本 SSR 阶段会先输出未清理 HTML、管理端仍持久化 JWT 到 localStorage、前台生产构建失败，以及列表分页实现与后端分页接口不一致。

## 高优先级问题

### 1. 认证种子脚本会反复重置超级管理员密码

- 位置：`server/src/database/seeds/auth.seed.ts:93-97`，`server/src/database/migrate-and-seed.ts:31-33`，`server/src/database/reset-database.ts:34-36`
- 现象：`seed:auth` 固定使用 `Admin123`，并通过 `ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)` 在每次执行时覆盖现有 `admin` 密码。
- 影响：生产或预生产环境误执行迁移/种子脚本时，会把超级管理员密码回滚为公开写在代码和控制台输出中的弱口令。
- 建议：种子脚本只在用户不存在时创建管理员；默认密码从一次性环境变量读取；首次登录强制改密；不要在控制台输出真实密码。

### 2. 富文本组件 SSR 阶段先渲染未清理 HTML

- 位置：`frontend/src/components/RichContent.tsx:47-53`，`frontend/src/components/RichContent.tsx:66-72`
- 现象：组件在客户端 `useEffect` 中动态加载 DOMPurify 并设置 `sanitized`，但首次 SSR/HTML 输出使用 `sanitized ?? wrapTables(content)`，也就是直接把原始内容传给 `dangerouslySetInnerHTML`。
- 影响：后端正常入库路径做了清理，但历史脏数据、数据库被写入、迁移导入或未来绕过服务层的内容会在浏览器拿到 HTML 时先执行，客户端 hydration 后再清理已经太晚。
- 建议：在渲染前同步清理内容；服务端组件侧使用 `sanitize-html` 或同构 DOMPurify；至少不要在 `sanitized === null` 时输出原始 HTML。

### 3. 后端已设置 httpOnly Cookie，但管理端仍把 JWT 写入 localStorage

- 位置：`server/src/modules/auth/auth-cookie.config.ts:13-24`，`admin/src/stores/auth-store.ts:30-33`，`admin/src/services/http.ts:14-19`
- 现象：后端登录会设置 `access_token`/`refresh_token` 的 httpOnly Cookie；管理端同时把 accessToken 和 refreshToken 存入 localStorage，并在每次请求中添加 Bearer 头。
- 影响：一旦管理端出现 XSS，refresh token 可被直接读取并长期复用，httpOnly Cookie 的收益被抵消。
- 建议：生产路径统一使用 httpOnly Cookie；前端只保存非敏感 profile；移除 localStorage token 和 Authorization 自动注入；刷新接口仅从 Cookie 读取 refresh token。

### 4. 前台生产构建失败

- 位置：`frontend/src/app/api/revalidate/route.ts:27-30`
- 现象：`pnpm --filter company-web-frontend build` 编译通过后 TypeScript 失败：`revalidateTag(tag)` 缺少第二个参数。本地 Next 类型定义显示 `revalidateTag(tag: string, profile: string | CacheLifeConfig)`。
- 影响：前台无法完成生产构建，阻塞部署。
- 建议：按当前 Next 版本签名补齐 profile 参数，或改用项目约定的缓存生命周期配置；同时为 `/api/revalidate` 增加一个最小单元测试或构建门禁。

### 5. 前台列表分页只取第一页数据，却按总数展示分页

- 位置：`frontend/src/services/public-service.ts:34-66`，`frontend/src/app/news/NewsListClient.tsx:20-45`，`frontend/src/app/products/ProductListClient.tsx:19-44`，`frontend/src/app/announcements/AnnouncementListClient.tsx:20-45`
- 现象：后端公开列表接口支持 `page/pageSize`，但前台服务方法没有传查询参数；客户端只拿默认第一页，再对这一页数组做 `slice`。当后端总数大于第一页条数时，点击第二页会在本地数组上切出空结果。
- 影响：新闻、产品、公告超过一页后，用户无法浏览后续内容。
- 建议：把 `page` 和 `pageSize` 作为 `publicService` 参数传给后端；翻页时重新请求；缓存 tag 可包含分页维度，或统一对列表 tag 做失效。

## 中优先级问题

### 6. 上传校验主要依赖客户端提供的 MIME 类型

- 位置：`server/src/modules/upload/upload.controller.ts:24-30`，`server/src/modules/upload/upload.service.ts:246-249`，`server/src/main.ts:29-33`
- 现象：图片上传只判断 `file.mimetype.startsWith('image/')`；普通文件上传没有扩展名、MIME、内容签名白名单；上传目录通过 `/uploads` 静态公开。
- 影响：可上传伪装 MIME 的 SVG/HTML/polyglot 文件，公开访问时可能引发存储型 XSS 或内容嗅探风险。
- 建议：使用 magic number 检测真实类型；禁用或转码 SVG；普通文件使用白名单；为 `/uploads` 设置 `X-Content-Type-Options: nosniff`、下载型 Content-Disposition 或独立静态域名。

### 7. 上传列表分页参数缺少边界约束

- 位置：`server/src/modules/upload/upload.controller.ts:94-103`，`server/src/modules/upload/upload.service.ts:97-108`
- 现象：上传列表直接接收 `page` 和 `limit`，未复用 `ListQueryDto` 的 `@Min(1)` / `@Max(100)`；`limit=0` 会导致 `totalPages = Infinity`，超大 `limit` 会造成数据库和响应压力。
- 影响：后台媒体中心可能被异常查询拖慢，返回结构也可能出现非法值。
- 建议：为上传列表增加专用 DTO，限制 `page >= 1`、`1 <= limit <= 100`，并处理缺省值。

### 8. 媒体文件迁移与实体约束不一致

- 位置：`server/src/database/data-source.ts:23-31`，`server/src/database/migrations/1712620000000-add-media-files-table.ts:83-87`，`server/src/database/migrations/1775909163542-create-media-files-table.ts:116-124`，`server/src/database/entities/media-file.entity.ts:50-55`
- 现象：`1775909163542-create-media-files-table.ts` 存在但没有注册到 `data-source.ts`；已注册的旧媒体迁移没有外键；实体声明 `onDelete: 'SET NULL'`，但 `uploaded_by` 列不是 nullable。
- 影响：新环境和已有环境的表结构可能漂移；删除管理员时媒体记录外键行为不确定；未来同步/迁移生成会产生意外差异。
- 建议：合并或删除未注册迁移；明确 `uploaded_by` 是否允许为空；如果使用 `SET NULL`，列和实体属性都应 nullable，并补齐迁移。

### 9. 站点设置更新只刷新 home 缓存

- 位置：`server/src/modules/site-content/site-content.service.ts:37-40`，`frontend/src/services/public-service.ts:13-31`
- 现象：站点设置同时影响首页和联系页，但 `updateSiteSettings` 只刷新 `home` tag，没有刷新 `contact`。
- 影响：后台修改联系方式后，联系页可能继续展示旧数据直到缓存自然过期。
- 建议：站点设置更新后刷新 `home`、`contact`，必要时也刷新 `about` 或引入 `site-settings` 统一 tag。

### 10. 密码强度规则偏弱

- 位置：`server/src/common/dto/change-password.dto.ts:4-12`，`server/src/modules/admin-user/dto/create-admin-user.dto.ts:9-12`，`server/src/modules/admin-user/dto/reset-admin-user-password.dto.ts:4-7`
- 现象：密码只要求 6 到 50 位，没有复杂度、常见弱口令拦截或历史密码限制。
- 影响：后台账号抵御撞库、弱口令和内部误配置的能力不足。
- 建议：提高最小长度到 10 或 12；增加弱口令字典和复杂度策略；重置密码后强制下次登录修改。

## 低优先级与可维护性

- `admin/src/pages/ProfilePage.tsx:32` 仍有 TODO，个人资料更新功能未接后端。
- `server/src/modules/upload/upload.service.ts:122-138` 使用同步文件系统 API 删除文件，上传量上来后会阻塞 Node 事件循环，建议改为 `fs.promises`。
- `frontend/src/app/news/NewsListClient.tsx:15`、`frontend/src/app/products/ProductListClient.tsx:14`、`frontend/src/app/announcements/AnnouncementListClient.tsx:15` 使用 `any[]`，建议复用 `frontend/src/types/public.ts` 中的类型。
- 前台 `JsonLd` 和若干组件使用 `dangerouslySetInnerHTML` 注入静态样式或 JSON-LD，目前风险较低，但建议集中封装，避免未来误传用户内容。

## 已验证的正向点

- 后端全局 `ValidationPipe` 开启 `whitelist`、`transform` 和 `forbidNonWhitelisted`：`server/src/main.ts:36-41`。
- 管理接口普遍使用 `JwtAuthGuard` 和 `PermissionsGuard`，RBAC 覆盖较完整：`server/src/modules/*/*.controller.ts`。
- 登录接口有更严格限流：`server/src/modules/auth/auth.controller.ts:25-27`；全局限流为每分钟 60 次：`server/src/app.module.ts:28-31`。
- JWT 策略会查询最新用户状态和 `tokenVersion`，可在登出、改密后撤销旧 token：`server/src/modules/auth/jwt.strategy.ts:26-47`。
- 后端富文本入库路径使用 `sanitize-html` 白名单：`server/src/common/utils/html-sanitizer.ts:30-62`。
- 管理端 HTML 清理已有 Vitest 覆盖，当前 `admin` 测试通过。

## 本次执行的验证

- `pnpm --filter company-web-admin test`：通过，1 个测试文件，10 个用例。
- `pnpm --filter company-web-server build`：通过。
- `pnpm --filter company-web-frontend build`：失败，原因是 `frontend/src/app/api/revalidate/route.ts:29` 的 `revalidateTag` 参数不匹配。
- `pnpm --filter company-web-server test -- --runInBand`：未能启动，报错点在本机 Node/Jest 启动链路，出现将 `D:\Programs\ChocoPrograms\nodejs\node.exe` 当作 JS 解析的错误。
- `pnpm --filter company-web-admin build`：未能启动，出现同类本机 Node 启动链路错误；管理端单元测试本身通过。

## 建议修复顺序

1. 修复前台 `revalidateTag` 构建错误，恢复可部署状态。
2. 修改认证种子脚本，避免默认密码覆盖生产账号。
3. 移除管理端 localStorage token，统一认证凭证策略。
4. 修复 `RichContent` SSR 未清理输出。
5. 修复前台新闻/产品/公告分页请求。
6. 加固上传类型检测、静态资源响应头和上传分页 DTO。
7. 清理媒体迁移和实体约束不一致问题。
8. 补齐缓存 tag、密码策略、类型和 TODO。
