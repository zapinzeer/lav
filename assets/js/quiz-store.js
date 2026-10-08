(function () {
'use strict';

var cfg = window.LAV_CONFIG || {};
var dbUrl = String(cfg.databaseURL || '').replace(/\/+$/, '');
var root = cfg.dataPath || 'lav';
var remote = /^https:\/\/[^\s]+$/.test(dbUrl);
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
  var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
  var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
  var opt = { method: method };
  if (ctrl) opt.signal = ctrl.signal;
  if (body !== undefined) { opt.headers = { 'Content-Type': 'application/json' }; opt.body = JSON.stringify(body); }
  return fetch(dbUrl + '/' + root + '/' + path + '.json' + (query || ''), opt).then(function (r) {
    clearTimeout(timer);
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }, function (e) {
    clearTimeout(timer);
    throw e;
  });
}

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
  if (remote) load = req('GET', 'quizzes').then(function (o) { return o || {}; });
  else { lread(); load = Promise.resolve(mem.quizzes); }
  return load.then(function (o) {
    var created = Object.keys(o).map(function (c) { return { code: c, quiz: normQuiz(o[c]), builtin: false }; })
      .filter(function (x) { return x.quiz; })
      .sort(function (a, b) { return b.quiz.createdAt - a.quiz.createdAt; });
    return base.concat(created);
  });
}

function save(code, quiz) {
  var body = JSON.parse(JSON.stringify(quiz));
  if (remote) return req('PUT', 'quizzes/' + code, body).then(function () { return code; });
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
  if (remote) return req('DELETE', 'quizzes/' + code).then(function () { return req('DELETE', 'subs/' + code); });
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

function submit(code, sub) {
  var body = JSON.parse(JSON.stringify(sub));
  if (remote) return req('POST', 'subs/' + code, body).then(function (r) { return r && r.name; });
  lread();
  var id = uid();
  mem.subs[code] = mem.subs[code] || {};
  mem.subs[code][id] = body;
  lwrite();
  return Promise.resolve(id);
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
  norm: normQuiz
};
})();
