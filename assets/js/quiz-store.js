(function () {
'use strict';

var cfg = window.LAV_CONFIG || {};
var A = window.LAV.auth;
var dbUrl = String(cfg.databaseURL || '').trim().replace(/\/+$/, '');
var root = cfg.dataPath || 'lav';
var remote = A.enabled;
var builtin = window.LAV_QUIZZES || {};
var ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function toArr(x) {
  if (Array.isArray(x)) return x;
  if (x && typeof x === 'object') {
    var keys = Object.keys(x).map(Number).filter(function (k) { return !isNaN(k); });
    if (!keys.length) return [];
    var out = [];
    var max = Math.max.apply(null, keys);
    for (var i = 0; i <= max; i++) out.push(x[i] == null ? null : x[i]);
    return out;
  }
  return [];
}

function normQuiz(q) {
  if (!q) return null;
  var out = {
    title: q.title || '',
    createdAt: q.createdAt || 0,
    builtin: !!q.builtin,
    settings: {
      shuffleQ: !!(q.settings && q.settings.shuffleQ),
      shuffleO: !!(q.settings && q.settings.shuffleO),
      showAnswers: !(q.settings && q.settings.showAnswers === false),
      open: !(q.settings && q.settings.open === false)
    },
    questions: toArr(q.questions).filter(Boolean).map(function (x) {
      return {
        type: x.type || 'choice',
        text: x.text || '',
        options: toArr(x.options),
        correct: x.type === 'multi' ? toArr(x.correct).map(Number) : x.correct,
        numeric: !!x.numeric,
        tol: x.tol == null ? 1 : Number(x.tol),
        unit: x.unit || '',
        formula: x.formula || 'off',
        working: x.working || 'off',
        points: x.points == null ? 1 : Number(x.points),
        explain: x.explain || '',
        ref: x.ref || ''
      };
    })
  };
  return out;
}

function normSub(id, s) {
  return {
    id: id,
    name: s.name || '',
    at: s.at || 0,
    score: s.score || 0,
    max: s.max || 0,
    answers: toArr(s.answers).map(function (a) {
      a = a || {};
      var v = a.a;
      if (a.t === 'multi') v = toArr(v);
      return { a: v == null ? null : v, t: a.t || '', f: a.f || '', w: a.w || '' };
    })
  };
}

function req(method, path, body, query) {
  return A.token().then(function (tok) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    var opt = { method: method };
    if (ctrl) opt.signal = ctrl.signal;
    if (body !== undefined) { opt.headers = { 'Content-Type': 'application/json' }; opt.body = JSON.stringify(body); }
    var q = query || '';
    if (tok) q += (q ? '&' : '?') + 'auth=' + encodeURIComponent(tok);
    return fetch(dbUrl + '/' + root + (path ? '/' + path : '') + '.json' + q, opt).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) {
        var e = new Error('http ' + r.status);
        e.status = r.status;
        e.denied = r.status === 401 || r.status === 403;
        throw e;
      }
      return r.json();
    }, function (e) {
      clearTimeout(timer);
      throw e;
    });
  });
}

function me() {
  var u = A.user();
  return u ? u.uid : null;
}
function asMe(fn) {
  var id = me();
  if (!id) { var e = new Error('not signed in'); e.denied = true; e.status = 401; return Promise.reject(e); }
  return fn(id);
}
function multi(updates) { return req('PATCH', '', updates); }

