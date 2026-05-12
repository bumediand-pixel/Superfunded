import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Clasament Pickeri — Top traderi finanțați pe profit lunar',
  description: 'Top 50 pickeri TheSuperFunded sortați după profit. Capital alocat, ROI, plan. Pseudonime pentru confidențialitate. Actualizat în timp real.',
  path: '/clasament',
  keywords: ['clasament pickeri', 'top traderi pariuri', 'leaderboard funded'],
});

export default function ClasamentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
