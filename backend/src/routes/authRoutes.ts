import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '../schemas';
import { z } from 'zod';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, getMe);
router.put(
  '/change-password',
  authenticate,
  validateBody(
    z.object({
      currentPassword: z.string().min(6),
      newPassword: z.string().min(6),
    })
  ),
  changePassword
);

export default router;
