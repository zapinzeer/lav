(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var R = window.LAVR;
var nice = C.nice, engn = C.engn, signed = C.signed, setText = C.setText, decs = C.decs;

var MAT = {
  si: { v1: 0.6, nv: 0.04, vg: 0.7 },
  ge: { v1: 0.2, nv: 0.04, vg: 0.3 },
  led: { v1: 1.65, nv: 0.075, vg: 1.8 }
};

(function pn() {
  var fig = document.getElementById('lab-pn');
  var cvs = fig.querySelectorAll('canvas');
  var LW = 340, LH = 272, RS = 100, X0 = 30, X1 = 310, XM = 170, Y0 = 82, Y1 = 192;
  var d = { mat: 'si', E: 2, vd: 0.7, i: 0.013, wd: 14 };
  var holes = [], elec = [];
  var plot = new C.Plot(cvs[1], { x: [-4, 2], y: [-10, 40], xt: 6, yt: 5, xl: 'UD (V)', yl: 'ID (mA)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: drawPlot, xf: function (v) { return L.fmtNum(v, 0); }, yf: function (v) { return L.fmtNum(v, 0); } });

  function idiode(v, m) { return 1e-3 * Math.exp((Math.min(v, 3) - m.v1) / m.nv) - 1e-3 * Math.exp(-m.v1 / m.nv); }
  function solve() {
    var m = MAT[d.mat], lo = -12, hi = 4;
    for (var k = 0; k < 70; k++) {
      var mid = (lo + hi) / 2, g = (d.E - mid) / RS - idiode(mid, m);
      if (g > 0) lo = mid; else hi = mid;
    }
    d.vd = (lo + hi) / 2;
    d.i = Math.max(0, idiode(d.vd, m));
  }
  for (var i = 0; i < 20; i++) {
    holes.push({ x: X0 + 8 + Math.random() * (XM - X0 - 40), y: Y0 + 10 + Math.random() * (Y1 - Y0 - 20) });
    elec.push({ x: XM + 30 + Math.random() * (X1 - XM - 40), y: Y0 + 10 + Math.random() * (Y1 - Y0 - 20) });
  }

  function glow() {
    var g = Math.log10(Math.max(d.i, 1e-9) / 1e-6) / Math.log10(0.04 / 1e-6);
    return Math.max(0, Math.min(1, g));
  }

  function draw(c, s, dt) {
    var m = MAT[d.mat], vb = m.v1 + 0.1, vn = d.vd / vb;
    var wdT = Math.min(64, 6 + 26 * Math.sqrt(Math.max(0.04, 1 - vn)));
    d.wd += (wdT - d.wd) * Math.min(1, dt * 8);
    var g = glow(), sp = 130 * g;
    c.save();
    C.fit(c, s, LW, LH);

    c.fillStyle = 'rgba(108,198,238,.13)';
    c.fillRect(X0, Y0, XM - X0, Y1 - Y0);
    c.fillStyle = 'rgba(255,155,90,.13)';
    c.fillRect(XM, Y0, X1 - XM, Y1 - Y0);
    c.fillStyle = 'rgba(255,255,255,.07)';
    c.fillRect(XM - d.wd, Y0, 2 * d.wd, Y1 - Y0);
    c.strokeStyle = 'rgba(201,214,226,.5)';
    c.lineWidth = 1.6;
    c.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
    c.setLineDash([4, 4]);
    c.beginPath();
    c.moveTo(XM - d.wd, Y0); c.lineTo(XM - d.wd, Y1);
    c.moveTo(XM + d.wd, Y0); c.lineTo(XM + d.wd, Y1);
    c.stroke();
    c.setLineDash([]);

    c.font = '700 12px "IBM Plex Mono", monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = 'rgba(255,255,255,.45)';
    var cols = Math.max(1, Math.floor(d.wd / 12));
    for (var cx = 0; cx < cols; cx++) for (var r = 0; r < 5; r++) {
      var yy = Y0 + 14 + r * (Y1 - Y0 - 20) / 4;
      c.fillText('−', XM - 8 - cx * 12, yy);
      c.fillText('+', XM + 8 + cx * 12, yy);
    }

    var rim = XM - d.wd - 4, rimN = XM + d.wd + 4;
    holes.forEach(function (p) {
      if (g > 0.05) {
        p.x += sp * dt;
        if (p.x > XM + 6 + (p.y % 14)) { p.x = X0 + 6; p.y = Y0 + 10 + Math.random() * (Y1 - Y0 - 20); }
      } else {
        p.x += (Math.random() - 0.5) * 30 * dt;
        p.y += (Math.random() - 0.5) * 30 * dt;
      }
      if (p.x > rim && g <= 0.05) p.x -= 90 * dt;
      p.x = Math.max(X0 + 6, p.x);
      p.y = Math.max(Y0 + 8, Math.min(Y1 - 8, p.y));
      if (p.x > rim && g > 0.05 && p.x < rimN) return;
      c.strokeStyle = '#6cc6ee';
      c.lineWidth = 1.8;
      c.beginPath();
      c.arc(p.x, p.y, 6, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = '#6cc6ee';
      c.fillText('+', p.x, p.y + 0.5);
    });
    elec.forEach(function (p) {
      if (g > 0.05) {
        p.x -= sp * dt;
        if (p.x < XM - 6 - (p.y % 14)) { p.x = X1 - 6; p.y = Y0 + 10 + Math.random() * (Y1 - Y0 - 20); }
      } else {
        p.x += (Math.random() - 0.5) * 30 * dt;
        p.y += (Math.random() - 0.5) * 30 * dt;
      }
      if (p.x < rimN && g <= 0.05) p.x += 90 * dt;
      p.x = Math.min(X1 - 6, p.x);
      p.y = Math.max(Y0 + 8, Math.min(Y1 - 8, p.y));
      c.fillStyle = '#ffb468';
      c.beginPath();
      c.arc(p.x, p.y, 6, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#1b1208';
      c.fillText('−', p.x, p.y + 0.5);
    });

    C.label(c, 'P', (X0 + XM - d.wd) / 2, Y0 - 10, '#6cc6ee', 'center', 15);
    C.label(c, 'N', (X1 + XM + d.wd) / 2, Y0 - 10, '#ffb468', 'center', 15);
    C.label(c, L.tr('A (anoda)', 'A (anode)'), X0, Y1 + 18, '#c9d6e2', 'left', 11);
    C.label(c, L.tr('K (katoda)', 'K (cathode)'), X1, Y1 + 18, '#c9d6e2', 'right', 11);
    C.label(c, L.tr('osiromašeni sloj', 'depletion layer'), XM, Y1 + 18, '#98a5b1', 'center', 10.5);
    if (g > 0.05) {
      C.arrow(c, X0 + 6, 46, X0 + 6 + 30 + 120 * g, 46, '#ffb468', 2 + 3 * g, 10);
      C.label(c, 'I', X0 + 6 + 30 + 120 * g + 14, 46, '#ffb468', 'left', 13);
    }
    C.label(c, 'E = ' + signed(d.E, 1) + ' V', LW - 14, 18, '#c9d6e2', 'right', 12);
    C.chipLabel(c, 'UD = ' + L.fmtNum(d.vd, 2) + ' V', 90, 250, '#ffe45c', 12);
    C.chipLabel(c, 'ID = ' + (d.i < 1e-6 ? '≈ 0' : engn(d.i, 'A', 3)), 250, 250, '#6fcf97', 12);
    c.restore();
    drawPlot();
  }

  function drawPlot() {
    var m = MAT[d.mat];
    if (!plot.begin()) return;
    plot.vline(m.vg, 'rgba(255,255,255,.28)', 1.2, [4, 4]);
    plot.line(function (v) { return idiode(v, m) * 1000; }, C.COL.c, 2.8, { n: 500 });
    plot.line(function (v) { return (d.E - v) / RS * 1000; }, 'rgba(255,180,104,.7)', 1.6, { dash: [6, 4] });
    plot.dot(d.vd, d.i * 1000, '#fff', 6);
    plot.text('Vγ ≈ ' + L.fmtNum(m.vg, 1) + ' V', m.vg - 0.08, 36, '#e9f0f6', 'right', 0, 0);
  }

  function read() {
    solve();
    var m = MAT[d.mat], calc = 'UD = E − I·R = ' + signed(d.E, 1) + ' V − ' + engn(d.i, 'A', 3) + ' · ' + RS + ' Ω';
    var state = d.vd < 0 ? L.tr('zaporni smer: dioda ne vodi', 'reverse direction: the diode does not conduct') : d.i < 1e-4 ? L.tr('napon je ispod praga: dioda skoro ne vodi', 'the voltage is below the threshold: the diode hardly conducts') : L.tr('propusni smer: dioda vodi', 'forward direction: the diode conducts');
    setText(document.getElementById('p-calc'), calc);
    setText(document.getElementById('p-result'), 'UD = ' + L.fmtNum(d.vd, 2) + ' V <small>· ' + state + '</small>', true);
    setText(document.getElementById('p-note'), L.tr('Prag vođenja ovog materijala je oko ', 'The conduction threshold of this material is about ') + L.fmtNum(m.vg, 1) + ' V. ' + L.tr('Kada dioda vodi, napon na njoj ostaje skoro stalan, a ostatak napona pada na otporniku.', 'When the diode conducts, the voltage across it stays almost constant, and the rest of the voltage drops on the resistor.'));
  }

  C.scene(fig, draw);
  L.range('p-e', { obj: d, key: 'E', fmt: function (v) { return signed(v, 1) + ' V'; }, on: read });
  C.toggle(document.getElementById('p-mat'), function (v) { d.mat = v; read(); });
  L.onLang(read);
})();

function rectLab(id, cfg) {
  var fig = document.getElementById(id);
  var cvs = fig.querySelectorAll('canvas');
  var s = cfg.state, sim = null, tv = 0;
  var LW = 360, LH = 232, Y1 = 44, Y2 = 196, XS = 46, XD = 110, XA = 200, XR = 300;
  var pLoad = [[46, 93], [46, 44], [132, 44], [300, 44], [300, 196], [46, 196], [46, 137], [46, 93]];
  var pCap = [[46, 93], [46, 44], [132, 44], [200, 44], [200, 196], [46, 196], [46, 137], [46, 93]];
  var pDis = [[200, 44], [300, 44], [300, 196], [200, 196], [200, 44]];
  var ph = [0, 0, 0];
  var plotA = new C.Plot(cvs[1], { x: [0, 40], y: [-1, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'u (V)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: function () { drawPlots(); } });
  var plotB = cfg.current ? new C.Plot(cvs[2], { x: [0, 40], y: [0, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'iD (A)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: function () { drawPlots(); } }) : null;

  function resim() {
    var vg = typeof s.vg === 'number' ? s.vg : 0.7;
    sim = R.simulate({ Um: s.Um, f: 50, nd: 1, Vg: vg, R: s.R, C: (s.C || 0) * 1e-6, flip: !!s.flip, full: false, show: 2 });
    cfg.read(sim, s);
  }

  function state(t) {
    var i = Math.min(sim.us.length - 1, Math.floor(t / sim.dt));
    return { us: sim.us[i], uo: sim.uo[i], id: sim.id[i], on: sim.on[i] };
  }

  function drawCircuit(c, sc, dt) {
    var T2 = 2 * sim.T, sg = s.flip ? -1 : 1;
    tv = (tv + dt * T2 / 8) % T2;
    var st = state(tv), hasC = s.C > 0;
    var iR = st.uo / s.R, iD = st.id;
    var imax = Math.max(sim.stat.idMax, sim.stat.max / s.R, 1e-6);
    c.save();
    C.fit(c, sc, LW, LH);
    var W = R.WIRE;
    C.polyline(c, [[46, 93], [46, 44], [88, 44]], W, 2.4);
    C.polyline(c, [[132, 44], [300, 44], [300, 90]], W, 2.4);
    C.polyline(c, [[300, 150], [300, 196], [46, 196], [46, 137]], W, 2.4);
    if (hasC) {
      C.polyline(c, [[200, 44], [200, 117]], W, 2.4);
      C.polyline(c, [[200, 133], [200, 196]], W, 2.4);
      R.node(c, 200, 44);
      R.node(c, 200, 196);
    }
    R.resistor(c, 300, 120, Math.PI / 2, 60);
    if (hasC) R.capacitor(c, 200, 125, Math.PI / 2);

    var toLoad = hasC ? Math.min(iD, iR) : iD, toCap = hasC ? Math.max(0, iD - iR) : 0, dis = hasC ? Math.max(0, iR - iD) : 0;
    var spd = [R.speed(toLoad, imax), R.speed(toCap, imax), R.speed(dis, imax)];
    ph[0] += dt * spd[0] * sg;
    ph[1] += dt * spd[1];
    ph[2] += dt * spd[2];
    R.dots(c, pLoad, ph[0], spd[0] > 0 ? 0.95 : 0);
    if (hasC) {
      R.dots(c, pCap, ph[1], spd[1] > 0 ? 0.95 : 0, '#6cc6ee');
      R.dots(c, pDis, ph[2], spd[2] > 0 ? 0.95 : 0, '#ffe45c');
    }

    R.source(c, XS, 115, 22, st.us, s.Um);
    R.diode(c, XD, 44, s.flip ? Math.PI : 0, st.on);
    C.mathLabel(c, 'u₂', 18, 115, '#e9f0f6', 'center', 16);
    C.label(c, 'D', XD, 22, '#c9d6e2', 'center', 13);
    C.label(c, st.on ? L.tr('vodi', 'conducts') : L.tr('ne vodi', 'blocks'), XD, 66, st.on ? '#6fcf97' : '#98a5b1', 'center', 11);
    C.mathLabel(c, 'R', 280, 120, '#e9f0f6', 'center', 16);
    if (hasC) {
      C.mathLabel(c, 'C', 178, 125, '#e9f0f6', 'center', 16);
      var lvl = Math.max(0, Math.min(1, st.uo / s.Um));
      c.fillStyle = 'rgba(111,207,151,.25)';
      c.fillRect(214, 96, 9, 58);
      c.fillStyle = '#6fcf97';
      c.fillRect(214, 154 - 58 * lvl, 9, 58 * lvl);
    }
    C.chipLabel(c, 'u₂ = ' + signed(st.us, 1) + ' V', 130, 215, '#c9d6e2', 11.5);
    C.chipLabel(c, 'uizl = ' + L.fmtNum(sg * st.uo, 1) + ' V', 262, 215, '#ffb468', 11.5);
    c.restore();
    drawPlots();
  }

  function drawPlots() {
    if (!sim) return;
    var T = sim.T, sg = s.flip ? -1 : 1, tms = 1000 * T * 2;
    var sa = C.symAxis(s.Um * 1.15);
    plotA.x = [0, tms];
    plotA.y = [-sa.top, sa.top];
    plotA.yt = sa.ticks;
    var yd = decs(2 * sa.top / sa.ticks), xd = decs(tms / 4);
    plotA.xf = function (v) { return L.fmtNum(v, xd); };
    plotA.yf = function (v) { return L.fmtNum(v, yd); };
    if (plotA.begin()) {
      var us = function (t) { return R.sample(sim.us, sim.dt, t / 1000); };
      var uo = function (t) { return sg * R.sample(sim.uo, sim.dt, t / 1000); };
      plotA.fillBetween(uo, 'rgba(255,180,104,.16)');
      plotA.line(us, 'rgba(255,255,255,.45)', 1.6, { dash: [5, 4], n: 500 });
      plotA.line(uo, C.COL.b, 2.8, { n: 500 });
      if (cfg.ripple && s.C > 0) {
        var mx = sim.stat.max, mn = sim.stat.min;
        plotA.hline(mx, 'rgba(111,207,151,.8)', 1.2, [3, 3]);
        plotA.hline(mn, 'rgba(111,207,151,.8)', 1.2, [3, 3]);
      }
      var tt = tv * 1000, cur = uo(tt);
      plotA.vline(tt, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
      plotA.dot(tt, us(tt), '#fff', 4.5);
      plotA.dot(tt, cur, C.COL.b, 5.5);
    }
    if (plotB) {
      var ia = C.niceAxis(Math.max(sim.stat.idMax * 1.1, 1e-4));
      plotB.y = [0, ia.max];
      plotB.yt = ia.ticks;
      plotB.x = [0, tms];
      plotB.xt = 4;
      plotB.xf = plotA.xf;
      var iyd = decs(ia.max / ia.ticks);
      plotB.yf = function (v) { return L.fmtNum(v, iyd); };
      if (plotB.begin()) {
        var idf = function (t) { return R.sample(sim.id, sim.dt, t / 1000); };
        plotB.fillBetween(idf, 'rgba(111,207,151,.2)');
        plotB.line(idf, C.COL.c, 2.2, { n: 700 });
        var t2 = tv * 1000;
        plotB.vline(t2, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
        plotB.dot(t2, idf(t2), C.COL.c, 5);
      }
    }
  }

  C.scene(fig, drawCircuit);
  resim();
  return { resim: resim, state: s };
}

(function half() {
  var s = { Um: 10, vg: 0.7, R: 100, C: 0, flip: false };
  var VG = { ideal: 0, si: 0.7, ge: 0.3 };
  var lab;
  function read(sim) {
    var st = sim.stat, Um = s.Um;
    var ideal = Um / Math.PI, vg = s.vg;
    setText(document.getElementById('h-calc'), L.tr('Udc = Um/π · Uef = Um/2 · idealno: ', 'Udc = Um/π · Uef = Um/2 · ideal: ') + engn(ideal, 'V', 3) + ' · ' + engn(Um / 2, 'V', 3));
    setText(document.getElementById('h-result'), 'Udc = ' + (s.flip ? '−' : '') + engn(st.avg, 'V', 3) + ' <small>· ' + L.tr('najveći napon ', 'peak output ') + engn(st.max, 'V', 3) + ' · PIV = ' + engn(st.piv, 'V', 3) + '</small>', true);
    var parts = [];
    parts.push(L.tr('Prolazi samo jedna poluperioda, pa je izlaz pulsirajući jednosmerni napon sa frekvencijom 50 Hz.', 'Only one half-cycle passes, so the output is a pulsating direct voltage with a frequency of 50 Hz.'));
    if (vg > 0) parts.push(L.tr('Dioda troši ' + L.fmtNum(vg, 1) + ' V, pa je izlazni napon manji od ulaznog za toliko.', 'The diode uses up ' + L.fmtNum(vg, 1) + ' V, so the output voltage is lower than the input by that much.'));
    if (s.flip) parts.push(L.tr('Obrnuta dioda propušta negativnu poluperiodu: izlaz je negativan.', 'A reversed diode passes the negative half-cycle: the output is negative.'));
    setText(document.getElementById('h-note'), parts.join(' '));
  }
  lab = rectLab('lab-half', { state: s, read: read, current: false, ripple: false });
  L.range('h-um', { obj: s, key: 'Um', fmt: function (v) { return v + ' V'; }, on: function () { lab.resim(); } });
  L.range('h-r', { obj: s, key: 'R', fmt: function (v) { return engn(v, 'Ω'); }, on: function () { lab.resim(); } });
  C.toggle(document.getElementById('h-vg'), function (v) { s.vg = VG[v]; lab.resim(); });
  document.getElementById('h-flip').addEventListener('change', function (e) { s.flip = e.target.checked; lab.resim(); });
  L.onLang(function () { lab.resim(); });
})();

(function filt() {
  var s = { Um: 17, vg: 0.7, R: 100, C: 1000, flip: false };
  var CS = [100, 220, 470, 1000, 2200, 4700], RS = [47, 100, 220, 470, 1000];
  var lab;
  function read(sim) {
    var st = sim.stat, f = 50, C0 = s.C * 1e-6;
    var iDC = st.avg / s.R, dform = iDC / (f * C0);
    var rfac = st.avg > 0 ? st.ripple / (2 * Math.sqrt(3) * st.avg) : 0;
    setText(document.getElementById('f-calc'), L.tr('Δu ≈ Idc / (f·C) = ', 'Δu ≈ Idc / (f·C) = ') + engn(iDC, 'A', 3) + ' / (50 Hz · ' + engn(C0, 'F', 3) + ') = ' + engn(dform, 'V', 3));
    setText(document.getElementById('f-result'), 'Udc = ' + engn(st.avg, 'V', 3) + ' <small>· Δu = ' + engn(st.ripple, 'V', 3) + ' · ' + L.tr('talasanje ', 'ripple ') + nice(rfac * 100, 2) + ' %</small>', true);
    var parts = [L.tr('Dioda vodi samo kratko, pri vrhu sinusoide, i tada dopunjava kondenzator. Zato je struja diode niz kratkih, jakih impulsa: najveći je ' + engn(st.idMax, 'A', 2) + ', a srednja struja opterećenja samo ' + engn(iDC, 'A', 2) + '.', 'The diode conducts only briefly, near the top of the sine, and then it tops up the capacitor. That is why the diode current is a train of short strong pulses: the largest is ' + engn(st.idMax, 'A', 2) + ', while the mean load current is only ' + engn(iDC, 'A', 2) + '.')];
    if (dform > 0.25 * s.Um) parts.push(L.tr('Pri ovako velikom talasanju formula je gruba, jer pražnjenje kondenzatora nije linearno.', 'At such a large ripple the formula is rough, because the discharge of the capacitor is not linear.'));
    parts.push(L.tr('Napon na zakočenoj diodi dostiže ' + engn(st.piv, 'V', 3) + ', to jest ' + nice(st.piv / s.Um, 2) + ' · Um.', 'The voltage across the blocked diode reaches ' + engn(st.piv, 'V', 3) + ', that is ' + nice(st.piv / s.Um, 2) + ' · Um.'));
    setText(document.getElementById('f-note'), parts.join(' '));
  }
  var ix = { c: 3, r: 1 };
  function apply() {
    s.C = CS[ix.c];
    s.R = RS[ix.r];
    lab.resim();
  }
  s.C = CS[ix.c];
  s.R = RS[ix.r];
  lab = rectLab('lab-filt', { state: s, read: read, current: true, ripple: true });
  L.range('f-c', { obj: ix, key: 'c', fmt: function (i) { return CS[i] + ' μF'; }, on: apply });
  L.range('f-r', { obj: ix, key: 'r', fmt: function (i) { return RS[i] + ' Ω'; }, on: apply });
  L.range('f-um', { obj: s, key: 'Um', fmt: function (v) { return v + ' V'; }, on: function () { lab.resim(); } });
  L.onLang(function () { lab.resim(); });
})();

(function dim() {
  var fig = document.getElementById('lab-dim');
  var cv = fig.querySelector('canvas');
  var U2S = [6, 9, 12, 15, 18, 24], IS = [50, 100, 200, 300, 500, 1000], DS = [0.2, 0.5, 1, 2];
  var STD = [100, 150, 220, 330, 470, 680, 1000, 1500, 2200, 3300, 4700, 6800, 10000];
  var VCS = [10, 16, 25, 35, 50, 63, 100];
  var q = { u: 2, i: 2, d: 2, plan: null };
  var plot = new C.Plot(cv, { x: [0, 40], y: [0, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'uizl (V)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: draw, xf: function (v) { return L.fmtNum(v, 0); } });

  function plan() {
    var u2 = U2S[q.u], iL = IS[q.i] / 1000, du = DS[q.d], Um = u2 * Math.SQRT2, vg = 0.7;
    var Udc = Um - vg - du / 2, Cmin = iL / (50 * du) * 1e6;
    var Cstd = STD.filter(function (c) { return c >= Cmin; })[0] || STD[STD.length - 1];
    var Rl = Udc / iL;
    var sim = R.simulate({ Um: Um, f: 50, nd: 1, Vg: vg, R: Rl, C: Cstd * 1e-6, show: 2 });
    var Vc = VCS.filter(function (v) { return v >= 1.5 * Um; })[0];
    return { Vc: Vc, u2: u2, iL: iL, du: du, Um: Um, Udc: Udc, Cmin: Cmin, Cstd: Cstd, Rl: Rl, sim: sim };
  }

  function draw() {
    var p = q.plan;
    if (!p) return;
    var top = C.niceAxis(p.Um * 1.1);
    plot.y = [0, top.max];
    plot.yt = top.ticks;
    var yd = decs(top.max / top.ticks);
    plot.yf = function (v) { return L.fmtNum(v, yd); };
    if (!plot.begin()) return;
    plot.line(function (t) { return R.sample(p.sim.us, p.sim.dt, t / 1000); }, 'rgba(255,255,255,.4)', 1.5, { dash: [5, 4], n: 500 });
    plot.line(function (t) { return R.sample(p.sim.uo, p.sim.dt, t / 1000); }, C.COL.b, 2.8, { n: 500 });
    plot.hline(p.Um - 0.7, 'rgba(111,207,151,.7)', 1.2, [3, 3]);
  }

  function read() {
    var p = plan();
    q.plan = p;
    var st = p.sim.stat;
    setText(document.getElementById('d-calc'), 'Um = U2·√2 = ' + nice(p.u2, 3) + ' · 1,414 = ' + engn(p.Um, 'V', 3) + ' · C ≥ Idc / (f·Δu) = ' + engn(p.iL, 'A', 3) + ' / (50 Hz · ' + engn(p.du, 'V', 3) + ') = ' + engn(p.Cmin * 1e-6, 'F', 3));
    setText(document.getElementById('d-result'), 'C = ' + p.Cstd + ' μF <small>· Udc ≈ ' + engn(st.avg, 'V', 3) + ' · Δu = ' + engn(st.ripple, 'V', 3) + '</small>', true);
    setText(document.getElementById('d-note'), L.tr('Opterećenje je R = Udc/Idc = ' + engn(p.Rl, 'Ω', 3) + '. Dioda mora izdržati inverzni napon od najmanje 2·Um = ' + engn(2 * p.Um, 'V', 3) + ' i srednju struju od ' + engn(p.iL, 'A', 3) + ', a zbog impulsa najveće struje ' + engn(st.idMax, 'A', 2) + ' biraj diodu sa rezervom (npr. 1N4007: 1000 V, 1 A). Kondenzator treba radni napon od bar 1,5·Um = ' + engn(1.5 * p.Um, 'V', 3) + ', to jest standardnih ' + p.Vc + ' V.', 'The load is R = Udc/Idc = ' + engn(p.Rl, 'Ω', 3) + '. The diode must withstand a reverse voltage of at least 2·Um = ' + engn(2 * p.Um, 'V', 3) + ' and a mean current of ' + engn(p.iL, 'A', 3) + ', and because of the peak current pulses of ' + engn(st.idMax, 'A', 2) + ' choose a diode with a margin (e.g. 1N4007: 1000 V, 1 A). The capacitor needs a voltage rating of at least 1.5·Um = ' + engn(1.5 * p.Um, 'V', 3) + ', that is a standard ' + p.Vc + ' V.'));
    draw();
  }

  L.range('d-u', { obj: q, key: 'u', fmt: function (i) { return U2S[i] + ' V'; }, on: read });
  L.range('d-i', { obj: q, key: 'i', fmt: function (i) { return IS[i] + ' mA'; }, on: read });
  L.range('d-d', { obj: q, key: 'd', fmt: function (i) { return L.fmtNum(DS[i], DS[i] % 1 ? 1 : 0) + ' V'; }, on: read });
  L.onLang(read);
})();
})();
