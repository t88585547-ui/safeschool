'use client';

import React from 'react';
import { UserCheck, EyeOff, Award, Lock, Sparkles } from 'lucide-react';
import { ReportFormData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StepIdentityProps {
  formData: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

export default function StepIdentity({ formData, onChange }: StepIdentityProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5 text-ink-800" />
        </div>
        <h3 className="font-display text-2xl text-ink-900">จะให้ระบุชื่อไหม</h3>
        <p className="text-sm text-text-secondary mt-1">
          เรื่องทั่วไประบุชื่อได้ เรื่องละเอียดอ่อนแจ้งโดยไม่ระบุตัวตนก็ได้
        </p>
      </div>

      {/* Identity Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Anonymous Option */}
        <button
          type="button"
          onClick={() => onChange({ is_anonymous: true })}
          className={cn(
            'flex flex-col items-start p-4 rounded-2xl border text-left transition-all',
            formData.is_anonymous
              ? 'border-ink-900 bg-ink-50'
              : 'border-ink-200 bg-white hover:border-ink-400'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-ink-900 text-white">
              <EyeOff className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink-900 text-sm">ไม่ระบุตัวตน</span>
          </div>
          <p className="text-sm text-ink-600 leading-relaxed">
            เหมาะกับเรื่องกลั่นแกล้ง สุขภาพจิต หรือเรื่องที่ยังไม่พร้อมเปิดชื่อ
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-700">
            <Lock className="w-3.5 h-3.5" />
            ได้รหัสติดตามไว้คุยกับเจ้าหน้าที่
          </div>
        </button>

        {/* Identified Option */}
        <button
          type="button"
          onClick={() => onChange({ is_anonymous: false })}
          className={cn(
            'flex flex-col items-start p-4 rounded-2xl border text-left transition-all',
            !formData.is_anonymous
              ? 'border-ink-900 bg-ink-50'
              : 'border-ink-200 bg-white hover:border-ink-400'
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-ink-100 text-ink-800">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink-900 text-sm">ระบุชื่อ</span>
          </div>
          <p className="text-sm text-ink-600 leading-relaxed">
            เหมาะกับแจ้งซ่อมหรือจุดเสี่ยงที่เจ้าหน้าที่อาจต้องโทรกลับ
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-700">
            <Sparkles className="w-3.5 h-3.5" />
            ใส่ชื่อและช่องทางติดต่อด้านล่าง
          </div>
        </button>
      </div>

      {/* Identified Inputs */}
      {!formData.is_anonymous && (
        <div className="p-4 bg-ink-50 border border-ink-200 rounded-2xl space-y-3 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1">
              ชื่อ หรือรหัสนักเรียน
            </label>
            <input
              type="text"
              value={formData.reporter_name || ''}
              onChange={(e) => onChange({ reporter_name: e.target.value })}
              placeholder="ชื่อ หรือรหัสนักเรียน"
              className="input-field text-sm py-2.5"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1">
              เบอร์โทรหรือช่องทางติดต่อ
            </label>
            <input
              type="text"
              value={formData.reporter_contact || ''}
              onChange={(e) => onChange({ reporter_contact: e.target.value })}
              placeholder="เบอร์โทร เพื่อให้เจ้าหน้าที่สอบถามเพิ่ม"
              className="input-field text-sm py-2.5"
            />
          </div>
        </div>
      )}

      {/* Anonymous Notice */}
      {formData.is_anonymous && (
        <div className="p-4 bg-ink-50 border border-ink-200 rounded-2xl text-sm text-ink-800 space-y-1.5 animate-fade-in">
          <div className="font-semibold flex items-center gap-1.5">
            <EyeOff className="w-4 h-4" />
            ไม่บันทึกชื่อ
          </div>
          <p className="text-ink-600 leading-relaxed">
            หลังส่งเรื่อง ระบบจะให้รหัสติดตาม ใช้รหัสนั้นเปิดสถานะและส่งข้อความหาเจ้าหน้าที่ได้
          </p>
        </div>
      )}
    </div>
  );
}
