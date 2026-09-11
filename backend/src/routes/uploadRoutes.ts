import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { uploadFile } from '../controllers/uploadController';

const router = Router();

router.post('/', authenticate, authorize('admin'), upload.single('file'), uploadFile);

export default router;
