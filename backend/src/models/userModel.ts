import db from '../config/database';

export interface User {
  id: number;
  student_or_staff_id: string;
  full_name: string;
  role: 'STUDENT' | 'TEACHER' | 'STAFF_MEDICAL' | 'STAFF_FACILITY' | 'ADMIN';
  password_hash: string;
  safety_points: number;
  created_at: string;
}

export type UserRole = User['role'];

export interface UserPublic {
  id: number;
  student_or_staff_id: string;
  full_name: string;
  role: UserRole;
  safety_points: number;
  created_at: string;
}

export function findByStaffId(studentOrStaffId: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE student_or_staff_id = ?').get(studentOrStaffId) as User | undefined;
}

export function findById(id: number): User | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export function createUser(data: {
  student_or_staff_id: string;
  full_name: string;
  role: UserRole;
  password_hash: string;
}): User {
  const result = db.prepare(
    'INSERT INTO users (student_or_staff_id, full_name, role, password_hash) VALUES (?, ?, ?, ?)'
  ).run(data.student_or_staff_id, data.full_name, data.role, data.password_hash);

  return findById(Number(result.lastInsertRowid))!;
}

export function addSafetyPoints(userId: number, points: number): void {
  db.prepare('UPDATE users SET safety_points = safety_points + ? WHERE id = ?').run(points, userId);
}

export function getAllUsers(): UserPublic[] {
  return db.prepare(
    'SELECT id, student_or_staff_id, full_name, role, safety_points, created_at FROM users'
  ).all() as UserPublic[];
}

export function toPublic(user: User): UserPublic {
  return {
    id: user.id,
    student_or_staff_id: user.student_or_staff_id,
    full_name: user.full_name,
    role: user.role,
    safety_points: user.safety_points,
    created_at: user.created_at,
  };
}
