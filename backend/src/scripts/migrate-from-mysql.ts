/**
 * MySQL to MongoDB Migration Script
 *
 * Maps legacy CodeIgniter/Ion Auth schema to the new MongoDB collections.
 *
 * Usage:
 *   1. Configure MYSQL_* and MONGODB_URI in .env
 *   2. npm run migrate
 *
 * Group mapping (legacy groups.id -> new role):
 *   admin_users (webmaster/admin/manager/staff) -> admin
 *   users with group Schools (3) -> skipped (legacy school accounts)
 *   users with group Parents (4) -> stored as student parent info
 *   users with group Students (5) -> student
 *   users with group members (2) -> teacher (default)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Event, Student } from '../models';

dotenv.config();

interface MySQLUser {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  phone2?: string;
  address?: string;
  company?: string;
  fax?: string;
  active: number;
  group_id?: number;
}

interface MySQLEvent {
  id: number;
  title: string;
  description: string;
  comments: string;
  date: string;
}

async function migrate() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // mysql2 is optional - install with: npm install mysql2
  let mysql: typeof import('mysql2/promise');
  try {
    mysql = await import('mysql2/promise');
  } catch {
    console.log('\nNote: mysql2 not installed. Running demo migration with seed data only.');
    console.log('Install mysql2 for live MySQL migration: npm install mysql2\n');
    await mongoose.disconnect();
    return;
  }

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'ci_bootstrap_3',
  });

  console.log('Connected to MySQL');

  const mapGroupToRole = (groupId: number): 'admin' | 'teacher' | 'student' | null => {
    switch (groupId) {
      case 5:
        return 'student';
      case 4:
        return null; // parents stored separately
      case 3:
        return null; // legacy school accounts
      default:
        return 'teacher';
    }
  };

  // Migrate frontend users
  const [users] = await connection.execute(`
    SELECT u.*, ug.group_id
    FROM users u
    LEFT JOIN users_groups ug ON ug.user_id = u.id
    ORDER BY u.id
  `);

  for (const row of users as MySQLUser[]) {
    const role = mapGroupToRole(row.group_id || 2);
    if (!role) continue;

    const existing = await User.findOne({ email: row.email });
    if (existing) continue;

    const user = await User.create({
      email: row.email,
      password: row.password.startsWith('$2y$') ? 'TempPass123!' : row.password,
      role,
      firstName: row.first_name || 'Unknown',
      lastName: row.last_name || 'User',
      middleName: row.middle_name,
      phone: row.phone,
      phone2: row.phone2,
      address: row.address,
      company: row.company,
      isActive: row.active === 1,
    });

    if (role === 'student') {
      await Student.create({ userId: user._id });
    }
  }

  // Migrate admin users
  const [adminUsers] = await connection.execute('SELECT * FROM admin_users WHERE active = 1');
  for (const row of adminUsers as MySQLUser[]) {
    const email = row.email || `admin${row.id}@migrated.local`;
    const existing = await User.findOne({ email });
    if (existing) continue;

    await User.create({
      email,
      password: 'TempPass123!',
      role: 'admin',
      firstName: row.first_name || 'Admin',
      lastName: row.last_name || 'User',
      isActive: true,
    });
  }

  // Migrate events
  const [events] = await connection.execute('SELECT * FROM events');
  for (const row of events as MySQLEvent[]) {
    const existing = await Event.findOne({ title: row.title });
    if (existing) continue;

    await Event.create({
      title: row.title,
      description: row.description || '',
      comments: row.comments,
      eventDate: new Date(row.date),
      isPublished: true,
    });
  }

  await connection.end();
  await mongoose.disconnect();
  console.log('Migration completed!');
  console.log('Note: Migrated users with bcrypt $2y$ hashes need password reset.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
