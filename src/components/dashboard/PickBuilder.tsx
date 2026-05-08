'use client';
import { useState, useEffect, useMemo } from 'react';
import { X, Calculator, AlertCircle, Zap } from 'lucide-react';

type Cont = { id: string; plan: string; capitalCurent: number; capitalInceput: number; statusEvaluare: string };
type LiveEvent = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: { markets?: { key: string; outcomes: { name: string; price: number }[] }[] }[];
};

const SPORTS = [
  { key: 'soccer_epl',                label: '⚽ Premier League' },
  { key: 'soccer_uefa_champs_league', label: '⚽ Champions League' },
  { key: 'soccer_spain_la_liga',      label: '⚽ La Liga' },
  { key: 'basketball_nba',            label: '🏀 NBA' },
  { key: 'tennis_atp_french_open',    label: '🎾 ATP' },
  { key: 'mma_mixed_martial_arts',    label: '🥊 MMA / UFC' },
];

const MARKETS = ['Moneyline (1X2)', 'Over/Under', 'Spread', 'Both Teams to Score', 'Prop Player', 'Half/Full Time'];
const TIPURI = [
  { val: 'SIMPLU',   label: 'Simplu' },
  { val: 'COMBINAT', label: 'Combinat (acca)' },
  { val: 'SISTEM',   label: 'Sistem' },
  { val: 'LIVE',     label: 'Live' },
];

