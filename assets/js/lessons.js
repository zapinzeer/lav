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
      sr: 'Laboratorijske vežbe: merenja instrumentima i osciloskopom.',
      en: 'Lab exercises: measuring with meters and an oscilloscope.'
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
      sr: 'Šta je magnetno polje, kako ga crtamo linijama i kako se meri tesla.',
      en: 'What a magnetic field is, how field lines show it, and how the tesla is defined.'
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
      sr: 'Koliko polja prolazi kroz površinu i zašto zavisi od ugla.',
      en: 'How much field passes through a surface, and why the angle matters.'
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
      sr: 'Erstedov ogled, pravilo desne ruke i polje pravog provodnika i zavojka.',
      en: 'Ørsted\'s experiment, the right-hand rule, and the field of a wire and a loop.'
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
      sr: 'Kalem, gvozdeno jezgro i zašto je elektromagnet jači od običnog magneta.',
      en: 'A coil, an iron core, and why an electromagnet can beat an ordinary magnet.'
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
      sr: 'Sila na provodnik sa strujom u magnetnom polju i sila između dva provodnika.',
      en: 'The force on a current-carrying wire in a magnetic field, and between two wires.'
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
      sr: 'Kako navoj sa strujom u polju postaje obrtni moment i zašto je potreban komutator.',
      en: 'How a current loop in a field turns into torque, and why a commutator is needed.'
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
      sr: 'Promenljiv fluks stvara napon: Faradejevi ogledi, Lencovo pravilo i generator.',
      en: 'A changing flux creates a voltage: Faraday\'s experiments, Lenz\'s rule and the generator.'
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
      sr: 'Efektivna vrednost, veza ampermetra i voltmetra, klasa tačnosti i čitanje skale.',
      en: 'RMS value, connecting an ammeter and voltmeter, accuracy class and reading a scale.'
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
      sr: 'Komande osciloskopa, očitavanje amplitude, periode i faznog stava R, L i C.',
      en: 'Oscilloscope controls, reading amplitude, period and phase for R, L and C.'
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
      sr: 'Dioda, poluperiodni usmerivač, filtar sa kondenzatorom i talasanje napona.',
      en: 'The diode, the half-wave rectifier, a capacitor filter and ripple.'
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
      sr: 'Četiri diode, obe poluperiode i napajanje od transformatora do regulatora.',
      en: 'Four diodes, both half-cycles, and a power supply from transformer to regulator.'
    },
    tags: ['animation', 'formulas']
  }
];
