TODO 开发计划
按你确定的技术方案和分阶段目标，下面给出一份可直接执行的开发计划。这个版本偏“落地实施”，不是泛泛的需求清单。
项目目标
一期上线范围：
- 官网首页
- 关于我们
- 产品中心
- 新闻
- 公告
- 联系我们
- 后台账号管理
- 静态数据管理
二期优化范围：
- 下载中心
- 多语言
- SEO 增强
- 图片压缩与 CDN
- 内容审核流
- 操作日志
技术栈：
- frontend: Next.js + Tailwind CSS
- admin: React + Ant Design
- server: NestJS + MySQL
- 鉴权: JWT + RBAC
- 部署: Nginx + PM2 + MySQL
---
一、项目级 TODO
1. 初始化仓库目录结构
- 创建 frontend
- 创建 admin
- 创建 server
- 创建 docs
- 补充根目录 README.md
- 补充 .gitignore
- 确定 Node 版本与包管理器
- 统一环境变量命名规范
2. 建立基础工程规范
- 前端配置 eslint
- 后台配置 eslint
- 服务端配置 eslint
- 配置格式化工具
- 配置基础提交规范
- 约定分支命名和目录命名
- 约定 API 返回格式
- 约定错误码格式
3. 输出一期文档
- docs/requirements-phase1.md
- docs/site-map.md
- docs/api-overview.md
- docs/db-design.md
- docs/deployment.md
---
二、推荐目录设计 TODO
/company-web
  /frontend
  /admin
  /server
  /docs
建议进一步细化为：
/company-web
  /frontend
    /src
      /app
      /components
      /lib
      /services
      /types
      /styles
  /admin
    /src
      /pages
      /components
      /services
      /stores
      /types
  /server
    /src
      /modules
        /auth
        /admin-user
        /news
        /announcement
        /site-page
        /site-setting
        /product
        /upload
      /common
      /config
      /database
  /docs
