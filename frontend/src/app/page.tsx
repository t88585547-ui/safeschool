'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Shield,
  Search,
  Lock,
  MapPin,
  ArrowRight,
  Clock3,
  Check,
} from 'lucide-react';
import ReportWizard from '@/components/forms/ReportWizard';
import TrackingSearch from '@/components/ui/TrackingSearch';
import { Incident } from '@/lib/types';
import { getIncidents, getResolvedIncidents } from '@/lib/api';

const SchoolScene = dynamic(() => import('@/components/canvas/SchoolScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-ink-50 text-ink-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-300 border-t-ink-900" />
      <span className="text-sm">กำลังโหลดแผนผังโรงเรียน</span>
    </div>
  ),
});

const FALLBACK_RESOLVED = [
  {
    title: 'เปลี่ยนเต้ารับในห้องสมุด',
    zone: 'อาคาร A ชั้น 2',
    note: 'เปลี่ยนเต้ารับและติดตั้งเบรกเกอร์กันดูดแล้ว',
  },
  {
    title: 'เพิ่มไฟทางเดินหลังอาคาร',
    zone: 'ด้านหลังอาคารวิทยาศาสตร์',
    note: 'ติดตั้งหลอด LED เพื่อให้ทางเดินหลังเลิกเรียนสว่างขึ้น',
  },
  {
    title: 'ทำความสะอาดพื้นลื่นหน้าโรงอาหาร',
    zone: 'โรงอาหารกลาง',
    note: 'เช็ดคราบน้ำมันและติดป้ายเตือนเรียบร้อย',
  },
];

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resolvedList, setResolvedList] = useState<Incident[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<{ x: number; y: number; z: number } | undefined>();

  useEffect(() => {
    getIncidents({ limit: 20 })
      .then((res) => {
        if (res && res.data) setIncidents(res.data);
      })
      .catch(() => {
        setIncidents([
          {
            id: 1,
            tracking_code: 'SAFE-8X92-K1',
            title: 'สายไฟเปลือยบริเวณทางเดิน',
            category: 'SECURITY_RISK',
            severity: 'HIGH',
            status: 'IN_PROGRESS',
            pin_x: -12,
            pin_y: 3,
            pin_z: -12,
            is_anonymous: true,
            room_or_zone: 'อาคาร A ชั้น 2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            tracking_code: 'SAFE-9A4K-22',
            title: 'ก๊อกน้ำรั่วในห้องน้ำชาย',
            category: 'FACILITY_REPAIR',
            severity: 'LOW',
            status: 'PENDING',
            pin_x: 12,
            pin_y: 2,
            pin_z: -12,
            is_anonymous: false,
            room_or_zone: 'อาคาร B ชั้น 1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      });

    getResolvedIncidents(3)
      .then((data) => {
        if (data && data.length > 0) setResolvedList(data);
      })
      .catch(() => {});
  }, []);

  const openReport = (pin?: { x: number; y: number; z: number }) => {
    setSelectedPin(pin);
    setIsWizardOpen(true);
  };

  const proofs =
    resolvedList.length > 0
      ? resolvedList.slice(0, 3).map((item) => ({
          title: item.title,
          zone: item.room_or_zone || 'ในโรงเรียน',
          note: item.resolution_note || 'เจ้าหน้าที่บันทึกว่าแก้ไขแล้ว',
        }))
      : FALLBACK_RESOLVED;

  const openCount = incidents.filter((item) => item.status !== 'RESOLVED').length;

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink-900">
      <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white">
              <Shield className="h-4 w-4" />
            </span>
            <span className="font-display text-xl leading-none tracking-tight">SafeSchool</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-ink-600 md:flex">
            <a href="#report" className="hover:text-ink-900">
              แจ้งเหตุ
            </a>
            <a href="#track" className="hover:text-ink-900">
              ติดตาม
            </a>
            <a href="#map" className="hover:text-ink-900">
              แผนผัง
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/sos"
              className="rounded-full border border-ink-900 px-4 py-2 text-sm font-medium text-ink-900 hover:bg-ink-900 hover:text-white"
            >
              SOS
            </Link>
            <Link
              href="/admin"
              className="hidden rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-700 sm:inline-flex"
            >
              ศูนย์บัญชาการ
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-medium tracking-wide text-ink-500">ระบบความปลอดภัยในโรงเรียน</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
              แจ้งได้ทันที
              <br />
              ติดตามได้จนจบ
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-600">
              นักเรียน ครู และบุคลากรแจ้งจุดเสี่ยงหรือเหตุฉุกเฉินได้ในสามขั้นตอน
              แล้วใช้รหัสติดตามดูสถานะหรือพูดคุยกับเจ้าหน้าที่ได้โดยไม่ต้องสมัครบัญชี
            </p>
            <div id="report" className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openReport()}
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white hover:bg-ink-700"
              >
                <MapPin className="h-4 w-4" />
                แจ้งเหตุ
              </button>
              <Link
                href="/sos"
                className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white px-5 py-3 text-sm font-semibold text-ink-900 hover:border-ink-900"
              >
                เหตุฉุกเฉิน กดค้าง 2 วินาที
              </Link>
            </div>
          </div>

          <div id="track" className="rounded-3xl border border-ink-200 bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-400">ติดตามเรื่อง</p>
                <h2 className="mt-2 font-display text-2xl">มีรหัสอยู่แล้ว</h2>
              </div>
              <span className="rounded-full bg-ink-50 px-3 py-1 text-xs text-ink-700">
                เปิดอยู่ {openCount} เรื่อง
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-500">พิมพ์รหัสที่ได้ตอนแจ้งเหตุ เพื่อดูความคืบหน้าหรือส่งข้อความเพิ่ม</p>
            <div className="mt-5">
              <TrackingSearch placeholder="เช่น SAFE-8X92-K1" />
            </div>
            <ul className="mt-6 divide-y divide-ink-100">
              {incidents.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/track/${item.tracking_code}`}
                    className="flex items-center justify-between gap-3 py-3 text-sm hover:text-ink-600"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-900">{item.title}</span>
                      <span className="text-xs text-ink-400">{item.room_or_zone || item.tracking_code}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />
                  </Link>
                </li>
              ))}
              {incidents.length === 0 && (
                <li className="py-6 text-sm text-ink-400">ยังไม่มีรายการล่าสุด</li>
              )}
            </ul>
          </div>
        </section>

        <section className="border-y border-ink-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-px bg-ink-200 sm:grid-cols-3">
            {[
              {
                icon: Clock3,
                title: 'สามขั้นตอน',
                text: 'เลือกสถานที่ บอกสิ่งที่เกิด แล้วเลือกว่าจะเปิดเผยชื่อหรือไม่',
              },
              {
                icon: Lock,
                title: 'ไม่ต้องลงชื่อ',
                text: 'เรื่องละเอียดอ่อนแจ้งแบบไม่ระบุตัวตน แล้วคุยต่อด้วยรหัสติดตาม',
              },
              {
                icon: Search,
                title: 'เห็นว่างานจบ',
                text: 'เจ้าหน้าที่อัปเดตสถานะและบันทึกผลเมื่อแก้ไขเสร็จ',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white px-6 py-8">
                <item.icon className="h-5 w-5 text-ink-700" />
                <h3 className="mt-4 font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="map" className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-ink-500">แผนผังโรงเรียน</p>
              <h2 className="mt-1 font-display text-3xl">ปักจุดได้จากแผนที่</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-500">
              หมุนดูอาคาร แล้วคลิกพื้นเพื่อเปิดแบบฟอร์มแจ้งเหตุพร้อมตำแหน่งนั้น
            </p>
          </div>
          <div className="relative h-[460px] overflow-hidden rounded-3xl border border-ink-200 bg-ink-50">
            <SchoolScene
              incidents={incidents}
              onGroundClick={openReport}
              onIncidentClick={(incident) => {
                window.location.href = `/track/${incident.tracking_code}`;
              }}
              darkMode={false}
            />
            <button
              onClick={() => openReport()}
              className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-card hover:bg-ink-700"
            >
              แจ้งโดยไม่ปักหมุด
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm text-ink-500">งานที่ปิดแล้ว</p>
              <h2 className="mt-1 font-display text-3xl">แก้ไขแล้วมีบันทึก</h2>
            </div>
            <Link href="/admin" className="hidden text-sm font-medium text-ink-700 hover:text-ink-900 sm:inline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white">
            {proofs.map((item, index) => (
              <div
                key={item.title}
                className="grid gap-2 border-b border-ink-100 px-5 py-5 last:border-0 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-500">{item.note}</p>
                </div>
                <p className="text-sm text-ink-600">{item.zone}</p>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1 text-xs text-white">
                  <Check className="h-3.5 w-3.5" />
                  แก้ไขแล้ว
                  <span className="sr-only">{index + 1}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-ink-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-ink-900">SafeSchool</p>
          <div className="flex gap-5">
            <Link href="/sos" className="hover:text-ink-900">
              SOS
            </Link>
            <Link href="/admin" className="hover:text-ink-900">
              ศูนย์บัญชาการ
            </Link>
          </div>
        </div>
      </footer>

      <ReportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialPin={selectedPin}
        onSuccess={(newInc) => {
          setIncidents((prev) => [newInc, ...prev]);
        }}
      />
    </div>
  );
}
