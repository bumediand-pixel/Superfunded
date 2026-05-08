import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getScores, SPORTURI_DISPONIBILE, type ScoreEvent } from '@/lib/odds-api';
import { Decimal } from 'decimal.js';

/**
 * Settles open bets for all known sports.
 * Schedule via Vercel Cron (vercel.json) every 5 min, or hit manually:
 *   curl -H "Authorization: Bearer $CRON_SECRET" /api/cron/settle-bets
 *
 * Authoritative outcome rules (h2h-only for v1):
 *   - bet wins  → balance += suma * (cota - 1)
 *   - bet loses → balance -= suma
 *   - draw on h2h non-3way → returned as void (PUSH)
 * Phase rules are evaluated after balance updates: profit target hit → advance / fund;
 * max drawdown breached → reject account.
 */
export async function POST(req: NextRequest) {
  // Auth: cron-only secret. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Pull every open bet and group by sport so we fetch scores once per sport.
  const open = await prisma.pariu.findMany({ where: { statusPariu: 'DESCHIS' } });
  if (open.length === 0) return NextResponse.json({ settled: 0, message: 'no-op' });

  // Build a sport→scores map. We accept that `Pariu.sport` may store a label OR a sport_key;
  // we try every supported key for unknowns.
  const sportKeys = Array.from(new Set(open.map(b => b.sport)))
    .flatMap(s => {
      const direct = SPORTURI_DISPONIBILE.find(x => x.key === s || x.nume === s);
      return direct ? [direct.key] : SPORTURI_DISPONIBILE.map(x => x.key);
    });

  const scoreMap = new Map<string, ScoreEvent>();
  for (const key of new Set(sportKeys)) {
    const list = await getScores(key, 3);
    for (const ev of list) {
      scoreMap.set(`${ev.home_team}|${ev.away_team}`.toLowerCase(), ev);
    }
  }

  let settled = 0;
  let phaseChanges = 0;
  const touchedAccounts = new Set<string>();

  for (const bet of open) {
    // Try to match the event by team names embedded in `eveniment` (format: "Home vs Away")
    const m = bet.eveniment.match(/^(.*?)\s+(?:vs|v\.|—|-)\s+(.*)$/i);
    if (!m) continue;
    const [, home, away] = m;
    const ev = scoreMap.get(`${home.trim()}|${away.trim()}`.toLowerCase());
    if (!ev || !ev.completed || !ev.scores || ev.scores.length < 2) continue;

    const homeScore = parseInt(ev.scores.find(s => s.name === ev.home_team)?.score ?? '');
    const awayScore = parseInt(ev.scores.find(s => s.name === ev.away_team)?.score ?? '');
    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) continue;

    // Resolve outcome based on the market type (`piata`) + selection.
    const piata = bet.piata.toLowerCase();
    const sel   = bet.selectie.trim().toLowerCase();
    const total = homeScore + awayScore;
    const homeWin = homeScore > awayScore;
    const draw    = homeScore === awayScore;
    const awayWin = awayScore > homeScore;

    let outcome: 'WIN' | 'LOSS' | 'PUSH' | null = null;

    if (piata.includes('moneyline') || piata.includes('1x2') || piata.includes('h2h')) {
      // Moneyline / 1X2
      if (sel === '1' || sel === ev.home_team.toLowerCase()) outcome = homeWin ? 'WIN' : (draw ? 'PUSH' : 'LOSS');
      else if (sel === '2' || sel === ev.away_team.toLowerCase()) outcome = awayWin ? 'WIN' : (draw ? 'PUSH' : 'LOSS');
      else if (sel === 'x' || sel === 'draw' || sel === 'egal') outcome = draw ? 'WIN' : 'LOSS';
    } else if (piata.includes('over') || piata.includes('under') || piata.includes('total')) {
      // Over/Under — `selectie` formatted as "Over 2.5" / "Under 220.5"
      const m = sel.match(/(over|under)\s+(\d+(?:\.\d+)?)/i);
      if (m) {
        const dir = m[1].toLowerCase(); // over | under
        const line = parseFloat(m[2]);
        if (total > line)      outcome = dir === 'over'  ? 'WIN'  : 'LOSS';
        else if (total < line) outcome = dir === 'under' ? 'WIN'  : 'LOSS';
        else                   outcome = 'PUSH'; // exact line — push (return stake)
      }
    } else if (piata.includes('spread') || piata.includes('handicap')) {
      // Spread — `selectie` formatted as "Home -3.5" / "Away +7.5"
      const m = sel.match(/(home|away|1|2)\s+([+-]?\d+(?:\.\d+)?)/i);
      if (m) {
        const side = m[1].toLowerCase();
        const handicap = parseFloat(m[2]);
        const adjusted = (side === 'home' || side === '1')
          ? homeScore + handicap - awayScore
          : awayScore + handicap - homeScore;
        if (adjusted > 0)      outcome = 'WIN';
        else if (adjusted < 0) outcome = 'LOSS';
        else                   outcome = 'PUSH';
      }
    } else if (piata.includes('btts') || piata.includes('both teams')) {
      // Both Teams To Score — `selectie` is "Yes"/"No"
      const both = homeScore > 0 && awayScore > 0;
      if (sel === 'yes' || sel === 'da')      outcome = both ? 'WIN' : 'LOSS';
      else if (sel === 'no' || sel === 'nu')  outcome = both ? 'LOSS' : 'WIN';
    }

    if (outcome === null) continue; // unknown market — admin will resolve manually

    const stake = new Decimal(bet.suma);
    const odds  = new Decimal(bet.cota);
    let pnl: Decimal;
    let status: 'CASTIGAT' | 'PIERDUT' | 'ANULAT';
    if (outcome === 'WIN')      { pnl = stake.mul(odds.minus(1));  status = 'CASTIGAT'; }
    else if (outcome === 'LOSS'){ pnl = stake.neg();               status = 'PIERDUT';  }
    else                        { pnl = new Decimal(0);             status = 'ANULAT';   }

    await prisma.$transaction(async tx => {
      await tx.pariu.update({
        where: { id: bet.id },
        data: { statusPariu: status, castigSauPierdere: pnl.toNumber(), dataRezultat: new Date() },
      });
      const cont = await tx.contTrader.update({
        where: { id: bet.contId },
        data: {
          capitalCurent: { increment: pnl.toNumber() },
          profitTotal:   { increment: outcome === 'WIN' ? pnl.toNumber() : 0 },
          tranzactiiTotal:{ increment: 1 },
        },
      });
      touchedAccounts.add(cont.id);
    });

    settled++;
  }

  // After all bets settled, re-evaluate phase progress for every touched account.
  for (const contId of touchedAccounts) {
    const cont = await prisma.contTrader.findUnique({ where: { id: contId }, include: { reguli: true } });
    if (!cont || !cont.activ) continue;
    const startCap = cont.capitalInceput;
    const profit = cont.capitalCurent - startCap;
    const drawdown = startCap - cont.capitalCurent;

    // Drawdown breach → reject
    const maxAllowed = cont.reguli[0]?.maxPierdere ?? startCap * 0.08;
    if (drawdown > maxAllowed) {
      await prisma.contTrader.update({
        where: { id: cont.id },
        data: { statusEvaluare: 'RESPINS', activ: false, dataFinalizare: new Date() },
      });
      phaseChanges++;
      continue;
    }

    // Find the rule for the current phase
    const rule = cont.reguli.find(r => r.numeFaza === `Faza ${cont.fazaCurenta}`);
    if (!rule) continue;
    if (profit >= rule.targetProfit) {
      // Mark current rule as completed
      await prisma.regulaCont.update({ where: { id: rule.id }, data: { completata: true } });

      const totalPhases = cont.reguli.length;
      if (cont.fazaCurenta < totalPhases) {
        // Advance phase, reset capital relative to current level (TFP-style: keep gains, new target measured from now)
        await prisma.contTrader.update({
          where: { id: cont.id },
          data: { fazaCurenta: cont.fazaCurenta + 1, statusEvaluare: 'FAZA_2' },
        });
      } else {
        // Last phase done → fund the account
        await prisma.contTrader.update({
          where: { id: cont.id },
          data: { statusEvaluare: 'FINANTAT', dataFinalizare: new Date() },
        });
      }
      phaseChanges++;
    }
  }

  return NextResponse.json({ settled, phaseChanges, accountsTouched: touchedAccounts.size });
}

// Allow Vercel Cron's GET probe too
export const GET = POST;
