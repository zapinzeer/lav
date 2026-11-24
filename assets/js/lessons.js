window.LAV_CLASSES = {
  fizika: {
    sr: 'Fizika',
    en: 'Physics',
    color: 'copper',
    blurb: {
      sr: 'Magnetizam, sile, motori i indukcija, i Nikola Tesla.',
      en: 'Magnetism, forces, motors and induction, and Nikola Tesla.'
    }
  },
  osnove: {
    sr: 'Osnove elektronike',
    en: 'Fundamentals of Electronics',
    color: 'field',
    blurb: {
      sr: 'Laboratorijske vežbe merenja instrumentima i osciloskopom, i snaga u kolima sa kalemom i kondenzatorom.',
      en: 'Lab exercises on measuring with meters and an oscilloscope, and power in circuits with a coil and a capacitor.'
    }
  },
  elektronika: {
    sr: 'Elektronika',
    en: 'Electronics',
    color: 'violet',
    blurb: {
      sr: 'Diode i usmerivači, bipolarni tranzistori i njihove ekvivalentne šeme.',
      en: 'Diodes and rectifiers, bipolar transistors and their equivalent circuits.'
    }
  },
  naizmenicna: {
    sr: 'Naizmenična struja',
    en: 'Alternating current',
    color: 'amber',
    blurb: {
      sr: 'Fazori, kompleksni brojevi i ponašanje otpornika, kalema i kondenzatora u kolu naizmenične struje.',
      en: 'Phasors, complex numbers, and how resistors, coils and capacitors behave in an AC circuit.'
    }
  },
  racunari: {
    sr: 'Računarski hardver',
    en: 'Computer hardware',
    color: 'green',
    blurb: {
      sr: 'Kućišta, napajanje, matična ploča sa 3D modelom, ugradnja, memorija i diskovi, grafička kartica, ulazne i izlazne jedinice, kvarovi i njihova popravka.',
      en: 'Cases, power supplies, the motherboard with a 3D model, assembly, memory and drives, the graphics card, input and output devices, faults and repairs.'
    }
  },
  podaci: {
    sr: 'Podaci i baze',
    en: 'Data and databases',
    color: 'violet',
    blurb: {
      sr: 'Osnove podataka, SQL-a i Firebase baze kao servisa za podatke.',
      en: 'The basics of data, SQL and the Firebase database as a data service.'
    }
  }
};

