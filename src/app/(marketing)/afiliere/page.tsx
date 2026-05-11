'use client';
/**
 * /afiliere — light brand theme. Hero + tiers + calculator + steps + FAQ.
 * Rescris din varianta dark navy + mono/bebas + gold în paleta cremoasă + roșu + sans-serif.
 */
import { useState } from 'react';
import { Check, ChevronDown, Users, Wallet, TrendingUp, Sparkles } from 'lucide-react';

const TIERS = [
  {
    name: 'Bronze', referrals: '1–9', commission: '10%', accent: '#CD7F32',
    desc: 'Nivel de start. Câștigi 10% din taxa de evaluare a fiecărui trader pe care îl recomanzi.',
    perks: ['Link afiliat dedicat', 'Dashboard basic', 'Plată lunară'],
  },
  {
    name: 'Silver', referrals: '10–29', commission: '15%', accent: '#94A3B8',
    desc: 'Crești cu noi. La 10 tranzacții confirmate lunare, comisionul tău crește la 15%.',
    perks: ['15% comision', 'Dashboard avansat', 'Suport prioritar', 'Materiale marketing'],
  },
  {
    name: 'Gold', referrals: '30+', commission: '20%', accent: '#D4A24C',
    desc: 'Cel mai bun program din industrie. 20% comision recurent pe fiecare trader activ.',
    perks: ['20% comision', 'Manager dedicat', 'Link personalizat', 'Bannere custom', 'Rapoarte avansate'],
    popular: true,
  },
];

const PASI = [
  { nr: '01', titlu: 'Înregistrează-te', desc: 'Creezi un cont gratuit pe SuperFunded și accesezi secțiunea Afiliere din dashboard.' },
  { nr: '02', titlu: 'Obții link-ul tău', desc: 'Primești un link de afiliat unic cu cookie de 30 zile. Orice trader care cumpără prin link-ul tău îți generează comision.' },
  { nr: '03', titlu: 'Promovezi', desc: 'Distribui link-ul pe social media, blog, YouTube, Telegram. Folosești materialele noastre de marketing.' },
  { nr: '04', titlu: 'Câștigi lunar', desc: 'Comisioanele se calculează automat și se plătesc pe 15 ale lunii — transfer bancar sau crypto (USDT/BTC).' },
];

const FAQ_AFILIERE = [
  { q: 'Cât durează cookie-ul de afiliat?', a: '30 zile calendaristice. Dacă un utilizator accesează platforma prin link-ul tău și cumpără în următoarele 30 zile, comisionul este al tău.' },
  { q: 'Există plafon pe câștiguri?', a: 'Nu. Cu cât recomanzi mai mulți traderi, cu atât câștigi mai mult — fără limită.' },
  { q: 'Cum se calculează comisionul?', a: 'Procent din taxa de evaluare plătită de trader. Exemplu: taxa €294 × 20% = €58,80 comision per vânzare.' },
  { q: 'Când și cum primesc plățile?', a: 'Pe 15 ale fiecărei luni, pentru luna precedentă. Metode: SEPA, SWIFT sau crypto (USDT TRC-20 / BTC).' },
  { q: 'Există sumă minimă de retragere?', a: 'Da — €50. Comisioanele sub această sumă se reportează automat în luna următoare.' },
  { q: 'Pot recomanda pe cineva din altă țară?', a: 'Da, programul e global, cu excepția țărilor restricționate. Comisionul se plătește indiferent de țara traderului.' },
];

const RED = 'var(--red, #e63946)';
const TEXT = 'var(--text, #0f172a)';
const MUTED = 'var(--text-muted, #64748b)';
const BORDER = 'var(--border, #e2e8f0)';
const BG_ALT = 'var(--bg-alt, #fbf8f6)';

