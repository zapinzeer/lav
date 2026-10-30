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
    questions: toArr(q.questions).filter(Boolean).map(normQuestion),
    advanced: toArr(q.advanced).filter(Boolean).map(normQuestion)
  };
  return out;
}

function normQuestion(x) {
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
}

// the in-depth set used by hosted tests: the short questions of the lesson plus the advanced ones
function full(quiz) {
  if (!quiz) return null;
  var out = JSON.parse(JSON.stringify(quiz));
  out.easyCount = quiz.questions.length;
  out.questions = quiz.questions.concat(quiz.advanced || []);
  out.advanced = [];
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

function req(method, path, body, query, tokFn) {
  return (tokFn || A.token)().then(function (tok) {
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
        return r.text().then(function (t) {
          var e = new Error('http ' + r.status);
          e.status = r.status;
          e.denied = r.status === 401 || r.status === 403;
          try { var j = JSON.parse(t); e.detail = typeof j.error === 'string' ? j.error : (j.error && j.error.message) || ''; } catch (x) { e.detail = String(t || '').slice(0, 120); }
          throw e;
        });
      }
      return r.json();
    }, function (e) {
      clearTimeout(timer);
      throw e;
    });
  });
}

// calls made as the host of a test room: the signed-in account if there is one, otherwise the silent anonymous
// identity (no login screen, no password). The rules need auth != null and host === auth.uid, nothing more.
function hostAuth() {
  var u = A.user();
  if (!u) return A.anon();
  return A.token().then(function (t) { return t ? { uid: u.uid, token: t } : A.anon(); });
}
function hreq(method, path, body, query) {
  return hostAuth().then(function (h) {
    return req(method, path, body, query, function () { return Promise.resolve(h.token); }).catch(function (e) {
      // a room made earlier under the anonymous identity while an account is now signed in (or the other way round)
      var u = A.user();
      if (!e.denied || method === 'PUT' || !u || h.uid !== u.uid) throw e;
      return A.anon().then(function (a) { return req(method, path, body, query, function () { return Promise.resolve(a.token); }); });
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

var mem = { quizzes: {}, subs: {}, sessions: {} };
function lread() {
  try {
    var raw = localStorage.getItem('lav-db');
    if (raw) { var p = JSON.parse(raw); mem = { quizzes: p.quizzes || {}, subs: p.subs || {}, sessions: p.sessions || {} }; }
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
    return req('PUT', 'quizzes/' + code, body).then(function () {
      return req('PUT', 'users/' + id + '/quizzes/' + code, true);
    }).then(function () { return code; });
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
    return req('DELETE', 'subs/' + code).then(function () {
      return req('DELETE', 'quizzes/' + code);
    }).then(function () {
      return req('DELETE', 'users/' + id + '/quizzes/' + code);
    });
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
    if (who) body.uid = who;
    return req('PUT', 'subs/' + code + '/' + sid, body).then(function () {
      if (!who) return { id: sid, saved: false };
      var h = JSON.parse(JSON.stringify(sub));
      h.code = code;
      h.title = (meta && meta.title) || '';
      h.titleEn = (meta && meta.titleEn) || h.title;
      return req('PUT', 'users/' + who + '/history/' + sid, h).then(function () {
        return { id: sid, saved: true };
      }, function () {
        return { id: sid, saved: false };
      });
    });
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
      var chain = Promise.resolve();
      Object.keys(idx || {}).forEach(function (c) {
        chain = chain.then(function () { return req('DELETE', 'subs/' + c); }).then(function () { return req('DELETE', 'quizzes/' + c); });
      });
      return chain.then(function () { return req('DELETE', 'users/' + id); });
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

// ---------- hosted tests ----------
// sessions/<6 digits>/{info, players/<pid>, results/<pid>}; in local mode the same shape lives in lav-db
function sessionHostId() {
  if (!remote) return Promise.resolve('local');
  return hostAuth().then(function (h) { return h.uid; });
}

function newSid() {
  function attempt(n) {
    var c = '';
    for (var i = 0; i < 6; i++) c += Math.floor(Math.random() * 10);
    return sessionInfo(c).then(function (e) { return e && n < 8 ? attempt(n + 1) : c; });
  }
  return attempt(0);
}

function sessionCreate(quizCode, opt) {
  opt = opt || {};
  return Promise.all([sessionHostId(), get(quizCode), newSid()]).then(function (r) {
    var host = r[0], quiz = full(r[1]), sid = r[2];
    if (!quiz) throw new Error('no quiz');
    var u = A.user();
    var info = {
      quiz: quizCode,
      host: host,
      hostName: (u && (u.name || u.email) ? String(u.name || u.email).split('@')[0] : '').slice(0, 40),
      state: 'lobby',
      secure: opt.secure !== false,
      showAnswers: opt.showAnswers !== false,
      created: Date.now(),
      n: quiz.questions.length
    };
    if (!info.hostName) delete info.hostName;
    if (remote) return hreq('PUT', 'sessions/' + sid + '/info', info).then(function () { return { sid: sid, info: info }; });
    lread();
    mem.sessions[sid] = { info: info, players: {}, results: {} };
    lwrite();
    return { sid: sid, info: info };
  });
}

function sessionInfo(sid) {
  if (remote) return req('GET', 'sessions/' + sid + '/info');
  lread();
  return Promise.resolve(mem.sessions[sid] ? mem.sessions[sid].info : null);
}

function sessionPatch(sid, obj) {
  if (remote) return hreq('PATCH', 'sessions/' + sid + '/info', obj);
  lread();
  if (mem.sessions[sid]) { Object.keys(obj).forEach(function (k) { mem.sessions[sid].info[k] = obj[k]; }); lwrite(); }
  return Promise.resolve();
}

function sessionJoin(sid, name) {
  // the first 6 characters of the player id are the device fingerprint tag (the id may only be a-z0-9, 6 to 20 long)
  var pid = (window.LAV_FP ? window.LAV_FP.tag() : '') + uid();
  var body = { name: name, at: Date.now(), state: 'lobby' };
  if (remote) return req('PUT', 'sessions/' + sid + '/players/' + pid, body).then(function () { return pid; });
  lread();
  if (!mem.sessions[sid]) return Promise.reject(new Error('no session'));
  mem.sessions[sid].players[pid] = body;
  lwrite();
  return Promise.resolve(pid);
}

function playerPatch(sid, pid, obj) {
  if (remote) return req('PATCH', 'sessions/' + sid + '/players/' + pid, obj);
  lread();
  var p = mem.sessions[sid] && mem.sessions[sid].players[pid];
  if (p) { Object.keys(obj).forEach(function (k) { p[k] = obj[k]; }); lwrite(); }
  return Promise.resolve();
}

function sessionPlayers(sid) {
  var load;
  if (remote) load = req('GET', 'sessions/' + sid + '/players').then(function (o) { return o || {}; });
  else { lread(); load = Promise.resolve(mem.sessions[sid] ? mem.sessions[sid].players : {}); }
  return load.then(function (o) {
    return Object.keys(o).map(function (id) { var p = o[id]; return { id: id, name: p.name || '', at: p.at || 0, state: p.state || 'lobby', blur: p.blur || 0 }; })
      .sort(function (a, b) { return a.at - b.at; });
  });
}

function sessionSubmit(sid, pid, sub, meta) {
  var body = JSON.parse(JSON.stringify(sub));
  if (remote) {
    var who = me();
    if (who) body.uid = who;
    return req('PUT', 'sessions/' + sid + '/results/' + pid, body).then(function () {
      req('PATCH', 'sessions/' + sid + '/players/' + pid, { state: 'done' }).catch(function () {});
      if (!who) return { saved: false };
      var h = JSON.parse(JSON.stringify(sub));
      h.code = (meta && meta.code) || '';
      h.title = (meta && meta.title) || '';
      h.titleEn = (meta && meta.titleEn) || h.title;
      return req('PUT', 'users/' + who + '/history/' + pid, h).then(function () { return { saved: true }; }, function () { return { saved: false }; });
    });
  }
  lread();
  if (!mem.sessions[sid]) return Promise.reject(new Error('no session'));
  mem.sessions[sid].results[pid] = body;
  if (mem.sessions[sid].players[pid]) mem.sessions[sid].players[pid].state = 'done';
  lwrite();
  return Promise.resolve({ saved: false });
}

function sessionResults(sid) {
  var load;
  if (remote) load = hreq('GET', 'sessions/' + sid + '/results').then(function (o) { return o || {}; });
  else { lread(); load = Promise.resolve(mem.sessions[sid] ? mem.sessions[sid].results : {}); }
  return load.then(function (o) {
    return Object.keys(o).map(function (id) {
      var s = normSub(id, o[id]);
      s.correct = o[id].correct || 0;
      s.wrong = o[id].wrong || 0;
      s.blank = o[id].blank || 0;
      s.blur = o[id].blur || 0;
      s.auto = !!o[id].auto;
      return s;
    }).sort(function (a, b) { return a.at - b.at; });
  });
}

function sessionKick(sid, pid) {
  if (remote) return hreq('DELETE', 'sessions/' + sid + '/results/' + pid).then(function () { return hreq('DELETE', 'sessions/' + sid + '/players/' + pid); });
  lread();
  if (mem.sessions[sid]) { delete mem.sessions[sid].results[pid]; delete mem.sessions[sid].players[pid]; lwrite(); }
  return Promise.resolve();
}

function sessionDelete(sid) {
  if (remote) return hreq('DELETE', 'sessions/' + sid);
  lread();
  delete mem.sessions[sid];
  lwrite();
  return Promise.resolve();
}

// the active-test marker of this device is also kept in the database, under quizzes/<code> where the rules let an
// anonymous identity write and everyone read (see fingerprint-lock.js); the owner field is the anonymous uid
if (window.LAV_FP && remote) window.LAV_FP.writer = function (code, body) {
  return A.anon().then(function (a) {
    body.owner = a.uid;
    return req('PUT', 'quizzes/' + code, body, '', function () { return Promise.resolve(a.token); });
  });
};

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
  norm: normQuiz,
  full: full,
  sessionCreate: sessionCreate,
  sessionInfo: sessionInfo,
  sessionPatch: sessionPatch,
  sessionJoin: sessionJoin,
  playerPatch: playerPatch,
  sessionPlayers: sessionPlayers,
  sessionSubmit: sessionSubmit,
  sessionResults: sessionResults,
  sessionKick: sessionKick,
  sessionDelete: sessionDelete
};
})();
