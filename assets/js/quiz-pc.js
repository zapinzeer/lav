(function () {
'use strict';
var H = window.LAV_QH, t = H.t, C = H.C, M = H.M, B = H.B, N = H.N;
var Q = window.LAV_QUIZZES;

Q.PC01 = H.quiz(t('Vrste kućišta · mali test', 'Types of cases · short test'), [
  C('Koje kućište je najveće?', 'Which case is the largest?',
    ['Full tower', 'Mid tower', 'Mini tower', 'Mini-ITX (SFF)'], 0, 'vrste', 'Full tower prima najviše komponenti, uključujući E-ATX ploče.', 'A full tower takes the most components, including E-ATX boards.'),
  B('Micro-ATX ploča može da se ugradi u kućište za ATX ploče.', 'A micro-ATX board can be installed in a case made for ATX boards.', true, 'formfaktor', 'Manje ploče staju u veća kućišta jer su rupe za zavrtnje na istim mestima.', 'Smaller boards fit in larger cases because the screw holes are in the same places.'),
  C('Kako treba da teče vazduh kroz kućište?', 'How should air flow through a case?',
    [['usisavanje sprijeda, izbacivanje pozadi i odozgo', 'intake at the front, exhaust at the back and top'], ['usisavanje pozadi, izbacivanje sprijeda', 'intake at the back, exhaust at the front'], ['samo kroz bočni lim', 'only through the side panel'], ['uopšte ne treba da teče', 'it should not flow at all']], 0, 'hladjenje', 'Hladan vazduh ulazi sprijeda, a topao izlazi pozadi i odozgo jer se topao vazduh diže.', 'Cool air comes in at the front and warm air leaves at the back and top because warm air rises.'),
  C('Šta kućište NE radi?', 'What does a case NOT do?',
    [['ne pretvara naizmeničnu struju u jednosmernu', 'it does not convert AC into DC'], ['nosi komponente', 'it holds the components'], ['usmerava vazduh', 'it directs the air'], ['štiti od prašine i smetnji', 'it protects against dust and interference']], 0, 'uloga', 'To radi napajanje.', 'That is done by the power supply.'),
  N('Koliko je visina 4U rek kućišta u milimetrima? (1U = 44,45 mm, zaokruži na ceo broj)', 'What is the height of a 4U rack case in millimetres? (1U = 44.45 mm, round to a whole number)', '178|177,8|177.8', 'mm|milimetar|millimetre', 'vrste', '4 · 44,45 = 177,8 mm.', '4 · 44.45 = 177.8 mm.')
], [
  B('Mini-ITX ploča može da se ugradi u kućište za ATX ploče.', 'A mini-ITX board can be installed in a case for ATX boards.', true, 'formfaktor', 'Ploče različitih veličina imaju zajedničke rupe za zavrtnje.', 'Boards of different sizes share common screw holes.'),
  B('E-ATX ploča uvek staje u mid tower kućište.', 'An E-ATX board always fits in a mid tower case.', false, 'formfaktor', 'E-ATX je šira od ATX, pa staje samo u kućišta koja je izričito podržavaju (najčešće full tower).', 'E-ATX is wider than ATX, so it fits only in cases that explicitly support it (usually full towers).'),
  C('Šta je pozitivan pritisak u kućištu?', 'What is positive pressure in a case?',
    [['više vazduha ulazi nego izlazi, pa prašina ne ulazi kroz procepe', 'more air goes in than out, so dust does not enter through gaps'], ['više vazduha izlazi nego ulazi', 'more air goes out than in'], ['kućište je zatvoreno bez ventilatora', 'the case is sealed without fans'], ['napon u kućištu je pozitivan', 'the voltage in the case is positive']], 0, 'hladjenje', 'Suvišak vazduha izlazi kroz sve otvore, pa prašina ne ulazi kroz njih.', 'The extra air leaves through all the openings, so dust cannot enter through them.'),
  C('Kućište ima dva ulazna ventilatora od po 70 CFM i jedan izlazni od 60 CFM. Kakav je pritisak u njemu?', 'A case has two intake fans of 70 CFM each and one exhaust fan of 60 CFM. What is the pressure inside?',
    [['pozitivan', 'positive'], ['negativan', 'negative'], ['jednak spoljašnjem', 'equal to the outside'], ['nepoznat', 'unknown']], 0, 'hladjenje', 'Ulazi 140 CFM, a izlazi 60 CFM, pa je pritisak pozitivan.', '140 CFM comes in and 60 CFM goes out, so the pressure is positive.'),
  C('Zašto se izlazni ventilatori stavljaju gore i pozadi?', 'Why are exhaust fans put at the top and the back?',
    [['topao vazduh se diže, a pozadi su komponente koje najviše greju', 'warm air rises, and the hottest components are near the back'], ['zbog izgleda', 'for looks'], ['zato što je tamo jeftinije', 'because it is cheaper there'], ['zbog buke', 'because of the noise']], 0, 'hladjenje', 'Prirodno kretanje vazduha pomaže ventilatorima.', 'The natural movement of air helps the fans.'),
  N('Mid tower je 21 × 46 × 45 cm. Kolika mu je zapremina u litrima? (zaokruži na jednu decimalu)', 'A mid tower is 21 × 46 × 45 cm. What is its volume in litres? (round to one decimal)', '43,5|43.5|43,47|43.47', 'l|L|litar|litre|liter', 'vrste', '21 · 46 · 45 = 43 470 cm³ = 43,5 l.', '21 · 46 · 45 = 43 470 cm³ = 43.5 l.'),
  C('Koje je glavno ograničenje malih Mini-ITX kućišta (SFF)?', 'What is the main limitation of small mini-ITX (SFF) cases?',
    [['visina hladnjaka, dužina kartice i protok vazduha', 'cooler height, card length and airflow'], ['ne mogu da se napajaju', 'they cannot be powered'], ['ne mogu da imaju procesor', 'they cannot hold a processor'], ['nemaju USB portove', 'they have no USB ports']], 0, 'vrste', 'Zbog tesnog prostora komponente moraju da se biraju pažljivo.', 'Because of the tight space, components must be chosen carefully.'),
  M('Šta poboljšava hlađenje kućišta?', 'What improves the cooling of a case?',
    [['mrežasta prednja strana', 'a mesh front panel'], ['ulazni ventilatori sprijeda i izlazni pozadi', 'intake fans at the front and exhaust at the back'], ['potpuno staklena prednja strana', 'a solid glass front'], ['svi ventilatori okrenuti ka unutra bez izlaza', 'all fans facing inward with no exhaust']], [0, 1], 'hladjenje', 'Vazduh mora da ima i ulaz i izlaz.', 'Air needs both an entrance and an exit.')
]);

Q.PC02 = H.quiz(t('Napajanje · mali test', 'Power supply · short test'), [
  C('Šta radi napajanje računara?', 'What does a computer power supply do?',
    [['pretvara naizmenični napon 230 V u jednosmerne niske napone', 'converts the 230 V AC into low DC voltages'], ['pojačava signal', 'amplifies the signal'], ['hladi procesor', 'cools the processor'], ['čuva podatke', 'stores data']], 0, 'zasto', 'Ispravlja, spušta i stabilizuje napon.', 'It rectifies, steps down and regulates the voltage.'),
  C('Koju boju ima žica od +12 V?', 'What colour is the +12 V wire?', [['žuta', 'yellow'], ['crvena', 'red'], ['narandžasta', 'orange'], ['plava', 'blue']], 0, 'model', 'Žuta je 12 V, crvena 5 V, narandžasta 3,3 V.', 'Yellow is 12 V, red 5 V and orange 3.3 V.'),
  C('Gde se priključuje 24-pin konektor?', 'Where does the 24-pin connector go?',
    [['na matičnu ploču', 'onto the motherboard'], ['na grafičku karticu', 'onto the graphics card'], ['na disk', 'onto a drive'], ['na monitor', 'onto the monitor']], 0, 'model', 'To je glavni konektor za napajanje ploče.', 'It is the main power connector of the board.'),
  B('Oznaka 650 W na napajanju je izlazna snaga.', 'The 650 W mark on a power supply is the output power.', true, 'snaga', 'Iz mreže uzima nešto više zbog gubitaka.', 'It draws somewhat more from the mains because of losses.'),
  N('Izlazna snaga je 170 W, a efikasnost 85 %. Kolika je ulazna snaga u vatima?', 'The output power is 170 W and the efficiency is 85 %. What is the input power in watts?', '200', 'W|vat|watt', 'snaga', 'P_in = 170 / 0,85 = 200 W.', 'P_in = 170 / 0.85 = 200 W.')
], [
  N('Napajanje daje 400 W uz efikasnost 90 %. Koliko vati se gubi u obliku toplote? (zaokruži na jednu decimalu)', 'A power supply delivers 400 W with an efficiency of 90 %. How many watts are lost as heat? (round to one decimal)', '44,4|44.4', 'W|vat|watt', 'snaga', 'P_in = 400/0,9 = 444,4 W, gubici = 44,4 W.', 'P_in = 400/0.9 = 444.4 W, the loss is 44.4 W.'),
  N('Na šini od 12 V se isporučuje 600 W. Kolika je struja u amperima?', '600 W is delivered on the 12 V rail. What is the current in amperes?', '50', 'A|amper|ampere', 'snaga', 'I = P/U = 600/12 = 50 A.', 'I = P/U = 600/12 = 50 A.'),
  C('Koji 80 PLUS nivo ima najvišu efikasnost?', 'Which 80 PLUS level has the highest efficiency?',
    ['Titanium', 'Bronze', 'Gold', 'Silver'], 0, 'snaga', 'Redosled je Bronze, Silver, Gold, Platinum, Titanium.', 'The order is Bronze, Silver, Gold, Platinum, Titanium.'),
  C('Čemu služi zelena žica PS_ON?', 'What is the green PS_ON wire for?',
    [['ploča njome uključuje napajanje', 'the board uses it to switch the supply on'], ['napaja ventilator', 'it powers the fan'], ['to je masa', 'it is ground'], ['to je zaštita od prenapona', 'it is the over-voltage protection']], 0, 'model', 'Kratak spoj PS_ON sa masom pokreće napajanje.', 'Shorting PS_ON to ground starts the supply.'),
  C('Čemu služi PFC (korekcija faktora snage)?', 'What is PFC (power factor correction) for?',
    [['da struja iz mreže bude sinusna i u fazi sa naponom', 'to make the current from the mains sinusoidal and in phase with the voltage'], ['da napajanje bude jače', 'to make the supply stronger'], ['da se smanji napon', 'to lower the voltage'], ['da se napajanje ohladi', 'to cool the supply']], 0, 'zastite', 'Time se smanjuje opterećenje mreže i povećava iskorišćenje snage.', 'This reduces the load on the mains and improves power utilisation.'),
  N('Računar troši 270 W, a efikasnost napajanja je 90 %. Koliko kWh uzima iz mreže za 1 h?', 'A computer uses 270 W and the efficiency of its power supply is 90 %. How many kWh does it take from the mains in 1 h?', '0,3|0.3', 'kWh', 'snaga', 'P_in = 270/0,9 = 300 W, za 1 h je to 0,3 kWh.', 'P_in = 270/0.9 = 300 W, which is 0.3 kWh in 1 h.'),
  M('Koje su zaštite napajanja?', 'Which are protections of a power supply?',
    [['OVP (prenapon)', 'OVP (over-voltage)'], ['SCP (kratak spoj)', 'SCP (short circuit)'], ['OTP (pregrevanje)', 'OTP (over-temperature)'], ['RGB (osvetljenje)', 'RGB (lighting)']], [0, 1, 2], 'zastite', 'RGB nije zaštita.', 'RGB is not a protection.'),
  N('Grafička kartica troši 375 W. Slot daje 75 W, a svaki 8-pin PCIe kabl 150 W. Koliko 8-pin kablova treba?', 'A graphics card draws 375 W. The slot gives 75 W and each 8-pin PCIe cable 150 W. How many 8-pin cables are needed?', '2', '', 'zastite', '(375 − 75)/150 = 2.', '(375 − 75)/150 = 2.', 0)
]);

Q.PC03 = H.quiz(t('Delovi matične ploče · mali test', 'Parts of the motherboard · short test'), [
  C('Gde se ubacuje grafička kartica?', 'Where does the graphics card go?',
    ['PCIe x16', 'SATA', 'CR2032', 'USB'], 0, 'model', 'Najduži PCIe slot je namenjen grafičkoj kartici.', 'The longest PCIe slot is meant for the graphics card.'),
  B('Baterija CMOS (CR2032) čuva podešavanja i sat kad je računar isključen.', 'The CMOS battery (CR2032) keeps the settings and the clock when the computer is off.', true, 'model', 'Zato računar „pamti” vreme.', 'That is why the computer "remembers" the time.'),
  C('Šta radi VRM?', 'What does the VRM do?',
    [['pretvara 12 V u nizak napon za procesor', 'converts 12 V to a low voltage for the processor'], ['čuva podatke', 'stores data'], ['hladi ploču', 'cools the board'], ['pojačava zvuk', 'amplifies sound']], 0, 'model', 'Procesor radi na oko 1 V sa velikom strujom.', 'The processor works at about 1 V with a large current.'),
  C('Čemu služe SATA portovi?', 'What are SATA ports for?',
    [['za priključenje diskova', 'to connect drives'], ['za memoriju', 'for memory'], ['za procesor', 'for the processor'], ['za monitor', 'for a monitor']], 0, 'veze', 'SATA veza je za HDD, SSD i optičke uređaje.', 'SATA is for HDDs, SSDs and optical drives.'),
  N('Koliko pinova ima glavni ATX konektor napajanja?', 'How many pins does the main ATX power connector have?', '24', '', 'model', 'To je 24-pin (20 + 4).', 'It is the 24-pin (20 + 4).', 0)
], [
  C('Koji konektor napaja procesor?', 'Which connector powers the processor?',
    [['EPS 8-pin (4+4)', 'EPS 8-pin (4+4)'], ['ATX 24-pin', 'ATX 24-pin'], ['SATA napajanje', 'SATA power'], ['Molex', 'Molex']], 0, 'model', 'EPS dovodi 12 V procesoru i njegovom VRM-u.', 'The EPS brings 12 V to the processor and its VRM.'),
  C('Koji je napon CR2032 baterije?', 'What is the voltage of a CR2032 battery?',
    [['3 V', '3 V'], ['1,5 V', '1.5 V'], ['5 V', '5 V'], ['12 V', '12 V']], 0, 'model', 'To je litijumska dugmasta ćelija od 3 V.', 'It is a 3 V lithium coin cell.'),
  C('Koja je uloga čipseta?', 'What is the role of the chipset?',
    [['povezuje procesor sa USB, SATA i dodatnim PCIe uređajima', 'connects the processor to USB, SATA and extra PCIe devices'], ['hladi ploču', 'cools the board'], ['pretvara napon', 'converts voltage'], ['čuva BIOS', 'stores the BIOS']], 0, 'veze', 'Sporije veze idu preko čipseta, brze direktno na procesor.', 'Slower links go through the chipset, fast ones directly to the processor.'),
  B('Najbrže veze (RAM i glavni PCIe x16) idu direktno na procesor.', 'The fastest links (RAM and the main PCIe x16) go directly to the processor.', true, 'veze', 'Zato je to kratak put sa malim kašnjenjem.', 'That is a short path with low latency.'),
  M('Šta se nalazi na zadnjoj I/O ploči?', 'What is on the rear I/O panel?',
    [['USB portovi', 'USB ports'], ['video izlazi (HDMI/DisplayPort)', 'video outputs (HDMI/DisplayPort)'], ['mrežni (Ethernet) priključak', 'a network (Ethernet) connector'], ['SATA portovi', 'SATA ports']], [0, 1, 2], 'model', 'SATA portovi su na samoj ploči, unutar kućišta.', 'SATA ports are on the board itself, inside the case.'),
  C('Kojim konektorom se priključuju USB portovi na prednjoj strani kućišta?', 'Which connector is used for the USB ports on the front of the case?',
    [['USB header na ploči', 'a USB header on the board'], ['PCIe slot', 'a PCIe slot'], ['CPU_FAN', 'CPU_FAN'], ['ATX 24-pin', 'ATX 24-pin']], 0, 'veze', 'Interni USB konektor (header) se nalazi uz ivicu ploče.', 'The internal USB connector (header) sits near the edge of the board.'),
  N('Koliko traka (lane) ima PCIe x16 slot?', 'How many lanes does a PCIe x16 slot have?', '16', '', 'veze', 'Oznaka x16 znači 16 traka.', 'The mark x16 means 16 lanes.', 0),
  C('Šta se čuva u BIOS čipu?', 'What is stored in the BIOS chip?',
    [['program za pokretanje i podešavanja ploče, bez struje', 'the start-up program and the board settings, without power'], ['svi programi korisnika', 'all the programs of the user'], ['slike i filmovi', 'pictures and films'], ['ništa', 'nothing']], 0, 'model', 'To je neisparljiva flash memorija.', 'It is non-volatile flash memory.')
]);

Q.PC04 = H.quiz(t('Matična ploča u fokusu · mali test', 'The motherboard in focus · short test'), [
  C('Šta znači POST?', 'What does POST stand for?',
    [['samoprovera pri uključivanju', 'power-on self-test'], ['pošta', 'mail'], ['vrsta procesora', 'a kind of processor'], ['format memorije', 'a memory format']], 0, 'bios', 'BIOS proverava memoriju, procesor i grafiku pre pokretanja sistema.', 'The BIOS checks memory, the processor and graphics before the system starts.'),
  B('PCIe 4.0 x16 je brži od PCIe 3.0 x16.', 'PCIe 4.0 x16 is faster than PCIe 3.0 x16.', true, 'pcie', 'Svaka generacija udvostručuje brzinu.', 'Every generation doubles the speed.'),
  C('Šta znači VRM?', 'What does VRM stand for?',
    [['modul za regulaciju napona', 'voltage regulator module'], ['video memorija', 'video RAM module'], ['virtuelna memorija', 'virtual RAM memory'], ['vrhunski modul', 'a top module']], 0, 'vrm', 'Spušta 12 V na napon procesora.', 'It steps 12 V down to the processor voltage.'),
  B('Podnožje ploče mora da odgovara procesoru.', 'The socket of the board must match the processor.', true, 'cpu', 'Procesor sa drugim podnožjem fizički ne staje.', 'A processor with a different socket does not fit physically.'),
  N('Propusnost jednog kanala DDR5-6000 je 6000 · 8 MB/s. Koliko je to u GB/s?', 'The bandwidth of one DDR5-6000 channel is 6000 · 8 MB/s. How many GB/s is that?', '48', 'GB/s', 'ram', '6000 · 8 = 48 000 MB/s = 48 GB/s.', '6000 · 8 = 48 000 MB/s = 48 GB/s.')
], [
  N('Dva modula DDR5-5600 rade dvokanalno (64 bita po kanalu). Kolika je ukupna propusnost u GB/s?', 'Two DDR5-5600 modules work in dual-channel mode (64 bits per channel). What is the total bandwidth in GB/s?', '89,6|89.6', 'GB/s', 'ram', '5600 · 8 · 2 = 89 600 MB/s.', '5600 · 8 · 2 = 89 600 MB/s.'),
  N('Jedna PCIe 3.0 traka daje oko 1 GB/s. Kolika je brzina PCIe 3.0 x4 NVMe diska u GB/s?', 'One PCIe 3.0 lane gives about 1 GB/s. What is the speed of a PCIe 3.0 x4 NVMe drive in GB/s?', '4|3,94|3.94', 'GB/s', 'pcie', '4 trake · 1 GB/s ≈ 4 GB/s.', '4 lanes · 1 GB/s ≈ 4 GB/s.', 5),
  N('PCIe 3.0 traka daje oko 1 GB/s, a svaka generacija je duplo brža. Kolika je brzina PCIe 5.0 x16 u GB/s?', 'A PCIe 3.0 lane gives about 1 GB/s and every generation is twice as fast. What is the speed of PCIe 5.0 x16 in GB/s?', '64', 'GB/s', 'pcie', 'Gen 5 je 4 puta brža od Gen 3: 4 GB/s po traci, 16 traka = 64 GB/s.', 'Gen 5 is 4 times faster than Gen 3: 4 GB/s per lane, 16 lanes = 64 GB/s.', 3),
  N('VRM spušta 12 V na 1,2 V. Koliki je faktor ispune (u %) idealnog silaznog pretvarača?', 'A VRM steps 12 V down to 1.2 V. What is the duty cycle (in %) of an ideal buck converter?', '10', '%|procenat|percent', 'vrm', 'D = U_out/U_in = 1,2/12 = 0,1.', 'D = U_out/U_in = 1.2/12 = 0.1.'),
  N('Procesor povlači 180 A, a VRM ima 12 faza. Kolika je struja po fazi u A?', 'The processor draws 180 A and the VRM has 12 phases. What is the current per phase in A?', '15', 'A|amper|ampere', 'vrm', '180/12 = 15 A.', '180/12 = 15 A.'),
  C('Ryzen sa podnožjem AM5 ima ploču sa podnožjem AM4. Šta sledi?', 'A Ryzen with an AM5 socket meets a board with an AM4 socket. What follows?',
    [['ne mogu da rade zajedno, treba ploča sa AM5', 'they cannot work together, an AM5 board is needed'], ['rade normalno', 'they work normally'], ['rade sporije', 'they work slower'], ['treba samo drugi BIOS', 'only another BIOS is needed']], 0, 'izbor', 'Podnožje je fizički i električno drugačije.', 'The socket is different physically and electrically.'),
  C('Šta radi UEFI/BIOS?', 'What does the UEFI/BIOS do?',
    [['pokreće hardver i učitava operativni sistem', 'initialises the hardware and loads the operating system'], ['hladi ploču', 'cools the board'], ['pojačava signal', 'amplifies the signal'], ['povećava RAM', 'increases the RAM']], 0, 'bios', 'Prva faza pokretanja računara.', 'The first stage of starting a computer.'),
  M('Šta proveravaš pri izboru ploče?', 'What do you check when choosing a board?',
    [['podnožje procesora', 'the processor socket'], ['vrstu memorije (DDR4/DDR5)', 'the memory type (DDR4/DDR5)'], ['form-faktor', 'the form factor'], ['boju PCB-a', 'the colour of the PCB']], [0, 1, 2], 'izbor', 'Boja nema uticaja na rad.', 'The colour has no effect on operation.')
]);

Q.PC05 = H.quiz(t('Ugradnja matične ploče · mali test', 'Installing the motherboard · short test'), [
  C('Šta treba uraditi pre dodirivanja komponenti?', 'What should you do before touching the components?',
    [['isprazniti statički elektricitet dodirom metalnog dela kućišta', 'discharge static electricity by touching a metal part of the case'], ['navlažiti ruke', 'wet your hands'], ['obući vunene rukavice', 'put on woolen gloves'], ['ništa', 'nothing']], 0, 'priprema', 'ESD može da ošteti čipove.', 'ESD can damage chips.'),
  C('Gde idu distanceri?', 'Where do the standoffs go?',
    [['tačno ispod rupa na ploči', 'exactly under the holes of the board'], ['bilo gde', 'anywhere'], ['uz ivice kućišta', 'along the edges of the case'], ['na poleđinu ploče', 'on the back of the board']], 0, 'distanceri', 'Distancer bez rupe može da napravi kratak spoj.', 'A standoff with no hole can cause a short circuit.'),
  B('I/O štitnik se stavlja pre ploče.', 'The I/O shield is fitted before the board.', true, 'koraci', 'Kad je ploča zavrnuta, štitnik se teško stavlja.', 'Once the board is screwed in, the shield is hard to fit.'),
  N('Koliko rupa za zavrtnje ima standardna ATX ploča?', 'How many mounting holes does a standard ATX board have?', '9', '', 'distanceri', 'ATX ploča ima 9 rupa.', 'An ATX board has 9 holes.', 0),
  B('Dugme za napajanje (PWR SW) nema polaritet.', 'The power button (PWR SW) has no polarity.', true, 'prednji', 'Dugme samo kratko spaja dva pina.', 'The button just shorts two pins briefly.')
], [
  C('Kojim redosledom zatežeš zavrtnje?', 'In which order do you tighten the screws?',
    [['ukršteno, prvo lagano, pa čvrsto', 'in a crossing pattern, lightly first and then firmly'], ['redom s jedne strane na drugu', 'in order from one side to the other'], ['samo jedan', 'only one'], ['svejedno', 'it does not matter']], 0, 'koraci', 'Tako se ploča ne iskrivi.', 'That way the board does not warp.'),
  C('Računar se ne pali, a ništa ne radi. Šta prvo proveriš?', 'The computer does not start and nothing works. What do you check first?',
    [['EPS i 24-pin konektore i prekidač napajanja', 'the EPS and 24-pin connectors and the PSU switch'], ['boju kabla', 'the colour of the cable'], ['tastaturu', 'the keyboard'], ['monitor', 'the monitor']], 0, 'prvo-paljenje', 'Najčešći razlog je nepriključen EPS ili isključen prekidač.', 'The most common reason is an unplugged EPS or a switched-off PSU.'),
  N('Čovek je kondenzator od 100 pF naelektrisan na 3 kV. Kolika je energija u mJ? (zaokruži na dve decimale)', 'A person is a 100 pF capacitor charged to 3 kV. What is the energy in mJ? (round to two decimals)', '0,45|0.45', 'mJ|milidzul|millijoule', 'priprema', 'W = ½CU² = 0,5 · 10⁻¹⁰ · 9·10⁶ = 0,45 mJ.', 'W = ½CU² = 0.5 · 10⁻¹⁰ · 9·10⁶ = 0.45 mJ.'),
  N('Procesor troši 150 W preko EPS-a od 12 V. Kolika je struja u A? (zaokruži na jednu decimalu)', 'A processor draws 150 W through a 12 V EPS. What is the current in A? (round to one decimal)', '12,5|12.5', 'A|amper|ampere', 'kablovi', 'I = P/U = 150/12 = 12,5 A.', 'I = P/U = 150/12 = 12.5 A.'),
  C('Ventilatori se vrte, ali nema slike. Šta je verovatan uzrok?', 'The fans spin, but there is no picture. What is a likely cause?',
    [['memorija nije do kraja ubačena ili je monitor u pogrešnom izlazu', 'the memory is not fully seated or the monitor is in the wrong output'], ['pogrešan distancer', 'a wrong standoff'], ['pregoreo ventilator', 'a burnt-out fan'], ['tastatura', 'the keyboard']], 0, 'prvo-paljenje', 'Proveri RAM i da li je kabl monitora na grafičkoj kartici.', 'Check the RAM and whether the monitor cable is in the graphics card.'),
  B('Višak distancera bez rupe iznad njega može da izazove kratak spoj.', 'A spare standoff with no hole above it can cause a short circuit.', true, 'distanceri', 'Dodiruje tragove na poleđini ploče.', 'It touches the tracks on the back of the board.'),
  N('mATX ploča ima 9 rupa, a postavio si 7 distancera. Koliko ih fali?', 'An mATX board has 9 holes and you fitted 7 standoffs. How many are missing?', '2', '', 'distanceri', '9 − 7 = 2.', '9 − 7 = 2.', 0),
  C('Zašto prvo staviš procesor, hladnjak i memoriju na ploču van kućišta?', 'Why do you first put the processor, cooler and memory on the board outside the case?',
    [['ima više mesta i lakše je raditi', 'there is more room and it is easier to work'], ['zbog garancije', 'because of the warranty'], ['zbog boje', 'because of the colour'], ['nije važno', 'it does not matter']], 0, 'koraci', 'Van kućišta ploča leži na kutiji i ima otvoren pristup.', 'Outside the case the board lies on its box with open access.'),
  B('Kada konektor ide teško, treba ga ubaciti većom silom.', 'When a connector goes in hard, you should push it in with more force.', false, 'kablovi', 'Konektori imaju urez i ulaze samo u jednom položaju. Težak ulaz znači da je pogrešan položaj.', 'Connectors are keyed and go in only one way. A hard fit means the wrong orientation.')
]);

Q.PC06 = H.quiz(t('Unutrašnja i spoljna memorija · mali test', 'Internal and external memory · short test'), [
  B('RAM gubi sadržaj kad se računar isključi.', 'RAM loses its contents when the computer is switched off.', true, 'podela', 'RAM je isparljiva memorija.', 'RAM is volatile memory.'),
  C('Koja memorija je najbrža?', 'Which memory is the fastest?',
    [['registri procesora', 'processor registers'], ['RAM', 'RAM'], ['SSD', 'SSD'], ['HDD', 'HDD']], 0, 'piramida', 'Registri su unutar jezgra procesora.', 'Registers are inside the processor core.'),
  C('Koja je glavna razlika između SSD-a i HDD-a?', 'What is the main difference between an SSD and an HDD?',
    [['SSD nema pokretnih delova', 'an SSD has no moving parts'], ['SSD je uvek sporiji', 'an SSD is always slower'], ['HDD je bez struje', 'an HDD needs no power'], ['nema razlike', 'there is no difference']], 0, 'spoljna', 'SSD čuva podatke u NAND čipovima.', 'An SSD stores data in NAND chips.'),
  N('Koliko bitova ima jedan bajt?', 'How many bits are there in one byte?', '8', '', 'merenje', '1 B = 8 b.', '1 B = 8 b.', 0),
  C('Koja memorija čuva podatke i bez napajanja?', 'Which memory keeps data without power?',
    [['SSD', 'SSD'], ['RAM', 'RAM'], ['keš procesora', 'processor cache'], ['registri', 'registers']], 0, 'podela', 'To je neisparljiva memorija.', 'It is non-volatile memory.')
], [
  N('Fajl od 4 GB se kopira brzinom od 500 MB/s. Koliko traje kopiranje u sekundama?', 'A 4 GB file is copied at 500 MB/s. How long does the copy take in seconds?', '8', 's|sekund|second', 'merenje', '4000 MB / 500 MB/s = 8 s.', '4000 MB / 500 MB/s = 8 s.'),
  N('Disk od 1 TB (decimalno). Koliko GiB pokazuje operativni sistem? (zaokruži na ceo broj)', 'A 1 TB drive (decimal). How many GiB does the operating system show? (round to a whole number)', '931', 'GiB', 'merenje', '10¹² / 2³⁰ ≈ 931 GiB.', '10¹² / 2³⁰ ≈ 931 GiB.'),
  N('Veza je 1 Gb/s (gigabit u sekundi). Koliko je to u MB/s?', 'A link is 1 Gb/s (gigabit per second). How many MB/s is that?', '125', 'MB/s', 'merenje', '1000 Mb / 8 = 125 MB.', '1000 Mb / 8 = 125 MB.'),
  N('Keš ima pogodak u 90 % slučajeva sa 1 ns, a promašaj košta 100 ns. Koliko je prosečno vreme pristupa u ns?', 'A cache hits in 90 % of cases at 1 ns and a miss costs 100 ns. What is the average access time in ns?', '10,9|10.9', 'ns', 'piramida', '0,9 · 1 + 0,1 · 100 = 10,9 ns.', '0.9 · 1 + 0.1 · 100 = 10.9 ns.'),
  N('Kolika je propusnost jednog kanala DDR5-4800 u GB/s? (64 bita)', 'What is the bandwidth of one DDR5-4800 channel in GB/s? (64-bit)', '38,4|38.4', 'GB/s', 'unutrasnja', '4800 · 8 = 38 400 MB/s.', '4800 · 8 = 38 400 MB/s.'),
  C('Zašto DRAM mora da se osvežava?', 'Why must DRAM be refreshed?',
    [['kondenzatori u ćelijama gube naelektrisanje', 'the capacitors in the cells lose their charge'], ['zbog ventilatora', 'because of the fan'], ['zbog operativnog sistema', 'because of the operating system'], ['ne mora', 'it does not have to be']], 0, 'unutrasnja', 'Svaki bit je mali kondenzator.', 'Every bit is a tiny capacitor.'),
  C('Od koje vrste memorije se pravi keš procesora?', 'What kind of memory is the processor cache made of?',
    [['SRAM', 'SRAM'], ['DRAM', 'DRAM'], ['NAND', 'NAND'], ['magnetni disk', 'magnetic disk']], 0, 'unutrasnja', 'SRAM je brza, ali skupa.', 'SRAM is fast, but expensive.'),
  M('Koje spadaju u spoljnu memoriju?', 'Which are external memory?',
    [['SSD', 'SSD'], ['HDD', 'HDD'], ['USB fleš', 'a USB stick'], ['L3 keš', 'L3 cache']], [0, 1, 2], 'spoljna', 'Keš je unutrašnja memorija u procesoru.', 'Cache is internal memory in the processor.'),
  N('Kopira se 200 GB sa HDD-a brzinom 125 MB/s. Koliko traje kopiranje u minutima? (zaokruži na jednu decimalu)', '200 GB is copied from an HDD at 125 MB/s. How long does it take in minutes? (round to one decimal)', '26,7|26.7', 'min|minut|minute', 'merenje', '200 000 / 125 = 1600 s = 26,7 min.', '200 000 / 125 = 1600 s = 26.7 min.')
]);
})();
