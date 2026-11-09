'use client';

import React from 'react';
import { Flame, ShieldAlert, Sparkles, TrendingUp, Info } from 'lucide-react';

interface HeatmapOverlayProps {
  isHeatmapActive: boolean;
  onToggle: () => void;
  highRiskZones?: { name: string; incidentCount: number; primaryRisk: string }[];
}

export default function HeatmapOverlay({
  isHeatmapActive,
  onToggle,
  highRiskZones = [
    { name: 'อาคารเรียน B ชั้น 3 (ห้องน้ำ)', incidentCount: 8, primaryRisk: 'Bullying / การสูบบุหรี่' },
    { name: 'ด้านหลังอาคารวิทยาศาสตร์', incidentCount: 5, primaryRisk: 'จุดอับมืด / ไฟส่องสว่างไม่พอ' },
    { name: 'บันไดทางขึ้นโรงยิม', incidentCount: 4, primaryRisk: 'พื้นลื่นเมื่อฝนตก' },
  ],
}: HeatmapOverlayProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Heatmap Toggle Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
          isHeatmapActive
            ? 'bg-white text-ink-900 border-white'
            : 'bg-ink-950/90 text-ink-100 border-white/15 hover:bg-ink-900'
        }`}
      >
        <Flame className="w-4 h-4" />
        {isHeatmapActive ? 'ปิดแผนที่ความเสี่ยง' : 'เปิดแผนที่ความเสี่ยง'}
      </button>

      {/* Heatmap Info Drawer when Active */}
      {isHeatmapActive && (
        <div className="w-72 bg-ink-950/95 border border-white/10 rounded-2xl p-4 shadow-card text-ink-100 animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-sm font-medium text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              จุดเสี่ยงสะสม
            </span>
          </div>

          {/* Color Legend */}
          <div className="space-y-1.5 text-[11px]">
            <div className="text-ink-300 font-medium">ความหนาแน่น</div>
            <div className="grid grid-cols-4 gap-1 text-center font-medium text-[10px]">
              <div className="bg-ink-900 text-white py-1 rounded">สูงสุด</div>
              <div className="bg-ink-700 text-white py-1 rounded">สูง</div>
              <div className="bg-ink-500 text-white py-1 rounded">กลาง</div>
              <div className="bg-ink-300 text-ink-900 py-1 rounded">ต่ำ</div>
            </div>
          </div>

          {/* Top Risk Zones */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-medium text-white">จุดที่พบบ่อยสัปดาห์นี้</div>
            {highRiskZones.map((zone, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-xs space-y-0.5"
              >
                <div className="flex justify-between font-medium text-white">
                  <span>{zone.name}</span>
                  <span>{zone.incidentCount} ครั้ง</span>
                </div>
                <div className="text-[11px] text-ink-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  {zone.primaryRisk}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 text-[11px] text-ink-200 bg-white/5 border border-white/10 p-2 rounded-xl flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>คำแนะนำ: ควรจัดเวรยามตรวจตราอาคาร B ชั้น 3 และติดตั้งหลอดไฟส่องสว่างเพิ่มหลังอาคารวิทย์</span>
          </div>
        </div>
      )}
    </div>
  );
}
