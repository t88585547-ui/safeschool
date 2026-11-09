import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authGuard, staffGuard } from '../middlewares/authGuard';
import { upload } from '../middlewares/upload';

const router = Router();

// All admin routes require authentication + staff role
router.use(authGuard, staffGuard);

// GET /api/v1/admin/incidents - List all incidents with filters
router.get('/incidents', adminController.listIncidents);

// PATCH /api/v1/admin/incidents/:id/status - Update incident status
router.patch('/incidents/:id/status', upload.single('image_after'), adminController.updateIncidentStatus);

// GET /api/v1/admin/users - List all users
router.get('/users', adminController.listUsers);

export default router;
