import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Teacher } from '../models/Teacher';
import { createCrudController } from './crudFactory';
import { sendSuccess, sendError, buildPaginationQuery, buildSearchFilter } from '../utils/response';

const baseCrud = createCrudController(Teacher, {
  searchFields: ['department', 'qualification', 'designation'],
});

export const listTeachers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page, limit, search, sortBy, sortOrder, skip } = buildPaginationQuery(req.query);
  const filter: Record<string, unknown> = buildSearchFilter(search, ['department', 'qualification', 'designation']);

  if (req.query.isPublished !== undefined) {
    filter.isPublished = req.query.isPublished === 'true';
  }

  const [teachers, total] = await Promise.all([
    Teacher.find(filter)
      .populate('userId', 'firstName lastName email phone avatar')
      .sort({ [sortBy || 'sortOrder']: sortOrder as 1 | -1 })
      .skip(skip)
      .limit(limit),
    Teacher.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: teachers,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getTeacher = baseCrud.getById;
export const deleteTeacher = baseCrud.remove;

export async function createTeacher(req: AuthRequest, res: Response): Promise<void> {
  const { email, password, firstName, lastName, ...teacherData } = req.body;

  if (!email || !password || !firstName || !lastName) {
    sendError(res, 'email, password, firstName, and lastName are required for new teachers', 400);
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    sendError(res, 'Email already exists', 409);
    return;
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: 'teacher',
  });

  const teacher = await Teacher.create({ ...teacherData, userId: user._id });
  await teacher.populate('userId', 'firstName lastName email phone avatar');
  sendSuccess(res, teacher, 'Teacher created', 201);
}

export async function updateTeacher(req: AuthRequest, res: Response): Promise<void> {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    sendError(res, 'Teacher not found', 404);
    return;
  }

  const { firstName, lastName, email, password, phone, ...teacherData } = req.body;
  Object.assign(teacher, teacherData);
  await teacher.save();

  if (firstName || lastName || email || password || phone) {
    const user = await User.findById(teacher.userId);
    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (password) user.password = password;
      if (phone) user.phone = phone;
      await user.save();
    }
  }

  await teacher.populate('userId', 'firstName lastName email phone avatar');
  sendSuccess(res, teacher, 'Teacher updated');
}
