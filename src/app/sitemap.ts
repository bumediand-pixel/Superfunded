import type { MetadataRoute } from 'next';
import { POSTS } from './(marketing)/blog/_data';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://superfunded.ro';

const ROUTES = [
  '/',
  '/planuri',
  '/cum-functioneaza',
  '/regulile',
  '/clasament',
  '/afiliere',
  '/faq',
  '/calculators',
  '/calculators/kelly',
  '/calculators/roi-simulator',
  '/calculators/implied-probability',
  '/calculators/accumulator',
  '/calculators/hold',
  '/calculators/win-loss',
  '/calculators/lay-bet',
  '/calculators/middle-bet',
  '/calculators/moneyline-converter',
  '/discord',
  '/contact',
  '/live-odds',
  '/blog',
  '/termeni',
  '/confidentialitate',
  '/rambursare',
  '/disclaimer',
  '/tari-suportate',
  '/retentie-date',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const base = ROUTES.map(path => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: (path === '/' || path.startsWith('/calculators') || path === '/blog'
      ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '/' ? 1.0 : path.startsWith('/calculators') ? 0.8 : 0.6,
  }));
  const posts = POSTS.map(p => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...base, ...posts];
}
