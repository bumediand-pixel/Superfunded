'use client';
import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type Kind = 'success' | 'error' | 'info';
type Item = { id: number; kind: Kind; msg: string };

const bus = typeof window !== 'undefined' ? new EventTarget() : null;
let nextId = 1;

function emit(kind: Kind, msg: string) {
  if (!bus) return;
  bus.dispatchEvent(new CustomEvent('toast', { detail: { id: nextId++, kind, msg } }));
}

export const toast = Object.assign((msg: string) => emit('info', msg), {
  success: (msg: string) => emit('success', msg),
  error:   (msg: string) => emit('error', msg),
  info:    (msg: string) => emit('info', msg),
});

const STYLES: Record<Kind, { bg: string; fg: string; border: string; Icon: typeof Info }> = {
  success: { bg: '#ecfdf5', fg: '#065f46', border: '#a7f3d0', Icon: CheckCircle2 },
  error:   { bg: '#fef2f2', fg: '#991b1b', border: '#fecaca', Icon: XCircle },
  info:    { bg: '#eff6ff', fg: '#1e3a8a', border: '#bfdbfe', Icon: Info },
};

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems(curr => curr.filter(i => i.id !== id));
  }, []);

  useEffect(() => {
    if (!bus) return;
    const onToast = (e: Event) => {
      const item = (e as CustomEvent<Item>).detail;
      setItems(curr => [...curr, item]);
      window.setTimeout(() => dismiss(item.id), 4000);
    };
    bus.addEventListener('toast', onToast);
    return () => bus.removeEventListener('toast', onToast);
  }, [dismiss]);

  if (items.length === 0) return null;

  return (
    <div className="fixed z-[100] bottom-4 right-4 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-2rem)]"
         role="region" aria-label="Notificări">
      {items.map(item => {
        const s = STYLES[item.kind];
        return (
          <div key={item.id}
               role="status"
               className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-sm animate-in slide-in-from-right-4 fade-in"
               style={{ background: s.bg, color: s.fg, border: `1px solid ${s.border}` }}>
            <s.Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm font-medium leading-snug flex-1">{item.msg}</span>
            <button type="button"
                    onClick={() => dismiss(item.id)}
                    aria-label="Închide notificarea"
                    className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
