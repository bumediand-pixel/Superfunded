import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Calculator Hold (Vig) — Marja casei de pariuri',
  description: 'Calculezi cata vigorish ia bookmaker-ul dintr-o piata cu 2 sau 3 rezultate.',
  path: '/calculators/hold',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
