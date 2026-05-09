import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import PayoutPreview from '@/components/landing/PayoutPreview';
import TrustSection from '@/components/landing/TrustSection';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';
import StickyMobileCTA from '@/components/landing/StickyMobileCTA';

export const metadata: Metadata = {
  title: 'SuperFunded — Pariază cu banii noștri. Păstrează profitul.',
  description:
    'Platformă prop firm pentru pariori. Treci provocarea, primești cont funded și păstrezi până la 80% din profit, plătit săptămânal.',
  openGraph: {
    title: 'SuperFunded — Cont funded pentru pariori',
    description:
      'Treci provocarea, primești cont funded și păstrezi până la 80% din profit.',
    locale: 'ro_RO',
    type: 'website',
  },
  alternates: { canonical: '/landing' },
};

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SuperFunded',
  url: 'https://superfunded.ro',
  description:
    'Platformă prop firm pentru pariori sportivi din România. Cont funded până la 80% profit split.',
  sameAs: [
    'https://discord.gg/superfunded',
    'https://twitter.com/superfunded',
    'https://instagram.com/superfunded',
  ],
};

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'E legal SuperFunded în România?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SuperFunded este o platformă de simulare/skill-based, nu un operator de jocuri de noroc. Detalii pe pagina de Termeni și Condiții. Verifică întotdeauna disclaimer-ul actual.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cât durează verificarea KYC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Verificarea KYC prin Sumsub durează între 5 minute și 24 de ore în funcție de calitatea documentelor și volumul de cereri.',
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[color:var(--color-gold-500)] focus:px-4 focus:py-2 focus:text-[color:var(--color-ink-950)]"
      >
        Sari la conținut
      </a>
      <main
        id="main"
        className="landing-dark min-h-screen bg-[color:var(--color-ink-950)] text-[color:var(--color-mist-200)]"
      >
        <Hero />
        <HowItWorks />
        <PayoutPreview />
        <TrustSection />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
        <StickyMobileCTA />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
    </>
  );
}
