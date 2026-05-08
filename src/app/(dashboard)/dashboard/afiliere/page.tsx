'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, Users, Wallet, TrendingUp, Link as LinkIcon } from 'lucide-react';

type Comision = { id: string; suma: number; procent: number; status: string; createdAt: string };
type Afiliat = { codReferral: string; comisioane: Comision[] } | null;

export default function AfiliereDashboard() {
  const [afiliat, setAfiliat] = useState<Afiliat>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = () => {
    fetch('/api/afiliere').then(r => r.json()).then(d => {
      setAfiliat(d.afiliat ?? null);
      setLoading(false);
    });
  };
  useEffect(load, []);

  const enroll = async () => {
    setCreating(true);
    try {
      await fetch('/api/afiliere', { method: 'POST' });
      load();
    } finally { setCreating(false); }
  };

  const link = afiliat ? `${typeof window !== 'undefined' ? window.location.origin : 'https://thesuperfunded.com'}/?ref=${afiliat.codReferral}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-28 animate-pulse" />)}
      </div>
    );
  }

  if (!afiliat) {
    return (
      <div className="p-8">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-10 max-w-xl mx-auto text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-2xl font-black text-white mb-3">Devino afiliat SuperFunded</h1>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            Câștigă <strong className="text-white">10-20% comision</strong> recurent pentru fiecare picker referit. Cookie de 30 zile, plăți lunare pe 15.
          </p>
          <button onClick={enroll} disabled={creating}
            className="font-bold text-sm px-6 py-3 rounded-xl text-white cursor-pointer disabled:opacity-50"
            style={{ background: 'var(--red)', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            {creating ? 'Se înregistrează...' : 'Înrolează-te ca afiliat'}
          </button>
        </div>
      </div>
    );
  }

  const totalEarned = afiliat.comisioane.reduce((s, c) => s + c.suma, 0);
  const paid    = afiliat.comisioane.filter(c => c.status === 'PROCESAT').reduce((s, c) => s + c.suma, 0);
  const pending = afiliat.comisioane.filter(c => c.status === 'IN_PROCESARE').reduce((s, c) => s + c.suma, 0);
  const referrals = new Set(afiliat.comisioane.map(c => c.id.slice(0, 8))).size;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-black text-white mb-2">Afiliere</h1>
      <p className="text-white/40 text-sm mb-8">Cod: <strong className="text-white font-mono">{afiliat.codReferral}</strong></p>

      {/* Link */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 mb-3">
          <LinkIcon className="w-3.5 h-3.5" />
          Link-ul tău de afiliat
        </div>
        <div className="flex gap-2">
          <input readOnly value={link}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none" />
          <button onClick={copyLink}
            className="inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl text-white cursor-pointer transition-colors"
            style={{ background: copied ? '#15803d' : 'var(--red)' }}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiat!' : 'Copiază'}
          </button>
        </div>
        <p className="text-xs text-white/40 mt-2">
          Trimite link-ul pe social media. Cookie-ul rezistă 30 zile. Comisioanele apar automat aici.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Referrals',     val: referrals,                   sub: 'pickeri unici',  icon: Users },
          { label: 'Câștig total',  val: `€${totalEarned.toFixed(2)}`, sub: 'all-time',       icon: TrendingUp },
          { label: 'Plătit',        val: `€${paid.toFixed(2)}`,        sub: 'procesat',       icon: Wallet,    accent: true },
          { label: 'În așteptare',  val: `€${pending.toFixed(2)}`,     sub: 'următoarea plată', icon: Wallet },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl p-5"
              style={{ background: '#141414', border: c.accent ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{c.label}</span>
                <Icon className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div className="font-bebas text-3xl text-white">{c.val}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{c.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Commission history */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-white font-bold text-sm">Istoric comisioane</h2>
        </div>
        {afiliat.comisioane.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-sm">
            Niciun comision încă. Distribuie link-ul ca să începi să câștigi.
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 px-5 py-2 text-[10px] font-bold tracking-widest uppercase text-white/30 border-b border-white/5">
              <span>Data</span><span>Procent</span><span>Sumă</span><span className="text-right">Status</span>
            </div>
            {afiliat.comisioane.map(c => (
              <div key={c.id} className="grid grid-cols-4 px-5 py-3 text-sm border-b border-white/5 last:border-0 items-center">
                <span className="text-white/60">{new Date(c.createdAt).toLocaleDateString('ro-RO')}</span>
                <span className="text-white/60">{c.procent}%</span>
                <span className="text-white font-bold">€{c.suma.toFixed(2)}</span>
                <span className={`text-right text-[10px] font-bold uppercase tracking-wider ${
                  c.status === 'PROCESAT' ? 'text-green-400' :
                  c.status === 'IN_PROCESARE' ? 'text-yellow-300' :
                  'text-white/40'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
