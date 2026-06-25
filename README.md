# VaultPay — Auth Service

Customer authentication, OAuth, MFA, device/session management, admin sessions, the
platform **RBAC source of truth**, and service-to-service (S2S) tokens for **VaultPay**.

Part of the VaultPay polyrepo (database-per-service, duplicated shared code). The rules in
[`.claude/rules/`](.claude/rules) are the source of truth; the cross-service table catalog is
[`.claude/docs/vaultpay-data-dictionary.xlsx`](.claude/docs).

---

## Tech stack

- **Runtime:** Node.js ≥ 20, Express, ESM (`"type": "module"`)
- **DB:** PostgreSQL · **ORM:** Prisma (this service owns `vaultpay_auth`)
- **Cache / sessions / rate-limit / OAuth-state / MFA-challenge:** Redis (ioredis)
- **Validation:** Zod · **Auth:** JWT (customer), session cookie (admin), S2S JWT
- **MFA:** otplib (TOTP) + qrcode · **OAuth:** Google/GitHub via native fetch
- **Email:** Nodemailer + Mailtrap (logs in dev when unconfigured) · **Geo-IP:** geoip-lite
- **Containers:** Docker + Docker Compose

Everything runs **free and locally** — no paid third-party services.

---

## Prerequisites

- Node.js ≥ 20 and npm
- PostgreSQL running locally on `:5432` (or use the bundled `docker compose`)
- Redis running locally on `:6379`

---

## Setup (local)

```bash
# 1. install deps
npm install

# 2. environment
cp .env.example .env          # adjust secrets/ports as needed

# 3. provision the database role + db (one-time, as the postgres superuser)
#    creates role "vaultpay" / db "vaultpay_auth" to match DATABASE_URL
psql -U postgres -h localhost -p 5432 -f scripts/db-bootstrap.sql

# 4. apply migrations + seed
npm run db:deploy             # apply committed migrations
npm run db:seed               # roles, permissions, dev admin, dev S2S clients

# 5. run
npm run dev                   # http://localhost:4001  (Swagger at /docs)
```

### With Docker Compose (service + its own Postgres + Redis)

```bash
docker compose up --build     # applies migrations then starts the service
```

### Connecting a DB client (e.g. DBeaver)

| Field | Value |
|-------|-------|
| Host / Port | `localhost` / `5432` |
| Database | `vaultpay_auth` |
| User / Password | `vaultpay` / `vaultpay` |

---

## NPM scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start with nodemon (reload on change) |
| `npm start` | Start the server |
| `npm run db:migrate` | Create + apply a dev migration (`prisma migrate dev`) |
| `npm run db:deploy` | Apply committed migrations (CI/prod) |
| `npm run db:status` | Migration drift check |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:seed` | Idempotent seed |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |

> Migration discipline (identical across all services) is defined in
> [`.claude/rules/10-database-migrations.md`](.claude/rules/10-database-migrations.md):
> author with `migrate dev`, apply with `migrate deploy`, never edit an applied migration,
> always commit `prisma/migrations/**`.

---

## Endpoints

Base URL: `http://localhost:4001` · OpenAPI: `/openapi.json` · Swagger UI: `/docs` ·
Health: `/health`

### `auth` — customer identity (JWT)
`POST /auth/register` · `POST /auth/login` · `POST /auth/refresh` · `POST /auth/logout` ·
`GET /auth/me` · `POST /auth/verify-email` · `POST /auth/forgot-password` ·
`POST /auth/reset-password` · `POST /auth/change-password`

### `oauth` — social login (Google/GitHub)
`GET /auth/oauth/:provider/url` · `GET /auth/oauth/:provider/callback` ·
`POST /auth/oauth/:provider/link` · `DELETE /auth/oauth/:provider`

### `mfa` — TOTP + backup codes
`POST /auth/mfa/setup` · `POST /auth/mfa/enable` · `POST /auth/mfa/verify` ·
`POST /auth/mfa/disable` · `POST /auth/mfa/backup-codes`

### `device` — sessions
`GET /auth/devices` · `DELETE /auth/devices/:id`

### `admin` — session-based admin auth
`POST /admin/auth/login` · `POST /admin/auth/logout` · `GET /admin/auth/session`

### `role` — RBAC management (admin-guarded)
`GET /roles` · `POST /roles` · `PATCH /roles/:id` · `DELETE /roles/:id` ·
`GET /permissions` · `POST /users/:userId/roles`

### `service` — S2S
`POST /service/token` · `POST /service/introspect`

---

## Login & MFA flow

1. `POST /auth/login` → if MFA is enabled, the response is `{ mfaRequired: true, mfaToken }`
   instead of tokens.
2. `POST /auth/mfa/verify` with `{ mfaToken, code }` (TOTP or a backup code) → tokens.

Refresh tokens rotate on every `POST /auth/refresh`; reuse of a revoked token revokes the
whole token family. Each token is tied to a device row, so `DELETE /auth/devices/:id`
performs a real remote sign-out.

---

## Response envelope

Success:
```json
{ "success": true, "data": { }, "meta": { }, "error": null }
```
Error (centralized handler):
```json
{ "success": false, "data": null, "error": { "code": "AUTH_INVALID_CREDENTIALS", "message": "..." } }
```
When `ENCRYPTION_ENABLED=true`, request bodies arriving as `{ "encrypted": "<base64>" }` are
decrypted before validation, and response `data` is returned as an encrypted payload.

---

## Dev credentials (seed)

- **Admin:** `admin@vaultpay.local` / `Admin@12345` (SUPER_ADMIN)
- **S2S clients:** `gateway`, `wallet-service`, `vault-service` — secret `dev-s2s-secret-change-me`

> Dev only. Never use these in production.

---

## Project structure

```
src/
  modules/{auth,oauth,mfa,device,admin,role,service}/
    constants/ routes/ controllers/ validators/ services/ repositories/ parsers/ docs/ types/
  shared/
    config/      env, database (Prisma singleton), redis, logger, swagger, cluster
    middleware/  ipTracker, rateLimiter, auth, adminSession, serviceAuth, rbac, adminRole,
                 validate, encryption, response, notFound, errorHandler
    utils/ constants/ errors/ services/ validators/
  app.js         builds the Express app (no listen)
  server.js      connects DB, listens, cluster + graceful shutdown
prisma/          schema.prisma, migrations/, seed.js
scripts/         db-bootstrap.sql
```

Request flow (mandatory): `ipTracker → rateLimiter → [auth/adminSession/serviceAuth] →
[rbac/adminRole] → encryption(decrypt) → validate → controller → service → repository →
Prisma → parser → response → errorHandler`.

Hard rules: Prisma is used **only** in `repositories/`; controllers hold no business logic;
services hold no Prisma; every folder has an `index.js` barrel.

---

## Environment variables

See [`.env.example`](.env.example) for the full list (DB, Redis, JWT access/refresh,
admin session, S2S, `ENCRYPTION_ENABLED`/key, MFA issuer, OAuth client ids/secrets,
Mailtrap, rate limits, CORS, cluster). `src/shared/config/env.js` validates them at boot and
**fails fast** on invalid config.
