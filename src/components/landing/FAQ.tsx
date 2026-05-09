/**
 * FAQ — uses native <details>/<summary> for keyboard a11y and zero JS.
 * 8 RO questions targeting the most common objections from prospects.
 */

const faqs = [
  {
    q: 'Este SuperFunded o casă de pariuri?',
    a: 'Nu. SuperFunded este o platformă de tip prop firm pentru pariori. Tu treci de o evaluare cu reguli clare, iar noi îți punem la dispoziție capital propriu pentru a paria. Nu acceptăm pariuri direct și nu deținem licență de operator de jocuri de noroc.',
  },
  {
    q: 'Cum câștig bani exact?',
    a: 'Plătești o taxă unică pentru un plan de evaluare. Treci de provocare (atinge target fără să depășești drawdown). Primești un cont funded cu capitalul nostru. Profitul se împarte 80% pentru tine, 20% pentru SuperFunded. Plata se face săptămânal.',
  },
  {
    q: 'Ce se întâmplă dacă pierd?',
    a: 'În faza de evaluare riști doar taxa plătită. Pe contul funded, dacă atingi drawdown-ul maxim, contul se închide — dar tu nu pierzi bani personali peste taxa inițială. Capitalul de pariere este al nostru.',
  },
  {
    q: 'Pot folosi orice strategie de pariere?',
    a: 'Da, în limita regulilor publicate (fără arbitraj cu alte platforme, fără bonus hunting, fără pariuri pe meciuri unde ai conflict de interese). Detalii complete în pagina „Regulile&rdquo;.',
  },
  {
    q: 'Cât de repede primesc plata?',
    a: 'Plățile se procesează săptămânal. După cererea de retragere, banii ajung în 24–48h în contul tău bancar sau pe card. Nu există perioade de așteptare ascunse.',
  },
  {
    q: 'Există costuri ascunse sau abonamente?',
    a: 'Nu. Plătești o singură dată taxa pentru plan. Nu există abonamente lunare, taxe de retragere, comisioane pe profit peste split-ul de 20% sau alte costuri.',
  },
  {
    q: 'Este legal în România?',
    a: 'Da. SuperFunded oferă servicii de evaluare și management de capital pentru pariori, nu servicii de pariuri. Orice activitate de pariere se face pe operatori licențiați ONJN. Vezi pagina „Disclaimer&rdquo; pentru detalii. /* REPLACE: confirmare finală cu echipa juridică */',
  },
  {
    q: 'Pot avea mai multe conturi funded simultan?',
    a: 'Da, după ce treci de prima provocare. Avem un program de scaling care îți crește capitalul pe baza performanței constante. Detalii pe pagina „Cum funcționează&rdquo;.',
  },
] as const;

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-b border-[color:var(--color-ink-800)] px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
            Întrebări frecvente
          </p>
          <h2
            id="faq-title"
            className="font-bebas text-4xl leading-tight text-white sm:text-5xl"
          >
            Răspunsuri clare la obiecții reale
          </h2>
        </header>

        <ul className="divide-y divide-[color:var(--color-ink-800)] overflow-hidden rounded-2xl border border-[color:var(--color-ink-800)] bg-[color:var(--color-ink-900)]/60">
          {faqs.map((f) => (
            <li key={f.q}>
              <details className="group">
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-ink-800)]/60">
                  <span>{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[color:var(--color-ink-700)] text-[color:var(--color-mist-400)] transition-transform group-open:rotate-45"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-[color:var(--color-mist-400)]">
                  {f.a}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { faqs };
