import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import path from 'path';

import { env } from './config/env';
import { initializeSchema } from './config/database';
import { initSocket } from './services/socketService';
import { generalLimiter } from './middlewares/rateLimiter';

import authRoutes from './routes/authRoutes';
import incidentRoutes from './routes/incidentRoutes';
import adminRoutes from './routes/adminRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import iotRoutes from './routes/iotRoutes';
import { listBuildings } from './controllers/incidentController';

// Initialize database schema
initializeSchema();
console.log('✅ Database schema initialized');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// --- Global Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// --- Health Check ---
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SafeSchool API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);
app.use('/api/v1/iot', iotRoutes);

// GET /api/v1/buildings - List all buildings (public)
app.get('/api/v1/buildings', listBuildings);

// --- 404 Handler ---
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// --- Global Error Handler ---
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err.message && err.message.includes('Only image files')) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error.' });
});

// --- Start Server ---
server.listen(env.PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║     🏫 SafeSchool API Server               ║
║     Smart Campus Incident Reporting         ║
║     & Risk Surveillance Platform            ║
╠══════════════════════════════════════════════╣
║  🌐 HTTP:   http://localhost:${env.PORT}          ║
║  🔌 WS:     ws://localhost:${env.PORT}            ║
║  📁 Env:    ${env.NODE_ENV.padEnd(30)}║
╚══════════════════════════════════════════════╝
  `);
});

export default app;
