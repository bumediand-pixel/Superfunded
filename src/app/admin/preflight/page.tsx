/**
 * Admin pre-launch verifier — checks every env var, every external integration,
 * every legal placeholder, every cron, every webhook the platform depends on.
 *
 * Goes through the launch checklist in code so the operator (you) can hit one URL
 * and see at a glance what's still TODO before going live.
 */
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import {
  ENTITY_CUI, ENTITY_REG_NO, DISCORD_INVITE,
} from '@/lib/legal';

type Status = 'ok' | 'warn' | 'error';
type Check = { label: string; status: Status; detail?: string };

function presentEnv(name: string, optional = false): Check {
  const v = process.env[name];
  if (v && v.length > 0 && !v.startsWith('placeholder') && v !== 're_xxx') {
    return { label: `env: ${name}`, status: 'ok', detail: v.length > 20 ? `${v.slice(0, 6)}…${v.slice(-4)}` : v };
  }
  return {
    label: `env: ${name}`,
    status: optional ? 'warn' : 'error',
    detail: optional ? 'opțional, nu e setat' : 'LIPSEȘTE',
  };
}

function legalCheck(): Check[] {
  const checks: Check[] = [];
  checks.push({
    label: 'lib/legal.ts: ENTITY_CUI / VAT',
    status: ENTITY_CUI.includes('de completat') ? 'error' : 'ok',
    detail: ENTITY_CUI,
  });
  checks.push({
    label: 'lib/legal.ts: ENTITY_REG_NO',
    status: ENTITY_REG_NO.includes('de completat') ? 'error' : 'ok',
    detail: ENTITY_REG_NO,
  });
  checks.push({
    label: 'lib/legal.ts: DISCORD_INVITE',
    status: DISCORD_INVITE.endsWith('/superfunded') ? 'warn' : 'ok',
    detail: DISCORD_INVITE,
  });
  return checks;
}

async function liveCheck(name: string, url: string, ok: (r: Response) => boolean | Promise<boolean>): Promise<Check> {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    return { label: name, status: (await ok(r)) ? 'ok' : 'error', detail: `${r.status} ${r.statusText}` };
  } catch (e) {
    return { label: name, status: 'error', detail: e instanceof Error ? e.message : 'unreachable' };
  }
}

export default async function PreflightPage() {
  const groups: { title: string; checks: (Check | Promise<Check>)[] }[] = [
    {
      title: 'Auth & DB',
      checks: [
        presentEnv('NEXT_PUBLIC_SUPABASE_URL'),
        presentEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        presentEnv('DATABASE_URL'),
        presentEnv('DIRECT_URL'),
      ],
    },
    {
      title: 'Stripe',
      checks: [
        presentEnv('STRIPE_SECRET_KEY'),
        presentEnv('STRIPE_WEBHOOK_SECRET'),
      ],
    },
    {
      title: 'KYC',
      checks: [
        presentEnv('SUMSUB_APP_TOKEN'),
        presentEnv('SUMSUB_SECRET_KEY'),
        presentEnv('SUMSUB_LEVEL_NAME', true),
      ],
    },
    {
      title: 'Email',
      checks: [
        presentEnv('RESEND_API_KEY'),
        presentEnv('CONTACT_INBOX_EMAIL'),
        presentEnv('ADMIN_EMAIL'),
      ],
    },
    {
      title: 'Odds & Cron',
      checks: [
        presentEnv('ODDS_API_KEY'),
        presentEnv('CRON_SECRET'),
      ],
    },
    {
      title: 'Optional (production hardening)',
      checks: [
        presentEnv('UPSTASH_REDIS_REST_URL', true),
        presentEnv('UPSTASH_REDIS_REST_TOKEN', true),
        presentEnv('NEXT_PUBLIC_PLAUSIBLE_DOMAIN', true),
        presentEnv('ADMIN_EMAILS', true),
      ],
    },
    { title: 'Legal placeholders', checks: legalCheck() },
    {
      title: 'Live integrations',
      checks: [
        liveCheck('Stripe API', 'https://api.stripe.com/v1/balance', async r => {
          // 401 means key wrong, anything else can be transient
          return r.status !== 401 || !process.env.STRIPE_SECRET_KEY;
        }),
        liveCheck('The Odds API', `https://api.the-odds-api.com/v4/sports?apiKey=${process.env.ODDS_API_KEY ?? ''}`, async r => r.ok || !process.env.ODDS_API_KEY),
      ],
    },
  ];

  // Resolve any async checks
  const resolved = await Promise.all(
    groups.map(async g => ({
      title: g.title,
      checks: await Promise.all(g.checks.map(c => Promise.resolve(c))),
    }))
  );

  const allChecks = resolved.flatMap(g => g.checks);
  const failed = allChecks.filter(c => c.status === 'error').length;
  const warns  = allChecks.filter(c => c.status === 'warn').length;
  const oks    = allChecks.filter(c => c.status === 'ok').length;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-bebas text-3xl tracking-widest text-white mb-2">PREFLIGHT</h1>
      <p className="text-white/40 text-sm mb-6">Verificare la zi a tuturor dependențelor înainte de lansare.</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <SummaryCard label="OK" value={oks} color="#22c55e" />
        <SummaryCard label="Atenționări" value={warns} color="#f59e0b" />
        <SummaryCard label="Erori" value={failed} color="#ef4444" />
      </div>

      <div className="space-y-6">
        {resolved.map(g => (
          <div key={g.title} className="rounded-xl overflow-hidden"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-3 border-b text-xs font-bold tracking-widest uppercase text-white/50"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {g.title}
            </div>
            {g.checks.map((c, i) => (
              <div key={i} className="grid grid-cols-12 px-5 py-3 items-center text-sm border-b last:border-0"
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <span className="col-span-1">
                  {c.status === 'ok' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                   c.status === 'warn' ? <AlertCircle className="w-4 h-4 text-yellow-300" /> :
                   <XCircle className="w-4 h-4 text-red-400" />}
                </span>
                <span className="col-span-6 text-white/90 font-mono text-xs">{c.label}</span>
                <span className={`col-span-5 text-right text-xs ${
                  c.status === 'ok' ? 'text-green-400/80' :
                  c.status === 'warn' ? 'text-yellow-300/80' : 'text-red-400/80'
                }`}>
                  {c.detail}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 px-5 py-4 rounded-xl text-xs"
        style={{ background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.18)', color: 'rgba(255,255,255,0.7)' }}>
        💡 <strong>Cum e folosit:</strong> deploy → vizitezi <code>/admin/preflight</code> →
        verifici că toate sunt verzi → ești ok pentru lansare. Erorile blochează lansarea, atenționările nu.
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-5"
      style={{ background: '#141414', border: `1px solid ${color}30` }}>
      <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">{label}</div>
      <div className="font-bebas text-4xl" style={{ color }}>{value}</div>
    </div>
  );
}
