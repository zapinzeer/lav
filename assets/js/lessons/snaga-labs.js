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
function amp(x) { return x < 1 ? L.fmtNum(x * 1000, 1) + ' mA' : L.fmtNum(x, 2) + ' A'; }
function pw(x, unit) { var a = Math.abs(x); return (x < 0 ? '−' : '') + (a >= 1000 ? L.fmtNum(a / 1000, 2) + ' k' + unit : L.fmtNum(a, a < 10 ? 2 : 1) + ' ' + unit); }

function power(id, type) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { u: 230, f: 50, r: 100, val: type === 'L' ? 500 : 20, th: 0, flow: 0, speed: 0.22 };
  var plotUI = new C.Plot(cvs[1], { x: [0, 2 * TAU], y: [-1.3, 1.3], xt: 8, yt: 2, xl: 'ωt', pad: { l: 14, r: 14, t: 16, b: 34 }, xf: piLabel, yf: function () { return ''; } });
  var plotP = new C.Plot(cvs[2], { x: [0, 2 * TAU], y: [-0.6, 1.1], xt: 8, yt: 2, xl: 'ωt', yl: 'p(t)', pad: { l: 14, r: 14, t: 16, b: 34 }, xf: piLabel, yf: function () { return ''; } });

  function calc() {
    var w = TAU * st.f;
    var x = type === 'L' ? w * st.val / 1000 : -1 / (w * st.val * 1e-6);
    var z = Math.hypot(st.r, x), i = st.u / z, phi = Math.atan2(x, st.r);
    return { x: x, z: z, i: i, phi: phi, P: i * i * st.r, Q: i * i * x, S: st.u * i, pf: Math.cos(phi) };
  }

  function readout() {
    var k = calc(), xs = type === 'L' ? 'X_L' : 'X_C';
    var xa = Math.abs(k.x);
    $(id + '-calc').textContent = (type === 'L'
      ? 'X_L = 2π·' + L.fmtNum(st.f, 0) + '·' + L.fmtNum(st.val / 1000, 3) + ' = ' + L.fmtNum(xa, 1) + ' Ω'
      : 'X_C = 1/(2π·' + L.fmtNum(st.f, 0) + '·' + L.fmtNum(st.val, 0) + ' μF) = ' + L.fmtNum(xa, 1) + ' Ω') +
      ' · Z = √(R² + ' + xs + '²) = ' + L.fmtNum(k.z, 1) + ' Ω · I = ' + amp(k.i);
    $(id + '-result').textContent = 'P = ' + pw(k.P, 'W') + ' · Q = ' + pw(k.Q, 'var') + ' · S = ' + pw(k.S, 'VA') + ' · cos φ = ' + L.fmtNum(k.pf, 2);
    var ang = L.fmtNum(Math.abs(deg(k.phi)), 1) + '°';
    $(id + '-note').textContent = type === 'L'
      ? L.tr('Struja kasni za naponom ' + ang + '. Kalem uzima reaktivnu snagu (Q > 0), a samo otpornik pretvara energiju u toplotu.', 'The current lags the voltage by ' + ang + '. The coil draws reactive power (Q > 0), and only the resistor turns energy into heat.')
      : L.tr('Struja prednjači naponu ' + ang + '. Kondenzator daje reaktivnu snagu (Q < 0), a samo otpornik pretvara energiju u toplotu.', 'The current leads the voltage by ' + ang + '. The capacitor supplies reactive power (Q < 0), and only the resistor turns energy into heat.');
  }

  L.range(id + '-u', { obj: st, key: 'u', fmt: function (v) { return L.fmtNum(v, 0) + ' V'; }, on: readout });
  L.range(id + '-f', { obj: st, key: 'f', fmt: function (v) { return L.fmtNum(v, 0) + ' Hz'; }, on: readout });
  L.range(id + '-r', { obj: st, key: 'r', fmt: function (v) { return L.fmtNum(v, 0) + ' Ω'; }, on: readout });
  L.range(id + '-val', { obj: st, key: 'val', fmt: function (v) { return type === 'L' ? L.fmtNum(v, 0) + ' mH' : L.fmtNum(v, 0) + ' μF'; }, on: readout });
  L.onLang(readout);

  var LW = 380, LH = 200;
  function drawCircuit(c, s, dt) {
    var k = calc();
    st.th = wrap(st.th + dt * st.speed * TAU);
    var th = st.th, iv = Math.sin(th - k.phi);
    st.flow += iv * dt * 70;
    c.save();
    C.fit(c, s, LW, LH);

    c.strokeStyle = 'rgba(201,214,226,.75)';
    c.lineWidth = 2;
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(36, 40); c.lineTo(66, 40); c.moveTo(116, 40); c.lineTo(140, 40); c.moveTo(196, 40); c.lineTo(222, 40);
    c.lineTo(222, 160); c.lineTo(36, 160); c.lineTo(36, 40);
    c.stroke();

    var path = [[36, 40], [222, 40], [222, 160], [36, 160], [36, 40]];
    var a = Math.abs(iv);
    c.fillStyle = 'rgba(255,180,104,' + (0.25 + 0.75 * a) + ')';
    for (var d = 0; d < 18; d++) {
      var p = C.pathAt(path, st.flow + d * (612 / 18));
      c.beginPath(); c.arc(p[0], p[1], 3, 0, TAU); c.fill();
    }

    c.fillStyle = 'rgba(15,22,30,.95)';
    c.strokeStyle = COL.a;
    c.lineWidth = 2.4;
    c.beginPath(); c.arc(36, 100, 20, 0, TAU); c.fill(); c.stroke();
    c.lineWidth = 2;
    c.beginPath();
    for (var q = 0; q <= 20; q++) { var xx = 26 + q, yy = 100 - 6 * Math.sin(q / 20 * TAU); if (q) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
    c.stroke();
    C.label(c, 'U', 66, 100, COL.a, 'left', 13);

    c.strokeStyle = COL.c;
    c.lineWidth = 2.6;
    c.fillStyle = 'rgba(15,22,30,.95)';
    c.beginPath(); c.rect(66, 31, 50, 18); c.fill(); c.stroke();
    C.label(c, 'R', 91, 66, COL.c, 'center', 13);

    c.strokeStyle = COL.b;
    c.lineCap = 'round';
    if (type === 'L') {
      c.beginPath(); c.moveTo(140, 40);
      for (var n = 0; n < 4; n++) c.arc(147 + n * 14, 40, 7, Math.PI, 0);
      c.lineTo(196, 40); c.stroke();
      C.label(c, 'L', 168, 66, COL.b, 'center', 13);
    } else {
      c.beginPath(); c.moveTo(140, 40); c.lineTo(162, 40); c.moveTo(162, 24); c.lineTo(162, 56); c.moveTo(174, 24); c.lineTo(174, 56); c.moveTo(174, 40); c.lineTo(196, 40); c.stroke();
      C.label(c, 'C', 168, 70, COL.b, 'center', 13);
    }

    C.label(c, iv > 0.05 ? '→ i' : iv < -0.05 ? '← i' : 'i = 0', 128, 18, COL.b, 'center', 12);

    var ox = 252, oy = type === 'L' ? 150 : 50, box = 110;
    var sc = box / Math.max(k.S, 1e-9);
    var pl = k.P * sc, ql = k.Q * sc;
    var maxL = Math.max(pl, Math.abs(ql));
    if (maxL > box) { sc *= box / maxL; pl = k.P * sc; ql = k.Q * sc; }
    c.fillStyle = type === 'L' ? 'rgba(255,180,104,.08)' : 'rgba(108,198,238,.08)';
    c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + pl, oy); c.lineTo(ox + pl, oy - ql); c.closePath(); c.fill();
    C.arrow(c, ox, oy, ox + pl, oy, COL.c, 2.6, 9);
    C.arrow(c, ox + pl, oy, ox + pl, oy - ql, COL.b, 2.6, 9);
    C.arrow(c, ox, oy, ox + pl, oy - ql, COL.f, 2.6, 9);
    C.label(c, 'P', ox + pl / 2, oy + (type === 'L' ? 13 : -11), COL.c, 'center', 12);
    C.label(c, 'Q', ox + pl + 12, oy - ql / 2, COL.b, 'left', 12);
    C.label(c, 'S', ox + pl / 2 - 12, oy - ql / 2 - (type === 'L' ? 6 : -6), COL.f, 'right', 12);
    if (Math.abs(ql) > 8 && pl > 8) {
      var ar = Math.min(26, pl * 0.5);
      c.strokeStyle = 'rgba(201,214,226,.6)';
      c.lineWidth = 1.2;
      c.beginPath();
      if (type === 'L') c.arc(ox, oy, ar, -Math.atan2(ql, pl), 0); else c.arc(ox, oy, ar, 0, Math.atan2(-ql, pl));
      c.stroke();
      C.label(c, 'φ', ox + ar + 8, oy + (type === 'L' ? -7 : 7), '#c9d6e2', 'left', 11);
    }
    C.label(c, L.tr('trougao snaga', 'power triangle'), ox + 55, type === 'L' ? 186 : 182, 'rgba(201,214,226,.65)', 'center', 10.5);
    c.restore();

    if (plotUI.begin()) {
      var ir = 0.85;
      plotUI.line(function (x) { return Math.sin(x); }, COL.a, 2.6);
      plotUI.line(function (x) { return ir * Math.sin(x - k.phi); }, COL.b, 2.4);
      plotUI.vline(th, 'rgba(238,243,247,.45)', 1, [4, 4]);
      plotUI.vline(th + TAU, 'rgba(238,243,247,.2)', 1, [4, 4]);
      plotUI.text('u', 0.05, 1.12, COL.a, 'left', 4);
      plotUI.text('i', TAU / 4 + k.phi, ir + 0.18, COL.b, 'center');
      plotUI.dot(th, Math.sin(th), COL.a, 4.5);
      plotUI.dot(th, ir * Math.sin(th - k.phi), COL.b, 4.5);
    }
    if (plotP.begin()) {
      var pf = function (x) { return Math.sin(x) * Math.sin(x - k.phi); };
      var avg = Math.cos(k.phi) / 2;
      plotP.fillBetween(function (x) { return Math.max(0, pf(x)); }, 'rgba(111,207,151,.35)', 0);
      plotP.fillBetween(function (x) { return Math.min(0, pf(x)); }, 'rgba(242,139,130,.4)', 0);
      plotP.line(pf, COL.c, 2.2);
      plotP.hline(avg, 'rgba(245,200,76,.9)', 1.3, [6, 4]);
      plotP.text('P', TAU * 2, avg, COL.f, 'right', -4, -9);
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

function compensate(id) {
  var fig = $(id), cv = fig.querySelector('canvas');
  var st = { p: 2000, pf1: 0.6, pf2: 0.95, u: 230, f: 50 };
  function calc() {
    var t1 = Math.tan(Math.acos(st.pf1)), t2 = Math.tan(Math.acos(Math.max(st.pf1, st.pf2)));
    var q1 = st.p * t1, q2 = st.p * t2, qc = q1 - q2;
    var cap = qc / (TAU * st.f * st.u * st.u);
    return { q1: q1, q2: q2, qc: qc, cap: cap, s1: st.p / st.pf1, s2: Math.hypot(st.p, q2) };
  }
  function readout() {
    var k = calc();
    $(id + '-calc').textContent = 'Q₁ = P·tg φ₁ = ' + pw(k.q1, 'var') + ' · Q₂ = P·tg φ₂ = ' + pw(k.q2, 'var') + ' · Q_C = Q₁ − Q₂ = ' + pw(k.qc, 'var');
    $(id + '-result').textContent = 'C = Q_C/(ωU²) = ' + L.fmtNum(k.cap * 1e6, 1) + ' μF';
    $(id + '-note').textContent = L.tr('Struja iz mreže pada sa ' + L.fmtNum(k.s1 / st.u, 2) + ' A na ' + L.fmtNum(k.s2 / st.u, 2) + ' A, a aktivna snaga ostaje ' + pw(st.p, 'W') + '.', 'The current from the mains drops from ' + L.fmtNum(k.s1 / st.u, 2) + ' A to ' + L.fmtNum(k.s2 / st.u, 2) + ' A, while the active power stays ' + pw(st.p, 'W') + '.');
  }
  L.range(id + '-p', { obj: st, key: 'p', fmt: function (v) { return pw(v, 'W'); }, on: readout });
  L.range(id + '-pf1', { obj: st, key: 'pf1', fmt: function (v) { return L.fmtNum(v, 2); }, on: readout });
  L.range(id + '-pf2', { obj: st, key: 'pf2', fmt: function (v) { return L.fmtNum(v, 2); }, on: readout });
  L.onLang(readout);
  var LW = 380, LH = 220;
  C.scene(fig, function (c, s) {
    var k = calc();
    c.save();
    C.fit(c, s, LW, LH);
    var ox = 40, oy = 196, maxQ = Math.max(k.q1, 1), sc = Math.min(260 / st.p, 170 / maxQ);
    var pl = st.p * sc, q1 = k.q1 * sc, q2 = k.q2 * sc;
    c.fillStyle = 'rgba(255,180,104,.08)';
    c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + pl, oy); c.lineTo(ox + pl, oy - q1); c.closePath(); c.fill();
    C.arrow(c, ox, oy, ox + pl, oy, COL.c, 2.8, 10);
    C.arrow(c, ox + pl, oy, ox + pl, oy - q1, COL.b, 2.6, 9);
    C.arrow(c, ox, oy, ox + pl, oy - q1, 'rgba(245,200,76,.55)', 2.2, 9);
    C.arrow(c, ox, oy, ox + pl, oy - q2, COL.f, 2.8, 10);
    if (q1 - q2 > 6) C.arrow(c, ox + pl + 18, oy - q1, ox + pl + 18, oy - q2, COL.a, 2.6, 9);
    C.label(c, 'P', ox + pl / 2, oy + 14, COL.c, 'center', 12);
    C.label(c, 'Q₁', ox + pl - 8, oy - q1 / 2, COL.b, 'right', 12);
    C.label(c, 'S₁', ox + pl / 2 - 14, oy - q1 / 2 - 8, 'rgba(245,200,76,.75)', 'right', 12);
    C.label(c, 'S₂', ox + pl / 2 + 6, oy - q2 / 2 + 14, COL.f, 'left', 12);
    if (q1 - q2 > 6) C.label(c, 'Q_C', ox + pl + 26, oy - (q1 + q2) / 2, COL.a, 'left', 12);
    c.restore();
  });
  readout();
}

window.PWRLAB = { power: power, compensate: compensate };
})();
