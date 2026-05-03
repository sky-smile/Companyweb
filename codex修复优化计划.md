# Codex 修复优化计划

执行原则：按风险和阻塞程度分批修复；每批只覆盖一个清晰主题；完成后运行相关测试或构建，再提交 Git。

## 批次 1：前台构建阻塞

- 修复 `frontend/src/app/api/revalidate/route.ts` 中 Next 16 `revalidateTag` 参数不匹配。
- 验证：`pnpm --filter company-web-frontend build`。
- 提交建议：`fix(frontend): support next revalidate tag profile`

## 批次 2：公开列表分页

- 为新闻、产品、公告公开服务增加 `page/pageSize` 参数。
- 翻页时请求后端分页数据，不再对第一页做本地分页。
- 补齐前台服务或列表行为测试。
- 验证：前台构建；如新增测试则运行对应测试。
- 提交建议：`fix(frontend): request paginated public lists`

## 批次 3：富文本 SSR XSS 风险

- 避免 `RichContent` 在清理完成前输出原始 HTML。
- 使用服务端可执行的清理函数或在未清理前不渲染危险 HTML。
- 补齐恶意 HTML 不会输出的测试。
- 验证：前台构建；相关测试。
- 提交建议：`fix(frontend): sanitize rich content before render`

## 批次 4：管理端认证凭证存储

- 移除 accessToken/refreshToken 的 localStorage 持久化。
- 请求认证统一依赖 httpOnly Cookie；localStorage 仅保留非敏感 profile 或改为 session 内状态。
- 调整登录、启动鉴权和 401 处理。
- 验证：管理端测试和构建；必要时后端鉴权测试。
- 提交建议：`fix(admin): rely on http only auth cookies`

## 批次 5：默认管理员种子脚本

- 种子脚本不再覆盖已存在管理员密码。
- 新建管理员密码从环境变量读取，并禁止弱默认值用于生产。
- 移除控制台明文密码输出。
- 补齐脚本逻辑测试或可测试的辅助函数。
- 验证：后端测试和构建。
- 提交建议：`fix(server): harden admin seed password handling`

## 批次 6：上传安全与分页参数

- 上传列表增加 DTO，限制 `page/limit/folder/type/keyword`。
- 上传文件增加 MIME、扩展名和基础 magic number 校验。
- 静态上传响应增加 `nosniff` 等防护。
- 补齐上传校验单元测试。
- 验证：后端测试和构建。
- 提交建议：`fix(server): harden upload validation`

## 批次 7：迁移、缓存和可维护性

- 清理媒体表重复/未注册迁移，修正 `uploaded_by` 与 `SET NULL` 约束不一致。
- 站点设置更新刷新 `home` 和 `contact` 等受影响 tag。
- 提升密码强度 DTO 规则，按需要更新前端表单提示。
- 减少前台列表 `any[]` 使用，补齐类型。
- 验证：三端相关测试和构建。
- 提交建议：`chore: align migrations cache and validation`
