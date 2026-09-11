import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'teacher', 'student']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
});

export const updateUserSchema = registerSchema.partial().omit({ password: true }).extend({
  password: z.string().min(6).optional(),
  isActive: z.boolean().optional(),
});

export const teacherSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  department: z.string().optional(),
  qualification: z.string().optional(),
  bio: z.string().optional(),
  photo: z.string().optional(),
  designation: z.string().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const studentSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  address: z.string().optional(),
  rollNumber: z.string().optional(),
  className: z.string().optional(),
  section: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional(),
  parentPhone: z.string().optional(),
  admissionDate: z.coerce.date().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  isActive: z.boolean().optional(),
});

export const admissionSchema = z.object({
  studentFirstName: z.string().min(1),
  studentLastName: z.string().min(1),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  classApplying: z.string().min(1),
  parentName: z.string().min(1),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(1),
  address: z.string().optional(),
  previousSchool: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

export const admissionUpdateSchema = admissionSchema.partial().extend({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  notes: z.string().optional(),
});

export const noticeSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  publishDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  isPublished: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  attachment: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  comments: z.string().optional(),
  eventDate: z.coerce.date(),
  location: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().min(1),
  category: z.string().optional(),
  sortOrder: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export const websiteContentSchema = z.object({
  key: z.enum(['home_hero', 'about_school', 'principal_message', 'contact_info', 'admissions_info']),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  footerText: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});
