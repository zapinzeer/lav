(function () {
'use strict';
var H = window.LAV_QH, t = H.t, C = H.C, M = H.M, B = H.B, N = H.N;
var Q = window.LAV_QUIZZES;

Q.PC07 = H.quiz(t('Ugradnja diska i optičkih uređaja · mali test', 'Installing drives and optical drives · short test'), [
  C('U koje ležište se ugrađuje DVD uređaj?', 'Which bay does a DVD drive go into?',
    [['spoljno ležište od 5,25″', 'a 5.25″ external bay'], ['unutrašnji kavez od 3,5″', 'a 3.5″ internal cage'], ['M.2 slot', 'an M.2 slot'], ['PCIe slot', 'a PCIe slot']], 0, 'lezista', 'Korisnik mora da priđe optičkom uređaju, pa on ide u spoljno ležište od 5,25″.', 'The user must reach the optical drive, so it goes in a 5.25″ external bay.'),
  C('Koliko pinova ima SATA konektor za podatke?', 'How many pins does a SATA data connector have?',
    ['7', '15', '24', '40'], 0, 'kablovi', 'Kabl za podatke ima 7 pinova, a za napajanje 15.', 'The data cable has 7 pins and the power cable 15.'),
  B('M.2 NVMe SSD-u ne trebaju kablovi za podatke i napajanje.', 'An M.2 NVMe SSD needs no data or power cables.', true, 'koraci', 'I podatke i napajanje dobija direktno iz slota na ploči.', 'It gets both data and power straight from the slot on the board.'),
  C('BIOS vidi nov disk, ali ga Windows ne prikazuje kao slovo. Šta treba uraditi?', 'The BIOS sees a new drive, but Windows does not show it as a letter. What must be done?',
    [['inicijalizovati, napraviti particiju i formatirati ga', 'initialise it, create a partition and format it'], ['zameniti SATA kabl', 'replace the SATA cable'], ['ažurirati BIOS', 'update the BIOS'], ['ugraditi ga u drugo ležište', 'put it in another bay']], 0, 'posle', 'Nov disk je prazan; u Upravljanju diskovima ga treba pripremiti.', 'A new drive is empty; it has to be prepared in Disk Management.'),
  C('Koji optički disk ima najveći kapacitet po sloju?', 'Which optical disc has the largest capacity per layer?',
    ['Blu-ray', 'DVD', 'CD', 'CD-RW'], 0, 'opticki', 'Blu-ray prima 25 GB po sloju jer koristi laser kraće talasne dužine.', 'Blu-ray holds 25 GB per layer because it uses a laser with a shorter wavelength.'),
  M('Šta od navedenog treba priključiti na SATA HDD?', 'Which of these must be connected to a SATA HDD?',
    [['SATA kabl za podatke', 'a SATA data cable'], ['SATA kabl za napajanje', 'a SATA power cable'], ['PCIe kabl za napajanje', 'a PCIe power cable'], ['kabl za monitor', 'a monitor cable']], [0, 1], 'kablovi', 'SATA uređaj ima samo konektor za podatke i konektor za napajanje.', 'A SATA device has only a data connector and a power connector.')
], [
  C('Koliko zavrtnjeva se obično koristi za 3,5″ HDD?', 'How many screws are usually used for a 3.5″ HDD?',
    ['4', '1', '2', '8'], 0, 'koraci', 'Po dva sa svake strane, da disk ne vibrira.', 'Two on each side, so the drive does not vibrate.'),
  B('Disk u kavezu treba da ima konektore okrenute ka prednjoj strani kućišta.', 'A drive in the cage should have its connectors facing the front of the case.', false, 'greske', 'Konektori gledaju ka zadnjoj strani, gde se vode kablovi.', 'The connectors face the back, where the cables are routed.'),
  C('Kojim interfejsom su se povezivali stari diskovi sa trakastim kablom od 40 pinova?', 'Which interface did old drives with a 40-pin ribbon cable use?',
    [['IDE (PATA)', 'IDE (PATA)'], ['SATA', 'SATA'], ['NVMe', 'NVMe'], ['USB', 'USB']], 0, 'kablovi', 'IDE ili PATA je stari paralelni interfejs sa džamperom za Master/Slave.', 'IDE or PATA is the old parallel interface with a Master/Slave jumper.'),
  C('Koji je najbrži način povezivanja SSD-a od navedenih?', 'Which of these is the fastest way to connect an SSD?',
    [['M.2 NVMe (PCIe)', 'M.2 NVMe (PCIe)'], ['SATA III', 'SATA III'], ['M.2 SATA', 'M.2 SATA'], ['IDE', 'IDE']], 0, 'kablovi', 'NVMe koristi PCIe trake i doseže više hiljada MB/s, dok je SATA ograničen na oko 600 MB/s.', 'NVMe uses PCIe lanes and reaches several thousand MB/s, while SATA is limited to about 600 MB/s.'),
  N('Koliko jednoslojnih DVD-ova od 4,7 GB treba za arhivu od 14 GB?', 'How many single-layer 4.7 GB DVDs are needed for a 14 GB archive?', '3', 'DVD', 'primeri', '14 / 4,7 ≈ 2,98, pa su potrebna 3 diska.', '14 / 4.7 ≈ 2.98, so 3 discs are needed.', 0),
  C('Šta znači oznaka RW na optičkom uređaju?', 'What does RW mean on an optical drive?',
    [['može da briše i ponovo upisuje diskove', 'it can erase and rewrite discs'], ['samo čita diskove', 'it only reads discs'], ['upisuje samo jednom', 'it writes only once'], ['radi samo sa Blu-ray', 'it works only with Blu-ray']], 0, 'opticki', 'RW znači ReWritable, višestruki upis.', 'RW means ReWritable, writing many times.'),
  C('Koju tabelu particija treba izabrati za disk od 4 TB?', 'Which partition table should be chosen for a 4 TB drive?',
    ['GPT', 'MBR', 'FAT32', 'NTFS'], 0, 'posle', 'MBR ne podržava diskove veće od 2 TB; NTFS i FAT32 su sistemi datoteka, ne tabele.', 'MBR does not support drives larger than 2 TB; NTFS and FAT32 are file systems, not tables.'),
  B('Disk sa podacima iz starog računara treba formatirati čim se ugradi.', 'A drive with data from an old computer should be formatted as soon as it is installed.', false, 'posle', 'Formatiranje bi obrisalo podatke; Windows takav disk sam prepozna.', 'Formatting would erase the data; Windows recognises such a drive by itself.'),
  C('Na nekim pločama korišćenje drugog M.2 slota...', 'On some boards using the second M.2 slot...',
    [['isključuje neke SATA portove', 'disables some SATA ports'], ['isključuje USB', 'disables USB'], ['ubrzava RAM', 'speeds up the RAM'], ['zahteva novo napajanje', 'requires a new power supply']], 0, 'kablovi', 'M.2 i SATA ponekad dele iste trake čipseta; to piše u priručniku.', 'M.2 and SATA sometimes share the same chipset lanes; the manual says so.'),
  C('Kojim redom se ugrađuje SATA disk?', 'In what order is a SATA drive installed?',
    [['isključi, ugradi i pričvrsti, podaci, napajanje', 'switch off, fit and fix, data, power'], ['napajanje, ugradi, isključi', 'power, fit, switch off'], ['formatiraj, pa ugradi', 'format, then fit'], ['podaci, isključi, napajanje', 'data, switch off, power']], 0, 'koraci', 'Uvek prvo isključiš računar i izvučeš kabl.', 'You always switch off and unplug first.')
]);

Q.PC08 = H.quiz(t('Grafička kartica · mali test', 'The graphics card · short test'), [
  C('Šta radi grafička kartica?', 'What does a graphics card do?',
    [['pretvara podatke u sliku na monitoru', 'turns data into a picture on the monitor'], ['čuva podatke kad je računar ugašen', 'keeps data when the computer is off'], ['napaja procesor', 'powers the processor'], ['povezuje računar na internet', 'connects the computer to the internet']], 0, 'uloga', 'Ona računa boju svakog piksela i šalje sliku monitoru.', 'It works out the colour of every pixel and sends the picture to the monitor.'),
  C('Kako se zove memorija na grafičkoj kartici?', 'What is the memory on a graphics card called?',
    ['VRAM', 'ROM', 'SSD', 'BIOS'], 0, 'delovi', 'Video memorija (GDDR) čuva teksture, modele i gotove slike.', 'Video memory (GDDR) holds textures, models and finished pictures.'),
  B('Integrisana grafika je deo procesora i koristi običan RAM.', 'Integrated graphics is part of the processor and uses ordinary RAM.', true, 'uloga', 'Zato nema sopstveni VRAM i slabija je od diskretne kartice.', 'That is why it has no VRAM of its own and is weaker than a dedicated card.'),
  C('Zašto je GPU brz u crtanju slike?', 'Why is a GPU fast at drawing a picture?',
    [['ima hiljade jednostavnih jezgara koja rade istovremeno', 'it has thousands of simple cores working at once'], ['ima veći takt od procesora', 'it has a higher clock than the processor'], ['koristi SSD', 'it uses an SSD'], ['nema hladnjak', 'it has no cooler']], 0, 'paralelno', 'Bojenje piksela se deli na mnogo istih, nezavisnih poslova.', 'Colouring pixels splits into many identical, independent jobs.'),
  C('U koji slot se ugrađuje grafička kartica?', 'Which slot does a graphics card go into?',
    [['PCIe x16', 'PCIe x16'], ['DIMM', 'DIMM'], ['M.2', 'M.2'], ['SATA', 'SATA']], 0, 'ugradnja', 'Najbolje u gornji PCIe x16 slot, najbliži procesoru.', 'Best in the top PCIe x16 slot, the one closest to the processor.'),
  C('Posle ugradnje kartice monitor kaže „No signal”. Šta prvo proveravaš?', 'After installing a card the monitor says "No signal". What do you check first?',
    [['da li je kabl monitora u kartici, a ne u ploči', 'whether the monitor cable is in the card and not in the board'], ['da li radi miš', 'whether the mouse works'], ['količinu RAM-a', 'the amount of RAM'], ['brzinu interneta', 'the internet speed']], 0, 'primeri', 'Kada postoji posebna kartica, izlazi na ploči obično ne rade.', 'When there is a dedicated card, the board outputs usually do not work.')
], [
  N('Koliko piksela ima slika rezolucije 1920 × 1080?', 'How many pixels does a 1920 × 1080 picture have?', '2073600', 'px|piksela|pixels', 'vram', '1920 · 1080 = 2 073 600.', '1920 · 1080 = 2,073,600.', 0),
  N('Koliko MB (okvirno) zauzima jedna slika 4K (3840 × 2160) ako piksel ima 4 bajta?', 'About how many MB does one 4K picture (3840 × 2160) take if a pixel has 4 bytes?', '33', 'MB', 'vram', '3840 · 2160 · 4 ≈ 33 milion bajtova.', '3840 · 2160 · 4 ≈ 33 million bytes.', 5),
  C('Šta je frejm bafer?', 'What is the frame buffer?',
    [['deo VRAM-a u kome je gotova slika za monitor', 'the part of VRAM holding the finished picture for the monitor'], ['ventilator kartice', 'the card fan'], ['PCIe konektor', 'the PCIe connector'], ['drajver', 'the driver']], 0, 'vram', 'Iz njega slika ide na monitor.', 'From there the picture goes to the monitor.'),
  C('Čemu služi VRM na kartici?', 'What is the VRM on a card for?',
    [['daje GPU-u i memoriji stabilan napon', 'it gives the GPU and memory a steady voltage'], ['hladi karticu', 'it cools the card'], ['čuva slike', 'it stores images'], ['povezuje monitor', 'it connects the monitor']], 0, 'delovi', 'VRM je sklop regulatora napona.', 'The VRM is a set of voltage regulators.'),
  M('Šta proveravaš pre kupovine kartice?', 'What do you check before buying a card?',
    [['dužinu kartice u odnosu na kućište', 'the card length against the case'], ['snagu i konektore napajanja', 'the power supply capacity and connectors'], ['izlaze za monitore', 'the monitor outputs'], ['boju tastature', 'the colour of the keyboard']], [0, 1, 2], 'izbor', 'Boja tastature nema veze sa karticom.', 'The keyboard colour has nothing to do with the card.'),
  C('Koja grafika je dovoljna za kancelarijski rad u školi?', 'Which graphics is enough for office work at school?',
    [['integrisana', 'integrated'], ['najjača kartica sa 24 GB', 'the strongest card with 24 GB'], ['dve kartice', 'two cards'], ['kartica za AI', 'an AI card']], 0, 'izbor', 'Word, Excel i pretraživač ne traže 3D grafiku.', 'Word, Excel and a browser do not need 3D graphics.'),
  C('Šta se desi kada igri ponestane VRAM-a?', 'What happens when a game runs out of VRAM?',
    [['kartica pozajmljuje sporiji sistemski RAM i slika zastajkuje', 'the card borrows slower system RAM and the picture stutters'], ['računar se ubrzava', 'the computer speeds up'], ['monitor menja rezoluciju na 8K', 'the monitor switches to 8K'], ['ništa', 'nothing']], 0, 'vram', 'Prenos preko PCIe veze je mnogo sporiji od VRAM-a.', 'Transfer over the PCIe link is much slower than VRAM.'),
  B('Velike i teške kartice mogu vremenom da saviju slot, pa im treba nosač.', 'Large heavy cards can bend the slot over time, so they need a support.', true, 'ugradnja', 'Nosač drži kraj kartice.', 'The support holds the end of the card.'),
  C('Šta treba instalirati posle ugradnje nove kartice?', 'What should be installed after fitting a new card?',
    [['drajver proizvođača', 'the maker\'s driver'], ['novi BIOS ploče', 'a new board BIOS'], ['novi operativni sistem', 'a new operating system'], ['ništa', 'nothing']], 0, 'ugradnja', 'Bez drajvera kartica radi u osnovnom režimu, bez 3D ubrzanja.', 'Without the driver the card runs in basic mode, without 3D acceleration.'),
  C('Koliko slika u sekundi traži prikaz od 144 Hz?', 'How many pictures per second does a 144 Hz display need?',
    ['144', '60', '30', '1'], 0, 'uloga', 'Hz kod monitora znači broj osvežavanja u sekundi.', 'Hz on a monitor means refreshes per second.')
]);

Q.PC09 = H.quiz(t('Ulazne jedinice · mali test', 'Input devices · short test'), [
  C('Šta rade ulazne jedinice?', 'What do input devices do?',
    [['pretvaraju radnje i pojave u digitalne podatke za računar', 'they turn actions and things into digital data for the computer'], ['prikazuju rezultate', 'they show results'], ['čuvaju podatke', 'they store data'], ['hlade računar', 'they cool the computer']], 0, 'pojam', 'Podaci kroz njih idu od korisnika ka računaru.', 'Data goes through them from the user to the computer.'),
  M('Koje su od ovih ulazne jedinice?', 'Which of these are input devices?',
    [['tastatura', 'keyboard'], ['skener', 'scanner'], ['mikrofon', 'microphone'], ['zvučnik', 'speaker']], [0, 1, 2], 'pojam', 'Zvučnik je izlazna jedinica.', 'A speaker is an output device.'),
  C('Kako se zove srpski latinični raspored tastature?', 'What is the Serbian Latin keyboard layout called?',
    ['QWERTZ', 'QWERTY', 'AZERTY', 'DVORAK'], 0, 'tastatura', 'Y i Z su zamenili mesta u odnosu na engleski raspored.', 'Y and Z have swapped places compared with the English layout.'),
  C('Šta znači DPI kod miša?', 'What does DPI mean for a mouse?',
    [['koliko koraka miš prijavi za pomeraj od jednog inča', 'how many steps the mouse reports per inch of movement'], ['broj tastera', 'the number of buttons'], ['trajanje baterije', 'battery life'], ['težinu miša', 'the mouse weight']], 0, 'pokazivaci', 'Veći DPI znači veći put kursora za isti pokret.', 'A higher DPI means a longer cursor path for the same movement.'),
  B('Ekran na dodir je istovremeno ulazna i izlazna jedinica.', 'A touch screen is both an input and an output device.', true, 'pojam', 'Prikazuje sliku i javlja gde ga dodiruješ.', 'It shows a picture and reports where you touch it.'),
  C('Kako optički miš prepoznaje pomeraj?', 'How does an optical mouse detect movement?',
    [['poredi uzastopne slike podloge koje snima mala kamera', 'it compares successive pictures of the surface taken by a tiny camera'], ['kuglica okreće valjke', 'a ball turns rollers'], ['preko GPS-a', 'by GPS'], ['meri temperaturu', 'it measures temperature']], 0, 'pokazivaci', 'Senzor snima hiljade slika u sekundi.', 'The sensor takes thousands of pictures per second.')
], [
  C('Kako kontroler tastature pronalazi pritisnut taster?', 'How does the keyboard controller find a pressed key?',
    [['skenira matricu red po red i čita kolone', 'it scans the matrix row by row and reads the columns'], ['meri težinu prsta', 'it weighs the finger'], ['pita operativni sistem', 'it asks the operating system'], ['koristi kameru', 'it uses a camera']], 0, 'tastatura', 'Kada je u aktivnom redu kontakt zatvoren, kontroler zna i kolonu.', 'When a contact is closed in the active row, the controller knows the column too.'),
  C('Koja tastatura ima poseban prekidač sa oprugom ispod svakog tastera?', 'Which keyboard has a separate spring switch under every key?',
    [['mehanička', 'mechanical'], ['membranska', 'membrane'], ['ekranska', 'on-screen'], ['virtuelna', 'virtual']], 0, 'tastatura', 'Mehaničke su preciznije i dugotrajnije, ali glasnije.', 'Mechanical ones are more precise and last longer, but are louder.'),
  N('Miš ima 1000 DPI. Koliko koraka prijavi za pomeraj od 2 inča?', 'A mouse has 1000 DPI. How many steps does it report for 2 inches of movement?', '2000', 'koraka|steps', 'pokazivaci', '2 · 1000 = 2000.', '2 · 1000 = 2000.', 0),
  N('Koliko piksela po širini ima skenirani papir širine 8 inča pri 300 DPI?', 'How many pixels wide is a scanned sheet 8 inches wide at 300 DPI?', '2400', 'px|piksela|pixels', 'slika-zvuk', '8 · 300 = 2400.', '8 · 300 = 2400.', 0),
  C('Koliko DPI je obično dovoljno za skeniranje teksta?', 'How many DPI is usually enough for scanning text?',
    ['300', '30', '4800', '12000'], 0, 'slika-zvuk', 'Za fotografije se koristi 600 i više.', 'For photos 600 or more is used.'),
  C('Šta radi OCR program?', 'What does an OCR program do?',
    [['od skenirane slike teksta pravi tekst koji može da se menja', 'turns a scanned picture of text into editable text'], ['briše viruse', 'removes viruses'], ['ubrzava miš', 'speeds up the mouse'], ['snima zvuk', 'records sound']], 0, 'slika-zvuk', 'OCR je optičko prepoznavanje znakova.', 'OCR is optical character recognition.'),
  C('Koliko puta u sekundi se uzorkuje zvuk za muzički CD?', 'How many times a second is sound sampled for a music CD?',
    ['44 100', '100', '1000', '1 000 000'], 0, 'slika-zvuk', 'To je 44,1 kHz.', 'That is 44.1 kHz.'),
  C('Koji ekran na dodir radi i sa rukavicom?', 'Which touch screen also works with a glove?',
    [['otporni (rezistivni)', 'resistive'], ['kapacitivni', 'capacitive'], ['OLED', 'OLED'], ['CRT', 'CRT']], 0, 'pokazivaci', 'Otporni reaguje na pritisak, a kapacitivni na prst.', 'A resistive one reacts to pressure, a capacitive one to a finger.'),
  C('Koji uređaj je najbolji za brzo evidentiranje robe u magacinu?', 'Which device is best for quickly recording goods in a warehouse?',
    [['čitač bar koda', 'barcode reader'], ['mikrofon', 'microphone'], ['grafička tabla', 'graphics tablet'], ['džojstik', 'joystick']], 0, 'slika-zvuk', 'Očitava broj za delić sekunde.', 'It reads the number in a fraction of a second.'),
  B('Na srpskoj tastaturi sa uključenim engleskim rasporedom slova Y i Z su zamenjena.', 'On a Serbian keyboard with the English layout switched on, the letters Y and Z are swapped.', true, 'tastatura', 'Raspored bira operativni sistem.', 'The operating system picks the layout.')
]);

Q.PC10 = H.quiz(t('Povezivanje ulaznih jedinica · mali test', 'Connecting input devices · short test'), [
  C('Koji interfejs danas koristi većina ulaznih jedinica?', 'Which interface do most input devices use today?',
    ['USB', 'PS/2', 'LPT', 'VGA'], 0, 'nacini', 'USB je zamenio skoro sve starije priključke.', 'USB has replaced almost all older ports.'),
  C('Koje boje je PS/2 priključak za tastaturu?', 'What colour is the PS/2 port for the keyboard?',
    [['ljubičaste', 'purple'], ['zelene', 'green'], ['plave', 'blue'], ['roze', 'pink']], 0, 'ps2', 'Zeleni je za miš.', 'Green is for the mouse.'),
  B('USB podržava priključivanje uređaja dok računar radi (hot swap).', 'USB supports plugging in devices while the computer is running (hot swap).', true, 'usb', 'PS/2 to ne podržava.', 'PS/2 does not.'),
  C('Šta je potrebno da bi Bluetooth miš proradio?', 'What is needed for a Bluetooth mouse to work?',
    [['uparivanje sa računarom', 'pairing with the computer'], ['PS/2 adapter', 'a PS/2 adapter'], ['VGA kabl', 'a VGA cable'], ['nov BIOS', 'a new BIOS']], 0, 'bezicno', 'Uređaj se stavi u režim uparivanja, pa se doda u podešavanjima.', 'The device is put in pairing mode, then added in the settings.'),
  N('Miš se proziva 1000 puta u sekundi. Koliki je razmak između prozivanja u milisekundama?', 'A mouse is polled 1000 times a second. What is the interval between polls in milliseconds?', '1', 'ms', 'prozivanje', '1000 ms / 1000 = 1 ms.', '1000 ms / 1000 = 1 ms.', 0),
  C('U koji priključak ide mikrofon na zvučnoj kartici?', 'Which jack does a microphone go into on the sound card?',
    [['roze', 'pink'], ['zeleni', 'green'], ['narandžasti', 'orange'], ['crni', 'black']], 0, 'audio', 'Zeleni je izlaz za zvučnike.', 'Green is the speaker output.')
], [
  C('Kolika je najveća brzina USB 2.0?', 'What is the top speed of USB 2.0?',
    ['480 Mb/s', '12 Mb/s', '5 Gb/s', '40 Gb/s'], 0, 'usb', 'USB 3.2 Gen 1 ima 5 Gb/s, USB4 do 40–80 Gb/s.', 'USB 3.2 Gen 1 has 5 Gb/s, USB4 up to 40–80 Gb/s.'),
  C('Kojoj USB klasi pripadaju tastature i miševi?', 'Which USB class do keyboards and mice belong to?',
    ['HID', 'UVC', 'MSC', 'NVMe'], 0, 'usb', 'HID (Human Interface Device) ima ugrađen drajver u sistemu.', 'HID (Human Interface Device) has a built-in driver in the system.'),
  C('Koliko najviše uređaja može da se poveže na jedan USB kontroler preko habova?', 'How many devices at most can be connected to one USB controller through hubs?',
    ['127', '4', '16', '1000'], 0, 'usb', 'Adresa uređaja ima 7 bitova.', 'A device address has 7 bits.'),
  C('Koji USB konektor može da se ukopča na obe strane?', 'Which USB connector can be plugged in either way up?',
    ['USB-C', 'USB-A', 'USB-B', 'Micro-USB'], 0, 'nacini', 'USB-C je simetričan.', 'USB-C is symmetrical.'),
  N('Koliki je razmak prozivanja (ms) pri 125 Hz?', 'What is the polling interval (ms) at 125 Hz?', '8', 'ms', 'prozivanje', '1000 / 125 = 8 ms.', '1000 / 125 = 8 ms.', 0),
  B('PS/2 tastaturu treba priključivati dok je računar uključen.', 'A PS/2 keyboard should be plugged in while the computer is on.', false, 'ps2', 'PS/2 nema hot swap; priključuje se dok je računar ugašen.', 'PS/2 has no hot swap; it is plugged in while the computer is off.'),
  C('Šta najčešće uzrokuje da bežični miš „seče”?', 'What most often makes a wireless mouse stutter?',
    [['slaba baterija ili smetnje i udaljenost prijemnika', 'a weak battery or interference and receiver distance'], ['previše RAM-a', 'too much RAM'], ['nov monitor', 'a new monitor'], ['pun disk', 'a full drive']], 0, 'bezicno', 'Prijemnik treba da bude blizu, dalje od USB 3.0 portova i rutera.', 'The receiver should be close, away from USB 3.0 ports and the router.'),
  C('Gde se vide uređaji sa problemom u drajveru?', 'Where can you see devices with a driver problem?',
    [['u Upravljaču uređajima, sa žutim uzvičnikom', 'in Device Manager, with a yellow exclamation mark'], ['u Wordu', 'in Word'], ['na monitoru OSD', 'on the monitor OSD'], ['u BIOS lozinki', 'in the BIOS password']], 0, 'drajveri', 'Desni klik na Start → Upravljač uređajima.', 'Right-click Start → Device Manager.'),
  M('Koje veze su bežične?', 'Which links are wireless?',
    [['Bluetooth', 'Bluetooth'], ['radio 2,4 GHz sa prijemnikom', '2.4 GHz radio with a receiver'], ['infracrvena', 'infrared'], ['PS/2', 'PS/2']], [0, 1, 2], 'bezicno', 'PS/2 je žična veza.', 'PS/2 is a wired link.'),
  C('Šta znači plava boja unutar USB-A porta?', 'What does a blue colour inside a USB-A port mean?',
    [['obično USB 3.x', 'usually USB 3.x'], ['samo za tastaturu', 'keyboard only'], ['samo punjenje', 'charging only'], ['USB 1.1', 'USB 1.1']], 0, 'nacini', 'Crni je obično USB 2.0.', 'Black is usually USB 2.0.')
]);

Q.PC11 = H.quiz(t('Izlazne jedinice · mali test', 'Output devices · short test'), [
  M('Koje su od ovih izlazne jedinice?', 'Which of these are output devices?',
    [['monitor', 'monitor'], ['štampač', 'printer'], ['zvučnici', 'speakers'], ['miš', 'mouse']], [0, 1, 2], 'pojam', 'Miš je ulazna jedinica.', 'A mouse is an input device.'),
  C('Od kojih podpiksela se sastoji piksel na monitoru?', 'Which subpixels make up a pixel on a monitor?',
    [['crveni, zeleni i plavi', 'red, green and blue'], ['cijan, magenta i žuti', 'cyan, magenta and yellow'], ['crni i beli', 'black and white'], ['samo beli', 'white only']], 0, 'monitor', 'Ekran meša svetlo aditivno (RGB).', 'A screen mixes light additively (RGB).'),
  C('Koju boju daju crveni i zeleni podpiksel na punoj jačini?', 'What colour do the red and green subpixels give at full brightness?',
    [['žutu', 'yellow'], ['ljubičastu', 'purple'], ['crnu', 'black'], ['plavu', 'blue']], 0, 'monitor', 'R + G = žuta kod aditivnog mešanja.', 'R + G = yellow in additive mixing.'),
  C('Koje boje koristi štampač?', 'Which colours does a printer use?',
    ['CMYK', 'RGB', 'HDMI', 'DPI'], 0, 'stampaci', 'Cijan, magenta, žuta i crna; mešaju se suptraktivno.', 'Cyan, magenta, yellow and black; they mix subtractively.'),
  C('Koji štampač koristi toner i bubanj?', 'Which printer uses toner and a drum?',
    [['laserski', 'laser'], ['inkdžet', 'inkjet'], ['matrični', 'dot-matrix'], ['termalni', 'thermal']], 0, 'stampaci', 'Toner se lepi na bubanj, prenosi na papir i topi.', 'The toner sticks to the drum, moves to the paper and is melted.'),
  B('OLED pikseli sami svetle i ne trebaju pozadinsko osvetljenje.', 'OLED pixels light themselves and need no backlight.', true, 'tehnologije', 'Zato OLED ima savršeno crno.', 'That is why OLED has perfect black.')
], [
  N('Koliko boja može da prikaže piksel ako svaki od tri podpiksela ima 256 nivoa?', 'How many colours can a pixel show if each of three subpixels has 256 levels?', '16777216', '', 'monitor', '256 · 256 · 256 = 16 777 216.', '256 · 256 · 256 = 16,777,216.', 0),
  N('Kolika je gustina piksela (PPI) monitora od 24″ sa rezolucijom 1920 × 1080?', 'What is the pixel density (PPI) of a 24″ monitor at 1920 × 1080?', '92', 'PPI', 'tehnologije', '√(1920² + 1080²) ≈ 2203, 2203 / 24 ≈ 92.', '√(1920² + 1080²) ≈ 2203, 2203 / 24 ≈ 92.', 2),
  C('Šta znači 144 Hz kod monitora?', 'What does 144 Hz mean for a monitor?',
    [['slika se osvežava 144 puta u sekundi', 'the picture refreshes 144 times a second'], ['ima 144 piksela', 'it has 144 pixels'], ['troši 144 W', 'it uses 144 W'], ['dijagonala je 144 cm', 'the diagonal is 144 cm']], 0, 'monitor', 'Veće osvežavanje daje glatkije kretanje.', 'A higher refresh rate gives smoother motion.'),
  C('Koja LCD tehnologija ima najvernije boje i najšire uglove gledanja?', 'Which LCD technology has the most accurate colours and widest viewing angles?',
    ['IPS', 'TN', 'CRT', 'DLP'], 0, 'tehnologije', 'TN je brz i jeftin, ali slabijih boja.', 'TN is fast and cheap, but with weaker colours.'),
  C('Koji štampač se koristi za fiskalne račune?', 'Which printer is used for receipts?',
    [['termalni', 'thermal'], ['laserski', 'laser'], ['3D', '3D'], ['ploter', 'plotter']], 0, 'stampaci', 'Toplota zatamni poseban papir.', 'Heat darkens special paper.'),
  C('Zašto štampač ima posebnu crnu boju (K)?', 'Why does a printer have a separate black (K)?',
    [['mešavina C, M i Y daje mutnu tamnobraon, ne čistu crnu', 'a mix of C, M and Y gives a muddy dark brown, not pure black'], ['zbog lepšeg izgleda kertridža', 'for nicer looking cartridges'], ['jer je crna najskuplja', 'because black is the dearest'], ['zbog brzine interneta', 'because of internet speed']], 0, 'stampaci', 'Crni tekst je najčešći, a mešavina tri boje nije prava crna.', 'Black text is the most common, and a mix of three colours is not true black.'),
  N('Štampač štampa 20 strana u minuti. Koliko minuta traje 100 strana?', 'A printer prints 20 pages per minute. How many minutes do 100 pages take?', '5', 'min|minuta|minutes', 'primeri', '100 / 20 = 5 minuta.', '100 / 20 = 5 minutes.', 0),
  C('Šta znači oznaka 2.1 kod zvučnika?', 'What does 2.1 mean for speakers?',
    [['dva zvučnika i subwoofer', 'two speakers and a subwoofer'], ['dve slušalice', 'two headphones'], ['verzija drajvera', 'driver version'], ['2,1 W snage', '2.1 W of power']], 0, 'zvuk', '„.1” je subwoofer za duboke tonove.', 'The ".1" is a subwoofer for deep tones.'),
  C('Koji deo zvučne kartice pretvara brojeve u zvučni signal?', 'Which part of the sound card turns numbers into a sound signal?',
    [['DA konvertor (DAC)', 'the DA converter (DAC)'], ['VRM', 'VRM'], ['BIOS', 'BIOS'], ['SATA', 'SATA']], 0, 'zvuk', 'DAC = digitalno-analogni konvertor.', 'DAC = digital-to-analogue converter.'),
  C('Šta je najvažnije kod projektora za osvetljenu učionicu?', 'What matters most in a projector for a lit classroom?',
    [['svetlina u lumenima', 'brightness in lumens'], ['broj USB portova', 'number of USB ports'], ['boja kućišta', 'colour of the case'], ['težina', 'weight']], 0, 'projektor', 'Za osvetljenu učionicu treba bar oko 3000 lm.', 'A lit classroom needs at least about 3000 lm.')
]);

Q.PC12 = H.quiz(t('Povezivanje izlaznih jedinica · mali test', 'Connecting output devices · short test'), [
  C('Koji video priključak prenosi analogni signal?', 'Which video connector carries an analogue signal?',
    ['VGA', 'HDMI', 'DisplayPort', 'USB-C'], 0, 'video', 'VGA je plavi D-sub sa 15 pinova.', 'VGA is the blue 15-pin D-sub.'),
  C('Koji priključak prenosi i sliku i zvuk i čest je na televizorima?', 'Which connector carries both picture and sound and is common on TVs?',
    ['HDMI', 'VGA', 'DVI', 'PS/2'], 0, 'video', 'HDMI podržava i CEC.', 'HDMI also supports CEC.'),
  B('Kada računar ima posebnu grafičku karticu, monitor se priključuje u karticu.', 'When a computer has a dedicated graphics card, the monitor is plugged into the card.', true, 'povezivanje', 'Izlazi na ploči tada obično ne rade.', 'The board outputs then usually do not work.'),
  C('Kojom prečicom biraš „Dupliraj” ili „Proširi” u Windowsu?', 'Which shortcut picks "Duplicate" or "Extend" in Windows?',
    ['Win + P', 'Ctrl + C', 'Alt + F4', 'Win + L'], 0, 'povezivanje', 'Win + P otvara izbor načina projekcije.', 'Win + P opens the projection mode choice.'),
  C('Šta treba za povezivanje HDMI izlaza na VGA projektor?', 'What is needed to connect an HDMI output to a VGA projector?',
    [['aktivni konvertor', 'an active converter'], ['pasivni kabl', 'a passive cable'], ['USB hab', 'a USB hub'], ['ništa', 'nothing']], 0, 'povezivanje', 'Digitalni signal mora da se pretvori u analogni.', 'The digital signal has to be turned into analogue.'),
  C('Kako se povezuje štampač da bi svi računari u učionici mogli da štampaju bez jednog uključenog računara?', 'How is a printer connected so every classroom computer can print without one computer staying on?',
    [['preko mreže (Ethernet ili Wi-Fi)', 'over the network (Ethernet or Wi-Fi)'], ['preko PS/2', 'over PS/2'], ['preko VGA', 'over VGA'], ['preko 3,5 mm', 'over 3.5 mm']], 0, 'stampac', 'Mrežni štampač ima svoju IP adresu.', 'A network printer has its own IP address.')
], [
  C('Šta određuje koliko podataka u sekundi kabl mora da prenese?', 'What decides how much data per second a cable must carry?',
    [['rezolucija, osvežavanje i dubina boje', 'resolution, refresh rate and colour depth'], ['boja kabla', 'the cable colour'], ['broj zvučnika', 'the number of speakers'], ['veličina diska', 'the drive size']], 0, 'propusni', 'Svi pikseli svake slike moraju da prođu kroz kabl.', 'All the pixels of every picture must pass through the cable.'),
  N('Okvirno koliko Gb/s treba za 1920 × 1080, 60 Hz, 24 bita (bez dodataka)?', 'Roughly how many Gb/s are needed for 1920 × 1080, 60 Hz, 24 bit (without extras)?', '3', 'Gb/s', 'primeri', '1920 · 1080 · 24 · 60 ≈ 2,99 · 10⁹ bita u sekundi.', '1920 · 1080 · 24 · 60 ≈ 2.99 · 10⁹ bits per second.', 5),
  C('Koji priključak podržava povezivanje više monitora u lanac (MST)?', 'Which connector supports daisy-chaining several monitors (MST)?',
    ['DisplayPort', 'VGA', 'HDMI 1.4', 'DVI'], 0, 'video', 'DisplayPort MST šalje više slika kroz jedan izlaz.', 'DisplayPort MST sends several pictures through one output.'),
  C('Monitor od 144 Hz preko starog HDMI 1.4 radi na 60 Hz. Zašto?', 'A 144 Hz monitor on old HDMI 1.4 runs at 60 Hz. Why?',
    [['HDMI 1.4 nema dovoljan propusni opseg', 'HDMI 1.4 does not have enough bandwidth'], ['monitor je neispravan', 'the monitor is faulty'], ['previše RAM-a', 'too much RAM'], ['pogrešna tastatura', 'the wrong keyboard']], 0, 'propusni', 'Rešenje je DisplayPort ili HDMI 2.0/2.1.', 'The fix is DisplayPort or HDMI 2.0/2.1.'),
  C('Šta je S/PDIF?', 'What is S/PDIF?',
    [['digitalni audio izlaz, često optički', 'a digital audio output, often optical'], ['video priključak', 'a video connector'], ['vrsta štampača', 'a kind of printer'], ['USB verzija', 'a USB version']], 0, 'zvuk', 'Optički S/PDIF se zove i Toslink.', 'Optical S/PDIF is also called Toslink.'),
  C('Koji servis u Windowsu vodi red za štampu?', 'Which Windows service runs the print queue?',
    ['Print Spooler', 'Device Manager', 'Task Scheduler', 'Disk Management'], 0, 'stampac', 'Kada se štampa zaglavi, otkaži dokument ili ponovo pokreni servis.', 'When printing gets stuck, cancel the document or restart the service.'),
  C('Zvuk se ne čuje posle priključivanja HDMI monitora bez zvučnika. Šta proveravaš?', 'There is no sound after connecting an HDMI monitor without speakers. What do you check?',
    [['podrazumevani izlazni uređaj za zvuk', 'the default sound output device'], ['rezoluciju', 'the resolution'], ['RAM', 'the RAM'], ['BIOS lozinku', 'the BIOS password']], 0, 'zvuk', 'Sistem je verovatno prebacio zvuk na monitor.', 'The system has probably switched sound to the monitor.'),
  C('Koji audio priključak je za prednje zvučnike ili slušalice?', 'Which audio jack is for the front speakers or headphones?',
    [['zeleni', 'green'], ['roze', 'pink'], ['svetloplavi', 'light blue'], ['narandžasti', 'orange']], 0, 'zvuk', 'Narandžasti je za centar i subwoofer.', 'Orange is for the centre and subwoofer.'),
  B('DisplayPort → HDMI obično radi preko jednostavnog pasivnog adaptera.', 'DisplayPort → HDMI usually works through a simple passive adapter.', true, 'povezivanje', 'Mnogi DP izlazi podržavaju DP++ režim.', 'Many DP outputs support DP++ mode.'),
  C('Laptop ima samo USB-C. Kada možeš preko njega da priključiš monitor?', 'A laptop has only USB-C. When can you connect a monitor through it?',
    [['kada port podržava DP Alt Mode ili Thunderbolt', 'when the port supports DP Alt Mode or Thunderbolt'], ['uvek', 'always'], ['nikada', 'never'], ['samo bez struje', 'only without power']], 0, 'video', 'Ne prenosi svaki USB-C port sliku.', 'Not every USB-C port carries a picture.')
]);

Q.PC13 = H.quiz(t('Kvarovi kod računara · mali test', 'Computer faults · short test'), [
  C('Šta je POST?', 'What is POST?',
    [['provera hardvera pri paljenju', 'a hardware check at power-on'], ['vrsta napajanja', 'a kind of power supply'], ['program za crtanje', 'a drawing program'], ['USB standard', 'a USB standard']], 0, 'post', 'BIOS/UEFI proverava CPU, RAM, grafiku i uređaje za pokretanje.', 'The BIOS/UEFI checks the CPU, RAM, graphics and boot devices.'),
  C('Kako se zove kvar koji se javlja samo ponekad?', 'What is a fault called that appears only now and then?',
    [['povremeni (intermitentni)', 'intermittent'], ['trajni', 'permanent'], ['softverski', 'software'], ['planirani', 'planned']], 0, 'podela', 'Povremeni kvarovi se najteže pronalaze.', 'Intermittent faults are the hardest to find.'),
  C('Računar se gasi samo posle nekoliko minuta igre. Šta je verovatan uzrok?', 'The computer shuts down only after a few minutes of gaming. What is the likely cause?',
    [['pregrevanje ili slabo napajanje', 'overheating or a weak power supply'], ['pogrešan raspored tastature', 'the wrong keyboard layout'], ['prazan disk', 'an empty drive'], ['nov miš', 'a new mouse']], 0, 'pregrevanje', 'Kvar se javlja pod opterećenjem i posle nekog vremena.', 'The fault appears under load and after some time.'),
  C('Šta znači ritmično kliktanje iz HDD-a?', 'What does rhythmic clicking from an HDD mean?',
    [['mehanički kvar; odmah napravi bekap', 'a mechanical fault; back up at once'], ['disk radi normalno', 'the drive is working normally'], ['ventilator je prljav', 'the fan is dirty'], ['RAM je pun', 'the RAM is full']], 0, 'manifestacije', 'Glava diska otkazuje.', 'The drive head is failing.'),
  B('Pri traženju kvara treba menjati samo jednu stvar u isto vreme.', 'When looking for a fault you should change only one thing at a time.', true, 'postupak', 'Inače ne znaš šta je pomoglo.', 'Otherwise you do not know what helped.'),
  C('Šta najverovatnije znače šareni kvadrati i linije na ekranu (artefakti)?', 'What do coloured squares and lines on the screen (artefacts) most likely mean?',
    [['problem sa grafičkom karticom', 'a graphics card problem'], ['problem sa tastaturom', 'a keyboard problem'], ['prazna CMOS baterija', 'a flat CMOS battery'], ['pun disk', 'a full drive']], 0, 'manifestacije', 'Artefakti su tipičan znak pregrejane ili neispravne kartice ili VRAM-a.', 'Artefacts are a typical sign of an overheating or faulty card or VRAM.')
], [
  C('Lampica DRAM ostaje upaljena i ploča ponavlja dug pisak. Šta proveravaš?', 'The DRAM LED stays lit and the board repeats a long beep. What do you check?',
    [['RAM module', 'the RAM modules'], ['monitor', 'the monitor'], ['miš', 'the mouse'], ['zvučnike', 'the speakers']], 0, 'post', 'Izvadi i vrati RAM, pa probaj jedan po jedan.', 'Reseat the RAM, then try one module at a time.'),
  B('Značenje zvučnih signala je isto na svim pločama.', 'The meaning of beep codes is the same on all boards.', false, 'post', 'Zavisi od proizvođača BIOS-a i ploče; proveri priručnik.', 'It depends on the BIOS maker and the board; check the manual.'),
  C('Računar posle svakog isključivanja iz struje ima pogrešan datum. Šta menjaš?', 'After every unplugging the computer has the wrong date. What do you replace?',
    [['CMOS bateriju (CR2032)', 'the CMOS battery (CR2032)'], ['napajanje', 'the power supply'], ['procesor', 'the processor'], ['monitor', 'the monitor']], 0, 'primeri', 'Baterija čuva sat i BIOS podešavanja.', 'The battery keeps the clock and the BIOS settings.'),
  C('Kojim alatom se proverava RAM?', 'Which tool checks the RAM?',
    ['MemTest86', 'CrystalDiskInfo', 'Paint', 'Print Spooler'], 0, 'hw-sw', 'MemTest86 radi pre pokretanja sistema.', 'MemTest86 runs before the system starts.'),
  C('Čemu služi S.M.A.R.T.?', 'What is S.M.A.R.T. for?',
    [['prati stanje diska', 'it monitors drive health'], ['ubrzava internet', 'it speeds up the internet'], ['boji piksele', 'it colours pixels'], ['meri buku', 'it measures noise']], 0, 'manifestacije', 'Čita se alatom kao što je CrystalDiskInfo.', 'It is read with a tool such as CrystalDiskInfo.'),
  C('Kvar se javlja i u BIOS-u, pre učitavanja sistema. Kakav je kvar?', 'The fault also appears in the BIOS, before the system loads. What kind of fault is it?',
    [['skoro sigurno hardverski', 'almost certainly hardware'], ['softverski', 'software'], ['virus', 'a virus'], ['greška u Wordu', 'a Word bug']], 0, 'hw-sw', 'Pre učitavanja sistema nema drajvera ni programa koji bi pravili problem.', 'Before the system loads there are no drivers or programs to cause trouble.'),
  C('Šta procesor radi kada se previše zagreje?', 'What does a processor do when it gets too hot?',
    [['smanji brzinu, a ako ne pomogne, računar se ugasi', 'slows itself down, and if that fails the computer shuts down'], ['ubrza se', 'speeds up'], ['obriše disk', 'erases the drive'], ['promeni rezoluciju', 'changes the resolution']], 0, 'pregrevanje', 'To se zove throttling.', 'This is called throttling.'),
  M('Šta su znaci pregrevanja?', 'What are signs of overheating?',
    [['stalno glasni ventilatori', 'constantly loud fans'], ['usporavanje pod opterećenjem', 'slowing down under load'], ['gašenje pri zahtevnom radu', 'shutting down under heavy work'], ['pogrešno slovo na tastaturi', 'a wrong letter on the keyboard']], [0, 1, 2], 'pregrevanje', 'Tastatura nema veze sa temperaturom.', 'The keyboard has nothing to do with temperature.'),
  C('Šta je metoda zamene ispravnim delom?', 'What is the known-good swap method?',
    [['sumnjiv deo menjaš delom za koji znaš da radi', 'you replace a suspect part with one you know works'], ['menjaš sve delove odjednom', 'you replace all parts at once'], ['reinstaliraš sistem', 'you reinstall the system'], ['čistiš monitor', 'you clean the monitor']], 0, 'postupak', 'Ako kvar nestane, našao si krivca.', 'If the fault goes away, you have found the culprit.'),
  B('Neispravno napajanje treba otvoriti i popraviti.', 'A faulty power supply should be opened and repaired.', false, 'greske', 'U napajanju ostaje opasan napon; menja se, ne popravlja.', 'A dangerous voltage remains inside; it is replaced, not repaired.')
]);

Q.PC14 = H.quiz(t('Zamena neispravnih komponenti · mali test', 'Replacing faulty components · short test'), [
  C('Šta je prvi korak pre zamene dela?', 'What is the first step before replacing a part?',
    [['potvrditi dijagnozu', 'confirm the diagnosis'], ['kupiti najskuplji deo', 'buy the most expensive part'], ['formatirati disk', 'format the drive'], ['ažurirati Word', 'update Word']], 0, 'priprema', 'Da ne bi bacio ispravan deo.', 'So that you do not throw away a working part.'),
  C('Šta radiš pre zamene diska koji još radi?', 'What do you do before replacing a drive that still works?',
    [['bekap ili kloniranje podataka', 'back up or clone the data'], ['brišeš ga', 'wipe it'], ['menjaš RAM', 'replace the RAM'], ['ništa', 'nothing']], 0, 'ram-disk', 'Podaci se ne mogu kupiti.', 'Data cannot be bought.'),
  B('Kablovi modularnog napajanja različitih proizvođača su uvek zamenljivi.', 'Modular PSU cables from different makers are always interchangeable.', false, 'psu-gpu', 'Raspored pinova na strani napajanja nije standardan.', 'The pin layout on the PSU side is not standard.'),
  C('Koliko termalne paste se nanosi na procesor?', 'How much thermal paste goes on the processor?',
    [['zrno veličine graška', 'a pea-sized dot'], ['cela tuba', 'the whole tube'], ['nimalo', 'none'], ['debeo sloj po celoj ploči', 'a thick layer over the whole board']], 0, 'pasta', 'Pritisak hladnjaka ga raširi u tanak sloj.', 'The cooler pressure spreads it into a thin layer.'),
  C('Kako se RAM modul pravilno postavlja?', 'How is a RAM module seated correctly?',
    [['urez se poklopi sa ispupčenjem, pritisak na oba kraja do klika', 'the notch matches the key, press both ends until it clicks'], ['bilo kako, pa se zavrne', 'any way, then screw it'], ['pod uglom od 30°', 'at a 30° angle'], ['zalepi se', 'it is glued']], 0, 'ram-disk', 'Bravice moraju da kliknu.', 'The latches must click.'),
  C('Šta se radi sa starim neispravnim delom?', 'What is done with an old faulty part?',
    [['predaje se na reciklažu elektronskog otpada', 'it is handed in for e-waste recycling'], ['baca se u kantu', 'it goes in the bin'], ['zakopa se', 'it is buried'], ['spali se', 'it is burned']], 0, 'posle', 'Sadrži štetne materije i vredne metale.', 'It contains harmful substances and valuable metals.')
], [
  C('Koji RAM ide u laptop?', 'Which RAM goes into a laptop?',
    ['SO-DIMM', 'DIMM', 'M.2', 'PCIe'], 0, 'priprema', 'Stoni računari koriste DIMM.', 'Desktops use DIMM.'),
  N('Komponente troše ukupno 400 W. Koliko vati treba napajanje sa rezervom od 30 %?', 'The components use 400 W in total. How many watts should the PSU have with a 30 % reserve?', '520', 'W', 'primeri', '400 · 1,3 = 520 W, pa se bira 550 W.', '400 · 1.3 = 520 W, so 550 W is chosen.', 2),
  C('Čime se čisti stara termalna pasta?', 'What do you clean old thermal paste with?',
    [['izopropil alkoholom i krpicom bez dlačica', 'isopropyl alcohol and a lint-free cloth'], ['vodom', 'water'], ['šmirglom', 'sandpaper'], ['nožem', 'a knife']], 0, 'pasta', 'Alkohol brzo isparava i ne ostavlja trag.', 'Alcohol evaporates quickly and leaves no trace.'),
  C('Zašto se pre zamene grafičke kartice drugog proizvođača uklanja stari drajver?', 'Why is the old driver removed before switching to a graphics card from another maker?',
    [['da ne bi bilo sukoba drajvera', 'to avoid driver conflicts'], ['da se ubrza internet', 'to speed up the internet'], ['zbog garancije', 'because of the warranty'], ['nije potrebno', 'it is not needed']], 0, 'psu-gpu', 'Za to se koristi alat DDU.', 'The DDU tool is used for that.'),
  C('Kako se otpuštaju zavrtnji hladnjaka?', 'How are cooler screws loosened?',
    [['unakrsno, malo po malo', 'crosswise, a little at a time'], ['jedan do kraja, pa sledeći', 'one fully, then the next'], ['čekićem', 'with a hammer'], ['ne odvrću se', 'they are not removed']], 0, 'pasta', 'Tako pritisak na procesor ostaje ravnomeran.', 'That way the pressure on the processor stays even.'),
  C('Posle zamene paste temperatura je porasla. Šta je česta greška?', 'After replacing the paste the temperature went up. What is a common mistake?',
    [['zaboravljena zaštitna folija na dnu hladnjaka', 'the protective film left on the cooler base'], ['previše RAM-a', 'too much RAM'], ['nov miš', 'a new mouse'], ['pogrešan raspored tastature', 'the wrong keyboard layout']], 0, 'greske', 'Folija sprečava prenos toplote.', 'The film blocks heat transfer.'),
  C('Kada se uključuje računar posle zamene?', 'When is the computer switched on after a replacement?',
    [['pre zatvaranja kućišta, da se proveri rad', 'before closing the case, to test it'], ['tek posle nedelju dana', 'only after a week'], ['nikada', 'never'], ['tek kad se kućište zatvori i zalepi', 'only after the case is closed and sealed']], 0, 'opsti', 'Ako nešto ne radi, lakše je popraviti dok je kućište otvoreno.', 'If something does not work, it is easier to fix while the case is open.'),
  M('Šta upisuješ u zapis o servisu?', 'What do you write in the service record?',
    [['datum i simptom', 'the date and the symptom'], ['šta je zamenjeno', 'what was replaced'], ['rezultat testa', 'the test result'], ['lozinku korisnika', 'the user\'s password']], [0, 1, 2], 'posle', 'Lozinke se nikada ne zapisuju.', 'Passwords are never written down.'),
  C('Koji je dobar test posle zamene napajanja?', 'What is a good test after replacing the power supply?',
    [['test opterećenja (npr. OCCT) uz praćenje temperatura', 'a stress test (e.g. OCCT) while watching temperatures'], ['otvaranje Notepada', 'opening Notepad'], ['promena pozadine', 'changing the wallpaper'], ['restart rutera', 'restarting the router']], 0, 'posle', 'Napajanje treba proveriti pod punim opterećenjem.', 'A PSU should be checked under full load.'),
  B('Pre rada treba izvući kabl napajanja iz zida, jer ploča ima napon i kad je računar ugašen.', 'Before working you should pull the power cable from the wall, because the board is powered even when the computer is off.', true, 'opsti', 'Uz to drži dugme za paljenje 5 sekundi.', 'Also hold the power button for 5 seconds.')
]);

})();
