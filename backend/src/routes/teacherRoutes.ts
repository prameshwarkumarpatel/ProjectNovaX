import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { teacherSchema } from '../schemas';
import {
  listTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacherController';

const router = Router();

router.get('/', listTeachers);
router.get('/:id', getTeacher);

router.use(authenticate, authorize('admin'));
router.post('/', validateBody(teacherSchema), createTeacher);
router.put('/:id', validateBody(teacherSchema.partial()), updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
