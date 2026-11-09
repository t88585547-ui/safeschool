import {
  Incident,
  IncidentLog,
  Building,
  ApiResponse,
  PaginatedResponse,
  StatsData,
  ReportFormData,
  IncidentStatus,
} from './types';

const BASE_URL = 'http://localhost:4000/api/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Buildings ───

export async function getBuildings(): Promise<Building[]> {
  const res = await request<ApiResponse<Building[]>>('/buildings');
  return res.data;
}

// ─── Incidents ───

export async function getIncidents(params?: {
  status?: IncidentStatus;
  severity?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Incident>> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.severity) searchParams.set('severity', params.severity);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();
  return request<PaginatedResponse<Incident>>(`/incidents${qs ? `?${qs}` : ''}`);
}

export async function getIncidentByCode(code: string): Promise<Incident> {
  const res = await request<ApiResponse<Incident>>(`/incidents/track/${code}`);
  return res.data;
}

export async function getIncidentById(id: number): Promise<Incident> {
  const res = await request<ApiResponse<Incident>>(`/incidents/${id}`);
  return res.data;
}

export async function createIncident(data: ReportFormData): Promise<Incident> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category || 'SECURITY_RISK');
  formData.append('severity', data.severity || 'MEDIUM');
  formData.append('is_anonymous', String(data.is_anonymous));
  formData.append('pin_x', String(data.pin_x));
  formData.append('pin_y', String(data.pin_y));
  formData.append('pin_z', String(data.pin_z));
  if (data.building_id) formData.append('building_id', String(data.building_id));
  if (data.floor_number) formData.append('floor_number', String(data.floor_number));
  if (data.room_or_zone) formData.append('room_or_zone', data.room_or_zone);
  if (data.reporter_name) formData.append('reporter_name', data.reporter_name);
  if (data.reporter_contact) formData.append('reporter_contact', data.reporter_contact);
  if (data.image) formData.append('image', data.image);

  const url = `${BASE_URL}/incidents`;
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to create incident' }));
    throw new Error(error.message);
  }
  const json: ApiResponse<Incident> = await res.json();
  return json.data;
}

export async function createSOS(data: {
  building_id?: number;
  floor_number?: number;
  latitude?: number;
  longitude?: number;
}): Promise<Incident> {
  const res = await request<ApiResponse<Incident>>('/incidents/sos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateIncidentStatus(
  id: number,
  status: IncidentStatus,
  resolution_note?: string,
  image_after?: File
): Promise<Incident> {
  if (image_after) {
    const formData = new FormData();
    formData.append('status', status);
    if (resolution_note) formData.append('resolution_note', resolution_note);
    formData.append('image_after', image_after);
    const url = `${BASE_URL}/incidents/${id}/status`;
    const res = await fetch(url, { method: 'PATCH', body: formData });
    if (!res.ok) throw new Error('Failed to update status');
    const json: ApiResponse<Incident> = await res.json();
    return json.data;
  }
  const res = await request<ApiResponse<Incident>>(`/incidents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, resolution_note }),
  });
  return res.data;
}

// ─── Incident Logs / Chat ───

export async function getIncidentLogs(incidentId: number): Promise<IncidentLog[]> {
  const res = await request<ApiResponse<IncidentLog[]>>(`/incidents/${incidentId}/logs`);
  return res.data;
}

export async function sendIncidentMessage(
  incidentId: number,
  message: string,
  senderRole: 'REPORTER' | 'OFFICER' = 'REPORTER'
): Promise<IncidentLog> {
  const res = await request<ApiResponse<IncidentLog>>(`/incidents/${incidentId}/logs`, {
    method: 'POST',
    body: JSON.stringify({ message, sender_role: senderRole }),
  });
  return res.data;
}

// ─── Stats ───

export async function getStats(): Promise<StatsData> {
  const res = await request<ApiResponse<StatsData>>('/stats');
  return res.data;
}

// ─── Resolved Incidents (for trust-building section) ───

export async function getResolvedIncidents(limit = 5): Promise<Incident[]> {
  const res = await getIncidents({ status: 'RESOLVED', limit });
  return res.data;
}
