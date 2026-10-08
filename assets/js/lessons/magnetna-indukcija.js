(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

(function dipole() {
  var fig = document.getElementById('lab-dipole');
  var cv = fig.querySelector('canvas');
  var ctx = cv.getContext('2d');
  var bg = document.createElement('canvas');
  var bctx = bg.getContext('2d');
  var poles = [{ x: -0.62, y: 0, q: 1 }, { x: 0.62, y: 0, q: -1 }];
  var st = { mode: 'lines', cx: 0.95, cy: 1.05, ang: 0, drag: false };
  var W = 0, H = 0, S = 1, OX = 0, OY = 0, dpr = 1, dirty = true;
  cv.style.touchAction = 'none';

  function sx(x) { return OX + x * S; }
  function sy(y) { return OY - y * S; }
  function field(x, y) {
    var bx = 0, by = 0;
    for (var i = 0; i < 2; i++) {
      var p = poles[i], dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 0.0025, k = p.q / (r2 * Math.sqrt(r2));
      bx += k * dx;
      by += k * dy;
    }
    return [bx, by];
  }
  function resize() {
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = bg.width = Math.round(w * dpr);
    cv.height = bg.height = Math.round(h * dpr);
    W = w;
    H = h;
    S = Math.min(w / 5.4, h / 4.2);
    OX = w / 2;
    OY = h / 2;
    dirty = true;
  }
  new ResizeObserver(resize).observe(cv);
  resize();

  function trace(sx0, sy0, sign) {
    var pts = [[sx0, sy0]], x = sx0, y = sy0, neg = poles[0].q < 0 ? poles[0] : poles[1];
    for (var i = 0; i < 1600; i++) {
      var f = field(x, y), m = Math.hypot(f[0], f[1]);
      if (!m) break;
      var h = 0.03 * sign;
      var mx = x + f[0] / m * h / 2, my = y + f[1] / m * h / 2;
      var f2 = field(mx, my), m2 = Math.hypot(f2[0], f2[1]);
      x += f2[0] / m2 * h;
      y += f2[1] / m2 * h;
      pts.push([x, y]);
      if (Math.hypot(x - neg.x, y - neg.y) < 0.08) break;
      if (Math.abs(x) > 3.4 || Math.abs(y) > 2.8) break;
    }
    return pts;
  }
  function arrow(c, x, y, ux, uy, size) {
    c.beginPath();
    c.moveTo(x + ux * size, y + uy * size);
    c.lineTo(x - ux * size * 0.7 - uy * size * 0.6, y - uy * size * 0.7 + ux * size * 0.6);
    c.lineTo(x - ux * size * 0.7 + uy * size * 0.6, y - uy * size * 0.7 - ux * size * 0.6);
    c.closePath();
    c.fill();
  }
  function drawBg() {
    var c = bctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    var pos = poles[0].q > 0 ? poles[0] : poles[1];
    if (st.mode === 'lines') {
      c.strokeStyle = 'rgba(108,198,238,.72)';
      c.fillStyle = 'rgba(108,198,238,.95)';
      c.lineWidth = 1.5;
      var N = 18;
      for (var k = 0; k < N; k++) {
        var th = (k + 0.5) / N * Math.PI * 2;
        var pts = trace(pos.x + 0.12 * Math.cos(th), pos.y + 0.12 * Math.sin(th), 1);
        c.beginPath();
        pts.forEach(function (p, i) { if (i) c.lineTo(sx(p[0]), sy(p[1])); else c.moveTo(sx(p[0]), sy(p[1])); });
        c.stroke();
        var acc = 0, next = 0.9;
        for (var i = 1; i < pts.length; i++) {
          acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          if (acc > next) {
            next += 1.7;
            var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], dl = Math.hypot(dx, dy) || 1;
            arrow(c, sx(pts[i][0]), sy(pts[i][1]), dx / dl, -dy / dl, 5.5);
          }
        }
      }
    } else {
      var rnd = mulberry32(7), n = Math.round(W * H / 52), ref = 0.2;
      c.strokeStyle = 'rgba(201,214,226,.7)';
      c.lineWidth = 1.15;
      c.lineCap = 'round';
      c.beginPath();
      for (var j = 0; j < n; j++) {
        var px = rnd() * W, py = rnd() * H, keep = rnd(), lr = rnd();
        var ux = (px - OX) / S, uy = (OY - py) / S;
        if (Math.abs(ux) < 1.0 && Math.abs(uy) < 0.2) continue;
        var f = field(ux, uy), m = Math.hypot(f[0], f[1]);
        if (!m) continue;
        var pr = Math.min(1, Math.pow(m / ref, 0.55));
        if (keep > pr) continue;
        var len = 3 + lr * 5, dx2 = f[0] / m * len / 2, dy2 = -f[1] / m * len / 2;
        c.moveTo(px - dx2, py - dy2);
        c.lineTo(px + dx2, py + dy2);
      }
      c.stroke();
    }
    var x0 = sx(-1), bw = S * 1, bh = S * 0.38, y0 = sy(0) - bh / 2, rad = 5;
    function half(xa, col, left, label) {
      c.beginPath();
      if (left) { c.moveTo(xa + bw, y0); c.lineTo(xa + rad, y0); c.arcTo(xa, y0, xa, y0 + rad, rad); c.lineTo(xa, y0 + bh - rad); c.arcTo(xa, y0 + bh, xa + rad, y0 + bh, rad); c.lineTo(xa + bw, y0 + bh); }
      else { c.moveTo(xa, y0); c.lineTo(xa + bw - rad, y0); c.arcTo(xa + bw, y0, xa + bw, y0 + rad, rad); c.lineTo(xa + bw, y0 + bh - rad); c.arcTo(xa + bw, y0 + bh, xa + bw - rad, y0 + bh, rad); c.lineTo(xa, y0 + bh); }
      c.closePath();
      c.fillStyle = col;
      c.fill();
      c.fillStyle = '#fff';
      c.font = '800 ' + Math.round(bh * 0.62) + 'px Archivo, system-ui, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(label, xa + bw / 2, y0 + bh / 2 + 1);
    }
    var leftN = poles[0].q > 0;
    half(x0, leftN ? '#c4362c' : '#2c5bbd', true, leftN ? 'N' : 'S');
    half(x0 + bw, leftN ? '#2c5bbd' : '#c4362c', false, leftN ? 'S' : 'N');
    dirty = false;
  }

  function draw(dt) {
    if (!W) return;
    if (dirty) drawBg();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var f = field(st.cx, st.cy), target = Math.atan2(-f[1], f[0]);
    var diff = Math.atan2(Math.sin(target - st.ang), Math.cos(target - st.ang));
    st.ang += diff * Math.min(1, dt * (L.reduce ? 30 : 9));
    var px = sx(st.cx), py = sy(st.cy), R = 25;
    ctx.fillStyle = 'rgba(238,243,247,.12)';
    ctx.strokeStyle = 'rgba(238,243,247,.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(st.ang);
    ctx.fillStyle = '#e0483c';
    ctx.beginPath();
    ctx.moveTo(R - 3, 0);
    ctx.lineTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#eef3f7';
    ctx.beginPath();
    ctx.moveTo(-(R - 3), 0);
    ctx.lineTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#141d26';
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    var m = Math.hypot(f[0], f[1]);
    var dEl = document.getElementById('dip-result');
    var txt = 'B ≈ ' + C.sig(m, 2) + ' ' + L.tr('(relativno)', '(relative)');
    if (dEl.__t !== txt) { dEl.textContent = txt; dEl.__t = txt; }
  }
  function setPos(e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left - OX) / S, y = (OY - (e.clientY - r.top)) / S;
    st.cx = Math.max(-2.5, Math.min(2.5, x));
    st.cy = Math.max(-1.9, Math.min(1.9, y));
  }
  cv.addEventListener('pointerdown', function (e) { st.drag = true; cv.setPointerCapture(e.pointerId); setPos(e); });
  cv.addEventListener('pointermove', function (e) { if (st.drag) setPos(e); });
  cv.addEventListener('pointerup', function () { st.drag = false; });
  cv.addEventListener('pointercancel', function () { st.drag = false; });
  cv.addEventListener('keydown', function (e) {
    var d = 0.12, used = true;
    if (e.key === 'ArrowLeft') st.cx -= d; else if (e.key === 'ArrowRight') st.cx += d;
    else if (e.key === 'ArrowUp') st.cy += d; else if (e.key === 'ArrowDown') st.cy -= d; else used = false;
    if (used) e.preventDefault();
  });
  C.toggle(document.getElementById('dip-mode'), function (v) { st.mode = v; dirty = true; });
  document.getElementById('dip-flip').addEventListener('click', function () {
    poles[0].q *= -1;
    poles[1].q *= -1;
    dirty = true;
  });
  document.getElementById('dip-calc').textContent = '';
  function note() { document.getElementById('dip-calc').textContent = L.tr('Igla se uvek poravna sa linijom polja u svojoj tački.', 'The needle always lines up with the field line at its position.'); }
  note();
  L.onLang(note);
  L.loop(fig, draw);
})();

