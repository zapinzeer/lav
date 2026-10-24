(function () {
'use strict';
var V3 = window.LAV3D, P = window.PC3D;
if (!V3 || !V3.ok) { P.staticUI({ parts: P.BOARD_PARTS, listId: 'fx-list', infoId: 'fx-info' }); return; }
V3.start([{
  id: 'lab-focus',
  opt: { dist: 5.4, theta: 0.5, phi: 0.7, sway: 0.2 },
  build: function (st) {
    var root = P.buildBoard();
    st.scene.add(root);
    var flows = P.buildOverlays();
    Object.keys(flows).forEach(function (k) { root.add(flows[k].group); });
    P.attachUI({ st: st, root: root, parts: P.BOARD_PARTS, listId: 'fx-list', infoId: 'fx-info' });
    var cur = 'none';
    window.LAVC.toggle(document.getElementById('fx-view'), function (v) {
      cur = v;
      Object.keys(flows).forEach(function (k) { flows[k].group.visible = k === v; });
    });
    st.updaters.push(function (dt) { if (flows[cur]) flows[cur].update(dt, 0.9); });
    var x = document.getElementById('fx-x');
    x.addEventListener('change', function () { root.userData.extras.visible = x.checked; });
  }
}]);
})();
