import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITeacher extends Document {
  userId: Types.ObjectId;
  department?: string;
  qualification?: string;
  bio?: string;
  photo?: string;
  designation?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    department: { type: String, trim: true },
    qualification: { type: String, trim: true },
    bio: { type: String },
    photo: { type: String },
    designation: { type: String, trim: true },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);
