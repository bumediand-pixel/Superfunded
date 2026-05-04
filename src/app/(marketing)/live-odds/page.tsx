import LiveOddsWidget from '@/components/LiveOddsWidget';

const SPORTURI_LIVE = [
  { key: 'soccer_epl', label: 'Premier League' },
  { key: 'soccer_spain_la_liga', label: 'La Liga' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League' },
  { key: 'tennis_atp_french_open', label: 'Tenis ATP' },
  { key: 'basketball_nba', label: 'NBA' },
  { key: 'mma_mixed_martial_arts', label: 'MMA / UFC' },
];

export default function LiveOddsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-bold tracking-widest uppercase">Live</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">COTE ÎN TIMP REAL</h1>
          <p className="text-white/50">Date actualizate automat la fiecare 30 secunde</p>
        </div>
        <div className="space-y-10">
          {SPORTURI_LIVE.map(sport => (
            <div key={sport.key} className="bg-[#141414] border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-black text-xl mb-5 flex items-center gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {sport.label}
              </h2>
              <LiveOddsWidget sport={sport.key} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