var mem = { quizzes: {}, subs: {} };
function lread() {
  try {
    var raw = localStorage.getItem('lav-db');
    if (raw) { var p = JSON.parse(raw); mem = { quizzes: p.quizzes || {}, subs: p.subs || {} }; }
  } catch (e) {}
  return mem;
}
function lwrite() {
  try { localStorage.setItem('lav-db', JSON.stringify(mem)); } catch (e) {}
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function builtinList() {
  var all = window.LAV_LESSONS || [];
  var out = [];
  all.forEach(function (l) {
    if (builtin[l.quiz]) out.push({ code: l.quiz, quiz: normQuiz(builtin[l.quiz]), builtin: true, lesson: l });
  });
  Object.keys(builtin).forEach(function (c) {
    if (!out.some(function (x) { return x.code === c; })) out.push({ code: c, quiz: normQuiz(builtin[c]), builtin: true });
  });
  return out;
}

function get(code) {
  code = String(code || '').toUpperCase().trim();
  if (!code) return Promise.resolve(null);
  if (builtin[code]) return Promise.resolve(normQuiz(builtin[code]));
  if (remote) return req('GET', 'quizzes/' + code).then(normQuiz);
  lread();
  return Promise.resolve(normQuiz(mem.quizzes[code]));
}

function list() {
  var base = builtinList();
  var load;
  if (remote) {
    var id = me();
    load = !id ? Promise.resolve({}) : req('GET', 'users/' + id + '/quizzes').then(function (idx) {
      var codes = Object.keys(idx || {});
      return Promise.all(codes.map(function (c) {
        return req('GET', 'quizzes/' + c).then(function (q) { return q ? [c, q] : null; });
      })).then(function (pairs) {
        var o = {};
        pairs.forEach(function (p) { if (p) o[p[0]] = p[1]; });
        return o;
      });
    });
  } else { lread(); load = Promise.resolve(mem.quizzes); }
  return load.then(function (o) {
    var created = Object.keys(o).map(function (c) { return { code: c, quiz: normQuiz(o[c]), builtin: false }; })
      .filter(function (x) { return x.quiz; })
      .sort(function (a, b) { return b.quiz.createdAt - a.quiz.createdAt; });
    return base.concat(created);
  });
}

function save(code, quiz) {
  var body = JSON.parse(JSON.stringify(quiz));
  if (remote) return asMe(function (id) {
    body.owner = id;
    var up = {};
    up['quizzes/' + code] = body;
    up['users/' + id + '/quizzes/' + code] = true;
    return multi(up).then(function () { return code; });
  });
  lread();
  mem.quizzes[code] = body;
  lwrite();
  return Promise.resolve(code);
}

function patch(code, obj) {
  if (remote) return req('PATCH', 'quizzes/' + code, obj);
  lread();
  var q = mem.quizzes[code];
  if (q) {
    Object.keys(obj).forEach(function (k) {
      if (k.indexOf('/') > 0) { var p = k.split('/'); q[p[0]] = q[p[0]] || {}; q[p[0]][p[1]] = obj[k]; }
      else q[k] = obj[k];
    });
    lwrite();
  }
  return Promise.resolve();
}

function remove(code) {
  if (remote) return asMe(function (id) {
    var up = {};
    up['quizzes/' + code] = null;
    up['subs/' + code] = null;
    up['users/' + id + '/quizzes/' + code] = null;
    return multi(up);
  });
  lread();
  delete mem.quizzes[code];
  delete mem.subs[code];
  lwrite();
  return Promise.resolve();
}

function exists(code) {
  if (builtin[code]) return Promise.resolve(true);
  if (remote) return req('GET', 'quizzes/' + code, undefined, '?shallow=true').then(function (v) { return v != null; });
  lread();
  return Promise.resolve(!!mem.quizzes[code]);
}

function newCode() {
  function attempt(n) {
    var c = '';
    for (var i = 0; i < 5; i++) c += ALPHA.charAt(Math.floor(Math.random() * ALPHA.length));
    return exists(c).then(function (e) { return e && n < 8 ? attempt(n + 1) : c; });
  }
  return attempt(0);
}

function submit(code, sub, meta) {
  var body = JSON.parse(JSON.stringify(sub));
  if (remote) {
    var who = me();
    var sid = uid();
    var up = {};
    if (who) body.uid = who;
    up['subs/' + code + '/' + sid] = body;
    if (who) {
      var h = JSON.parse(JSON.stringify(sub));
      h.code = code;
      h.title = (meta && meta.title) || '';
      h.titleEn = (meta && meta.titleEn) || h.title;
      up['users/' + who + '/history/' + sid] = h;
    }
    return multi(up).then(function () { return { id: sid, saved: !!who }; });
  }
  lread();
  var id = uid();
  mem.subs[code] = mem.subs[code] || {};
  mem.subs[code][id] = body;
  lwrite();
  return Promise.resolve({ id: id, saved: false });
}

function subs(code) {
  var load;
  if (remote) load = req('GET', 'subs/' + code).then(function (o) { return o || {}; });
  else { lread(); load = Promise.resolve(mem.subs[code] || {}); }
  return load.then(function (o) {
    return Object.keys(o).map(function (id) { return normSub(id, o[id]); }).sort(function (a, b) { return a.at - b.at; });
  });
}

function subCount(code) {
  if (remote) return req('GET', 'subs/' + code, undefined, '?shallow=true').then(function (o) { return o ? Object.keys(o).length : 0; });
  lread();
  return Promise.resolve(Object.keys(mem.subs[code] || {}).length);
}

function removeSub(code, id) {
  if (remote) return req('DELETE', 'subs/' + code + '/' + id);
  lread();
  if (mem.subs[code]) delete mem.subs[code][id];
  lwrite();
  return Promise.resolve();
}

function normHist(id, h) {
  var s = normSub(id, h);
  s.code = h.code || '';
  s.title = h.title || '';
  s.titleEn = h.titleEn || h.title || '';
  return s;
}

function history() {
  if (!remote) return Promise.resolve([]);
  var id = me();
  if (!id) return Promise.resolve([]);
  return req('GET', 'users/' + id + '/history').then(function (o) {
    o = o || {};
    return Object.keys(o).map(function (k) { return normHist(k, o[k]); }).sort(function (a, b) { return b.at - a.at; });
  });
}

function removeHistory(hid) {
  return asMe(function (id) { return req('DELETE', 'users/' + id + '/history/' + hid); });
}

function wipeAccount() {
  return asMe(function (id) {
    return req('GET', 'users/' + id + '/quizzes', undefined, '?shallow=true').then(function (idx) {
      var up = {};
      Object.keys(idx || {}).forEach(function (c) {
        up['quizzes/' + c] = null;
        up['subs/' + c] = null;
      });
      up['users/' + id] = null;
      return multi(up);
    });
  });
}

function isAdmin() {
  if (!remote || !me()) return Promise.resolve(false);
  return req('GET', 'admins/' + me()).then(function (v) { return v === true; }).catch(function () { return false; });
}

function claimAdmin() {
  return asMe(function (id) { return req('PUT', 'admins/' + id, true).then(function () { return true; }); });
}

window.LAV.store = {
  remote: remote,
  get: get,
  list: list,
  save: save,
  patch: patch,
  remove: remove,
  exists: exists,
  newCode: newCode,
  submit: submit,
  subs: subs,
  subCount: subCount,
  removeSub: removeSub,
  history: history,
  removeHistory: removeHistory,
  wipeAccount: wipeAccount,
  isAdmin: isAdmin,
  claimAdmin: claimAdmin,
  norm: normQuiz
};
})();
