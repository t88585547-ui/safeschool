"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByStaffId = findByStaffId;
exports.findById = findById;
exports.createUser = createUser;
exports.addSafetyPoints = addSafetyPoints;
exports.getAllUsers = getAllUsers;
exports.toPublic = toPublic;
const database_1 = __importDefault(require("../config/database"));
function findByStaffId(studentOrStaffId) {
    return database_1.default.prepare('SELECT * FROM users WHERE student_or_staff_id = ?').get(studentOrStaffId);
}
function findById(id) {
    return database_1.default.prepare('SELECT * FROM users WHERE id = ?').get(id);
}
function createUser(data) {
    const result = database_1.default.prepare('INSERT INTO users (student_or_staff_id, full_name, role, password_hash) VALUES (?, ?, ?, ?)').run(data.student_or_staff_id, data.full_name, data.role, data.password_hash);
    return findById(Number(result.lastInsertRowid));
}
function addSafetyPoints(userId, points) {
    database_1.default.prepare('UPDATE users SET safety_points = safety_points + ? WHERE id = ?').run(points, userId);
}
function getAllUsers() {
    return database_1.default.prepare('SELECT id, student_or_staff_id, full_name, role, safety_points, created_at FROM users').all();
}
function toPublic(user) {
    return {
        id: user.id,
        student_or_staff_id: user.student_or_staff_id,
        full_name: user.full_name,
        role: user.role,
        safety_points: user.safety_points,
        created_at: user.created_at,
    };
}
//# sourceMappingURL=userModel.js.map