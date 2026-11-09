"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findByCode = findByCode;
const database_1 = __importDefault(require("../config/database"));
function findAll() {
    return database_1.default.prepare('SELECT * FROM buildings ORDER BY id').all();
}
function findById(id) {
    return database_1.default.prepare('SELECT * FROM buildings WHERE id = ?').get(id);
}
function findByCode(code) {
    return database_1.default.prepare('SELECT * FROM buildings WHERE code = ?').get(code);
}
//# sourceMappingURL=buildingModel.js.map