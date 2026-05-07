# SuperFunded — Sports Betting Funded Accounts

Platforma de betting prop firm pentru pariori funded. Stack: **Next.js 16**, **React 19**, **TypeScript**, **Prisma 7 + PostgreSQL**, **Supabase Auth**, **Sumsub KYC**, **Stripe Checkout**, **Resend Email**, **The Odds API**, **Tailwind 4**.

## Features

- **Marketing site** (RO) — Hero, How-it-works, Plans, Calculatoare (×9), Discord, Contact, FAQ, Leaderboard, Affiliates, Live odds.
- **Auth** — Supabase email + Google OAuth, password reset.
- **KYC** — Sumsub WebSDK widget + token endpoint + webhook.
- **Payments** — Stripe Checkout per-mode pricing (1-Step / 2-Step), webhook provisions `ContTrader` + `RegulaCont` with idempotency, dispute & refund handling.
- **Betting engine** — `Pariu` model + bet placement API + automated settle cron (`/api/cron/settle-bets` every 10 min) using The Odds API scores.
- **Withdrawals** — KYC-gated, balance-checked, dual-channel (bank / crypto), user + admin email notifications.
- **Affiliate program** — 3-tier commissions, referral codes, leaderboard.
- **SEO** — sitemap, robots, JSON-LD Organization, per-page metadata.

## Setup

### 1. Clone & install

```bash
git clone https://github.com/bumediand-pixel/Superfunded.git
cd Superfunded
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in:

| Var | Where to get it |
|-----|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `DATABASE_URL` / `DIRECT_URL` | Supabase → Settings → Database |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe dashboard (test mode for dev) |
| `SUMSUB_APP_TOKEN` / `SUMSUB_SECRET_KEY` | Sumsub sandbox |
| `RESEND_API_KEY` | resend.com |
| `ODDS_API_KEY` | the-odds-api.com (free tier ok for dev) |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Email for withdrawal alerts |

### 3. Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run

```bash
npm run dev
```

### 5. Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## Project structure

```
src/
  app/
    (marketing)/             # public pages
      planuri/                  # plans + checkout
      calculators/              # 9 calculators
      discord/                  # community
      contact/                  # contact form
      regulile / faq / clasament / afiliere / live-odds / ...
    (dashboard)/dashboard/    # protected pages (Supabase guard)
    api/
      auth/                   # supabase oauth callback / logout
      stripe/                 # checkout + webhook
      kyc/                    # sumsub token + webhook
      pariuri/ retrageri/ statistici/ clasament/ afiliere/
      cron/settle-bets/       # vercel-cron protected settler
      odds/live/              # cached odds proxy
      contact/                # contact form receiver
    autentificare/            # login / register / reset
    layout.tsx                # global metadata + JSON-LD
    sitemap.ts / robots.ts
  components/
    sections/                 # home page sections
    calculators/              # CalculatorShell
    ui/
  lib/
    stripe.ts                 # plans, prices, mode rules
    odds-api.ts               # the-odds-api wrapper
    email.ts                  # resend helpers
    prisma.ts / supabase.ts / rateLimiter.ts / odds.ts / utils.ts
prisma/schema.prisma          # 9 models, 5 enums
vercel.json                   # cron schedule
```

## Cron / Settle engine

`/api/cron/settle-bets` runs every 10 min via Vercel Cron. It pulls open `Pariu`s, fetches scores from The Odds API, settles outcomes with `decimal.js`, updates `ContTrader.capitalCurent`, advances/rejects accounts based on `RegulaCont` rules.

Manual run:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/settle-bets
```

## Deploy (Vercel)

```bash
vercel
```

Set env vars in Vercel dashboard. Wire production webhook URLs:

- **Stripe** → `https://yourdomain.com/api/stripe/webhook`
- **Sumsub** → `https://yourdomain.com/api/kyc/webhook`
- **Supabase** → add your domain to Authentication → URL Configuration

## License

Proprietary — © SuperFunded SRL.
