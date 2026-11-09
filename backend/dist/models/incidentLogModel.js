"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findByIncidentId = findByIncidentId;
const database_1 = __importDefault(require("../config/database"));
function create(data) {
    const result = database_1.default.prepare('INSERT INTO incident_logs (incident_id, sender_role, message, attachment_url) VALUES (?, ?, ?, ?)').run(data.incident_id, data.sender_role, data.message, data.attachment_url || null);
    return database_1.default.prepare('SELECT * FROM incident_logs WHERE id = ?').get(Number(result.lastInsertRowid));
}
function findByIncidentId(incidentId) {
    return database_1.default.prepare('SELECT * FROM incident_logs WHERE incident_id = ? ORDER BY created_at ASC').all(incidentId);
}
//# sourceMappingURL=incidentLogModel.js.map