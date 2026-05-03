import { Router } from 'express';
import { addMonitor, getMyMonitors } from '../controllers/monitor.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const monitorSchema = z.object({
  url: z.string().url(),
  interval: z.number().min(10),
});

// Pehle authenticate hoga, phir data validate hoga, phir controller chalega
router.post('/', authenticate, validate(monitorSchema), addMonitor);
router.get('/', authenticate, getMyMonitors);

export default router;
