'use client';

import React, { useState } from 'react';
import { AlertCircle, Flame, HeartPulse, Wrench, ShieldAlert, Filter, Search } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface IncidentFeedProps {
  incidents: Incident[];
  selectedId?: number;
  onSelect: (incident: Incident) => void;
}

export default function IncidentFeed({
  incidents,
  selectedId,
  onSelect,
}: IncidentFeedProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SOS_EMERGENCY':
        return <Flame className="w-4 h-4 text-white" />;
      case 'ACCIDENT_MEDICAL':
        return <HeartPulse className="w-4 h-4 text-ink-100" />;
      case 'BULLYING_MENTAL':
        return <ShieldAlert className="w-4 h-4 text-ink-100" />;
      case 'FACILITY_REPAIR':
        return <Wrench className="w-4 h-4 text-ink-200" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ink-200" />;
    }
  };

  const filtered = incidents.filter((item) => {
    if (filterSeverity !== 'ALL' && item.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.tracking_code.toLowerCase().includes(q);
      const matchZone = item.room_or_zone?.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchZone) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-ink-950/80 border-r border-white/10">
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-white">รายการแจ้งเหตุ</h2>
          <span className="text-xs text-ink-200 bg-white/5 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-300 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ รหัส หรือสถานที่"
            className="w-full bg-ink-900 border border-white/10 rounded-full pl-8 pr-3 py-2 text-sm text-white placeholder-ink-400 focus:outline-none focus:border-white/40"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={cn(
                'px-2.5 py-1 rounded-md transition font-medium',
                filterSeverity === s
                  ? 'bg-white text-ink-900 font-semibold'
                  : 'bg-white/5 text-ink-200 hover:text-white'
              )}
            >
              {s === 'ALL' ? 'ทั้งหมด' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-ink-300 text-sm">
            ไม่มีเหตุการณ์ตรงกับเงื่อนไข
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = selectedId === item.id;
            const isCritical = item.severity === 'CRITICAL';

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={cn(
                  'p-3 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden',
                  isSelected
                    ? 'border-white bg-white/10'
                    : isCritical
                    ? 'border-white/40 bg-white/5'
                    : 'border-white/10 bg-ink-900/40 hover:border-white/30'
                )}
              >
                {isCritical && (
                  <div className="absolute top-0 right-0 bg-white text-[10px] font-semibold text-ink-900 px-2 py-0.5 rounded-bl-lg">
                    SOS
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-full bg-white/10">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] text-ink-100 font-medium">
                        {item.tracking_code}
                      </span>
                      <span className="text-[10px] text-ink-400">·</span>
                      <span className="text-[11px] text-ink-300 truncate">
                        {item.room_or_zone || 'บริเวณโรงเรียน'}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white truncate">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="severity" value={item.severity} />
                      <Badge variant="status" value={item.status} />
                      {item.is_anonymous && (
                        <span className="text-[10px] border border-white/20 text-ink-100 px-1.5 py-0.5 rounded-full">
                          ไม่ระบุชื่อ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
