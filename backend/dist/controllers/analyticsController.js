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
exports.getHeatmap = getHeatmap;
const IncidentModel = __importStar(require("../models/incidentModel"));
function getHeatmap(_req, res) {
    try {
        const heatmapPoints = IncidentModel.getHeatmapData();
        const categoryStats = IncidentModel.getCategoryStats();
        const severityStats = IncidentModel.getSeverityStats();
        const statusStats = IncidentModel.getStatusStats();
        const buildingStats = IncidentModel.getBuildingStats();
        res.json({
            success: true,
            data: {
                heatmap_points: heatmapPoints,
                statistics: {
                    total_incidents: heatmapPoints.length,
                    by_category: categoryStats,
                    by_severity: severityStats,
                    by_status: statusStats,
                    by_building: buildingStats,
                },
            },
        });
    }
    catch (err) {
        console.error('Error getting heatmap:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
//# sourceMappingURL=analyticsController.js.map