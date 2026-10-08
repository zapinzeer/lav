(function () {
'use strict';

var L = window.LAV;

function sig(x, n) {
  n = n || 3;
  if (x === 0 || !isFinite(x)) return L.fmtNum(0, 0);
  var d = Math.max(0, n - 1 - Math.floor(Math.log10(Math.abs(x))));
  return L.fmtNum(x, Math.min(d, 8));
}
function eng(x, unit, n) {
  n = n || 3;
  var a = Math.abs(x);
  if (a === 0) return '0 ' + unit;
  var pre = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'μ'], [1e-9, 'n'], [1e-12, 'p']];
  for (var i = 0; i < pre.length; i++) if (a >= pre[i][0] * 0.9999) return sig(x / pre[i][0], n) + ' ' + pre[i][1] + unit;
  return sig(x / 1e-12, n) + ' p' + unit;
}

function niceAxis(v) {
  var p = Math.pow(10, Math.floor(Math.log10(v))), mult = [0.2, 0.25, 0.5, 1, 2, 2.5, 5];
  for (var i = 0; i < mult.length; i++) {
    var step = mult[i] * p, n = Math.ceil(v / step - 1e-9);
    if (n >= 3 && n <= 6) return { max: n * step, ticks: n };
  }
  return { max: p * 10, ticks: 5 };
}

function decs(step) {
  var d = 0;
  while (d < 4 && Math.abs(step * Math.pow(10, d) - Math.round(step * Math.pow(10, d))) > 1e-9) d++;
  return d;
}

function nice(x, n) {
  var v = +Number(x).toPrecision(n || 3);
  return L.fmtNum(v, decs(v));
}

function engn(x, unit, n) {
  var a = Math.abs(x);
  if (a === 0) return '0 ' + unit;
  var pre = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'μ'], [1e-9, 'n'], [1e-12, 'p']];
  for (var i = 0; i < pre.length; i++) if (a >= pre[i][0] * 0.9999) return nice(x / pre[i][0], n || 3) + ' ' + pre[i][1] + unit;
  return nice(x / 1e-12, n || 3) + ' p' + unit;
}

function signed(x, d) {
  return (x > 0 ? '+' : x < 0 ? '−' : '') + L.fmtNum(Math.abs(x), d);
}

function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function setText(el, text, html) {
  if (el.__t === text) return;
  el.__t = text;
  if (html) el.innerHTML = text; else el.textContent = text;
}

