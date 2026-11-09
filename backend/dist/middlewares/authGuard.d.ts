import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../services/authService';
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
export declare function authGuard(req: Request, res: Response, next: NextFunction): void;
/**
 * Middleware that restricts access to specific roles.
 * Must be used after authGuard.
 */
export declare function requireRole(...roles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware that allows either staff/admin roles.
 * Shortcut for common staff access pattern.
 */
export declare function staffGuard(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=authGuard.d.ts.map