(function () {
'use strict';

var script = document.currentScript;
var BASE = new URL('../../', script.src).href;
var lang = 'sr';
try { var saved = localStorage.getItem('lav-lang'); if (saved === 'en' || saved === 'sr') lang = saved; } catch (e) {}
var listeners = [];

var MONTHS = {
  sr: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

var ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  join: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  up: '<path d="M6 15l6-6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  dup: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  quiz: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
};
function icon(name, cls) {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + ICONS[name] + '</svg>';
}

function tr(sr, en) { return lang === 'sr' ? sr : en; }
function loc(x) {
  if (x == null) return '';
  if (typeof x === 'string') return x;
  return x[lang] || x.sr || x.en || '';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function both(sr, en, tag) {
  tag = tag || 'span';
  return '<' + tag + ' lang="sr">' + sr + '</' + tag + '><' + tag + ' lang="en">' + en + '</' + tag + '>';
}
function fmtDate(iso, l) {
  var p = iso.split('-').map(Number);
  l = l || lang;
  if (l === 'sr') return p[2] + '. ' + MONTHS.sr[p[1] - 1] + ' ' + p[0] + '.';
  return p[2] + ' ' + MONTHS.en[p[1] - 1] + ' ' + p[0];
}
function fmtNum(x, d) {
  var s = Number(x).toFixed(d == null ? 2 : d);
  return lang === 'sr' ? s.replace('.', ',') : s;
}
function fmtTime(ts) {
  var d = new Date(ts);
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function applyAttrs(root) {
  (root || document).querySelectorAll('[data-ph-sr]').forEach(function (el) {
    el.setAttribute('placeholder', lang === 'sr' ? el.getAttribute('data-ph-sr') : el.getAttribute('data-ph-en'));
  });
  (root || document).querySelectorAll('[data-aria-sr]').forEach(function (el) {
    el.setAttribute('aria-label', lang === 'sr' ? el.getAttribute('data-aria-sr') : el.getAttribute('data-aria-en'));
    if (el.hasAttribute('data-title-on')) el.setAttribute('title', el.getAttribute('aria-label'));
  });
}
function setLang(l) {
  lang = l;
  var root = document.documentElement;
  root.setAttribute('data-lang', l);
  root.lang = l === 'sr' ? 'sr-Latn' : 'en';
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === l ? 'true' : 'false');
  });
  try { localStorage.setItem('lav-lang', l); } catch (e) {}
  applyAttrs(document);
  var slug = pageSlug();
  if (slug) {
    var ls = lessonBySlug(slug);
    if (ls) document.title = loc(ls.title) + ' · lav';
  } else if (document.body.getAttribute('data-title-sr')) {
    document.title = document.body.getAttribute(l === 'sr' ? 'data-title-sr' : 'data-title-en');
  }
  listeners.forEach(function (f) { try { f(l); } catch (e) { console.error(e); } });
}
function onLang(f) { listeners.push(f); }

function pageSlug() {
  var el = document.querySelector('[data-slug]');
  return el ? el.getAttribute('data-slug') : null;
}
function lessonBySlug(slug) {
  var all = window.LAV_LESSONS || [];
  for (var i = 0; i < all.length; i++) if (all[i].slug === slug) return all[i];
  return null;
}
function lessonByQuiz(code) {
  var all = window.LAV_LESSONS || [];
  for (var i = 0; i < all.length; i++) if (all[i].quiz === code) return all[i];
  return null;
}
function lessonUrl(slug) { return BASE + 'lekcije/' + slug + '.html'; }

function toast(sr, en) {
  var host = document.querySelector('.toast-host');
  if (!host) { host = document.createElement('div'); host.className = 'toast-host'; host.setAttribute('aria-live', 'polite'); document.body.appendChild(host); }
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = both(esc(sr), esc(en == null ? sr : en));
  host.appendChild(t);
  setTimeout(function () { t.remove(); }, 2600);
}

function renderMath(root) {
  if (typeof window.renderMathInElement !== 'function') return;
  try {
    window.renderMathInElement(root || document.body, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false,
      ignoredClasses: ['no-math']
    });
  } catch (e) { console.error(e); }
}

