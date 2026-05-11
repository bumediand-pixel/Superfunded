/**
 * Termeni și Condiții — secțiunile 6-17 (RO).
 * Componentă pură, fără state. Folosește aceleași tipografii (H2/H3/P/Mail)
 * exportate din page.tsx ca să păstreze stilul consistent.
 */
import { H2, H3, P, Mail } from './page';
import SectionsFinal from './sections-final';

export default function SectionsRest() {
  return (
    <>
      {/* 6 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>6. Prevenirea fraudei și gestionarea riscului</H2>

        <P>SuperFunded tratează prevenirea fraudei și integritatea platformei foarte serios. Folosind Serviciul, recunoști și ești
          de acord că SuperFunded are dreptul de a implementa măsuri pentru detectarea și prevenirea activităților frauduloase
          sau neautorizate. Aceste măsuri includ, fără limitare:</P>

        <H3>Monitorizarea activității</H3>
        <P>Putem monitoriza, înregistra și analiza acțiunile tale pe platformă (inclusiv locații de autentificare, tipare de
          pariere și alte date de utilizare) pentru a detecta orice comportament care pare fraudulos, înșelător sau în neconformitate
          cu acești Termeni. Această monitorizare se face conform legilor de confidențialitate aplicabile.</P>

        <H3>Investigare și verificare</H3>
        <P>SuperFunded poate solicita oricând informații sau documente suplimentare de verificare (de ex. dovada identității, a
          metodei de plată) dacă se suspectează fraudă sau partajare de cont. Până la satisfacerea acestor cereri, ne rezervăm
          dreptul de a îngheța contul și activitatea aferentă.</P>

        <H3>Partajarea datelor cu autoritățile</H3>
        <P>Ne rezervăm dreptul de a partaja informații despre activități suspecte cu părți relevante — autorități, organisme de
          reglementare financiară, procesatori de plăți, organizații de integritate sportivă. Folosind SuperFunded consimți la
          aceste dezvăluiri. Datele personale partajate vor fi tratate conform Politicii noastre de Confidențialitate și legilor
          aplicabile.</P>

        <H3>Restricționarea sau interzicerea conturilor</H3>
        <P>SuperFunded poate restricționa funcționalitatea, suspenda sau interzice permanent utilizatorii suspectați de fraudă,
          comportament neetic ori activități cu risc ridicat. Putem dezactiva anumite funcționalități (de ex. blocarea pick-urilor
          noi, blocarea retragerilor) sau închide contul integral. În cazurile de fraudă confirmată, ne rezervăm dreptul de a
          confisca sau anula orice beneficii, recompense în așteptare sau conturi legate de abatere.</P>

        <H3>Fără compensații pentru conturile fraudate</H3>
        <P>Dacă contul tău este închis sau restricționat din cauza suspiciunii de fraudă sau încălcării acestor Termeni,
          SuperFunded nu are obligația de a te compensa pentru oportunități pierdute sau acces rămas. De exemplu, dacă ai plătit
          un challenge și ești interzis pentru abatere înainte de a-l termina, nu vei primi rambursare sau alt remediu.</P>

        <H3>Colaborare cu alte platforme</H3>
        <P>Pentru a proteja industria, SuperFunded poate partaja informații despre utilizatori frauduloși confirmați (nume de
          utilizator, ID-uri, tipare comportamentale) cu platforme afiliate sau servicii partenere, conform legilor de protecție
          a datelor.</P>

        <P>Folosind SuperFunded, ești de acord să cooperezi pe deplin cu orice investigație de fraudă — răspuns prompt și
          informații veridice.</P>
      </section>

      {/* 7 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>7. Utilizări restricționate ale Site-ului</H2>

        <P>În plus față de interdicțiile specifice de mai sus, ți se interzice să folosești Site-ul sau conținutul lui în oricare
          dintre următoarele moduri:</P>

        <H3>Scopuri ilegale</H3>
        <P>Nu folosi SuperFunded pentru orice scop ilegal sau pentru a sprijini orice activitate ilegală — inclusiv eludarea
          legilor de jocuri de noroc, fraudă sau infracțiuni prin platforma noastră.</P>

        <H3>Solicitarea de fapte ilegale</H3>
        <P>Nu solicita și nu încuraja pe alții să comită ori să participe la fapte ilegale. De exemplu, nu poți folosi forumurile
          noastre (dacă există) pentru a încuraja jocuri de noroc ilegale sau partajarea de informații confidențiale.</P>

        <H3>Încălcări regulamentare</H3>
        <P>Nu folosi Site-ul într-un mod care ar încălca legi sau regulamente locale, naționale ori internaționale. Tu ești
          responsabil să cunoști legile aplicabile.</P>

        <H3>Încălcarea proprietății intelectuale</H3>
        <P>Nu încălca drepturile de proprietate intelectuală ale SuperFunded sau ale altora. Nu poți răzui (scrape), reproduce,
          duplica, copia, vinde, revinde ori exploata vreo parte din Site, nici nu poți încărca conținut pentru care nu deții
          drepturile.</P>

        <H3>Hărțuire sau comportament dăunător</H3>
        <P>Site-ul nu poate fi folosit pentru a hărțui, abuza, insulta, defăima, intimida sau discrimina pe nimeni pe criterii
          de gen, orientare sexuală, religie, etnie, rasă, vârstă, origine națională sau dizabilitate. Discursul de ură și
          bullying-ul nu sunt tolerate.</P>

        <H3>Informații false sau înșelătoare</H3>
        <P>Îți este interzis să trimiți informații false, frauduloase sau înșelătoare. Aceasta include date de identificare false,
          informații false despre rezidență sau date înșelătoare. Nu poți pretinde a fi altă persoană sau entitate.</P>

        <H3>Cod malițios sau abuz tehnologic</H3>
        <P>Nu încărca, transmite sau distribui viruși, viermi, malware sau alt cod dăunător. Atacurile DoS sau orice tentativă
          de a perturba funcționarea Site-ului sunt strict interzise.</P>

        <P>SuperFunded își rezervă dreptul de a închide sau restricționa utilizarea Serviciului dacă te angajezi în vreuna
          dintre activitățile restricționate de mai sus. Astfel de activități pot atrage și răspundere civilă sau penală.</P>
      </section>

      {/* 8 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>8. Practici de pariere neautorizate</H2>

        <P>Misiunea SuperFunded este să evalueze abilități reale de pariere sportivă, iar regulile noastre asigură un mediu corect.
          Nu ai voie să abuzezi de Servicii ori să folosești practici care încalcă regulile noastre standard de management al
          riscului sau care încearcă să trișeze sistemul de evaluare. Practicile de pariere neautorizate interzise includ, fără
          limitare:</P>

        <H3>Coluziune și manipulare cu mai multe conturi</H3>
        <P>Nu poți colabora cu alți participanți sau folosi mai multe conturi (toate pe SuperFunded sau pe platforme similare)
          pentru a manipula rezultatele. Pariurile coordonate pe părți opuse ale aceluiași meci, prin conturi diferite (ale tale
          sau în colaborare cu alți utilizatori), sunt strict interzise.</P>

        <H3>Eludarea regulilor platformei</H3>
        <P>Orice tranzacție sau activitate care încalcă regulile sau termenii SuperFunded este interzisă — inclusiv exploatarea
          oricărui aspect al challenge-ului care nu e intenționat de noi (de ex. acorduri externe pentru împărțirea profitului
          sau a pierderilor).</P>

        <H3>Abuz automatizat sau de mare frecvență</H3>
        <P>Folosirea oricărei tehnologii — agenți AI, algoritmi de tranzacționare la viteză mare, scripturi sau unelte de
          introducere în masă — pentru a plasa pick-uri sau a-ți gestiona contul într-un mod imposibil pentru un utilizator
          normal este interzisă. Toate pick-urile trebuie plasate manual prin interfața noastră.</P>

        <H3>Încălcarea regulilor de management al riscului</H3>
        <P>Fiecare challenge are reguli stricte (drawdown maxim, drawdown zilnic, ținte de profit, intervale de timp). Nerespectarea
          acestor reguli sau a țintelor de profit este considerată eșec al challenge-ului; tentativa de a explora marginile
          regulilor este o încălcare.</P>

        <H3>Copierea strategiilor (cheating)</H3>
        <P>Nu ai voie să copiezi în mod coordonat strategiile altor participanți sau să folosești mirror trading pentru a duplica
          pick-urile altui utilizator în timp real. Astfel de aranjamente subminează scopul evaluării abilității individuale.</P>

        <H3>Tipare de pariere unilaterale</H3>
        <P>Sunt interzise strategiile concepute să exploateze criteriile de evaluare — de ex. pariere doar pe favoriți / outsideri,
          sau pierderea intenționată a pariurilor pentru a reseta sau exploata un mecanism al challenge-ului.</P>

        <H3>Scheme de acoperire în grup</H3>
        <P>Nu poți participa la grupuri sau sindicate care încearcă să acopere toate rezultatele posibile prin mai multe conturi
          coordonate. Astfel de scheme — fie pe SuperFunded, fie pe mai multe platforme — sunt strict interzise.</P>

        <H3>Eludarea securității — emulatoare și VPN</H3>
        <P>Folosirea emulatoarelor de dispozitiv, VPN/proxy (cu excepția uzului legitim de confidențialitate) sau a altor metode
          pentru a ocoli măsurile noastre de securitate sau restricțiile geografice nu este permisă.</P>

        <P>Orice practici de pariere neautorizate vor duce la acțiune imediată din partea SuperFunded: eșec automat al
          challenge-ului curent, pierderea taxelor plătite, descalificarea de la primirea oricărui cont finanțat și închiderea
          definitivă a contului. Ne rezervăm dreptul de a invalida rezultate sau revoca conturi finanțate dacă determinăm că
          au fost obținute prin încălcarea acestor reguli.</P>

        <P>Dacă observi un utilizator care se angajează în practicile de mai sus, te rugăm să raportezi la <Mail />. Cei care
          raportează cazuri confirmate de înșelăciune pot fi recompensați sau recunoscuți la discreția noastră.</P>
      </section>

      {/* 9 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>9. Drepturi de proprietate intelectuală</H2>

        <P>Tot conținutul și materialele de pe site-ul și serviciile SuperFunded — inclusiv text, sigle, grafice, imagini, software
          și elemente de design — sunt proprietatea intelectuală a TheSuperFunded sau a licențiatorilor săi și sunt protejate de
          legi privind drepturile de autor, mărcile și alte drepturi de proprietate intelectuală aplicabile.</P>

        <P>Folosind Site-ul, SuperFunded îți acordă o licență limitată, neexclusivă, netransferabilă și revocabilă pentru a accesa
          și folosi personal, necomercial conținutul Site-ului, doar în scopul utilizării Serviciului așa cum este prevăzut
          (participare la challenge-uri și consultarea informațiilor).</P>

        <P>Acțiuni interzise (fără autorizarea noastră expresă scrisă):</P>
        <ul className="list-disc pl-6 space-y-1.5 mb-3">
          <li>Copierea, reproducerea, modificarea, publicarea, încărcarea sau distribuirea oricărei părți din conținut sau software.</li>
          <li>Scraping, agregarea de informații, crearea de lucrări derivate sau folosirea conținutului în scopuri comerciale.</li>
          <li>Reverse-engineering, decompilarea sau dezasamblarea software-ului ori a infrastructurii noastre tehnice.</li>
          <li>Eliminarea sau ascunderea oricărei mențiuni de copyright, marcă sau proprietar din conținut.</li>
        </ul>
        <P>Dacă trimiți feedback sau sugestii, suntem liberi să le folosim și să le implementăm fără compensație sau obligație
          față de tine. Orice contribuție (postări pe forum, recenzii etc.), cu excepția datelor personale, devine proprietatea
          noastră pentru a fi folosită liber.</P>
      </section>

      {/* 10 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>10. Negarea garanțiilor</H2>

        <H3>„Așa cum este”</H3>
        <P>SuperFunded îți este oferit pe principiul „așa cum este” și „așa cum este disponibil”. Deși ne străduim să oferim o
          platformă de calitate, nu oferim garanții de niciun fel, exprese sau implicite, privind funcționarea Serviciului ori
          informațiile incluse. Folosirea Serviciului se face pe propriul tău risc.</P>

        <P>În mod specific, SuperFunded nu garantează: (a) că Serviciul va fi neîntrerupt, prompt, sigur sau fără erori;
          (b) că rezultatele obținute (de ex. succes în challenge-uri sau conturi finanțate) vor fi exacte sau fiabile;
          (c) că orice erori vor fi corectate. Putem suspenda Serviciul pentru mentenanță sau alte motive, fără răspundere.</P>

        <H3>Fără garanție financiară sau de performanță</H3>
        <P>SuperFunded oferă o platformă de evaluare și nu promite că participarea la challenge-uri va duce la câștiguri reale
          sau la un anume rezultat. Orice rezultate prezentate pe site sau în mărturii sunt ilustrative; performanța trecută nu
          este un indicator fiabil al rezultatelor viitoare.</P>

        <H3>Garanții implicite excluse</H3>
        <P>În măsura permisă de lege, SuperFunded neagă toate garanțiile sau condițiile implicite — inclusiv cele de
          comercializare, conformitate cu un anumit scop, titlu și non-încălcare. Nu garantăm că Serviciul va îndeplini
          așteptările sau cerințele tale.</P>

        <H3>Conținut terț</H3>
        <P>SuperFunded poate conține linkuri sau date integrate de pe site-uri terțe (furnizori de cote, procesatori de plăți).
          Nu garantăm și nu sprijinim ofertele terților, nici nu suntem responsabili pentru conținutul, exactitatea sau
          fiabilitatea site-urilor terțe.</P>
      </section>

      {/* 11 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>11. Limitarea răspunderii</H2>

        <P>În măsura maximă permisă de lege, TheSuperFunded și afiliații, ofițerii, angajații, agenții, partenerii și
          licențiatorii săi nu sunt responsabili pentru daune indirecte, incidentale, speciale, consecvente sau punitive
          rezultate din sau legate de utilizarea (sau imposibilitatea de a utiliza) Serviciul. Aceasta include pierderi de
          profit, venit, date, întreruperi de afaceri sau alte intangibile, chiar dacă am fost avizați de posibilitatea acestora.</P>

        <P>În particular, SuperFunded nu va răspunde pentru:</P>
        <ul className="list-disc pl-6 space-y-1.5 mb-3">
          <li>Eșecul tău de a finaliza un challenge sau revocarea unui cont finanțat din cauza încălcării regulilor.</li>
          <li>Orice decizie pe care o iei pe baza informațiilor obținute prin Site (inclusiv în pariuri reale în afara SuperFunded).</li>
          <li>Suspendarea sau închiderea contului în conformitate cu acești Termeni.</li>
          <li>Down-time, erori de server, pierdere de date sau întreruperi care îți pot afecta capacitatea de a folosi Serviciul.</li>
          <li>Evenimente în afara controlului nostru rezonabil — calamități, întreruperi de curent, atacuri cibernetice, război,
            tulburări civile, acțiuni guvernamentale.</li>
        </ul>

        <H3>Plafon al răspunderii</H3>
        <P>În toate cazurile, răspunderea totală agregată a SuperFunded pentru orice pretenție în temeiul acestor Termeni sau
          legată de Serviciu este limitată la suma plătită de tine către SuperFunded în cele 6 luni anterioare evenimentului.
          De exemplu, dacă ai plătit o singură taxă de challenge de €100 și nicio altă taxă în ultimele 6 luni, răspunderea
          noastră maximă față de tine pentru orice pretenție va fi de €100. Limitarea se aplică indiferent dacă pretenția se
          bazează pe garanție, contract, delict (inclusiv neglijență), răspundere strictă sau orice altă teorie juridică.</P>

        <H3>Responsabilitatea utilizatorului</H3>
        <P>Recunoști că SuperFunded oferă serviciile bazându-se pe negarea garanțiilor și pe limitările răspunderii din acești
          Termeni, care reflectă o alocare convenită a riscului. Tarifele percepute pentru challenge-urile noastre ar trebui să
          fie substanțial mai mari dacă ne-am asuma mai multă răspundere.</P>
      </section>

      {/* 12 ─────────────────────────────────────────────────────── */}
      <section>
        <H2>12. Despăgubiri</H2>

        <P>Ești de acord să despăgubești, să aperi și să exonerezi TheSuperFunded și societatea-mamă, afiliații, partenerii,
          ofițerii, directorii, agenții, angajații și reprezentanții săi împotriva oricăror pretenții, cereri, cauze de acțiune,
          răspunderi, pierderi sau cheltuieli (inclusiv onorarii rezonabile de avocați și costuri) rezultate din: (a) folosirea
          Site-ului sau Serviciului; (b) încălcarea oricărei prevederi a acestor Termeni; (c) încălcarea oricărei legi sau a
          drepturilor unui terț; (d) conținut sau informații pe care le trimiți, postezi sau transmiți prin Serviciu. Această
          obligație de despăgubire supraviețuiește închiderii contului ori încetării Termenilor.</P>

        <P>SuperFunded își rezervă dreptul de a-și asuma apărarea exclusivă și controlul oricărei chestiuni supuse despăgubirii
          din partea ta; în acest caz, ești de acord să cooperezi pe deplin cu apărarea noastră. Nu vei soluționa nicio astfel
          de pretenție și nici nu vei admite culpă în numele SuperFunded fără acordul nostru scris prealabil.</P>
      </section>

      <SectionsFinal />
    </>
  );
}
