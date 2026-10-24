(function () {
'use strict';
var L = window.LAV, V3 = window.LAV3D, P = window.PC3D;
var info = document.getElementById('as-info');
var STEPS = [
  ['Pripremi kućište', 'Prepare the case', 'Skini oba bočna lima i stavi kućište na ravnu površinu. Na ravnoj ploči (tray) su rupe raspoređene za različite form-faktore. Prema rupama na ploči postavi mesinganе distancere (standoff) tačno na mesta koja ima i matična ploča. Višak distancera ispod ploče izaziva kratak spoj.', 'Remove both side panels and lay the case on a flat surface. The tray has holes laid out for several form factors. Screw the brass standoffs into exactly those positions that the motherboard also has. A standoff with no matching hole in the board can short it.'],
  ['Postavi I/O štitnik', 'Fit the I/O shield', 'Ako ploča nema već ugrađen štitnik, utisni metalni pravougaonik sa otvorima za portove sa unutrašnje strane zadnjeg zida, dok svi uglovi ne škljocnu. Jezičci štitnika ne smeju da uđu u portove.', 'If the board has no built-in shield, press the metal rectangle with port cut-outs into the rear wall from the inside until all corners click. The tabs of the shield must not bend into the ports.'],
  ['Spusti ploču', 'Lower the board', 'Drži ploču za ivice, nagni je tako da portovi uđu u štitnik, pa je spusti na distancere. Rupe na ploči moraju da se poklope sa distancerima.', 'Hold the board by its edges, tilt it so the ports enter the shield, then lower it onto the standoffs. The holes in the board must line up with the standoffs.'],
  ['Zavrni zavrtnje', 'Drive the screws', 'Stavi zavrtanj u svaku rupu i zavrni ih ukrštenim redosledom (kao točak automobila), prvo lagano pa čvrsto, ali bez prevelike sile. Previše jako zatezanje puca ploču.', 'Put a screw in every hole and tighten them in a crossing pattern (like a car wheel), lightly first and then firmly, but not too hard. Over-tightening cracks the board.'],
  ['Priključi napajanje', 'Connect the power', 'Prikači 24-pin kabl uz desnu ivicu ploče i 8-pin EPS kabl u gornjem levom uglu pored procesora. Oba konektora imaju štipaljku koja mora da škljocne. Kablove provuci iza ploče kroz otvore.', 'Plug the 24-pin cable on the right edge of the board and the 8-pin EPS cable in the upper left corner beside the processor. Both connectors have a latch that must click. Route the cables behind the tray through the cut-outs.'],
  ['Prednji priključci', 'Front-panel connectors', 'Na donjoj ivici su pinovi za dugme za napajanje, reset i diode, USB, audio i ventilatore. Raspored piše u priručniku ploče i na samoj ploči. Prekidač napajanja nema polaritet, a diode imaju (+ i −).', 'On the bottom edge are the pins for the power and reset buttons, the LEDs, USB, audio and fans. The layout is in the board manual and printed on the board. The power switch has no polarity, but LEDs do (+ and −).']
];
var cur = 1;
function paint() {
  var s = STEPS[cur - 1];
  info.innerHTML = '<h3>' + L.both(cur + '. ' + L.esc(s[0]), cur + '. ' + L.esc(s[1])) + '</h3><p>' + L.both(L.esc(s[2]), L.esc(s[3])) + '</p>';
  var btns = document.querySelectorAll('#as-step button');
  for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(i + 1 === cur));
}
function steps(set) {
  var b = document.getElementById('as-step');
  b.addEventListener('click', function (e) {
    var x = e.target.closest('button');
    if (!x) return;
    cur = +x.getAttribute('data-v');
    paint();
    if (set) set(cur);
  });
}
steps();
paint();
L.onLang(paint);
if (!V3 || !V3.ok) return;
V3.start([{
  id: 'lab-install',
  opt: { dist: 9.5, theta: 0.3, phi: 1.4, sway: 0.15, tx: 0, ty: 0, tz: 0 },
  build: function (st) {
    var T = window.THREE, Cc = V3.C;
    function mesh(g, c, o) { return new T.Mesh(g, V3.std(c, o)); }
    // the tray lies in the plane z = 0, the viewer looks from +z, the rear panel (I/O side) is at the left
    var tray = mesh(P.boxGeo(5.4, 4.2, 0.06), 0x56616e, { metalness: 0.6, roughness: 0.35 });
    tray.position.set(0.5, -0.1, -0.06);
    st.scene.add(tray);
    var rear = mesh(P.boxGeo(0.06, 4.2, 1.2), 0x39424d, { metalness: 0.6, roughness: 0.4 });
    rear.position.set(-2.2, -0.1, 0.5);
    st.scene.add(rear);
    // holes of the tray (a plate with darker circles)
    var holes = [[-1.35, 1.0], [0.0, 1.0], [1.35, 1.0], [-1.35, 0.0], [0.0, 0.0], [1.35, 0.0], [-1.35, -1.0], [0.0, -1.0], [1.35, -1.0]];
    // cut-outs in the tray: CPU backplate window, cable pass-throughs and vent slots
    [[0.05, 0.95, 0.9, 0.8], [1.95, 0.4, 0.25, 1.3], [1.95, -1.1, 0.25, 0.6], [-1.95, 1.2, 0.2, 0.6], [0.0, -1.55, 2.2, 0.16]].forEach(function (c) {
      var hole = new T.Mesh(new T.PlaneGeometry(c[2], c[3]), new T.MeshStandardMaterial({ color: 0x05080b, roughness: 0.9 }));
      hole.position.set(c[0] + 0.5, c[1] - 0.1, 0.001);
      st.scene.add(hole);
    });
    var board = P.buildBoard();
    board.rotation.x = Math.PI / 2;
    board.scale.setScalar(0.9);
    st.scene.add(board);
    var bx = 0.2, by = 0.0;
    var standoffs = [], screws = [];
    // the real board holes (see the model): the four corners, the middle and two edge points
    var bh = [[-1.2, 0.95], [1.2, 0.95], [-1.2, -0.95], [1.2, -0.95], [0, 0], [0, 0.95]];
    bh.forEach(function (h) {
      var s = mesh(new T.CylinderGeometry(0.075, 0.075, 0.22, 6), 0xc9a24a, { metalness: 0.9, roughness: 0.3 });
      s.rotation.x = Math.PI / 2;
      s.position.set(bx + h[0] * 0.9, by + h[1] * 0.9, 0.11);
      st.scene.add(s);
      standoffs.push(s);
      var sc = mesh(new T.CylinderGeometry(0.085, 0.085, 0.1, 24), 0xaab4bd, { metalness: 1, roughness: 0.3 });
      sc.rotation.x = Math.PI / 2;
      sc.position.set(bx + h[0] * 0.9, by + h[1] * 0.9, 0.34);
      sc.userData.home = 0.17;
      st.scene.add(sc);
      screws.push(sc);
    });
    // I/O shield
    var shield = mesh(P.boxGeo(0.03, 0.8, 1.55), 0xb8c2cc, { metalness: 0.8, roughness: 0.3 });
    var shx = -2.17;
    shield.position.set(shx - 1.5, 1.0, 0.65);
    st.scene.add(shield);
    // PSU at the bottom, cables from it
    var psu = mesh(P.boxGeo(1.8, 0.9, 0.9), 0x2b3139, { metalness: 0.5, roughness: 0.55 });
    psu.position.set(1.2, -1.85, 0.5);
    st.scene.add(psu);
    function cable(pts, color) {
      var cur = new T.CatmullRomCurve3(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); }));
      var m = mesh(new T.TubeGeometry(cur, 24, 0.035, 6), color, { roughness: 0.7 });
      m.visible = false;
      st.scene.add(m);
      return m;
    }
    var atx = cable([[1.4, -1.4, 0.7], [2.2, -0.9, 0.55], [2.2, 0.2, 0.5], [1.75, 0.5, 0.2]], 0x2e8b6a);
    var eps = cable([[0.7, -1.4, 0.7], [-1.9, -1.2, 0.3], [-1.9, 1.35, 0.3], [-0.9, 1.3, 0.22]], 0xe0b13c);
    var fp = cable([[0.9, -1.4, 0.7], [0.9, -1.1, 0.4], [0.7, -0.95, 0.2]], 0x3a8fd6);
    var fp2 = cable([[1.0, -1.4, 0.7], [1.1, -1.1, 0.4], [1.0, -0.98, 0.2]], 0xd25a4b);
    var cables = [[atx, 5], [eps, 5], [fp, 6], [fp2, 6]];
    var tz = 3.0, t = { z: tz, shield: 1, screw: 1 };
    var want = { z: tz, shield: 1, screw: 1 };
    function set(s) {
      want.shield = s >= 2 ? 0 : 1;
      want.z = s >= 3 ? 0.22 : tz;
      want.screw = s >= 4 ? 0 : 1;
      cables.forEach(function (c) { c[0].visible = s >= c[1]; });
      standoffs.forEach(function (o) { o.visible = true; });
    }
    steps(set);
    set(1);
    st.updaters.push(function (dt) {
      var k = Math.min(1, dt * 4);
      t.z += (want.z - t.z) * k;
      t.shield += (want.shield - t.shield) * k;
      t.screw += (want.screw - t.screw) * k;
      board.position.set(bx, by, t.z);
      board.visible = t.z < tz - 0.05 || cur >= 3;
      shield.position.x = shx - 1.5 * t.shield;
      shield.visible = true;
      screws.forEach(function (s) { s.position.z = 0.34 + 0.6 * t.screw; s.visible = cur >= 3; });
    });
  }
}]);
})();
