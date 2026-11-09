"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.env = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'safeschool-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    DB_PATH: process.env.DB_PATH || path_1.default.resolve(__dirname, '../../database/safeschool.db'),
    UPLOAD_DIR: process.env.UPLOAD_DIR || path_1.default.resolve(__dirname, '../../uploads'),
    IOT_API_KEY: process.env.IOT_API_KEY || 'iot-safeschool-api-key-2024',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
//# sourceMappingURL=env.js.map