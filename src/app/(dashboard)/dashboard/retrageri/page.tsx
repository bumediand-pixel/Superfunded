'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RetrageriPage() {
  const [suma, setSuma] = useState('');
  const [metoda, setMetoda] = useState('TRANSFER_BANCAR');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleRetragere = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/retrageri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suma: parseFloat(suma), metoda }),
      });
      const data = await res.json();
      if (data.error) setMsg(`Eroare: ${data.error}`);
      else { setMsg('Cerere de retragere trimisă! Procesare 24-48h.'); setSuma(''); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Retrageri</h1>
        <p className="text-white/40 mt-1">Retrage-ți profitul săptămânal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        <div className=" border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-6">Cerere Retragere</h2>
          <form onSubmit={handleRetragere} className="space-y-4">
            {msg && <div className={`rounded-xl p-3 text-sm ${msg.startsWith('Eroare') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>{msg}</div>}
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Sumă (€)</label>
              <input type="number" min="50" step="0.01" value={suma} onChange={e => setSuma(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors" placeholder="Ex: 500" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Metodă</label>
              <select value={metoda} onChange={e => setMetoda(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors">
                <option value="TRANSFER_BANCAR">Transfer Bancar</option>
                <option value="CRYPTO">Crypto (USDT/BTC)</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
              {loading ? 'Se procesează...' : 'Solicită Retragerea'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {[
            { icon: '⏱', title: 'Procesare 24-48h', desc: 'Cererile de luni–vineri sunt procesate în aceeași zi lucrătoare.' },
            { icon: '💰', title: 'Minimum €50', desc: 'Suma minimă per retragere este de €50.' },
            { icon: '🔄', title: 'Prima retragere = rambursare taxă', desc: 'Prima retragere include automat taxa de evaluare plătită.' },
          ].map(item => (
            <div key={item.title} className=" border border-white/10 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                <div className="text-white/50 text-xs">{item.desc}</div>
              </div>
            </div>
          ))}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
            <p className="text-yellow-400 text-xs">KYC obligatoriu pentru prima retragere. <Link href="/dashboard/kyc" className="underline">Verifică identitatea →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
