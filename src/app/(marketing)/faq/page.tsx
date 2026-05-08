import FAQSection from '@/components/sections/FAQSection';
import CtaFinalSection from '@/components/sections/CtaFinalSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Întrebări frecvente',
  description: 'Răspunsuri detaliate despre challenge-uri, plăți, KYC, sporturi suportate și retrageri pe SuperFunded.',
};

const FAQ_ITEMS = [
  { q: 'Ce este SuperFunded?',
    a: 'SuperFunded este o platformă de evaluare a abilităților sportive. Pickerii primesc capital virtual de până la €50.000, iar dacă demonstrează profitabilitate constantă, păstrează până la 80% din profituri. Nu este o casă de pariuri.' },
  { q: 'Cum încep?',
    a: 'Alegi o mărime de cont, plătești taxa unică, primești instant credentialele de evaluare. În 30 zile trebuie să atingi target-ul de profit fără să depășești drawdown-ul.' },
  { q: 'Care e diferența dintre 1-Step și 2-Step?',
    a: '1-Step: target unic 40%, split 70%, taxă mai mare. 2-Step: faza 1 = 30%, faza 2 = 20%, split 80%, taxă mai mică. 2-Step e mai blând pentru pickerii consecvenți.' },
  { q: 'Ce sporturi pot pune pe pick?',
    a: 'Basketball (NBA, EuroLeague), Football (NFL, EPL, UCL, La Liga), Tenis (ATP/WTA), MMA/UFC. În curând: Rugby, Volleyball, Cricket, Hockey, Badminton.' },
  { q: 'Când și cum primesc plata?',
    a: 'Pe contul funded poți cere retrageri săptămânale. Procesăm în 24-48h prin transfer bancar (SEPA), Wise sau crypto (USDT/BTC).' },
  { q: 'Există limită de timp pe challenge?',
    a: 'Fiecare fază are 30 zile. Dacă nu atingi target-ul, poți cumpăra un reset cu reducere și încerci din nou.' },
  { q: 'Ce se întâmplă dacă pierd challenge-ul?',
    a: 'Pierzi doar taxa unică — niciodată bani personali. Poți cumpăra imediat un challenge nou sau un reset pe același cont.' },
  { q: 'Primesc taxa înapoi?',
    a: 'Da — pentru conturi €10K și mai mari, taxa este rambursată integral la prima retragere de pe contul funded.' },
  { q: 'Am nevoie de experiență anterioară în pariuri?',
    a: 'Trebuie să te simți confortabil să analizezi cote și să gestionezi un bankroll. Comunitatea Discord oferă calculatoare, threaduri de strategie și breakdown-uri săptămânale.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQPage() {
  return (
    <div className="pt-16">
      <FAQSection />
      <CtaFinalSection />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
