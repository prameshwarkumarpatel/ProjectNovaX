import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { registerSchema, updateUserSchema } from '../schemas';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
} from '../controllers/userController';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', validateBody(registerSchema), createUser);
router.put('/:id', validateBody(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
