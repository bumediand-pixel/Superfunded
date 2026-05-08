'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';

export default function CalculatorShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/calculators"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" />
          Toate calculatoarele
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            {title}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{description}</p>
        </div>

        <div className="rounded-2xl p-6 md:p-8"
          style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(15,23,42,0.06)' }}>
          {children}
        </div>
      </div>
    </main>
  );
}

export function Field({
  label, hint, children,
}: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text)' }}>{label}</span>
      {children}
      {hint && <span className="block text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>{hint}</span>}
    </label>
  );
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="number"
      className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none transition-all"
      style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)', color: 'var(--text)' }}
      onFocus={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'white'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-alt2)'; }}
    />
  );
}

export function ResultCard({
  label, value, accent = false,
}: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl p-4"
      style={{
        background: accent ? '#fff1f2' : 'var(--bg-alt2)',
        border: `1px solid ${accent ? '#fecdd3' : 'var(--border)'}`,
      }}>
      <div className="text-xs font-bold tracking-widest uppercase mb-1.5"
        style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-3xl font-extrabold" style={{ color: accent ? 'var(--red)' : 'var(--text)' }}>
        {value}
      </div>
    </div>
  );
}
