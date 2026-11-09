'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Shield,
  Volume2,
  VolumeX,
  Radio,
  Layers,
  Flame,
  ArrowLeft,
  RefreshCw,
  Bell,
  Cpu,
} from 'lucide-react';
import IncidentFeed from '@/components/dashboard/IncidentFeed';
import IncidentDetail from '@/components/dashboard/IncidentDetail';
import StatsCards from '@/components/dashboard/StatsCards';
import HeatmapOverlay from '@/components/dashboard/HeatmapOverlay';
import { Incident, StatsData } from '@/lib/types';
import { getIncidents, getStats } from '@/lib/api';
import { initSocket } from '@/lib/socket';

// Dynamic import for Three.js in Command Center
const SchoolScene = dynamic(() => import('@/components/canvas/SchoolScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-ink-950 text-ink-300 gap-3">
      <div className="w-8 h-8 border-2 border-ink-300 border-t-white rounded-full animate-spin" />
      <span className="text-sm">กำลังโหลดแผนผัง</span>
    </div>
  ),
});

export default function AdminCommandCenter() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>();
  const [stats, setStats] = useState<StatsData>({
    total_incidents: 12,
    pending_count: 2,
    in_progress_count: 4,
    resolved_count: 6,
    critical_count: 1,
    avg_resolution_hours: 1.5,
    today_count: 5,
    weekly_trend: [1, 3, 2, 4, 3, 5, 2],
  });
  const [isHeatmapActive, setIsHeatmapActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const incRes = await getIncidents({ limit: 50 });
      if (incRes && incRes.data) {
        setIncidents(incRes.data);
        if (!selectedIncident && incRes.data.length > 0) {
          setSelectedIncident(incRes.data[0]);
        }
      }
      const stRes = await getStats();
      if (stRes) setStats(stRes);
    } catch (err) {
      // Mock initial data if backend is connecting
      const mockIncidents: Incident[] = [
        {
          id: 101,
          tracking_code: 'SAFE-SOS-01',
          title: '🚨 คนหมดสติหน้าโรงยิม ต้องการปฐมพยาบาลด่วน',
          description: 'นักเรียนหมดสติขณะเรียนวิชาพละ มีเพื่อนอยู่ด้วย 2 คน',
          category: 'SOS_EMERGENCY',
          severity: 'CRITICAL',
          status: 'PENDING',
          building_id: 4,
          floor_number: 1,
          room_or_zone: 'โถงทางเข้าโรงยิม',
          pin_x: -15,
          pin_y: 2,
          pin_z: 12,
          is_anonymous: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 102,
          tracking_code: 'SAFE-9A4K-22',
          title: 'สายไฟชำรุดมีประกายไฟที่ชั้น 2',
          description: 'สายไฟต่อพ่วงพัดลมชำรุด มีกลิ่นไหม้',
          category: 'SECURITY_RISK',
          severity: 'HIGH',
          status: 'IN_PROGRESS',
          building_id: 2,
          floor_number: 2,
          room_or_zone: 'ห้อง 204 อาคารเรียน B',
          pin_x: 12,
          pin_y: 4,
          pin_z: -12,
          is_anonymous: true,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 103,
          tracking_code: 'SAFE-B44L-99',
          title: 'ขอคำปรึกษาปัญหาการถูกกลั่นแกล้งในกลุ่ม',
          description: 'ถูกแกล้งในห้องน้ำและส่งข้อความข่มขู่ในโซเชียล',
          category: 'BULLYING_MENTAL',
          severity: 'HIGH',
          status: 'IN_PROGRESS',
          building_id: 1,
          floor_number: 3,
          room_or_zone: 'ห้องน้ำชายชั้น 3',
          pin_x: -12,
          pin_y: 6,
          pin_z: -12,
          is_anonymous: true,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 104,
          tracking_code: 'SAFE-3112-X4',
          title: 'ซ่อมแซมก๊อกน้ำอ่างล้างมือชำรุด',
          description: 'น้ำไหลตลอดเวลา ไม่สามารถปิดสนิทได้',
          category: 'FACILITY_REPAIR',
          severity: 'LOW',
          status: 'RESOLVED',
          building_id: 3,
          floor_number: 1,
          room_or_zone: 'ห้องน้ำชั้น 1 อาคารอเนกประสงค์',
          pin_x: 0,
          pin_y: 2,
          pin_z: 5,
          is_anonymous: false,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setIncidents(mockIncidents);
      setSelectedIncident(mockIncidents[0]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Connect WebSocket
    const socket = initSocket();
    if (socket) {
      socket.on('incident:new', (data: { incident: Incident }) => {
        setIncidents((prev) => [data.incident, ...prev]);
        if (data.incident.severity === 'CRITICAL' && soundEnabled) {
          playAlertSound();
        }
      });

      socket.on('incident:sos', (data: { incident: Incident }) => {
        setIncidents((prev) => [data.incident, ...prev]);
        setSelectedIncident(data.incident);
        if (soundEnabled) {
          playAlertSound();
        }
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [soundEnabled]);

  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  const handleIncidentSelect = (item: Incident) => {
    setSelectedIncident(item);
  };

  const handleIncidentUpdate = (updated: Incident) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedIncident(updated);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-ink-950 text-ink-50 overflow-hidden font-sans">
      <header className="h-14 bg-ink-950 border-b border-white/10 px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-ink-200 hover:text-white border border-white/15 px-2.5 py-1.5 rounded-full transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            หน้าแรก
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white text-ink-900 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display text-base text-white block leading-none">
                ศูนย์บัญชาการ
              </span>
              <span className="text-[11px] text-ink-300">SafeSchool</span>
            </div>
          </div>
        </div>

        {/* Center Live Status Indicators */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="text-ink-200 text-xs">ออนไลน์</span>
          </div>

          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" />
            <span className="text-white text-xs">
              SOS {incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length}
            </span>
          </div>
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs transition ${
              soundEnabled
                ? 'bg-white text-ink-900 border-white'
                : 'bg-transparent border-white/15 text-ink-300'
            }`}
            title={soundEnabled ? 'ปิดเสียงไซเรนเตือนภัย' : 'เปิดเสียงไซเรนเตือนภัย'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 border border-white/15 rounded-full text-ink-200 hover:text-white transition"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-white' : ''}`} />
          </button>
        </div>
      </header>

      {/* Top Quick Stats Strip */}
      <div className="p-3 bg-ink-900/40 border-b border-white/10 z-20">
        <StatsCards stats={stats} />
      </div>

      {/* Main 3-Panel Work Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL (25%): Incident Feed */}
        <div className="w-80 lg:w-96 shrink-0 h-full overflow-hidden z-20">
          <IncidentFeed
            incidents={incidents}
            selectedId={selectedIncident?.id}
            onSelect={handleIncidentSelect}
          />
        </div>

        {/* CENTER VIEWPORT: 3D Campus Map */}
        <div className="flex-1 h-full relative overflow-hidden bg-ink-950">
          {/* Heatmap Overlay Switcher */}
          <HeatmapOverlay
            isHeatmapActive={isHeatmapActive}
            onToggle={() => setIsHeatmapActive(!isHeatmapActive)}
          />

          {/* 3D Scene */}
          <SchoolScene
            incidents={incidents}
            selectedBuildingCode={selectedBuilding}
            selectedIncidentId={selectedIncident?.id}
            onBuildingClick={(code) => setSelectedBuilding(code)}
            onIncidentClick={handleIncidentSelect}
            darkMode={true}
          />

          {/* Bottom Floating Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-ink-950/85 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 text-xs text-ink-200 flex items-center gap-4">
            <span className="text-white">หมุด</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-900 ring-2 ring-white" />
              วิกฤต
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-500" />
              เสี่ยง
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-300" />
              ซ่อม
            </span>
          </div>
        </div>

        {/* RIGHT PANEL (25%): Incident Details & Action */}
        <div className="w-80 lg:w-96 shrink-0 h-full overflow-hidden z-20">
          <IncidentDetail
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onUpdate={handleIncidentUpdate}
          />
        </div>
      </div>
    </div>
  );
}
