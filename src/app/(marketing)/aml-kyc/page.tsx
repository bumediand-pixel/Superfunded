import type { Metadata } from 'next';
import { ShieldCheck, FileCheck, AlertTriangle, Clock } from 'lucide-react';
import { ENTITY_NAME, ENTITY_COUNTRY, GDPR_EMAIL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'AML & KYC',
  description: 'Politica de prevenire a spălării banilor și verificare KYC pe SuperFunded. Conformitate cu Legea 129/2019.',
};

export default function AmlKycPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Conformitate
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            AML &amp; KYC
          </h1>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Politica anti-spălare-de-bani și de cunoaștere a clientului. {ENTITY_NAME} se conformează Legii 129/2019 (RO),
            Directivei UE 2015/849, GDPR și recomandărilor FATF chiar dacă activitatea noastră este de evaluare a
            abilităților, nu jocuri de noroc reglementate.
          </p>
        </div>

        <div className="space-y-6">

          <Card icon={ShieldCheck} title="Verificare KYC obligatorie pentru retrageri">
            <p>Orice utilizator care vrea să retragă fonduri ca urmare a finalizării cu succes a evaluării trece printr-un proces KYC verificat de <strong>Sumsub</strong>:</p>
            <ul>
              <li>act de identitate (CI / pașaport)</li>
              <li>selfie cu liveness check</li>
              <li>opțional: dovadă de adresă pentru retrageri ≥ €1.000</li>
            </ul>
            <p>Datele KYC sunt stocate la Sumsub (servere UE) timp de 5 ani conform legii AML.</p>
          </Card>

          <Card icon={FileCheck} title="Praguri de raportare">
            <ul>
              <li><strong>Tranzacții ≥ €10.000</strong> sau o serie de retrageri legate care depășesc acest prag → declarate la <strong>ONPCSB</strong> (Oficiul Național de Prevenire și Combatere a Spălării Banilor) conform Art. 7 din Legea 129/2019.</li>
              <li><strong>Tranzacții suspecte</strong> (indiferent de sumă) → raport de tranzacție suspectă (RTS) trimis în 24h.</li>
              <li>Beneficiarul real (UBO) este verificat înainte de orice retragere ≥ €1.000.</li>
            </ul>
          </Card>

          <Card icon={AlertTriangle} title="Surse interzise / Restricții">
            <ul>
              <li>Niciun cont nu este activat fără adresă de email validată și 2FA.</li>
              <li>Plățile sunt acceptate doar prin Stripe (cardurile sunt verificate 3DS).</li>
              <li>Retragerile se trimit doar către conturi pe numele utilizatorului verificat — niciodată către terțe persoane.</li>
              <li>Crypto: USDT (TRC20 / ERC20) și BTC, dar pe wallet-uri verificate prin micro-deposit înainte de prima plată mare.</li>
              <li>Țări sancționate (FATF blacklist, sancțiuni UE / OFAC) → cont blocat, fonduri puse sub sechestru până la clarificare.</li>
            </ul>
          </Card>

          <Card icon={Clock} title="Timp de procesare KYC">
            <ul>
              <li>Documente complete și clare → aprobare în <strong>15 minute - 4h</strong> în zilele lucrătoare.</li>
              <li>Cazuri standard fără probleme → aprobare automată Sumsub.</li>
              <li>Verificare manuală (când există dubii) → 24-48h.</li>
              <li>Pentru cazuri complexe (UBO multiplu, surse fonduri neclare) → maxim 5 zile lucrătoare.</li>
            </ul>
          </Card>

          <div className="rounded-2xl p-6"
            style={{ background: 'white', border: '1px dashed var(--border-dark)' }}>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Ofițer de conformitate
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              Pentru întrebări despre KYC, raportare AML sau alte aspecte de conformitate:{' '}
              <a href={`mailto:${GDPR_EMAIL}`} className="font-bold" style={{ color: 'var(--red)' }}>
                {GDPR_EMAIL}
              </a>
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {ENTITY_NAME} · {ENTITY_COUNTRY} · Răspunde în 5 zile lucrătoare conform GDPR.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ icon: Icon, title, children }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{ background: '#fff1f2' }}>
          <Icon className="w-5 h-5" style={{ color: 'var(--red)' }} />
        </div>
        <h2 className="text-lg font-extrabold flex-1 mt-1.5" style={{ color: 'var(--text)' }}>{title}</h2>
      </div>
      <div className="text-sm leading-relaxed pl-13 space-y-2 prose-aml" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
      <style>{`
        .prose-aml ul { list-style: disc; padding-left: 1.25rem; }
        .prose-aml li { margin: 0.25rem 0; }
        .prose-aml strong { color: var(--text); }
      `}</style>
    </div>
  );
}
