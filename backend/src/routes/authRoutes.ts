import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authGuard, requireRole } from '../middlewares/authGuard';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

// POST /api/v1/auth/login - Staff login
router.post('/login', authLimiter, authController.login);

// POST /api/v1/auth/register - Register new user (admin only)
router.post('/register', authGuard, requireRole('ADMIN'), authController.register);

export default router;
