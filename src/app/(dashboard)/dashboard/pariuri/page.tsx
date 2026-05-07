'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import PickBuilder from '@/components/dashboard/PickBuilder';

interface Pariu {
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

export default function PariuriPage() {
  const [pariuri, setPariuri] = useState<Pariu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPickBuilder, setShowPickBuilder] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/pariuri').then(r => r.json()).then(d => {
      setPariuri(d.pariuri ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const statusColor: Record<string, string> = {
    CASTIGAT: 'text-green-400 bg-green-400/10',
    PIERDUT:  'text-red-400 bg-red-400/10',
    DESCHIS:  'text-yellow-400 bg-yellow-400/10',
    ANULAT:   'text-white/40 bg-white/5',
    JUMATATE_CASTIG: 'text-blue-400 bg-blue-400/10',
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Pariuri</h1>
          <p className="text-white/40 mt-1">Istoricul complet al pick-urilor tale</p>
        </div>
        <button onClick={() => setShowPickBuilder(true)}
          className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
          <Plus className="w-4 h-4" />
          Pick nou
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />)}
        </div>
      ) : pariuri.length === 0 ? (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-white font-black text-xl mb-2">Niciun pick încă</h3>
          <p className="text-white/40 text-sm mb-6">Plasează primul pick ca să începi evaluarea.</p>
          <button onClick={() => setShowPickBuilder(true)}
            className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer"
            style={{ background: 'var(--red)', color: 'white' }}>
            <Plus className="w-4 h-4" />
            Pick nou
          </button>
        </div>
      ) : (
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 px-6 py-3 border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
            <span className="col-span-2">Eveniment</span>
            <span>Selecție</span>
            <span>Sport</span>
            <span>Stake / Cotă</span>
            <span>Status</span>
            <span className="text-right">P&amp;L</span>
          </div>
          {pariuri.map(p => (
            <div key={p.id} className="grid grid-cols-7 px-6 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors">
              <div className="col-span-2">
                <div className="text-white text-sm font-semibold truncate">{p.eveniment}</div>
                <div className="text-white/30 text-xs">{new Date(p.dataPariu).toLocaleString('ro-RO')}</div>
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{p.selectie}</div>
                <div className="text-white/30 text-xs">{p.piata}</div>
              </div>
              <span className="text-white/60 text-sm">{p.sport.replace(/_/g, ' ')}</span>
              <div>
                <div className="text-white text-sm">€{p.suma.toFixed(2)}</div>
                <div className="text-white/40 text-xs">@ {p.cota}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${statusColor[p.statusPariu] ?? 'text-white/40'}`}>
                {p.statusPariu}
              </span>
              <span className={`text-sm font-black text-right ${
                p.castigSauPierdere == null ? 'text-white/40' :
                p.castigSauPierdere > 0 ? 'text-green-400' :
                p.castigSauPierdere < 0 ? 'text-red-400' : 'text-white/40'
              }`}>
                {p.castigSauPierdere != null ? `${p.castigSauPierdere > 0 ? '+' : ''}€${p.castigSauPierdere.toFixed(2)}` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      {showPickBuilder && (
        <PickBuilder
          onClose={() => setShowPickBuilder(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
