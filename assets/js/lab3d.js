(function () {
'use strict';

var L = window.LAV;
var T = window.THREE;
var api = { ok: false };
window.LAV3D = api;

function noGL() {
  document.querySelectorAll('.viewport').forEach(function (v) {
    if (v.querySelector('.nogl')) return;
    var d = document.createElement('div');
    d.className = 'nogl';
    d.innerHTML = '<p>' + L.both('3D prikaz nije dostupan u ovom pregledaču. Klizači i proračuni i dalje rade.', 'The 3D view is not available in this browser. The sliders and calculations still work.') + '</p>';
    v.appendChild(d);
    var cv = v.querySelector('canvas');
    if (cv) cv.hidden = true;
    var hint = v.querySelector('.hint');
    if (hint) hint.hidden = true;
  });
}
api.noGL = noGL;

if (!T) { noGL(); return; }
try {
  var probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) { noGL(); return; }
} catch (e) { noGL(); return; }
api.ok = true;

var reduce = L.reduce;
var UP = new T.Vector3(0, 1, 0);
var stages = [];
api.motion = reduce ? 0.35 : 1;
api.reduce = reduce;
api.UP = UP;

var DOT = (function () {
  var c = document.createElement('canvas');
  c.width = c.height = 64;
  var x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
})();
api.DOT = DOT;

api.C = {
  field: 0x6cc6ee, fieldDim: 0x27445a, copper: 0xc77a43, current: 0xffb468, force: 0xf5c84c,
  north: 0xd8453a, south: 0x3f6fd8, iron: 0x8a939d, white: 0xeef3f7, table: 0x1b2836, green: 0x6fcf97, violet: 0xb39bf2
};

var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) { var st = en.target.__stage; if (st) st.visible = en.isIntersecting; });
}, { rootMargin: '120px' });

api.createStage = function (fig, opt) {
  var canvas = fig.querySelector('canvas');
  var renderer;
  try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); }
  catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(36, 1.25, 0.1, 100);
  scene.add(new T.HemisphereLight(0xdde8f4, 0x18202a, 0.95));
  var dl = new T.DirectionalLight(0xffffff, 0.85);
  dl.position.set(4, 7, 6);
  scene.add(dl);
  var dl2 = new T.DirectionalLight(0x9fc3ff, 0.3);
  dl2.position.set(-5, -2, -4);
  scene.add(dl2);
  var st = {
    fig: fig, canvas: canvas, renderer: renderer, scene: scene, camera: camera,
    dist: opt.dist, theta: opt.theta, theta0: opt.theta, phi: opt.phi,
    target: new T.Vector3(opt.tx || 0, opt.ty || 0, opt.tz || 0), visible: false, interacted: false, k: 1, updaters: [],
    sway: opt.sway == null ? 0.38 : opt.sway
  };
  var drag = null;
  canvas.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, mouse: e.pointerType === 'mouse' };
    st.interacted = true;
    if (drag.mouse) canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    st.theta -= dx * 0.009;
    if (drag.mouse) st.phi = Math.min(2.6, Math.max(0.35, st.phi - dy * 0.008));
  });
  function end() { drag = null; }
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('keydown', function (e) {
    var used = true;
    if (e.key === 'ArrowLeft') st.theta += 0.15;
    else if (e.key === 'ArrowRight') st.theta -= 0.15;
    else if (e.key === 'ArrowUp') st.phi = Math.max(0.35, st.phi - 0.12);
    else if (e.key === 'ArrowDown') st.phi = Math.min(2.6, st.phi + 0.12);
    else used = false;
    if (used) { st.interacted = true; e.preventDefault(); }
  });
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    st.k = Math.max(1, 1.25 / camera.aspect);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  fig.__stage = st;
  io.observe(fig);
  stages.push(st);
  return st;
};

function placeCamera(st) {
  var d = st.dist * st.k, c = st.camera;
  c.position.set(
    st.target.x + d * Math.sin(st.phi) * Math.sin(st.theta),
    st.target.y + d * Math.cos(st.phi),
    st.target.z + d * Math.sin(st.phi) * Math.cos(st.theta));
  c.lookAt(st.target);
}

api.std = function (color, o) {
  var m = new T.MeshStandardMaterial({ color: color, roughness: 0.5, metalness: 0.15 });
  if (o) Object.keys(o).forEach(function (k) { if (k === 'emissive') m.emissive.set(o[k]); else m[k] = o[k]; });
  return m;
};

api.makeArrow = function (color, radius) {
  radius = radius || 0.035;
  var g = new T.Group();
  var m = new T.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.35, roughness: 0.5 });
  var shaft = new T.Mesh(new T.CylinderGeometry(radius, radius, 1, 12), m);
  var headH = radius * 7;
  var head = new T.Mesh(new T.ConeGeometry(radius * 2.7, headH, 18), m);
  g.add(shaft, head);
  g.set = function (dir, len) {
    if (len < 0.02 || dir.lengthSq() < 1e-9) { g.visible = false; return; }
    g.visible = true;
    var hl = Math.min(headH, len * 0.5), sl = Math.max(len - hl, 0.001);
    shaft.scale.set(1, sl, 1);
    shaft.position.y = sl / 2;
    head.scale.set(1, hl / headH, 1);
    head.position.y = sl + hl / 2;
    g.quaternion.setFromUnitVectors(UP, dir.clone().normalize());
  };
  return g;
};

