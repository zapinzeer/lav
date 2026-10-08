(function () {
'use strict';

function t(sr, en) { return { sr: sr, en: en }; }

function choice(text, options, correct, ref, explain) {
  return { type: 'choice', text: text, options: options, correct: correct, formula: 'off', working: 'off', points: 1, ref: ref, explain: explain };
}

function multi(text, options, correct, ref, explain) {
  return { type: 'multi', text: text, options: options, correct: correct, formula: 'off', working: 'off', points: 1, ref: ref, explain: explain };
}

function bool(text, correct, ref, explain) {
  return { type: 'bool', text: text, correct: correct, formula: 'off', working: 'off', points: 1, ref: ref, explain: explain };
}

function num(text, correct, unit, ref, explain, tol) {
  return { type: 'text', numeric: true, tol: tol == null ? 1 : tol, unit: unit, text: text, correct: correct, formula: 'optional', working: 'optional', points: 2, ref: ref, explain: explain };
}

function quiz(title, questions) {
  return { builtin: true, title: title, settings: { showAnswers: true, shuffleO: true }, questions: questions };
}

window.LAV_QUIZZES = {
  FIZ01: quiz(t('Magnetna indukcija · mali test', 'Magnetic induction · short test'), [
    choice(t('Koja je jedinica magnetne indukcije?', 'What is the unit of magnetic induction?'),
      [t('tesla (T)', 'tesla (T)'), t('veber (Wb)', 'weber (Wb)'), t('amper (A)', 'ampere (A)'), t('om (Ω)', 'ohm (Ω)')], 0, 'jedinice',
      t('Magnetna indukcija se meri u teslama. Veber je jedinica fluksa.', 'Magnetic induction is measured in teslas. The weber is the unit of flux.')),
    bool(t('Linije magnetnog polja su zatvorene krive, bez početka i kraja.', 'Magnetic field lines are closed curves with no beginning and no end.'), true, 'polje',
      t('Za razliku od električnog polja, magnetne linije se uvek zatvaraju.', 'Unlike the electric field, magnetic lines always close on themselves.')),
    choice(t('Provodnik sa strujom je paralelan linijama polja. Kolika je sila na njega?', 'A wire with a current is parallel to the field lines. How large is the force on it?'),
      [t('nula', 'zero'), t('najveća moguća', 'the largest possible'), t('polovina najveće', 'half of the largest'), t('ne može se odrediti', 'it cannot be determined')], 0, 'merenje',
      t('Sila zavisi od sinusa ugla, a za paralelan provodnik je ugao nula.', 'The force depends on the sine of the angle, and for a parallel wire the angle is zero.')),
    num(t('Indukcija je 2 T, struja 3 A, a provodnik dužine 0,5 m je normalan na polje. Kolika je sila u njutnima?', 'The induction is 2 T, the current 3 A, and a 0.5 m wire is perpendicular to the field. What is the force in newtons?'),
      '3', 'N|njutn|newton', 'merenje', t('Sila je proizvod indukcije, struje i dužine: 2 · 3 · 0,5 = 3 N.', 'The force is the product of induction, current and length: 2 · 3 · 0.5 = 3 N.')),
    multi(t('Izaberi sve što stvara magnetno polje.', 'Select everything that creates a magnetic field.'),
      [t('trajni magnet', 'a permanent magnet'), t('provodnik kroz koji teče struja', 'a wire carrying a current'), t('telo sa statičkim naelektrisanjem koje miruje', 'a body with a static charge at rest'), t('komad drveta', 'a piece of wood')], [0, 1], 'polje',
      t('Magnetno polje stvaraju magneti i naelektrisanja u kretanju, to jest struja.', 'A magnetic field is created by magnets and by moving charges, that is by a current.')),
    choice(t('Koju ruku koristimo za smer sile na provodnik sa strujom u polju?', 'Which hand do we use for the direction of the force on a wire with a current in a field?'),
      [t('levu', 'the left'), t('desnu', 'the right'), t('obe istovremeno', 'both at once'), t('nijednu', 'neither')], 0, 'merenje',
      t('Smer sile određujemo pravilom leve ruke.', 'The direction of the force is found by the left-hand rule.'))
  ]),

  FIZ02: quiz(t('Magnetni fluks · mali test', 'Magnetic flux · short test'), [
    choice(t('Koja je jedinica magnetnog fluksa?', 'What is the unit of magnetic flux?'),
      [t('veber (Wb)', 'weber (Wb)'), t('tesla (T)', 'tesla (T)'), t('henri (H)', 'henry (H)'), t('farad (F)', 'farad (F)')], 0, 'fluks',
      t('Fluks se meri u veberima, 1 Wb = 1 T·m².', 'Flux is measured in webers, 1 Wb = 1 T·m².')),
    bool(t('Fluks kroz površinu je najveći kada je površina okrenuta licem ka linijama polja.', 'The flux through a surface is largest when the surface faces the field lines head-on.'), true, 'ugao',
      t('Tada polje prolazi normalno kroz površinu i „probija” je najviše.', 'Then the field passes perpendicularly through the surface and "pierces" it the most.')),
    bool(t('Ako su linije polja paralelne sa površinom, fluks kroz nju je nula.', 'If the field lines are parallel to the surface, the flux through it is zero.'), true, 'ugao',
      t('Linije klize duž površine i ne prolaze kroz nju.', 'The lines slide along the surface and do not pass through it.')),
    num(t('Polje od 0,5 T je normalno na površinu od 0,2 m². Koliki je fluks u veberima?', 'A field of 0.5 T is perpendicular to a surface of 0.2 m². What is the flux in webers?'),
      '0,1|0.1', 'Wb|veber|weber', 'fluks', t('Fluks je proizvod polja i površine: 0,5 · 0,2 = 0,1 Wb.', 'The flux is the product of the field and the area: 0.5 · 0.2 = 0.1 Wb.')),
    choice(t('Šta se desi sa fluksom ako se površina udvostruči, a polje i ugao ostanu isti?', 'What happens to the flux if the area is doubled, and the field and the angle stay the same?'),
      [t('udvostruči se', 'it doubles'), t('prepolovi se', 'it halves'), t('ostane isti', 'it stays the same'), t('postane nula', 'it becomes zero')], 0, 'fluks',
      t('Fluks je srazmeran površini.', 'The flux is proportional to the area.')),
    choice(t('Šta stvara promena fluksa kroz kalem?', 'What does a change of the flux through a coil produce?'),
      [t('indukovani napon', 'an induced voltage'), t('toplotu u magnetu', 'heat in the magnet'), t('novi magnet', 'a new magnet'), t('ništa', 'nothing')], 0, 'zavojci',
      t('To je elektromagnetna indukcija.', 'This is electromagnetic induction.'))
  ]),

  FIZ03: quiz(t('Magnetno polje provodnika · mali test', 'Magnetic field of a wire · short test'), [
    choice(t('Ko je prvi primetio da struja skreće magnetnu iglu?', 'Who was the first to notice that a current deflects a compass needle?'),
      [t('Ersted', 'Ørsted'), t('Faradej', 'Faraday'), t('Amper', 'Ampère'), t('Lenc', 'Lenz')], 0, 'erested',
      t('Erstedov ogled iz 1820. pokazao je da struja stvara magnetno polje.', 'Ørsted\'s experiment of 1820 showed that a current creates a magnetic field.')),
    choice(t('Kako izgledaju linije polja oko pravog provodnika sa strujom?', 'What do the field lines around a straight wire with a current look like?'),
      [t('koncentrični krugovi oko provodnika', 'concentric circles around the wire'), t('prave linije paralelne provodniku', 'straight lines parallel to the wire'), t('spirale koje se udaljavaju', 'spirals moving away'), t('nema linija', 'there are no lines')], 0, 'erested',
      t('Linije su krugovi u ravni normalnoj na provodnik.', 'The lines are circles in the plane perpendicular to the wire.')),
    choice(t('Šta određuje smer linija polja oko provodnika?', 'What determines the direction of the field lines around a wire?'),
      [t('pravilo desne ruke', 'the right-hand rule'), t('pravilo leve ruke', 'the left-hand rule'), t('Omov zakon', 'Ohm\'s law'), t('boja izolacije', 'the colour of the insulation')], 0, 'erested',
      t('Palac desne ruke pokazuje smer struje, a savijeni prsti smer polja.', 'The thumb of the right hand points along the current, and the curled fingers show the field.')),
    bool(t('Što je tačka dalje od provodnika, polje u njoj je slabije.', 'The farther a point is from the wire, the weaker the field in it.'), true, 'zavisnost',
      t('Polje opada obrnuto srazmerno sa rastojanjem.', 'The field falls inversely proportionally with the distance.')),
    num(t('U tački na rastojanju d od provodnika polje je 4 μT. Koliko je polje (u μT) u tački na rastojanju 2d, ako je struja ista?', 'At a point at a distance d from a wire the field is 4 μT. What is the field (in μT) at a distance 2d, with the same current?'),
      '2', 'μT|µT|uT|mikrotesla|microtesla', 'zavisnost', t('Dvostruko rastojanje daje upola slabije polje.', 'A doubled distance gives half the field.')),
    bool(t('Kod dva paralelna provodnika sa strujama istog smera polja se između provodnika poništavaju.', 'For two parallel wires with currents in the same direction the fields cancel between the wires.'), true, 'superpozicija',
      t('Između njih polja imaju suprotne smerove, pa se oduzimaju.', 'Between them the fields have opposite directions, so they subtract.'))
  ]),

  FIZ04: quiz(t('Elektromagnet · mali test', 'Electromagnet · short test'), [
    choice(t('Šta se stavlja u kalem da bi polje bilo mnogo jače?', 'What is placed in a coil to make the field much stronger?'),
      [t('gvozdeno jezgro', 'an iron core'), t('drveni štap', 'a wooden rod'), t('plastična cev', 'a plastic tube'), t('ništa, vazduh je najbolji', 'nothing, air is best')], 0, 'jezgro',
      t('Gvožđe pojačava polje više stotina puta.', 'Iron strengthens the field hundreds of times.')),
    bool(t('Kada se struja kroz kalem prekine, elektromagnet sa mekim gvozdenim jezgrom gubi magnetizam.', 'When the current through the coil is cut, an electromagnet with a soft iron core loses its magnetism.'), true, 'kalem',
      t('To je prednost elektromagneta: može da se uključi i isključi.', 'This is the advantage of an electromagnet: it can be switched on and off.')),
    choice(t('Šta se desi sa poljem kalema ako se broj zavojaka udvostruči, a dužina i struja ostanu isti?', 'What happens to the field of a coil if the number of turns is doubled, with the same length and current?'),
      [t('udvostruči se', 'it doubles'), t('prepolovi se', 'it halves'), t('ostane isto', 'it stays the same'), t('nestane', 'it disappears')], 0, 'kalem',
      t('Polje je srazmerno broju zavojaka.', 'The field is proportional to the number of turns.')),
    choice(t('Šta je relej?', 'What is a relay?'),
      [t('prekidač kojim upravlja elektromagnet', 'a switch operated by an electromagnet'), t('vrsta baterije', 'a kind of battery'), t('vrsta diode', 'a kind of diode'), t('merni instrument', 'a measuring instrument')], 0, 'relej',
      t('Mala struja kroz kalem uključuje veliku struju u drugom kolu.', 'A small current through the coil switches a large current in another circuit.')),
    multi(t('Šta povećava jačinu elektromagneta?', 'What increases the strength of an electromagnet?'),
      [t('veća struja', 'a larger current'), t('više zavojaka', 'more turns'), t('gvozdeno jezgro', 'an iron core'), t('manja struja', 'a smaller current')], [0, 1, 2], 'kalem',
      t('Polje raste sa strujom, brojem zavojaka i prisustvom gvožđa.', 'The field grows with the current, the number of turns and the presence of iron.')),
    num(t('Kalem ima 100 zavojaka na dužini od 0,1 m. Koliko zavojaka ima po metru?', 'A coil has 100 turns over a length of 0.1 m. How many turns per metre is that?'),
      '1000', 'zavojaka/m|zavojaka po metru|zav/m|turns/m|turns per metre', 'kalem', t('100 zavojaka / 0,1 m = 1000 zavojaka po metru.', '100 turns / 0.1 m = 1000 turns per metre.'))
  ]),

  FIZ05: quiz(t('Amperova sila · mali test', 'Ampère force · short test'), [
    choice(t('Kada je sila na provodnik sa strujom u polju najveća?', 'When is the force on a wire with a current in a field largest?'),
      [t('kada je provodnik normalan na linije polja', 'when the wire is perpendicular to the field lines'), t('kada je provodnik paralelan linijama polja', 'when the wire is parallel to the field lines'), t('kada je ugao 30°', 'when the angle is 30°'), t('nikada', 'never')], 0, 'ugao',
      t('Najveća je za ugao od 90°, kada je sin α = 1.', 'It is largest for an angle of 90°, when sin α = 1.')),
    num(t('Provodnik dužine 0,1 m sa strujom 5 A normalan je na polje od 0,4 T. Kolika je sila u njutnima?', 'A 0.1 m wire with a current of 5 A is perpendicular to a field of 0.4 T. What is the force in newtons?'),
      '0,2|0.2', 'N|njutn|newton', 'sila', t('0,4 · 5 · 0,1 = 0,2 N.', '0.4 · 5 · 0.1 = 0.2 N.')),
    bool(t('Sila na provodnik je normalna i na provodnik i na linije polja.', 'The force on a wire is perpendicular to both the wire and the field lines.'), true, 'sila',
      t('Sila nikada nije paralelna sa poljem ni sa strujom.', 'The force is never parallel to the field or to the current.')),
    choice(t('Dva paralelna provodnika imaju struje istog smera. Šta se dešava između njih?', 'Two parallel wires carry currents in the same direction. What happens between them?'),
      [t('privlače se', 'they attract each other'), t('odbijaju se', 'they repel each other'), t('ne deluju jedan na drugi', 'they do not act on each other'), t('zagrevaju se', 'they heat up')], 0, 'paralelni',
      t('Istosmerne struje se privlače.', 'Currents in the same direction attract.')),
    bool(t('Provodnici sa strujama suprotnih smerova se odbijaju.', 'Wires with currents in opposite directions repel each other.'), true, 'paralelni',
      t('Suprotnosmerne struje se odbijaju.', 'Opposite currents repel.')),
    choice(t('Koju ruku koristimo za smer Amperove sile?', 'Which hand do we use for the direction of the Ampère force?'),
      [t('levu', 'the left'), t('desnu', 'the right'), t('nijednu', 'neither'), t('obe', 'both')], 0, 'sila',
      t('Smer sile daje pravilo leve ruke.', 'The direction of the force is given by the left-hand rule.'))
  ]),

  FIZ06: quiz(t('Elektromotor · mali test', 'Electric motor · short test'), [
    choice(t('Koji deo motora obrće smer struje u zavojku na svakih pola obrtaja?', 'Which part of a motor reverses the current in the loop every half-turn?'),
      [t('komutator', 'the commutator'), t('osigurač', 'the fuse'), t('otpornik', 'the resistor'), t('prekidač', 'the switch')], 0, 'komutator',
      t('Bez komutatora bi se rotor njihao i stao.', 'Without a commutator the rotor would swing and stop.')),
    bool(t('Na dve strane zavojka sa strujom u polju deluju sile suprotnih smerova.', 'On the two sides of a loop with a current in a field forces of opposite directions act.'), true, 'princip',
      t('Zajedno čine spreg koji vrti zavojak.', 'Together they form a couple that turns the loop.')),
    choice(t('Kada je obrtni moment zavojka najveći?', 'When is the torque on a loop largest?'),
      [t('kada je ravan zavojka paralelna linijama polja', 'when the plane of the loop is parallel to the field lines'), t('kada je ravan zavojka normalna na linije polja', 'when the plane of the loop is perpendicular to the field lines'), t('kada nema struje', 'when there is no current'), t('nikada', 'never')], 0, 'moment',
      t('Tada su krakovi sprega najveći.', 'Then the arms of the couple are largest.')),
    choice(t('Šta se dešava sa strujom motora kada rotor ubrza, a napon napajanja je isti?', 'What happens to the motor current when the rotor speeds up, with the same supply voltage?'),
      [t('opada, jer nastaje protivelektromotorna sila', 'it falls, because a back-EMF appears'), t('raste', 'it rises'), t('ostaje ista', 'it stays the same'), t('odmah postaje nula', 'it immediately becomes zero')], 0, 'emsila',
      t('Rotor koji se vrti indukuje napon koji se suprotstavlja izvoru.', 'A rotating rotor induces a voltage that opposes the source.')),
    bool(t('Struja motora je najveća u trenutku pokretanja.', 'The motor current is largest at the moment of starting.'), true, 'emsila',
      t('Pri mirovanju nema protivelektromotorne sile.', 'At rest there is no back-EMF.')),
    num(t('Napon napajanja je 12 V, protivelektromotorna sila 10 V, a otpor namotaja 2 Ω. Kolika je struja u amperima?', 'The supply voltage is 12 V, the back-EMF 10 V and the winding resistance 2 Ω. What is the current in amperes?'),
      '1', 'A|amper|ampere', 'emsila', t('(12 − 10) / 2 = 1 A.', '(12 − 10) / 2 = 1 A.'))
  ]),

  FIZ07: quiz(t('Elektromagnetna indukcija · mali test', 'Electromagnetic induction · short test'), [
    choice(t('Kada se u kalemu indukuje napon?', 'When is a voltage induced in a coil?'),
      [t('kada se fluks kroz kalem menja', 'when the flux through the coil changes'), t('kada magnet miruje u kalemu', 'when the magnet is still in the coil'), t('kada nema magnetnog polja', 'when there is no magnetic field'), t('uvek', 'always')], 0, 'ogled',
      t('Napon nastaje samo dok se fluks menja.', 'A voltage appears only while the flux changes.')),
    bool(t('Ako magnet miruje u kalemu, galvanometar priključen na kalem pokazuje nulu.', 'If a magnet is still in a coil, a galvanometer connected to the coil shows zero.'), true, 'ogled',
      t('Fluks je stalan, pa nema indukcije.', 'The flux is constant, so there is no induction.')),
    choice(t('Šta kaže Lencovo pravilo?', 'What does Lenz\'s rule say?'),
      [t('indukovana struja se suprotstavlja promeni koja ju je izazvala', 'the induced current opposes the change that caused it'), t('indukovana struja pojačava promenu koja ju je izazvala', 'the induced current strengthens the change that caused it'), t('indukovana struja nema smer', 'the induced current has no direction'), t('indukovana struja je uvek ista', 'the induced current is always the same')], 0, 'lenc',
      t('To je zakon održanja energije.', 'This is the law of conservation of energy.')),
    choice(t('Šta se desi sa indukovanim naponom ako se broj zavojaka udvostruči, a promena fluksa je ista?', 'What happens to the induced voltage if the number of turns is doubled with the same change of flux?'),
      [t('udvostruči se', 'it doubles'), t('prepolovi se', 'it halves'), t('ostane isti', 'it stays the same'), t('postane nula', 'it becomes zero')], 0, 'faradej',
      t('Napon je srazmeran broju zavojaka.', 'The voltage is proportional to the number of turns.')),
    num(t('Fluks kroz kalem od 100 zavojaka promeni se za 0,02 Wb za 0,1 s. Koliki je indukovani napon u voltima?', 'The flux through a 100-turn coil changes by 0.02 Wb in 0.1 s. What is the induced voltage in volts?'),
      '20', 'V|volt', 'faradej', t('100 · 0,02 / 0,1 = 20 V.', '100 · 0.02 / 0.1 = 20 V.')),
    choice(t('Kakav napon daje generator sa zavojkom koji se okreće u polju?', 'What kind of voltage does a generator with a loop rotating in a field give?'),
      [t('naizmenični (sinusni)', 'alternating (sinusoidal)'), t('stalan jednosmerni', 'a constant direct one'), t('nikakav', 'none'), t('pravougaoni', 'a square one')], 0, 'generator',
      t('Napon menja znak svakog pola obrtaja.', 'The voltage changes sign every half-turn.'))
  ]),

  OSN01: quiz(t('Merenje struje i napona · mali test', 'Measuring current and voltage · short test'), [
    choice(t('Kako se vezuje ampermetar u kolo?', 'How is an ammeter connected into a circuit?'),
      [t('redno (na red)', 'in series'), t('paralelno', 'in parallel'), t('pored izvora, bez veze', 'next to the source, not connected'), t('svejedno', 'it makes no difference')], 0, 'vezivanje',
      t('Struja mora da prođe kroz ampermetar.', 'The current must flow through the ammeter.')),
    choice(t('Kako se vezuje voltmetar?', 'How is a voltmeter connected?'),
      [t('paralelno elementu čiji napon merimo', 'in parallel with the element whose voltage we measure'), t('redno', 'in series'), t('ne vezuje se', 'it is not connected'), t('svejedno', 'it makes no difference')], 0, 'vezivanje',
      t('Napon se meri između dve tačke.', 'A voltage is measured between two points.')),
    bool(t('Instrumenti i utičnica navode efektivnu vrednost naizmeničnog napona.', 'Instruments and the wall socket quote the RMS value of an alternating voltage.'), true, 'signal',
      t('Efektivna vrednost daje istu toplotu kao jednosmerni napon.', 'The RMS value gives the same heat as a direct voltage.')),
    num(t('Vršni napon sinusnog signala je 10 V. Kolika je njegova efektivna vrednost u voltima? (jedna decimala)', 'The peak voltage of a sine signal is 10 V. What is its RMS value in volts? (one decimal)'),
      '7,07|7.07|7,1|7.1', 'V|volt', 'signal', t('Efektivna vrednost je vršna podeljena sa √2: 10 / 1,414 = 7,07 V.', 'The RMS value is the peak divided by √2: 10 / 1.414 = 7.07 V.')),
    bool(t('Dobar voltmetar ima veliki unutrašnji otpor.', 'A good voltmeter has a large internal resistance.'), true, 'otpor',
      t('Tako skoro ne opterećuje kolo koje meri.', 'In this way it hardly loads the circuit it measures.')),
    choice(t('Utičnica daje 230 V (efektivno). Koliki je približno vršni napon?', 'A socket gives 230 V (RMS). About how large is the peak voltage?'),
      [t('325 V', '325 V'), t('230 V', '230 V'), t('163 V', '163 V'), t('460 V', '460 V')], 0, 'signal',
      t('230 · 1,414 ≈ 325 V.', '230 · 1.414 ≈ 325 V.'))
  ]),

  OSN02: quiz(t('Merenje osciloskopom · mali test', 'Measuring with an oscilloscope · short test'), [
    choice(t('Šta pokazuje horizontalna osa osciloskopa?', 'What does the horizontal axis of an oscilloscope show?'),
      [t('vreme', 'time'), t('napon', 'voltage'), t('struju', 'current'), t('otpor', 'resistance')], 0, 'ekran',
      t('Osciloskop crta napon u vremenu.', 'An oscilloscope draws voltage against time.')),
    num(t('Signal zauzima 4 podeoka od najnižeg do najvišeg vrha, a V/div je 2 V. Koliki je napon vrh–vrh u voltima?', 'A signal takes 4 divisions from the lowest to the highest peak, and V/div is 2 V. What is the peak-to-peak voltage in volts?'),
      '8', 'V|volt', 'ekran', t('4 · 2 V = 8 V.', '4 · 2 V = 8 V.')),
    num(t('Jedna perioda zauzima 5 podeoka pri 2 ms/div. Kolika je frekvencija u hercima?', 'One period takes 5 divisions at 2 ms/div. What is the frequency in hertz?'),
      '100', 'Hz|herc|hertz', 'ekran', t('T = 5 · 2 ms = 10 ms, pa je f = 1 / 0,01 s = 100 Hz.', 'T = 5 · 2 ms = 10 ms, so f = 1 / 0.01 s = 100 Hz.')),
    choice(t('Koja sprega ulaza propušta samo naizmeničnu komponentu signala?', 'Which input coupling passes only the alternating component of a signal?'),
      [t('AC', 'AC'), t('DC', 'DC'), t('GND', 'GND'), t('nijedna', 'none')], 0, 'ekran',
      t('AC sprega zaustavlja jednosmernu komponentu.', 'AC coupling blocks the direct component.')),
    bool(t('Kod otpornika su napon i struja u fazi.', 'In a resistor the voltage and the current are in phase.'), true, 'rlc',
      t('Otpornik ne unosi fazni pomak.', 'A resistor introduces no phase shift.')),
    choice(t('Kod kalema struja u odnosu na napon:', 'In a coil the current, compared with the voltage:'),
      [t('kasni 90°', 'lags by 90°'), t('prednjači 90°', 'leads by 90°'), t('je u fazi', 'is in phase'), t('je suprotna', 'is opposite')], 0, 'rlc',
      t('Kod kalema struja kasni, kod kondenzatora prednjači.', 'In a coil the current lags, in a capacitor it leads.'))
  ]),

  ELE01: quiz(t('Usmerivač · mali test', 'The rectifier · short test'), [
    choice(t('Šta radi usmerivač?', 'What does a rectifier do?'),
      [t('pretvara naizmeničnu u jednosmernu struju', 'converts alternating into direct current'), t('pretvara jednosmernu u naizmeničnu struju', 'converts direct into alternating current'), t('povećava frekvenciju', 'increases the frequency'), t('pojačava signal', 'amplifies a signal')], 0, 'dioda',
      t('To je ispravljanje napona.', 'This is the rectification of a voltage.')),
    choice(t('U kom smeru dioda propušta struju?', 'In which direction does a diode pass current?'),
      [t('od anode ka katodi', 'from the anode to the cathode'), t('od katode ka anodi', 'from the cathode to the anode'), t('u oba smera', 'in both directions'), t('ni u jednom', 'in neither')], 0, 'dioda',
      t('Dioda je ventil za struju.', 'A diode is a valve for current.')),
    num(t('Koliki je približno napon vođenja silicijumske diode u voltima?', 'About what is the conduction voltage of a silicon diode in volts?'),
      '0,7|0.7|0,6|0.6', 'V|volt', 'dioda', t('Kod silicijuma je to oko 0,6 do 0,7 V.', 'For silicon it is about 0.6 to 0.7 V.')),
    bool(t('Poluperiodni usmerivač propušta samo jednu poluperiodu naizmeničnog napona.', 'A half-wave rectifier passes only one half-cycle of the alternating voltage.'), true, 'poluperioda',
      t('U drugoj poluperiodi dioda je zakočena.', 'In the other half-cycle the diode is blocked.')),
    choice(t('Šta radi kondenzator paralelno sa opterećenjem usmerivača?', 'What does a capacitor in parallel with the load of a rectifier do?'),
      [t('izravnava napon, to jest smanjuje talasanje', 'smooths the voltage, that is reduces the ripple'), t('povećava talasanje', 'increases the ripple'), t('pretvara napon u naizmeničan', 'turns the voltage into an alternating one'), t('ništa', 'nothing')], 0, 'filtar',
      t('Kondenzator skladišti naelektrisanje pri vrhu i daje ga opterećenju.', 'The capacitor stores charge near the peak and gives it to the load.')),
    num(t('Napon na sekundaru transformatora je 10 V efektivno. Koliki je vršni napon u voltima? (zaokruži na jednu decimalu)', 'The voltage on the transformer secondary is 10 V RMS. What is the peak voltage in volts? (round to one decimal)'),
      '14,1|14.1|14,14|14.14', 'V|volt', 'poluperioda', t('Vrh je efektivna vrednost puta √2: 10 · 1,414 = 14,1 V.', 'The peak is the RMS value times √2: 10 · 1.414 = 14.1 V.'))
  ]),

  ELE02: quiz(t('Grecov usmerivač · mali test', 'The Graetz rectifier · short test'), [
    choice(t('Koliko dioda ima Grecov (mosni) usmerivač?', 'How many diodes does a Graetz (bridge) rectifier have?'),
      [t('četiri', 'four'), t('jednu', 'one'), t('dve', 'two'), t('osam', 'eight')], 0, 'most',
      t('Četiri diode vezane u obliku romba.', 'Four diodes connected in a diamond.')),
    bool(t('Mosni usmerivač koristi obe poluperiode naizmeničnog napona.', 'A bridge rectifier uses both half-cycles of the alternating voltage.'), true, 'most',
      t('Zato daje dvaput veći srednji napon od poluperiodnog.', 'That is why it gives twice the average voltage of a half-wave rectifier.')),
    choice(t('Kolika je učestanost talasanja mosnog usmerivača priključenog na mrežu od 50 Hz?', 'What is the ripple frequency of a bridge rectifier connected to the 50 Hz mains?'),
      [t('100 Hz', '100 Hz'), t('50 Hz', '50 Hz'), t('25 Hz', '25 Hz'), t('150 Hz', '150 Hz')], 0, 'most',
      t('Pulsevi dolaze u obe poluperiode, pa dvaput češće.', 'The pulses come in both half-cycles, so twice as often.')),
    num(t('Koliko dioda istovremeno vodi struju u mosnom usmerivaču?', 'How many diodes conduct at the same time in a bridge rectifier?'),
      '2', '', 'most', t('Uvek vode dve: jedna sa plus, jedna sa minus strane.', 'Two always conduct: one on the plus side and one on the minus side.'), 0),
    choice(t('Isti kondenzator iza mosnog usmerivača, u odnosu na poluperiodni, daje talasanje koje je:', 'The same capacitor behind a bridge rectifier, compared with a half-wave one, gives a ripple that is:'),
      [t('upola manje', 'half as large'), t('dvaput veće', 'twice as large'), t('isto', 'the same'), t('nula', 'zero')], 0, 'filtar',
      t('Kondenzator se dopunjava dvaput češće.', 'The capacitor is topped up twice as often.')),
    num(t('Dve diode su na red sa opterećenjem, a svaka troši 0,7 V. Koliko volti se ukupno gubi na diodama?', 'Two diodes are in series with the load and each uses up 0.7 V. How many volts are lost in total on the diodes?'),
      '1,4|1.4', 'V|volt', 'most', t('2 · 0,7 V = 1,4 V.', '2 · 0.7 V = 1.4 V.'))
  ])
};
})();
