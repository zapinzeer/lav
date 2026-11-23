(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var COL = C.COL;
var TAU = Math.PI * 2;
var UT = 0.025;
var WIRE = 'rgba(201,214,226,.75)';
var BG = 'rgba(15,22,30,.95)';

function $(id) { return document.getElementById(id); }
function mA(x) { var a = Math.abs(x); return a < 1e-3 ? L.fmtNum(x * 1e6, a < 1e-5 ? 2 : 1) + ' μA' : L.fmtNum(x * 1e3, 2) + ' mA'; }
function volt(x) { return L.fmtNum(x, 2) + ' V'; }
function ohm(x) { return x >= 1e6 ? C.nice(x / 1e6, 3) + ' MΩ' : x >= 1e3 ? C.nice(x / 1e3, 3) + ' kΩ' : C.nice(x, 3) + ' Ω'; }

function prep(cv) {
  var w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return null;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  var c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);
  return { c: c, s: { w: w, h: h } };
}

function wires(c, segs, color, width) {
  c.save();
  c.strokeStyle = color || WIRE;
  c.lineWidth = width || 2;
  c.lineJoin = 'round';
  c.lineCap = 'round';
  c.beginPath();
  segs.forEach(function (pts) { pts.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); });
  c.stroke();
  c.restore();
}

function resistor(c, x, y, w, h, color, label, lx, ly) {
  c.save();
  c.fillStyle = BG;
  c.strokeStyle = color;
  c.lineWidth = 2.4;
  c.beginPath(); c.rect(x - w / 2, y - h / 2, w, h); c.fill(); c.stroke();
  c.restore();
  if (label) C.label(c, label, lx, ly, color, 'center', 12);
}

function battery(c, x, y, color, label, side) {
  c.save();
  c.fillStyle = BG;
  c.fillRect(x - 14, y - 7, 28, 14);
  c.strokeStyle = color;
  c.lineCap = 'round';
  c.lineWidth = 2.6;
  c.beginPath(); c.moveTo(x - 13, y - 4); c.lineTo(x + 13, y - 4); c.stroke();
  c.lineWidth = 4;
  c.beginPath(); c.moveTo(x - 7, y + 4); c.lineTo(x + 7, y + 4); c.stroke();
  c.restore();
  if (label) C.label(c, label, x + (side || -1) * 20, y, color, side > 0 ? 'left' : 'right', 12);
}

function transistor(c, bx, by, color) {
  c.save();
  c.strokeStyle = color;
  c.fillStyle = color;
  c.lineWidth = 2.4;
  c.lineCap = 'round';
  c.beginPath(); c.arc(bx + 10, by, 24, 0, TAU); c.fillStyle = BG; c.fill(); c.strokeStyle = 'rgba(201,214,226,.35)'; c.lineWidth = 1.2; c.stroke();
  c.strokeStyle = color;
  c.lineWidth = 3;
  c.beginPath(); c.moveTo(bx, by - 14); c.lineTo(bx, by + 14); c.stroke();
  c.lineWidth = 2.2;
  c.beginPath(); c.moveTo(bx - 24, by); c.lineTo(bx, by); c.stroke();
  c.beginPath(); c.moveTo(bx, by - 6); c.lineTo(bx + 22, by - 20); c.lineTo(bx + 22, by - 30); c.stroke();
  c.beginPath(); c.moveTo(bx, by + 6); c.lineTo(bx + 22, by + 20); c.lineTo(bx + 22, by + 30); c.stroke();
  c.restore();
  C.arrow(c, bx + 6, by + 9.8, bx + 19, by + 18.1, color, 2.2, 8);
}

function chip(c, text, x, y, color) {
  C.chipLabel(c, text, x, y, color, 11.5);
}

function modeName(m) {
  return m === 'cut' ? L.tr('zakočenje', 'cut-off') : m === 'sat' ? L.tr('zasićenje', 'saturation') : L.tr('aktivni režim', 'active mode');
}
function modeColor(m) { return m === 'cut' ? COL.d : m === 'sat' ? COL.e : COL.c; }

