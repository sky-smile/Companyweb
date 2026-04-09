# Development Progress

## Current Status

This project has completed the backend phase-1 foundation and the first usable admin frontend foundation.

## Backend Completed

### Infrastructure

- NestJS server bootstrap
- MariaDB integration
- TypeORM data source and migrations
- unified response interceptor
- global exception filter
- env validation
- JWT auth foundation
- RBAC permission guard

### Database and Seed

- auth and RBAC tables
- news tables
- announcement tables
- site content tables
- product tables
- seed data for super admin and permissions

### Admin APIs Completed

- auth
- admin users
- roles
- news and news categories
- announcements
- products and product categories
- site pages
- site settings
- banners
- upload image and file endpoints

### Public APIs Completed

- home
- about
- contact
- public news list/detail
- public announcements list/detail
- public products list/detail

## Admin Frontend Completed

### Foundation

- Vite + React + TypeScript app scaffold
- Ant Design layout and routing
- auth bootstrap from stored token
- permission-aware menu filtering
- axios request layer

### Real Pages Connected

- login page
- dashboard page
- admin users page
- roles page
- news full CRUD page
- announcements full CRUD page
- products full CRUD page
- site content page
- media center page

### Media Integration

- upload helper component
- media center upload and copy link flow
- banner image URL backfill
- news cover image backfill
- product image URL backfill

## Current Local Runtime Notes

- admin frontend URL: `http://127.0.0.1:3100`
- server API URL: `http://127.0.0.1:3000/api`
- MariaDB host: `127.0.0.1`
- MariaDB port: `3307`
- database: `company_web`
- current admin login:
  - username: `admin`
  - password: `Admin1234567`

## Recent Commits

- `d3d4703` add full admin news CRUD page
- `b4e90c6` add full admin announcement CRUD page
- `ccceb43` add full admin product CRUD page
- `540e38b` add admin media center and upload backfill
- `fa06402` add admin site content management page

## Recommended Next Steps

### Option A: Frontend Website

Build the public `frontend` app and connect these already-finished public APIs:

- home
- about
- contact
- news
- announcements
- products

### Option B: Admin Polish

Continue improving admin usability:

- banner edit/delete actions
- richer page editor for site content
- upload callback directly into active form fields
- better number/select/switch controls instead of plain numeric inputs

### Option C: Backend Refinement

- add media file database table persistence
- add richer validation and DTO shaping
- add public product/news filtering and detail enhancements

## Resume Instruction

When reopening OpenCode next time, continue from:

`Frontend website implementation is the recommended next phase unless admin UX polish is preferred first.`
