'use client';
import { useState } from 'react';
import { RefreshCcw, TrendingUp, X, AlertCircle } from 'lucide-react';

type Cont = {
  id: string;
  plan: string;
  capitalInceput: number;
  capitalCurent: number;
  statusEvaluare: string;
  profitTotal: number;
  dataFinalizare?: string | null;
};

const TIER_ORDER = ['STARTER_500','BASIC_1000','STANDARD_5000','ADVANCED_10000','PRO_25000','ELITE_50000'] as const;

const TIER_LABEL: Record<string, string> = {
  STARTER_500: '€500', BASIC_1000: '€1K', STANDARD_5000: '€5K',
  ADVANCED_10000: '€10K', PRO_25000: '€25K', ELITE_50000: '€50K',
};

export default function AccountActions({ cont }: { cont: Cont }) {
  const [busy, setBusy] = useState<'reset' | 'scale' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScale, setShowScale] = useState(false);

  const isRespins  = cont.statusEvaluare === 'RESPINS';
  const isFundedOk = cont.statusEvaluare === 'FINANTAT'
    && cont.dataFinalizare
    && (Date.now() - new Date(cont.dataFinalizare).getTime()) / 86_400_000 >= 30
    && cont.profitTotal / cont.capitalInceput >= 0.10;

  const handleReset = async () => {
    setBusy('reset'); setError(null);
    try {
      const res = await fetch('/api/stripe/reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contId: cont.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset eșuat');
      window.location.href = data.url;
    } catch (err) { setError(err instanceof Error ? err.message : 'Eroare'); setBusy(null); }
  };

  const handleScale = async (target: typeof TIER_ORDER[number]) => {
    setBusy('scale'); setError(null);
    try {
      const res = await fetch('/api/stripe/scale', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contId: cont.id, targetPlan: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scaling eșuat');
      window.location.href = data.url;
    } catch (err) { setError(err instanceof Error ? err.message : 'Eroare'); setBusy(null); }
  };

  if (!isRespins && !isFundedOk) return null;

  const currentIdx = TIER_ORDER.indexOf(cont.plan as typeof TIER_ORDER[number]);
  const upgradeTargets = TIER_ORDER.slice(currentIdx + 1);

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 text-xs text-red-200 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {isRespins && (
        <button onClick={handleReset} disabled={busy === 'reset'}
          className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl text-white cursor-pointer disabled:opacity-50 transition-colors"
          style={{ background: 'var(--red)' }}>
          <RefreshCcw className={`w-4 h-4 ${busy === 'reset' ? 'animate-spin' : ''}`} />
          {busy === 'reset' ? 'Se procesează...' : 'Cumpără reset (50% off)'}
        </button>
      )}

      {isFundedOk && (
        <>
          <button onClick={() => setShowScale(true)}
            className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl text-white cursor-pointer transition-colors"
            style={{ background: '#15803d' }}>
            <TrendingUp className="w-4 h-4" />
            Scale account →
          </button>
          {showScale && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowScale(false)}>
              <div className="rounded-2xl max-w-md w-full p-6"
                style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }}
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-extrabold text-white">Alege noul cont</h3>
                  <button onClick={() => setShowScale(false)} className="text-white/40 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Felicitări! Conform performanței tale, ești eligibil pentru upgrade. Primești 50% credit pe planul curent.
                </p>
                <div className="space-y-2">
                  {upgradeTargets.map(t => (
                    <button key={t} onClick={() => handleScale(t)} disabled={busy === 'scale'}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white cursor-pointer disabled:opacity-50 transition-colors"
                      style={{ background: 'var(--dash-overlay-5)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }}>
                      <span className="font-bold">{TIER_LABEL[t]} cont</span>
                      <span className="text-xs text-white/50">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
