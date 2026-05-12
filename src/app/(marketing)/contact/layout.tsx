import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact — Suport rapid pentru pickeri funded',
  description: 'Contactează echipa TheSuperFunded. Suport pe email răspuns în 2-6h, Discord live 24/7, parteneriate, afiliere, presă. Trei canale.',
  path: '/contact',
  keywords: ['contact superfunded', 'suport pariuri prop firm', 'discord suport'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
