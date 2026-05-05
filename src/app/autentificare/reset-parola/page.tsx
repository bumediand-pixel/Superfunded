'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

type Step = 'request' | 'sent' | 'update' | 'done';

export default function ResetParolaPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/autentificare/reset-parola?step=update`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setStep('sent');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Parolele nu coincid'); return; }
    if (password.length < 8) { setError('Parola trebuie să aibă minim 8 caractere'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setStep('done');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--black-0)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 flex items-center justify-center"
              style={{ background: 'var(--red)', clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)' }}>
              <span className="font-bebas text-white text-sm">SF</span>
            </div>
            <span className="font-bebas text-xl tracking-wider text-white" style={{ letterSpacing: '0.12em' }}>SUPERFUNDED</span>
          </Link>
        </div>

        <div className="p-8" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Step: request */}
          {step === 'request' && (
            <>
              <div className="mb-6">
                <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--red)' }}>Securitate cont</div>
                <h1 className="font-bebas text-3xl tracking-widest" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>RESETARE PAROLĂ</h1>
                <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Lasă-ne emailul, îți trimitem linkul de resetare.</p>
              </div>
              {error && (
                <div className="mb-4 px-4 py-3 text-sm font-mono" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', color: 'var(--red)' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="email@exemplu.ro"
                    className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white-hi)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(230,57,70,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full font-bold text-xs tracking-[0.14em] uppercase py-3.5 transition-all duration-300 disabled:opacity-40"
                  style={{ background: 'var(--red)', color: 'white', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
                  {loading ? 'Se trimite…' : 'Trimite linkul'}
                </button>
              </form>
            </>
          )}

          {/* Step: sent */}
          {step === 'sent' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <span className="text-2xl" style={{ color: '#22c55e' }}>✓</span>
              </div>
              <h2 className="font-bebas text-2xl tracking-widest mb-2" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>EMAIL TRIMIS</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Verifică inboxul de la <span style={{ color: 'var(--white-hi)' }}>{email}</span>. Linkul e valabil 1 oră.
              </p>
              <button onClick={() => setStep('request')} className="mt-6 font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                ← Trimite-l din nou
              </button>
            </div>
          )}

          {/* Step: update (landed from email link) */}
          {step === 'update' && (
            <>
              <div className="mb-6">
                <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--red)' }}>Parolă nouă</div>
                <h1 className="font-bebas text-3xl tracking-widest" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>SETEAZĂ PAROLA</h1>
              </div>
              {error && (
                <div className="mb-4 px-4 py-3 text-sm font-mono" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', color: 'var(--red)' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Parolă nouă</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                    placeholder="Minim 8 caractere"
                    className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white-hi)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(230,57,70,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Confirmă parola</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                    placeholder="Repetă parola"
                    className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white-hi)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(230,57,70,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full font-bold text-xs tracking-[0.14em] uppercase py-3.5 transition-all duration-300 disabled:opacity-40"
                  style={{ background: 'var(--red)', color: 'white', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
                  {loading ? 'Se salvează…' : 'Salvează parola'}
                </button>
              </form>
            </>
          )}

          {/* Step: done */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <span className="text-2xl" style={{ color: '#22c55e' }}>✓</span>
              </div>
              <h2 className="font-bebas text-2xl tracking-widest mb-2" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>PAROLĂ ACTUALIZATĂ</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>Poți intra acum în cont cu parola nouă.</p>
              <Link href="/autentificare/login"
                className="inline-block font-bold text-xs tracking-[0.14em] uppercase px-8 py-3.5 transition-all duration-300"
                style={{ background: 'var(--red)', color: 'white', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
                Mergi la autentificare
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/autentificare/login" style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white-hi)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
            ← Înapoi la login
          </Link>
        </p>

      </div>
    </div>
  );
}
