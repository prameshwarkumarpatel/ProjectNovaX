import { Response } from 'express';
import { Model, Document } from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError, buildPaginationQuery, buildSearchFilter } from '../utils/response';

interface CrudOptions {
  searchFields: string[];
  defaultSort?: string;
  publicFilter?: Record<string, unknown>;
}

export function createCrudController<T extends Document>(
  model: Model<T>,
  options: CrudOptions
) {
  const { searchFields, defaultSort = 'createdAt', publicFilter } = options;

  return {
    list: async (req: AuthRequest, res: Response): Promise<void> => {
      const { page, limit, search, sortBy, sortOrder, skip } = buildPaginationQuery(req.query);
      const filter: Record<string, unknown> = {
        ...buildSearchFilter(search, searchFields),
        ...(publicFilter || {}),
      };

      if (req.query.isPublished !== undefined) {
        filter.isPublished = req.query.isPublished === 'true';
      }
      if (req.query.status) filter.status = req.query.status;
      if (req.query.category) filter.category = req.query.category;

      const sort: Record<string, 1 | -1> = { [sortBy || defaultSort]: sortOrder as 1 | -1 };

      const [data, total] = await Promise.all([
        model.find(filter).sort(sort).skip(skip).limit(limit),
        model.countDocuments(filter),
      ]);

      sendSuccess(res, {
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    },

    getById: async (req: AuthRequest, res: Response): Promise<void> => {
      const item = await model.findById(req.params.id);
      if (!item) {
        sendError(res, 'Resource not found', 404);
        return;
      }
      sendSuccess(res, item);
    },

    create: async (req: AuthRequest, res: Response): Promise<void> => {
      const item = await model.create(req.body);
      sendSuccess(res, item, 'Created successfully', 201);
    },

    update: async (req: AuthRequest, res: Response): Promise<void> => {
      const item = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        sendError(res, 'Resource not found', 404);
        return;
      }
      sendSuccess(res, item, 'Updated successfully');
    },

    remove: async (req: AuthRequest, res: Response): Promise<void> => {
      const item = await model.findByIdAndDelete(req.params.id);
      if (!item) {
        sendError(res, 'Resource not found', 404);
        return;
      }
      sendSuccess(res, null, 'Deleted successfully');
    },
  };
}
