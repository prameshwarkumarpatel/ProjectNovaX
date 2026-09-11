import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

export function saveFileLocally(
  buffer: Buffer,
  folder: string,
  originalName?: string
): { url: string; publicId: string; localPath: string } {
  const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '') || 'gallery';
  const uploadDir = path.join(UPLOAD_ROOT, safeFolder);
  fs.mkdirSync(uploadDir, { recursive: true });

  const ext = path.extname(originalName || '') || '.jpg';
  const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${safeFolder}/${filename}`,
    publicId: filename,
    localPath: filePath,
  };
}

export function isCloudinaryConfigured(cloudName: string): boolean {
  return Boolean(cloudName && cloudName !== 'your_cloud_name');
}
