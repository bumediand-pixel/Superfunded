'use client';
import { useState } from 'react';

const TIERS = [
  {
    name: 'BRONZE',
    referrals: '1–9',
    commission: '10%',
    monthly: '€0 – €200',
    color: '#CD7F32',
    desc: 'Nivel de start. Câștigă 10% din taxa de evaluare a fiecărui trader pe care îl recomanzi.',
    perks: ['Link afiliat dedicat', 'Dashboard basic', 'Plată lunară'],
  },
  {
    name: 'SILVER',
    referrals: '10–29',
    commission: '15%',
    monthly: '€200 – €800',
    color: '#C0C0C0',
    desc: 'Crești cu noi. La 10 tranzacții confirmate lunare, comisionul tău crește la 15%.',
    perks: ['15% comision', 'Dashboard avansat', 'Suport prioritar', 'Materiale marketing'],
  },
  {
    name: 'GOLD',
    referrals: '30+',
    commission: '20%',
    monthly: '€800+',
    color: 'var(--gold)',
    desc: 'Cel mai bun program din industrie. 20% comision recurent pe fiecare trader activ.',
    perks: ['20% comision', 'Manager dedicat', 'Link personalizat', 'Bannere custom', 'Rapoarte avansate'],
    popular: true,
  },
];

const PASI = [
  { nr: '01', titlu: 'Înregistrează-te', desc: 'Creează un cont gratuit pe SuperFunded și accesează secțiunea Afiliere din dashboard.' },
  { nr: '02', titlu: 'Obține Link-ul Tău', desc: 'Primești un link de afiliat unic cu cookie de 30 de zile. Orice trader care cumpără prin link-ul tău îți generează comision.' },
  { nr: '03', titlu: 'Promovează', desc: 'Distribuie link-ul pe social media, blog, YouTube, Telegram sau oricărui bettor care vrea capital. Foloseşte materialele noastre de marketing.' },
  { nr: '04', titlu: 'Câștigă Lunar', desc: 'Comisioanele se calculează automat și se plătesc lunar (pe 15 ale lunii), via transfer bancar sau crypto (USDT/BTC).' },
];

const FAQ_AFILIERE = [
  { q: 'Cât durează cookie-ul de afiliat?', a: '30 de zile calendaristice. Dacă un utilizator accesează platforma prin link-ul tău și cumpără în termen de 30 de zile, comisionul este al tău.' },
  { q: 'Există o limită maximă de câștig?', a: 'Nu. Nu există plafon la câștigurile din afiliere. Cu cât mai mulți traderi recomanzi, cu atât câștigi mai mult.' },
  { q: 'Cum se calculează comisionul?', a: 'Comisionul se calculează ca procent din taxa de evaluare plătită de traderul referit. Exemplu: taxa €139 × 20% = €27,80 comision per vânzare.' },
  { q: 'Când și cum primesc plățile?', a: 'Plățile se procesează pe data de 15 a fiecărei luni, pentru comisioanele acumulate în luna precedentă. Metodele de plată: SEPA, SWIFT sau crypto (USDT TRC-20/BTC).' },
  { q: 'Există cerință de sumă minimă pentru retragere?', a: 'Da. Suma minimă de retragere este €50. Comisioanele sub această sumă se reportează în luna următoare.' },
  { q: 'Pot recomanda pe cineva din altă țară?', a: 'Da, programul de afiliere este disponibil global, cu excepția țărilor restricționate. Comisionul se plătește indiferent de țara traderului referit.' },
];

