-- SafeSchool Database Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_or_staff_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK(role IN ('STUDENT', 'TEACHER', 'STAFF_MEDICAL', 'STAFF_FACILITY', 'ADMIN')) NOT NULL,
    password_hash TEXT NOT NULL,
    safety_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    total_floors INTEGER NOT NULL,
    model_coords TEXT
);

CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_code VARCHAR(15) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(30) CHECK(category IN ('SOS_EMERGENCY', 'ACCIDENT_MEDICAL', 'BULLYING_MENTAL', 'FACILITY_REPAIR', 'SECURITY_RISK')) NOT NULL,
    severity VARCHAR(15) CHECK(severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) NOT NULL,
    status VARCHAR(20) CHECK(status IN ('PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')) DEFAULT 'PENDING',
    building_id INTEGER REFERENCES buildings(id),
    floor_number INTEGER,
    room_or_zone VARCHAR(100),
    pin_x REAL NOT NULL,
    pin_y REAL NOT NULL,
    pin_z REAL NOT NULL,
    is_anonymous BOOLEAN DEFAULT 0,
    reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reporter_contact VARCHAR(50),
    assigned_department VARCHAR(30),
    resolved_by INTEGER REFERENCES users(id),
    image_before_url TEXT,
    image_after_url TEXT,
    resolution_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incident_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) CHECK(sender_role IN ('REPORTER', 'OFFICER', 'SYSTEM')) NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_tracking_code ON incidents(tracking_code);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_building_id ON incidents(building_id);
CREATE INDEX IF NOT EXISTS idx_incident_logs_incident_id ON incident_logs(incident_id);
