# API Overview

## Base Principles

- Admin APIs require JWT unless otherwise noted
- Public APIs only return published and visible content
- Unified response structure:

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

## Auth APIs

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/profile`
- `POST /auth/change-password`

## Admin User APIs

- `GET /admin-users`
- `POST /admin-users`
- `PATCH /admin-users/:id`
- `PATCH /admin-users/:id/status`
- `PATCH /admin-users/:id/reset-password`

## News APIs

### Admin

- `GET /admin/news`
- `POST /admin/news`
- `GET /admin/news/:id`
- `PATCH /admin/news/:id`
- `DELETE /admin/news/:id`
- `GET /admin/news-categories`
- `POST /admin/news-categories`
- `PATCH /admin/news-categories/:id`
- `DELETE /admin/news-categories/:id`

### Public

- `GET /public/news`
- `GET /public/news/:id`

## Announcement APIs

### Admin

- `GET /admin/announcements`
- `POST /admin/announcements`
- `GET /admin/announcements/:id`
- `PATCH /admin/announcements/:id`
- `DELETE /admin/announcements/:id`

### Public

- `GET /public/announcements`
- `GET /public/announcements/:id`

## Product APIs

### Admin

- `GET /admin/products`
- `POST /admin/products`
- `GET /admin/products/:id`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `GET /admin/product-categories`
- `POST /admin/product-categories`
- `PATCH /admin/product-categories/:id`
- `DELETE /admin/product-categories/:id`

### Public

- `GET /public/products`
- `GET /public/products/:id`

## Static Content APIs

### Admin

- `GET /admin/site-pages/:key`
- `PUT /admin/site-pages/:key`
- `GET /admin/site-settings`
- `PUT /admin/site-settings`
- `GET /admin/banners`
- `POST /admin/banners`
- `PATCH /admin/banners/:id`
- `DELETE /admin/banners/:id`

### Public

- `GET /public/home`
- `GET /public/about`
- `GET /public/contact`

## Upload API

- `POST /admin/upload/image`
- `POST /admin/upload/file`

## Suggested Common Query Fields

- `page`
- `pageSize`
- `keyword`
- `status`
- `categoryId`
- `isTop`

## Suggested Pagination Response

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 0
    }
  }
}
```
