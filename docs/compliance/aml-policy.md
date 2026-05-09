> **DRAFT — NU CONSTITUIE CONSULTANȚĂ JURIDICĂ. Necesită revizuire de către avocat român specializat în iGaming.**

# AML / KYC Policy — SuperFunded

**Versiune:** 0.1 (draft pre-counsel)
**Aplică:** entitatea operatoare SuperFunded SRL
**Cadru legal de referință:** Legea 129/2019 cu modificările ulterioare,
Directivele UE 2015/849 (AMLD4), 2018/843 (AMLD5), 2024/1640 (AMLR — în
implementare), recomandările FATF.

---

## 1. Roluri și responsabilități

| Rol                              | Persoană / mod                                         |
|----------------------------------|--------------------------------------------------------|
| Ofițer de conformitate AML (MLRO) | TBD — numit prin decizie internă înainte de launch      |
| Backup MLRO                      | TBD                                                    |
| DPO (responsabil cu protecția datelor) | dpo@superfunded.ro                                |
| Echipa KYC                       | externalizată la Sumsub + analist intern (manual review)|
| Audit AML                        | extern, anual                                          |

**Documentare obligatorie**: numirea MLRO se face prin decizie scrisă semnată de
administrator, în două exemplare, înregistrată în registrul intern de decizii.

---

## 2. Niveluri de KYC (Sumsub levels)

Mapare 1:1 cu nivelele Sumsub configurate în consolă (`L0` … `L3`).

### L0 — Vizitator anonim

- Drepturi: vedere generală, simulator, content marketing.
- Date colectate: IP, user agent, cookies (cu consimțământ).
- Praguri: 0 EUR.

### L1 — Cont creat (email + parolă)

- Drepturi: explorare dashboard, achiziție challenge, plată Stripe (3DS obligatoriu).
- Date: email, hash parolă, telefon (opțional), IP, fingerprint device.
- Verificări: `email_verified` Supabase, OTP telefon dacă există.
- Praguri: depunere maxim 500 EUR cumulat înainte de L2.

### L2 — KYC standard (Sumsub Standard)

- Cerut: înainte de prima retragere SAU la atingerea pragului 500 EUR cumulat.
- Documente: CI / pașaport în vigoare, selfie liveness, geo-IP coerent cu țara
  declarată.
- Verificări automate Sumsub: OCR, MRZ, screening PEP/sancțiuni, face-match.
- Manual review în 4-24h pentru cazurile flag-uite.
- Praguri retragere: maxim 5.000 EUR / 30 zile.

### L3 — KYC enhanced (Sumsub Enhanced + dovadă fonduri)

- Cerut: la cumulat retragere ≥ 5.000 EUR în 30 zile, sau la PEP, sau la trigger AML R03/R11.
- Documente suplimentare: dovada adresei (utility bill ≤ 3 luni), dovada sursei
  fondurilor / income (extras bancar, fluturaș, decizie ANAF).
- Manual review obligatoriu de către MLRO.
- Praguri retragere: nelimitate, dar fiecare tranzacție ≥ 10.000 EUR declanșează CTR la ONPCSB.

---

## 3. Reguli de monitorizare tranzacții

Sursa de adevăr: `src/lib/aml/rules.ts` (R01-R12). Workerul de monitoring (de implementat în
faza 2) consumă tabela `Ledger` și, atunci când o regulă fire-uiește, creează:

1. Un `AlertAML` (model Prisma de adăugat în PR ulterior) cu rule_id, evidence JSON, status.
2. O acțiune automată conform `action`: hold pe withdrawal, block user, sau notificare MLRO.

**Toate alertele R-tier `sar` și `sar_24h` sunt revizuite manual de MLRO în maxim 12h.**

---

## 4. SAR (Suspicious Activity Report) — procedură

1. **Trigger**: alertă auto sau raportare manuală (staff prin formular intern).
2. **Triaj** (≤ 6h): MLRO analizează evidence, decide: dismiss / continue.
3. **Decizie SAR** (≤ 24h pentru `sar_24h`, ≤ 5 zile lucrătoare pentru `sar`):
   - Drafting raport cu date utilizator, tranzacții, justificare.
   - Verificare cu legal counsel pentru cazuri border-line.
4. **Submisie ONPCSB**: prin platforma electronică AS-RTS (https://onpcsb.ro/raportari).
   Codul de operator AML primit la înregistrarea entității raportoare.
5. **Tipping-off ban**: NU se notifică utilizatorul — Art. 27 din Legea 129/2019. Eventualul
   delay de retragere se justifică pe motiv generic „verificări suplimentare în curs”.
6. **Arhivare**: rapoarte și evidence păstrate 5 ani în storage criptat, acces doar MLRO și auditor.

**Praguri și deadline-uri legale**:

| Tip raportare                          | Prag         | Deadline                    |
|----------------------------------------|--------------|-----------------------------|
| Tranzacție în numerar (CTR)            | ≥ 10.000 EUR | 10 zile lucrătoare          |
| Tranzacție electronică ≥ prag          | ≥ 15.000 EUR | 10 zile lucrătoare          |
| Tranzacție suspectă (RTS)              | orice sumă   | 24h de la suspiciune        |
| Refuz de a executa tranzacție suspectă | orice sumă   | imediat, înainte de execuție |

---

## 5. Înregistrarea ca entitate raportoare

Înainte de launch:

- [ ] Înregistrare la ONPCSB ca entitate raportoare (formular online).
- [ ] Numire MLRO prin decizie internă, transmisă la ONPCSB.
- [ ] Procedură internă AML scrisă, semnată de administrator (acest document, post-counsel).
- [ ] Training intern obligatoriu (4 ore) pentru toți angajații care interacționează cu utilizatori.
- [ ] Programare audit extern AML — anul 1 după launch.

---

## 6. Auditare și revizuire

- **Anual**: review complet al politicii cu legal counsel + auditor.
- **Trimestrial**: review intern al alertelor și SAR-urilor (KPI: timp de triaj, % SAR confirmate).
- **Ad-hoc**: la fiecare modificare legislativă (AMLR UE, modificări Legea 129/2019).

---

## 7. KPI și raportare internă

- `% utilizatori L2 / L3` (target 100% la prima retragere).
- `Timp mediu de aprobare KYC` (target < 4h).
- `% alerte AML triaged < 12h` (target > 95%).
- `# SAR-uri raportate / trimestru`.
- `# tipping-off incidents` (target 0 — incident escaladat la administrator).

---

*Notă: acest document urmează a fi revizuit obligatoriu de avocatul de iGaming înainte
de a fi semnat ca politică oficială și depus la ONPCSB.*
