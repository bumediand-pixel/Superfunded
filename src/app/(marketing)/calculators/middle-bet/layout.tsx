import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Calculator Middle Bet — Profit din diferenta de linie',
  description: 'Cazuri rare cand doi bookmakeri posteaza linii diferite si poti paria ambele pentru profit garantat.',
  path: '/calculators/middle-bet',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
