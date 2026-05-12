import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Probabilitate Streak Castig/Pierdere — Variance bankroll',
  description: 'Estimezi cat de probabil e un streak de N wins sau N losses la o anumita rata de castig.',
  path: '/calculators/win-loss',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
