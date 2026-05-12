import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Convertor Moneyline — American, Decimal, Fractionar',
  description: 'Conversie instantanee intre cote americane (+150 / -200), decimale (2.50) si fractionare (3/2).',
  path: '/calculators/moneyline-converter',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
