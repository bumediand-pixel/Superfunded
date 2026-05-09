/**
 * Responsible-gambling footer strip.
 *
 * Sticks to the bottom of the page content (NOT viewport-fixed) and is
 * rendered above the main marketing footer in the root layout. Contains:
 *   - "18+" badge
 *   - ONJN status placeholder (replaced once licensing is finalized)
 *   - Joc Responsabil internal link
 *   - jocresponsabil.ro external link (TelVerde 0800 800 099)
 *
 * Per ONJN guidance and EGBA voluntary code, every page that promotes or
 * facilitates real-money betting should make these contacts visible without
 * requiring a click. We render this on every route via the root layout.
 */
import Link from 'next/link';

export default function ResponsibleGamblingFooter() {
  return (
    <aside
      role="complementary"
      aria-label="Joc responsabil"
      className="w-full"
      style={{
        background: '#0b1220',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.62)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">

        <div className="flex items-center gap-3 flex-wrap">
          <span
            aria-label="Vârsta minimă 18 ani"
            className="inline-flex items-center justify-center font-extrabold text-[11px] tracking-wider px-2 py-1 rounded"
            style={{ background: 'var(--red)', color: 'white', minWidth: 36 }}
          >
            18+
          </span>

          {/* REPLACE: ONJN license / disclaimer */}
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>
            {/* TODO: înlocuiește cu numărul real al licenței ONJN sau cu disclaimerul aprobat de avocat. */}
            Statut ONJN: în curs de clarificare juridică · Operator: SuperFunded SRL · România
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/joc-responsabil"
            className="font-semibold transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            Joc Responsabil
          </Link>
          <a
            href="https://jocresponsabil.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            jocresponsabil.ro
          </a>
          <a
            href="tel:0800800099"
            className="font-semibold transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            TelVerde 0800 800 099
          </a>
        </div>

      </div>
    </aside>
  );
}
