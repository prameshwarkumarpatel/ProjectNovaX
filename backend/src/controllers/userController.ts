import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { sendSuccess, sendError, buildPaginationQuery, buildSearchFilter } from '../utils/response';

export async function listUsers(req: AuthRequest, res: Response): Promise<void> {
  const { page, limit, search, sortBy, sortOrder, skip } = buildPaginationQuery(req.query);
  const role = req.query.role as string | undefined;

  const filter: Record<string, unknown> = {
    ...buildSearchFilter(search, ['firstName', 'lastName', 'email', 'phone']),
  };
  if (role) filter.role = role;

  const [data, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ [sortBy]: sortOrder as 1 | -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getUser(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }
  sendSuccess(res, user);
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    sendError(res, 'Email already exists', 409);
    return;
  }
  const user = await User.create(req.body);
  const obj = user.toObject();
  delete (obj as { password?: string }).password;
  sendSuccess(res, obj, 'User created', 201);
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.params.id);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }

  if (req.body.email && req.body.email !== user.email) {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      sendError(res, 'Email already exists', 409);
      return;
    }
  }

  Object.assign(user, req.body);
  await user.save();

  const obj = user.toObject();
  delete (obj as { password?: string }).password;
  sendSuccess(res, obj, 'User updated');
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }
  sendSuccess(res, null, 'User deleted');
}

export async function getDashboardStats(_req: AuthRequest, res: Response): Promise<void> {
  const { Student } = await import('../models/Student');
  const { Teacher } = await import('../models/Teacher');
  const { Admission } = await import('../models/Admission');
  const { Event } = await import('../models/Event');
  const { Notice } = await import('../models/Notice');
  const { Gallery } = await import('../models/Gallery');

  const [students, teachers, pendingAdmissions, events, notices, gallery] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Admission.countDocuments({ status: 'pending' }),
    Event.countDocuments(),
    Notice.countDocuments({ isPublished: true }),
    Gallery.countDocuments(),
  ]);

  sendSuccess(res, {
    students,
    teachers,
    pendingAdmissions,
    events,
    notices,
    gallery,
  });
}
