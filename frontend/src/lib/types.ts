// ─── Core Entity Types ───

export interface Building {
  id: number;
  code: string;
  name: string;
  total_floors: number;
  model_coords: { x: number; y: number; z: number };
}

export type IncidentCategory =
  | 'SOS_EMERGENCY'
  | 'ACCIDENT_MEDICAL'
  | 'BULLYING_MENTAL'
  | 'FACILITY_REPAIR'
  | 'SECURITY_RISK';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'PENDING'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export interface Incident {
  id: number;
  tracking_code: string;
  title: string;
  description?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  building_id?: number;
  building_name?: string;
  floor_number?: number;
  room_or_zone?: string;
  pin_x: number;
  pin_y: number;
  pin_z: number;
  is_anonymous: boolean;
  reporter_id?: number;
  image_before_url?: string;
  image_after_url?: string;
  resolution_note?: string;
  assigned_department?: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentLog {
  id: number;
  incident_id: number;
  sender_role: 'REPORTER' | 'OFFICER' | 'SYSTEM';
  message: string;
  attachment_url?: string;
  created_at: string;
}

// ─── Form Data ───

export interface ReportFormData {
  building_id?: number;
  floor_number?: number;
  room_or_zone?: string;
  pin_x: number;
  pin_y: number;
  pin_z: number;
  category?: IncidentCategory;
  severity?: IncidentSeverity;
  title: string;
  description: string;
  image?: File | null;
  is_anonymous: boolean;
  reporter_name?: string;
  reporter_contact?: string;
}

// ─── API Response Types ───

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface StatsData {
  total_incidents: number;
  pending_count: number;
  in_progress_count: number;
  resolved_count: number;
  critical_count: number;
  avg_resolution_hours: number;
  today_count: number;
  weekly_trend: number[];
}

// ─── Socket Event Types ───

export interface SocketIncidentNew {
  incident: Incident;
}

export interface SocketStatusUpdate {
  incident_id: number;
  status: IncidentStatus;
  updated_at: string;
}

export interface SocketNewMessage {
  incident_id: number;
  log: IncidentLog;
}
