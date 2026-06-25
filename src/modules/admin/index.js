import { Router } from 'express';
import { adminRoutes } from './routes/admin.routes.js';
import { adminDocs } from './docs/index.js';

const router = Router();
router.use('/admin/auth', adminRoutes);

export { router as adminModule, adminDocs };
