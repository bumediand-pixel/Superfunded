export const ENTITY_NAME      = 'TheSuperFunded Ltd.';
export const ENTITY_COUNTRY   = 'Cipru';
export const ENTITY_REG_NO    = 'HE [de completat]';
export const ENTITY_VAT       = 'CY [de completat]';
export const ENTITY_CUI       = ENTITY_VAT;
export const ENTITY_ADDRESS   = '[Strada], [Cod poștal] Limassol, Cipru';
export const ENTITY_CAEN      = 'NACE 62.01 — Computer programming activities';
export const SITE_URL         = 'https://thesuperfunded.com';
export const SUPPORT_EMAIL    = 'support@thesuperfunded.com';
export const GDPR_EMAIL       = 'gdpr@thesuperfunded.com';
export const AFFILIATE_EMAIL  = 'afiliere@thesuperfunded.com';
export const RESPONSIBLE_GAMBLING_URL = 'https://www.jocresponsabil.ro';
export const TEL_VERDE        = '0800 800 099';
export const DISCORD_INVITE   = process.env.NEXT_PUBLIC_DISCORD_INVITE || 'https://discord.gg/superfunded';

export const LEGAL_FRAMEWORK = {
  governingLaw: 'Legislația Republicii Cipru',
  forum: 'Instanțele competente din Limassol, Cipru',
  romanianGamblingAct: 'OUG nr. 77/2009 (legislație românească privind jocurile de noroc)',
  cyprusBettingAct: 'Cyprus Betting Law N. 37(I)/2019',
  romaniaExemption: [
    'TheSuperFunded Ltd. este o entitate juridică înregistrată în Republica Cipru, NU în România.',
    'Activitatea principală a societății — servicii de evaluare a abilităților analitice sportive (NACE 62.01) — NU se încadrează în definiția jocurilor de noroc nici sub legislația cipriotă (Cyprus Betting Law N. 37(I)/2019), nici sub OUG 77/2009 română.',
    'TheSuperFunded NU este destinată exclusiv utilizatorilor români, NU desfășoară activități de marketing direcționate către teritoriul României și NU acceptă mize în sensul OUG 77/2009.',
    'ONJN (Oficiul Național pentru Jocuri de Noroc — România) NU are competență teritorială asupra TheSuperFunded Ltd., entitate juridică cipriotă.',
  ] as const,
  cyprusExemption: [
    'Sub Cyprus Betting Law N. 37(I)/2019, "betting" presupune plasarea unei mize pe rezultatul unui eveniment, cu posibilitatea de câștig sau pierdere a mizei.',
    'TheSuperFunded NU acceptă mize. Taxa de evaluare este o contraprestație fixă pentru un serviciu de evaluare, achitată indiferent de rezultat. Capitalul utilizat este virtual.',
    'Activitatea este analoagă prop firms-urilor de trading financiar (FTMO, FundedNext etc.), modele recunoscute internațional drept servicii de evaluare a abilităților, NU jocuri de noroc.',
  ] as const,
} as const;

export const SKILL_EVAL_DISCLAIMER = {
  short:
    'TheSuperFunded Ltd. (Cipru) este platformă de evaluare a abilităților analitice sportive. NU este operator de jocuri de noroc. Capitalul este virtual; taxa NU constituie miză; premiile sunt recompense pentru performanță demonstrată.',

  full: [
    'TheSuperFunded Ltd. este o societate înregistrată în Republica Cipru, operând o platformă de evaluare a abilităților analitice sportive — NU este operator de jocuri de noroc, nu este casă de pariuri, nu este cazino și NU deține (și nu necesită) licență ONJN sau autorizație Cyprus Gaming Commission.',
    'Toate sumele afișate ca "capital", "bankroll" sau "profit demonstrat" sunt VIRTUALE. Utilizatorii NU plasează pariuri cu bani reali pe platformă și NU mizează propriii bani pe rezultatele evenimentelor sportive.',
    'Taxa unică plătită reprezintă contraprestația pentru accesul la programul de evaluare a abilităților analitice. Este o taxă fixă, predeterminată, care NU variază în funcție de un eventual câștig potențial. NU constituie miză.',
    'Performanța utilizatorului este evaluată pe baza unor criterii cuantificabile de abilitate (ROI ponderat, consistență, respectarea regulilor de management al riscului), nu pe baza norocului.',
    'Plățile primite de utilizatorii care trec evaluarea reprezintă PREMII pentru performanța analitică demonstrată, plătite în baza unui contract de prestări servicii, NU câștiguri din jocuri de noroc.',
    'Datele despre meciuri și cote sunt furnizate de surse terțe (The Odds API, ESPN, Yahoo Sports) și sunt folosite EXCLUSIV ca input pentru evaluarea abilităților analitice, NU pentru pariere reală.',
    'Acordul este guvernat de legislația cipriotă. Vârsta minimă: 18 ani.',
  ] as const,

  checkout:
    'Achiziționezi acces la un program de evaluare a abilităților analitice sportive furnizat de TheSuperFunded Ltd. (Cipru). NU plasezi pariuri cu bani reali; nu mizezi; nu joci jocuri de noroc.',

  register:
    'Confirm că înțeleg: TheSuperFunded Ltd. (Cipru) este platformă de evaluare a abilităților analitice, NU casă de pariuri sau operator de jocuri de noroc. Capitalul este virtual. Taxa NU constituie miză.',

  dashboard:
    'Capital virtual · Evaluare abilități analitice · Pick-urile sunt analize simulate — NU pariuri cu bani reali.',

  email_footer:
    'TheSuperFunded Ltd. — societate cipriotă (NACE 62.01). Platformă de evaluare a abilităților analitice sportive, NU operator de jocuri de noroc.',
} as const;
