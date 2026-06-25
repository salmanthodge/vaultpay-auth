import { Router } from 'express';
import { oauthRoutes } from './routes/oauth.routes.js';
import { oauthDocs } from './docs/index.js';

const router = Router();
router.use('/auth/oauth', oauthRoutes);

export { router as oauthModule, oauthDocs };
