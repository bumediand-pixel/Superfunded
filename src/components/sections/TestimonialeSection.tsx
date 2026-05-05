'use client';
import { Quote } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const TESTIMONIALE = [
  { quote: 'Am trecut evaluarea în 18 zile pariind exclusiv pe Premier League. Retragerea de €800 a ajuns în cont în 24 ore.', name: 'Andrei M.', role: 'Fotbal · Cluj-Napoca', roi: '+24%' },
  { quote: 'Ca analistă de tenis, platforma mi-a oferit capitalul de care aveam nevoie fără riscul personal. Recomand tuturor!', name: 'Cristina P.', role: 'Tenis · București', roi: '+31%' },
  { quote: 'Procesul de KYC a durat 2 zile, apoi am primit contul de €10.000. Suportul răspunde în minute.', name: 'Mihai D.', role: 'Baschet · Timișoara', roi: '+19%' },
  { quote: 'Cel mai bun ROI în luna UFC 300. Am retras €1.680 profit în prima săptămână ca bettor finanțat.', name: 'Radu T.', role: 'MMA · Iași', roi: '+42%' },
  { quote: 'Regulile sunt clare și corecte. Nu există surprize neplăcute. Exact ce căutam de ani de zile.', name: 'Elena V.', role: 'Fotbal · Brașov', roi: '+28%' },
  { quote: 'Am luat planul Elite și a meritat fiecare euro. Capitalul de €50K mi-a permis să aplic strategii noi.', name: 'Bogdan L.', role: 'Rugby · Constanța', roi: '+35%' },
  { quote: 'Platforma m-a ajutat să îmi structurez strategia. Acum am disciplina unui profesionist.', name: 'Ioana R.', role: 'Tenis · Cluj-Napoca', roi: '+22%' },
  { quote: 'Prima retragere a inclus și taxa de evaluare rambursată. Exact cum au promis — fără surprize.', name: 'Dan S.', role: 'Fotbal · București', roi: '+27%' },
];

type TestimonialCardProps = typeof TESTIMONIALE[0];

function TestimonialCard({ quote, name, role, roi }: TestimonialCardProps) {
  return (
    <div className="liquid-glass rounded-2xl p-7 w-[340px] md:w-[400px] shrink-0 flex flex-col gap-5">
      <Quote className="size-5 text-[hsl(var(--red)/0.65)]" />
      <p className="font-body text-[hsla(var(--cream)/0.85)] italic leading-relaxed text-[15px] flex-1">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-[hsl(var(--red)/0.55)] to-[hsl(var(--terra)/0.55)] shrink-0" />
          <div>
            <div className="font-body font-medium text-sm text-[hsl(var(--cream))]">{name}</div>
            <div className="font-body text-xs text-[hsla(var(--cream)/0.50)] uppercase tracking-wide">{role}</div>
          </div>
        </div>
        <span className="font-display italic text-xl text-[hsl(var(--green,120,60%,40%))]" style={{ color: '#22c55e' }}>
          {roi}
        </span>
      </div>
    </div>
  );
}

const ROW_A = TESTIMONIALE;
const ROW_B = [...TESTIMONIALE.slice(4), ...TESTIMONIALE.slice(0, 4)];

export default function TestimonialeSection() {
  return (
    <section id="testimoniale" className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] mb-16 text-center">
        <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
          Testimoniale
        </span>
        <BlurText
          text="Ei vorbesc mai bine decât noi."
          as="h2"
          className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[22ch] mx-auto"
          delay={0.08}
        />
      </div>

      {/* Marquee rows */}
      <div
        className="flex flex-col gap-5 overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
      >
        {/* Row 1 — left */}
        <div
          className="flex gap-5 w-max group"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[...ROW_A, ...ROW_A].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>

        {/* Row 2 — right */}
        <div
          className="flex gap-5 w-max group"
          style={{ animation: 'marquee-rev 32s linear infinite' }}
        >
          {[...ROW_B, ...ROW_B].map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .group { animation-play-state: paused !important; }
        }
        .group:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
