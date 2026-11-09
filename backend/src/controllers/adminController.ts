import { Request, Response } from 'express';
import * as IncidentModel from '../models/incidentModel';
import * as incidentService from '../services/incidentService';
import * as UserModel from '../models/userModel';

export function listIncidents(req: Request, res: Response): void {
  try {
    const {
      building_id, severity, status, category,
      limit, offset,
    } = req.query;

    const filters: IncidentModel.IncidentFilters = {};

    if (building_id) filters.building_id = parseInt(building_id as string, 10);
    if (severity) filters.severity = severity as IncidentModel.IncidentSeverity;
    if (status) filters.status = status as IncidentModel.IncidentStatus;
    if (category) filters.category = category as IncidentModel.IncidentCategory;
    if (limit) filters.limit = parseInt(limit as string, 10);
    if (offset) filters.offset = parseInt(offset as string, 10);

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
  } catch (err: unknown) {
    console.error('Error listing incidents:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function updateIncidentStatus(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const { status, resolution_note } = req.body;

    if (!status) {
      res.status(400).json({ error: 'status is required.' });
      return;
    }

    const validStatuses: IncidentModel.IncidentStatus[] = [
      'PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED',
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const incidentId = parseInt(id as string, 10);
    const existing = IncidentModel.findById(incidentId);
    if (!existing) {
      res.status(404).json({ error: 'Incident not found.' });
      return;
    }

    const imageAfterUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const resolvedBy = status === 'RESOLVED' && req.user ? req.user.userId : undefined;

    const incident = incidentService.updateIncidentStatus(
      incidentId,
      status,
      resolvedBy,
      imageAfterUrl,
      resolution_note
    );

    if (!incident) {
      res.status(404).json({ error: 'Incident not found.' });
      return;
    }

    res.json({
      success: true,
      data: { incident },
    });
  } catch (err: unknown) {
    console.error('Error updating incident status:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function listUsers(_req: Request, res: Response): void {
  try {
    const users = UserModel.getAllUsers();
    res.json({
      success: true,
      data: { users },
    });
  } catch (err: unknown) {
    console.error('Error listing users:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
