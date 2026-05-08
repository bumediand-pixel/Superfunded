'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, AlertCircle, Mail, Clock } from 'lucide-react';

const SumsubWebSdk = dynamic(() => import('@sumsub/websdk-react'), { ssr: false });

type Status = 'idle' | 'loading' | 'ready' | 'configError' | 'genericError';

/**
 * KYC widget that gracefully degrades when Sumsub isn't configured yet.
 *
 * In dev / pre-production we don't always have SUMSUB_APP_TOKEN/SECRET set.
 * Old code threw "Token invalid" with no path forward; this version detects
 * the misconfiguration and tells the user we'll process KYC manually via
 * email until automatic verification goes live.
 */
export default function KYCWidget({ userId }: { userId: string }) {
  const [token, setToken] = useState('');
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!started) return;
    setStatus('loading');
    fetch('/api/kyc/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) {
          if (r.status === 500 || /sumsub/i.test(d.error ?? '')) setStatus('configError');
          else setStatus('genericError');
          return;
        }
        if (d.token) {
          setToken(d.token);
          setStatus('ready');
        } else setStatus('configError');
      })
      .catch(() => setStatus('genericError'));
  }, [started, userId]);

  const refreshToken = async () => {
    const res = await fetch('/api/kyc/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const d = await res.json();
    return d.token as string;
  };

  if (!started) return (
    <div className="rounded-2xl p-6 sm:p-8"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5"
        style={{ background: 'rgba(34,197,94,0.12)' }}>
        <ShieldCheck className="w-7 h-7 text-green-400" />
      </div>
      <h3 className="text-xl font-extrabold text-white text-center mb-2">Verificare identitate</h3>
      <p className="text-sm text-white/50 text-center max-w-md mx-auto mb-5">
        Verificarea KYC durează 2-3 minute și e necesară pentru retrageri. Folosim Sumsub — același furnizor ca băncile.
      </p>
      <ul className="space-y-2 mb-6 max-w-md mx-auto">
        <li className="flex items-center gap-2 text-xs text-white/60">
          <Clock className="w-3.5 h-3.5 text-white/30" />
          Aprobare în 15 min - 24h în zile lucrătoare
        </li>
        <li className="flex items-center gap-2 text-xs text-white/60">
          <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
          Date stocate la Sumsub (servere UE), nu la noi
        </li>
      </ul>
      <button onClick={() => setStarted(true)}
        className="block w-full sm:w-auto sm:mx-auto font-bold text-sm px-8 py-3 rounded-xl text-white cursor-pointer transition-all"
        style={{ background: 'var(--red, #e63946)', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
        Începe verificarea
      </button>
    </div>
  );

  if (status === 'configError') return (
    <div className="rounded-2xl p-6 sm:p-8"
      style={{ background: '#141414', border: '1px solid rgba(251,191,36,0.25)' }}>
      <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
        style={{ background: 'rgba(251,191,36,0.15)' }}>
        <AlertCircle className="w-6 h-6 text-yellow-400" />
      </div>
      <h3 className="text-lg font-extrabold text-white text-center mb-2">Verificare manuală pentru moment</h3>
      <p className="text-sm text-white/60 text-center mb-5 max-w-md mx-auto">
        Verificarea automată Sumsub se activează în câteva zile. Până atunci, procesăm KYC manual prin email — durează 24h.
      </p>
      <a href="mailto:kyc@thesuperfunded.com?subject=Verificare KYC manuala"
        className="flex items-center justify-center gap-2 w-full sm:w-fit sm:mx-auto font-bold text-sm px-6 py-3 rounded-xl text-white"
        style={{ background: 'var(--red, #e63946)' }}>
        <Mail className="w-4 h-4" />
        kyc@thesuperfunded.com
      </a>
      <button onClick={() => setStarted(false)}
        className="block mx-auto mt-4 text-white/40 hover:text-white text-xs underline cursor-pointer">
        Înapoi
      </button>
    </div>
  );

  if (status === 'genericError') return (
    <div className="rounded-2xl p-6 text-center"
      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <p className="text-red-400 text-sm mb-4">A apărut o eroare la încărcarea verificării.</p>
      <button onClick={() => setStarted(false)} className="text-white/60 hover:text-white text-sm underline cursor-pointer">
        Reîncearcă
      </button>
    </div>
  );

  if (status !== 'ready' || !token) return (
    <div className="rounded-2xl p-8 flex items-center justify-center gap-3"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-white/60 text-sm">Se inițializează KYC...</span>
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden min-h-[500px]"
      style={{ background: 'white' }}>
      <SumsubWebSdk
        accessToken={token}
        expirationHandler={refreshToken}
        config={{ lang: 'ro' }}
        onMessage={(type: string, payload: unknown) => { if (process.env.NODE_ENV === 'development') console.log('KYC', type, payload); }}
        onError={(error: unknown) => { if (process.env.NODE_ENV === 'development') console.error('KYC error', error); setStatus('genericError'); }}
      />
    </div>
  );
}
