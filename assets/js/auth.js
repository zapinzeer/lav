(function () {
'use strict';

var L = window.LAV;
var cfg = L.config || {};
var apiKey = String(cfg.apiKey || '').trim();
var dbOk = /^https:\/\/[^\s]+$/.test(String(cfg.databaseURL || '').trim());
var enabled = dbOk && apiKey.length > 0;
var KEY = 'lav-session';
var ID = 'https://identitytoolkit.googleapis.com/v1/';
var TOK = 'https://securetoken.googleapis.com/v1/token';
var session = null;
var refreshing = null;
var listeners = [];

function readStored() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    return s && s.uid && s.refreshToken ? s : null;
  } catch (e) { return null; }
}
function writeStored() {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch (e) {}
}
function emit() {
  var u = user();
  listeners.slice().forEach(function (f) { try { f(u); } catch (e) {} });
  try { window.dispatchEvent(new CustomEvent('lav-auth', { detail: u })); } catch (e) {}
}
function user() {
  return session ? { uid: session.uid, email: session.email, name: session.name || '' } : null;
}
function onChange(f) { listeners.push(f); }

function fail(code, status) {
  var e = new Error(code);
  e.code = code;
  e.status = status || 0;
  return e;
}

function call(url, body, form) {
  var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
  var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
  var opt = { method: 'POST', headers: { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' }, body: form ? body : JSON.stringify(body) };
  if (ctrl) opt.signal = ctrl.signal;
  return fetch(url, opt).then(function (r) {
    clearTimeout(timer);
    return r.json().catch(function () { return {}; }).then(function (d) {
      if (!r.ok) {
        var msg = (d && d.error && (typeof d.error === 'string' ? d.error : d.error.message)) || 'UNKNOWN';
        var code = /^API key/i.test(msg) ? 'API_KEY_INVALID' : /referer|blocked|not allowed to use/i.test(msg) ? 'API_KEY_BLOCKED' : /has not been used|disabled/i.test(msg) ? 'SERVICE_DISABLED' : String(msg).split(/[\s:]/)[0] || 'UNKNOWN';
        throw fail(code, r.status);
      }
      return d;
    });
  }, function () {
    clearTimeout(timer);
    throw fail('NETWORK', 0);
  });
}

function adopt(d, email) {
  session = {
    uid: d.localId || d.user_id || (session && session.uid),
    email: d.email || email || (session && session.email) || '',
    name: d.displayName != null ? d.displayName : (session ? session.name : ''),
    idToken: d.idToken || d.id_token,
    refreshToken: d.refreshToken || d.refresh_token || (session && session.refreshToken),
    exp: Date.now() + (Number(d.expiresIn || d.expires_in) || 3600) * 1000
  };
  writeStored();
  emit();
  return user();
}

function need() {
  if (!enabled) return Promise.reject(fail('NOT_CONFIGURED'));
  return null;
}

function signUp(email, password, name) {
  return need() || call(ID + 'accounts:signUp?key=' + encodeURIComponent(apiKey), { email: email, password: password, returnSecureToken: true }).then(function (d) {
    adopt(d, email);
    return name ? updateName(name).catch(function () { return user(); }) : user();
  });
}
function signIn(email, password) {
  return need() || call(ID + 'accounts:signInWithPassword?key=' + encodeURIComponent(apiKey), { email: email, password: password, returnSecureToken: true }).then(function (d) {
    return adopt(d, email);
  });
}
function updateName(name) {
  return token().then(function (t) {
    if (!t) throw fail('NOT_SIGNED_IN');
    return call(ID + 'accounts:update?key=' + encodeURIComponent(apiKey), { idToken: t, displayName: name, returnSecureToken: true });
  }).then(function (d) {
    d.displayName = name;
    return adopt(d);
  });
}
function reset(email) {
  return need() || call(ID + 'accounts:sendOobCode?key=' + encodeURIComponent(apiKey), { requestType: 'PASSWORD_RESET', email: email });
}
function signOut() {
  session = null;
  refreshing = null;
  writeStored();
  emit();
}
function removeAccount() {
  return token().then(function (t) {
    if (!t) throw fail('NOT_SIGNED_IN');
    return call(ID + 'accounts:delete?key=' + encodeURIComponent(apiKey), { idToken: t });
  }).then(signOut);
}

function token() {
  if (!enabled || !session) return Promise.resolve(null);
  if (session.exp - Date.now() > 60000) return Promise.resolve(session.idToken);
  if (!refreshing) {
    var rt = session.refreshToken;
    refreshing = call(TOK + '?key=' + encodeURIComponent(apiKey), 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(rt), true).then(function (d) {
      refreshing = null;
      adopt(d);
      return session.idToken;
    }, function (e) {
      refreshing = null;
      if (e.code !== 'NETWORK') { signOut(); return null; }
      throw e;
    });
  }
  return refreshing;
}

var AKEY = 'lav-anon';
var anon = null;
var anonBusy = null;
var ANON_OFF = { ADMIN_ONLY_OPERATION: 1, OPERATION_NOT_ALLOWED: 1, SERVICE_DISABLED: 1 };

function anonParse(raw) {
  try { var a = JSON.parse(raw); return a && a.uid && a.refreshToken ? a : null; } catch (e) { return null; }
}
function anonLoad() {
  var raw = null;
  try { raw = localStorage.getItem(AKEY); } catch (e) {}
  var a = anonParse(raw);
  if (a) return Promise.resolve(a);
  var fp = window.LAV_FP;
  return fp && fp.kvGet ? fp.kvGet('anon').then(anonParse, function () { return null; }) : Promise.resolve(null);
}
function anonAdopt(d) {
  anon = {
    uid: d.localId || d.user_id || (anon && anon.uid),
    idToken: d.idToken || d.id_token,
    refreshToken: d.refreshToken || d.refresh_token || (anon && anon.refreshToken),
    exp: Date.now() + (Number(d.expiresIn || d.expires_in) || 3600) * 1000
  };
  var s = JSON.stringify(anon);
  try { localStorage.setItem(AKEY, s); } catch (e) {}
  var fp = window.LAV_FP;
  if (fp && fp.kvSet) fp.kvSet('anon', JSON.stringify({ uid: anon.uid, refreshToken: anon.refreshToken }));
  return anon;
}
function anonSignUp() {
  return call(ID + 'accounts:signUp?key=' + encodeURIComponent(apiKey), { returnSecureToken: true }).then(anonAdopt);
}

function anonAuth() {
  if (!enabled) return Promise.reject(fail('NOT_CONFIGURED'));
  if (anon && anon.idToken && anon.exp - Date.now() > 60000) return Promise.resolve({ uid: anon.uid, token: anon.idToken });
  if (!anonBusy) {
    anonBusy = (anon ? Promise.resolve(anon) : anonLoad()).then(function (a) {
      if (a && a.idToken && a.exp - Date.now() > 60000) { anon = a; return a; }
      if (a && a.refreshToken) {
        anon = a;
        return call(TOK + '?key=' + encodeURIComponent(apiKey), 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refreshToken), true).then(anonAdopt, function (e) {
          if (e.code === 'NETWORK') throw e;
          anon = null;
          return anonSignUp();
        });
      }
      return anonSignUp();
    }).then(function (a) {
      anonBusy = null;
      return { uid: a.uid, token: a.idToken };
    }, function (e) {
      anonBusy = null;
      if (ANON_OFF[e.code]) e.anonOff = true;
      throw e;
    });
  }
  return anonBusy;
}

window.addEventListener('storage', function (e) {
  if (e.key !== KEY) return;
  session = readStored();
  emit();
});

session = enabled ? readStored() : null;

L.auth = {
  enabled: enabled,
  user: user,
  onChange: onChange,
  signUp: signUp,
  signIn: signIn,
  signOut: signOut,
  reset: reset,
  updateName: updateName,
  removeAccount: removeAccount,
  token: token,
  anon: anonAuth
};
})();
