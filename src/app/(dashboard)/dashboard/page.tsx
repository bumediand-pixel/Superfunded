import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LiveOddsWidget from '@/components/LiveOddsWidget';
import WelcomeTour from '@/components/dashboard/WelcomeTour';
import { ShoppingCart, Trophy, ShieldCheck, Wallet, Target, ArrowRight, Sparkles } from 'lucide-react';

async function getData(userId: string) {
  try {
    const utilizator = await prisma.utilizator.findUnique({
      where: { supabaseId: userId },
      include: {
        conturi: { orderBy: { createdAt: 'desc' } },
        pariuri: { orderBy: { dataPariu: 'desc' }, take: 5 },
      },
    });
    return utilizator;
  } catch { return null; }
}

const PLAN_LABEL: Record<string, string> = {
  STARTER_500: '€500 · Starter',
  BASIC_1000: '€1.000 · Basic',
  STANDARD_5000: '€5.000 · Standard',
  ADVANCED_10000: '€10.000 · Advanced',
  PRO_25000: '€25.000 · Pro',
  ELITE_50000: '€50.000 · Elite',
};

const STATUS_PILL: Record<string, { label: string; color: string; bg: string }> = {
  FAZA_1:    { label: 'Faza 1',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  FAZA_2:    { label: 'Faza 2',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  FINANTAT:  { label: 'Funded',    color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  RESPINS:   { label: 'Respins',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  SUSPENDAT: { label: 'Suspendat', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
  INACTIV:   { label: 'Inactiv',   color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const utilizator = user ? await getData(user.id) : null;
  const cont = utilizator?.conturi?.[0];
  const hasActiveAccount = !!cont && cont.statusEvaluare !== 'INACTIV';

  const totalProfit = utilizator?.conturi?.reduce((s: number, c: { profitTotal: number | null }) => s + (c.profitTotal ?? 0), 0) ?? 0;
  const firstName = utilizator?.numeComplet?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'picker';
  const greeting =
    new Date().getHours() < 12 ? 'Buna dimineata' :
    new Date().getHours() < 18 ? 'Buna ziua' : 'Buna seara';

  return (
    <div className="p-4 sm:p-6 max-w-6xl">
      <WelcomeTour hasActiveAccount={hasActiveAccount} />

      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{greeting}, {firstName}</h1>
        <p className="text-white/40 text-sm mt-1 capitalize">
          {new Date().toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* No active account -> big call-to-action */}
      {!hasActiveAccount && (
        <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.18) 0%, rgba(230,57,70,0.04) 60%, transparent 100%)',
            border: '1px solid rgba(230,57,70,0.25)',
          }}>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, var(--red, #e63946) 0%, transparent 70%)' }} />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4"
              style={{ background: 'rgba(230,57,70,0.2)', color: '#ff8a93' }}>
              <Sparkles className="w-3 h-3" />
              Pasul 1
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Cumpara un challenge ca sa incepi sa primesti picks
            </h2>
            <p className="text-sm text-white/60 mb-5 max-w-lg">
              Capitalul nostru, pick-urile tale. Alege marimea contului (€500 - €50.000) si incepe evaluarea in 30 zile.
            </p>
            <Link href="/planuri"
              className="inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--red, #e63946)', boxShadow: '0 12px 32px rgba(230,57,70,0.32)' }}>
              <ShoppingCart className="w-4 h-4" />
              Vezi planurile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard
          icon={Target}
          label="Plan activ"
          value={cont ? PLAN_LABEL[cont.plan] ?? cont.plan : 'Fara plan'}
          sub={cont ? `Capital €${cont.capitalInceput.toLocaleString('ro-RO')}` : 'Cumpara unul'}
          muted={!cont}
        />
        <KpiCard
          icon={Trophy}
          label="Status"
          value={cont ? STATUS_PILL[cont.statusEvaluare]?.label ?? cont.statusEvaluare : '—'}
          sub={cont ? `Faza ${cont.fazaCurenta}` : 'Inactiv'}
          color={cont ? STATUS_PILL[cont.statusEvaluare]?.color : undefined}
          bg={cont ? STATUS_PILL[cont.statusEvaluare]?.bg : undefined}
          muted={!cont}
        />
        <KpiCard
          icon={Wallet}
          label="Profit total"
          value={`€${totalProfit.toFixed(2)}`}
          sub={cont ? 'Split inclus' : 'Niciun cont'}
          color={totalProfit > 0 ? '#22c55e' : undefined}
          muted={totalProfit === 0}
        />
        <KpiCard
          icon={ShieldCheck}
          label="KYC"
          value={
            utilizator?.statusKYC === 'APROBAT' ? 'Aprobat' :
            utilizator?.statusKYC === 'IN_ASTEPTARE' ? 'In asteptare' :
            utilizator?.statusKYC === 'RESPINS' ? 'Respins' :
            'Neverificat'
          }
          sub={utilizator?.statusKYC === 'APROBAT' ? 'OK' : 'Necesar pentru retrageri'}
          color={utilizator?.statusKYC === 'APROBAT' ? '#22c55e' : '#fbbf24'}
        />
      </div>

      {/* Content row: Live Odds + Recent picks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Live Odds" subtitle="Actualizat la 30s" pulse>
          <LiveOddsWidget />
        </Card>

        <Card title="Ultimele picks">
          {utilizator?.pariuri?.length ? (
            <div className="divide-y" style={{ borderColor: 'var(--dash-overlay-5)' }}>
              {utilizator.pariuri.map((p: { id: string; eveniment: string; sport: string; cota: number; statusPariu: string; castigSauPierdere: number | null; suma: number }) => (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-semibold truncate">{p.eveniment}</div>
                    <div className="text-white/40 text-xs truncate">{p.sport.replace(/_/g, ' ')} · @ {p.cota}</div>
                  </div>
                  <span className={`text-sm font-extrabold ml-2 ${
                    p.statusPariu === 'CASTIGAT' ? 'text-green-400' :
                    p.statusPariu === 'PIERDUT' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {p.statusPariu === 'CASTIGAT' && p.castigSauPierdere ? `+€${p.castigSauPierdere.toFixed(2)}` :
                     p.statusPariu === 'PIERDUT' ? `-€${p.suma.toFixed(2)}` :
                     'Open'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-white/30 text-sm">
              Niciun pick inregistrat. {hasActiveAccount && (
                <Link href="/dashboard/pariuri" className="text-red-400 font-semibold hover:underline">Plaseaza primul →</Link>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, sub, color, bg, muted,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string; sub?: string;
  color?: string; bg?: string; muted?: boolean;
}) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border, var(--dash-overlay-6))' }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{label}</span>
        <span className="w-7 h-7 rounded-md inline-flex items-center justify-center"
          style={{ background: bg ?? 'var(--dash-overlay-4)', color: color ?? 'var(--dash-text-40)' }}>
          <Icon className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="text-base sm:text-lg font-extrabold leading-tight"
        style={{ color: muted ? 'var(--dash-text-50)' : color ?? '#fff' }}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function Card({ title, subtitle, pulse, children }: {
  title: string; subtitle?: string; pulse?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 sm:p-6"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border, var(--dash-overlay-6))' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-extrabold text-base text-white">{title}</h2>
        {subtitle && (
          <span className="text-xs text-white/40 inline-flex items-center gap-1.5">
            {pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
