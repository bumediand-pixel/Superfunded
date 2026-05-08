'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';
import { SKILL_EVAL_DISCLAIMER } from '@/lib/legal';

/**
 * Disclaimer modal shown before Stripe redirect. The user must explicitly tick the
 * "I understand this is skill evaluation" box before they can continue. This is the
 * legal anchor distinguishing our product from a gambling service.
 */
export default function CheckoutDisclaimer({
  open, onConfirm, onCancel, planLabel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  planLabel: string;
}) {
  const [agreed, setAgreed] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}>
      <div className="rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ background: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
        onClick={e => e.stopPropagation()}>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0"
                style={{ background: '#fff1f2' }}>
                <ShieldCheck className="w-6 h-6" style={{ color: 'var(--red)' }} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Confirmare achiziție</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{planLabel}</p>
              </div>
            </div>
            <button onClick={onCancel} aria-label="Închide"
              className="text-current opacity-30 hover:opacity-100 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="rounded-xl p-4 mb-5" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              <strong>Înainte să continui:</strong> {SKILL_EVAL_DISCLAIMER.checkout}
            </p>
          </div>

          <ul className="space-y-2 mb-6">
            {SKILL_EVAL_DISCLAIMER.full.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed"
                style={{ color: 'var(--text-muted)' }}>
                <span className="flex-shrink-0 w-1 h-1 rounded-full mt-2" style={{ background: 'var(--red)' }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <label className="flex items-start gap-3 mb-6 cursor-pointer p-3 rounded-xl transition-colors"
            style={{ background: agreed ? '#dcfce7' : 'var(--bg-alt2)' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0"
              style={{ accentColor: '#15803d' }} />
            <span className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
              Am citit și înțeleg că <strong>SuperFunded NU este casă de pariuri</strong>. Cumpăr acces la o evaluare a abilităților, nu plasez pariuri reale. Am citit{' '}
              <Link href="/termeni" target="_blank" className="font-bold hover:underline" style={{ color: 'var(--red)' }}>
                Termenii
              </Link>{' '}și{' '}
              <Link href="/disclaimer" target="_blank" className="font-bold hover:underline" style={{ color: 'var(--red)' }}>
                Disclaimer-ul
              </Link>.
            </span>
          </label>

          <div className="flex gap-2">
            <button onClick={onCancel}
              className="flex-1 py-3 text-sm font-bold rounded-xl cursor-pointer transition-colors"
              style={{ background: 'var(--bg-alt2)', color: 'var(--text)' }}>
              Anulează
            </button>
            <button onClick={onConfirm} disabled={!agreed}
              className="flex-1 py-3 text-sm font-bold rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{ background: 'var(--red)', color: 'white', boxShadow: agreed ? '0 8px 24px rgba(230,57,70,0.32)' : 'none' }}>
              Continuă spre plată →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
