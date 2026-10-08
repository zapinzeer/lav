# lav · biblioteka školskih lekcija / an open library of school lessons

Živa adresa / live URL: https://zapinzeer.github.io/lav/

Sajt je statičan (HTML, CSS i JavaScript, bez koraka izgradnje) i radi na GitHub Pages sa grane `main`.
The site is static (HTML, CSS and JavaScript, no build step) and runs on GitHub Pages from the `main` branch.

## Kviz sobe / Quiz rooms

Sve što se podešava nalazi se u jednoj datoteci: `config.js`.
Everything that can be configured is in one file: `config.js`.

| Polje / field | Šta je / what it is |
| --- | --- |
| `databaseURL` | Adresa Firebase Realtime Database. Dok je prazna, kvizovi i odgovori se čuvaju samo u pregledaču (lokalni režim). / The address of the Firebase Realtime Database. While empty, quizzes and answers are kept only in the browser (local mode). |
| `dataPath` | Ime grane u bazi (podrazumevano `lav`). / The name of the branch in the database (default `lav`). |
| `creatorPasswordHash` | SHA-256 otisak lozinke za pravljenje kvizova. / The SHA-256 fingerprint of the password for creating quizzes. |

### Povezivanje sa Firebase-om / Connecting Firebase

1. Otvori https://console.firebase.google.com, klikni **Create a project**, upiši ime (npr. `lav`), isključi Google Analytics i klikni **Create project**.
2. U levom meniju izaberi **Build → Realtime Database**, klikni **Create Database**, izaberi lokaciju (npr. **Belgium, europe-west1**) i režim **Start in locked mode**.
3. Otvori karticu **Rules**, zameni sadržaj ovim i klikni **Publish**:

```json
{
  "rules": {
    "lav": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Otvori karticu **Data** i kopiraj adresu sa vrha, npr. `https://lav-12345-default-rtdb.europe-west1.firebasedatabase.app`.
5. U `config.js` upiši tu adresu između navodnika posle `databaseURL:` i uradi commit. Posle minut-dva baza je povezana, a žuto upozorenje „Lokalni režim” nestaje.

Nikakav API ključ nije potreban.

### Lozinka za pravljenje kvizova / The password for creating quizzes

Podrazumevana lozinka je `lav-kviz-2026`. Da je promeniš, otvori stranicu `lozinka.html` na sajtu, upiši novu lozinku, kopiraj otisak u `config.js` kao vrednost `creatorPasswordHash` i uradi commit.
The default password is `lav-kviz-2026`. To change it, open the page `lozinka.html` on the site, enter the new password, copy the fingerprint into `config.js` as the value of `creatorPasswordHash` and commit.

Lozinka je provera u pregledaču: ona sakriva dugme za pravljenje kvizova, ali ne štiti bazu. Pravila baze iznad su otvorena za granu `lav`, pa je ovo namenjeno školskoj upotrebi, ne za poverljive podatke.
The password is a check in the browser: it gates the quiz creator, but it does not protect the database. The rules above are open for the `lav` branch, so this is meant for school use, not for confidential data.
