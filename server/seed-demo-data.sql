SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM news;
DELETE FROM announcements;
DELETE FROM products;
DELETE FROM news_categories;
DELETE FROM product_categories;
DELETE FROM banners;
DELETE FROM site_settings;
DELETE FROM site_pages;

ALTER TABLE news AUTO_INCREMENT = 1;
ALTER TABLE announcements AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE news_categories AUTO_INCREMENT = 1;
ALTER TABLE product_categories AUTO_INCREMENT = 1;
ALTER TABLE banners AUTO_INCREMENT = 1;
ALTER TABLE site_settings AUTO_INCREMENT = 1;
ALTER TABLE site_pages AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO site_pages (page_key, title, content, extra_json, seo_title, seo_description, status, updated_by)
VALUES
  (
    'home',
    '稳定供应与专业协同并重的化工企业伙伴',
    '伊博化工专注于工业客户的产品供应、批次管理、资料支持与交付协同，持续提升产品稳定性与合作响应效率。当前官网已整合产品展示、新闻公告、企业介绍与联系方式，方便客户快速了解企业能力。',
    '{"highlights":["稳定供货","质量可追溯","响应更及时"]}',
    '伊博化工官网 | 产品展示、新闻公告与联系方式',
    '查看伊博化工的企业介绍、产品信息、新闻公告与联系方式，了解公司服务能力与合作方向。',
    1,
    1
  ),
  (
    'about',
    '关于我们',
    '伊博化工面向工业客户提供化工产品供应、资料整理、交期协调与长期合作支持。公司坚持以稳定质量、规范管理和高效沟通为基础，持续完善面向客户的产品交付与信息服务能力。',
    '{"sections":[{"title":"企业理念","text":"以稳定品质和持续交付建立长期合作。"},{"title":"服务范围","text":"产品供应、资料支持、交期沟通与合作协同。"}]}',
    '关于我们 | 伊博化工',
    '了解伊博化工的发展方向、企业理念、服务范围与长期合作能力。',
    1,
    1
  ),
  (
    'contact',
    '联系我们',
    '欢迎通过电话、邮箱或到访方式与我们取得联系。我们可根据产品类型、项目周期与交付区域，提供更合适的业务沟通与合作支持。',
    '{"mapPlaceholder":"甘肃白银"}',
    '联系我们 | 伊博化工',
    '获取伊博化工的电话、邮箱、地址与业务联系信息。',
    1,
    1
  );

INSERT INTO site_settings (setting_key, setting_value, setting_group, description, updated_by)
VALUES
  ('company_name', '白银市伊博化工科技有限公司', 'company', '公司名称', 1),
  ('contact_phone', '+86 0943-6688 218', 'contact', '联系电话', 1),
  ('contact_email', 'sales@yibochemical.com', 'contact', '联系邮箱', 1),
  ('company_address', '甘肃省白银市高新技术产业园化工新材料区 18 号', 'contact', '公司地址', 1),
  ('business_hours', '周一至周五 08:30-17:30', 'contact', '工作时间', 1),
  ('footer_copy', '专注工业化工产品与稳定长期合作。', 'company', '页脚说明', 1);

INSERT INTO banners (title, subtitle, image_url, link_url, sort, status)
VALUES
  (
    '稳定供应链支撑工业客户长期合作',
    '通过统一官网展示产品、企业信息、公告动态与联系方式，帮助客户更快了解公司能力。',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1600&q=80',
    '/products',
    10,
    1
  ),
  (
    '以质量控制与及时响应支撑项目交付',
    '围绕产品资料、批次协同和交期沟通，建立更清晰的合作信息入口。',
    'https://images.unsplash.com/photo-1581092919535-7146ff1a5905?auto=format&fit=crop&w=1600&q=80',
    '/contact',
    20,
    1
  );

INSERT INTO news_categories (name, slug, sort, status)
VALUES
  ('企业新闻', 'company-news', 10, 1),
  ('行业动态', 'industry-updates', 20, 1),
  ('技术资料', 'technical-notes', 30, 1);

