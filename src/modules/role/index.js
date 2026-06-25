import { Router } from 'express';
import { roleRoutes } from './routes/role.routes.js';
import { roleDocs } from './docs/index.js';

const router = Router();
router.use('/', roleRoutes);

export { router as roleModule, roleDocs };