api.makeLabel = function (text, o) {
  o = o || {};
  var c = document.createElement('canvas');
  c.width = c.height = 128;
  var x = c.getContext('2d');
  if (o.bg) { x.fillStyle = o.bg; x.beginPath(); x.arc(64, 64, 54, 0, Math.PI * 2); x.fill(); }
  x.fillStyle = o.color || '#e9f0f6';
  x.font = o.font || 'italic 600 92px "STIX Two Text", Georgia, serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, 64, o.bg ? 70 : 66);
  var mat = new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true, depthTest: false, depthWrite: false });
  var s = new T.Sprite(mat);
  s.renderOrder = 10;
  var size = o.size || 0.5;
  s.scale.set(size, size, 1);
  return s;
};

api.poleLabel = function (t) {
  return api.makeLabel(t, { bg: t === 'N' ? '#d8453a' : '#3f6fd8', color: '#fff', font: '800 70px Archivo, system-ui, sans-serif', size: 0.46 });
};

api.makeFlow = function (paths, o) {
  var group = new T.Group();
  var lineMat = new T.LineBasicMaterial({ color: o.color, transparent: true, opacity: o.lineOpacity == null ? 0.5 : o.lineOpacity });
  var tracks = [], total = 0;
  paths.forEach(function (pts) {
    var p = o.closed ? pts.concat([pts[0]]) : pts;
    var cum = [0];
    for (var i = 1; i < p.length; i++) cum.push(cum[i - 1] + p[i].distanceTo(p[i - 1]));
    var len = cum[cum.length - 1];
    var n = Math.max(1, Math.round(len / (o.spacing || 0.4)));
    tracks.push({ p: p, cum: cum, len: len, n: n, start: total });
    total += n;
    if (!o.noLine) group.add(new T.Line(new T.BufferGeometry().setFromPoints(p), lineMat));
  });
  var pos = new Float32Array(total * 3);
  var geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  var dotMat = new T.PointsMaterial({ color: o.dotColor || o.color, size: o.size || 0.1, map: DOT, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  var points = new T.Points(geo, dotMat);
  points.frustumCulled = false;
  group.add(points);
  var phase = 0, baseLine = lineMat.opacity;
  function sample(tr, s, k) {
    s = ((s % tr.len) + tr.len) % tr.len;
    var lo = 0, hi = tr.cum.length - 1;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (tr.cum[mid] <= s) lo = mid; else hi = mid; }
    var a = tr.p[lo], b = tr.p[hi], f = (s - tr.cum[lo]) / ((tr.cum[hi] - tr.cum[lo]) || 1);
    pos[k] = a.x + (b.x - a.x) * f;
    pos[k + 1] = a.y + (b.y - a.y) * f;
    pos[k + 2] = a.z + (b.z - a.z) * f;
  }
  var res = {
    group: group,
    update: function (dt, speed) {
      phase += dt * speed;
      for (var t = 0; t < tracks.length; t++) {
        var tr = tracks[t], step = tr.len / tr.n;
        for (var i = 0; i < tr.n; i++) sample(tr, phase + i * step + t * 0.173, (tr.start + i) * 3);
      }
      geo.attributes.position.needsUpdate = true;
    },
    setStrength: function (s) {
      group.visible = s > 0.005;
      lineMat.opacity = baseLine * s;
      dotMat.opacity = Math.min(1, s * 1.1);
    },
    dispose: function () {
      group.traverse(function (ob) { if (ob.geometry) ob.geometry.dispose(); });
      lineMat.dispose();
      dotMat.dispose();
    }
  };
  res.update(0, 0);
  return res;
};

var last = performance.now();
function frame(now) {
  var dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  for (var i = 0; i < stages.length; i++) {
    var st = stages[i];
    if (!st.visible) continue;
    if (!st.interacted && !reduce) st.theta = st.theta0 + st.sway * Math.sin(now / 1000 * 0.22);
    for (var j = 0; j < st.updaters.length; j++) st.updaters[j](dt, now / 1000);
    placeCamera(st);
    st.renderer.render(st.scene, st.camera);
  }
  requestAnimationFrame(frame);
}

api.start = function (defs) {
  var ok = 0;
  defs.forEach(function (d) {
    var fig = document.getElementById(d.id);
    var st = api.createStage(fig, d.opt);
    if (!st) return;
    try { d.build(st); ok++; } catch (e) { console.error(e); }
  });
  if (!ok) { noGL(); return; }
  requestAnimationFrame(frame);
};
})();
