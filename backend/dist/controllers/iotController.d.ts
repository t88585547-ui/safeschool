import { Request, Response } from 'express';
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
export declare function webhook(req: Request, res: Response): void;
//# sourceMappingURL=iotController.d.ts.map