import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { UserRole } from '../models/userModel';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { student_or_staff_id, password } = req.body;

    if (!student_or_staff_id || !password) {
      res.status(400).json({ error: 'student_or_staff_id and password are required.' });
      return;
    }

    const result = await authService.login(student_or_staff_id, password);

    res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    if (message === 'Invalid credentials') {
      res.status(401).json({ error: message });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { student_or_staff_id, full_name, role, password } = req.body;

    if (!student_or_staff_id || !full_name || !role || !password) {
      res.status(400).json({
        error: 'student_or_staff_id, full_name, role, and password are required.',
      });
      return;
    }

    const validRoles: UserRole[] = ['STUDENT', 'TEACHER', 'STAFF_MEDICAL', 'STAFF_FACILITY', 'ADMIN'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const user = await authService.register({
      student_or_staff_id,
      full_name,
      role,
      password,
    });

    res.status(201).json({
      success: true,
      data: { user },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    if (message === 'User with this ID already exists') {
      res.status(409).json({ error: message });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
