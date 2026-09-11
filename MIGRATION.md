# Migration Guide: CodeIgniter (MySQL) → Next.js + Express (MongoDB)

This document describes how to migrate from the legacy PHP CodeIgniter application in `school-management/` to the new stack.

## Analysis Summary

### Legacy Application (CodeIgniter 3 + HMVC)

The original project is based on **CI Bootstrap 3** with Ion Auth authentication. School-specific features were partially implemented:

| Legacy Module | Status in PHP | New Implementation |
|---------------|---------------|-------------------|
| Home | Minimal placeholder view | Full landing page with hero, notices, events |
| About School | Not implemented | Website Content (`about_school`) |
| Principal Message | Not implemented | Website Content (`principal_message`) |
| Teachers | Not implemented | `Teacher` model + public `/teachers` |
| Gallery | Not implemented | `Gallery` collection + admin CRUD |
| Events | Basic CRUD in admin | Full public + admin with images |
| Notices | Not implemented | `Notice` collection |
| Contact | Not implemented | Contact form + settings |
| Admissions | Not implemented | `Admission` workflow |
| Admin: Students | Users with STUDENT group | `Student` profile + User |
| Admin: Events | DataTables AJAX CRUD | REST API + React admin |

### Legacy MySQL Tables → MongoDB Collections

| MySQL Table | MongoDB Collection | Notes |
|-------------|-------------------|-------|
| `users` + `users_groups` | `users` + `students`/`teachers` | Role embedded in user |
| `admin_users` | `users` (role: admin) | Unified user model |
| `events` | `events` | Enhanced schema |
| *(new)* | `notices`, `gallery`, `admissions`, `websitecontents`, `settings` | New modules |

### Group ID Mapping

```
ADMINISTRATOR = 1  → admin
MEMBER = 2         → teacher
SCHOOL = 3         → skipped
PARENT = 4         → parent info on student/admission
STUDENT = 5        → student
```

---

## Migration Steps

### Step 1: Set Up New Stack

```bash
docker compose up mongodb -d
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && cp .env.example .env.local && npm install && npm run dev
```

### Step 2: Seed or Migrate Data

**Option A — Demo data:**

```bash
cd backend && npm run seed
```

**Option B — Migrate from MySQL:**

```bash
mysql -u root -p ci_bootstrap_3 < school-management/sql/latest.sql
# Configure MYSQL_* in backend/.env
npm install mysql2
npm run migrate
```

Migrated users with PHP `$2y$` hashes get temporary password `TempPass123!`.

### Step 3: Configure Production

- Set strong `JWT_SECRET`
- Configure Cloudinary for uploads
- Set `CORS_ORIGIN` to frontend domain

---

## Default Credentials (After Seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | admin123 |

---

## Post-Migration Checklist

- [ ] Run seed or MySQL migration
- [ ] Verify admin login at `/admin/login`
- [ ] Reset passwords for migrated users
- [ ] Populate website content
- [ ] Configure Cloudinary
- [ ] Decommission legacy PHP after validation
