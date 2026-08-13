const FAQ_ITEMS = [
  { q: 'Pierd bani dacă pic provocarea?', a: 'Nu. Pierzi doar taxa unică plătită pentru challenge — niciodată bani personali. Capitalul de pariere este al nostru, riscul este al nostru.' },
  { q: 'Este SuperFunded o casă de pariuri?', a: 'Nu. Suntem o platformă de evaluare a abilităților sportive (prop firm). Pariezi într-un mediu controlat, cu reguli clare, şi dacă eşti constant profitabil primeşti cont funded şi plată reală.' },
  { q: 'Cum se face plata şi cât durează?', a: 'Cererile de retragere se procesează săptămânal, în 24-48h, prin transfer bancar SEPA, Wise sau crypto (USDT/BTC). Fără taxe ascunse.' },
  { q: 'Cât din profit păstrez?', a: 'Până la 80% din profitul net pe contul funded. Restul rămâne în SuperFunded ca acoperire a riscului şi a operațiunilor.' },
  { q: 'Există vreun catch ascuns?', a: 'Singurele reguli sunt target-ul de profit şi drawdown-ul maxim, ambele afişate clar pe pagina planului. Fără reînnoiri automate, fără penalizări pentru pauze.' },
  { q: 'Ce sporturi şi ce piețe pot pune pe pick?', a: 'Fotbal (UCL, EPL, La Liga), Basketball (NBA, EuroLeague), Tenis (ATP/WTA), MMA. Piețe: 1x2, handicap, total, prop bets standard.' },
  { q: 'Am nevoie de KYC?', a: 'Da, înainte de prima retragere. Procesul e digital (Sumsub), durează 5 minute şi e obligatoriu pentru AML şi protecția jucătorului 18+.' },
  { q: 'Pot face pauză sau să reiau provocarea?', a: 'Nu există limită de timp pe challenge. Poți face pauză oricând, contul rămâne activ. Dacă pici provocarea, poți cumpăra reset cu reducere şi încerci din nou.' },
] as const;

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative border-b border-[color:var(--color-ink-800)] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-gold-400)]">Întrebări frecvente</p>
          <h2 id="faq-title" className="mt-3 font-bebas text-4xl tracking-tight text-white sm:text-5xl">Răspunsuri directe</h2>
        </div>
        <ul className="mt-12 space-y-3">
          {FAQ_ITEMS.map(({ q, a }) => (
            <li key={q}>
              <details className="group rounded-xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)] open:border-[color:var(--color-gold-400)]/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-[color:var(--color-mist-200)] [&::-webkit-details-marker]:hidden" style={{ minHeight: 48 }}>
                  <span>{q}</span>
                  <span aria-hidden="true" className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[color:var(--color-ink-600)] text-[color:var(--color-gold-400)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-[color:var(--color-mist-400)]">{a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
