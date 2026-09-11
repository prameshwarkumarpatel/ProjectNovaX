import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'general', trim: true },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);
