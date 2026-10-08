(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var R = window.LAVR;
var nice = C.nice, engn = C.engn, signed = C.signed, setText = C.setText, decs = C.decs;
var CS = [0, 100, 220, 470, 1000, 2200, 4700];

function cText(i) { return i ? CS[i] + ' μF' : L.tr('bez C', 'no C'); }

function timeAxis(plot, sim) {
  var tms = 1000 * sim.T * 2, xd = decs(tms / 4);
  plot.x = [0, tms];
  plot.xt = 4;
  plot.xf = function (v) { return L.fmtNum(v, xd); };
  return tms;
}

function voltAxis(plot, top) {
  var ax = C.niceAxis(top);
  plot.y = [0, ax.max];
  plot.yt = ax.ticks;
  var yd = decs(ax.max / ax.ticks);
  plot.yf = function (v) { return L.fmtNum(v, yd); };
  return ax;
}

(function bridge() {
  var fig = document.getElementById('lab-bridge');
  var cvs = fig.querySelectorAll('canvas');
  var s = { Um: 17, R: 100, ci: 0, mode: 'auto', fault: false };
  var sim = null, tv = 0, ph = { inn: 0, cap: 0, ld: 0 };
  var LW = 380, LH = 268, W = R.WIRE, SX = 48;
  var T = [190, 56], B = [190, 204], LF = [130, 130], RT = [250, 130];
  var D = [
    { n: 'D1', a: T, k: RT, pos: true },
    { n: 'D2', a: B, k: RT, pos: false },
    { n: 'D3', a: LF, k: T, pos: false },
    { n: 'D4', a: LF, k: B, pos: true }
  ];
  var pPos = [[292, 176], [270, 176], [270, 250], [130, 250], [130, 130], [190, 204], [190, 236], [SX, 236], [SX, 152], [SX, 108], [SX, 24], [190, 24], [190, 56], [250, 130], [270, 130], [270, 84], [292, 84]];
  var pNeg = [[292, 176], [270, 176], [270, 250], [130, 250], [130, 130], [190, 56], [190, 24], [SX, 24], [SX, 108], [SX, 152], [SX, 236], [190, 236], [190, 204], [250, 130], [270, 130], [270, 84], [292, 84]];
  var pCap = [[292, 84], [292, 176]];
  var pLd = [[292, 84], [336, 84], [336, 176], [292, 176]];
  var plotA = new C.Plot(cvs[1], { x: [0, 40], y: [0, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'u (V)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: function () { drawPlots(); } });
  var plotB = new C.Plot(cvs[2], { x: [0, 40], y: [0, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'iD (A)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: function () { drawPlots(); } });

  function resim() {
    sim = R.simulate({ Um: s.Um, f: 50, nd: 2, Vg: 0.7, R: s.R, C: CS[s.ci] * 1e-6, full: !s.fault, show: 2 });
    read();
  }

  function read() {
    var st = sim.stat, Um = s.Um, hasC = s.ci > 0;
    setText(document.getElementById('b-calc'), L.tr('Udc = 2Um/π · Uef = Um/√2 · idealno: ', 'Udc = 2Um/π · Urms = Um/√2 · ideal: ') + engn(2 * Um / Math.PI, 'V', 3) + ' · ' + engn(Um / Math.SQRT2, 'V', 3));
    setText(document.getElementById('b-result'), 'Udc = ' + engn(st.avg, 'V', 3) + ' <small>· ' + L.tr('najveći napon ', 'peak output ') + engn(st.max, 'V', 3) + (hasC ? ' · Δu = ' + engn(st.ripple, 'V', 3) : '') + ' · PIV = ' + engn(st.piv, 'V', 3) + '</small>', true);
    var parts = [];
    if (s.fault) {
      parts.push(L.tr('Dioda D3 je prekinuta: negativna poluperioda se gubi i usmerivač radi kao poluperiodni. Pulsevi su na 50 Hz, a srednji napon je otprilike upola manji.', 'The diode D3 is open: the negative half-cycle is lost and the rectifier works as a half-wave one. The pulses are at 50 Hz, and the average voltage is about half as large.'));
    } else {
      parts.push(L.tr('Dok je gornji kraj izvora pozitivan, vode D1 i D4, a kada je pozitivan donji kraj, vode D2 i D3. Struja kroz opterećenje uvek ima isti smer, pa su obe poluperiode iskorišćene.', 'While the upper end of the source is positive, D1 and D4 conduct, and when the lower end is positive, D2 and D3 conduct. The current through the load always has the same direction, so both half-cycles are used.'));
      parts.push(hasC ? L.tr('Dopuna kondenzatora dolazi 100 puta u sekundi, pa je talasanje upola manje nego kod poluperiodnog usmerivača.', 'The capacitor is topped up 100 times per second, so the ripple is half that of a half-wave rectifier.') : L.tr('Pulsevi dolaze 100 puta u sekundi, a dioda pad od dva puta 0,7 V skida sa svakog vrha.', 'The pulses come 100 times per second, and two drops of 0.7 V are taken off every peak.'));
    }
    setText(document.getElementById('b-note'), parts.join(' '));
  }

  function drawCircuit(c, sc, dt) {
    if (!sim) return;
    var T2 = 2 * sim.T;
    if (s.mode === 'auto') tv = (tv + dt * T2 / 8) % T2;
    else tv = (s.mode === 'pos' ? 0.25 : 0.75) * sim.T;
    var i = Math.min(sim.us.length - 1, Math.floor(tv / sim.dt));
    var us = sim.us[i], uo = sim.uo[i], id = sim.id[i], on = sim.on[i];
    var hasC = s.ci > 0, iR = uo / s.R, iC = hasC ? id - iR : 0, posHalf = us >= 0;
    var imax = Math.max(sim.stat.idMax, sim.stat.max / s.R, 1e-6);
    var spIn = R.speed(id, imax), spLd = R.speed(iR, imax), spCp = R.speed(Math.abs(iC), imax);
    ph.inn += dt * spIn;
    ph.cap += dt * spCp * (iC >= 0 ? 1 : -1);
    ph.ld += dt * spLd;

    c.save();
    C.fit(c, sc, LW, LH);
    C.polyline(c, [[SX, 108], [SX, 24], [190, 24], [190, 56]], W, 2.4);
    C.polyline(c, [[130, 130], [130, 250], [270, 250], [270, 176], [336, 176]], W, 2.4);
    c.strokeStyle = W;
    c.lineWidth = 2.4;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(SX, 152);
    c.lineTo(SX, 236);
    c.lineTo(122, 236);
    c.arc(130, 236, 8, Math.PI, 0);
    c.lineTo(190, 236);
    c.lineTo(190, 204);
    c.stroke();
    C.polyline(c, [T, RT, B, LF, T], W, 2.4);
    C.polyline(c, [[250, 130], [270, 130], [270, 84], [336, 84]], W, 2.4);
    C.polyline(c, [[336, 84], [336, 102]], W, 2.4);
    C.polyline(c, [[336, 158], [336, 176]], W, 2.4);
    R.resistor(c, 336, 130, Math.PI / 2, 56);
    if (hasC) {
      C.polyline(c, [[292, 84], [292, 122]], W, 2.4);
      C.polyline(c, [[292, 138], [292, 176]], W, 2.4);
      R.capacitor(c, 292, 130, Math.PI / 2);
      R.node(c, 292, 84);
      R.node(c, 292, 176);
    }

    R.dots(c, posHalf ? pPos : pNeg, ph.inn, spIn > 0 ? 0.95 : 0);
    R.dots(c, pLd, ph.ld, spLd > 0 ? 0.95 : 0);
    if (hasC) R.dots(c, pCap, ph.cap, spCp > 0 ? 0.95 : 0, iC >= 0 ? '#6cc6ee' : '#ffe45c');

    R.source(c, SX, 130, 22, us, s.Um);
    D.forEach(function (d) {
      var cx = (d.a[0] + d.k[0]) / 2, cy = (d.a[1] + d.k[1]) / 2;
      var ang = Math.atan2(d.k[1] - d.a[1], d.k[0] - d.a[0]);
      var lit = on && (d.pos === posHalf);
      var broken = s.fault && d.n === 'D3';
      R.diode(c, cx, cy, ang, lit);
      var ox = cx - 190, oy = cy - 130, ol = Math.hypot(ox, oy);
      C.label(c, d.n, cx + ox / ol * 25, cy + oy / ol * 25, broken ? '#f28b82' : lit ? '#6fcf97' : '#c9d6e2', 'center', 12);
      if (broken) {
        c.strokeStyle = '#f28b82';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(cx - 9, cy - 9); c.lineTo(cx + 9, cy + 9);
        c.moveTo(cx + 9, cy - 9); c.lineTo(cx - 9, cy + 9);
        c.stroke();
      }
    });
    C.mathLabel(c, 'u₂', 16, 130, '#e9f0f6', 'center', 16);
    C.mathLabel(c, 'R', 358, 130, '#e9f0f6', 'center', 16);
    if (hasC) C.mathLabel(c, 'C', 314, 130, '#e9f0f6', 'center', 16);
    C.chipLabel(c, 'u₂ = ' + signed(us, 1) + ' V', 108, 9, '#c9d6e2', 11.5);
    C.chipLabel(c, 'uizl = ' + L.fmtNum(uo, 1) + ' V', 300, 9, '#ffb468', 11.5);
    c.restore();
    drawPlots();
  }

  function drawPlots() {
    if (!sim) return;
    var tms = timeAxis(plotA, sim);
    voltAxis(plotA, s.Um * 1.1);
    plotB.x = plotA.x;
    plotB.xt = 4;
    plotB.xf = plotA.xf;
    if (plotA.begin()) {
      var uo = function (t) { return R.sample(sim.uo, sim.dt, t / 1000); };
      plotA.fillBetween(uo, 'rgba(255,180,104,.16)');
      plotA.line(function (t) { return Math.abs(R.sample(sim.us, sim.dt, t / 1000)); }, 'rgba(255,255,255,.4)', 1.4, { dash: [5, 4], n: 500 });
      plotA.line(uo, C.COL.b, 2.8, { n: 500 });
      var tt = tv * 1000;
      plotA.vline(tt, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
      plotA.dot(tt, uo(tt), C.COL.b, 5.5);
      plotA.text('|u₂|', tms * 0.02, plotA.y[1] * 0.93, 'rgba(255,255,255,.7)', 'left', 0, 0);
      plotA.text('uizl', tms * 0.17, plotA.y[1] * 0.93, C.COL.b, 'left', 0, 0);
    }
    var ia = C.niceAxis(Math.max(sim.stat.idMax * 1.1, 1e-4));
    plotB.y = [0, ia.max];
    plotB.yt = ia.ticks;
    var iyd = decs(ia.max / ia.ticks);
    plotB.yf = function (v) { return L.fmtNum(v, iyd); };
    if (plotB.begin()) {
      var idf = function (t) { return R.sample(sim.id, sim.dt, t / 1000); };
      var posF = function (t) { return R.sample(sim.us, sim.dt, t / 1000) >= 0 ? idf(t) : 0; };
      var negF = function (t) { return R.sample(sim.us, sim.dt, t / 1000) < 0 ? idf(t) : 0; };
      plotB.fillBetween(posF, 'rgba(111,207,151,.22)');
      plotB.fillBetween(negF, 'rgba(179,155,242,.22)');
      plotB.line(posF, C.COL.c, 2.2, { n: 900 });
      plotB.line(negF, C.COL.e, 2.2, { n: 900 });
      plotB.vline(tv * 1000, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
      plotB.text('D1, D4', tms * 0.02, ia.max * 0.9, C.COL.c, 'left', 0, 0);
      plotB.text('D2, D3', tms * 0.3, ia.max * 0.9, C.COL.e, 'left', 0, 0);
    }
  }

  C.scene(fig, drawCircuit);
  resim();
  L.range('b-um', { obj: s, key: 'Um', fmt: function (v) { return v + ' V'; }, on: resim });
  L.range('b-r', { obj: s, key: 'R', fmt: function (v) { return engn(v, 'Ω'); }, on: resim });
  L.range('b-c', { obj: s, key: 'ci', fmt: cText, on: resim });
  C.toggle(document.getElementById('b-mode'), function (v) { s.mode = v; });
  document.getElementById('b-fault').addEventListener('change', function (e) { s.fault = e.target.checked; resim(); });
  L.onLang(resim);
})();

(function cmp() {
  var fig = document.getElementById('lab-cmp');
  var cv = fig.querySelector('canvas');
  var s = { Um: 17, R: 100, ci: 4 };
  var a = null, b = null;
  var plot = new C.Plot(cv, { x: [0, 40], y: [0, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'uizl (V)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: draw });

  function resim() {
    var Cc = CS[s.ci] * 1e-6;
    a = R.simulate({ Um: s.Um, f: 50, nd: 1, Vg: 0.7, R: s.R, C: Cc, full: false, show: 2 });
    b = R.simulate({ Um: s.Um, f: 50, nd: 2, Vg: 0.7, R: s.R, C: Cc, full: true, show: 2 });
    read();
    draw();
  }

  function draw() {
    if (!a) return;
    var tms = timeAxis(plot, a);
    voltAxis(plot, s.Um * 1.1);
    if (!plot.begin()) return;
    plot.line(function (t) { return R.sample(a.uo, a.dt, t / 1000); }, C.COL.a, 2.4, { n: 600 });
    plot.line(function (t) { return R.sample(b.uo, b.dt, t / 1000); }, C.COL.b, 2.8, { n: 600 });
    plot.hline(a.stat.avg, 'rgba(108,198,238,.55)', 1.2, [4, 4]);
    plot.hline(b.stat.avg, 'rgba(255,180,104,.6)', 1.2, [4, 4]);
    plot.text(L.tr('poluperiodni (1 dioda)', 'half-wave (1 diode)'), tms * 0.02, plot.y[1] * 0.94, C.COL.a, 'left', 0, 0);
    plot.text(L.tr('mosni (4 diode)', 'bridge (4 diodes)'), tms * 0.02, plot.y[1] * 0.85, C.COL.b, 'left', 0, 0);
  }

  function read() {
    var hasC = s.ci > 0, Cc = CS[s.ci] * 1e-6;
    var da = hasC ? (a.stat.avg / s.R) / (50 * Cc) : 0, db = hasC ? (b.stat.avg / s.R) / (100 * Cc) : 0;
    setText(document.getElementById('c-calc'), hasC ? L.tr('Δu ≈ Idc/(f·C): poluperiodni ', 'Δu ≈ Idc/(f·C): half-wave ') + engn(da, 'V', 3) + L.tr(' · mosni Idc/(2f·C) ', ' · bridge Idc/(2f·C) ') + engn(db, 'V', 3) : L.tr('Bez kondenzatora: faktor talasanja γ = 1,21 (poluperiodni) i 0,48 (mosni)', 'Without a capacitor: ripple factor γ = 1.21 (half-wave) and 0.48 (bridge)'));
    setText(document.getElementById('c-result'), L.tr('Mosni: ', 'Bridge: ') + 'Udc = ' + engn(b.stat.avg, 'V', 3) + ' <small>· ' + (hasC ? 'Δu = ' + engn(b.stat.ripple, 'V', 3) + ' · ' : '') + L.tr('poluperiodni: ', 'half-wave: ') + engn(a.stat.avg, 'V', 3) + (hasC ? ' · Δu = ' + engn(a.stat.ripple, 'V', 3) : '') + '</small>', true);
    setText(document.getElementById('c-note'), hasC ? L.tr('Isti kondenzator i isto opterećenje: kod mosta se kondenzator dopunjava dvaput češće, pa je talasanje upola manje i učestanost talasanja je 100 Hz. Cena je dodatni pad od 0,7 V (dve diode u seriji).', 'The same capacitor and the same load: in a bridge the capacitor is topped up twice as often, so the ripple is half as large and the ripple frequency is 100 Hz. The price is an additional drop of 0.7 V (two diodes in series).') : L.tr('Bez kondenzatora mosni usmerivač daje oko dvostruko veći srednji napon, jer koristi obe poluperiode.', 'Without a capacitor the bridge rectifier gives about twice the average voltage, because it uses both half-cycles.'));
  }

  L.range('c-um', { obj: s, key: 'Um', fmt: function (v) { return v + ' V'; }, on: resim });
  L.range('c-r', { obj: s, key: 'R', fmt: function (v) { return engn(v, 'Ω'); }, on: resim });
  L.range('c-c', { obj: s, key: 'ci', fmt: cText, on: resim });
  L.onLang(resim);
})();

(function psu() {
  var fig = document.getElementById('lab-psu');
  var cv = fig.querySelector('canvas');
  var U2S = [6, 7.5, 9, 12, 15, 18], IS = [100, 200, 300, 500, 800, 1000], CP = [470, 1000, 2200, 4700, 10000];
  var q = { u: 2, i: 2, c: 2, sim: null };
  var VOUT = 5, VMIN = 7;
  var plot = new C.Plot(cv, { x: [0, 40], y: [0, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'u (V)', pad: { l: 48, r: 14, t: 20, b: 34 }, onResize: draw });

  function resim() {
    var u2 = U2S[q.u], iL = IS[q.i] / 1000, Um = u2 * Math.SQRT2;
    q.sim = R.simulate({ Um: Um, f: 50, nd: 2, Vg: 0.7, R: (Um - 1.4) / iL, C: CP[q.c] * 1e-6, full: true, I: iL, show: 2 });
    q.Um = Um;
    q.iL = iL;
    read();
    draw();
  }

  function draw() {
    var sim = q.sim;
    if (!sim) return;
    var tms = timeAxis(plot, sim);
    voltAxis(plot, Math.max(q.Um, 10) * 1.12);
    if (!plot.begin()) return;
    var vin = function (t) { return R.sample(sim.uo, sim.dt, t / 1000); };
    plot.hline(VMIN, 'rgba(242,139,130,.8)', 1.4, [5, 4]);
    plot.line(vin, C.COL.b, 2.6, { n: 600 });
    plot.line(function (t) { return Math.max(0, Math.min(VOUT, vin(t) - 2)); }, C.COL.c, 3, { n: 600 });
    plot.text(L.tr('ulaz stabilizatora', 'regulator input'), tms * 0.02, plot.y[1] * 0.94, C.COL.b, 'left', 0, 0);
    plot.text(L.tr('izlaz 5 V', 'output 5 V'), tms * 0.02, plot.y[1] * 0.85, C.COL.c, 'left', 0, 0);
    plot.text(L.tr('najmanje 7 V', 'at least 7 V'), tms * 0.98, VMIN, '#f28b82', 'right', 0, -9);
  }

  function read() {
    var st = q.sim.stat, Cc = CP[q.c] * 1e-6;
    var du = q.iL / (100 * Cc), vmin = st.min, pd = Math.max(0, (st.avg - VOUT) * q.iL), ok = vmin >= VMIN;
    setText(document.getElementById('p-calc'), 'Um = U2·√2 = ' + engn(q.Um, 'V', 3) + ' · Δu ≈ Idc/(2f·C) = ' + engn(q.iL, 'A', 3) + ' / (100 Hz · ' + engn(Cc, 'F', 3) + ') = ' + engn(du, 'V', 3));
    setText(document.getElementById('p-result'), 'Uul,min = ' + engn(vmin, 'V', 3) + ' <small>· ' + (ok ? L.tr('stabilizator drži 5 V', 'the regulator holds 5 V') : L.tr('ispada iz regulacije', 'drops out of regulation')) + ' · Pstab = ' + engn(pd, 'W', 2) + '</small>', true);
    var parts = [];
    if (ok) parts.push(L.tr('Najniža tačka ulaza je iznad 7 V (5 V plus pad na stabilizatoru od oko 2 V), pa je izlaz ravna linija od 5 V.', 'The lowest point of the input is above 7 V (5 V plus a drop of about 2 V across the regulator), so the output is a flat line of 5 V.'));
    else parts.push(L.tr('Na dnu talasanja ulazni napon pada ispod 7 V pa stabilizator ne uspeva da održi 5 V i na izlazu se vide „udubljenja” od 100 Hz. Povećaj C, smanji struju ili uzmi veći napon sekundara.', 'At the bottom of the ripple the input voltage falls below 7 V so the regulator cannot hold 5 V and dips of 100 Hz appear at the output. Increase C, reduce the current or take a larger secondary voltage.'));
    if (pd > 1) parts.push(L.tr('Stabilizator troši ' + engn(pd, 'W', 2) + ' u obliku toplote, pa mu treba hladnjak.', 'The regulator dissipates ' + engn(pd, 'W', 2) + ' as heat, so it needs a heatsink.'));
    else parts.push(L.tr('Toplota na stabilizatoru je mala (ispod 1 W).', 'The heat in the regulator is small (below 1 W).'));
    setText(document.getElementById('p-note'), parts.join(' '));
  }

  L.range('p-u', { obj: q, key: 'u', fmt: function (i) { return L.fmtNum(U2S[i], U2S[i] % 1 ? 1 : 0) + ' V'; }, on: resim });
  L.range('p-i', { obj: q, key: 'i', fmt: function (i) { return IS[i] + ' mA'; }, on: resim });
  L.range('p-c', { obj: q, key: 'c', fmt: function (i) { return CP[i] + ' μF'; }, on: resim });
  L.onLang(resim);
})();
})();
