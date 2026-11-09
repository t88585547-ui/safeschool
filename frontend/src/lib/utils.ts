import { IncidentCategory, IncidentSeverity, IncidentStatus } from './types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'เมื่อสักครู่';
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return formatDate(dateStr);
}

export function getCategoryInfo(category: IncidentCategory): {
  label: string;
  emoji: string;
  color: string;
} {
  const map: Record<IncidentCategory, { label: string; emoji: string; color: string }> = {
    SOS_EMERGENCY: { label: 'เหตุฉุกเฉิน', emoji: 'SOS', color: 'text-ink-900' },
    ACCIDENT_MEDICAL: { label: 'อุบัติเหตุ/เจ็บป่วย', emoji: 'พยาบาล', color: 'text-ink-800' },
    BULLYING_MENTAL: { label: 'การกลั่นแกล้ง/สุขภาพจิต', emoji: 'ดูแล', color: 'text-ink-700' },
    FACILITY_REPAIR: { label: 'แจ้งซ่อม', emoji: 'ซ่อม', color: 'text-ink-600' },
    SECURITY_RISK: { label: 'จุดเสี่ยงอันตราย', emoji: 'เสี่ยง', color: 'text-ink-600' },
  };
  return map[category];
}

export function getSeverityInfo(severity: IncidentSeverity): {
  label: string;
  bgClass: string;
  textClass: string;
  dotColor: string;
} {
  const map: Record<IncidentSeverity, { label: string; bgClass: string; textClass: string; dotColor: string }> = {
    CRITICAL: { label: 'วิกฤต', bgClass: 'bg-ink-900', textClass: 'text-white', dotColor: 'bg-white' },
    HIGH: { label: 'สูง', bgClass: 'bg-ink-200', textClass: 'text-ink-900', dotColor: 'bg-ink-800' },
    MEDIUM: { label: 'ปานกลาง', bgClass: 'bg-ink-100', textClass: 'text-ink-700', dotColor: 'bg-ink-500' },
    LOW: { label: 'ต่ำ', bgClass: 'bg-ink-50', textClass: 'text-ink-600', dotColor: 'bg-ink-300' },
  };
  return map[severity];
}

export function getStatusInfo(status: IncidentStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  step: number;
} {
  const map: Record<IncidentStatus, { label: string; bgClass: string; textClass: string; step: number }> = {
    PENDING: { label: 'รอดำเนินการ', bgClass: 'bg-ink-50', textClass: 'text-ink-600', step: 0 },
    ACKNOWLEDGED: { label: 'รับทราบแล้ว', bgClass: 'bg-ink-100', textClass: 'text-ink-700', step: 1 },
    IN_PROGRESS: { label: 'กำลังดำเนินการ', bgClass: 'bg-ink-200', textClass: 'text-ink-900', step: 2 },
    RESOLVED: { label: 'แก้ไขแล้ว', bgClass: 'bg-ink-900', textClass: 'text-white', step: 3 },
    REJECTED: { label: 'ปฏิเสธ', bgClass: 'bg-white', textClass: 'text-ink-900', step: -1 },
  };
  return map[status];
}

export function getSeverityColor3D(severity: IncidentSeverity): string {
  const map: Record<IncidentSeverity, string> = {
    CRITICAL: '#122826',
    HIGH: '#1A3F3B',
    MEDIUM: '#3F6661',
    LOW: '#9BB5B0',
  };
  return map[severity];
}

export function generateTrackingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SS-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
