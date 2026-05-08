'use client';
import { useState } from 'react';

export default function SetariPage() {
  const [saved, setSaved] = useState(false);
  const [notif, setNotif] = useState({ email: true, telegram: false, pariuConfirmat: true, retragereStatus: true });
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteConfirm !== 'STERGE') return;
    setDeleting(true);
    setDeleteError(null);
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
      setDeleteError(err instanceof Error ? err.message : 'Eroare');
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--red)' }}>Dashboard</div>
          <h1 className="font-bebas text-4xl tracking-widest" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>SETĂRI CONT</h1>
        </div>

        <div className="space-y-6">

          {/* Profile */}
          <div className="p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-bebas text-lg tracking-wider mb-5" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>PROFIL</div>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Nume afișat</label>
                <input type="text" placeholder="Numele tău" defaultValue=""
                  className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white-hi)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(230,57,70,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Email</label>
                <input type="email" placeholder="email@exemplu.ro" defaultValue=""
                  className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white-mid)' }}
                  disabled />
                <p className="mt-1 font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Emailul nu poate fi modificat. Contactează suportul.</p>
              </div>
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Telegram handle</label>
                <input type="text" placeholder="@username"
                  className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white-hi)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(230,57,70,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-bebas text-lg tracking-wider mb-5" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>NOTIFICĂRI</div>
            <div className="space-y-4">
              {([
                { key: 'email', label: 'Notificări email', desc: 'Actualizări despre cont, retrageri și promoții' },
                { key: 'telegram', label: 'Notificări Telegram', desc: 'Alerte instant pe Telegram (necesită handle setat)' },
                { key: 'pariuConfirmat', label: 'Confirmare pariu', desc: 'Notificare când un pariu a fost înregistrat' },
                { key: 'retragereStatus', label: 'Status retragere', desc: 'Actualizări despre procesarea retragerilor' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--white-hi)' }}>{label}</div>
                    <div className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</div>
                  </div>
                  <button onClick={() => setNotif(p => ({ ...p, [key]: !p[key] }))}
                    className="relative w-10 h-5 rounded-full transition-all duration-300 shrink-0"
                    style={{ background: notif[key] ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                      style={{ left: notif[key] ? '1.25rem' : '0.125rem' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-bebas text-lg tracking-wider mb-5" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>SECURITATE</div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between group"
                style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--white-mid)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                Schimbă parola
                <span style={{ color: 'var(--red)' }}>→</span>
              </button>
              <button className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
                style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--white-mid)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                Activează autentificare 2FA
                <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>Recomandat</span>
              </button>
              <button className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
                style={{ background: 'var(--black-1)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--white-mid)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                Descarcă datele mele (GDPR)
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>→</span>
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="p-6" style={{ background: 'rgba(230,57,70,0.03)', border: '1px solid rgba(230,57,70,0.15)' }}>
            <div className="font-bebas text-lg tracking-wider mb-2" style={{ color: 'var(--red)', letterSpacing: '0.06em' }}>ZONĂ PERICULOASĂ</div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ștergerea contului este permanentă și ireversibilă. Toate datele, istoricul pariurilor și conturile active vor fi eliminate.
            </p>
            <button onClick={() => setDeleteOpen(true)}
              className="font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 transition-all duration-200 cursor-pointer"
              style={{ background: 'transparent', border: '1px solid rgba(230,57,70,0.3)', color: 'rgba(230,57,70,0.6)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(230,57,70,0.1)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(230,57,70,0.6)'; }}>
              Șterge contul
            </button>

            {deleteOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
                onClick={() => !deleting && setDeleteOpen(false)}>
                <div className="rounded-2xl max-w-md w-full p-6"
                  style={{ background: '#141414', border: '1px solid rgba(230,57,70,0.3)' }}
                  onClick={e => e.stopPropagation()}>
                  <h3 className="font-bebas text-2xl tracking-wider text-white mb-3">Confirmare ștergere cont</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-2">
                    Datele tale personale vor fi anonimizate ireversibil. Înregistrările financiare (plăți, retrageri procesate) sunt păstrate conform legii române timp de 5–10 ani, dar fără identificarea ta.
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    Conturile active vor fi suspendate. Tipează <span className="font-mono font-bold text-red-400">STERGE</span> pentru confirmare:
                  </p>
                  <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                    placeholder="STERGE"
                    autoFocus
                    className="w-full mb-4 px-4 py-3 rounded-lg outline-none font-mono text-white"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  {deleteError && (
                    <p className="text-xs text-red-400 mb-3">{deleteError}</p>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteOpen(false)} disabled={deleting}
                      className="flex-1 py-3 text-sm font-bold rounded-lg cursor-pointer text-white"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Anulează
                    </button>
                    <button onClick={handleDelete} disabled={deleteConfirm !== 'STERGE' || deleting}
                      className="flex-1 py-3 text-sm font-bold rounded-lg cursor-pointer text-white disabled:opacity-30"
                      style={{ background: 'var(--red)' }}>
                      {deleting ? 'Se șterge...' : 'Șterge contul definitiv'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="font-bold text-xs tracking-[0.14em] uppercase px-8 py-3.5 transition-all duration-300 disabled:opacity-40"
              style={{ background: 'var(--red)', color: 'white', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
              {saving ? '⟳ Se salvează...' : 'Salvează modificările'}
            </button>
            {saved && <span className="font-mono text-xs" style={{ color: '#22c55e' }}>✓ Salvat cu succes</span>}
          </div>

        </div>
      </div>
    </div>
  );
}
