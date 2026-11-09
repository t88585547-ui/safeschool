import { IncidentCategory } from '../models/incidentModel';
/**
 * Auto-routing service determines which department should handle an incident
 * based on its category.
 */
export type Department = 'ALL' | 'STAFF_MEDICAL' | 'TEACHER' | 'STAFF_FACILITY' | 'ADMIN';
export declare function routeIncident(category: IncidentCategory): Department;
/**
 * Returns the list of roles that should be notified for a given department assignment.
 */
export declare function getNotificationRoles(department: Department): string[];
/**
 * Returns a human-readable department label for system messages.
 */
export declare function getDepartmentLabel(department: Department): string;
//# sourceMappingURL=autoRoutingService.d.ts.map