function setSeg(root, v) {
  root.querySelectorAll('button[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === String(v) ? 'true' : 'false'); });
}

function chipLabel(c, text, x, y, color, size) {
  size = size || 12;
  c.save();
  c.font = '600 ' + size + 'px "IBM Plex Mono", monospace';
  var tw = c.measureText(text).width + 10;
  c.fillStyle = 'rgba(12,19,27,.96)';
  rrect(c, x - tw / 2, y - size / 2 - 3, tw, size + 6, 5);
  c.fill();
  c.restore();
  label(c, text, x, y, color, 'center', size);
}

function symAxis(v) {
  var ax = niceAxis(v), n = ax.ticks % 2 ? ax.ticks + 1 : ax.ticks;
  return { top: ax.max / ax.ticks * n, ticks: n };
}

function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function Plot(canvas, opt) {
  opt = opt || {};
  this.cv = canvas;
  this.ctx = canvas.getContext('2d');
  this.pad = opt.pad || { l: 46, r: 14, t: 14, b: 34 };
  this.x = opt.x || [0, 1];
  this.y = opt.y || [-1, 1];
  this.xt = opt.xt || 5;
  this.yt = opt.yt || 4;
  this.xl = opt.xl || '';
  this.yl = opt.yl || '';
  this.xf = opt.xf || function (v) { return sig(v, 2); };
  this.yf = opt.yf || function (v) { return sig(v, 2); };
  this.grid = opt.grid !== false;
  this.w = 0;
  this.h = 0;
  var self = this;
  this.onResize = opt.onResize || null;
  new ResizeObserver(function () { self.resize(); if (self.onResize) self.onResize(); }).observe(canvas);
  this.resize();
}
Plot.prototype.resize = function () {
  var cv = this.cv;
  var w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  this.w = w;
  this.h = h;
};
Plot.prototype.X = function (v) { return this.pad.l + (v - this.x[0]) / (this.x[1] - this.x[0]) * (this.w - this.pad.l - this.pad.r); };
Plot.prototype.Y = function (v) { return this.h - this.pad.b - (v - this.y[0]) / (this.y[1] - this.y[0]) * (this.h - this.pad.t - this.pad.b); };
Plot.prototype.begin = function () {
  var c = this.ctx, w = this.w, h = this.h, p = this.pad;
  if (!w || !h) return false;
  c.clearRect(0, 0, w, h);
  c.lineWidth = 1;
  c.font = '500 11px "IBM Plex Mono", monospace';
  var gridC = 'rgba(201,214,226,.14)', axisC = 'rgba(201,214,226,.5)', textC = 'rgba(201,214,226,.8)';
  var i, v, px, py;
  if (this.grid) {
    c.strokeStyle = gridC;
    c.beginPath();
    for (i = 0; i <= this.xt; i++) { v = this.x[0] + (this.x[1] - this.x[0]) * i / this.xt; px = Math.round(this.X(v)) + 0.5; c.moveTo(px, p.t); c.lineTo(px, h - p.b); }
    for (i = 0; i <= this.yt; i++) { v = this.y[0] + (this.y[1] - this.y[0]) * i / this.yt; py = Math.round(this.Y(v)) + 0.5; c.moveTo(p.l, py); c.lineTo(w - p.r, py); }
    c.stroke();
  }
  c.strokeStyle = axisC;
  c.beginPath();
  if (this.y[0] < 0 && this.y[1] > 0) { py = Math.round(this.Y(0)) + 0.5; c.moveTo(p.l, py); c.lineTo(w - p.r, py); }
  if (this.x[0] < 0 && this.x[1] > 0) { px = Math.round(this.X(0)) + 0.5; c.moveTo(px, p.t); c.lineTo(px, h - p.b); }
  c.stroke();
  c.fillStyle = textC;
  c.textAlign = 'right';
  c.textBaseline = 'middle';
  for (i = 0; i <= this.yt; i++) { v = this.y[0] + (this.y[1] - this.y[0]) * i / this.yt; c.fillText(this.yf(v), p.l - 6, this.Y(v)); }
  c.textAlign = 'center';
  c.textBaseline = 'top';
  for (i = 0; i <= this.xt; i++) { v = this.x[0] + (this.x[1] - this.x[0]) * i / this.xt; c.fillText(this.xf(v), this.X(v), h - p.b + 6); }
  if (this.xl) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(this.xl, w - p.r, h - 1); }
  if (this.yl) { c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(this.yl, p.l + 4, 2); }
  return true;
};
Plot.prototype.clip = function () {
  var c = this.ctx, p = this.pad;
  c.save();
  c.beginPath();
  c.rect(p.l, p.t, this.w - p.l - p.r, this.h - p.t - p.b);
  c.clip();
};
Plot.prototype.unclip = function () { this.ctx.restore(); };
Plot.prototype.line = function (fn, color, width, o) {
  o = o || {};
  var c = this.ctx, p = this.pad, n = o.n || Math.max(120, Math.round(this.w - p.l - p.r));
  c.save();
  c.beginPath();
  c.rect(p.l, p.t - 2, this.w - p.l - p.r, this.h - p.t - p.b + 4);
  c.clip();
  c.strokeStyle = color;
  c.lineWidth = width || 2;
  c.lineJoin = 'round';
  if (o.dash) c.setLineDash(o.dash);
  c.beginPath();
  for (var i = 0; i <= n; i++) {
    var xv = this.x[0] + (this.x[1] - this.x[0]) * i / n;
    var yv = fn(xv);
    var px = this.X(xv), py = this.Y(yv);
    if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
  }
  c.stroke();
  c.restore();
};
Plot.prototype.fillBetween = function (fn, color, base) {
  var c = this.ctx, p = this.pad, n = Math.max(120, Math.round(this.w - p.l - p.r));
  c.save();
  c.beginPath();
  c.rect(p.l, p.t, this.w - p.l - p.r, this.h - p.t - p.b);
  c.clip();
  c.fillStyle = color;
  c.beginPath();
  var b = this.Y(base || 0);
  c.moveTo(this.X(this.x[0]), b);
  for (var i = 0; i <= n; i++) {
    var xv = this.x[0] + (this.x[1] - this.x[0]) * i / n;
    c.lineTo(this.X(xv), this.Y(fn(xv)));
  }
  c.lineTo(this.X(this.x[1]), b);
  c.closePath();
  c.fill();
  c.restore();
};
Plot.prototype.vline = function (xv, color, width, dash) {
  var c = this.ctx;
  c.save();
  c.strokeStyle = color;
  c.lineWidth = width || 1.5;
  if (dash) c.setLineDash(dash);
  var px = Math.round(this.X(xv)) + 0.5;
  c.beginPath();
  c.moveTo(px, this.pad.t);
  c.lineTo(px, this.h - this.pad.b);
  c.stroke();
  c.restore();
};
Plot.prototype.hline = function (yv, color, width, dash) {
  var c = this.ctx;
  c.save();
  c.strokeStyle = color;
  c.lineWidth = width || 1.5;
  if (dash) c.setLineDash(dash);
  var py = Math.round(this.Y(yv)) + 0.5;
  c.beginPath();
  c.moveTo(this.pad.l, py);
  c.lineTo(this.w - this.pad.r, py);
  c.stroke();
  c.restore();
};
Plot.prototype.dot = function (xv, yv, color, r) {
  var c = this.ctx;
  c.fillStyle = color;
  c.beginPath();
  c.arc(this.X(xv), this.Y(yv), r || 4.5, 0, Math.PI * 2);
  c.fill();
};
Plot.prototype.text = function (s, xv, yv, color, align, dx, dy) {
  var c = this.ctx;
  c.fillStyle = color || '#c9d6e2';
  c.textAlign = align || 'left';
  c.textBaseline = 'middle';
  c.font = '600 11.5px "IBM Plex Mono", monospace';
  c.fillText(s, this.X(xv) + (dx || 0), this.Y(yv) + (dy || 0));
};


