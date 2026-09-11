import { Router } from 'express';
import {
  getPublicHome,
  getPublicContent,
  getPublicTeachers,
  getPublicNotices,
  getPublicEvents,
  getPublicGallery,
  getPublicSettings,
  submitContact,
} from '../controllers/publicController';
import { validateBody } from '../middleware/validate';
import { contactSchema } from '../schemas';

const router = Router();

router.get('/home', getPublicHome);
router.get('/content/:key', getPublicContent);
router.get('/teachers', getPublicTeachers);
router.get('/notices', getPublicNotices);
router.get('/events', getPublicEvents);
router.get('/gallery', getPublicGallery);
router.get('/settings', getPublicSettings);
router.post('/contact', validateBody(contactSchema), submitContact);

export default router;
