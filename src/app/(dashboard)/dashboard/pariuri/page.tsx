'use client';
/**
 * Pariuri — main betting zone, Superbet-style.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┬─────────────┐
 *   │  Sport tabs (sticky)                      │             │
 *   │ ───────────────────────────────────────── │             │
 *   │  Match list (cards w/ 1/X/2 odds buttons) │   Bet Slip  │
 *   │                                            │  (right rail │
 *   │  History collapsible at bottom            │   on lg+)   │
 *   └──────────────────────────────────────────┴─────────────┘
 *
 * Mobile: slip becomes a bottom sheet, history is a separate section under the matches.
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Loader2, History, Download, X } from 'lucide-react';
import SportTabs from '@/components/pariuri/SportTabs';
import MatchCard, { type Pick } from '@/components/pariuri/MatchCard';
import BetSlip from '@/components/pariuri/BetSlip';
import type { OddsEvent } from '@/lib/odds-api';

interface PariuRow {
  id: string;
  eveniment: string;
  sport: string;
  piata: string;
  selectie: string;
  cota: number;
  suma: number;
  potentialCastig: number;
  statusPariu: string;
  castigSauPierdere: number | null;
  dataPariu: string;
}

interface Cont {
  id: string;
  plan: string;
  capitalCurent: number;
  statusEvaluare: string;
}

const STATUS_COLOR: Record<string, string> = {
  CASTIGAT: 'text-green-400 bg-green-400/10',
  PIERDUT:  'text-red-400 bg-red-400/10',
  DESCHIS:  'text-yellow-400 bg-yellow-400/10',
  ANULAT:   'text-white/40 bg-white/5',
  JUMATATE_CASTIG: 'text-blue-400 bg-blue-400/10',
};

export default function PariuriPage() {
  const [sport, setSport] = useState('soccer_epl');
  const [events, setEvents] = useState<OddsEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [picks, setPicks] = useState<Pick[]>([]);
  const [conturi, setConturi] = useState<Cont[]>([]);

  const [pariuri, setPariuri] = useState<PariuRow[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ---------- Data loaders ---------- */

  const loadOdds = useCallback(async (s: string) => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`/api/odds/live?sport=${s}`, { cache: 'no-store' });
      const data: OddsEvent[] = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const loadConturi = useCallback(async () => {
    const res = await fetch('/api/conturi', { cache: 'no-store' });
    if (!res.ok) return;
    const d = await res.json();
    const active: Cont[] = (d.conturi ?? []).filter((c: Cont) =>
      ['FAZA_1', 'FAZA_2', 'FINANTAT'].includes(c.statusEvaluare)
    );
    setConturi(active);
  }, []);

  const loadHistory = useCallback(async () => {
    const res = await fetch('/api/pariuri', { cache: 'no-store' });
    if (!res.ok) return;
    const d = await res.json();
    setPariuri(d.pariuri ?? []);
  }, []);

  useEffect(() => { void loadOdds(sport); }, [sport, loadOdds]);
  useEffect(() => { void loadConturi(); void loadHistory(); }, [loadConturi, loadHistory]);

  // Capture "now" once per render so canCancel stays pure during render.
  const nowRef = useRef(Date.now());
  nowRef.current = Date.now();

  /* ---------- Pick handlers ---------- */

  const onPick = (p: Pick) => {
    setPicks(prev => {
      // Toggle: same selection on same event removes it.
      const existing = prev.find(x => x.eventId === p.eventId);
      if (existing && existing.selectie === p.selectie) {
        return prev.filter(x => x.eventId !== p.eventId);
      }
      // Replace any prior pick from the same event (only one selection per match).
      const filtered = prev.filter(x => x.eventId !== p.eventId);
      return [...filtered, p];
    });
  };

  const removePick = (eventId: string) =>
    setPicks(prev => prev.filter(p => p.eventId !== eventId));

  const clearPicks = () => setPicks([]);

  const cancelBet = async (id: string) => {
    if (!confirm('Anulezi pickul? Doar dacă a fost plasat în ultimele 5 minute.')) return;
    const res = await fetch(`/api/pariuri/${id}`, { method: 'DELETE' });
    if (res.ok) loadHistory();
    else {
      const data = await res.json();
      alert(data.error || 'Anulare eșuată');
    }
  };

  const canCancel = (b: PariuRow) => {
    if (b.statusPariu !== 'DESCHIS') return false;
    return (nowRef.current - new Date(b.dataPariu).getTime()) / 60000 <= 5;
  };

  const selectedByEvent = useMemo(() => {
    const map: Record<string, string> = {};
    picks.forEach(p => { map[p.eventId] = p.selectie; });
    return map;
  }, [picks]);

  /* ---------- Render ---------- */

  return (
    <div className="lg:pr-[340px]">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Pariuri live</h1>
            <p className="text-white/40 text-sm mt-1">Apasă pe o cotă pentru a o adăuga pe bilet</p>
          </div>
          <button
            type="button"
            onClick={() => setShowHistory(v => !v)}
            className="inline-flex items-center gap-2 font-semibold text-xs sm:text-sm px-3 py-2 rounded-lg cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Istoric</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold"
              style={{ background: 'rgba(230,57,70,0.15)', color: '#ff8a93' }}>
              {pariuri.length}
            </span>
          </button>
        </div>

        {/* Sport tabs (sticky) */}
        <SportTabs active={sport} onChange={setSport} />

        {/* Match list */}
        <div className="mt-4 space-y-2.5 pb-24 lg:pb-6">
          {loadingEvents ? (
            <div className="flex items-center justify-center py-16 text-white/40 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Se încarcă cotele live…</span>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl p-12 text-center"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-4xl mb-3">📭</div>
              <h3 className="text-white font-extrabold text-lg mb-1">Niciun meci disponibil</h3>
              <p className="text-white/40 text-sm">Încearcă alt sport sau revino mai târziu.</p>
            </div>
          ) : (
            events.map(ev => (
              <MatchCard
                key={ev.id}
                event={ev}
                selectedSelection={selectedByEvent[ev.id]}
                onPick={onPick}
              />
            ))
          )}
        </div>

        {/* History (collapsible) */}
        {showHistory && (
          <div className="mt-8 pb-24 lg:pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-black text-lg">Istoric pick-uri</h2>
              <Link href="/api/pariuri/export" prefetch={false}
                className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Link>
            </div>
            {pariuri.length === 0 ? (
              <div className="text-white/40 text-sm bg-white/[0.03] rounded-xl p-6 text-center">
                Niciun pick plasat încă.
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                <ul className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {pariuri.map(b => (
                    <li key={b.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{b.eveniment}</div>
                        <div className="text-white/40 text-xs truncate">
                          {b.selectie} · cotă {Number(b.cota).toFixed(2)} · €{Number(b.suma).toFixed(2)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider ${STATUS_COLOR[b.statusPariu] ?? 'text-white/40 bg-white/5'}`}>
                        {b.statusPariu}
                      </span>
                      {canCancel(b) && (
                        <button
                          onClick={() => cancelBet(b.id)}
                          aria-label="Anulează"
                          className="text-white/30 hover:text-red-400 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bet slip — desktop right rail / mobile bottom sheet */}
      <BetSlip
        picks={picks}
        onRemove={removePick}
        onClear={clearPicks}
        conturi={conturi}
        onPlaced={loadHistory}
      />
    </div>
  );
}
