import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Calculator Kelly Criterion — Stake optim per pick',
  description: 'Calculezi stake-ul optim conform formulei Kelly: edge / (cota-1). Reduce variance, maximizeaza cresterea bankroll-ului pe termen lung.',
  path: '/calculators/kelly',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
