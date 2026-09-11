import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = 'school-management'
): Promise<{ url: string; publicId: string }> {
  if (!env.cloudinary.cloudName) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_* environment variables.');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) {
        reject(error || new Error('Upload failed'));
        return;
      }
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!env.cloudinary.cloudName) return;
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
