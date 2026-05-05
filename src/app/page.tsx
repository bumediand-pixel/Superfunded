import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import StatisticiSection from '@/components/sections/StatisticiSection';
import CumFunctioneazaSection from '@/components/sections/CumFunctioneazaSection';
import SportsCinematicSection from '@/components/sections/SportsCinematicSection';
import PlanuriSection from '@/components/sections/PlanuriSection';
import LeaderboardSection from '@/components/sections/LeaderboardSection';
import TestimonialeSection from '@/components/sections/TestimonialeSection';
import FAQSection from '@/components/sections/FAQSection';
import CtaFinalSection from '@/components/sections/CtaFinalSection';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <MarqueeSection />
        <StatisticiSection />
        <CumFunctioneazaSection />
        <SportsCinematicSection />
        <PlanuriSection />
        <LeaderboardSection />
        <TestimonialeSection />
        <FAQSection />
        <CtaFinalSection />
      </main>
      <Footer />
    </>
  );
}
