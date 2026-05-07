import type { MetadataRoute } from 'next';

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
  '/termeni',
  '/confidentialitate',
  '/rambursare',
  '/disclaimer',
  '/tari-suportate',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(path => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: path === '/' || path.startsWith('/calculators') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1.0 : path.startsWith('/calculators') ? 0.8 : 0.6,
  }));
}
