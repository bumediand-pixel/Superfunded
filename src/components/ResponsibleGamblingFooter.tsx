import Link from 'next/link';

// Compliance: bottom-of-content responsible gambling strip. NOT fixed —
// renders inline in the document flow at the end of the page chrome.
// Mounted from src/app/layout.tsx so it appears on every route.
export default function ResponsibleGamblingFooter() {
  return (
    <div
      role="contentinfo"
      aria-label="Joc responsabil"
      className="w-full px-4 sm:px-6 py-3 text-xs"
      style={{
        background: 'rgba(15,23,42,0.96)',
        color: 'rgba(255,255,255,0.7)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
          <span
            aria-label="Doar pentru persoane peste 18 ani"
            className="inline-flex items-center justify-center font-extrabold text-[11px] px-2 py-1 rounded"
            style={{ background: 'var(--red)', color: 'white', letterSpacing: '0.04em' }}
          >
            18+
          </span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>
            {/* REPLACE: ONJN license / disclaimer */}
            Statut ONJN: în curs de clarificare juridică. SuperFunded SRL — platformă de evaluare a abilităților sportive.
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link
            href="/joc-responsabil"
            className="font-bold underline transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Joc Responsabil
          </Link>
          <a
            href="https://jocresponsabil.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            jocresponsabil.ro
          </a>
          <a
            href="tel:0800800099"
            className="underline transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            0800 800 099
          </a>
        </div>
      </div>
    </div>
  );
}
