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
  }
];
