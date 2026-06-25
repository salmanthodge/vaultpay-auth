import { Router } from 'express';
import { authRoutes } from './routes/auth.routes.js';
import { authDocs } from './docs/index.js';

const router = Router();
router.use('/auth', authRoutes);

export { router as authModule, authDocs };
