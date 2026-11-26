(function () {
'use strict';
var H = window.LAV_QH, t = H.t, C = H.C, M = H.M, B = H.B, N = H.N;
var Q = window.LAV_QUIZZES;

Q.UX01 = H.quiz(t('Osnovni principi UI/UX dizajna · mali test', 'Basic principles of UI/UX design · short test'), [
  C('Šta od navedenog najbolje opisuje UX?', 'Which of these best describes UX?',
    [['celo iskustvo korisnika dok koristi proizvod', 'the whole experience of a user while using a product'], ['samo boje i slova na ekranu', 'only the colours and fonts on the screen'], ['programski jezik za interfejse', 'a programming language for interfaces'], ['brzina procesora', 'the speed of the processor']], 0, 'uiux', 'UI je ono što vidiš i dodiruješ, a UX je celo iskustvo, koje uključuje i UI.', 'UI is what you see and touch, and UX is the whole experience, which includes the UI.'),
  B('Dizajner zna šta korisnicima treba, pa testiranje sa ljudima nije potrebno.', 'The designer knows what users need, so testing with people is not needed.', false, 'proces', 'Ti nisi korisnik: ono što je tebi jasno, drugima često nije.', 'You are not the user: what is clear to you is often not clear to others.'),
  C('Koji geštalt princip kaže da natpis treba da bude bliže svom polju nego susednom?', 'Which Gestalt principle says a label should be closer to its own field than to the next one?',
    [['blizina', 'proximity'], ['sličnost', 'similarity'], ['kontrast', 'contrast'], ['simetrija', 'symmetry']], 0, 'hijerarhija', 'Stvari koje su blizu jedna drugoj doživljavamo kao grupu.', 'Things that are close together are seen as a group.'),
  C('Koliki najmanji odnos kontrasta WCAG nivo AA traži za običan tekst?', 'What minimum contrast ratio does WCAG level AA require for normal text?',
    ['4,5 : 1', '3 : 1', '7 : 1', '21 : 1'], 0, 'boja', '3 : 1 je dovoljno za krupan tekst, 7 : 1 je nivo AAA, a 21 : 1 je crno na belom.', '3 : 1 is enough for large text, 7 : 1 is level AAA, and 21 : 1 is black on white.'),
  C('Po Fitsovom zakonu, koje dugme se najbrže pogađa?', 'By Fitts\'s law, which button is hit fastest?',
    [['veliko i blizu', 'large and near'], ['malo i daleko', 'small and far'], ['malo i blizu', 'small and near'], ['veliko i daleko', 'large and far']], 0, 'zakoni', 'Indeks težine raste sa udaljenošću, a opada sa širinom cilja.', 'The index of difficulty grows with distance and shrinks with the width of the target.'),
  M('Šta od navedenog poboljšava pristupačnost?', 'Which of these improve accessibility?',
    [['alt tekst za slike', 'alt text for images'], ['rad celog sajta preko tastature', 'the whole site working with the keyboard'], ['greška označena samo crvenom bojom', 'an error marked only in red'], ['sivi tekst preko slike', 'grey text over a picture']], [0, 1], 'pristupacnost', 'Boja ne sme da bude jedini znak, a sivi tekst preko slike ima slab kontrast.', 'Colour must not be the only sign, and grey text over a picture has poor contrast.')
], [
  C('Posle klika na „Pošalji” ništa se ne dešava nekoliko sekundi. Koja heuristika je prekršena?', 'After clicking "Send" nothing happens for a few seconds. Which heuristic is broken?',
    [['vidljivost stanja sistema', 'visibility of system status'], ['estetski i minimalistički dizajn', 'aesthetic and minimalist design'], ['pomoć i dokumentacija', 'help and documentation'], ['fleksibilnost i efikasnost', 'flexibility and efficiency of use']], 0, 'heuristike', 'Korisnik mora da vidi da je radnja primljena: „Šalje se…”, pa „Poslato”.', 'The user must see that the action was received: "Sending…", then "Sent".'),
  C('Dugme „Opozovi” (Undo) najviše služi kojoj heuristici?', 'An Undo button serves which heuristic most?',
    [['kontrola i sloboda korisnika', 'user control and freedom'], ['doslednost i standardi', 'consistency and standards'], ['sličnost sa stvarnim svetom', 'match with the real world'], ['vidljivost stanja sistema', 'visibility of system status']], 0, 'heuristike', 'Korisnik mora lako da se vrati iz radnje koju nije hteo.', 'The user must be able to back out of an action they did not mean.'),
  N('Tekst ima osvetljenost 0,2, a pozadina 1. Koliki je odnos kontrasta (samo broj ispred : 1)?', 'The text has a luminance of 0.2 and the background 1. What is the contrast ratio (just the number before : 1)?', '4.2', ': 1', 'boja', 'K = (1 + 0,05) / (0,2 + 0,05) = 1,05 / 0,25 = 4,2. Nedovoljno za običan tekst.', 'K = (1 + 0.05) / (0.2 + 0.05) = 1.05 / 0.25 = 4.2. Not enough for normal text.', 2),
  N('Cilj širok 20 px udaljen je 300 px. Koliki je indeks težine po Fitsu u bitima?', 'A 20 px wide target is 300 px away. What is the Fitts index of difficulty in bits?', '4', 'bit', 'zakoni', 'ID = log₂(300/20 + 1) = log₂(16) = 4 bita.', 'ID = log₂(300/20 + 1) = log₂(16) = 4 bits.', 2),
  C('Šta po Hikovom zakonu znači smanjiti meni sa 15 na 3 izbora?', 'By Hick\'s law, what does cutting a menu from 15 to 3 choices mean?',
    [['brža odluka, ali vreme ne pada pet puta jer raste po logaritmu', 'a faster decision, but time does not drop five times because it grows by a logarithm'], ['tačno pet puta brža odluka', 'a decision exactly five times faster'], ['sporija odluka', 'a slower decision'], ['nikakva promena', 'no change']], 0, 'zakoni', 'log₂(16) = 4 bita, a log₂(4) = 2 bita: duplo manje, a ne pet puta.', 'log₂(16) = 4 bits and log₂(4) = 2 bits: half, not a fifth.'),
  B('Crvena ivica polja je dovoljna oznaka greške za sve korisnike.', 'A red field border is a sufficient error sign for every user.', false, 'boja', 'Oko 8 % muškaraca slabo razlikuje crvenu i zelenu; dodaj ikonicu i tekst.', 'About 8 % of men have trouble telling red from green; add an icon and text.'),
  C('Koja je najmanja preporučena veličina cilja za dodir na telefonu?', 'What is the smallest recommended touch target size on a phone?',
    [['oko 44 × 44 px', 'about 44 × 44 px'], ['oko 10 × 10 px', 'about 10 × 10 px'], ['oko 20 × 20 px', 'about 20 × 20 px'], ['veličina nije važna', 'size does not matter']], 0, 'zakoni', 'Otprilike jagodica prsta; manje mete se promašuju.', 'Roughly a fingertip; smaller targets get missed.'),
  C('Šta je persona?', 'What is a persona?',
    [['izmišljen, ali realan opis tipičnog korisnika', 'a made-up but realistic description of a typical user'], ['pravi korisnik koji je platio aplikaciju', 'a real user who paid for the app'], ['logo aplikacije', 'the app logo'], ['vrsta fonta', 'a kind of font']], 0, 'proces', 'Persona pomaže timu da se seti za koga dizajnira.', 'A persona helps the team remember who they are designing for.'),
  M('Kojim sredstvima se gradi vizuelna hijerarhija?', 'Which means are used to build visual hierarchy?',
    [['veličina', 'size'], ['debljina slova', 'font weight'], ['prazan prostor', 'white space'], ['brzina interneta', 'internet speed']], [0, 1, 2], 'hijerarhija', 'Hijerarhiju grade veličina, debljina, boja, kontrast i prostor.', 'Hierarchy is built with size, weight, colour, contrast and space.'),
  C('Šta znači pristup „prvo mobilni” (mobile first)?', 'What does "mobile first" mean?',
    [['dizajnira se najpre za mali ekran, pa se dodaje za veći', 'you design for the small screen first, then add for the larger one'], ['sajt radi samo na telefonu', 'the site works only on phones'], ['aplikacija se prvo objavi u prodavnici', 'the app is published in a store first'], ['telefon se koristi kao server', 'a phone is used as a server']], 0, 'pristupacnost', 'Mali ekran tera da odlučiš šta je zaista važno.', 'A small screen forces you to decide what really matters.'),
  B('Prazan prostor između grupa elemenata pomaže čitljivosti.', 'White space between groups of elements helps readability.', true, 'hijerarhija', 'Razdvaja grupe, odmara oko i ističe važno.', 'It separates groups, rests the eye and makes the important stand out.')
]);

})();