window.LAV_LESSONS = [
  {
    slug: 'magnetna-indukcija',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 14,
    quiz: 'FIZ01',
    title: { sr: 'Magnetna indukcija', en: 'Magnetic induction' },
    summary: {
      sr: 'Šta je magnetno polje, kako se crta pomoću linija i šta zapravo meri tesla.',
      en: 'What a magnetic field is, how we draw it with field lines, and what a tesla actually measures.'
    },
    tags: ['3d', 'formulas']
  },
  {
    slug: 'magnetni-fluks',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 13,
    quiz: 'FIZ02',
    title: { sr: 'Magnetni fluks', en: 'Magnetic flux' },
    summary: {
      sr: 'Koliko polja prolazi kroz površinu i zašto je za to važan ugao.',
      en: 'How much field goes through a surface, and why the angle matters.'
    },
    tags: ['3d', 'formulas']
  },
  {
    slug: 'magnetno-polje-provodnika',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 15,
    quiz: 'FIZ03',
    title: { sr: 'Magnetno polje strujnog provodnika', en: 'Magnetic field of a current-carrying wire' },
    summary: {
      sr: 'Erstedov ogled, pravilo desne ruke i polje oko pravog provodnika i zavojka.',
      en: 'Ørsted\'s experiment, the right-hand rule, and the field around a straight wire and a loop.'
    },
    tags: ['3d', 'formulas']
  },
  {
    slug: 'elektromagnet',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 14,
    quiz: 'FIZ04',
    title: { sr: 'Elektromagnet', en: 'Electromagnet' },
    summary: {
      sr: 'Kalem, gvozdeno jezgro i zašto elektromagnet može da bude jači od običnog magneta.',
      en: 'A coil, an iron core, and why an electromagnet can be stronger than an ordinary magnet.'
    },
    tags: ['3d', 'formulas']
  },
  {
    slug: 'amperova-sila',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 18,
    quiz: 'FIZ05',
    title: { sr: 'Amperova sila', en: 'Ampère force' },
    summary: {
      sr: 'Sila na provodnik sa strujom u magnetnom polju i sila koja deluje između dva provodnika.',
      en: 'The force on a wire carrying current in a magnetic field, and the force between two wires.'
    },
    tags: ['3d', 'animation', 'formulas']
  },
  {
    slug: 'elektromotor',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 20,
    quiz: 'FIZ06',
    title: { sr: 'Elektromotor', en: 'Electric motor' },
    summary: {
      sr: 'Kako se zavojak sa strujom u polju okreće i zašto motoru treba komutator.',
      en: 'How a loop of current in a field starts to turn, and why a motor needs a commutator.'
    },
    tags: ['3d', 'animation', 'formulas']
  },
  {
    slug: 'elektromagnetna-indukcija',
    cls: 'fizika',
    date: '2026-10-09',
    minutes: 22,
    quiz: 'FIZ07',
    title: { sr: 'Pojava elektromagnetne indukcije · Faradejev zakon', en: 'Electromagnetic induction · Faraday\'s law' },
    summary: {
      sr: 'Promenljiv fluks stvara napon. Faradejevi ogledi, Lencovo pravilo i generator.',
      en: 'A changing flux creates a voltage. Faraday\'s experiments, Lenz\'s rule and the generator.'
    },
    tags: ['3d', 'animation', 'formulas']
  },
  {
    slug: 'nikola-tesla',
    cls: 'fizika',
    date: '2026-11-23',
    minutes: 22,
    quiz: 'FIZ08',
    title: { sr: 'Nikola Tesla i njegovi doprinosi i otkrića', en: 'Nikola Tesla, his contributions and discoveries' },
    summary: {
      sr: 'Život Nikole Tesle, obrtno magnetno polje i višefazni sistem, asinhroni motor, rat struja, Teslin transformator, radio i daljinsko upravljanje.',
      en: 'The life of Nikola Tesla, the rotating magnetic field and the polyphase system, the induction motor, the war of the currents, the Tesla coil, radio and remote control.'
    },
    tags: ['animation']
  },
  {
    slug: 'merenje-struje-i-napona',
    cls: 'osnove',
    date: '2026-10-09',
    minutes: 22,
    quiz: 'OSN01',
    title: {
      sr: 'Merenje struje i napona u kolima naizmenične struje analognim i digitalnim instrumentom',
      en: 'Measuring current and voltage in AC circuits with analog and digital instruments'
    },
    summary: {
      sr: 'Efektivna vrednost, kako se vezuju ampermetar i voltmetar, klasa tačnosti i kako se čita skala.',
      en: 'RMS value, how to connect an ammeter and a voltmeter, accuracy class and how to read a scale.'
    },
    tags: ['animation', 'formulas', 'lab']
  },
  {
    slug: 'merenje-osciloskopom',
    cls: 'osnove',
    date: '2026-10-09',
    minutes: 24,
    quiz: 'OSN02',
    title: {
      sr: 'Merenje napona na otporniku, kalemu i kondenzatoru osciloskopom',
      en: 'Measuring voltage on a resistor, coil and capacitor with an oscilloscope'
    },
    summary: {
      sr: 'Šta rade komande osciloskopa i kako se sa ekrana čitaju amplituda, perioda i fazni stav za R, L i C.',
      en: 'What the oscilloscope controls do, and how to read amplitude, period and phase for R, L and C off the screen.'
    },
    tags: ['animation', 'formulas', 'lab']
  },
  {
    slug: 'snaga-u-kolu-sa-kalemom',
    cls: 'osnove',
    date: '2026-11-23',
    minutes: 20,
    quiz: 'OSN03',
    title: { sr: 'Snaga u kolu sa kalemom', en: 'Power in a circuit with a coil' },
    summary: {
      sr: 'Realni kalem kao RL kolo, trenutna snaga, aktivna, reaktivna i prividna snaga, trougao snaga i faktor snage cos φ.',
      en: 'A real coil as an RL circuit, instantaneous power, active, reactive and apparent power, the power triangle and the power factor cos φ.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'snaga-u-kolu-sa-kondenzatorom',
    cls: 'osnove',
    date: '2026-11-23',
    minutes: 20,
    quiz: 'OSN04',
    title: { sr: 'Snaga u kolu sa kondenzatorom', en: 'Power in a circuit with a capacitor' },
    summary: {
      sr: 'RC kolo, struja koja prednjači naponu, negativna reaktivna snaga kondenzatora i popravka faktora snage kondenzatorima.',
      en: 'The RC circuit, a current that leads the voltage, the negative reactive power of a capacitor and improving the power factor with capacitors.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'usmerivac',
    cls: 'elektronika',
    date: '2026-10-09',
    minutes: 20,
    quiz: 'ELE01',
    title: { sr: 'Usmerivač', en: 'Rectifier' },
    summary: {
      sr: 'Dioda, poluperiodni usmerivač, kondenzator kao filtar i šta je talasanje napona.',
      en: 'The diode, the half-wave rectifier, a capacitor as a filter and what ripple is.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'grecov-usmerivac',
    cls: 'elektronika',
    date: '2026-10-09',
    minutes: 20,
    quiz: 'ELE02',
    title: { sr: 'Grecov usmerivač', en: 'Graetz bridge rectifier' },
    summary: {
      sr: 'Četiri diode, obe poluperiode i ceo lanac napajanja, od transformatora do regulatora.',
      en: 'Four diodes, both half-cycles and the whole power-supply chain, from transformer to regulator.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'bipolarni-tranzistori',
    cls: 'elektronika',
    date: '2026-11-23',
    minutes: 24,
    quiz: 'ELE03',
    title: { sr: 'Bipolarni tranzistori', en: 'Bipolar transistors' },
    summary: {
      sr: 'Građa NPN i PNP tranzistora, struje i pojačanje β, četiri režima rada, ulazne i izlazne karakteristike i radna prava.',
      en: 'The structure of NPN and PNP transistors, currents and the gain β, the four operating modes, input and output characteristics and the load line.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'ekvivalentna-sema-aktivni-rezim',
    cls: 'elektronika',
    date: '2026-11-23',
    minutes: 22,
    quiz: 'ELE04',
    title: { sr: 'Ekvivalentna šema bipolarnog tranzistora u aktivnom režimu rada', en: 'Equivalent circuit of a bipolar transistor in the active mode' },
    summary: {
      sr: 'Jednosmerni model sa U_BE ≈ 0,7 V i strujnim izvorom βI_B, model za male signale sa g_m, r_π i r_o, i h-parametri.',
      en: 'The DC model with U_BE ≈ 0.7 V and a current source βI_B, the small-signal model with g_m, r_π and r_o, and the h-parameters.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'ekvivalentna-sema-rezim-zasicenja',
    cls: 'elektronika',
    date: '2026-11-23',
    minutes: 18,
    quiz: 'ELE05',
    title: { sr: 'Ekvivalentna šema bipolarnog tranzistora u režimu zasićenja', en: 'Equivalent circuit of a bipolar transistor in saturation' },
    summary: {
      sr: 'Uslov zasićenja βI_B > I_C, model sa dva naponska izvora U_BEsat i U_CEsat, faktor prezasićenja i tranzistor kao prekidač.',
      en: 'The saturation condition βI_B > I_C, the model with two voltage sources U_BEsat and U_CEsat, the overdrive factor and the transistor as a switch.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'fazori',
    cls: 'naizmenicna',
    date: '2026-10-24',
    minutes: 18,
    quiz: 'AC01',
    title: { sr: 'Predstavljanje naizmeničnih veličina pomoću fazora', en: 'Representing alternating quantities with phasors' },
    summary: {
      sr: 'Obrtna strelica umesto sinusa: fazor, fazna razlika i sabiranje naizmeničnih napona.',
      en: 'A rotating arrow instead of a sine: the phasor, the phase difference and adding alternating voltages.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'kompleksni-brojevi',
    cls: 'naizmenicna',
    date: '2026-10-24',
    minutes: 20,
    quiz: 'AC02',
    title: { sr: 'Predstavljanje naizmenične veličine kompleksnim brojevima', en: 'Representing an alternating quantity with complex numbers' },
    summary: {
      sr: 'Imaginarna jedinica j, algebarski i polarni oblik, Ojlerova formula i računanje sa fazorima.',
      en: 'The imaginary unit j, rectangular and polar form, Euler\'s formula and calculating with phasors.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'elementi-naizmenicne-struje',
    cls: 'naizmenicna',
    date: '2026-10-24',
    minutes: 20,
    quiz: 'AC03',
    title: { sr: 'Elementi naizmenične struje', en: 'Elements of alternating current' },
    summary: {
      sr: 'Perioda, učestanost, kružna učestanost, amplituda, efektivna i srednja vrednost i početna faza.',
      en: 'Period, frequency, angular frequency, amplitude, RMS and average value and the initial phase.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'otpornik-u-kolu-naizmenicne-struje',
    cls: 'naizmenicna',
    date: '2026-10-24',
    minutes: 16,
    quiz: 'AC04',
    title: { sr: 'Otpornik u kolu naizmenične struje', en: 'A resistor in an AC circuit' },
    summary: {
      sr: 'Napon i struja su u fazi, Omov zakon važi i za trenutne vrednosti, a snaga je uvek pozitivna.',
      en: 'Voltage and current are in phase, Ohm\'s law holds for instantaneous values, and the power is never negative.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'kalem-u-kolu-naizmenicne-struje',
    cls: 'naizmenicna',
    date: '2026-10-24',
    minutes: 20,
    quiz: 'AC05',
    title: { sr: 'Kalem u kolu naizmenične struje', en: 'A coil in an AC circuit' },
    summary: {
      sr: 'Induktivna reaktansa X_L = ωL, struja kasni za naponom 90° i kalem ne troši snagu.',
      en: 'Inductive reactance X_L = ωL, the current lags the voltage by 90°, and the coil uses no power.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'kondenzator-u-kolu-struje',
    cls: 'naizmenicna',
    date: '2026-10-24',
    minutes: 22,
    quiz: 'AC06',
    title: { sr: 'Kondenzator u kolu jednosmerne i naizmenične struje', en: 'A capacitor in DC and AC circuits' },
    summary: {
      sr: 'Punjenje i pražnjenje preko otpornika, vremenska konstanta, kapacitivna reaktansa X_C = 1/ωC i struja koja prednjači naponu.',
      en: 'Charging and discharging through a resistor, the time constant, capacitive reactance X_C = 1/ωC and a current that leads the voltage.'
    },
    tags: ['animation', 'formulas']
  },
  {
    slug: 'vrste-kucista',
    cls: 'racunari',
    date: '2026-10-24',
    minutes: 16,
    quiz: 'PC01',
    title: { sr: 'Vrste kućišta', en: 'Types of computer cases' },
    summary: {
      sr: 'Tower, desktop, mini-ITX i form faktori: šta kućište mora da primi, kako se hladi i kako se bira.',
      en: 'Tower, desktop, mini-ITX and form factors: what a case has to hold, how it is cooled and how to choose one.'
    },
    tags: ['3d']
  },
  {
    slug: 'napajanje',
    cls: 'racunari',
    date: '2026-10-24',
    minutes: 18,
    quiz: 'PC02',
    title: { sr: 'Napajanje', en: 'Power supply unit' },
    summary: {
      sr: 'ATX napajanje, kablovi i konektori, izbor snage i efikasnosti, 80 PLUS, zaštite i kako se bira.',
      en: 'The ATX power supply, cables and connectors, choosing capacity and efficiency, 80 PLUS, protections and how to choose one.'
    },
    tags: ['3d', 'formulas']
  },
  {
    slug: 'delovi-maticne-ploce',
    cls: 'racunari',
    date: '2026-10-24',
    minutes: 20,
    quiz: 'PC03',
    title: { sr: 'Delovi matične ploče i njihove uloge', en: 'Parts of the motherboard and their roles' },
    summary: {
      sr: 'Obiđi matičnu ploču u 3D: procesorsko podnožje, RAM, PCIe, čipset, VRM, konektori i portovi.',
      en: 'Tour the motherboard in 3D: CPU socket, RAM, PCIe, chipset, VRM, connectors and ports.'
    },
    tags: ['3d']
  },
  {
    slug: 'maticna-ploca',
    cls: 'racunari',
    date: '2026-10-24',
    minutes: 26,
    quiz: 'PC04',
    title: { sr: 'Matična ploča u fokusu', en: 'The motherboard in focus' },
    summary: {
      sr: 'Detaljan opis matične ploče: magistrale, čipset, VRM, BIOS/UEFI, form faktori i kako se bira.',
      en: 'A detailed description of the motherboard: buses, chipset, VRM, BIOS/UEFI, form factors and how to choose one.'
    },
    tags: ['3d']
  },
  {
    slug: 'ugradnja-maticne-ploce',
    cls: 'racunari',
    date: '2026-10-24',
    minutes: 18,
    quiz: 'PC05',
    title: { sr: 'Ugradnja matične ploče u kućište', en: 'Installing the motherboard in the case' },
    summary: {
      sr: 'Korak po koraku: odstojnici, I/O štitnik, postavljanje ploče, zavrtnji i priključivanje kablova.',
      en: 'Step by step: standoffs, the I/O shield, seating the board, screws and connecting the cables.'
    },
    tags: ['3d']
  },
  {
    slug: 'memorija',
    cls: 'racunari',
    date: '2026-10-24',
    minutes: 22,
    quiz: 'PC06',
    title: { sr: 'Unutrašnja i spoljna memorija', en: 'Internal and external memory' },
    summary: {
      sr: 'Registri, keš, RAM i ROM, pa HDD, SSD, optički i prenosivi mediji, uz poređenje brzine i kapaciteta.',
      en: 'Registers, cache, RAM and ROM, then HDD, SSD, optical and portable media, with a comparison of speed and capacity.'
    },
    tags: ['formulas']
  },
  {
    slug: 'ugradnja-diska-i-optickih-uredjaja',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 22,
    quiz: 'PC07',
    title: { sr: 'Ugradnja tvrdog diska i optičkih uređaja', en: 'Installing hard disks and optical drives' },
    summary: {
      sr: 'Ležišta od 5,25″, 3,5″ i 2,5″, M.2, SATA kablovi, CD, DVD i Blu-ray, pa BIOS, particije i formatiranje.',
      en: '5.25″, 3.5″ and 2.5″ bays, M.2, SATA cables, CD, DVD and Blu-ray, then the BIOS, partitions and formatting.'
    },
    tags: ['animation']
  },
  {
    slug: 'graficka-kartica',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 22,
    quiz: 'PC08',
    title: { sr: 'Grafička kartica', en: 'The graphics card' },
    summary: {
      sr: 'Integrisana i diskretna grafika, delovi kartice, zašto je GPU brz, VRAM i rezolucija, ugradnja i izbor.',
      en: 'Integrated and dedicated graphics, the parts of a card, why a GPU is fast, VRAM and resolution, installing and choosing one.'
    },
    tags: ['animation']
  },
  {
    slug: 'ulazne-jedinice',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 20,
    quiz: 'PC09',
    title: { sr: 'Ulazne jedinice', en: 'Input devices' },
    summary: {
      sr: 'Tastatura i matrica tastera, miš i DPI, ekran na dodir, skener, kamera, mikrofon i posebni ulazni uređaji.',
      en: 'The keyboard and its key matrix, the mouse and DPI, touch screens, scanners, cameras, microphones and special input devices.'
    },
    tags: ['animation']
  },
  {
    slug: 'povezivanje-ulaznih-jedinica',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 20,
    quiz: 'PC10',
    title: { sr: 'Povezivanje ulaznih jedinica sa računarom', en: 'Connecting input devices to the computer' },
    summary: {
      sr: 'USB i njegove verzije, PS/2, Bluetooth i bežični prijemnici, audio priključci, prozivanje i drajveri.',
      en: 'USB and its versions, PS/2, Bluetooth and wireless receivers, audio jacks, polling and drivers.'
    },
    tags: ['animation']
  },
  {
    slug: 'izlazne-jedinice',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 22,
    quiz: 'PC11',
    title: { sr: 'Izlazne jedinice', en: 'Output devices' },
    summary: {
      sr: 'Monitori, pikseli i RGB, LCD i OLED, gustina piksela, projektori, štampači i CMYK, zvučnici i slušalice.',
      en: 'Monitors, pixels and RGB, LCD and OLED, pixel density, projectors, printers and CMYK, speakers and headphones.'
    },
    tags: ['animation']
  },
  {
    slug: 'povezivanje-izlaznih-jedinica',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 22,
    quiz: 'PC12',
    title: { sr: 'Povezivanje izlaznih jedinica sa računarom', en: 'Connecting output devices to the computer' },
    summary: {
      sr: 'VGA, DVI, HDMI, DisplayPort i USB-C, propusni opseg, više monitora, adapteri, štampači u mreži i zvuk.',
      en: 'VGA, DVI, HDMI, DisplayPort and USB-C, bandwidth, several monitors, adapters, network printers and sound.'
    },
    tags: ['animation']
  },
  {
    slug: 'kvarovi-kod-racunara',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 24,
    quiz: 'PC13',
    title: { sr: 'Kvarovi kod računara (karakteristike i manifestacija)', en: 'Computer faults (features and symptoms)' },
    summary: {
      sr: 'Vrste kvarova, POST i zvučni signali, simptomi po komponentama, pregrevanje i postupak traženja kvara.',
      en: 'Kinds of faults, POST and beep codes, symptoms part by part, overheating and how to look for a fault.'
    },
    tags: ['animation']
  },
  {
    slug: 'zamena-neispravnih-komponenti',
    cls: 'racunari',
    date: '2026-11-24',
    minutes: 22,
    quiz: 'PC14',
    title: { sr: 'Zamena neispravnih komponenti', en: 'Replacing faulty components' },
    summary: {
      sr: 'Priprema i kompatibilnost, opšti postupak, zamena RAM-a, diska, napajanja, grafičke i termalne paste, provera i reciklaža.',
      en: 'Preparation and compatibility, the general procedure, replacing RAM, a drive, the PSU, the graphics card and thermal paste, testing and recycling.'
    },
    tags: ['animation']
  },
  {
    slug: 'podaci-sql-firebase',
    cls: 'podaci',
    date: '2026-10-30',
    minutes: 24,
    quiz: 'DB01',
    title: { sr: 'Podaci, SQL i Firebase', en: 'Data, SQL and Firebase' },
    summary: {
      sr: 'Šta su podaci i baze, tabele i ključevi, osnovni SQL (SELECT, WHERE, INSERT, UPDATE, DELETE, JOIN) i Firebase Realtime Database kao servis.',
      en: 'What data and databases are, tables and keys, basic SQL (SELECT, WHERE, INSERT, UPDATE, DELETE, JOIN) and Firebase Realtime Database as a service.'
    },
    tags: []
  }
];
