import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Incident } from '../models/incidentModel';
import { IncidentLog } from '../models/incidentLogModel';

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join:admin', () => {
      socket.join('admin_room');
      console.log(`  📋 ${socket.id} joined admin_room`);
    });

    socket.on('join:tracking', (trackingCode: string) => {
      socket.join(`tracking:${trackingCode}`);
      console.log(`  🔍 ${socket.id} joined tracking:${trackingCode}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  console.log('🔌 Socket.IO initialized');
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

export function emitNewIncident(incident: Incident): void {
  if (!io) return;
  io.to('admin_room').emit('incident:new', {
    incident,
    timestamp: new Date().toISOString(),
  });
}

export function emitSOSAlert(incident: Incident): void {
  if (!io) return;
  io.to('admin_room').emit('incident:sos', {
    incident,
    siren: true,
    timestamp: new Date().toISOString(),
  });
}

export function emitStatusUpdate(incident: Incident): void {
  if (!io) return;
  io.to('admin_room').emit('incident:status_updated', {
    incident,
    timestamp: new Date().toISOString(),
  });
  io.to(`tracking:${incident.tracking_code}`).emit('incident:status_updated', {
    incident,
    timestamp: new Date().toISOString(),
  });
}

export function emitNewMessage(trackingCode: string, log: IncidentLog): void {
  if (!io) return;
  io.to('admin_room').emit('incident:new_message', {
    tracking_code: trackingCode,
    log,
    timestamp: new Date().toISOString(),
  });
  io.to(`tracking:${trackingCode}`).emit('incident:new_message', {
    tracking_code: trackingCode,
    log,
    timestamp: new Date().toISOString(),
  });
}
