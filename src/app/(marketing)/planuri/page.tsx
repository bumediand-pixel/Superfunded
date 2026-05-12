import PlanuriSection from '@/components/sections/PlanuriSection';
import CtaFinalSection from '@/components/sections/CtaFinalSection';
import { pageMetadata, productJsonLd, breadcrumbsJsonLd, JsonLd } from '@/lib/seo';
import { PLANURI_STRIPE, priceFor } from '@/lib/stripe';

export const metadata = pageMetadata({
  title: 'Planuri & Prețuri — Capital până la €50.000 cu o taxă unică',
  description: 'Cumperi o singură dată evaluarea, primești cont finanțat cu până la €50.000 bankroll. 70-80% din profit la tine. €17 → €1249 fee. 1-Pas sau 2-Pași.',
  path: '/planuri',
  keywords: [
    'prop firm pariuri',
    'cont finanțat sportiv',
    'funded betting Romania',
    'pariuri capital firmă',
    'evaluare pick-uri sportive',
    '€50000 capital pariuri',
  ],
});

const productSchemas = (Object.keys(PLANURI_STRIPE) as (keyof typeof PLANURI_STRIPE)[]).map(id => {
  const info = PLANURI_STRIPE[id];
  return productJsonLd({
    id,
    name: info.name,
    price: priceFor(id, '2step') / 100,
    capital: info.capital,
  });
});

const breadcrumbs = breadcrumbsJsonLd([
  { name: 'Acasă',   path: '/' },
  { name: 'Planuri', path: '/planuri' },
]);

export default function PlanuriPage() {
  return (
    <div className="pt-16">
      <JsonLd data={[...productSchemas, breadcrumbs]} />
      <PlanuriSection />
      <CtaFinalSection />
    </div>
  );
}
