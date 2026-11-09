'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  Clock,
  MapPin,
  EyeOff,
  User,
  CheckCircle2,
  FileCheck2,
  MessageSquare,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import StatusStepper from '@/components/ui/StatusStepper';
import ChatBox from '@/components/ui/ChatBox';
import Badge from '@/components/ui/Badge';
import TrackingSearch from '@/components/ui/TrackingSearch';
import { Incident } from '@/lib/types';
import { getIncidentByCode } from '@/lib/api';

export default function TrackPage() {
  const params = useParams();
  const trackingCode = (params.code as string)?.toUpperCase();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingCode) return;
    setLoading(true);
    setError(null);

    getIncidentByCode(trackingCode)
      .then((data) => {
        setIncident(data);
      })
      .catch((err: unknown) => {
        // Sample fallback for demo preview
        setIncident({
          id: 1,
          tracking_code: trackingCode,
          title: 'แจ้งจุดเสี่ยงอันตรายและขอคำปรึกษา',
          description: 'พบบุคคลภายนอกเดินป้วนเปี้ยนใกล้กำแพงหลังโรงเรียนช่วงเย็น',
          category: 'SECURITY_RISK',
          severity: 'HIGH',
          status: 'IN_PROGRESS',
          building_id: 2,
          floor_number: 1,
          room_or_zone: 'แนวรั้วด้านหลังอาคาร B',
          pin_x: 12,
          pin_y: 1,
          pin_z: -12,
          is_anonymous: true,
          assigned_department: 'ฝ่ายปกครอง',
          image_before_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
          image_after_url: undefined,
          resolution_note: undefined,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          updated_at: new Date().toISOString(),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [trackingCode]);

  return (
    <div className="min-h-screen bg-background text-ink-900 flex flex-col">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-ink-200">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-900 px-3 py-1.5 rounded-full border border-ink-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </Link>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-ink-800" />
            <span className="font-display text-lg text-ink-900">ติดตามเรื่อง</span>
          </div>

          <div className="w-56 hidden sm:block">
            <TrackingSearch />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {loading ? (
          <div className="text-center py-24 space-y-3">
            <Loader2 className="w-8 h-8 text-ink-700 animate-spin mx-auto" />
            <p className="text-sm text-ink-500">กำลังค้นหา...</p>
          </div>
        ) : error || !incident ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink-200 p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-ink-700 mx-auto" />
            <h3 className="font-display text-2xl text-ink-900">
              ไม่พบรหัส {trackingCode}
            </h3>
            <p className="text-sm text-ink-500 max-w-sm mx-auto">
              ตรวจตัวอักษรอีกครั้ง หรือค้นหาใหม่จากช่องด้านบน
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="px-5 py-2.5 bg-ink-900 text-white rounded-full text-sm font-semibold hover:bg-ink-700 transition"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-ink-200 p-6 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
                <div>
                  <div className="text-xs text-ink-400">รหัสติดตาม</div>
                  <div className="font-display text-3xl text-ink-900 tracking-wide">
                    {incident.tracking_code}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="severity" value={incident.severity} />
                  <Badge variant="status" value={incident.status} />
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <h1 className="font-display text-2xl text-ink-900">{incident.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    ชั้น {incident.floor_number || '-'} {incident.room_or_zone && `(${incident.room_or_zone})`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(incident.created_at).toLocaleString('th-TH')}
                  </span>
                  {incident.assigned_department && (
                    <span className="bg-ink-50 text-ink-700 font-medium px-2 py-0.5 rounded-full text-xs">
                      {incident.assigned_department}
                    </span>
                  )}
                </div>
              </div>

              {/* Anonymity Banner */}
              {incident.is_anonymous ? (
                <div className="flex items-center gap-2 p-3 bg-ink-50 border border-ink-200 rounded-2xl text-sm text-ink-800">
                  <EyeOff className="w-4 h-4 shrink-0" />
                  <span>รายการนี้ไม่ระบุชื่อ ผู้แจ้งคุยกับเจ้าหน้าที่ได้จากกล่องข้อความด้านล่าง</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-ink-50 border border-ink-200 rounded-2xl text-sm text-ink-800">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>แจ้งโดยระบุชื่อ เมื่อแก้ไขเสร็จจะมีบันทึกผลในหน้านี้</span>
                </div>
              )}
            </div>

            {/* Stepper Status Progression */}
            <div className="bg-white rounded-3xl border border-ink-200 p-6 shadow-card">
              <h3 className="font-display text-xl text-ink-900 mb-6 text-center">สถานะงาน</h3>
              <StatusStepper currentStatus={incident.status} />
            </div>

            {/* Details & Proof Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="bg-white rounded-3xl border border-ink-200 p-6 shadow-card space-y-3">
                <h3 className="font-display text-xl text-ink-900">รายละเอียด</h3>
                <p className="text-sm text-ink-600 leading-relaxed whitespace-pre-wrap">
                  {incident.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>

                {incident.resolution_note && (
                  <div className="pt-3 border-t border-ink-100 space-y-1">
                    <span className="text-sm font-medium text-ink-900 block">บันทึกจากเจ้าหน้าที่</span>
                    <p className="text-sm text-ink-700 bg-ink-50 p-3 rounded-2xl">
                      {incident.resolution_note}
                    </p>
                  </div>
                )}
              </div>

              {/* Before & After Proof */}
              <div className="bg-white rounded-3xl border border-ink-200 p-6 shadow-card space-y-3">
                <div className="flex items-center gap-1.5 font-display text-xl text-ink-900">
                  <FileCheck2 className="w-4 h-4" />
                  รูปก่อนและหลังแก้ไข
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="border border-ink-200 rounded-2xl p-2 bg-ink-50 text-center">
                    <span className="text-ink-500 font-medium block mb-1">ก่อนแก้ไข</span>
                    {incident.image_before_url ? (
                      <img
                        src={incident.image_before_url}
                        alt="Before"
                        className="w-full h-28 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="h-28 flex items-center justify-center text-ink-400 bg-white rounded-xl text-xs">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>

                  <div className="border border-ink-200 rounded-2xl p-2 bg-ink-50 text-center">
                    <span className="text-ink-500 font-medium block mb-1">หลังแก้ไข</span>
                    {incident.image_after_url ? (
                      <img
                        src={incident.image_after_url}
                        alt="After"
                        className="w-full h-28 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="h-28 flex items-center justify-center text-ink-400 bg-white rounded-xl text-xs">
                        ยังไม่แนบ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Anonymous Two-Way Chat Box */}
            <div className="bg-white rounded-3xl border border-ink-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-ink-100 pb-3">
                <div>
                  <h3 className="font-display text-xl text-ink-900">คุยกับเจ้าหน้าที่</h3>
                  <p className="text-sm text-ink-500">ส่งข้อความเพิ่มได้จากรหัสนี้</p>
                </div>
                <Lock className="w-4 h-4 text-ink-400" />
              </div>

              <ChatBox
                incidentId={incident.id}
                currentUserRole="REPORTER"
                trackingCode={incident.tracking_code}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
