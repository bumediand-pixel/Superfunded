'use client';
/**
 * Horizontally scrollable sport selector — top of the betting zone.
 * Mirrors Superbet's main nav: each sport is a tab pill with icon + label.
 */
import { SPORTURI_DISPONIBILE } from '@/lib/odds-api';

type Props = {
  active: string;
  onChange: (sport: string) => void;
};

export default function SportTabs({ active, onChange }: Props) {
  return (
    <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto sticky top-0 z-20 backdrop-blur"
      style={{ background: 'rgba(13,13,13,0.85)', borderBottom: '1px solid var(--dash-overlay-6)' }}>
      <div className="flex gap-1.5 py-3 min-w-max">
        {SPORTURI_DISPONIBILE.map(s => {
          const on = s.key === active;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange(s.key)}
              className="inline-flex items-center gap-2 px-3.5 h-9 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer"
              style={on
                ? { background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 6px 18px rgba(230,57,70,0.32)' }
                : { background: 'var(--dash-overlay-4)', color: 'var(--dash-text-70)', border: '1px solid var(--dash-border, var(--dash-overlay-8))' }
              }>
              <span aria-hidden>{s.icon}</span>
              {s.nume}
            </button>
          );
        })}
      </div>
    </div>
  );
}
