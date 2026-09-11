import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { generateToken } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  if (!user.isActive) {
    sendError(res, 'Account is deactivated', 403);
    return;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id.toString(), user.email, user.role);
  const userObj = user.toObject();
  delete (userObj as { password?: string }).password;

  sendSuccess(res, { token, user: userObj }, 'Login successful');
}

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     responses:
 *       200:
 *         description: Current user
 */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  sendSuccess(res, req.user);
}

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     tags: [Auth]
 *     summary: Change password
 */
export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user!._id).select('+password');

  if (!user || !(await user.comparePassword(currentPassword))) {
    sendError(res, 'Current password is incorrect', 400);
    return;
  }

  user.password = newPassword;
  await user.save();
  sendSuccess(res, null, 'Password updated successfully');
}
