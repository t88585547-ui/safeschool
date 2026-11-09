'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Check,
  ShieldAlert,
  Loader2,
  Volume2,
} from 'lucide-react';
import SOSButton from '@/components/ui/SOSButton';
import { createSOS } from '@/lib/api';
import { Incident } from '@/lib/types';

export default function SOSPage() {
  const router = useRouter();
  const [selectedBuilding, setSelectedBuilding] = useState<number>(1);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [isSending, setIsSending] = useState(false);
  const [sosResult, setSosResult] = useState<Incident | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt GPS geolocation
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Geolocation denied or unavailable - no problem, fallback to building
        }
      );
    }
  }, []);

  const handleSOSActivate = async () => {
    try {
      setIsSending(true);
      setError(null);
      const res = await createSOS({
        building_id: selectedBuilding,
        floor_number: floorNumber,
        latitude: coords.lat,
        longitude: coords.lng,
      });
      setSosResult(res);
    } catch (err: unknown) {
      setError((err as Error).message || 'เกิดข้อผิดพลาดในการส่งสัญญาณ SOS');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between max-w-xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-ink-200 hover:text-white px-3 py-1.5 rounded-full border border-white/15 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Link>

        <div className="flex items-center gap-1.5 text-xs tracking-wide text-ink-100 border border-white/15 px-3 py-1.5 rounded-full">
          <Volume2 className="w-4 h-4" />
          พร้อมส่งสัญญาณ
        </div>
      </div>

      {/* Main Body */}
      <div className="relative z-10 max-w-md mx-auto w-full flex-1 flex flex-col items-center justify-center text-center my-6">
        {sosResult ? (
          <div className="space-y-6 bg-ink-900 border border-white/10 rounded-3xl p-6 sm:p-8 animate-fade-in">
            <div className="w-16 h-16 bg-white text-ink-900 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h2 className="font-display text-3xl text-white">ส่งสัญญาณแล้ว</h2>
              <p className="text-sm text-ink-200 mt-2 leading-relaxed">
                ศูนย์บัญชาการได้รับเรื่องแล้ว เจ้าหน้าที่กำลังไปยังอาคารและชั้นที่คุณเลือก
              </p>
            </div>

            <div className="p-4 bg-ink-950 rounded-2xl border border-white/10 space-y-1">
              <div className="text-xs text-ink-300">รหัสติดตาม</div>
              <div className="font-display text-3xl text-white tracking-wide">
                {sosResult.tracking_code}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.push(`/track/${sosResult.tracking_code}`)}
                className="w-full py-3 bg-white hover:bg-ink-100 text-ink-900 rounded-full text-sm font-semibold transition"
              >
                ดูสถานะ
              </button>
              <Link
                href="/"
                className="w-full py-3 border border-white/15 text-ink-100 rounded-full text-sm font-medium transition hover:bg-white/5"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl text-white">กดค้างเพื่อขอความช่วยเหลือ</h1>
              <p className="text-sm text-ink-200 mt-3 max-w-xs mx-auto leading-relaxed">
                ใช้เมื่อมีไฟไหม้ คนหมดสติ หรือบาดเจ็บสาหัส กดปุ่มค้าง 2 วินาที
              </p>
            </div>

            {/* Huge Pulsing SOS Button */}
            <div className="my-2">
              <SOSButton onActivate={handleSOSActivate} disabled={isSending} size="large" />
            </div>

            {error && (
              <div className="p-3 bg-white/10 border border-white/15 rounded-2xl text-sm text-white">
                {error}
              </div>
            )}

            {/* Quick Location Specifier */}
            <div className="w-full bg-ink-900 border border-white/10 rounded-3xl p-4 text-left space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <MapPin className="w-4 h-4" />
                <span>ตอนนี้อยู่ที่ไหน</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-xs text-ink-300 block mb-1">อาคาร</label>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(Number(e.target.value))}
                    className="w-full bg-ink-950 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white text-sm"
                  >
                    <option value={1}>อาคารเรียน A</option>
                    <option value={2}>อาคารเรียน B</option>
                    <option value={3}>อาคารอเนกประสงค์</option>
                    <option value={4}>โรงยิม</option>
                    <option value={5}>อาคารวิทยาศาสตร์</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-ink-300 block mb-1">ชั้น</label>
                  <select
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(Number(e.target.value))}
                    className="w-full bg-ink-950 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-white text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((fl) => (
                      <option key={fl} value={fl}>
                        ชั้น {fl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {coords.lat && coords.lng && (
                <div className="text-xs text-ink-200 text-center">
                  พบตำแหน่ง {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Emergency Contacts */}
      <div className="relative z-10 max-w-xl mx-auto w-full text-center text-sm text-ink-300">
        ห้องพยาบาล 02-xxx-1199 · ห้องปกครอง 02-xxx-1198
      </div>
    </div>
  );
}
