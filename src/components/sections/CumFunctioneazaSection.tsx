'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
import {
  Target, TrendingUp, Wallet, ShieldCheck,
  Clock, Zap, BarChart3, Globe,
  Trophy, Repeat2,
} from 'lucide-react';

const FEATURES = [
  { title: 'Alege Challenge-ul', icon: Target, description: 'Selectezi capitalul (€500–€50K) și tipul de provocare. Plătești o taxă unică — fără abonamente, fără surprize.' },
  { title: 'Demonstrezi Abilitățile', icon: TrendingUp, description: 'Atingi targetul de profit respectând regulile de risc. Nicio limită de timp pe planurile 2-Step.' },
  { title: 'Primești Capital', icon: Wallet, description: 'Treci evaluarea și pariezi cu banii noștri. Păstrezi 70–80% din fiecare câștig. Simplu.' },
  { title: 'KYC în 48h', icon: ShieldCheck, description: 'Verificare rapidă de identitate. Odată aprobat, retragerile sunt disponibile imediat.' },
  { title: 'Fără Limită de Timp', icon: Clock, description: 'Pe planurile 2-Step nu există deadline. Lucrezi în ritmul tău, fără presiune artificială.' },
  { title: 'Acces Instant', icon: Zap, description: 'Contul de evaluare este activ în câteva minute după plată. Zero birocrație, zero așteptare.' },
  { title: 'Statistici Complete', icon: BarChart3, description: 'Dashboard cu toate datele: win rate, ROI, profit pe sport, evoluție zilnică. Control total.' },
  { title: '9 Sporturi Suportate', icon: Globe, description: 'Fotbal, tenis, baschet, MMA, rugby, hochei și mai multe. Pariuri live și combinate permise.' },
  { title: 'Split 80% Profit', icon: Trophy, description: 'Cea mai mare rată din industrie. Prima retragere include rambursarea completă a taxei de evaluare.' },
  { title: 'Retrageri Săptămânale', icon: Repeat2, description: 'Procesăm retragerile în fiecare săptămână. Transfer bancar sau crypto — tu alegi metoda.' },
];

type AnimatedContainerProps = {
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function AnimatedContainer({ className, style, delay = 0.1, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
      style={style}>
      {children}
    </motion.div>
  );
}

export default function CumFunctioneazaSection() {
  return (
    <section id="cum-functioneaza" className="py-24 md:py-36" style={{ background: 'var(--black-0)' }}>
      <div className="mx-auto w-full max-w-6xl px-6">

        <AnimatedContainer className="mx-auto max-w-2xl text-center mb-16">
          <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: 'var(--red)' }}>
            Cum Funcționează
          </div>
          <h2 className="font-bodoni text-4xl md:text-5xl lg:text-6xl leading-tight text-white mb-4">
            Totul despre
            <span className="italic" style={{ color: 'var(--red)' }}> process</span>
          </h2>
          <p className="font-jost text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            3 pași simpli. De la zero la bettor finanțat cu capital până la €50.000.
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.35}
          className="grid grid-cols-1 divide-x divide-y divide-dashed sm:grid-cols-2 lg:grid-cols-5"
          style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', borderLeft: '1px dashed rgba(255,255,255,0.08)' }}>
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={i}
              feature={feature}
              style={{
                borderRight: '1px dashed rgba(255,255,255,0.08)',
                borderBottom: '1px dashed rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
}
