'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import StepLocation from './StepLocation';
import StepCategory from './StepCategory';
import StepIdentity from './StepIdentity';
import { ReportFormData, Incident } from '@/lib/types';
import { createIncident } from '@/lib/api';

interface ReportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialPin?: { x: number; y: number; z: number };
  onSuccess?: (incident: Incident) => void;
}

const INITIAL_FORM: ReportFormData = {
  building_id: undefined,
  floor_number: undefined,
  room_or_zone: '',
  pin_x: 0,
  pin_y: 0,
  pin_z: 0,
  category: undefined,
  severity: 'MEDIUM',
  title: '',
  description: '',
  image: null,
  is_anonymous: false,
  reporter_name: '',
  reporter_contact: '',
};

export default function ReportWizard({
  isOpen,
  onClose,
  initialPin,
  onSuccess,
}: ReportWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<ReportFormData>(() => ({
    ...INITIAL_FORM,
    pin_x: initialPin?.x || 0,
    pin_y: initialPin?.y || 0,
    pin_z: initialPin?.z || 0,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  const handleUpdate = (partial: Partial<ReportFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setError(null);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.building_id) {
        setError('กรุณาเลือกอาคารที่เกิดเหตุ');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.category) {
        setError('กรุณาเลือกหมวดหมู่เหตุการณ์');
        return;
      }
      if (!formData.title.trim()) {
        setError('กรุณากรอกหัวข้อเหตุการณ์');
        return;
      }
      setStep(3);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const incident = await createIncident(formData);
      setCreatedIncident(incident);
      if (onSuccess) onSuccess(incident);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedIncident(null);
    setFormData(INITIAL_FORM);
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={
        createdIncident
          ? 'แจ้งเหตุสำเร็จแล้ว'
          : `แจ้งเหตุการณ์และจุดเสี่ยง (ขั้นตอนที่ ${step}/3)`
      }
      maxWidth="max-w-2xl"
    >
      {createdIncident ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-14 h-14 bg-ink-900 text-white rounded-full flex items-center justify-center mx-auto">
            <Check className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-display text-2xl text-ink-900">รับเรื่องแล้ว</h3>
            <p className="text-sm text-ink-500 mt-1">
              เก็บรหัสนี้ไว้ ใช้ติดตามสถานะและส่งข้อความถึงเจ้าหน้าที่
            </p>
          </div>

          <div className="p-5 bg-ink-50 border border-ink-200 rounded-2xl max-w-sm mx-auto">
            <div className="text-xs text-ink-500 mb-1">รหัสติดตาม</div>
            <div className="font-display text-3xl text-ink-900 tracking-wide">
              {createdIncident.tracking_code}
            </div>
          </div>

          <p className="text-sm text-ink-600 bg-ink-50 p-3 rounded-2xl max-w-sm mx-auto">
            {createdIncident.is_anonymous
              ? 'รายการนี้ไม่ระบุชื่อผู้แจ้ง เจ้าหน้าที่ติดต่อกลับได้ผ่านรหัสนี้เท่านั้น'
              : 'เมื่อแก้ไขเสร็จ ระบบจะบันทึกผลไว้ในหน้ารายการนี้'}
          </p>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                handleReset();
                router.push(`/track/${createdIncident.tracking_code}`);
              }}
              className="px-6 py-2.5 bg-ink-900 hover:bg-ink-700 text-white rounded-full text-sm font-semibold transition"
            >
              ดูสถานะ
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-800 rounded-full text-sm font-medium transition"
            >
              ปิด
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between px-1 pb-4 border-b border-ink-100">
            {[
              { num: 1, label: 'สถานที่' },
              { num: 2, label: 'รายละเอียด' },
              { num: 3, label: 'ความเป็นส่วนตัว' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                    step === s.num
                      ? 'bg-ink-900 text-white'
                      : step > s.num
                      ? 'bg-ink-700 text-white'
                      : 'bg-ink-100 text-ink-400'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    step === s.num ? 'text-ink-900 font-semibold' : 'text-ink-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form Step Body */}
          <div className="min-h-[300px]">
            {step === 1 && (
              <StepLocation formData={formData} onChange={handleUpdate} />
            )}
            {step === 2 && (
              <StepCategory formData={formData} onChange={handleUpdate} />
            )}
            {step === 3 && (
              <StepIdentity formData={formData} onChange={handleUpdate} />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-ink-50 border border-ink-300 rounded-2xl flex items-center gap-2 text-ink-800 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-ink-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-ink-600 hover:bg-ink-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-sm font-medium text-ink-500 hover:bg-ink-50 transition"
              >
                ยกเลิก
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold bg-ink-900 text-white hover:bg-ink-700 transition"
              >
                ถัดไป
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-1.5 px-7 py-2.5 rounded-full text-sm font-semibold bg-ink-900 text-white hover:bg-ink-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    ยืนยันการแจ้งเหตุ
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