export default function AfilierePage() {
  const [referrals, setReferrals] = useState(10);
  const [planMediu, setPlanMediu] = useState(139);
  const [tier, setTier] = useState<'bronze' | 'silver' | 'gold'>('silver');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const comision = tier === 'bronze' ? 0.10 : tier === 'silver' ? 0.15 : 0.20;
  const castig = Math.round(referrals * planMediu * comision);

  return (
    <div className="min-h-screen" style={{ background: 'var(--black-0)' }}>

      {/* Hero */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 65%)' }} />
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--gold)' }}>Program Afiliere</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <h1 className="font-bebas leading-none" style={{ fontSize: 'clamp(52px, 9vw, 110px)', letterSpacing: '0.03em' }}>
              CÂȘTIGĂ<br/>RECOMANDÂND
            </h1>
            <p className="max-w-sm text-sm leading-relaxed lg:mb-3" style={{ color: 'var(--white-mid)' }}>
              Recomandă traderi pe SuperFunded și câștigă până la{' '}
              <strong style={{ color: 'var(--gold)', fontWeight: 700 }}>20% comision</strong>{' '}
              din fiecare taxă de evaluare. Plăți lunare garantate.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '20%', label: 'Comision maxim' },
              { val: '30 zile', label: 'Durata cookie' },
              { val: 'Lunar', label: 'Frecvență plată' },
              { val: '∞', label: 'Limita câștig' },
            ].map((s) => (
              <div key={s.label} className="px-5 py-4 text-center" style={{ background: 'var(--black-2)', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div className="font-bebas text-3xl mb-1" style={{ color: 'var(--gold)', letterSpacing: '0.04em' }}>{s.val}</div>
                <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="py-20" style={{ background: 'var(--black-1)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--gold)' }}>Niveluri</span>
          </div>
          <h2 className="font-bebas leading-none mb-10" style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.03em' }}>
            STRUCTURA COMISIOANELOR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <div key={t.name} className="relative overflow-hidden"
                style={{
                  background: t.popular ? 'linear-gradient(145deg, rgba(201,168,76,0.08) 0%, var(--black-2) 100%)' : 'var(--black-2)',
                  border: `1px solid ${t.popular ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: t.popular ? '0 0 40px rgba(201,168,76,0.08)' : 'none',
                }}>
                {t.popular && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />}
                <div className="p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div className="font-bebas text-3xl tracking-wider" style={{ color: t.color, letterSpacing: '0.06em' }}>{t.name}</div>
                    {t.popular && <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ background: 'var(--gold)', color: 'var(--black-0)' }}>RECOMANDAT</span>}
                  </div>

                  <div className="font-bebas leading-none mb-1" style={{ fontSize: '56px', color: t.color, letterSpacing: '0.02em' }}>{t.commission}</div>
                  <div className="font-mono text-xs mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>comision per vânzare</div>

                  <div className="flex items-center justify-between px-3 py-2.5 mb-5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Referrals / lună</span>
                    <span className="font-bebas text-xl" style={{ color: 'var(--white-hi)', letterSpacing: '0.04em' }}>{t.referrals}</span>
                  </div>

                  <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--white-mid)' }}>{t.desc}</p>

                  <ul className="space-y-2">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span style={{ color: t.color, fontSize: '10px' }}>◆</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="py-20" style={{ background: 'var(--black-0)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--gold)' }}>Calculator</span>
          </div>
          <h2 className="font-bebas leading-none mb-10" style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.03em' }}>
            CÂT POȚI CÂȘTIGA
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              {/* Referrals slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Traderi referați / lună</span>
                  <span className="font-bebas text-2xl" style={{ color: 'var(--white-hi)' }}>{referrals}</span>
                </div>
                <input type="range" min={1} max={100} value={referrals}
                  onChange={e => setReferrals(Number(e.target.value))}
                  className="w-full h-1 appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--gold)', background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${referrals}%, rgba(255,255,255,0.1) ${referrals}%, rgba(255,255,255,0.1) 100%)` }} />
                <div className="flex justify-between mt-1 font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  <span>1</span><span>100</span>
                </div>
              </div>

              {/* Plan price slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Taxă medie challenge</span>
                  <span className="font-bebas text-2xl" style={{ color: 'var(--white-hi)' }}>€{planMediu}</span>
                </div>
                <input type="range" min={19} max={599} step={10} value={planMediu}
                  onChange={e => setPlanMediu(Number(e.target.value))}
                  className="w-full h-1 appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--gold)', background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${((planMediu - 19) / 580) * 100}%, rgba(255,255,255,0.1) ${((planMediu - 19) / 580) * 100}%, rgba(255,255,255,0.1) 100%)` }} />
                <div className="flex justify-between mt-1 font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  <span>€19</span><span>€599</span>
                </div>
              </div>

              {/* Tier selector */}
              <div>
                <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Nivel tău</div>
                <div className="flex gap-2">
                  {(['bronze', 'silver', 'gold'] as const).map((t) => (
                    <button key={t} onClick={() => setTier(t)}
                      className="flex-1 font-mono text-xs uppercase tracking-wider py-2.5 transition-all duration-200"
                      style={{
                        background: tier === t ? 'var(--gold)' : 'var(--black-2)',
                        color: tier === t ? 'var(--black-0)' : 'rgba(255,255,255,0.4)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        fontWeight: tier === t ? 700 : 400,
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="flex flex-col items-center justify-center p-10 relative"
              style={{ background: 'linear-gradient(145deg, rgba(201,168,76,0.08) 0%, var(--black-2) 100%)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
              <div className="font-mono text-[10px] tracking-widest uppercase mb-4 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>Estimare câștig lunar</div>
              <div className="font-bebas leading-none text-center mb-2" style={{ fontSize: 'clamp(60px, 10vw, 100px)', color: 'var(--gold)', letterSpacing: '0.02em' }}>
                €{castig.toLocaleString('ro-RO')}
              </div>
              <div className="font-mono text-xs text-center mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {referrals} traderi × €{planMediu} × {Math.round(comision * 100)}%
              </div>
              <div className="text-xs text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                * Estimare orientativă. Câștigul real depinde de conversii și planurile achiziționate.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20" style={{ background: 'var(--black-1)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: 'var(--gold)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--gold)' }}>Proces</span>
          </div>
          <h2 className="font-bebas leading-none mb-10" style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.03em' }}>
            CUM FUNCȚIONEAZĂ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PASI.map((pas) => (
              <div key={pas.nr} className="p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-bebas text-4xl mb-4" style={{ color: 'rgba(201,168,76,0.15)', letterSpacing: '0.02em' }}>{pas.nr}</div>
                <div className="font-bebas text-lg tracking-wider mb-3" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>{pas.titlu}</div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--white-mid)' }}>{pas.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="py-20" style={{ background: 'var(--black-0)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-bebas leading-none mb-8" style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.03em' }}>
            MATERIALE MARKETING
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { titlu: 'Bannere web', desc: 'Bannere optimizate pentru blog, site și anunțuri display. Formate: 300×250, 728×90, 160×600, 320×50.', icon: '🖼️' },
              { titlu: 'Conținut social media', desc: 'Postări gata de folosit pentru Instagram, Facebook, X (Twitter) și TikTok. Actualizate lunar.', icon: '📱' },
              { titlu: 'Texte și copy', desc: 'Texte de vânzare testate: email templates, bio pentru social media, scripts pentru video.', icon: '✍️' },
              { titlu: 'Link tracking', desc: 'Link-uri scurte cu tracking complet: clicuri, conversii, sursa traficului. Dashboard în timp real.', icon: '🔗' },
              { titlu: 'Materiale video', desc: 'Intro-uri animate, story templates și overlay-uri pentru streameri și creatori de conținut.', icon: '🎬' },
              { titlu: 'Manager dedicat', desc: 'La nivelul Gold, primești un manager de cont dedicat care te ajută să îți maximizezi câștigurile.', icon: '👤' },
            ].map((m) => (
              <div key={m.titlu} className="flex gap-4 p-5" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl shrink-0">{m.icon}</span>
                <div>
                  <div className="font-semibold text-sm mb-2" style={{ color: 'var(--white-hi)' }}>{m.titlu}</div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--white-mid)' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20" style={{ background: 'var(--black-1)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bebas leading-none mb-10" style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.03em' }}>
            ÎNTREBĂRI FRECVENTE
          </h2>
          <div className="space-y-2">
            {FAQ_AFILIERE.map((item, i) => (
              <div key={i} className="border transition-all duration-300"
                style={{
                  borderColor: faqOpen === i ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)',
                  background: faqOpen === i ? 'rgba(201,168,76,0.04)' : 'var(--black-2)',
                }}>
                <button className="w-full text-left px-6 py-5 flex items-center justify-between gap-6"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span className="font-jakarta font-semibold text-sm leading-snug" style={{ color: faqOpen === i ? 'var(--white-hi)' : 'rgba(255,255,255,0.75)' }}>
                    {item.q}
                  </span>
                  <span className="font-mono text-lg shrink-0 transition-transform duration-300"
                    style={{ color: 'var(--gold)', transform: faqOpen === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    +
                  </span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6 border-t" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
                    <p className="text-sm leading-relaxed pt-4" style={{ color: 'var(--white-mid)' }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center relative overflow-hidden" style={{ background: 'var(--black-0)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="font-bebas leading-none mb-4" style={{ fontSize: 'clamp(40px, 7vw, 88px)', letterSpacing: '0.03em' }}>
            GATA SĂ CÂȘTIGI?
          </div>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--white-mid)' }}>
            Înregistrează-te gratuit și obține link-ul tău de afiliat în mai puțin de 2 minute.
          </p>
          <a href="/autentificare/register"
            className="inline-block font-bold text-sm tracking-[0.14em] uppercase px-12 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.4)]"
            style={{ background: 'var(--gold)', color: 'var(--black-0)', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
            Devino Afiliat
          </a>
        </div>
      </div>

    </div>
  );
}
