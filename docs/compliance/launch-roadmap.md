> **DRAFT — NU CONSTITUIE CONSULTANȚĂ JURIDICĂ. Necesită revizuire de către avocat român specializat în iGaming.**

# Launch Roadmap — Compliance & Risk

**Pornire:** Săptămâna 0 = 2026-05-09 (data acestui PR)
**Țintă launch limited beta (RO):** 2026-06-13 (S+5)
**Țintă launch public:** 2026-07-04 (S+8)

Roadmap-ul este modelat în „decision gates”: fiecare săptămână are un set de
livrabile și o întrebare cheie la care echipa trebuie să răspundă DA înainte de
a trece la săptămâna următoare. Răspunsul NU = STOP până la rezolvare.

---

## Săptămâna 0 — 2026-05-09 → 2026-05-15 (acum)

**Tema:** Pune fundațiile de compliance în cod și în docs.

- [x] PR `compliance/onjn-gdpr-aml` (acest PR): age gate, joc responsabil, cookie banner, drafts P&T, AML rules, schema Consent.
- [ ] Trimite RFP la 3 firme de avocatură (NNDKP, Simion & Baciu, Țuca Zbârcea).
- [ ] Numire informală MLRO din echipă (titulară + backup).
- [ ] Aliniere echipă pe statut „skill assessment vs. licență” — postare în Notion.

**Decision gate S0:** Avem confirmat scris (chiar și informal) că vom începe procesul
de licențiere SAU avem o linie de avocat care să confirme că modelul „skill” ține?
Dacă NU → STOP launch până la S+? cu update setat.

---

## Săptămâna 1 — 2026-05-16 → 2026-05-22

**Tema:** Counsel selectat, înregistrări inițiale.

- [ ] Engagement letter semnat cu firma de avocatură (decizie pe baza propunerilor S0).
- [ ] Memo legal scris despre calificare ONJN — primit de la counsel.
- [ ] Înregistrare entitate raportoare la ONPCSB (formular online).
- [ ] Aplicare migrație Prisma `Consent` în staging.
- [ ] Set MLRO „titular” prin decizie scrisă semnată de administrator.

**Decision gate S1:** Memo-ul juridic spune verde / galben / roșu? Dacă ROȘU →
pivot model SAU buget licențiere ONJN (estimativ 12-24 luni, 50-100k EUR).

---

## Săptămâna 2 — 2026-05-23 → 2026-05-29

**Tema:** Implementare AML monitoring, sumsub L0-L3.

- [ ] Sumsub: configurare nivel L1, L2, L3 + flux liveness + screening PEP/sancțiuni.
- [ ] Worker AML pe `Ledger` care evaluează `AML_RULES` (R01-R12).
- [ ] Tabel `AlertAML` în Prisma + dashboard intern admin pentru triaj.
- [ ] Procedură SAR documentată și semnată.
- [ ] Training intern AML pentru staff (4 ore, suport video).

**Decision gate S2:** Avem flux end-to-end testat: register → KYC L2 → withdrawal → trigger
R01 → alertă vizibilă în dashboard? Dacă NU → STOP până la fix.

---

## Săptămâna 3 — 2026-05-30 → 2026-06-05

**Tema:** Texte legale finalizate, traduse, signed off.

- [ ] Privacy Policy + T&C + Joc Responsabil + AML/KYC + Cookie Banner copy
      revizuite și semnate de avocat (versiune finală 1.0).
- [ ] Înlocuire placeholder „REPLACE” din texte cu CUI / J / adresă SuperFunded SRL.
- [ ] Bump `CONSENT_VERSION` la 1 (sau 2 dacă se schimbă material) și deploy.
- [ ] Înregistrare cont ONPCSB AS-RTS finalizată, primit cod operator.

**Decision gate S3:** Toate textele legale au sign-off scris al avocatului? DA →
launch beta posibil. NU → push beta cu o săptămână.

---

## Săptămâna 4 — 2026-06-06 → 2026-06-12 (Dry-run)

**Tema:** Dry-run end-to-end cu 5-10 utilizatori interni / familie / prieteni.

- [ ] Onboarding complet (register → age gate → cookie banner → KYC L2 → first deposit).
- [ ] Test withdrawal real, dar fictiv (suma mică, returnează la firmă) — verifică logul AML.
- [ ] Test SAR „mock”: simulare alert R02, triaj de către MLRO, decizie dismiss vs. submit.
- [ ] Test scenariu sub-18 (tester care declară „nu” la age gate) — confirmare redirect.
- [ ] Test cookie banner pe 3 device-uri (desktop, mobile, tabletă) cu fiecare combinație.
- [ ] Audit checklist pre-launch (semnat de MLRO + DPO + CTO).

**Decision gate S4 (LANSARE BETA):**
- ✅ Aviz scris avocat: GO
- ✅ Înregistrare ONPCSB confirmată
- ✅ MLRO + backup numiți
- ✅ Sumsub L1-L3 funcțional
- ✅ Worker AML deployed și verificat
- ✅ Toate paginile legale au sign-off
- ✅ Dry-run reușit fără incidente roșii

Dacă oricare e ❌ → STOP, root cause, replan.

---

## Săptămâne 5-8 — 2026-06-13 → 2026-07-10 (Beta limitată RO + transition la public)

- S5: launch limited beta (max 100 utilizatori, doar RO, monitoring intensiv).
- S6: review primele 100 onboardings, ajustare reguli AML.
- S7: review legal final post-beta cu counsel; bugfixe; bump CONSENT_VERSION dacă necesar.
- S8: launch public + ANPC notificare + plan de PR criză.

---

## Anexa A — Pre-launch checklist (printable)

```
[ ] PR compliance merged
[ ] Migrația Consent aplicată în prod
[ ] CUI / J / adresă completate în legal pages
[ ] CONSENT_VERSION = 1
[ ] DPO email funcțional (dpo@superfunded.ro)
[ ] MLRO numit prin decizie scrisă
[ ] Cont ONPCSB activ + cod operator
[ ] Sumsub L1-L3 testat
[ ] Worker AML deployed
[ ] Aviz scris avocat pentru launch
[ ] Backup BCP / DR pentru DB cu KYC
[ ] Plan PR + crisis comm draftuit
[ ] Pagina /joc-responsabil verificată cu un specialist anti-adicție
```

---

*Document de lucru. Actualizează săptămânal cu starea fiecărui gate.*
