'use client';

import React from 'react';
import { cn, getSeverityInfo, getStatusInfo } from '@/lib/utils';
import { IncidentSeverity, IncidentStatus } from '@/lib/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'severity' | 'status';
  value?: IncidentSeverity | IncidentStatus | string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  className?: string;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  value,
  severity,
  status,
  className,
  dot = true,
}: BadgeProps) {
  let bgClass = 'bg-slate-100';
  let textClass = 'text-slate-600';
  let dotColor = 'bg-slate-400';
  let label: React.ReactNode = children;

  const actualSeverity = severity || (variant === 'severity' ? (value as IncidentSeverity) : undefined);
  const actualStatus = status || (variant === 'status' ? (value as IncidentStatus) : undefined);

  if (actualSeverity) {
    const info = getSeverityInfo(actualSeverity);
    bgClass = info.bgClass;
    textClass = info.textClass;
    dotColor = info.dotColor;
    if (!label) label = info.label;
  } else if (actualStatus) {
    const info = getStatusInfo(actualStatus);
    bgClass = info.bgClass;
    textClass = info.textClass;
    dotColor =
      actualStatus === 'RESOLVED'
        ? 'bg-white'
        : actualStatus === 'IN_PROGRESS'
        ? 'bg-ink-800'
        : actualStatus === 'ACKNOWLEDGED'
        ? 'bg-ink-500'
        : 'bg-ink-300';
    if (!label) label = info.label;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        bgClass,
        textClass,
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />}
      <span>{label || value}</span>
    </span>
  );
}