function dots(c, path, phase, alpha, n) {
  c.save();
  c.fillStyle = 'rgba(255,180,104,' + alpha + ')';
  var len = 0;
  for (var i = 1; i < path.length; i++) len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
  for (var k = 0; k < n; k++) {
    var p = C.pathAt(path, phase + k * len / n);
    c.beginPath(); c.arc(p[0], p[1], 2.8, 0, TAU); c.fill();
  }
  c.restore();
}

function outchar(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { ubb: 1.5, rb: 47, ucc: 12, rc: 2.2, beta: 150, fb: 0, fc: 0 };
  var res = {};
  var plot = new C.Plot(cvs[1], { x: [0, 15], y: [0, 10], xt: 5, yt: 5, xl: 'U_CE (V)', yl: 'I_C (mA)', pad: { l: 44, r: 14, t: 20, b: 34 }, xf: function (v) { return L.fmtNum(v, 0); }, yf: function (v) { return L.fmtNum(v, C.decs(v)); } });

  function icf(u, ib) { return st.beta * ib * (1 - Math.exp(-u / 0.12)) * (1 + u / 250); }
  function solve() {
    var ib = st.ubb > 0.7 ? (st.ubb - 0.7) / (st.rb * 1e3) : 0;
    var rc = st.rc * 1e3, lo = 0, hi = st.ucc;
    for (var k = 0; k < 60; k++) {
      var m = (lo + hi) / 2;
      if (icf(m, ib) - (st.ucc - m) / rc > 0) hi = m; else lo = m;
    }
    var u = (lo + hi) / 2, ic = (st.ucc - u) / rc;
    var mode = ib <= 0 ? 'cut' : u < 0.3 ? 'sat' : 'act';
    if (mode === 'cut') { ic = 0; u = st.ucc; }
    res = { ib: ib, ic: ic, uce: u, mode: mode, icsat: st.ucc / rc };
  }
  function readout() {
    solve();
    $(id + '-calc').textContent = (res.ib > 0 ? 'I_B = (U_BB − 0,7 V)/R_B = ' + mA(res.ib) : L.tr('U_BB < 0,7 V: spoj B–E ne vodi, I_B = 0', 'U_BB < 0.7 V: the B–E junction does not conduct, I_B = 0')).replace('0,7', L.fmtNum(0.7, 1)) +
      ' · I_C = ' + mA(res.ic) + ' · I_E = ' + mA(res.ic + res.ib) + ' · U_CE = ' + volt(res.uce);
    $(id + '-result').textContent = L.tr('Režim: ', 'Mode: ') + modeName(res.mode);
    $(id + '-note').textContent = res.mode === 'act'
      ? L.tr('I_C ≈ β·I_B = ' + mA(st.beta * res.ib) + '. Baza upravlja kolektorskom strujom, a tranzistor radi kao pojačavač.', 'I_C ≈ β·I_B = ' + mA(st.beta * res.ib) + '. The base controls the collector current and the transistor works as an amplifier.')
      : res.mode === 'sat'
        ? L.tr('β·I_B = ' + mA(st.beta * res.ib) + ' je više nego što kolo može da propusti (' + mA(res.icsat) + '). Struju ograničava R_C, a U_CE pada na nekoliko desetina volta.', 'β·I_B = ' + mA(st.beta * res.ib) + ' is more than the circuit can pass (' + mA(res.icsat) + '). R_C limits the current and U_CE drops to a few tenths of a volt.')
        : L.tr('Nema bazne struje, pa nema ni kolektorske. Ceo napon U_CC je na tranzistoru, kao na otvorenom prekidaču.', 'There is no base current, so there is no collector current either. The whole U_CC is across the transistor, like an open switch.');
  }
  L.range(id + '-ubb', { obj: st, key: 'ubb', fmt: function (v) { return L.fmtNum(v, 2) + ' V'; }, on: readout });
  L.range(id + '-rb', { obj: st, key: 'rb', fmt: function (v) { return L.fmtNum(v, 0) + ' kΩ'; }, on: readout });
  L.range(id + '-ucc', { obj: st, key: 'ucc', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: readout });
  L.range(id + '-rc', { obj: st, key: 'rc', fmt: function (v) { return L.fmtNum(v, 1) + ' kΩ'; }, on: readout });
  L.range(id + '-beta', { obj: st, key: 'beta', fmt: function (v) { return L.fmtNum(v, 0); }, on: readout });
  L.onLang(readout);

  var LW = 380, LH = 240;
  function drawCircuit(c, s, dt) {
    c.save();
    C.fit(c, s, LW, LH);
    var bx = 150, by = 130, cx = bx + 22;
    var baseP = [[40, 210], [40, 130], [bx, 130], [cx, by + 20], [cx, 210], [40, 210]];
    var colP = [[300, 210], [300, 40], [cx, 40], [cx, 210], [300, 210]];
    wires(c, [[[40, 210], [40, 130], [bx - 24, 130]], [[cx, by - 30], [cx, 40], [300, 40], [300, 210], [40, 210]], [[cx, by + 30], [cx, 210]]]);
    var ka = Math.min(1, res.ic / Math.max(res.icsat, 1e-9));
    st.fc += dt * 90 * ka;
    st.fb += dt * 60 * Math.min(1, res.ib * st.beta / Math.max(res.icsat, 1e-9));
    if (res.ic > 0) dots(c, colP, st.fc, 0.3 + 0.7 * ka, 18);
    if (res.ib > 0) dots(c, baseP.slice(0, 3), st.fb, 0.8, 6);
    resistor(c, 90, 130, 46, 16, COL.c, 'R_B', 90, 112);
    resistor(c, cx, 62, 16, 36, COL.c, 'R_C', cx - 22, 62);
    battery(c, 40, 172, COL.a, 'U_BB', 1);
    battery(c, 300, 128, COL.a, 'U_CC', 1);
    transistor(c, bx, by, COL.b);
    C.label(c, 'B', bx - 14, by - 10, COL.b, 'center', 11);
    C.label(c, 'C', cx + 10, by - 26, COL.b, 'left', 11);
    C.label(c, 'E', cx + 10, by + 26, COL.b, 'left', 11);
    chip(c, 'I_B = ' + mA(res.ib), 90, 152, COL.b);
    chip(c, 'I_C = ' + mA(res.ic), 236, 62, COL.b);
    chip(c, 'U_CE = ' + volt(res.uce), 236, 130, COL.f);
    chip(c, modeName(res.mode), 90, 26, modeColor(res.mode));
    c.restore();
  }

  function drawPlot() {
    var top = C.niceAxis(Math.max(res.icsat, st.beta * Math.max(res.ib, 1e-6) * 1.5) * 1e3 * 1.1);
    plot.x = [0, 15];
    plot.y = [0, top.max];
    plot.yt = top.ticks;
    if (!plot.begin()) return;
    var ibRef = res.ib > 0 ? res.ib : res.icsat / st.beta / 2;
    [0.25, 0.5, 0.75, 1, 1.25, 1.5].forEach(function (k) {
      var ib = ibRef * k, on = k === 1 && res.ib > 0;
      plot.line(function (u) { return icf(u, ib) * 1e3; }, on ? COL.b : 'rgba(255,180,104,.35)', on ? 2.6 : 1.4);
      var ye = icf(14.6, ib) * 1e3;
      if (ye < top.max * 0.97) plot.text(mA(ib), 14.6, ye, on ? COL.b : 'rgba(255,180,104,.6)', 'right', 0, -8);
    });
    var rc = st.rc * 1e3;
    plot.line(function (u) { return u <= st.ucc ? (st.ucc - u) / rc * 1e3 : -1; }, COL.f, 2, { dash: [6, 4] });
    plot.dot(res.uce, res.ic * 1e3, COL.w, 5.5);
    plot.text('Q', res.uce, res.ic * 1e3, COL.w, 'left', 8, -10);
    plot.text(L.tr('radna prava', 'load line'), st.ucc * 0.55, (st.ucc * 0.45) / rc * 1e3, COL.f, 'left', 6, -10);
  }

  L.loop(fig, function (dt) {
    var g = prep(cvs[0]);
    if (g) drawCircuit(g.c, g.s, dt);
    drawPlot();
  });
  readout();
}

