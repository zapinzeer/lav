(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;

var nice = C.nice, decs = C.decs, signed = C.signed, rrect = C.rrect, setText = C.setText, setSeg = C.setSeg, chipLabel = C.chipLabel;

(function wave() {
  var fig = document.getElementById('lab-wave');
  var cv = fig.querySelector('canvas');
  var UMS = [1, 2, 5, 10, 20, 50, 100, 325], FS = [25, 50, 100, 200];
  var w = { shape: 'sin', ui: 3, fi: 1 };
  var K = {
    sin: { rms: Math.SQRT1_2, avg: 2 / Math.PI, fn: Math.sin, rf: 'Um / √2', af: '2·Um / π', rd: '1,414', rde: '1.414' },
    tri: { rms: 1 / Math.sqrt(3), avg: 0.5, fn: function (p) { return 2 / Math.PI * Math.asin(Math.sin(p)); }, rf: 'Um / √3', af: 'Um / 2', rd: '1,732', rde: '1.732' },
    sqr: { rms: 1, avg: 1, fn: function (p) { return Math.sin(p) >= 0 ? 1 : -1; }, rf: 'Um', af: 'Um', rd: '1', rde: '1' }
  };
  var plot = new C.Plot(cv, { x: [0, 1], y: [-1, 1], xt: 4, yt: 4, xl: 't (ms)', yl: 'u (V)', pad: { l: 52, r: 16, t: 22, b: 34 }, onResize: draw });
  var ppCb = document.getElementById('w-pp'), rmsCb = document.getElementById('w-rms'), avgCb = document.getElementById('w-avg');

  function chip(txt, x, y, color, align) {
    var c = plot.ctx;
    c.save();
    c.font = '600 11.5px "IBM Plex Mono", monospace';
    var tw = c.measureText(txt).width + 10, x0 = align === 'right' ? x - tw : align === 'center' ? x - tw / 2 : x;
    c.fillStyle = 'rgba(8,13,18,.88)';
    c.strokeStyle = color;
    c.lineWidth = 1;
    rrect(c, x0, y - 9, tw, 18, 5);
    c.fill();
    c.stroke();
    c.fillStyle = color;
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillText(txt, x0 + 5, y + 0.5);
    c.restore();
  }

  function draw() {
    var k = K[w.shape], Um = UMS[w.ui], f = FS[w.fi], T = 1000 / f;
    var urms = k.rms * Um, uavg = k.avg * Um;
    plot.x = [0, 2 * T];
    var sa = C.symAxis(Um * 1.4);
    plot.y = [-sa.top, sa.top];
    plot.yt = sa.ticks;
    var xd = decs(2 * T / 4), yd = decs(2 * sa.top / sa.ticks);
    plot.xf = function (v) { return L.fmtNum(v, xd); };
    plot.yf = function (v) { return L.fmtNum(v, yd); };
    if (!plot.begin()) return;
    var c = plot.ctx;
    plot.hline(Um, 'rgba(255,255,255,.4)', 1.2, [5, 4]);
    plot.hline(-Um, 'rgba(255,255,255,.4)', 1.2, [5, 4]);
    if (rmsCb.checked) { plot.hline(urms, C.COL.c, 1.8, [7, 4]); plot.hline(-urms, C.COL.c, 1.8, [7, 4]); }
    if (avgCb.checked) plot.hline(uavg, C.COL.e, 2);
    plot.line(function (t) { return Um * k.fn(2 * Math.PI * t / T); }, C.COL.a, 2.8, { n: 900 });

    var xr = plot.X(2 * T) - 6;
    var items = [{ y: plot.Y(Um) - 11, txt: 'Um = ' + nice(Um, 3) + ' V', col: '#ffffff' }];
    if (rmsCb.checked) items.push({ y: plot.Y(urms) - 11, txt: 'U = ' + nice(urms, 3) + ' V', col: C.COL.c });
    if (avgCb.checked) items.push({ y: plot.Y(uavg) + 11, txt: 'Usr = ' + nice(uavg, 3) + ' V', col: C.COL.e });
    items.sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < items.length; i++) if (items[i].y - items[i - 1].y < 19) items[i].y = items[i - 1].y + 19;
    items.forEach(function (it) { chip(it.txt, xr, it.y, it.col, 'right'); });

    if (ppCb.checked) {
      var xp = plot.X(1.25 * T);
      C.arrow(c, xp, plot.Y(0) - 2, xp, plot.Y(Um), C.COL.f, 1.8, 7);
      C.arrow(c, xp, plot.Y(0) + 2, xp, plot.Y(-Um), C.COL.f, 1.8, 7);
      chip('Upp = ' + nice(2 * Um, 3) + ' V', xp, plot.Y(Um) - 11, C.COL.f, 'center');
    }

    var yT = plot.Y(-sa.top * 0.88), xa = plot.X(0), xb = plot.X(T);
    plot.vline(0, 'rgba(255,255,255,.18)', 1, [2, 4]);
    plot.vline(T, 'rgba(255,255,255,.18)', 1, [2, 4]);
    C.arrow(c, (xa + xb) / 2 - 22, yT, xa + 1, yT, C.COL.w, 1.4, 6);
    C.arrow(c, (xa + xb) / 2 + 22, yT, xb - 1, yT, C.COL.w, 1.4, 6);
    chip('T = ' + nice(T, 3) + ' ms', (xa + xb) / 2, yT, C.COL.w, 'center');
  }

  function read() {
    var k = K[w.shape], Um = UMS[w.ui], f = FS[w.fi], T = 1000 / f;
    var kf = k.rms / k.avg, kt = 1 / k.rms;
    setText(document.getElementById('w-calc'), 'U = ' + k.rf + ' = ' + nice(Um, 3) + ' / ' + L.tr(k.rd, k.rde) + ' · kf = ' + L.fmtNum(kf, 2) + ' · kt = ' + L.fmtNum(kt, 2));
    setText(document.getElementById('w-result'), 'U = ' + nice(k.rms * Um, 3) + ' V <small>· Usr = ' + nice(k.avg * Um, 3) + ' V · T = ' + nice(T, 3) + ' ms</small>', true);
    draw();
  }

  L.range('w-um', { obj: w, key: 'ui', fmt: function (v) { return L.fmtNum(UMS[v], UMS[v] % 1 ? 1 : 0) + ' V'; }, on: read });
  L.range('w-f', { obj: w, key: 'fi', fmt: function (v) { return FS[v] + ' Hz'; }, on: read });
  C.toggle(document.getElementById('w-shape'), function (v) { w.shape = v; read(); });
  [ppCb, rmsCb, avgCb].forEach(function (cb) { cb.addEventListener('change', draw); });
  L.onLang(read);
})();