export default function AfilierePage() {
  const [referrals, setReferrals] = useState(10);
  const [planMediu, setPlanMediu] = useState(294);
  const [tier, setTier] = useState<'bronze' | 'silver' | 'gold'>('silver');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const commission = tier === 'bronze' ? 0.10 : tier === 'silver' ? 0.15 : 0.20;
  const castig = Math.round(referrals * planMediu * commission);
  const anual = castig * 12;

  return (
    <main className="min-h-screen" style={{ background: '#ffffff' }}>

      {/* Hero */}
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20" style={{ background: BG_ALT }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-5"
            style={{ background: '#fff1f2', color: RED, border: '1px solid #fecdd3' }}>
            Program Afiliere
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <h1 className="font-extrabold tracking-tight leading-[1.02]"
              style={{ fontSize: 'clamp(44px, 8vw, 88px)', color: TEXT }}>
              Câștigă<br/><span style={{ color: RED }}>recomandând.</span>
            </h1>
            <p className="max-w-sm text-base sm:text-lg leading-relaxed lg:mb-3" style={{ color: MUTED }}>
              Recomandă traderi pe SuperFunded și câștigi până la{' '}
              <strong style={{ color: TEXT, fontWeight: 800 }}>20% comision</strong>{' '}
              din fiecare taxă. Plăți lunare garantate.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { val: '20%', label: 'Comision maxim', icon: TrendingUp },
              { val: '30 zile', label: 'Durată cookie', icon: Sparkles },
              { val: 'Lunar', label: 'Frecvență plată', icon: Wallet },
              { val: '∞', label: 'Limită câștig', icon: Users },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl p-4 sm:p-5 text-center"
                  style={{ background: '#ffffff', border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>
                  <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: RED }} />
                  <div className="font-extrabold text-2xl sm:text-3xl mb-1" style={{ color: TEXT }}>{s.val}</div>
                  <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase" style={{ color: MUTED }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 sm:py-24" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-flex text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ background: '#fff1f2', color: RED, border: '1px solid #fecdd3' }}>
              Niveluri
            </span>
            <h2 className="font-extrabold tracking-tight leading-[1.05] mb-3"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: TEXT }}>
              Structura comisioanelor
            </h2>
            <p className="text-base sm:text-lg" style={{ color: MUTED }}>
              Cu cât aduci mai mulți traderi activi pe lună, cu atât crește procentul tău.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {TIERS.map(t => (
              <div key={t.name} className="relative rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
                style={{
                  background: '#ffffff',
                  border: `${t.popular ? '2px' : '1px'} solid ${t.popular ? RED : BORDER}`,
                  boxShadow: t.popular
                    ? '0 20px 50px rgba(230,57,70,0.10), 0 4px 12px rgba(15,23,42,0.06)'
                    : '0 4px 12px rgba(15,23,42,0.05)',
                }}>
                {t.popular && (
                  <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest"
                    style={{ background: RED, color: '#fff', borderBottomLeftRadius: 10 }}>
                    Recomandat
                  </div>
                )}
                <div className="p-7 sm:p-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5"
                    style={{ background: `${t.accent}18`, color: t.accent, border: `1px solid ${t.accent}40` }}>
                    {t.name}
                  </div>
                  <div className="font-extrabold leading-none mb-1" style={{ fontSize: '56px', color: TEXT }}>{t.commission}</div>
                  <div className="text-xs mb-5 font-semibold" style={{ color: MUTED }}>comision per vânzare</div>

                  <div className="flex items-center justify-between px-3 py-2.5 mb-5 rounded-lg"
                    style={{ background: BG_ALT, border: `1px solid ${BORDER}` }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Referrals / lună</span>
                    <span className="font-extrabold text-base" style={{ color: TEXT }}>{t.referrals}</span>
                  </div>

                  <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED }}>{t.desc}</p>

                  <ul className="space-y-2">
                    {t.perks.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm" style={{ color: TEXT }}>
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 sm:py-24" style={{ background: BG_ALT }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-flex text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ background: '#fff1f2', color: RED, border: '1px solid #fecdd3' }}>
              Calculator
            </span>
            <h2 className="font-extrabold tracking-tight leading-[1.05] mb-3"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: TEXT }}>
              Cât poți câștiga
            </h2>
            <p className="text-base sm:text-lg" style={{ color: MUTED }}>
              Mută slider-ele și vezi în timp real venitul lunar și anual potențial.
            </p>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            style={{ background: '#ffffff', border: `1px solid ${BORDER}`, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div className="space-y-7">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold" style={{ color: TEXT }}>Traderi referați / lună</label>
                  <span className="font-extrabold text-lg" style={{ color: RED }}>{referrals}</span>
                </div>
                <input type="range" min={1} max={100} value={referrals}
                  onChange={e => setReferrals(Number(e.target.value))}
                  aria-label="Traderi referați pe lună"
                  className="w-full h-2 appearance-none cursor-pointer rounded-full"
                  style={{ background: `linear-gradient(to right, #e63946 0%, #e63946 ${referrals}%, #e2e8f0 ${referrals}%, #e2e8f0 100%)` }} />
                <div className="flex justify-between mt-1 text-[11px] font-semibold" style={{ color: MUTED }}>
                  <span>1</span><span>100</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold" style={{ color: TEXT }}>Taxă medie pe challenge</label>
                  <span className="font-extrabold text-lg" style={{ color: RED }}>€{planMediu}</span>
                </div>
                <input type="range" min={19} max={1250} step={5} value={planMediu}
                  onChange={e => setPlanMediu(Number(e.target.value))}
                  aria-label="Taxă medie pe challenge"
                  className="w-full h-2 appearance-none cursor-pointer rounded-full"
                  style={{ background: `linear-gradient(to right, #e63946 0%, #e63946 ${((planMediu - 19) / (1250 - 19)) * 100}%, #e2e8f0 ${((planMediu - 19) / (1250 - 19)) * 100}%, #e2e8f0 100%)` }} />
                <div className="flex justify-between mt-1 text-[11px] font-semibold" style={{ color: MUTED }}>
                  <span>€19</span><span>€1.250</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block" style={{ color: TEXT }}>Nivelul tău</label>
                <div className="flex p-1 rounded-lg gap-1" style={{ background: BG_ALT, border: `1px solid ${BORDER}` }}>
                  {(['bronze', 'silver', 'gold'] as const).map(t => {
                    const on = tier === t;
                    return (
                      <button key={t} type="button" onClick={() => setTier(t)}
                        className="flex-1 py-2 text-xs font-bold rounded-md cursor-pointer transition-all capitalize"
                        style={on
                          ? { background: '#ffffff', color: TEXT, boxShadow: '0 1px 3px rgba(15,23,42,0.08)' }
                          : { background: 'transparent', color: MUTED }
                        }>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl p-6 sm:p-8"
              style={{ background: BG_ALT, border: `1px dashed ${BORDER}` }}>
              <div className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: MUTED }}>
                Venit estimat / lună
              </div>
              <div className="font-extrabold leading-none mb-1"
                style={{ fontSize: 'clamp(48px, 7vw, 80px)', color: RED }}>
                €{castig.toLocaleString('ro-RO')}
              </div>
              <div className="text-sm mb-6" style={{ color: MUTED }}>
                ≈ <strong style={{ color: TEXT }}>€{anual.toLocaleString('ro-RO')}</strong> pe an
              </div>
              <div className="text-xs leading-relaxed" style={{ color: MUTED }}>
                {referrals} traderi × €{planMediu} × {Math.round(commission * 100)}% comision
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 sm:py-24" style={{ background: '#ffffff' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-flex text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ background: '#fff1f2', color: RED, border: '1px solid #fecdd3' }}>
              Cum încep
            </span>
            <h2 className="font-extrabold tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: TEXT }}>
              Patru pași până la primul comision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {PASI.map(p => (
              <div key={p.nr} className="rounded-2xl p-6 transition-all hover:-translate-y-0.5"
                style={{ background: BG_ALT, border: `1px solid ${BORDER}` }}>
                <div className="font-extrabold leading-none mb-3" style={{ fontSize: '36px', color: RED }}>{p.nr}</div>
                <h3 className="font-extrabold text-lg mb-2" style={{ color: TEXT }}>{p.titlu}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24" style={{ background: BG_ALT }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ background: '#fff1f2', color: RED, border: '1px solid #fecdd3' }}>
              Întrebări frecvente
            </span>
            <h2 className="font-extrabold tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: TEXT }}>
              FAQ Afiliere
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_AFILIERE.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={f.q} className="rounded-xl overflow-hidden"
                  style={{ background: '#ffffff', border: `1px solid ${BORDER}` }}>
                  <button type="button" onClick={() => setFaqOpen(open ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
                    <span className="text-sm sm:text-base font-bold" style={{ color: TEXT }}>{f.q}</span>
                    <ChevronDown className="w-4 h-4 transition-transform flex-shrink-0"
                      style={{ color: MUTED, transform: open ? 'rotate(180deg)' : 'none' }} />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: MUTED }}>{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <a href="/dashboard/afiliere"
              className="inline-flex items-center gap-2 font-extrabold text-sm px-6 py-3 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: RED, color: '#fff', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
              Înrolează-te ca afiliat →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
