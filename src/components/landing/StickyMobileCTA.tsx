import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * StickyMobileCTA — server component, zero client JS.
 * Always renders to HTML; visibility is controlled purely by CSS:
 *   - hidden on md+ via Tailwind `md:hidden`
 *   - safe-area-inset-bottom honored via `.landing-sticky-mobile`
 */
export default function StickyMobileCTA() {
  return (
    <div
      role="region"
      aria-label="Acțiune rapidă"
      className="landing-sticky-mobile fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-950)]/95 px-4 pt-3 backdrop-blur md:hidden"
    >
      <Link
        href="/planuri"
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gold-400)] px-4 text-sm font-semibold text-[color:var(--color-ink-950)] transition-colors active:bg-[color:var(--color-gold-500)]"
      >
        Începe provocarea
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}
