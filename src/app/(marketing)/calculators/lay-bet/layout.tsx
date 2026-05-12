import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Calculator Lay Bet — Liability si stake invers',
  description: 'Pentru pariuri pe exchange: calculezi liability si stake-ul lay echivalent pentru a inchide o pozitie.',
  path: '/calculators/lay-bet',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
