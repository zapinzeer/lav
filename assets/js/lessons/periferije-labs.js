(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var COL = C.COL;
var TAU = Math.PI * 2;
var INK = '#c9d6e2';
var DIM = 'rgba(201,214,226,.45)';
var FAINT = 'rgba(201,214,226,.16)';

function $(id) { return document.getElementById(id); }
function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
function lerp(a, b, k) { return a + (b - a) * k; }
function box(c, x, y, w, h, fill, stroke, r, lw) {
  C.rrect(c, x, y, w, h, r == null ? 4 : r);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1.5; c.stroke(); }
}
function txt(c, s, x, y, color, align, size) { C.label(c, s, x, y, color || INK, align || 'center', size || 11); }
function segVal(id) { var b = $(id).querySelector('button[aria-pressed="true"]'); return b ? b.getAttribute('data-v') : null; }
function seg(id, fn) { C.toggle($(id), fn); }
function info(el, n, title, body) {
  el.innerHTML = '<h3>' + (n ? '<span class="pc-n">' + n + '</span>' : '') + title + '</h3><p>' + body + '</p>';
}
function both(sr, en) { return L.both(sr, en); }
function cable(c, pts, color, prog, width) {
  if (prog <= 0) return;
  var segs = [], total = 0, i;
  for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); total += d; }
  var want = total * Math.min(1, prog);
  c.save();
  c.strokeStyle = color;
  c.lineWidth = width || 3;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (i = 1; i < pts.length; i++) {
    if (want <= 0) break;
    var k = Math.min(1, want / segs[i - 1]);
    c.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k));
    want -= segs[i - 1];
  }
  c.stroke();
  c.restore();
}
function fitInfo(s, lw, lh) {
  var k = Math.min(s.w / lw, s.h / lh);
  return { k: k, ox: (s.w - lw * k) / 2, oy: (s.h - lh * k) / 2 };
}

function scenePic(u, v) {
  var sx = u - 0.72, sy = v - 0.24;
  if (sx * sx + sy * sy < 0.012) return [255, 214, 90];
  if (v > 0.7) return [70 + 40 * Math.sin(u * 9), 150, 80];
  if (u > 0.2 && u < 0.46 && v > 0.46 && v <= 0.7) {
    if (u > 0.28 && u < 0.34 && v > 0.58) return [110, 70, 40];
    return [214, 96, 70];
  }
  if (v > 0.3 && v <= 0.46 && Math.abs(u - 0.33) < (v - 0.3) * 0.85) return [150, 60, 60];
  return [lerp(120, 200, v), lerp(170, 220, v), 245];
}
function rgb(a) { return 'rgb(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ')'; }

