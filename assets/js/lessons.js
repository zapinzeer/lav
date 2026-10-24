window.LAV_CLASSES = {
  fizika: {
    sr: 'Fizika',
    en: 'Physics',
    color: 'copper',
    blurb: {
      sr: 'Magnetizam, sile, motori i indukcija.',
      en: 'Magnetism, forces, motors and induction.'
    }
  },
  osnove: {
    sr: 'Osnove elektronike · Vežbe',
    en: 'Fundamentals of Electronics · Labs',
    color: 'field',
    blurb: {
      sr: 'Laboratorijske vežbe: kako se meri instrumentima i osciloskopom.',
      en: 'Lab exercises: how to measure with meters and an oscilloscope.'
    }
  },
  elektronika: {
    sr: 'Elektronika',
    en: 'Electronics',
    color: 'violet',
    blurb: {
      sr: 'Diode i usmerivači: od naizmenične do jednosmerne struje.',
      en: 'Diodes and rectifiers: from alternating to direct current.'
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
      sr: 'Kućišta, napajanje, matična ploča sa 3D modelom, ugradnja i memorija.',
      en: 'Cases, power supplies, the motherboard with a 3D model, assembly and memory.'
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
      sr: 'ATX napajanje, kablovi i konektori, snaga i efikasnost, 80 PLUS, zaštite i kako se bira.',
      en: 'The ATX power supply, cables and connectors, power and efficiency, 80 PLUS, protections and how to choose one.'
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
  }
];
