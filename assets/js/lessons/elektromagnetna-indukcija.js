(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;

function symAxis(v) {
  var ax = C.niceAxis(v), n = ax.ticks % 2 ? ax.ticks + 1 : ax.ticks;
  return { top: ax.max / ax.ticks * n, ticks: n };
}

(function faraday() {
  var fig = document.getElementById('lab-fara');
  var cvs = fig.querySelectorAll('canvas');
  var f = { N: 300, x: 50, spd: 1, flip: 1, t: 0, phi: 0, emf: 0, hist: [], ymax: 0.5 };
  var autoCb = document.getElementById('f-auto');
  var LW = 340, LH = 272, CXc = 170, CYc = 86, A = 45;
  var wirePath = [[126, 100], [100, 100], [100, 240], [140, 240], [200, 240], [240, 240], [240, 100], [214, 100], [126, 100]];

  function phiAt(x) { var d = (x - CXc) / A; return f.flip * 1e-3 / Math.pow(1 + d * d, 1.5); }
  f.phi = phiAt(f.x);

  var plot = new C.Plot(cvs[1], {
    x: [-6, 0], y: [-1, 1], xt: 6, yt: 4, xl: 't (s)', yl: 'ε (V)',
    xf: function (v) { return L.fmtNum(v, 0); }, pad: { l: 46, r: 14, t: 18, b: 34 }
  });

  var phase = 0;
  function draw(c, s, dt, tt) {
    f.t += dt;
    if (autoCb.checked) f.x = CXc + 122 * Math.sin(f.t * 2 * Math.PI / (4 / f.spd) + 0.4);
    var phi = phiAt(f.x);
    var raw = dt > 0 ? -f.N * (phi - f.phi) / dt : 0;
    f.phi = phi;
    f.emf += (raw - f.emf) * Math.min(1, dt * 14);
    if (Math.abs(f.emf) < 1e-4) f.emf = 0;
    f.hist.push([f.t, f.emf]);
    while (f.hist.length && f.t - f.hist[0][0] > 6.2) f.hist.shift();

    c.save();
    C.fit(c, s, LW, LH);
    var strength = Math.tanh(Math.abs(f.emf) / 0.5);
    C.polyline(c, wirePath.slice(0, 8), '#8da2b5', 2.4);
    C.polyline(c, [[240, 100], [214, 100]], '#8da2b5', 2.4);
    C.polyline(c, [[126, 100], [100, 100]], '#8da2b5', 2.4);
    if (strength > 0.02) {
      phase += dt * 70 * (f.emf > 0 ? 1 : -1);
      C.flowDots(c, wirePath, phase, { spacing: 18, r: 3, color: '#ffb468', alpha: Math.min(1, 0.25 + strength) });
    }

    for (var i = 0; i < 8; i++) {
      var cx = 132 + i * 10.5;
      c.strokeStyle = 'rgba(160,100,60,.9)';
      c.lineWidth = 3;
      c.beginPath();
      c.ellipse(cx, CYc, 6, 30, 0, Math.PI, 2 * Math.PI);
      c.stroke();
    }

    var left = f.x - 42, mw = 84, mh = 26, my = CYc - mh / 2;
    var aCol = f.flip > 0 ? '#2c5bbd' : '#c4362c', bCol = f.flip > 0 ? '#c4362c' : '#2c5bbd';
    c.fillStyle = aCol;
    c.fillRect(left, my, mw / 2, mh);
    c.fillStyle = bCol;
    c.fillRect(left + mw / 2, my, mw / 2, mh);
    c.fillStyle = '#fff';
    c.font = '800 16px Archivo, system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(f.flip > 0 ? 'S' : 'N', left + mw / 4, CYc + 1);
    c.fillText(f.flip > 0 ? 'N' : 'S', left + 3 * mw / 4, CYc + 1);

    for (var j = 0; j < 8; j++) {
      var cx2 = 132 + j * 10.5;
      c.strokeStyle = '#c77a43';
      c.lineWidth = 3.4;
      c.beginPath();
      c.ellipse(cx2, CYc, 6, 30, 0, 0, Math.PI);
      c.stroke();
    }

    if (strength > 0.03) {
      var leftN = f.emf < 0;
      c.globalAlpha = Math.min(1, 0.3 + strength);
      c.fillStyle = leftN ? '#d8453a' : '#3f6fd8';
      c.fillRect(116, CYc - 22, 10, 44);
      c.fillStyle = leftN ? '#3f6fd8' : '#d8453a';
      c.fillRect(214, CYc - 22, 10, 44);
      c.fillStyle = '#fff';
      c.font = '800 11px Archivo, system-ui, sans-serif';
      c.fillText(leftN ? 'N' : 'S', 121, CYc);
      c.fillText(leftN ? 'S' : 'N', 219, CYc);
      c.globalAlpha = 1;
    }

    var gx = 170, gy = 244;
    c.fillStyle = 'rgba(15,22,30,.92)';
    c.strokeStyle = '#8da2b5';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(gx, gy, 52, Math.PI, 2 * Math.PI);
    c.lineTo(gx + 52, gy + 14);
    c.lineTo(gx - 52, gy + 14);
    c.closePath();
    c.fill();
    c.stroke();
    c.strokeStyle = 'rgba(201,214,226,.6)';
    c.lineWidth = 1.4;
    for (var k = -4; k <= 4; k++) {
      var ta = -Math.PI / 2 + k * 0.2;
      c.beginPath();
      c.moveTo(gx + 40 * Math.cos(ta), gy + 40 * Math.sin(ta));
      c.lineTo(gx + 46 * Math.cos(ta), gy + 46 * Math.sin(ta));
      c.stroke();
    }
    var ang = Math.tanh(f.emf / 0.6) * 0.8;
    c.strokeStyle = '#f0675c';
    c.lineWidth = 2.6;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(gx, gy);
    c.lineTo(gx + 44 * Math.sin(ang), gy - 44 * Math.cos(ang));
    c.stroke();
    c.fillStyle = '#e9f0f6';
    c.beginPath(); c.arc(gx, gy, 4, 0, Math.PI * 2); c.fill();
    c.font = '700 12px "IBM Plex Mono", monospace';
    c.fillStyle = 'rgba(201,214,226,.9)';
    c.fillText('0', gx, gy - 52 - 8);
    c.fillText('G', gx - 34, gy + 6);
    c.restore();

    var maxAbs = 0.3;
    f.hist.forEach(function (p) { maxAbs = Math.max(maxAbs, Math.abs(p[1])); });
    var sa = symAxis(maxAbs * 1.1);
    plot.y = [-sa.top, sa.top];
    plot.yt = sa.ticks;
    plot.yf = function (v) { return L.fmtNum(v, Math.abs(v) < 1 && v !== 0 ? 1 : 0); };
    if (plot.begin()) {
      var c2 = plot.ctx;
      c2.save();
      c2.beginPath();
      c2.rect(plot.pad.l, plot.pad.t, plot.w - plot.pad.l - plot.pad.r, plot.h - plot.pad.t - plot.pad.b);
      c2.clip();
      c2.strokeStyle = C.COL.b;
      c2.lineWidth = 2.2;
      c2.lineJoin = 'round';
      c2.beginPath();
      f.hist.forEach(function (p, idx) {
        var px = plot.X(p[0] - f.t), py = plot.Y(p[1]);
        if (idx) c2.lineTo(px, py); else c2.moveTo(px, py);
      });
      c2.stroke();
      c2.restore();
    }
    var calc = 'ε = −N·ΔΦ/Δt · N = ' + f.N;
    var state = Math.abs(f.emf) < 0.005 ? L.tr('fluks se ne menja', 'the flux is not changing') : (f.emf < 0 ? L.tr('fluks raste', 'the flux is growing') : L.tr('fluks opada', 'the flux is falling'));
    var res = '|ε| = ' + C.sig(Math.abs(f.emf), 2) + ' V <small>· ' + state + '</small>';
    var ce = document.getElementById('f-calc'), re = document.getElementById('f-result');
    if (ce.__t !== calc) { ce.textContent = calc; ce.__t = calc; }
    if (re.__t !== res) { re.innerHTML = res; re.__t = res; }
  }

  var sc = C.scene(fig, draw, { touch: 'pan-y' });
  C.drag(sc.cv, {
    down: function () { autoCb.checked = false; },
    move: function (x) {
      var k = Math.min(sc.w / LW, sc.h / LH), lx = (x - (sc.w - LW * k) / 2) / k;
      f.x = Math.max(24, Math.min(316, lx));
    }
  });
  sc.cv.addEventListener('keydown', function (e) {
    var used = true;
    if (e.key === 'ArrowLeft') f.x = Math.max(24, f.x - 10); else if (e.key === 'ArrowRight') f.x = Math.min(316, f.x + 10); else used = false;
    if (used) { autoCb.checked = false; e.preventDefault(); }
  });
  L.range('f-n', { obj: f, key: 'N', fmt: function (v) { return v; } });
  L.range('f-v', { obj: f, key: 'spd', fmt: function (v) { return L.fmtNum(v, 1) + '×'; } });
  document.getElementById('f-flip').addEventListener('click', function () { f.flip *= -1; });
})();

(function slope() {
  var fig = document.getElementById('lab-slope');
  var cvs = fig.querySelectorAll('canvas');
  var s = { shape: 'ramp', N: 100, t: 1.5 };
  function phi(t) {
    if (s.shape === 'ramp') return t < 1 ? 0 : t < 3 ? 2 * (t - 1) : 4;
    if (s.shape === 'tri') return t < 2 ? 2 * t : 8 - 2 * t;
    return 2 * Math.sin(Math.PI * t / 2);
  }
  function dphi(t) {
    if (s.shape === 'ramp') return t >= 1 && t < 3 ? 2 : 0;
    if (s.shape === 'tri') return t < 2 ? 2 : -2;
    return Math.PI * Math.cos(Math.PI * t / 2);
  }
  function emf(t) { return -s.N * dphi(t) * 1e-3; }
  var p1 = new C.Plot(cvs[0], { x: [0, 4], y: [0, 5], xt: 4, yt: 5, xl: 't (s)', yl: 'Φ (mWb)', xf: function (v) { return L.fmtNum(v, 0); }, pad: { l: 42, r: 14, t: 18, b: 34 }, onResize: draw });
  var p2 = new C.Plot(cvs[1], { x: [0, 4], y: [-1, 1], xt: 4, yt: 4, xl: 't (s)', yl: 'ε (V)', xf: function (v) { return L.fmtNum(v, 0); }, pad: { l: 42, r: 14, t: 18, b: 34 }, onResize: draw });
  function draw() {
    if (s.shape === 'sin') { p1.y = [-3, 3]; p1.yt = 6; } else { p1.y = [0, 5]; p1.yt = 5; }
    p1.yf = function (v) { return L.fmtNum(v, 0); };
    if (p1.begin()) {
      p1.fillBetween(phi, 'rgba(108,198,238,.13)');
      p1.line(phi, C.COL.a, 2.4, { n: 300 });
      p1.vline(s.t, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
      p1.dot(s.t, phi(s.t), C.COL.a, 5.5);
    }
    var peak = s.shape === 'sin' ? Math.PI : 2;
    var sa = symAxis(s.N * peak * 1e-3 * 1.15);
    p2.y = [-sa.top, sa.top];
    p2.yt = sa.ticks;
    p2.yf = function (v) { return L.fmtNum(v, Math.abs(v) < 10 && v % 1 ? 1 : 0); };
    if (p2.begin()) {
      p2.fillBetween(emf, 'rgba(255,180,104,.13)');
      p2.line(emf, C.COL.b, 2.4, { n: 400 });
      p2.vline(s.t, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
      p2.dot(s.t, emf(s.t), C.COL.f, 5.5);
    }
  }
  function read() {
    var e = emf(s.t);
    document.getElementById('sl-calc').textContent = 'ε = −N · ΔΦ/Δt = −' + s.N + ' · (' + L.tr('nagib krive Φ', 'slope of Φ') + ')';
    document.getElementById('sl-result').innerHTML = 'Φ = ' + L.fmtNum(phi(s.t), 2) + ' mWb <small>· ε = ' + (Math.abs(e) < 1e-9 ? '0' : C.sig(e, 3)) + ' V</small>';
    draw();
  }
  L.range('sl-n', { obj: s, key: 'N', fmt: function (v) { return v; }, on: read });
  L.range('sl-t', { obj: s, key: 't', fmt: function (v) { return L.fmtNum(v, 2) + ' s'; }, on: read });
  C.toggle(document.getElementById('sl-shape'), function (v) { s.shape = v; read(); });
  L.onLang(read);
})();

(function lenz() {
  var fig = document.getElementById('lab-lenz');
  var cvs = fig.querySelectorAll('canvas');
  var LW = 340, LH = 272, RX1 = 112, RX2 = 232, RY1 = 30, RY2 = 214, A = 80, LY = 84, MM = 1.25e-3, RES = 0.1;
  var z = { v: 0.3, B: 0.5, xL: 8, dir: 1, hold: 0, area: 0, emf: 0, vx: 0, t: 0, hist: [], phase: 0 };
  var pause = document.getElementById('l-pause');

  function overlap(xL) { return Math.max(0, Math.min(xL + A, RX2) - Math.max(xL, RX1)); }
  z.area = overlap(z.xL) * A;

  var plot = new C.Plot(cvs[1], {
    x: [-6, 0], y: [-30, 30], xt: 6, yt: 6, xl: 't (s)', yl: 'ε (mV)',
    xf: function (v) { return L.fmtNum(v, 0); }, pad: { l: 46, r: 14, t: 18, b: 34 }
  });

  function draw(c, s, dt) {
    z.t += dt;
    var vpx = z.v / MM, prevX = z.xL;
    if (!pause.checked && !dragging) {
      if (z.hold > 0) z.hold -= dt;
      else {
        z.xL += z.dir * vpx * dt;
        if (z.xL >= 336 - A - 4) { z.xL = 336 - A - 4; z.dir = -1; z.hold = 0.7; }
        if (z.xL <= 4) { z.xL = 4; z.dir = 1; z.hold = 0.7; }
      }
    }
    var area = overlap(z.xL) * A, dA = (area - z.area) * MM * MM;
    z.area = area;
    var vxNow = dt > 0 ? (z.xL - prevX) / dt : 0;
    z.vx += (vxNow - z.vx) * Math.min(1, dt * 20);
    var raw = dt > 0 ? z.B * dA / dt : 0;
    z.emf += (raw - z.emf) * Math.min(1, dt * 25);
    if (Math.abs(z.emf) < 2e-5) z.emf = 0;
    z.hist.push([z.t, z.emf * 1e3]);
    while (z.hist.length && z.t - z.hist[0][0] > 6.2) z.hist.shift();
    var I = z.emf / RES, Fm = Math.abs(z.B * I * A * MM);

    c.save();
    C.fit(c, s, LW, LH);
    c.fillStyle = 'rgba(108,198,238,.07)';
    c.strokeStyle = 'rgba(108,198,238,.55)';
    c.lineWidth = 1.4;
    c.setLineDash([6, 5]);
    c.fillRect(RX1, RY1, RX2 - RX1, RY2 - RY1);
    c.strokeRect(RX1, RY1, RX2 - RX1, RY2 - RY1);
    c.setLineDash([]);
    c.strokeStyle = 'rgba(108,198,238,.55)';
    c.lineWidth = 1.3;
    for (var gx = RX1 + 20; gx < RX2; gx += 40) {
      for (var gy = RY1 + 20; gy < RY2; gy += 36) {
        c.beginPath(); c.arc(gx, gy, 6.5, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.moveTo(gx - 3.4, gy - 3.4); c.lineTo(gx + 3.4, gy + 3.4); c.moveTo(gx + 3.4, gy - 3.4); c.lineTo(gx - 3.4, gy + 3.4); c.stroke();
      }
    }
    C.mathLabel(c, 'B', RX1 + 14, RY1 - 10, '#8fd6f6', 'center', 18);
    c.font = '600 11px "IBM Plex Mono", monospace';
    c.fillStyle = 'rgba(143,214,246,.9)';
    c.textAlign = 'left';
    c.fillText(L.tr('⊗ polje u crtež', '⊗ field into the page'), RX1 + 26, RY1 - 10);

    var xL = z.xL, xR = z.xL + A, y1 = LY, y2 = LY + A;
    c.fillStyle = 'rgba(238,243,247,.05)';
    c.fillRect(xL, y1, A, A);
    C.polyline(c, [[xL, y1], [xR, y1], [xR, y2], [xL, y2], [xL, y1]], '#c77a43', 5);

    if (Math.abs(I) > 0.004) {
      var path = [[xR, y2], [xR, y1], [xL, y1], [xL, y2], [xR, y2]];
      z.phase += dt * 90 * (I > 0 ? 1 : -1);
      C.flowDots(c, path, z.phase, { spacing: 17, r: 3.2, color: '#ffb468', alpha: Math.min(1, 0.4 + Math.abs(I) * 3) });
    }
    if (Fm > 2e-4) {
      var edge = (xR > RX1 && xR < RX2) ? xR : xL;
      var sgn = z.vx >= 0 ? -1 : 1;
      var len = Math.min(70, 14 + 4200 * Fm);
      C.arrow(c, edge, y1 + A / 2, edge + sgn * len, y1 + A / 2, '#f5c84c', 3.6, 11);
      C.mathLabel(c, 'F', edge + sgn * (len + 12), y1 + A / 2 - 14, '#f8d77a', 'center', 18);
    }
    if (Math.abs(z.vx) > 8) {
      var vs = z.vx > 0 ? 1 : -1, cxm = (xL + xR) / 2;
      C.arrow(c, cxm - vs * 16, y2 + 24, cxm + vs * 22, y2 + 24, 'rgba(238,243,247,.85)', 2.6, 10);
      C.mathLabel(c, 'v', cxm, y2 + 40, 'rgba(238,243,247,.95)', 'center', 17);
    }
    c.restore();

    var ov = overlap(xL);
    var phaseTxt = ov <= 0.01 ? L.tr('van polja', 'outside the field') : ov >= A - 0.01 ? L.tr('potpuno u polju', 'fully inside') : (dA > 0 ? L.tr('ulazak: struja suprotno od kazaljke na satu', 'entering: current anticlockwise') : dA < 0 ? L.tr('izlazak: struja u smeru kazaljke na satu', 'leaving: current clockwise') : L.tr('petlja miruje', 'the loop is at rest'));
    var calc = 'ε = B·l·v = ' + L.fmtNum(z.B, 1) + ' T · 0,10 m · v · R = 0,1 Ω';
    var res = '|ε| = ' + C.sig(Math.abs(z.emf) * 1e3, 2) + ' mV <small>· |I| = ' + C.sig(Math.abs(I) * 1e3, 2) + ' mA · ' + phaseTxt + '</small>';
    var ce = document.getElementById('l-calc'), re = document.getElementById('l-result');
    if (ce.__t !== calc) { ce.textContent = calc; ce.__t = calc; }
    if (re.__t !== res) { re.innerHTML = res; re.__t = res; }

    var sa = symAxis(z.B * 0.1 * 0.5 * 1e3 * 1.1);
    plot.y = [-sa.top, sa.top];
    plot.yt = sa.ticks;
    plot.yf = function (v) { return L.fmtNum(v, 0); };
    if (plot.begin()) {
      var c2 = plot.ctx;
      c2.save();
      c2.beginPath();
      c2.rect(plot.pad.l, plot.pad.t, plot.w - plot.pad.l - plot.pad.r, plot.h - plot.pad.t - plot.pad.b);
      c2.clip();
      c2.strokeStyle = C.COL.b;
      c2.lineWidth = 2.2;
      c2.lineJoin = 'round';
      c2.beginPath();
      z.hist.forEach(function (p, idx) {
        var px = plot.X(p[0] - z.t), py = plot.Y(p[1]);
        if (idx) c2.lineTo(px, py); else c2.moveTo(px, py);
      });
      c2.stroke();
      c2.restore();
    }
  }

  var dragging = false, grab = 0;
  var sc = C.scene(fig, draw, { touch: 'pan-y' });
  C.drag(sc.cv, {
    down: function (x) {
      if (!pause.checked) return false;
      var k = Math.min(sc.w / LW, sc.h / LH), lx = (x - (sc.w - LW * k) / 2) / k;
      grab = lx - z.xL;
      dragging = true;
    },
    move: function (x) {
      if (!dragging) return;
      var k = Math.min(sc.w / LW, sc.h / LH), lx = (x - (sc.w - LW * k) / 2) / k;
      z.xL = Math.max(4, Math.min(336 - A - 4, lx - grab));
    },
    up: function () { dragging = false; }
  });
  L.range('l-v', { obj: z, key: 'v', fmt: function (v) { return L.fmtNum(v, 2) + ' m/s'; } });
  L.range('l-b', { obj: z, key: 'B', fmt: function (v) { return L.fmtNum(v, 1) + ' T'; } });
})();

var gen = { n: 60, B: 0.5, N: 100, run: true, phi: 0.6, emf: 0 };
(function generator() {
  var fig = document.getElementById('lab-gen');
  var cvs = fig.querySelectorAll('canvas');
  var S = 0.02;
  var runCb = document.getElementById('g-run');
  function emax() { return gen.N * gen.B * S * 2 * Math.PI * gen.n / 60; }
  var plot = new C.Plot(cvs[1], {
    x: [0, 360], y: [-1, 1], xt: 4, yt: 4, xl: 'φ (°)', yl: 'ε (V)',
    xf: function (v) { return L.fmtNum(v, 0) + '°'; }, pad: { l: 46, r: 14, t: 18, b: 34 }
  });
  gen.draw = function () {
    var em = emax(), sa = symAxis(em * 1.15);
    plot.y = [-sa.top, sa.top];
    plot.yt = sa.ticks;
    plot.yf = function (v) { return L.fmtNum(v, Math.abs(v) < 10 && v % 1 ? 1 : 0); };
    if (!plot.begin()) return;
    var rad = Math.PI / 180, deg = ((gen.phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / rad;
    plot.line(function (x) { return em * Math.cos(x * rad); }, 'rgba(108,198,238,.9)', 1.8, { dash: [6, 5] });
    plot.line(function (x) { return em * Math.sin(x * rad); }, C.COL.b, 2.4);
    plot.vline(deg, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
    plot.dot(deg, em * Math.sin(deg * rad), C.COL.f, 5.5);
    plot.text(L.tr('ε (napon)', 'ε (voltage)'), 6, sa.top * 0.82, C.COL.b, 'left', 0, 0);
    plot.text(L.tr('Φ (fluks, relativno)', 'Φ (flux, relative)'), 6, -sa.top * 0.82, C.COL.a, 'left', 0, 0);
  };
  function read() {
    var em = emax();
    document.getElementById('g-calc').textContent = 'ε_max = N·B·S·ω = ' + gen.N + ' · ' + L.fmtNum(gen.B, 1) + ' T · 0,02 m² · ' + L.fmtNum(2 * Math.PI * gen.n / 60, 1) + ' rad/s';
    document.getElementById('g-result').innerHTML = 'ε<sub>max</sub> = ' + C.sig(em, 3) + ' V <small>· U = ' + C.sig(em / Math.SQRT2, 3) + ' V (' + L.tr('efektivno', 'RMS') + ') · f = ' + L.fmtNum(gen.n / 60, 2) + ' Hz</small>';
    gen.draw();
  }
  L.range('g-n', { obj: gen, key: 'n', fmt: function (v) { return v + ' ' + L.tr('o/min', 'rpm'); }, on: read });
  L.range('g-b', { obj: gen, key: 'B', fmt: function (v) { return L.fmtNum(v, 1) + ' T'; }, on: read });
  L.range('g-turns', { obj: gen, key: 'N', fmt: function (v) { return v; }, on: read });
  runCb.addEventListener('change', function () { gen.run = this.checked; });
  L.onLang(read);
})();

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-gen',
    opt: { dist: 8.8, theta: 0.5, phi: 1.2, ty: -0.25, sway: 0.2 },
    build: function (st) {
      var Sc = st.scene, RR = 0.95, motion = V3.motion;
      var table = new T.Mesh(new T.CylinderGeometry(3.9, 3.9, 0.05, 72), std(Cc.table, { transparent: true, opacity: 0.85, roughness: 0.8 }));
      table.position.y = -2.4; Sc.add(table);
      var poleG = new T.BoxGeometry(0.6, 1.7, 1.5);
      var pN = new T.Mesh(poleG, std(Cc.north)); pN.position.x = -2.2;
      var pS = new T.Mesh(poleG, std(Cc.south)); pS.position.x = 2.2;
      var yoke = new T.Mesh(new T.BoxGeometry(5.0, 0.3, 1.5), std(0x59636d, { metalness: 0.45, roughness: 0.45 })); yoke.position.y = -1.0;
      Sc.add(pN, pS, yoke);
      var ln = V3.poleLabel('N'); ln.position.set(-2.2, 1.3, 0);
      var ls = V3.poleLabel('S'); ls.position.set(2.2, 1.3, 0);
      Sc.add(ln, ls);
      var paths = [];
      [-0.55, 0, 0.55].forEach(function (y) { [-0.55, 0, 0.55].forEach(function (zz) { paths.push([new T.Vector3(-1.9, y, zz), new T.Vector3(1.9, y, zz)]); }); });
      var field = V3.makeFlow(paths, { color: Cc.field, spacing: 0.6, size: 0.1, lineOpacity: 0.22 });
      Sc.add(field.group);
      var lb = V3.makeLabel('B', { color: '#8fd6f6', size: 0.5 }); lb.position.set(-1.3, 1.25, -0.9); Sc.add(lb);

      var rotor = new T.Group(); Sc.add(rotor);
      var cu = std(Cc.copper, { metalness: 0.55, roughness: 0.35 });
      var steel = std(0x9aa5b1, { metalness: 0.7, roughness: 0.3 });
      var axle = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 3.6, 16), steel);
      axle.rotation.x = Math.PI / 2; rotor.add(axle);
      var sideG = new T.CylinderGeometry(0.075, 0.075, 1.4, 14);
      [RR, -RR].forEach(function (x) {
        var m = new T.Mesh(sideG, cu); m.rotation.x = Math.PI / 2; m.position.set(x, 0, 0); rotor.add(m);
      });
      var back = new T.Mesh(new T.BoxGeometry(2 * RR + 0.12, 0.12, 0.12), cu); back.position.set(0, 0, -0.7); rotor.add(back);
      [RR, -RR].forEach(function (x) {
        var m = new T.Mesh(new T.BoxGeometry(RR - 0.3, 0.1, 0.1), cu);
        m.position.set(x / 2 + (x > 0 ? 0.15 : -0.15), 0, 0.7); rotor.add(m);
      });
      var ringG = new T.CylinderGeometry(0.3, 0.3, 0.2, 28);
      var ringA = new T.Mesh(ringG, std(Cc.copper, { metalness: 0.6, roughness: 0.3 }));
      ringA.rotation.x = Math.PI / 2; ringA.position.z = 1.05; rotor.add(ringA);
      var ringB = new T.Mesh(ringG, std(0x8f78d8, { metalness: 0.6, roughness: 0.3 }));
      ringB.rotation.x = Math.PI / 2; ringB.position.z = 1.4; rotor.add(ringB);
      var rA = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.35), cu); rA.position.set(0.28, 0, 0.88); rotor.add(rA);
      var rB = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.7), cu); rB.position.set(-0.28, 0, 1.05); rotor.add(rB);
      var dA = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.1), cu); dA.position.set(-0.28, 0, 0.7); rotor.add(dA);

      var carbon = std(0x2b3846, { roughness: 0.8 });
      var b1 = new T.Mesh(new T.BoxGeometry(0.2, 0.3, 0.2), carbon); b1.position.set(0, -0.4, 1.05); Sc.add(b1);
      var b2 = new T.Mesh(new T.BoxGeometry(0.2, 0.3, 0.2), carbon); b2.position.set(0, -0.4, 1.4); Sc.add(b2);
      var meter = new T.Mesh(new T.BoxGeometry(1.7, 1.1, 0.35), std(0x20303f, { roughness: 0.6 }));
      meter.position.set(0, -1.9, 1.2); Sc.add(meter);
      var face = new T.Mesh(new T.PlaneGeometry(1.5, 0.9), new T.MeshBasicMaterial({ color: 0xe9f0f6 }));
      face.position.set(0, -1.9, 1.38); Sc.add(face);
      var needle = new T.Group(); needle.position.set(0, -2.25, 1.4);
      var nb = new T.Mesh(new T.BoxGeometry(0.04, 0.75, 0.02), new T.MeshBasicMaterial({ color: 0xd8453a }));
      nb.position.y = 0.37; needle.add(nb); Sc.add(needle);
      var zeroTick = new T.Mesh(new T.BoxGeometry(0.02, 0.12, 0.01), new T.MeshBasicMaterial({ color: 0x20303f }));
      zeroTick.position.set(0, -1.52, 1.39); Sc.add(zeroTick);
      var lv = V3.makeLabel('V', { color: '#20303f', size: 0.4, font: '800 80px Archivo, system-ui, sans-serif' }); lv.position.set(0.55, -2.15, 1.4); Sc.add(lv);
      var wm = new T.LineBasicMaterial({ color: 0x8da2b5 });
      [[0.0, 1.05, -0.45], [0.0, 1.4, 0.45]].forEach(function (w) {
        var g = new T.BufferGeometry().setFromPoints([new T.Vector3(w[0], -0.55, w[1]), new T.Vector3(w[0] + w[2], -1.2, w[1]), new T.Vector3(w[2], -1.35, 1.2)]);
        Sc.add(new T.Line(g, wm));
      });

      var f1 = V3.makeFlow([[new T.Vector3(RR, 0, -0.7), new T.Vector3(RR, 0, 0.7)]], { color: Cc.current, spacing: 0.28, size: 0.24, noLine: true });
      var f2 = V3.makeFlow([[new T.Vector3(-RR, 0, 0.7), new T.Vector3(-RR, 0, -0.7)]], { color: Cc.current, spacing: 0.28, size: 0.24, noLine: true });
      rotor.add(f1.group, f2.group);
      var acc = 0, last = 0;

      st.updaters.push(function (dt) {
        var w = gen.run ? 2 * Math.PI * gen.n / 60 : 0;
        gen.phi += w * dt;
        var th = gen.phi - Math.PI / 2;
        rotor.rotation.z = th;
        var em = gen.N * gen.B * 0.02 * w, e = em * Math.sin(gen.phi);
        var k = em > 0 ? Math.sin(gen.phi) : 0;
        f1.update(dt, k * 1.4 * motion);
        f2.update(dt, k * 1.4 * motion);
        f1.setStrength(Math.min(1, Math.abs(k) * 1.2)); f2.setStrength(Math.min(1, Math.abs(k) * 1.2));
        field.update(dt, 0.45 * motion);
        var emRef = gen.N * gen.B * 0.02 * 2 * Math.PI * 240 / 60;
        needle.rotation.z = -Math.max(-1, Math.min(1, e / (emRef * 0.55))) * 0.95;
        gen.draw();
        acc += dt;
        if (acc > 0.15) {
          acc = 0;
          var el = document.getElementById('g-result');
          var html = 'ε = ' + (e >= 0 ? '+' : '−') + C.sig(Math.abs(e), 3) + ' V <small>· ε<sub>max</sub> = ' + C.sig(gen.N * gen.B * 0.02 * 2 * Math.PI * gen.n / 60, 3) + ' V · f = ' + L.fmtNum(gen.n / 60, 2) + ' Hz</small>';
          if (!gen.run) html = 'ε = 0 V <small>· ' + L.tr('zavojak miruje', 'the loop is at rest') + '</small>';
          if (el.__t !== html) { el.innerHTML = html; el.__t = html; }
        }
      });
    }
  }]);
}
})();