var force = { angle: 90, I: 4, sign: 1, B: 0.4, l: 0.25 };
function readForce() {
  var a = force.angle * Math.PI / 180;
  var F = force.B * force.I * force.l * Math.sin(a);
  document.getElementById('f-calc').textContent = 'F = B·I·l·sin α = ' + L.fmtNum(force.B, 1) + ' T · ' + L.fmtNum(force.I, 1) + ' A · ' + L.fmtNum(force.l, 2) + ' m · sin ' + force.angle + '°';
  document.getElementById('f-result').innerHTML = 'F = ' + C.sig(F, 2) + ' N' +
    (F < 1e-9 ? ' <small>' + L.tr('(provodnik je paralelan sa poljem)', '(wire is parallel to the field)') + '</small>' : '');
}
L.range('f-angle', { obj: force, key: 'angle', fmt: function (v) { return v + '°'; }, on: readForce });
L.range('f-current', { obj: force, key: 'I', fmt: function (v) { return L.fmtNum(v, v % 1 ? 1 : 0) + ' A'; }, on: readForce });
document.getElementById('f-flip').addEventListener('click', function () { force.sign *= -1; readForce(); });
L.onLang(readForce);

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-force',
    opt: { dist: 10.4, theta: 0.5, phi: 1.2, ty: 0.05 },
    build: function (st) {
      var S = st.scene;
      var poleGeo = new T.BoxGeometry(0.9, 1.9, 1.9);
      var pN = new T.Mesh(poleGeo, std(Cc.north)); pN.position.x = -2.5;
      var pS = new T.Mesh(poleGeo, std(Cc.south)); pS.position.x = 2.5;
      var yoke = new T.Mesh(new T.BoxGeometry(5.9, 0.5, 1.9), std(0x59636d, { metalness: 0.45, roughness: 0.45 })); yoke.position.y = -1.2;
      S.add(pN, pS, yoke);
      var ln = V3.poleLabel('N'); ln.position.set(-2.5, 1.35, 0);
      var ls = V3.poleLabel('S'); ls.position.set(2.5, 1.35, 0);
      S.add(ln, ls);
      var paths = [];
      [-0.6, -0.2, 0.2, 0.6].forEach(function (y) {
        [-0.65, -0.22, 0.22, 0.65].forEach(function (z) {
          paths.push([new T.Vector3(-2.04, y, z), new T.Vector3(2.04, y, z)]);
        });
      });
      var fieldFlow = V3.makeFlow(paths, { color: Cc.field, spacing: 0.7, size: 0.11, lineOpacity: 0.42 });
      S.add(fieldFlow.group);
      var lb = V3.makeLabel('B', { color: '#8fd6f6', size: 0.5 }); lb.position.set(-1.25, 0.98, -0.9); S.add(lb);
      var pivot = new T.Group(); S.add(pivot);
      var wireMesh = new T.Mesh(new T.CylinderGeometry(0.055, 0.055, 2.9, 20), std(Cc.copper, { metalness: 0.55, roughness: 0.35 }));
      wireMesh.rotation.z = Math.PI / 2;
      pivot.add(wireMesh);
      var cur = V3.makeFlow([[new T.Vector3(-1.45, 0, 0), new T.Vector3(1.45, 0, 0)]], { color: Cc.current, spacing: 0.32, size: 0.17, noLine: true });
      pivot.add(cur.group);
      var tip = new T.Mesh(new T.ConeGeometry(0.11, 0.26, 18), std(Cc.current, { emissive: Cc.current, emissiveIntensity: 0.4 }));
      pivot.add(tip);
      var li = V3.makeLabel('I', { color: '#ffc78c', size: 0.45 }); pivot.add(li);
      var arrow = V3.makeArrow(Cc.force, 0.05); S.add(arrow);
      var lf = V3.makeLabel('F', { color: '#f8d77a', size: 0.5 }); S.add(lf);
      var Bv = new T.Vector3(1, 0, 0);
      st.updaters.push(function (dt) {
        var a = force.angle * Math.PI / 180;
        pivot.rotation.y = -a;
        tip.position.set(force.sign * 1.58, 0, 0);
        tip.rotation.z = -force.sign * Math.PI / 2;
        li.position.set(force.sign * 1.6, 0.32, 0);
        var d = new T.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(force.sign);
        var Fdir = d.clone().cross(Bv);
        var F = force.B * force.I * force.l * Math.sin(a);
        var len = 1.7 * F;
        arrow.set(Fdir, len);
        lf.visible = len >= 0.02;
        if (lf.visible) lf.position.copy(Fdir.clone().normalize().multiplyScalar(len + 0.28)).add(new T.Vector3(0.22, 0, 0));
        fieldFlow.update(dt, 0.55 * V3.motion);
        cur.update(dt, force.sign * (0.15 + force.I * 0.12) * V3.motion);
        cur.setStrength(force.I > 0 ? 1 : 0);
      });
    }
  }]);
}
})();
