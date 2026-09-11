import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { sendSuccess, sendError, buildPaginationQuery, buildSearchFilter } from '../utils/response';

export async function listStudents(req: AuthRequest, res: Response): Promise<void> {
  const { page, limit, search, sortBy, sortOrder, skip } = buildPaginationQuery(req.query);
  const filter: Record<string, unknown> = buildSearchFilter(search, ['rollNumber', 'className', 'section', 'parentName']);

  if (req.query.className) filter.className = req.query.className;
  if (req.query.section) filter.section = req.query.section;

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate('userId', 'firstName lastName middleName email phone phone2 address isActive')
      .sort({ [sortBy || 'createdAt']: sortOrder as 1 | -1 })
      .skip(skip)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: students,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getStudent(req: AuthRequest, res: Response): Promise<void> {
  const student = await Student.findById(req.params.id).populate(
    'userId',
    'firstName lastName middleName email phone phone2 address isActive'
  );
  if (!student) {
    sendError(res, 'Student not found', 404);
    return;
  }
  sendSuccess(res, student);
}

export async function createStudent(req: AuthRequest, res: Response): Promise<void> {
  const { email, password, firstName, lastName, middleName, phone, phone2, address, ...studentData } = req.body;

  if (!email || !password || !firstName || !lastName) {
    sendError(res, 'email, password, firstName, and lastName are required', 400);
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
    middleName,
    phone,
    phone2,
    address,
    role: 'student',
  });

  const student = await Student.create({ ...studentData, userId: user._id });
  await student.populate('userId', 'firstName lastName middleName email phone phone2 address isActive');
  sendSuccess(res, student, 'Student created', 201);
}

export async function updateStudent(req: AuthRequest, res: Response): Promise<void> {
  const student = await Student.findById(req.params.id);
  if (!student) {
    sendError(res, 'Student not found', 404);
    return;
  }

  const { firstName, lastName, middleName, email, password, phone, phone2, address, isActive, ...studentData } =
    req.body;
  Object.assign(student, studentData);
  await student.save();

  const user = await User.findById(student.userId);
  if (user) {
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (middleName !== undefined) user.middleName = middleName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (phone !== undefined) user.phone = phone;
    if (phone2 !== undefined) user.phone2 = phone2;
    if (address !== undefined) user.address = address;
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();
  }

  await student.populate('userId', 'firstName lastName middleName email phone phone2 address isActive');
  sendSuccess(res, student, 'Student updated');
}

export async function deleteStudent(req: AuthRequest, res: Response): Promise<void> {
  const student = await Student.findById(req.params.id);
  if (!student) {
    sendError(res, 'Student not found', 404);
    return;
  }
  await User.findByIdAndDelete(student.userId);
  await student.deleteOne();
  sendSuccess(res, null, 'Student deleted');
}
