'use client';
import { Quote } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const TESTIMONIALE = [
  { name: 'Andrei M.',   city: 'Cluj-Napoca', sport: 'Fotbal',  roi: '+24%', text: 'Am trecut evaluarea in 18 zile pariind exclusiv pe Premier League. Retragerea de 800 EUR a ajuns in cont in 24 ore.' },
  { name: 'Ioana P.',    city: 'Bucuresti',   sport: 'Tenis',   roi: '+31%', text: 'La inceput eram sceptica. Acum sunt la al 3-lea ciclu si castigurile sunt reale.' },
  { name: 'Mihai C.',    city: 'Timisoara',   sport: 'Baschet', roi: '+19%', text: 'Dashboard-ul e excelent. Vad instant win rate-ul si ROI-ul pe fiecare sport.' },
  { name: 'Radu T.',     city: 'Iasi',        sport: 'MMA',     roi: '+42%', text: 'Split de 80%? Nu am gasit alta platforma care sa ofere asta. Prima retragere a inclus si taxa rambursata.' },
  { name: 'Cristina F.', city: 'Brasov',      sport: 'Fotbal',  roi: '+28%', text: 'Suportul e rapid. Am primit raspuns in mai putin de 2 ore pe Discord.' },
  { name: 'Alex D.',     city: 'Constanta',   sport: 'Rugby',   roi: '+36%', text: 'Plan 2-Step fara limita de timp. Nu mai simt presiunea unui deadline.' },
  { name: 'Bogdan N.',   city: 'Oradea',      sport: 'Tenis',   roi: '+21%', text: 'Am inceput cu 1.000 EUR si in 2 luni am primit contul de 5.000 EUR. Scalarea e reala.' },
  { name: 'Simona V.',   city: 'Galati',      sport: 'Fotbal',  roi: '+45%', text: 'SuperFunded e cea mai serioasa platforma din RO. Platesc impozit pe castig.' },
];

function Card({ name, city, sport, roi, text }: typeof TESTIMONIALE[0]) {
  const initials = name.split(' ').map(p => p[0]).join('');
  return (
    <div className="liquid-glass rounded-2xl p-6 flex-shrink-0 w-[300px] md:w-[340px] flex flex-col gap-4">
      <Quote className="size-5 text-[hsl(var(--red)/0.60)]" />
      <p className="font-body text-sm text-[hsla(var(--cream)/0.80)] leading-relaxed italic flex-1">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-[hsla(var(--cream)/0.08)]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[hsl(var(--cream))] flex-shrink-0"
          style={{ background: `hsl(${(name.charCodeAt(0) * 13) % 360} 50% 28%)` }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[hsl(var(--cream))] truncate">{name}</p>
          <p className="text-[10px] text-[hsla(var(--cream)/0.50)] truncate">{city} &middot; {sport}</p>
        </div>
        <span className="text-xs font-bold text-[hsl(120,60%,55%)] px-2 py-0.5 rounded-full flex-shrink-0 bg-[hsla(120,60%,40%/0.15)]">
          {roi}
        </span>
      </div>
    </div>
  );
}

function Row({ items, dir }: { items: typeof TESTIMONIALE; dir: 'fwd' | 'rev' }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden group">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: dir === 'fwd'
            ? 'marquee 28s linear infinite'
            : 'marquee-rev 32s linear infinite',
        }}
      >
        {doubled.map((t, i) => (
          <Card key={i} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialeSection() {
  const half = Math.ceil(TESTIMONIALE.length / 2);
  const rowA = TESTIMONIALE.slice(0, half);
  const rowB = TESTIMONIALE.slice(half);

  return (
    <section
      id="testimoniale"
      className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))] overflow-hidden"
    >
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] mb-14 md:mb-20">
        <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
          Ce spun bettorii nostri
        </span>
        <BlurText
          text="Povesti reale, castiguri reale."
          as="h2"
          className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[18ch]"
          delay={0.08}
        />
      </div>

      <div className="absolute top-0 bottom-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, hsl(var(--ink)), transparent)' }} />
      <div className="absolute top-0 bottom-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, hsl(var(--ink)), transparent)' }} />

      <div className="flex flex-col gap-5 px-4">
        <Row items={rowA} dir="fwd" />
        <Row items={rowB} dir="rev" />
      </div>

      <style>{`.group:hover > div { animation-play-state: paused; }`}</style>
    </section>
  );
}
