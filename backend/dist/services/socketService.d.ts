import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Incident } from '../models/incidentModel';
import { IncidentLog } from '../models/incidentLogModel';
export declare function initSocket(httpServer: HttpServer): SocketIOServer;
export declare function getIO(): SocketIOServer;
export declare function emitNewIncident(incident: Incident): void;
export declare function emitSOSAlert(incident: Incident): void;
export declare function emitStatusUpdate(incident: Incident): void;
export declare function emitNewMessage(trackingCode: string, log: IncidentLog): void;
//# sourceMappingURL=socketService.d.ts.map