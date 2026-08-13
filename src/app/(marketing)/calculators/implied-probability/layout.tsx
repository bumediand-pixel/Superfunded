import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Probabilitate Implicita — Conversie cote in sanse',
  description: 'Transforma cote decimale, fractionare sau americane in procent de probabilitate. Identifica valoare in cote.',
  path: '/calculators/implied-probability',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
