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

var RECENT_KEY = 'lav-mb-recent';
var BYKEY = {};
ITEMS.forEach(function (it) { it.key = it.cat + ':' + it.cmd; BYKEY[it.key] = it; });
var QUICK = ['basic:frac', 'basic:pow', 'basic:sub', 'basic:sqrt', 'basic:pow10', 'basic:cdot', 'basic:times', 'basic:pm', 'greek:pi', 'greek:omega', 'greek:Delta', 'trig:sin', 'trig:cos', 'trig:tan', 'basic:circ', 'phys:ohm'];

function recents() {
  try {
    var a = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return (Array.isArray(a) ? a : []).filter(function (k) { return BYKEY[k]; });
  } catch (e) { return []; }
}
function remember(it) {
  if (!it) return;
  var a = recents().filter(function (k) { return k !== it.key; });
  a.unshift(it.key);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(a.slice(0, 12))); } catch (e) {}
}
function itemName(it) { return L.lang() === 'sr' ? it.sr : it.en; }
function coarse() { try { return window.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }
function sheetMode() { try { return window.matchMedia('(max-width: 760px), (max-height: 500px), (pointer: coarse) and (max-width: 1100px)').matches; } catch (e) { return false; } }

var menu = null;
var uid = 0;
function ensureMenu() {
  if (menu) return menu;
  var id = 'mmenu' + (++uid);
  var back = document.createElement('div');
  back.className = 'mmenu-back';
  back.hidden = true;
  var el = document.createElement('div');
  el.className = 'mmenu';
  el.id = id;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', L.tr('Funkcije i simboli', 'Functions and symbols'));
  el.tabIndex = -1;
  el.hidden = true;
  el.innerHTML =
    '<div class="mmenu-grip" aria-hidden="true"></div>' +
    '<div class="mmenu-head">' +
      '<label class="mmenu-search"><span class="sr-only"></span>' +
        '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="M13.2 13.2 17 17"/></svg>' +
        '<input type="search" class="mmenu-in" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="' + id + '-list" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done">' +
      '</label>' +
      '<button type="button" class="mmenu-x"></button>' +
    '</div>' +
    '<div class="mmenu-tabs" role="tablist"></div>' +
    '<div class="mmenu-list" role="listbox" id="' + id + '-list"></div>' +
    '<div class="mmenu-foot" aria-hidden="true"></div>' +
    '<div class="sr-only" aria-live="polite" role="status"></div>';
  document.body.appendChild(back);
  document.body.appendChild(el);
  menu = {
    el: el, back: back, id: id, open: false, q: '', tab: 'all', sel: 0, items: [], target: null,
    inEl: el.querySelector('.mmenu-in'), lblEl: el.querySelector('.mmenu-search .sr-only'), xEl: el.querySelector('.mmenu-x'),
    tabsEl: el.querySelector('.mmenu-tabs'), listEl: el.querySelector('.mmenu-list'), footEl: el.querySelector('.mmenu-foot'), liveEl: el.querySelector('[role=status]')
  };
  menu.xEl.addEventListener('click', function () { closeMenu(true); });
  back.addEventListener('pointerdown', function (e) { e.preventDefault(); closeMenu(true); });
  menu.inEl.addEventListener('input', function () {
    if (menu.inEl.value.indexOf('/') >= 0) { closeMenu(true); return; }
    menu.q = menu.inEl.value.replace(/^\\+/, '');
    menu.sel = 0;
    refresh(true);
  });
  menu.tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[role=tab]');
    if (!b) return;
    setTab(b.getAttribute('data-cat'));
    b.focus();
  });
  menu.tabsEl.addEventListener('keydown', function (e) {
    var tabs = Array.prototype.slice.call(menu.tabsEl.querySelectorAll('[role=tab]'));
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1;
    if (n < 0) return;
    e.preventDefault();
    n = (n + tabs.length) % tabs.length;
    setTab(tabs[n].getAttribute('data-cat'));
    menu.tabsEl.querySelector('[data-cat="' + tabs[n].getAttribute('data-cat') + '"]').focus();
  });
  menu.listEl.addEventListener('click', function (e) {
    var b = e.target.closest('.mmenu-item');
    if (b) pick(menu.items[+b.getAttribute('data-i')]);
  });
  menu.listEl.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var b = e.target.closest('.mmenu-item');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    if (i !== menu.sel) { menu.sel = i; markSel(false); }
  });
  menu.listEl.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch' && e.target.closest('.mmenu-item')) e.preventDefault();
  });
  el.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', function (e) {
    if (menu.open && !menu.el.contains(e.target) && !(menu.target && menu.target.anchor.contains(e.target)) && !e.target.closest('[data-mmenu-btn]')) closeMenu(false);
  }, true);
  window.addEventListener('resize', function () { if (menu.open) place(); });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () { if (menu.open) place(); });
    window.visualViewport.addEventListener('scroll', function () { if (menu.open) place(); });
  }
  window.addEventListener('scroll', function () { if (menu.open && !sheetMode()) place(); }, true);
  L.onLang(function () { if (menu.open) { paintStatic(); buildTabs(); refresh(false); } });
  return menu;
}

