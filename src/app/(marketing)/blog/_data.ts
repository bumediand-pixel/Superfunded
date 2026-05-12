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
  /* ─── SEO-driven longform articles (added May 2026) ─── */
  {
    slug: 'cont-finantat-pariuri-sportive-ce-este',
    title: 'Cont finanțat pentru pariuri sportive: ce este, cum funcționează, cât câștigi',
    excerpt: 'Ghidul complet 2026 al conturilor finanțate sportive: cum decurge evaluarea, ce procent din profit păstrezi, plus comparație cu pariere clasică.',
    body: `# Cont finanțat pentru pariuri sportive: ghid complet 2026

Un **cont finanțat** (engl. *funded account*) e o aplicație a modelului „prop firm" — folosit istoric în trading-ul de acțiuni — adaptată la pick-uri sportive. Ideea simplă: firma îți pune capitalul, tu pui abilitatea analitică, profitul se împarte.

## Cum decurge concret

1. **Cumperi o evaluare** (taxă unică, €17 până la €1.249 funcție de mărimea contului)
2. **Demonstrezi abilități timp de 30 de zile** atingând o țintă de profit, fără să spargi limitele de drawdown
3. **Treci în cont finanțat** — păstrezi 70-80% din fiecare câștig viitor

E un model cu **risc limitat la taxa de intrare** pentru tine, iar firma își asumă riscul real de capital.

## Diferențele față de pariere clasică

|  | Pariere clasică | Cont finanțat |
|---|---|---|
| Capital | Banii tăi | Banii firmei |
| Pierdere maximă | Total bankroll | Taxa de evaluare |
| Câștig | 100% pentru tine | 70-80% (split) |
| Reglementare | ONJN (operator gambling) | Serviciu de evaluare skill |

## Ce capital primești în general

| Tier | Taxă evaluare | Capital finanțat |
|---|---|---|
| €500 bankroll | €17-19 | €500 |
| €5.000 bankroll | €154-205 | €5.000 |
| €50.000 bankroll | €944-1.249 | €50.000 |

Cu cât mărimea contului e mai mare, cu atât pretențiile țintei de profit sunt mai relaxate (proporțional).

## E pentru tine?

- ✅ DA dacă: ai un edge analitic real, vrei să paviezi mărit fără capital propriu, ești confortabil cu reguli stricte de risc.
- ❌ NU dacă: pariezi pe „gut feel", nu te conformezi la reguli stricte, vrei câștiguri instant.

## Următorul pas

Vezi [planurile](/planuri) sau citește [regulile complete](/regulile).`,
    category: 'Ghid',
    emoji: '📚',
    color: '#3b82f6',
    date: '2026-05-10',
    readMin: 8,
  },
  {
    slug: 'prop-firm-pariuri-romania-2026',
    title: 'Prop firm pariuri în România: starea industriei în 2026',
    excerpt: 'De ce conturile finanțate sportive sunt în creștere explozivă în România, ce reglementare le acoperă (sau nu), top operatori.',
    body: `# Prop firm pariuri în România: starea industriei în 2026

Industria conturilor finanțate sportive (prop firm pentru pick-uri) a explodat global în 2024-2026, copiată din modelul prop trading. Articolul ăsta îți dă harta industriei în România.

## De ce a explodat acum

1. **ONJN nu reglementează skill-evaluation services** — operatorii nu sunt operatori de jocuri de noroc clasici
2. **Apetit pentru capital de pariat fără riscul propriu** — pickerii experimentați nu au întotdeauna €10.000 cash dar au edge
3. **Stripe + crypto** au făcut plățile internaționale ușoare

## Reglementarea — situația ONJN

Operatorii de cont finanțat sportiv (TheSuperFunded, TheFundedPick.com, ProphetX, etc.) se autoclasifică drept **furnizori de servicii de evaluare a abilităților sportive**, nu operatori de jocuri de noroc. Argumentele:

- Utilizatorii **nu pariază bani proprii** pe rezultate sportive (taxa de evaluare e fixă, ne-corelată cu rezultatul)
- Activitățile din evaluare sunt **simulări** (puncte virtuale, nu lei reali)
- Recompensele din cont finanțat sunt **plăți pentru atingerea unor obiective de performanță**, nu câștiguri din pariuri

ONJN nu a emis până acum (mai 2026) o poziție publică explicită contra modelului. Recomandare: dacă lansezi un astfel de serviciu, consultă avocatul.

## Cum alegi un prop firm

- **Split de profit**: minim 70% pentru tine
- **Drawdown maxim**: max 8% pe cont (peste = restrictiv)
- **Retrageri**: săptămânale, sub 48h procesare
- **Surse de cote**: agregator real (The Odds API, SportRadar), nu cote inventate
- **Stripe + crypto** ca metode de plată
- **Reviewuri Trustpilot** peste 4.0

## TheSuperFunded vs concurența

Vezi [comparația detaliată cu TheFundedPick.com](/blog/superfunded-vs-thefundedpick).`,
    category: 'Industrie',
    emoji: '🇷🇴',
    color: '#16a34a',
    date: '2026-05-08',
    readMin: 7,
  },
  {
    slug: 'cum-treci-faza-1-fara-stres',
    title: 'Cum treci Faza 1 a unui challenge funded fără să-ți pierzi mințile',
    excerpt: 'Cu €10.000 bankroll și 30% target, ai nevoie de €3.000 profit. Ghidul tactic complet, pe zile.',
    body: `# Cum treci Faza 1 a unui challenge funded fără să-ți pierzi mințile

Faza 1 a unui challenge 2-Step: **30% profit în 30 zile**, fără să spargi 8% drawdown total sau 5% drawdown zilnic. Pe un €10.000 cont, ținta e €3.000.

## Matematica simplă

€3.000 profit din €10.000 = 30% growth. Dacă pariezi flat-stake 2% (€200) la cota medie 1.85 cu win rate 55%, profitul așteptat per pick:
- EV = 0.55 × €170 (profit) − 0.45 × €200 (loss) = **+€3.50 per pick**

Pentru €3.000, ai nevoie de ~857 picks. **Nerezonabil în 30 zile.**

## Soluția: stake-uri mai mari + edge mai bun

- **Stake 4% (€400)**, win rate 60% pe markets nișă pe care le cunoști
- EV per pick = €60
- Pentru €3.000 → 50 picks → **2 picks/zi → 25 zile, marja**

## Tactica per săptămână

**Săpt 1 — așezare**
- 1-2 picks/zi, doar markets cu edge clar
- Target săptămânal: +8%
- Dacă -3%, oprești toată ziua

**Săpt 2 — accelerare**
- 2-3 picks/zi
- Target săptămânal: +10%
- Cumulat: +18% (€1.800)

**Săpt 3 — închidere**
- 2-3 picks/zi, stake-uri ușor crescute (5%)
- Target: +12%
- Cumulat: +30%

**Săpt 4 — buffer**
- Dacă ai trecut deja: oprești complet, nu mai riști
- Dacă mai ai 3-5%: pariezi MINIM (1-2%) doar pe stratosafe edge

## Greșelile fatale de evitat

1. **Double-down după loss** — îți consumă drawdown-ul în 2 zile
2. **Pariuri live impulsive** — te urci în 0.1 secunde fără edge calculat
3. **Pariuri pe sport pe care nu-l cunoști** — variance random > edge

## Folosește instrumentele

[Calculator Kelly](/calculators/kelly) + [ROI Simulator](/calculators/roi-simulator) — calculează exact câte picks/zi îți trebuie.`,
    category: 'Strategie',
    emoji: '🎯',
    color: '#E63946',
    date: '2026-05-05',
    readMin: 9,
  },
  {
    slug: 'superfunded-vs-thefundedpick',
    title: 'TheSuperFunded vs TheFundedPick.com — comparație detaliată 2026',
    excerpt: 'Cele două mari prop firms sportive pe model european. Comparăm prețuri, target-uri, split, retrageri, reguli.',
    body: `# TheSuperFunded vs TheFundedPick.com — comparație 2026

Două dintre cele mai populare platforme de cont finanțat sportiv din Europa. Care e mai potrivită pentru tine?

## TL;DR

- **TheSuperFunded** = focus România/UE, în română, retrageri SEPA/crypto
- **TheFundedPick** = focus US/UK, în engleză, retrageri ACH/Wise

## Tabel comparativ

| | TheSuperFunded | TheFundedPick |
|---|---|---|
| Țintă profit 1-Step | 40% | 40% |
| Țintă profit 2-Step (Faza 1+2) | 30% + 20% | 30% + 20% |
| Drawdown total | 8% | 8% |
| Drawdown zilnic | 5% | 5% |
| Split 1-Step | 70% | 70% |
| Split 2-Step | 80% | 80% |
| Taxă €1k cont (1-Step) | €49 | $49 ≈ €45 |
| Taxă €10k cont (1-Step) | €390 | $390 ≈ €358 |
| Taxă €50k cont (1-Step) | €1.249 | $1.249 ≈ €1.146 |
| Plată crypto la intrare | ✅ USDT/BTC/ETH | ❌ doar card |
| Retrageri crypto | ✅ TRC-20 + BTC | ❌ doar Wise/ACH |
| Limbă | RO + EN | EN |
| Suport | Email + Discord 24/7 | Email + Telegram |
| Sporturi | 9 (EPL, NBA, ATP, MMA, etc.) | 9+ |

## Când alegi TheSuperFunded

- Vrei plată/retragere crypto (USDT TRC-20 = fee minim)
- Te simți confortabil cu interfața în română
- Ai cont bancar românesc (SEPA mai rapid decât SWIFT)
- Plată în EUR fără conversie

## Când alegi TheFundedPick

- Operezi global, plăți în USD
- Vrei un brand cu mai mult istoric (TFP există din 2023)
- Conturile mai mari ($100k+) — TFP are tiere mai mari

## Verdictul

Modelul de bază e identic — aceleași reguli, aceleași target-uri, aceleași split-uri. **Diferența reală**: TheSuperFunded acceptă crypto la intrare și retragere (fee minim, fără cont bancar), TheFundedPick are mai mult istoric.

Pentru un picker din România cu wallet USDT — TheSuperFunded e clar avantajos. Pentru cineva din SUA — TFP.`,
    category: 'Comparație',
    emoji: '⚖️',
    color: '#8b5cf6',
    date: '2026-05-09',
    readMin: 8,
  },
  {
    slug: 'taxe-pariuri-romania-2026',
    title: 'Impozitul pe câștiguri din pariuri în România 2026 — explicat clar',
    excerpt: 'Cum se impozitează câștigurile din cont finanțat sportiv vs câștigurile din pariere clasică. Ce declari, când, cum.',
    body: `# Impozitul pe câștiguri pariuri în România 2026

**Disclaimer**: nu suntem consultanți fiscali. Verifică cu un expert înainte de a depune declarația.

## 1. Câștiguri din pariere clasică (ONJN-licențiat)

Operatorii cu licență ONJN (Superbet, Betano, Unibet RO etc.) **rețin la sursă impozitul** — primești suma netă deja taxată. Procente:

- Câștig < 10.000 lei: 3%
- Câștig 10.000–66.750 lei: 300 lei + 20% peste 10k
- Câștig > 66.750 lei: 11.650 lei + 40% peste 66.750

Tu nu mai declari nimic — cazul rezolvat.

## 2. Câștiguri din cont finanțat sportiv

Aici e diferit. Plata primită din cont finanțat **NU e considerată câștig din pariere** (operatorul nu e licențiat ONJN ca sportsbook), ci venit din activitate independentă sau venit din alte surse.

Două scenarii:

### Scenariu A — Persoană fizică, venit ocazional

Pentru până la **12 salarii minime brute/an** (~€10.000), poți încadra ca **venit din alte surse**:
- Cota: **10% impozit pe venit**
- Plus **CASS 10%** dacă depășești 12 salarii minime brute cumulat (toate veniturile)
- Declar via **Declarația Unică** până pe 25 mai anul următor

### Scenariu B — PFA / SRL

Pentru pickeri funded la full-time:
- **PFA cu sistem real**: impozit 10% pe profit + 25% CAS + 10% CASS
- **SRL micro**: 1-3% pe venit (sub plafon) — cel mai avantajos peste €30k/an
- Recomandă-te cu un contabil

## Câștiguri în crypto

Dacă primești retragerea în USDT/BTC, **prețul EUR la momentul primirii** e venitul tău impozabil. Conversia ulterioară crypto-EUR în cont propriu e o tranzacție separată (capital gain/loss).

## Plata fiscală — pașii concreti

1. Ține un **registru de venituri**: data, sumă EUR, sumă lei (curs BNR), sursă
2. Până pe **25 mai**, completezi Declarația Unică (Cap. II, secțiunea „Alte surse")
3. Plătești în 4 rate sau integral

## Ce documente ceri din partea TheSuperFunded

Pentru audit:
- Confirmare scrisă a sumelor plătite + data
- Justificarea — „plată pentru serviciu de evaluare a abilităților sportive"
- IBAN-ul / wallet-ul pe care ai primit

Contactează-ne pe [/contact](/contact) — emitem oricând justificarea.`,
    category: 'Fiscalitate',
    emoji: '🧾',
    color: '#0284c7',
    date: '2026-05-03',
    readMin: 10,
  },
];
