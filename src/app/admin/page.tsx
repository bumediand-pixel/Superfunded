import { prisma } from '@/lib/prisma';

export default async function AdminOverview() {
  let stats = { users: 0, conturiActive: 0, conturiFunded: 0, retrageriPending: 0, picksOpen: 0 };
  try {
    const [users, conturiActive, conturiFunded, retrageriPending, picksOpen] = await Promise.all([
      prisma.utilizator.count(),
      prisma.contTrader.count({ where: { activ: true } }),
      prisma.contTrader.count({ where: { statusEvaluare: 'FINANTAT' } }),
      prisma.retragere.count({ where: { status: 'IN_PROCESARE' } }),
      prisma.pariu.count({ where: { statusPariu: 'DESCHIS' } }),
    ]);
    stats = { users, conturiActive, conturiFunded, retrageriPending, picksOpen };
  } catch {
    // DB unavailable — render zeros
  }

  const cards = [
    { label: 'Utilizatori',         val: stats.users,            sub: 'total înregistrați' },
    { label: 'Conturi active',      val: stats.conturiActive,    sub: 'evaluare + funded' },
    { label: 'Conturi funded',      val: stats.conturiFunded,    sub: 'în plată' },
    { label: 'Retrageri în așteptare', val: stats.retrageriPending, sub: 'de aprobat',     accent: stats.retrageriPending > 0 },
    { label: 'Picks deschise',      val: stats.picksOpen,        sub: 'în așteptarea settle' },
  ];

  return (
    <div className="p-8">
      <h1 className="font-bebas text-3xl tracking-widest text-white mb-8">OVERVIEW</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl p-5"
            style={{ background: '#141414', border: c.accent ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">{c.label}</div>
            <div className="font-bebas text-4xl text-white">{c.val}</div>
            <div className="text-[11px] text-white/30 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
