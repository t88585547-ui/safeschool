'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackingSearchProps {
  className?: string;
  compact?: boolean;
  placeholder?: string;
}

export default function TrackingSearch({
  className,
  compact = false,
  placeholder = 'ค้นหาด้วยรหัสติดตาม เช่น SS-ABC123',
}: TrackingSearchProps) {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) {
      router.push(`/track/${trimmed}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn('flex items-center gap-2', className)}
    >
      <div className={cn('relative flex-1', compact ? 'max-w-xs' : 'max-w-md')}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-4 border border-ink-200 rounded-full bg-ink-50 text-ink-900',
            'placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-900/15',
            'focus:border-ink-700 focus:bg-white transition-all duration-150',
            compact ? 'py-2 text-sm' : 'py-3 text-sm'
          )}
        />
      </div>
      <button
        type="submit"
        className={cn(
          'bg-ink-900 text-white font-medium rounded-full hover:bg-ink-700 active:scale-[0.98] transition-all',
          compact ? 'px-4 py-2 text-sm' : 'px-5 py-3 text-sm'
        )}
      >
        ติดตาม
      </button>
    </form>
  );
}
