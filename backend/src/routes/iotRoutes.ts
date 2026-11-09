import { Router } from 'express';
import * as iotController from '../controllers/iotController';
import { iotLimiter } from '../middlewares/rateLimiter';

const router = Router();

// POST /api/v1/iot/webhook - Receive IoT sensor alerts
router.post('/webhook', iotLimiter, iotController.webhook);

export default router;
