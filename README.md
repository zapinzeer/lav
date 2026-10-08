# lav · biblioteka školskih lekcija / an open library of school lessons

Živa adresa / live URL: https://zapinzeer.github.io/lav/

Sajt je statičan (HTML, CSS i JavaScript, bez koraka izgradnje) i radi na GitHub Pages sa grane `main`.
The site is static (HTML, CSS and JavaScript, no build step) and runs on GitHub Pages from the `main` branch.

## Kviz sobe i nalozi / Quiz rooms and accounts

Sve što se podešava nalazi se u jednoj datoteci: `config.js`.
Everything that can be configured is in one file: `config.js`.

| Polje / field | Šta je / what it is |
| --- | --- |
| `apiKey` | Web API ključ Firebase projekta (nije tajna, sme da bude javan). Potreban za naloge. / The Firebase project's web API key (not a secret, it is meant to be public). Needed for accounts. |
| `databaseURL` | Adresa Firebase Realtime Database. / The address of the Firebase Realtime Database. |
| `dataPath` | Ime grane u bazi. Ostavi `lav`, pravila u `database.rules.json` se odnose na tu granu. / The name of the branch in the database. Keep `lav`, the rules in `database.rules.json` refer to that branch. |
| `creatorPasswordHash` | SHA-256 otisak lozinke za pravljenje kvizova. / The SHA-256 fingerprint of the password for creating quizzes. |

Dok `apiKey` ili `databaseURL` nedostaju, sajt radi u lokalnom režimu: kvizovi i odgovori se čuvaju samo u pregledaču, nalozi su isključeni, a žuto upozorenje „Lokalni režim” to kaže.
While `apiKey` or `databaseURL` is missing the site runs in local mode: quizzes and answers stay in the browser, accounts are off, and a yellow “Local mode” notice says so.

### Šta nalozi rade / What accounts do

- Prijava i registracija emailom i lozinkom preko Firebase Authentication. Lozinku obrađuje i čuva (kao heš) Google, sajt je nikada ne vidi niti čuva. Moguće je i resetovanje lozinke mejlom.
  Sign-in and sign-up with email and password through Firebase Authentication. Google handles and stores the password (as a hash), the site never sees or stores it. Password reset by email is included.
- Ko je prijavljen, njegovi rezultati svih testova se čuvaju u istoriji naloga („Moji rezultati”): bodovi, datum i pregled svakog odgovora. Gosti i dalje mogu da uđu u sobu samo sa korisničkim imenom, ali im se rezultat ne čuva.
  Signed-in users get their results saved in the account history (“My results”): score, date and a review of every answer. Guests can still join a room with just a username, but their result is not kept.
- Kvizovi koje neko napravi vezani su za njegov nalog. Odgovore na njih (korisničko ime, odgovor, formula, postupak) vidi samo taj nalog, a baza to sama sprovodi (`database.rules.json`).
  Quizzes belong to the account that created them. Only that account can read the answers to them (username, answer, formula, working), and the database itself enforces this (`database.rules.json`).
- Odgovore na testove uz lekcije (FIZ01 do ELE02) vidi administrator sajta: prvi nalog koji u prostoru autora pritisne **Postani administrator**.
  The answers to the lesson tests (FIZ01 to ELE02) are visible to the site administrator: the first account to press **Become administrator** in the author space.
- Nalog se može obrisati iz podešavanja: briše se nalog, istorija i svi kvizovi sa odgovorima.
  An account can be deleted from the settings: the account, the history and every quiz with its answers are removed.

### Povezivanje sa Firebase-om / Connecting Firebase

1. Otvori https://console.firebase.google.com, klikni **Create a project**, upiši ime (npr. `lav`), isključi Google Analytics i klikni **Create project**.
2. **Build → Authentication → Get started → Sign-in method → Email/Password**: uključi **Enable** (Email link ostavi isključen) i klikni **Save**.
3. **Build → Realtime Database → Create Database**, izaberi lokaciju (npr. **Belgium, europe-west1**) i režim **Start in locked mode**.
4. Na kartici **Rules** zameni sav sadržaj sadržajem datoteke `database.rules.json` iz ovog repozitorijuma i klikni **Publish**.
5. Kartica **Data**: kopiraj adresu sa vrha, npr. `https://lav-12345-default-rtdb.europe-west1.firebasedatabase.app`.
6. Zupčanik pored **Project Overview → Project settings → General → Your apps → Web (`</>`)**: upiši ime (npr. `lav`), ne uključuj Firebase Hosting, klikni **Register app** i iz ponuđenog koda kopiraj vrednost `apiKey`.
7. U `config.js` upiši `apiKey: "…"` i `databaseURL: "…"` (između navodnika) i uradi commit. Posle minut-dva sajt je povezan i žuto upozorenje nestaje.
8. Prvi put: na sajtu pritisni **Napravi kviz**, upiši lozinku, napravi svoj nalog i u prostoru autora pritisni **Postani administrator**.