function loadScript(src) {
  return new Promise(function (res, rej) {
    var s = document.createElement('script');
    s.src = BASE + src;
    s.onload = res;
    s.onerror = function () { rej(new Error('load ' + src)); };
    document.head.appendChild(s);
  });
}
var quizReady = null;
function loadData() {
  if (!window.LAV_QUIZZES && !loadData.p) loadData.p = loadScript('assets/js/quiz-data.js');
  return loadData.p || Promise.resolve();
}
function loadQuiz() {
  if (!quizReady) {
    quizReady = loadData()
      .then(function () { return loadScript('assets/js/auth.js'); })
      .then(function () { return loadScript('assets/js/quiz-store.js'); })
      .then(function () { return loadScript('assets/js/mathbox.js'); })
      .then(function () { return loadScript('assets/js/quiz.js'); })
      .then(function () { return loadScript('assets/js/account.js'); });
    quizReady.catch(function () { quizReady = null; });
  }
  return quizReady;
}
function openJoin(code) {
  loadQuiz().then(function () { window.LAV.quiz.openJoin(code); }).catch(function () { toast('Kviz se nije učitao. Proveri vezu.', 'The quiz did not load. Check your connection.'); });
}
function openCreate() {
  loadQuiz().then(function () { window.LAV.quiz.openCreate(); }).catch(function () { toast('Kviz se nije učitao. Proveri vezu.', 'The quiz did not load. Check your connection.'); });
}

function openAccount(tab) {
  loadQuiz().then(function () { window.LAV.account.open(tab); }).catch(function () { toast('Nalog se nije učitao. Proveri vezu.', 'The account page did not load. Check your connection.'); });
}
function accountsOn() {
  var c = window.LAV_CONFIG || {};
  return /^https:\/\/[^\s]+$/.test(String(c.databaseURL || '').trim()) && String(c.apiKey || '').trim().length > 0;
}
function storedUser() {
  try {
    var s = JSON.parse(localStorage.getItem('lav-session') || 'null');
    return s && s.uid ? s : null;
  } catch (e) { return null; }
}
function paintAccount() {
  var b = document.getElementById('btn-account');
  if (!b) return;
  var u = storedUser();
  var lbl = b.querySelector('.lbl');
  if (u) {
    var nm = String(u.name || u.email || '').split('@')[0].split(' ')[0].slice(0, 14);
    lbl.textContent = nm;
    b.classList.add('on');
    b.setAttribute('data-aria-sr', 'Nalog: ' + (u.name || u.email));
    b.setAttribute('data-aria-en', 'Account: ' + (u.name || u.email));
  } else {
    lbl.innerHTML = both('Prijava', 'Sign in');
    b.classList.remove('on');
    b.setAttribute('data-aria-sr', 'Prijava ili nalog');
    b.setAttribute('data-aria-en', 'Sign in or account');
  }
  applyAttrs(b);
}

function buildHeader() {
  var host = document.getElementById('site-header');
  if (!host) return;
  var cur = document.body.getAttribute('data-nav') || '';
  host.outerHTML =
    '<header class="top"><div class="top-in">' +
    '<a class="mark" href="' + BASE + 'index.html" aria-label="lav"><i></i>lav</a>' +
    '<nav class="nav" aria-label="Navigacija">' +
    '<a href="' + BASE + 'biblioteka.html"' + (cur === 'library' ? ' aria-current="page"' : '') + '>' + both('Biblioteka', 'Library') + '</a>' +
    '</nav>' +
    '<div class="top-tools">' +
    '<div class="lang" role="group" aria-label="Jezik / Language"><button type="button" data-set-lang="sr" aria-pressed="true">SR</button><button type="button" data-set-lang="en" aria-pressed="false">EN</button></div>' +
    (accountsOn() ? '<button type="button" class="tool" id="btn-account" data-title-on>' + icon('user') + '<span class="lbl"></span></button>' : '') +
    '<button type="button" class="tool" id="btn-join" data-aria-sr="Pridruži se sobi" data-aria-en="Join a room" data-title-on>' + icon('join') + '<span class="lbl">' + both('Pridruži se', 'Join room') + '</span></button>' +
    '<button type="button" class="tool primary" id="btn-create" data-aria-sr="Napravi kviz" data-aria-en="Create a quiz" data-title-on>' + icon('plus') + '<span class="lbl">' + both('Napravi kviz', 'Create quiz') + '</span></button>' +
    '</div></div></header>';
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
  });
  document.getElementById('btn-join').addEventListener('click', function () { openJoin(); });
  document.getElementById('btn-create').addEventListener('click', function () { openCreate(); });
  var acc = document.getElementById('btn-account');
  if (acc) {
    acc.addEventListener('click', function () { openAccount(); });
    paintAccount();
    window.addEventListener('lav-auth', paintAccount);
    window.addEventListener('storage', function (e) { if (e.key === 'lav-session') paintAccount(); });
  }
}
function buildFooter() {
  var host = document.getElementById('site-footer');
  if (!host) return;
  host.outerHTML = '<footer class="site"><a href="' + BASE + 'index.html">lav</a> · ' + both('otvorena biblioteka školskih lekcija', 'an open library of school lessons') +
    ' · <a href="' + BASE + 'biblioteka.html">' + both('Biblioteka', 'Library') + '</a></footer>';
}

