(function () {
'use strict';

var L = window.LAV;
var C = window.LAVC;
var COL = C.COL;
var TAU = Math.PI * 2;

function $(id) { return document.getElementById(id); }
function piLabel(v) {
  var k = Math.round(v / Math.PI * 2) / 2;
  if (Math.abs(k) < 1e-9) return '0';
  return (k === 1 ? '' : L.fmtNum(k, k % 1 ? 1 : 0)) + 'π';
}

var SETS = {
  one: { axes: [0], shifts: [0] },
  two: { axes: [0, Math.PI / 2], shifts: [0, Math.PI / 2] },
  three: { axes: [0, TAU / 3, 2 * TAU / 3], shifts: [0, TAU / 3, 2 * TAU / 3] }
};
var PC = [COL.a, COL.b, COL.c];

function rotating(id) {
  var fig = $(id), cvs = fig.querySelectorAll('canvas');
  var st = { mode: 'three', speed: 0.2, th: 0, rot: 0, rotV: 0 };
  var plot = new C.Plot(cvs[1], { x: [0, 2 * TAU], y: [-1.25, 1.25], xt: 8, yt: 2, xl: 'ωt', yl: 'i', pad: { l: 14, r: 14, t: 16, b: 34 }, xf: piLabel, yf: function () { return ''; } });

  function field(th) {
    var s = SETS[st.mode], x = 0, y = 0, parts = [];
    for (var k = 0; k < s.axes.length; k++) {
      var i = Math.cos(th - s.shifts[k]);
      parts.push(i);
      x += i * Math.cos(s.axes[k]);
      y += i * Math.sin(s.axes[k]);
    }
    return { x: x, y: y, m: Math.hypot(x, y), a: Math.atan2(y, x), parts: parts };
  }

  function readout() {
    $(id + '-calc').textContent = st.mode === 'three'
      ? 'B = B₁ + B₂ + B₃ · i₁ = I_m cos ωt, i₂ = I_m cos(ωt − 120°), i₃ = I_m cos(ωt − 240°)'
      : st.mode === 'two'
        ? 'B = B₁ + B₂ · i₁ = I_m cos ωt, i₂ = I_m sin ωt'
        : 'B = B₁ · i₁ = I_m cos ωt';
    $(id + '-result').textContent = st.mode === 'three'
      ? L.tr('|B| = 1,5·B_m, stalno, i obrće se brzinom ω', '|B| = 1.5·B_m, constant, turning at the speed ω')
      : st.mode === 'two'
        ? L.tr('|B| = B_m, stalno, i obrće se brzinom ω', '|B| = B_m, constant, turning at the speed ω')
        : L.tr('|B| pulsira od −B_m do +B_m duž jedne ose', '|B| pulses from −B_m to +B_m along one axis');
    $(id + '-note').textContent = st.mode === 'one'
      ? L.tr('Jedna faza daje polje koje samo menja smer, a ne obrće se. Rotor koji stoji ne zna na koju stranu da krene, pa sam ne polazi.', 'One phase gives a field that only reverses, it does not rotate. A rotor at rest does not know which way to go, so it does not start by itself.')
      : L.tr('Polje se obrće iako se nijedan deo statora ne kreće. Rotor ga prati malo sporije (klizanje), jer se struja u njemu indukuje samo dok zaostaje za poljem.', 'The field rotates although no part of the stator moves. The rotor follows it a little slower (slip), because current is induced in it only while it lags behind the field.');
  }
  C.toggle($(id + '-mode'), function (v) { st.mode = v; readout(); });
  L.range(id + '-sp', { obj: st, key: 'speed', fmt: function (v) { return L.fmtNum(v, 2) + ' ' + L.tr('o/s', 'rev/s'); } });
  L.onLang(readout);

  var LW = 380, LH = 250, CX = 130, CY = 125, R1 = 82, R2 = 104;
  function draw(c, s, dt) {
    st.th = (st.th + dt * st.speed * TAU) % (2 * TAU);
    var f = field(st.th);
    var target = st.mode === 'one' ? 0 : st.speed * TAU * 0.92;
    st.rotV += (target - st.rotV) * Math.min(1, dt * 1.5);
    st.rot = (st.rot + st.rotV * dt) % TAU;
    c.save();
    C.fit(c, s, LW, LH);

    c.fillStyle = 'rgba(201,214,226,.14)';
    c.beginPath(); c.arc(CX, CY, R2, 0, TAU); c.arc(CX, CY, R1, 0, TAU, true); c.fill();
    c.strokeStyle = 'rgba(201,214,226,.4)';
    c.lineWidth = 1.2;
    c.beginPath(); c.arc(CX, CY, R2, 0, TAU); c.stroke();
    c.beginPath(); c.arc(CX, CY, R1, 0, TAU); c.stroke();

    var set = SETS[st.mode];
    set.axes.forEach(function (a, k) {
      var col = PC[k], lev = f.parts[k];
      [a, a + Math.PI].forEach(function (b, side) {
        c.save();
        c.translate(CX + Math.cos(b) * (R1 + R2) / 2, CY - Math.sin(b) * (R1 + R2) / 2);
        c.rotate(-b);
        c.fillStyle = col;
        c.globalAlpha = 0.25 + 0.65 * Math.abs(lev);
        c.fillRect(-11, -16, 22, 32);
        c.globalAlpha = 1;
        c.fillStyle = '#0f161e';
        c.font = '700 12px "IBM Plex Mono", monospace';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.rotate(b);
        var sym = (lev >= 0) === (side === 0) ? '•' : '×';
        if (Math.abs(lev) > 0.08) c.fillText(sym, 0, 0);
        c.restore();
      });
      C.label(c, String(k + 1), CX + Math.cos(a) * (R2 + 12), CY - Math.sin(a) * (R2 + 12), col, 'center', 12);
    });

    c.save();
    c.translate(CX, CY);
    c.rotate(-st.rot);
    var g = c.createRadialGradient(0, 0, 4, 0, 0, 46);
    g.addColorStop(0, 'rgba(210,140,90,.55)');
    g.addColorStop(1, 'rgba(160,95,55,.55)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,190,140,.6)';
    c.lineWidth = 2;
    for (var b = 0; b < 12; b++) {
      var ang = b * TAU / 12;
      c.beginPath(); c.moveTo(Math.cos(ang) * 18, Math.sin(ang) * 18); c.lineTo(Math.cos(ang) * 44, Math.sin(ang) * 44); c.stroke();
    }
    c.restore();

    var k = (R1 - 8) / (st.mode === 'three' ? 1.5 : 1);
    set.axes.forEach(function (a, n) {
      var v = f.parts[n] * k;
      if (Math.abs(v) > 3) C.arrow(c, CX, CY, CX + Math.cos(a) * v, CY - Math.sin(a) * v, PC[n], 2, 8);
    });
    if (f.m * k > 4) C.arrow(c, CX, CY, CX + f.x * k, CY - f.y * k, COL.w, 3.4, 12);
    c.fillStyle = COL.w;
    c.beginPath(); c.arc(CX, CY, 3, 0, TAU); c.fill();

    var lx = 262;
    C.label(c, L.tr('struje faza', 'phase currents'), lx, 40, 'rgba(201,214,226,.7)', 'left', 10.5);
    set.axes.forEach(function (a, n) {
      var y = 62 + n * 22, v = f.parts[n];
      C.label(c, 'i' + (n + 1), lx, y, PC[n], 'left', 12);
      c.fillStyle = 'rgba(201,214,226,.15)';
      c.fillRect(lx + 26, y - 5, 80, 10);
      c.fillStyle = PC[n];
      var w = v * 40;
      c.fillRect(lx + 66 + Math.min(0, w), y - 5, Math.abs(w), 10);
    });
    C.label(c, L.tr('ukupno polje B', 'total field B'), lx, 150, 'rgba(201,214,226,.7)', 'left', 10.5);
    C.label(c, '|B| = ' + L.fmtNum(f.m, 2) + '·B_m', lx, 172, COL.w, 'left', 12);
    C.label(c, L.tr('rotor', 'rotor') + ': ' + L.fmtNum(st.rotV / TAU, 2) + ' ' + L.tr('o/s', 'rev/s'), lx, 200, '#e3a47a', 'left', 12);
    c.restore();

    if (plot.begin()) {
      set.shifts.forEach(function (sh, n) { plot.line(function (x) { return Math.cos(x - sh); }, PC[n], 2.2); });
      plot.vline(st.th, 'rgba(238,243,247,.5)', 1, [4, 4]);
      set.shifts.forEach(function (sh, n) { plot.dot(st.th, Math.cos(st.th - sh), PC[n], 4.5); });
    }
  }

  L.loop(fig, function (dt) {
    var w = cvs[0].clientWidth, h = cvs[0].clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cvs[0].width !== Math.round(w * dpr)) { cvs[0].width = Math.round(w * dpr); cvs[0].height = Math.round(h * dpr); }
    var c = cvs[0].getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    draw(c, { w: w, h: h }, dt);
  });
  readout();
}

rotating('lab-ts');
})();
