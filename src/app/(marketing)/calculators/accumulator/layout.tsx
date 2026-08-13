import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Calculator Accumulator — Cota combinata si plata',
  description: 'Adaugi N pick-uri, vezi cota totala combinata si plata potentiala pentru o miza.',
  path: '/calculators/accumulator',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
