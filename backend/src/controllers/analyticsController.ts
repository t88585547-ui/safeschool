import { Request, Response } from 'express';
import * as IncidentModel from '../models/incidentModel';

export function getHeatmap(_req: Request, res: Response): void {
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
  } catch (err: unknown) {
    console.error('Error getting heatmap:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
