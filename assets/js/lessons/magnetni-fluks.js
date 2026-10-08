(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var flux = { angle: 30, B: 0.5, S: 0.04, dirty: true, rebuild: false };

function readFlux() {
  var a = flux.angle * Math.PI / 180;
  var phi = flux.B * flux.S * Math.cos(a);
  document.getElementById('x-calc').textContent = 'Φ = B·S·cos α = ' + L.fmtNum(flux.B, 1) + ' T · ' + L.fmtNum(flux.S, 2) + ' m² · cos ' + flux.angle + '°';
  document.getElementById('x-result').innerHTML = phi < 1e-9 ? 'Φ = 0 Wb' : 'Φ = ' + C.sig(phi * 1e3, 3) + ' mWb';
}
L.range('x-angle', { obj: flux, key: 'angle', fmt: function (v) { return v + '°'; }, on: function () { flux.dirty = true; readFlux(); } });
L.range('x-b', { obj: flux, key: 'B', fmt: function (v) { return L.fmtNum(v, 1) + ' T'; }, on: function () { flux.rebuild = true; flux.dirty = true; readFlux(); } });
L.onLang(readFlux);

var V3 = window.LAV3D;
if (V3 && V3.ok) {
  var T = window.THREE, Cc = V3.C, std = V3.std;
  V3.start([{
    id: 'lab-flux',
    opt: { dist: 8.9, theta: 0.72, phi: 1.12, ty: 0 },
    build: function (st) {
      var S = st.scene, Lh = 0.8, H = 1.7, PER = 3;
      var lineMat = new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 });
      var dotMat = new T.PointsMaterial({ size: 0.09, map: V3.DOT, vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
      var BR = new T.Color(Cc.field), DIM = new T.Color(Cc.fieldDim), DIMDOT = new T.Color(0x1a3446);
      var cols = [], lines = null, dots = null, phase = 0;
      function build() {
        if (lines) { S.remove(lines); S.remove(dots); lines.geometry.dispose(); dots.geometry.dispose(); }
        var sp = 0.2 / Math.sqrt(flux.B), K = Math.floor(1.6 / sp + 1e-6);
        cols = [];
        for (var i = -K; i <= K; i++) for (var j = -K; j <= K; j++) cols.push([i * sp, j * sp]);
        var lp = new Float32Array(cols.length * 6), lc = new Float32Array(cols.length * 6);
        cols.forEach(function (c, k) { lp.set([c[0], -H, c[1], c[0], H, c[1]], k * 6); });
        var g = new T.BufferGeometry();
        g.setAttribute('position', new T.BufferAttribute(lp, 3));
        g.setAttribute('color', new T.BufferAttribute(lc, 3));
        lines = new T.LineSegments(g, lineMat);
        var dg = new T.BufferGeometry();
        dg.setAttribute('position', new T.BufferAttribute(new Float32Array(cols.length * PER * 3), 3));
        dg.setAttribute('color', new T.BufferAttribute(new Float32Array(cols.length * PER * 3), 3));
        dots = new T.Points(dg, dotMat);
        dots.frustumCulled = false;
        S.add(lines, dots);
        flux.dirty = true;
      }
      function recolor() {
        var half = Lh * Math.cos(flux.angle * Math.PI / 180);
        var lc = lines.geometry.attributes.color.array, dc = dots.geometry.attributes.color.array;
        cols.forEach(function (c, k) {
          var inside = Math.abs(c[0]) < Lh - 1e-6 && Math.abs(c[1]) < half - 1e-6;
          var col = inside ? BR : DIM, dcol = inside ? BR : DIMDOT;
          for (var v = 0; v < 2; v++) { lc[k * 6 + v * 3] = col.r; lc[k * 6 + v * 3 + 1] = col.g; lc[k * 6 + v * 3 + 2] = col.b; }
          for (var d = 0; d < PER; d++) { var o = (k * PER + d) * 3; dc[o] = dcol.r; dc[o + 1] = dcol.g; dc[o + 2] = dcol.b; }
        });
        lines.geometry.attributes.color.needsUpdate = true;
        dots.geometry.attributes.color.needsUpdate = true;
      }
      build();
      var loop = new T.Group(); S.add(loop);
      var cu = std(Cc.copper, { metalness: 0.55, roughness: 0.35 });
      var bx = new T.BoxGeometry(1.66, 0.06, 0.06), bz = new T.BoxGeometry(0.06, 0.06, 1.66);
      [[0, Lh], [0, -Lh]].forEach(function (p) { var m = new T.Mesh(bx, cu); m.position.set(p[0], 0, p[1]); loop.add(m); });
      [[Lh, 0], [-Lh, 0]].forEach(function (p) { var m = new T.Mesh(bz, cu); m.position.set(p[0], 0, p[1]); loop.add(m); });
      var fill = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), new T.MeshBasicMaterial({ color: Cc.field, transparent: true, opacity: 0.13, side: T.DoubleSide, depthWrite: false }));
      fill.rotation.x = -Math.PI / 2; loop.add(fill);
      var n = V3.makeArrow(Cc.white, 0.03); n.set(V3.UP, 1.05); loop.add(n);
      var ln = V3.makeLabel('n', { size: 0.42 }); ln.position.set(0.18, 1.25, 0); loop.add(ln);
      var lb = V3.makeLabel('B', { color: '#8fd6f6', size: 0.5 }); lb.position.set(-1.75, H + 0.2, -1.75); S.add(lb);
      st.updaters.push(function (dt) {
        if (flux.rebuild) { flux.rebuild = false; build(); }
        if (flux.dirty) { flux.dirty = false; recolor(); }
        loop.rotation.x = flux.angle * Math.PI / 180;
        phase += dt * 0.6 * V3.motion;
        var arr = dots.geometry.attributes.position.array;
        for (var k = 0; k < cols.length; k++) {
          for (var d = 0; d < PER; d++) {
            var y = -H + ((phase + d * (2 * H / PER) + k * 0.137) % (2 * H));
            var o = (k * PER + d) * 3; arr[o] = cols[k][0]; arr[o + 1] = y; arr[o + 2] = cols[k][1];
          }
        }
        dots.geometry.attributes.position.needsUpdate = true;
      });
    }
  }]);
}
})();
