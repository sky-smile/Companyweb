# Database Design

## Conventions

- Database: MySQL 8+
- Character set: `utf8mb4`
- Time fields use `datetime`
- Primary keys use bigint unsigned or compatible ORM-generated ids
- Common fields on major tables: `id`, `created_at`, `updated_at`

## Admin and Permission Tables

### `admin_users`

- `id`
- `username`
- `password_hash`
- `nickname`
- `email`
- `phone`
- `status`
- `is_super_admin`
- `last_login_at`
- `last_login_ip`
- `created_at`
- `updated_at`

### `roles`

- `id`
- `name`
- `code`
- `description`
- `status`
- `created_at`
- `updated_at`

### `permissions`

- `id`
- `name`
- `code`
- `module`
- `action`
- `created_at`
- `updated_at`

### `role_permissions`

- `id`
- `role_id`
- `permission_id`

### `admin_user_roles`

- `id`
- `admin_user_id`
- `role_id`

## Content Tables

### `news_categories`

- `id`
- `name`
- `slug`
- `sort`
- `status`
- `created_at`
- `updated_at`

### `news`

- `id`
- `category_id`
- `title`
- `slug`
- `summary`
- `cover_image`
- `content`
- `status`
- `is_top`
- `published_at`
- `seo_title`
- `seo_description`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

### `announcements`

- `id`
- `title`
- `summary`
- `content`
- `status`
- `is_top`
- `published_at`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

### `product_categories`

- `id`
- `name`
- `slug`
- `sort`
- `status`
- `created_at`
- `updated_at`

### `products`

- `id`
- `category_id`
- `name`
- `slug`
- `summary`
- `content`
- `images_json`
- `parameters_json`
- `status`
- `published_at`
- `sort`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

## Site Content Tables

### `site_pages`

- `id`
- `page_key`
- `title`
- `content`
- `extra_json`
- `seo_title`
- `seo_description`
- `status`
- `updated_by`
- `created_at`
- `updated_at`

### `site_settings`

- `id`
- `setting_key`
- `setting_value`
- `setting_group`
- `description`
- `updated_by`
- `created_at`
- `updated_at`

### `banners`

- `id`
- `title`
- `subtitle`
- `image_url`
- `link_url`
- `sort`
- `status`
- `created_at`
- `updated_at`

## Media Table

### `media_files`

- `id`
- `original_name`
- `mime_type`
- `extension`
- `size`
- `storage_path`
- `public_url`
- `uploaded_by`
- `created_at`

## Reserved Tables for Phase 2

- `operation_logs`
- `content_reviews`
- `download_files`
- `i18n_translations`

## Initialization Data

- one super admin account
- one default admin role
- baseline permissions for account, content, site, and upload modules
- seed records for about/contact/home settings
- sample category data for news and products
