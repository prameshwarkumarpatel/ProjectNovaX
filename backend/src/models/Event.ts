import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  comments?: string;
  eventDate: Date;
  location?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: String },
    eventDate: { type: Date, required: true },
    location: { type: String, trim: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
