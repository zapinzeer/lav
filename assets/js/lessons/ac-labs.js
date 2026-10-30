(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var COL = C.COL;
var TAU = Math.PI * 2;

function $(id) { return document.getElementById(id); }
function piLabel(v) {
  var k = Math.round(v / Math.PI * 2) / 2;
  if (Math.abs(k) < 1e-9) return '0';
  return (k === 1 ? '' : L.fmtNum(k, k % 1 ? 1 : 0)) + 'π';
}
function wrap(a) { a = a % TAU; return a < 0 ? a + TAU : a; }
function deg(r) { return r * 180 / Math.PI; }
function rad(d) { return d * Math.PI / 180; }
function sgn(x, d) { return (x < 0 ? '−' : '') + L.fmtNum(Math.abs(x), d); }
function plotY(p, top) { p.y = [-top, top]; }

function phasor(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { um: 10, ph: 30, speed: 0.25, two: false, um2: 6, ph2: 120, run: true, th: 0 };
  var plot = new C.Plot(cvs[1], { x: [0, TAU], y: [-14, 14], xt: 4, yt: 4, xl: 'ωt', yl: 'u (V)', pad: { l: 44, r: 14, t: 20, b: 34 }, xf: piLabel, yf: function (v) { return L.fmtNum(v, 0); } });
  var out = { calc: $('p-calc'), result: $('p-result'), note: $('p-note') };

  function vec() {
    var a = { re: st.um * Math.cos(rad(st.ph)), im: st.um * Math.sin(rad(st.ph)) };
    var b = st.two ? { re: st.um2 * Math.cos(rad(st.ph2)), im: st.um2 * Math.sin(rad(st.ph2)) } : { re: 0, im: 0 };
    var s = { re: a.re + b.re, im: a.im + b.im };
    return { a: a, b: b, s: s, sm: Math.hypot(s.re, s.im), sp: deg(Math.atan2(s.im, s.re)) };
  }
  function readout() {
    var v = vec();
    if (!st.two) {
      out.calc.textContent = 'u(t) = ' + L.fmtNum(st.um, 0) + '·sin(ωt ' + (st.ph < 0 ? '− ' : '+ ') + L.fmtNum(Math.abs(st.ph), 0) + '°)';
      out.result.textContent = 'U_m = ' + L.fmtNum(st.um, 0) + ' V · φ = ' + L.fmtNum(st.ph, 0) + '°';
      out.note.textContent = L.tr('Strelica dužine U_m obrće se suprotno kazaljci na satu, a njena projekcija na vertikalnu osu je u(t).', 'An arrow of length U_m turns counter-clockwise and its projection on the vertical axis is u(t).');
    } else {
      out.calc.textContent = 'u₁ + u₂ = ' + L.fmtNum(st.um, 0) + '·sin(ωt+' + L.fmtNum(st.ph, 0) + '°) + ' + L.fmtNum(st.um2, 0) + '·sin(ωt+' + L.fmtNum(st.ph2, 0) + '°)';
      out.result.textContent = 'U_m = ' + L.fmtNum(v.sm, 2) + ' V · φ = ' + L.fmtNum(v.sp, 1) + '°';
      out.note.textContent = L.tr('Zbir dva sinusa je opet sinus iste učestanosti. Njegov fazor je vektorski zbir fazora u₁ i u₂.', 'The sum of two sines is again a sine of the same frequency. Its phasor is the vector sum of the phasors u₁ and u₂.');
    }
  }
  L.range('p-um', { obj: st, key: 'um', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: readout });
  L.range('p-ph', { obj: st, key: 'ph', fmt: function (v) { return L.fmtNum(v, 0) + '°'; }, on: readout });
  L.range('p-um2', { obj: st, key: 'um2', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: readout });
  L.range('p-ph2', { obj: st, key: 'ph2', fmt: function (v) { return L.fmtNum(v, 0) + '°'; }, on: readout });
  L.range('p-sp', { obj: st, key: 'speed', fmt: function (v) { return L.fmtNum(v, 2) + ' ' + L.tr('o/s', 'rev/s'); } });
  $('p-run').addEventListener('change', function (e) { st.run = e.target.checked; });
  $('p-two').addEventListener('change', function (e) {
    st.two = e.target.checked;
    fig.querySelectorAll('.only-two').forEach(function (el) { el.hidden = !st.two; });
    readout();
  });
  fig.querySelectorAll('.only-two').forEach(function (el) { el.hidden = true; });
  L.onLang(readout);

  var LW = 360, LH = 236, CX = 130, CY = 118, RAD = 84;
  C.scene(fig, function (c, s, dt) {
    if (st.run) st.th = wrap(st.th + dt * st.speed * TAU);
    var v = vec(), top = Math.max(st.um + (st.two ? st.um2 : 0), 1) * 1.12, k = RAD / top;
    var th = st.th;
    c.save();
    C.fit(c, s, LW, LH);
    c.strokeStyle = 'rgba(201,214,226,.35)';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(CX - RAD - 10, CY); c.lineTo(CX + RAD + 10, CY); c.moveTo(CX, CY - RAD - 10); c.lineTo(CX, CY + RAD + 10); c.stroke();
    c.setLineDash([3, 4]);
    c.beginPath(); c.arc(CX, CY, Math.hypot(v.s.re, v.s.im) * k, 0, TAU); c.stroke();
    c.setLineDash([]);
    C.label(c, 'Re', CX + RAD + 4, CY + 12, 'rgba(201,214,226,.6)', 'right', 11);
    C.label(c, 'Im', CX + 12, CY - RAD - 4, 'rgba(201,214,226,.6)', 'left', 11);

    function rot(p) { var m = Math.hypot(p.re, p.im), a = Math.atan2(p.im, p.re) + th; return { x: CX + m * k * Math.cos(a), y: CY - m * k * Math.sin(a) }; }
    var p1 = rot(v.a);
    var barX = 300;
    c.strokeStyle = 'rgba(201,214,226,.4)';
    c.beginPath(); c.moveTo(barX, CY - RAD - 6); c.lineTo(barX, CY + RAD + 6); c.stroke();
    C.label(c, 'u', barX + 12, CY - RAD, 'rgba(201,214,226,.7)', 'left', 12);
    C.arrow(c, CX, CY, p1.x, p1.y, st.two ? COL.a : COL.f, 2.4, 10);
    var tip = p1;
    if (st.two) {
      var p2 = rot(v.b), sm = rot(v.s);
      var q = { x: p1.x + (p2.x - CX), y: p1.y + (p2.y - CY) };
      c.setLineDash([3, 3]);
      c.strokeStyle = 'rgba(255,180,104,.55)';
      c.beginPath(); c.moveTo(p1.x, p1.y); c.lineTo(q.x, q.y); c.stroke();
      c.strokeStyle = 'rgba(108,198,238,.55)';
      c.beginPath(); c.moveTo(p2.x, p2.y); c.lineTo(q.x, q.y); c.stroke();
      c.setLineDash([]);
      C.arrow(c, CX, CY, p2.x, p2.y, COL.b, 2.4, 10);
      C.arrow(c, CX, CY, sm.x, sm.y, COL.c, 3, 11);
      tip = sm;
      C.label(c, 'u₁', p1.x + 8, p1.y - 8, COL.a, 'left', 12);
      C.label(c, 'u₂', p2.x + 8, p2.y - 8, COL.b, 'left', 12);
      C.label(c, 'u₁+u₂', sm.x + 8, sm.y + 10, COL.c, 'left', 12);
    }
    c.setLineDash([4, 4]);
    c.strokeStyle = 'rgba(238,243,247,.6)';
    c.beginPath(); c.moveTo(tip.x, tip.y); c.lineTo(barX, tip.y); c.stroke();
    c.setLineDash([]);
    c.fillStyle = COL.w;
    c.beginPath(); c.arc(barX, tip.y, 5, 0, TAU); c.fill();

    c.strokeStyle = 'rgba(245,200,76,.6)';
    c.lineWidth = 1.5;
    c.beginPath(); c.arc(CX, CY, 26, -th, -th - rad(st.ph), st.ph > 0); c.stroke();
    c.restore();

    plotY(plot, top);
    if (plot.begin()) {
      var f1 = function (x) { return v.a.re * Math.sin(x) + v.a.im * Math.cos(x); };
      var f2 = function (x) { return v.b.re * Math.sin(x) + v.b.im * Math.cos(x); };
      if (st.two) {
        plot.line(f1, 'rgba(108,198,238,.8)', 1.6);
        plot.line(f2, 'rgba(255,180,104,.8)', 1.6);
        plot.line(function (x) { return f1(x) + f2(x); }, COL.c, 2.6);
      } else plot.line(f1, COL.f, 2.6);
      plot.vline(th, 'rgba(238,243,247,.5)', 1, [4, 4]);
      plot.dot(th, st.two ? f1(th) + f2(th) : f1(th), COL.w, 5);
    }
  });
  readout();
}

function complexLab(id) {
  var fig = $(id);
  var st = { a1: 3, b1: 2, a2: 1, b2: 3, op: 'add' };
  var cv = fig.querySelector('canvas');
  var rng = 6;
  var hit = 0;
  function sync() {
    ['a1', 'b1', 'a2', 'b2'].forEach(function (k) {
      var el = $('c-' + k);
      el.value = st[k];
      $('c-' + k + '-out').textContent = L.fmtNum(st[k], 1);
    });
    readout();
  }
  ['a1', 'b1', 'a2', 'b2'].forEach(function (k) {
    $('c-' + k).addEventListener('input', function (e) { st[k] = parseFloat(e.target.value); $('c-' + k + '-out').textContent = L.fmtNum(st[k], 1); readout(); });
  });
  C.toggle($('c-op'), function (v) { st.op = v; readout(); });
  function res() {
    var z1 = { re: st.a1, im: st.b1 }, z2 = { re: st.a2, im: st.b2 };
    if (st.op === 'add') return { re: z1.re + z2.re, im: z1.im + z2.im };
    if (st.op === 'sub') return { re: z1.re - z2.re, im: z1.im - z2.im };
    if (st.op === 'mul') return { re: z1.re * z2.re - z1.im * z2.im, im: z1.re * z2.im + z1.im * z2.re };
    var d = z2.re * z2.re + z2.im * z2.im;
    if (d < 1e-9) return null;
    return { re: (z1.re * z2.re + z1.im * z2.im) / d, im: (z1.im * z2.re - z1.re * z2.im) / d };
  }
  function cs(re, im, d) { return L.fmtNum(re, d) + (im < 0 ? ' − j' : ' + j') + L.fmtNum(Math.abs(im), d); }
  function pol(re, im) { return L.fmtNum(Math.hypot(re, im), 2) + '∠' + L.fmtNum(deg(Math.atan2(im, re)), 1) + '°'; }
  function readout() {
    var r = res(), sym = { add: '+', sub: '−', mul: '·', div: '/' }[st.op];
    $('c-calc').innerHTML = 'Z₁ = ' + cs(st.a1, st.b1, 1) + ' = ' + pol(st.a1, st.b1) + '<br>Z₂ = ' + cs(st.a2, st.b2, 1) + ' = ' + pol(st.a2, st.b2);
    $('c-result').innerHTML = r ? 'Z₁ ' + sym + ' Z₂ = ' + cs(r.re, r.im, 2) + '<br>= ' + pol(r.re, r.im) : L.tr('Deljenje nulom nije moguće', 'Division by zero is not possible');
    $('c-note').textContent = { add: L.tr('Sabiranje i oduzimanje je lakše u algebarskom (pravouglom) obliku: sabiraju se posebno realni, posebno imaginarni delovi.', 'Adding and subtracting is easier in rectangular form: real parts and imaginary parts are added separately.'),
      sub: L.tr('Sabiranje i oduzimanje je lakše u algebarskom (pravouglom) obliku: sabiraju se posebno realni, posebno imaginarni delovi.', 'Adding and subtracting is easier in rectangular form: real parts and imaginary parts are added separately.'),
      mul: L.tr('Množenje je lakše u polarnom obliku: moduli se množe, a uglovi sabiraju.', 'Multiplying is easier in polar form: the moduli multiply and the angles add.'),
      div: L.tr('Deljenje je lakše u polarnom obliku: moduli se dele, a uglovi oduzimaju.', 'Dividing is easier in polar form: the moduli divide and the angles subtract.') }[st.op];
  }
  L.onLang(readout);
  var LW = 360, LH = 300;
  var geo = {};
  C.scene(fig, function (c, s) {
    c.save();
    var kf = C.fit(c, s, LW, LH);
    var cx = LW / 2, cy = LH / 2, u = (Math.min(LW, LH) / 2 - 18) / rng;
    geo = { cx: cx, cy: cy, u: u, kf: kf, ox: (s.w - LW * kf) / 2, oy: (s.h - LH * kf) / 2 };
    c.strokeStyle = 'rgba(201,214,226,.12)';
    c.lineWidth = 1;
    for (var i = -rng; i <= rng; i++) {
      c.beginPath(); c.moveTo(cx + i * u, cy - rng * u); c.lineTo(cx + i * u, cy + rng * u); c.stroke();
      c.beginPath(); c.moveTo(cx - rng * u, cy + i * u); c.lineTo(cx + rng * u, cy + i * u); c.stroke();
    }
    c.strokeStyle = 'rgba(201,214,226,.55)';
    c.beginPath(); c.moveTo(cx - rng * u, cy); c.lineTo(cx + rng * u, cy); c.moveTo(cx, cy - rng * u); c.lineTo(cx, cy + rng * u); c.stroke();
    C.label(c, 'Re', cx + rng * u - 4, cy + 12, 'rgba(201,214,226,.7)', 'right', 11);
    C.label(c, 'j·Im', cx + 6, cy - rng * u + 8, 'rgba(201,214,226,.7)', 'left', 11);
    function P(re, im) { return [cx + re * u, cy - im * u]; }
    var a = P(st.a1, st.b1), b = P(st.a2, st.b2), r = res();
    C.arrow(c, cx, cy, a[0], a[1], COL.a, 2.4, 10);
    C.arrow(c, cx, cy, b[0], b[1], COL.b, 2.4, 10);
    if (r && Math.abs(r.re) < rng * 1.5 && Math.abs(r.im) < rng * 1.5) {
      var rp = P(Math.max(-rng, Math.min(rng, r.re)), Math.max(-rng, Math.min(rng, r.im)));
      if (st.op === 'add') {
        c.setLineDash([3, 3]); c.strokeStyle = 'rgba(201,214,226,.45)';
        c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(rp[0], rp[1]); c.moveTo(b[0], b[1]); c.lineTo(rp[0], rp[1]); c.stroke(); c.setLineDash([]);
      }
      C.arrow(c, cx, cy, rp[0], rp[1], COL.c, 3, 11);
      C.label(c, 'Z', rp[0] + 10, rp[1] - 10, COL.c, 'left', 13);
    }
    [[a, COL.a, 'Z₁'], [b, COL.b, 'Z₂']].forEach(function (q) {
      c.fillStyle = q[1];
      c.beginPath(); c.arc(q[0][0], q[0][1], 6.5, 0, TAU); c.fill();
      C.label(c, q[2], q[0][0] + 10, q[0][1] - 11, q[1], 'left', 13);
    });
    c.restore();
  });
  var pick = null;
  function toVal(e) {
    var r = cv.getBoundingClientRect(), x = (e.clientX - r.left - geo.ox) / geo.kf, y = (e.clientY - r.top - geo.oy) / geo.kf;
    return [(x - geo.cx) / geo.u, -(y - geo.cy) / geo.u];
  }
  cv.style.touchAction = 'none';
  cv.addEventListener('pointerdown', function (e) {
    if (!geo.u) return;
    var v = toVal(e), d1 = Math.hypot(v[0] - st.a1, v[1] - st.b1), d2 = Math.hypot(v[0] - st.a2, v[1] - st.b2);
    pick = d1 <= d2 ? 1 : 2;
    cv.setPointerCapture(e.pointerId);
    move(e);
  });
  function move(e) {
    if (!pick) return;
    var v = toVal(e), x = Math.round(Math.max(-rng, Math.min(rng, v[0])) * 2) / 2, y = Math.round(Math.max(-rng, Math.min(rng, v[1])) * 2) / 2;
    st['a' + pick] = x; st['b' + pick] = y;
    sync();
  }
  cv.addEventListener('pointermove', move);
  cv.addEventListener('pointerup', function () { pick = null; });
  cv.addEventListener('pointercancel', function () { pick = null; });
  sync();
}

function waveform(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { um: 10, f: 50, ph: 0, im: 6, phi: -60, cur: false };
  var plot = new C.Plot(cvs[0], { x: [0, 40], y: [-12, 12], xt: 8, yt: 4, xl: 't (ms)', yl: 'u (V)', pad: { l: 44, r: 14, t: 20, b: 34 }, xf: function (v) { return L.fmtNum(v, 0); }, yf: function (v) { return L.fmtNum(v, 0); } });
  function readout() {
    var T = 1000 / st.f;
    $('w-calc').textContent = 'T = 1/f = ' + L.fmtNum(T, 2) + ' ms · ω = 2πf = ' + L.fmtNum(TAU * st.f, 1) + ' rad/s';
    $('w-result').textContent = 'U_ef = U_m/√2 = ' + L.fmtNum(st.um / Math.SQRT2, 2) + ' V · U_sr = 2U_m/π = ' + L.fmtNum(2 * st.um / Math.PI, 2) + ' V';
    var d = st.ph - st.phi;
    $('w-note').textContent = st.cur
      ? L.tr('Fazna razlika φ = φu − φi = ' + L.fmtNum(d, 0) + '°. ' + (d > 0 ? 'Napon prednjači struji.' : d < 0 ? 'Struja prednjači naponu.' : 'Napon i struja su u fazi.'), 'Phase difference φ = φu − φi = ' + L.fmtNum(d, 0) + '°. ' + (d > 0 ? 'The voltage leads the current.' : d < 0 ? 'The current leads the voltage.' : 'Voltage and current are in phase.'))
      : '';
  }
  function upd() { readout(); }
  L.range('w-um', { obj: st, key: 'um', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: upd });
  L.range('w-f', { obj: st, key: 'f', fmt: function (v) { return L.fmtNum(v, 0) + ' Hz'; }, on: upd });
  L.range('w-ph', { obj: st, key: 'ph', fmt: function (v) { return L.fmtNum(v, 0) + '°'; }, on: upd });
  L.range('w-im', { obj: st, key: 'im', fmt: function (v) { return L.fmtNum(v, 0) + ' A'; }, on: upd });
  L.range('w-phi', { obj: st, key: 'phi', fmt: function (v) { return L.fmtNum(v, 0) + '°'; }, on: upd });
  $('w-cur').addEventListener('change', function (e) {
    st.cur = e.target.checked;
    fig.querySelectorAll('.only-cur').forEach(function (el) { el.hidden = !st.cur; });
    upd();
  });
  fig.querySelectorAll('.only-cur').forEach(function (el) { el.hidden = true; });
  L.onLang(readout);
  function draw() {
    var T = 1000 / st.f, tmax = 2 * T;
    plot.x = [0, tmax];
    plot.xf = function (v) { return L.fmtNum(v, tmax < 16 ? 1 : 0); };
    plot.y = [-st.um * 1.2, st.um * 1.2];
    if (!plot.begin()) return;
    var uf = function (t) { return st.um * Math.sin(TAU * st.f * t / 1000 + rad(st.ph)); };
    var kI = st.um / Math.max(st.im, 1e-9);
    var ifn = function (t) { return st.im * kI * Math.sin(TAU * st.f * t / 1000 + rad(st.phi)); };
    var ur = st.um / Math.SQRT2;
    plot.hline(ur, 'rgba(111,207,151,.8)', 1.3, [6, 4]);
    plot.hline(-ur, 'rgba(111,207,151,.8)', 1.3, [6, 4]);
    plot.text('U_ef', tmax, ur, COL.c, 'right', -4, -9);
    plot.hline(st.um, 'rgba(201,214,226,.35)', 1, [2, 4]);
    plot.text('U_m', 0, st.um, '#c9d6e2', 'left', 5, -9);
    plot.line(uf, COL.a, 2.6);
    if (st.cur) plot.line(ifn, COL.b, 2.4);
    {
      var t0 = ((-st.ph / 360) * T % T + T) % T;
      var t1 = t0 + T;
      if (t1 < tmax) {
        plot.vline(t0, 'rgba(245,200,76,.7)', 1.2, [3, 3]);
        plot.vline(t1, 'rgba(245,200,76,.7)', 1.2, [3, 3]);
        plot.text('T', (t0 + t1) / 2, -st.um * 1.05, COL.f, 'center');
      }
    }
  }
  L.loop(fig, draw);
  new ResizeObserver(draw).observe(cvs[0]);
  readout();
}

function element(id, type) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { um: 10, f: 50, val: type === 'R' ? 100 : type === 'L' ? 200 : 20, th: 0, flow: 0, speed: 0.25 };
  var shift = type === 'R' ? 0 : type === 'L' ? -Math.PI / 2 : Math.PI / 2;
  var plotUI = new C.Plot(cvs[1], { x: [0, 2 * TAU], y: [-1.3, 1.3], xt: 8, yt: 2, xl: 'ωt', pad: { l: 14, r: 14, t: 16, b: 34 }, xf: piLabel, yf: function () { return ''; } });
  var plotP = new C.Plot(cvs[2], { x: [0, 2 * TAU], y: [-1, 1], xt: 8, yt: 2, xl: 'ωt', yl: 'p(t)', pad: { l: 14, r: 14, t: 16, b: 34 }, xf: piLabel, yf: function () { return ''; } });
  function Z() {
    var w = TAU * st.f;
    if (type === 'R') return st.val;
    if (type === 'L') return w * st.val / 1000;
    return 1 / (w * st.val * 1e-6);
  }
  function readout() {
    var z = Z(), im = st.um / z, sym = type === 'R' ? 'R' : type === 'L' ? 'X_L' : 'X_C';
    var calc = type === 'R' ? 'R = ' + L.fmtNum(st.val, 0) + ' Ω'
      : type === 'L' ? 'X_L = ωL = 2π·' + L.fmtNum(st.f, 0) + '·' + L.fmtNum(st.val / 1000, 3) + ' = ' + L.fmtNum(z, 1) + ' Ω'
      : 'X_C = 1/(ωC) = 1/(2π·' + L.fmtNum(st.f, 0) + '·' + L.fmtNum(st.val, 0) + ' μF) = ' + L.fmtNum(z, 1) + ' Ω';
    $(id + '-calc').textContent = calc;
    $(id + '-result').textContent = 'I_m = U_m/' + sym + ' = ' + L.fmtNum(st.um, 0) + '/' + L.fmtNum(z, 1) + ' = ' + (im < 1 ? L.fmtNum(im * 1000, 1) + ' mA' : L.fmtNum(im, 2) + ' A');
    var P = type === 'R' ? st.um * im / 2 : 0;
    $(id + '-note').textContent = type === 'R'
      ? L.tr('Struja i napon su u fazi. Srednja snaga P = U_ef·I_ef = ' + L.fmtNum(P, 2) + ' W, a trenutna snaga nikad nije negativna.', 'Current and voltage are in phase. The average power P = U_rms·I_rms = ' + L.fmtNum(P, 2) + ' W, and the instantaneous power is never negative.')
      : type === 'L'
        ? L.tr('Struja kasni za naponom 90°. Srednja snaga je nula: kalem naizmenično prima i vraća energiju.', 'The current lags the voltage by 90°. The average power is zero: the coil alternately takes in and gives back energy.')
        : L.tr('Struja prednjači naponu 90°. Srednja snaga je nula: kondenzator naizmenično prima i vraća energiju.', 'The current leads the voltage by 90°. The average power is zero: the capacitor alternately takes in and gives back energy.');
  }
  L.range(id + '-um', { obj: st, key: 'um', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: readout });
  if ($(id + '-f')) L.range(id + '-f', { obj: st, key: 'f', fmt: function (v) { return L.fmtNum(v, 0) + ' Hz'; }, on: readout });
  L.range(id + '-val', { obj: st, key: 'val', fmt: function (v) { return type === 'R' ? L.fmtNum(v, 0) + ' Ω' : type === 'L' ? L.fmtNum(v, 0) + ' mH' : L.fmtNum(v, 0) + ' μF'; }, on: readout });
  L.onLang(readout);

  var LW = 360, LH = 190;
  function drawCircuit(c, s, dt) {
    st.th = wrap(st.th + dt * st.speed * TAU);
    var th = st.th, u = Math.sin(th), i = Math.sin(th + shift);
    st.flow += i * dt * 70;
    c.save();
    C.fit(c, s, LW, LH);

    c.strokeStyle = 'rgba(201,214,226,.75)';
    c.lineWidth = 2;
    c.lineJoin = 'round';
    c.beginPath(); c.moveTo(40, 40); c.lineTo(112, 40); c.moveTo(188, 40); c.lineTo(250, 40); c.lineTo(250, 150); c.lineTo(40, 150); c.lineTo(40, 40); c.stroke();

    c.fillStyle = 'rgba(15,22,30,.95)';
    c.strokeStyle = COL.a;
    c.lineWidth = 2.4;
    c.beginPath(); c.arc(40, 95, 22, 0, TAU); c.fill(); c.stroke();
    c.strokeStyle = COL.a;
    c.lineWidth = 2;
    c.beginPath();
    for (var k = 0; k <= 20; k++) { var xx = 29 + k * 22 / 20, yy = 95 - 7 * Math.sin(k / 20 * TAU); if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
    c.stroke();
    C.label(c, 'u', 40 + 36, 95, COL.a, 'left', 13);

    c.strokeStyle = COL.b;
    c.lineWidth = 2.6;
    c.lineCap = 'round';
    if (type === 'R') {
      c.fillStyle = 'rgba(15,22,30,.95)';
      c.beginPath(); c.rect(112, 30, 76, 20); c.fill(); c.stroke();
    } else if (type === 'L') {
      c.beginPath(); c.moveTo(112, 40);
      for (var n = 0; n < 4; n++) c.arc(124 + n * 19, 40, 9.5, Math.PI, 0);
      c.lineTo(188, 40); c.stroke();
    } else {
      c.beginPath(); c.moveTo(112, 40); c.lineTo(143, 40); c.moveTo(143, 20); c.lineTo(143, 60); c.moveTo(157, 20); c.lineTo(157, 60); c.moveTo(157, 40); c.lineTo(188, 40); c.stroke();
    }
    C.label(c, type, 150, type === 'R' ? 66 : 76, COL.b, 'center', 14);

    var tmp = [[40, 40], [250, 40], [250, 150], [40, 150], [40, 40]];
    var a = Math.abs(i), n2 = 18;
    c.fillStyle = 'rgba(255,180,104,' + (0.25 + 0.75 * a) + ')';
    for (var d = 0; d < n2; d++) {
      var p = C.pathAt(tmp, st.flow + d * (640 / n2));
      c.beginPath(); c.arc(p[0], p[1], 3.2, 0, TAU); c.fill();
    }

    C.label(c, i > 0.05 ? '→ i' : i < -0.05 ? '← i' : 'i = 0', 150, 18, COL.b, 'center', 12);

    var px = 300, py = 100, r = 46;
    c.strokeStyle = 'rgba(201,214,226,.3)';
    c.lineWidth = 1;
    c.beginPath(); c.arc(px, py, r, 0, TAU); c.stroke();
    c.beginPath(); c.moveTo(px - r - 6, py); c.lineTo(px + r + 6, py); c.moveTo(px, py - r - 6); c.lineTo(px, py + r + 6); c.stroke();
    C.arrow(c, px, py, px + r * Math.cos(th), py - r * Math.sin(th), COL.a, 2.6, 9);
    C.arrow(c, px, py, px + r * 0.8 * Math.cos(th + shift), py - r * 0.8 * Math.sin(th + shift), COL.b, 2.6, 9);
    C.label(c, 'U', px + (r + 9) * Math.cos(th), py - (r + 9) * Math.sin(th), COL.a, 'center', 12);
    C.label(c, 'I', px + (r * 0.8 + 9) * Math.cos(th + shift), py - (r * 0.8 + 9) * Math.sin(th + shift), COL.b, 'center', 12);
    C.label(c, type === 'R' ? 'φ = 0°' : type === 'L' ? 'φ = +90°' : 'φ = −90°', px, py + r + 20, COL.f, 'center', 12);
    c.restore();

    if (plotUI.begin()) {
      plotUI.line(function (x) { return Math.sin(x); }, COL.a, 2.6);
      plotUI.line(function (x) { return Math.sin(x + shift); }, COL.b, 2.4);
      plotUI.vline(th, 'rgba(238,243,247,.45)', 1, [4, 4]);
      plotUI.vline(th + TAU, 'rgba(238,243,247,.2)', 1, [4, 4]);
      plotUI.text('u', 0.05, 1.05, COL.a, 'left', 4);
      plotUI.text('i', 0.5, type === 'R' ? 0.8 : 1.05, COL.b, 'left', 4);
      plotUI.dot(th, Math.sin(th), COL.a, 4.5);
      plotUI.dot(th, Math.sin(th + shift), COL.b, 4.5);
    }
    if (plotP.begin()) {
      var pf = function (x) { return Math.sin(x) * Math.sin(x + shift); };
      plotP.fillBetween(function (x) { return Math.max(0, pf(x)); }, 'rgba(111,207,151,.35)', 0);
      plotP.fillBetween(function (x) { return Math.min(0, pf(x)); }, 'rgba(242,139,130,.35)', 0);
      plotP.line(pf, COL.c, 2.2);
      plotP.hline(type === 'R' ? 0.5 : 0, 'rgba(245,200,76,.9)', 1.3, [6, 4]);
      plotP.text(type === 'R' ? 'P' : 'P = 0', TAU * 2, type === 'R' ? 0.5 : 0, COL.f, 'right', -4, -9);
      plotP.vline(th, 'rgba(238,243,247,.45)', 1, [4, 4]);
    }
  }
  L.loop(fig, function (dt) {
    if (!cvs[0].clientWidth) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = cvs[0].clientWidth, h = cvs[0].clientHeight;
    if (cvs[0].width !== Math.round(w * dpr)) { cvs[0].width = Math.round(w * dpr); cvs[0].height = Math.round(h * dpr); }
    var c = cvs[0].getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    drawCircuit(c, { w: w, h: h }, dt);
  });
  readout();
}

function dcCharge(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { R: 1000, C: 100, E: 10, charging: true, vc: 0, t: 0, hist: [] };
  var plot = new C.Plot(cvs[1], { x: [0, 5], y: [0, 11], xt: 5, yt: 5, xl: 't / τ', yl: 'U_C (V)', pad: { l: 44, r: 14, t: 20, b: 34 }, xf: function (v) { return L.fmtNum(v, 0); }, yf: function (v) { return L.fmtNum(v, 0); } });
  function tau() { return st.R * st.C * 1e-6; }
  function readout() {
    var t = tau();
    $('d-calc').textContent = 'τ = R·C = ' + L.fmtNum(st.R, 0) + ' Ω · ' + L.fmtNum(st.C, 0) + ' μF = ' + L.fmtNum(t * 1000, 0) + ' ms';
    $('d-result').textContent = 'U_C = ' + L.fmtNum(st.vc, 2) + ' V · i = ' + L.fmtNum(((st.charging ? st.E : 0) - st.vc) / st.R * 1000, 2) + ' mA';
    $('d-note').textContent = L.tr('Posle jedne vremenske konstante napon dostiže 63 % konačne vrednosti, a posle pet je kondenzator praktično pun.', 'After one time constant the voltage reaches 63 % of the final value, and after five the capacitor is practically full.');
  }
  L.range('d-r', { obj: st, key: 'R', fmt: function (v) { return L.fmtNum(v, 0) + ' Ω'; }, on: readout });
  L.range('d-c', { obj: st, key: 'C', fmt: function (v) { return L.fmtNum(v, 0) + ' μF'; }, on: readout });
  function setMode(chg) { st.charging = chg; st.t = 0; st.v0 = st.vc; st.hist = []; C.setSeg($('d-mode'), chg ? 'chg' : 'dis'); readout(); }
  C.toggle($('d-mode'), function (v) { setMode(v === 'chg'); });
  $('d-reset').addEventListener('click', function () { st.vc = 0; setMode(true); });
  st.v0 = 0;
  L.onLang(readout);
  var LW = 360, LH = 190;
  L.loop(fig, function (dt) {
    var w = cvs[0].clientWidth, h = cvs[0].clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cvs[0].width !== Math.round(w * dpr)) { cvs[0].width = Math.round(w * dpr); cvs[0].height = Math.round(h * dpr); }
    var c = cvs[0].getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    var tt = tau(), sim = dt * tt / 1.2;
    st.t += sim;
    var target = st.charging ? st.E : 0;
    st.vc = target + (st.v0 - target) * Math.exp(-st.t / tt);
    st.hist.push([st.t / tt, st.vc]);
    if (st.hist.length > 2000) st.hist.shift();
    var cur = (target - st.vc) / st.R;
    c.save();
    C.fit(c, { w: w, h: h }, LW, LH);
    c.strokeStyle = 'rgba(201,214,226,.75)'; c.lineWidth = 2; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(50, 40); c.lineTo(130, 40); c.moveTo(190, 40); c.lineTo(290, 40); c.lineTo(290, 85); c.moveTo(290, 105); c.lineTo(290, 150); c.lineTo(50, 150); c.lineTo(50, 40); c.stroke();

    c.strokeStyle = COL.a; c.lineWidth = 3;
    c.beginPath(); c.moveTo(50, 40); c.lineTo(50, 82); c.moveTo(38, 82); c.lineTo(62, 82); c.stroke();
    c.lineWidth = 3; c.beginPath(); c.moveTo(43, 92); c.lineTo(57, 92); c.stroke();
    C.label(c, 'E', 24, 88, COL.a, 'center', 13);

    c.strokeStyle = COL.b; c.lineWidth = 2.6; c.fillStyle = 'rgba(15,22,30,.95)';
    c.beginPath(); c.rect(130, 30, 60, 20); c.fill(); c.stroke();
    C.label(c, 'R', 160, 64, COL.b, 'center', 13);

    c.strokeStyle = COL.c; c.lineWidth = 3;
    c.beginPath(); c.moveTo(270, 85); c.lineTo(310, 85); c.moveTo(270, 105); c.lineTo(310, 105); c.stroke();
    var q = Math.max(0, Math.min(1, st.vc / st.E));
    c.fillStyle = 'rgba(111,207,151,' + (0.15 + 0.6 * q) + ')';
    c.fillRect(272, 87, 36, 16);
    c.fillStyle = '#eef3f7'; c.font = '700 12px "IBM Plex Mono", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
    var m = Math.round(q * 5);
    for (var k = 0; k < m; k++) { c.fillText('+', 276 + k * 7, 80); c.fillText('−', 276 + k * 7, 112); }
    C.label(c, 'C', 330, 95, COL.c, 'center', 13);

    C.label(c, st.charging ? L.tr('puni se', 'charging') : L.tr('prazni se', 'discharging'), 180, 120, COL.f, 'center', 12);

    var path = [[50, 40], [290, 40], [290, 150], [50, 150], [50, 40]];
    st.flow = (st.flow || 0) + (st.charging ? 1 : -1) * Math.abs(cur) / (st.E / st.R) * dt * 90;
    var a = Math.abs(cur) / (st.E / st.R);
    c.fillStyle = 'rgba(255,180,104,' + (0.15 + 0.85 * Math.min(1, a)) + ')';
    for (var d = 0; d < 16; d++) {
      var p = C.pathAt(path, st.flow + d * (640 / 16));
      c.beginPath(); c.arc(p[0], p[1], 3.2, 0, TAU); c.fill();
    }
    c.restore();
    if (plot.begin()) {
      var base = st.hist.length ? st.hist[0][0] : 0;
      plot.x = [Math.floor(Math.max(0, base)), Math.floor(Math.max(0, base)) + 5];
      plot.hline(st.E, 'rgba(201,214,226,.3)', 1, [3, 4]);
      plot.hline(0.632 * st.E, 'rgba(245,200,76,.5)', 1, [3, 4]);
      plot.clip();
      var cx = plot.ctx;
      cx.strokeStyle = COL.c; cx.lineWidth = 2.6; cx.beginPath();
      st.hist.forEach(function (p, ix) { var X = plot.X(p[0]), Y = plot.Y(p[1]); if (ix) cx.lineTo(X, Y); else cx.moveTo(X, Y); });
      cx.stroke();
      plot.unclip();
      if (st.hist.length) { var lp = st.hist[st.hist.length - 1]; plot.dot(lp[0], lp[1], COL.w, 4.5); }
      if (st.t / tt > 5.2) { st.v0 = st.vc; st.t = 0; st.hist = []; setMode(!st.charging); }
    }
    readout();
  });
  readout();
}

window.ACLAB = { phasor: phasor, complex: complexLab, waveform: waveform, element: element, dcCharge: dcCharge };
})();
