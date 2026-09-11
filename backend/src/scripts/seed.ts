import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  User,
  Teacher,
  Student,
  Event,
  Notice,
  Gallery,
  WebsiteContent,
  Settings,
  Admission,
} from '../models';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Teacher.deleteMany({}),
    Student.deleteMany({}),
    Event.deleteMany({}),
    Notice.deleteMany({}),
    Gallery.deleteMany({}),
    WebsiteContent.deleteMany({}),
    Settings.deleteMany({}),
    Admission.deleteMany({}),
  ]);

  const admin = await User.create({
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
    isActive: true,
  });

  const teacherUser = await User.create({
    email: 'teacher@school.edu',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1 555 0101',
    isActive: true,
  });

  await Teacher.create({
    userId: teacherUser._id,
    department: 'Mathematics',
    qualification: 'M.Sc Mathematics',
    designation: 'Senior Teacher',
    bio: 'Passionate educator with 10+ years of experience.',
    isPublished: true,
    sortOrder: 1,
  });

  const studentUser = await User.create({
    email: 'student@school.edu',
    password: 'student123',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 555 0202',
    isActive: true,
  });

  await Student.create({
    userId: studentUser._id,
    rollNumber: 'STU-001',
    className: '10',
    section: 'A',
    parentName: 'Robert Doe',
    parentEmail: 'parent@example.com',
    parentPhone: '+1 555 0303',
    admissionDate: new Date('2023-06-01'),
    gender: 'male',
  });

  await Event.create([
    {
      title: 'Annual Sports Day',
      description: 'Join us for our annual sports day celebration with various athletic events.',
      eventDate: new Date('2026-08-15'),
      location: 'School Ground',
      isPublished: true,
    },
    {
      title: 'Science Exhibition',
      description: 'Students showcase innovative science projects and experiments.',
      eventDate: new Date('2026-09-20'),
      location: 'Main Hall',
      isPublished: true,
    },
  ]);

  await Notice.create([
    {
      title: 'School Reopening Notice',
      content: 'School will reopen on June 15th. All students must report by 8:00 AM.',
      priority: 'high',
      isPublished: true,
      createdBy: admin._id,
    },
    {
      title: 'Parent-Teacher Meeting',
      content: 'PTM scheduled for last Saturday of the month. Please confirm attendance.',
      priority: 'medium',
      isPublished: true,
      createdBy: admin._id,
    },
  ]);

  await Gallery.create([
    {
      title: 'Campus View',
      description: 'Beautiful view of our school campus',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      category: 'campus',
      sortOrder: 1,
      isPublished: true,
    },
    {
      title: 'Library',
      description: 'State-of-the-art library facility',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
      category: 'facilities',
      sortOrder: 2,
      isPublished: true,
    },
  ]);

  await WebsiteContent.create([
    {
      key: 'home_hero',
      title: 'Welcome to Pro School',
      subtitle: 'Excellence in Education Since 1990',
      content:
        'We nurture young minds to become future leaders through quality education, innovative teaching, and holistic development.',
    },
    {
      key: 'about_school',
      title: 'About Our School',
      content:
        'Pro School is a premier educational institution committed to academic excellence and character building. Our dedicated faculty and modern facilities create an ideal learning environment.',
    },
    {
      key: 'principal_message',
      title: 'Message from the Principal',
      content:
        'Dear Students and Parents, it is my privilege to lead this institution. We strive to provide every child with opportunities to discover their potential and achieve their dreams.',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    {
      key: 'contact_info',
      title: 'Contact Us',
      content: 'Reach out to us for admissions, inquiries, or any assistance.',
      metadata: { mapEmbed: 'https://maps.google.com' },
    },
    {
      key: 'admissions_info',
      title: 'Admissions Open',
      content:
        'We welcome applications for the new academic year. Submit your application online or visit our admissions office.',
    },
  ]);

  await Settings.create({
    siteName: 'Pro School Management',
    tagline: 'Excellence in Education',
    contactEmail: 'info@school.edu',
    contactPhone: '+1 234 567 8900',
    address: '123 Education Street, Learning City, LC 12345',
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
    },
    footerText: '© 2026 Pro School Management. All rights reserved.',
  });

  await Admission.create({
    studentFirstName: 'Emily',
    studentLastName: 'Johnson',
    classApplying: '6',
    parentName: 'Michael Johnson',
    parentEmail: 'mjohnson@example.com',
    parentPhone: '+1 555 0404',
    status: 'pending',
  });

  console.log('\nSeed completed successfully!\n');
  console.log('Default credentials:');
  console.log('  Admin:   admin@school.edu / admin123');
  console.log('  Teacher: teacher@school.edu / teacher123');
  console.log('  Student: student@school.edu / student123');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