function drive() {
  var fig = $('lab-drive');
  if (!fig) return;
  var inf = $('lab-drive-info');
  var st = { kind: 'hdd', step: 1, t: 0 };
  var LW = 400, LH = 250;
  var DEV = {
    hdd: { x: 292, y: 124, w: 78, h: 22, from: [-70, 0], color: COL.a, label: 'HDD 3,5″', port: [214, 150] },
    ssd: { x: 300, y: 200, w: 56, h: 12, from: [-60, 0], color: COL.e, label: 'SSD 2,5″', port: [214, 162] },
    m2: { x: 70, y: 132, w: 70, h: 10, from: [0, -40], color: COL.e, label: 'M.2', port: null },
    odd: { x: 290, y: 34, w: 90, h: 26, from: [100, 0], color: COL.b, label: 'DVD 5,25″', port: [226, 150] }
  };
  var TXT = {
    hdd: [
      ['Pripremi ležište', 'Prepare the bay', 'Disk od 3,5″ ide u unutrašnji kavez. Kod kućišta bez alata izvuci plastičnu fioku (nosač) iz kaveza.', 'A 3.5″ drive goes in the internal cage. In a tool-less case pull the plastic tray (caddy) out of the cage.'],
      ['Ubaci i pričvrsti', 'Slide in and fix', 'Disk ulazi sa konektorima okrenutim ka zadnjoj strani i pričvršćuje se sa četiri zavrtnja ili gumenim šinama.', 'The drive slides in with its connectors facing the back and is fixed with four screws or rubber rails.'],
      ['Kabl za podatke', 'Data cable', 'Uži SATA kabl (7 pinova) ide od diska do SATA porta na matičnoj ploči. Oblik L ne dozvoljava pogrešno okretanje.', 'The narrow SATA cable (7 pins) runs from the drive to a SATA port on the motherboard. The L shape stops it going in the wrong way.'],
      ['Kabl za napajanje', 'Power cable', 'Širi SATA konektor (15 pinova) dolazi iz napajanja. Bez njega disk ne radi, a BIOS ga ne vidi.', 'The wider SATA connector (15 pins) comes from the power supply. Without it the drive does not run and the BIOS cannot see it.']
    ],
    ssd: [
      ['Pripremi nosač', 'Prepare the bracket', 'SSD od 2,5″ ide na poseban nosač (često iza ploče ili na dnu kućišta) ili u adapter za ležište od 3,5″.', 'A 2.5″ SSD goes on its own bracket (often behind the board or at the bottom of the case) or in an adapter for a 3.5″ bay.'],
      ['Pričvrsti SSD', 'Fix the SSD', 'SSD je lagan i nema pokretnih delova, pa su dovoljna dva do četiri sitna M3 zavrtnja.', 'An SSD is light and has no moving parts, so two to four small M3 screws are enough.'],
      ['Kabl za podatke', 'Data cable', 'Isti SATA kabl kao za HDD, do slobodnog SATA porta na ploči. Sistemski disk stavi na port 0 ili 1.', 'The same SATA cable as for an HDD, to a free SATA port on the board. Put the system drive on port 0 or 1.'],
      ['Kabl za napajanje', 'Power cable', 'SATA napajanje iz napajanja. Jedan kabl napajanja obično ima tri ili četiri SATA priključka u nizu.', 'SATA power from the power supply. One power cable usually has three or four SATA plugs in a row.']
    ],
    m2: [
      ['Pronađi slot', 'Find the slot', 'M.2 slot je na ploči, često ispod metalnog hladnjaka. Skini hladnjak i zaštitnu foliju sa njegove termalne podloge.', 'The M.2 slot is on the board, often under a metal heatsink. Remove the heatsink and the protective film from its thermal pad.'],
      ['Ubaci pod uglom', 'Insert at an angle', 'SSD se ubacuje u slot pod uglom od oko 30°, kontaktima napred, dok se zlatni kontakti skoro ne sakriju.', 'The SSD goes into the slot at an angle of about 30°, contacts first, until the gold contacts are almost hidden.'],
      ['Spusti i pričvrsti', 'Press down and fix', 'Spusti kraj SSD-a na distancer i pričvrsti ga malim zavrtnjem ili kopčom. Vrati hladnjak.', 'Press the end of the SSD down onto the standoff and fix it with a small screw or a clip. Put the heatsink back.'],
      ['Nema kablova', 'No cables', 'M.2 dobija i podatke i napajanje direktno iz slota. Ostaje samo provera u BIOS-u.', 'An M.2 drive gets both data and power straight from the slot. All that is left is a check in the BIOS.']
    ],
    odd: [
      ['Skini masku', 'Remove the cover', 'Optički uređaj ide u spoljno ležište od 5,25″. Skini plastičnu masku sa prednje strane i metalni poklopac iza nje.', 'The optical drive goes in a 5.25″ external bay. Remove the plastic cover from the front and the metal plate behind it.'],
      ['Ugurni spreda', 'Push in from the front', 'Uređaj se gura spreda, kroz otvor, dok mu se prednja ploča ne poravna sa kućištem. Pričvrsti ga sa po dva zavrtnja sa strane.', 'The drive is pushed in from the front, through the opening, until its front panel lines up with the case. Fix it with two screws on each side.'],
      ['Kabl za podatke', 'Data cable', 'SATA kabl za podatke do ploče. Stari uređaji imaju široki IDE kabl sa 40 pinova.', 'A SATA data cable to the board. Old drives have a wide 40-pin IDE cable.'],
      ['Kabl za napajanje', 'Power cable', 'SATA napajanje (stari uređaji: četvoropinski Molex). Posle paljenja uređaj se vidi kao DVD jedinica u sistemu.', 'SATA power (old drives: a four-pin Molex). After power-on the drive shows up as a DVD drive in the system.']
    ]
  };
  function paint() {
    var x = TXT[st.kind][st.step - 1];
    info(inf, st.step, both(x[0], x[1]), both(x[2], x[3]));
  }
  seg('drv-kind', function (v) { st.kind = v; st.step = 1; st.t = 0; C.setSeg($('drv-step'), 1); paint(); });
  seg('drv-step', function (v) { st.step = +v; st.t = 0; paint(); });
  L.onLang(paint);
  paint();
  C.scene(fig, function (c, s, dt) {
    st.t += dt;
    c.save();
    C.fit(c, s, LW, LH);
    box(c, 14, 14, 372, 222, 'rgba(255,255,255,.02)', DIM, 10);
    txt(c, L.tr('zadnja strana', 'back'), 22, 8, DIM, 'left', 9.5);
    txt(c, L.tr('prednja strana', 'front'), 380, 8, DIM, 'right', 9.5);
    box(c, 26, 24, 196, 166, 'rgba(111,207,151,.10)', 'rgba(111,207,151,.55)', 8);
    txt(c, L.tr('matična ploča', 'motherboard'), 124, 36, 'rgba(111,207,151,.8)', 'center', 10);
    box(c, 96, 60, 46, 46, 'rgba(201,214,226,.10)', DIM, 4);
    txt(c, 'CPU', 119, 83, DIM, 'center', 10);
    for (var i = 0; i < 4; i++) box(c, 156 + i * 8, 52, 4, 64, 'rgba(201,214,226,.18)', null, 1);
    var m2slot = st.kind === 'm2';
    box(c, 60, 128, 10, 18, m2slot && st.step === 1 ? COL.f : 'rgba(201,214,226,.3)', null, 2);
    box(c, 140, 134, 5, 5, 'rgba(201,214,226,.5)', null, 2);
    for (var p = 0; p < 4; p++) box(c, 204 + (p % 2) * 12, 146 + Math.floor(p / 2) * 12, 9, 7, 'rgba(245,200,76,.65)', null, 1);
    txt(c, 'SATA', 216, 176, DIM, 'center', 9);
    box(c, 26, 198, 110, 32, 'rgba(201,214,226,.10)', DIM, 4);
    txt(c, L.tr('napajanje', 'PSU'), 81, 214, DIM, 'center', 10);
    box(c, 286, 26, 98, 38, null, FAINT, 3);
    box(c, 286, 68, 98, 38, null, FAINT, 3);
    box(c, 286, 116, 92, 64, null, FAINT, 3);
    box(c, 286, 194, 76, 24, null, FAINT, 3);
    var d = DEV[st.kind];
    var pulse = 0.5 + 0.5 * Math.sin(st.t * 5);
    if (st.step === 1) {
      c.save();
      c.setLineDash([5, 4]);
      box(c, d.x - 4, d.y - 4, d.w + 8, d.h + 8, null, 'rgba(245,200,76,' + (0.4 + 0.6 * pulse) + ')', 4, 2);
      c.restore();
    }
    if (st.kind === 'odd' && st.step === 1) {
      var off = ease(st.t / 1.2) * 30;
      box(c, 378 + off, 30, 8, 30, 'rgba(201,214,226,.5)', null, 2);
    }
    var k = st.step === 1 ? 0 : st.step === 2 ? ease(st.t / 1.4) : 1;
    var dx = d.from[0] * (1 - k), dy = d.from[1] * (1 - k);
    c.save();
    if (st.kind === 'm2') {
      var ang = st.step <= 2 ? -0.5 : st.step === 3 ? -0.5 * (1 - ease(st.t / 1.0)) : 0;
      var kin = st.step === 1 ? 0 : st.step === 2 ? ease(st.t / 1.2) : 1;
      var mx = 20 * (1 - kin), my = -36 * (1 - kin);
      c.translate(d.x + mx, d.y + d.h / 2 + my);
      c.rotate(ang);
      box(c, 0, -d.h / 2, d.w, d.h, d.color, null, 2);
      for (var q = 0; q < 3; q++) box(c, 12 + q * 18, -d.h / 2 + 2, 12, d.h - 4, 'rgba(12,19,27,.7)', null, 1);
      c.fillStyle = COL.f;
      c.fillRect(0, -d.h / 2, 5, d.h);
    } else {
      box(c, d.x + dx, d.y + dy, d.w, d.h, d.color, null, 3);
      txt(c, d.label, d.x + dx + d.w / 2, d.y + dy + d.h / 2, '#0c131b', 'center', 9.5);
      c.fillStyle = COL.b;
      c.fillRect(d.x + dx - 3, d.y + dy + 3, 4, 6);
      c.fillStyle = COL.f;
      c.fillRect(d.x + dx - 3, d.y + dy + d.h - 9, 4, 6);
    }
    c.restore();
    if (st.step >= 2 && st.kind !== 'm2' && k > 0.98) {
      c.fillStyle = INK;
      [[d.x + 6, d.y - 3], [d.x + d.w - 6, d.y - 3], [d.x + 6, d.y + d.h + 3], [d.x + d.w - 6, d.y + d.h + 3]].forEach(function (pt) { c.beginPath(); c.arc(pt[0], pt[1], 2.2, 0, TAU); c.fill(); });
    }
    if (st.kind === 'm2' && st.step >= 3) {
      c.fillStyle = INK;
      c.beginPath(); c.arc(142.5, 136.5, 3, 0, TAU); c.fill();
    }
    if (d.port) {
      var dataPts = [[d.x - 3, d.y + 6], [d.x - 18, d.y + 6], [d.x - 18, d.port[1] + 4], [d.port[0] + 9, d.port[1] + 4]];
      var pwrPts = [[d.x - 3, d.y + d.h - 6], [d.x - 30, d.y + d.h - 6], [d.x - 30, 214], [136, 214]];
      cable(c, dataPts, COL.b, st.step === 3 ? ease(st.t / 1.3) : st.step > 3 ? 1 : 0, 3);
      cable(c, pwrPts, COL.f, st.step === 4 ? ease(st.t / 1.3) : 0, 3);
    }
    if (st.step === 4 && st.t > 1.4) {
      txt(c, L.tr('✓ spremno za BIOS', '✓ ready for the BIOS'), 200, 242, COL.c, 'center', 11);
    }
    c.restore();
  });
}