function paintStatic() {
  var m = menu;
  m.lblEl.textContent = L.tr('Pretraži funkcije', 'Search functions');
  m.inEl.placeholder = L.tr('Pretraži: razlomak, sin, integral…', 'Search: fraction, sin, integral…');
  m.xEl.setAttribute('aria-label', L.tr('Zatvori', 'Close'));
  m.xEl.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>';
  m.footEl.innerHTML = coarse() ? '' : L.both('<kbd>↑</kbd><kbd>↓</kbd> biraj · <kbd>Enter</kbd> ubaci · <kbd>Esc</kbd> zatvori', '<kbd>↑</kbd><kbd>↓</kbd> choose · <kbd>Enter</kbd> insert · <kbd>Esc</kbd> close');
  m.footEl.hidden = coarse();
}

function buildTabs() {
  var m = menu;
  var cats = CATS.slice();
  if (recents().length) cats.unshift(['recent', 'Nedavno', 'Recent']);
  if (!cats.some(function (c) { return c[0] === m.tab; })) m.tab = 'all';
  m.tabsEl.innerHTML = '';
  cats.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('data-cat', c[0]);
    b.innerHTML = L.both(c[1], c[2]);
    m.tabsEl.appendChild(b);
  });
  markTabs();
}
function markTabs() {
  var m = menu;
  m.tabsEl.querySelectorAll('[role=tab]').forEach(function (b) {
    var on = (m.q ? 'all' : m.tab) === b.getAttribute('data-cat') && !m.q;
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.tabIndex = on || (m.q && b.getAttribute('data-cat') === 'all') ? 0 : -1;
    b.classList.toggle('on', on);
  });
  if (!m.tabsEl.querySelector('[tabindex="0"]')) { var f = m.tabsEl.querySelector('[role=tab]'); if (f) f.tabIndex = 0; }
}
function setTab(cat) {
  var m = menu;
  m.tab = cat;
  m.q = '';
  m.inEl.value = '';
  m.sel = 0;
  refresh(false);
}

