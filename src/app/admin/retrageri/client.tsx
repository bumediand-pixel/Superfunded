'use client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

type Row = { id: string; suma: number; metodaPlata: string; status: string; createdAt: string; userEmail: string };

const STATUS_COLORS: Record<string, string> = {
  IN_PROCESARE: 'text-yellow-300 bg-yellow-300/10',
  PROCESAT:     'text-green-400 bg-green-400/10',
  RESPINS:      'text-red-400 bg-red-400/10',
};

export default function RetrageriClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const update = async (id: string, status: 'PROCESAT' | 'RESPINS') => {
    setBusy(id);
    try {
      const res = await fetch('/api/admin/retrageri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r));
      }
    } finally { setBusy(null); }
  };

  return (
    <div className="p-8">
      <h1 className="font-bebas text-3xl tracking-widest text-white mb-8">RETRAGERI</h1>
      <div className="rounded-xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="grid grid-cols-6 px-5 py-3 border-b text-[10px] font-bold tracking-widest uppercase text-white/40"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="col-span-2">User</span>
          <span>Sumă</span>
          <span>Metodă</span>
          <span>Status</span>
          <span className="text-right">Acțiuni</span>
        </div>
        {rows.length === 0 && (
          <div className="p-8 text-center text-white/40 text-sm">Nicio retragere încă.</div>
        )}
        {rows.map(r => (
          <div key={r.id} className="grid grid-cols-6 px-5 py-3 border-b items-center text-sm"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <div className="col-span-2 min-w-0">
              <div className="text-white truncate">{r.userEmail}</div>
              <div className="text-[11px] text-white/30">{new Date(r.createdAt).toLocaleString('ro-RO')}</div>
            </div>
            <div className="text-white font-bold">€{r.suma.toFixed(2)}</div>
            <div className="text-white/60 text-xs">{r.metodaPlata.replace('_', ' ')}</div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-fit ${STATUS_COLORS[r.status] ?? 'text-white/40'}`}>
              {r.status}
            </span>
            <div className="flex items-center justify-end gap-2">
              {r.status === 'IN_PROCESARE' && (
                <>
                  <button onClick={() => update(r.id, 'PROCESAT')} disabled={busy === r.id}
                    aria-label="Aprobi"
                    className="w-8 h-8 inline-flex items-center justify-center rounded-md cursor-pointer transition-colors disabled:opacity-30"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => update(r.id, 'RESPINS')} disabled={busy === r.id}
                    aria-label="Respinge"
                    className="w-8 h-8 inline-flex items-center justify-center rounded-md cursor-pointer transition-colors disabled:opacity-30"
                    style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--red)' }}>
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
