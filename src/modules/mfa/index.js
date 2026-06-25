import { Router } from 'express';
import { mfaRoutes } from './routes/mfa.routes.js';
import { mfaDocs } from './docs/index.js';

const router = Router();
router.use('/auth/mfa', mfaRoutes);

export { router as mfaModule, mfaDocs };
