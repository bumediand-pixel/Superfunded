const ITEMS = [
  'Fotbal', '€1.2M+ profit plătit', 'Tenis', 'Capital până la €50.000',
  'Baschet', '80% split profit', 'MMA / UFC', '2.400+ bettori finanțați',
  'Rugby', 'Fără limită de timp', 'Hochei', 'Retrageri săptămânale',
  'Fotbal', '€1.2M+ profit plătit', 'Tenis', 'Capital până la €50.000',
  'Baschet', '80% split profit', 'MMA / UFC', '2.400+ bettori finanțați',
  'Rugby', 'Fără limită de timp', 'Hochei', 'Retrageri săptămânale',
];

const isHighlight = (item: string) =>
  item.includes('€') || item.includes('split') || item.includes('Capital') || item.includes('Retrageri');

export default function MarqueeSection() {
  return (
    <div className="overflow-hidden border-y py-3.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
      <div className="ticker-inner">
        {ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-5 text-sm font-semibold whitespace-nowrap"
            style={{ color: isHighlight(item) ? 'var(--red)' : 'var(--text-muted)' }}>
            {item}
            <span className="text-xs" style={{ color: 'var(--border-dark)', marginLeft: '6px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
