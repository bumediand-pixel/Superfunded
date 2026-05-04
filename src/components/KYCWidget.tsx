'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SumsubWebSdk = dynamic(() => import('@sumsub/websdk-react'), { ssr: false });

export default function KYCWidget({ userId }: { userId: string }) {
  const [token, setToken] = useState('');
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!started) return;
    fetch('/api/kyc/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => r.json())
      .then(d => { if (d.token) setToken(d.token); else setError('Token invalid — configurează SUMSUB_APP_TOKEN'); })
      .catch(() => setError('Eroare la inițializare KYC'));
  }, [started, userId]);

  const refreshToken = async () => {
    const res = await fetch('/api/kyc/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const d = await res.json();
    return d.token as string;
  };

  if (!started) return (
    <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center">
      <div className="text-5xl mb-4">🪪</div>
      <h3 className="text-xl font-black text-white mb-2">Verificare Identitate</h3>
      <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">KYC obligatoriu pentru retrageri. Durează 2-3 minute.</p>
      <button onClick={() => setStarted(true)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl transition-colors">
        Începe Verificarea KYC
      </button>
    </div>
  );

  if (error) return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
      <p className="text-red-400 text-sm">{error}</p>
      <button onClick={() => setStarted(false)} className="mt-4 text-white/60 hover:text-white text-sm underline">Înapoi</button>
    </div>
  );

  if (!token) return (
    <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-white/60 text-sm">Se inițializează KYC...</span>
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden min-h-[500px]">
      <SumsubWebSdk
        accessToken={token}
        expirationHandler={refreshToken}
        config={{ lang: 'ro' }}
        onMessage={(type: string, payload: unknown) => { if (process.env.NODE_ENV === 'development') console.log('KYC message', type, payload); }}
        onError={(error: unknown) => { if (process.env.NODE_ENV === 'development') console.error('KYC error', error); setError('Eroare KYC'); }}
      />
    </div>
  );
}
