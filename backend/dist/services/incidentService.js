"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingCode = generateTrackingCode;
exports.createIncident = createIncident;
exports.createSOSIncident = createSOSIncident;
exports.getIncidentByTrackingCode = getIncidentByTrackingCode;
exports.addChatMessage = addChatMessage;
exports.updateIncidentStatus = updateIncidentStatus;
const IncidentModel = __importStar(require("../models/incidentModel"));
const IncidentLogModel = __importStar(require("../models/incidentLogModel"));
const UserModel = __importStar(require("../models/userModel"));
const autoRoutingService_1 = require("./autoRoutingService");
const socketService = __importStar(require("./socketService"));
/**
 * Generates a unique tracking code in format SAFE-XXXX-XX
 */
function generateTrackingCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
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
function createIncident(input) {
    const trackingCode = generateTrackingCode();
    const department = (0, autoRoutingService_1.routeIncident)(input.category);
    const departmentLabel = (0, autoRoutingService_1.getDepartmentLabel)(department);
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
    }
    else {
        socketService.emitNewIncident(incident);
    }
    return {
        incident,
        logs: [systemLog],
    };
}
function createSOSIncident(input) {
    return createIncident({
        ...input,
        category: 'SOS_EMERGENCY',
        severity: 'CRITICAL',
    });
}
function getIncidentByTrackingCode(code) {
    const incident = IncidentModel.findByTrackingCode(code);
    if (!incident)
        return null;
    const logs = IncidentLogModel.findByIncidentId(incident.id);
    return { incident, logs };
}
function addChatMessage(incidentId, trackingCode, senderRole, message, attachmentUrl) {
    const log = IncidentLogModel.create({
        incident_id: incidentId,
        sender_role: senderRole,
        message,
        attachment_url: attachmentUrl,
    });
    socketService.emitNewMessage(trackingCode, log);
    return log;
}
function updateIncidentStatus(id, status, resolvedBy, imageAfterUrl, resolutionNote) {
    const incident = IncidentModel.updateStatus(id, status, resolvedBy, imageAfterUrl, resolutionNote);
    if (!incident)
        return null;
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
//# sourceMappingURL=incidentService.js.map