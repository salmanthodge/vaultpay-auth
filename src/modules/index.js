import { Router } from 'express';
import { authModule, authDocs } from './auth/index.js';
import { oauthModule, oauthDocs } from './oauth/index.js';
import { mfaModule, mfaDocs } from './mfa/index.js';
import { deviceModule, deviceDocs } from './device/index.js';
import { adminModule, adminDocs } from './admin/index.js';
import { roleModule, roleDocs } from './role/index.js';
import { serviceModule, serviceDocs } from './service/index.js';

const router = Router();
router.use(authModule);
router.use(oauthModule);
router.use(mfaModule);
router.use(deviceModule);
router.use(adminModule);
router.use(roleModule);
router.use(serviceModule);

/** Mounted router for all modules + aggregated OpenAPI paths (rules/01, rules/07). */
export { router as modules };
export const moduleDocs = {
  ...authDocs,
  ...oauthDocs,
  ...mfaDocs,
  ...deviceDocs,
  ...adminDocs,
  ...roleDocs,
  ...serviceDocs,
};
