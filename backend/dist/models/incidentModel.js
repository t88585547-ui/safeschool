"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findById = findById;
exports.findByTrackingCode = findByTrackingCode;
exports.trackingCodeExists = trackingCodeExists;
exports.findAll = findAll;
exports.updateStatus = updateStatus;
exports.getHeatmapData = getHeatmapData;
exports.getCategoryStats = getCategoryStats;
exports.getSeverityStats = getSeverityStats;
exports.getStatusStats = getStatusStats;
exports.getBuildingStats = getBuildingStats;
const database_1 = __importDefault(require("../config/database"));
function create(data) {
    const result = database_1.default.prepare(`
    INSERT INTO incidents (tracking_code, title, description, category, severity,
      building_id, floor_number, room_or_zone, pin_x, pin_y, pin_z,
      is_anonymous, reporter_id, reporter_contact, assigned_department, image_before_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(data.tracking_code, data.title, data.description || null, data.category, data.severity, data.building_id || null, data.floor_number || null, data.room_or_zone || null, data.pin_x, data.pin_y, data.pin_z, data.is_anonymous ? 1 : 0, data.reporter_id || null, data.reporter_contact || null, data.assigned_department || null, data.image_before_url || null);
    return findById(Number(result.lastInsertRowid));
}
function findById(id) {
    return database_1.default.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
}
function findByTrackingCode(code) {
    return database_1.default.prepare('SELECT * FROM incidents WHERE tracking_code = ?').get(code);
}
function trackingCodeExists(code) {
    const row = database_1.default.prepare('SELECT 1 FROM incidents WHERE tracking_code = ?').get(code);
    return !!row;
}
function findAll(filters = {}) {
    const conditions = [];
    const params = [];
    if (filters.building_id) {
        conditions.push('i.building_id = ?');
        params.push(filters.building_id);
    }
    if (filters.severity) {
        conditions.push('i.severity = ?');
        params.push(filters.severity);
    }
    if (filters.status) {
        conditions.push('i.status = ?');
        params.push(filters.status);
    }
    if (filters.category) {
        conditions.push('i.category = ?');
        params.push(filters.category);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRow = database_1.default.prepare(`SELECT COUNT(*) as total FROM incidents i ${whereClause}`).get(...params);
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const incidents = database_1.default.prepare(`SELECT i.* FROM incidents i ${whereClause} ORDER BY
      CASE i.severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
      END,
      i.created_at DESC
    LIMIT ? OFFSET ?`).all(...params, limit, offset);
    return { incidents, total: countRow.total };
}
function updateStatus(id, status, resolvedBy, imageAfterUrl, resolutionNote) {
    const updates = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const params = [status];
    if (resolvedBy !== undefined) {
        updates.push('resolved_by = ?');
        params.push(resolvedBy);
    }
    if (imageAfterUrl !== undefined) {
        updates.push('image_after_url = ?');
        params.push(imageAfterUrl);
    }
    if (resolutionNote !== undefined) {
        updates.push('resolution_note = ?');
        params.push(resolutionNote);
    }
    params.push(id);
    database_1.default.prepare(`UPDATE incidents SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    return findById(id);
}
function getHeatmapData() {
    return database_1.default.prepare(`
    SELECT id, tracking_code, category, severity, status,
      building_id, floor_number, pin_x, pin_y, pin_z, created_at
    FROM incidents
    ORDER BY created_at DESC
  `).all();
}
function getCategoryStats() {
    return database_1.default.prepare('SELECT category, COUNT(*) as count FROM incidents GROUP BY category ORDER BY count DESC').all();
}
function getSeverityStats() {
    return database_1.default.prepare('SELECT severity, COUNT(*) as count FROM incidents GROUP BY severity ORDER BY count DESC').all();
}
function getStatusStats() {
    return database_1.default.prepare('SELECT status, COUNT(*) as count FROM incidents GROUP BY status ORDER BY count DESC').all();
}
function getBuildingStats() {
    return database_1.default.prepare(`
    SELECT i.building_id, b.name as building_name, COUNT(*) as count
    FROM incidents i
    LEFT JOIN buildings b ON i.building_id = b.id
    WHERE i.building_id IS NOT NULL
    GROUP BY i.building_id
    ORDER BY count DESC
  `).all();
}
//# sourceMappingURL=incidentModel.js.map