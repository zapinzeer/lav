(function () {
'use strict';

var C = window.LAVC;
var WIRE = '#8da2b5';

function simulate(o) {
  var f = o.f, T = 1 / f, per = 500, dt = T / per, warm = 3, show = o.show || 2;
  var nd = o.nd || 1, vg = o.Vg, R = o.R, Cc = o.C || 0, Um = o.Um, Rs = o.Rs || 0.1;
  var sgn = o.flip ? -1 : 1, full = !!o.full, il = o.I != null ? o.I : null;
  var total = (warm + show) * per, uc = 0;
  var sim = { dt: dt, T: T, n: show * per, show: show, us: [], uo: [], id: [], on: [], vr: [] };
  var sub = 8, h = dt / sub;
  for (var k = 0; k < total; k++) {
    var t = k * dt;
    var us = Um * Math.sin(2 * Math.PI * f * t);
    var v = full ? Math.abs(us) : Math.max(0, sgn * us);
    var target = v - nd * vg, uo, id = 0, on = false;
    if (Cc > 0) {
      var uStart = uc;
      for (var s = 0; s < sub; s++) {
        var ts = t + s * h, us2 = Um * Math.sin(2 * Math.PI * f * ts);
        var v2 = full ? Math.abs(us2) : Math.max(0, sgn * us2), tg = v2 - nd * vg, ic = 0;
        if (tg > uc) { ic = (tg - uc) / Rs; on = true; }
        uc += h / Cc * (ic - ((il != null ? (uc > 0.5 ? il : 0) : uc / R)));
        if (uc < 0) uc = 0;
      }
      uo = uc;
      id = on ? Math.max(0, Cc * (uc - uStart) / dt + (il != null ? il : uc / R)) : 0;
    } else {
      uo = Math.max(0, target);
      on = target > 0;
      id = uo / R;
    }
    if (k >= warm * per) {
      sim.us.push(us);
      sim.uo.push(uo);
      sim.id.push(id);
      sim.on.push(on);
      sim.vr.push(full ? Um : uo - sgn * us);
    }
  }
  var last = sim.uo.slice(sim.n - per), mx = -1e9, mn = 1e9, sum = 0, idMax = 0, idSum = 0;
  for (var i = 0; i < last.length; i++) { mx = Math.max(mx, last[i]); mn = Math.min(mn, last[i]); sum += last[i]; }
  for (var j = sim.n - per; j < sim.n; j++) { idMax = Math.max(idMax, sim.id[j]); idSum += sim.id[j]; }
  var piv = 0;
  for (var m = 0; m < sim.vr.length; m++) piv = Math.max(piv, sim.vr[m]);
  sim.stat = { max: mx, min: mn, avg: sum / last.length, ripple: mx - mn, idMax: idMax, idAvg: idSum / per, piv: piv };
  return sim;
}

function sample(arr, dt, t, wrap) {
  var x = t / dt, n = arr.length, i = Math.floor(x);
  if (wrap) { i = ((i % n) + n) % n; return arr[i] + (arr[(i + 1) % n] - arr[i]) * (x - Math.floor(x)); }
  if (i < 0) return arr[0];
  if (i >= n - 1) return arr[n - 1];
  return arr[i] + (arr[i + 1] - arr[i]) * (x - i);
}

function diode(c, x, y, ang, on, color) {
  c.save();
  c.translate(x, y);
  c.rotate(ang);
  c.lineCap = 'round';
  c.lineWidth = 2.4;
  c.strokeStyle = WIRE;
  c.beginPath();
  c.moveTo(-22, 0); c.lineTo(-9, 0);
  c.moveTo(9, 0); c.lineTo(22, 0);
  c.stroke();
  c.beginPath();
  c.moveTo(-9, -10); c.lineTo(-9, 10); c.lineTo(9, 0); c.closePath();
  if (on) {
    c.shadowColor = color || '#6fcf97';
    c.shadowBlur = 12;
    c.fillStyle = color || '#6fcf97';
    c.fill();
    c.shadowBlur = 0;
  } else {
    c.fillStyle = 'rgba(15,22,30,.96)';
    c.fill();
  }
  c.strokeStyle = on ? (color || '#6fcf97') : WIRE;
  c.stroke();
  c.beginPath();
  c.moveTo(9, -10); c.lineTo(9, 10);
  c.stroke();
  c.restore();
}

function resistor(c, x, y, ang, len, col) {
  c.save();
  c.translate(x, y);
  c.rotate(ang);
  c.fillStyle = 'rgba(15,22,30,.96)';
  c.strokeStyle = col || '#c77a43';
  c.lineWidth = 2.6;
  c.beginPath();
  c.rect(-len / 2, -8, len, 16);
  c.fill();
  c.stroke();
  c.restore();
}

function capacitor(c, x, y, ang, col) {
  c.save();
  c.translate(x, y);
  c.rotate(ang);
  c.strokeStyle = col || '#6cc6ee';
  c.lineWidth = 3;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(-3.5, -13); c.lineTo(-3.5, 13);
  c.moveTo(3.5, -13); c.lineTo(3.5, 13);
  c.stroke();
  c.restore();
}

function source(c, x, y, r, us, Um) {
  c.save();
  c.fillStyle = 'rgba(15,22,30,.97)';
  c.strokeStyle = WIRE;
  c.lineWidth = 2.4;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.strokeStyle = '#e9f0f6';
  c.lineWidth = 2;
  c.beginPath();
  for (var i = 0; i <= 20; i++) {
    var px = x - 11 + i * 1.1, py = y - 6 * Math.sin(i / 20 * Math.PI * 2);
    if (i) c.lineTo(px, py); else c.moveTo(px, py);
  }
  c.stroke();
  var a = Math.abs(us) / Um;
  c.font = '800 13px Archivo, system-ui, sans-serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.globalAlpha = 0.35 + 0.65 * a;
  c.fillStyle = us >= 0 ? '#ff9b8f' : '#8fb3ff';
  c.fillText(us >= 0 ? '+' : '−', x + 15, y - r + 2);
  c.fillStyle = us >= 0 ? '#8fb3ff' : '#ff9b8f';
  c.fillText(us >= 0 ? '−' : '+', x + 15, y + r - 2);
  c.restore();
}

function dots(c, pts, phase, alpha, color) {
  if (alpha <= 0.02) return;
  C.flowDots(c, pts, phase, { spacing: 16, r: 3.1, color: color || '#ffb468', alpha: Math.min(1, alpha) });
}

function node(c, x, y) {
  c.fillStyle = WIRE;
  c.beginPath();
  c.arc(x, y, 3.6, 0, Math.PI * 2);
  c.fill();
}

function speed(i, imax) {
  if (i <= 0 || imax <= 0) return 0;
  return 150 * Math.pow(Math.min(1, i / imax), 0.55);
}

window.LAVR = { simulate: simulate, sample: sample, diode: diode, resistor: resistor, capacitor: capacitor, source: source, dots: dots, node: node, speed: speed, WIRE: WIRE };
})();
