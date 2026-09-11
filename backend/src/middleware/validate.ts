import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.issues.forEach((e) => {
          const key = e.path.map(String).join('.') || 'body';
          if (!errors[key]) errors[key] = [];
          errors[key].push(e.message);
        });
        sendError(res, 'Validation failed', 422, errors);
        return;
      }
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      (req as Request & { validatedQuery: T }).validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendError(res, 'Invalid query parameters', 422);
        return;
      }
      next(error);
    }
  };
}
