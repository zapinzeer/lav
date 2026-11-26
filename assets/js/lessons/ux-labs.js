(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;

function $(id) { return document.getElementById(id); }
function both(sr, en) { return L.both(sr, en); }

function gestalt() {
  var fig = $('lab-gestalt');
  if (!fig) return;
  var card = $('gs-card');
  var KEYS = ['prox', 'align', 'hier', 'act'];
  var TXT = {
    prox: ['Blizina: natpis je sada uz svoje polje, a grupe su razmaknute. Oko odmah vidi koji natpis ide uz koje polje.', 'Proximity: each label now sits by its own field, and the groups are spaced apart. The eye sees at once which label belongs to which field.'],
    align: ['Poravnanje: sve počinje od iste leve ivice. Kartica deluje uredno i lakše se prelazi pogledom.', 'Alignment: everything starts from the same left edge. The card looks tidy and is easier to scan.'],
    hier: ['Hijerarhija: naslov je najkrupniji, podaci o vremenu sitniji i bleđi. Zna se šta se čita prvo.', 'Hierarchy: the title is the largest, the time details smaller and lighter. It is clear what to read first.'],
    act: ['Kontrast radnje: „Prijavi se” je jedino jako dugme, a „Otkaži” je sporedno. Glavna radnja se ne traži.', 'Action contrast: "Sign up" is the only strong button, and "Cancel" is secondary. Nobody has to hunt for the main action.']
  };
  var last = null;
  function read() {
    var on = KEYS.filter(function (k) { return $('gs-' + k).checked; });
    $('gs-calc').textContent = L.tr('Uključeni principi', 'Principles turned on');
    $('gs-result').innerHTML = on.length + ' / 4';
    var note;
    if (last && $('gs-' + last).checked) note = L.tr(TXT[last][0], TXT[last][1]);
    else if (on.length === 0) note = L.tr('Sve je iste veličine, razmaci su jednaki, poravnanje je nasumično i oba dugmeta izgledaju isto. Teško je reći šta je važno.', 'Everything is the same size, the gaps are equal, the alignment is random and both buttons look the same. It is hard to tell what matters.');
    else if (on.length === 4) note = L.tr('Svi principi su uključeni: isti sadržaj, a kartica se razume na prvi pogled.', 'All principles are on: the same content, but the card is understood at a glance.');
    else note = L.tr('Uključi još neki princip i uporedi.', 'Turn on another principle and compare.');
    $('gs-note').textContent = note;
  }
  function apply() {
    KEYS.forEach(function (k) { card.classList.toggle('p-' + k, $('gs-' + k).checked); });
    read();
  }
  KEYS.forEach(function (k) {
    $('gs-' + k).addEventListener('change', function () { last = k; apply(); });
  });
  $('gs-all').addEventListener('click', function () { KEYS.forEach(function (k) { $('gs-' + k).checked = true; }); last = null; apply(); });
  $('gs-none').addEventListener('click', function () { KEYS.forEach(function (k) { $('gs-' + k).checked = false; }); last = null; apply(); });
  L.onLang(read);
  apply();
}

function lin(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function lum(hex) {
  var n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}

function contrast() {
  var fig = $('lab-contrast');
  if (!fig) return;
  var fg = $('ct-fg'), bg = $('ct-bg'), stage = $('ct-stage');
  function badge(ok, label) {
    return '<span class="uxs-badge ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓ ' : '✗ ') + label + '</span>';
  }
  function read() {
    var a = fg.value, b = bg.value;
    stage.style.color = a;
    stage.style.background = b;
    $('ct-fg-o').textContent = a.toUpperCase();
    $('ct-bg-o').textContent = b.toUpperCase();
    var la = lum(a), lb = lum(b);
    var l1 = Math.max(la, lb), l2 = Math.min(la, lb);
    var k = (l1 + 0.05) / (l2 + 0.05);
    $('ct-calc').textContent = 'L₁ = ' + L.fmtNum(l1, 3) + ' · L₂ = ' + L.fmtNum(l2, 3) + ' · K = (' + L.fmtNum(l1, 3) + ' + 0' + L.tr(',', '.') + '05) / (' + L.fmtNum(l2, 3) + ' + 0' + L.tr(',', '.') + '05)';
    $('ct-result').innerHTML = L.fmtNum(k, 2) + ' : 1';
    $('ct-badges').innerHTML =
      badge(k >= 4.5, both('AA običan tekst', 'AA normal text')) +
      badge(k >= 3, both('AA krupan tekst', 'AA large text')) +
      badge(k >= 7, both('AAA običan tekst', 'AAA normal text')) +
      badge(k >= 3, both('ikone i ivice', 'icons and borders'));
  }
  C.toggle($('ct-pre'), function (v) {
    var p = v.split('|');
    fg.value = p[0];
    bg.value = p[1];
    read();
  });
  function manual() {
    $('ct-pre').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-v') === fg.value + '|' + bg.value ? 'true' : 'false'); });
    read();
  }
  fg.addEventListener('input', manual);
  bg.addEventListener('input', manual);
  L.onLang(read);
  read();
}

function fitts() {
  var fig = $('lab-fitts');
  if (!fig) return;
  var stage = $('ft-stage'), start = $('ft-start'), target = $('ft-target');
  var dIn = $('ft-d'), wIn = $('ft-w');
  var st = { t0: 0, running: false, runs: [], last: null, miss: 0 };
  var START_W = 64;
  function geom() {
    var sw = stage.clientWidth;
    var w = +wIn.value;
    var x0 = 14 + START_W / 2;
    var maxD = sw - 14 - w / 2 - x0;
    var d = Math.max(20, Math.min(+dIn.value, maxD));
    return { w: w, d: d, x0: x0, clamped: d < +dIn.value };
  }
  function layout() {
    var g = geom();
    start.style.left = (g.x0 - START_W / 2) + 'px';
    start.style.width = START_W + 'px';
    target.style.left = (g.x0 + g.d - g.w / 2) + 'px';
    target.style.width = g.w + 'px';
    return g;
  }
  function id(g) { return Math.log(g.d / g.w + 1) / Math.LN2; }
  function key(g) { return Math.round(g.d) + '|' + g.w; }
  function read() {
    var g = layout();
    $('ft-d-o').textContent = Math.round(g.d) + ' px' + (g.clamped ? ' *' : '');
    $('ft-w-o').textContent = g.w + ' px';
    var I = id(g);
    $('ft-calc').textContent = 'ID = log₂(' + Math.round(g.d) + ' / ' + g.w + ' + 1) = ' + L.fmtNum(I, 2) + ' bit';
    var same = st.runs.filter(function (r) { return r.k === key(g); });
    if (st.last == null) {
      $('ft-result').innerHTML = L.fmtNum(I, 2) + ' <small>bit</small>';
    } else {
      var avg = same.length ? same.reduce(function (s, r) { return s + r.t; }, 0) / same.length : st.last;
      $('ft-result').innerHTML = Math.round(st.last) + ' <small>ms · ' + L.tr('prosek', 'average') + ' ' + Math.round(avg) + ' ms (' + same.length + '×)</small>';
    }
    var groups = {};
    st.runs.forEach(function (r) { (groups[r.id.toFixed(2)] = groups[r.id.toFixed(2)] || []).push(r.t); });
    var keys = Object.keys(groups).sort(function (a, b) { return a - b; });
    var hist = keys.slice(0, 6).map(function (k) {
      var v = groups[k];
      return 'ID ' + L.fmtNum(+k, 2) + ' → ' + Math.round(v.reduce(function (s, x) { return s + x; }, 0) / v.length) + ' ms';
    }).join(' · ');
    var note = hist || L.tr('Još nema merenja. Klikni Start, pa cilj.', 'No timings yet. Click Start, then the target.');
    if (st.miss) note += ' · ' + L.tr('promašaja', 'misses') + ': ' + st.miss;
    if (g.clamped) note += ' · * ' + L.tr('udaljenost je skraćena da stane na ekran', 'distance shortened to fit the screen');
    $('ft-note').textContent = note;
  }
  function setMsg(sr, en) { $('ft-msg').innerHTML = both(sr, en); }
  start.addEventListener('click', function () {
    st.running = true;
    st.t0 = performance.now();
    stage.classList.add('go');
    setMsg('Sad brzo na cilj!', 'Now quickly hit the target!');
  });
  target.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!st.running) { setMsg('Prvo klikni Start.', 'Click Start first.'); return; }
    var t = performance.now() - st.t0;
    st.running = false;
    stage.classList.remove('go');
    var g = geom();
    st.last = t;
    st.runs.push({ k: key(g), id: id(g), t: t });
    setMsg('Pogodak! Klikni Start za još jedan pokušaj.', 'Hit! Click Start for another try.');
    read();
  });
  stage.addEventListener('click', function (e) {
    if (!st.running || start.contains(e.target) || target.contains(e.target)) return;
    st.miss++;
    setMsg('Promašaj, probaj opet.', 'Missed, try again.');
    read();
  });
  dIn.addEventListener('input', function () { st.running = false; stage.classList.remove('go'); st.last = null; read(); });
  wIn.addEventListener('input', function () { st.running = false; stage.classList.remove('go'); st.last = null; read(); });
  $('ft-reset').addEventListener('click', function () { st.runs = []; st.last = null; st.miss = 0; st.running = false; stage.classList.remove('go'); setMsg('Klikni Start, pa cilj.', 'Click Start, then the target.'); read(); });
  window.addEventListener('resize', read);
  L.onLang(read);
  setMsg('Klikni Start, pa cilj.', 'Click Start, then the target.');
  read();
}

gestalt();
contrast();
fitts();
})();
