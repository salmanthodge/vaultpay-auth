import { Router } from 'express';
import { deviceRoutes } from './routes/device.routes.js';
import { deviceDocs } from './docs/index.js';

const router = Router();
router.use('/auth/devices', deviceRoutes);

export { router as deviceModule, deviceDocs };
