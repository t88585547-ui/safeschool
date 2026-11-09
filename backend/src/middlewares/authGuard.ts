import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../services/authService';
import { UserRole } from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware that requires a valid JWT token in the Authorization header.
 */
export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Middleware that restricts access to specific roles.
 * Must be used after authGuard.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Access denied. Not authenticated.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      return;
    }

    next();
  };
}

/**
 * Middleware that allows either staff/admin roles.
 * Shortcut for common staff access pattern.
 */
export function staffGuard(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Access denied. Not authenticated.' });
    return;
  }

  const staffRoles: UserRole[] = ['ADMIN', 'TEACHER', 'STAFF_MEDICAL', 'STAFF_FACILITY'];
  if (!staffRoles.includes(req.user.role)) {
    res.status(403).json({ error: 'Access denied. Staff or admin role required.' });
    return;
  }

  next();
}
