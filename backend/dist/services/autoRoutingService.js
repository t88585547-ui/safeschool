"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeIncident = routeIncident;
exports.getNotificationRoles = getNotificationRoles;
exports.getDepartmentLabel = getDepartmentLabel;
const ROUTING_MAP = {
    SOS_EMERGENCY: 'ALL',
    ACCIDENT_MEDICAL: 'STAFF_MEDICAL',
    BULLYING_MENTAL: 'TEACHER',
    FACILITY_REPAIR: 'STAFF_FACILITY',
    SECURITY_RISK: 'ADMIN',
};
function routeIncident(category) {
    return ROUTING_MAP[category] || 'ADMIN';
}
/**
 * Returns the list of roles that should be notified for a given department assignment.
 */
function getNotificationRoles(department) {
    if (department === 'ALL') {
        return ['ADMIN', 'TEACHER', 'STAFF_MEDICAL', 'STAFF_FACILITY'];
    }
    return ['ADMIN', department];
}
/**
 * Returns a human-readable department label for system messages.
 */
function getDepartmentLabel(department) {
    const labels = {
        ALL: 'ทุกแผนก',
        STAFF_MEDICAL: 'แผนกพยาบาล',
        TEACHER: 'ครูที่ปรึกษา/แนะแนว',
        STAFF_FACILITY: 'แผนกอาคารสถานที่',
        ADMIN: 'ฝ่ายบริหาร',
    };
    return labels[department] || department;
}
//# sourceMappingURL=autoRoutingService.js.map