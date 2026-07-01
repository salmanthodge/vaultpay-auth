import { readFileSync } from 'node:fs';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './shared/config/env.js';
import { pingDatabase } from './shared/config/database.js';
import { redis } from './shared/config/redis.js';
import { swaggerServe, swaggerSetup, buildOpenApiSpec } from './shared/config/swagger.js';
import { requestLogger, response, notFound, errorHandler } from './shared/middleware/index.js';
import { asyncHandler } from './shared/utils/asyncHandler.js';
import { modules } from './modules/index.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

/**
 * Builds and returns the Express app. Does NOT listen — server.js owns that
 * (rules/01). Wires hardening, parsers, the response envelope, health, swagger,
 * all module routers, and the centralized 404 + error handlers.
 */
export const buildApp = () => {
  const app = express();

  // behind the gateway/proxy — trust X-Forwarded-* for correct client IPs
  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // hardening (rules/05)
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));

  // parsers (body size limit guards against oversized payloads)
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(cookieParser());

  // per-request logging + correlation id + AsyncLocalStorage context (rules/03).
  // Placed after body parsing so the request payload can be logged (secrets redacted),
  // before modules so every route + its db calls + steps log under one requestId.
  app.use(requestLogger);

  // standard response envelope helpers (res.success/created/noContent)
  app.use(response);

  // ---- health (rich, with dependency checks) ----
  app.get(
    '/health',
    asyncHandler(async (_req, res) => {
      const startedAt = process.hrtime.bigint();
      const [dbOk, redisOk] = await Promise.all([
        pingDatabase().then(() => true).catch(() => false),
        redis
          .ping()
          .then((r) => r === 'PONG')
          .catch(() => false),
      ]);
      const healthy = dbOk && redisOk;
      const mem = process.memoryUsage();
      const toMb = (bytes) => Math.round((bytes / 1024 / 1024) * 100) / 100;

      res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        service: env.SERVICE_NAME,
        version: pkg.version,
        environment: env.NODE_ENV,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        pid: process.pid,
        node: process.version,
        checks: {
          database: dbOk ? 'up' : 'down',
          redis: redisOk ? 'up' : 'down',
        },
        memoryMb: { rss: toMb(mem.rss), heapUsed: toMb(mem.heapUsed), heapTotal: toMb(mem.heapTotal) },
        responseTimeMs: Number((process.hrtime.bigint() - startedAt) / 1000000n),
      });
    }),
  );

  // ---- API docs ----
  app.use('/docs', swaggerServe, swaggerSetup);
  app.get('/openapi.json', (_req, res) => res.json(buildOpenApiSpec()));

  // ---- modules ----
  app.use(modules);

  // ---- 404 + centralized errors (must be last) ----
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