function gpu() {
  var fig = $('lab-gpu');
  if (!fig) return;
  var st = { mode: 'cpu', n: 32, tick: 0, acc: 0, hold: 0 };
  var LW = 400, LH = 250;
  function cores() { return st.mode === 'cpu' ? 8 : 256; }
  function readout() {
    var px = st.n * st.n, cpuT = Math.ceil(px / 8), gpuT = Math.ceil(px / 256);
    $('lab-gpu-calc').textContent = L.tr('Piksela: ' + st.n + ' × ' + st.n + ' = ' + px + ' · CPU: ' + px + ' / 8 = ' + cpuT + ' taktova · GPU: ' + px + ' / 256 = ' + gpuT + ' taktova', 'Pixels: ' + st.n + ' × ' + st.n + ' = ' + px + ' · CPU: ' + px + ' / 8 = ' + cpuT + ' ticks · GPU: ' + px + ' / 256 = ' + gpuT + ' ticks');
    $('lab-gpu-result').textContent = L.tr('GPU je ovde ' + L.fmtNum(cpuT / gpuT, 0) + ' puta brži', 'Here the GPU is ' + L.fmtNum(cpuT / gpuT, 0) + ' times faster');
    $('lab-gpu-note').textContent = L.tr('Full HD ima 2 073 600 piksela: 8 jezgara bi trebalo 259 200 taktova, a GPU sa 10 000 jezgara samo 208.', 'Full HD has 2,073,600 pixels: 8 cores would need 259,200 ticks, while a GPU with 10,000 cores needs only 208.');
  }
  seg('gpu-mode', function (v) { st.mode = v; st.tick = 0; st.hold = 0; });
  L.range('gpu-res', { obj: st, key: 'n', fmt: function (v) { return v + ' × ' + v; }, on: function () { st.tick = 0; st.hold = 0; readout(); } });
  L.onLang(readout);
  readout();
  C.scene(fig, function (c, s, dt) {
    var n = st.n, total = n * n, k = cores();
    if (st.hold > 0) { st.hold -= dt; if (st.hold <= 0) st.tick = 0; }
    else {
      st.acc += dt * 14;
      while (st.acc >= 1) { st.acc -= 1; st.tick++; }
      if (st.tick * k >= total) { st.tick = Math.ceil(total / k); st.hold = 1.6; }
    }
    var done = Math.min(total, st.tick * k);
    c.save();
    C.fit(c, s, LW, LH);
    var G = 226, gx = 12, gy = 12, cs = G / n;
    c.fillStyle = 'rgba(201,214,226,.06)';
    c.fillRect(gx, gy, G, G);
    for (var i = 0; i < done; i++) {
      var x = i % n, y = Math.floor(i / n);
      c.fillStyle = rgb(scenePic((x + 0.5) / n, (y + 0.5) / n));
      c.fillRect(gx + x * cs, gy + y * cs, cs + 0.3, cs + 0.3);
    }
    if (st.hold <= 0) {
      c.strokeStyle = '#fff';
      c.lineWidth = 1;
      var from = Math.max(0, done - k);
      for (var j = from; j < done; j++) { var xx = j % n, yy = Math.floor(j / n); c.strokeRect(gx + xx * cs + 0.5, gy + yy * cs + 0.5, Math.max(1, cs - 1), Math.max(1, cs - 1)); }
    }
    c.strokeStyle = DIM;
    c.strokeRect(gx, gy, G, G);
    var px = 254, py = 14;
    txt(c, st.mode === 'cpu' ? L.tr('CPU · 8 jezgara', 'CPU · 8 cores') : L.tr('GPU · 256 jezgara', 'GPU · 256 cores'), 322, py + 4, st.mode === 'cpu' ? COL.b : COL.a, 'center', 11.5);
    if (st.mode === 'cpu') {
      for (var a = 0; a < 8; a++) {
        var on = st.hold <= 0 && (st.tick + a) % 2 === 0;
        box(c, px + (a % 4) * 35, py + 22 + Math.floor(a / 4) * 35, 30, 30, on ? COL.b : 'rgba(255,180,104,.35)', null, 4);
      }
    } else {
      for (var b = 0; b < 256; b++) {
        var bx = b % 16, by = Math.floor(b / 16);
        var lit = st.hold <= 0 && ((b * 7 + st.tick) % 3) !== 0;
        c.fillStyle = lit ? COL.a : 'rgba(108,198,238,.3)';
        c.fillRect(px + bx * 8.6, py + 22 + by * 8.6, 7, 7);
      }
    }
    var bary = 192;
    txt(c, L.tr('napredak', 'progress'), px, bary - 10, DIM, 'left', 10);
    box(c, px, bary, 136, 12, 'rgba(201,214,226,.1)', null, 6);
    box(c, px, bary, 136 * done / total, 12, st.mode === 'cpu' ? COL.b : COL.a, null, 6);
    txt(c, L.tr('takt ', 'tick ') + st.tick + ' / ' + Math.ceil(total / k), px, bary + 28, INK, 'left', 11);
    if (st.hold > 0) txt(c, L.tr('✓ slika gotova', '✓ picture done'), px, bary + 46, COL.c, 'left', 11);
    c.restore();
  });
}

function kbd() {
  var fig = $('lab-kbd');
  if (!fig) return;
  var inf = $('lab-kbd-info');
  var KEYS = [['Q', 'W', 'E', 'R', 'T', 'Z'], ['A', 'S', 'D', 'F', 'G', 'H'], ['Y', 'X', 'C', 'V', 'B', 'N'], ['1', '2', '3', '4', '5', '6']];
  var st = { row: 0, acc: 0, speed: 'slow', held: {}, typed: '', last: null, flash: 0 };
  var LW = 400, LH = 250, X0 = 110, Y0 = 46, DX = 46, DY = 40, view = null;
  function paint() {
    if (!st.last) { info(inf, '', both('Pritisni taster', 'Press a key'), both('Kontroler proziva red po red. Klikni na neki taster u matrici.', 'The controller calls row after row. Click a key in the matrix.')); return; }
    var r = st.last[0], col = st.last[1];
    info(inf, '', both('Pronađen taster ' + KEYS[r][col], 'Found key ' + KEYS[r][col]), both('Aktivan red ' + (r + 1) + ', kontakt zatvoren u koloni ' + (col + 1) + '. Kontroler šalje računaru kod tog mesta u matrici, a sistem ga prema rasporedu (QWERTZ) pretvara u slovo „' + KEYS[r][col] + '”.', 'Active row ' + (r + 1) + ', contact closed in column ' + (col + 1) + '. The controller sends the computer the code for that place in the matrix, and the system turns it into the letter "' + KEYS[r][col] + '" according to the layout (QWERTZ).'));
  }
  seg('kbd-speed', function (v) { st.speed = v; });
  L.onLang(paint);
  paint();
  var s = C.scene(fig, function (c, sc, dt) {
    view = fitInfo(sc, LW, LH);
    var rate = st.speed === 'slow' ? 1.6 : 14;
    st.acc += dt * rate;
    while (st.acc >= 1) { st.acc -= 1; st.row = (st.row + 1) % 4; }
    var now = performance.now() / 1000;
    var hitCol = -1;
    Object.keys(st.held).forEach(function (key) {
      var h = st.held[key];
      if (h.until < now) { delete st.held[key]; return; }
      var r = +key.split(',')[0], col = +key.split(',')[1];
      if (r !== st.row) return;
      hitCol = col;
      if (!h.det) {
        h.det = true;
        st.typed = (st.typed + KEYS[r][col]).slice(-16);
        st.last = [r, col];
        st.flash = 0.6;
        paint();
      }
    });
    st.flash = Math.max(0, st.flash - dt);
    c.save();
    C.fit(c, sc, LW, LH);
    box(c, 14, 46, 60, 160, 'rgba(201,214,226,.08)', DIM, 6);
    txt(c, L.tr('kontroler', 'controller'), 44, 216, DIM, 'center', 10);
    for (var r = 0; r < 4; r++) {
      var y = Y0 + r * DY + 16;
      var act = r === st.row;
      c.strokeStyle = act ? COL.b : 'rgba(255,180,104,.25)';
      c.lineWidth = act ? 3 : 1.5;
      c.beginPath(); c.moveTo(74, y); c.lineTo(X0 + 5 * DX + 30, y); c.stroke();
      txt(c, 'R' + (r + 1), 64, y, act ? COL.b : DIM, 'right', 9.5);
    }
    for (var col = 0; col < 6; col++) {
      var x = X0 + col * DX + 30;
      var hit = col === hitCol;
      c.strokeStyle = hit ? COL.c : 'rgba(108,198,238,.3)';
      c.lineWidth = hit ? 3 : 1.5;
      c.beginPath(); c.moveTo(x, Y0); c.lineTo(x, 214); c.lineTo(74, 214); c.stroke();
      txt(c, 'K' + (col + 1), x, Y0 - 8, hit ? COL.c : DIM, 'center', 9.5);
    }
    for (var rr = 0; rr < 4; rr++) for (var cc = 0; cc < 6; cc++) {
      var kx = X0 + cc * DX + 14, ky = Y0 + rr * DY + 2;
      var down = !!st.held[rr + ',' + cc];
      box(c, kx, ky, 32, 28, down ? 'rgba(245,200,76,.85)' : 'rgba(21,34,48,.95)', down ? COL.f : 'rgba(201,214,226,.4)', 5);
      txt(c, KEYS[rr][cc], kx + 16, ky + 14, down ? '#0c131b' : INK, 'center', 12);
    }
    box(c, 110, 10, 280, 22, 'rgba(201,214,226,.06)', st.flash > 0 ? COL.c : FAINT, 5);
    txt(c, '› ' + st.typed + (Math.floor(now * 2) % 2 ? '▌' : ''), 118, 21, INK, 'left', 11.5);
    c.restore();
  });
  C.drag(s.cv, {
    down: function (px, py) {
      if (!view) return false;
      var x = (px - view.ox) / view.k, y = (py - view.oy) / view.k;
      for (var r = 0; r < 4; r++) for (var cc = 0; cc < 6; cc++) {
        var kx = X0 + cc * DX + 14, ky = Y0 + r * DY + 2;
        if (x >= kx && x <= kx + 32 && y >= ky && y <= ky + 28) {
          st.held[r + ',' + cc] = { until: performance.now() / 1000 + (st.speed === 'slow' ? 2.8 : 0.6), det: false };
        }
      }
      return false;
    }
  });
}

