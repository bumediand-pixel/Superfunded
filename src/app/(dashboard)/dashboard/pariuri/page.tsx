'use client';
import { useState, useEffect } from 'react';

interface Pariu {
  id: string;
  eveniment: string;
  sport: string;
  tip: string;
  miza: number;
  cota: number;
  status: string;
  profitPierdere: number | null;
  creatLa: string;
}

export default function PariuriPage() {
  const [pariuri, setPariuri] = useState<Pariu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pariuri').then(r => r.json()).then(d => { setPariuri(d.pariuri ?? []); setLoading(false); });
  }, []);

  const statusColor: Record<string, string> = {
    CASTIGAT: 'text-green-400 bg-green-400/10',
    PIERDUT: 'text-red-400 bg-red-400/10',
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    VOID: 'text-white/40 bg-white/5',
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Pariuri</h1>
          <p className="text-white/40 mt-1">Tot istoricul tău de pariuri, într-un singur loc.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : pariuri.length === 0 ? (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-white font-black text-xl mb-2">Niciun pariu încă</h3>
          <p className="text-white/40 text-sm">Plasează primul pariu — o să-l vezi aici imediat.</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-6 px-6 py-3 border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
            <span className="col-span-2">Eveniment</span><span>Sport</span><span>Miză / Cotă</span><span>Status</span><span className="text-right">Profit</span>
          </div>
          {pariuri.map(p => (
            <div key={p.id} className="grid grid-cols-6 px-6 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors">
              <div className="col-span-2">
                <div className="text-white text-sm font-semibold">{p.eveniment}</div>
                <div className="text-white/30 text-xs">{new Date(p.creatLa).toLocaleDateString('ro-RO')}</div>
              </div>
              <span className="text-white/60 text-sm">{p.sport}</span>
              <div>
                <div className="text-white text-sm">€{p.miza.toFixed(2)}</div>
                <div className="text-white/40 text-xs">@ {p.cota}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${statusColor[p.status] ?? 'text-white/40'}`}>{p.status}</span>
              <span className={`text-sm font-black text-right ${p.profitPierdere && p.profitPierdere > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {p.profitPierdere != null ? `${p.profitPierdere > 0 ? '+' : ''}€${p.profitPierdere.toFixed(2)}` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
