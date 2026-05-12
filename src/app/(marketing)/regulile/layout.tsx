import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Regulile Challenge-ului — Target, Drawdown, Faze, Retrageri',
  description: 'Toate regulile evaluării TheSuperFunded explicate clar: 30%+20% target 2-Step, 40% target 1-Step, 8% drawdown max, 5% daily loss, retrageri săptămânale.',
  path: '/regulile',
  keywords: ['reguli challenge funded', 'drawdown prop firm', 'profit target', 'evaluare pariuri sportive'],
});

export default function RegulileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