function input() {
  var fig = $('lab-in');
  if (!fig) return;
  var st = { kind: 'mouse', dpi: 1600, t: 0, scan: 0 };
  var LW = 400, LH = 250;
  var dots = [];
  for (var i = 0; i < 2200; i++) dots.push([Math.random() * 600 - 100, Math.random() * 600 - 100, 0.5 + Math.random() * 1.2, Math.random()]);
  var SPEED_CM = 6;
  function readout() {
    if (st.kind === 'mouse') {
      var ins = SPEED_CM / 2.54;
      $('lab-in-calc').textContent = L.tr('Miš se kreće ' + SPEED_CM + ' cm/s = ' + L.fmtNum(ins, 2) + ' inča u sekundi', 'The mouse moves at ' + SPEED_CM + ' cm/s = ' + L.fmtNum(ins, 2) + ' inches per second');
      $('lab-in-result').textContent = L.tr(L.fmtNum(ins, 2) + ' · ' + st.dpi + ' DPI ≈ ' + Math.round(ins * st.dpi) + ' koraka u sekundi', L.fmtNum(ins, 2) + ' · ' + st.dpi + ' DPI ≈ ' + Math.round(ins * st.dpi) + ' steps per second');
      $('lab-in-note').textContent = L.tr('Senzor snima oko 6000 slika u sekundi i poredi svaku sa prethodnom.', 'The sensor takes about 6000 pictures a second and compares each with the one before.');
    } else {
      var w = Math.round(8.27 * st.dpi), h = Math.round(11.69 * st.dpi), mb = w * h * 3 / 1e6;
      $('lab-in-calc').textContent = L.tr('A4 papir je 8,27 × 11,69 inča: ' + w + ' × ' + h + ' piksela', 'A4 paper is 8.27 × 11.69 inches: ' + w + ' × ' + h + ' pixels');
      $('lab-in-result').textContent = L.tr('≈ ' + L.fmtNum(w * h / 1e6, 1) + ' miliona piksela · ≈ ' + L.fmtNum(mb, 0) + ' MB bez kompresije', '≈ ' + L.fmtNum(w * h / 1e6, 1) + ' million pixels · ≈ ' + L.fmtNum(mb, 0) + ' MB uncompressed');
      $('lab-in-note').textContent = L.tr('Za tekst je dovoljno 300 DPI, za fotografije 600 i više.', '300 DPI is enough for text, 600 or more for photos.');
    }
  }
  seg('in-kind', function (v) { st.kind = v; st.scan = 0; readout(); });
  L.range('in-dpi', { obj: st, key: 'dpi', fmt: function (v) { return v + ' DPI'; }, on: function () { st.scan = 0; readout(); } });
  L.onLang(readout);
  readout();
  C.scene(fig, function (c, s, dt) {
    st.t += dt;
    c.save();
    C.fit(c, s, LW, LH);
    if (st.kind === 'mouse') {
      var mx = Math.cos(st.t * 0.7) * 60, my = Math.sin(st.t * 1.1) * 40;
      var vx = -Math.sin(st.t * 0.7) * 42, vy = Math.cos(st.t * 1.1) * 44;
      c.save();
      C.rrect(c, 12, 12, 200, 226, 8);
      c.clip();
      c.fillStyle = 'rgba(201,214,226,.05)';
      c.fillRect(12, 12, 200, 226);
      dots.forEach(function (d) {
        var x = d[0] - mx * 1.6, y = d[1] - my * 1.6;
        x = ((x % 260) + 260) % 260 - 20; y = ((y % 280) + 280) % 280 - 20;
        c.fillStyle = 'rgba(201,214,226,' + (0.15 + d[3] * 0.4) + ')';
        c.beginPath(); c.arc(x, y, d[2], 0, TAU); c.fill();
      });
      c.restore();
      c.save();
      c.translate(112, 125);
      box(c, -34, -52, 68, 104, 'rgba(21,34,48,.55)', 'rgba(201,214,226,.6)', 30, 1.5);
      c.strokeStyle = 'rgba(201,214,226,.5)';
      c.beginPath(); c.moveTo(0, -52); c.lineTo(0, -14); c.stroke();
      box(c, -9, 4, 18, 18, null, COL.f, 2, 2);
      c.fillStyle = 'rgba(242,139,130,.35)';
      c.beginPath(); c.arc(0, 13, 14, 0, TAU); c.fill();
      c.restore();
      txt(c, L.tr('senzor', 'sensor'), 112, 196, COL.f, 'center', 10);
      var fx = [236, 318];
      [0, 1].forEach(function (f) {
        var ox = fx[f], oy = 40, size = 72;
        box(c, ox, oy, size, size, 'rgba(12,19,27,.9)', f ? COL.a : DIM, 4);
        c.save();
        C.rrect(c, ox, oy, size, size, 4);
        c.clip();
        var lag = f ? 0 : 0.18;
        var tx = Math.cos((st.t - lag) * 0.7) * 60, ty = Math.sin((st.t - lag) * 1.1) * 40;
        dots.forEach(function (d) {
          var x = d[0] - tx * 1.6, y = d[1] - ty * 1.6;
          x = ((x % 260) + 260) % 260 - 20; y = ((y % 280) + 280) % 280 - 20;
          var rx = (x - 112) * 3 + ox + size / 2, ry = (y - 138) * 3 + oy + size / 2;
          if (rx > ox - 10 && rx < ox + size + 10 && ry > oy - 10 && ry < oy + size + 10) {
            c.fillStyle = 'rgba(201,214,226,' + (0.25 + d[3] * 0.6) + ')';
            c.beginPath(); c.arc(rx, ry, d[2] * 3, 0, TAU); c.fill();
          }
        });
        c.restore();
        txt(c, f ? L.tr('slika sada', 'picture now') : L.tr('prethodna slika', 'previous picture'), ox + size / 2, oy + size + 12, f ? COL.a : DIM, 'center', 9.5);
      });
      var ax = 314, ay = 180, len = Math.hypot(vx, vy) || 1;
      C.arrow(c, ax - vx / len * 26, ay - vy / len * 26, ax + vx / len * 26, ay + vy / len * 26, COL.c, 2.5, 9);
      txt(c, L.tr('pomeraj koji čip šalje', 'shift the chip sends'), 314, 222, COL.c, 'center', 10);
    } else {
      var n = Math.max(8, Math.min(64, Math.round(st.dpi / 50)));
      st.scan = Math.min(1, st.scan + dt * 0.22);
      if (st.scan >= 1) { st.t2 = (st.t2 || 0) + dt; if (st.t2 > 1.5) { st.scan = 0; st.t2 = 0; } }
      var pw = 150, ph = 200, pxo = 24, pyo = 26;
      box(c, pxo - 6, pyo - 6, pw + 12, ph + 12, 'rgba(201,214,226,.08)', DIM, 6);
      for (var yy = 0; yy < 50; yy++) for (var xx = 0; xx < 38; xx++) {
        c.fillStyle = rgb(scenePic((xx + 0.5) / 38, (yy + 0.5) / 50));
        c.fillRect(pxo + xx * pw / 38, pyo + yy * ph / 50, pw / 38 + 0.4, ph / 50 + 0.4);
      }
      var by = pyo + ph * st.scan;
      c.fillStyle = 'rgba(255,255,255,.18)';
      c.fillRect(pxo - 6, by - 6, pw + 12, 12);
      c.strokeStyle = '#fff';
      c.lineWidth = 2;
      c.beginPath(); c.moveTo(pxo - 6, by); c.lineTo(pxo + pw + 6, by); c.stroke();
      txt(c, L.tr('papir i svetlosna traka', 'paper and light bar'), pxo + pw / 2, 244, DIM, 'center', 9.5);
      var gx = 218, gy = 26, gw = 150, gh = 200;
      var rowsN = Math.round(n * 4 / 3), cw = gw / n, ch = gh / rowsN;
      box(c, gx - 6, gy - 6, gw + 12, gh + 12, 'rgba(12,19,27,.9)', COL.a, 6);
      var rowsDone = Math.floor(rowsN * st.scan);
      for (var ry = 0; ry < rowsDone; ry++) for (var rx = 0; rx < n; rx++) {
        c.fillStyle = rgb(scenePic((rx + 0.5) / n, (ry + 0.5) / rowsN));
        c.fillRect(gx + rx * cw, gy + ry * ch, cw + 0.3, ch + 0.3);
      }
      txt(c, L.tr('digitalna slika: ', 'digital image: ') + n + ' × ' + rowsN, gx + gw / 2, 244, COL.a, 'center', 9.5);
    }
    c.restore();
  });
}