function buildLessonTop() {
  var top = document.getElementById('lesson-top');
  var slug = pageSlug();
  if (!top || !slug) return;
  var ls = lessonBySlug(slug);
  if (!ls) return;
  var cls = window.LAV_CLASSES[ls.cls];
  var tags = ls.tags || [];
  var chips = '<span class="tag ' + (cls.color === 'copper' ? '' : cls.color) + '">' + both(esc(cls.sr), esc(cls.en)) + '</span>' +
    '<span class="tag plain">' + icon('book', 'ic').replace('<svg', '<svg width="13" height="13" style="stroke:currentColor;fill:none;stroke-width:2"') + '<span>' + both(esc(fmtDate(ls.date, 'sr')), esc(fmtDate(ls.date, 'en'))) + '</span></span>' +
    '<span class="tag plain">' + both(ls.minutes + ' min čitanja', ls.minutes + ' min read') + '</span>';
  if (tags.indexOf('3d') >= 0) chips += '<span class="tag plain">' + both('3D model', '3D model') + '</span>';
  if (tags.indexOf('animation') >= 0) chips += '<span class="tag plain">' + both('Animacije', 'Animations') + '</span>';
  if (tags.indexOf('lab') >= 0) chips += '<span class="tag plain">' + both('Vežba', 'Lab') + '</span>';
  var html =
    '<div class="crumbs"><a href="' + BASE + 'index.html">lav</a><span>/</span><a href="' + BASE + 'biblioteka.html">' + both('Biblioteka', 'Library') + '</a><span>/</span><a href="' + BASE + 'biblioteka.html#' + ls.cls + '">' + both(esc(cls.sr), esc(cls.en)) + '</a></div>' +
    '<div class="lp-head"><div class="lp-meta">' + chips + '</div>' +
    '<h1>' + both(esc(ls.title.sr), esc(ls.title.en)) + '</h1>' +
    '<p class="lp-lead">' + both(esc(ls.summary.sr), esc(ls.summary.en), 'span') + '</p></div>';
  top.insertAdjacentHTML('afterbegin', html);
}

