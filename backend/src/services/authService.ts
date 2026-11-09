import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import * as UserModel from '../models/userModel';

const SALT_ROUNDS = 10;

export interface JwtPayload {
  userId: number;
  studentOrStaffId: string;
  role: UserModel.UserRole;
}

export async function login(studentOrStaffId: string, password: string): Promise<{ token: string; user: UserModel.UserPublic }> {
  const user = UserModel.findByStaffId(studentOrStaffId);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const payload: JwtPayload = {
    userId: user.id,
    studentOrStaffId: user.student_or_staff_id,
    role: user.role,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });

  return {
    token,
    user: UserModel.toPublic(user),
  };
}

export async function register(data: {
  student_or_staff_id: string;
  full_name: string;
  role: UserModel.UserRole;
  password: string;
}): Promise<UserModel.UserPublic> {
  const existing = UserModel.findByStaffId(data.student_or_staff_id);
  if (existing) {
    throw new Error('User with this ID already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = UserModel.createUser({
    student_or_staff_id: data.student_or_staff_id,
    full_name: data.full_name,
    role: data.role,
    password_hash: passwordHash,
  });

  return UserModel.toPublic(user);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
