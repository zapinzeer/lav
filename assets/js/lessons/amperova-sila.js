(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var rod = { B: 0.5, I: 5, sign: 1, l: 0.2, m: 0.05, reset: true };

function readRod() {
  var F = rod.B * rod.I * rod.l, a = F / rod.m;
  document.getElementById('r-calc').textContent = 'F = B·I·l = ' + L.fmtNum(rod.B, 1) + ' T · ' + rod.I + ' A · ' + L.fmtNum(rod.l, 2) + ' m';
  document.getElementById('r-result').innerHTML = 'F = ' + C.sig(F, 2) + ' N <small>· a = F/m = ' + C.sig(a, 2) + ' m/s²</small>';
}
L.range('r-b', { obj: rod, key: 'B', fmt: function (v) { return L.fmtNum(v, 1) + ' T'; }, on: function () { rod.reset = true; readRod(); } });
L.range('r-i', { obj: rod, key: 'I', fmt: function (v) { return v + ' A'; }, on: function () { rod.reset = true; readRod(); } });
document.getElementById('r-flip').addEventListener('click', function () { rod.sign *= -1; rod.reset = true; readRod(); });

(function angle() {
  var fig = document.getElementById('lab-ang');
  var s = { a: 30, B: 0.5, I: 5, l: 20 };
  var plot = new C.Plot(fig.querySelector('canvas'), {
    x: [0, 180], y: [0, 1], xt: 6, yt: 5, xl: 'α (°)', yl: 'F (N)',
    xf: function (v) { return L.fmtNum(v, 0) + '°'; },
    pad: { l: 46, r: 14, t: 18, b: 34 }, onResize: draw
  });
  function Fmax() { return s.B * s.I * s.l / 100; }
  function F(a) { return Fmax() * Math.sin(a * Math.PI / 180); }
  function draw() {
    var ax = C.niceAxis(Fmax() * 1.08);
    plot.y = [0, ax.max];
    plot.yt = ax.ticks;
    plot.yf = function (v) { return C.sig(v, 2); };
    if (!plot.begin()) return;
    plot.fillBetween(F, 'rgba(255,180,104,.14)');
    plot.hline(Fmax(), 'rgba(245,200,76,.5)', 1.1, [2, 4]);
    plot.text('F = B·I·l', 175, Fmax(), 'rgba(245,200,76,.95)', 'right', 0, -10);
    plot.line(F, C.COL.b, 2.6);
    plot.vline(s.a, 'rgba(255,255,255,.3)', 1.2, [4, 4]);
    plot.dot(s.a, F(s.a), C.COL.f, 5.5);
  }
  function read() {
    var f = F(s.a);
    document.getElementById('g-calc').textContent = 'F = B·I·l·sin α = ' + L.fmtNum(s.B, 1) + ' T · ' + s.I + ' A · ' + L.fmtNum(s.l / 100, 2) + ' m · sin ' + s.a + '°';
    document.getElementById('g-result').innerHTML = 'F = ' + (f < 1e-9 ? '0' : C.sig(f, 3)) + ' N' + (f < 1e-9 ? ' <small>(' + L.tr('provodnik je paralelan sa poljem', 'the wire is parallel to the field') + ')</small>' : '');
    draw();
  }
  L.range('g-a', { obj: s, key: 'a', fmt: function (v) { return v + '°'; }, on: read });
  L.range('g-b', { obj: s, key: 'B', fmt: function (v) { return L.fmtNum(v, 1) + ' T'; }, on: read });
  L.range('g-i', { obj: s, key: 'I', fmt: function (v) { return v + ' A'; }, on: read });
  L.range('g-l', { obj: s, key: 'l', fmt: function (v) { return v + ' cm'; }, on: read });
  L.onLang(read);
})();

(function parallel() {
  var fig = document.getElementById('lab-par');
  var st = { I1: 10, I2: 10, d: 5 };
  var VW = 8;

  function draw(c, s) {
    var S = s.w / (2 * VW), OX = s.w / 2, OY = s.h / 2;
    var x1 = OX - st.d / 2 * S, x2 = OX + st.d / 2 * S;
    var d = st.d;
    c.lineWidth = 1.3;
    [0, 1].forEach(function (j) {
      var I = j ? st.I2 : st.I1, cx = j ? x2 : x1;
      if (!I) return;
      [1.3, 2.3, 3.5].forEach(function (r) {
        c.strokeStyle = 'rgba(108,198,238,.3)';
        c.fillStyle = 'rgba(108,198,238,.7)';
        c.beginPath();
        c.arc(cx, OY, r * S, 0, Math.PI * 2);
        c.stroke();
        var dirx = I > 0 ? -1 : 1;
        c.beginPath();
        c.moveTo(cx + dirx * 6, OY - r * S);
        c.lineTo(cx - dirx * 3, OY - r * S - 5);
        c.lineTo(cx - dirx * 3, OY - r * S + 5);
        c.closePath();
        c.fill();
      });
    });

    var b2 = 20 * st.I1 / d, b1 = -20 * st.I2 / d;
    var F2 = -2e-5 * st.I1 * st.I2 / d * 1e3;
    var F1 = -F2;
    function farrow(cx, f) {
      if (!f) return;
      var len = Math.min(110, 45 * Math.sqrt(Math.abs(f)));
      len = Math.max(len, 8);
      C.arrow(c, cx + Math.sign(f) * 18, OY, cx + Math.sign(f) * (18 + len), OY, '#f5c84c', 3.4, 11);
    }
    function bAt(cx, b) {
      if (!b) return;
      var len = Math.min(70, Math.abs(b) * 0.55);
      var y0 = OY - 18 * Math.sign(b), y1 = y0 - Math.sign(b) * len;
      C.arrow(c, cx, y0, cx, y1, '#6cc6ee', 2.4, 8);
      C.mathLabel(c, 'B' + (cx === x2 ? '₁' : '₂'), cx + 14, y1 + (b > 0 ? 6 : -6), '#8fd6f6', 'left', 16);
    }
    bAt(x2, b2);
    bAt(x1, b1);
    farrow(x1, F1);
    farrow(x2, F2);

    C.wireDot(c, x1, OY, 13, st.I1 > 0 ? 1 : st.I1 < 0 ? -1 : 0);
    C.wireDot(c, x2, OY, 13, st.I2 > 0 ? 1 : st.I2 < 0 ? -1 : 0);
    C.mathLabel(c, 'I₁', x1, OY + 52 + 14, '#ffc78c', 'center', 16);
    C.mathLabel(c, 'I₂', x2, OY + 52 + 14, '#ffc78c', 'center', 16);
    C.arrow(c, x1 + 20, OY - 78, x2 - 20, OY - 78, 'rgba(201,214,226,.7)', 1.4, 7);
    C.arrow(c, x2 - 20, OY - 78, x1 + 20, OY - 78, 'rgba(201,214,226,.7)', 1.4, 7);
    C.mathLabel(c, 'd', OX, OY - 92, '#c9d6e2', 'center', 16);
  }

  var sc = C.scene(fig, draw);

  function read() {
    var d = st.d / 100;
    var f = 2e-7 * st.I1 * st.I2 / d;
    document.getElementById('p-calc').textContent = 'F/l = μ₀·I₁·I₂ / (2π·d) = 2·10⁻⁷ · ' + st.I1 + ' A · ' + st.I2 + ' A / ' + L.fmtNum(d, 3) + ' m';
    var verdict = !f ? L.tr('nema sile', 'no force') : f > 0 ? L.tr('privlače se', 'they attract') : L.tr('odbijaju se', 'they repel');
    document.getElementById('p-result').innerHTML = 'F/l = ' + C.sig(Math.abs(f) * 1e3, 3) + ' mN/m <small>· ' + verdict + '</small>';
  }
  function fmtI(v) { return (v < 0 ? '−' : '') + Math.abs(v) + ' A ' + (v > 0 ? '⊙' : v < 0 ? '⊗' : ''); }
  L.range('p-i1', { obj: st, key: 'I1', fmt: fmtI, on: read });
  L.range('p-i2', { obj: st, key: 'I2', fmt: fmtI, on: read });
  L.range('p-d', { obj: st, key: 'd', fmt: function (v) { return L.fmtNum(v, v % 1 ? 1 : 0) + ' cm'; }, on: read });
  L.onLang(read);
})();

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-rod',
    opt: { dist: 10.6, theta: 0.7, phi: 1.12, ty: 0.3 },
    build: function (st) {
      var S = st.scene, motion = V3.motion;
      var table = new T.Mesh(new T.BoxGeometry(4.6, 0.1, 6.4), std(Cc.table, { transparent: true, opacity: 0.9, roughness: 0.8 }));
      table.position.y = -0.1; S.add(table);
      var railM = std(0x9aa5b1, { metalness: 0.6, roughness: 0.35 });
      [-1, 1].forEach(function (x) {
        var r = new T.Mesh(new T.BoxGeometry(0.14, 0.14, 5.8), railM);
        r.position.set(x, 0.07, 0.1); S.add(r);
      });
      var batt = new T.Mesh(new T.BoxGeometry(2.3, 0.4, 0.5), std(0xc8921a, { metalness: 0.2, roughness: 0.5 }));
      batt.position.set(0, 0.12, -3.1); S.add(batt);
      var sM = std(Cc.south, { transparent: true, opacity: 0.4, depthWrite: false }), nM = std(Cc.north, { transparent: true, opacity: 0.4, depthWrite: false });
      var sTop = new T.Mesh(new T.BoxGeometry(3.4, 0.4, 4.2), sM); sTop.position.set(0, 2.2, 0); S.add(sTop);
      var nBot = new T.Mesh(new T.BoxGeometry(3.4, 0.4, 4.2), nM); nBot.position.set(0, -0.7, 0); S.add(nBot);
      var lS = V3.poleLabel('S'); lS.position.set(0, 2.2, 2.4); S.add(lS);
      var lN = V3.poleLabel('N'); lN.position.set(0, -0.7, 2.4); S.add(lN);
      var paths = [];
      [-0.8, 0, 0.8].forEach(function (x) { [-1.4, -0.5, 0.5, 1.4].forEach(function (z) { paths.push([new T.Vector3(x, -0.5, z), new T.Vector3(x, 2.0, z)]); }); });
      var field = V3.makeFlow(paths, { color: Cc.field, spacing: 0.6, size: 0.11, lineOpacity: 0.3 });
      S.add(field.group);
      var lb = V3.makeLabel('B', { color: '#8fd6f6', size: 0.5 }); lb.position.set(-1.8, 1.3, -1.6); S.add(lb);

      var bar = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 2.3, 24), std(Cc.copper, { metalness: 0.55, roughness: 0.35 }));
      bar.rotation.z = Math.PI / 2;
      var barG = new T.Group(); barG.add(bar); barG.position.y = 0.24; S.add(barG);
      var tip = new T.Mesh(new T.ConeGeometry(0.11, 0.26, 18), std(Cc.current, { emissive: Cc.current, emissiveIntensity: 0.4 }));
      barG.add(tip);
      var li = V3.makeLabel('I', { color: '#ffc78c', size: 0.45 }); barG.add(li);
      var arrow = V3.makeArrow(Cc.force, 0.06); S.add(arrow);
      var lf = V3.makeLabel('F', { color: '#f8d77a', size: 0.5 }); S.add(lf);

      var N = 44, pos = new Float32Array(N * 3);
      var geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      var dots = new T.Points(geo, new T.PointsMaterial({ color: Cc.current, size: 0.2, map: V3.DOT, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
      dots.frustumCulled = false; S.add(dots);

      var z = 0, tau = 0, hold = 0, phase = 0, END = 2.3, SRC = -2.8, Y = 0.24;
      function loopPoint(u, zr) {
        var a = zr - SRC, tot = 2 * a + 4, s = u * tot;
        if (s < a) return [-1, Y, SRC + s];
        s -= a;
        if (s < 2) return [-1 + s, Y, zr];
        s -= 2;
        if (s < a) return [1, Y, zr - s];
        s -= a;
        return [1 - s, Y, SRC];
      }
      st.updaters.push(function (dt) {
        var F = rod.B * rod.I * rod.l, acc = F / rod.m * 10;
        if (rod.reset) { rod.reset = false; z = 0; tau = 0; hold = 0; }
        if (hold > 0) { hold -= dt; if (hold <= 0) { z = 0; tau = 0; } }
        else if (acc > 0) {
          tau += dt * 0.2 * (V3.reduce ? 0.5 : 1);
          z = 0.5 * acc * tau * tau * rod.sign;
          if (Math.abs(z) >= END) { z = END * rod.sign; hold = 0.8; }
        }
        barG.position.z = z;
        tip.position.set(rod.sign * 1.28, 0, 0);
        tip.rotation.z = -rod.sign * Math.PI / 2;
        li.position.set(rod.sign * 1.45, 0.3, 0);
        arrow.position.set(0, 0.24, z);
        var len = F > 0 ? Math.max(0.35, 1.1 * F) : 0;
        arrow.set(new T.Vector3(0, 0, rod.sign), len);
        lf.visible = len >= 0.02;
        lf.position.set(0, 0.62, z + rod.sign * (len + 0.3));
        field.update(dt, 0.5 * motion);
        dots.visible = rod.I > 0;
        phase += dt * (0.05 + rod.I * 0.025) * motion;
        for (var i = 0; i < N; i++) {
          var u = (rod.sign > 0 ? 1 : -1) * (phase + i / N);
          u = u - Math.floor(u);
          var p = loopPoint(u, z);
          pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2];
        }
        geo.attributes.position.needsUpdate = true;
      });
    }
  }]);
}
})();
