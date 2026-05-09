import Image from 'next/image';
import { Check } from 'lucide-react';

const differentiators = [
  'Capital propriu — pariezi cu banii noștri, nu cu ai tăi',
  'Fără risc personal pe bankroll, doar taxa de evaluare',
  'Plată săptămânală, fără cozi de retragere',
  'Suport în limba română, oameni reali în spate',
] as const;

type Testimonial = {
  name: string;
  city: string;
  payout: string;
  quote: string;
  avatar: string;
};

// REPLACE: Swap with real testimonials. Photos must be at /public/testimoniale/*.webp,
// 80x80 minimum, optimized < 8KB each.
const testimonials: readonly Testimonial[] = [
  {
    name: 'REPLACE_NAME_1',
    city: 'București',
    payout: 'REPLACE_RON',
    quote:
      'Am trecut de provocare în 12 zile. Primul payout a venit la fix săptămâna următoare.',
    avatar: '/testimoniale/user-1.webp',
  },
  {
    name: 'REPLACE_NAME_2',
    city: 'Cluj-Napoca',
    payout: 'REPLACE_RON',
    quote:
      'Reguli clare, fără capcane la retragere. Singura platformă pe care am avut încredere.',
    avatar: '/testimoniale/user-2.webp',
  },
  {
    name: 'REPLACE_NAME_3',
    city: 'Timișoara',
    payout: 'REPLACE_RON',
    quote:
      'Suportul în RO face diferența. Mi-au explicat fiecare regulă înainte să încep.',
    avatar: '/testimoniale/user-3.webp',
  },
];

// REPLACE: confirm partner list with biz dev. Logos at /public/logos/*.svg
const partners = [
  { name: 'REPLACE_PARTNER_1', src: '/logos/partner-1.svg' },
  { name: 'REPLACE_PARTNER_2', src: '/logos/partner-2.svg' },
  { name: 'REPLACE_PARTNER_3', src: '/logos/partner-3.svg' },
  { name: 'REPLACE_PARTNER_4', src: '/logos/partner-4.svg' },
] as const;

export default function TrustSection() {
  return (
    <section
      aria-labelledby="trust-title"
      className="border-b border-[color:var(--color-ink-800)] px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
            De ce SuperFunded
          </p>
          <h2
            id="trust-title"
            className="font-bebas text-4xl leading-tight text-white sm:text-5xl"
          >
            Construit pentru pariori serioși
          </h2>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <ul className="space-y-3">
            {differentiators.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[color:var(--color-ink-800)] bg-[color:var(--color-ink-900)]/60 p-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-gold-400)] text-[color:var(--color-ink-950)]"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-[color:var(--color-mist-200)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <ul className="space-y-4">
            {testimonials.map((t) => (
              <li key={t.name} className="landing-card p-5">
                <blockquote className="text-sm leading-relaxed text-[color:var(--color-mist-200)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={`Avatar ${t.name}`}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[color:var(--color-ink-700)]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-[color:var(--color-mist-500)]">
                      {t.city} · payout {t.payout}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[color:var(--color-mist-500)]">
              Parteneri & integrări
            </p>
            <ul className="grid grid-cols-2 gap-3">
              {partners.map((p) => (
                <li
                  key={p.name}
                  className="flex h-20 items-center justify-center rounded-xl border border-[color:var(--color-ink-800)] bg-[color:var(--color-ink-900)]/40 p-4"
                >
                  {/* REPLACE: real SVG logos. */}
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-mist-400)]">
                    {p.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