function fmtB(t) {
  var a = Math.abs(t);
  if (a === 0) return '0 T';
  if (a >= 1) return sig(t, 3) + ' T';
  if (a >= 1e-3) return sig(t * 1e3, 3) + ' mT';
  if (a >= 1e-6) return sig(t * 1e6, 3) + ' μT';
  return sig(t * 1e9, 3) + ' nT';
}

function scene(fig, draw, opt) {
  opt = opt || {};
  var cv = fig.querySelector('canvas');
  var s = { cv: cv, ctx: cv.getContext('2d'), w: 0, h: 0, dpr: 1, t: 0 };
  function resize() {
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    s.dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * s.dpr);
    cv.height = Math.round(h * s.dpr);
    s.w = w;
    s.h = h;
    if (opt.onResize) opt.onResize(s);
  }
  new ResizeObserver(resize).observe(cv);
  resize();
  if (opt.touch) cv.style.touchAction = opt.touch;
  L.loop(fig, function (dt, t) {
    if (!s.w) return;
    s.t = t;
    s.ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    s.ctx.clearRect(0, 0, s.w, s.h);
    draw(s.ctx, s, dt, t);
  });
  return s;
}

function drag(cv, fn) {
  var on = false;
  function pt(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  cv.addEventListener('pointerdown', function (e) {
    var p = pt(e);
    if (fn.down && fn.down(p[0], p[1], e) === false) return;
    on = true;
    cv.setPointerCapture(e.pointerId);
    if (fn.move) fn.move(p[0], p[1], e);
  });
  cv.addEventListener('pointermove', function (e) {
    var p = pt(e);
    if (on) { if (fn.move) fn.move(p[0], p[1], e); }
    else if (fn.hover) fn.hover(p[0], p[1], e);
  });
  function end() { if (on && fn.up) fn.up(); on = false; }
  cv.addEventListener('pointerup', end);
  cv.addEventListener('pointercancel', end);
}

function arrow(c, x1, y1, x2, y2, color, width, head) {
  var dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 1) return;
  var ux = dx / len, uy = dy / len;
  head = Math.min(head || 9, len * 0.7);
  c.save();
  c.strokeStyle = color;
  c.fillStyle = color;
  c.lineWidth = width || 2;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2 - ux * head * 0.6, y2 - uy * head * 0.6);
  c.stroke();
  c.beginPath();
  c.moveTo(x2, y2);
  c.lineTo(x2 - ux * head - uy * head * 0.45, y2 - uy * head + ux * head * 0.45);
  c.lineTo(x2 - ux * head + uy * head * 0.45, y2 - uy * head - ux * head * 0.45);
  c.closePath();
  c.fill();
  c.restore();
}

