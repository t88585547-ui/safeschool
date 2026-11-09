# 🛡️ SafeSchool: Smart Campus Incident Reporting & Risk Surveillance Platform
> **ระบบแจ้งเหตุและเฝ้าระวังความเสี่ยงอัจฉริยะภายในสถานศึกษาแบบ Real-time**  
> ผสานพลังของการมีส่วนร่วม (Crowdsourcing), แผนผังดิจิทัล 3 มิติ (3D Digital Twin) และระบบบริหารจัดการภาวะวิกฤต (Smart Command Center)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

### 1. 📱 ฝั่งนักเรียนและบุคลากร (Reporter Portal - Mobile First)
- 🚨 **One-Tap SOS:** กดค้าง 2 วินาทีเพื่อส่งสัญญาณเตือนภัยระดับสูงสุด (ไฟไหม้, บาดเจ็บสาหัส, คนหมดสติ) พร้อมระบุอาคารและพิกัด GPS
- 🗺️ **Interactive 3D/2D Pinning:** หมุนดูแผนผัง 3 มิติ เลือกอาคาร/ชั้น และจิ้มปักหมุดตำแหน่งจุดเกิดเหตุ
- 🕵️ **Anonymous SafeZone (โหมดกระซิบข้างหูครู):** ปกปิดตัวตน 100% สำหรับเรื่องละเอียดอ่อน (Bullying, ยาเสพติด, สุขภาพจิต) ได้รับ **Secret Tracking Code** (เช่น `SAFE-8X92-K1`)
- 📦 **Live Incident Tracker:** ติดตามความคืบหน้าแบบ Step-by-Step พร้อมระบบแชทสองทางระหว่างนักเรียนและครู/เจ้าหน้าที่
- 🔍 **Before & After Proof:** แสดงหลักฐานภาพถ่ายหลังแก้ไขเสร็จ สร้างความโปร่งใสและน่าเชื่อถือ
- 🏆 **Safety Hero Gamification:** สะสมแต้มความดีพลเมืองดีเมื่อแจ้งแบบระบุตัวตนและแก้ไขเสร็จ

### 2. 🖥️ ฝั่งครูเวร สภานักเรียน และผู้บริหาร (Smart Command Center)
- 🌐 **Real-time 3D Digital Twin:** แผนผังโรงเรียน 3 มิติ (Three.js / React Three Fiber) พร้อมหมุดไฟเรืองแสงกระพริบตามระดับความรุนแรง
- 🔀 **Smart Auto-Routing & SLA Timer:** คัดแยกเหตุและกระจายงานเข้าฝ่ายที่เกี่ยวข้องอัตโนมัติ (ห้องพยาบาล, ฝ่ายอาคาร, ฝ่ายปกครอง)
- 🔥 **Preventive Risk Heatmap:** วิเคราะห์สถิติจุดเสี่ยงสะสม แสดงพื้นที่เสี่ยงสูงสุดเพื่อวางแผนจัดเวรยามและซ่อมบำรุงเชิงรุก
- 📡 **IoT & Environmental Integration:** Webhook รองรับสัญญาณเซ็นเซอร์ควันไฟ, น้ำท่วมขัง และ PM2.5

---

## 📂 โครงสร้างระบบ (Project Structure)

```text
safeschool/
├── backend/                        # Node.js + Express.js (TypeScript) + SQLite
│   ├── src/
│   │   ├── config/                 # SQLite (WAL mode), env, seed script
│   │   ├── controllers/            # Incident, Admin, Auth, Analytics, IoT
│   │   ├── middlewares/            # JWT Auth Guard, Rate Limiter, Multer
│   │   ├── models/                 # SQLite native Queries (Building, User, Incident, Log)
│   │   ├── routes/                 # Express Routers
│   │   ├── services/               # Incident, Auto-routing, Socket.IO, Auth
│   │   └── app.ts                  # Server Entry Point (HTTP + WebSocket)
│   ├── database/
│   │   ├── schema.sql              # Database DDL
│   │   └── safeschool.db           # SQLite database file
│   ├── uploads/                    # Uploaded photos
│   └── package.json
│
├── frontend/                       # Next.js 14 (App Router) + Tailwind + Three.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Student Landing & 3D Interactive Map
│   │   │   ├── admin/page.tsx      # Smart Command Center (3-Panel Desktop Dark)
│   │   │   ├── sos/page.tsx        # One-Tap SOS Emergency Page
│   │   │   ├── track/[code]/page.tsx # Incident Status Tracker & Anonymous Chat
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── canvas/             # Three.js 3D Campus (Scene, BuildingMesh, IncidentPin)
│   │   │   ├── dashboard/          # IncidentFeed, IncidentDetail, StatsCards, HeatmapOverlay
│   │   │   ├── forms/              # ReportWizard (StepLocation, StepCategory, StepIdentity)
│   │   │   └── ui/                 # SOSButton, StatusStepper, ChatBox, Badge, Modal, TrackingSearch
│   │   └── lib/                    # API client, Socket.io client, Types, Utilities
│   └── package.json
└── README.md
```

---

## 🚀 วิธีการติดตั้งและรันระบบ (Setup & Running)

### 1. รัน Backend API & Database
```bash
cd backend
npm install
npm run db:init   # สร้างฐานข้อมูล SQLite และใส่ข้อมูลจำลอง (Seed Data)
npm run dev       # รันเซิร์ฟเวอร์ที่ http://localhost:4000
```

> **บัญชีผู้ใช้เริ่มต้นสำหรับทดสอบ (Default Accounts):**
> - **Admin:** `admin` / `admin123`
> - **ครูแนะแนว/ปกครอง:** `teacher01` / `teacher123`
> - **พยาบาล:** `nurse01` / `nurse123`
> - **ช่างฝ่ายอาคาร:** `facility01` / `facility123`

### 2. รัน Frontend Web Application
```bash
cd frontend
npm install
npm run dev       # เปิดหน้าเว็บที่ http://localhost:3000
```

### หน้าจอหลักของระบบ:
- 📱 **หน้าหลักนักเรียน / แจ้งเหตุ:** [http://localhost:3000](http://localhost:3000)
- 🚨 **ปุ่มแจ้งเหตุด่วนฉุกเฉิน One-Tap SOS:** [http://localhost:3000/sos](http://localhost:3000/sos)
- 🔍 **ติดตามสถานะและแชทนิรนาม:** [http://localhost:3000/track/SAFE-A1B2-C3](http://localhost:3000/track/SAFE-A1B2-C3)
- 🖥️ **Smart Command Center สำหรับเจ้าหน้าที่:** [http://localhost:3000/admin](http://localhost:3000/admin)
