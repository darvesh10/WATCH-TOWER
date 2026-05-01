import { Router } from 'express';
import { register, login } from '../controllers/auth.Controller.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const authSchema = z.object({
  email: z.string(),
  password: z.string().min(4),
});

router.post('/register', validate(authSchema), register);
router.post('/login', validate(authSchema), login);

export default router;
