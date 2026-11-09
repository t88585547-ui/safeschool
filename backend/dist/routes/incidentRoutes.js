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
const express_1 = require("express");
const incidentController = __importStar(require("../controllers/incidentController"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
// POST /api/v1/incidents - Create new incident report
router.post('/', upload_1.upload.single('image_before'), incidentController.createIncident);
// POST /api/v1/incidents/sos - Create SOS emergency
router.post('/sos', rateLimiter_1.sosLimiter, upload_1.upload.single('image_before'), incidentController.createSOSIncident);
// GET /api/v1/incidents/track/:code - Get incident by tracking code
router.get('/track/:code', incidentController.trackIncident);
// POST /api/v1/incidents/track/:code/chat - Send anonymous message reply
router.post('/track/:code/chat', upload_1.upload.single('attachment'), incidentController.addChatMessage);
exports.default = router;
//# sourceMappingURL=incidentRoutes.js.map