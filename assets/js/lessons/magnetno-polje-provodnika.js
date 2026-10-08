(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var MU0 = 4 * Math.PI * 1e-7;
var wire = { I: 10, r: 2, sign: 1 };

function readWire() {
  var r = wire.r / 100;
  var B = MU0 * wire.I / (2 * Math.PI * r);
  document.getElementById('w-calc').textContent = 'B = μ₀·I / (2π·r) = 4π·10⁻⁷ · ' + wire.I + ' A / (2π · ' + L.fmtNum(r, 3) + ' m)';
  var cmp = B > 0 ? ' <small>≈ ' + C.sig(B / 5e-5, 2) + ' × ' + L.tr('polje Zemlje', "Earth's field") + '</small>' : '';
  document.getElementById('w-result').innerHTML = 'B = ' + C.fmtB(B) + cmp;
}
L.range('w-current', { obj: wire, key: 'I', fmt: function (v) { return v + ' A'; }, on: readWire });
L.range('w-r', { obj: wire, key: 'r', fmt: function (v) { return L.fmtNum(v, v % 1 ? 1 : 0) + ' cm'; }, on: readWire });
document.getElementById('w-flip').addEventListener('click', function () { wire.sign *= -1; readWire(); });

(function plotBr() {
  var fig = document.getElementById('lab-br');
  var s = { I: 10, r: 2 };
  var plot = new C.Plot(fig.querySelector('canvas'), {
    x: [0, 10], y: [0, 400], xt: 5, yt: 4, xl: 'r (cm)', yl: 'B (μT)',
    xf: function (v) { return L.fmtNum(v, 0); }, yf: function (v) { return L.fmtNum(v, 0); },
    pad: { l: 42, r: 14, t: 18, b: 34 }, onResize: draw
  });
  function B(r) { return 20 * s.I / r; }
  function draw() {
    if (!plot.begin()) return;
    plot.hline(50, 'rgba(201,214,226,.55)', 1.2, [2, 4]);
    plot.text(L.tr('polje Zemlje', "Earth's field"), 9.9, 50, 'rgba(201,214,226,.8)', 'right', 0, -9);
    plot.fillBetween(function (x) { return B(Math.max(x, 0.2)); }, 'rgba(108,198,238,.14)');
    plot.line(function (x) { return B(Math.max(x, 0.2)); }, C.COL.a, 2.4);
    var r2 = s.r * 2;
    plot.vline(s.r, 'rgba(255,180,104,.55)', 1.2, [4, 4]);
    plot.hline(B(s.r), 'rgba(255,180,104,.55)', 1.2, [4, 4]);
    if (r2 <= 10) {
      plot.vline(r2, 'rgba(108,198,238,.55)', 1.2, [4, 4]);
      plot.hline(B(r2), 'rgba(108,198,238,.55)', 1.2, [4, 4]);
      plot.dot(r2, B(r2), C.COL.a, 5);
    }
    plot.dot(s.r, B(s.r), C.COL.b, 5.5);
  }
  function read() {
    var b1 = B(s.r) * 1e-6, r2 = s.r * 2;
    document.getElementById('b-calc').textContent = 'B(r) = μ₀·I / (2π·r) · I = ' + s.I + ' A';
    var txt = 'r = ' + L.fmtNum(s.r, s.r % 1 ? 1 : 0) + ' cm → ' + C.fmtB(b1);
    if (r2 <= 10) txt += ' <small>· 2r = ' + L.fmtNum(r2, r2 % 1 ? 1 : 0) + ' cm → ' + C.fmtB(b1 / 2) + '</small>';
    document.getElementById('b-result').innerHTML = txt;
    draw();
  }
  L.range('b-i', { obj: s, key: 'I', fmt: function (v) { return v + ' A'; }, on: read });
  L.range('b-r', { obj: s, key: 'r', fmt: function (v) { return L.fmtNum(v, v % 1 ? 1 : 0) + ' cm'; }, on: read });
  L.onLang(read);
})();

(function twoWires() {
  var fig = document.getElementById('lab-two');
  var D = 5, VW = 12, REF = 100;
  var st = { I1: 10, I2: 10, px: 0, py: 6 };
  var wires = [{ x: -D, y: 0 }, { x: D, y: 0 }];
  var lines = [];
  var S = 1, OX = 0, OY = 0;
  function X(x) { return OX + x * S; }
  function Y(y) { return OY - y * S; }
  function cur(i) { return i ? st.I2 : st.I1; }

  function parts(x, y) {
    var out = [];
    for (var i = 0; i < 2; i++) {
      var dx = x - wires[i].x, dy = y - wires[i].y, r2 = dx * dx + dy * dy + 1e-6, k = 20 * cur(i) / r2;
      out.push([-dy * k, dx * k]);
    }
    return out;
  }
  function total(x, y) {
    var p = parts(x, y);
    return [p[0][0] + p[1][0], p[0][1] + p[1][1]];
  }

  function trace(x0, y0, sign, seen) {
    var pts = [], x = x0, y = y0, h = 0.14, closed = false;
    for (var i = 0; i < 1100; i++) {
      var f = total(x, y), m = Math.hypot(f[0], f[1]);
      if (m < 1e-9) break;
      var mx = x + f[0] / m * h * sign / 2, my = y + f[1] / m * h * sign / 2;
      var f2 = total(mx, my), m2 = Math.hypot(f2[0], f2[1]);
      if (m2 < 1e-9) break;
      x += f2[0] / m2 * h * sign;
      y += f2[1] / m2 * h * sign;
      pts.push([x, y]);
      if (i > 30 && Math.hypot(x - x0, y - y0) < h * 1.2) { closed = true; break; }
      if (Math.abs(x) > VW + 1 || Math.abs(y) > 10.5) break;
      if (Math.hypot(x - wires[0].x, y) < 0.6 || Math.hypot(x - wires[1].x, y) < 0.6) break;
    }
    return { pts: pts, closed: closed };
  }

  function build() {
    lines = [];
    var seen = {};
    function key(x, y) { return Math.round(x / 0.4) + ',' + Math.round(y / 0.4); }
    var seeds = [];
    [0, 1].forEach(function (j) {
      if (!cur(j)) return;
      [1.4, 2.5, 3.7, 5.2].forEach(function (o) {
        seeds.push([wires[j].x + o, 0]);
        seeds.push([wires[j].x - o, 0]);
        seeds.push([wires[j].x, o]);
        seeds.push([wires[j].x, -o]);
      });
    });
    [7.5, 9.5, 11.5].forEach(function (o) { seeds.push([o, 0], [-o, 0]); });
    [3, 5, 7, 9].forEach(function (o) { seeds.push([0, o], [0, -o]); });
    seeds.forEach(function (sd) {
      var k = key(sd[0], sd[1]);
      if (seen[k]) return;
      var fw = trace(sd[0], sd[1], 1);
      var bw = fw.closed ? { pts: [] } : trace(sd[0], sd[1], -1);
      var path = bw.pts.slice().reverse().concat([[sd[0], sd[1]]], fw.pts);
      if (path.length < 8) return;
      path.forEach(function (p) { seen[key(p[0], p[1])] = 1; });
      lines.push(path);
    });
  }

  function resize(s) {
    S = s.w / (2 * VW);
    OX = s.w / 2;
    OY = s.h / 2;
  }

  function arrowHead(c, x, y, ux, uy) {
    var sz = 5.5;
    c.beginPath();
    c.moveTo(x + ux * sz, y + uy * sz);
    c.lineTo(x - ux * sz * 0.7 - uy * sz * 0.6, y - uy * sz * 0.7 + ux * sz * 0.6);
    c.lineTo(x - ux * sz * 0.7 + uy * sz * 0.6, y - uy * sz * 0.7 - ux * sz * 0.6);
    c.closePath();
    c.fill();
  }

  var info = { n: 0 };
  var dirty = true;

  function draw(c, s, dt, t) {
    resize(s);
    if (dirty) { build(); dirty = false; }
    c.lineWidth = 1.6;
    c.strokeStyle = 'rgba(108,198,238,.7)';
    c.fillStyle = 'rgba(108,198,238,.95)';
    c.lineJoin = 'round';
    var flow = L.reduce ? 0 : -t * 22;
    lines.forEach(function (path) {
      c.setLineDash([7, 7]);
      c.lineDashOffset = flow;
      c.beginPath();
      for (var i = 0; i < path.length; i++) {
        if (i) c.lineTo(X(path[i][0]), Y(path[i][1])); else c.moveTo(X(path[i][0]), Y(path[i][1]));
      }
      c.stroke();
      c.setLineDash([]);
      var acc = 0, next = 30;
      for (var j = 1; j < path.length; j++) {
        var dx = X(path[j][0]) - X(path[j - 1][0]), dy = Y(path[j][1]) - Y(path[j - 1][1]), dl = Math.hypot(dx, dy);
        acc += dl;
        if (acc > next && dl > 0) { next += 90; arrowHead(c, X(path[j][0]), Y(path[j][1]), dx / dl, dy / dl); }
      }
    });
    c.setLineDash([]);
    c.lineDashOffset = 0;

    for (var w = 0; w < 2; w++) {
      var I = cur(w), dir = I > 0 ? 1 : I < 0 ? -1 : 0;
      C.wireDot(c, X(wires[w].x), Y(0), 13, dir);
      C.mathLabel(c, 'I' + (w ? '₂' : '₁'), X(wires[w].x), Y(0) + 30, '#ffc78c', 'center', 17);
    }

    var P = parts(st.px, st.py), N = [P[0][0] + P[1][0], P[0][1] + P[1][1]];
    var m1 = Math.hypot(P[0][0], P[0][1]), m2 = Math.hypot(P[1][0], P[1][1]), mt = Math.hypot(N[0], N[1]);
    var k = 1.8, big = Math.max(m1, m2, mt);
    if (big * k > 150) k = 150 / big;
    var px = X(st.px), py = Y(st.py);
    function vec(v) { return [px + v[0] * k, py - v[1] * k]; }
    var e1 = vec(P[0]), e2 = vec(P[1]), en = vec(N);
    if (m1 > 0 && m2 > 0) {
      c.save();
      c.setLineDash([4, 4]);
      c.lineWidth = 1.2;
      c.strokeStyle = 'rgba(201,214,226,.5)';
      c.beginPath();
      c.moveTo(e1[0], e1[1]); c.lineTo(en[0], en[1]);
      c.moveTo(e2[0], e2[1]); c.lineTo(en[0], en[1]);
      c.stroke();
      c.restore();
    }
    C.arrow(c, px, py, e1[0], e1[1], '#ffb468', 2.4, 9);
    C.arrow(c, px, py, e2[0], e2[1], '#b39bf2', 2.4, 9);
    C.arrow(c, px, py, en[0], en[1], '#eef3f7', 3.2, 11);
    c.fillStyle = '#0c131b';
    c.strokeStyle = '#eef3f7';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(px, py, 5, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    C.mathLabel(c, 'P', px - 13, py + 13, '#eef3f7', 'center', 17);

    var calc = 'B₁ = ' + C.fmtB(m1 * 1e-6) + ' · B₂ = ' + C.fmtB(m2 * 1e-6);
    var res = 'B = ' + (mt < 0.05 && (m1 > 0 || m2 > 0) ? '0 T <small>' + L.tr('(polja se poništavaju)', '(the fields cancel)') + '</small>' : C.fmtB(mt * 1e-6));
    var ce = document.getElementById('t-calc'), re = document.getElementById('t-result');
    if (ce.__t !== calc) { ce.textContent = calc; ce.__t = calc; }
    if (re.__t !== res) { re.innerHTML = res; re.__t = res; }
  }

  var sc = C.scene(fig, draw, { touch: 'none' });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function setP(x, y) {
    var ux = (x - OX) / S, uy = (OY - y) / S;
    ux = clamp(ux, -VW + 0.5, VW - 0.5);
    uy = clamp(uy, -(sc.h / 2 / S) + 0.5, sc.h / 2 / S - 0.5);
    for (var i = 0; i < 2; i++) {
      var dx = ux - wires[i].x, dy = uy - wires[i].y, d = Math.hypot(dx, dy);
      if (d < 0.9) { ux = wires[i].x + dx / (d || 1) * 0.9; uy = wires[i].y + dy / (d || 1) * 0.9; }
    }
    st.px = ux;
    st.py = uy;
  }
  C.drag(sc.cv, { move: setP });
  sc.cv.addEventListener('keydown', function (e) {
    var d = 0.4, used = true;
    if (e.key === 'ArrowLeft') st.px -= d; else if (e.key === 'ArrowRight') st.px += d;
    else if (e.key === 'ArrowUp') st.py += d; else if (e.key === 'ArrowDown') st.py -= d; else used = false;
    if (used) e.preventDefault();
  });

  function fmtI(v) { return (v < 0 ? '−' : '') + Math.abs(v) + ' A ' + (v > 0 ? '⊙' : v < 0 ? '⊗' : ''); }
  var o1 = { obj: st, key: 'I1', fmt: fmtI, on: function () { dirty = true; } };
  var o2 = { obj: st, key: 'I2', fmt: fmtI, on: function () { dirty = true; } };
  var s1 = L.range('t-i1', o1), s2 = L.range('t-i2', o2);
  function preset(v) {
    var a = 10, b = v === 'same' ? 10 : v === 'opp' ? -10 : 0;
    s1.value = a;
    s2.value = b;
    s1.dispatchEvent(new Event('input'));
    s2.dispatchEvent(new Event('input'));
  }
  C.toggle(document.getElementById('t-pre'), preset);
  function sync() {
    var v = st.I2 === 0 ? 'one' : st.I1 === st.I2 ? 'same' : st.I1 === -st.I2 ? 'opp' : '';
    document.querySelectorAll('#t-pre button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false'); });
  }
  s1.addEventListener('input', sync);
  s2.addEventListener('input', sync);
})();

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-wire',
    opt: { dist: 8.8, theta: 0.45, phi: 1.08, ty: 0.05 },
    build: function (st) {
      var S = st.scene, TABLE_Y = -0.62, UNIT = 0.02, motion = V3.motion, reduce = V3.reduce;
      var wm = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 4.6, 24), std(Cc.copper, { metalness: 0.55, roughness: 0.35 }));
      S.add(wm);
      var table = new T.Mesh(new T.CylinderGeometry(2.6, 2.6, 0.05, 72), std(Cc.table, { transparent: true, opacity: 0.88, roughness: 0.8 }));
      table.position.y = TABLE_Y - 0.03; S.add(table);
      var cur = V3.makeFlow([[new T.Vector3(0, -2.3, 0), new T.Vector3(0, 2.3, 0)]], { color: Cc.current, spacing: 0.34, size: 0.2, noLine: true });
      S.add(cur.group);
      var iArrow = V3.makeArrow(Cc.current, 0.03); iArrow.position.set(0.28, 1.35, 0); S.add(iArrow);
      var li = V3.makeLabel('I', { color: '#ffc78c', size: 0.42 }); S.add(li);
      var RADII = [0.45, 0.8, 1.25, 1.8], HEIGHTS = [0.25, 1.35];
      var rings = RADII.map(function (R) {
        var paths = HEIGHTS.map(function (y) {
          var pts = [];
          for (var i = 0; i < 72; i++) { var t = i / 72 * Math.PI * 2; pts.push(new T.Vector3(R * Math.cos(t), y, -R * Math.sin(t))); }
          return pts;
        });
        var f = V3.makeFlow(paths, { color: Cc.field, closed: true, spacing: 0.42, size: 0.1, lineOpacity: 0.6 });
        S.add(f.group);
        return { R: R, f: f };
      });
      var needles = [];
      var redM = std(0xe0483c, { emissive: 0x5a120d, emissiveIntensity: 0.4 }), whiteM = std(0xdfe6ec);
      var baseM = std(0x2b3846, { roughness: 0.7 }), baseG = new T.CylinderGeometry(0.2, 0.2, 0.03, 28);
      var coneG = new T.ConeGeometry(0.045, 0.19, 12);
      [[1.1, 8], [1.95, 12]].forEach(function (ring) {
        for (var i = 0; i < ring[1]; i++) {
          var t = i / ring[1] * Math.PI * 2 + 0.2;
          var x = ring[0] * Math.cos(t), z = ring[0] * Math.sin(t);
          var base = new T.Mesh(baseG, baseM); base.position.set(x, TABLE_Y + 0.015, z); S.add(base);
          var g = new T.Group(); g.position.set(x, TABLE_Y + 0.08, z);
          var r = new T.Mesh(coneG, redM); r.rotation.z = -Math.PI / 2; r.position.x = 0.095;
          var w = new T.Mesh(coneG, whiteM); w.rotation.z = Math.PI / 2; w.position.x = -0.095;
          g.add(r, w); S.add(g);
          needles.push({ g: g, x: x, z: z, r: ring[0], ang: Math.atan2(1, 0) });
        }
      });
      var EARTH = 5e-5;
      var probe = new T.Mesh(new T.SphereGeometry(0.06, 16, 12), std(Cc.white, { emissive: 0xffffff, emissiveIntensity: 0.3 }));
      S.add(probe);
      var rLineGeo = new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3(1, 0, 0)]);
      var rLine = new T.Line(rLineGeo, new T.LineDashedMaterial({ color: 0xeef3f7, dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0.8 }));
      S.add(rLine);
      var lr = V3.makeLabel('r', { size: 0.4 }); S.add(lr);
      var bArrow = V3.makeArrow(0x9fe2ff, 0.035); S.add(bArrow);
      var lb = V3.makeLabel('B', { color: '#8fd6f6', size: 0.46 }); S.add(lb);
      var PY = HEIGHTS[0], PA = 0.75;
      st.updaters.push(function (dt) {
        var s = wire.sign, I = wire.I;
        cur.update(dt, s * (0.2 + I * 0.06) * motion);
        cur.setStrength(I > 0 ? 1 : 0);
        iArrow.set(new T.Vector3(0, s, 0), I > 0 ? 0.7 : 0);
        iArrow.position.y = s > 0 ? 1.3 : 2.0;
        li.visible = I > 0; li.position.set(0.55, 1.65, 0);
        rings.forEach(function (rg) {
          var str = I > 0 ? Math.min(1, Math.pow(I / 20, 0.45) * Math.pow(0.45 / rg.R, 0.55) * 1.25) : 0;
          rg.f.setStrength(str);
          rg.f.update(dt, s * (I * 0.05 / rg.R) * motion);
        });
        needles.forEach(function (n) {
          var Bw = 2e-7 * I / (n.r * UNIT);
          var bx = (n.z / n.r) * s * Bw, bz = (-n.x / n.r) * s * Bw - EARTH;
          var target = Math.atan2(-bz, bx);
          var diff = Math.atan2(Math.sin(target - n.ang), Math.cos(target - n.ang));
          n.ang += diff * Math.min(1, dt * (reduce ? 20 : 5));
          n.g.rotation.y = n.ang;
        });
        var rp = wire.r / 2;
        var px = rp * Math.cos(PA), pz = rp * Math.sin(PA);
        probe.position.set(px, PY, pz);
        var a = rLineGeo.attributes.position.array;
        a[0] = 0.08 * Math.cos(PA); a[1] = PY; a[2] = 0.08 * Math.sin(PA); a[3] = px; a[4] = PY; a[5] = pz;
        rLineGeo.attributes.position.needsUpdate = true; rLine.computeLineDistances();
        lr.position.set(px / 2, PY + 0.2, pz / 2);
        var B = MU0 * I / (2 * Math.PI * wire.r / 100);
        var dir = new T.Vector3(pz / rp * s, 0, -px / rp * s);
        var len = Math.min(1.9, B / 4e-4 * 1.6);
        bArrow.position.copy(probe.position);
        bArrow.set(dir, len);
        lb.visible = len >= 0.02;
        lb.position.copy(probe.position).add(dir.clone().multiplyScalar(len + 0.22)).add(new T.Vector3(0, 0.12, 0));
      });
    }
  }]);
}
})();
