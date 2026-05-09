import type { Metadata } from 'next';
import Link from 'next/link';
import {
  HeartPulse,
  AlertTriangle,
  ShieldCheck,
  Wallet,
  Phone,
  Globe,
  LifeBuoy,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Joc Responsabil — SuperFunded',
  description:
    'Resurse pentru jocul responsabil: semnele unei probleme, opțiuni de auto-excludere, limite de depunere și pierdere, și liniile de suport oficiale (Joc Responsabil 0800 800 099, jocresponsabil.ro, gamblingtherapy.org).',
};

export default function JocResponsabilPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Draft banner — required on all legal pages until lawyer review */}
        <DraftBanner />

        <div className="mb-10">
          <span
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}
          >
            Joc Responsabil
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            Joacă responsabil. Cere ajutor la timp.
          </h1>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Pariurile sportive trebuie să rămână o formă de divertisment, nu o sursă de venit
            sau o cale de evadare. Pe această pagină găsești semnalele de avertizare,
            instrumentele de auto-excludere și liniile gratuite de suport din România și UE.
          </p>
        </div>

        <div className="space-y-6">

          <Card icon={HeartPulse} title="Ce este jocul responsabil">
            <p>
              Jocul responsabil înseamnă să decizi conștient cât timp și câți bani aloci
              activităților de pariere — și să te oprești atunci când depășești aceste
              limite, indiferent de rezultat. Pe scurt:
            </p>
            <ul>
              <li>Pariezi doar cu bani pe care îți permiți să îi pierzi integral.</li>
              <li>Nu pariezi pentru a recupera pierderi anterioare („chasing losses”).</li>
              <li>Stabilești limite zilnice / săptămânale / lunare ÎNAINTE de a pune o miză.</li>
              <li>Nu pariezi atunci când ești obosit, supărat, sub influență sau stresat financiar.</li>
              <li>Tratezi pariurile ca pe un cost de divertisment, nu ca pe o investiție.</li>
            </ul>
          </Card>

          <Card icon={AlertTriangle} title="Semne de problemă">
            <p>
              Dacă te regăsești în trei sau mai multe dintre afirmațiile de mai jos, este
              recomandat să iei o pauză și să discuți cu un specialist:
            </p>
            <ul>
              <li>Pariez sume tot mai mari pentru a obține aceeași „adrenalină”.</li>
              <li>Mă gândesc constant la următorul pariu, chiar și la muncă sau la școală.</li>
              <li>Mint familia, partenerul sau prietenii despre cât pariez.</li>
              <li>Pierd cantități semnificative de timp sau bani și încerc să recuperez.</li>
              <li>Mă cert cu cei apropiați din cauza pariurilor.</li>
              <li>Am împrumutat bani sau am vândut bunuri pentru a putea paria.</li>
              <li>Am încercat să mă opresc și nu am reușit.</li>
              <li>Pariez pentru a scăpa de stres, anxietate sau depresie.</li>
            </ul>
            <p>
              Aceste semnale corespund criteriilor DSM-5 pentru tulburarea jocului
              patologic („gambling disorder”). Identificarea timpurie crește semnificativ
              șansele de recuperare.
            </p>
          </Card>

          <Card icon={ShieldCheck} title="Auto-excludere">
            <p>
              Auto-excluderea îți permite să blochezi voluntar accesul la platformele de
              pariuri pe o perioadă determinată. Opțiuni disponibile:
            </p>
            <ul>
              <li>
                <strong>Auto-excludere SuperFunded</strong> — scrie la
                {' '}
                <a href="mailto:support@thesuperfunded.com" className="font-bold" style={{ color: 'var(--red)' }}>
                  support@thesuperfunded.com
                </a>
                {' '}
                cu subiectul „AUTO-EXCLUDERE” și menționează durata dorită (minim 6 luni,
                nelimitat la cerere). Procesăm cererea în maxim 24h și blocăm contul fără
                posibilitate de re-deschidere până la expirarea perioadei.
              </li>
              <li>
                <strong>Registrul ONJN al persoanelor auto-excluse</strong> — la nivel
                național, prin Oficiul Național pentru Jocuri de Noroc. Înscrierea
                blochează accesul la toți operatorii licențiați din România.
              </li>
              <li>
                <strong>Auto-excludere prin browser / device</strong> — instalează un filtru
                gen <em>Gamban</em>, <em>BetBlocker</em> sau <em>Net Nanny</em> care blochează
                site-urile de pariuri pe toate dispozitivele tale.
              </li>
            </ul>
          </Card>

          <Card icon={Wallet} title="Limite de depunere și pierdere">
            <p>
              Stabilirea de limite ferme este cea mai eficientă măsură preventivă. Pe
              SuperFunded poți solicita oricând limite personalizate prin support:
            </p>
            <ul>
              <li>
                <strong>Limită de depunere</strong> — suma maximă pe care poți să o adaugi
                în cont pe zi / săptămână / lună.
              </li>
              <li>
                <strong>Limită de pierdere</strong> — suma maximă pe care o poți pierde
                într-o sesiune. Când este atinsă, contul intră automat în pauză.
              </li>
              <li>
                <strong>Limită de timp</strong> — durata maximă pe care o poți petrece
                conectat în platformă pe zi.
              </li>
              <li>
                <strong>Reality check</strong> — notificare la fiecare 30 / 60 / 90 minute
                cu suma totală pariată și timpul petrecut.
              </li>
            </ul>
            <p>
              Reducerile de limite se aplică imediat. Mărirea unei limite intră în vigoare
              după o perioadă de 7 zile, ca măsură de protecție („cool-off”).
            </p>
          </Card>

          <Card icon={LifeBuoy} title="Resurse și linii gratuite de suport">
            <p>
              Dacă tu sau cineva apropiat are o problemă cu jocurile de noroc, ajutorul
              specializat este gratuit, anonim și disponibil 24/7:
            </p>
            <ul>
              <li>
                <strong>Joc Responsabil (România)</strong> — TelVerde gratuit{' '}
                <a href="tel:0800800099" className="font-bold" style={{ color: 'var(--red)' }}>
                  0800 800 099
                </a>{' '}
                · disponibil non-stop, în limba română.
              </li>
              <li>
                <strong>jocresponsabil.ro</strong> — informații, chat live cu psiholog
                specializat și auto-test de risc.{' '}
                <a
                  href="https://jocresponsabil.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                  style={{ color: 'var(--red)' }}
                >
                  jocresponsabil.ro
                </a>
              </li>
              <li>
                <strong>Gambling Therapy (internațional, multilingv)</strong> — chat,
                forum și consiliere video.{' '}
                <a
                  href="https://gamblingtherapy.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline"
                  style={{ color: 'var(--red)' }}
                >
                  gamblingtherapy.org
                </a>
              </li>
              <li>
                <strong>Antena Anti-Drog (DepreHub)</strong> — pentru comorbiditate cu
                consumul de substanțe, TelVerde{' '}
                <a href="tel:0800870070" className="font-bold" style={{ color: 'var(--red)' }}>
                  0800 870 070
                </a>
                .
              </li>
            </ul>
          </Card>

          <div
            className="rounded-2xl p-6"
            style={{ background: 'white', border: '1px dashed var(--border-dark)' }}
          >
            <h3 className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Contact rapid
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: 'var(--text)' }}>
              <a
                href="tel:0800800099"
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-alt2)' }}
              >
                <Phone className="w-4 h-4" style={{ color: 'var(--red)' }} />
                <span>
                  <strong>0800 800 099</strong>
                  <br />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Joc Responsabil — TelVerde 24/7
                  </span>
                </span>
              </a>
              <a
                href="https://jocresponsabil.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-alt2)' }}
              >
                <Globe className="w-4 h-4" style={{ color: 'var(--red)' }} />
                <span>
                  <strong>jocresponsabil.ro</strong>
                  <br />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Chat live cu psiholog
                  </span>
                </span>
              </a>
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
              Pentru auto-excludere de pe SuperFunded: scrie la{' '}
              <Link href="/contact" className="font-bold underline">/contact</Link>
              {' '}sau email{' '}
              <a href="mailto:support@thesuperfunded.com" className="font-bold underline">
                support@thesuperfunded.com
              </a>
              .
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{ background: '#fff1f2' }}
        >
          <Icon className="w-5 h-5" style={{ color: 'var(--red)' }} />
        </div>
        <h2 className="text-lg font-extrabold flex-1 mt-1.5" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed pl-13 space-y-2 prose-jr" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
      <style>{`
        .prose-jr ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
        .prose-jr li { margin: 0.25rem 0; }
        .prose-jr strong { color: var(--text); }
        .prose-jr p + p { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}

function DraftBanner() {
  return (
    <div
      className="rounded-xl p-4 mb-6 text-sm"
      style={{ background: '#fff8e1', border: '1px solid #f59e0b', color: '#7c2d12' }}
    >
      <strong>DRAFT — NU CONSTITUIE CONSULTANȚĂ JURIDICĂ.</strong>
      {' '}Necesită revizuire de către avocat român specializat în iGaming.
    </div>
  );
}
