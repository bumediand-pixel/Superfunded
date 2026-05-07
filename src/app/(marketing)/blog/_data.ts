export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;       // markdown-ish
  category: string;
  emoji: string;
  color: string;      // hex used for card gradient + category label
  date: string;       // ISO short
  readMin: number;
};

export const POSTS: Post[] = [
  {
    slug: 'kelly-criterion-explicat',
    title: 'Kelly Criterion explicat pe înțelesul oricărui picker funded',
    excerpt: 'De ce stake-ul fix nu e niciodată optim, cum calculezi Kelly și de ce half-Kelly e standardul industriei.',
    body: `# Kelly Criterion explicat

Bankroll management-ul e diferența dintre pickerii funded și cei care își ard contul în prima săptămână. **Kelly Criterion** îți spune procentul optim din bankroll de pus pe fiecare pick, ținând cont de edge-ul tău real.

## Formula

\`\`\`
f* = (b·p - q) / b
\`\`\`

unde:
- \`b\` = cota decimal − 1 (profitul net pe €1 stake)
- \`p\` = probabilitatea ta estimată să câștigi
- \`q\` = 1 − p

## Exemplu

Cotă 2.10, tu estimezi 55% șanse să câștigi:
- b = 1.10, p = 0.55, q = 0.45
- f* = (1.10 × 0.55 − 0.45) / 1.10 = **0.14 → 14% din bankroll**

## De ce half-Kelly

Full-Kelly maximizează creșterea geometrică pe termen lung, dar variance-ul e brutal — drawdown-uri de 50% sunt normale. **Half-Kelly** păstrează ~75% din creștere cu jumătate din volatilitate. Pentru conturile funded cu 8% drawdown limit, mai bine **quarter-Kelly**.

## Folosește calculatorul

[/calculators/kelly](/calculators/kelly)`,
    category: 'Strategie',
    emoji: '📐',
    color: '#E63946',
    date: '2026-04-28',
    readMin: 6,
  },
  {
    slug: 'bankroll-management-funded',
    title: 'Bankroll management pe cont funded: 5 reguli care nu se negociază',
    excerpt: 'Drawdown-ul te elimină mai rapid decât o serie de loss-uri. Iată cum supraviețuiesc pickerii funded.',
    body: `# Bankroll management pe cont funded

Pe cont funded, **drawdown-ul e regele**. O serie de 4 loss-uri consecutive cu stake 5% îți consumă 20% din capital — dincolo de pragul de 8%. Iată regulile.

## 1. Stake fix sau Kelly fracționar — niciodată gut feeling

Stabilește o regulă matematică și respect-o. *Toate* pickurile mai mari decât regula sunt tilt.

## 2. Max 3 picks pe zi

Dacă pierzi 3, oprește. A 4-a decizie e emoțională.

## 3. Daily loss limit la 50% din pragul oficial

Dacă regulile platformei spun max 5%/zi, *tu* oprești la 2.5%. Marja de siguranță previne game-over-ul accidental.

## 4. Pick journal cu motiv pentru fiecare pick

Scrie *de ce* pui pickul *înainte* să-l plasezi. Reciți la sfârșitul săptămânii. Vei recunoaște tilt-ul.

## 5. Nu pune middle-uri sau hedge-uri "creative" în primele 30 zile

Concentrează-te pe edge clar pe markets pe care le cunoști. Optimizările vin după ce ai un track record.`,
    category: 'Strategie',
    emoji: '🛡️',
    color: '#15803d',
    date: '2026-04-21',
    readMin: 5,
  },
  {
    slug: 'cum-citesti-cotele',
    title: 'Cum citești cotele: American vs Decimal vs Fracțional',
    excerpt: 'Conversie rapidă între formate, de ce Pinnacle e benchmark-ul și cum identifici value bet-urile.',
    body: `# Formate de cote, decodate

În SUA folosesc American (\`+150 / -200\`), în Europa Decimal (\`2.50\`), în UK Fracțional (\`3/2\`). Toate spun același lucru — doar exprimat diferit.

## Conversii cheie

| American | Decimal | Implied Prob |
|----------|---------|--------------|
| +100     | 2.00    | 50%          |
| +150     | 2.50    | 40%          |
| +200     | 3.00    | 33.3%        |
| -110     | 1.91    | 52.4%        |
| -150     | 1.67    | 60%          |
| -200     | 1.50    | 66.7%        |

## Pinnacle ca benchmark

Pinnacle are cel mai mic vig (~2-3%). Cota lor pe un meci = "preț corect" + foarte puțină marjă. Comparat cu alte caziere, dacă găsești cote *mai mari* la altul, ai un value bet potențial.

## Calculator

[/calculators/moneyline-converter](/calculators/moneyline-converter)`,
    category: 'Educație',
    emoji: '📊',
    color: '#2563eb',
    date: '2026-04-14',
    readMin: 4,
  },
  {
    slug: 'nba-props-playbook',
    title: 'NBA Player Props: cum identifici edge-ul în 5 minute pe meci',
    excerpt: 'Pace, defensive matchups, minute trends — cele 3 metrici care contează pentru props.',
    body: `# NBA Player Props playbook

Player props (puncte, asisturi, recuperări) sunt cele mai exploatabile mărci în NBA. Casele de pariuri publică sute de linii pe noapte — imposibil să le sharp-uiască pe toate.

## 1. Pace check

Pace-ul echipei (posesiuni/48 min) determină volume. Sacramento (~103) creează mai multe posesii decât Memphis (~96) — props peste 0.5+ vor fi mai ușor de hit într-un meci high-pace.

## 2. Defensive matchup

DRTG vs poziție. Un point guard vs Indiana (defensive PG rating 28th) merge over puncte mult mai des decât vs OKC (defensive PG rating 1st).

## 3. Minutes trend

Last-5 minutes played. Dacă LeBron face 38, 36, 41, 39, 37 minute, linia 30+ puncte e gata. Dacă a făcut 28, 32, 22 — fereste.

## Edge real în 2 click-uri

Kelly + ROI Simulator pe [/calculators](/calculators) — vezi exact câte stake-uri să pui pe propul ăsta.`,
    category: 'NBA',
    emoji: '🏀',
    color: '#ea580c',
    date: '2026-04-07',
    readMin: 7,
  },
];
