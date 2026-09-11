import { Request, Response } from 'express';
import { ContentKey } from '../models/WebsiteContent';
import { Notice, Event, Gallery, WebsiteContent, Settings, Teacher } from '../models';
import { sendSuccess } from '../utils/response';

export async function getPublicHome(_req: Request, res: Response): Promise<void> {
  const [hero, notices, events, settings] = await Promise.all([
    WebsiteContent.findOne({ key: 'home_hero' }),
    Notice.find({ isPublished: true })
      .sort({ publishDate: -1 })
      .limit(5),
    Event.find({ isPublished: true })
      .sort({ eventDate: -1 })
      .limit(3),
    Settings.findOne(),
  ]);

  sendSuccess(res, { hero, notices, events, settings });
}

export async function getPublicContent(req: Request, res: Response): Promise<void> {
  const content = await WebsiteContent.findOne({ key: req.params.key as ContentKey });
  sendSuccess(res, content);
}

export async function getPublicTeachers(_req: Request, res: Response): Promise<void> {
  const teachers = await Teacher.find({ isPublished: true })
    .populate('userId', 'firstName lastName email phone avatar')
    .sort({ sortOrder: 1 });
  sendSuccess(res, teachers);
}

export async function getPublicNotices(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const limit = Math.min(50, parseInt(String(req.query.limit || '10'), 10));
  const skip = (page - 1) * limit;

  const filter = { isPublished: true };
  const [data, total] = await Promise.all([
    Notice.find(filter).sort({ publishDate: -1 }).skip(skip).limit(limit),
    Notice.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getPublicEvents(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const limit = Math.min(50, parseInt(String(req.query.limit || '10'), 10));
  const skip = (page - 1) * limit;

  const filter = { isPublished: true };
  const [data, total] = await Promise.all([
    Event.find(filter).sort({ eventDate: -1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getPublicGallery(req: Request, res: Response): Promise<void> {
  const filter: Record<string, unknown> = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;

  const gallery = await Gallery.find(filter).sort({ sortOrder: 1 });
  sendSuccess(res, gallery);
}

export async function getPublicSettings(_req: Request, res: Response): Promise<void> {
  const settings = await Settings.findOne();
  sendSuccess(res, settings);
}

export async function submitContact(req: Request, res: Response): Promise<void> {
  // In production, integrate with email service
  console.log('Contact form submission:', req.body);
  sendSuccess(res, null, 'Thank you for contacting us. We will respond shortly.');
}