Opciono, za dodatnu zaštitu ključa: Google Cloud Console → **APIs & Services → Credentials** → tvoj Browser key → **Website restrictions** → dodaj `zapinzeer.github.io/*`.

1. Open https://console.firebase.google.com, click **Create a project**, name it (e.g. `lav`), turn Google Analytics off and click **Create project**.
2. **Build → Authentication → Get started → Sign-in method → Email/Password**: switch **Enable** on (leave Email link off) and click **Save**.
3. **Build → Realtime Database → Create Database**, pick a location (e.g. **Belgium, europe-west1**) and **Start in locked mode**.
4. On the **Rules** tab replace everything with the contents of `database.rules.json` from this repository and click **Publish**.
5. **Data** tab: copy the address at the top, e.g. `https://lav-12345-default-rtdb.europe-west1.firebasedatabase.app`.
6. Gear next to **Project Overview → Project settings → General → Your apps → Web (`</>`)**: give it a name (e.g. `lav`), skip Firebase Hosting, click **Register app** and copy the `apiKey` value from the code shown.
7. In `config.js` fill in `apiKey: "…"` and `databaseURL: "…"` (between the quotes) and commit. After a minute or two the site is connected and the yellow notice disappears.
8. First run: on the site press **Create quiz**, enter the password, create your account and press **Become administrator** in the author space.

Optional, to protect the key further: Google Cloud Console → **APIs & Services → Credentials** → your Browser key → **Website restrictions** → add `zapinzeer.github.io/*`.

### Lozinka za pravljenje kvizova / The password for creating quizzes

Podrazumevana lozinka je `lav-kviz-2026`. Da je promeniš, otvori stranicu `lozinka.html` na sajtu, upiši novu lozinku, kopiraj otisak u `config.js` kao vrednost `creatorPasswordHash` i uradi commit.
The default password is `lav-kviz-2026`. To change it, open the page `lozinka.html` on the site, enter the new password, copy the fingerprint into `config.js` as the value of `creatorPasswordHash` and commit.

### Šta je zaista zaštićeno / What is actually protected

Lozinka za pravljenje kvizova je provera u pregledaču: ona samo sakriva prostor autora i ne može da spreči nekoga ko zna da pozove bazu direktno da napravi nalog i sebi napravi kviz. Prava zaštita podataka su nalozi i pravila baze: tuđe odgovore i tuđu istoriju niko ne može da pročita. Tačni odgovori kviza su deo samog kviza koji igrač učitava (ocenjivanje se radi u pregledaču), pa ovo nije sistem za ozbiljno polaganje ispita.
The password for creating quizzes is a check in the browser: it only hides the author space, and it cannot stop someone who knows how to call the database directly from creating an account and a quiz of their own. The real protection of the data is the accounts and the database rules: nobody can read other people's answers or history. The correct answers are part of the quiz the player loads (grading happens in the browser), so this is not a system for high-stakes exams.

Kodovi testova uz lekcije (`FIZ01`–`FIZ07`, `OSN01`, `OSN02`, `ELE01`, `ELE02`) navedeni su u `database.rules.json`; ako dodaš novu lekciju sa testom, dodaj i njen kod tamo.
The codes of the lesson tests (`FIZ01`–`FIZ07`, `OSN01`, `OSN02`, `ELE01`, `ELE02`) are listed in `database.rules.json`; if you add a new lesson with a test, add its code there too.

### Provera pravila / Checking the rules

Pravila su proverena simulatorom (`targaryen`) i krajnjim testovima u pregledaču protiv lažnog servera koji primenjuje ista pravila: gost može da pošalje odgovore u otvorenu sobu, ali ne može da ih pročita; prijavljeni korisnik čita samo svoju istoriju; samo vlasnik kviza čita, menja i briše kviz i njegove odgovore.
The rules were verified with a simulator (`targaryen`) and with end-to-end browser tests against a fake server that applies the same rules: a guest can send answers to an open room but cannot read them; a signed-in user reads only their own history; only the owner of a quiz can read, change and delete the quiz and its answers.
