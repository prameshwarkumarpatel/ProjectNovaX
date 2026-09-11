import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  publishDate: Date;
  expiryDate?: Date;
  isPublished: boolean;
  priority: 'low' | 'medium' | 'high';
  attachment?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isPublished: { type: Boolean, default: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    attachment: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Notice = mongoose.model<INotice>('Notice', noticeSchema);
