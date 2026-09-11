import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { studentSchema } from '../schemas';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listStudents);
router.get('/:id', getStudent);
router.post('/', validateBody(studentSchema), createStudent);
router.put('/:id', validateBody(studentSchema.partial()), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
