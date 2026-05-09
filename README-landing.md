# Landing Redesign — `(marketing)/page.tsx`

Dark-and-gold marketing landing for SuperFunded, scoped under the
`(marketing)` route group. Designed to coexist with the existing
homepage at `src/app/page.tsx` without any visual bleed.

## Design Decisions

- **Scoped dark theme.** A `.landing-dark` wrapper applies the new ink/gold/volt
  palette. Tokens live in `src/app/globals.css` inside an additive `@theme {}`
  block; they are *only* applied to descendants of `.landing-dark`. Other
  pages keep the existing white/red theme.
- **Server-first.** Every component is a Server Component except
  `PayoutPreview.tsx`, which needs sliders. This keeps the client JS budget
  comfortably under 50 KB.
- **LCP optimized.** The H1 is plain text in the initial HTML; the hero image
  uses `next/image` with `priority`, `fetchPriority="high"`, and explicit
  `width`/`height` to prevent CLS.
- **WCAG 2.2 AA.** Skip link, keyboard-friendly `<details>` FAQ, focus rings
  (2 px gold, 2 px offset), all touch targets ≥ 48 px, decorative icons
  marked `aria-hidden`, `prefers-reduced-motion` respected.
- **Mobile-first.** Sticky bottom CTA on small viewports, with iOS
  `safe-area-inset-bottom` honored via the `.landing-sticky-mobile` class.

## REPLACE Cheat Sheet

| Marker location                               | What to swap with                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `Hero.tsx` — `REPLACE_RON` (TOTAL_PAID_RON)   | Live total paid number from payouts API or CMS                          |
| `Hero.tsx` — STRIPE / VISA / MC chips         | Real SVG mark assets in `/public/logos/`                                |
| `Hero.tsx` — ONJN disclaimer copy             | Final wording approved by legal                                         |
| `Hero.tsx` — `/public/hero/dashboard.webp`    | Real hero screenshot, 1280×800, < 120 KB                                |
| `TrustSection.tsx` — `REPLACE_NAME_*`         | Real testimonial names                                                  |
| `TrustSection.tsx` — `REPLACE_RON` (payouts)  | Real per-user payout amounts                                            |
| `TrustSection.tsx` — `/public/testimoniale/*` | 80×80 user avatars (.webp, < 8 KB each)                                 |
| `TrustSection.tsx` — `REPLACE_PARTNER_*`      | Real partner SVG logos in `/public/logos/`                              |
| `Pricing.tsx` — `REPLACE_RON` / `REPLACE_%`   | Real fee, capital, target, drawdown numbers per tier                    |
| `Pricing.tsx` — money-back guarantee strip    | Confirm policy wording with legal                                       |
| `FAQ.tsx` — Q7 (legality)                     | Final legal phrasing                                                    |
| `Footer.tsx` — `Status ONJN: REPLACE`         | Final ONJN status                                                       |
| `Footer.tsx` — Discord / Twitter URLs         | Real social URLs                                                        |

## Performance Budget — Verification

| Metric                | Target  | Notes                                                                   |
| --------------------- | ------- | ----------------------------------------------------------------------- |
| LCP                   | < 1.8 s | Hero text in initial HTML; image `priority` + `fetchPriority="high"`.   |
| INP                   | < 200 ms| Only one client island (`PayoutPreview`); range inputs are native.      |
| CLS                   | < 0.1   | All media has explicit `width`/`height`. No layout-shifting fonts.      |
| Client JS budget      | < 50 KB | One client component (`PayoutPreview`), 1 lucide icon (`Calculator`).   |
| Render-blocking fonts | 0       | Reuses fonts already loaded by `RootLayout` (Bebas/Jakarta/Mono).       |

Run `npm run build` and inspect the route output for the `(marketing)` page
size. Use Lighthouse / Chrome DevTools "Performance" panel to confirm in CI.

## Integration Notes

- The page lives under `src/app/(marketing)/page.tsx`. The shared
  `(marketing)/layout.tsx` still renders the global `Nav` and `Footer`.
  The landing also renders its own scoped `LandingFooter`, so until the
  layout is split there will be two footers stacked. Either:
  1. Move the global `Nav`/`Footer` out of `(marketing)/layout.tsx` and
     into the individual sub-routes that need them, or
  2. Add an opt-out flag (e.g. dedicated route group like `(marketing-bare)`).
- No new dependencies were introduced. `lucide-react` was already pinned in
  `package.json`. Icons used: `ArrowRight`, `Calculator`, `Check`, `Target`,
  `TrendingUp`, `WalletMinimal`.
- The existing root `src/app/page.tsx` is untouched.

## Promoting the Landing to the Real Homepage

When you're ready to make this the public `/` route:

1. Back up the current home, e.g.
   `git mv src/app/page.tsx src/app/page.legacy.bak.tsx`
2. The landing already lives at `src/app/(marketing)/page.tsx`, which Next.js
   resolves to `/` because route groups don't add path segments. Removing
   `src/app/page.tsx` is enough — Next will fall back to the marketing one.
3. Decide what to do about the duplicated Nav/Footer pair (see Integration
   Notes #1 above).
4. Verify with `npm run build` and a fresh Lighthouse run.

## File Tree (Additions Only)

```
src/
  app/
    globals.css                       # appended @theme + .landing-dark scope
    (marketing)/
      page.tsx                        # NEW — landing root
  components/
    landing/                          # NEW directory
      Hero.tsx
      HowItWorks.tsx
      PayoutPreview.tsx               # only "use client" file
      TrustSection.tsx
      Pricing.tsx
      FAQ.tsx
      FinalCTA.tsx
      Footer.tsx
      StickyMobileCTA.tsx
README-landing.md                     # this file
```
