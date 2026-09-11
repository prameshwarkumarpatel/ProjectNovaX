import { Router, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { noticeSchema, eventSchema, gallerySchema, websiteContentSchema, settingsSchema } from '../schemas';
import {
  noticeController,
  eventController,
  galleryController,
  websiteContentController,
} from '../controllers/contentController';
import { Settings } from '../models/Settings';
import { WebsiteContent, ContentKey } from '../models/WebsiteContent';
import { sendSuccess, sendError } from '../utils/response';

interface CrudController {
  list: (req: AuthRequest, res: Response) => Promise<void>;
  getById: (req: AuthRequest, res: Response) => Promise<void>;
  create: (req: AuthRequest, res: Response) => Promise<void>;
  update: (req: AuthRequest, res: Response) => Promise<void>;
  remove: (req: AuthRequest, res: Response) => Promise<void>;
}

function makeCrudRoutes(
  router: Router,
  controller: CrudController,
  schema: ZodObject<ZodRawShape>,
  adminOnly = true
) {
  router.get('/', controller.list);
  router.get('/:id', controller.getById);

  if (adminOnly) {
    router.use(authenticate, authorize('admin'));
  }

  router.post('/', validateBody(schema), controller.create);
  router.put('/:id', validateBody(schema.partial()), controller.update);
  router.delete('/:id', controller.remove);
}

export const noticeRoutes = Router();
makeCrudRoutes(noticeRoutes, noticeController, noticeSchema);

export const eventRoutes = Router();
makeCrudRoutes(eventRoutes, eventController, eventSchema);

export const galleryRoutes = Router();
makeCrudRoutes(galleryRoutes, galleryController, gallerySchema);

export const websiteContentRoutes = Router();

websiteContentRoutes.get('/', websiteContentController.list);
websiteContentRoutes.get('/key/:key', async (req: AuthRequest, res: Response) => {
  const content = await WebsiteContent.findOne({ key: req.params.key as ContentKey });
  if (!content) {
    sendError(res, 'Content not found', 404);
    return;
  }
  sendSuccess(res, content);
});
websiteContentRoutes.get('/:id', websiteContentController.getById);

websiteContentRoutes.use(authenticate, authorize('admin'));
websiteContentRoutes.post('/', validateBody(websiteContentSchema), websiteContentController.create);
websiteContentRoutes.put('/:id', validateBody(websiteContentSchema.partial()), websiteContentController.update);
websiteContentRoutes.delete('/:id', websiteContentController.remove);

export const settingsRoutes = Router();

settingsRoutes.get('/', async (_req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  sendSuccess(res, settings);
});

settingsRoutes.use(authenticate, authorize('admin'));
settingsRoutes.put('/', validateBody(settingsSchema), async (req: AuthRequest, res: Response) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  sendSuccess(res, settings, 'Settings updated');
});
