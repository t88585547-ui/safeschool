import db from '../config/database';

export interface Incident {
  id: number;
  tracking_code: string;
  title: string;
  description: string | null;
  category: 'SOS_EMERGENCY' | 'ACCIDENT_MEDICAL' | 'BULLYING_MENTAL' | 'FACILITY_REPAIR' | 'SECURITY_RISK';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  building_id: number | null;
  floor_number: number | null;
  room_or_zone: string | null;
  pin_x: number;
  pin_y: number;
  pin_z: number;
  is_anonymous: number;
  reporter_id: number | null;
  reporter_contact: string | null;
  assigned_department: string | null;
  resolved_by: number | null;
  image_before_url: string | null;
  image_after_url: string | null;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
}

export type IncidentCategory = Incident['category'];
export type IncidentSeverity = Incident['severity'];
export type IncidentStatus = Incident['status'];

export interface CreateIncidentData {
  tracking_code: string;
  title: string;
  description?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  building_id?: number;
  floor_number?: number;
  room_or_zone?: string;
  pin_x: number;
  pin_y: number;
  pin_z: number;
  is_anonymous?: boolean;
  reporter_id?: number;
  reporter_contact?: string;
  assigned_department?: string;
  image_before_url?: string;
}

export function create(data: CreateIncidentData): Incident {
  const result = db.prepare(`
    INSERT INTO incidents (tracking_code, title, description, category, severity,
      building_id, floor_number, room_or_zone, pin_x, pin_y, pin_z,
      is_anonymous, reporter_id, reporter_contact, assigned_department, image_before_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.tracking_code, data.title, data.description || null,
    data.category, data.severity,
    data.building_id || null, data.floor_number || null, data.room_or_zone || null,
    data.pin_x, data.pin_y, data.pin_z,
    data.is_anonymous ? 1 : 0, data.reporter_id || null,
    data.reporter_contact || null, data.assigned_department || null,
    data.image_before_url || null
  );

  return findById(Number(result.lastInsertRowid))!;
}

export function findById(id: number): Incident | undefined {
  return db.prepare('SELECT * FROM incidents WHERE id = ?').get(id) as Incident | undefined;
}

export function findByTrackingCode(code: string): Incident | undefined {
  return db.prepare('SELECT * FROM incidents WHERE tracking_code = ?').get(code) as Incident | undefined;
}

export function trackingCodeExists(code: string): boolean {
  const row = db.prepare('SELECT 1 FROM incidents WHERE tracking_code = ?').get(code);
  return !!row;
}

export interface IncidentFilters {
  building_id?: number;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  category?: IncidentCategory;
  limit?: number;
  offset?: number;
}

export function findAll(filters: IncidentFilters = {}): { incidents: Incident[]; total: number } {
  const conditions: string[] = [];
  const params: unknown[] = [];

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

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM incidents i ${whereClause}`).get(...params) as { total: number };

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  const incidents = db.prepare(
    `SELECT i.* FROM incidents i ${whereClause} ORDER BY
      CASE i.severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
      END,
      i.created_at DESC
    LIMIT ? OFFSET ?`
  ).all(...params, limit, offset) as Incident[];

  return { incidents, total: countRow.total };
}

export function updateStatus(
  id: number,
  status: IncidentStatus,
  resolvedBy?: number,
  imageAfterUrl?: string,
  resolutionNote?: string
): Incident | undefined {
  const updates: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  const params: unknown[] = [status];

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

  db.prepare(`UPDATE incidents SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  return findById(id);
}

export interface HeatmapPoint {
  id: number;
  tracking_code: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  building_id: number | null;
  floor_number: number | null;
  pin_x: number;
  pin_y: number;
  pin_z: number;
  created_at: string;
}

export function getHeatmapData(): HeatmapPoint[] {
  return db.prepare(`
    SELECT id, tracking_code, category, severity, status,
      building_id, floor_number, pin_x, pin_y, pin_z, created_at
    FROM incidents
    ORDER BY created_at DESC
  `).all() as HeatmapPoint[];
}

export interface CategoryStats {
  category: IncidentCategory;
  count: number;
}

export interface SeverityStats {
  severity: IncidentSeverity;
  count: number;
}

export interface StatusStats {
  status: IncidentStatus;
  count: number;
}

export interface BuildingStats {
  building_id: number;
  building_name: string;
  count: number;
}

export function getCategoryStats(): CategoryStats[] {
  return db.prepare(
    'SELECT category, COUNT(*) as count FROM incidents GROUP BY category ORDER BY count DESC'
  ).all() as CategoryStats[];
}

export function getSeverityStats(): SeverityStats[] {
  return db.prepare(
    'SELECT severity, COUNT(*) as count FROM incidents GROUP BY severity ORDER BY count DESC'
  ).all() as SeverityStats[];
}

export function getStatusStats(): StatusStats[] {
  return db.prepare(
    'SELECT status, COUNT(*) as count FROM incidents GROUP BY status ORDER BY count DESC'
  ).all() as StatusStats[];
}

export function getBuildingStats(): BuildingStats[] {
  return db.prepare(`
    SELECT i.building_id, b.name as building_name, COUNT(*) as count
    FROM incidents i
    LEFT JOIN buildings b ON i.building_id = b.id
    WHERE i.building_id IS NOT NULL
    GROUP BY i.building_id
    ORDER BY count DESC
  `).all() as BuildingStats[];
}
