import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { saveFileLocally, isCloudinaryConfigured } from '../services/localUploadService';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';

function buildPublicUrl(req: AuthRequest, relativePath: string): string {
  const host = req.get('host') || `localhost:${env.port}`;
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}${relativePath}`;
}

export async function uploadFile(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    sendError(res, 'No file uploaded', 400);
    return;
  }

  const folder = (req.body.folder as string) || 'gallery';

  try {
    if (isCloudinaryConfigured(env.cloudinary.cloudName)) {
      const result = await uploadToCloudinary(req.file.buffer, folder);
      sendSuccess(res, { ...result, storage: 'cloudinary' }, 'File uploaded successfully');
      return;
    }

    const result = saveFileLocally(req.file.buffer, folder, req.file.originalname);
    sendSuccess(
      res,
      {
        url: buildPublicUrl(req, result.url),
        publicId: result.publicId,
        storage: 'local',
      },
      'File uploaded successfully (local storage)'
    );
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : 'Upload failed', 500);
  }
}