function label(c, text, x, y, color, align, size) {
  c.fillStyle = color || '#e9f0f6';
  c.textAlign = align || 'center';
  c.textBaseline = 'middle';
  c.font = '600 ' + (size || 12) + 'px "IBM Plex Mono", monospace';
  c.fillText(text, x, y);
}

function mathLabel(c, text, x, y, color, align, size) {
  c.fillStyle = color || '#e9f0f6';
  c.textAlign = align || 'center';
  c.textBaseline = 'middle';
  c.font = 'italic 600 ' + (size || 17) + 'px "STIX Two Text", Georgia, serif';
  c.fillText(text, x, y);
}

function wireDot(c, x, y, r, dir, color) {
  c.save();
  c.fillStyle = 'rgba(15,22,30,.9)';
  c.strokeStyle = color || '#ffb468';
  c.lineWidth = 2;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = color || '#ffb468';
  c.strokeStyle = color || '#ffb468';
  if (dir > 0) { c.beginPath(); c.arc(x, y, r * 0.28, 0, Math.PI * 2); c.fill(); }
  else if (dir < 0) {
    var k = r * 0.5;
    c.beginPath();
    c.moveTo(x - k, y - k); c.lineTo(x + k, y + k);
    c.moveTo(x + k, y - k); c.lineTo(x - k, y + k);
    c.stroke();
  }
  c.restore();
}

function pathInfo(pts) {
  if (pts.__cum) return pts;
  var cum = [0];
  for (var i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  pts.__cum = cum;
  pts.__len = cum[cum.length - 1];
  return pts;
}

function pathAt(pts, s) {
  pathInfo(pts);
  var len = pts.__len, cum = pts.__cum;
  s = ((s % len) + len) % len;
  var lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
  var f = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1);
  return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * f, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * f];
}

function polyline(c, pts, color, width, dash) {
  c.save();
  c.strokeStyle = color;
  c.lineWidth = width || 2;
  c.lineJoin = 'round';
  c.lineCap = 'round';
  if (dash) c.setLineDash(dash);
  c.beginPath();
  for (var i = 0; i < pts.length; i++) { if (i) c.lineTo(pts[i][0], pts[i][1]); else c.moveTo(pts[i][0], pts[i][1]); }
  c.stroke();
  c.restore();
}

function flowDots(c, pts, phase, o) {
  o = o || {};
  pathInfo(pts);
  var spacing = o.spacing || 18, n = Math.max(1, Math.round(pts.__len / spacing)), step = pts.__len / n;
  c.save();
  c.fillStyle = o.color || '#ffb468';
  if (o.alpha != null) c.globalAlpha = o.alpha;
  for (var i = 0; i < n; i++) {
    var p = pathAt(pts, phase + i * step);
    c.beginPath();
    c.arc(p[0], p[1], o.r || 3, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

function fit(c, s, lw, lh) {
  var k = Math.min(s.w / lw, s.h / lh);
  c.translate((s.w - lw * k) / 2, (s.h - lh * k) / 2);
  c.scale(k, k);
  return k;
}

var COL = {
  a: '#6cc6ee', b: '#ffb468', c: '#6fcf97', d: '#f28b82', e: '#b39bf2', f: '#f5c84c', w: '#eef3f7'
};

function toggleBtns(root, onChange) {
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-v]');
    if (!b) return;
    root.querySelectorAll('button[data-v]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    onChange(b.getAttribute('data-v'));
  });
}

window.LAVC = { Plot: Plot, sig: sig, eng: eng, css: css, COL: COL, niceAxis: niceAxis, symAxis: symAxis, decs: decs, nice: nice, engn: engn, signed: signed, rrect: rrect, setText: setText, setSeg: setSeg, chipLabel: chipLabel, toggle: toggleBtns, fmtB: fmtB, scene: scene, drag: drag, arrow: arrow, label: label, mathLabel: mathLabel, wireDot: wireDot, flowDots: flowDots, polyline: polyline, pathAt: pathAt, fit: fit };
})();
