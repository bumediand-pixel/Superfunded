import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Calculator ROI Pariuri — Simulator profit lunar si anual',
  description: 'Stabilesti bankroll, win rate, cota medie. Vezi proiectia ROI lunar si anual cu varianta realista.',
  path: '/calculators/roi-simulator',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
