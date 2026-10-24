(function () {
'use strict';
var L = window.LAV, V3 = window.LAV3D, P = window.PC3D;
var info = document.getElementById('case-info');
var BOARD = { full: 'eatx', mid: 'atx', mini: 'matx', sff: 'itx', desk: 'matx' };
var NOTE = {
  full: ['Za entuzijaste: više grafičkih kartica, više diskova i veliki radijatori (360 mm). Težak je i zauzima mnogo mesta.', 'For enthusiasts: several graphics cards, many drives and large radiators (360 mm). It is heavy and takes a lot of space.'],
  mid: ['Najpopularniji izbor: staje ATX ploča, dobar je za hlađenje i ima dovoljno mesta za proširenje.', 'The most popular choice: it takes an ATX board, cools well and has enough room to expand.'],
  mini: ['Kompaktan, za mATX ploče. Manje mesta za diskove i hladnjake, ali dovoljno za većinu kućnih računara.', 'Compact, for mATX boards. Less room for drives and coolers, but enough for most home computers.'],
  sff: ['Vrlo mali, za Mini-ITX ploče. Najčešće ima SFX napajanje i ograničen protok vazduha, pa komponente moraju pažljivo da se biraju.', 'Very small, for Mini-ITX boards. It usually has an SFX power supply and limited airflow, so components must be chosen carefully.'],
  desk: ['Leži ispod monitora, popularan u kancelarijama. Nizak profil ograničava visinu hladnjaka i kartica.', 'It lies under the monitor, popular in offices. The low profile limits the height of coolers and cards.']
};
function names(k) { var c = P.CASES[k]; return L.both(L.esc(c.sr), L.esc(c.en)); }
function paint(k) {
  var c = P.CASES[k];
  info.innerHTML = '<h3>' + names(k) + '</h3><p><b>' + L.both('Dimenzije', 'Dimensions') + ':</b> ' + c.w + ' × ' + c.h + ' × ' + c.d + ' cm (' + L.fmtNum(c.w * c.h * c.d / 1000, 1) + ' l) · <b>' + L.both('Ploče', 'Boards') + ':</b> ' + c.boards + ' · <b>' + L.both('Slotova', 'Slots') + ':</b> ' + c.slots + '</p><p>' + L.both(NOTE[k][0], NOTE[k][1]) + '</p>';
}
if (!V3 || !V3.ok) { paint('mid'); return; }
V3.start([{
  id: 'lab-case',
  opt: { dist: 11, theta: 0.7, phi: 1.2, sway: 0.3 },
  build: function (st) {
    var T = window.THREE, cur = null, flow = null, kind = 'mid';
    var air = document.getElementById('case-air');
    function clear() {
      if (cur) { st.scene.remove(cur.group); cur.group.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); }
      if (flow) { st.scene.remove(flow.group); flow.dispose(); }
    }
    function show(k) {
      kind = k;
      clear();
      cur = P.buildCase(st, k, BOARD[k]);
      st.scene.add(cur.group);
      var d = cur.dims, big = Math.max(d.W, d.H, d.D);
      st.dist = big * 1.9 + 2;
      var paths;
      if (k === 'desk') paths = [[new T.Vector3(-d.W / 2, 0.1, 0), new T.Vector3(0, 0.3, 0), new T.Vector3(d.W / 2, 0.2, 0.5)]];
      else paths = [
        [new T.Vector3(0.1, d.H / 2 - 1.2, -d.D / 2), new T.Vector3(0.1, d.H / 2 - 1.2, 0), new T.Vector3(0.1, d.H / 2 - 1.2, d.D / 2)],
        [new T.Vector3(0.1, d.H / 2 - 2.6, -d.D / 2), new T.Vector3(0.1, d.H / 2 - 2.6, -d.D / 4), new T.Vector3(0.1, d.H / 2 - 0.6, d.D / 4), new T.Vector3(0.1, d.H / 2 + 0.2, d.D / 2 - 0.3)]
      ];
      flow = V3.makeFlow(paths, { color: V3.C.field, spacing: 0.5, size: 0.14, lineOpacity: 0.25 });
      st.scene.add(flow.group);
      flow.group.visible = air.checked;
      paint(k);
    }
    st.updaters.push(function (dt) { if (flow && air.checked) flow.update(dt, 1.8); });
    air.addEventListener('change', function () { if (flow) flow.group.visible = air.checked; });
    window.LAVC.toggle(document.getElementById('case-kind'), function (v) { show(v); });
    L.onLang(function () { paint(kind); });
    show('mid');
  }
}]);
})();
