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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importStar(require("./database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seed() {
    console.log('🔧 Initializing database schema...');
    (0, database_1.initializeSchema)();
    console.log('✅ Schema created successfully.');
    // Check if data already exists
    const existingUsers = database_1.default.prepare('SELECT COUNT(*) as count FROM users').get();
    if (existingUsers.count > 0) {
        console.log('⚠️  Database already contains data. Skipping seed.');
        return;
    }
    console.log('🌱 Seeding database...');
    const SALT_ROUNDS = 10;
    // --- Seed Buildings ---
    const insertBuilding = database_1.default.prepare('INSERT INTO buildings (code, name, total_floors, model_coords) VALUES (?, ?, ?, ?)');
    const buildings = [
        { code: 'BLD-A', name: 'อาคาร 1 (Main Academic)', totalFloors: 5, coords: '{"x":0,"y":0,"z":0,"width":40,"depth":20,"height":25}' },
        { code: 'BLD-B', name: 'อาคาร 2 (Science Lab)', totalFloors: 4, coords: '{"x":50,"y":0,"z":0,"width":35,"depth":18,"height":20}' },
        { code: 'BLD-C', name: 'อาคาร 3 (Sports Complex)', totalFloors: 3, coords: '{"x":0,"y":0,"z":30,"width":50,"depth":30,"height":15}' },
        { code: 'BLD-D', name: 'อาคาร 4 (Administration)', totalFloors: 3, coords: '{"x":50,"y":0,"z":30,"width":25,"depth":15,"height":15}' },
        { code: 'BLD-E', name: 'อาคาร 5 (Cafeteria & Library)', totalFloors: 2, coords: '{"x":25,"y":0,"z":55,"width":30,"depth":20,"height":10}' },
    ];
    const insertBuildingTx = database_1.default.transaction(() => {
        for (const b of buildings) {
            insertBuilding.run(b.code, b.name, b.totalFloors, b.coords);
        }
    });
    insertBuildingTx();
    console.log('  ✅ Buildings seeded (5 buildings)');
    // --- Seed Users ---
    const insertUser = database_1.default.prepare('INSERT INTO users (student_or_staff_id, full_name, role, password_hash, safety_points) VALUES (?, ?, ?, ?, ?)');
    const users = [
        { id: 'admin', name: 'System Administrator', role: 'ADMIN', password: 'admin123', points: 0 },
        { id: 'teacher01', name: 'ครูสมศรี ใจดี', role: 'TEACHER', password: 'teacher123', points: 0 },
        { id: 'nurse01', name: 'พยาบาลสุภา รักษ์ดี', role: 'STAFF_MEDICAL', password: 'nurse123', points: 0 },
        { id: 'facility01', name: 'ช่างประสิทธิ์ ซ่อมเก่ง', role: 'STAFF_FACILITY', password: 'facility123', points: 0 },
        { id: 'STU-001', name: 'นักเรียนสมชาย ใจกล้า', role: 'STUDENT', password: 'student123', points: 25 },
        { id: 'STU-002', name: 'นักเรียนสมหญิง ดีใจ', role: 'STUDENT', password: 'student123', points: 10 },
        { id: 'STU-003', name: 'นักเรียนสมปอง รักเรียน', role: 'STUDENT', password: 'student123', points: 15 },
    ];
    const insertUserTx = database_1.default.transaction(() => {
        for (const u of users) {
            const hash = bcryptjs_1.default.hashSync(u.password, SALT_ROUNDS);
            insertUser.run(u.id, u.name, u.role, hash, u.points);
        }
    });
    insertUserTx();
    console.log('  ✅ Users seeded (7 users)');
    // --- Seed Incidents ---
    const insertIncident = database_1.default.prepare(`
    INSERT INTO incidents (tracking_code, title, description, category, severity, status,
      building_id, floor_number, room_or_zone, pin_x, pin_y, pin_z,
      is_anonymous, reporter_id, reporter_contact, assigned_department,
      image_before_url, resolution_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const incidents = [
        {
            code: 'SAFE-A1B2-C3', title: 'ไฟฟ้าลัดวงจรที่ห้องเรียน 301',
            desc: 'เกิดประกายไฟจากปลั๊กไฟฟ้าด้านหลังห้องเรียน มีกลิ่นไหม้', category: 'SOS_EMERGENCY',
            severity: 'CRITICAL', status: 'IN_PROGRESS', buildingId: 1, floor: 3, room: 'ห้อง 301',
            x: 12.5, y: 15.0, z: 3.0, anon: 0, reporterId: 5, contact: '0891234567',
            dept: 'ALL', imageBefore: null, note: null,
        },
        {
            code: 'SAFE-D4E5-F6', title: 'นักเรียนล้มบันไดบาดเจ็บ',
            desc: 'นักเรียนชั้น ม.2 ลื่นล้มที่บันไดอาคาร 2 ชั้น 2 มีแผลถลอกที่แขนและเข่า', category: 'ACCIDENT_MEDICAL',
            severity: 'HIGH', status: 'ACKNOWLEDGED', buildingId: 2, floor: 2, room: 'บันไดชั้น 2',
            x: 30.0, y: 10.0, z: 5.0, anon: 0, reporterId: 6, contact: '0897654321',
            dept: 'STAFF_MEDICAL', imageBefore: null, note: null,
        },
        {
            code: 'SAFE-G7H8-I9', title: 'พบการกลั่นแกล้งในห้องน้ำ',
            desc: 'พบนักเรียนกลุ่มหนึ่งกำลังกลั่นแกล้งนักเรียนรุ่นน้องในห้องน้ำชั้น 1', category: 'BULLYING_MENTAL',
            severity: 'HIGH', status: 'PENDING', buildingId: 1, floor: 1, room: 'ห้องน้ำชาย ชั้น 1',
            x: 5.0, y: 2.0, z: 1.0, anon: 1, reporterId: null, contact: null,
            dept: 'TEACHER', imageBefore: null, note: null,
        },
        {
            code: 'SAFE-J1K2-L3', title: 'ก๊อกน้ำชำรุดในห้องวิทยาศาสตร์',
            desc: 'ก๊อกน้ำในห้องแลปวิทยาศาสตร์ห้อง 402 รั่วไม่หยุด น้ำท่วมพื้น', category: 'FACILITY_REPAIR',
            severity: 'MEDIUM', status: 'RESOLVED', buildingId: 2, floor: 4, room: 'ห้องแลป 402',
            x: 22.0, y: 8.0, z: 12.0, anon: 0, reporterId: 7, contact: '0812345678',
            dept: 'STAFF_FACILITY', imageBefore: null, note: 'เปลี่ยนก๊อกน้ำใหม่เรียบร้อยแล้ว',
        },
        {
            code: 'SAFE-M4N5-O6', title: 'คนแปลกหน้าเข้ามาในบริเวณโรงเรียน',
            desc: 'พบชายไม่ทราบชื่อเดินเข้ามาในบริเวณสนามกีฬาโดยไม่มีบัตรผ่าน', category: 'SECURITY_RISK',
            severity: 'HIGH', status: 'PENDING', buildingId: 3, floor: 1, room: 'สนามกีฬา',
            x: 25.0, y: 0.0, z: 35.0, anon: 0, reporterId: 5, contact: '0891234567',
            dept: 'ADMIN', imageBefore: null, note: null,
        },
    ];
    const insertIncidentTx = database_1.default.transaction(() => {
        for (const inc of incidents) {
            insertIncident.run(inc.code, inc.title, inc.desc, inc.category, inc.severity, inc.status, inc.buildingId, inc.floor, inc.room, inc.x, inc.y, inc.z, inc.anon ? 1 : 0, inc.reporterId, inc.contact, inc.dept, inc.imageBefore, inc.note);
        }
    });
    insertIncidentTx();
    console.log('  ✅ Incidents seeded (5 incidents)');
    // --- Seed Incident Logs ---
    const insertLog = database_1.default.prepare('INSERT INTO incident_logs (incident_id, sender_role, message) VALUES (?, ?, ?)');
    const logs = [
        { incidentId: 1, role: 'REPORTER', message: 'ประกายไฟเกิดขึ้นจากปลั๊กหลังห้อง กรุณาส่งคนมาดูด่วน!' },
        { incidentId: 1, role: 'SYSTEM', message: 'แจ้งเตือน SOS ถูกส่งไปยังทุกแผนก' },
        { incidentId: 1, role: 'OFFICER', message: 'รับทราบ กำลังส่งทีมไปตรวจสอบ' },
        { incidentId: 2, role: 'REPORTER', message: 'นักเรียนบาดเจ็บ รอพยาบาลอยู่ที่หน้าบันได' },
        { incidentId: 2, role: 'SYSTEM', message: 'แจ้งเตือนส่งไปยังแผนกพยาบาล' },
        { incidentId: 4, role: 'REPORTER', message: 'น้ำรั่วมากครับ พื้นเปียกหมด' },
        { incidentId: 4, role: 'OFFICER', message: 'ซ่อมเสร็จแล้วครับ เปลี่ยนก๊อกใหม่' },
        { incidentId: 4, role: 'SYSTEM', message: 'เหตุการณ์ได้รับการแก้ไขแล้ว' },
    ];
    const insertLogTx = database_1.default.transaction(() => {
        for (const log of logs) {
            insertLog.run(log.incidentId, log.role, log.message);
        }
    });
    insertLogTx();
    console.log('  ✅ Incident logs seeded (8 logs)');
    console.log('\n🎉 Database seeding completed successfully!');
}
seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map