function active(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { ic: 1, beta: 100, ua: 100 };
  var res = {};
  var IS = 1e-3 / Math.exp(0.65 / UT);
  var plot = new C.Plot(cvs[1], { x: [0.5, 0.8], y: [0, 10], xt: 6, yt: 4, xl: 'U_BE (V)', yl: 'I_B (μA)', pad: { l: 48, r: 14, t: 20, b: 34 }, xf: function (v) { return L.fmtNum(v, 2); }, yf: function (v) { return L.fmtNum(v, C.decs(v)); } });
  function calc() {
    var ic = st.ic * 1e-3, gm = ic / UT, rpi = st.beta / gm, ro = st.ua / ic;
    res = { ic: ic, ib: ic / st.beta, gm: gm, rpi: rpi, ro: ro, ube: UT * Math.log(ic / IS) };
  }
  function readout() {
    calc();
    $(id + '-calc').textContent = 'g_m = I_C/U_T = ' + mA(res.ic) + ' / 25 mV = ' + L.fmtNum(res.gm * 1e3, 1) + ' mS · r_π = β/g_m = ' + ohm(res.rpi) + ' · r_o = U_A/I_C = ' + ohm(res.ro);
    $(id + '-result').textContent = 'h₁₁ₑ ≈ ' + ohm(res.rpi) + ' · h₂₁ₑ ≈ ' + L.fmtNum(st.beta, 0) + ' · h₂₂ₑ ≈ ' + L.fmtNum(1e6 / res.ro, 1) + ' μS';
    $(id + '-note').textContent = L.tr('Radna tačka: U_BE = ' + volt(res.ube) + ', I_B = ' + mA(res.ib) + '. Nagib tangente na ulaznu karakteristiku je 1/r_π: što je veća struja, kriva je strmija i r_π manja.', 'Operating point: U_BE = ' + volt(res.ube) + ', I_B = ' + mA(res.ib) + '. The slope of the tangent to the input characteristic is 1/r_π: the larger the current, the steeper the curve and the smaller r_π.');
  }
  L.range(id + '-ic', { obj: st, key: 'ic', fmt: function (v) { return L.fmtNum(v, 1) + ' mA'; }, on: readout });
  L.range(id + '-beta', { obj: st, key: 'beta', fmt: function (v) { return L.fmtNum(v, 0); }, on: readout });
  L.range(id + '-ua', { obj: st, key: 'ua', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: readout });
  L.onLang(readout);

  var LW = 420, LH = 210, ph = 0;
  function drawModel(c, s, dt) {
    ph += dt * 3;
    c.save();
    C.fit(c, s, LW, LH);
    var yT = 50, yB = 170, xB = 30, xR = 120, xG = 260, xO = 330, xC = 390;
    wires(c, [[[xB, yT], [xR, yT], [xR, yB]], [[xB, yB], [xC, yB]], [[xG, yT], [xC, yT]], [[xG, yT], [xG, yB]], [[xO, yT], [xO, yB]]]);
    resistor(c, xR, 110, 16, 46, COL.c, null);
    resistor(c, xO, 110, 16, 46, COL.c, null);
    c.save();
    c.fillStyle = BG; c.strokeStyle = COL.b; c.lineWidth = 2.4;
    c.beginPath(); c.arc(xG, 110, 20, 0, TAU); c.fill(); c.stroke();
    c.restore();
    C.arrow(c, xG, 124, xG, 96, COL.b, 2.4, 8);
    [[xB, yT, 'B'], [xC, yT, 'C'], [xB, yB, 'E'], [xC, yB, 'E']].forEach(function (t) {
      c.save(); c.fillStyle = BG; c.strokeStyle = '#eef3f7'; c.lineWidth = 2; c.beginPath(); c.arc(t[0], t[1], 5, 0, TAU); c.fill(); c.stroke(); c.restore();
      C.label(c, t[2], t[0], t[1] - 16, '#eef3f7', 'center', 13);
    });
    C.label(c, 'r_π', xR - 16, 100, COL.c, 'right', 12);
    C.label(c, ohm(res.rpi), xR - 16, 120, COL.c, 'right', 11);
    C.label(c, 'g_m·u_be', xG - 26, 100, COL.b, 'right', 12);
    C.label(c, L.fmtNum(res.gm * 1e3, 1) + ' mS', xG - 26, 120, COL.b, 'right', 11);
    C.label(c, 'r_o', xO + 16, 100, COL.c, 'left', 12);
    C.label(c, ohm(res.ro), xO + 16, 120, COL.c, 'left', 11);
    C.label(c, 'i_b →', 70, yT - 12, COL.a, 'center', 11);
    C.label(c, '← i_c', xC - 30, yT - 12, COL.a, 'center', 11);
    var a = 0.35 + 0.3 * Math.sin(ph);
    C.label(c, '+', xR + 18, yT + 22, 'rgba(108,198,238,' + (a + 0.3) + ')', 'center', 13);
    C.label(c, '−', xR + 18, yB - 22, 'rgba(108,198,238,' + (a + 0.3) + ')', 'center', 13);
    C.label(c, 'u_be', xR + 18, 110, COL.a, 'left', 11);
    C.label(c, L.tr('ulaz', 'input'), xR, 196, 'rgba(201,214,226,.65)', 'center', 10.5);
    C.label(c, L.tr('izlaz', 'output'), (xG + xO) / 2, 196, 'rgba(201,214,226,.65)', 'center', 10.5);
    c.restore();
  }
  function drawPlot() {
    var top = C.niceAxis(res.ib * 1e6 * 2.4);
    plot.y = [0, top.max];
    plot.yt = top.ticks;
    if (!plot.begin()) return;
    var ibf = function (u) { return IS / st.beta * Math.exp(u / UT) * 1e6; };
    plot.line(ibf, COL.a, 2.6);
    var slope = 1 / res.rpi * 1e6;
    plot.line(function (u) { return res.ib * 1e6 + (u - res.ube) * slope; }, COL.f, 1.8, { dash: [6, 4] });
    plot.vline(res.ube, 'rgba(238,243,247,.3)', 1, [3, 4]);
    plot.hline(res.ib * 1e6, 'rgba(238,243,247,.3)', 1, [3, 4]);
    plot.dot(res.ube, res.ib * 1e6, COL.w, 5.5);
    plot.text('Q', res.ube, res.ib * 1e6, COL.w, 'right', -8, -10);
    plot.text(L.tr('nagib 1/r_π', 'slope 1/r_π'), res.ube + 0.012, res.ib * 1e6 + 0.012 * slope, COL.f, 'left', 6, 4);
  }
  L.loop(fig, function (dt) {
    var g = prep(cvs[0]);
    if (g) drawModel(g.c, g.s, dt);
    drawPlot();
  });
  readout();
}

