(function () {
'use strict';
if (window.LAV_FP) return;

// Device fingerprint, the "active test" marker and the temporary library block.
// Pages with data-lock on this script (biblioteka.html and the lessons) are hidden behind an overlay
// while this device has an unfinished hosted test that started less than 30 minutes ago.
// Other pages load the script lazily (core.js loadQuiz) only to record and finish the marker.

var script = document.currentScript;
var LOCK = !!(script && script.hasAttribute('data-lock'));
var BASE = '';
try { BASE = new URL('../../', script.src).href; } catch (e) {}
var LOCK_MS = 30 * 60 * 1000;
var DAY = 63072000;

// ---------- three stores, so that clearing one of them does not lose the value ----------
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function ckGet(k) {
  try {
    var m = document.cookie.match(new RegExp('(?:^|; )' + k.replace(/[-.]/g, '\\$&') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  } catch (e) { return null; }
}
function ckSet(k, v) {
  try { document.cookie = k + '=' + encodeURIComponent(v) + '; max-age=' + DAY + '; path=/; SameSite=Lax'; } catch (e) {}
}
var idbP = null;
function idb() {
  if (!idbP) idbP = new Promise(function (res, rej) {
    if (!window.indexedDB) { rej(new Error('no idb')); return; }
    var r = indexedDB.open('lav-fp', 1);
    r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
    r.onsuccess = function () {
      // let "clear site data" in another tab go through
      r.result.onversionchange = function () { r.result.close(); idbP = null; };
      res(r.result);
    };
    r.onerror = function () { rej(r.error); };
    r.onblocked = function () { rej(new Error('blocked')); };
  });
  return idbP;
}
function idbGet(k) {
  var get = idb().then(function (db) {
    return new Promise(function (res, rej) {
      var q = db.transaction('kv', 'readonly').objectStore('kv').get(k);
      q.onsuccess = function () { res(q.result == null ? null : q.result); };
      q.onerror = function () { rej(q.error); };
    });
  }).catch(function () { return null; });
  // never hold the page up for a store that does not answer
  return Promise.race([get, new Promise(function (res) { setTimeout(function () { res(null); }, 2000); })]);
}
function idbSet(k, v) {
  return idb().then(function (db) {
    return new Promise(function (res) {
      var t = db.transaction('kv', 'readwrite');
      t.objectStore('kv').put(v, k);
      t.oncomplete = function () { res(); };
      t.onerror = t.onabort = function () { res(); };
    });
  }).catch(function () {});
}
// kv: the same value is written to localStorage, a cookie and IndexedDB; read back from whichever still has it
function kvGet(k) {
  var v = lsGet('lav-' + k) || ckGet('lav_' + k);
  return v ? Promise.resolve(v) : idbGet(k);
}
function kvSet(k, v) {
  lsSet('lav-' + k, v);
  ckSet('lav_' + k, v);
  return idbSet(k, v);
}

// ---------- the fingerprint ----------
// cyrb53: a small fast 53-bit string hash, good enough for telling devices apart (not for security)
function cyrb53(str, seed) {
  var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (var i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
function hex14(n) { return ('00000000000000' + n.toString(16)).slice(-14); }

function canvasPart() {
  try {
    var c = document.createElement('canvas');
    c.width = 220; c.height = 50;
    var x = c.getContext('2d');
    x.textBaseline = 'alphabetic';
    x.fillStyle = '#f60';
    x.fillRect(120, 2, 60, 24);
    x.fillStyle = '#069';
    x.font = '15px Arial, sans-serif';
    x.fillText('lav èšđčćž fp 1.0', 4, 32);
    x.fillStyle = 'rgba(102,204,0,0.6)';
    x.font = 'italic 17px serif';
    x.fillText('lav èšđčćž fp 1.0', 6, 44);
    x.globalCompositeOperation = 'multiply';
    x.fillStyle = 'rgb(255,0,255)';
    x.beginPath(); x.arc(40, 25, 20, 0, Math.PI * 2, true); x.closePath(); x.fill();
    return String(cyrb53(c.toDataURL(), 7));
  } catch (e) { return 'nocanvas'; }
}
function webglPart() {
  try {
    var c = document.createElement('canvas');
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return 'nogl';
    var ext = gl.getExtension('WEBGL_debug_renderer_info');
    var v = ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    var r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    return [v, r, gl.getParameter(gl.MAX_TEXTURE_SIZE)].join('/');
  } catch (e) { return 'nogl'; }
}
function fontsPart() {
  try {
    var list = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Segoe UI', 'Helvetica Neue', 'Roboto', 'Ubuntu', 'Calibri', 'Cambria', 'Menlo', 'Consolas', 'Noto Sans', 'DejaVu Sans', 'Liberation Serif'];
    var bases = ['monospace', 'serif', 'sans-serif'];
    var ctx = document.createElement('canvas').getContext('2d');
    var txt = 'mmmmmmmmmmlliWQ@šđ';
    var ref = bases.map(function (b) { ctx.font = '48px ' + b; return ctx.measureText(txt).width; });
    return list.map(function (f) {
      return bases.some(function (b, i) { ctx.font = '48px "' + f + '", ' + b; return ctx.measureText(txt).width !== ref[i]; }) ? 1 : 0;
    }).join('');
  } catch (e) { return 'nofonts'; }
}
function compute() {
  var n = navigator, s = window.screen || {}, tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  var parts = [
    canvasPart(), webglPart(), fontsPart(),
    [s.width, s.height, s.colorDepth, s.pixelDepth].join('x'),
    tz, new Date().getTimezoneOffset(),
    n.language, (n.languages || []).join(','),
    n.hardwareConcurrency, n.deviceMemory, n.maxTouchPoints, n.platform
  ];
  var str = parts.join('||');
  return hex14(cyrb53(str, 1)) + hex14(cyrb53(str, 2));
}
function validFp(v) { return typeof v === 'string' && /^[0-9a-f]{28}$/.test(v); }

var fp = null;
var stored = lsGet('lav-fp'), cookie = ckGet('lav_fp');
fp = validFp(stored) ? stored : validFp(cookie) ? cookie : compute();
function persistFp() { kvSet('fp', fp); }
persistFp();
// if both sync stores were wiped the IndexedDB copy wins over a recomputed value, so the id stays the same
var ready = (validFp(stored) || validFp(cookie)) ? Promise.resolve(fp) : idbGet('fp').then(function (v) {
  if (validFp(v) && v !== fp) { fp = v; persistFp(); }
  return fp;
});

// the keys under which the marker is also kept on the server: it is the one place the database rules let anyone
// look up by something the device owns (quizzes/<code> is readable by everyone). A record can only be rewritten by the
// anonymous identity that created it, so if that identity is gone (all site data wiped) the next slot is used.
var SLOTS = 6;
function remoteCode(slot) { return 'Z' + ('000000' + (cyrb53(fp, 3) % 2176782336).toString(36).toUpperCase()).slice(-6) + (slot || 0); }
function tag() { return fp.slice(0, 6); }

// ---------- the active-test marker ----------
// { fp, role: 'host'|'player', sid, pid, quiz, secure, at, upd, finished, fin }
function parse(s) { try { var m = JSON.parse(s); return m && m.sid ? m : null; } catch (e) { return null; } }
function newer(a, b) { return !a ? b : !b ? a : (b.upd || 0) > (a.upd || 0) ? b : a; }
function readLocal() { return newer(parse(lsGet('lav-fpm')), parse(ckGet('lav_fpm'))); }
function sameTest(a, b) { return a && b && a.role === b.role && a.sid === b.sid && (a.pid || '') === (b.pid || ''); }
function merge(a, b) {
  if (!a || !b) return a || b;
  if (sameTest(a, b)) return a.finished ? a : b.finished ? b : newer(a, b);
  return newer(a, b);
}
function active(m) {
  return !!(m && !m.finished && m.secure !== false && Date.now() - m.at < LOCK_MS);
}
var cur = readLocal();
function save(m) {
  cur = m;
  var s = JSON.stringify(m);
  lsSet('lav-fpm', s);
  ckSet('lav_fpm', s);
  idbSet('fpm', s);
  push(m);
  paint();
  try { window.dispatchEvent(new CustomEvent('lav-fp', { detail: m })); } catch (e) {}
}

var api = {
  id: function () { return fp; },
  tag: tag,
  code: remoteCode,
  slots: SLOTS,
  ready: ready,
  kvGet: kvGet,
  kvSet: kvSet,
  // set by quiz-store.js: (code, body) -> Promise that writes quizzes/<code> with the owner filled in
  writer: null,
  current: function () { return cur; },
  locked: function () { return active(cur); },
  begin: function (m) {
    var now = Date.now();
    save({ fp: fp, role: m.role, sid: m.sid, pid: m.pid || '', quiz: m.quiz || '', secure: m.secure !== false, at: now, upd: now, finished: false });
  },
  touch: function (patch) {
    if (!cur || cur.finished) return;
    var m = {};
    Object.keys(cur).forEach(function (k) { m[k] = cur[k]; });
    Object.keys(patch).forEach(function (k) { m[k] = patch[k]; });
    m.upd = Date.now();
    save(m);
  },
  // sid and pid are optional: without them whatever is active is finished
  finish: function (sid, pid) {
    if (!cur || cur.finished || (sid && cur.sid !== sid) || (pid && cur.pid !== pid)) return;
    var m = {};
    Object.keys(cur).forEach(function (k) { m[k] = cur[k]; });
    m.finished = true;
    m.fin = m.upd = Date.now();
    save(m);
  }
};
window.LAV_FP = api;

// ---------- the same marker in the database (best effort, needs the silent anonymous sign-in) ----------
function db(path) {
  var c = window.LAV_CONFIG || {};
  var u = String(c.databaseURL || '').trim().replace(/\/+$/, '');
  if (!/^https:\/\/[^\s]+$/.test(u)) return null;
  return u + '/' + (c.dataPath || 'lav') + '/' + path + '.json';
}
function getJson(path) {
  var url = db(path);
  if (!url) return Promise.resolve(undefined);
  var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
  var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
  return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
    clearTimeout(timer);
    return r.ok ? r.json() : undefined;
  }, function () { clearTimeout(timer); return undefined; });
}
var slot = null;
function push(m) {
  if (!api.writer) return;
  var body = { title: 'lav-active-test', questions: { m: 1 }, role: m.role, sid: m.sid, quiz: m.quiz, secure: m.secure, at: m.at, upd: m.upd, finished: !!m.finished };
  if (m.pid) body.pid = m.pid;
  if (m.fin) body.fin = m.fin;
  function attempt(n) {
    body.fp = remoteCode(n);
    return api.writer(remoteCode(n), body).then(function () {
      slot = n;
      kvSet('fps', String(n));
    }, function (e) {
      if (e && e.denied && n < SLOTS - 1) return attempt(n + 1);
    });
  }
  ready.then(function () { return slot == null ? kvGet('fps') : String(slot); }).then(function (n) {
    try { return attempt(Math.min(SLOTS - 1, Number(n) || 0)); } catch (e) {}
  }).catch(function () {});
}
// the newest marker among the slots; null when there is none, undefined when the server could not be asked
function pull() {
  return ready.then(function () {
    var all = [];
    for (var i = 0; i < SLOTS; i++) all.push(getJson('quizzes/' + remoteCode(i)));
    return Promise.all(all);
  }).then(function (rs) {
    var best = null, asked = false;
    rs.forEach(function (r) {
      if (r !== undefined) asked = true;
      if (r && r.sid) best = newer(best, r);
    });
    return asked ? best : undefined;
  });
}
// 'finished' when the session itself says so (room deleted, ended, participant sent or removed), 'active' when it is
// still going, 'unknown' when it could not be asked
function verify(m) {
  return getJson('sessions/' + m.sid + '/info').then(function (info) {
    if (info === undefined) return 'unknown';
    if (!info) return 'finished';
    if (info.state === 'ended' && (m.role === 'host' || Date.now() - (info.ended || 0) > 170000)) return 'finished';
    if (m.role !== 'player' || !m.pid) return 'active';
    return getJson('sessions/' + m.sid + '/players/' + m.pid).then(function (p) {
      if (p === undefined) return 'unknown';
      return !p || p.state === 'done' ? 'finished' : 'active';
    });
  });
}

// ---------- the overlay ----------
function both(sr, en) { return '<span lang="sr">' + sr + '</span><span lang="en">' + en + '</span>'; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
var layer = null, tickT = null;
function paint() {
  if (!LOCK) return;
  var root = document.documentElement;
  var on = active(cur);
  if (on) root.classList.add('fp-locked'); else root.classList.remove('fp-locked');
  if (!document.body) return;
  if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
  layer = null;
  clearInterval(tickT);
  if (!on) return;
  var link = BASE + 'testovi.html?resume=' + encodeURIComponent(cur.sid);
  layer = document.createElement('div');
  layer.id = 'fp-lock';
  layer.className = 'lock-card';
  layer.setAttribute('role', 'alert');
  layer.innerHTML = '<div class="lock-in"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>' +
    '<h2>' + both('Biblioteka je privremeno zaključana', 'The library is temporarily locked') + '</h2>' +
    '<p>' + both('Na ovom uređaju imaš nezavršen test (soba <b>' + esc(cur.sid) + '</b>). Dok ga ne završiš, lekcije i biblioteka su zaključane, da test ostane pošten.', 'This device has an unfinished test (room <b>' + esc(cur.sid) + '</b>). Until it is finished the lessons and the library are locked, so the test stays fair.') + '</p>' +
    '<p>' + both('Preostalo vreme zaključavanja: ', 'Lock time remaining: ') + '<b class="lock-t"><span class="fp-min"></span> min</b></p>' +
    '<p class="help">' + both('Zaključavanje se skida čim test bude završen ili posle 30 minuta. Ostale stranice rade normalno.', 'The lock lifts as soon as the test is finished, or after 30 minutes. The other pages work normally.') + '</p>' +
    '<div class="row"><a class="btn primary" href="' + esc(link) + '">' + both('Nazad na test', 'Back to the test') + '</a></div></div>';
  var top = document.querySelector('.top');
  if (top && top.parentNode) top.parentNode.insertBefore(layer, top.nextSibling); else document.body.insertBefore(layer, document.body.firstChild);
  function tick() {
    if (!active(cur)) { paint(); return; }
    var el = layer.querySelector('.fp-min');
    if (el) el.textContent = Math.max(1, Math.ceil((cur.at + LOCK_MS - Date.now()) / 60000));
  }
  tick();
  tickT = setInterval(tick, 1000);
}

// ask the server (and the session) whether the block still stands; works even when this browser's own storage was wiped
var checking = false;
function check() {
  if (checking) return;
  checking = true;
  pull().then(function (rem) {
    var m = merge(cur, rem || null);
    if (m && m !== cur) { cur = m; lsSet('lav-fpm', JSON.stringify(m)); ckSet('lav_fpm', JSON.stringify(m)); idbSet('fpm', JSON.stringify(m)); paint(); }
    if (!active(cur)) return;
    return verify(cur).then(function (v) {
      if (v !== 'finished') return;
      var m2 = {};
      Object.keys(cur).forEach(function (k) { m2[k] = cur[k]; });
      m2.finished = true;
      m2.fin = m2.upd = Date.now();
      cur = m2;
      lsSet('lav-fpm', JSON.stringify(m2));
      ckSet('lav_fpm', JSON.stringify(m2));
      idbSet('fpm', JSON.stringify(m2));
      paint();
    });
  }).then(function () { checking = false; }, function () { checking = false; });
}

if (LOCK) {
  // before the first paint, from what this browser already knows
  if (active(cur)) document.documentElement.classList.add('fp-locked');
  var start = function () {
    ready.then(function () {
      // the IndexedDB copy of the marker, in case localStorage and the cookie were both cleared
      return idbGet('fpm').then(function (s) { var m = parse(s); if (m && newer(cur, m) === m) { cur = m; } });
    }).then(function () {
      paint();
      check();
      setInterval(function () { if (active(cur)) check(); }, 20000);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('storage', function (e) {
    if (e.key === 'lav-fpm') { cur = readLocal(); paint(); }
  });
}
})();
