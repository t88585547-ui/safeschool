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
exports.listIncidents = listIncidents;
exports.updateIncidentStatus = updateIncidentStatus;
exports.listUsers = listUsers;
const IncidentModel = __importStar(require("../models/incidentModel"));
const incidentService = __importStar(require("../services/incidentService"));
const UserModel = __importStar(require("../models/userModel"));
function listIncidents(req, res) {
    try {
        const { building_id, severity, status, category, limit, offset, } = req.query;
        const filters = {};
        if (building_id)
            filters.building_id = parseInt(building_id, 10);
        if (severity)
            filters.severity = severity;
        if (status)
            filters.status = status;
        if (category)
            filters.category = category;
        if (limit)
            filters.limit = parseInt(limit, 10);
        if (offset)
            filters.offset = parseInt(offset, 10);
        const result = IncidentModel.findAll(filters);
        res.json({
            success: true,
            data: {
                incidents: result.incidents,
                total: result.total,
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            },
        });
    }
    catch (err) {
        console.error('Error listing incidents:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function updateIncidentStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, resolution_note } = req.body;
        if (!status) {
            res.status(400).json({ error: 'status is required.' });
            return;
        }
        const validStatuses = [
            'PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED',
        ];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            return;
        }
        const incidentId = parseInt(id, 10);
        const existing = IncidentModel.findById(incidentId);
        if (!existing) {
            res.status(404).json({ error: 'Incident not found.' });
            return;
        }
        const imageAfterUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const resolvedBy = status === 'RESOLVED' && req.user ? req.user.userId : undefined;
        const incident = incidentService.updateIncidentStatus(incidentId, status, resolvedBy, imageAfterUrl, resolution_note);
        if (!incident) {
            res.status(404).json({ error: 'Incident not found.' });
            return;
        }
        res.json({
            success: true,
            data: { incident },
        });
    }
    catch (err) {
        console.error('Error updating incident status:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function listUsers(_req, res) {
    try {
        const users = UserModel.getAllUsers();
        res.json({
            success: true,
            data: { users },
        });
    }
    catch (err) {
        console.error('Error listing users:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
//# sourceMappingURL=adminController.js.map