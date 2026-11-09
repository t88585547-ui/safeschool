'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  onActivate: () => void;
  holdDuration?: number;
  size?: 'normal' | 'large';
  className?: string;
  disabled?: boolean;
}

export default function SOSButton({
  onActivate,
  holdDuration = 2000,
  size = 'normal',
  className,
  disabled = false,
}: SOSButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    holdTimerRef.current = null;
    progressRef.current = null;
  }, []);

  const handleStart = useCallback(() => {
    if (disabled || activated) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(pct);
    }, 16);

    holdTimerRef.current = setTimeout(() => {
      clearTimers();
      setActivated(true);
      setIsHolding(false);
      setProgress(100);
      onActivate();
    }, holdDuration);
  }, [disabled, activated, holdDuration, onActivate, clearTimers]);

  const handleEnd = useCallback(() => {
    if (activated) return;
    clearTimers();
    setIsHolding(false);
    setProgress(0);
  }, [activated, clearTimers]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const sizeClasses = size === 'large' ? 'w-48 h-48 text-3xl' : 'w-32 h-32 text-xl';

  if (activated) {
    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        <div
          className={cn(
            'rounded-full flex items-center justify-center bg-white text-ink-900',
            sizeClasses
          )}
        >
          <span className="text-4xl">✓</span>
        </div>
        <p className="text-white font-medium text-center">ส่งสัญญาณแล้ว</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        {/* Pulsing rings */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-white/25',
            !isHolding && 'sos-ring'
          )}
        />
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-white/15',
            !isHolding && 'sos-ring-delayed'
          )}
        />

        {/* Progress ring */}
        {isHolding && (
          <svg
            className={cn(
              'absolute inset-0 -rotate-90',
              size === 'large' ? 'w-48 h-48' : 'w-32 h-32'
            )}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>
        )}

        {/* Main button */}
        <button
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          disabled={disabled}
          className={cn(
            'relative rounded-full flex flex-col items-center justify-center',
            'bg-white text-ink-900 font-display select-none cursor-pointer',
            'transition-transform duration-150',
            isHolding ? 'scale-95' : 'hover:scale-105 active:scale-95',
            'animate-sos-pulse',
            sizeClasses,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className={size === 'large' ? 'text-5xl' : 'text-3xl'}>SOS</span>
          <span className={cn('font-normal', size === 'large' ? 'text-sm mt-2' : 'text-xs mt-1')}>
            {isHolding ? `${Math.ceil((holdDuration - (progress / 100) * holdDuration) / 1000)}s` : 'กดค้าง 2 วิ'}
          </span>
        </button>
      </div>
    </div>
  );
}
