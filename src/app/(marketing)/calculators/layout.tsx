import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: '9 Calculatoare Pariuri — Kelly, ROI, Implied, Accumulator, Hold & altele',
  description: 'Calculatoare gratuite pentru pickeri: Kelly Criterion, ROI Simulator, Probabilitate Implicită, Accumulator, Hold (vig), Win/Loss Streak, Lay Bet, Middle Bet, Moneyline Converter. Fără înregistrare.',
  path: '/calculators',
  keywords: [
    'calculator Kelly',
    'calculator ROI pariuri',
    'probabilitate implicita',
    'calculator accumulator',
    'moneyline converter',
    'hold vig bookmaker',
  ],
});

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
