'use client';

import React from 'react';
import { cn, getStatusInfo } from '@/lib/utils';
import { IncidentStatus } from '@/lib/types';
import { Clock, Eye, Wrench, CheckCircle2 } from 'lucide-react';

interface StatusStepperProps {
  currentStatus: IncidentStatus;
  className?: string;
}

const steps: {
  status: IncidentStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  { status: 'PENDING', label: 'รอดำเนินการ', icon: <Clock className="w-5 h-5" /> },
  { status: 'ACKNOWLEDGED', label: 'รับทราบแล้ว', icon: <Eye className="w-5 h-5" /> },
  { status: 'IN_PROGRESS', label: 'กำลังดำเนินการ', icon: <Wrench className="w-5 h-5" /> },
  { status: 'RESOLVED', label: 'แก้ไขแล้ว', icon: <CheckCircle2 className="w-5 h-5" /> },
];

export default function StatusStepper({ currentStatus, className }: StatusStepperProps) {
  const currentInfo = getStatusInfo(currentStatus);
  const currentStep = currentInfo.step;

  if (currentStatus === 'REJECTED') {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="flex items-center gap-2 px-4 py-2 bg-ink-100 text-ink-900 rounded-full font-medium">
          <span className="w-2 h-2 rounded-full bg-ink-900" />
          ปฏิเสธ
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.status}>
              {/* Step circle */}
              <div className="flex flex-col items-center gap-2 relative">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500',
                    isCompleted
                      ? isCurrent
                        ? 'bg-ink-900 text-white scale-110'
                        : 'bg-ink-700 text-white'
                      : 'bg-ink-100 text-ink-400'
                  )}
                >
                  {step.icon}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium text-center whitespace-nowrap',
                    isCompleted ? 'text-ink-900' : 'text-ink-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 mb-6">
                  <div className="h-0.5 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full bg-ink-900 transition-all duration-700 ease-out',
                        index < currentStep ? 'w-full' : 'w-0'
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
