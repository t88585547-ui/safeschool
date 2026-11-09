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
exports.createIncident = createIncident;
exports.createSOSIncident = createSOSIncident;
exports.trackIncident = trackIncident;
exports.addChatMessage = addChatMessage;
exports.listBuildings = listBuildings;
const incidentService = __importStar(require("../services/incidentService"));
const IncidentModel = __importStar(require("../models/incidentModel"));
const BuildingModel = __importStar(require("../models/buildingModel"));
function createIncident(req, res) {
    try {
        const { title, description, category, severity, building_id, floor_number, room_or_zone, pin_x, pin_y, pin_z, is_anonymous, reporter_id, reporter_contact, } = req.body;
        // Validate required fields
        if (!title || !category || !severity || pin_x === undefined || pin_y === undefined || pin_z === undefined) {
            res.status(400).json({
                error: 'title, category, severity, pin_x, pin_y, and pin_z are required.',
            });
            return;
        }
        const validCategories = [
            'SOS_EMERGENCY', 'ACCIDENT_MEDICAL', 'BULLYING_MENTAL', 'FACILITY_REPAIR', 'SECURITY_RISK',
        ];
        if (!validCategories.includes(category)) {
            res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
            return;
        }
        const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
        if (!validSeverities.includes(severity)) {
            res.status(400).json({ error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` });
            return;
        }
        // Validate building exists if provided
        if (building_id) {
            const building = BuildingModel.findById(building_id);
            if (!building) {
                res.status(400).json({ error: `Building with id ${building_id} not found.` });
                return;
            }
        }
        // Get uploaded image path if any
        const imageBeforeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const result = incidentService.createIncident({
            title,
            description,
            category,
            severity,
            building_id,
            floor_number,
            room_or_zone,
            pin_x: parseFloat(pin_x),
            pin_y: parseFloat(pin_y),
            pin_z: parseFloat(pin_z),
            is_anonymous: is_anonymous === 'true' || is_anonymous === true,
            reporter_id: reporter_id ? parseInt(reporter_id, 10) : undefined,
            reporter_contact,
            image_before_url: imageBeforeUrl,
        });
        res.status(201).json({
            success: true,
            data: {
                tracking_code: result.incident.tracking_code,
                incident: result.incident,
                logs: result.logs,
            },
        });
    }
    catch (err) {
        console.error('Error creating incident:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function createSOSIncident(req, res) {
    try {
        const { title, description, building_id, floor_number, room_or_zone, pin_x, pin_y, pin_z, is_anonymous, reporter_id, reporter_contact, } = req.body;
        if (!title || pin_x === undefined || pin_y === undefined || pin_z === undefined) {
            res.status(400).json({
                error: 'title, pin_x, pin_y, and pin_z are required for SOS.',
            });
            return;
        }
        const imageBeforeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const result = incidentService.createSOSIncident({
            title,
            description,
            building_id,
            floor_number,
            room_or_zone,
            pin_x: parseFloat(pin_x),
            pin_y: parseFloat(pin_y),
            pin_z: parseFloat(pin_z),
            is_anonymous: is_anonymous === 'true' || is_anonymous === true,
            reporter_id: reporter_id ? parseInt(reporter_id, 10) : undefined,
            reporter_contact,
            image_before_url: imageBeforeUrl,
        });
        res.status(201).json({
            success: true,
            data: {
                tracking_code: result.incident.tracking_code,
                incident: result.incident,
                logs: result.logs,
                sos: true,
            },
        });
    }
    catch (err) {
        console.error('Error creating SOS incident:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function trackIncident(req, res) {
    try {
        const { code } = req.params;
        if (!code) {
            res.status(400).json({ error: 'Tracking code is required.' });
            return;
        }
        const trackingCode = (Array.isArray(code) ? code[0] : code).toUpperCase();
        const result = incidentService.getIncidentByTrackingCode(trackingCode);
        if (!result) {
            res.status(404).json({ error: 'Incident not found with this tracking code.' });
            return;
        }
        res.json({
            success: true,
            data: {
                incident: result.incident,
                logs: result.logs,
            },
        });
    }
    catch (err) {
        console.error('Error tracking incident:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function addChatMessage(req, res) {
    try {
        const { code } = req.params;
        const { message, sender_role } = req.body;
        if (!message) {
            res.status(400).json({ error: 'message is required.' });
            return;
        }
        const trackingCode = (Array.isArray(code) ? code[0] : code).toUpperCase();
        const incident = IncidentModel.findByTrackingCode(trackingCode);
        if (!incident) {
            res.status(404).json({ error: 'Incident not found with this tracking code.' });
            return;
        }
        const role = sender_role || 'REPORTER';
        const validRoles = ['REPORTER', 'OFFICER', 'SYSTEM'];
        if (!validRoles.includes(role)) {
            res.status(400).json({ error: `Invalid sender_role. Must be one of: ${validRoles.join(', ')}` });
            return;
        }
        const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const log = incidentService.addChatMessage(incident.id, incident.tracking_code, role, message, attachmentUrl);
        res.status(201).json({
            success: true,
            data: { log },
        });
    }
    catch (err) {
        console.error('Error adding chat message:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function listBuildings(_req, res) {
    try {
        const buildings = BuildingModel.findAll();
        res.json({
            success: true,
            data: { buildings },
        });
    }
    catch (err) {
        console.error('Error listing buildings:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
//# sourceMappingURL=incidentController.js.map