function buildToc() {
  var nav = document.querySelector('[data-slot="toc"]');
  if (!nav) return;
  var secs = document.querySelectorAll('main section[data-toc]');
  var html = '<div class="lp-toc-in">';
  secs.forEach(function (s, i) {
    var h = s.querySelector('h2');
    if (!s.id) s.id = 's' + (i + 1);
    var label = s.getAttribute('data-toc-sr') ? both(esc(s.getAttribute('data-toc-sr')), esc(s.getAttribute('data-toc-en'))) : (h ? h.innerHTML : '');
    html += '<a href="#' + s.id + '"><b>' + (i + 1) + '</b>' + label + '</a>';
  });
  html += '</div>';
  nav.innerHTML = html;
  nav.setAttribute('aria-label', 'Sadržaj');
  var links = nav.querySelectorAll('a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if (!('IntersectionObserver' in window)) return;
  var current = null;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        if (current) current.classList.remove('on');
        current = map[en.target.id];
        if (current) {
          current.classList.add('on');
          var inn = nav.firstElementChild;
          var l = current.offsetLeft - 20;
          if (inn.scrollWidth > inn.clientWidth) inn.scrollTo({ left: l, behavior: 'smooth' });
        }
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  secs.forEach(function (s) { io.observe(s); });
}

function buildPager() {
  var nav = document.querySelector('[data-slot="pager"]');
  var slug = pageSlug();
  if (!nav || !slug) return;
  var all = window.LAV_LESSONS;
  var i = all.findIndex(function (l) { return l.slug === slug; });
  var html = '';
  function card(ls, cls, label) {
    return '<a class="' + cls + '" href="' + lessonUrl(ls.slug) + '"><span class="eyebrow">' + label + '</span><b>' + both(esc(ls.title.sr), esc(ls.title.en)) + '</b></a>';
  }
  html += i > 0 ? card(all[i - 1], 'prev', both('← Prethodna lekcija', '← Previous lesson')) : '<span class="ph"></span>';
  html += i < all.length - 1 ? card(all[i + 1], 'next', both('Sledeća lekcija →', 'Next lesson →')) : '<a class="next" href="' + BASE + 'biblioteka.html"><span class="eyebrow">' + both('Kraj biblioteke', 'End of the library') + '</span><b>' + both('Nazad na biblioteku', 'Back to the library') + '</b></a>';
  nav.innerHTML = html;
}

function buildTestCta() {
  var host = document.querySelector('[data-test]');
  if (!host) return;
  var code = host.getAttribute('data-test');
  host.className = 'test-cta';
  var render = function () {
    var q = window.LAV_QUIZZES && window.LAV_QUIZZES[code];
    var n = q ? q.questions.length : 0;
    host.innerHTML =
      '<div class="test-box"><div class="txt">' +
      '<p class="eyebrow">' + both('Proveri znanje', 'Check what you know') + '</p>' +
      '<h2>' + both('Mali test', 'A small test') + '</h2>' +
      '<p>' + both(
        (n ? n + ' vrlo lakih pitanja. ' : 'Vrlo laka pitanja. ') + 'Upišeš korisničko ime i odgovaraš u kviz sobi. Iznad svakog odgovora je polje za formulu: otkucaj <b>\\</b> i izaberi funkciju. Formule iz lekcije se tu ne prikazuju, pa probaj da ih se setiš.',
        (n ? n + ' very easy questions. ' : 'Very easy questions. ') + 'You enter a username and answer in a quiz room. There is a formula box above every answer: type <b>\\</b> and pick a function. The formulas from the lesson are not shown there, so try to remember them.'
      ) + '</p>' +
      '</div><div class="test-side">' +
      '<div class="room"><span class="code" aria-label="Kod sobe">' + esc(code) + '</span></div>' +
      '<div class="row"><button type="button" class="btn primary" data-act="start">' + icon('quiz') + both('Počni test', 'Start the test') + '</button>' +
      '<button type="button" class="btn" data-act="copy">' + icon('copy') + both('Kopiraj kod', 'Copy code') + '</button></div>' +
      '</div></div>';
    host.querySelector('[data-act="start"]').addEventListener('click', function () { openJoin(code); });
    host.querySelector('[data-act="copy"]').addEventListener('click', function () {
      var done = function () { toast('Kod kopiran: ' + code, 'Code copied: ' + code); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, done);
      else done();
    });
    renderMath(host);
  };
  render();
  loadData().then(render).catch(function () {});
}

var observed = [];
var vis = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
  entries.forEach(function (en) { en.target.__visible = en.isIntersecting; });
}, { rootMargin: '100px' }) : null;
function watch(el) {
  el.__visible = !vis;
  if (vis) vis.observe(el);
  return el;
}
function loop(el, fn) {
  watch(el);
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (el.__visible && !document.hidden) fn(dt, now / 1000);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function range(id, o) {
  var el = document.getElementById(id);
  var out = document.getElementById(id + '-out');
  var obj = o.obj, key = o.key;
  function read() {
    obj[key] = parseFloat(el.value);
    if (out) out.textContent = o.fmt ? o.fmt(obj[key]) : obj[key];
    if (o.on) o.on(obj[key]);
  }
  el.addEventListener('input', read);
  read();
  onLang(read);
  return el;
}

var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

window.LAV = {
  base: BASE,
  lang: function () { return lang; },
  setLang: setLang,
  onLang: onLang,
  tr: tr,
  loc: loc,
  esc: esc,
  both: both,
  icon: icon,
  fmtDate: fmtDate,
  fmtNum: fmtNum,
  fmtTime: fmtTime,
  applyAttrs: applyAttrs,
  renderMath: renderMath,
  toast: toast,
  lessonBySlug: lessonBySlug,
  lessonByQuiz: lessonByQuiz,
  lessonUrl: lessonUrl,
  openJoin: openJoin,
  openCreate: openCreate,
  openAccount: openAccount,
  accountsOn: accountsOn,
  loadData: loadData,
  watch: watch,
  loop: loop,
  range: range,
  reduce: reduce,
  config: window.LAV_CONFIG || {}
};

buildHeader();
buildFooter();
buildLessonTop();
buildToc();
buildPager();
buildTestCta();
renderMath(document.body);
setLang(lang);

try {
  var qp = new URLSearchParams(location.search).get('room');
  if (qp) setTimeout(function () { openJoin(qp.toUpperCase()); }, 150);
} catch (e) {}
})();
