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
export declare function create(data: CreateIncidentData): Incident;
export declare function findById(id: number): Incident | undefined;
export declare function findByTrackingCode(code: string): Incident | undefined;
export declare function trackingCodeExists(code: string): boolean;
export interface IncidentFilters {
    building_id?: number;
    severity?: IncidentSeverity;
    status?: IncidentStatus;
    category?: IncidentCategory;
    limit?: number;
    offset?: number;
}
export declare function findAll(filters?: IncidentFilters): {
    incidents: Incident[];
    total: number;
};
export declare function updateStatus(id: number, status: IncidentStatus, resolvedBy?: number, imageAfterUrl?: string, resolutionNote?: string): Incident | undefined;
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
export declare function getHeatmapData(): HeatmapPoint[];
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
export declare function getCategoryStats(): CategoryStats[];
export declare function getSeverityStats(): SeverityStats[];
export declare function getStatusStats(): StatusStats[];
export declare function getBuildingStats(): BuildingStats[];
//# sourceMappingURL=incidentModel.d.ts.map