(function () {
'use strict';
var V3 = window.LAV3D, P = window.PC3D;
if (!V3 || !V3.ok) { P.staticUI({ parts: P.PSU_PARTS, listId: 'psu-list', infoId: 'psu-info' }); return; }
V3.start([{
  id: 'lab-psu',
  opt: { dist: 6.3, theta: 0.7, phi: 1.0, tx: 0.2, ty: 0.2, tz: 1.1, sway: 0.3 },
  build: function (st) {
    var root = P.buildPSU();
    st.scene.add(root);
    P.attachUI({ st: st, root: root, parts: P.PSU_PARTS, listId: 'psu-list', infoId: 'psu-info', focusPhi: 0.9 });
    st.updaters.push(function (dt) { root.userData.fanBlades.rotation.y += dt * 4; });
  }
}]);
})();
