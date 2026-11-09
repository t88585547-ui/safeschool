"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
exports.emitNewIncident = emitNewIncident;
exports.emitSOSAlert = emitSOSAlert;
exports.emitStatusUpdate = emitStatusUpdate;
exports.emitNewMessage = emitNewMessage;
const socket_io_1 = require("socket.io");
let io = null;
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
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
        socket.on('join:tracking', (trackingCode) => {
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
function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}
function emitNewIncident(incident) {
    if (!io)
        return;
    io.to('admin_room').emit('incident:new', {
        incident,
        timestamp: new Date().toISOString(),
    });
}
function emitSOSAlert(incident) {
    if (!io)
        return;
    io.to('admin_room').emit('incident:sos', {
        incident,
        siren: true,
        timestamp: new Date().toISOString(),
    });
}
function emitStatusUpdate(incident) {
    if (!io)
        return;
    io.to('admin_room').emit('incident:status_updated', {
        incident,
        timestamp: new Date().toISOString(),
    });
    io.to(`tracking:${incident.tracking_code}`).emit('incident:status_updated', {
        incident,
        timestamp: new Date().toISOString(),
    });
}
function emitNewMessage(trackingCode, log) {
    if (!io)
        return;
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
//# sourceMappingURL=socketService.js.map