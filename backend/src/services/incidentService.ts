import * as IncidentModel from '../models/incidentModel';
import * as IncidentLogModel from '../models/incidentLogModel';
import * as UserModel from '../models/userModel';
import { routeIncident, getDepartmentLabel } from './autoRoutingService';
import * as socketService from './socketService';

/**
 * Generates a unique tracking code in format SAFE-XXXX-XX
 */
export function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code: string;
  let attempts = 0;

  do {
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    for (let i = 0; i < 2; i++) {
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `SAFE-${part1}-${part2}`;
    attempts++;

    if (attempts > 100) {
      throw new Error('Unable to generate unique tracking code after 100 attempts');
    }
  } while (IncidentModel.trackingCodeExists(code));

  return code;
}

export interface CreateIncidentInput {
  title: string;
  description?: string;
  category: IncidentModel.IncidentCategory;
  severity: IncidentModel.IncidentSeverity;
  building_id?: number;
  floor_number?: number;
  room_or_zone?: string;
  pin_x: number;
  pin_y: number;
  pin_z: number;
  is_anonymous?: boolean;
  reporter_id?: number;
  reporter_contact?: string;
  image_before_url?: string;
}

export function createIncident(input: CreateIncidentInput): {
  incident: IncidentModel.Incident;
  logs: IncidentLogModel.IncidentLog[];
} {
  const trackingCode = generateTrackingCode();
  const department = routeIncident(input.category);
  const departmentLabel = getDepartmentLabel(department);

  const incident = IncidentModel.create({
    ...input,
    tracking_code: trackingCode,
    assigned_department: department,
  });

  // Create system log
  const systemLog = IncidentLogModel.create({
    incident_id: incident.id,
    sender_role: 'SYSTEM',
    message: `เหตุการณ์ใหม่ถูกสร้าง (${trackingCode}) - แจ้งเตือนส่งไปยัง${departmentLabel}`,
  });

  // Emit WebSocket events
  if (input.category === 'SOS_EMERGENCY') {
    socketService.emitSOSAlert(incident);
  } else {
    socketService.emitNewIncident(incident);
  }

  return {
    incident,
    logs: [systemLog],
  };
}

export function createSOSIncident(input: Omit<CreateIncidentInput, 'category' | 'severity'>): {
  incident: IncidentModel.Incident;
  logs: IncidentLogModel.IncidentLog[];
} {
  return createIncident({
    ...input,
    category: 'SOS_EMERGENCY',
    severity: 'CRITICAL',
  });
}

export function getIncidentByTrackingCode(code: string): {
  incident: IncidentModel.Incident;
  logs: IncidentLogModel.IncidentLog[];
} | null {
  const incident = IncidentModel.findByTrackingCode(code);
  if (!incident) return null;

  const logs = IncidentLogModel.findByIncidentId(incident.id);
  return { incident, logs };
}

export function addChatMessage(
  incidentId: number,
  trackingCode: string,
  senderRole: IncidentLogModel.IncidentLog['sender_role'],
  message: string,
  attachmentUrl?: string
): IncidentLogModel.IncidentLog {
  const log = IncidentLogModel.create({
    incident_id: incidentId,
    sender_role: senderRole,
    message,
    attachment_url: attachmentUrl,
  });

  socketService.emitNewMessage(trackingCode, log);
  return log;
}

export function updateIncidentStatus(
  id: number,
  status: IncidentModel.IncidentStatus,
  resolvedBy?: number,
  imageAfterUrl?: string,
  resolutionNote?: string
): IncidentModel.Incident | null {
  const incident = IncidentModel.updateStatus(id, status, resolvedBy, imageAfterUrl, resolutionNote);
  if (!incident) return null;

  // Create system log for status change
  IncidentLogModel.create({
    incident_id: id,
    sender_role: 'SYSTEM',
    message: `สถานะเปลี่ยนเป็น: ${status}${resolutionNote ? ` - ${resolutionNote}` : ''}`,
  });

  // Award safety points when resolved
  if (status === 'RESOLVED' && incident.reporter_id && !incident.is_anonymous) {
    UserModel.addSafetyPoints(incident.reporter_id, 10);
    IncidentLogModel.create({
      incident_id: id,
      sender_role: 'SYSTEM',
      message: 'ผู้แจ้งได้รับ Safety Points +10 คะแนน',
    });
  }

  socketService.emitStatusUpdate(incident);
  return incident;
}
