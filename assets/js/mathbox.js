(function () {
'use strict';

var L = window.LAV;
var BASE = L.base;

var CATS = [
  ['all', 'Sve', 'All'],
  ['basic', 'Osnovno', 'Basics'],
  ['trig', 'Trigonometrija', 'Trigonometry'],
  ['log', 'Logaritmi', 'Logarithms'],
  ['calc', 'Analiza', 'Calculus'],
  ['greek', 'Grčka slova', 'Greek'],
  ['rel', 'Relacije i skupovi', 'Relations & sets'],
  ['vec', 'Vektori i matrice', 'Vectors & matrices'],
  ['phys', 'Fizika i jedinice', 'Physics & units']
];

var ITEMS = [];
function E(cat, cmd, tex, prev, sr, en, kw) {
  ITEMS.push({ cat: cat, cmd: cmd, tex: tex, prev: prev, sr: sr, en: en, kw: (cmd + ' ' + sr + ' ' + en + ' ' + (kw || '')).toLowerCase() });
}

E('basic', 'frac', '\\frac{#@}{#?}', '\\frac{a}{b}', 'Razlomak', 'Fraction', 'deljenje razlomak fraction divide slash');
E('basic', 'pow', '#@^{#?}', 'x^{n}', 'Stepen', 'Power', 'stepen eksponent power exponent superscript pow');
E('basic', 'sq', '#@^{2}', 'x^{2}', 'Kvadrat', 'Square', 'kvadrat square na kvadrat');
E('basic', 'cube', '#@^{3}', 'x^{3}', 'Kub', 'Cube', 'kub cube na kub');
E('basic', 'sub', '#@_{#?}', 'x_{n}', 'Indeks', 'Subscript', 'indeks donji subscript index');
E('basic', 'sqrt', '\\sqrt{#0}', '\\sqrt{x}', 'Kvadratni koren', 'Square root', 'koren root sqrt');
E('basic', 'nroot', '\\sqrt[#?]{#0}', '\\sqrt[n]{x}', 'n-ti koren', 'nth root', 'koren root kubni cube root');
E('basic', 'abs', '\\left|#0\\right|', '|x|', 'Apsolutna vrednost', 'Absolute value', 'abs modul');
E('basic', 'paren', '\\left(#0\\right)', '(x)', 'Zagrade', 'Parentheses', 'zagrada paren okrugle bracket');
E('basic', 'brack', '\\left[#0\\right]', '[x]', 'Srednje zagrade', 'Square brackets', 'zagrada uglaste bracket');
E('basic', 'curly', '\\left\\{#0\\right\\}', '\\{x\\}', 'Vitičaste zagrade', 'Curly braces', 'zagrada viticaste braces set');
E('basic', 'times', '\\times', 'a\\times b', 'Množenje ×', 'Multiply ×', 'puta mnozenje times cross');
E('basic', 'cdot', '\\cdot', 'a\\cdot b', 'Tačka ·', 'Dot ·', 'tacka mnozenje cdot dot');
E('basic', 'div', '\\div', 'a\\div b', 'Deljenje ÷', 'Divide ÷', 'deljenje div');
E('basic', 'pm', '\\pm', '\\pm', 'Plus-minus', 'Plus-minus', 'plus minus pm');
E('basic', 'mp', '\\mp', '\\mp', 'Minus-plus', 'Minus-plus', 'mp');
E('basic', 'infty', '\\infty', '\\infty', 'Beskonačno', 'Infinity', 'beskonacno infinity');
E('basic', 'circ', '^{\\circ}', '30^{\\circ}', 'Stepen (°)', 'Degree (°)', 'ugao stepeni degree angle');
E('basic', 'pow10', '\\cdot 10^{#?}', '\\cdot 10^{n}', 'Puta deset na', 'Times ten to the', 'naucni zapis scientific notation e');
E('basic', 'percent', '\\%', '\\%', 'Procenat', 'Percent', 'procenat percent');
E('basic', 'fact', '!', 'n!', 'Faktorijel', 'Factorial', 'faktorijel factorial');
E('basic', 'binom', '\\binom{#?}{#?}', '\\binom{n}{k}', 'Binomni koeficijent', 'Binomial', 'binomni binomial kombinacije');
E('basic', 'ldots', '\\ldots', 'a,\\ldots,z', 'Tri tačke', 'Dots', 'tri tacke dots ellipsis');
E('basic', 'text', '\\text{#?}', '\\text{tekst}', 'Tekst', 'Text', 'tekst text reci');

[['sin', 'Sinus', 'Sine', 'sin'], ['cos', 'Kosinus', 'Cosine', 'cos'], ['tan', 'Tangens (tg)', 'Tangent (tg)', 'tg tan'], ['cot', 'Kotangens (ctg)', 'Cotangent (ctg)', 'ctg cot'], ['sec', 'Sekans', 'Secant', 'sec'], ['csc', 'Kosekans', 'Cosecant', 'csc cosec']].forEach(function (t) {
  E('trig', t[0], '\\' + t[0], '\\' + t[0] + '\\theta', t[1], t[2], t[3] + ' trig');
});
E('trig', 'sin2', '\\sin^{2}', '\\sin^{2}\\alpha', 'Sinus na kvadrat', 'Sine squared', 'sin kvadrat squared');
E('trig', 'cos2', '\\cos^{2}', '\\cos^{2}\\alpha', 'Kosinus na kvadrat', 'Cosine squared', 'cos kvadrat squared');
[['arcsin', 'Arkus sinus', 'Inverse sine', 'asin'], ['arccos', 'Arkus kosinus', 'Inverse cosine', 'acos'], ['arctan', 'Arkus tangens', 'Inverse tangent', 'arctg atan'], ['sinh', 'Hiperbolični sinus', 'Hyperbolic sine', 'sinh'], ['cosh', 'Hiperbolični kosinus', 'Hyperbolic cosine', 'cosh'], ['tanh', 'Hiperbolični tangens', 'Hyperbolic tangent', 'tanh']].forEach(function (t) {
  E('trig', t[0], '\\' + t[0], '\\' + t[0] + '\\,x', t[1], t[2], t[3]);
});

E('log', 'log', '\\log', '\\log x', 'Logaritam', 'Logarithm', 'log logaritam');
E('log', 'ln', '\\ln', '\\ln x', 'Prirodni logaritam', 'Natural logarithm', 'ln prirodni natural');
E('log', 'lg', '\\lg', '\\lg x', 'Dekadni logaritam', 'Common logarithm', 'lg dekadni base 10');
E('log', 'logb', '\\log_{#?}', '\\log_{a} x', 'Logaritam sa osnovom', 'Log with base', 'osnova base log_a');
E('log', 'expe', 'e^{#?}', 'e^{x}', 'e na x', 'e to the x', 'eksponent exp exponential euler');
E('log', 'exp10', '10^{#?}', '10^{x}', '10 na x', '10 to the x', 'deset ten exponent');
E('log', 'exp', '\\exp', '\\exp x', 'Eksponencijalna funkcija', 'Exponential function', 'exp');

E('calc', 'int', '\\int #?\\,\\mathrm{d}#?', '\\int f\\,\\mathrm{d}x', 'Neodređeni integral', 'Indefinite integral', 'integral int neodredjeni');
E('calc', 'defint', '\\int_{#?}^{#?} #?\\,\\mathrm{d}#?', '\\int_{a}^{b} f\\,\\mathrm{d}x', 'Određeni integral', 'Definite integral', 'integral int odredjeni granice limits');
E('calc', 'iint', '\\iint', '\\iint', 'Dvostruki integral', 'Double integral', 'integral iint dvostruki');
E('calc', 'iiint', '\\iiint', '\\iiint', 'Trostruki integral', 'Triple integral', 'integral iiint trostruki');
E('calc', 'oint', '\\oint', '\\oint', 'Konturni integral', 'Contour integral', 'integral oint kruzni closed');
E('calc', 'sum', '\\sum_{#?}^{#?}', '\\sum_{i=1}^{n}', 'Suma', 'Sum', 'suma sum sigma zbir');
E('calc', 'prod', '\\prod_{#?}^{#?}', '\\prod_{i=1}^{n}', 'Proizvod', 'Product', 'proizvod prod product');
E('calc', 'lim', '\\lim_{#?\\to #?}', '\\lim_{x\\to 0}', 'Limes', 'Limit', 'limes lim granicna vrednost');
E('calc', 'deriv', '\\frac{\\mathrm{d}#?}{\\mathrm{d}#?}', '\\frac{\\mathrm{d}y}{\\mathrm{d}x}', 'Izvod', 'Derivative', 'izvod derivacija derivative diferencijal');
E('calc', 'pderiv', '\\frac{\\partial #?}{\\partial #?}', '\\frac{\\partial f}{\\partial x}', 'Parcijalni izvod', 'Partial derivative', 'parcijalni partial');
E('calc', 'diff', '\\Delta #?', '\\Delta x', 'Promena Δ', 'Change Δ', 'delta promena razlika change');
E('calc', 'dd', '\\mathrm{d}', '\\mathrm{d}x', 'Diferencijal d', 'Differential d', 'diferencijal differential d');
E('calc', 'partial', '\\partial', '\\partial', 'Parcijalni ∂', 'Partial ∂', 'partial parcijalni');
E('calc', 'nabla', '\\nabla', '\\nabla', 'Nabla ∇', 'Nabla ∇', 'nabla gradijent del gradient');
E('calc', 'prime', '^{\\prime}', "f^{\\prime}", 'Prvi izvod (prim)', 'Prime', 'prim izvod prime');
E('calc', 'dot', '\\dot{#@}', '\\dot{x}', 'Izvod po vremenu', 'Time derivative', 'dot tacka izvod');
E('calc', 'evalbar', '\\left.#?\\right|_{#?}^{#?}', '\\left.F\\right|_{a}^{b}', 'Vrednost na granicama', 'Evaluate between limits', 'granice evaluate');

var GREEK = [
  ['alpha', 'alfa', 'alpha'], ['beta', 'beta', 'beta'], ['gamma', 'gama', 'gamma'], ['delta', 'delta', 'delta'],
  ['epsilon', 'epsilon', 'epsilon'], ['varepsilon', 'epsilon (varijanta)', 'epsilon (variant)'], ['zeta', 'zeta', 'zeta'], ['eta', 'eta', 'eta'],
  ['theta', 'teta', 'theta'], ['iota', 'jota', 'iota'], ['kappa', 'kapa', 'kappa'], ['lambda', 'lambda', 'lambda'],
  ['mu', 'mi', 'mu'], ['nu', 'ni', 'nu'], ['xi', 'ksi', 'xi'], ['pi', 'pi', 'pi'], ['rho', 'ro', 'rho'],
  ['sigma', 'sigma', 'sigma'], ['tau', 'tau', 'tau'], ['upsilon', 'ipsilon', 'upsilon'], ['phi', 'fi', 'phi'],
  ['varphi', 'fi (varijanta)', 'phi (variant)'], ['chi', 'hi', 'chi'], ['psi', 'psi', 'psi'], ['omega', 'omega', 'omega']
];
GREEK.forEach(function (g) { E('greek', g[0], '\\' + g[0], '\\' + g[0], g[1], g[2], 'grcko slovo greek letter'); });
[['Gamma', 'Gama (veliko)', 'Gamma (capital)'], ['Delta', 'Delta (veliko)', 'Delta (capital)'], ['Theta', 'Teta (veliko)', 'Theta (capital)'], ['Lambda', 'Lambda (veliko)', 'Lambda (capital)'],
  ['Xi', 'Ksi (veliko)', 'Xi (capital)'], ['Pi', 'Pi (veliko)', 'Pi (capital)'], ['Sigma', 'Sigma (veliko)', 'Sigma (capital)'], ['Phi', 'Fi (veliko)', 'Phi (capital)'],
  ['Psi', 'Psi (veliko)', 'Psi (capital)'], ['Omega', 'Omega (veliko) Ω', 'Omega (capital) Ω']].forEach(function (g) {
  E('greek', g[0], '\\' + g[0], '\\' + g[0], g[1], g[2], 'grcko slovo veliko greek capital letter');
});

[['leq', '\\leq', 'Manje ili jednako', 'Less or equal', '<= manje'], ['geq', '\\geq', 'Veće ili jednako', 'Greater or equal', '>= vece'],
  ['neq', '\\neq', 'Nije jednako', 'Not equal', '!= razlicito'], ['approx', '\\approx', 'Približno jednako', 'Approximately equal', 'priblizno'],
  ['equiv', '\\equiv', 'Identično', 'Identical', 'identicno'], ['propto', '\\propto', 'Proporcionalno', 'Proportional to', 'proporcionalno'],
  ['sim', '\\sim', 'Slično ~', 'Similar ~', 'slicno tilda'], ['ll', '\\ll', 'Mnogo manje', 'Much less', 'mnogo manje'], ['gg', '\\gg', 'Mnogo veće', 'Much greater', 'mnogo vece'],
  ['to', '\\to', 'Strelica →', 'Arrow →', 'strelica arrow tezi'], ['Rightarrow', '\\Rightarrow', 'Implikacija ⇒', 'Implies ⇒', 'implikacija sledi'],
  ['Leftrightarrow', '\\Leftrightarrow', 'Ekvivalencija ⇔', 'If and only if ⇔', 'ekvivalencija akko'],
  ['in', '\\in', 'Element skupa ∈', 'Element of ∈', 'element pripada'], ['notin', '\\notin', 'Nije element ∉', 'Not an element ∉', 'nije element'],
  ['subset', '\\subset', 'Podskup ⊂', 'Subset ⊂', 'podskup'], ['cup', '\\cup', 'Unija ∪', 'Union ∪', 'unija'], ['cap', '\\cap', 'Presek ∩', 'Intersection ∩', 'presek'],
  ['forall', '\\forall', 'Za svako ∀', 'For all ∀', 'za svako'], ['exists', '\\exists', 'Postoji ∃', 'There exists ∃', 'postoji'],
  ['parallel', '\\parallel', 'Paralelno ∥', 'Parallel ∥', 'paralelno'], ['perp', '\\perp', 'Normalno ⊥', 'Perpendicular ⊥', 'normalno upravno'],
  ['angle', '\\angle', 'Ugao ∠', 'Angle ∠', 'ugao'], ['therefore', '\\therefore', 'Dakle ∴', 'Therefore ∴', 'dakle'],
  ['emptyset', '\\emptyset', 'Prazan skup ∅', 'Empty set ∅', 'prazan skup'], ['R', '\\mathbb{R}', 'Realni brojevi ℝ', 'Real numbers ℝ', 'realni brojevi'],
  ['N', '\\mathbb{N}', 'Prirodni brojevi ℕ', 'Natural numbers ℕ', 'prirodni brojevi'], ['Z', '\\mathbb{Z}', 'Celi brojevi ℤ', 'Integers ℤ', 'celi brojevi'],
  ['Q', '\\mathbb{Q}', 'Racionalni brojevi ℚ', 'Rationals ℚ', 'racionalni brojevi'], ['C', '\\mathbb{C}', 'Kompleksni brojevi ℂ', 'Complex numbers ℂ', 'kompleksni brojevi']
].forEach(function (r) { E('rel', r[0], r[1], r[1], r[2], r[3], r[4]); });

E('vec', 'vec', '\\vec{#@}', '\\vec{F}', 'Vektor', 'Vector', 'vektor vector strelica');
E('vec', 'hat', '\\hat{#@}', '\\hat{n}', 'Jedinični vektor', 'Unit vector', 'jedinicni hat versor');
E('vec', 'overline', '\\overline{#@}', '\\overline{AB}', 'Crta iznad', 'Overline', 'crta overline bar duz');
E('vec', 'overrightarrow', '\\overrightarrow{#@}', '\\overrightarrow{AB}', 'Vektor AB', 'Vector AB', 'vektor strelica');
E('vec', 'mathbf', '\\mathbf{#@}', '\\mathbf{B}', 'Podebljano slovo', 'Bold letter', 'bold podebljano');
E('vec', 'norm', '\\left\\|#0\\right\\|', '\\|v\\|', 'Intenzitet (norma)', 'Magnitude (norm)', 'norma intenzitet modul');
E('vec', 'pmatrix', '\\begin{pmatrix}#?&#?\\\\#?&#?\\end{pmatrix}', '\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}', 'Matrica 2×2', 'Matrix 2×2', 'matrica matrix');
E('vec', 'column', '\\begin{pmatrix}#?\\\\#?\\\\#?\\end{pmatrix}', '\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}', 'Vektor kolona', 'Column vector', 'kolona vektor column');
E('vec', 'vmatrix', '\\begin{vmatrix}#?&#?\\\\#?&#?\\end{vmatrix}', '\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}', 'Determinanta', 'Determinant', 'determinanta determinant');
E('vec', 'cases', '\\begin{cases}#?&#?\\\\#?&#?\\end{cases}', '\\begin{cases}a&x\\ge 0\\\\b&x<0\\end{cases}', 'Sistem / po delovima', 'Piecewise / system', 'sistem cases po delovima');
E('vec', 'cross', '\\times', '\\vec a\\times\\vec b', 'Vektorski proizvod ×', 'Cross product ×', 'vektorski proizvod cross');
E('vec', 'dotp', '\\cdot', '\\vec a\\cdot\\vec b', 'Skalarni proizvod ·', 'Dot product ·', 'skalarni proizvod dot');

E('phys', 'mu0', '\\mu_{0}', '\\mu_{0}', 'Permeabilnost vakuuma μ₀', 'Permeability of free space μ₀', 'mi nula permeabilnost mu0');
E('phys', 'eps0', '\\varepsilon_{0}', '\\varepsilon_{0}', 'Permitivnost vakuuma ε₀', 'Permittivity of free space ε₀', 'epsilon nula permitivnost');
E('phys', 'ohm', '\\Omega', '\\Omega', 'Om Ω', 'Ohm Ω', 'om ohm otpor resistance');
E('phys', 'omegat', '\\omega t', '\\omega t', 'Kružna učestanost × t', 'Angular frequency × t', 'omega t ugaona ucestanost');
E('phys', 'ef', '#@_{\\mathrm{ef}}', 'U_{\\mathrm{ef}}', 'Indeks ef (efektivno)', 'Subscript ef (RMS)', 'efektivna rms ef');
E('phys', 'idxm', '#@_{\\mathrm{m}}', 'U_{\\mathrm{m}}', 'Indeks m (maksimalno)', 'Subscript m (peak)', 'maksimalna amplituda peak max');
E('phys', 'idx0', '#@_{0}', 'x_{0}', 'Indeks 0', 'Subscript 0', 'indeks nula');
E('phys', 'idx1', '#@_{1}', 'x_{1}', 'Indeks 1', 'Subscript 1', 'indeks jedan');
E('phys', 'idx2', '#@_{2}', 'x_{2}', 'Indeks 2', 'Subscript 2', 'indeks dva');
E('phys', 'unit', '\\,\\mathrm{#?}', '\\mathrm{unit}', 'Jedinica (uspravno)', 'Unit (upright)', 'jedinica unit mathrm');
[['V', 'volt', 'volt', 'V napon voltage'], ['A', 'amper', 'ampere', 'A struja current'], ['N', 'njutn', 'newton', 'N sila force'], ['T', 'tesla', 'tesla', 'T indukcija'],
  ['Wb', 'veber', 'weber', 'Wb fluks flux'], ['Hz', 'herc', 'hertz', 'Hz ucestanost frequency'], ['W', 'vat', 'watt', 'W snaga power'], ['J', 'džul', 'joule', 'J dzul energija energy'],
  ['F', 'farad', 'farad', 'F kapacitivnost capacitance'], ['H', 'henri', 'henry', 'H induktivnost inductance'], ['m', 'metar', 'metre', 'm duzina length'], ['s', 'sekunda', 'second', 's vreme time'],
  ['k\\Omega', 'kiloom', 'kilohm', 'kilo om kohm'], ['m\\mathrm{A}', 'miliamper', 'milliampere', 'mA'], ['m\\mathrm{V}', 'milivolt', 'millivolt', 'mV']].forEach(function (u) {
  E('phys', 'u_' + u[0].replace(/[^A-Za-z]/g, ''), '\\,\\mathrm{' + u[0] + '}', '\\mathrm{' + u[0] + '}', 'Jedinica: ' + u[1], 'Unit: ' + u[2], 'jedinica unit ' + u[3]);
});

var previewCache = {};
function preview(item) {
  if (previewCache[item.cmd + item.tex]) return previewCache[item.cmd + item.tex];
  var html = item.prev;
  if (window.katex) {
    try { html = window.katex.renderToString(item.prev, { throwOnError: false, strict: false }); } catch (e) { html = L.esc(item.prev); }
  } else html = L.esc(item.prev);
  previewCache[item.cmd + item.tex] = html;
  return html;
}

var KATEX_MACROS = { '\\mleft': '\\left', '\\mright': '\\right', '\\differentialD': '\\mathrm{d}', '\\exponentialE': '\\mathrm{e}', '\\imaginaryI': '\\mathrm{i}', '\\operatorname*': '\\operatorname' };
function cleanLatex(s) {
  return String(s || '').replace(/\\placeholder(\[[^\]]*\])?\{[^{}]*\}/g, '').replace(/\\mleft/g, '\\left').replace(/\\mright/g, '\\right');
}
function renderTo(el, latex, display) {
  latex = cleanLatex(latex);
  if (!latex.trim()) { el.textContent = ''; return; }
  if (!window.katex) { el.textContent = latex; return; }
  try {
    window.katex.render(latex, el, { throwOnError: false, displayMode: !!display, macros: KATEX_MACROS, strict: false });
  } catch (e) { el.textContent = latex; }
}

var katexLoading = null;
function needKatex() {
  if (window.katex) return Promise.resolve();
  if (!katexLoading) {
    katexLoading = new Promise(function (res) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = BASE + 'assets/vendor/katex/katex.min.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = BASE + 'assets/vendor/katex/katex.min.js';
      s.onload = res;
      s.onerror = res;
      document.head.appendChild(s);
    });
  }
  return katexLoading;
}

