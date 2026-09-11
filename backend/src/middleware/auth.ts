import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';
import { JwtPayload, UserRole } from '../types';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      sendError(res, 'Invalid or inactive user', 401);
      return;
    }

    req.user = user;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }
    next();
  };
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }
  authenticate(req, res, next).catch(next);
}
