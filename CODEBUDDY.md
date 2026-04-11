# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Common Commands

### Start All Services (Windows)
```bash
scripts\start-all.bat        # Starts MariaDB + Server + Admin + Frontend
scripts\start-database.bat   # Start MariaDB only
scripts\stop-all.bat         # Stop all services
```

### Individual Services
```bash
cd server && pnpm run start:dev    # Backend API (port 3000)
cd admin && pnpm run dev           # Admin panel (port 3100)
cd frontend && pnpm run dev        # Public site (port 3001)
```

### Database
```bash
cd server && pnpm run migration:run    # Run pending migrations
cd server && npx ts-node src/database/run-migrations.ts  # Alternative runner
```

### Type Checking & Linting
```bash
cd admin && npx tsc --noEmit          # Admin TypeScript check
cd server && npx tsc --noEmit         # Server TypeScript check
cd frontend && npx tsc --noEmit       # Frontend TypeScript check
```

### Default Admin Credentials
- Username: `admin`, Password: `Admin123`

## Architecture Overview

This is a monorepo with three independent subprojects sharing a single backend API. No workspace tooling (pnpm workspaces, turborepo, etc.) — each subproject has its own `package.json` and runs independently.

### Subproject Stack

| Subproject | Stack | Port | API Prefix |
|------------|-------|------|------------|
| **server** | NestJS 10 + TypeORM + MariaDB | 3000 | `/api` |
| **admin** | React 19 + Vite + Ant Design 6 | 3100 | calls `/api/admin/*` |
| **frontend** | Next.js 16 + Tailwind CSS 4 | 3001 | calls `/api/public/*` |

### Data Flow
- **Admin → Server**: All management APIs under `/api/admin/*`, `/api/admin-users`, `/api/roles`, `/api/auth/*` — requires JWT Bearer token + RBAC permissions
- **Frontend → Server**: Read-only public APIs under `/api/public/*` — no authentication
- The two frontends never communicate directly; Server is the sole data source

### API Response Format
```json
{ "code": 0, "message": "ok", "data": T }
```
Error responses include `path` and `timestamp`. Error codes: 0=success, 10000-10999=validation, 11000-11999=auth, 12000-12999=RBAC, 13000-13999=content, 14000-14999=upload, 15000-15999=system.

## Server Architecture (NestJS)

### Global Pipeline
- **ResponseInterceptor**: Auto-wraps return values into `{ code: 0, message: "ok", data: T }`. Skips wrapping if response already contains `code/message/data` fields (detected by `isWrappedResponse`).
- **AllExceptionsFilter**: Maps HTTP errors to business error codes. 500+ errors include stack trace in logs.
- **ValidationPipe**: `whitelist` + `transform` + `forbidNonWhitelisted` enabled globally.
- **CORS** enabled globally; static file serving at `/uploads`.

### Module Structure — Dual Controller Pattern
Each content module (News, Announcement, Product, SiteContent) has **two controllers**:
- `*.controller.ts` under `/admin/*` — JWT + permission guarded, includes draft content
- `public-*.controller.ts` under `/public/*` — no auth, only published content

Both controllers share the same Service, which has separate methods for admin vs public queries (e.g., `listNews` vs `listPublicNews`).

### Authentication & RBAC

**JWT Flow**: Login → accessToken(2h) + refreshToken(7d). JWT payload includes `{ sub, username, isSuperAdmin, roles[], permissions[] }`. **Permissions are embedded in the token** — role/permission changes don't take effect until token refresh.

**RBAC Tables**: `admin_users ←→ admin_user_roles ←→ roles ←→ role_permissions ←→ permissions`

- Permission codes follow `module:action` format (e.g., `news:create`, `admin-users:view`)
- Super admin: `isSuperAdmin=1` or user with `*:*` permission bypasses all checks
- `PermissionsGuard` requires ALL listed permissions (`@Permissions()` decorator, every semantics)

**Auth Fallback**: When database is unavailable, `AuthRepository` falls back to a hardcoded mock admin user (admin/Admin123) — this ensures login works even before database seeding.

### Repository Pattern
Each module has a custom `*.repository.ts` that wraps TypeORM queries. Services depend on these custom repositories, not directly on TypeORM's injected Repository.

### Database & Migrations
- 14 entities, all use `bigint unsigned` PKs (except `media_files` which uses int)
- 6 migration files: auth-rbac → news → announcements → site-content → products → media-files
- `DB_SYNCHRONIZE=false` even in dev — always use migrations
- Seed: `auth.seed.ts` creates super-admin role + 36 permissions + admin user (idempotent via `ON DUPLICATE KEY UPDATE`)
- Demo data: `seed-demo-data.sql` for sample content

### File Upload
- Multer with **memory storage**, 10MB limit
- Filename: `{timestamp}-{random8char}{ext}`, stored in `uploads/{folder}/`
- `fixFilenameEncoding()` handles Chinese filename corruption from busboy Latin-1 decoding
- Requires `upload:image` or `upload:file` permission

### Key Pitfalls
- Backend DTOs: `@IsOptional()` only skips validation for `null/undefined`, NOT empty strings. `@IsEmail()` will reject `''`. Frontend must convert empty strings to `undefined` before sending.
- Pagination in some services (e.g., NewsService) loads all records then filters in memory — not suitable for large datasets.
- UploadController manually constructs response instead of relying on ResponseInterceptor auto-wrapping.

## Admin Architecture (React + Vite)