var mlPromise = null;
function needMathlive() {
  if (!mlPromise) {
    mlPromise = import(BASE + 'assets/vendor/mathlive/mathlive.min.mjs').then(function (mod) {
      var M = mod.MathfieldElement || window.MathfieldElement;
      M.fontsDirectory = BASE + 'assets/vendor/mathlive/fonts';
      M.soundsDirectory = null;
      M.plonkSound = null;
      M.keypressSound = null;
      return M;
    }).catch(function (e) { console.error(e); return null; });
  }
  return mlPromise;
}

var menu = null;
function ensureMenu() {
  if (menu) return menu;
  var el = document.createElement('div');
  el.className = 'mmenu';
  el.setAttribute('role', 'listbox');
  el.hidden = true;
  el.innerHTML =
    '<div class="mmenu-q"><b>\\</b><span class="q"></span><span class="ph"></span></div>' +
    '<div class="mmenu-tabs"></div><div class="mmenu-list"></div>';
  document.body.appendChild(el);
  menu = {
    el: el, open: false, q: '', tab: 'all', sel: 0, items: [], target: null,
    qEl: el.querySelector('.q'), phEl: el.querySelector('.ph'), tabsEl: el.querySelector('.mmenu-tabs'), listEl: el.querySelector('.mmenu-list')
  };
  CATS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-cat', c[0]);
    b.innerHTML = L.both(c[1], c[2]);
    menu.tabsEl.appendChild(b);
  });
  el.addEventListener('pointerdown', function (e) { if (!e.target.closest('.mmenu-tabs, .mmenu-list')) e.preventDefault(); else if (e.target.closest('button')) e.preventDefault(); });
  menu.tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    menu.tab = b.getAttribute('data-cat');
    menu.q = '';
    menu.sel = 0;
    refresh();
    if (menu.target) menu.target.focus();
  });
  menu.listEl.addEventListener('click', function (e) {
    var b = e.target.closest('.mmenu-item');
    if (!b) return;
    pick(menu.items[+b.getAttribute('data-i')]);
  });
  menu.listEl.addEventListener('pointermove', function (e) {
    var b = e.target.closest('.mmenu-item');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    if (i !== menu.sel) { menu.sel = i; markSel(false); }
  });
  document.addEventListener('keydown', onKey, true);
  document.addEventListener('pointerdown', function (e) {
    if (menu.open && !menu.el.contains(e.target) && !(menu.target && menu.target.anchor.contains(e.target)) && !e.target.closest('[data-mmenu-btn]')) closeMenu();
  }, true);
  window.addEventListener('resize', function () { if (menu.open) place(); });
  window.addEventListener('scroll', function () { if (menu.open) place(); }, true);
  L.onLang(function () { if (menu.open) refresh(); });
  return menu;
}

