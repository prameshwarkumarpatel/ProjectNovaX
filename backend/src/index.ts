import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import teacherRoutes from './routes/teacherRoutes';
import studentRoutes from './routes/studentRoutes';
import admissionRoutes from './routes/admissionRoutes';
import {
  noticeRoutes,
  eventRoutes,
  galleryRoutes,
  websiteContentRoutes,
  settingsRoutes,
} from './routes/contentRoutes';
import publicRoutes from './routes/publicRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/website-content', websiteContentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Swagger docs: http://localhost:${env.port}/api-docs`);
  });
}

start();

export default app;
