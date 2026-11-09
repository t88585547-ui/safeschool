import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authGuard, staffGuard } from '../middlewares/authGuard';

const router = Router();

// All analytics routes require authentication + staff role
router.use(authGuard, staffGuard);

// GET /api/v1/admin/analytics/heatmap - Get heatmap data + statistics
router.get('/heatmap', analyticsController.getHeatmap);

export default router;