function saturation(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { uin: 5, rb: 10, ucc: 12, rc: 470, beta: 100, f: 0 };
  var res = {};
  var plot = new C.Plot(cvs[1], { x: [0, 1], y: [0, 1], xt: 4, yt: 4, xl: 'I_B (μA)', yl: 'I_C (mA)', pad: { l: 48, r: 14, t: 20, b: 34 }, xf: function (v) { return L.fmtNum(v, C.decs(v)); }, yf: function (v) { return L.fmtNum(v, C.decs(v)); } });
  function solve() {
    var rb = st.rb * 1e3, icsat = (st.ucc - 0.2) / st.rc;
    var r = { icsat: icsat, ibsat: icsat / st.beta };
    if (st.uin <= 0.7) { r.mode = 'cut'; r.ib = 0; r.ic = 0; r.uce = st.ucc; r.ube = st.uin; }
    else {
      var ib = (st.uin - 0.7) / rb;
      if (st.beta * ib < icsat) { r.mode = 'act'; r.ib = ib; r.ic = st.beta * ib; r.uce = st.ucc - r.ic * st.rc; r.ube = 0.7; }
      else { r.mode = 'sat'; r.ib = Math.max(0, (st.uin - 0.8) / rb); r.ic = icsat; r.uce = 0.2; r.ube = 0.8; }
    }
    r.k = r.ib / r.ibsat;
    res = r;
  }
  function readout() {
    solve();
    $(id + '-calc').textContent = 'I_Csat = (U_CC − U_CEsat)/R_C = (' + L.fmtNum(st.ucc, 0) + ' − ' + L.fmtNum(0.2, 1) + ')/' + L.fmtNum(st.rc, 0) + ' Ω = ' + mA(res.icsat) + ' · I_Bsat = I_Csat/β = ' + mA(res.ibsat);
    $(id + '-result').textContent = L.tr('Režim: ', 'Mode: ') + modeName(res.mode) + ' · I_B = ' + mA(res.ib) + ' · I_C = ' + mA(res.ic) + ' · U_CE = ' + volt(res.uce);
    $(id + '-note').textContent = res.mode === 'sat'
      ? L.tr('Faktor prezasićenja k = I_B/I_Bsat = ' + L.fmtNum(res.k, 1) + '. Spoj B–E je zamenjen izvorom 0,8 V, a C–E izvorom 0,2 V.', 'Overdrive factor k = I_B/I_Bsat = ' + L.fmtNum(res.k, 1) + '. The B–E junction is replaced by a 0.8 V source and C–E by a 0.2 V source.')
      : res.mode === 'act'
        ? L.tr('Bazna struja je premala za zasićenje (k = ' + L.fmtNum(res.k, 2) + ' < 1). Tranzistor je u aktivnom režimu i na njemu se gubi snaga U_CE·I_C = ' + L.fmtNum(res.uce * res.ic * 1e3, 0) + ' mW.', 'The base current is too small for saturation (k = ' + L.fmtNum(res.k, 2) + ' < 1). The transistor is in the active mode and wastes the power U_CE·I_C = ' + L.fmtNum(res.uce * res.ic * 1e3, 0) + ' mW.')
        : L.tr('Ulazni napon je ispod praga, spoj B–E ne vodi. Prekidač je otvoren, potrošač je ugašen.', 'The input voltage is below the threshold, the B–E junction does not conduct. The switch is open and the load is off.');
  }
  L.range(id + '-uin', { obj: st, key: 'uin', fmt: function (v) { return L.fmtNum(v, 1) + ' V'; }, on: readout });
  L.range(id + '-rb', { obj: st, key: 'rb', fmt: function (v) { return L.fmtNum(v, 0) + ' kΩ'; }, on: readout });
  L.range(id + '-rc', { obj: st, key: 'rc', fmt: function (v) { return L.fmtNum(v, 0) + ' Ω'; }, on: readout });
  L.range(id + '-beta', { obj: st, key: 'beta', fmt: function (v) { return L.fmtNum(v, 0); }, on: readout });
  L.onLang(readout);

  var LW = 440, LH = 220;
  function drawAll(c, s, dt) {
    c.save();
    C.fit(c, s, LW, LH);
    var bx = 100, by = 120, cx = bx + 22, ka = Math.min(1, res.ic / res.icsat);
    wires(c, [[[16, 120], [30, 120]], [[66, 120], [bx - 24, 120]], [[cx, by - 30], [cx, 96]], [[cx, 70], [cx, 30], [180, 30], [180, 200], [cx, 200], [cx, by + 30]]]);
    st.f += dt * 80 * ka;
    if (res.ic > 0) dots(c, [[180, 200], [180, 30], [cx, 30], [cx, 200], [180, 200]], st.f, 0.3 + 0.7 * ka, 14);
    c.save();
    c.fillStyle = BG; c.strokeStyle = COL.w; c.lineWidth = 2;
    c.beginPath(); c.arc(16, 120, 4.5, 0, TAU); c.fill(); c.stroke();
    c.restore();
    C.label(c, 'U_BB', 16, 140, COL.a, 'center', 11);
    resistor(c, 48, 120, 36, 14, COL.c, 'R_B', 48, 102);
    c.save();
    var gl = c.createRadialGradient(cx, 83, 2, cx, 83, 34);
    gl.addColorStop(0, 'rgba(245,200,76,' + (0.85 * ka) + ')');
    gl.addColorStop(1, 'rgba(245,200,76,0)');
    c.fillStyle = gl; c.beginPath(); c.arc(cx, 83, 34, 0, TAU); c.fill();
    c.fillStyle = BG; c.strokeStyle = COL.f; c.lineWidth = 2.2;
    c.beginPath(); c.arc(cx, 83, 13, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(cx - 9, 74); c.lineTo(cx + 9, 92); c.moveTo(cx + 9, 74); c.lineTo(cx - 9, 92); c.stroke();
    c.restore();
    C.label(c, 'R_C', cx - 20, 83, COL.f, 'right', 11);
    battery(c, 180, 115, COL.a, 'U_CC', 1);
    transistor(c, bx, by, COL.b);
    chip(c, modeName(res.mode), 100, 16, modeColor(res.mode));

    var ox = 262;
    wires(c, [[[ox, 200], [430, 200]]], 'rgba(201,214,226,.4)', 1.5);
    C.label(c, L.tr('ekvivalentna šema', 'equivalent circuit'), 346, 16, 'rgba(201,214,226,.7)', 'center', 10.5);
    var xb = 300, xc = 370;
    var B = [ox, 70], Cc = [410, 50], E = [335, 200];
    function term(p, t) {
      c.save(); c.fillStyle = BG; c.strokeStyle = '#eef3f7'; c.lineWidth = 2; c.beginPath(); c.arc(p[0], p[1], 4.5, 0, TAU); c.fill(); c.stroke(); c.restore();
      C.label(c, t, p[0], p[1] - 14, '#eef3f7', 'center', 12);
    }
    var mc = modeColor(res.mode);
    if (res.mode === 'cut') {
      wires(c, [[B, [xb, 70], [xb, 110]], [[xb, 150], [xb, 200]], [Cc, [xc, 50], [xc, 110]], [[xc, 150], [xc, 200]]]);
      wires(c, [[[xb, 110], [xb + 12, 146]], [[xc, 110], [xc + 12, 146]]], mc, 2.4);
      C.label(c, L.tr('otvoreno', 'open'), (xb + xc) / 2 + 6, 96, mc, 'center', 11);
    } else {
      wires(c, [[B, [xb, 70], [xb, 116]], [[xb, 136], [xb, 200]], [Cc, [xc, 50], [xc, res.mode === 'sat' ? 116 : 106]], [[xc, res.mode === 'sat' ? 136 : 146], [xc, 200]]]);
      battery(c, xb, 126, mc, L.fmtNum(res.mode === 'sat' ? 0.8 : 0.7, 1) + ' V', -1);
      if (res.mode === 'sat') {
        battery(c, xc, 126, mc, L.fmtNum(0.2, 1) + ' V', 1);
      } else {
        c.save(); c.fillStyle = BG; c.strokeStyle = mc; c.lineWidth = 2.4; c.beginPath(); c.arc(xc, 126, 20, 0, TAU); c.fill(); c.stroke(); c.restore();
        C.arrow(c, xc, 140, xc, 112, mc, 2.2, 8);
        C.label(c, 'β·I_B', xc + 26, 126, mc, 'left', 11);
      }
    }
    term(B, 'B'); term(Cc, 'C'); term(E, 'E');
    c.restore();
  }
  function drawPlot() {
    var xm = C.niceAxis(Math.max(res.ib, res.ibsat) * 1e6 * 1.4);
    var ym = C.niceAxis(res.icsat * 1e3 * 1.35);
    plot.x = [0, xm.max]; plot.xt = xm.ticks;
    plot.y = [0, ym.max]; plot.yt = ym.ticks;
    if (!plot.begin()) return;
    var b = st.beta, isat = res.icsat * 1e3;
    plot.line(function (x) { return b * x * 1e-3; }, 'rgba(108,198,238,.45)', 1.5, { dash: [5, 4] });
    plot.line(function (x) { return Math.min(b * x * 1e-3, isat); }, COL.a, 2.6);
    plot.hline(isat, 'rgba(179,155,242,.6)', 1, [3, 4]);
    plot.vline(res.ibsat * 1e6, 'rgba(245,200,76,.6)', 1.2, [3, 4]);
    plot.text('I_Bsat', res.ibsat * 1e6, ym.max * 0.06, COL.f, 'left', 5);
    plot.text('I_Csat', 0, isat, COL.e, 'left', 4, -9);
    plot.text('β·I_B', xm.max * 0.97, Math.min(b * xm.max * 0.97e-3, ym.max * 0.96), 'rgba(108,198,238,.8)', 'right', -2, 10);
    plot.dot(res.ib * 1e6, res.ic * 1e3, COL.w, 5.5);
  }
  L.loop(fig, function (dt) {
    var g = prep(cvs[0]);
    if (g) drawAll(g.c, g.s, dt);
    drawPlot();
  });
  readout();
}

window.BJTLAB = { outchar: outchar, active: active, saturation: saturation };
})();
