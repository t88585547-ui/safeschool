"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const UserModel = __importStar(require("../models/userModel"));
const SALT_ROUNDS = 10;
async function login(studentOrStaffId, password) {
    const user = UserModel.findByStaffId(studentOrStaffId);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const validPassword = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!validPassword) {
        throw new Error('Invalid credentials');
    }
    const payload = {
        userId: user.id,
        studentOrStaffId: user.student_or_staff_id,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    return {
        token,
        user: UserModel.toPublic(user),
    };
}
async function register(data) {
    const existing = UserModel.findByStaffId(data.student_or_staff_id);
    if (existing) {
        throw new Error('User with this ID already exists');
    }
    const passwordHash = await bcryptjs_1.default.hash(data.password, SALT_ROUNDS);
    const user = UserModel.createUser({
        student_or_staff_id: data.student_or_staff_id,
        full_name: data.full_name,
        role: data.role,
        password_hash: passwordHash,
    });
    return UserModel.toPublic(user);
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
}
//# sourceMappingURL=authService.js.map