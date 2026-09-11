import mongoose, { Document, Schema } from 'mongoose';

export type AdmissionStatus = 'pending' | 'approved' | 'rejected';

export interface IAdmission extends Document {
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  classApplying: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address?: string;
  previousSchool?: string;
  documents?: string[];
  status: AdmissionStatus;
  notes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const admissionSchema = new Schema<IAdmission>(
  {
    studentFirstName: { type: String, required: true, trim: true },
    studentLastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    classApplying: { type: String, required: true, trim: true },
    parentName: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, trim: true, lowercase: true },
    parentPhone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    previousSchool: { type: String, trim: true },
    documents: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    notes: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const Admission = mongoose.model<IAdmission>('Admission', admissionSchema);
