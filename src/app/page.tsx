import Nav from '@/components/Nav';
import HeroSection from '@/components/sections/HeroSection';
import ServicesBento from '@/components/sections/ServicesBento';
import PourquoiSection from '@/components/sections/PourquoiSection';
import CumFunctioneazaSection from '@/components/sections/CumFunctioneazaSection';
import StatisticiSection from '@/components/sections/StatisticiSection';
import TestimonialeSection from '@/components/sections/TestimonialeSection';
import PlanuriSection from '@/components/sections/PlanuriSection';
import FAQSection from '@/components/sections/FAQSection';
import CtaFinalSection from '@/components/sections/CtaFinalSection';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <ServicesBento />
        <PourquoiSection />
        <CumFunctioneazaSection />
        <StatisticiSection />
        <TestimonialeSection />
        <PlanuriSection />
        <FAQSection />
        <CtaFinalSection />
      </main>
    </>
  );
}