function filtered() {
  var q = menu.q.trim().toLowerCase();
  var lang = L.lang();
  if (!q) return ITEMS.filter(function (it) { return menu.tab === 'all' || it.cat === menu.tab; });
  var scored = [];
  ITEMS.forEach(function (it) {
    var s = -1;
    if (it.cmd.toLowerCase() === q) s = 0;
    else if (it.cmd.toLowerCase().indexOf(q) === 0) s = 1;
    else if ((lang === 'sr' ? it.sr : it.en).toLowerCase().indexOf(q) === 0) s = 2;
    else if (it.kw.split(' ').some(function (w) { return w.indexOf(q) === 0; })) s = 3;
    else if (it.kw.indexOf(q) >= 0) s = 4;
    if (s >= 0) scored.push([s, it]);
  });
  scored.sort(function (a, b) { return a[0] - b[0]; });
  return scored.map(function (x) { return x[1]; });
}

function refresh() {
  var m = menu;
  m.items = filtered();
  if (m.sel >= m.items.length) m.sel = Math.max(0, m.items.length - 1);
  m.qEl.textContent = m.q;
  m.phEl.textContent = m.q ? '' : L.tr('piši za pretragu', 'type to search');
  m.tabsEl.querySelectorAll('button').forEach(function (b) {
    b.setAttribute('aria-pressed', (m.q ? 'all' : m.tab) === b.getAttribute('data-cat') ? 'true' : 'false');
  });
  var lang = L.lang();
  var html = '';
  m.items.forEach(function (it, i) {
    html += '<button type="button" class="mmenu-item' + (i === m.sel ? ' on' : '') + '" data-i="' + i + '" role="option"><span class="pv">' + preview(it) + '</span><span class="nm">' + L.esc(lang === 'sr' ? it.sr : it.en) + '<span class="cmd">\\' + L.esc(it.cmd) + '</span></span></button>';
  });
  if (!m.items.length) html = '<div class="mmenu-empty">' + L.tr('Nema rezultata. Enter ubacuje \\' + L.esc(m.q), 'No results. Enter inserts \\' + L.esc(m.q)) + '</div>';
  m.listEl.innerHTML = html;
  m.listEl.scrollTop = 0;
  place();
}
function markSel(scroll) {
  var m = menu;
  m.listEl.querySelectorAll('.mmenu-item').forEach(function (b) {
    var on = +b.getAttribute('data-i') === m.sel;
    b.classList.toggle('on', on);
    if (on && scroll) b.scrollIntoView({ block: 'nearest' });
  });
}
function place() {
  var m = menu;
  if (!m.target) return;
  var r = m.target.anchor.getBoundingClientRect();
  var vw = window.innerWidth, vh = window.innerHeight;
  var kb = 0;
  try {
    var vk = window.mathVirtualKeyboard;
    if (vk && vk.visible) kb = vh - vk.boundingRect.top;
  } catch (e) {}
  var w = Math.min(380, vw - 16);
  var left = Math.max(8, Math.min(r.left, vw - w - 8));
  var below = vh - kb - r.bottom - 8;
  var above = r.top - 8;
  var el = m.el;
  el.style.left = left + 'px';
  el.style.width = w + 'px';
  if (below >= 230 || below >= above) {
    el.style.top = (r.bottom + 6) + 'px';
    el.style.bottom = 'auto';
    el.style.maxHeight = Math.max(160, Math.min(420, below)) + 'px';
  } else {
    el.style.bottom = (vh - r.top + 6) + 'px';
    el.style.top = 'auto';
    el.style.maxHeight = Math.max(160, Math.min(420, above)) + 'px';
  }
}
function openMenu(target) {
  var m = ensureMenu();
  m.target = target;
  m.q = '';
  m.tab = 'all';
  m.sel = 0;
  m.open = true;
  m.el.hidden = false;
  refresh();
}
function closeMenu() {
  if (!menu || !menu.open) return;
  menu.open = false;
  menu.el.hidden = true;
}
function pick(item) {
  var t = menu.target;
  var q = menu.q;
  closeMenu();
  if (!t) return;
  if (item) t.insert(item.tex);
  else if (q) t.insert('\\' + q + ' ');
  t.focus();
}
function onKey(e) {
  if (!menu || !menu.open) return;
  var k = e.key;
  var m = menu;
  var cols = m.listEl.clientWidth > 300 ? 2 : 1;
  function eat() { e.preventDefault(); e.stopImmediatePropagation(); }
  if (k === 'Escape') { eat(); closeMenu(); if (m.target) m.target.focus(); return; }
  if (k === 'ArrowDown') { eat(); m.sel = Math.min(m.items.length - 1, m.sel + cols); markSel(true); return; }
  if (k === 'ArrowUp') { eat(); m.sel = Math.max(0, m.sel - cols); markSel(true); return; }
  if (k === 'ArrowRight') { eat(); m.sel = Math.min(m.items.length - 1, m.sel + 1); markSel(true); return; }
  if (k === 'ArrowLeft') { eat(); m.sel = Math.max(0, m.sel - 1); markSel(true); return; }
  if (k === 'Enter' || k === 'Tab') { eat(); pick(m.items[m.sel]); return; }
  if (k === 'Backspace') {
    eat();
    if (!m.q) { closeMenu(); return; }
    m.q = m.q.slice(0, -1);
    m.sel = 0;
    refresh();
    return;
  }
  if (k === ' ') {
    eat();
    if (m.q) pick(m.items[m.sel]); else closeMenu();
    return;
  }
  if (k === '\\') { eat(); return; }
  if (k.length === 1 && !e.metaKey && (!e.ctrlKey || e.altKey)) {
    eat();
    m.q += k;
    m.sel = 0;
    refresh();
    return;
  }
  if (k === 'Shift' || k === 'Alt' || k === 'AltGraph' || k === 'Control' || k === 'CapsLock' || k === 'Dead') return;
  closeMenu();
}