function poll() {
  var fig = $('lab-poll');
  if (!fig) return;
  var st = { link: 'usb', rate: 125, t: 0, acc: 0, pk: [], samples: [] };
  var LW = 400, LH = 250, SLOW = 50, CIRC = 0.08;
  function eff() { return st.link === 'bt' ? Math.min(st.rate, 133) : st.rate; }
  function readout() {
    var r = eff(), iv = 1000 / r;
    $('lab-poll-calc').textContent = L.tr('Razmak prozivanja: 1000 ms / ' + r + ' = ' + L.fmtNum(iv, iv < 1 ? 3 : 1) + ' ms', 'Polling interval: 1000 ms / ' + r + ' = ' + L.fmtNum(iv, iv < 1 ? 3 : 1) + ' ms');
    var extra = st.link === 'usb' ? 0 : st.link === 'dongle' ? 1 : 8;
    $('lab-poll-result').textContent = L.tr('Najveće kašnjenje ≈ ' + L.fmtNum(iv + extra, 1) + ' ms · uzoraka po brzom krugu: ' + Math.round(r * CIRC), 'Largest delay ≈ ' + L.fmtNum(iv + extra, 1) + ' ms · samples per quick circle: ' + Math.round(r * CIRC));
    var note = {
      usb: ['Kabl: nema baterije ni smetnji, kašnjenje zavisi samo od prozivanja.', 'Cable: no battery and no interference, the delay depends only on polling.'],
      dongle: ['Prijemnik na 2,4 GHz: radi odmah, dodaje oko 1 ms; bolji za igre od Bluetootha.', '2.4 GHz receiver: works at once, adds about 1 ms; better for games than Bluetooth.'],
      bt: ['Bluetooth: ne treba prijemnik, ali veza obično ide najviše oko 133 puta u sekundi i dodaje nekoliko milisekundi.', 'Bluetooth: no receiver needed, but the link usually goes at most about 133 times a second and adds a few milliseconds.']
    }[st.link];
    $('lab-poll-note').textContent = L.tr(note[0], note[1]);
  }
  seg('poll-link', function (v) { st.link = v; st.samples = []; readout(); });
  seg('poll-rate', function (v) { st.rate = +v; st.samples = []; readout(); });
  L.onLang(readout);
  readout();
  C.scene(fig, function (c, s, dt) {
    st.t += dt;
    var r = eff();
    st.acc += dt;
    var vis = SLOW / r;
    while (st.acc >= vis) {
      st.acc -= vis;
      if (st.t - (st.lastPk || 0) > 0.12) { st.pk.push(0); st.lastPk = st.t; }
      var a = (st.t - st.acc) / SLOW / CIRC * TAU;
      st.samples.push([Math.cos(a), Math.sin(a)]);
      if (st.samples.length > Math.round(r * CIRC) + 1) st.samples.shift();
    }
    st.pk = st.pk.map(function (p) { return p + dt * 0.9; }).filter(function (p) { return p < 1; });
    c.save();
    C.fit(c, s, LW, LH);
    var y0 = 46;
    box(c, 18, y0 - 22, 40, 58, 'rgba(21,34,48,.9)', INK, 18, 1.5);
    c.strokeStyle = DIM; c.beginPath(); c.moveTo(38, y0 - 22); c.lineTo(38, y0); c.stroke();
    txt(c, L.tr('miš', 'mouse'), 38, y0 + 48, DIM, 'center', 10);
    box(c, 318, y0 - 26, 70, 52, 'rgba(201,214,226,.08)', INK, 5, 1.5);
    txt(c, L.tr('računar', 'computer'), 353, y0, INK, 'center', 10.5);
    if (st.link === 'usb') {
      c.strokeStyle = 'rgba(201,214,226,.6)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(58, y0); c.lineTo(318, y0); c.stroke();
      txt(c, 'USB', 188, y0 - 14, DIM, 'center', 10);
    } else {
      if (st.link === 'dongle') { box(c, 304, y0 - 8, 14, 16, COL.e, null, 2); txt(c, L.tr('prijemnik', 'receiver'), 300, y0 + 34, COL.e, 'right', 9.5); }
      for (var w = 0; w < 4; w++) {
        var rad = ((st.t * 60 + w * 30) % 120) + 8;
        c.strokeStyle = 'rgba(179,155,242,' + (1 - rad / 128) * 0.7 + ')';
        c.lineWidth = 1.5;
        c.beginPath(); c.arc(60, y0, rad, -0.5, 0.5); c.stroke();
      }
      txt(c, st.link === 'bt' ? 'Bluetooth' : '2,4 GHz', 188, y0 - 18, DIM, 'center', 10);
    }
    st.pk.forEach(function (p) {
      var x = lerp(62, 314, p);
      box(c, x - 6, y0 - 5, 12, 10, COL.b, null, 2);
    });
    var cx = 200, cy = 168, R = 58;
    c.strokeStyle = FAINT; c.lineWidth = 6;
    c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
    if (st.samples.length > 1) {
      c.strokeStyle = COL.a; c.lineWidth = 2;
      c.beginPath();
      st.samples.forEach(function (p, i) { var x = cx + p[0] * R, y = cy + p[1] * R; if (i) c.lineTo(x, y); else c.moveTo(x, y); });
      c.stroke();
      c.fillStyle = COL.f;
      st.samples.forEach(function (p) { c.beginPath(); c.arc(cx + p[0] * R, cy + p[1] * R, 3, 0, TAU); c.fill(); });
    }
    txt(c, L.tr('brz krug mišem (80 ms), usporeno', 'a quick circle with the mouse (80 ms), slowed down'), cx, 244, DIM, 'center', 9.5);
    c.restore();
  });
}

function rgbLab() {
  var fig = $('lab-rgb');
  if (!fig) return;
  var st = { r: 255, g: 160, b: 40 };
  var LW = 400, LH = 250;
  function hex(v) { var h = Math.round(v).toString(16).toUpperCase(); return h.length < 2 ? '0' + h : h; }
  function name() {
    var r = st.r, g = st.g, b = st.b, mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx < 40) return ['skoro crna', 'almost black'];
    if (mx - mn < 25) return mx > 220 ? ['bela', 'white'] : ['siva', 'grey'];
    if (r > 180 && g > 180 && b < 100) return ['žuta', 'yellow'];
    if (r > 180 && b > 180 && g < 100) return ['ljubičasta (magenta)', 'purple (magenta)'];
    if (g > 180 && b > 180 && r < 100) return ['tirkizna (cijan)', 'turquoise (cyan)'];
    if (r > 180 && g > 90 && g < 190 && b < 90) return ['narandžasta', 'orange'];
    if (r === mx) return ['crvenkasta', 'reddish'];
    if (g === mx) return ['zelenkasta', 'greenish'];
    return ['plavičasta', 'bluish'];
  }
  function readout() {
    $('lab-rgb-calc').textContent = 'rgb(' + st.r + ', ' + st.g + ', ' + st.b + ') = #' + hex(st.r) + hex(st.g) + hex(st.b);
    var n = name();
    $('lab-rgb-result').textContent = L.tr('Oko vidi: ' + n[0], 'The eye sees: ' + n[1]);
    $('lab-rgb-note').textContent = L.tr('Crvena + zelena = žuta, crvena + plava = magenta, zelena + plava = cijan, sve tri = bela.', 'Red + green = yellow, red + blue = magenta, green + blue = cyan, all three = white.');
  }
  ['r', 'g', 'b'].forEach(function (k) { L.range('rgb-' + k, { obj: st, key: k, fmt: function (v) { return String(v); }, on: readout }); });
  L.onLang(readout);
  readout();
  C.scene(fig, function (c, s) {
    c.save();
    C.fit(c, s, LW, LH);
    var gx = 16, gy = 20, P = 66;
    c.fillStyle = '#05080b';
    c.fillRect(gx, gy, P * 3, P * 3);
    for (var py = 0; py < 3; py++) for (var px = 0; px < 3; px++) {
      var ox = gx + px * P + 6, oy = gy + py * P + 6, sw = (P - 12) / 3;
      [[st.r, '255,60,60'], [st.g, '60,230,90'], [st.b, '70,110,255']].forEach(function (ch, i) {
        var a = ch[0] / 255;
        c.fillStyle = 'rgba(' + ch[1] + ',' + (0.08 + 0.92 * a) + ')';
        c.fillRect(ox + i * sw + 1, oy, sw - 2, P - 12);
      });
    }
    txt(c, L.tr('uvećano: 3 × 3 piksela', 'magnified: 3 × 3 pixels'), gx + P * 1.5, 230, DIM, 'center', 10);
    var col = 'rgb(' + st.r + ',' + st.g + ',' + st.b + ')';
    box(c, 240, 30, 140, 140, col, 'rgba(201,214,226,.5)', 12);
    txt(c, L.tr('kako izgleda', 'how it looks'), 310, 190, DIM, 'center', 10);
    [['R', st.r, COL.d], ['G', st.g, COL.c], ['B', st.b, COL.a]].forEach(function (ch, i) {
      var y = 206 + i * 12;
      box(c, 250, y - 4, 120, 7, 'rgba(201,214,226,.1)', null, 3);
      box(c, 250, y - 4, 120 * ch[1] / 255, 7, ch[2], null, 3);
      txt(c, ch[0], 244, y, ch[2], 'right', 9);
    });
    c.restore();
  });
}

