import swaggerUi from 'swagger-ui-express';
import { env } from './env.js';
import { moduleDocs } from '../../modules/index.js';

/** Assembles the OpenAPI spec from per-endpoint docs fragments (rules/07). */
export const buildOpenApiSpec = () => ({
  openapi: '3.0.3',
  info: {
    title: 'VaultPay Auth Service',
    version: '1.0.0',
    description:
      'Customer JWT auth, OAuth, MFA, devices, admin sessions, RBAC and S2S tokens.',
  },
  servers: [{ url: `http://localhost:${env.PORT}` }],
  paths: moduleDocs,
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      cookieAuth: { type: 'apiKey', in: 'cookie', name: env.SESSION_COOKIE_NAME },
    },
  },
});

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(buildOpenApiSpec(), {
  customSiteTitle: 'VaultPay Auth API',
});