function insertIntoTextarea(ta, tex) {
  var first = -1;
  var out = '';
  var i = 0;
  while (i < tex.length) {
    if (tex.charAt(i) === '#' && '?@0'.indexOf(tex.charAt(i + 1)) >= 0 && i + 1 < tex.length) {
      if (first < 0) first = out.length;
      i += 2;
    } else { out += tex.charAt(i); i++; }
  }
  var s = ta.selectionStart, e = ta.selectionEnd;
  ta.value = ta.value.slice(0, s) + out + ta.value.slice(e);
  var pos = first >= 0 ? s + first : s + out.length;
  ta.focus();
  ta.setSelectionRange(pos, pos);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}

function hintHtml() {
  return L.both('Otkucaj <kbd>\\</kbd> za funkcije: razlomak, stepen, koren, sin, integral, grčka slova…', 'Type <kbd>\\</kbd> for functions: fraction, power, root, sin, integral, Greek letters…');
}

function create(host, opt) {
  opt = opt || {};
  var wrap = document.createElement('div');
  wrap.className = 'mbox';
  host.appendChild(wrap);
  var api = { el: wrap, get: function () { return ''; }, set: function () {}, focus: function () {}, onChange: opt.onChange || null };
  var bar = document.createElement('div');
  bar.className = 'mbox-bar';
  bar.innerHTML = '<button type="button" class="btn small" data-mmenu-btn><span style="font-family:var(--math);font-style:italic;font-size:1.1em">ƒ</span> ' + L.both('Funkcije', 'Functions') + '</button><span class="mbox-hint">' + hintHtml() + '</span>';
  var btn = bar.querySelector('button');
  function fire() { if (api.onChange) api.onChange(api.get()); }

  Promise.all([needKatex(), needMathlive()]).then(function (r) {
    var M = r[1];
    if (M && customElements.get('math-field')) {
      var mf = new M();
      mf.className = 'mf';
      mf.setAttribute('aria-label', L.tr('Polje za formulu', 'Formula box'));
      wrap.insertBefore(mf, wrap.firstChild);
      mf.mathVirtualKeyboardPolicy = 'manual';
      mf.smartFence = true;
      mf.menuItems = [];
      if (opt.value) mf.value = opt.value;
      var target = {
        anchor: mf,
        insert: function (tex) { mf.insert(tex, { format: 'latex', selectionMode: 'placeholder', focus: true }); },
        focus: function () { mf.focus(); }
      };
      mf.addEventListener('keydown', function (e) {
        if (e.key === '\\' && !e.metaKey) { e.preventDefault(); e.stopPropagation(); openMenu(target); }
      }, true);
      mf.addEventListener('beforeinput', function (e) {
        if (e.data === '\\') { e.preventDefault(); e.stopPropagation(); openMenu(target); }
      }, true);
      mf.addEventListener('input', fire);
      btn.addEventListener('click', function () {
        if (menu && menu.open) { closeMenu(); return; }
        mf.focus();
        openMenu(target);
      });
      api.get = function () { return cleanLatex(mf.getValue('latex')).trim(); };
      api.set = function (v) { mf.value = v || ''; };
      api.focus = function () { mf.focus(); };
      api.mf = mf;
    } else {
      var ta = document.createElement('textarea');
      ta.className = 'mbox-fallback';
      ta.rows = 2;
      ta.spellcheck = false;
      ta.setAttribute('aria-label', L.tr('Polje za formulu (LaTeX)', 'Formula box (LaTeX)'));
      if (opt.value) ta.value = opt.value;
      var pv = document.createElement('div');
      pv.className = 'mbox-prev';
      wrap.insertBefore(pv, wrap.firstChild);
      wrap.insertBefore(ta, wrap.firstChild);
      var upd = function () { renderTo(pv, ta.value, false); fire(); };
      ta.addEventListener('input', upd);
      var tt = {
        anchor: ta,
        insert: function (tex) { insertIntoTextarea(ta, tex); },
        focus: function () { ta.focus(); }
      };
      ta.addEventListener('keydown', function (e) {
        if (e.key === '\\') { e.preventDefault(); openMenu(tt); }
      }, true);
      btn.addEventListener('click', function () { if (menu && menu.open) closeMenu(); else { ta.focus(); openMenu(tt); } });
      api.get = function () { return ta.value.trim(); };
      api.set = function (v) { ta.value = v || ''; upd(); };
      api.focus = function () { ta.focus(); };
      upd();
    }
  });
  wrap.appendChild(bar);
  return api;
}

L.mathbox = { create: create, render: renderTo, clean: cleanLatex, needKatex: needKatex, close: closeMenu };
})();
