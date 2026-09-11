import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  footerText?: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: 'Pro School Management' },
    tagline: { type: String },
    logo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String, default: 'info@school.edu' },
    contactPhone: { type: String, default: '+1 234 567 8900' },
    address: { type: String, default: '123 Education Street, City, Country' },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
      linkedin: String,
    },
    footerText: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
