import * as IncidentModel from '../models/incidentModel';
import * as IncidentLogModel from '../models/incidentLogModel';
/**
 * Generates a unique tracking code in format SAFE-XXXX-XX
 */
export declare function generateTrackingCode(): string;
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
export declare function createIncident(input: CreateIncidentInput): {
    incident: IncidentModel.Incident;
    logs: IncidentLogModel.IncidentLog[];
};
export declare function createSOSIncident(input: Omit<CreateIncidentInput, 'category' | 'severity'>): {
    incident: IncidentModel.Incident;
    logs: IncidentLogModel.IncidentLog[];
};
export declare function getIncidentByTrackingCode(code: string): {
    incident: IncidentModel.Incident;
    logs: IncidentLogModel.IncidentLog[];
} | null;
export declare function addChatMessage(incidentId: number, trackingCode: string, senderRole: IncidentLogModel.IncidentLog['sender_role'], message: string, attachmentUrl?: string): IncidentLogModel.IncidentLog;
export declare function updateIncidentStatus(id: number, status: IncidentModel.IncidentStatus, resolvedBy?: number, imageAfterUrl?: string, resolutionNote?: string): IncidentModel.Incident | null;
//# sourceMappingURL=incidentService.d.ts.map