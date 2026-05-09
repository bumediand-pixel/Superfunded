# Landing redesign — `(landing-v2)` route group

A self-contained dark + gold marketing landing for SuperFunded, scoped under
`src/app/(landing-v2)/landing/page.tsx` so it ships at `/landing` without
touching the existing `src/app/page.tsx` homepage or the `(marketing)` group's
shared `Nav` / `Footer`.

## Why a separate route group

- **`src/app/page.tsx` already owns `/`.** Adding `src/app/(marketing)/page.tsx`
  (as the original brief suggested) would collide on the same URL because
  Next.js App Router route groups do not affect the URL path. Two `page.tsx`
  files resolving to `/` produce a build-time error.
- **`src/app/(marketing)/layout.tsx` already wraps every child in
  `<Nav>` + `<Footer>`.** The new landing brings its own minimal header and
  custom dark `<Footer>`, so it must NOT inherit that layout.
- The new group `(landing-v2)` provides an empty layout, isolating styles via
  the `.landing-dark` wrapper and dark-themed components.

## File tree (new files only)

```
src/
  app/
    (landing-v2)/
      layout.tsx                     # minimal pass-through layout
      landing/
        page.tsx                     # /landing — composes all sections + JSON-LD
  components/
    landing/
      Hero.tsx                       # H1, CTAs, trust strip, hero image (priority)
      HowItWorks.tsx                 # 3 steps, lucide icons (Target / TrendingUp / Wallet)
      PayoutPreview.tsx              # "use client" — sliders + aria-live result
      TrustSection.tsx               # 4 differentiators, 3 testimonials, 4 partners
      Pricing.tsx                    # Starter / Pro (popular) / Elite + guarantee strip
      FAQ.tsx                        # 8 RO Qs as native <details> (no JS)
      FinalCTA.tsx                   # urgent banner
      Footer.tsx                     # 18+, ONJN note, links, social
      StickyMobileCTA.tsx            # fixed bottom CTA, md:hidden, safe-area-inset

src/app/globals.css                  # APPENDED a new @theme block + .landing-dark scope
README-landing.md                    # this file
```

## Promoting `/landing` to the actual homepage

When the content team is happy and ready to flip the switch:

```bash
git mv src/app/page.tsx src/app/page.legacy.tsx        # park the old root
mv src/app/(landing-v2)/landing/page.tsx src/app/page.tsx
rm -rf src/app/(landing-v2)
# the new page.tsx imports paths use @/components/landing/* and still work as-is
```

If the marketing group's `Nav` / `Footer` chrome should be reused for legal
sub-pages but NOT for the new homepage, keep the new `page.tsx` at the **app
root** (which has no shared layout beyond `src/app/layout.tsx`). The
landing brings its own footer.

## REPLACE checklist (where to swap real content)

| File                               | Marker                                                    | What to swap                                                            |
| ---------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| `Hero.tsx`                         | `TOTAL_PAID_RON`                                          | Live total payout pulled from `/api/public-stats`                       |
| `Hero.tsx`                         | `Stripe / VISA / MC`                                      | Real provider SVG logos in the trust strip                              |
| `Hero.tsx`                         | ONJN disclaimer line                                      | Final legal copy approved by counsel                                    |
| `Hero.tsx`                         | `/hero/dashboard.webp`                                    | Final hero image (1024×768 webp, ≤120KB)                                |
| `TrustSection.tsx`                 | `TESTIMONIAL_{1,2,3}_{NAME,CITY,PAYOUT}` + photo paths    | Real names, cities, payouts, and 80×80 webp photos                      |
| `TrustSection.tsx`                 | `PARTNERS` array                                          | Real partner SVG logos (Stripe, Wise, Discord, Trustpilot, etc.)        |
| `Pricing.tsx`                      | `*_FEE` / `*_TARGET` / `*_DRAWDOWN` / `*_SPLIT` per tier  | Final approved economics                                                |
| `Pricing.tsx`                      | `href: '/planuri?plan=...'`                               | Confirmed Stripe checkout deep links                                    |
| `Footer.tsx`                       | `ONJN_STATUS` block                                       | Final legal note about ONJN posture                                     |
| `Footer.tsx`                       | Social URLs                                               | Real Discord / X / Instagram handles                                    |

Search the repo for the literal token `REPLACE:` to enumerate every spot.

## Performance budget

Targets and how they're enforced in the build output:

| Metric            | Target  | How                                                                 |
| ----------------- | ------- | ------------------------------------------------------------------- |
| LCP               | <1.8s   | H1 is plain text in initial HTML; hero `<Image>` has `priority` + `fetchPriority="high"` + explicit width/height |
| INP               | <200ms  | Only `PayoutPreview` is a Client Component; sliders are native `<input type="range">` (no synthetic listeners) |
| CLS               | <0.1    | All `<Image>` calls supply explicit `width`/`height`; no layout shift on details/summary toggles |
| Client JS budget  | <50KB   | Single `"use client"` boundary in `PayoutPreview.tsx`; lucide-react icons used in client only via tree-shake |

After running `npm run build`, the route line for `/landing` will report its
First Load JS — verify it lands under ~110KB total (Next.js framework + the
`PayoutPreview` chunk).

## Accessibility (WCAG 2.2 AA)

- `aria-labelledby` on every `<section>`; H1 → H2 → H3 hierarchy preserved.
- Skip link `.ld-skip-link` jumps to `#main-content`.
- All interactive controls have explicit `min-height: 48px` (target size 2.5.8).
- 2px gold focus ring with 2px offset (focus appearance 2.4.11), declared in
  `globals.css` under `.landing-dark`.
- Decorative icons get `aria-hidden="true"`; meaningful images have
  descriptive alt text.
- `aria-live="polite"` on the calculator output panel.
- `prefers-reduced-motion` respected via the scoped media query.
- FAQ uses native `<details>` so it works keyboard-only without any JS.

## Integration notes

- The route uses the existing root `<html lang="ro">` and font variables from
  `src/app/layout.tsx` — no new fonts or providers added.
- `lucide-react` was already a dependency (`^1.14.0`); no new packages required.
- Tailwind v4 `@theme` tokens are global, but only consumed under
  `.landing-dark` via `bg-[color:var(...)]` arbitrary values, so the rest of
  the app still renders against `:root` light theme.
- JSON-LD `Organization` and `FAQPage` are emitted at the bottom of `page.tsx`
  to enrich SERP appearance.