function ppi() {
  var fig = $('lab-ppi');
  if (!fig) return;
  var RES = { hd: [1366, 768], fhd: [1920, 1080], qhd: [2560, 1440], uhd: [3840, 2160] };
  var st = { res: 'fhd', d: 24 };
  var LW = 400, LH = 250;
  function calc() {
    var r = RES[st.res], dp = Math.hypot(r[0], r[1]);
    return { w: r[0], h: r[1], dp: dp, ppi: dp / st.d };
  }
  function readout() {
    var k = calc();
    $('lab-ppi-calc').textContent = '√(' + k.w + '² + ' + k.h + '²) ≈ ' + Math.round(k.dp) + ' px · ' + Math.round(k.dp) + ' / ' + st.d + '″';
    $('lab-ppi-result').textContent = '≈ ' + Math.round(k.ppi) + ' PPI · ' + L.tr('piksel ≈ ', 'pixel ≈ ') + L.fmtNum(25.4 / k.ppi, 3) + ' mm';
    var q = k.ppi < 80 ? ['Krupni pikseli: slova izgledaju „zrnasto” sa uobičajene udaljenosti.', 'Large pixels: text looks "grainy" from a normal distance.'] : k.ppi < 120 ? ['Uobičajena gustina za monitor na stolu.', 'A usual density for a desk monitor.'] : ['Velika gustina: vrlo oštro, ali sistem obično uvećava prikaz (skaliranje).', 'High density: very sharp, but the system usually enlarges the view (scaling).'];
    $('lab-ppi-note').textContent = L.tr(q[0], q[1]);
  }
  seg('ppi-res', function (v) { st.res = v; readout(); });
  L.range('ppi-d', { obj: st, key: 'd', fmt: function (v) { return v + '″'; }, on: readout });
  L.onLang(readout);
  readout();
  C.scene(fig, function (c, s) {
    var k = calc();
    c.save();
    C.fit(c, s, LW, LH);
    var sc = 5.2, wIn = st.d * 16 / Math.hypot(16, 9), hIn = st.d * 9 / Math.hypot(16, 9);
    var w = wIn * sc, h = hIn * sc, x = 16 + (220 - w) / 2, y = 20 + (130 - h) / 2;
    if (w > 220) { sc = 220 / wIn; w = 220; h = hIn * sc; x = 16; y = 20 + (130 - h) / 2; }
    box(c, x - 4, y - 4, w + 8, h + 8, '#05080b', INK, 4);
    var g = c.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, 'rgba(108,198,238,.5)'); g.addColorStop(1, 'rgba(179,155,242,.5)');
    c.fillStyle = g; c.fillRect(x, y, w, h);
    c.strokeStyle = COL.f; c.setLineDash([4, 3]); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x, y + h); c.lineTo(x + w, y); c.stroke(); c.setLineDash([]);
    txt(c, st.d + '″', x + w / 2 + 10, y + h / 2 - 8, COL.f, 'left', 11);
    c.fillStyle = INK; c.fillRect(x + w / 2 - 4, y + h + 4, 8, 14); c.fillRect(x + w / 2 - 22, y + h + 18, 44, 4);
    txt(c, k.w + ' × ' + k.h, 126, 196, INK, 'center', 11);
    var zx = 262, zy = 30, Z = 120;
    box(c, zx - 2, zy - 2, Z + 4, Z + 4, '#05080b', COL.a, 3);
    var n = k.ppi / 10, cell = Z / n;
    for (var i = 0; i < Math.ceil(n); i++) for (var j = 0; j < Math.ceil(n); j++) {
      var cx0 = zx + i * cell, cy0 = zy + j * cell;
      if (cx0 > zx + Z || cy0 > zy + Z) continue;
      var sw = cell / 3;
      ['rgba(255,80,80,.75)', 'rgba(80,230,110,.75)', 'rgba(90,130,255,.75)'].forEach(function (cl, q) {
        c.fillStyle = cl;
        c.fillRect(cx0 + q * sw + 0.25, cy0 + 0.25, Math.max(0.3, sw - 0.5), Math.max(0.3, cell - 0.5));
      });
    }
    txt(c, L.tr('0,1 inča (2,54 mm), uvećano', '0.1 inch (2.54 mm), magnified'), zx + Z / 2, zy + Z + 14, DIM, 'center', 9.5);
    txt(c, '≈ ' + Math.round(n) + L.tr(' piksela', ' pixels'), zx + Z / 2, zy + Z + 30, COL.a, 'center', 10.5);
    c.restore();
  });
}

function bandwidth() {
  var fig = $('lab-bw');
  if (!fig) return;
  var RES = { fhd: [1920, 1080], qhd: [2560, 1440], uhd: [3840, 2160] };
  var IF = [['DVI single', 3.96], ['DVI dual', 7.92], ['HDMI 1.4', 8.16], ['HDMI 2.0', 14.4], ['DP 1.4', 25.92], ['HDMI 2.1', 42.67], ['DP 2.1', 77.37]];
  var st = { res: 'fhd', hz: 60, bit: 24, t: 0 };
  var LW = 400, LH = 250;
  function need() { var r = RES[st.res]; return r[0] * r[1] * st.hz * st.bit * 1.1 / 1e9; }
  function readout() {
    var r = RES[st.res], n = need();
    $('lab-bw-calc').textContent = r[0] + ' × ' + r[1] + ' × ' + st.hz + ' Hz × ' + st.bit + L.tr(' bita + 10 % ≈ ', ' bit + 10 % ≈ ') + L.fmtNum(n, 1) + ' Gb/s';
    var ok = IF.filter(function (x) { return x[1] >= n; }).map(function (x) { return x[0]; });
    $('lab-bw-result').textContent = ok.length ? L.tr('Dovoljno: ', 'Enough: ') + ok.join(', ') : L.tr('Nijedan priključak bez kompresije', 'No connector without compression');
    $('lab-bw-note').textContent = L.tr('Kada je potrebno više, koristi se kompresija slike DSC ili se smanji osvežavanje. Brojke su okvirne.', 'When more is needed, DSC image compression is used or the refresh rate is lowered. The figures are approximate.');
  }
  seg('bw-res', function (v) { st.res = v; readout(); });
  seg('bw-hz', function (v) { st.hz = +v; readout(); });
  seg('bw-bit', function (v) { st.bit = +v; readout(); });
  L.onLang(readout);
  readout();
  function X(v) { return 92 + (Math.log(v) / Math.LN10 - 0) / 2 * 290; }
  C.scene(fig, function (c, s, dt) {
    st.t += dt;
    var n = need();
    c.save();
    C.fit(c, s, LW, LH);
    [1, 2, 5, 10, 20, 50, 100].forEach(function (v) {
      var x = X(v);
      c.strokeStyle = FAINT; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, 14); c.lineTo(x, 222); c.stroke();
      txt(c, v + '', x, 232, DIM, 'center', 9);
    });
    txt(c, 'Gb/s', 388, 244, DIM, 'right', 9);
    IF.forEach(function (f, i) {
      var y = 24 + i * 28, ok = f[1] >= n, x1 = X(f[1]);
      txt(c, f[0], 86, y + 6, ok ? INK : DIM, 'right', 10);
      box(c, X(1), y, x1 - X(1), 13, ok ? 'rgba(111,207,151,.35)' : 'rgba(242,139,130,.3)', ok ? COL.c : COL.d, 3, 1);
      var sp = f[1] / 10;
      c.fillStyle = ok ? COL.c : COL.d;
      for (var d = 0; d < 6; d++) {
        var p = ((st.t * sp * 0.5 + d / 6) % 1);
        c.beginPath(); c.arc(X(1) + 4 + p * (x1 - X(1) - 8), y + 6.5, 2.2, 0, TAU); c.fill();
      }
    });
    var xn = X(Math.max(1, Math.min(100, n)));
    c.strokeStyle = COL.f; c.lineWidth = 2; c.setLineDash([5, 4]);
    c.beginPath(); c.moveTo(xn, 14); c.lineTo(xn, 220); c.stroke(); c.setLineDash([]);
    C.chipLabel(c, L.fmtNum(n, 1) + ' Gb/s', Math.min(360, Math.max(120, xn)), 10, COL.f, 10);
    c.restore();
  });
}

