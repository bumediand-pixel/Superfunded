'use client';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { TrendingUp, Wallet, BarChart3, ShieldCheck } from 'lucide-react';

const MOCK_BETS = [
  { sport: 'Fotbal', event: 'Real Madrid vs Barcelona', market: 'Over 2.5', odds: 1.85, stake: 200, status: 'CASTIGAT', profit: 170 },
  { sport: 'Tenis', event: 'Djokovic vs Alcaraz', market: 'Set 1 - Djokovic', odds: 2.10, stake: 150, status: 'CASTIGAT', profit: 165 },
  { sport: 'Baschet', event: 'Lakers vs Warriors', market: 'Handicap -5.5', odds: 1.92, stake: 100, status: 'PIERDUT', profit: -100 },
  { sport: 'MMA', event: 'Jones vs Miocic', market: 'Jones by KO', odds: 2.50, stake: 80, status: 'CASTIGAT', profit: 120 },
  { sport: 'Rugby', event: 'All Blacks vs Springboks', market: 'Under 45.5', odds: 1.75, stake: 120, status: 'CASTIGAT', profit: 90 },
];

export default function PlatformScrollSection() {
  return (
    <div style={{ background: 'var(--black-0)' }}>
      <ContainerScroll
        titleComponent={
          <div className="text-center mb-4">
            <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: 'var(--red)' }}>
              Platforma
            </div>
            <h2 className="font-bodoni text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              Dashboard-ul tău
              <br />
              <span className="italic" style={{ color: 'var(--gold)' }}>de bettor finanțat</span>
            </h2>
          </div>
        }
      >
        {/* Mock dashboard inside the scroll card */}
        <div className="w-full h-full p-4 md:p-6 overflow-hidden" style={{ background: '#0a0a0a' }}>
          {/* Top stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Capital', val: '€5,340', icon: Wallet, color: 'var(--gold)' },
              { label: 'Profit Net', val: '+€840', icon: TrendingUp, color: '#22c55e' },
              { label: 'Win Rate', val: '68%', icon: BarChart3, color: 'var(--red)' },
              { label: 'KYC Status', val: 'Aprobat', icon: ShieldCheck, color: '#22c55e' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <s.icon className="w-3 h-3" style={{ color: s.color }} />
                  <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</span>
                </div>
                <div className="font-bodoni text-lg md:text-xl" style={{ color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Profit chart bars */}
          <div className="mb-5 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Evoluție Profit</span>
              <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Ultimele 14 zile</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 65, 35, 80, 55, 90, 45, 70, 85, 60, 95, 75, 88, 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all"
                  style={{ height: `${h}%`, background: h > 50 ? 'rgba(34,197,94,0.5)' : 'rgba(230,57,70,0.4)' }} />
              ))}
            </div>
          </div>

          {/* Bets table */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-5 px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {['Sport', 'Eveniment', 'Cotă', 'Miză', 'Profit'].map(h => (
                <span key={h} className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{h}</span>
              ))}
            </div>
            {MOCK_BETS.map((bet, i) => (
              <div key={i} className="grid grid-cols-5 px-3 py-2.5 items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="font-jost text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{bet.sport}</span>
                <span className="font-jost text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{bet.event}</span>
                <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{bet.odds}</span>
                <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>€{bet.stake}</span>
                <span className="font-bodoni text-sm" style={{ color: bet.profit > 0 ? '#22c55e' : 'var(--red)' }}>
                  {bet.profit > 0 ? '+' : ''}€{bet.profit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
