import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Program de Afiliere — Câștigă până la 20% comision recurent',
  description: 'Recomandă pickeri pe TheSuperFunded și câștigi 10-20% comision din fiecare taxă de evaluare. Cookie 30 zile, plăți lunare, fără plafon.',
  path: '/afiliere',
  keywords: ['afiliere pariuri', 'comision sportiv', 'program referral', 'câștig pasiv pariuri'],
});

export default function AfiliereLayout({ children }: { children: React.ReactNode }) {
  return children;
}
