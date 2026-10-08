(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var N_TURNS = 20, AREA = 0.004;
var mot = { B: 0.3, I: 2, load: 0, comm: true, pol: 1, alpha: 1.05, w: 0 };

function motorMmax() { return N_TURNS * mot.B * mot.I * AREA; }
function readMotor() {
  document.getElementById('m-calc').textContent = 'M = N·B·I·S·sin α = ' + N_TURNS + ' · ' + L.fmtNum(mot.B, 2) + ' T · ' + L.fmtNum(mot.I, 1) + ' A · ' + L.fmtNum(AREA, 3) + ' m² · sin α';
}
function readMotorLive() {
  var rpm = Math.abs(mot.w) * 60 / (2 * Math.PI);
  var html = 'M<sub>max</sub> = ' + C.sig(motorMmax() * 1e3, 3) + ' mN·m <small>· n = ' + L.fmtNum(rpm, 0) + ' ' + L.tr('o/min', 'rpm') + '</small>';
  var el = document.getElementById('m-result');
  if (el.__t !== html) { el.innerHTML = html; el.__t = html; }
}
L.range('m-b', { obj: mot, key: 'B', fmt: function (v) { return L.fmtNum(v, 2) + ' T'; }, on: readMotor });
L.range('m-i', { obj: mot, key: 'I', fmt: function (v) { return L.fmtNum(v, 1) + ' A'; }, on: readMotor });
L.range('m-load', { obj: mot, key: 'load', fmt: function (v) { return v + ' mN·m'; }, on: readMotor });
document.getElementById('m-comm').addEventListener('change', function () { mot.comm = this.checked; });
document.getElementById('m-flip').addEventListener('click', function () { mot.pol *= -1; });
L.onLang(function () { readMotor(); readMotorLive(); });

function stepMotor(dt) {
  var J = 0.0015, b = 0.003, ml = mot.load * 1e-3, K = motorMmax(), n = 8, h = dt / n;
  for (var i = 0; i < n; i++) {
    var sa = Math.sin(mot.alpha);
    var Md = mot.pol * K * (mot.comm ? Math.abs(sa) : sa);
    var Mn = Md - b * mot.w;
    if (Math.abs(mot.w) < 0.03 && Math.abs(Mn) <= ml) { mot.w = 0; }
    else {
      var sg = Math.abs(mot.w) < 0.03 ? Math.sign(Mn) : Math.sign(mot.w);
      mot.w += (Mn - ml * sg) / J * h;
    }
    mot.alpha += mot.w * h;
  }
  mot.alpha = ((mot.alpha % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}
function currentSign(alpha) { return mot.pol * (mot.comm ? (Math.sin(alpha) >= 0 ? 1 : -1) : 1); }

(function torque() {
  var fig = document.getElementById('lab-torque');
  var cvs = fig.querySelectorAll('canvas');
  var q = { a: 60, I: 2 };
  var comm = document.getElementById('q-comm'), auto = document.getElementById('q-auto'), slider;
  var LW = 340, LH = 272, CX = 170, CY = 136, R = 78, RC = 20;

  function Mmax() { return N_TURNS * 0.3 * q.I * AREA * 1e3; }
  function sAt(a) { return comm.checked ? (Math.sin(a) >= 0 ? 1 : -1) : 1; }
  function Mat(a) { return Mmax() * (comm.checked ? Math.abs(Math.sin(a)) : Math.sin(a)); }

  var plot = new C.Plot(cvs[1], {
    x: [0, 360], y: [-1, 1], xt: 4, yt: 4, xl: 'α (°)', yl: 'M (mN·m)',
    xf: function (v) { return L.fmtNum(v, 0) + '°'; },
    pad: { l: 46, r: 14, t: 18, b: 34 }, onResize: drawPlot
  });
  function drawPlot() {
    var ax = C.niceAxis(Mmax() * 1.1), n = ax.ticks % 2 ? ax.ticks + 1 : ax.ticks, top = ax.max / ax.ticks * n;
    plot.y = [-top, top];
    plot.yt = n;
    plot.yf = function (v) { return L.fmtNum(v, 0); };
    if (!plot.begin()) return;
    var rad = Math.PI / 180;
    plot.fillBetween(function (x) { return comm.checked ? Mmax() * Math.abs(Math.sin(x * rad)) : Mmax() * Math.sin(x * rad); }, 'rgba(255,180,104,.13)');
    plot.line(function (x) { return Mmax() * Math.sin(x * rad); }, 'rgba(108,198,238,.9)', 1.8, { dash: [6, 5] });
    plot.line(function (x) { return Mmax() * Math.abs(Math.sin(x * rad)); }, C.COL.b, 2.4);
    plot.vline(q.a, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
    plot.dot(q.a, Mat(q.a * rad), C.COL.f, 5.5);
    plot.text(L.tr('sa komutatorom', 'with commutator'), 6, top * 0.8, C.COL.b, 'left', 0, 0);
    plot.text(L.tr('bez komutatora', 'no commutator'), 6, -top * 0.8, C.COL.a, 'left', 0, 0);
  }

  function draw(c, s) {
    var al = q.a * Math.PI / 180, th = al - Math.PI / 2, sg = sAt(al);
    c.save();
    C.fit(c, s, LW, LH);
    c.font = '700 20px Archivo, system-ui, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#c4362c';
    c.fillRect(4, 66, 42, 140);
    c.fillStyle = '#fff';
    c.fillText('N', 25, 136);
    c.fillStyle = '#2c5bbd';
    c.fillRect(294, 66, 42, 140);
    c.fillStyle = '#fff';
    c.fillText('S', 315, 136);
    for (var k = 0; k < 5; k++) {
      var yy = 76 + k * 30;
      C.arrow(c, 52, yy, 288, yy, 'rgba(108,198,238,.32)', 1.4, 7);
    }
    C.mathLabel(c, 'B', 62, 54, '#8fd6f6', 'center', 18);

    var p1 = [CX + R * Math.cos(th), CY - R * Math.sin(th)], p2 = [CX - R * Math.cos(th), CY + R * Math.sin(th)];
    c.strokeStyle = 'rgba(201,214,226,.2)';
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(CX, CY, R, 0, Math.PI * 2);
    c.stroke();
    C.polyline(c, [p1, p2], '#c77a43', 5);

    var fl = 54;
    C.arrow(c, p1[0], p1[1], p1[0], p1[1] - sg * fl, '#f5c84c', 3.4, 11);
    C.arrow(c, p2[0], p2[1], p2[0], p2[1] + sg * fl, '#f5c84c', 3.4, 11);

    var a0 = -(th + Math.PI / 2), a1 = -(th - Math.PI / 2), gap = 0.12;
    c.lineWidth = 11;
    c.lineCap = 'butt';
    c.strokeStyle = '#c77a43';
    c.beginPath(); c.arc(CX, CY, RC, a0 + gap, a1 - gap); c.stroke();
    c.strokeStyle = '#8f78d8';
    c.beginPath(); c.arc(CX, CY, RC, a1 + gap, a0 + 2 * Math.PI - gap); c.stroke();
    c.fillStyle = '#2b3846';
    c.strokeStyle = '#8da2b5';
    c.lineWidth = 1.4;
    c.fillRect(CX + RC + 6, CY - 6, 16, 12); c.strokeRect(CX + RC + 6, CY - 6, 16, 12);
    c.fillRect(CX - RC - 22, CY - 6, 16, 12); c.strokeRect(CX - RC - 22, CY - 6, 16, 12);
    c.font = '700 15px "IBM Plex Mono", monospace';
    c.fillStyle = '#f0675c';
    c.fillText('+', CX + RC + 30, CY - 14);
    c.fillStyle = '#83a3f3';
    c.fillText('−', CX - RC - 30, CY - 14);

    C.wireDot(c, p1[0], p1[1], 12, sg);
    C.wireDot(c, p2[0], p2[1], 12, -sg);
    var na = [CX + 52 * Math.cos(al), CY - 52 * Math.sin(al)];
    C.arrow(c, CX, CY, na[0], na[1], '#eef3f7', 2.6, 10);
    C.mathLabel(c, 'n', CX + 66 * Math.cos(al), CY - 66 * Math.sin(al), '#eef3f7', 'center', 18);
    c.strokeStyle = '#8fd6f6';
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(CX, CY, 38, 0, -al, true);
    c.stroke();
    C.mathLabel(c, 'α', CX + 48 * Math.cos(al / 2), CY - 48 * Math.sin(al / 2), '#8fd6f6', 'center', 16);
    c.restore();
  }

  var sc = C.scene(fig, draw, { touch: 'pan-y' });

  function read() {
    var al = q.a * Math.PI / 180, m = Mat(al);
    document.getElementById('q-calc').textContent = 'M = N·B·I·S·sin α = ' + N_TURNS + ' · 0,3 T · ' + L.fmtNum(q.I, 1) + ' A · 0,004 m² · sin ' + q.a + '°';
    var note = '';
    if (!comm.checked && m < -1e-9) note = ' <small>' + L.tr('(suprotan smer: vraća zavojak)', '(opposite direction: pulls the loop back)') + '</small>';
    if (Math.abs(m) < 1e-9) note = ' <small>' + L.tr('(neutralni položaj)', '(neutral position)') + '</small>';
    document.getElementById('q-result').innerHTML = 'M = ' + C.sig(m, 3) + ' mN·m' + note;
    drawPlot();
  }
  slider = L.range('q-a', { obj: q, key: 'a', fmt: function (v) { return v + '°'; }, on: read });
  L.range('q-i', { obj: q, key: 'I', fmt: function (v) { return L.fmtNum(v, 1) + ' A'; }, on: read });
  comm.addEventListener('change', read);
  L.onLang(read);

  var last = performance.now();
  (function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (auto.checked && fig.__visible) {
      q.a = (q.a + dt * 45) % 361;
      slider.value = Math.round(q.a);
      q.a = Math.round(q.a);
      slider.dispatchEvent(new Event('input'));
    }
    requestAnimationFrame(tick);
  })(last);
})();

(function startup() {
  var fig = document.getElementById('lab-start');
  var cvs = fig.querySelectorAll('canvas');
  var s = { U: 12, load: 0 };
  var stall = document.getElementById('s-stall');
  var R = 3, K = 0.05, J = 3e-4, Bv = 2e-4, TMAX = 2;
  var data = { t: [], I: [], n: [] };

  function sim() {
    var w = 0, dt = 0.002, ml = s.load * 1e-3;
    data = { t: [], I: [], n: [] };
    for (var t = 0; t <= TMAX + 1e-9; t += dt) {
      var I = (s.U - K * w) / R;
      data.t.push(t);
      data.I.push(I);
      data.n.push(w * 60 / (2 * Math.PI));
      if (stall.checked) { w = 0; continue; }
      var Mn = K * I - Bv * w;
      if (w <= 0 && Mn <= ml) w = 0;
      else { w += (Mn - ml) / J * dt; if (w < 0) w = 0; }
    }
  }
  var p1 = new C.Plot(cvs[0], { x: [0, TMAX], y: [0, 5], xt: 4, yt: 4, xf: function (v) { return L.fmtNum(v, 1); }, xl: 't (s)', yl: 'I (A)', pad: { l: 42, r: 14, t: 18, b: 34 }, onResize: draw });
  var p2 = new C.Plot(cvs[1], { x: [0, TMAX], y: [0, 3000], xt: 4, yt: 4, xf: function (v) { return L.fmtNum(v, 1); }, xl: 't (s)', yl: 'n (' + L.tr('o/min', 'rpm') + ')', pad: { l: 42, r: 14, t: 18, b: 34 }, onResize: draw });
  function draw() {
    if (!data.t.length) return;
    var i = 0;
    var ax1 = C.niceAxis(s.U / R * 1.1);
    p1.y = [0, ax1.max];
    p1.yt = ax1.ticks;
    p1.yf = function (v) { return L.fmtNum(v, v % 1 ? 1 : 0); };
    p1.yl = 'I (A)';
    if (p1.begin()) {
      p1.fillBetween(function (t) { return data.I[Math.min(data.I.length - 1, Math.round(t / 0.002))]; }, 'rgba(255,180,104,.13)');
      p1.line(function (t) { return data.I[Math.min(data.I.length - 1, Math.round(t / 0.002))]; }, C.COL.b, 2.4, { n: 400 });
    }
    var ax2 = C.niceAxis(s.U / K * 60 / (2 * Math.PI) * 1.1);
    p2.y = [0, ax2.max];
    p2.yt = ax2.ticks;
    p2.yf = function (v) { return L.fmtNum(v, 0); };
    p2.yl = 'n (' + L.tr('o/min', 'rpm') + ')';
    if (p2.begin()) {
      p2.fillBetween(function (t) { return data.n[Math.min(data.n.length - 1, Math.round(t / 0.002))]; }, 'rgba(108,198,238,.13)');
      p2.line(function (t) { return data.n[Math.min(data.n.length - 1, Math.round(t / 0.002))]; }, C.COL.a, 2.4, { n: 400 });
    }
  }
  function read() {
    sim();
    var last = data.I.length - 1;
    document.getElementById('s-calc').textContent = 'I = (U − E) / R · E = k·ω · R = 3 Ω';
    var html;
    if (stall.checked) {
      var P = s.U * s.U / R;
      html = 'I = U/R = ' + L.fmtNum(s.U / R, 1) + ' A <small>· ' + L.tr('toplota u namotajima ', 'heat in the windings ') + L.fmtNum(P, 0) + ' W</small>';
    } else {
      html = 'I<sub>0</sub> = ' + L.fmtNum(s.U / R, 1) + ' A <small>→ ' + L.fmtNum(data.I[last], 1) + ' A · n = ' + L.fmtNum(data.n[last], 0) + ' ' + L.tr('o/min', 'rpm') + '</small>';
    }
    document.getElementById('s-result').innerHTML = html;
    draw();
  }
  L.range('s-u', { obj: s, key: 'U', fmt: function (v) { return v + ' V'; }, on: read });
  L.range('s-load', { obj: s, key: 'load', fmt: function (v) { return v + ' mN·m'; }, on: read });
  stall.addEventListener('change', read);
  L.onLang(read);
})();

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-motor',
    opt: { dist: 8.8, theta: 0.5, phi: 1.2, ty: -0.25, sway: 0.2 },
    build: function (st) {
      var S = st.scene, RR = 0.95, motion = V3.motion;
      var table = new T.Mesh(new T.CylinderGeometry(3.9, 3.9, 0.05, 72), std(Cc.table, { transparent: true, opacity: 0.85, roughness: 0.8 }));
      table.position.y = -2.4; S.add(table);
      var poleG = new T.BoxGeometry(0.6, 1.7, 1.5);
      var pN = new T.Mesh(poleG, std(Cc.north)); pN.position.x = -2.2;
      var pS = new T.Mesh(poleG, std(Cc.south)); pS.position.x = 2.2;
      var yoke = new T.Mesh(new T.BoxGeometry(5.0, 0.3, 1.5), std(0x59636d, { metalness: 0.45, roughness: 0.45 })); yoke.position.y = -1.0;
      S.add(pN, pS, yoke);
      var ln = V3.poleLabel('N'); ln.position.set(-2.2, 1.3, 0);
      var ls = V3.poleLabel('S'); ls.position.set(2.2, 1.3, 0);
      S.add(ln, ls);
      var paths = [];
      [-0.55, 0, 0.55].forEach(function (y) { [-0.55, 0, 0.55].forEach(function (z) { paths.push([new T.Vector3(-1.9, y, z), new T.Vector3(1.9, y, z)]); }); });
      var field = V3.makeFlow(paths, { color: Cc.field, spacing: 0.6, size: 0.1, lineOpacity: 0.22 });
      S.add(field.group);
      var lb = V3.makeLabel('B', { color: '#8fd6f6', size: 0.5 }); lb.position.set(-1.3, 1.25, -0.9); S.add(lb);

      var rotor = new T.Group(); S.add(rotor);
      var cu = std(Cc.copper, { metalness: 0.55, roughness: 0.35 });
      var steel = std(0x9aa5b1, { metalness: 0.7, roughness: 0.3 });
      var axle = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 3.6, 16), steel);
      axle.rotation.x = Math.PI / 2; rotor.add(axle);
      var sideG = new T.CylinderGeometry(0.075, 0.075, 1.4, 14);
      [RR, -RR].forEach(function (x) {
        var m = new T.Mesh(sideG, cu); m.rotation.x = Math.PI / 2; m.position.set(x, 0, 0); rotor.add(m);
      });
      var back = new T.Mesh(new T.BoxGeometry(2 * RR + 0.12, 0.12, 0.12), cu); back.position.set(0, 0, -0.7); rotor.add(back);
      var front = new T.Group(); rotor.add(front);
      [RR, -RR].forEach(function (x) {
        var m = new T.Mesh(new T.BoxGeometry(RR - 0.3, 0.1, 0.1), cu);
        m.position.set(x / 2 + (x > 0 ? 0.15 : -0.15), 0, 0.7); front.add(m);
      });
      function half(a0, a1, color) {
        var sh = new T.Shape();
        sh.absarc(0, 0, 0.3, a0, a1, false);
        sh.lineTo(0, 0);
        var g = new T.ExtrudeGeometry(sh, { depth: 0.55, bevelEnabled: false });
        var m = new T.Mesh(g, std(color, { metalness: 0.5, roughness: 0.35 }));
        m.position.z = 1.0;
        return m;
      }
      rotor.add(half(-Math.PI / 2 + 0.06, Math.PI / 2 - 0.06, Cc.copper));
      rotor.add(half(Math.PI / 2 + 0.06, 3 * Math.PI / 2 - 0.06, 0x8f78d8));
      [0.25, -0.25].forEach(function (x) { var rd = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.34), cu); rd.position.set(x, 0, 0.85); rotor.add(rd); });

      var carbon = std(0x2b3846, { roughness: 0.8 });
      var brR = new T.Mesh(new T.BoxGeometry(0.28, 0.2, 0.34), carbon); brR.position.set(0.44, 0, 1.28); S.add(brR);
      var brL = new T.Mesh(new T.BoxGeometry(0.28, 0.2, 0.34), carbon); brL.position.set(-0.44, 0, 1.28); S.add(brL);
      var plus = V3.makeLabel('+', { color: '#f0675c', size: 0.42, font: '700 100px "IBM Plex Mono", monospace' }); plus.position.set(0.7, 0.36, 1.28); S.add(plus);
      var minus = V3.makeLabel('−', { color: '#83a3f3', size: 0.42, font: '700 100px "IBM Plex Mono", monospace' }); minus.position.set(-0.7, 0.36, 1.28); S.add(minus);
      var batt = new T.Mesh(new T.BoxGeometry(1.5, 0.5, 0.6), std(0xc8921a, { metalness: 0.2, roughness: 0.5 }));
      batt.position.set(0, -2.05, 1.28); S.add(batt);
      var wm = new T.LineBasicMaterial({ color: 0x8da2b5 });
      [[0.56, 1], [-0.56, -1]].forEach(function (w) {
        var g = new T.BufferGeometry().setFromPoints([new T.Vector3(w[0], 0, 1.28), new T.Vector3(w[0] * 1.15, -0.9, 1.28), new T.Vector3(w[1] * 0.6, -1.8, 1.28)]);
        S.add(new T.Line(g, wm));
      });

      var f1 = V3.makeFlow([[new T.Vector3(RR, 0, -0.7), new T.Vector3(RR, 0, 0.7)]], { color: Cc.current, spacing: 0.28, size: 0.24, noLine: true });
      var f2 = V3.makeFlow([[new T.Vector3(-RR, 0, 0.7), new T.Vector3(-RR, 0, -0.7)]], { color: Cc.current, spacing: 0.28, size: 0.24, noLine: true });
      rotor.add(f1.group, f2.group);
      var a1 = V3.makeArrow(Cc.force, 0.045), a2 = V3.makeArrow(Cc.force, 0.045);
      S.add(a1, a2);
      var fl1 = V3.makeLabel('F', { color: '#f8d77a', size: 0.45 }), fl2 = V3.makeLabel('F', { color: '#f8d77a', size: 0.45 });
      S.add(fl1, fl2);
      var acc = 0;

      st.updaters.push(function (dt) {
        stepMotor(dt);
        var th = mot.alpha - Math.PI / 2;
        rotor.rotation.z = th;
        var sg = currentSign(mot.alpha);
        var ctrl = mot.I > 0 ? 1 : 0;
        f1.update(dt, sg * 0.9 * motion);
        f2.update(dt, sg * 0.9 * motion);
        f1.setStrength(ctrl); f2.setStrength(ctrl);
        field.update(dt, 0.45 * motion);
        var len = mot.I > 0 ? 0.3 + 0.85 * Math.sqrt(mot.B * mot.I / 2.5) : 0;
        var x1 = RR * Math.cos(th), y1 = RR * Math.sin(th);
        a1.position.set(x1, y1, 0); a1.set(new T.Vector3(0, sg, 0), len);
        a2.position.set(-x1, -y1, 0); a2.set(new T.Vector3(0, -sg, 0), len);
        fl1.visible = fl2.visible = len > 0.02;
        fl1.position.set(x1 + 0.28, y1 + sg * (len + 0.3), 0);
        fl2.position.set(-x1 + 0.28, -y1 - sg * (len + 0.3), 0);
        plus.position.x = mot.pol * 0.7; minus.position.x = -mot.pol * 0.7;
        brR.position.x = 0.44; brL.position.x = -0.44;
        acc += dt;
        if (acc > 0.12) { acc = 0; readMotorLive(); }
      });
    }
  }]);
}
})();
