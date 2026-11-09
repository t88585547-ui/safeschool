'use client';

import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StatsData } from '@/lib/types';

interface StatsCardsProps {
  stats?: StatsData;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'ฉุกเฉิน',
      value: stats?.critical_count ?? 0,
      icon: ShieldAlert,
      hint: 'ต้องช่วยทันที',
    },
    {
      title: 'รอดำเนินการ',
      value: stats?.pending_count ?? 0,
      icon: Clock,
      hint: 'ยังไม่มีคนรับเรื่อง',
    },
    {
      title: 'กำลังทำ',
      value: stats?.in_progress_count ?? 0,
      icon: AlertCircle,
      hint: 'มีเจ้าหน้าที่ดูแลแล้ว',
    },
    {
      title: 'เสร็จแล้ว',
      value: stats?.resolved_count ?? 0,
      icon: CheckCircle2,
      hint: 'ปิดงานพร้อมบันทึก',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-200">{card.title}</span>
              <Icon className="w-4 h-4 text-ink-100" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl text-white">{card.value}</span>
              <span className="text-xs text-ink-300">รายการ</span>
            </div>
            <div className="mt-1 text-xs text-ink-300">{card.hint}</div>
          </div>
        );
      })}
    </div>
  );
}
