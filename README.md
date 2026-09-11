Pro School Management System

Modern full-stack school management platform migrated from PHP CodeIgniter to Next.js + Express + MongoDB.

Architecture
Layer	Technology
Frontend	Next.js 15 (App Router), TypeScript, Tailwind CSS, TanStack Query, Zod
Backend	Node.js, Express.js, TypeScript, Mongoose
Database	MongoDB
Auth	JWT + RBAC (Admin, Teacher, Student)
File Upload	Cloudinary
API Docs	Swagger UI
Containers	Docker Compose
Project Structure
├── frontend/          # Next.js public site + admin panel
│   ├── app/           # App Router pages
│   ├── components/    # UI, layout, admin components
│   ├── hooks/         # Auth hook
│   ├── lib/           # API client, utils, types
│   └── services/      # API service layer
├── backend/           # Express REST API
│   └── src/
│       ├── config/    # DB, env, Swagger
│       ├── controllers/
│       ├── models/    # Mongoose schemas
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       └── scripts/   # Seed & migration
├── school-management/ # Legacy PHP CodeIgniter app (reference)
└── docker-compose.yml

Quick Start (Local Development)
Prerequisites
Node.js 20+
MongoDB 7+ running locally OR Docker (optional)

No Docker? If Docker is not installed, you can run the application using a local MongoDB installation.

Option A — Local MongoDB

1. Start MongoDB

Keep this terminal open:

mongod


2. One-time setup + seed

cd backend
copy .env.example .env
npm install
npm run seed

cd ..\frontend
copy .env.example .env.local
npm install


3. Start both servers

Run them in two terminals:

# Terminal 2
cd backend
npm run dev

# Terminal 3
cd frontend
npm run dev


Or use the helper script from the project root:

.\start-local.ps1


4. Open in browser

URL	Purpose
http://localhost:3000	Public website
http://localhost:3000/admin/login	Admin panel
http://localhost:5000/api-docs	Swagger API docs
Option B — With Docker

Requires Docker Desktop to be installed and running.

docker compose up --build

Backend Only
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev


Backend API:

http://localhost:5000


Swagger API docs:

http://localhost:5000/api-docs

Frontend Only
cd frontend
cp .env.example .env.local
npm install
npm run dev


Frontend:

http://localhost:3000

Docker
# From project root
cp backend/.env.example backend/.env


Set JWT_SECRET and optional Cloudinary credentials in backend/.env.

Then run:

docker compose up --build


Services:

Frontend: http://localhost:3000
Backend API: http://localhost:5000
MongoDB: localhost:27017

Seed the database after containers start:

docker compose exec backend npm run seed


Or run the seed locally against Docker MongoDB:

cd backend
MONGODB_URI=mongodb://localhost:27017/school_management npm run seed

Features
Public Website
Home
About
Principal Message
Teachers
Gallery
Events
Notices
Admissions
Contact
Admin Panel (/admin)
Dashboard with statistics
Student management
Teacher management
User management
Admissions workflow
Notice management
Event management
Gallery management
Website content management
Site settings
API
RESTful endpoints under /api/*
JWT authentication
Role-based access control
Pagination
Search and filters
Zod validation
Swagger documentation
Migration from Legacy PHP

See MIGRATION.md for detailed MySQL → MongoDB migration instructions.

Environment Variables
Backend (backend/.env)
Variable	Description
MONGODB_URI	MongoDB connection string
JWT_SECRET	Secret for signing JWT tokens
CORS_ORIGIN	Frontend URL
CLOUDINARY_*	Cloudinary credentials for file uploads
Frontend (frontend/.env.local)
Variable	Description
NEXT_PUBLIC_API_URL	Backend API URL
License

ISC

# Pro School Management System

Modern full-stack school management platform migrated from PHP CodeIgniter to Next.js + Express + MongoDB.

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, TanStack Query, Zod |
| Backend | Node.js, Express.js, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT + RBAC (Admin, Teacher, Student) |
| File Upload | Cloudinary |
| API Docs | Swagger UI |
| Containers | Docker Compose |

## Project Structure

```
├── frontend/          # Next.js public site + admin panel
│   ├── app/           # App Router pages
│   ├── components/    # UI, layout, admin components
│   ├── hooks/         # Auth hook
│   ├── lib/           # API client, utils, types
│   └── services/      # API service layer
├── backend/           # Express REST API
│   └── src/
│       ├── config/    # DB, env, Swagger
│       ├── controllers/
│       ├── models/    # Mongoose schemas
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       └── scripts/   # Seed & migration
├── school-management/ # Legacy PHP CodeIgniter app (reference)
└── docker-compose.yml
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- MongoDB 7+ running locally **OR** Docker (optional)

> **No Docker?** If `docker` is not installed, you already have what you need as long as MongoDB is running (`mongod` in a terminal). Skip Docker steps below.

### Option A — Local MongoDB (recommended on Windows without Docker)

**1. Start MongoDB** (keep this terminal open):

```powershell
mongod
```

**2. One-time setup + seed:**

```powershell
cd backend
copy .env.example .env    # skip if .env already exists
npm install
npm run seed

cd ..\frontend
copy .env.example .env.local
npm install
```

**3. Start both servers** — either run manually in two terminals:

```powershell
# Terminal 2
cd backend
npm run dev

# Terminal 3
cd frontend
npm run dev
```

Or use the helper script from the project root:

```powershell
.\start-local.ps1
```

**4. Open in browser:**

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Public website |
| http://localhost:3000/admin/login | Admin panel |
| http://localhost:5000/api-docs | Swagger API docs |

### Option B — With Docker (optional)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
docker compose up --build
```

### Backend only (manual)

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # Seed MongoDB with demo data
npm run dev     # http://localhost:5000
```

Swagger API docs: http://localhost:5000/api-docs

### Frontend only (manual)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev     # http://localhost:3000
```

### Legacy quick start (combined)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev     # http://localhost:3000
```



## Docker

```bash
# From project root
cp backend/.env.example backend/.env
# Set JWT_SECRET and optional Cloudinary keys in backend/.env

docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

Seed the database after containers start:

```bash
docker compose exec backend node -e "require('child_process').execSync('npm run seed', {stdio:'inherit'})"
```

Or run seed locally against Docker MongoDB:

```bash
cd backend && MONGODB_URI=mongodb://localhost:27017/school_management npm run seed
```

## Features

### Public Website
- Home, About, Principal Message, Teachers, Gallery, Events, Notices, Admissions, Contact

### Admin Panel (`/admin`)
- Dashboard with statistics
- Student, Teacher, User management
- Admissions workflow (pending/approved/rejected)
- Notice, Event, Gallery CRUD
- Website content management
- Site settings

### API
- RESTful endpoints under `/api/*`
- JWT authentication
- Role-based access control
- Pagination, search, filters
- Zod validation
- Swagger documentation

## Migration from Legacy PHP

See [MIGRATION.md](./MIGRATION.md) for detailed MySQL → MongoDB migration instructions.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `CORS_ORIGIN` | Frontend URL (default: http://localhost:3000) |
| `CLOUDINARY_*` | Cloudinary credentials for file uploads |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:5000) |

## License

ISC