function filtered() {
  var q = menu.q.trim().toLowerCase();
  var lang = L.lang();
  if (!q) {
    if (menu.tab === 'recent') return recents().map(function (k) { return BYKEY[k]; });
    return ITEMS.filter(function (it) { return menu.tab === 'all' || it.cat === menu.tab; });
  }
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

function refresh(announce) {
  var m = menu;
  m.items = filtered();
  if (m.sel >= m.items.length) m.sel = Math.max(0, m.items.length - 1);
  markTabs();
  var html = '';
  m.items.forEach(function (it, i) {
    html += '<div class="mmenu-item' + (i === m.sel ? ' on' : '') + '" id="' + m.id + '-o' + i + '" data-i="' + i + '" role="option" aria-selected="' + (i === m.sel) + '"><span class="pv" aria-hidden="true">' + preview(it) + '</span><span class="nm">' + L.esc(itemName(it)) + '<span class="cmd">\\' + L.esc(it.cmd) + '</span></span></div>';
  });
  if (!m.items.length) {
    html = '<div class="mmenu-empty">' + (m.q ? L.tr('Nema rezultata. Enter ubacuje \\' + L.esc(m.q), 'No results. Enter inserts \\' + L.esc(m.q)) : L.tr('Ovde će se pojaviti funkcije koje često koristiš.', 'Functions you use often will show up here.')) + '</div>';
  }
  m.listEl.innerHTML = html;
  m.listEl.scrollTop = 0;
  m.inEl.setAttribute('aria-activedescendant', m.items.length ? m.id + '-o' + m.sel : '');
  if (announce) m.liveEl.textContent = m.items.length ? L.tr(m.items.length + ' rezultata', m.items.length + ' results') : L.tr('Nema rezultata', 'No results');
  place();
}
function markSel(scroll) {
  var m = menu;
  m.listEl.querySelectorAll('.mmenu-item').forEach(function (b) {
    var on = +b.getAttribute('data-i') === m.sel;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    if (on && scroll) b.scrollIntoView({ block: 'nearest' });
  });
  m.inEl.setAttribute('aria-activedescendant', m.items.length ? m.id + '-o' + m.sel : '');
}
function place() {
  var m = menu;
  var el = m.el;
  if (sheetMode()) {
    el.classList.add('sheet');
    var v = window.visualViewport;
    el.style.top = 'auto';
    if (v) {
      el.style.left = Math.max(0, v.offsetLeft) + 'px';
      el.style.width = v.width + 'px';
      el.style.right = 'auto';
      el.style.bottom = Math.max(0, window.innerHeight - (v.height + v.offsetTop)) + 'px';
      el.style.maxHeight = Math.max(240, Math.floor(v.height * 0.86)) + 'px';
    } else {
      ['left', 'right', 'bottom', 'width', 'maxHeight'].forEach(function (p) { el.style[p] = ''; });
    }
    m.back.hidden = false;
    return;
  }
  el.classList.remove('sheet');
  el.style.right = '';
  m.back.hidden = true;
  if (!m.target) return;
  var r = (m.target.box || m.target.anchor).getBoundingClientRect();
  var vw = window.innerWidth, vh = window.innerHeight;
  var w = Math.min(420, vw - 16);
  var left = Math.max(8, Math.min(r.left, vw - w - 8));
  var below = vh - r.bottom - 8;
  var above = r.top - 8;
  el.style.left = left + 'px';
  el.style.width = w + 'px';
  if (below >= 300 || below >= above) {
    el.style.top = (r.bottom + 6) + 'px';
    el.style.bottom = 'auto';
    el.style.maxHeight = Math.max(220, Math.min(480, below)) + 'px';
  } else {
    el.style.bottom = (vh - r.top + 6) + 'px';
    el.style.top = 'auto';
    el.style.maxHeight = Math.max(220, Math.min(480, above)) + 'px';
  }
}
function openMenu(target, query) {
  var m = ensureMenu();
  m.target = target;
  m.q = query || '';
  m.sel = 0;
  m.tab = recents().length ? 'recent' : 'all';
  m.open = true;
  m.inEl.value = m.q;
  paintStatic();
  buildTabs();
  m.el.hidden = false;
  refresh(false);
  if (target.btn) target.btn.setAttribute('aria-expanded', 'true');
  if (coarse()) m.el.focus({ preventScroll: true });
  else m.inEl.focus({ preventScroll: true });
}
function closeMenu(refocus) {
  if (!menu || !menu.open) return;
  menu.open = false;
  menu.el.hidden = true;
  menu.back.hidden = true;
  var t = menu.target;
  if (t && t.btn) t.btn.setAttribute('aria-expanded', 'false');
  if (refocus && t) t.focus();
}
function pick(item) {
  var t = menu.target;
  var q = menu.q;
  closeMenu(false);
  if (!t) return;
  if (item) { remember(item); t.insert(item.tex); }
  else if (q) t.insert('\\' + q + ' ');
  t.focus();
}
function onKey(e) {
  var m = menu;
  if (!m || !m.open) return;
  var k = e.key;
  var inInput = e.target === m.inEl;
  if (k === 'Escape' || (k === '/' && !e.ctrlKey && !e.metaKey && !e.altKey)) { e.preventDefault(); e.stopPropagation(); closeMenu(true); return; }
  if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'PageDown' || k === 'PageUp') {
    if (!m.items.length) return;
    e.preventDefault();
    var step = k === 'PageDown' || k === 'PageUp' ? 5 : 1;
    var dir = k === 'ArrowDown' || k === 'PageDown' ? 1 : -1;
    m.sel = Math.max(0, Math.min(m.items.length - 1, m.sel + dir * step));
    markSel(true);
    return;
  }
  if (k === 'Enter' && (inInput || e.target === m.el)) { e.preventDefault(); pick(m.items[m.sel]); return; }
  if (k === 'Tab') {
    var f = [m.inEl, m.tabsEl.querySelector('[tabindex="0"]'), m.xEl].filter(Boolean);
    var i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    return;
  }
  if (e.target === m.el && k.length === 1 && !e.metaKey && !e.ctrlKey) {
    m.inEl.focus();
  }
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
  if (coarse()) return L.both('Dodirni ƒ ili ukucaj / za sve funkcije, ili koristi prečice.', 'Tap ƒ or type / for every function, or use the shortcuts.');
  return L.both('Prečice ubacuju odmah. Pritisni <kbd>/</kbd> u polju da otvoriš ili zatvoriš listu funkcija.', 'Shortcuts insert instantly. Press <kbd>/</kbd> in the box to open or close the function list.');
}