(function circuit() {
  var fig = document.getElementById('lab-circuit');
  var LW = 360, LH = 250, RA = 0.5, RV = 1e7;
  var k = { mode: 'ok', U: 12, R: 100, ph: 0 };
  var loopOk = [[46, 48], [250, 48], [250, 88], [250, 164], [250, 202], [46, 202], [46, 48]];
  var loopShort = [[46, 48], [250, 48], [250, 70], [322, 70], [322, 180], [250, 180], [250, 202], [46, 202], [46, 48]];
  var WIRE = '#8da2b5', WIDTH = 2.4;

  function meter(c, x, y, letter, val, bad, col) {
    c.save();
    c.fillStyle = bad ? '#3a1e1b' : 'rgba(15,22,30,.97)';
    c.strokeStyle = bad ? '#f0675c' : WIRE;
    c.lineWidth = 2.4;
    c.beginPath();
    c.arc(x, y, 19, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#e9f0f6';
    c.font = '800 17px Archivo, system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(letter, x, y + 1);
    c.restore();
    if (val) chipLabel(c, val, x, y + 34, col);
  }

  function seg(c, pts) { C.polyline(c, pts, WIRE, WIDTH); }

  function state() {
    if (k.mode === 'apar') {
      var Ia = k.U / RA;
      return { I: Ia, a: nice(Ia, 3) + ' A', v: '', mag: 2.4, loop: loopShort, col: '#f0675c' };
    }
    if (k.mode === 'vser') {
      var Is = k.U / (k.R + RV);
      return { I: Is, a: '', v: nice(k.U * RV / (k.R + RV), 3) + ' V', mag: 0, loop: loopOk, col: '#ffb468' };
    }
    var I = k.U / k.R;
    return { I: I, a: C.eng(I, 'A', 3), v: nice(k.U, 3) + ' V', mag: 0.5 + 0.5 * Math.min(1, I / 0.25), loop: loopOk, col: '#ffb468' };
  }

  function draw(c, s, dt, t) {
    var st = state();
    c.save();
    C.fit(c, s, LW, LH);

    seg(c, [[46, 103], [46, 48], [k.mode === 'vser' ? 131 : 250, 48]]);
    if (k.mode === 'vser') seg(c, [[169, 48], [250, 48]]);
    seg(c, [[250, 48], [250, 88]]);
    seg(c, [[250, 164], [250, 202], [46, 202], [46, 147]]);
    if (k.mode !== 'vser') {
      seg(c, [[250, 70], [322, 70], [322, 106]]);
      seg(c, [[322, 144], [322, 180], [250, 180]]);
      c.fillStyle = WIRE;
      c.beginPath(); c.arc(250, 70, 3.6, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(250, 180, 3.6, 0, Math.PI * 2); c.fill();
    }

    c.save();
    c.globalAlpha = k.mode === 'apar' ? 0.4 : 1;
    c.strokeStyle = '#c77a43';
    c.lineWidth = 2.6;
    c.beginPath();
    c.rect(241, 88, 18, 76);
    c.stroke();
    C.mathLabel(c, 'R', 224, 126, '#e9f0f6', 'center', 17);
    c.restore();

    if (st.mag > 0) {
      k.ph += dt * 62 * Math.sin(t * 2 * Math.PI * 0.6) * st.mag;
      C.flowDots(c, st.loop, k.ph, { spacing: 18, r: 3.2, color: st.col, alpha: 0.95 });
    }

    c.fillStyle = 'rgba(15,22,30,.97)';
    c.strokeStyle = WIRE;
    c.lineWidth = 2.4;
    c.beginPath();
    c.arc(46, 125, 22, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = '#e9f0f6';
    c.lineWidth = 2;
    c.beginPath();
    for (var i = 0; i <= 20; i++) {
      var px = 34 + i * 1.2, py = 125 - 6 * Math.sin(i / 20 * Math.PI * 2);
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.stroke();
    C.mathLabel(c, 'u', 14, 125, '#e9f0f6', 'center', 17);

    if (k.mode === 'ok') {
      meter(c, 150, 48, 'A', st.a, false, C.COL.b);
      meter(c, 322, 125, 'V', st.v, false, C.COL.c);
    } else if (k.mode === 'apar') {
      meter(c, 322, 125, 'A', st.a, true, '#f0675c');
    } else {
      meter(c, 150, 48, 'V', st.v, false, C.COL.c);
    }

    if (k.mode === 'apar') C.label(c, L.tr('KRATAK SPOJ', 'SHORT CIRCUIT'), 180, 20, '#f0675c', 'center', 13);
    else if (k.mode === 'vser') C.label(c, L.tr('kolo je gotovo prekinuto', 'the circuit is almost broken'), 180, 20, '#98a5b1', 'center', 12);
    c.restore();
  }

  function read() {
    var st = state(), key = k.mode + k.U + k.R + L.lang(), calc, res, note;
    var U = nice(k.U, 3);
    if (k.mode === 'ok') {
      calc = 'I = U / R = ' + U + ' V / ' + k.R + ' Ω';
      res = 'I = ' + C.eng(st.I, 'A', 3) + ' <small>· U<sub>R</sub> = ' + U + ' V · P = ' + nice(k.U * st.I, 3) + ' W</small>';
      note = L.tr('Ampermetar je redno i pokazuje struju kola. Voltmetar je paralelno i pokazuje napon na otporniku, a on je jednak naponu izvora.', 'The ammeter is in series and shows the current of the circuit. The voltmeter is in parallel and shows the voltage on the resistor, which equals the source voltage.');
    } else if (k.mode === 'apar') {
      calc = 'I = U / Ra = ' + U + ' V / ' + L.fmtNum(RA, 1) + ' Ω';
      res = '≈ ' + nice(st.I, 3) + ' A <small>· ' + L.tr('kratak spoj', 'short circuit') + '</small>';
      note = L.tr('Ampermetar ima otpor oko 0,5 Ω, pa je izvor praktično kratko spojen: kroz instrument bi tekla struja od desetina ampera. Otpornik je premošćen i kroz njega ne teče struja.', 'The ammeter has a resistance of about 0.5 Ω, so the source is practically short-circuited: a current of tens of amperes would flow through the instrument. The resistor is bypassed and no current flows through it.');
    } else {
      calc = 'I = U / (R + Rv) = ' + U + ' V / (' + k.R + ' Ω + 10 MΩ)';
      res = '≈ ' + C.eng(st.I, 'A', 3) + ' <small>· ' + L.tr('voltmetar pokazuje ', 'the voltmeter shows ') + nice(k.U, 3) + ' V</small>';
      note = L.tr('Voltmetar ima otpor 10 MΩ, pa kroz kolo teče samo oko ', 'The voltmeter has a resistance of 10 MΩ, so only about ') + C.eng(st.I, 'A', 2) + L.tr('. Na otporniku je pad napona samo ', ' flows through the circuit. The voltage drop on the resistor is only ') + C.eng(st.I * k.R, 'V', 2) + L.tr(', a voltmetar „vidi” skoro ceo napon izvora.', ', and the voltmeter "sees" almost the whole source voltage.');
    }
    setText(document.getElementById('c-calc'), calc);
    setText(document.getElementById('c-result'), res, true);
    setText(document.getElementById('c-note'), note);
  }

  C.scene(fig, draw);
  L.range('c-u', { obj: k, key: 'U', fmt: function (v) { return v + ' V'; }, on: read });
  L.range('c-r', { obj: k, key: 'R', fmt: function (v) { return v + ' Ω'; }, on: read });
  C.toggle(document.getElementById('c-mode'), function (v) { k.mode = v; read(); });
  L.onLang(read);
})();

(function analog() {
  var fig = document.getElementById('lab-analog');
  var LW = 340, LH = 236, PX = 170, PY = 214, RS = 152, HA = 0.84, DIV = 50, RANGES = [5, 10, 50, 250];
  var a = { range: 50, cls: 1.5, U: 18, pos: 0, vel: 0, err: true, prac: false, done: false, divs: 0, Ufree: 18, rangeFree: 50 };
  var rangeSeg = document.getElementById('a-range'), classSeg = document.getElementById('a-class');
  var uEl = document.getElementById('a-u'), errCb = document.getElementById('a-err');
  var pracBtn = document.getElementById('a-prac'), quiz = document.getElementById('a-quiz');
  var guess = document.getElementById('a-guess'), checkBtn = document.getElementById('a-check'), nextBtn = document.getElementById('a-next');
  var feedback = '';

  function pt(r, f) {
    var q = -Math.PI / 2 - HA + 2 * HA * f;
    return [PX + r * Math.cos(q), PY + r * Math.sin(q)];
  }
  function arcPath(c, r, f1, f2) {
    c.beginPath();
    c.arc(PX, PY, r, -Math.PI / 2 - HA + 2 * HA * f1, -Math.PI / 2 - HA + 2 * HA * f2);
  }
  function dmax() { return a.cls * a.range / 100; }

  function draw(c, s, dt) {
    var steps = 3, h = Math.min(dt, 0.05) / steps;
    var target = Math.min(1.06, a.U / a.range);
    for (var i = 0; i < steps; i++) {
      a.vel += ((target - a.pos) * 260 - a.vel * 19) * h;
      a.pos += a.vel * h;
    }
    c.save();
    C.fit(c, s, LW, LH);
    c.fillStyle = '#efe8d4';
    rrect(c, 6, 6, LW - 12, LH - 12, 14);
    c.fill();
    c.strokeStyle = '#2b2820';
    c.lineWidth = 3;
    c.stroke();

    c.strokeStyle = 'rgba(150,160,170,.55)';
    c.lineWidth = 7;
    arcPath(c, RS - 46, 0, 1);
    c.stroke();

    var showBand = a.err && !(a.prac && !a.done);
    if (showBand) {
      var d = dmax(), f1 = Math.max(0, (a.U - d) / a.range), f2 = Math.min(1.06, (a.U + d) / a.range);
      c.strokeStyle = 'rgba(169,82,28,.8)';
      c.lineWidth = 7;
      c.lineCap = 'butt';
      arcPath(c, RS + 10, f1, f2);
      c.stroke();
    }

    c.strokeStyle = '#1d1b17';
    c.lineWidth = 1.5;
    arcPath(c, RS, 0, 1);
    c.stroke();
    c.fillStyle = '#1d1b17';
    c.font = '700 13px Archivo, system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (var n = 0; n <= DIV; n++) {
      var major = n % 10 === 0, mid = n % 5 === 0, len = major ? 14 : mid ? 10 : 6;
      var p1 = pt(RS, n / DIV), p2 = pt(RS - len, n / DIV);
      c.lineWidth = major ? 1.9 : 1;
      c.beginPath();
      c.moveTo(p1[0], p1[1]);
      c.lineTo(p2[0], p2[1]);
      c.stroke();
      if (major) {
        var pn = pt(RS - 27, n / DIV);
        c.fillText(String(n), pn[0], pn[1]);
      }
    }

    C.label(c, 'V ~', PX, 186, '#1d1b17', 'center', 19);
    C.label(c, L.tr('kl. ', 'cl. ') + L.fmtNum(a.cls, 1), 56, 204, '#1d1b17', 'center', 12);
    C.label(c, L.tr('opseg ', 'range ') + a.range + ' V', 284, 204, '#1d1b17', 'center', 12);

    if (a.U > a.range * 1.04) C.label(c, L.tr('PREOPTEREĆENJE', 'OVERLOAD'), PX, 120, '#b0281f', 'center', 14);

    var tip = pt(146, a.pos), tail = pt(-8, a.pos);
    c.strokeStyle = '#7c1b14';
    c.lineWidth = 2.6;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(tail[0], tail[1]);
    c.lineTo(tip[0], tip[1]);
    c.stroke();
    c.fillStyle = '#26231c';
    c.beginPath();
    c.arc(PX, PY, 9, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function read() {
    var C1 = a.range / DIV, calc, res;
    if (a.prac && !a.done) {
      calc = L.tr('Opseg ' + a.range + ' V · skala ima ' + DIV + ' podeoka', 'Range ' + a.range + ' V · the scale has ' + DIV + ' divisions');
      res = feedback || L.tr('Pročitaj kazaljku i izračunaj napon', 'Read the needle and calculate the voltage');
    } else if (a.prac) {
      calc = L.tr('α = ' + L.fmtNum(a.divs, 1) + ' pod. · C = ' + a.range + ' V / ' + DIV + ' = ' + nice(C1, 2) + ' V/pod.', 'α = ' + L.fmtNum(a.divs, 1) + ' div. · C = ' + a.range + ' V / ' + DIV + ' = ' + nice(C1, 2) + ' V/div.');
      res = feedback;
    } else {
      var d = dmax(), over = a.U > a.range * 1.04, divs = Math.min(a.U / C1, DIV * 1.06);
      calc = L.tr('α = ' + L.fmtNum(divs, 1) + ' pod. · C = ' + a.range + ' V / ' + DIV + ' = ' + nice(C1, 2) + ' V/pod. · U = α · C', 'α = ' + L.fmtNum(divs, 1) + ' div. · C = ' + a.range + ' V / ' + DIV + ' = ' + nice(C1, 2) + ' V/div. · U = α · C');
      res = over ? L.tr('Kazaljka je na ograničaču: biraj veći opseg', 'The needle is at the stop: choose a larger range') :
        'U = ' + nice(a.U, 3) + ' V <small>· ' + '±' + nice(d, 2) + ' V (δ = ' + (a.U > 0 ? nice(d / a.U * 100, 2) + ' %' : '–') + ')</small>';
    }
    setText(document.getElementById('a-calc'), calc);
    setText(document.getElementById('a-result'), res, true);
  }

  function setPrac(on) {
    a.prac = on;
    quiz.hidden = !on;
    uEl.disabled = on;
    rangeSeg.querySelectorAll('button').forEach(function (b) { b.disabled = on; });
    pracBtn.innerHTML = on ? L.both('Završi vežbu', 'End the practice') : L.both('Vežbaj očitavanje', 'Practise reading');
    if (on) { a.Ufree = a.U; a.rangeFree = a.range; newTask(); }
    else {
      a.U = a.Ufree;
      a.range = a.rangeFree;
      setSeg(rangeSeg, a.range);
      feedback = '';
      uEl.value = a.U;
      read();
    }
  }

  function newTask() {
    a.range = RANGES[Math.floor(Math.random() * RANGES.length)];
    a.divs = (4 + Math.floor(Math.random() * 89)) * 0.5;
    a.U = a.divs * a.range / DIV;
    a.done = false;
    feedback = '';
    guess.value = '';
    guess.disabled = false;
    checkBtn.disabled = false;
    setSeg(rangeSeg, a.range);
    read();
    guess.focus({ preventScroll: true });
  }

  function check() {
    var v = parseFloat(String(guess.value).replace(',', '.'));
    if (!isFinite(v)) { feedback = L.tr('Upiši broj, na primer 4,7', 'Enter a number, for example 4.7'); read(); return; }
    var C1 = a.range / DIV, tol = 0.5 * C1 + 1e-9, truth = a.U;
    var ok = Math.abs(v - truth) <= tol;
    a.done = true;
    guess.disabled = true;
    checkBtn.disabled = true;
    feedback = (ok ? L.tr('Tačno! ', 'Correct! ') : L.tr('Nije tačno. ', 'Not correct. ')) +
      L.tr(L.fmtNum(a.divs, 1) + ' pod. × ' + nice(C1, 2) + ' V = ' + nice(truth, 3) + ' V', L.fmtNum(a.divs, 1) + ' div. × ' + nice(C1, 2) + ' V = ' + nice(truth, 3) + ' V');
    read();
  }

  C.scene(fig, draw);
  L.range('a-u', { obj: a, key: 'U', fmt: function (v) { return L.fmtNum(v, v % 1 ? 1 : 0) + ' V'; }, on: function () { if (!a.prac) read(); } });
  C.toggle(rangeSeg, function (v) { a.range = parseFloat(v); read(); });
  C.toggle(classSeg, function (v) { a.cls = parseFloat(v); read(); });
  errCb.addEventListener('change', function () { a.err = errCb.checked; });
  pracBtn.addEventListener('click', function () { setPrac(!a.prac); });
  checkBtn.addEventListener('click', check);
  nextBtn.addEventListener('click', newTask);
  guess.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (!a.done) check(); } });
  L.onLang(function () { pracBtn.innerHTML = a.prac ? L.both('Završi vežbu', 'End the practice') : L.both('Vežbaj očitavanje', 'Practise reading'); read(); });
  a.U = parseFloat(uEl.value);
  read();
})();

(function dmm() {
  var fig = document.getElementById('lab-dmm');
  var LW = 340, LH = 272, FFS = Math.PI / (2 * Math.SQRT2);
  var UMS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 325, 500];
  var RNG = [
    { max: 0.2, unit: 'mV', mul: 1000, dec: 1, res: 1e-4 },
    { max: 2, unit: 'V', mul: 1, dec: 3, res: 1e-3 },
    { max: 20, unit: 'V', mul: 1, dec: 2, res: 1e-2 },
    { max: 200, unit: 'V', mul: 1, dec: 1, res: 1e-1 },
    { max: 750, unit: 'V', mul: 1, dec: 0, res: 1 }
  ];
  var K = {
    sin: { rms: Math.SQRT1_2, avg: 2 / Math.PI, fn: Math.sin },
    tri: { rms: 1 / Math.sqrt(3), avg: 0.5, fn: function (p) { return 2 / Math.PI * Math.asin(Math.sin(p)); } },
    sqr: { rms: 1, avg: 1, fn: function (p) { return Math.sin(p) >= 0 ? 1 : -1; } }
  };
  var d = { shape: 'sin', type: 'avg', ui: 6, ph: 0 };
  var shapeSeg = document.getElementById('d-shape'), typeSeg = document.getElementById('d-type');
  var sliderEl = document.getElementById('d-um');

  function measure() {
    var k = K[d.shape], Um = UMS[d.ui];
    var truth = k.rms * Um, shown = d.type === 'rms' ? truth : k.avg * Um * FFS;
    var ri = 0;
    while (ri < RNG.length - 1 && shown > RNG[ri].max * 0.9995) ri++;
    var rg = RNG[ri], counts = Math.round(shown / rg.res), disp = counts * rg.res;
    var unc = 0.01 * disp + 5 * rg.res;
    return { Um: Um, truth: truth, shown: shown, rg: rg, disp: disp, unc: unc, err: (disp - truth) / truth * 100 };
  }

  function draw(c, s, dt) {
    var m = measure(), k = K[d.shape];
    d.ph += dt * 1.1;
    c.save();
    C.fit(c, s, LW, LH);
    c.fillStyle = '#26303a';
    rrect(c, 8, 8, LW - 16, LH - 16, 20);
    c.fill();
    c.strokeStyle = '#3c4a58';
    c.lineWidth = 2;
    c.stroke();

    c.fillStyle = '#c3d1b4';
    rrect(c, 26, 24, LW - 52, 84, 8);
    c.fill();
    c.strokeStyle = '#111a14';
    c.lineWidth = 3;
    c.stroke();

    var dec = m.rg.dec, ghost = ['1888', '188.8', '18.88', '1.888'][dec].replace('.', L.fmtNum(0.5, 1).charAt(1));
    var txt = L.fmtNum(m.disp * m.rg.mul, dec);
    c.textAlign = 'right';
    c.textBaseline = 'middle';
    c.font = '600 46px "IBM Plex Mono", monospace';
    c.fillStyle = 'rgba(26,36,24,.09)';
    c.fillText(ghost, 262, 66);
    c.fillStyle = '#17230f';
    c.fillText(txt, 262, 66);
    c.font = '700 19px "IBM Plex Mono", monospace';
    c.textAlign = 'left';
    c.fillText(m.rg.unit, 268, 76);
    c.font = '700 12px "IBM Plex Mono", monospace';
    c.fillText('AC', 36, 40);
    c.fillText('AUTO', 36, 58);
    c.fillText(m.rg.max < 1 ? m.rg.max * 1000 + ' mV' : m.rg.max + ' V', 36, 96);
    if (d.type === 'rms') {
      c.fillStyle = '#17230f';
      rrect(c, 36, 66, 52, 18, 4);
      c.fill();
      c.fillStyle = '#c3d1b4';
      c.fillText('TRMS', 42, 76);
    }

    var KX = 96, KY = 194, KR = 38;
    var grad = c.createRadialGradient(KX - 10, KY - 12, 4, KX, KY, KR);
    grad.addColorStop(0, '#5a6978');
    grad.addColorStop(1, '#2b3540');
    c.fillStyle = grad;
    c.beginPath();
    c.arc(KX, KY, KR, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#8a9aa8';
    c.lineWidth = 2;
    c.stroke();
    var pos = [['OFF', -80], ['V⎓', -40], ['V~', 0], ['A~', 40], ['Ω', 80]];
    c.font = '600 11px "IBM Plex Mono", monospace';
    c.textAlign = 'center';
    pos.forEach(function (p) {
      var q = p[1] * Math.PI / 180, on = p[0] === 'V~';
      c.fillStyle = on ? '#ffb468' : '#9fb0bf';
      c.fillText(p[0], KX + 56 * Math.sin(q), KY - 56 * Math.cos(q) + 2);
    });
    c.strokeStyle = '#ffb468';
    c.lineWidth = 3.4;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(KX, KY);
    c.lineTo(KX, KY - KR + 6);
    c.stroke();
    c.fillStyle = '#1b232b';
    c.beginPath();
    c.arc(KX, KY, 6, 0, Math.PI * 2);
    c.fill();

    var SX = 176, SY = 124, SW = 138, SH = 128;
    c.fillStyle = '#0a1410';
    rrect(c, SX, SY, SW, SH, 6);
    c.fill();
    c.strokeStyle = '#2f4a3a';
    c.lineWidth = 1;
    c.beginPath();
    for (var gx = 1; gx < 6; gx++) { c.moveTo(SX + gx * SW / 6, SY + 4); c.lineTo(SX + gx * SW / 6, SY + SH - 4); }
    for (var gy = 1; gy < 6; gy++) { c.moveTo(SX + 4, SY + gy * SH / 6); c.lineTo(SX + SW - 4, SY + gy * SH / 6); }
    c.stroke();
    var mid = SY + SH / 2 - 6, amp = SH / 2 - 26;
    c.strokeStyle = '#3d5d49';
    c.beginPath();
    c.moveTo(SX + 4, mid);
    c.lineTo(SX + SW - 4, mid);
    c.stroke();
    c.save();
    c.beginPath();
    c.rect(SX + 3, SY + 3, SW - 6, SH - 6);
    c.clip();
    c.strokeStyle = '#7dffb0';
    c.lineWidth = 2;
    c.lineJoin = 'round';
    c.beginPath();
    for (var i = 0; i <= 160; i++) {
      var px = SX + 4 + (SW - 8) * i / 160, ang = (i / 160) * 4 * Math.PI - d.ph * 2;
      var py = mid - amp * k.fn(ang);
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.stroke();
    c.setLineDash([5, 3]);
    c.strokeStyle = '#6cc6ee';
    c.lineWidth = 1.6;
    var yt = mid - amp * m.truth / m.Um;
    c.beginPath(); c.moveTo(SX + 4, yt); c.lineTo(SX + SW - 4, yt); c.stroke();
    c.setLineDash([]);
    c.strokeStyle = '#ffb468';
    c.lineWidth = 1.8;
    var ys = mid - amp * m.disp / m.Um;
    c.beginPath(); c.moveTo(SX + 4, ys); c.lineTo(SX + SW - 4, ys); c.stroke();
    c.restore();
    c.font = '600 10.5px "IBM Plex Mono", monospace';
    c.textAlign = 'left';
    c.fillStyle = '#6cc6ee';
    c.fillText('- - ' + L.tr('prava U', 'true U'), SX + 8, SY + SH - 23);
    c.fillStyle = '#ffb468';
    c.fillText('—— ' + L.tr('pokazuje', 'shown'), SX + 8, SY + SH - 9);
    c.restore();
  }

  function read() {
    var m = measure(), spr = nice(m.unc, 2);
    var calc = L.tr('Δ = ±(1,0 % · ' + nice(m.disp, 3) + ' V + 5 · ' + nice(m.rg.res, 1) + ' V) = ±' + spr + ' V', 'Δ = ±(1.0 % · ' + nice(m.disp, 3) + ' V + 5 · ' + nice(m.rg.res, 1) + ' V) = ±' + spr + ' V');
    var res = (Math.abs(m.err) < 0.05 ? L.tr('Greška: 0 %', 'Error: 0 %') : L.tr('Greška: ', 'Error: ') + signed(m.err, 1) + ' %') + ' <small>· ' + L.tr('prava U = ', 'true U = ') + nice(m.truth, 3) + ' V</small>';
    setText(document.getElementById('d-calc'), calc);
    setText(document.getElementById('d-result'), res, true);
  }

  C.scene(fig, draw);
  L.range('d-um', { obj: d, key: 'ui', fmt: function (v) { return L.fmtNum(UMS[v], UMS[v] % 1 ? 1 : 0) + ' V'; }, on: read });
  C.toggle(shapeSeg, function (v) { d.shape = v; read(); });
  C.toggle(typeSeg, function (v) { d.type = v; read(); });
  document.getElementById('d-mains').addEventListener('click', function () {
    d.shape = 'sin';
    setSeg(shapeSeg, 'sin');
    d.ui = 11;
    sliderEl.value = 11;
    sliderEl.dispatchEvent(new Event('input'));
  });
  L.onLang(read);
  read();
})();

(function load() {
  var fig = document.getElementById('lab-load');
  var LW = 360, LH = 250, US = 10;
  var RS = [1e3, 2.2e3, 4.7e3, 1e4, 2.2e4, 4.7e4, 1e5, 2.2e5, 4.7e5, 1e6];
  var o = { type: 'an', i1: 6, i2: 6, ph: 0 };
  var loop1 = [[40, 40], [210, 40], [210, 55], [210, 150], [210, 170], [40, 170], [40, 40]];
  var loop2 = [[40, 40], [210, 40], [210, 55], [290, 55], [290, 150], [210, 150], [210, 170], [40, 170], [40, 40]];
  var WIRE = '#8da2b5', WIDTH = 2.4;

  function ohm(r) {
    if (r >= 1e6) return L.fmtNum(r / 1e6, 0) + ' MΩ';
    return L.fmtNum(r / 1e3, r % 1e3 ? 1 : 0) + ' kΩ';
  }
  function solve() {
    var r1 = RS[o.i1], r2 = RS[o.i2], rv = o.type === 'an' ? 2e5 : 1e7;
    var rp = r2 * rv / (r2 + rv);
    var u2 = US * r2 / (r1 + r2), u2m = US * rp / (r1 + rp);
    var i1 = US / (r1 + rp);
    return { r1: r1, r2: r2, rv: rv, rp: rp, u2: u2, u2m: u2m, i1: i1, iv: u2m / rv, i2: u2m / r2 };
  }
  function box(c, x, y, w, h, col) {
    c.fillStyle = 'rgba(15,22,30,.94)';
    c.strokeStyle = col;
    c.lineWidth = 2.6;
    c.beginPath();
    c.rect(x, y, w, h);
    c.fill();
    c.stroke();
  }

  function draw(c, s, dt, t) {
    var m = solve();
    c.save();
    C.fit(c, s, LW, LH);
    C.polyline(c, [[40, 83], [40, 40], [100, 40]], WIRE, WIDTH);
    C.polyline(c, [[160, 40], [210, 40], [210, 70]], WIRE, WIDTH);
    C.polyline(c, [[210, 130], [210, 170], [40, 170], [40, 127]], WIRE, WIDTH);
    C.polyline(c, [[210, 55], [290, 55], [290, 86]], WIRE, WIDTH);
    C.polyline(c, [[290, 124], [290, 150], [210, 150]], WIRE, WIDTH);
    c.fillStyle = WIRE;
    c.beginPath(); c.arc(210, 55, 3.6, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(210, 150, 3.6, 0, Math.PI * 2); c.fill();

    box(c, 100, 30, 60, 20, '#c77a43');
    box(c, 200, 70, 20, 60, '#c77a43');
    C.mathLabel(c, 'R₁', 130, 18, '#e9f0f6', 'center', 16);
    C.mathLabel(c, 'R₂', 238, 100, '#e9f0f6', 'left', 16);

    c.fillStyle = 'rgba(15,22,30,.94)';
    c.strokeStyle = WIRE;
    c.lineWidth = 2.4;
    c.beginPath();
    c.arc(40, 105, 22, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = '#e9f0f6';
    c.lineWidth = 2;
    c.beginPath();
    for (var i = 0; i <= 20; i++) {
      var px = 28 + i * 1.2, py = 105 - 6 * Math.sin(i / 20 * Math.PI * 2);
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.stroke();

    c.fillStyle = 'rgba(15,22,30,.94)';
    c.strokeStyle = WIRE;
    c.lineWidth = 2.4;
    c.beginPath();
    c.arc(290, 105, 19, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#e9f0f6';
    c.font = '800 17px Archivo, system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('V', 290, 106);
    C.label(c, 'Rv = ' + ohm(m.rv), 352, 172, C.COL.a, 'right', 11);

    var sw = Math.sin(t * 2 * Math.PI * 0.6);
    o.ph += dt * 70 * sw;
    var share2 = m.i2 / m.i1, shareV = m.iv / m.i1;
    C.flowDots(c, loop1, o.ph * share2, { spacing: 18, r: 3.2, color: '#ffb468', alpha: 0.95 });
    C.flowDots(c, loop2, o.ph * shareV * 3, { spacing: 18, r: 3.2, color: '#6cc6ee', alpha: Math.min(1, 0.12 + 1.8 * shareV) });

    chipLabel(c, '10 V', 40, 145, '#c9d6e2');

    var bx = 30, bw = 300;
    C.label(c, L.tr('stvarno', 'real'), bx, 192, '#c9d6e2', 'left', 11);
    c.fillStyle = 'rgba(111,207,151,.9)';
    c.fillRect(bx, 198, bw * m.u2 / US, 12);
    C.label(c, nice(m.u2, 3) + ' V', bx + 4 + bw * m.u2 / US, 204, '#c9d6e2', 'left', 11);
    C.label(c, L.tr('voltmetar pokazuje', 'the voltmeter shows'), bx, 224, '#c9d6e2', 'left', 11);
    c.fillStyle = 'rgba(255,180,104,.95)';
    c.fillRect(bx, 230, bw * m.u2m / US, 12);
    C.label(c, nice(m.u2m, 3) + ' V', bx + 4 + bw * m.u2m / US, 236, '#c9d6e2', 'left', 11);
    c.restore();
  }

  function read() {
    var m = solve(), err = (m.u2m - m.u2) / m.u2 * 100;
    var calc = 'R2‖Rv = ' + ohm(m.r2) + ' ‖ ' + ohm(m.rv) + ' = ' + (m.rp >= 1e6 ? L.fmtNum(m.rp / 1e6, 2) + ' MΩ' : L.fmtNum(m.rp / 1e3, 1) + ' kΩ') + ' · U2 = 10 V · R2‖Rv / (R1 + R2‖Rv)';
    var res = L.tr('Stvarno ', 'Real ') + nice(m.u2, 3) + ' V <small>· ' + L.tr('pokazuje ', 'shows ') + nice(m.u2m, 3) + ' V · ' + L.tr('greška ', 'error ') + signed(err, 1) + ' %</small>';
    setText(document.getElementById('o-calc'), calc);
    setText(document.getElementById('o-result'), res, true);
  }

  C.scene(fig, draw);
  L.range('o-r1', { obj: o, key: 'i1', fmt: function (v) { return ohm(RS[v]); }, on: read });
  L.range('o-r2', { obj: o, key: 'i2', fmt: function (v) { return ohm(RS[v]); }, on: read });
  C.toggle(document.getElementById('o-type'), function (v) { o.type = v; read(); });
  L.onLang(read);
})();
})();
