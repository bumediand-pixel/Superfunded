import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PayoutTicker from '@/components/PayoutTicker';
import TrustBadges from '@/components/TrustBadges';
import ReviewsWidget from '@/components/ReviewsWidget';
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

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://superfunded.ro';

const productJsonLd = [
  { id: 'STARTER_500',    name: 'Starter €500',     price: 19,  capital: 500   },
  { id: 'BASIC_1000',     name: 'Basic €1.000',     price: 35,  capital: 1000  },
  { id: 'STANDARD_5000',  name: 'Standard €5.000',  price: 74,  capital: 5000  },
  { id: 'ADVANCED_10000', name: 'Advanced €10.000', price: 139, capital: 10000 },
  { id: 'PRO_25000',      name: 'Pro €25.000',      price: 269, capital: 25000 },
  { id: 'ELITE_50000',    name: 'Elite €50.000',    price: 449, capital: 50000 },
].map(p => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `SuperFunded — ${p.name}`,
  description: `Cont funded sportiv cu €${p.capital.toLocaleString('ro-RO')} bankroll. 2-Step challenge cu 30%+20% target. 80% profit split.`,
  brand: { '@type': 'Brand', name: 'SuperFunded' },
  offers: {
    '@type': 'Offer',
    url: `${SITE}/planuri`,
    priceCurrency: 'EUR',
    price: p.price,
    availability: 'https://schema.org/InStock',
  },
}));

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
        <TrustBadges />
        <LeaderboardSection />
        <ReviewsWidget />
        <TestimonialeSection />
        <FAQSection />
        <CtaFinalSection />
      </main>
      <Footer />
      <PayoutTicker />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    </>
  );
}
