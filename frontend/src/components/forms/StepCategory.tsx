'use client';

import React from 'react';
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  Wrench,
  ShieldAlert,
  Camera,
  X,
} from 'lucide-react';
import { IncidentCategory, IncidentSeverity, ReportFormData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StepCategoryProps {
  formData: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

const CATEGORIES: {
  id: IncidentCategory;
  name: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'SOS_EMERGENCY',
    name: 'เหตุด่วนฉุกเฉิน',
    desc: 'ไฟไหม้ คนหมดสติ อาวุธ หรือมีคนบุกรุก',
    icon: Flame,
  },
  {
    id: 'ACCIDENT_MEDICAL',
    name: 'อุบัติเหตุ / พยาบาล',
    desc: 'หกล้ม เลือดออก เป็นลม หรือบาดเจ็บ',
    icon: HeartPulse,
  },
  {
    id: 'BULLYING_MENTAL',
    name: 'การกลั่นแกล้ง / สุขภาพจิต',
    desc: 'ถูกกลั่นแกล้ง คุกคาม หรือต้องการคำปรึกษา',
    icon: ShieldAlert,
  },
  {
    id: 'FACILITY_REPAIR',
    name: 'แจ้งซ่อม',
    desc: 'ไฟดับ น้ำรั่ว แอร์เสีย หรือประตูชำรุด',
    icon: Wrench,
  },
  {
    id: 'SECURITY_RISK',
    name: 'จุดเสี่ยง',
    desc: 'สายไฟเปลือย พื้นลื่น หรือมุมมืด',
    icon: AlertTriangle,
  },
];

const SEVERITIES: {
  id: IncidentSeverity;
  label: string;
  desc: string;
}[] = [
  { id: 'CRITICAL', label: 'วิกฤต', desc: 'ต้องช่วยทันที' },
  { id: 'HIGH', label: 'สูง', desc: 'เร่งแก้ไข' },
  { id: 'MEDIUM', label: 'ปานกลาง', desc: 'กระทบการเรียน' },
  { id: 'LOW', label: 'ทั่วไป', desc: 'ซ่อมบำรุง' },
];

export default function StepCategory({ formData, onChange }: StepCategoryProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange({ image: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-5 h-5 text-ink-800" />
        </div>
        <h3 className="font-display text-2xl text-ink-900">เกิดอะไรขึ้น?</h3>
        <p className="text-sm text-text-secondary mt-1">เลือกหมวดหมู่ ระดับความด่วน และระบุรายละเอียด</p>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          หมวดหมู่ <span className="text-ink-400">จำเป็น</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = formData.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  const autoSeverity = cat.id === 'SOS_EMERGENCY' ? 'CRITICAL' : formData.severity || 'MEDIUM';
                  onChange({ category: cat.id, severity: autoSeverity });
                }}
                className={cn(
                  'flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all',
                  isSelected ? 'border-ink-900 bg-ink-50' : 'border-ink-200 bg-white hover:border-ink-400'
                )}
              >
                <div className="p-2 rounded-full shrink-0 mt-0.5 bg-ink-100">
                  <Icon className="w-4 h-4 text-ink-800" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{cat.name}</div>
                  <div className="text-xs text-ink-500 mt-0.5 leading-snug">{cat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          ความเร่งด่วน <span className="text-ink-400">จำเป็น</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SEVERITIES.map((sev) => {
            const isSelected = formData.severity === sev.id;
            return (
              <button
                key={sev.id}
                type="button"
                onClick={() => onChange({ severity: sev.id })}
                className={cn(
                  'p-3 rounded-2xl border text-center transition-all',
                  isSelected
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-200 bg-white hover:border-ink-400 text-ink-800'
                )}
              >
                <div className="text-sm font-semibold">{sev.label}</div>
                <div className={cn('text-[11px] mt-1', isSelected ? 'text-ink-200' : 'text-ink-500')}>{sev.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          หัวข้อ <span className="text-ink-400">จำเป็น</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="เช่น สายไฟเปลือยที่ทางเดินชั้น 2"
          className="input-field text-sm"
          maxLength={150}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          รายละเอียดเพิ่มเติม
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="อธิบายเหตุการณ์ สภาพแวดล้อม หรือข้อมูลเพิ่มเติมที่อาจเป็นประโยชน์..."
          className="input-field text-sm"
        />
      </div>

      {/* Photo Attachment */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          แนบรูปถ่ายสถานที่ / เหตุการณ์
        </label>
        {formData.image ? (
          <div className="flex items-center justify-between p-3 bg-ink-50 border border-ink-200 rounded-2xl">
            <span className="text-sm text-ink-800 truncate max-w-xs">{formData.image.name}</span>
            <button
              type="button"
              onClick={() => onChange({ image: null })}
              className="p-1 hover:bg-ink-100 rounded-full text-ink-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-ink-300 rounded-2xl hover:border-ink-700 hover:bg-ink-50 cursor-pointer transition">
            <Camera className="w-5 h-5 text-ink-400 mb-1" />
            <span className="text-sm text-ink-700 font-medium">แนบรูปภาพ</span>
            <span className="text-xs text-ink-400">JPG หรือ PNG</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