INSERT INTO news (category_id, title, slug, summary, cover_image, content, status, is_top, published_at, seo_title, seo_description, created_by, updated_by)
VALUES
  (
    1,
    '官网一期内容系统正式投入演示使用',
    'phase-1-website-content-system-online',
    '官网一期现已支持产品、新闻、公告与联系信息统一展示，并可通过后台进行维护。',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    '官网一期内容系统现已投入演示使用，已实现首页、关于我们、产品中心、新闻、公告和联系我们等主要页面的统一展示能力。后台管理端可对产品、新闻、公告和站点内容进行集中维护，便于后续联调、验收和内容补充。',
    1,
    1,
    '2026-04-08 10:00:00',
    '伊博化工官网一期演示上线',
    '伊博化工官网一期内容系统已支持产品、新闻、公告与联系信息展示。',
    1,
    1
  ),
  (
    2,
    '批次可追溯与稳定交付成为采购评估重点',
    'batch-control-key-supply-chain-requirement',
    '越来越多工业客户开始关注批次追溯、交期稳定和资料完整性。',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    '随着工业采购标准不断提升，供应商不仅需要提供稳定产品，还需要具备批次管理、资料留存和交付协同能力。伊博化工将持续完善相关流程，为客户提供更清晰、更可追溯的合作支持。',
    1,
    0,
    '2026-04-06 14:30:00',
    '化工供应中的批次管理趋势',
    '了解批次管理、交付稳定性与资料完整性在工业采购中的重要性。',
    1,
    1
  ),
  (
    3,
    '产品资料模板本周完成统一整理',
    'product-documentation-templates-standardized',
    '标准化资料模板可降低重复沟通成本，提升客户选型与项目支持效率。',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    '为提升客户沟通效率，公司已对产品资料模板进行统一整理，后续将逐步应用到产品详情页、对外资料输出和项目支持流程中，帮助客户更快完成选型与信息确认。',
    1,
    0,
    '2026-04-04 09:15:00',
    '产品资料模板标准化整理完成',
    '伊博化工已完成产品资料模板的统一整理工作。',
    1,
    1
  );

INSERT INTO announcements (title, summary, content, status, is_top, published_at, created_by, updated_by)
VALUES
  (
    '官网演示环境现已开放',
    '当前官网与后台演示环境已开放，可用于内容录入、内部联调与展示验证。',
    '当前演示环境已包含首页、关于我们、产品中心、新闻、公告、联系我们以及后台内容管理模块，可用于内部验收、内容录入和前后端联调。',
    1,
    1,
    '2026-04-09 08:00:00',
    1,
    1
  ),
  (
    '产品详情内容将于本周持续补充',
    '为支持演示与验收，产品图片、参数说明和应用文案将继续完善。',
    '为配合后续演示与验收，产品详情中的图片素材、参数说明和应用文案将在本周持续补充更新，当前已发布数据不影响系统联调和页面验证。',
    1,
    0,
    '2026-04-07 16:20:00',
    1,
    1
  );

INSERT INTO product_categories (name, slug, sort, status)
VALUES
  ('催化剂与助剂', 'catalysts-and-additives', 10, 1),
  ('基础化工原料', 'base-chemical-materials', 20, 1),
  ('工业供应协同方案', 'industrial-supply-solutions', 30, 1);

INSERT INTO products (category_id, name, slug, summary, content, images_json, parameters_json, status, published_at, sort, created_by, updated_by)
VALUES
  (
    1,
    '高纯反应助剂 A12',
    'high-purity-reaction-additive-a12',
    '面向工业工艺场景的高纯助剂产品，强调稳定品质与批次一致性。',
    'A12 适用于对纯度、稳定性和批次表现要求较高的工业客户。公司可配合提供基础资料、批次信息和供货沟通支持，适合长期合作与重复采购场景。',
    '["https://images.unsplash.com/photo-1581093588401-22d0b3b0b0f4?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80"]',
    '[{"label":"纯度","value":">= 99.5%"},{"label":"包装规格","value":"25kg/桶"},{"label":"储存条件","value":"阴凉干燥处保存"}]',
    1,
    '2026-04-02 11:00:00',
    10,
    1,
    1
  ),
  (
    2,
    '工业级溶剂 B25',
    'industrial-solvent-b25',
    '适用于工业清洗与工艺配套场景，兼顾稳定供货与常规应用需求。',
    'B25 可应用于常规工业清洗和工艺配套场景，适合重视交期稳定、资料清晰和长期合作节奏的客户。公司可根据实际应用需求提供基础信息与交付沟通支持。',
    '["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"]',
    '[{"label":"外观","value":"无色透明液体"},{"label":"包装规格","value":"200kg/桶"},{"label":"适用场景","value":"工业清洗与工艺配套"}]',
    1,
    '2026-04-03 15:30:00',
    20,
    1,
    1
  ),
  (
    3,
    '供应协同服务包',
    'custom-supply-coordination-package',
    '面向长期客户的资料输出、交付协调与持续沟通支持方案。',
    '该服务包适合具有持续采购需求的工业客户，覆盖资料整理、交期协同、批次沟通与项目对接等内容，帮助客户降低重复沟通成本并提升合作效率。',
    '["https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"]',
    '[{"label":"服务范围","value":"资料输出、交期协同、批次沟通"},{"label":"合作模式","value":"按项目或年度合作"},{"label":"适用客户","value":"长期工业采购客户"}]',
    1,
    '2026-04-05 13:45:00',
    30,
    1,
    1
  );
