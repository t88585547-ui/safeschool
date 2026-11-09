'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Shield, Bot, Loader2 } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { IncidentLog } from '@/lib/types';
import { getIncidentLogs, sendIncidentMessage } from '@/lib/api';

interface ChatBoxProps {
  logs?: IncidentLog[];
  onSendMessage?: (message: string) => void;
  senderRole?: 'REPORTER' | 'OFFICER';
  currentUserRole?: 'REPORTER' | 'OFFICER';
  incidentId?: number;
  trackingCode?: string;
  className?: string;
  disabled?: boolean;
}

export default function ChatBox({
  logs: initialLogs,
  onSendMessage,
  senderRole,
  currentUserRole,
  incidentId,
  trackingCode,
  className,
  disabled = false,
}: ChatBoxProps) {
  const role = currentUserRole || senderRole || 'REPORTER';
  const [internalLogs, setInternalLogs] = useState<IncidentLog[]>(initialLogs || []);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLogs) {
      setInternalLogs(initialLogs);
    } else if (incidentId) {
      getIncidentLogs(incidentId)
        .then((data) => {
          if (data) setInternalLogs(data);
        })
        .catch(() => {
          // Sample mock message if server is starting
          setInternalLogs([
            {
              id: 1,
              incident_id: incidentId,
              sender_role: 'SYSTEM',
              message: 'ระบบรับแจ้งเหตุการณ์เรียบร้อยแล้ว เจ้าหน้าที่กำลังดำเนินการตรวจสอบ',
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: 2,
              incident_id: incidentId,
              sender_role: 'OFFICER',
              message: 'สวัสดีครับ คุณผู้แจ้ง เจ้าหน้าที่ฝ่ายอาคารกำลังเดินทางไปตรวจสอบจุดเกิดเหตุครับ',
              created_at: new Date(Date.now() - 1800000).toISOString(),
            },
          ]);
        });
    }
  }, [initialLogs, incidentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [internalLogs]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    if (onSendMessage) {
      onSendMessage(trimmed);
      setMessage('');
      return;
    }

    if (incidentId) {
      try {
        setSending(true);
        const newLog = await sendIncidentMessage(incidentId, trimmed, role);
        setInternalLogs((prev) => [...prev, newLog]);
        setMessage('');
      } catch (err) {
        // Fallback optimistic message
        const optimistic: IncidentLog = {
          id: Date.now(),
          incident_id: incidentId,
          sender_role: role,
          message: trimmed,
          created_at: new Date().toISOString(),
        };
        setInternalLogs((prev) => [...prev, optimistic]);
        setMessage('');
      } finally {
        setSending(false);
      }
    }
  };

  const getRoleIcon = (sender: string) => {
    switch (sender) {
      case 'REPORTER':
        return <User className="w-4 h-4" />;
      case 'OFFICER':
        return <Shield className="w-4 h-4" />;
      case 'SYSTEM':
        return <Bot className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (sender: string) => {
    switch (sender) {
      case 'REPORTER':
        return 'ผู้แจ้ง';
      case 'OFFICER':
        return 'เจ้าหน้าที่ / ครู';
      case 'SYSTEM':
        return 'ระบบความปลอดภัย';
      default:
        return sender;
    }
  };

  const isSelf = (sender: string) => sender === role;

  return (
    <div className={cn('flex flex-col border border-ink-200 rounded-2xl overflow-hidden bg-white', className)}>
      {/* Messages Viewport */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[380px] scrollbar-thin"
      >
        {internalLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-ink-400 text-sm space-y-1">
            <span>ยังไม่มีข้อความ</span>
            <span className="text-xs text-ink-400">พิมพ์เพื่อสอบถามหรือแจ้งข้อมูลเพิ่ม</span>
          </div>
        ) : (
          internalLogs.map((log) => {
            const self = isSelf(log.sender_role);
            return (
              <div
                key={log.id}
                className={cn('flex gap-2.5', self ? 'flex-row-reverse' : 'flex-row')}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs',
                    log.sender_role === 'OFFICER'
                      ? 'bg-ink-900 text-white'
                      : log.sender_role === 'SYSTEM'
                      ? 'bg-ink-100 text-ink-600'
                      : 'bg-ink-200 text-ink-800'
                  )}
                >
                  {getRoleIcon(log.sender_role)}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2 text-xs',
                    self
                      ? 'bg-ink-900 text-white rounded-tr-sm'
                      : 'bg-ink-50 text-ink-800 rounded-tl-sm'
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={cn(
                        'text-[10px] font-semibold',
                        self ? 'text-ink-200' : 'text-ink-500'
                      )}
                    >
                      {getRoleLabel(log.sender_role)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{log.message}</p>
                  <span
                    className={cn(
                      'text-[9px] block mt-1 font-mono',
                      self ? 'text-ink-300 text-right' : 'text-ink-400'
                    )}
                  >
                    {formatRelativeTime(log.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-ink-100 bg-ink-50">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          disabled={disabled || sending}
          className="flex-1 px-4 py-2.5 rounded-full border border-ink-200 bg-white text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-900/15"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim() || sending}
          className="p-2.5 rounded-full bg-ink-900 hover:bg-ink-700 disabled:opacity-40 text-white transition active:scale-95 shrink-0"
        >
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>
    </div>
  );
}