---
**三、一期开发 TODO 拆分**
**A. 后端 `server` TODO**
1. 基础工程搭建
- 初始化 `NestJS`
- 接入 `MySQL`
- 配置 ORM
- 配置环境变量加载
- 配置全局异常处理
- 配置统一返回拦截器
- 配置参数校验
- 配置跨域
- 配置 Swagger 或接口文档工具
2. 认证与权限
- 管理员登录接口
- JWT 签发与校验
- 刷新 token 机制
- RBAC 权限模型
- 角色表与权限表设计
- 登录态拦截器 / 守卫
- 修改密码接口
- 获取当前管理员信息接口
3. 后台账号管理
- 管理员列表
- 创建管理员
- 编辑管理员
- 启用/禁用管理员
- 重置密码
- 角色分配
- 超级管理员保护逻辑
4. 新闻模块
- 新闻分类管理
- 新闻新增
- 新闻编辑
- 新闻删除
- 新闻详情
- 新闻列表分页
- 发布/草稿状态
- 置顶字段
- 发布时间字段
- 封面图字段
- 富文本内容字段
5. 公告模块
- 公告新增
- 公告编辑
- 公告删除
- 公告列表分页
- 公告详情
- 发布/草稿状态
- 置顶字段
- 发布时间字段
6. 静态数据管理
- 关于我们页面内容
- 联系我们页面内容
- 首页 Banner 数据
- 首页企业优势模块
- 公司基础信息
- 页脚信息
- 联系方式配置
- SEO 基础字段预留
7. 产品中心
- 产品分类管理
- 产品新增
- 产品编辑
- 产品删除
- 产品列表分页
- 产品详情
- 产品参数字段
- 产品图片字段
- 发布状态
8. 前台公开接口
- 首页聚合接口
- 关于我们接口
- 联系我们接口
- 产品列表接口
- 产品详情接口
- 新闻列表接口
- 新闻详情接口
- 公告列表接口
- 公告详情接口
9. 文件上传
- 图片上传接口
- 文件类型校验
- 文件大小限制
- 上传目录规范
- 返回访问 URL
- 预留后续 OSS/CDN 兼容层
10. 数据库与初始化
- 设计一期数据库表
- 编写迁移脚本
- 初始化超级管理员
- 初始化默认角色
- 初始化基础站点配置
- 初始化示例分类数据
---
B. 官网前端 frontend TODO
1. 基础工程搭建
- 初始化 Next.js
- 接入 Tailwind CSS
- 配置路由结构
- 配置全局布局
- 配置请求层
- 配置环境变量
- 配置基础 SEO 能力
- 配置错误页和 404 页
2. 公共布局组件
- 顶部导航
- 页脚
- Banner 组件
- 面包屑组件
- 列表分页组件
- 富文本展示组件
- 图片展示组件
- 联系方式区块组件
3. 首页
- Hero Banner
- 公司简介区块
- 主营产品入口
- 企业优势区块
- 最新新闻区块
- 最新公告区块
- 联系方式区块
4. 关于我们
- 公司简介展示
- 企业文化/发展介绍区块
- 静态富文本渲染
5. 产品中心
- 产品分类列表
- 产品卡片列表
- 产品详情页
- 产品参数展示
- 相关推荐预留
6. 新闻模块
- 新闻列表页
- 新闻详情页
- 分类筛选
- 发布时间展示
7. 公告模块
- 公告列表页
- 公告详情页
- 置顶公告样式
8. 联系我们
- 公司名称
- 地址
- 电话
- 邮箱
- 地图嵌入位
- 分支机构预留
9. 前端约束实现
- 不做任何表单提交
- 不做留言
- 不做询盘
- 不做用户系统
- 不接入埋点型信息采集表单
10. 前端发布优化
- 静态资源缓存策略
- 图片懒加载
- 基础 SEO title/description
- 页面加载状态
- 空数据展示状态
---
C. 后台前端 admin TODO
1. 基础工程搭建
- 初始化 React 管理后台
- 接入 Ant Design
- 配置路由
- 配置权限路由
- 配置请求封装
- 配置登录态存储
- 配置全局异常提示
2. 登录与权限
- 登录页
- 登录接口接入
- token 管理
- 权限菜单控制
- 退出登录
- 修改密码
3. 控制台首页
- 欢迎页
- 快捷入口
- 内容统计卡片
- 最近发布内容概览
4. 账号管理
- 管理员列表
- 新增管理员
- 编辑管理员
- 禁用管理员
- 分配角色
- 重置密码
5. 新闻管理
- 新闻列表
- 新建新闻
- 编辑新闻
- 删除新闻
- 分类管理
- 草稿/发布切换
- 置顶设置
- 富文本编辑器接入
6. 公告管理
- 公告列表
- 新建公告
- 编辑公告
- 删除公告
- 发布状态切换
- 置顶设置
7. 静态数据管理
- 首页 Banner 管理
- 关于我们内容管理
- 联系我们内容管理
- 企业优势内容管理
- 站点基础信息管理
8. 产品管理
- 产品分类管理
- 产品列表
- 新建产品
- 编辑产品
- 删除产品
- 上下架状态
9. 媒体上传
- 图片上传组件
- 文件选择器
- 上传预览
- 引用回填
---
四、一期数据库设计 TODO
建议核心表：
1. 管理与权限
- admin_users
- roles
- permissions
- role_permissions
- admin_user_roles
2. 内容管理
- news_categories
- news
- announcements
- product_categories
- products
3. 站点静态数据
- site_pages
- site_settings
- banners
4. 文件管理
- media_files
一期先不用但建议预留：
- operation_logs
- content_reviews
- download_files
- i18n_translations
---
五、接口设计 TODO
建议先定义接口分组。
1. 认证接口
- POST /auth/login
- POST /auth/refresh
- GET /auth/profile
- POST /auth/change-password
2. 管理员接口
- GET /admin-users
- POST /admin-users
- PATCH /admin-users/:id
- PATCH /admin-users/:id/status
- PATCH /admin-users/:id/reset-password
3. 新闻接口
- GET /admin/news
- POST /admin/news
- GET /admin/news/:id
- PATCH /admin/news/:id
- DELETE /admin/news/:id
4. 公告接口
- GET /admin/announcements
- POST /admin/announcements
- GET /admin/announcements/:id
- PATCH /admin/announcements/:id
- DELETE /admin/announcements/:id
5. 产品接口
- GET /admin/products
- POST /admin/products
- GET /admin/products/:id
- PATCH /admin/products/:id
- DELETE /admin/products/:id
6. 静态数据接口
- GET /admin/site-pages/:key
- PUT /admin/site-pages/:key
- GET /admin/site-settings
- PUT /admin/site-settings
7. 前台公开接口
- GET /public/home
- GET /public/about
- GET /public/contact
- GET /public/news
- GET /public/news/:id
- GET /public/announcements
- GET /public/announcements/:id
- GET /public/products
- GET /public/products/:id
---
六、开发顺序 TODO
建议按下面顺序做，能减少返工。
1. 先做文档和数据库设计
- 页面清单
- 字段清单
- 表结构
- API 清单
2. 先做后端基础能力
- 登录
- 权限
- 公共响应结构
- 上传
- 站点配置
3. 先做后台，再做官网
- 因为官网数据依赖后台内容结构
- 后台先把内容模型跑通，官网接入更顺
4. 优先完成内容主链路
- 管理员登录
- 创建新闻/公告/产品/静态页面
- 官网读取展示
5. 最后补 UI 打磨和部署
---
七、一期里程碑 TODO
里程碑 1：项目初始化
- 完成目录结构
- 完成基础工程初始化
- 完成文档模板
- 完成数据库设计初稿
里程碑 2：后端核心完成
- 完成鉴权
- 完成账号管理
- 完成新闻/公告/产品 CRUD
- 完成静态页面管理
- 完成公开接口
里程碑 3：后台完成
- 完成登录
- 完成账号管理界面
- 完成新闻/公告/产品管理界面
- 完成静态数据管理界面
里程碑 4：官网完成
- 完成首页
- 完成关于我们
- 完成产品中心
- 完成新闻
- 完成公告
- 完成联系我们
里程碑 5：联调与上线
- 完成接口联调
- 完成测试
- 完成部署
- 完成初始化数据导入
- 完成上线验收
---
八、二期 TODO
1. 下载中心
- 下载分类
- 下载文件上传
- 下载列表页
- 权限与文件描述字段
2. 多语言
- 中英文切换
- 页面内容国际化
- 产品和新闻多语言字段
- 后台多语言编辑界面
3. SEO 增强
- 页面级 title/description/keywords
- Open Graph 基础支持
- sitemap
- robots.txt
- 结构化数据预留
4. 图片压缩与 CDN
- 上传后压缩
- 缩略图生成
- 对接对象存储
- CDN 域名切换
5. 内容审核流
- 编辑
- 提交审核
- 审核通过/驳回
- 审核记录
6. 操作日志
- 登录日志
- 内容变更日志
- 管理员操作日志
- 审计查询
---
九、工期建议 TODO
如果 1 人主开发，大概可以按这个节奏：
1. 第 1 周
- 需求冻结
- 原型草图
- 库表设计
- 初始化三端项目
2. 第 2 周
- 后端鉴权
- 账号管理
- 新闻/公告/产品/静态页模型
3. 第 3 周
- 后台管理界面开发
- 富文本接入
- 文件上传
4. 第 4 周
- 官网首页、关于我们、联系我们
- 产品中心
5. 第 5 周
- 新闻、公告页面
- 前后端联调
6. 第 6 周
- 测试修复
- 部署上线
- 初始内容录入
---
十、验收标准 TODO
一期完成后，至少满足这些验收项：
1. 官网可访问
- PC 和手机都能正常打开
- 基本 SEO 信息可配置
- 无表单收集能力
2. 后台可用
- 管理员可登录
- 可新增/编辑/删除新闻
- 可新增/编辑/删除公告
- 可维护关于我们/联系我们等静态内容
- 可维护产品信息
3. 数据链路完整
- 后台发布内容后，官网正确展示
- 草稿内容不会在官网展示
- 置顶和发布时间生效
4. 安全基础可用
- 后台必须登录后访问
- 密码加密
- 权限控制生效
- 上传文件有限制
---
十一、建议先产出的文档
你现在最适合先做这 4 份：
1. docs/requirements-phase1.md
- 一期详细功能清单
2. docs/db-design.md
- 表结构和字段说明
3. docs/api-overview.md
- 接口清单和返回格式
4. docs/site-map.md
- 官网页面结构和后台菜单结构
---
十二、最小可执行开发清单
如果要尽快开工，先做这个最小集合：
1. 建项目骨架
2. 设计数据库
3. 做 auth
4. 做 news
5. 做 announcement
6. 做 site_pages
7. 做 site_settings
8. 做 products
9. 做后台界面
10. 做官网页面
11. 联调
12. 部署