import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import PayoutPreview from '@/components/landing/PayoutPreview';
import TrustSection from '@/components/landing/TrustSection';
import Pricing from '@/components/landing/Pricing';
import FAQ, { faqs } from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import LandingFooter from '@/components/landing/Footer';
import StickyMobileCTA from '@/components/landing/StickyMobileCTA';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://thesuperfunded.com';

export const metadata: Metadata = {
  title: 'Pariază cu banii noștri. Păstrează profitul.',
  description:
    'Platformă de betting prop firm pentru pariori funded. Treci de provocare, primești cont funded cu capitalul nostru, păstrezi 80% din profit, plată săptămânală.',
  alternates: { canonical: `${SITE}/` },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SuperFunded',
  url: SITE,
  logo: `${SITE}/logo.svg`,
  sameAs: [
    'https://discord.gg/superfunded',
    'https://twitter.com/superfunded',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@thesuperfunded.com',
      areaServed: 'RO',
      availableLanguage: ['Romanian', 'English'],
    },
  ],
};

// First 2 FAQs become the structured-data sample (per spec).
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.slice(0, 2).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function MarketingLandingPage() {
  return (
    <div
      // The (marketing)/layout.tsx already provides <main>; we wrap in <div>
      // to avoid nested <main> elements while still scoping the dark theme.
      className="landing-dark min-h-screen bg-[color:var(--color-ink-950)] text-[color:var(--color-mist-200)]"
    >
      <a
        href="#hero-title"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[color:var(--color-gold-400)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[color:var(--color-ink-950)]"
      >
        Sări la conținut
      </a>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero />
      <HowItWorks />
      <PayoutPreview />
      <TrustSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <LandingFooter />
      <StickyMobileCTA />
    </div>
  );
}
