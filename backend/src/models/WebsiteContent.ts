import mongoose, { Document, Schema } from 'mongoose';

export type ContentKey =
  | 'home_hero'
  | 'about_school'
  | 'principal_message'
  | 'contact_info'
  | 'admissions_info';

export interface IWebsiteContent extends Document {
  key: ContentKey;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  metadata?: Record<string, string>;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const websiteContentSchema = new Schema<IWebsiteContent>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['home_hero', 'about_school', 'principal_message', 'contact_info', 'admissions_info'],
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    metadata: { type: Map, of: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const WebsiteContent = mongoose.model<IWebsiteContent>('WebsiteContent', websiteContentSchema);
