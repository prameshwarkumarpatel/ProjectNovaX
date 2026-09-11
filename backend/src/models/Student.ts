import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStudent extends Document {
  userId: Types.ObjectId;
  rollNumber?: string;
  className?: string;
  section?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  admissionDate?: Date;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String, trim: true },
    className: { type: String, trim: true },
    section: { type: String, trim: true },
    parentName: { type: String, trim: true },
    parentEmail: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    admissionDate: { type: Date },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', studentSchema);
