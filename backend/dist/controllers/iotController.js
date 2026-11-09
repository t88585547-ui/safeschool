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
exports.webhook = webhook;
const incidentService = __importStar(require("../services/incidentService"));
const env_1 = require("../config/env");
/**
 * IoT webhook endpoint.
 * Receives sensor alerts from IoT devices and creates incidents automatically.
 *
 * Expected payload:
 * {
 *   "sensor_id": "SENSOR-001",
 *   "sensor_type": "smoke_detector" | "motion_sensor" | "water_leak" | "door_breach" | "temperature",
 *   "reading": number,
 *   "threshold": number,
 *   "building_code": "BLD-A",
 *   "floor": 2,
 *   "zone": "Corridor B",
 *   "pin_x": 10.0,
 *   "pin_y": 5.0,
 *   "pin_z": 2.0,
 *   "timestamp": "2024-01-01T00:00:00Z"
 * }
 */
function webhook(req, res) {
    try {
        // Validate API key
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== env_1.env.IOT_API_KEY) {
            res.status(401).json({ error: 'Invalid or missing API key.' });
            return;
        }
        const { sensor_id, sensor_type, reading, threshold, building_code, floor, zone, pin_x, pin_y, pin_z, } = req.body;
        if (!sensor_id || !sensor_type || reading === undefined || pin_x === undefined || pin_y === undefined || pin_z === undefined) {
            res.status(400).json({
                error: 'sensor_id, sensor_type, reading, pin_x, pin_y, and pin_z are required.',
            });
            return;
        }
        // Map sensor type to incident category and severity
        const mapping = mapSensorToIncident(sensor_type, reading, threshold);
        const title = `[IoT Alert] ${mapping.title} - Sensor ${sensor_id}`;
        const description = `Automated alert from IoT sensor ${sensor_id} (${sensor_type}).
Reading: ${reading}${threshold !== undefined ? ` / Threshold: ${threshold}` : ''}.
Building: ${building_code || 'Unknown'}, Floor: ${floor || 'N/A'}, Zone: ${zone || 'N/A'}.`;
        // Look up building by code if provided
        let buildingId;
        if (building_code) {
            const BuildingModel = require('../models/buildingModel');
            const building = BuildingModel.findByCode(building_code);
            if (building) {
                buildingId = building.id;
            }
        }
        const result = incidentService.createIncident({
            title,
            description,
            category: mapping.category,
            severity: mapping.severity,
            building_id: buildingId,
            floor_number: floor,
            room_or_zone: zone,
            pin_x: parseFloat(pin_x),
            pin_y: parseFloat(pin_y),
            pin_z: parseFloat(pin_z),
            is_anonymous: false,
        });
        res.status(201).json({
            success: true,
            data: {
                tracking_code: result.incident.tracking_code,
                incident_id: result.incident.id,
                message: 'IoT alert processed and incident created.',
            },
        });
    }
    catch (err) {
        console.error('Error processing IoT webhook:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
function mapSensorToIncident(sensorType, reading, threshold) {
    const isOverThreshold = threshold !== undefined && reading > threshold;
    switch (sensorType) {
        case 'smoke_detector':
            return {
                category: 'SOS_EMERGENCY',
                severity: isOverThreshold ? 'CRITICAL' : 'HIGH',
                title: 'Smoke Detected',
            };
        case 'motion_sensor':
            return {
                category: 'SECURITY_RISK',
                severity: 'MEDIUM',
                title: 'Unexpected Motion Detected',
            };
        case 'water_leak':
            return {
                category: 'FACILITY_REPAIR',
                severity: isOverThreshold ? 'HIGH' : 'MEDIUM',
                title: 'Water Leak Detected',
            };
        case 'door_breach':
            return {
                category: 'SECURITY_RISK',
                severity: 'HIGH',
                title: 'Unauthorized Door Access',
            };
        case 'temperature':
            return {
                category: isOverThreshold ? 'SOS_EMERGENCY' : 'FACILITY_REPAIR',
                severity: isOverThreshold ? 'CRITICAL' : 'LOW',
                title: `Abnormal Temperature (${reading}°C)`,
            };
        default:
            return {
                category: 'FACILITY_REPAIR',
                severity: 'LOW',
                title: `Unknown Sensor Alert (${sensorType})`,
            };
    }
}
//# sourceMappingURL=iotController.js.map