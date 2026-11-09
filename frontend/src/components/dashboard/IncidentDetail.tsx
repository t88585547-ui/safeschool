'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  Loader2,
  FileCheck2,
} from 'lucide-react';
import { Incident, IncidentStatus } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import ChatBox from '@/components/ui/ChatBox';
import { updateIncidentStatus } from '@/lib/api';

interface IncidentDetailProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdate: (updated: Incident) => void;
}

export default function IncidentDetail({
  incident,
  onClose,
  onUpdate,
}: IncidentDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [status, setStatus] = useState<IncidentStatus>(incident?.status || 'PENDING');
  const [resolutionNote, setResolutionNote] = useState('');
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!incident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-ink-300 bg-ink-950/80 border-l border-white/10">
        <ShieldCheck className="w-10 h-10 text-ink-400 mb-3 stroke-1" />
        <p className="text-sm font-medium text-white">เลือกรายการเพื่อดูรายละเอียด</p>
        <p className="text-xs text-ink-300 mt-1">คลิกรายการทางซ้าย หรือหมุดบนแผนผัง</p>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    try {
      setIsSubmitting(true);
      const updated = await updateIncidentStatus(
        incident.id,
        newStatus,
        resolutionNote || undefined,
        afterImage || undefined
      );
      setStatus(newStatus);
      onUpdate(updated);
      setSuccessMsg(`เปลี่ยนสถานะเป็น ${newStatus} สำเร็จ`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      alert((err as Error).message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ink-950/90 border-l border-white/10 text-ink-100">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink-200">
              {incident.tracking_code}
            </span>
            <Badge variant="severity" value={incident.severity} />
          </div>
          <h3 className="text-sm font-semibold text-white mt-1 line-clamp-1">
            {incident.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 text-ink-300 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-4 text-sm">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-2.5 mr-4 border-b-2 transition ${
            activeTab === 'details'
              ? 'border-white text-white'
              : 'border-transparent text-ink-300 hover:text-white'
          }`}
        >
          ดำเนินการ
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2.5 border-b-2 transition ${
            activeTab === 'chat'
              ? 'border-white text-white'
              : 'border-transparent text-ink-300 hover:text-white'
          }`}
        >
          ตอบกลับ
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'chat' ? (
          <div className="h-full flex flex-col">
            <ChatBox
              incidentId={incident.id}
              currentUserRole="OFFICER"
              trackingCode={incident.tracking_code}
            />
          </div>
        ) : (
          <>
            {/* Status Flow Action Bar */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <label className="text-xs font-medium text-ink-200 block">อัปเดตสถานะ</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'] as IncidentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={isSubmitting}
                    className={`py-2 px-2.5 rounded-lg font-medium transition ${
                      status === st
                        ? 'bg-white text-ink-900 font-semibold'
                        : 'bg-white/5 text-ink-100 hover:bg-white/10'
                    }`}
                  >
                    {st === 'PENDING' && 'รับเรื่อง'}
                    {st === 'ACKNOWLEDGED' && 'ตรวจสอบ'}
                    {st === 'IN_PROGRESS' && 'กำลังแก้ไข'}
                    {st === 'RESOLVED' && 'เสร็จสิ้น'}
                  </button>
                ))}
              </div>

              {successMsg && (
                <div className="text-xs text-white font-medium text-center pt-1 animate-fade-in">
                  ✓ {successMsg}
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                <MapPin className="w-3.5 h-3.5" />
                สถานที่
              </div>
              <div className="text-sm text-ink-200 space-y-1">
                <div>ชั้น {incident.floor_number || '-'} {incident.room_or_zone && `(${incident.room_or_zone})`}</div>
                <div className="text-xs text-ink-400">
                  พิกัด 3D: [{incident.pin_x}, {incident.pin_y}, {incident.pin_z}]
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                {incident.is_anonymous ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>ไม่ระบุชื่อ</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>ระบุชื่อแล้ว</span>
                  </>
                )}
              </div>
              <p className="text-sm text-ink-200 leading-relaxed">
                {incident.is_anonymous
                  ? 'ผู้แจ้งไม่ได้ใส่ชื่อ ตอบกลับได้จากแท็บข้อความ'
                  : 'ผู้แจ้งใส่ชื่อไว้ ใช้เมื่อต้องติดต่อกลับ'}
              </p>
            </div>

            {/* Description */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
              <span className="text-sm font-medium text-white">รายละเอียด</span>
              <p className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap">
                {incident.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
              </p>
            </div>

            {/* Before / After Proof */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                <FileCheck2 className="w-3.5 h-3.5" />
                รูปก่อนและหลัง
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="border border-white/10 rounded-xl p-2 bg-ink-900/60 text-center">
                  <span className="text-ink-300 block mb-1">ก่อน</span>
                  {incident.image_before_url ? (
                    <img
                      src={incident.image_before_url}
                      alt="Before"
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-20 flex items-center justify-center text-ink-400 bg-ink-950 rounded-lg">
                      ไม่มีภาพ
                    </div>
                  )}
                </div>

                <div className="border border-white/10 rounded-xl p-2 bg-ink-900/60 text-center">
                  <span className="text-ink-300 block mb-1">หลัง</span>
                  {incident.image_after_url ? (
                    <img
                      src={incident.image_after_url}
                      alt="After"
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-20 flex items-center justify-center text-ink-400 bg-ink-950 rounded-lg">
                      ยังไม่แนบ
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Note */}
              <div className="pt-2">
                <label className="text-xs text-ink-300 block mb-1">บันทึกการแก้ไข</label>
                <textarea
                  rows={2}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="เช่น เปลี่ยนหลอดไฟแล้ว"
                  className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-ink-500 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
