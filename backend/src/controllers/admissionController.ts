import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Admission } from '../models/Admission';
import { createCrudController } from './crudFactory';

const base = createCrudController(Admission, {
  searchFields: ['studentFirstName', 'studentLastName', 'parentName', 'parentEmail', 'classApplying'],
});

export const listAdmissions = base.list;
export const getAdmission = base.getById;
export const deleteAdmission = base.remove;

export async function createAdmission(req: AuthRequest, res: Response): Promise<void> {
  const admission = await Admission.create(req.body);
  const status = req.user ? 201 : 201;
  const { sendSuccess } = await import('../utils/response');
  sendSuccess(res, admission, 'Admission application submitted', status);
}

export async function updateAdmission(req: AuthRequest, res: Response): Promise<void> {
  const update: Record<string, unknown> = { ...req.body };
  if (req.body.status && req.user) {
    update.reviewedBy = req.user._id;
    update.reviewedAt = new Date();
  }
  const admission = await Admission.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!admission) {
    const { sendError } = await import('../utils/response');
    sendError(res, 'Admission not found', 404);
    return;
  }
  const { sendSuccess } = await import('../utils/response');
  sendSuccess(res, admission, 'Admission updated');
}
