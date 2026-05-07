import type { Metadata } from 'next';
import { MessageCircle, Bell, Zap, Shield, Users, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Comunitatea Discord | SuperFunded',
  description: 'Suport 24/7, alerte live, schimbări de reguli, anunțuri exclusive — alătură-te comunității SuperFunded pe Discord.',
};

const FEATURES = [
  { icon: MessageCircle, title: 'Suport 24/7',           desc: 'Echipa noastră + traderi funded răspund în câteva minute. Fără cozi de tichete.' },
  { icon: Bell,          title: 'Alerte live',           desc: 'Schimbări de reguli, deschideri pentru retragere, evenimente importante — direct pe canalul tău.' },
  { icon: Zap,           title: 'Acces anticipat',       desc: 'Funcționalități noi, sporturi în beta, calculatoare exclusive — testate întâi în Discord.' },
  { icon: Shield,        title: 'Educație & strategii',  desc: 'Threaduri săptămânale, breakdown-uri de match-uri, sesiuni AMA cu pickeri funded.' },
  { icon: Users,         title: '5.000+ membri',         desc: 'Cea mai activă comunitate românească de pariori funded. Real people, real picks.' },
  { icon: Sparkles,      title: 'Promoții exclusive',    desc: 'Coduri de discount pentru challenge-uri, giveaway-uri lunare, drops aleatorii pentru membri.' },
];

const DISCORD_INVITE = 'https://discord.gg/superfunded';

export default function DiscordPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Comunitate
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Alătură-te pe Discord
          </h1>
          <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>
            Răspunsuri rapide. Alerte live. Comunitatea de pariori #1 din România.
          </p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Gratuit · Fără card · Real people, no bots
          </p>

          <a href={DISCORD_INVITE} target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 mt-8 font-bold text-sm px-8 py-4 rounded-full cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: '#5865F2', color: 'white', boxShadow: '0 12px 32px rgba(88,101,242,0.35)' }}>
            <MessageCircle className="w-5 h-5" />
            Intră în Discord — gratis
          </a>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-2xl p-6"
                style={{ background: 'white', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                  style={{ background: '#fff1f2' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--red)' }} />
                </div>
                <h3 className="text-lg font-extrabold mb-1.5" style={{ color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer banner */}
        <div className="rounded-2xl p-6 md:p-8"
          style={{ background: 'white', border: '1px dashed var(--border-dark)' }}>
          <h3 className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Important
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            SuperFunded <strong>nu</strong> este o casă de pariuri, agenție, sau operator de jocuri de noroc. Suntem o platformă de evaluare a abilităților sportive, folosind capital virtual pentru challenge-uri. Niciun pariu cu bani reali nu este plasat pe platforma noastră de către utilizatori. Datele despre meciuri sunt furnizate de surse terțe (ESPN, Yahoo Sports, etc.). Serviciul este destinat scopurilor educaționale și de divertisment. <strong>18+</strong> unde permis de legea locală.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <a href={DISCORD_INVITE} target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-full cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: '#5865F2', color: 'white', boxShadow: '0 12px 32px rgba(88,101,242,0.35)' }}>
            <MessageCircle className="w-5 h-5" />
            Intră acum în Discord
          </a>
        </div>
      </div>
    </main>
  );
}
