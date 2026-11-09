'use client';

import React from 'react';
import { Building, MapPin, ChevronDown } from 'lucide-react';
import { ReportFormData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StepLocationProps {
  formData: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

const BUILDINGS = [
  { id: 1, code: 'A', name: 'อาคารเรียน A', floors: 3 },
  { id: 2, code: 'B', name: 'อาคารเรียน B', floors: 4 },
  { id: 3, code: 'C', name: 'อาคารอเนกประสงค์', floors: 2 },
  { id: 4, code: 'D', name: 'โรงยิม', floors: 2 },
  { id: 5, code: 'E', name: 'อาคารวิทยาศาสตร์', floors: 5 },
];

export default function StepLocation({ formData, onChange }: StepLocationProps) {
  const selectedBuilding = BUILDINGS.find((b) => b.id === formData.building_id);
  const floors = selectedBuilding
    ? Array.from({ length: selectedBuilding.floors }, (_, i) => i + 1)
    : [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-5 h-5 text-ink-800" />
        </div>
        <h3 className="font-display text-2xl text-ink-900">เกิดเหตุที่ไหน?</h3>
        <p className="text-sm text-text-secondary mt-1">เลือกอาคาร ชั้น และห้อง/โซน</p>
      </div>

      {/* Building Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          อาคาร
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BUILDINGS.map((building) => (
            <button
              key={building.id}
              type="button"
              onClick={() =>
                onChange({
                  building_id: building.id,
                  floor_number: undefined,
                  room_or_zone: '',
                })
              }
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all',
                'hover:border-primary/50 hover:bg-primary/5',
                formData.building_id === building.id
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border'
              )}
            >
              <Building
                className={cn(
                  'w-6 h-6',
                  formData.building_id === building.id
                    ? 'text-primary'
                    : 'text-slate-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  formData.building_id === building.id
                    ? 'text-primary'
                    : 'text-text-primary'
                )}
              >
                {building.name}
              </span>
              <span className="text-xs text-text-secondary">
                {building.floors} ชั้น
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floor Selection */}
      {selectedBuilding && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-text-primary mb-2">
            ชั้น
          </label>
          <div className="flex flex-wrap gap-2">
            {floors.map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => onChange({ floor_number: floor })}
                className={cn(
                  'w-12 h-12 rounded-full border font-semibold transition-all',
                  'hover:border-primary/50 hover:bg-primary/5',
                  formData.floor_number === floor
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-text-primary'
                )}
              >
                {floor}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Room / Zone */}
      {formData.floor_number && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-text-primary mb-2">
            ห้อง / โซน (ถ้าทราบ)
          </label>
          <input
            type="text"
            value={formData.room_or_zone || ''}
            onChange={(e) => onChange({ room_or_zone: e.target.value })}
            placeholder="เช่น ห้อง 301, โถงทางเดิน, หน้าห้องน้ำ"
            className="input-field"
          />
        </div>
      )}

      {/* Summary */}
      {formData.building_id && formData.floor_number && (
        <div className="animate-fade-in p-4 bg-ink-50 rounded-2xl border border-ink-200">
          <p className="text-sm font-medium text-primary">
            📍 {selectedBuilding?.name} ชั้น {formData.floor_number}
            {formData.room_or_zone ? ` - ${formData.room_or_zone}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}
