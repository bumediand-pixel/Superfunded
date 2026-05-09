import Image from 'next/image';
import { Banknote, ShieldCheck, Calendar, MessageSquareHeart } from 'lucide-react';

const DIFFERENTIATORS = [
  {
    icon: Banknote,
    title: 'Capital propriu',
    body: 'Pariezi cu bankroll-ul nostru, nu cu banii tăi.',
  },
  {
    icon: ShieldCheck,
    title: 'Fără risc personal',
    body: 'În cel mai rău caz, pierzi doar taxa unică a planului.',
  },
  {
    icon: Calendar,
    title: 'Plată săptămânală',
    body: 'Retragerile sunt procesate în 24-48h, în fiecare săptămână.',
  },
  {
    icon: MessageSquareHeart,
    title: 'Suport în română',
    body: 'Echipă locală, comunitate Discord activă, răspuns rapid.',
  },
] as const;

// REPLACE: înlocuiește cu testimoniale reale (foto 80x80, oraș, sumă plătită)
const TESTIMONIALS = [
  {
    name: 'Andrei P.', // REPLACE: TESTIMONIAL_1_NAME
    city: 'București', // REPLACE: TESTIMONIAL_1_CITY
    payout: '€3.420', // REPLACE: TESTIMONIAL_1_PAYOUT
    quote:
      'Am trecut faza 2 în 11 zile. Prima retragere a venit luni dimineața, fix cum scrie la reguli.',
    photo: '/testimonials/placeholder-1.webp', // REPLACE
  },
  {
    name: 'Maria T.', // REPLACE: TESTIMONIAL_2_NAME
    city: 'Cluj', // REPLACE: TESTIMONIAL_2_CITY
    payout: '€1.875', // REPLACE: TESTIMONIAL_2_PAYOUT
    quote:
      'Mi-a plăcut că nu trebuie să-mi rești salariul. Pierd taxa, pic provocarea, încerc din nou.',
    photo: '/testimonials/placeholder-2.webp', // REPLACE
  },
  {
    name: 'Vlad C.', // REPLACE: TESTIMONIAL_3_NAME
    city: 'Iași', // REPLACE: TESTIMONIAL_3_CITY
    payout: '€5.100', // REPLACE: TESTIMONIAL_3_PAYOUT
    quote:
      'Split de 80% e rar pe piață. Profitabilitatea pe NBA + tenis a făcut diferența pentru mine.',
    photo: '/testimonials/placeholder-3.webp', // REPLACE
  },
] as const;

// REPLACE: logo-uri partener (exchange-uri, plăți, comunități etc.)
const PARTNERS = ['Stripe', 'Wise', 'Discord', 'Trustpilot'];

export default function TrustSection() {
  return (
    <section
      aria-labelledby="trust-title"
      className="relative border-b border-[color:var(--color-ink-800)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-gold-400)]">
            De ce SuperFunded
          </p>
          <h2
            id="trust-title"
            className="mt-3 font-bebas text-4xl tracking-tight text-white sm:text-5xl"
          >
            Construit pentru pariorul român serios
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          {/* Differentiators */}
          <ul className="space-y-5" aria-label="Avantaje cheie">
            {DIFFERENTIATORS.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex items-start gap-4 rounded-xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/60 p-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-ink-800)] text-[color:var(--color-gold-400)]"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-[color:var(--color-mist-200)]">{title}</p>
                  <p className="mt-1 text-sm text-[color:var(--color-mist-400)]">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Testimonials */}
          <ul className="space-y-5" aria-label="Recenzii utilizatori">
            {TESTIMONIALS.map((t) => (
              <li
                key={t.name}
                className="rounded-xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)] p-5"
              >
                <blockquote className="text-sm leading-relaxed text-[color:var(--color-mist-200)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Image
                    src={t.photo}
                    alt={`Fotografie ${t.name} din ${t.city}`}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[color:var(--color-mist-200)]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[color:var(--color-mist-500)]">{t.city}</p>
                  </div>
                  <p className="font-mono text-sm font-bold text-[color:var(--color-volt-400)]">
                    {t.payout}
                  </p>
                </figcaption>
              </li>
            ))}
          </ul>

          {/* Partner logos */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mist-500)]">
              Parteneri și integrări
            </p>
            <ul
              className="mt-4 grid grid-cols-2 gap-3"
              aria-label="Parteneri tehnologici"
            >
              {PARTNERS.map((p) => (
                <li
                  key={p}
                  className="flex h-20 items-center justify-center rounded-lg border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)] font-mono text-sm text-[color:var(--color-mist-400)]"
                >
                  {/* REPLACE: înlocuiește textul cu SVG-ul oficial al partenerului */}
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
