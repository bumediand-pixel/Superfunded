/**
 * Local dev seed — creates 5 demo users with various account states.
 * Run with: `npx prisma db seed` (after configuring "prisma": { "seed": "tsx prisma/seed.ts" } in package.json)
 *           or directly: `npx tsx prisma/seed.ts`
 *
 * Idempotent: re-runs upsert by email.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // 1. Demo users
  const users = await Promise.all([
    upsertUser('demo-funded@thesuperfunded.com',  'Andrei Demo',     'APROBAT'),
    upsertUser('demo-faza1@thesuperfunded.com',   'Maria Faza1',     'APROBAT'),
    upsertUser('demo-respins@thesuperfunded.com', 'Tom Respins',     'NEVERIFICAT'),
    upsertUser('demo-affiliate@thesuperfunded.com','Cristina Affiliate','APROBAT'),
    upsertUser('admin@thesuperfunded.com',        'Admin Demo',      'APROBAT'),
  ]);
  console.log(`✓ ${users.length} users`);

  // 2. Accounts
  const fundedAccount = await prisma.contTrader.upsert({
    where: { stripeSessionId: 'seed_session_funded' },
    update: {},
    create: {
      utilizatorId: users[0].id,
      plan: 'ADVANCED_10000',
      capitalInceput: 10000, capitalCurent: 11420,
      statusEvaluare: 'FINANTAT', fazaCurenta: 2,
      profitTotal: 1420, tranzactiiTotal: 47,
      dataStart: new Date(Date.now() - 90 * 86400000),
      dataFinalizare: new Date(Date.now() - 35 * 86400000),
      stripeSessionId: 'seed_session_funded',
      reguli: { create: [
        { numeFaza: 'Faza 1', targetProfit: 3000, maxPierdere: 800, maxZilnic: 500, zileMinime: 0, completata: true },
        { numeFaza: 'Faza 2', targetProfit: 2000, maxPierdere: 800, maxZilnic: 500, zileMinime: 0, completata: true },
      ] },
    },
  });

  const evalAccount = await prisma.contTrader.upsert({
    where: { stripeSessionId: 'seed_session_eval' },
    update: {},
    create: {
      utilizatorId: users[1].id,
      plan: 'BASIC_1000',
      capitalInceput: 1000, capitalCurent: 1180,
      statusEvaluare: 'FAZA_1', fazaCurenta: 1,
      profitTotal: 180, tranzactiiTotal: 12,
      dataStart: new Date(Date.now() - 8 * 86400000),
      stripeSessionId: 'seed_session_eval',
      reguli: { create: [
        { numeFaza: 'Faza 1', targetProfit: 300, maxPierdere: 80, maxZilnic: 50, zileMinime: 0 },
        { numeFaza: 'Faza 2', targetProfit: 200, maxPierdere: 80, maxZilnic: 50, zileMinime: 0 },
      ] },
    },
  });

  await prisma.contTrader.upsert({
    where: { stripeSessionId: 'seed_session_respins' },
    update: {},
    create: {
      utilizatorId: users[2].id,
      plan: 'STARTER_500',
      capitalInceput: 500, capitalCurent: 420,
      statusEvaluare: 'RESPINS', fazaCurenta: 1, activ: false,
      profitTotal: 0, tranzactiiTotal: 8,
      dataStart: new Date(Date.now() - 35 * 86400000),
      dataFinalizare: new Date(Date.now() - 5 * 86400000),
      stripeSessionId: 'seed_session_respins',
      reguli: { create: [
        { numeFaza: 'Faza 1', targetProfit: 150, maxPierdere: 40, maxZilnic: 25, zileMinime: 0 },
      ] },
    },
  });
  console.log('✓ 3 accounts (funded, faza1, respins)');

  // 3. Some bets
  await prisma.pariu.createMany({
    data: [
      { utilizatorId: users[0].id, contId: fundedAccount.id, sport: 'basketball_nba',  eveniment: 'Lakers vs Celtics', piata: 'Moneyline', selectie: '1', cota: 1.85, suma: 200, potentialCastig: 370, statusPariu: 'CASTIGAT', castigSauPierdere: 170, dataRezultat: new Date(Date.now() - 2*86400000) },
      { utilizatorId: users[0].id, contId: fundedAccount.id, sport: 'soccer_epl',      eveniment: 'Arsenal vs Man City', piata: 'Moneyline', selectie: '2', cota: 2.10, suma: 150, potentialCastig: 315, statusPariu: 'PIERDUT',  castigSauPierdere: -150, dataRezultat: new Date(Date.now() - 1*86400000) },
      { utilizatorId: users[1].id, contId: evalAccount.id,   sport: 'tennis_atp_french_open', eveniment: 'Sinner vs Alcaraz', piata: 'Moneyline', selectie: '1', cota: 1.95, suma: 30,  potentialCastig: 58.5, statusPariu: 'DESCHIS' },
    ],
    skipDuplicates: true,
  });
  console.log('✓ 3 demo bets');

  // 4. One processed withdrawal
  await prisma.retragere.create({
    data: { utilizatorId: users[0].id, suma: 800, metodaPlata: 'TRANSFER_BANCAR', detaliiPlata: { iban: 'RO**' }, status: 'PROCESAT', procesatLa: new Date(Date.now() - 7*86400000) },
  });

  // 5. Affiliate
  await prisma.afiliat.upsert({
    where: { utilizatorId: users[3].id },
    update: {},
    create: { utilizatorId: users[3].id, codReferral: 'CRISTINA42' },
  });

  console.log('🌱 Seed complete.');
}

async function upsertUser(email: string, numeComplet: string, statusKYC: 'NEVERIFICAT'|'IN_ASTEPTARE'|'APROBAT'|'RESPINS') {
  return prisma.utilizator.upsert({
    where: { email },
    update: { numeComplet, statusKYC },
    create: { supabaseId: `seed_${email}`, email, numeComplet, statusKYC, tara: 'RO' },
  });
}

main().catch(err => { console.error(err); process.exit(1); }).finally(async () => prisma.$disconnect());