function post() {
  var fig = $('lab-post');
  if (!fig) return;
  var STAGES = ['CPU', 'DRAM', 'VGA', 'BOOT'];
  var STOP = { ok: 4, cpu: 0, ram: 1, gpu: 2, boot: 3 };
  var BEEP = { ok: [0], cpu: [], ram: [1, 1, 1], gpu: [1, 0, 0, 0], boot: [0] };
  var st = { fault: 'ok', t: 0 };
  var LW = 400, LH = 250, STEP = 0.9;
  function readout() {
    var m = {
      ok: ['Sve četiri provere su prošle, jedan kratak pisak, kreće učitavanje sistema.', 'All four checks passed, one short beep, the system starts loading.', 'Računar je ispravan.', 'The computer is fine.'],
      cpu: ['Provera stoji na prvom koraku, lampica CPU svetli, nema piska ni slike.', 'The check stops at the first step, the CPU LED is lit, no beep and no picture.', 'Proveri EPS kabl, hladnjak i da li ploča podržava procesor (BIOS).', 'Check the EPS cable, the cooler and whether the board supports the processor (BIOS).'],
      ram: ['Provera stoji kod memorije, lampica DRAM svetli i ponavlja se dug pisak.', 'The check stops at memory, the DRAM LED is lit and a long beep repeats.', 'Izvadi i vrati RAM do klika, probaj jedan po jedan modul.', 'Reseat the RAM until it clicks, try one module at a time.'],
      gpu: ['Provera stoji kod grafike, lampica VGA svetli; jedan dug i tri kratka piska.', 'The check stops at graphics, the VGA LED is lit; one long and three short beeps.', 'Proveri karticu u slotu, njeno napajanje i kabl monitora.', 'Check the card in its slot, its power and the monitor cable.'],
      boot: ['Hardver je prošao, ali nema uređaja sa kog se pokreće sistem; lampica BOOT svetli.', 'The hardware passed, but there is no device to start the system from; the BOOT LED is lit.', 'Proveri disk u BIOS-u (kablovi, redosled pokretanja).', 'Check the drive in the BIOS (cables, boot order).']
    }[st.fault];
    $('lab-post-calc').textContent = L.tr(m[0], m[1]);
    $('lab-post-result').textContent = L.tr(m[2], m[3]);
    $('lab-post-note').textContent = L.tr('Signali su primer; tačna značenja piše u priručniku ploče.', 'The patterns are an example; the exact meanings are in the board manual.');
  }
  seg('post-fault', function (v) { st.fault = v; st.t = 0; readout(); });
  $('post-run').addEventListener('click', function () { st.t = 0; });
  L.onLang(readout);
  readout();
  C.scene(fig, function (c, s, dt) {
    st.t += dt;
    var stop = STOP[st.fault];
    var cur = Math.min(stop, Math.floor(st.t / STEP));
    var finished = st.t >= (stop + 0.6) * STEP;
    c.save();
    C.fit(c, s, LW, LH);
    box(c, 14, 14, 230, 222, 'rgba(111,207,151,.08)', 'rgba(111,207,151,.5)', 10);
    txt(c, L.tr('matična ploča', 'motherboard'), 129, 30, 'rgba(111,207,151,.8)', 'center', 10);
    STAGES.forEach(function (name, i) {
      var y = 60 + i * 38;
      var passed = i < cur || (st.fault === 'ok' && finished);
      var active = i === cur && !(st.fault === 'ok' && finished);
      var stuck = active && finished;
      var glow = active ? (stuck ? 1 : 0.5 + 0.5 * Math.sin(st.t * 12)) : 0;
      c.fillStyle = passed ? 'rgba(111,207,151,.9)' : active ? 'rgba(245,160,60,' + (0.3 + 0.7 * glow) + ')' : 'rgba(201,214,226,.15)';
      c.beginPath(); c.arc(40, y, 8, 0, TAU); c.fill();
      if (active) { c.strokeStyle = 'rgba(245,160,60,.5)'; c.lineWidth = 6; c.beginPath(); c.arc(40, y, 13, 0, TAU); c.stroke(); }
      txt(c, name, 60, y, passed ? COL.c : active ? COL.b : DIM, 'left', 12);
      txt(c, passed ? '✓' : stuck ? '✗' : '', 120, y, passed ? COL.c : COL.d, 'left', 12);
    });
    box(c, 160, 190, 60, 34, 'rgba(201,214,226,.08)', DIM, 4);
    c.strokeStyle = INK; c.lineWidth = 1.5;
    c.beginPath(); c.arc(176, 207, 7, 0, TAU); c.stroke();
    var pattern = BEEP[st.fault];
    var showBeep = finished;
    if (showBeep) {
      var bx = 194;
      if (!pattern.length) txt(c, L.tr('tišina', 'silence'), bx, 207, DIM, 'left', 9.5);
      pattern.forEach(function (b, i) {
        var on = Math.floor((st.t - (stop + 0.6) * STEP) * 3) % (pattern.length + 3) >= i;
        c.fillStyle = on ? COL.f : 'rgba(245,200,76,.25)';
        var w = b ? 9 : 3;
        c.fillRect(bx, 203, w, 8);
        bx += w + 3;
      });
    }
    box(c, 262, 54, 124, 86, '#05080b', INK, 6, 1.5);
    c.fillStyle = INK; c.fillRect(318, 140, 12, 14); c.fillRect(300, 154, 48, 4);
    var msg = '', mcol = INK;
    if (!finished) { msg = 'POST…'; mcol = DIM; }
    else if (st.fault === 'ok') { msg = L.tr('Učitavam sistem…', 'Loading system…'); mcol = COL.c; }
    else if (st.fault === 'boot') { msg = 'No bootable device'; mcol = COL.d; }
    else { msg = L.tr('nema signala', 'no signal'); mcol = DIM; }
    txt(c, msg, 324, 97, mcol, 'center', 10.5);
    txt(c, L.tr('monitor', 'monitor'), 324, 172, DIM, 'center', 9.5);
    c.restore();
  });
}

