export interface IncidentLog {
    id: number;
    incident_id: number;
    sender_role: 'REPORTER' | 'OFFICER' | 'SYSTEM';
    message: string;
    attachment_url: string | null;
    created_at: string;
}
export declare function create(data: {
    incident_id: number;
    sender_role: IncidentLog['sender_role'];
    message: string;
    attachment_url?: string;
}): IncidentLog;
export declare function findByIncidentId(incidentId: number): IncidentLog[];
//# sourceMappingURL=incidentLogModel.d.ts.map