import SectionsRest from './sections-rest';

export const metadata = {
  title: 'Termeni și Condiții — SuperFunded',
  description: 'Termenii și condițiile platformei SuperFunded.',
};

/**
 * /termeni — Termeni și Condiții complete (RO).
 * Adaptate din modelul TFP, ajustate pentru TheSuperFunded (România).
 * NOTĂ: secțiunea 17 conține placeholder pentru adresa și UIC-ul firmei.
 * Înlocuiește valorile [TBD] înainte de lansare.
 */
export default function TermeniPage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-4xl mx-auto px-6">

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-semibold text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Centru legal</span>
          </div>
          <h1 className="font-extrabold tracking-tight leading-none mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}>
            TERMENI ȘI<br/>CONDIȚII
          </h1>
          <p className="font-semibold text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>
            Te rugăm să citești acești termeni cu atenție înainte de a folosi platforma. Ultima actualizare: 9 mai 2026.
          </p>
        </div>

        <div className="space-y-12 text-sm leading-relaxed" style={{ color: 'var(--text-muted, #64748b)' }}>

          <section>
            <p>
              Bun venit la SuperFunded. Acești Termeni și Condiții (denumiți în continuare „Termenii” sau „Acordul”) reglementează
              utilizarea de către tine a website-ului și serviciilor SuperFunded (denumite colectiv „Site” sau „Serviciu”). Prin
              accesarea sau utilizarea SuperFunded, ești de acord să respecți acești Termeni. Dacă nu ești de acord cu oricare parte
              a Termenilor, trebuie să încetezi imediat utilizarea Site-ului.
            </p>
          </section>

          {/* 1 ─────────────────────────────────────────────────────── */}
          <section>
            <H2>1. Eligibilitate și responsabilitatea contului</H2>

            <H3>Vârsta minimă</H3>
            <P>Trebuie să ai cel puțin 18 ani (sau vârsta majoratului în jurisdicția ta) pentru a folosi serviciile SuperFunded.
              Site-ul nu este destinat utilizării de către minori, iar înregistrarea sau participarea oricărei persoane sub 18 ani
              este strict interzisă. Dacă descoperim că un utilizator este minor, contul va fi închis imediat.</P>

            <H3>Înregistrarea contului</H3>
            <P>La crearea contului, ești de acord să furnizezi informații exacte, actuale și complete. Ești responsabil să păstrezi
              în siguranță datele contului (inclusiv credențialele de autentificare) și să le actualizezi. Accepți răspunderea
              integrală pentru toate activitățile sub contul tău. SuperFunded nu răspunde pentru pierderi sau daune rezultate din
              nepăstrarea confidențialității credențialelor.</P>

            <H3>Politica „un singur cont”</H3>
            <P>Fiecare utilizator are voie să-și creeze un singur cont, cu excepția cazurilor când permitem expres altceva. Nu ai
              voie să transferi sau să-ți partajezi contul. Orice tentativă de a vinde, închiria sau ceda un cont este strict
              interzisă și poate duce la închiderea acestuia.</P>

            <H3>Securitatea contului</H3>
            <P>Te angajezi să ne anunți imediat la <Mail /> dacă suspectezi orice acces neautorizat la contul tău. SuperFunded își
              rezervă dreptul de a suspenda sau închide conturile pe care le consideră compromise sau suspectate de fraudă, abuz
              ori neconformitate cu acești Termeni.</P>

            <H3>Suspendare / închidere</H3>
            <P>SuperFunded poate suspenda sau închide contul tău în orice moment dacă încalci acești Termeni sau te angajezi în
              comportamente frauduloase, abuzive ori dăunătoare Site-ului ori celorlalți utilizatori. În aceste cazuri SuperFunded
              nu răspunde pentru orice pierdere de date sau acces la Serviciu cauzată de suspendare ori închidere.</P>
          </section>

          {/* 2 ─────────────────────────────────────────────────────── */}
          <section>
            <H2>2. Operator, jurisdicție și descrierea serviciului</H2>

            <H3>Operator și jurisdicție</H3>
            <P>Serviciul este operat de <strong>TheSuperFunded Ltd.</strong>, societate înregistrată în
              <strong> Republica Cipru</strong> (NACE 62.01 — Computer programming activities), cu sediul în Limassol. Toate
              raporturile juridice dintre tine și TheSuperFunded sunt guvernate de <strong>legislația Republicii Cipru</strong>;
              instanțele competente pentru soluționarea oricăror dispute sunt cele din Limassol, Cipru — vezi Secțiunea 16
              pentru detalii privind alegerea legii și forul competent.</P>

            <H3>Ce oferă TheSuperFunded</H3>
            <P>TheSuperFunded oferă un program structurat de <strong>evaluare a abilităților analitice sportive</strong>,
              destinat utilizatorilor care doresc să-și demonstreze competențele de analiză a evenimentelor sportive (formă,
              statistici, value detection, management al bankroll-ului virtual, criterii Kelly). Serviciul îți permite să
              participi la sesiuni de evaluare („challenge-uri”) în care trimiți analize sportive simulate („pick-uri”)
              într-un mediu care folosește cote reale ca date de referință. Dacă demonstrezi performanță conform criteriilor
              analitice predefinite (ROI ponderat, consistență, respectarea regulilor de management al riscului), poți accede
              la programul de pickeri finanțați și primi recompense pentru analizele tale ulterioare, conform unui contract de
              prestări servicii.</P>

            <H3>Capital virtual · pick-uri simulate · NU se plasează pariuri reale</H3>
            <P>Toate sumele afișate ca „capital”, „bankroll”, „balanță” sau „profit demonstrat” sunt
              <strong> exclusiv virtuale</strong>. Utilizatorii NU plasează pariuri cu bani reali pe TheSuperFunded; platforma
              NU intermediază pariuri către operatori reali; nu colectează mize și nu redistribuie câștiguri din pariuri.
              Cotele afișate sunt furnizate de surse terțe (The Odds API, ESPN, Yahoo Sports) și servesc EXCLUSIV ca input
              pentru evaluarea abilităților analitice — nu ca instrument de pariere reală.</P>

            <H3>NU suntem operator de jocuri de noroc · niciun regim de licență aplicabil</H3>
            <P>TheSuperFunded NU este casă de pariuri, cazino sau operator de jocuri de noroc nici în sensul Cyprus Betting Law
              N. 37(I)/2019 (Cipru), nici în sensul OUG nr. 77/2009 (România). Cyprus Betting Law definește „betting”-ul ca
              acceptarea unei mize cu posibilitate de câștig sau pierdere — situație care NU se aplică serviciului nostru:
              taxa este o contraprestație fixă pentru un serviciu de evaluare, nu o miză; capitalul este virtual; premiile
              sunt recompense pentru performanță, nu câștiguri din hazard. Pentru activitatea noastră NU este necesară
              licență Cyprus Gaming Commission, nici autorizație ONJN.</P>

            <H3>Scop: evaluare competențe analitice + recompensă pentru performanță</H3>
            <P>Conținutul, instrumentele și programul oferite de TheSuperFunded sunt destinate <strong>evaluării abilităților
              analitice sportive</strong> și recompensării performanței demonstrate. Nimic de pe Site nu garantează rezultate
              în pariurile reale, nici câștiguri financiare.</P>
          </section>

          {/* 2.5 — CADRU LEGAL EXTINS ────────────────────────────────── */}
          <section>
            <H2>2.5. Cadru legal · de ce activitatea NU este joc de noroc</H2>

            <H3>Cele 3 elemente ale jocului de noroc — niciunul nu este îndeplinit</H3>
            <P>Atât sub Cyprus Betting Law N. 37(I)/2019, cât și sub OUG 77/2009 (România), jocul de noroc presupune întrunirea
              cumulativă a trei elemente: (i) dependența rezultatului de hazard, (ii) existența unei mize și (iii) acordarea
              unui câștig bazat pe hazard. <strong>Niciunul dintre cele trei elemente nu este îndeplinit în activitatea
              TheSuperFunded:</strong></P>

            <H3>(i) Rezultatul NU depinde de hazard</H3>
            <P>Performanța utilizatorului este măsurată prin metrici cuantificabili de <strong>abilitate analitică deliberat
              exercitată</strong>: ROI ponderat, Sharpe ratio, consistența pe orizont temporal, respectarea regulilor de
              management al bankroll-ului virtual, conformitatea cu criteriile Kelly. Aceste metrici reflectă competențe
              dobândibile prin studiu, antrenament și disciplină — nu evenimente aleatorii. Modelul este analog evaluării
              traderilor în prop firms-uri financiare (FTMO, FundedNext etc.), care în jurisdicțiile europene NU sunt
              calificate drept jocuri de noroc.</P>

            <H3>(ii) Taxa de challenge NU este miză</H3>
            <P>Taxa unică plătită la achiziționarea unui challenge reprezintă <strong>contraprestația pentru accesul la
              programul de evaluare</strong>. Este o taxă fixă, predeterminată, achitată indiferent de rezultatul evaluării,
              care NU este pusă în joc pe rezultatul unui eveniment sportiv. NU constituie miză.</P>

            <H3>(iii) Premiile NU sunt câștiguri din hazard</H3>
            <P>Sumele plătite utilizatorilor finanțați reprezintă <strong>recompense pentru performanța analitică
              demonstrată</strong>, plătite în baza unui contract de prestări servicii. NU sunt câștiguri din jocuri de noroc.</P>

            <H3>Cod NACE și statut fiscal</H3>
            <P>TheSuperFunded Ltd. este înregistrată sub codul <strong>NACE 62.01 (Computer programming activities)</strong> și
              NU sub vreun cod de activitate de jocuri de noroc. Toate încasările sunt facturate ca servicii software/evaluare;
              toate plățile către pickeri finanțați sunt făcute pe contract de prestări servicii. Regimul fiscal aplicabil
              utilizatorilor români asupra premiilor primite urmează legislația română aplicabilă veniturilor din alte surse,
              NU regimul specific veniturilor din jocuri de noroc.</P>

            <H3>Recunoaștere și acceptare</H3>
            <P>Prin folosirea Serviciului, recunoști și ești de acord că TheSuperFunded NU oferă jocuri de noroc, NU
              facilitează pariuri pe bani reali și NU operează sub regimul OUG 77/2009 (România) sau Cyprus Betting Law N.
              37(I)/2019 (Cipru). Înțelegi că taxa pe care o plătești este pentru accesul la un serviciu de evaluare a
              abilităților, NU o miză, și că orice premiu pe care l-ai putea primi este o recompensă pentru performanță, NU
              un câștig din hazard.</P>
          </section>

          {/* 3 ─────────────────────────────────────────────────────── */}
          <section>
            <H2>3. Achiziții, taxe și acces la serviciu</H2>

            <H3>Taxe de challenge și acces</H3>
            <P>Pentru a accesa serviciile principale SuperFunded (participarea la challenge-uri și utilizarea dashboard-ului), e
              necesar să cumperi un cont de evaluare. Accesul se acordă doar utilizatorilor plătitori — o taxă unică de challenge
              trebuie plătită pentru a intra în challenge și a primi credențialele. După procesarea cu succes a plății, SuperFunded
              îți oferă credențialele pentru dashboard, ca să începi evaluarea.</P>

            <H3>Fără obligație de abonament</H3>
            <P>Modelul standard SuperFunded este pe taxe unice pentru challenge-uri individuale. Cu excepția cazului în care e
              menționat explicit pentru un anumit produs, nu există abonamente recurente. Fiecare taxă acoperă o singură fază
              (sau set de faze) de evaluare, conform planului ales.</P>

            <H3>Activarea contului</H3>
            <P>Perioada de evaluare începe imediat după primirea credențialelor sau, după caz, conform descrierii challenge-ului.
              Este responsabilitatea ta să începi să folosești contul prompt. Dacă întâmpini probleme cu accesul, contactează-ne
              imediat. Neînceperea challenge-ului în intervalul specificat poate duce la expirarea contului fără rambursare.</P>

            <H3>Upgrade / Downgrade</H3>
            <P>SuperFunded poate oferi mai multe niveluri de cont. Dacă vrei să faci upgrade sau să schimbi planul după achiziție,
              contactează suportul — astfel de schimbări pot necesita taxe suplimentare și sunt la discreția SuperFunded.
              Downgrade-ul după plată nu este, de regulă, permis.</P>

            <H3>Acces la dashboard</H3>
            <P>Dashboard-ul și orice software, model sau instrument oferit de SuperFunded sunt destinate exclusiv titularului care
              a plătit serviciul. Nu ai voie să-ți partajezi datele de autentificare sau accesul la instrumente proprii.</P>
          </section>

          {/* 4 ─────────────────────────────────────────────────────── */}
          <section>
            <H2>4. Plată și politica de rambursare</H2>

            <H3>Procesarea plăților</H3>
            <P>Toate plățile pentru serviciile SuperFunded sunt procesate prin furnizorii noștri aprobați (de ex. Stripe). Prin
              furnizarea informațiilor de plată, declari că ești autorizat să folosești metoda respectivă și ne autorizezi să
              percepem taxa. Prețurile și metodele disponibile sunt afișate la checkout și pot fi modificate.</P>

            <H3>Fără rambursări — produs digital</H3>
            <P>Toate vânzările sunt finale. SuperFunded oferă bunuri digitale și acces imediat la servicii; prin urmare, plățile
              pentru serviciile noastre sunt nerambursabile în aproape toate situațiile. Prin cumpărarea unui challenge sau a
              oricărui produs digital de la SuperFunded renunți expres la dreptul de a solicita rambursare. Nu oferim retururi,
              rambursări sau schimburi ale taxelor de challenge, nici în caz de nemulțumire ori de eșec al challenge-ului,
              întrucât serviciul este livrat integral la momentul achiziției.</P>

            <H3>Excepții</H3>
            <P>Singurele excepții de la politica de nerambursare sunt cele impuse de lege. Dacă legislația aplicabilă (de exemplu,
              reglementări de protecție a consumatorului din UE) impune o perioadă de „cooling-off” sau o rambursare în situații
              specifice, SuperFunded va respecta cerințele minime ale acestor legi. Totuși, în limita maximă permisă, tratăm
              serviciul ca început din momentul în care e oferit accesul, ceea ce poate limita drepturile statutare de retragere.</P>

            <H3>Chargeback-uri și dispute</H3>
            <P>Inițierea unui chargeback pentru o plată legitimă este considerată o încălcare a acestor Termeni. Dacă ai o problemă
              cu factura, te angajezi să contactezi mai întâi suportul SuperFunded. Orice chargeback poate duce la suspendarea
              imediată a contului pe durata investigării și, în cazul unui chargeback nefondat, la închiderea definitivă.</P>

            <H3>Achiziții netransferabile</H3>
            <P>Plățile sunt legate de contul și de challenge-ul tău. Nu ai voie să transferi un challenge sau cont cumpărat altei
              persoane. La fel, orice cont finanțat câștigat la finalizarea cu succes a unui challenge este personal și nu poate
              fi vândut sau transferat.</P>
          </section>

          {/* 5 ─────────────────────────────────────────────────────── */}
          <section>
            <H2>5. Conduita utilizatorului și activități interzise</H2>

            <P>Folosind SuperFunded te angajezi să te comporți legal, etic și conform acestor Termeni. Utilizatorii NU au voie
              să se angajeze în niciuna dintre următoarele activități interzise:</P>

            <H3>Utilizare ilegală sau frauduloasă</H3>
            <P>Nu folosi SuperFunded pentru scopuri ilegale, inclusiv (fără limitare) spălare de bani, fraudă sau alte activități
              criminale. Nu folosi platforma pentru a facilita ori promova servicii de evaluare ilegale.</P>

            <H3>Exploatarea platformei</H3>
            <P>Nu exploata bug-uri, vulnerabilități, portițe sau erori. Folosirea de scripturi automate, bots, crawlere sau alte
              programe neautorizate este strict interzisă. Toate acțiunile trebuie inițiate manual de un utilizator uman.</P>

            <H3>Manipularea pieței</H3>
            <P>Nu încerca să manipulezi piețele de pariuri sportive sau cotele prin SuperFunded. Pick-urile simulate folosesc date
              reale; orice tentativă de a interfera cu integritatea acelor date sau a evenimentelor reale este interzisă.</P>

            <H3>Partajarea sau transferul contului</H3>
            <P>Contul SuperFunded este personal. Nu ai voie să-l partajezi, închiriezi, sublicențiezi, transferi ori vinzi
              credenția către alte persoane. Dacă detectăm partajare sau acces neautorizat, ne rezervăm dreptul de a închide
              contul.</P>

            <H3>Încălcarea legii sau a standardelor</H3>
            <P>Nu folosi Site-ul într-un mod care încalcă legi, regulamente sau standarde aplicabile (inclusiv reguli de
              integritate sportivă). Tu ești singurul responsabil să te asiguri că utilizarea SuperFunded respectă legile din
              jurisdicția ta.</P>

            <H3>Interferență cu piețele reale</H3>
            <P>Îți este interzis să te angajezi prin SuperFunded în orice activitate care ar putea perturba funcționarea piețelor
              reale de pariuri sportive — de ex. partajarea de informații confidențiale sau coordonarea pariurilor reale pe baza
              activității din challenge.</P>

            <P>Încălcarea oricăruia dintre punctele de mai sus reprezintă o abatere gravă. SuperFunded își rezervă dreptul de a
              acționa imediat — închiderea contului fără preaviz și fără compensații și, când e cazul, raportarea activităților
              către autoritățile competente.</P>
          </section>

          <SectionsRest />
        </div>
      </div>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>
      {children}
    </h2>
  );
}
export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-base mt-5 mb-2" style={{ color: 'var(--text, #0f172a)' }}>{children}</h3>;
}
export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-3${className ? ` ${className}` : ''}`}>{children}</p>;
}
export function Mail() {
  return <a href="mailto:support@thesuperfunded.com" className="font-semibold" style={{ color: 'var(--red)' }}>support@thesuperfunded.com</a>;
}
