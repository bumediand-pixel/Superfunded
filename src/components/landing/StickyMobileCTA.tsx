import Link from 'next/link';

// Server Component — pure CSS, no client JS.
// Hidden md+; respects iOS safe-area-inset-bottom; min 48px touch target.
export default function StickyMobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-950)]/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="region"
      aria-label="Acțiuni rapide"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="flex-1 text-xs leading-tight text-[color:var(--color-mist-400)]">
          <span className="block font-semibold text-[color:var(--color-mist-200)]">
            Cont funded în 7 zile
          </span>
          Taxă unică, fără risc personal.
        </p>
        <Link
          href="/planuri"
          className="inline-flex items-center justify-center rounded-md bg-[color:var(--color-gold-400)] px-5 py-3 text-sm font-bold text-[color:var(--color-ink-950)] hover:bg-[color:var(--color-gold-500)]"
          style={{ minHeight: 48 }}
        >
          Începe
        </Link>
      </div>
    </div>
  );
}
