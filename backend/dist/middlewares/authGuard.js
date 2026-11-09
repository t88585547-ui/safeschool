"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
exports.requireRole = requireRole;
exports.staffGuard = staffGuard;
const authService_1 = require("../services/authService");
/**
 * Middleware that requires a valid JWT token in the Authorization header.
 */
function authGuard(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, authService_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
/**
 * Middleware that restricts access to specific roles.
 * Must be used after authGuard.
 */
function requireRole(...roles) {
    return (req, res, next) => {
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
function staffGuard(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Access denied. Not authenticated.' });
        return;
    }
    const staffRoles = ['ADMIN', 'TEACHER', 'STAFF_MEDICAL', 'STAFF_FACILITY'];
    if (!staffRoles.includes(req.user.role)) {
        res.status(403).json({ error: 'Access denied. Staff or admin role required.' });
        return;
    }
    next();
}
//# sourceMappingURL=authGuard.js.map