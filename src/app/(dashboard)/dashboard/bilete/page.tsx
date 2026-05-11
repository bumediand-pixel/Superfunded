'use client';
/**
 * /dashboard/bilete — Superbet-style tickets view, 3 tabs:
 *   • Activ      — pick-uri în starea DESCHIS (în curs de evaluare)
 *   • Finalizat  — CASTIGAT / PIERDUT / ANULAT / JUMATATE_CASTIG
 *   • Pregătit   — nimic încă pregătit local (placeholder identic Superbet)
 *
 * Datele vin din /api/pariuri (real, din DB-ul nostru). Cotele care apar pe
 * fiecare bilet sunt cele înregistrate la momentul plasării pick-ului (real
 * la momentul respectiv, snapshot din The Odds API).
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Ticket, Plus, Trophy, X as XIcon, Clock, Loader2, Download } from 'lucide-react';

interface Pariu {
  id: string;
  eveniment: string;
  sport: string;
  piata: string;
  selectie: string;
  cota: number;
  suma: number;
  potentialCastig: number;
  statusPariu: 'DESCHIS' | 'CASTIGAT' | 'PIERDUT' | 'ANULAT' | 'JUMATATE_CASTIG';
  castigSauPierdere: number | null;
  dataPariu: string;
}

type Tab = 'activ' | 'finalizat' | 'pregatit';

const STATUS_LABEL: Record<Pariu['statusPariu'], string> = {
  DESCHIS:         'În curs',
  CASTIGAT:        'Câștigat',
  PIERDUT:         'Pierdut',
  ANULAT:          'Anulat',
  JUMATATE_CASTIG: 'Jumătate câștig',
};

const STATUS_COLOR: Record<Pariu['statusPariu'], { bg: string; fg: string }> = {
  DESCHIS:         { bg: 'rgba(251,191,36,0.12)',  fg: '#facc15' },
  CASTIGAT:        { bg: 'rgba(34,197,94,0.12)',   fg: '#22c55e' },
  PIERDUT:         { bg: 'rgba(230,57,70,0.12)',   fg: '#ff8a93' },
  ANULAT:          { bg: 'var(--dash-overlay-5)',   fg: 'var(--dash-text-muted)' },
  JUMATATE_CASTIG: { bg: 'rgba(59,130,246,0.12)',  fg: '#60a5fa' },
};

export default function BiletePage() {
  const [tab, setTab] = useState<Tab>('activ');
  const [pariuri, setPariuri] = useState<Pariu[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pariuri', { cache: 'no-store' });
      const d = await res.json();
      setPariuri(d.pariuri ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const buckets = useMemo(() => {
    const activ: Pariu[] = [];
    const finalizat: Pariu[] = [];
    pariuri.forEach(p => {
      if (p.statusPariu === 'DESCHIS') activ.push(p);
      else finalizat.push(p);
    });
    return { activ, finalizat };
  }, [pariuri]);

  const list = tab === 'activ' ? buckets.activ : tab === 'finalizat' ? buckets.finalizat : [];

  return (
    <div className="p-4 sm:p-6 pb-24" style={{ background: 'var(--dash-bg)', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--dash-text)' }}>
            Bilete
          </h1>
          <Link href="/dashboard/pariuri"
            className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl cursor-pointer transition-all"
            style={{ background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 6px 16px rgba(230,57,70,0.32)' }}>
            <Plus className="w-4 h-4" />
            Pick nou
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-7 border-b mb-5"
          style={{ borderColor: 'var(--dash-border)' }}>
          {([
            { key: 'activ',     label: 'Activ',     count: buckets.activ.length },
            { key: 'finalizat', label: 'Finalizat', count: buckets.finalizat.length },
            { key: 'pregatit',  label: 'Pregătit',  count: 0 },
          ] as const).map(t => {
            const on = tab === t.key;
            return (
              <button key={t.key} type="button" onClick={() => setTab(t.key)}
                className="relative inline-flex items-center gap-1.5 pb-2.5 text-sm font-bold cursor-pointer transition-colors"
                style={{ color: on ? 'var(--dash-text)' : 'var(--dash-text-muted)' }}>
                {t.label}
                {t.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold"
                    style={{ background: on ? 'var(--red, #e63946)' : 'var(--dash-overlay-8)', color: on ? '#fff' : 'var(--dash-text-muted)' }}>
                    {t.count}
                  </span>
                )}
                {on && <span className="absolute -bottom-px left-0 right-0 h-0.5"
                  style={{ background: 'var(--red, #e63946)' }} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16"
            style={{ color: 'var(--dash-text-muted)' }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Se încarcă biletele…</span>
          </div>
        ) : tab === 'pregatit' ? (
          <Empty
            icon={<Ticket className="w-12 h-12" />}
            title="Nu ai niciun bilet pregătit."
            desc="Deschide secțiunea Pariuri și apasă pe o cotă ca să începi un bilet. Îl găsești aici până îl plasezi."
            cta="Creează acum unul"
            href="/dashboard/pariuri"
          />
        ) : list.length === 0 ? (
          <Empty
            icon={<Trophy className="w-12 h-12" />}
            title={tab === 'activ' ? 'Niciun bilet activ.' : 'Niciun bilet finalizat.'}
            desc={tab === 'activ'
              ? 'Plasează un pick din Pariuri și apare aici cât e în curs de evaluare.'
              : 'Cele finalizate (câștigate / pierdute) vor apărea aici.'}
            cta={tab === 'activ' ? 'Plasează un pick' : undefined}
            href="/dashboard/pariuri"
          />
        ) : (
          <ul className="space-y-2.5">
            {list.map(b => <BiletCard key={b.id} bilet={b} />)}
          </ul>
        )}

        {/* Footer: export only on finalizat */}
        {tab === 'finalizat' && list.length > 0 && (
          <div className="mt-6 text-center">
            <Link href="/api/pariuri/export" prefetch={false}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              style={{ background: 'var(--dash-overlay-5)', color: 'var(--dash-text)', border: '1px solid var(--dash-border)' }}>
              <Download className="w-3.5 h-3.5" />
              Descarcă istoricul (CSV)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Atoms ─── */

function BiletCard({ bilet }: { bilet: Pariu }) {
  const status = STATUS_COLOR[bilet.statusPariu];
  const date = new Date(bilet.dataPariu).toLocaleString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const isWin = bilet.statusPariu === 'CASTIGAT';
  const isLoss = bilet.statusPariu === 'PIERDUT';

  return (
    <li className="rounded-xl p-4 transition-all"
      style={{
        background: 'var(--dash-surface, #141414)',
        border: '1px solid var(--dash-border)',
      }}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
          style={{ background: status.bg, color: status.fg }}>
          {STATUS_LABEL[bilet.statusPariu]}
        </span>
        <span className="text-[11px] font-semibold inline-flex items-center gap-1"
          style={{ color: 'var(--dash-text-subtle)' }}>
          <Clock className="w-3 h-3" />
          {date}
        </span>
      </div>

      {/* Event + market + selection */}
      <div className="mb-3">
        <div className="font-bold text-sm sm:text-base truncate" style={{ color: 'var(--dash-text)' }}>
          {bilet.eveniment}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--dash-text-muted)' }}>
          {bilet.piata} · <strong style={{ color: 'var(--dash-text)' }}>{bilet.selectie}</strong>
        </div>
      </div>

      {/* Stake / odds / payout */}
      <div className="grid grid-cols-3 gap-2 rounded-lg p-3"
        style={{ background: 'var(--dash-overlay-4)' }}>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--dash-text-subtle)' }}>Sumă</div>
          <div className="font-extrabold text-sm mt-0.5" style={{ color: 'var(--dash-text)' }}>€{Number(bilet.suma).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--dash-text-subtle)' }}>Cotă</div>
          <div className="font-extrabold text-sm mt-0.5" style={{ color: 'var(--dash-text)' }}>{Number(bilet.cota).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--dash-text-subtle)' }}>
            {bilet.statusPariu === 'DESCHIS' ? 'Potențial' : 'Rezultat'}
          </div>
          <div className="font-extrabold text-sm mt-0.5"
            style={{ color: isWin ? '#22c55e' : isLoss ? 'var(--red, #e63946)' : 'var(--dash-text)' }}>
            {isWin || isLoss
              ? `${isWin ? '+' : ''}€${Number(bilet.castigSauPierdere ?? 0).toFixed(2)}`
              : `€${Number(bilet.potentialCastig).toFixed(2)}`}
          </div>
        </div>
      </div>
    </li>
  );
}

function Empty({ icon, title, desc, cta, href }: {
  icon: React.ReactNode; title: string; desc: string; cta?: string; href?: string;
}) {
  return (
    <div className="rounded-2xl p-12 text-center"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
      <div className="inline-flex items-center justify-center mb-4" style={{ color: 'var(--dash-text-muted)' }}>
        {icon}
      </div>
      <h3 className="font-extrabold text-lg mb-2" style={{ color: 'var(--dash-text)' }}>{title}</h3>
      <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--dash-text-muted)' }}>
        {desc}
      </p>
      {cta && href && (
        <Link href={href}
          className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 6px 16px rgba(230,57,70,0.32)' }}>
          <Plus className="w-4 h-4" />
          {cta}
        </Link>
      )}
    </div>
  );
}
