(function () {
'use strict';
var L = window.LAV;

var grid = document.getElementById('class-grid');
var html = '';
Object.keys(window.LAV_CLASSES).forEach(function (key) {
  var c = window.LAV_CLASSES[key];
  var items = window.LAV_LESSONS.filter(function (l) { return l.cls === key; });
  html += '<a class="class-card ' + (c.color === 'copper' ? '' : c.color) + '" href="' + L.base + 'biblioteka.html#' + key + '">' +
    '<span class="count">' + L.both(items.length + (items.length === 1 ? ' lekcija' : (items.length < 5 ? ' lekcije' : ' lekcija')), items.length + (items.length === 1 ? ' lesson' : ' lessons')) + '</span>' +
    '<h3>' + L.both(L.esc(c.sr), L.esc(c.en)) + '</h3>' +
    '<p class="note">' + L.both(L.esc(c.blurb.sr), L.esc(c.blurb.en)) + '</p><ul>' +
    items.map(function (l) { return '<li>' + L.both(L.esc(l.title.sr), L.esc(l.title.en)) + '</li>'; }).join('') + '</ul></a>';
});
grid.innerHTML = html;

document.getElementById('hero-join').addEventListener('click', function () { L.openJoin(); });
document.getElementById('band-join').addEventListener('click', function () { L.openJoin(); });
document.getElementById('band-create').addEventListener('click', function () { L.openCreate(); });

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function drawFilings() {
  var cv = document.getElementById('filings'), hero = cv.parentElement;
  var w = hero.clientWidth, h = hero.clientHeight;
  if (!w || !h) return;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  var c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  var cs = getComputedStyle(document.documentElement);
  var ink = cs.getPropertyValue('--filings').trim(), north = cs.getPropertyValue('--north').trim(), south = cs.getPropertyValue('--south').trim();
  var wide = w >= 760;
  var ml = wide ? Math.min(200, w * 0.17) : Math.min(150, w * 0.42), mh = ml * 0.26;
  var cx = wide ? w * 0.74 : w * 0.5, cy = wide ? h * 0.5 : h - 120;
  var pN = [cx - ml * 0.38, cy], pS = [cx + ml * 0.38, cy];
  var ref = 1 / Math.pow(ml * 1.1, 2);
  var rnd = mulberry32(11);
  var n = Math.round(w * h / 26);
  c.strokeStyle = ink; c.lineWidth = 1.15; c.lineCap = 'round';
  c.beginPath();
  for (var i = 0; i < n; i++) {
    var x = rnd() * w, y = rnd() * h, keep = rnd(), lr = rnd();
    if (Math.abs(x - cx) < ml / 2 + 7 && Math.abs(y - cy) < mh / 2 + 7) continue;
    var dx1 = x - pN[0], dy1 = y - pN[1], r1 = Math.max(6, Math.hypot(dx1, dy1));
    var dx2 = x - pS[0], dy2 = y - pS[1], r2 = Math.max(6, Math.hypot(dx2, dy2));
    var bx = dx1 / (r1 * r1 * r1) - dx2 / (r2 * r2 * r2), by = dy1 / (r1 * r1 * r1) - dy2 / (r2 * r2 * r2);
    var m = Math.hypot(bx, by);
    if (!m) continue;
    var p = Math.min(1, Math.pow(m / ref, 0.55));
    if (keep > p) continue;
    var len = 3 + lr * 5, ux = bx / m * len / 2, uy = by / m * len / 2;
    c.moveTo(x - ux, y - uy); c.lineTo(x + ux, y + uy);
  }
  c.stroke();
  var x0 = cx - ml / 2, y0 = cy - mh / 2, rad = 4;
  function half(xa, wa, col, left) {
    c.beginPath();
    if (left) { c.moveTo(xa + wa, y0); c.lineTo(xa + rad, y0); c.arcTo(xa, y0, xa, y0 + rad, rad); c.lineTo(xa, y0 + mh - rad); c.arcTo(xa, y0 + mh, xa + rad, y0 + mh, rad); c.lineTo(xa + wa, y0 + mh); }
    else { c.moveTo(xa, y0); c.lineTo(xa + wa - rad, y0); c.arcTo(xa + wa, y0, xa + wa, y0 + rad, rad); c.lineTo(xa + wa, y0 + mh - rad); c.arcTo(xa + wa, y0 + mh, xa + wa - rad, y0 + mh, rad); c.lineTo(xa, y0 + mh); }
    c.closePath(); c.fillStyle = col; c.fill();
  }
  half(x0, ml / 2, north, true);
  half(cx, ml / 2, south, false);
  c.fillStyle = '#fff';
  c.font = '800 ' + Math.round(mh * 0.62) + 'px Archivo, system-ui, sans-serif';
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('N', x0 + ml * 0.14, cy + 1);
  c.fillText('S', x0 + ml * 0.86, cy + 1);
}
new ResizeObserver(drawFilings).observe(document.getElementById('filings').parentElement);
var mqDark = matchMedia('(prefers-color-scheme: dark)');
if (mqDark.addEventListener) mqDark.addEventListener('change', drawFilings);
var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1500); })]).then(drawFilings);
})();
