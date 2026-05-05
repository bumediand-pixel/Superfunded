import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LiveOddsWidget from '@/components/LiveOddsWidget';

async function getData(userId: string) {
  try {
    const utilizator = await prisma.utilizator.findUnique({
      where: { supabaseId: userId },
      include: { conturi: { orderBy: { createdAt: 'desc' }, take: 1 }, pariuri: { orderBy: { dataPariu: 'desc' }, take: 5 } },
    });
    return utilizator;
  } catch { return null; }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const utilizator = user ? await getData(user.id) : null;
  const cont = utilizator?.conturi?.[0];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Overview</h1>
        <p className="text-white/40 mt-1">{new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Plan activ', value: cont ? cont.plan : 'Niciun plan', color: 'text-white', sub: cont ? `€${cont.capitalInceput} capital` : 'Alege un plan' },
          { label: 'Status evaluare', value: cont?.statusEvaluare ?? '—', color: cont?.statusEvaluare === 'FINANTAT' ? 'text-green-400' : 'text-yellow-400', sub: '' },
          { label: 'Profit total', value: cont ? `€${cont.profitTotal.toFixed(2)}` : '€0.00', color: 'text-green-400', sub: 'Split inclus' },
          { label: 'Status KYC', value: utilizator?.statusKYC ?? 'NESTARTAT', color: utilizator?.statusKYC === 'APROBAT' ? 'text-green-400' : 'text-yellow-400', sub: '' },
        ].map(card => (
          <div key={card.label} className="bg-[#141414] border border-white/10 rounded-2xl p-5">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">{card.label}</div>
            <div className={`text-xl font-black ${card.color}`}>{card.value}</div>
            {card.sub && <div className="text-white/30 text-xs mt-1">{card.sub}</div>}
          </div>
        ))}
      </div>

      {!cont && (
        <div className="bg-gradient-to-r from-red-950/30 to-transparent border border-red-500/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-white font-black text-lg mb-1">Activează-ți contul</h3>
            <p className="text-white/50 text-sm">Alege un plan ca să deblochezi evaluarea, statisticile și retragerile.</p>
          </div>
          <Link href="/#planuri" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0">
            Vezi planurile →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-4 flex items-center justify-between">
            Cote live
            <span className="text-green-400 text-xs font-normal flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              update la 30s
            </span>
          </h2>
          <LiveOddsWidget />
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-4">Ultimele pariuri</h2>
          {utilizator?.pariuri?.length ? (
            <div className="space-y-3">
              {utilizator.pariuri.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-white text-sm font-semibold">{p.eveniment}</div>
                    <div className="text-white/40 text-xs">{p.sport} · Cota {p.cota}</div>
                  </div>
                  <span className={`text-sm font-black ${p.statusPariu === 'CASTIGAT' ? 'text-green-400' : p.statusPariu === 'PIERDUT' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {p.statusPariu === 'CASTIGAT' ? `+€${p.castigSauPierdere?.toFixed(2)}` : p.statusPariu === 'PIERDUT' ? `-€${p.suma.toFixed(2)}` : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/30 text-sm">
              Niciun pariu încă. Începe imediat ce contul e finanțat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
