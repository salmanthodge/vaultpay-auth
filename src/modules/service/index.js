import { Router } from 'express';
import { serviceRoutes } from './routes/service.routes.js';
import { serviceDocs } from './docs/index.js';

const router = Router();
router.use('/service', serviceRoutes);

export { router as serviceModule, serviceDocs };