function swap() {
  var fig = $('lab-swap');
  if (!fig) return;
  var inf = $('lab-swap-info');
  var st = { part: 'ram', step: 1, t: 0 };
  var LW = 400, LH = 250;
  var P = {
    ram: { x: 168, y: 40, w: 7, h: 74, out: [0, -60], label: 'RAM' },
    disk: { x: 300, y: 150, w: 76, h: 24, out: [70, 0], label: 'HDD' },
    psu: { x: 24, y: 196, w: 120, h: 38, out: [-110, 0], label: 'PSU' },
    gpu: { x: 40, y: 140, w: 170, h: 22, out: [0, 70], label: 'GPU' },
    paste: { x: 92, y: 56, w: 56, h: 52, out: [0, -60], label: '' }
  };
  var TXT = {
    ram: [['Pripremi', 'Prepare', 'Isključi računar, izvuci kabl, dodirni kućište. Otvori bravice na krajevima slota.', 'Shut down, pull the cable, touch the case. Open the latches at the ends of the slot.'], ['Izvadi stari modul', 'Remove the old module', 'Modul sam iskoči kad se bravice otvore. Uhvati ga za ivice i izvuci ravno nagore.', 'The module pops up when the latches open. Hold it by the edges and pull it straight up.'], ['Ugradi novi', 'Fit the new one', 'Poravnaj urez sa ispupčenjem u slotu i pritisni oba kraja dok bravice ne kliknu.', 'Line up the notch with the key in the slot and press both ends until the latches click.'], ['Proveri', 'Test', 'Upali računar, proveri da BIOS vidi pun kapacitet, pa pusti MemTest86.', 'Switch on, check that the BIOS shows the full capacity, then run MemTest86.']],
    disk: [['Bekap i kablovi', 'Backup and cables', 'Ako je moguće, prvo kloniraj ili kopiraj podatke. Zatim isključi SATA kablove sa diska.', 'If possible, clone or copy the data first. Then unplug the SATA cables from the drive.'], ['Izvadi stari disk', 'Remove the old drive', 'Odvrni četiri zavrtnja (ili otvori šine) i izvuci disk iz kaveza.', 'Remove the four screws (or open the rails) and slide the drive out of the cage.'], ['Ugradi novi', 'Fit the new one', 'Novi disk ubaci na isto mesto, konektorima ka zadnjoj strani, i pričvrsti ga.', 'Slide the new drive into the same place, connectors to the back, and fix it.'], ['Kablovi i sistem', 'Cables and system', 'Vrati SATA podatke i napajanje. Proveri BIOS, pa inicijalizuj i formatiraj ili pokreni klonirani sistem.', 'Reconnect SATA data and power. Check the BIOS, then initialise and format, or boot the cloned system.']],
    psu: [['Isključi sve', 'Disconnect everything', 'Izvuci kabl iz zida, pa isključi 24-pin, EPS, PCIe i SATA kablove. Fotografiši raspored.', 'Pull the cable from the wall, then unplug the 24-pin, EPS, PCIe and SATA cables. Photograph the layout.'], ['Izvadi staro napajanje', 'Remove the old PSU', 'Odvrni četiri zavrtnja na zadnjoj strani kućišta i izvuci napajanje. Ne otvaraj ga.', 'Remove the four screws at the back of the case and take out the PSU. Do not open it.'], ['Ugradi novo', 'Fit the new one', 'Ventilator okreni ka filteru (obično nadole) i pričvrsti ga sa četiri zavrtnja.', 'Point the fan at the filter (usually down) and fix it with four screws.'], ['Samo njegovi kablovi', 'Only its own cables', 'Priključi kablove koji su došli uz novo napajanje, po fotografiji. Uključi i proveri.', 'Connect the cables that came with the new PSU, following the photo. Switch on and test.']],
    gpu: [['Drajver i kablovi', 'Driver and cables', 'Ukloni stari drajver (DDU), ugasi računar, izvuci kabl i isključi napajanje kartice.', 'Remove the old driver (DDU), shut down, pull the cable and unplug the card\'s power.'], ['Izvadi staru karticu', 'Remove the old card', 'Odvrni nosač, pritisni bravicu na kraju PCIe slota i izvuci karticu ravno.', 'Unscrew the bracket, press the latch at the end of the PCIe slot and pull the card out straight.'], ['Ugradi novu', 'Fit the new one', 'Spusti novu karticu u slot do klika i zavrni nosač.', 'Lower the new card into the slot until it clicks and screw in the bracket.'], ['Napajanje i drajver', 'Power and driver', 'Priključi napajanje kartice i monitor u karticu, upali računar i instaliraj novi drajver.', 'Connect the card\'s power and the monitor to the card, switch on and install the new driver.']],
    paste: [['Skini hladnjak', 'Remove the cooler', 'Isključi CPU_FAN, otpusti zavrtnje unakrsno, lagano zakreni hladnjak i podigni ga.', 'Unplug CPU_FAN, loosen the screws crosswise, twist the cooler gently and lift it.'], ['Očisti staru pastu', 'Clean off the old paste', 'Obriši procesor i dno hladnjaka krpicom sa izopropil alkoholom dok ne zasijaju.', 'Wipe the processor and the cooler base with a cloth and isopropyl alcohol until they shine.'], ['Nova pasta', 'New paste', 'Stavi zrno paste veličine graška u sredinu procesora. Ne razmazuj ga.', 'Put a pea-sized dot of paste in the middle of the processor. Do not spread it.'], ['Vrati hladnjak', 'Refit the cooler', 'Spusti hladnjak ravno, zavrni unakrsno, vrati CPU_FAN i proveri temperature.', 'Lower the cooler straight, tighten crosswise, reconnect CPU_FAN and check the temperatures.']]
  };
  function paint() {
    var x = TXT[st.part][st.step - 1];
    info(inf, st.step, both(x[0], x[1]), both(x[2], x[3]));
  }
  seg('swap-part', function (v) { st.part = v; st.step = 1; st.t = 0; C.setSeg($('swap-step'), 1); paint(); });
  seg('swap-step', function (v) { st.step = +v; st.t = 0; paint(); });
  L.onLang(paint);
  paint();
  function drawPart(c, key, x, y, color, stroke) {
    var p = P[key];
    box(c, x, y, p.w, p.h, color, stroke, 3, 1.5);
    if (key === 'paste') {
      for (var f = 0; f < 6; f++) { c.fillStyle = 'rgba(12,19,27,.35)'; c.fillRect(x + 4, y + 6 + f * 7, p.w - 8, 3); }
    }
    if (key === 'ram') txt(c, 'RAM', x + p.w / 2, y - 8, INK, 'center', 9.5);
    else txt(c, key === 'paste' ? L.tr('hladnjak', 'cooler') : p.label, x + p.w / 2, y + p.h / 2, '#0c131b', 'center', key === 'paste' ? 8.5 : 10);
  }
  C.scene(fig, function (c, s, dt) {
    st.t += dt;
    c.save();
    C.fit(c, s, LW, LH);
    box(c, 14, 14, 372, 226, 'rgba(255,255,255,.02)', DIM, 10);
    box(c, 26, 24, 200, 156, 'rgba(111,207,151,.10)', 'rgba(111,207,151,.5)', 8);
    box(c, 100, 64, 40, 40, 'rgba(201,214,226,.18)', DIM, 3);
    txt(c, 'CPU', 120, 84, DIM, 'center', 9.5);
    for (var i = 0; i < 4; i++) box(c, 160 + i * 9, 40, 5, 74, 'rgba(201,214,226,.14)', null, 1);
    box(c, 40, 162, 170, 5, 'rgba(201,214,226,.25)', null, 1);
    box(c, 290, 120, 92, 92, null, FAINT, 3);
    box(c, 22, 192, 128, 44, null, FAINT, 3);
    var cur = st.part, p = P[cur];
    var redK = st.step === 2 ? ease(st.t / 1.3) : st.step > 2 ? 1 : 0;
    var greenK = st.step === 3 ? ease(st.t / 1.3) : st.step > 3 ? 1 : 0;
    Object.keys(P).forEach(function (k) {
      if (k === cur) return;
      drawPart(c, k, P[k].x, P[k].y, 'rgba(201,214,226,.3)', null);
    });
    if (cur === 'paste') {
      var oldPaste = st.step === 1 ? 1 : st.step === 2 ? 1 - ease(st.t / 1.5) : 0;
      if (oldPaste > 0) { c.fillStyle = 'rgba(160,150,140,' + 0.8 * oldPaste + ')'; c.beginPath(); c.ellipse(120, 84, 16, 13, 0.3, 0, TAU); c.fill(); }
      if (st.step >= 3) { var g = st.step === 3 ? ease(st.t / 0.8) : 1; c.fillStyle = 'rgba(220,226,232,.95)'; c.beginPath(); c.arc(120, 84, 5 * g, 0, TAU); c.fill(); }
      var lift = st.step === 1 ? ease(st.t / 1.2) : st.step === 4 ? 1 - ease(st.t / 1.2) : 1;
      drawPart(c, 'paste', p.x, p.y + p.out[1] * lift, st.step === 4 ? COL.c : 'rgba(201,214,226,.75)', null);
      if (st.step === 2) { c.strokeStyle = 'rgba(108,198,238,.8)'; c.lineWidth = 2; var a = st.t * 6; c.beginPath(); c.arc(120 + Math.cos(a) * 10, 84 + Math.sin(a) * 8, 6, 0, TAU); c.stroke(); }
    } else {
      if (redK < 1) {
        if (st.step === 1) { c.save(); c.setLineDash([5, 4]); box(c, p.x - 4, p.y - 4, p.w + 8, p.h + 8, null, 'rgba(242,139,130,' + (0.5 + 0.5 * Math.sin(st.t * 5)) + ')', 4, 2); c.restore(); }
        drawPart(c, cur, p.x + p.out[0] * redK, p.y + p.out[1] * redK, COL.d, null);
      }
      if (st.step >= 3) drawPart(c, cur, p.x + p.out[0] * (1 - greenK), p.y + p.out[1] * (1 - greenK), COL.c, null);
      var cabled = st.step === 1 ? 1 - ease(st.t / 0.8) : st.step === 4 ? ease(st.t / 1.2) : 0;
      if (cur !== 'ram' && cabled > 0) {
        var ends = { disk: [[p.x, p.y + 8], [240, p.y + 8], [240, 120], [226, 120]], psu: [[p.x + p.w, p.y + 10], [236, p.y + 10], [236, 70], [226, 70]], gpu: [[p.x + p.w, p.y + 4], [250, p.y + 4], [250, 220], [150, 220]] }[cur];
        cable(c, ends, COL.f, cabled, 3);
      }
    }
    if (st.step === 4 && st.t > 1.3) txt(c, L.tr('✓ radi', '✓ works'), 330, 40, COL.c, 'center', 13);
    c.restore();
  });
}

drive();
gpu();
kbd();
input();
poll();
rgbLab();
ppi();
bandwidth();
post();
swap();
})();
