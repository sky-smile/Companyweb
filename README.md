# Company Web

Official company website project with a public site, admin console, and backend API.

## Phase 1 Scope

- Public website: home, about, products, news, announcements, contact
- Admin console: authentication, account management, static content management
- Backend API: JWT authentication, RBAC, content management, public content delivery

## Monorepo Structure

```text
.
|- frontend/   Next.js + Tailwind CSS public site
|- admin/      React + Ant Design admin console
|- server/     NestJS + MariaDB API service
`- docs/       Product, API, database, and deployment documents
```

## Engineering Baseline

- Node.js: `20 LTS`
- Package manager: `pnpm`
- Language baseline: `TypeScript`
- Environment variable prefix:
  - frontend: `NEXT_PUBLIC_` for browser-safe values
  - admin: `VITE_` if Vite is adopted, otherwise keep app-specific prefixes
  - server: `SERVER_`, `DB_`, `JWT_`, `UPLOAD_`
- Branch naming:
  - `feature/<scope>`
  - `fix/<scope>`
  - `chore/<scope>`
  - `docs/<scope>`

## API Response Convention

Successful response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

Failed response:

```json
{
  "code": 10001,
  "message": "Validation failed",
  "data": null,
  "requestId": "trace-id"
}
```

## Error Code Convention

- `0`: success
- `10000-10999`: common request and validation errors
- `11000-11999`: authentication and authorization errors
- `12000-12999`: admin user and RBAC errors
- `13000-13999`: content management errors
- `14000-14999`: upload and media errors
- `15000-15999`: system and third-party dependency errors

## Current Step

The repository is currently in the project bootstrap and documentation phase. Recommended implementation order:

1. Finalize product and technical documents in `docs/`
2. Initialize `server` foundation first
3. Build admin content workflow
4. Connect `frontend` to public APIs
5. Complete deployment and initialization scripts
