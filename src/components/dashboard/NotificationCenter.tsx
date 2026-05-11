'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';

type Notification = {
  id: string;
  kind: 'pick_settled' | 'phase_complete' | 'withdrawal_status' | 'kyc_update';
  title: string;
  body: string;
  ts: number;
};

const STORAGE_KEY = 'sf-notifications-v1';
const MAX_STORED = 30;

function loadStored(): Notification[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}
function persist(list: Notification[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_STORED)));
}

export default function NotificationCenter() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Notification | null>(null);
  const esRef = useRef<EventSource | null>(null);

  // Load stored on mount
  useEffect(() => { setItems(loadStored()); }, []);

  // Open SSE
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const connect = () => {
      const es = new EventSource('/api/notifications/stream');
      esRef.current = es;
      es.addEventListener('notification', (e) => {
        try {
          const n = JSON.parse((e as MessageEvent).data) as Notification;
          setItems(prev => {
            if (prev.find(p => p.id === n.id)) return prev;
            const next = [n, ...prev].slice(0, MAX_STORED);
            persist(next);
            return next;
          });
          setUnread(u => u + 1);
          setToast(n);
          setTimeout(() => setToast(t => t?.id === n.id ? null : t), 5500);
        } catch { /* ignore */ }
      });
      es.addEventListener('reconnect', () => { es.close(); setTimeout(connect, 1000); });
      es.onerror = () => { es.close(); setTimeout(connect, 5000); };
    };
    connect();
    return () => { esRef.current?.close(); };
  }, []);

  const markRead = () => { setUnread(0); };

  return (
    <>
      {/* Bell button */}
      <button onClick={() => { setOpen(!open); markRead(); }}
        aria-label="Notificări"
        className="relative p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
        <Bell className="w-5 h-5 text-white/70" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
            style={{ background: 'var(--red)' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)}>
          <div className="absolute right-4 top-16 w-80 max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden"
            style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--dash-border, var(--dash-overlay-6))' }}>
              <h3 className="text-sm font-bold text-white">Notificări</h3>
              <button onClick={() => setOpen(false)} aria-label="Închide" className="text-white/40 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">Nicio notificare încă.</div>
              ) : (
                items.map(n => (
                  <div key={n.id} className="px-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--dash-overlay-4)' }}>
                    <div className="text-sm font-bold text-white">{n.title}</div>
                    <div className="text-xs text-white/60 mt-0.5">{n.body}</div>
                    <div className="text-[10px] text-white/30 mt-1">{new Date(n.ts).toLocaleString('ro-RO')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-[180] max-w-sm pointer-events-none"
          style={{ animation: 'sf-toast 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div className="rounded-2xl p-4"
            style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div className="text-sm font-bold text-white">{toast.title}</div>
            <div className="text-xs text-white/60 mt-1">{toast.body}</div>
          </div>
          <style jsx>{`
            @keyframes sf-toast {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
