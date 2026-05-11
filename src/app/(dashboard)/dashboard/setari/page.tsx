'use client';
import { useState } from 'react';
import { Lock, Download, Trash2, AlertTriangle, X, Mail, MessageCircle } from 'lucide-react';

export default function SetariPage() {
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwOk, setPwOk] = useState(false);

  const [delOpen, setDelOpen] = useState(false);
  const [delConfirm, setDelConfirm] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delError, setDelError] = useState<string | null>(null);

  const handlePasswordChange = async () => {
    setPwBusy(true); setPwError(null); setPwOk(false);
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Schimbare eșuată');
      setPwOk(true);
      setPwCurrent(''); setPwNew('');
      setTimeout(() => { setPwOpen(false); setPwOk(false); }, 1500);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Eroare');
    } finally { setPwBusy(false); }
  };

  const handleDelete = async () => {
    if (delConfirm !== 'STERGE') return;
    setDelBusy(true); setDelError(null);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'STERGE' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ștergere eșuată');
      window.location.href = '/?account_deleted=1';
    } catch (err) {
      setDelError(err instanceof Error ? err.message : 'Eroare');
      setDelBusy(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Setări cont</h1>
        <p className="text-white/40 text-sm mt-1">Gestionează contul tău, securitate și date personale.</p>
      </div>

      <div className="space-y-4">

        {/* Securitate */}
        <SectionCard title="Securitate" subtitle="Protejează-ți contul">
          <ActionRow
            icon={Lock}
            label="Schimbă parola"
            desc="Ai nevoie de parola curentă pentru confirmare."
            onClick={() => setPwOpen(true)}
          />
        </SectionCard>

        {/* Date GDPR */}
        <SectionCard title="Datele tale" subtitle="Drepturi GDPR">
          <ActionRow
            icon={Download}
            label="Descarcă datele mele"
            desc="Export JSON cu toate datele despre tine (GDPR Art. 20)."
            href="/api/user/export"
          />
        </SectionCard>

        {/* Suport */}
        <SectionCard title="Suport" subtitle="Te ajutăm rapid">
          <ActionRow
            icon={MessageCircle}
            label="Comunitate Discord"
            desc="Răspuns în câteva minute, 24/7."
            href="/discord"
            external
          />
          <ActionRow
            icon={Mail}
            label="Trimite-ne un email"
            desc="support@thesuperfunded.com — răspundem în 2-6h."
            href="/contact"
          />
        </SectionCard>

        {/* Danger zone */}
        <SectionCard title="Zona periculoasă" tone="danger">
          <ActionRow
            icon={Trash2}
            label="Șterge contul"
            desc="Acțiunea anonimizează datele personale ireversibil. Datele financiare sunt păstrate 5-10 ani conform legii."
            onClick={() => setDelOpen(true)}
            tone="danger"
          />
        </SectionCard>
      </div>

      {/* Password change modal */}
      {pwOpen && (
        <Modal onClose={() => !pwBusy && setPwOpen(false)}>
          <h3 className="text-xl font-extrabold text-white mb-1">Schimbă parola</h3>
          <p className="text-sm text-white/50 mb-5">Pune o parolă nouă de minim 8 caractere.</p>

          <DarkField label="Parolă curentă">
            <input type="password" autoComplete="current-password" autoFocus
              value={pwCurrent} onChange={e => setPwCurrent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg outline-none text-white"
              style={{ background: 'var(--dash-overlay-5)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }} />
          </DarkField>

          <DarkField label="Parolă nouă (min. 8 caractere)">
            <input type="password" autoComplete="new-password" minLength={8}
              value={pwNew} onChange={e => setPwNew(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg outline-none text-white"
              style={{ background: 'var(--dash-overlay-5)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }} />
          </DarkField>

          {pwError && <p className="text-xs text-red-400 mb-3">{pwError}</p>}
          {pwOk && <p className="text-xs text-green-400 mb-3">✓ Parolă schimbată</p>}

          <div className="flex gap-2 mt-2">
            <button onClick={() => setPwOpen(false)} disabled={pwBusy}
              className="flex-1 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-white"
              style={{ background: 'var(--dash-overlay-5)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }}>
              Anulează
            </button>
            <button onClick={handlePasswordChange}
              disabled={pwBusy || pwCurrent.length < 1 || pwNew.length < 8}
              className="flex-1 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-white disabled:opacity-30"
              style={{ background: 'var(--red, #e63946)' }}>
              {pwBusy ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {delOpen && (
        <Modal onClose={() => !delBusy && setDelOpen(false)}>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
            style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white text-center mb-2">Ștergere cont?</h3>
          <p className="text-sm text-white/60 mb-2">
            Datele tale personale vor fi anonimizate ireversibil. Înregistrările financiare (plăți, retrageri procesate) sunt păstrate conform legii române timp de 5–10 ani, dar fără identificarea ta.
          </p>
          <p className="text-sm text-white/60 mb-4">
            Tipează <span className="font-mono font-bold text-red-400">STERGE</span> pentru confirmare:
          </p>
          <input type="text" value={delConfirm} onChange={e => setDelConfirm(e.target.value)}
            placeholder="STERGE" autoFocus
            className="w-full mb-4 px-4 py-3 rounded-lg outline-none font-mono text-white"
            style={{ background: 'var(--dash-overlay-5)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }} />
          {delError && <p className="text-xs text-red-400 mb-3">{delError}</p>}
          <div className="flex gap-2">
            <button onClick={() => setDelOpen(false)} disabled={delBusy}
              className="flex-1 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-white"
              style={{ background: 'var(--dash-overlay-5)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }}>
              Anulează
            </button>
            <button onClick={handleDelete} disabled={delConfirm !== 'STERGE' || delBusy}
              className="flex-1 py-2.5 text-sm font-bold rounded-lg cursor-pointer text-white disabled:opacity-30"
              style={{ background: '#dc2626' }}>
              {delBusy ? 'Se șterge...' : 'Șterge contul'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, tone, children }: {
  title: string; subtitle?: string; tone?: 'danger'; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--dash-surface, #141414)',
        border: tone === 'danger' ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--dash-overlay-6)',
      }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--dash-overlay-5)' }}>
        <h2 className="text-sm font-extrabold tracking-wider uppercase"
          style={{ color: tone === 'danger' ? '#fca5a5' : 'var(--dash-text-70)' }}>{title}</h2>
        {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ActionRow({ icon: Icon, label, desc, onClick, href, external, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; desc: string;
  onClick?: () => void; href?: string; external?: boolean; tone?: 'danger';
}) {
  const inner = (
    <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] cursor-pointer">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{ background: tone === 'danger' ? 'rgba(239,68,68,0.12)' : 'var(--dash-overlay-5)' }}>
        <Icon className={`w-4 h-4 ${tone === 'danger' ? 'text-red-400' : 'text-white/70'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm ${tone === 'danger' ? 'text-red-300' : 'text-white'}`}>{label}</div>
        <div className="text-xs text-white/40 mt-0.5">{desc}</div>
      </div>
      <span className={`text-sm flex-shrink-0 ${tone === 'danger' ? 'text-red-400' : 'text-white/30'}`}>→</span>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}
        className="block">
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="block w-full text-left">
      {inner}
    </button>
  );
}

function DarkField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/50">{label}</span>
      {children}
    </label>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="rounded-2xl max-w-md w-full p-6 sm:p-7"
        style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border-2, var(--dash-overlay-10))' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Închide"
          className="float-right text-white/30 hover:text-white p-1 cursor-pointer -mr-1 -mt-1">
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
