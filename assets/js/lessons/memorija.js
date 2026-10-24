(function () {
'use strict';
var L = window.LAV, C = window.LAVC;
var SPEED = { hdd: [150, 'HDD', 'HDD'], sata: [550, 'SATA SSD', 'SATA SSD'], nvme3: [3500, 'NVMe 3.0', 'NVMe 3.0'], nvme4: [7000, 'NVMe 4.0', 'NVMe 4.0'], ddr: [48000, 'DDR5 RAM', 'DDR5 RAM'] };
var size = document.getElementById('mem-size'), out = document.getElementById('mem-size-out');
var dev = 'sata';
function time(s) {
  if (s >= 120) return L.fmtNum(s / 60, 1) + ' min';
  if (s >= 1) return L.fmtNum(s, 1) + ' s';
  if (s >= 0.001) return L.fmtNum(s * 1000, 1) + ' ms';
  return L.fmtNum(s * 1e6, 0) + ' µs';
}
function update() {
  var gb = +size.value, mb = gb * 1000, sp = SPEED[dev][0], t = mb / sp;
  out.textContent = gb + ' GB';
  document.getElementById('mem-calc').innerHTML = L.both('t = S / v = ' + mb + ' MB / ' + sp + ' MB/s', 't = S / v = ' + mb + ' MB / ' + sp + ' MB/s');
  document.getElementById('mem-result').textContent = 't ≈ ' + time(t);
  var hddT = mb / SPEED.hdd[0];
  document.getElementById('mem-note').innerHTML = dev === 'hdd' ? '' : L.both('HDD bi isto kopirao ' + time(hddT) + ' (' + L.fmtNum(hddT / t, 1) + '× sporije).', 'An HDD would take ' + time(hddT) + ' for the same (' + L.fmtNum(hddT / t, 1) + '× slower).');
}
size.addEventListener('input', update);
C.toggle(document.getElementById('mem-dev'), function (v) { dev = v; update(); });
L.onLang(update);
update();
})();
