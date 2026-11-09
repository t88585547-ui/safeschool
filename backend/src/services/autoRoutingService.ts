import { IncidentCategory } from '../models/incidentModel';

/**
 * Auto-routing service determines which department should handle an incident
 * based on its category.
 */

export type Department = 'ALL' | 'STAFF_MEDICAL' | 'TEACHER' | 'STAFF_FACILITY' | 'ADMIN';

const ROUTING_MAP: Record<IncidentCategory, Department> = {
  SOS_EMERGENCY: 'ALL',
  ACCIDENT_MEDICAL: 'STAFF_MEDICAL',
  BULLYING_MENTAL: 'TEACHER',
  FACILITY_REPAIR: 'STAFF_FACILITY',
  SECURITY_RISK: 'ADMIN',
};

export function routeIncident(category: IncidentCategory): Department {
  return ROUTING_MAP[category] || 'ADMIN';
}

/**
 * Returns the list of roles that should be notified for a given department assignment.
 */
export function getNotificationRoles(department: Department): string[] {
  if (department === 'ALL') {
    return ['ADMIN', 'TEACHER', 'STAFF_MEDICAL', 'STAFF_FACILITY'];
  }
  return ['ADMIN', department];
}

/**
 * Returns a human-readable department label for system messages.
 */
export function getDepartmentLabel(department: Department): string {
  const labels: Record<Department, string> = {
    ALL: 'ทุกแผนก',
    STAFF_MEDICAL: 'แผนกพยาบาล',
    TEACHER: 'ครูที่ปรึกษา/แนะแนว',
    STAFF_FACILITY: 'แผนกอาคารสถานที่',
    ADMIN: 'ฝ่ายบริหาร',
  };
  return labels[department] || department;
}
