(function () {
'use strict';
var H = window.LAV_QH, t = H.t, C = H.C, M = H.M, B = H.B;
var Q = window.LAV_QUIZZES;

Q.PC01 = H.quiz(t('Vrste kućišta · mali test', 'Types of cases · short test'), [
  C('Koje kućište je najveće?', 'Which case is the largest?',
    ['Full tower', 'Mid tower', 'Mini tower', 'Mini-ITX (SFF)'], 0, 'vrste', 'Full tower prima najviše komponenti, uključujući E-ATX ploče.', 'A full tower takes the most components, including E-ATX boards.'),
  B('Micro-ATX ploča može da se ugradi u kućište za ATX ploče.', 'A micro-ATX board can be installed in a case made for ATX boards.', true, 'formfaktor', 'Manje ploče staju u veća kućišta jer su rupe za zavrtnje na istim mestima.', 'Smaller boards fit larger cases because the screw holes are in the same places.'),
  C('Kako treba da teče vazduh kroz kućište?', 'How should air flow through a case?',
    [['usisavanje sprijeda, izbacivanje pozadi i odozgo', 'intake at the front, exhaust at the back and top'], ['usisavanje pozadi, izbacivanje sprijeda', 'intake at the back, exhaust at the front'], ['samo kroz bočni lim', 'only through the side panel'], ['vazduh ne treba da teče', 'air should not move']], 0, 'hladjenje', 'Hladan vazduh ulazi sprijeda, a topao se diže i izlazi pozadi i odozgo.', 'Cool air enters at the front, while warm air rises and leaves at the back and top.'),
  C('Šta kućište NE radi?', 'What does a case NOT do?',
    [['ne obrađuje podatke umesto procesora', 'it does not process data in place of the processor'], ['nosi komponente', 'it holds the components'], ['usmerava vazduh', 'it directs the air'], ['štiti od prašine i udaraca', 'it protects against dust and knocks']], 0, 'uloga', 'Kućište je kostur i zaštita; podatke obrađuje procesor.', 'The case is a frame and a shield; the processor does the processing.'),
  C('Šta znači oznaka „SFF” kod kućišta?', 'What does the mark "SFF" mean for a case?',
    [['mali format (small form factor)', 'small form factor'], ['brzi ventilator', 'a fast fan'], ['poseban priključak', 'a special connector'], ['staklena strana', 'a glass side']], 0, 'vrste', 'SFF kućišta su mala, ali ograničavaju veličinu hladnjaka i kartica.', 'SFF cases are small but limit the size of coolers and cards.')
], [
  B('Mini-ITX ploča može da se ugradi u kućište za ATX ploče.', 'A mini-ITX board can be installed in a case for ATX boards.', true, 'formfaktor', 'Ploče različitih veličina imaju zajedničke rupe za zavrtnje.', 'Boards of different sizes share common screw holes.'),
  B('E-ATX ploča uvek staje u mid tower kućište.', 'An E-ATX board always fits in a mid tower case.', false, 'formfaktor', 'E-ATX je šira od ATX, pa staje samo u kućišta koja je izričito podržavaju (najčešće full tower).', 'E-ATX is wider than ATX, so it fits only cases that explicitly support it (usually full towers).'),
  C('Šta je pozitivan pritisak u kućištu?', 'What is positive pressure in a case?',
    [['više vazduha ulazi nego izlazi, pa prašina ne ulazi kroz procepe', 'more air goes in than out, so dust does not enter through gaps'], ['više vazduha izlazi nego ulazi', 'more air goes out than in'], ['kućište je zatvoreno bez ventilatora', 'the case is sealed with no fans'], ['svi ventilatori su isključeni', 'all fans are off']], 0, 'hladjenje', 'Pozitivan pritisak gura vazduh napolje kroz procepe, pa unutra ulazi manje prašine (uz filtere na ulazu).', 'Positive pressure pushes air out through the gaps, so less dust gets in (with filters on the intake).'),
  C('Zašto se izlazni ventilatori stavljaju gore i pozadi?', 'Why are exhaust fans put at the top and the back?',
    [['topao vazduh se diže, a pozadi su komponente koje najviše greju', 'warm air rises, and the hottest components are near the back'], ['zbog izgleda', 'for looks'], ['zato što je tamo jeftinije', 'because it is cheaper there'], ['zbog buke', 'because of noise']], 0, 'hladjenje', 'Topao vazduh prirodno ide nagore, a procesor je blizu zadnje strane.', 'Warm air naturally goes up, and the processor sits near the back.'),
  C('Koje je glavno ograničenje malih Mini-ITX kućišta (SFF)?', 'What is the main limitation of small mini-ITX (SFF) cases?',
    [['visina hladnjaka, dužina kartice i protok vazduha', 'cooler height, card length and airflow'], ['ne mogu da imaju procesor', 'they cannot hold a processor'], ['nemaju USB portove', 'they have no USB ports'], ['ne mogu da imaju disk', 'they cannot hold a drive']], 0, 'vrste', 'Mali prostor ograničava veličinu delova i otežava hlađenje.', 'The small space limits the size of parts and makes cooling harder.'),
  M('Šta poboljšava hlađenje kućišta?', 'What improves the cooling of a case?',
    [['mrežasta prednja strana', 'a mesh front panel'], ['ulazni ventilatori sprijeda i izlazni pozadi', 'intake fans at the front and exhaust at the back'], ['potpuno staklena prednja strana', 'a solid glass front'], ['svi ventilatori okrenuti ka unutra bez izlaza', 'all fans pointing inward with no exhaust']], [0, 1], 'hladjenje', 'Mreža i uravnotežen protok pomažu; zatvorena prednja strana i samo ulaz ne.', 'Mesh and a balanced flow help; a closed front and intake only do not.'),
  C('Koje kućište biraš za računar sa dugom grafičkom karticom i velikim hladnjakom?', 'Which case do you choose for a computer with a long graphics card and a large cooler?',
    [['mid ili full tower', 'a mid or full tower'], ['Mini-ITX SFF', 'a mini-ITX SFF'], ['rek 1U', 'a 1U rack'], ['svejedno je', 'it makes no difference']], 0, 'izbor', 'Veliki delovi traže dovoljno unutrašnjeg prostora.', 'Large parts need enough inside space.'),
  C('Čemu služe prašinski filteri na ulaznim otvorima?', 'What are dust filters on the intake openings for?',
    [['zadržavaju prašinu da ne uđe u kućište', 'they keep dust from entering the case'], ['ubrzavaju ventilator', 'they speed up the fan'], ['hlade disk', 'they cool the drive'], ['povećavaju memoriju', 'they increase memory']], 0, 'hladjenje', 'Filter se povremeno očisti, jer začepljen filter smanjuje protok vazduha.', 'The filter is cleaned now and then, because a clogged filter reduces airflow.')
]);

Q.PC02 = H.quiz(t('Napajanje · mali test', 'Power supply · short test'), [
  C('Čemu služi napajanje u računaru?', 'What is the power supply for in a computer?',
    [['daje svim komponentama ono što im treba da rade', 'it gives every component what it needs to work'], ['obrađuje podatke', 'it processes data'], ['hladi procesor', 'it cools the processor'], ['čuva podatke', 'it stores data']], 0, 'zasto', 'Napajanje uzima energiju iz utičnice i prilagođava je delovima računara.', 'The power supply takes energy from the wall socket and adapts it for the parts of the computer.'),
  C('Gde se priključuje 24-pin konektor?', 'Where does the 24-pin connector go?',
    [['na matičnu ploču', 'onto the motherboard'], ['na grafičku karticu', 'onto the graphics card'], ['na disk', 'onto a drive'], ['na monitor', 'onto the monitor']], 0, 'model', 'To je glavni konektor za napajanje ploče.', 'It is the main power connector for the board.'),
  C('Koji konektor napaja procesor?', 'Which connector powers the processor?',
    ['8-pin EPS (4+4)', 'SATA', 'Molex', 'HDMI'], 0, 'model', 'EPS kabl ide u konektor pored procesora.', 'The EPS cable goes into the connector next to the processor.'),
  B('Moduralno napajanje ima kablove koji se priključuju samo kad su potrebni.', 'A modular power supply has cables that you attach only when needed.', true, 'izbor', 'Manje kablova znači urednije kućište i bolji protok vazduha.', 'Fewer cables means a tidier case and better airflow.'),
  C('Čemu služi ventilator na napajanju?', 'What is the fan on a power supply for?',
    [['hladi samo napajanje', 'it cools the power supply itself'], ['hladi grafičku karticu', 'it cools the graphics card'], ['ubrzava internet', 'it speeds up the internet'], ['ništa', 'nothing']], 0, 'zasto', 'Napajanje se greje i ima sopstveno hlađenje.', 'The power supply gets warm and has its own cooling.')
], [
  C('Koji 80 PLUS nivo ima najvišu efikasnost?', 'Which 80 PLUS level has the highest efficiency?',
    ['Titanium', 'Bronze', 'Gold', 'Silver'], 0, 'snaga', 'Redosled je Bronze, Silver, Gold, Platinum, Titanium.', 'The order is Bronze, Silver, Gold, Platinum, Titanium.'),
  C('Šta znači da je napajanje 80 PLUS Gold?', 'What does it mean that a power supply is 80 PLUS Gold?',
    [['ima proverenu visoku efikasnost, pa se manje greje', 'it has a verified high efficiency, so it runs cooler'], ['ima zlatne kontakte', 'it has gold contacts'], ['radi samo sa zlatnim kablovima', 'it works only with gold cables'], ['ima RGB osvetljenje', 'it has RGB lighting']], 0, 'snaga', 'Oznaka je ocena efikasnosti, a ne boje ili materijala.', 'The mark is an efficiency rating, not a colour or material.'),
  C('Čemu služi zelena žica PS_ON?', 'What is the green PS_ON wire for?',
    [['ploča njome uključuje napajanje', 'the board uses it to switch the supply on'], ['napaja ventilator', 'it powers the fan'], ['to je masa', 'it is ground'], ['to je zaštita', 'it is a protection']], 0, 'model', 'Ploča signalom pali napajanje kada pritisneš dugme.', 'The board starts the power supply with this signal when you press the button.'),
  C('Čemu služi PCIe kabl iz napajanja?', 'What is the PCIe cable from the power supply for?',
    [['dodatno napaja jaču grafičku karticu', 'it gives extra power to a stronger graphics card'], ['povezuje disk', 'it connects a drive'], ['povezuje monitor', 'it connects the monitor'], ['povezuje tastaturu', 'it connects the keyboard']], 0, 'model', 'Jače kartice imaju 6+2 pin konektore za dodatni kabl.', 'Stronger cards have 6+2 pin connectors for an extra cable.'),
  M('Koje zaštite napajanje može da ima?', 'Which protections can a power supply have?',
    [['zaštita od prenapona (OVP)', 'over-voltage protection (OVP)'], ['zaštita od kratkog spoja (SCP)', 'short-circuit protection (SCP)'], ['zaštita od pregrevanja (OTP)', 'over-temperature protection (OTP)'], ['RGB zaštita', 'RGB protection']], [0, 1, 2], 'zastite', 'Zaštite čuvaju ostale delove, a RGB nije zaštita.', 'Protections shield the other parts; RGB is not a protection.'),
  C('Šta je rizično kod jeftinog napajanja nepoznatog proizvođača?', 'What is risky about a cheap power supply from an unknown maker?',
    [['može da ošteti druge delove i ima slabe zaštite', 'it can damage other parts and has weak protections'], ['previše je tiho', 'it is too quiet'], ['ne staje u kućište', 'it does not fit in the case'], ['ništa', 'nothing']], 0, 'izbor', 'Napajanje je deo na kome se ne isplati štedeti.', 'The power supply is not the part to save money on.'),
  B('Napajanje mnogo jače nego što je potrebno uvek je bolji izbor.', 'A power supply far stronger than needed is always the better choice.', false, 'izbor', 'Dovoljna rezerva je dobra, ali preveliko napajanje je skuplje bez koristi.', 'A reasonable reserve is good, but an oversized supply costs more for no benefit.'),
  B('Kabl za SATA disk i kabl za procesor imaju isti konektor.', 'The SATA drive cable and the processor cable have the same connector.', false, 'model', 'Konektori su različiti da ih ne bi zamenio.', 'The connectors differ so you cannot mix them up.'),
  C('Kako se napajanje postavlja u kućište u odnosu na ventilator?', 'How is the power supply mounted relative to its fan?',
    [['ventilator okrenut ka otvoru kroz koji ulazi vazduh (zavisi od kućišta)', 'the fan faces the opening the air comes through (depends on the case)'], ['uvek ventilatorom ka ploči', 'always with the fan toward the board'], ['svejedno je', 'it makes no difference'], ['bez ventilatora', 'without a fan']], 0, 'izbor', 'Gleda se gde kućište ima otvor sa filterom.', 'Look at where the case has its filtered opening.')
]);

Q.PC03 = H.quiz(t('Delovi matične ploče · mali test', 'Parts of the motherboard · short test'), [
  C('Gde se ubacuje grafička kartica?', 'Where does the graphics card go?',
    ['PCIe x16', 'SATA', 'CR2032', 'USB'], 0, 'model', 'Najduži PCIe slot je namenjen grafičkoj kartici.', 'The longest PCIe slot is meant for the graphics card.'),
  B('Baterija CMOS (CR2032) čuva podešavanja i sat kad je računar isključen.', 'The CMOS battery (CR2032) keeps the settings and the clock when the computer is off.', true, 'model', 'Zato računar „pamti” vreme.', 'That is why the computer "remembers" the time.'),
  C('Šta radi VRM?', 'What does the VRM do?',
    [['stabilno napaja procesor', 'it supplies the processor steadily'], ['čuva podatke', 'it stores data'], ['povezuje internet', 'it connects to the internet'], ['pojačava zvuk', 'it amplifies sound']], 0, 'model', 'VRM je deo ploče pored procesora koji ga napaja, često sa hladnjakom.', 'The VRM is the part of the board next to the processor that feeds it, often with a heatsink.'),
  C('Čemu služe SATA portovi?', 'What are SATA ports for?',
    [['povezuju HDD i SSD diskove', 'they connect HDD and SSD drives'], ['povezuju monitor', 'they connect the monitor'], ['ubacuju RAM', 'they hold RAM'], ['povezuju zvučnike', 'they connect speakers']], 0, 'model', 'SATA je veza za diskove i optičke uređaje.', 'SATA is the link for drives and optical devices.'),
  C('Šta je čipset?', 'What is the chipset?',
    [['čip koji povezuje procesor sa ostalim delovima', 'a chip that links the processor with the other parts'], ['vrsta memorije', 'a type of memory'], ['hladnjak', 'a cooler'], ['kabl', 'a cable']], 0, 'sta', 'Čipset razvodi veze ka USB-u, SATA-u i dodatnim PCIe slotovima.', 'The chipset distributes links to USB, SATA and extra PCIe slots.')
], [
  C('Koji slot prima procesor?', 'Which socket takes the processor?',
    [['socket (podnožje)', 'the socket'], ['DIMM slot', 'a DIMM slot'], ['PCIe slot', 'a PCIe slot'], ['M.2 slot', 'an M.2 slot']], 0, 'model', 'Socket mora da odgovara procesoru (npr. AM5, LGA1700).', 'The socket must match the processor (e.g. AM5, LGA1700).'),
  C('Čemu služi M.2 slot?', 'What is an M.2 slot for?',
    [['za male brze SSD-ove i neke bežične module', 'for small fast SSDs and some wireless modules'], ['za procesor', 'for the processor'], ['za monitor', 'for the monitor'], ['za RAM', 'for RAM']], 0, 'model', 'M.2 SSD se ubacuje direktno u ploču, bez kabla.', 'An M.2 SSD plugs straight into the board, with no cable.'),
  C('Šta su BIOS/UEFI?', 'What are BIOS/UEFI?',
    [['osnovni program ploče koji pokreće računar i čuva podešavanja', 'the board\'s basic program that starts the computer and keeps settings'], ['antivirus', 'an antivirus'], ['igrica', 'a game'], ['vrsta RAM-a', 'a type of RAM']], 0, 'model', 'BIOS/UEFI se pokreće pre operativnog sistema.', 'BIOS/UEFI runs before the operating system.'),
  M('Šta od navedenog postoji na matičnoj ploči?', 'Which of these exist on a motherboard?',
    [['DIMM slotovi za RAM', 'DIMM slots for RAM'], ['socket za procesor', 'a processor socket'], ['PCIe slotovi', 'PCIe slots'], ['ekran', 'a display']], [0, 1, 2], 'model', 'Ekran nije deo ploče.', 'A display is not part of the board.'),
  C('Čemu služi I/O panel na zadnjoj strani ploče?', 'What is the I/O panel on the back of the board for?',
    [['za priključke: USB, mreža, zvuk, video', 'for ports: USB, network, audio, video'], ['za RAM', 'for RAM'], ['za procesor', 'for the processor'], ['za hlađenje', 'for cooling']], 0, 'veze', 'Tu se priključuju spoljni uređaji.', 'External devices plug in there.'),
  C('Zašto neke ploče imaju hladnjake na čipsetu i M.2 slotu?', 'Why do some boards have heatsinks on the chipset and M.2 slot?',
    [['da se ti delovi ne pregreju pri radu', 'so those parts do not overheat while working'], ['samo zbog izgleda', 'just for looks'], ['da budu teži', 'to be heavier'], ['da ploča radi tiše bez ventilatora', 'so the board is quieter with no fans']], 0, 'veze', 'Brzi SSD i čipset se greju pod opterećenjem.', 'A fast SSD and the chipset get warm under load.'),
  B('Svaki procesor staje u svaki socket.', 'Every processor fits in every socket.', false, 'veze', 'Procesor i socket moraju da se poklope po oznaci i proizvođaču.', 'The processor and socket must match by name and maker.'),
  B('Na ploči sa DDR5 slotovima mogu da rade DDR4 moduli.', 'DDR4 modules can work on a board with DDR5 slots.', false, 'veze', 'DDR4 i DDR5 imaju različit položaj proreza i nisu zamenjivi.', 'DDR4 and DDR5 have different notch positions and are not interchangeable.'),
  C('Čemu služe konektori „F_PANEL” na ploči?', 'What are the "F_PANEL" connectors on the board for?',
    [['za dugme za paljenje, reset i LED lampice kućišta', 'for the case power button, reset and LED lights'], ['za RAM', 'for RAM'], ['za procesor', 'for the processor'], ['za mrežu', 'for the network']], 0, 'veze', 'Tu se priključuju tanki kablovi sa prednjeg panela.', 'The thin cables from the front panel plug in there.')
]);

Q.PC04 = H.quiz(t('Matična ploča u fokusu · mali test', 'The motherboard in focus · short test'), [
  C('Šta je glavna uloga matične ploče?', 'What is the main role of the motherboard?',
    [['povezuje sve delove računara u jednu celinu', 'it joins all the parts of the computer into one whole'], ['čuva sve podatke', 'it stores all the data'], ['hladi procesor', 'it cools the processor'], ['pravi sliku', 'it produces the picture']], 0, 'uloga', 'Ploča je „nervni sistem” računara.', 'The board is the "nervous system" of the computer.'),
  C('Koji je najčešći format ploče za standardni računar?', 'What is the most common board format for a standard computer?',
    ['ATX', 'E-ATX', 'Mini-DTX', 'Pico-ITX'], 0, 'uloga', 'ATX je standard; mATX i mini-ITX su manji.', 'ATX is the standard; mATX and mini-ITX are smaller.'),
  B('Socket na ploči mora da odgovara procesoru.', 'The socket on the board must match the processor.', true, 'cpu', 'Zato se ploča i procesor biraju zajedno.', 'That is why the board and processor are chosen together.'),
  C('Šta znači DDR5 na ploči?', 'What does DDR5 on a board mean?',
    [['ploča prima DDR5 module radne memorije', 'the board accepts DDR5 RAM modules'], ['ima 5 procesora', 'it has 5 processors'], ['ima 5 SATA portova', 'it has 5 SATA ports'], ['radi na 5 GHz', 'it runs at 5 GHz']], 0, 'ram', 'DDR4 i DDR5 nisu međusobno zamenjivi.', 'DDR4 and DDR5 are not interchangeable.'),
  C('Čemu služe BIOS/UEFI?', 'What are BIOS/UEFI for?',
    [['pokreću računar i omogućavaju podešavanja', 'they start the computer and allow settings'], ['prave sliku', 'they produce the picture'], ['hlade', 'they cool'], ['štampaju', 'they print']], 0, 'bios', 'Pritiskom na taster pri paljenju (npr. Del) ulaziš u podešavanja.', 'You enter the settings by pressing a key at start (e.g. Del).')
], [
  C('Šta određuje koje procesore ploča podržava?', 'What decides which processors a board supports?',
    [['socket i čipset', 'the socket and the chipset'], ['boja ploče', 'the colour of the board'], ['broj USB portova', 'the number of USB ports'], ['veličina kućišta', 'the case size']], 0, 'cpu', 'Čak i sa istim socketom treba proveriti listu podržanih procesora.', 'Even with the same socket, check the list of supported processors.'),
  C('Šta je dvokanalni režim memorije?', 'What is dual-channel memory mode?',
    [['dva ista modula rade paralelno preko dva kanala', 'two identical modules work in parallel over two channels'], ['jedan modul radi dvaput', 'one module works twice'], ['memorija sa dva procesora', 'memory with two processors'], ['dva diska', 'two drives']], 0, 'ram', 'Moduli se stavljaju u slotove koje ploča označi.', 'The modules go into the slots the board marks.'),
  C('Šta je PCIe i čemu služi?', 'What is PCIe and what is it for?',
    [['brza magistrala za grafičku, SSD i druge kartice', 'a fast bus for graphics, SSD and other cards'], ['vrsta memorije', 'a type of memory'], ['vrsta kućišta', 'a type of case'], ['hladnjak', 'a cooler']], 0, 'pcie', 'Slotovi se razlikuju po dužini: x1, x4, x8, x16.', 'Slots differ in length: x1, x4, x8, x16.'),
  B('Veći PCIe slot (x16) prima i kartice za manji slot (x1).', 'A bigger PCIe slot (x16) also accepts cards made for a smaller slot (x1).', true, 'pcie', 'Kartica radi sa onoliko traka koliko ima, ali ne obrnuto.', 'The card works with as many lanes as it has, but not the other way round.'),
  C('Šta se desi ako resetuješ CMOS (izvadiš bateriju na kratko)?', 'What happens if you reset the CMOS (take the battery out briefly)?',
    [['BIOS podešavanja se vrate na fabrička', 'the BIOS settings return to defaults'], ['obrišu se fajlovi na disku', 'the files on the drive are deleted'], ['ploča prestaje da radi', 'the board stops working'], ['procesor se menja', 'the processor changes']], 0, 'bios', 'Podaci na disku ostaju; vraćaju se samo podešavanja ploče.', 'The data on the drive stays; only the board settings come back.'),
  C('Čemu služi XMP/EXPO profil u BIOS-u?', 'What is the XMP/EXPO profile in the BIOS for?',
    [['uključuje brzinu memorije koju je proizvođač predvideo', 'it switches on the memory speed the maker intended'], ['briše podatke', 'it deletes data'], ['menja jezik', 'it changes the language'], ['gasi ventilatore', 'it turns off fans']], 0, 'ram', 'Bez profila memorija radi na osnovnoj, sporijoj brzini.', 'Without the profile the memory runs at the slower base speed.'),
  C('Kako biraš ploču za mali računar u malom kućištu?', 'How do you choose a board for a small computer in a small case?',
    [['mini-ITX ili mATX, prema kućištu', 'mini-ITX or mATX, to match the case'], ['E-ATX', 'E-ATX'], ['bilo koja', 'any'], ['bez ploče', 'no board']], 0, 'izbor', 'Format ploče mora da staje u kućište.', 'The board format must fit in the case.'),
  M('Šta proveravaš pri izboru ploče?', 'What do you check when choosing a board?',
    [['socket i čipset', 'the socket and chipset'], ['vrstu memorije (DDR4/DDR5)', 'the memory type (DDR4/DDR5)'], ['format (ATX, mATX…)', 'the format (ATX, mATX…)'], ['boju kućišta', 'the colour of the case']], [0, 1, 2], 'izbor', 'Boja ne utiče na kompatibilnost.', 'Colour does not affect compatibility.'),
  C('Čemu služe konektori za ventilatore na ploči (CPU_FAN, SYS_FAN)?', 'What are the fan headers on the board (CPU_FAN, SYS_FAN) for?',
    [['priključak i regulacija brzine ventilatora', 'connecting fans and controlling their speed'], ['za RAM', 'for RAM'], ['za disk', 'for a drive'], ['za monitor', 'for the monitor']], 0, 'io', 'Ploča može da uspori ili ubrza ventilator prema temperaturi.', 'The board can slow down or speed up a fan depending on temperature.')
]);

Q.PC05 = H.quiz(t('Ugradnja matične ploče · mali test', 'Installing the motherboard · short test'), [
  C('Šta se postavlja u kućište pre ploče?', 'What goes into the case before the board?',
    [['distanceri', 'standoffs'], ['grafička kartica', 'the graphics card'], ['monitor', 'the monitor'], ['tastatura', 'the keyboard']], 0, 'distanceri', 'Distanceri drže ploču podignutom od lima.', 'Standoffs keep the board raised off the metal.'),
  B('I/O štitnik se ugrađuje sa zadnje strane kućišta pre ploče.', 'The I/O shield is fitted at the back of the case before the board.', true, 'koraci', 'Kasnije ga je teško staviti.', 'It is hard to fit later.'),
  C('Kako se drži ploča pri rukovanju?', 'How do you hold a board when handling it?',
    [['za ivice', 'by the edges'], ['za čipove', 'by the chips'], ['za konektore', 'by the connectors'], ['za hladnjak', 'by the cooler']], 0, 'priprema', 'Ne dodiruj kontakte i čipove.', 'Do not touch the contacts and chips.'),
  C('Kojim redom zavrćeš zavrtnje ploče?', 'In which order do you tighten the board screws?',
    [['ukršteno, prvo lagano', 'crosswise, lightly first'], ['jedan do kraja, pa drugi', 'one fully, then the next'], ['svejedno je', 'it makes no difference'], ['bez zavrtnjeva', 'without screws']], 0, 'distanceri', 'Ukršteni redosled ravnomerno drži ploču.', 'A crossing order holds the board evenly.'),
  C('Koji kabl iz napajanja ide u najveći konektor na ploči?', 'Which cable from the power supply goes into the biggest connector on the board?',
    ['24-pin ATX', '8-pin EPS', 'SATA', 'Molex'], 0, 'kablovi', 'Procesor ima svoj 8-pin EPS kabl.', 'The processor has its own 8-pin EPS cable.')
], [
  C('Koliko distancera treba da bude u kućištu?', 'How many standoffs should the case have?',
    [['onoliko koliko ploča ima rupa za zavrtnje', 'as many as the board has screw holes'], ['jedan', 'one'], ['nijedan', 'none'], ['svejedno je', 'it makes no difference']], 0, 'distanceri', 'Svaka rupa mora da ima distancer, a suvišan distancer ne sme da dodiruje ploču.', 'Every hole needs a standoff, and an extra standoff must not touch the board.'),
  B('Višak distancera na mestu bez rupe u ploči je bezopasan.', 'An extra standoff at a spot with no hole in the board is harmless.', false, 'distanceri', 'Može da dodirne kontakte ispod ploče i ošteti je.', 'It can touch the contacts under the board and damage it.'),
  C('Šta radiš pre dodirivanja delova da se zaštitiš od ESD?', 'What do you do before touching parts to protect against ESD?',
    [['dodirneš metalno kućište ili nosiš antistatik narukvicu', 'touch the metal case or wear an anti-static wrist strap'], ['pokvasiš ruke', 'wet your hands'], ['obuješ papuče', 'put on slippers'], ['ništa', 'nothing']], 0, 'priprema', 'Tako se statički naboj izjednačava bez štete po delove.', 'That evens out static without harming the parts.'),
  C('Šta prvo proveravaš ako nema slike nakon prvog paljenja?', 'What do you check first if there is no picture after the first power-on?',
    [['da li su kablovi (EPS, 24-pin, PCIe) i RAM dobro uglavljeni', 'that the cables (EPS, 24-pin, PCIe) and RAM are seated well'], ['kupiš novi procesor', 'buy a new processor'], ['zameniš kućište', 'replace the case'], ['obrišeš BIOS', 'erase the BIOS']], 0, 'prvo-paljenje', 'Većina problema je nepotpuno uglavljen kabl ili modul.', 'Most problems are a cable or module that is not fully seated.'),
  C('Kuda se priključuju kablovi prednjeg panela (dugme, LED)?', 'Where do the front-panel cables (button, LEDs) go?',
    [['na F_PANEL pinove ploče, prema uputstvu ploče', 'onto the F_PANEL pins of the board, as per the board manual'], ['u RAM', 'into RAM'], ['u procesor', 'into the processor'], ['u disk', 'into a drive']], 0, 'prednji', 'Raspored pinova je naveden u uputstvu ploče.', 'The pin layout is listed in the board manual.'),
  M('Šta od navedenog treba uraditi pre ugradnje ploče u kućište?', 'Which of these should be done before installing the board in the case?',
    [['proveriti položaj distancera', 'check the standoff positions'], ['ugraditi I/O štitnik', 'fit the I/O shield'], ['po potrebi ugraditi procesor i RAM na ploču van kućišta', 'if useful, fit the processor and RAM on the board outside the case'], ['priključiti monitor', 'connect the monitor']], [0, 1, 2], 'koraci', 'Monitor se priključuje tek na kraju.', 'The monitor is connected only at the end.'),
  B('Procesor se u socket ubacuje silom dok ne klikne.', 'The processor is pushed into the socket with force until it clicks.', false, 'koraci', 'Procesor se samo spusti na pravilan položaj (po oznaci u uglu), a zatim se zatvori držač.', 'The processor just rests in the right position (by the corner mark) and then the retention arm is closed.'),
  C('Zašto se grafička kartica ugrađuje pri kraju?', 'Why is the graphics card installed near the end?',
    [['velika je i smeta pri radu oko ploče', 'it is large and gets in the way when working around the board'], ['mora da bude poslednja po pravilu', 'it must be last by rule'], ['nije potrebna', 'it is not needed'], ['zato što je laka', 'because it is light']], 0, 'koraci', 'Prvo se ugrađuje sve što je ispod i oko nje.', 'Everything under and around it goes in first.')
]);

Q.PC06 = H.quiz(t('Unutrašnja i spoljna memorija · mali test', 'Internal and external memory · short test'), [
  C('Koja je memorija najbrža?', 'Which memory is the fastest?',
    [['registri procesora', 'processor registers'], 'RAM', 'SSD', 'HDD'], 0, 'piramida', 'Što je memorija bliže procesoru, to je brža.', 'The closer the memory is to the processor, the faster it is.'),
  B('RAM gubi sadržaj kad se računar isključi.', 'RAM loses its contents when the computer is switched off.', true, 'unutrasnja', 'RAM je isparljiva memorija, zato podatke treba sačuvati na disk.', 'RAM is volatile memory, so data must be saved to a drive.'),
  C('Koji disk nema pokretnih delova?', 'Which drive has no moving parts?',
    [['SSD', 'SSD'], ['HDD', 'HDD'], ['disketa', 'floppy disk'], ['optički disk', 'optical disc']], 0, 'spoljna', 'SSD čuva podatke u flash čipovima.', 'An SSD stores data in flash chips.'),
  C('U kojoj memoriji se čuvaju programi koje trenutno koristiš?', 'In which memory are the programs you are currently using kept?',
    [['RAM', 'RAM'], ['ROM', 'ROM'], ['optički disk', 'optical disc'], ['USB stik', 'USB stick']], 0, 'unutrasnja', 'RAM je radna memorija računara.', 'RAM is the working memory of the computer.'),
  C('Šta je keš?', 'What is a cache?',
    [['mala brza memorija blizu procesora', 'a small fast memory close to the processor'], ['vrsta diska', 'a type of drive'], ['kabl', 'a cable'], ['program', 'a program']], 0, 'piramida', 'Čuva podatke koje procesor često koristi.', 'It keeps the data the processor uses often.')
], [
  C('Koja je glavna razlika između unutrašnje i spoljne memorije?', 'What is the main difference between internal and external memory?',
    [['unutrašnja je brza i radna, spoljna je sporija i trajna', 'internal is fast and working, external is slower and permanent'], ['nema razlike', 'there is no difference'], ['spoljna je uvek brža', 'external is always faster'], ['unutrašnja je uvek veća', 'internal is always larger']], 0, 'podela', 'Procesor direktno radi sa unutrašnjom memorijom.', 'The processor works directly with internal memory.'),
  C('Šta je ROM?', 'What is ROM?',
    [['memorija sa trajno upisanim sadržajem, npr. BIOS', 'memory with permanently stored content, e.g. BIOS'], ['radna memorija', 'working memory'], ['disk', 'a drive'], ['keš', 'a cache']], 0, 'unutrasnja', 'ROM zadržava sadržaj i kad je računar ugašen.', 'ROM keeps its content even when the computer is off.'),
  C('Koja je glavna prednost SSD-a u odnosu na HDD?', 'What is the main advantage of an SSD over an HDD?',
    [['mnogo brži pristup i otpornost na udarce', 'much faster access and resistance to shocks'], ['uvek veći kapacitet', 'always a larger capacity'], ['uvek niža cena po GB', 'always a lower price per GB'], ['radi samo sa Linuxom', 'works only with Linux']], 0, 'spoljna', 'HDD ima mehaniku i sporiji pristup, ali je jeftin po gigabajtu.', 'An HDD has mechanics and slower access, but is cheap per gigabyte.'),
  C('Koja veza je najbrža za SSD?', 'Which link is the fastest for an SSD?',
    [['NVMe preko PCIe', 'NVMe over PCIe'], ['SATA', 'SATA'], ['USB 2.0', 'USB 2.0'], ['IDE', 'IDE']], 0, 'spoljna', 'NVMe SSD se obično ubacuje u M.2 slot.', 'An NVMe SSD usually goes into an M.2 slot.'),
  B('„500 GB” disk u sistemu pokazuje manje od 500 GiB.', 'A "500 GB" drive shows less than 500 GiB in the system.', true, 'merenje', 'Proizvođač broji decimalno, sistem binarno, pa je prikazani broj manji.', 'The maker counts in decimal and the system in binary, so the shown number is smaller.'),
  C('Čemu služi virtuelna memorija (swap)?', 'What is virtual memory (swap) for?',
    [['kad RAM nije dovoljan, sistem koristi deo diska', 'when RAM is not enough, the system uses part of the drive'], ['ubrzava procesor', 'it speeds up the processor'], ['povećava rezoluciju', 'it increases resolution'], ['čuva lozinke', 'it stores passwords']], 0, 'virtuelna', 'Radi, ali je mnogo sporija od RAM-a.', 'It works, but is much slower than RAM.'),
  C('Šta je najbolje ulaganje ako računar zastaje jer RAM nije dovoljan?', 'What is the best investment if the computer stalls because RAM is not enough?',
    [['dodati RAM', 'add RAM'], ['kupiti veći monitor', 'buy a bigger monitor'], ['kupiti novu tastaturu', 'buy a new keyboard'], ['kupiti veće kućište', 'buy a bigger case']], 0, 'virtuelna', 'Sa dovoljno RAM-a sistem ne mora da koristi sporiji swap.', 'With enough RAM the system need not use the slower swap.'),
  M('Koji uređaji spadaju u spoljnu memoriju?', 'Which devices count as external memory?',
    [['SSD', 'SSD'], ['HDD', 'HDD'], ['USB fleš', 'a USB flash drive'], ['RAM', 'RAM']], [0, 1, 2], 'podela', 'RAM je unutrašnja memorija.', 'RAM is internal memory.'),
  C('Zašto se za arhivu često bira HDD?', 'Why is an HDD often chosen for an archive?',
    [['jeftin je po gigabajtu, a brzina nije presudna', 'it is cheap per gigabyte and speed is not critical'], ['najbrži je', 'it is the fastest'], ['nema pokretnih delova', 'it has no moving parts'], ['ne treba napajanje', 'it needs no power']], 0, 'spoljna', 'Za velike količine retko korišćenih podataka isplativ je HDD.', 'For large amounts of rarely used data an HDD pays off.')
]);

})();
