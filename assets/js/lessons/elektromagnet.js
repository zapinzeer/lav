(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var MU0 = 4 * Math.PI * 1e-7;
var coil = { I: 2, N: 400, core: true, sign: 1, l: 0.3, mur: 200 };

function coilB(withCore) { return (withCore ? coil.mur : 1) * MU0 * coil.N * coil.I / coil.l; }
function readCoil() {
  var head = coil.core ? 'B = μᵣ·μ₀·N·I / l = ' + coil.mur + ' · ' : 'B = μ₀·N·I / l = ';
  document.getElementById('e-calc').textContent = head + '4π·10⁻⁷ · ' + coil.N + ' · ' + L.fmtNum(coil.I, 1) + ' A / ' + L.fmtNum(coil.l, 2) + ' m';
  var main = coilB(coil.core), other = coilB(!coil.core);
  var extra = coil.I > 0 ? ' <small>· ' + (coil.core ? L.tr('bez jezgra: ', 'without the core: ') : L.tr('sa jezgrom: ', 'with the core: ')) + C.fmtB(other) + '</small>' : '';
  document.getElementById('e-result').innerHTML = 'B = ' + C.fmtB(main) + extra;
}
L.range('e-current', { obj: coil, key: 'I', fmt: function (v) { return L.fmtNum(v, 1) + ' A'; }, on: readCoil });
L.range('e-turns', { obj: coil, key: 'N', fmt: function (v) { return v; }, on: function () { coil.rebuild = true; readCoil(); } });
document.getElementById('e-core').checked = true;
document.getElementById('e-core').addEventListener('change', function () { coil.core = this.checked; readCoil(); });
document.getElementById('e-flip').addEventListener('click', function () { coil.sign *= -1; readCoil(); });

(function saturation() {
  var fig = document.getElementById('lab-sat');
  var s = { N: 400, I: 2 };
  var LEN = 0.3, MUR = 200, BS = 1.6;
  var plot = new C.Plot(fig.querySelector('canvas'), {
    x: [0, 5], y: [0, 2], xt: 5, yt: 4, xl: 'I (A)', yl: 'B (T)',
    xf: function (v) { return L.fmtNum(v, 0); }, yf: function (v) { return L.fmtNum(v, 1); },
    pad: { l: 40, r: 14, t: 18, b: 34 }, onResize: draw
  });
  function air(i) { return MU0 * s.N / LEN * i; }
  function ideal(i) { return MUR * air(i); }
  function real(i) { return BS * Math.tanh(ideal(i) / BS); }
  function draw() {
    if (!plot.begin()) return;
    plot.hline(BS, 'rgba(245,200,76,.5)', 1.1, [2, 4]);
    plot.text(L.tr('zasićenje ≈ 1,6 T', 'saturation ≈ 1.6 T'), 4.95, BS, 'rgba(245,200,76,.9)', 'right', 0, -9);
    plot.fillBetween(real, 'rgba(108,198,238,.12)');
    plot.line(ideal, 'rgba(201,214,226,.6)', 1.6, { dash: [6, 5] });
    plot.line(air, C.COL.b, 2.2);
    plot.line(real, C.COL.a, 2.6);
    plot.vline(s.I, 'rgba(255,255,255,.28)', 1.2, [4, 4]);
    plot.dot(s.I, air(s.I), C.COL.b, 5);
    plot.dot(s.I, real(s.I), C.COL.a, 5.5);
    plot.text(L.tr('gvožđe', 'iron'), 3.1, real(3.1), C.COL.a, 'left', 4, 16);
    plot.text(L.tr('bez jezgra', 'no core'), 3.6, air(3.6), C.COL.b, 'left', 0, -11);
  }
  function read() {
    var n = s.N / LEN;
    document.getElementById('s-calc').textContent = 'n = N / l = ' + s.N + ' / 0,30 m = ' + L.fmtNum(n, 0) + ' m⁻¹';
    var txt = L.tr('bez jezgra: ', 'no core: ') + C.fmtB(air(s.I)) + ' · ' + L.tr('gvožđe: ', 'iron: ') + C.fmtB(real(s.I));
    var idl = ideal(s.I);
    if (idl > real(s.I) * 1.02) txt += ' <small>(' + L.tr('idealno bi bilo ', 'ideal would be ') + C.fmtB(idl) + ')</small>';
    document.getElementById('s-result').innerHTML = txt;
    draw();
  }
  L.range('s-n', { obj: s, key: 'N', fmt: function (v) { return v; }, on: read });
  L.range('s-i', { obj: s, key: 'I', fmt: function (v) { return L.fmtNum(v, 1) + ' A'; }, on: read });
  L.onLang(read);
})();

(function relay() {
  var fig = document.getElementById('lab-relay');
  var cb = document.getElementById('r-sw');
  var st = { cur: 0, k: 0, sw: 0, phase: 0, lit: 0 };
  var LW = 340, LH = 288, MAXA = 0.135, PX = 150, PY = 120;
  var ctrl = [[66, 254], [100, 254], [100, 214], [78, 214], [78, 153], [40, 153], [22, 153], [22, 254], [52, 254], [66, 254]];
  var BG = '#8da2b5', CU = '#c77a43', ORG = '#ffb468';
  var scn;

  function tip(a) { return [PX + 65 * Math.cos(a), PY + 65 * Math.sin(a)]; }

  function wires(c) {
    var segs = [
      [[40, 153], [22, 153], [22, 205]],
      [[22, 228], [22, 254], [52, 254]],
      [[66, 254], [100, 254], [100, 214], [78, 214]],
      [[212, 96], [212, 80], [300, 80], [300, 118]],
      [[300, 152], [300, 203]],
      [[300, 211], [300, 254], [150, 254], [150, 120]]
    ];
    segs.forEach(function (p) { C.polyline(c, p, BG, 2.4); });
    C.polyline(c, [[78, 214], [78, 153], [40, 153]], CU, 2.6);
  }

  function battery(c, x, y, vertical) {
    c.save();
    c.strokeStyle = '#e9f0f6';
    c.lineWidth = 2.4;
    c.beginPath();
    if (!vertical) {
      c.moveTo(x - 4, y - 7); c.lineTo(x - 4, y + 7);
      c.moveTo(x + 4, y - 12); c.lineTo(x + 4, y + 12);
    } else {
      c.moveTo(x - 7, y + 4); c.lineTo(x + 7, y + 4);
      c.moveTo(x - 12, y - 4); c.lineTo(x + 12, y - 4);
    }
    c.stroke();
    c.restore();
  }

  function draw(c, s, dt) {
    scn = s;
    var target = cb.checked ? 1 : 0;
    st.sw += (target - st.sw) * Math.min(1, dt * 14);
    st.cur += (target - st.cur) * Math.min(1, dt * (L.reduce ? 40 : 6));
    var want = st.cur > 0.6 ? 1 : 0;
    st.k += (want - st.k) * Math.min(1, dt * (L.reduce ? 40 : 11));
    st.lit += ((st.k > 0.97 ? 1 : 0) - st.lit) * Math.min(1, dt * 12);
    st.phase += dt * 60;
    var a = -MAXA * st.k;
    c.save();
    C.fit(c, s, LW, LH);
    c.font = '600 10.5px "IBM Plex Mono", monospace';

    wires(c);
    var ctrlDots = ctrl;
    if (st.cur > 0.04) C.flowDots(c, ctrlDots, st.phase, { spacing: 16, r: 2.8, color: ORG, alpha: st.cur });
    var t = tip(a);
    if (st.k > 0.97) {
      var load = [[300, 254], [300, 80], [212, 80], [212, 108], [t[0], t[1]], [PX, PY], [PX, 254], [300, 254]];
      C.flowDots(c, load, st.phase, { spacing: 16, r: 2.8, color: ORG, alpha: st.lit });
    }

    var g = c.createLinearGradient(52, 0, 66, 0);
    g.addColorStop(0, '#6b7681'); g.addColorStop(0.5, '#a7b1bb'); g.addColorStop(1, '#6b7681');
    c.fillStyle = g;
    c.fillRect(52, 138, 14, 80);
    c.fillStyle = CU;
    for (var i = 0; i < 6; i++) c.fillRect(40, 150 + 11 * i, 38, 5);
    if (st.cur > 0.04) {
      var gl = c.createRadialGradient(59, 134, 2, 59, 134, 36);
      gl.addColorStop(0, 'rgba(108,198,238,' + (0.5 * st.cur) + ')');
      gl.addColorStop(1, 'rgba(108,198,238,0)');
      c.fillStyle = gl;
      c.beginPath();
      c.arc(59, 134, 36, 0, Math.PI * 2);
      c.fill();
    }

    c.save();
    c.translate(PX, PY);
    c.rotate(a);
    var ag = c.createLinearGradient(0, -3, 0, 3);
    ag.addColorStop(0, '#c0c9d2'); ag.addColorStop(1, '#6f7b87');
    c.fillStyle = ag;
    c.fillRect(-110, -3, 175, 6);
    c.restore();
    c.fillStyle = '#e9f0f6';
    c.beginPath();
    c.arc(PX, PY, 4.5, 0, Math.PI * 2);
    c.fill();

    var ax = PX - 104 * Math.cos(a), ay = PY - 104 * Math.sin(a);
    var sx = 46, sy = 92, n = 9, pts = [[sx, sy]];
    for (var q = 1; q < n; q++) pts.push([sx + (q % 2 ? 5 : -5) + (ax - sx) * q / n, sy + (ay - sy) * q / n]);
    pts.push([ax, ay]);
    C.polyline(c, pts, '#c9d6e2', 1.6);
    c.fillStyle = BG;
    c.fillRect(38, 88, 16, 4);

    c.fillStyle = '#c9d6e2';
    c.fillRect(205, 96, 14, 12);
    c.fillStyle = BG;
    c.fillRect(210, 80, 4, 16);

    var lx = 300, ly = 135, lr = 17;
    if (st.lit > 0.02) {
      var lg = c.createRadialGradient(lx, ly, 2, lx, ly, 46);
      lg.addColorStop(0, 'rgba(255,220,120,' + (0.85 * st.lit) + ')');
      lg.addColorStop(1, 'rgba(255,220,120,0)');
      c.fillStyle = lg;
      c.beginPath();
      c.arc(lx, ly, 46, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = st.lit > 0.5 ? 'rgba(255,214,102,.95)' : 'rgba(15,22,30,.9)';
    c.strokeStyle = '#e9f0f6';
    c.lineWidth = 2.2;
    c.beginPath();
    c.arc(lx, ly, lr, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = st.lit > 0.5 ? '#7a5a00' : '#e9f0f6';
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(lx - 12, ly - 12); c.lineTo(lx + 12, ly + 12);
    c.moveTo(lx + 12, ly - 12); c.lineTo(lx - 12, ly + 12);
    c.stroke();

    battery(c, 59, 254, false);
    battery(c, 300, 207, true);

    var ang = (1 - st.sw) * -0.55;
    c.save();
    c.translate(22, 228);
    c.rotate(ang);
    c.strokeStyle = '#e9f0f6';
    c.lineWidth = 3;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -27);
    c.stroke();
    c.restore();
    c.fillStyle = '#e9f0f6';
    c.beginPath(); c.arc(22, 228, 3.4, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(22, 205, 3.4, 0, Math.PI * 2); c.fill();

    c.fillStyle = 'rgba(201,214,226,.88)';
    c.textBaseline = 'middle';
    c.textAlign = 'center';
    c.fillText(L.tr('kalem', 'coil'), 59, 233);
    c.fillText(L.tr('kontakt', 'contact'), 212, 66);
    c.textAlign = 'left';
    c.fillText(L.tr('kotva', 'armature'), 84, 104);
    c.fillText(L.tr('opruga', 'spring'), 58, 78);
    c.textAlign = 'right';
    c.fillText(L.tr('lampa', 'lamp'), 276, 135);
    c.textAlign = 'left';
    c.fillStyle = '#6cc6ee';
    c.fillText(L.tr('upravljačko kolo', 'control circuit'), 4, 278);
    c.textAlign = 'right';
    c.fillStyle = '#ffc78c';
    c.fillText(L.tr('radno kolo', 'load circuit'), 336, 278);
    c.restore();
  }

  var sc = C.scene(fig, draw, { touch: 'manipulation' });
  sc.cv.addEventListener('pointerdown', function (e) {
    var r = sc.cv.getBoundingClientRect();
    var k = Math.min(sc.w / LW, sc.h / LH);
    var x = (e.clientX - r.left - (sc.w - LW * k) / 2) / k, y = (e.clientY - r.top - (sc.h - LH * k) / 2) / k;
    if (x < 52 && y > 184 && y < 240) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); }
  });
  sc.cv.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); }
  });

  function read() {
    var on = cb.checked;
    document.getElementById('r-calc').textContent = L.tr('Upravljačko kolo: 5 V, ', 'Control circuit: 5 V, ') + (on ? '0,1 A' : '0 A') + ' · ' + L.tr('radno kolo: 12 V, ', 'load circuit: 12 V, ') + (on ? '1 A' : '0 A');
    document.getElementById('r-result').innerHTML = on
      ? L.tr('Kotva je privučena, lampa svetli', 'Armature pulled in, lamp is on')
      : L.tr('Opruga drži kotvu, lampa ne svetli', 'Spring holds the armature, lamp is off');
  }
  cb.addEventListener('change', read);
  read();
  L.onLang(read);
})();

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-coil',
    opt: { dist: 9.4, theta: 0.42, phi: 1.22, ty: 0.15 },
    build: function (st) {
      var S = st.scene, Lh = 1.5, R = 0.62, motion = V3.motion;
      var core = new T.Mesh(new T.CylinderGeometry(0.46, 0.46, 3.5, 36), std(Cc.iron, { metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0.62, depthWrite: false }));
      core.rotation.z = Math.PI / 2; S.add(core);
      var coilMesh = null, curFlow = null;
      var cu = std(Cc.copper, { metalness: 0.55, roughness: 0.35 });
      function buildHelix() {
        if (coilMesh) { S.remove(coilMesh); coilMesh.geometry.dispose(); S.remove(curFlow.group); curFlow.dispose(); }
        var turns = Math.max(5, Math.min(24, Math.round(coil.N / 25)));
        var pts = [], M = turns * 28;
        for (var i = 0; i <= M; i++) {
          var t = i / M, th = Math.PI * 2 * turns * t;
          pts.push(new T.Vector3(-Lh + 2 * Lh * t, R * Math.cos(th), R * Math.sin(th)));
        }
        var curve = new T.CatmullRomCurve3(pts);
        coilMesh = new T.Mesh(new T.TubeGeometry(curve, turns * 48, 0.045, 8, false), cu);
        S.add(coilMesh);
        curFlow = V3.makeFlow([curve.getSpacedPoints(turns * 60)], { color: Cc.current, spacing: 0.3, size: 0.14, noLine: true });
        S.add(curFlow.group);
      }
      buildHelix();
      function loopPts(rin, Hh) {
        var A = Lh + 0.4, e = 0.3 + 0.28 * Hh;
        var key = [[-A, rin], [-A / 2, rin], [0, rin], [A / 2, rin], [A, rin],
          [A + e * 0.75, rin + Hh * 0.28], [A + e, rin + Hh * 0.7], [A * 0.55, rin + Hh], [0, rin + Hh * 1.04],
          [-A * 0.55, rin + Hh], [-A - e, rin + Hh * 0.7], [-A - e * 0.75, rin + Hh * 0.28]];
        return key.map(function (k) { return new T.Vector2(k[0], k[1]); });
      }
      var paths = [];
      var shapes = [[0.36, 1.0], [0.22, 1.55], [0.09, 2.15]];
      for (var a = 0; a < 6; a++) {
        var phi = a / 6 * Math.PI * 2 + Math.PI / 12;
        shapes.forEach(function (sh) {
          var key = loopPts(sh[0], sh[1]).map(function (p) { return new T.Vector3(p.x, p.y * Math.cos(phi), p.y * Math.sin(phi)); });
          var curve = new T.CatmullRomCurve3(key, true, 'centripetal');
          paths.push(curve.getSpacedPoints(110).slice(0, 110));
        });
      }
      var field = V3.makeFlow(paths, { color: Cc.field, closed: true, spacing: 0.5, size: 0.1, lineOpacity: 0.55 });
      S.add(field.group);
      var lN = V3.poleLabel('N'), lS = V3.poleLabel('S');
      S.add(lN, lS);
      st.updaters.push(function (dt) {
        if (coil.rebuild) { coil.rebuild = false; buildHelix(); }
        core.visible = coil.core;
        var s = coil.sign;
        curFlow.update(dt, s * (0.3 + coil.I * 0.9) * motion);
        curFlow.setStrength(coil.I > 0 ? 1 : 0);
        var B = coilB(coil.core);
        var str = B > 0 ? Math.max(0.12, Math.min(1, Math.log10(B / 2e-4) / Math.log10(1.6 / 2e-4))) : 0;
        field.setStrength(str);
        field.update(dt, s * (0.25 + 1.4 * str) * motion);
        lN.visible = lS.visible = coil.I > 0;
        lN.position.set(s * 2.05, 0, 0);
        lS.position.set(-s * 2.05, 0, 0);
      });
    }
  }]);
}
})();
