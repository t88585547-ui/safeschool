import db from '../config/database';

export interface IncidentLog {
  id: number;
  incident_id: number;
  sender_role: 'REPORTER' | 'OFFICER' | 'SYSTEM';
  message: string;
  attachment_url: string | null;
  created_at: string;
}

export function create(data: {
  incident_id: number;
  sender_role: IncidentLog['sender_role'];
  message: string;
  attachment_url?: string;
}): IncidentLog {
  const result = db.prepare(
    'INSERT INTO incident_logs (incident_id, sender_role, message, attachment_url) VALUES (?, ?, ?, ?)'
  ).run(data.incident_id, data.sender_role, data.message, data.attachment_url || null);

  return db.prepare('SELECT * FROM incident_logs WHERE id = ?').get(Number(result.lastInsertRowid)) as IncidentLog;
}

export function findByIncidentId(incidentId: number): IncidentLog[] {
  return db.prepare(
    'SELECT * FROM incident_logs WHERE incident_id = ? ORDER BY created_at ASC'
  ).all(incidentId) as IncidentLog[];
}
