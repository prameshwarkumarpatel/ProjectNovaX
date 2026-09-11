import { Response } from 'express';
import { ApiResponse } from '../types';

export function sendSuccess<T>(res: Response, data: T, message?: string, status = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  res.status(status).json(body);
}

export function sendError(res: Response, message: string, status = 400, errors?: Record<string, string[]>): void {
  const body: ApiResponse = { success: false, message };
  if (errors) body.errors = errors;
  res.status(status).json(body);
}

export function buildPaginationQuery(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '10'), 10)));
  const search = String(query.search || '').trim();
  const sortBy = String(query.sortBy || 'createdAt');
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;
  return { page, limit, search, sortBy, sortOrder, skip };
}

export function buildSearchFilter(search: string, fields: string[]) {
  if (!search) return {};
  return {
    $or: fields.map((field) => ({ [field]: { $regex: search, $options: 'i' } })),
  };
}
