(function () {
'use strict';
var H = window.LAV_QH, t = H.t, C = H.C, M = H.M, B = H.B, N = H.N;
var Q = window.LAV_QUIZZES;

// Data, SQL and Firebase bank: the basics of databases, SQL statements and the Firebase Realtime Database.

Q.DB01 = H.quiz(t('Podaci, SQL i Firebase · mali test', 'Data, SQL and Firebase · short test'), [
  C('Šta je red (zapis) u tabeli?', 'What is a row (record) in a table?',
    [['jedna konkretna stvar, npr. jedan učenik', 'one concrete thing, e.g. one student'], ['jedna osobina svih stvari', 'one property of all the things'], ['ime tabele', 'the name of the table'], ['jedan SQL jezik', 'an SQL language']], 0, 'tabele', 'Kolona je osobina, a red je jedan zapis sa vrednostima svih kolona.', 'A column is a property, and a row is one record with a value for each column.'),
  C('Koja SQL naredba čita podatke iz tabele?', 'Which SQL statement reads data from a table?',
    ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], 0, 'sql', 'SELECT čita, INSERT dodaje, UPDATE menja, DELETE briše.', 'SELECT reads, INSERT adds, UPDATE changes, DELETE removes.'),
  B('Primarni ključ ima različitu vrednost u svakom redu tabele.', 'A primary key has a different value in every row of the table.', true, 'tabele', 'Zato jednoznačno određuje red.', 'That is why it identifies a row unambiguously.'),
  C('U kakvoj strukturi Firebase Realtime Database čuva podatke?', 'In what structure does Firebase Realtime Database keep data?',
    [['JSON drvo sa putanjama', 'a JSON tree with paths'], ['tabele sa redovima i kolonama', 'tables with rows and columns'], ['običan tekstualni fajl', 'a plain text file'], ['slike', 'images']], 0, 'firebase', 'Svaki čvor u drvetu ima putanju, npr. ucenici/ana/razred.', 'Every node in the tree has a path, e.g. ucenici/ana/razred.'),
  C('Šta radi WHERE u SELECT naredbi?', 'What does WHERE do in a SELECT statement?',
    [['zadržava samo redove koji ispunjavaju uslov', 'keeps only the rows that meet a condition'], ['briše tabelu', 'deletes the table'], ['menja imena kolona', 'renames the columns'], ['povezuje se sa internetom', 'connects to the internet']], 0, 'sql', 'Bez WHERE dobijaju se svi redovi.', 'Without WHERE you get all the rows.')
], [
  C('Koja naredba daje imena učenika iz razreda 2B?', 'Which statement gives the names of the students in class 2B?',
    [["SELECT ime FROM ucenici WHERE razred = '2B';", "SELECT ime FROM ucenici WHERE razred = '2B';"], ["SELECT razred FROM ucenici WHERE ime = '2B';", "SELECT razred FROM ucenici WHERE ime = '2B';"], ["DELETE ime FROM ucenici WHERE razred = '2B';", "DELETE ime FROM ucenici WHERE razred = '2B';"], ["INSERT ime INTO ucenici WHERE razred = '2B';", "INSERT ime INTO ucenici WHERE razred = '2B';"]], 0, 'sql', 'SELECT bira kolonu ime, FROM tabelu, a WHERE uslov.', 'SELECT picks the column ime, FROM the table, and WHERE the condition.'),
  C('Šta radi UPDATE ucenici SET razred = \'3A\'; bez WHERE?', 'What does UPDATE ucenici SET razred = \'3A\'; do without WHERE?',
    [['postavlja razred 3A svim učenicima', 'sets class 3A for every student'], ['menja samo prvog učenika', 'changes only the first student'], ['ne radi ništa', 'does nothing'], ['briše tabelu', 'deletes the table']], 0, 'sql', 'Bez uslova naredba važi za sve redove.', 'Without a condition the statement applies to every row.'),
  C('Čemu služi strani ključ?', 'What is a foreign key for?',
    [['povezuje red sa redom u drugoj tabeli', 'it links a row to a row in another table'], ['šifruje podatke', 'it encrypts data'], ['ubrzava internet', 'it speeds up the internet'], ['briše duplikate', 'it removes duplicates']], 0, 'tabele', 'Čuva primarni ključ iz druge tabele, npr. ucenik_id u tabeli ocene.', 'It stores the primary key from another table, e.g. ucenik_id in the grades table.'),
  C('Zašto ime učenika nije dobar primarni ključ?', 'Why is a student name not a good primary key?',
    [['dva učenika mogu imati isto ime', 'two students may have the same name'], ['imena su predugačka za bazu', 'names are too long for a database'], ['ime ne može biti tekst', 'a name cannot be text'], ['ključ mora biti slovo', 'a key must be a letter']], 0, 'tabele', 'Ključ mora biti jedinstven, zato se koristi id.', 'A key must be unique, which is why an id is used.'),
  C('Šta radi JOIN?', 'What does JOIN do?',
    [['spaja redove dve tabele kad se ključevi poklope', 'pairs rows of two tables when the keys match'], ['spaja dve baze u jednu', 'merges two databases into one'], ['dodaje novu kolonu', 'adds a new column'], ['briše redove bez para', 'deletes rows without a match']], 0, 'join', 'Uslov spajanja se piše iza ON.', 'The joining condition is written after ON.'),
  C('Učenik nema nijednu ocenu. Šta se desi sa njim u običnom JOIN-u (INNER JOIN) sa tabelom ocene?', 'A student has no grades. What happens to them in a plain JOIN (INNER JOIN) with the grades table?',
    [['ne pojavljuje se u rezultatu', 'they do not appear in the result'], ['pojavljuje se sa ocenom 0', 'they appear with a grade of 0'], ['baza prijavi grešku', 'the database reports an error'], ['briše se iz tabele', 'they are deleted from the table']], 0, 'join', 'INNER JOIN prikazuje samo parove koji se poklapaju; LEFT JOIN bi ga zadržao.', 'INNER JOIN shows only matching pairs; LEFT JOIN would keep them.'),
  B('U SQL-u se tekstualne vrednosti pišu pod jednostrukim navodnicima.', 'In SQL text values are written in single quotes.', true, 'sql', 'Brojevi se pišu bez navodnika.', 'Numbers are written without quotes.'),
  M('Koje od ovih SQL naredbi menjaju podatke u tabeli?', 'Which of these SQL statements change the data in a table?',
    [['INSERT', 'INSERT'], ['UPDATE', 'UPDATE'], ['DELETE', 'DELETE'], ['SELECT', 'SELECT']], [0, 1, 2], 'sql', 'SELECT samo čita.', 'SELECT only reads.'),
  N('Tabela ocene ima redove sa ocenama 5, 4 i 3. Koliko redova vraća SELECT * FROM ocene WHERE ocena >= 4; ?', 'The grades table has rows with grades 5, 4 and 3. How many rows does SELECT * FROM ocene WHERE ocena >= 4; return?', '2', '', 'sql', 'Uslov ispunjavaju ocene 5 i 4.', 'The grades 5 and 4 meet the condition.'),
  C('Koja Firebase putanja vodi do razreda učenice Ane u drvetu ucenici → ana → razred?', 'Which Firebase path leads to the class of the student Ana in the tree ucenici → ana → razred?',
    [['ucenici/ana/razred', 'ucenici/ana/razred'], ['razred/ana/ucenici', 'razred/ana/ucenici'], ['ucenici.razred.ana', 'ucenici.razred.ana'], ['SELECT razred', 'SELECT razred']], 0, 'firebase', 'Putanja ide od korena kroz čvorove, razdvojena kosim crtama.', 'The path goes from the root through the nodes, separated by slashes.'),
  C('Čemu služi push u Firebase-u?', 'What is push for in Firebase?',
    [['dodaje podatak pod novim jedinstvenim ključem', 'it adds data under a new unique key'], ['briše čvor', 'it deletes a node'], ['menja pravila', 'it changes the rules'], ['gasi bazu', 'it shuts down the database']], 0, 'firebase', 'Zato dva korisnika koja istovremeno dodaju poruku ne prepisuju jedan drugog.', 'So two users adding a message at the same time do not overwrite each other.'),
  C('Koja Firebase funkcija prati promene podataka uživo?', 'Which Firebase function follows data changes live?',
    [['onValue', 'onValue'], ['remove', 'remove'], ['set', 'set'], ['push', 'push']], 0, 'firebase', 'onValue se poziva kad god se podatak na putanji promeni.', 'onValue is called whenever the data at the path changes.'),
  C('Zašto se u Firebase-u koristi await?', 'Why is await used with Firebase?',
    [['pozivi su asinhroni, pa se čeka odgovor', 'the calls are asynchronous, so we wait for the answer'], ['da bi se baza ubrzala', 'to make the database faster'], ['da bi se šifrovali podaci', 'to encrypt the data'], ['bez njega nema internet veze', 'without it there is no internet connection']], 0, 'firebase', 'Odgovor stiže kasnije, preko mreže.', 'The answer arrives later, over the network.'),
  C('Šta čuva podatke u Firebase-u od neovlašćenih izmena?', 'What protects data in Firebase from unauthorised changes?',
    [['pravila bezbednosti (.read, .write) na serveru', 'security rules (.read, .write) on the server'], ['skrivanje adrese baze u kodu', 'hiding the database address in the code'], ['ime projekta', 'the name of the project'], ['boja stranice', 'the colour of the page']], 0, 'pravila', 'Adresa baze i apiKey su vidljivi u kodu, pa sami ne štite ništa.', 'The database address and apiKey are visible in the code, so they protect nothing by themselves.'),
  B('Pravilo ".write": true znači da svako može da piše u taj deo baze.', 'The rule ".write": true means anyone can write to that part of the database.', true, 'pravila', 'Takvo pravilo je u redu samo za probu.', 'Such a rule is fine only for a test.'),
  C('Kako se Firebase drvo razlikuje od relacione baze?', 'How does a Firebase tree differ from a relational database?',
    [['nema tabela, kolona ni JOIN-a; podaci su ugnežđeni čvorovi', 'it has no tables, columns or JOIN; data is nested nodes'], ['ne može da čuva tekst', 'it cannot store text'], ['radi samo bez interneta', 'it works only without the internet'], ['uvek je sporija', 'it is always slower']], 0, 'firebase', 'Podaci koji se zajedno čitaju mogu da žive jedan u drugom.', 'Data that is read together can live inside one another.')
]);

})();
