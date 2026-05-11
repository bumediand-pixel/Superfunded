'use client';
import { useState } from 'react';
import { Mail, Users, Handshake, MapPin, Clock, Send } from 'lucide-react';

type Category = 'support' | 'affiliates' | 'partnerships' | 'general';

const CATEGORIES: { id: Category; label: string; icon: typeof Mail; email: string; desc: string }[] = [
  { id: 'support',      label: 'Suport general',  icon: Mail,     email: 'support@thesuperfunded.com',      desc: 'Întrebări despre cont, picks, retrageri, KYC.' },
  { id: 'affiliates',   label: 'Afiliere',        icon: Users,    email: 'afiliere@thesuperfunded.com',     desc: 'Înrolare în program, comisioane, materiale.' },
  { id: 'partnerships', label: 'Parteneriate',    icon: Handshake,email: 'parteneriate@thesuperfunded.com',desc: 'Colaborări, content, brand deals.' },
  { id: 'general',      label: 'Altceva',         icon: Mail,     email: 'hello@thesuperfunded.com',        desc: 'Orice nu intră în categoriile de mai sus.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', category: 'support' as Category, subject: '', message: '', website: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Eroare necunoscută');
      setStatus('sent');
      setForm({ name: '', email: '', category: 'support', subject: '', message: '', website: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Trimitere eșuată');
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Vorbim?
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Echipa noastră răspunde tipic în 2-6h în zilele lucrătoare. În weekend / sărbători, până în 24-48h.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-10">
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            return (
              <a key={c.id} href={`mailto:${c.email}`}
                className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: 'white', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                  style={{ background: '#fff1f2' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--red)' }} />
                </div>
                <div className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{c.label}</div>
                <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{c.desc}</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--red)' }}>{c.email}</div>
              </a>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Form */}
          <form onSubmit={submit} className="md:col-span-2 rounded-2xl p-6 md:p-8"
            style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(15,23,42,0.06)' }}>

            <h2 className="text-2xl font-extrabold mb-5" style={{ color: 'var(--text)' }}>Trimite un mesaj</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Nume *">
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)' }} />
              </FormField>
              <FormField label="Email *">
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)' }} />
              </FormField>
            </div>

            <FormField label="Categorie">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}
                className="w-full px-4 py-3 rounded-xl outline-none cursor-pointer"
                style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </FormField>

            <FormField label="Subiect *">
              <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)' }} />
            </FormField>

            <FormField label="Mesaj *">
              <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none resize-y"
                style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)' }} />
            </FormField>

            {/* honeypot */}
            <input type="text" name="website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
              tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }} />

            <button type="submit" disabled={status === 'sending'}
              className="mt-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl cursor-pointer disabled:opacity-50 transition-all"
              style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
              <Send className="w-4 h-4" />
              {status === 'sending' ? 'Se trimite...' : 'Trimite mesaj'}
            </button>

            {status === 'sent' && (
              <p className="mt-4 text-sm font-semibold p-3 rounded-xl"
                style={{ background: '#dcfce7', color: '#15803d' }}>
                ✓ Mesaj trimis! Te contactăm în 24-48h.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 text-sm font-semibold p-3 rounded-xl"
                style={{ background: '#fee2e2', color: '#b91c1c' }}>
                ✕ {error}
              </p>
            )}
          </form>

          {/* Info sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl p-6"
              style={{ background: 'white', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3.5 h-3.5" />
                Timp de răspuns
              </div>
              <div className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>2-6h</div>
              <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>luni-vineri, 9-18 EET</div>
            </div>

            <div className="rounded-2xl p-6"
              style={{ background: 'white', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}>
                <MapPin className="w-3.5 h-3.5" />
                Operator
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>TheSuperFunded</div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                CUI: RO00000000<br />
                București, România<br />
                <a href="/termeni" className="font-semibold hover:underline" style={{ color: 'var(--red)' }}>Termeni & Condiții</a>
              </div>
            </div>

            <a href="https://discord.gg/superfunded" target="_blank" rel="noopener"
              className="block rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background: 'var(--text)', color: 'white' }}>
              <div className="text-xs font-bold tracking-widest uppercase mb-2 opacity-60">Răspuns instant</div>
              <div className="text-xl font-extrabold mb-1">Discord 24/7</div>
              <div className="text-sm opacity-70">Întreabă comunitatea — mai rapid decât emailul.</div>
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {children}
    </label>
  );
}
