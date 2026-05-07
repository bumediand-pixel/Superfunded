import Link from 'next/link';
import {
  Calculator, TrendingUp, Percent, Layers, ArrowLeftRight, Trophy, Repeat, Crosshair, ArrowRightLeft,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculatoare profesionale de pariere | SuperFunded',
  description: 'Kelly Criterion, ROI, Implied Probability, Acca, Hold, Win/Loss, Lay, Middle, Moneyline — 9 calculatoare gratuite pentru pariori funded.',
};

const CALCS = [
  { slug: 'kelly',              icon: TrendingUp,    title: 'Kelly Criterion',        desc: 'Optimizează stake-ul în funcție de edge și bankroll.' },
  { slug: 'roi-simulator',      icon: Trophy,        title: 'ROI Simulator',          desc: 'Proiectează câștigurile lunare pe contul funded.' },
  { slug: 'implied-probability',icon: Percent,       title: 'Implied Probability',    desc: 'Convertește cota în probabilitate reală.' },
  { slug: 'accumulator',        icon: Layers,        title: 'Accumulator (Acca)',     desc: 'Calculează cota și payout-ul unui pariu combinat.' },
  { slug: 'hold',               icon: Calculator,    title: 'Hold / Vig',             desc: 'Determină marja casei de pariuri pentru o piață.' },
  { slug: 'win-loss',           icon: Repeat,        title: 'Win / Loss Streak',      desc: 'Probabilitatea unei serii câștigătoare sau pierdute.' },
  { slug: 'lay-bet',            icon: ArrowLeftRight,title: 'Lay Bet',                desc: 'Stake pentru matched betting / arbitraj.' },
  { slug: 'middle-bet',         icon: Crosshair,     title: 'Middle Bet',             desc: 'Identifică oportunități de "middle" între linii.' },
  { slug: 'moneyline-converter',icon: ArrowRightLeft,title: 'Moneyline Converter',    desc: 'American ↔ Decimal ↔ Fracțional ↔ Implicit %.' },
];

export default function CalculatorsIndex() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Tools
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            9 Calculatoare profesionale
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Tot ce ai nevoie pentru picks disciplinate: bankroll management, conversie cote, probabilități, hold și matched betting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALCS.map(c => {
            const Icon = c.icon;
            return (
              <Link key={c.slug} href={`/calculators/${c.slug}`}
                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: 'white', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors"
                  style={{ background: '#fff1f2' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--red)' }} />
                </div>
                <h3 className="text-lg font-extrabold mb-1.5 group-hover:text-[var(--red)] transition-colors"
                  style={{ color: 'var(--text)' }}>
                  {c.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{c.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
