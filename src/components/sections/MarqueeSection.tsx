const ITEMS = [
  '⚽ FOTBAL', '€1.2M+ PROFIT PLĂTIT', '🎾 TENIS', 'CAPITAL PÂNĂ LA €50.000',
  '🏀 BASCHET', '80% SPLIT PROFIT', '🥊 MMA / UFC', '2.400+ BETTORI ACTIVI',
  '🏉 RUGBY', 'FĂRĂ LIMITĂ DE TIMP', '🏒 HOCHEI', 'RETRAGERI SĂPTĂMÂNALE',
  '⚽ FOTBAL', '€1.2M+ PROFIT PLĂTIT', '🎾 TENIS', 'CAPITAL PÂNĂ LA €50.000',
  '🏀 BASCHET', '80% SPLIT PROFIT', '🥊 MMA / UFC', '2.400+ BETTORI ACTIVI',
  '🏉 RUGBY', 'FĂRĂ LIMITĂ DE TIMP', '🏒 HOCHEI', 'RETRAGERI SĂPTĂMÂNALE',
];

export default function MarqueeSection() {
  return (
    <div className="overflow-hidden border-y py-3" style={{
      borderColor: 'rgba(230,57,70,0.15)',
      background: 'linear-gradient(90deg, #0d0d0d, #111111)',
    }}>
      <div className="ticker-inner">
        {ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-6 font-bebas tracking-widest whitespace-nowrap" style={{
            fontSize: '13px',
            color: item.startsWith('€') || item.includes('PROFIT') || item.includes('SPLIT') || item.includes('CAPITAL') || item.includes('RETRAGERI')
              ? '#C9A84C'
              : 'rgba(255,255,255,0.55)',
          }}>
            {item}
            <span style={{ color: 'rgba(230,57,70,0.4)', marginLeft: '8px' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