export default function PickBuilder({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [conturi, setConturi] = useState<Cont[]>([]);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    contId: '',
    sport: 'soccer_epl',
    eveniment: '',
    piata: 'Moneyline (1X2)',
    selectie: '',
    cota: '1.95',
    suma: '50',
    tipPariu: 'SIMPLU' as 'SIMPLU'|'COMBINAT'|'SISTEM'|'LIVE',
  });

  // Live odds for the selected sport (autofill source)
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    fetch('/api/conturi').then(r => r.json()).then(d => {
      const list = d.conturi ?? [];
      setConturi(list);
      if (list.length > 0) setForm(f => ({ ...f, contId: list[0].id }));
      setLoadingAcc(false);
    });
  }, []);

  useEffect(() => {
    setLoadingEvents(true);
    fetch(`/api/odds/live?sport=${encodeURIComponent(form.sport)}`)
      .then(r => r.json())
      .then(d => setEvents(Array.isArray(d) ? d.slice(0, 6) : []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, [form.sport]);

  const useLiveEvent = (ev: LiveEvent, side: 'home' | 'away' | 'draw') => {
    const h2h = ev.bookmakers?.[0]?.markets?.find(m => m.key === 'h2h')?.outcomes ?? [];
    const teamName = side === 'home' ? ev.home_team : side === 'away' ? ev.away_team : 'Draw';
    const odd = h2h.find(o => o.name === teamName)?.price;
    setForm(f => ({
      ...f,
      eveniment: `${ev.home_team} vs ${ev.away_team}`,
      selectie: side === 'draw' ? 'X' : (side === 'home' ? '1' : '2'),
      cota: odd ? odd.toFixed(2) : f.cota,
    }));
  };

  const cont = conturi.find(c => c.id === form.contId);
  const cota = parseFloat(form.cota) || 0;
  const suma = parseFloat(form.suma) || 0;
  const potential = useMemo(() => suma * cota, [suma, cota]);
  const profit = useMemo(() => suma * (cota - 1), [suma, cota]);

  const stakePctOfStart = cont ? (suma / cont.capitalInceput) * 100 : 0;
  const overStakeWarning = stakePctOfStart > 5;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/pariuri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contId: form.contId,
          sport: form.sport,
          eveniment: form.eveniment,
          piata: form.piata,
          selectie: form.selectie,
          cota,
          suma,
          tipPariu: form.tipPariu,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pick invalid');
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-xl font-extrabold text-white">Pick nou</h2>
          <button onClick={onClose} aria-label="Închide"
            className="text-white/40 hover:text-white p-1 cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">

          {loadingAcc ? (
            <div className="bg-white/5 rounded-xl h-16 animate-pulse" />
          ) : conturi.length === 0 ? (
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)' }}>
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white">Niciun cont activ</div>
                <div className="text-xs text-white/60 mt-1">Cumpără un challenge ca să poți plasa picks.</div>
                <a href="/planuri" className="inline-block mt-3 text-xs font-bold px-4 py-2 rounded-lg bg-red-500 text-white">Mergi la planuri →</a>
              </div>
            </div>
          ) : (
            <>
              <DarkField label="Cont">
                <select value={form.contId} onChange={e => setForm({ ...form, contId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500">
                  {conturi.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#141414]">
                      {c.plan} — €{c.capitalCurent.toFixed(2)} ({c.statusEvaluare})
                    </option>
                  ))}
                </select>
              </DarkField>

              <div className="grid grid-cols-2 gap-3">
                <DarkField label="Sport">
                  <select value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500">
                    {SPORTS.map(s => <option key={s.key} value={s.key} className="bg-[#141414]">{s.label}</option>)}
                  </select>
                </DarkField>
                <DarkField label="Tip pariu">
                  <select value={form.tipPariu} onChange={e => setForm({ ...form, tipPariu: e.target.value as typeof form.tipPariu })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500">
                    {TIPURI.map(t => <option key={t.val} value={t.val} className="bg-[#141414]">{t.label}</option>)}
                  </select>
                </DarkField>
              </div>

              <DarkField label="Piață">
                <select value={form.piata} onChange={e => setForm({ ...form, piata: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500">
                  {MARKETS.map(m => <option key={m} value={m} className="bg-[#141414]">{m}</option>)}
                </select>
              </DarkField>

              {/* Live events autofill */}
              {events.length > 0 && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(230,57,70,0.05)', border: '1px solid rgba(230,57,70,0.2)' }}>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--red)' }}>
                    <Zap className="w-3 h-3" />
                    Live odds — apasă să auto-completezi
                  </div>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {events.map(ev => {
                      const h2h = ev.bookmakers?.[0]?.markets?.find(m => m.key === 'h2h')?.outcomes ?? [];
                      const homeOdd = h2h.find(o => o.name === ev.home_team)?.price;
                      const drawOdd = h2h.find(o => o.name === 'Draw')?.price;
                      const awayOdd = h2h.find(o => o.name === ev.away_team)?.price;
                      return (
                        <div key={ev.id} className="flex items-center gap-1.5 text-xs">
                          <div className="flex-1 min-w-0 text-white truncate" title={`${ev.home_team} vs ${ev.away_team}`}>
                            {ev.home_team} <span className="text-white/40">vs</span> {ev.away_team}
                          </div>
                          {homeOdd && (
                            <button type="button" onClick={() => useLiveEvent(ev, 'home')}
                              className="font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                              1 · {homeOdd.toFixed(2)}
                            </button>
                          )}
                          {drawOdd && (
                            <button type="button" onClick={() => useLiveEvent(ev, 'draw')}
                              className="font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                              X · {drawOdd.toFixed(2)}
                            </button>
                          )}
                          {awayOdd && (
                            <button type="button" onClick={() => useLiveEvent(ev, 'away')}
                              className="font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                              2 · {awayOdd.toFixed(2)}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {loadingEvents && (
                <div className="text-xs text-white/40">Se încarcă cote live...</div>
              )}

              <DarkField label="Eveniment" hint="Format: 'Echipa Acasă vs Echipa Oaspete'">
                <input required value={form.eveniment} onChange={e => setForm({ ...form, eveniment: e.target.value })}
                  placeholder="Arsenal vs Manchester City"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500" />
              </DarkField>

              <DarkField label="Selecție" hint="1 / X / 2 / Over / Under / Echipa A">
                <input required value={form.selectie} onChange={e => setForm({ ...form, selectie: e.target.value })}
                  placeholder="1"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500" />
              </DarkField>

              <div className="grid grid-cols-2 gap-3">
                <DarkField label="Cotă (decimal)">
                  <input required type="number" step="0.01" min="1.01" value={form.cota} onChange={e => setForm({ ...form, cota: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500" />
                </DarkField>
                <DarkField label="Stake (€)">
                  <input required type="number" step="0.01" min="1" value={form.suma} onChange={e => setForm({ ...form, suma: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white outline-none focus:border-red-500" />
                </DarkField>
              </div>

              {/* Live preview */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                  <Calculator className="w-3.5 h-3.5" />
                  Preview
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Stake</div>
                    <div className="text-lg font-extrabold text-white">€{suma.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Profit</div>
                    <div className="text-lg font-extrabold text-green-400">+€{profit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Total</div>
                    <div className="text-lg font-extrabold text-white">€{potential.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {overStakeWarning && (
                <div className="rounded-xl p-3 flex items-start gap-2 text-xs" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-amber-200">
                    Stake {stakePctOfStart.toFixed(1)}% din capital — recomandăm sub 5% pentru bankroll management sănătos.
                  </span>
                </div>
              )}

              {error && (
                <div className="rounded-xl p-3 text-xs text-red-200" style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full font-bold text-sm py-3 rounded-xl text-white disabled:opacity-50 transition-colors cursor-pointer"
                style={{ background: 'var(--red)', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
                {submitting ? 'Se înregistrează...' : 'Plasează pick-ul'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function DarkField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wider uppercase mb-1.5 text-white/60">{label}</span>
      {children}
      {hint && <span className="block text-[11px] mt-1 text-white/30">{hint}</span>}
    </label>
  );
}
