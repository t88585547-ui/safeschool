import { Router } from 'express';
import * as incidentController from '../controllers/incidentController';
import { sosLimiter } from '../middlewares/rateLimiter';
import { upload } from '../middlewares/upload';

const router = Router();

// POST /api/v1/incidents - Create new incident report
router.post('/', upload.single('image_before'), incidentController.createIncident);

// POST /api/v1/incidents/sos - Create SOS emergency
router.post('/sos', sosLimiter, upload.single('image_before'), incidentController.createSOSIncident);

// GET /api/v1/incidents/track/:code - Get incident by tracking code
router.get('/track/:code', incidentController.trackIncident);

// POST /api/v1/incidents/track/:code/chat - Send anonymous message reply
router.post('/track/:code/chat', upload.single('attachment'), incidentController.addChatMessage);

export default router;