### Startup Flow
`main.tsx → App.tsx → ConfigProvider(Ant Design) + BrowserRouter + AppBootstrap → AppRouter`

**AppBootstrap** checks localStorage for token, calls `GET /auth/profile` to validate, clears session if invalid.

### State Management
No Redux/Zustand. Simple `authStore` object pattern using localStorage:
- `hasPermission(code)`: checks `isSuperAdmin || permissions.includes('*:*') || permissions.includes(code)`
- Menu filtering via `filterMenuByPermission()` in AdminLayout

### HTTP Layer (`services/http.ts`)
Axios wrapper with:
- Request interceptor: injects `Authorization: Bearer <token>`
- Response interceptor: 401 → clear session + redirect to `/login` (no auto-refresh using refreshToken)
- `unwrapResponse<T>()`: extracts `data` field from `{ code: 0, data: T }`, throws on non-zero code

### Permission Configuration (`config/permissions.ts`)
**Dual definition problem**: Permissions are defined both in backend seed and frontend config. Frontend has 11 groups with Chinese names/descriptions. `roleService.enrichPermissions()` overrides backend English names with frontend Chinese names. **When adding new permissions, update both** `server/src/database/seeds/auth.seed.ts` and `admin/src/config/permissions.ts`.

### Route Structure
```
/login                          → LoginPage
/ (ProtectedRoute → AdminLayout)
  /                             → DashboardPage
  /account/admin-users          → AdminUsersPage
  /account/roles                → RolesPage
  /account/profile              → ProfilePage
  /account/settings             → SettingsPage
  /content/news                 → NewsPage
  /content/announcements        → AnnouncementsPage
  /content/products             → ProductsPage
  /site/pages                   → SiteContentPage
  /site/banners                 → BannersPage
  /site/settings                → SiteSettingsPage
  /media/upload                 → MediaCenterPage
```

### Common Components (`admin/src/components/common/`)
- `RichTextEditor` — wangEditor 5.x integration
- `EnhancedUploadField` — image preview, drag-drop, file size validation, delete
- `StatusSwitch`, `PublishStatus`, `SortInput` — reusable form controls

### Key Pitfalls
- Role editing: must convert permission codes to IDs before setting form values
- Top toggle (isTop) on news/announcements: only send the `isTop` field in PATCH, not the full record
- Email field: filter empty strings to `undefined` to avoid `@IsEmail()` validation errors
- RefreshToken mechanism exists in backend but admin frontend does NOT use it — 401 always redirects to login

## Frontend Architecture (Next.js)

### App Router Structure
```
app/
  layout.tsx         → Global layout (Header + Footer + BackToTop + JSON-LD)
  page.tsx           → Homepage (aggregates Banner + Products + News + Announcements)
  sitemap.ts         → Dynamic sitemap.xml
  robots.ts          → robots.txt
  about/page.tsx     → About us
  contact/page.tsx   → Contact us
  news/page.tsx + NewsListClient.tsx + [id]/page.tsx
  announcements/page.tsx + AnnouncementListClient.tsx + [id]/page.tsx
  products/page.tsx + ProductListClient.tsx + [id]/page.tsx
```

### Server/Client Component Pattern
List pages use a **split pattern**: `page.tsx` as Server Component fetches data + generates Metadata, then passes data to a `*Client.tsx` Client Component for interactive rendering (pagination, filtering).

### Data Fetching & Caching (`lib/api.ts`)
`fetchApi<T>()` uses Next.js `fetch` with `next.revalidate` for ISR:
- SHORT=60s (news list), MEDIUM=300s (products), LONG=3600s (static pages), VERY_LONG=86400s
- Supports `tags` for on-demand revalidation
- Unwraps `{ code: 0, data: T }`, throws `ApiError` on non-zero code

**Important**: Root layout has `export const dynamic = 'force-dynamic'` which forces re-render on every request, overriding the ISR cache strategy. Remove this before production deployment.

### SEO
- `lib/seo.ts`: `buildMetadata()` generates unified Metadata (title, description, canonical, OpenGraph, Twitter Card)
- `components/JsonLd.tsx`: Structured data components (Organization, NewsArticle, Product, BreadcrumbList)
- Each page uses `generateMetadata()` to fetch SEO fields from API, with fallback to content summary

### Utility Functions (`lib/public-content.ts`)
- `parseStringArray`: Handles JSON string arrays with edge cases (single string, parse failure)
- `parseProductParameters`: Supports object arrays, key-value pairs, and `label:value` text format
- `formatPublicDate`: Chinese date formatting

### Key Constraints
- No forms, no user submissions, no inquiry forms, no analytics collection
- All API calls use `/api/public/*` — no authentication

## Environment Variables

### Server (server/.env)
```
SERVER_PORT=3000, SERVER_GLOBAL_PREFIX=api
DB_TYPE=mariadb, DB_HOST=127.0.0.1, DB_PORT=3306, DB_NAME=company_web
JWT_ACCESS_SECRET (>=16 chars), JWT_REFRESH_SECRET (>=16 chars)
JWT_ACCESS_EXPIRES_IN=2h, JWT_REFRESH_EXPIRES_IN=7d
UPLOAD_DIR=uploads, UPLOAD_BASE_URL=http://localhost:3000/uploads
```

### Admin (admin/.env)
```
VITE_API_BASE_URL=http://127.0.0.1:3000/api
VITE_APP_TITLE=Company Web Admin
```

### Frontend (frontend/.env)
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000/api
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3001
```
