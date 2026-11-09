"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const socketService_1 = require("./services/socketService");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const incidentRoutes_1 = __importDefault(require("./routes/incidentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const iotRoutes_1 = __importDefault(require("./routes/iotRoutes"));
const incidentController_1 = require("./controllers/incidentController");
// Initialize database schema
(0, database_1.initializeSchema)();
console.log('✅ Database schema initialized');
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize Socket.IO
(0, socketService_1.initSocket)(server);
// --- Global Middleware ---
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter_1.generalLimiter);
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../uploads')));
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
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/incidents', incidentRoutes_1.default);
app.use('/api/v1/admin', adminRoutes_1.default);
app.use('/api/v1/admin/analytics', analyticsRoutes_1.default);
app.use('/api/v1/iot', iotRoutes_1.default);
// GET /api/v1/buildings - List all buildings (public)
app.get('/api/v1/buildings', incidentController_1.listBuildings);
// --- 404 Handler ---
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});
// --- Global Error Handler ---
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    if (err.message && err.message.includes('Only image files')) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.status(500).json({ error: 'Internal server error.' });
});
// --- Start Server ---
server.listen(env_1.env.PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║     🏫 SafeSchool API Server               ║
║     Smart Campus Incident Reporting         ║
║     & Risk Surveillance Platform            ║
╠══════════════════════════════════════════════╣
║  🌐 HTTP:   http://localhost:${env_1.env.PORT}          ║
║  🔌 WS:     ws://localhost:${env_1.env.PORT}            ║
║  📁 Env:    ${env_1.env.NODE_ENV.padEnd(30)}║
╚══════════════════════════════════════════════╝
  `);
});
exports.default = app;
//# sourceMappingURL=app.js.map