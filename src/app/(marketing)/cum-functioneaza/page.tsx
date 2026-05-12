import CumFunctioneazaSection from '@/components/sections/CumFunctioneazaSection';
import PlanuriSection from '@/components/sections/PlanuriSection';
import CtaFinalSection from '@/components/sections/CtaFinalSection';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cum Funcționează — De la challenge la cont finanțat în 3 pași',
  description: 'Cumperi un challenge, atingi target-ul de profit, primești cont finanțat. Detaliat: reguli, drawdown, faze, retrageri. ONJN-safe, predicții simulate.',
  path: '/cum-functioneaza',
  keywords: ['cum funcționează prop firm', 'cont finanțat pariuri', 'evaluare predicții sportive'],
});

export default function CumFunctioneazaPage() {
  return (
    <div className="pt-16">
      <CumFunctioneazaSection />
      <PlanuriSection />
      <CtaFinalSection />
    </div>
  );
}
