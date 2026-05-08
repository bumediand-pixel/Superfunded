'use client';
/**
 * Bet slip = Superbet's bilet de pariu.
 * - Desktop (lg+): pinned right rail, always visible.
 * - Mobile (<lg): bottom sheet with a compact bar that expands when picks are present.
 *
 * Holds N picks. With 1 pick the slip behaves like SIMPLU; with 2+ picks it auto-becomes
 * COMBINAT (cotele se înmulțesc). The user enters one stake; we show potential payout.
 */
import { useState, useMemo } from 'react';
import { X, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Pick } from './MatchCard';

type Cont = { id: string; plan: string; capitalCurent: number };

type Props = {
  picks: Pick[];
  onRemove: (eventId: string) => void;
  onClear: () => void;
  conturi: Cont[];
  onPlaced?: () => void;        // callback after successful POST
};

export default function BetSlip({ picks, onRemove, onClear, conturi, onPlaced }: Props) {
  const [stake, setStake] = useState<string>('');
  const [contIdRaw, setContId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Mobile sheet — user opens it via the bottom bar (Superbet-style).
  const [openMobile, setOpenMobile] = useState(false);

  // Derive selected cont: use the user's choice if it still matches, else fall back to first available.
  const contId = useMemo(() => {
    if (contIdRaw && conturi.some(c => c.id === contIdRaw)) return contIdRaw;
    return conturi[0]?.id ?? '';
  }, [contIdRaw, conturi]);

  const totalCota = useMemo(
    () => picks.reduce((acc, p) => acc * p.cota, 1),
    [picks]
  );
  const stakeNum = Number(stake) || 0;
  const potential = stakeNum * totalCota;

  const tipPariu: 'SIMPLU' | 'COMBINAT' = picks.length > 1 ? 'COMBINAT' : 'SIMPLU';

  const submit = async () => {
    if (!contId) { setError('Alege un cont activ'); return; }
    if (stakeNum <= 0) { setError('Introdu o sumă validă'); return; }
    if (picks.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      // For COMBINAT we POST a single Pariu row with combined eveniment + cota.
      // For SIMPLU we POST one Pariu row.
      if (tipPariu === 'SIMPLU') {
        const p = picks[0];
        const res = await fetch('/api/pariuri', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sport: p.sport,
            eveniment: p.eveniment,
            piata: p.piata,
            selectie: p.selectie,
            cota: p.cota,
            suma: stakeNum,
            tipPariu: 'SIMPLU',
            contId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Eroare la plasare');
      } else {
        const eveniment = picks.map(p => p.eveniment).join(' + ');
        const selectie = picks.map(p => p.selectie).join(' + ');
        const res = await fetch('/api/pariuri', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sport: picks[0].sport,
            eveniment,
            piata: 'COMBINAT',
            selectie,
            cota: Number(totalCota.toFixed(2)),
            suma: stakeNum,
            tipPariu: 'COMBINAT',
            contId,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Eroare la plasare');
      }
      setStake('');
      onClear();
      onPlaced?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare necunoscută');
    } finally {
      setSubmitting(false);
    }
  };

  const empty = picks.length === 0;

  /* ---------- Inner body shared between desktop + mobile ---------- */
  const Body = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm">Bilet</span>
          {!empty && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(230,57,70,0.15)', color: '#ff8a93' }}>
              {tipPariu}
            </span>
          )}
        </div>
        {!empty && (
          <button onClick={onClear} className="text-white/40 hover:text-white text-xs flex items-center gap-1 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
            Golește
          </button>
        )}
      </div>

      {/* Picks list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {empty ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-white/40 text-sm">Apasă pe o cotă pentru a adăuga pe bilet</p>
          </div>
        ) : picks.map(p => (
          <div key={p.eventId} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-xs text-white/50 truncate">{p.eveniment}</div>
              <button onClick={() => onRemove(p.eventId)} className="text-white/30 hover:text-red-400 cursor-pointer flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-semibold truncate">{p.selectie}</span>
              <span className="font-extrabold text-white text-sm">{p.cota.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / submit */}
      {!empty && (
        <div className="border-t p-4 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Cont selector */}
          {conturi.length > 0 ? (
            <select
              value={contId}
              onChange={e => setContId(e.target.value)}
              aria-label="Selectează cont"
              className="w-full px-3 py-2 rounded-lg text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {conturi.map(c => (
                <option key={c.id} value={c.id} className="bg-[#0d0d0d]">
                  {c.plan} · €{Number(c.capitalCurent).toLocaleString('ro-RO')}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-2.5">
              Nu ai un cont activ. Cumpără un plan din /planuri ca să plasezi pick-uri.
            </div>
          )}

          {/* Stake */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/40 mb-1 block">Sumă (€)</label>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              step="0.01"
              value={stake}
              onChange={e => setStake(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-lg text-base text-white font-bold"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Quick stakes */}
          <div className="grid grid-cols-4 gap-1.5">
            {[10, 25, 50, 100].map(v => (
              <button
                key={v}
                onClick={() => setStake(String(v))}
                className="py-1.5 rounded text-xs font-semibold text-white/70 cursor-pointer hover:text-white"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {v}€
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-lg p-3 text-sm space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Row label="Cotă totală" value={totalCota.toFixed(2)} />
            <Row label="Sumă" value={`€${stakeNum.toFixed(2)}`} />
            <div className="border-t pt-1.5 mt-1.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <Row label="Câștig potențial" value={`€${potential.toFixed(2)}`} bold />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={submitting || conturi.length === 0 || stakeNum <= 0}
            className="w-full font-extrabold text-sm py-3 rounded-lg cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            {submitting ? 'Se plasează…' : 'Plasează pariul'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop right rail */}
      <aside className="hidden lg:flex flex-col fixed top-0 right-0 h-screen w-[340px] z-30"
        style={{ background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
        {Body}
      </aside>

      {/* Mobile bottom sheet */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30">
        {/* Compact bar always visible when picks present */}
        {!empty && !openMobile && (
          <button
            onClick={() => setOpenMobile(true)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
            style={{ background: 'var(--red, #e63946)', color: '#fff' }}>
            <span className="flex items-center gap-2 font-bold text-sm">
              <ChevronUp className="w-4 h-4" />
              Bilet ({picks.length}) · cota {totalCota.toFixed(2)}
            </span>
            <span className="font-extrabold text-sm">Plasează</span>
          </button>
        )}

        {/* Expanded sheet */}
        {openMobile && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setOpenMobile(false)} />
            <div className="relative z-40 rounded-t-2xl max-h-[85vh] flex flex-col"
              style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setOpenMobile(false)}
                aria-label="Închide bilet"
                className="absolute top-3 right-3 p-1 text-white/50 cursor-pointer">
                <ChevronDown className="w-5 h-5" />
              </button>
              {Body}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'text-white text-sm font-semibold' : 'text-white/60 text-xs'}>{label}</span>
      <span className={bold ? 'text-white text-base font-extrabold' : 'text-white text-sm font-bold'}>{value}</span>
    </div>
  );
}
