(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var nice = C.nice, engn = C.engn, signed = C.signed, rrect = C.rrect, setText = C.setText, setSeg = C.setSeg, decs = C.decs;

var D = 30, COLS = 10, ROWS = 8;
var T1 = '#ffe45c', T2 = '#59d9ff';
var SEQ125 = [];
(function () {
  for (var e = -9; e <= 1; e++) [1, 2, 5].forEach(function (m) { SEQ125.push(m * Math.pow(10, e)); });
})();

function pickScale(value, maxDiv) {
  for (var i = 0; i < SEQ125.length; i++) if (value / SEQ125[i] <= maxDiv + 1e-9) return SEQ125[i];
  return SEQ125[SEQ125.length - 1];
}

function shape(kind, p) {
  if (kind === 'sin') return Math.sin(p);
  if (kind === 'tri') return 2 / Math.PI * Math.asin(Math.sin(p));
  return Math.sin(p) >= 0 ? 1 : -1;
}

function triggerPhase(kind, x, rising) {
  if (kind === 'sin') return rising ? Math.asin(x) : Math.PI - Math.asin(x);
  if (kind === 'tri') return rising ? x * Math.PI / 2 : Math.PI - x * Math.PI / 2;
  return rising ? 1e-4 : Math.PI + 1e-4;
}

function drawGrid(c, x, y) {
  c.fillStyle = '#06100b';
  rrect(c, x - 8, y - 8, COLS * D + 16, ROWS * D + 16, 9);
  c.fill();
  c.strokeStyle = '#27c47a';
  c.lineWidth = 1;
  c.globalAlpha = 0.26;
  c.beginPath();
  for (var i = 0; i <= COLS; i++) { c.moveTo(x + i * D + 0.5, y); c.lineTo(x + i * D + 0.5, y + ROWS * D); }
  for (var j = 0; j <= ROWS; j++) { c.moveTo(x, y + j * D + 0.5); c.lineTo(x + COLS * D, y + j * D + 0.5); }
  c.stroke();
  c.globalAlpha = 0.62;
  c.beginPath();
  c.moveTo(x, y + 4 * D + 0.5); c.lineTo(x + COLS * D, y + 4 * D + 0.5);
  c.moveTo(x + 5 * D + 0.5, y); c.lineTo(x + 5 * D + 0.5, y + ROWS * D);
  for (var k = 0; k <= COLS * 5; k++) { var tx = x + k * D / 5 + 0.5; c.moveTo(tx, y + 4 * D - 3); c.lineTo(tx, y + 4 * D + 3); }
  for (var m = 0; m <= ROWS * 5; m++) { var ty = y + m * D / 5 + 0.5; c.moveTo(x + 5 * D - 3, ty); c.lineTo(x + 5 * D + 3, ty); }
  c.stroke();
  c.globalAlpha = 1;
}

function trace(c, x, y, tdiv, fn, color, width) {
  var w = COLS * D, n = Math.round(w * 1.5), cy = y + 4 * D;
  c.save();
  c.beginPath();
  c.rect(x, y, w, ROWS * D);
  c.clip();
  c.strokeStyle = color;
  c.shadowColor = color;
  c.shadowBlur = 5;
  c.lineWidth = width || 2;
  c.lineJoin = 'round';
  c.beginPath();
  for (var i = 0; i <= n; i++) {
    var v = fn(i / n * COLS * tdiv), py = cy - v * D;
    if (i) c.lineTo(x + i / n * w, py); else c.moveTo(x, py);
  }
  c.stroke();
  c.restore();
}

function marker(c, x, y, label, color) {
  c.save();
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(x - 9, y - 6);
  c.lineTo(x - 1, y);
  c.lineTo(x - 9, y + 6);
  c.closePath();
  c.fill();
  c.fillStyle = '#06100b';
  c.font = '800 9px Archivo, system-ui, sans-serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(label, x - 6, y + 0.5);
  c.restore();
}

(function scope() {
  var fig = document.getElementById('lab-scope');
  var LW = 340, LH = 272, SX = 20, SY = 12;
  var VD = [0.05, 0.1, 0.2, 0.5, 1, 2, 5];
  var TD = [1e-4, 2e-4, 5e-4, 1e-3, 2e-3, 5e-3, 1e-2, 2e-2, 5e-2];
  var UMS = [0.1, 0.2, 0.5, 1, 2, 5, 10];
  var FS = [10, 50, 100, 500, 1000, 5000];
  var s = { shape: 'sin', ui: 4, fi: 3, off: 0, vi: 4, ti: 2, coup: 'dc', lvl: 0, slope: 'up', t: 0 };

  function sig() {
    var Um = UMS[s.ui], f = FS[s.fi], off = s.off;
    var vd = VD[s.vi], td = TD[s.ti];
    var dcPart = s.coup === 'dc' ? off : 0;
    var lvlV = s.lvl * vd, x = (lvlV - dcPart) / Um;
    var trig = s.coup !== 'gnd' && Math.abs(x) < 0.999;
    var ph0 = trig ? triggerPhase(s.shape, x, s.slope === 'up') : s.t * 2.3;
    return { Um: Um, f: f, vd: vd, td: td, dc: dcPart, trig: trig, ph0: ph0, lvlV: lvlV };
  }

  function draw(c, sc, dt) {
    s.t += dt;
    var g = sig();
    c.save();
    C.fit(c, sc, LW, LH);
    drawGrid(c, SX, SY);
    var cy = SY + 4 * D;
    var fn = s.coup === 'gnd' ? function () { return 0; } : function (t) { return (g.dc + g.Um * shape(s.shape, 2 * Math.PI * g.f * t + g.ph0)) / g.vd; };
    trace(c, SX, SY, g.td, fn, T1, 2.2);
    marker(c, SX - 1, cy, '1', T1);
    if (s.coup !== 'gnd') {
      c.save();
      c.strokeStyle = '#ff8a5c';
      c.fillStyle = '#ff8a5c';
      var ty = cy - s.lvl * D;
      c.beginPath();
      c.moveTo(SX + COLS * D + 1, ty);
      c.lineTo(SX + COLS * D + 9, ty - 5);
      c.lineTo(SX + COLS * D + 9, ty + 5);
      c.closePath();
      c.fill();
      c.setLineDash([3, 4]);
      c.globalAlpha = 0.55;
      c.beginPath();
      c.moveTo(SX, ty);
      c.lineTo(SX + COLS * D, ty);
      c.stroke();
      c.restore();
    }
    var cpl = s.coup === 'dc' ? 'DC' : s.coup === 'ac' ? 'AC' : 'GND';
    C.label(c, 'CH1 ' + engn(g.vd, 'V') + '/div ' + cpl, SX, 264, T1, 'left', 11);
    C.label(c, engn(g.td, 's') + '/div', SX + 150, 264, '#c9d6e2', 'center', 11);
    C.label(c, g.trig ? 'T ' + (s.slope === 'up' ? '↗' : '↘') : L.tr('NEMA OKIDANJA', 'NO TRIGGER'), SX + COLS * D, 264, g.trig ? '#ff8a5c' : '#f0675c', 'right', 11);
    c.restore();
  }

  function read() {
    var g = sig(), T = 1 / g.f, ny = 2 * g.Um / g.vd, nx = T / g.td;
    var calc, res, note;
    if (s.coup === 'gnd') {
      calc = L.tr('Ulaz je uzemljen, na ekranu je linija nula volti', 'The input is grounded, the screen shows a line of zero volts');
      res = '0 V';
      note = L.tr('GND služi da nađeš položaj nule pre merenja.', 'GND is used to find the position of zero before measuring.');
    } else {
      calc = 'Upp = n · V/div = ' + nice(ny, 2) + ' · ' + engn(g.vd, 'V') + '/div · T = n · t/div = ' + nice(nx, 2) + ' · ' + engn(g.td, 's') + '/div';
      res = 'Upp = ' + engn(2 * g.Um, 'V') + ' · f = ' + engn(g.f, 'Hz') + ' <small>· Um = ' + engn(g.Um, 'V') + (s.shape === 'sin' ? ' · U = ' + engn(g.Um / Math.SQRT2, 'V') : '') + '</small>';
      var notes = [];
      if (ny > 8) notes.push(L.tr('Signal je veći od ekrana: povećaj V/div.', 'The signal is larger than the screen: increase V/div.'));
      else if (ny < 1.5) notes.push(L.tr('Signal je sitan: smanji V/div da bi ga bolje očitao.', 'The signal is tiny: reduce V/div to read it better.'));
      if (nx > 10) notes.push(L.tr('Na ekranu nema ni jedne cele periode: povećaj brzinu (smanji t/div).', 'There is not even one full period on the screen: speed up the time base (reduce t/div).'));
      else if (nx < 0.8) notes.push(L.tr('Previše perioda se sabilo: povećaj t/div.', 'Too many periods are squeezed in: increase t/div.'));
      if (!g.trig) notes.push(L.tr('Nivo okidanja je van signala, slika „beži”. Pomeri nivo u opseg signala.', 'The trigger level is outside the signal, so the picture "runs". Move the level inside the signal range.'));
      if (s.coup === 'ac' && s.off !== 0) notes.push(L.tr('AC sprega je uklonila jednosmernu komponentu od ' + s.off + ' V.', 'AC coupling removed the DC component of ' + s.off + ' V.'));
      if (s.coup === 'dc' && s.off !== 0) notes.push(L.tr('DC sprega prikazuje i jednosmernu komponentu: signal je pomeren za ' + s.off + ' V.', 'DC coupling shows the DC component too: the signal is shifted by ' + s.off + ' V.'));
      note = notes.join(' ');
    }
    setText(document.getElementById('s-calc'), calc);
    setText(document.getElementById('s-result'), res, true);
    setText(document.getElementById('s-note'), note);
  }

  function autoset() {
    var Um = UMS[s.ui], T = 1 / FS[s.fi], amp = Math.abs(s.off) + Um;
    s.vi = VD.indexOf(pickScale(amp, 3.4));
    if (s.vi < 0) s.vi = 0;
    var td = pickScale(T, 2.8);
    s.ti = TD.indexOf(td);
    if (s.ti < 0) s.ti = td < TD[0] ? 0 : TD.length - 1;
    s.lvl = 0;
    syncSliders();
    read();
  }

  var ctl = {};
  function bind(id, key, fmt) { ctl[id] = L.range(id, { obj: s, key: key, fmt: fmt, on: read }); }
  function syncSliders() {
    document.getElementById('s-vd').value = s.vi;
    document.getElementById('s-td').value = s.ti;
    document.getElementById('s-lvl').value = s.lvl;
    ['s-vd', 's-td', 's-lvl'].forEach(function (id) { document.getElementById(id).dispatchEvent(new Event('input')); });
  }

  C.scene(fig, draw);
  bind('s-um', 'ui', function (v) { return engn(UMS[v], 'V'); });
  bind('s-f', 'fi', function (v) { return engn(FS[v], 'Hz'); });
  bind('s-off', 'off', function (v) { return signed(v, 0) + ' V'; });
  bind('s-vd', 'vi', function (v) { return engn(VD[v], 'V') + '/div'; });
  bind('s-td', 'ti', function (v) { return engn(TD[v], 's') + '/div'; });
  bind('s-lvl', 'lvl', function (v) { return L.fmtNum(v, 2) + ' div'; });
  C.toggle(document.getElementById('s-shape'), function (v) { s.shape = v; read(); });
  C.toggle(document.getElementById('s-coup'), function (v) { s.coup = v; read(); });
  C.toggle(document.getElementById('s-slope'), function (v) { s.slope = v; read(); });
  document.getElementById('s-auto').addEventListener('click', autoset);
  L.onLang(read);
})();

(function rlc() {
  var fig = document.getElementById('lab-rlc');
  var LW = 340, LH = 272, SX = 20, SY = 12;
  var R0 = 100, L0 = 20e-3, C0 = 1e-6, RS = 10;
  var FS = [100, 200, 500, 1000, 2000, 5000], UMS = [1, 2, 5, 10];
  var r = { el: 'R', fi: 3, ui: 2, c1: 1, c2: 2, cur: false, xy: false, t: 0 };

  function circ() {
    var f = FS[r.fi], Um = UMS[r.ui], w = 2 * Math.PI * f;
    var Rr = r.el === 'L' || r.el === 'C' ? 0 : R0;
    var X = r.el === 'L' || r.el === 'RL' ? w * L0 : r.el === 'C' || r.el === 'RC' ? -1 / (w * C0) : 0;
    var Z = Math.hypot(Rr, X), phi = Math.atan2(X, Rr), Im = Um / Z, us = Im * RS, T = 1 / f;
    var vd1 = pickScale(Um, 3.4), vd2 = pickScale(us, 3.4), td = pickScale(T, 5);
    return { f: f, Um: Um, w: w, Rr: Rr, X: X, Z: Z, phi: phi, Im: Im, us: us, T: T, vd1: vd1, vd2: vd2, td: td };
  }

  function draw(c, sc, dt) {
    r.t += dt;
    var g = circ();
    c.save();
    C.fit(c, sc, LW, LH);
    drawGrid(c, SX, SY);
    var cy = SY + 4 * D;
    if (!r.xy) {
      var f1 = function (t) { return g.Um * Math.sin(g.w * t) / g.vd1; };
      var f2 = function (t) { return g.us * Math.sin(g.w * t - g.phi) / g.vd2; };
      trace(c, SX, SY, g.td, f1, T1, 3.6);
      trace(c, SX, SY, g.td, f2, T2, 1.8);
      marker(c, SX - 1, cy, '1', T1);
      marker(c, SX - 1, cy + 12, '2', T2);
      if (r.cur) {
        [r.c1, r.c2].forEach(function (cv, i) {
          var x = SX + cv * D;
          c.save();
          c.strokeStyle = i ? '#ff8a5c' : '#d9a6ff';
          c.setLineDash([5, 4]);
          c.lineWidth = 1.6;
          c.beginPath();
          c.moveTo(x, SY);
          c.lineTo(x, SY + ROWS * D);
          c.stroke();
          c.restore();
        });
      }
      C.label(c, 'CH1 ' + engn(g.vd1, 'V') + '/div', SX, 264, T1, 'left', 11);
      C.label(c, 'CH2 ' + engn(g.vd2, 'V') + '/div', SX + 118, 264, T2, 'left', 11);
      C.label(c, engn(g.td, 's') + '/div', SX + COLS * D, 264, '#c9d6e2', 'right', 11);
    } else {
      var a1 = g.Um / g.vd1, a2 = g.us / g.vd2, k = Math.min(1, 3.8 / Math.max(a1, a2));
      var px = SX + 5 * D, ph = r.t * 2.4;
      c.save();
      c.beginPath();
      c.rect(SX, SY, COLS * D, ROWS * D);
      c.clip();
      c.strokeStyle = T1;
      c.shadowColor = T1;
      c.shadowBlur = 5;
      c.lineWidth = 2.2;
      c.beginPath();
      for (var i = 0; i <= 200; i++) {
        var th = i / 200 * 2 * Math.PI;
        var x = px + a1 * k * Math.sin(th) * D, y = cy - a2 * k * Math.sin(th - g.phi) * D;
        if (i) c.lineTo(x, y); else c.moveTo(x, y);
      }
      c.stroke();
      c.shadowBlur = 0;
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(px + a1 * k * Math.sin(ph) * D, cy - a2 * k * Math.sin(ph - g.phi) * D, 4, 0, Math.PI * 2);
      c.fill();
      c.restore();
      C.label(c, 'XY', SX, 264, T1, 'left', 11);
      C.label(c, 'X: CH1 · Y: CH2', SX + COLS * D, 264, '#c9d6e2', 'right', 11);
    }
    c.restore();
  }

  function read() {
    var g = circ(), deg = g.phi * 180 / Math.PI, calc, res, note;
    var nm = { R: L.tr('otpornik', 'resistor'), L: L.tr('kalem', 'coil'), C: L.tr('kondenzator', 'capacitor'), RL: L.tr('red RL', 'series RL'), RC: L.tr('red RC', 'series RC') }[r.el];
    calc = L.tr('Z = Um / Im = ', 'Z = Um / Im = ') + engn(g.Um, 'V') + ' / ' + engn(g.Im, 'A') + ' = ' + engn(g.Z, 'Ω') + ' · Im = Um(Rs) / Rs = ' + engn(g.us, 'V') + ' / ' + RS + ' Ω';
    var rel = Math.abs(deg) < 0.5 ? L.tr('struja i napon su u fazi', 'current and voltage are in phase') : deg > 0 ? L.tr('struja kasni za naponom', 'the current lags the voltage') : L.tr('struja prednjači naponu', 'the current leads the voltage');
    res = 'φ = ' + signed(deg, 1) + '° <small>· ' + nm + ': ' + rel + '</small>';
    if (r.xy) {
      var b = Math.abs(Math.sin(g.phi)), ph = Math.asin(Math.min(1, b)) * 180 / Math.PI;
      note = L.tr('Elipsa: odnos preseka sa osom Y (b) i najveće visine (a) daje sin φ = b/a = ' + L.fmtNum(b, 2) + ', odakle je |φ| = ' + L.fmtNum(ph, 1) + '°.', 'The ellipse: the ratio of its crossing of the Y axis (b) to its greatest height (a) gives sin φ = b/a = ' + L.fmtNum(b, 2) + ', so |φ| = ' + L.fmtNum(ph, 1) + '°.');
    } else if (r.cur) {
      var dt = (r.c2 - r.c1) * g.td, pm = dt / g.T * 360;
      note = 'Δt = ' + engn(Math.abs(dt), 's') + ' · φ = Δt / T · 360° = ' + L.fmtNum(Math.abs(pm), 1) + '° ' + L.tr('(T = ' + engn(g.T, 's') + ')', '(T = ' + engn(g.T, 's') + ')');
    } else {
      note = L.tr('Uključi kursore i izmeri kašnjenje druge krive u odnosu na prvu.', 'Switch on the cursors and measure the delay of the second trace relative to the first.');
    }
    setText(document.getElementById('r-calc'), calc);
    setText(document.getElementById('r-result'), res, true);
    setText(document.getElementById('r-note'), note);
    document.getElementById('r-cursors').hidden = !r.cur || r.xy;
  }

  C.scene(fig, draw);
  L.range('r-f', { obj: r, key: 'fi', fmt: function (v) { return engn(FS[v], 'Hz'); }, on: read });
  L.range('r-um', { obj: r, key: 'ui', fmt: function (v) { return engn(UMS[v], 'V'); }, on: read });
  L.range('r-c1', { obj: r, key: 'c1', fmt: function (v) { return L.fmtNum(v, 2) + ' div'; }, on: read });
  L.range('r-c2', { obj: r, key: 'c2', fmt: function (v) { return L.fmtNum(v, 2) + ' div'; }, on: read });
  C.toggle(document.getElementById('r-el'), function (v) { r.el = v; read(); });
  document.getElementById('r-cur').addEventListener('change', function (e) { r.cur = e.target.checked; read(); });
  document.getElementById('r-xy').addEventListener('change', function (e) { r.xy = e.target.checked; read(); });
  L.onLang(read);
})();

(function xf() {
  var fig = document.getElementById('lab-xf');
  var cv = fig.querySelector('canvas');
  var LS = [5, 10, 20, 50, 100], CS = [0.1, 0.22, 0.47, 1, 2.2, 4.7];
  var x = { li: 2, ci: 3, f: 1000, R: 100 };
  var plot = new C.Plot(cv, { x: [0, 5000], y: [0, 600], xt: 5, yt: 6, xl: 'f (Hz)', yl: 'X, R (Ω)', pad: { l: 48, r: 16, t: 22, b: 34 }, onResize: draw, xf: function (v) { return L.fmtNum(v, 0); } });

  function vals() {
    var Lh = LS[x.li] * 1e-3, Cf = CS[x.ci] * 1e-6;
    return { Lh: Lh, Cf: Cf, f0: 1 / (2 * Math.PI * Math.sqrt(Lh * Cf)) };
  }
  function xl(Lh, f) { return 2 * Math.PI * f * Lh; }
  function xc(Cf, f) { return f <= 0 ? 1e6 : 1 / (2 * Math.PI * f * Cf); }

  function draw() {
    var v = vals();
    if (!plot.begin()) return;
    plot.line(function () { return x.R; }, C.COL.b, 2.2, { dash: [6, 4] });
    plot.line(function (f) { return xl(v.Lh, f); }, C.COL.c, 2.6);
    plot.line(function (f) { return Math.min(1e5, xc(v.Cf, f)); }, C.COL.a, 2.6);
    if (v.f0 < 5000) {
      plot.vline(v.f0, 'rgba(255,255,255,.35)', 1.2, [4, 4]);
      plot.dot(v.f0, xl(v.Lh, v.f0), '#fff', 5);
      plot.text('f0', v.f0, 575, '#e9f0f6', 'center', 0, 0);
    }
    plot.vline(x.f, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
    plot.dot(x.f, xl(v.Lh, x.f), C.COL.c, 5.5);
    plot.dot(x.f, Math.min(590, xc(v.Cf, x.f)), C.COL.a, 5.5);
    plot.text('XL', 4900, Math.min(570, xl(v.Lh, 4800)) + 18, C.COL.c, 'right', 0, 0);
    plot.text('XC', 4900, 40, C.COL.a, 'right', 0, 0);
    plot.text('R', 4900, x.R + 14, C.COL.b, 'right', 0, 0);
  }

  function read() {
    var v = vals(), XL = xl(v.Lh, x.f), XC = xc(v.Cf, x.f);
    setText(document.getElementById('x-calc'), 'XL = 2π·f·L · XC = 1 / (2π·f·C) · f0 = 1 / (2π√(LC)) = ' + engn(v.f0, 'Hz'));
    setText(document.getElementById('x-result'), 'XL = ' + engn(XL, 'Ω') + ' · XC = ' + engn(XC, 'Ω'), false);
    draw();
  }

  L.range('x-l', { obj: x, key: 'li', fmt: function (i) { return LS[i] + ' mH'; }, on: read });
  L.range('x-c', { obj: x, key: 'ci', fmt: function (i) { return L.fmtNum(CS[i], CS[i] % 1 ? (CS[i] * 100 % 10 ? 2 : 1) : 0) + ' μF'; }, on: read });
  L.range('x-f', { obj: x, key: 'f', fmt: function (v) { return engn(v, 'Hz'); }, on: read });
  L.onLang(read);
})();

(function series() {
  var fig = document.getElementById('lab-series');
  var cvs = fig.querySelectorAll('canvas');
  var LW = 340, LH = 272, CX = 170, CY = 136, RAD = 112;
  var LS = [5, 10, 20, 50, 100], CS = [0.1, 0.22, 0.47, 1, 2.2, 4.7];
  var q = { R: 100, li: 2, ci: 3, f: 1000, Um: 10, th: 0.5, ps: 0 };
  var run = document.getElementById('q-run'), thEl = document.getElementById('q-th');
  var plot = new C.Plot(cvs[1], { x: [0, 360], y: [-1, 1], xt: 4, yt: 4, xl: 'ωt (°)', yl: 'u (V)', pad: { l: 48, r: 16, t: 22, b: 34 }, onResize: function () { drawPlot(calc(), q.th); }, xf: function (v) { return L.fmtNum(v, 0); } });
  var CU = { r: '#ffb468', l: '#6fcf97', c: '#6cc6ee', u: '#f4f7fa' };

  function calc() {
    var Lh = LS[q.li] * 1e-3, Cf = CS[q.ci] * 1e-6, w = 2 * Math.PI * q.f;
    var XL = w * Lh, XC = 1 / (w * Cf), X = XL - XC;
    var Z = Math.hypot(q.R, X), Im = q.Um / Z;
    return { Lh: Lh, Cf: Cf, w: w, XL: XL, XC: XC, X: X, Z: Z, Im: Im, UR: Im * q.R, UL: Im * XL, UC: Im * XC, phi: Math.atan2(X, q.R), f0: 1 / (2 * Math.PI * Math.sqrt(Lh * Cf)) };
  }

  function draw(c, sc, dt) {
    var g = calc();
    if (run.checked) {
      q.th += dt * 0.9;
      if (q.th > 2 * Math.PI) q.th -= 2 * Math.PI;
      thEl.value = Math.round(q.th * 180 / Math.PI);
      document.getElementById('q-th-out').textContent = thEl.value + '°';
    }
    drawPhasors(c, sc, g, q.th);
    drawPlot(g, q.th);
  }

  function drawPhasors(c, sc, g, th) {
    c.save();
    C.fit(c, sc, LW, LH);
    var rmax = Math.max(g.UR, g.UL, g.UC, Math.hypot(g.UR, g.UL), Math.hypot(g.UR, g.UL - g.UC), 1e-9);
    var k = RAD / rmax, cs = Math.cos(th), sn = Math.sin(th);
    function P(x, y) { return [CX + k * (x * cs - y * sn), CY - k * (x * sn + y * cs)]; }
    c.strokeStyle = 'rgba(201,214,226,.22)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(14, CY); c.lineTo(LW - 6, CY);
    c.moveTo(CX, 8); c.lineTo(CX, LH - 8);
    c.stroke();
    c.setLineDash([3, 5]);
    c.beginPath();
    c.arc(CX, CY, RAD, 0, Math.PI * 2);
    c.stroke();
    c.setLineDash([]);
    var e = 5 / k;
    var O = P(0, 0), P1 = P(g.UR, 0), P2 = P(g.UR, g.UL), P3 = P(g.UR, g.UL - g.UC);
    var L1 = P(g.UR - e, 0), L2 = P(g.UR - e, g.UL), C1 = P(g.UR + e, g.UL), C2 = P(g.UR + e, g.UL - g.UC);
    C.arrow(c, O[0], O[1], P1[0], P1[1], CU.r, 3, 10);
    C.arrow(c, L1[0], L1[1], L2[0], L2[1], CU.l, 3, 10);
    C.arrow(c, C1[0], C1[1], C2[0], C2[1], CU.c, 3, 10);
    C.arrow(c, O[0], O[1], P3[0], P3[1], CU.u, 3.4, 11);
    function off(a, b, d) {
      var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      return [dy / l * d, -dx / l * d];
    }
    function at(a, b, f, d) {
      var o = off(a, b, d);
      return [a[0] + (b[0] - a[0]) * f + o[0], a[1] + (b[1] - a[1]) * f + o[1]];
    }
    var a1 = at(O, P1, 0.5, -14), a2 = at(L1, L2, 0.5, -15), a3 = at(C1, C2, 0.5, 15), a4 = at(O, P3, 0.62, 15);
    C.chipLabel(c, 'UR', a1[0], a1[1], CU.r, 11);
    C.chipLabel(c, 'UL', a2[0], a2[1], CU.l, 11);
    C.chipLabel(c, 'UC', a3[0], a3[1], CU.c, 11);
    C.chipLabel(c, 'U', a4[0], a4[1], CU.u, 11);
    c.strokeStyle = CU.u;
    c.lineWidth = 1.4;
    c.beginPath();
    c.arc(O[0], O[1], 24, -th - g.phi, -th, g.phi < 0);
    c.stroke();
    var vals = [[g.UR * Math.sin(th), CU.r], [g.UL * Math.cos(th), CU.l], [-g.UC * Math.cos(th), CU.c]];
    var ut = g.UR * Math.sin(th) + g.UL * Math.cos(th) - g.UC * Math.cos(th);
    vals.push([ut, CU.u]);
    c.strokeStyle = 'rgba(244,247,250,.3)';
    c.setLineDash([3, 4]);
    c.beginPath();
    c.moveTo(12, CY - k * ut);
    c.lineTo(P3[0], P3[1]);
    c.stroke();
    c.setLineDash([]);
    vals.forEach(function (v) {
      c.fillStyle = v[1];
      c.beginPath();
      c.arc(12, CY - k * v[0], 3.6, 0, Math.PI * 2);
      c.fill();
    });
    c.restore();
  }

  function drawPlot(g, th) {
    var amps = [g.UR, g.UL, g.UC, Math.hypot(g.UR, g.UL - g.UC)];
    var sa = C.symAxis(Math.max.apply(null, amps) * 1.15);
    plot.y = [-sa.top, sa.top];
    plot.yt = sa.ticks;
    var yd = decs(2 * sa.top / sa.ticks);
    plot.yf = function (v) { return L.fmtNum(v, yd); };
    if (!plot.begin()) return;
    var d = Math.PI / 180, Ut = Math.hypot(g.UR, g.UL - g.UC);
    var fr = function (x) { return g.UR * Math.sin(x * d); };
    var fl = function (x) { return g.UL * Math.cos(x * d); };
    var fc = function (x) { return -g.UC * Math.cos(x * d); };
    var fu = function (x) { return Ut * Math.sin(x * d + g.phi); };
    plot.line(fr, CU.r, 2);
    plot.line(fl, CU.l, 2);
    plot.line(fc, CU.c, 2);
    plot.line(fu, CU.u, 3);
    var deg = th / d;
    plot.vline(deg, 'rgba(255,255,255,.35)', 1.2, [4, 4]);
    plot.dot(deg, fr(deg), CU.r, 4.5);
    plot.dot(deg, fl(deg), CU.l, 4.5);
    plot.dot(deg, fc(deg), CU.c, 4.5);
    plot.dot(deg, fu(deg), CU.u, 5.5);
  }

  function read() {
    var g = calc(), deg = g.phi * 180 / Math.PI;
    var calcTxt = 'XL = ' + engn(g.XL, 'Ω') + ' · XC = ' + engn(g.XC, 'Ω') + ' · Z = √(R² + (XL − XC)²) = ' + engn(g.Z, 'Ω');
    var res = 'I = ' + engn(g.Im, 'A') + ' <small>· UR = ' + engn(g.UR, 'V') + ' · UL = ' + engn(g.UL, 'V') + ' · UC = ' + engn(g.UC, 'V') + ' · φ = ' + signed(deg, 1) + '°</small>';
    var sum = g.UR + g.UL + g.UC, Ut = Math.hypot(g.UR, g.UL - g.UC);
    var note = L.tr('Aritmetički zbir UR + UL + UC = ' + engn(sum, 'V') + ', a napon izvora je ' + engn(Ut, 'V') + ': naponi se sabiraju kao vektori.', 'The arithmetic sum UR + UL + UC = ' + engn(sum, 'V') + ', while the source voltage is ' + engn(Ut, 'V') + ': the voltages add as vectors.');
    if (Math.abs(g.X) < 0.06 * g.Z) note += ' ' + L.tr('Blizu si rezonancije: UL ≈ UC, a Z ≈ R.', 'You are near resonance: UL ≈ UC and Z ≈ R.');
    if (Math.max(g.UL, g.UC) > 1.05 * q.Um) note += ' ' + L.tr('Napon na kalemu ili kondenzatoru je veći od napona izvora!', 'The voltage on the coil or capacitor is larger than the source voltage!');
    setText(document.getElementById('q-calc'), calcTxt);
    setText(document.getElementById('q-result'), res, true);
    setText(document.getElementById('q-note'), note);
    drawPlot(g, q.th);
  }

  if (L.reduce) run.checked = false;
  C.scene(fig, draw);
  L.range('q-r', { obj: q, key: 'R', fmt: function (v) { return v + ' Ω'; }, on: read });
  L.range('q-l', { obj: q, key: 'li', fmt: function (i) { return LS[i] + ' mH'; }, on: read });
  L.range('q-c', { obj: q, key: 'ci', fmt: function (i) { return L.fmtNum(CS[i], CS[i] % 1 ? (CS[i] * 100 % 10 ? 2 : 1) : 0) + ' μF'; }, on: read });
  L.range('q-f', { obj: q, key: 'f', fmt: function (v) { return engn(v, 'Hz'); }, on: read });
  L.range('q-um', { obj: q, key: 'Um', fmt: function (v) { return v + ' V'; }, on: read });
  thEl.addEventListener('input', function () { q.th = parseFloat(thEl.value) * Math.PI / 180; document.getElementById('q-th-out').textContent = thEl.value + '°'; });
  document.getElementById('q-res').addEventListener('click', function () {
    var g = calc(), el = document.getElementById('q-f');
    el.value = Math.max(100, Math.min(5000, Math.round(g.f0 / 50) * 50));
    el.dispatchEvent(new Event('input'));
  });
  L.onLang(read);
})();
})();
