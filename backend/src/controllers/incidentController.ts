import { Request, Response } from 'express';
import * as incidentService from '../services/incidentService';
import * as IncidentModel from '../models/incidentModel';
import * as BuildingModel from '../models/buildingModel';

export function createIncident(req: Request, res: Response): void {
  try {
    const {
      title, description, category, severity,
      building_id, floor_number, room_or_zone,
      pin_x, pin_y, pin_z,
      is_anonymous, reporter_id, reporter_contact,
    } = req.body;

    // Validate required fields
    if (!title || !category || !severity || pin_x === undefined || pin_y === undefined || pin_z === undefined) {
      res.status(400).json({
        error: 'title, category, severity, pin_x, pin_y, and pin_z are required.',
      });
      return;
    }

    const validCategories: IncidentModel.IncidentCategory[] = [
      'SOS_EMERGENCY', 'ACCIDENT_MEDICAL', 'BULLYING_MENTAL', 'FACILITY_REPAIR', 'SECURITY_RISK',
    ];
    if (!validCategories.includes(category)) {
      res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
      return;
    }

    const validSeverities: IncidentModel.IncidentSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
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
  } catch (err: unknown) {
    console.error('Error creating incident:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function createSOSIncident(req: Request, res: Response): void {
  try {
    const {
      title, description,
      building_id, floor_number, room_or_zone,
      pin_x, pin_y, pin_z,
      is_anonymous, reporter_id, reporter_contact,
    } = req.body;

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
  } catch (err: unknown) {
    console.error('Error creating SOS incident:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function trackIncident(req: Request, res: Response): void {
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
  } catch (err: unknown) {
    console.error('Error tracking incident:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function addChatMessage(req: Request, res: Response): void {
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

    const log = incidentService.addChatMessage(
      incident.id,
      incident.tracking_code,
      role,
      message,
      attachmentUrl
    );

    res.status(201).json({
      success: true,
      data: { log },
    });
  } catch (err: unknown) {
    console.error('Error adding chat message:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export function listBuildings(_req: Request, res: Response): void {
  try {
    const buildings = BuildingModel.findAll();
    res.json({
      success: true,
      data: { buildings },
    });
  } catch (err: unknown) {
    console.error('Error listing buildings:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
