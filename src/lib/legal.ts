/**
 * Single source of truth for skill-evaluation legal language.
 * Reuse these constants in disclaimer modals, T&C, register, emails — so the wording
 * stays consistent and is easy to update if legal counsel changes it.
 */

export const ENTITY_NAME      = 'SuperFunded SRL';
export const ENTITY_COUNTRY   = 'România';
export const ENTITY_CUI       = 'RO00000000'; // TODO: replace with real CUI after registration
export const ENTITY_REG_NO    = 'J40/0/0000'; // TODO: replace with Reg. Com.
export const ENTITY_ADDRESS   = 'București, România';
export const SUPPORT_EMAIL    = 'support@superfunded.ro';
export const GDPR_EMAIL       = 'gdpr@superfunded.ro';
export const RESPONSIBLE_GAMBLING_URL = 'https://www.jocresponsabil.ro';
export const TEL_VERDE        = '0800 800 099';

export const SKILL_EVAL_DISCLAIMER = {
  short:
    'SuperFunded este o platformă de evaluare a abilităților sportive. Capitalul este virtual; pick-urile sunt simulate pentru testarea aptitudinilor de analiză.',

  full: [
    'SuperFunded este o platformă de evaluare a abilităților sportive — NU este operator de jocuri de noroc, nu este casă de pariuri și nu deține licență ONJN.',
    'Toate sumele afișate ca "capital", "bankroll" sau "câștig" sunt VIRTUALE. Userii NU plasează pariuri cu bani reali pe platformă.',
    'Taxa unică plătită reprezintă plata pentru accesul la programul de evaluare a abilităților, nu o miză.',
    'Plățile primite la final reprezintă PREMII pentru performanța demonstrată în evaluare, nu câștiguri din pariuri.',
    'Datele despre meciuri și cote sunt furnizate de surse terțe (The Odds API, ESPN, Yahoo Sports) și sunt folosite exclusiv pentru evaluarea abilităților, nu pentru pariere reală.',
    'Vârsta minimă: 18 ani. Joc responsabil — resurse la jocresponsabil.ro și telefon 0800 800 099.',
  ] as const,

  checkout:
    'Achiziționezi acces la o platformă de evaluare a abilităților sportive. Capitalul este virtual; nu plasezi pariuri cu bani reali. Plățile primite la final sunt premii pentru performanță, nu câștiguri din jocuri de noroc.',

  register:
    'Confirm că înțeleg: SuperFunded este platformă de evaluare a abilităților, NU casă de pariuri. Capitalul este virtual și picks-urile sunt simulate.',

  dashboard:
    '🎓 Capital virtual · Skill evaluation · Pick-urile sunt simulate pentru testarea abilităților.',

  email_footer:
    'SuperFunded este platformă de evaluare a abilităților sportive (skill evaluation), nu operator de jocuri de noroc.',
} as const;
