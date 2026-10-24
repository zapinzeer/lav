(function () {
'use strict';
var V3 = window.LAV3D, P = window.PC3D;
if (!V3 || !V3.ok) { P.staticUI({ parts: P.BOARD_PARTS, listId: 'pc-list', infoId: 'pc-info' }); return; }
V3.start([{
  id: 'lab-board',
  opt: { dist: 5.4, theta: 0.5, phi: 0.82, sway: 0.25 },
  build: function (st) {
    var root = P.buildBoard();
    st.scene.add(root);
    P.attachUI({ st: st, root: root, parts: P.BOARD_PARTS, listId: 'pc-list', infoId: 'pc-info' });
    var x = document.getElementById('pc-x');
    x.addEventListener('change', function () { root.userData.extras.visible = x.checked; });
  }
}]);
})();