function quickBar(row, target) {
  row.innerHTML = '';
  QUICK.forEach(function (k, i) {
    var it = BYKEY[k];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mq';
    b.tabIndex = i ? -1 : 0;
    b.setAttribute('data-key', k);
    b.innerHTML = preview(it);
    row.appendChild(b);
  });
  function label() {
    row.setAttribute('aria-label', L.tr('Brze funkcije', 'Quick functions'));
    row.querySelectorAll('.mq').forEach(function (b) {
      var it = BYKEY[b.getAttribute('data-key')];
      b.setAttribute('aria-label', itemName(it));
      b.title = itemName(it);
    });
  }
  label();
  L.onLang(label);
  row.addEventListener('pointerdown', function (e) { if (e.target.closest('.mq')) e.preventDefault(); });
  row.addEventListener('click', function (e) {
    var b = e.target.closest('.mq');
    if (!b) return;
    var it = BYKEY[b.getAttribute('data-key')];
    remember(it);
    target.insert(it.tex);
  });
  row.addEventListener('keydown', function (e) {
    var all = Array.prototype.slice.call(row.querySelectorAll('.mq'));
    var i = all.indexOf(document.activeElement);
    if (i < 0) return;
    var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : -1;
    if (n < 0) return;
    e.preventDefault();
    n = Math.max(0, Math.min(all.length - 1, n));
    all[i].tabIndex = -1;
    all[n].tabIndex = 0;
    all[n].focus();
  });
}

function create(host, opt) {
  opt = opt || {};
  var wrap = document.createElement('div');
  wrap.className = 'mbox';
  host.appendChild(wrap);
  var api = { el: wrap, get: function () { return ''; }, set: function () {}, focus: function () {}, onChange: opt.onChange || null };
  var bar = document.createElement('div');
  bar.className = 'mbox-bar';
  bar.innerHTML = '<button type="button" class="mq-all" data-mmenu-btn aria-haspopup="dialog" aria-expanded="false"><span class="fn" aria-hidden="true">ƒ</span><span>' + L.both('Funkcije', 'Functions') + '</span></button><div class="mq-row" role="toolbar"></div>';
  var hint = document.createElement('div');
  hint.className = 'mbox-hint';
  hint.innerHTML = hintHtml();
  var btn = bar.querySelector('.mq-all');
  var row = bar.querySelector('.mq-row');
  function fire() { if (api.onChange) api.onChange(api.get()); }

  Promise.all([needKatex(), needMathlive()]).then(function (r) {
    var M = r[1];
    var target;
    function toggle() {
      if (menu && menu.open && menu.target === target) closeMenu(true);
      else openMenu(target);
    }
    if (M && customElements.get('math-field')) {
      var mf = new M();
      mf.className = 'mf';
      mf.setAttribute('aria-label', L.tr('Polje za formulu', 'Formula box'));
      wrap.insertBefore(mf, wrap.firstChild);
      mf.mathVirtualKeyboardPolicy = 'manual';
      mf.smartFence = true;
      mf.menuItems = [];
      if (opt.value) mf.value = opt.value;
      target = {
        anchor: mf,
        btn: btn,
        box: wrap,
        insert: function (tex) { mf.insert(tex, { format: 'latex', selectionMode: 'placeholder', focus: true }); },
        focus: function () {
          mf.focus();
          setTimeout(function () { if (!mf.hasFocus()) { mf.blur(); mf.focus(); } }, 60);
        }
      };
      mf.addEventListener('keydown', function (e) {
        if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); e.stopPropagation(); toggle(); }
      }, true);
      mf.addEventListener('beforeinput', function (e) {
        if (e.data === '/') { e.preventDefault(); e.stopPropagation(); toggle(); }
      }, true);
      mf.addEventListener('input', fire);
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
      target = {
        anchor: ta,
        btn: btn,
        box: wrap,
        insert: function (tex) { insertIntoTextarea(ta, tex); },
        focus: function () { ta.focus(); }
      };
      ta.addEventListener('keydown', function (e) {
        if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); toggle(); }
      }, true);
      api.get = function () { return ta.value.trim(); };
      api.set = function (v) { ta.value = v || ''; upd(); };
      api.focus = function () { ta.focus(); };
      upd();
    }
    btn.addEventListener('click', toggle);
    quickBar(row, target);
  });
  wrap.appendChild(bar);
  wrap.appendChild(hint);
  return api;
}

L.mathbox = { create: create, render: renderTo, clean: cleanLatex, needKatex: needKatex, close: function () { closeMenu(false); } };
})();
