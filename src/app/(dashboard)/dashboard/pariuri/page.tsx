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
import { Loader2, History, Download, X, Search, Calendar, Zap, Trophy, Users2, ChevronRight, MessageCircle } from 'lucide-react';
import SportTabs from '@/components/pariuri/SportTabs';
import MatchCard, { type Pick } from '@/components/pariuri/MatchCard';
import BetSlip from '@/components/pariuri/BetSlip';
import type { OddsEvent } from '@/lib/odds-api';
import { SPORTURI_DISPONIBILE } from '@/lib/odds-api';

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
  const [oddsStatus, setOddsStatus] = useState<'ok' | 'empty' | 'unconfigured' | 'upstream_error'>('ok');
  const [loadingEvents, setLoadingEvents] = useState(true);
  // Superbet-style sub-tab (Calendar / Competiții / Social) + filters
  const [view, setView] = useState<'calendar' | 'competitii' | 'social'>('calendar');
  // Date filter: 'yday' | 'today' | 'tomorrow' | 'd+2' | 'd+3' | 'd+4' | 'all'
  const [dateFilter, setDateFilter] = useState<'yday' | 'today' | 'tomorrow' | 'd+2' | 'd+3' | 'd+4' | 'all'>('all');
  // Status filter overlays: 'rezultate' | 'live' | 'urmeaza' | '' (none)
  const [statusFilter, setStatusFilter] = useState<'' | 'rezultate' | 'live' | 'urmeaza'>('');
  const [query, setQuery] = useState('');

  const [picks, setPicks] = useState<Pick[]>([]);
  const [conturi, setConturi] = useState<Cont[]>([]);

  const [pariuri, setPariuri] = useState<PariuRow[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ---------- Data loaders ---------- */

  const loadOdds = useCallback(async (s: string) => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`/api/odds/live?sport=${s}`, { cache: 'no-store' });
      const data: { events: OddsEvent[]; status: typeof oddsStatus } = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
      setOddsStatus(data.status ?? 'ok');
    } catch {
      setEvents([]);
      setOddsStatus('upstream_error');
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

  // Apply date filter + status filter + free-text team search to events.
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const dayMs = 86_400_000;
    const q = query.trim().toLowerCase();

    // Determine date range [from, to) based on dateFilter.
    let from = -Infinity;
    let to = Infinity;
    const day = (offset: number) => startOfToday.getTime() + offset * dayMs;
    if      (dateFilter === 'yday')     { from = day(-1); to = day(0); }
    else if (dateFilter === 'today')    { from = day(0);  to = day(1); }
    else if (dateFilter === 'tomorrow') { from = day(1);  to = day(2); }
    else if (dateFilter === 'd+2')      { from = day(2);  to = day(3); }
    else if (dateFilter === 'd+3')      { from = day(3);  to = day(4); }
    else if (dateFilter === 'd+4')      { from = day(4);  to = day(5); }

    return events.filter(ev => {
      const t = new Date(ev.commence_time).getTime();
      if (t < from || t >= to) return false;

      // Status overlay (independent of date pick).
      if (statusFilter === 'rezultate') {
        // Already finished — kickoff >3h in the past.
        if (!(t < now - 3 * 60 * 60 * 1000)) return false;
      } else if (statusFilter === 'live') {
        // In play: kickoff within the last 3h.
        if (!(t <= now && now - t < 3 * 60 * 60 * 1000)) return false;
      } else if (statusFilter === 'urmeaza') {
        // Future kickoff.
        if (t <= now) return false;
      }

      if (q && !`${ev.home_team} ${ev.away_team}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, dateFilter, statusFilter, query]);

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
            style={{ background: 'var(--dash-overlay-4)', border: '1px solid var(--dash-border, var(--dash-overlay-8))', color: '#fff' }}>
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

        {/* Superbet-style sub-tabs (Social | Calendar | Competiții) */}
        <div className="mt-3 flex items-center gap-6 border-b" style={{ borderColor: 'var(--dash-border)' }}>
          {([
            { key: 'social',     label: 'Social',     icon: MessageCircle },
            { key: 'calendar',   label: 'Calendar',   icon: Calendar },
            { key: 'competitii', label: 'Competiții', icon: Trophy },
          ] as const).map(t => {
            const on = view === t.key;
            const Icon = t.icon;
            return (
              <button key={t.key} type="button" onClick={() => setView(t.key)}
                className="relative inline-flex items-center gap-1.5 pb-2.5 text-sm font-bold cursor-pointer transition-colors"
                style={{ color: on ? 'var(--dash-text)' : 'var(--dash-text-muted)' }}>
                <Icon className="w-3.5 h-3.5" />
                {t.label}
                {on && (
                  <span className="absolute -bottom-px left-0 right-0 h-0.5"
                    style={{ background: 'var(--red, #e63946)' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter strip: date chips + status chips + search — only for Calendar view */}
        {view === 'calendar' && (
        <>
        {/* Date row */}
        <div className="mt-3 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {(() => {
              const today = new Date();
              const dayLabel = (offset: number) => {
                const d = new Date(today); d.setDate(today.getDate() + offset);
                return d.toLocaleDateString('ro-RO', { weekday: 'short', day: '2-digit', month: 'short' });
              };
              return [
                { key: 'yday',     label: 'Ieri' },
                { key: 'today',    label: 'Astăzi' },
                { key: 'tomorrow', label: 'Mâine' },
                { key: 'd+2',      label: dayLabel(2) },
                { key: 'd+3',      label: dayLabel(3) },
                { key: 'd+4',      label: dayLabel(4) },
                { key: 'all',      label: 'Toate' },
              ] as const;
            })().map(f => {
              const on = dateFilter === f.key;
              return (
                <button key={f.key} type="button" onClick={() => setDateFilter(f.key)}
                  className="inline-flex items-center px-3.5 h-8 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all"
                  style={on
                    ? { background: 'rgba(230,57,70,0.15)', color: '#ff8a93', border: '1px solid rgba(230,57,70,0.35)' }
                    : { background: 'var(--dash-overlay-3)', color: 'var(--dash-text-60)', border: '1px solid var(--dash-border, var(--dash-overlay-6))' }
                  }>
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status row */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <div className="flex gap-1.5 -mx-1 sm:mx-0 overflow-x-auto px-1 sm:px-0">
            {([
              { key: 'rezultate', label: 'Rezultate', icon: null },
              { key: 'live',      label: 'Live',      icon: Zap },
              { key: 'urmeaza',   label: 'Urmează',   icon: Calendar },
            ] as const).map(f => {
              const on = statusFilter === f.key;
              const Icon = f.icon;
              return (
                <button key={f.key} type="button"
                  onClick={() => setStatusFilter(on ? '' : f.key)}
                  className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all"
                  style={on
                    ? { background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 4px 12px rgba(230,57,70,0.28)' }
                    : { background: 'var(--dash-overlay-3)', color: 'var(--dash-text-60)', border: '1px solid var(--dash-border)' }
                  }>
                  {Icon && <Icon className="w-3 h-3" />}
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2 flex-1 sm:flex-initial sm:w-64 rounded-full px-3 h-8"
            style={{ background: 'var(--dash-overlay-4)', border: '1px solid var(--dash-border, var(--dash-overlay-8))' }}>
            <Search className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Caută echipă…"
              aria-label="Caută meci"
              className="bg-transparent text-white text-xs placeholder:text-white/30 outline-none w-full"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Șterge căutarea" className="text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        </>
        )}

        {/* Competiții view — list of leagues with quick switch */}
        {view === 'competitii' && (
          <div className="mt-4 pb-24 lg:pb-6">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--dash-text-muted)' }}>
              Competiții de top
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {SPORTURI_DISPONIBILE.map(s => {
                const on = s.key === sport;
                return (
                  <button key={s.key} type="button"
                    onClick={() => { setSport(s.key); setView('calendar'); }}
                    className="flex items-center justify-between rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{
                      background: on ? 'rgba(230,57,70,0.08)' : 'var(--dash-surface, #141414)',
                      border: `1px solid ${on ? 'rgba(230,57,70,0.35)' : 'var(--dash-border)'}`,
                    }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0" aria-hidden>{s.icon}</span>
                      <span className="font-bold text-sm truncate" style={{ color: 'var(--dash-text)' }}>{s.nume}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--dash-text-muted)' }} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-6 text-center" style={{ color: 'var(--dash-text-subtle)' }}>
              Click pe o competiție ca să vezi toate meciurile cu cote live.
            </p>
          </div>
        )}

        {/* Social view — placeholder, feed live va veni odată cu Supersocial backend */}
        {view === 'social' && (
          <div className="mt-4 pb-24 lg:pb-6">
            <div className="rounded-2xl p-10 sm:p-14 text-center"
              style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
              <Users2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--red, #e63946)' }} />
              <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--dash-text)' }}>
                Social — în curând
              </h3>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--dash-text-muted)' }}>
                Bilete populare, mize mari ale altor pickeri, urmărire și copiere de pick-uri.
                Lansăm feed-ul după ce trecem de pragul de 500 pickeri activi.
              </p>
              <span className="inline-block mt-5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest"
                style={{ background: 'rgba(230,57,70,0.12)', color: '#ff8a93' }}>
                Beta · Q3 2026
              </span>
            </div>
          </div>
        )}

        {/* Match list (Calendar view) */}
        {view === 'calendar' && (
        <div className="mt-4 space-y-2.5 pb-24 lg:pb-6">
          {loadingEvents ? (
            <div className="flex items-center justify-center py-16 text-white/40 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Se încarcă cotele live…</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-2xl p-12 text-center"
              style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border, var(--dash-overlay-6))' }}>
              <div className="text-4xl mb-3">
                {oddsStatus === 'unconfigured' ? '🔌'
                  : oddsStatus === 'upstream_error' ? '⚠️'
                  : events.length > 0 ? '🔍'
                  : '📭'}
              </div>
              <h3 className="text-white font-extrabold text-lg mb-1">
                {oddsStatus === 'unconfigured' ? 'Cotele live nu sunt încă configurate'
                  : oddsStatus === 'upstream_error' ? 'Furnizorul de cote nu răspunde'
                  : events.length > 0 ? 'Niciun meci care să corespundă filtrului'
                  : 'Niciun meci disponibil'}
              </h3>
              <p className="text-white/40 text-sm">
                {oddsStatus === 'unconfigured'
                  ? 'Setează ODDS_API_KEY în mediul Vercel pentru a porni feed-ul.'
                  : oddsStatus === 'upstream_error'
                  ? 'Reîncearcă în câteva minute.'
                  : events.length > 0
                  ? 'Schimbă filtrul de dată sau șterge căutarea.'
                  : 'Încearcă alt sport sau revino mai târziu.'}
              </p>
            </div>
          ) : (
            (filteredEvents).map(ev => (
              <MatchCard
                key={ev.id}
                event={ev}
                selectedSelection={selectedByEvent[ev.id]}
                onPick={onPick}
              />
            ))
          )}
        </div>
        )}

        {/* History (collapsible) */}
        {showHistory && (
          <div className="mt-8 pb-24 lg:pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-black text-lg">Istoric pick-uri</h2>
              <Link href="/api/pariuri/export" prefetch={false}
                className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                style={{ background: 'var(--dash-overlay-4)', border: '1px solid var(--dash-border, var(--dash-overlay-8))', color: '#fff' }}>
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </Link>
            </div>
            {pariuri.length === 0 ? (
              <div className="text-white/40 text-sm bg-white/[0.03] rounded-xl p-6 text-center">
                Niciun pick plasat încă.
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border, var(--dash-overlay-6))' }}>
                <ul className="divide-y" style={{ borderColor: 'var(--dash-overlay-5)' }}>
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
