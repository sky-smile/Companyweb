# Deployment Plan

## Target Stack

- Nginx
- PM2
- MySQL
- Node.js 20 LTS

## Deployment Units

- `frontend`: Next.js public website
- `admin`: React admin console
- `server`: NestJS API service

## Environment Variables

### Frontend

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`

### Admin

- `VITE_API_BASE_URL`
- `VITE_APP_TITLE`

### Server

- `SERVER_PORT`
- `SERVER_JWT_ACCESS_SECRET`
- `SERVER_JWT_REFRESH_SECRET`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `UPLOAD_DIR`
- `UPLOAD_BASE_URL`

## Recommended Release Flow

1. Provision MySQL and create application database
2. Install Node.js 20 and `pnpm`
3. Build `server`, `admin`, and `frontend`
4. Run database migration and seed scripts
5. Start services with PM2
6. Configure Nginx reverse proxy and static routing
7. Verify public pages, admin login, and API health endpoints

## PM2 Suggestion

- `server`: run NestJS compiled app
- `frontend`: run Next.js server mode or standalone build
- `admin`: serve built static files via Nginx

## Nginx Routing Suggestion

- `/` -> frontend app
- `/admin` -> admin static build
- `/api` -> server application
- `/uploads` -> uploaded media directory

## Initial Launch Checklist

- environment variables configured
- database migrated
- super admin account initialized
- upload directory write permission confirmed
- HTTPS configured
- basic log rotation configured
