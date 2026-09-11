import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { admissionSchema, admissionUpdateSchema } from '../schemas';
import {
  listAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from '../controllers/admissionController';

const router = Router();

router.post('/', validateBody(admissionSchema), createAdmission);

router.use(authenticate, authorize('admin'));
router.get('/', listAdmissions);
router.get('/:id', getAdmission);
router.put('/:id', validateBody(admissionUpdateSchema), updateAdmission);
router.delete('/:id', deleteAdmission);

export default router;
