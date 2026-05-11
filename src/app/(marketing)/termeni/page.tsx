import SectionsRest from './sections-rest';

export const metadata = {
  title: 'Termeni și Condiții — SuperFunded',
  description: 'Termenii și condițiile platformei SuperFunded.',
};

/**
 * /termeni — Termeni și Condiții complete (RO).
 * Adaptate din modelul TFP, ajustate pentru SuperFunded SRL (România).
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
            <H2>2. Descrierea serviciului — conturi finanțate</H2>

            <H3>Ce oferă SuperFunded</H3>
            <P>SuperFunded oferă o platformă de evaluare a abilităților de pick-uri sportive, destinată utilizatorilor care vor
              să-și demonstreze strategiile pentru a opera un „cont finanțat”. Serviciul îți permite să intri în provocări
              (challenge-uri) simulate, în care plasezi pick-uri virtuale în condiții de piață reală. Dacă atingi cu succes toate
              criteriile de performanță (țintă de profit, reguli de drawdown), poți obține dreptul de a opera un cont finanțat
              susținut de capitalul SuperFunded — pariezi cu capitalul firmei și împarți profitul, fără să-ți riști banii proprii.</P>

            <H3>Nu suntem casă de pariuri sau platformă de investiții</H3>
            <P>SuperFunded NU este o casă de pariuri, cazino sau operator de jocuri de noroc și nu acceptă, nici nu facilitează
              pariuri pe bani reali pe platforma proprie. Toate activitățile pe SuperFunded în fazele de evaluare se desfășoară cu
              valută virtuală (de ex. „profit points”) într-un mediu simulat care folosește cote sportive în timp real pentru
              realism. Niciun pariu real nu este plasat prin SuperFunded — platforma e strict pentru evaluare și scop educațional.
              Prin urmare, SuperFunded nu este reglementată ca serviciu de jocuri de noroc, iar pentru challenge-urile noastre nu
              este necesară licență ONJN. Participarea la un challenge SuperFunded nu implică sfaturi de investiții sau servicii
              financiare.</P>

            <H3>Scop educațional și de divertisment</H3>
            <P>Toate informațiile, conținutul și serviciile oferite de SuperFunded sunt destinate exclusiv scopurilor educaționale
              și de divertisment. Nimic din ce este pe Site nu garantează succes viitor în pariurile sportive sau câștiguri
              financiare. Recunoști că orice succes în challenge-urile simulate nu garantează succesul în pariurile reale, care
              vin cu propriile riscuri.</P>
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
              criminale. Nu folosi platforma pentru a facilita ori promova jocuri de noroc ilegale.</P>

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
