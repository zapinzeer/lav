(function () {
'use strict';

var L = window.LAV;
var A = L.auth;
var S = L.store;
var U = L.quiz.ui;
var esc = L.esc;
var both = L.both;
var icon = L.icon;
var tr = L.tr;
var openModal = U.openModal;
var errBanner = U.errBanner;
var current = null;

function $(el, sel) { return el.querySelector(sel); }

var ERRORS = {
  EMAIL_EXISTS: ['Nalog sa tom adresom već postoji. Prijavi se.', 'An account with this email already exists. Sign in instead.'],
  INVALID_EMAIL: ['Email adresa nije ispravna.', 'That email address is not valid.'],
  MISSING_EMAIL: ['Upiši email adresu.', 'Enter your email address.'],
  MISSING_PASSWORD: ['Upiši lozinku.', 'Enter your password.'],
  WEAK_PASSWORD: ['Lozinka je preslaba. Koristi bar 8 znakova.', 'The password is too weak. Use at least 8 characters.'],
  INVALID_LOGIN_CREDENTIALS: ['Pogrešan email ili lozinka.', 'Wrong email or password.'],
  INVALID_PASSWORD: ['Pogrešan email ili lozinka.', 'Wrong email or password.'],
  EMAIL_NOT_FOUND: ['Pogrešan email ili lozinka.', 'Wrong email or password.'],
  USER_DISABLED: ['Ovaj nalog je onemogućen.', 'This account has been disabled.'],
  TOO_MANY_ATTEMPTS_TRY_LATER: ['Previše pokušaja. Pokušaj ponovo za nekoliko minuta.', 'Too many attempts. Try again in a few minutes.'],
  OPERATION_NOT_ALLOWED: ['Prijava emailom nije uključena u Firebase-u. Vlasnik sajta treba da uključi Email/Password.', 'Email sign-in is not enabled in Firebase. The site owner must enable Email/Password.'],
  API_KEY_INVALID: ['API ključ u config.js nije ispravan.', 'The API key in config.js is not valid.'],
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: ['Zbog bezbednosti se prijavi ponovo, pa pokušaj još jednom.', 'For security, sign in again and then try once more.'],
  NETWORK: ['Server nije dostupan. Proveri vezu i pokušaj ponovo.', 'The server is unreachable. Check your connection and try again.']
};
function authError(e) {
  var m = ERRORS[e && e.code];
  if (m) return errBanner(m[0], m[1]);
  var c = esc((e && e.code) || 'UNKNOWN');
  return errBanner('Nešto nije uspelo (' + c + ').', 'Something went wrong (' + c + ').');
}

function when(ts) { return L.fmtTime(ts); }
function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
function initial(u) { return esc(String(u.name || u.email || '?').trim().charAt(0).toUpperCase() || '?'); }

function open(tab, opts) {
  opts = opts || {};
  if (!A.enabled) { L.toast('Nalozi još nisu uključeni.', 'Accounts are not enabled yet.'); return; }
  if (current && !current.closed) current.close();
  var m = openModal({ cls: 'mid' });
  current = m;
  var off = function () {
    if (m.closed) return;
    if (!A.user() && m.view === 'in') renderOut(m, 'in', {});
  };
  A.onChange(off);
  if (A.user()) renderIn(m, tab === 'settings' ? 'settings' : 'history', opts);
  else renderOut(m, tab === 'up' ? 'up' : 'in', opts);
}

function renderOut(m, mode, opts) {
  m.view = 'out';
  var up = mode === 'up';
  m.setCls('mid');
  m.setHead(up ? 'Napravi nalog' : 'Prijava', up ? 'Create an account' : 'Sign in', '<span class="eyebrow">' + both('Nalog', 'Account') + '</span>');
  m.body.innerHTML =
    (opts.required ? '<div class="banner">' + icon('info') + '<div>' + both('Da bi pravio kvizove i video odgovore, prijavi se nalogom. Kvizovi i odgovori se vezuju za tvoj nalog i niko drugi ih ne vidi.', 'To create quizzes and see the answers, sign in with an account. Quizzes and answers belong to your account and nobody else can see them.') + '</div></div>' : '') +
    '<div class="seg" role="group" aria-label="Nalog / Account"><button type="button" data-mode="in" aria-pressed="' + (!up) + '">' + both('Prijava', 'Sign in') + '</button><button type="button" data-mode="up" aria-pressed="' + up + '">' + both('Novi nalog', 'New account') + '</button></div>' +
    '<form id="a-form" novalidate class="stack" style="display:grid;gap:14px">' +
    (up ? '<div class="field-row"><label for="a-name">' + both('Korisničko ime', 'Username') + '</label><input id="a-name" class="input" type="text" maxlength="32" autocomplete="nickname" data-ph-sr="Kako da te zovemo?" data-ph-en="What should we call you?"></div>' : '') +
    '<div class="field-row"><label for="a-email">Email</label><input id="a-email" class="input" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false"></div>' +
    '<div class="field-row"><label for="a-pw">' + both('Lozinka', 'Password') + '</label><input id="a-pw" class="input" type="password" autocomplete="' + (up ? 'new-password' : 'current-password') + '" data-ph-sr="' + (up ? 'Bar 8 znakova' : 'Lozinka') + '" data-ph-en="' + (up ? 'At least 8 characters' : 'Password') + '"></div>' +
    '<label class="check"><input type="checkbox" id="a-show"> ' + both('Prikaži lozinku', 'Show password') + '</label>' +
    '<div id="a-err"></div>' +
    '<button type="submit" class="sr-only" tabindex="-1">OK</button></form>' +
    (up ? '' : '<p class="help"><a href="#" id="a-forgot">' + both('Zaboravljena lozinka?', 'Forgot your password?') + '</a></p>') +
    '<p class="help">' + icon('lock').replace('<svg', '<svg width="14" height="14" style="stroke:currentColor;fill:none;stroke-width:2;vertical-align:-2px;margin-right:6px"') + both('Lozinku obrađuje Firebase Authentication (Google) i zapisuje je kao heš. Ovaj sajt je nikada ne vidi niti čuva.', 'Your password is handled by Firebase Authentication (Google) and stored only as a hash. This site never sees or stores it.') + '</p>';
  m.setFoot('<button type="button" class="btn" id="a-cancel">' + both('Otkaži', 'Cancel') + '</button><button type="button" class="btn primary" id="a-go">' + icon('user') + (up ? both('Napravi nalog', 'Create account') : both('Prijavi se', 'Sign in')) + '</button>');
  L.applyAttrs(m.root);
  var email = $(m.root, '#a-email'), pw = $(m.root, '#a-pw'), nm = $(m.root, '#a-name'), err = $(m.root, '#a-err'), go = $(m.root, '#a-go');
  m.body.querySelectorAll('[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () { renderOut(m, b.getAttribute('data-mode'), opts); });
  });
  $(m.root, '#a-show').addEventListener('change', function (e) { pw.type = e.target.checked ? 'text' : 'password'; });
  $(m.root, '#a-cancel').addEventListener('click', function () { m.close(); });
  var forgot = $(m.root, '#a-forgot');
  if (forgot) forgot.addEventListener('click', function (e) { e.preventDefault(); renderReset(m, mode, opts, email.value.trim()); });

  function submit() {
    var em = email.value.trim();
    var pass = pw.value;
    var name = nm ? nm.value.trim() : '';
    if (!em) { err.innerHTML = authError({ code: 'MISSING_EMAIL' }); email.focus(); return; }
    if (!pass) { err.innerHTML = authError({ code: 'MISSING_PASSWORD' }); pw.focus(); return; }
    if (up && !name) { err.innerHTML = errBanner('Upiši korisničko ime.', 'Enter a username.'); nm.focus(); return; }
    if (up && pass.length < 8) { err.innerHTML = authError({ code: 'WEAK_PASSWORD' }); pw.focus(); return; }
    err.innerHTML = '';
    go.disabled = true;
    var p = up ? A.signUp(em, pass, name) : A.signIn(em, pass);
    p.then(function () {
      if (m.closed) return;
      try { if (up) localStorage.setItem('lav-name', name); } catch (e) {}
      if (opts.onDone) {
        m.close();
        L.toast('Prijavljen si.', 'You are signed in.');
        opts.onDone();
      } else {
        L.toast(up ? 'Nalog je napravljen.' : 'Prijavljen si.', up ? 'Account created.' : 'You are signed in.');
        renderIn(m, 'history', opts);
      }
    }).catch(function (e) {
      go.disabled = false;
      err.innerHTML = authError(e);
    });
  }
  go.addEventListener('click', submit);
  $(m.root, '#a-form').addEventListener('submit', function (e) { e.preventDefault(); submit(); });
  m.root.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); submit(); } });
  setTimeout(function () { (up ? nm : email).focus(); }, 60);
}

function renderReset(m, mode, opts, prefill) {
  m.view = 'out';
  m.setHead('Zaboravljena lozinka', 'Forgot your password', '<span class="eyebrow">' + both('Nalog', 'Account') + '</span>');
  m.body.innerHTML =
    '<p>' + both('Upiši email adresu naloga. Firebase će ti poslati poruku sa linkom za novu lozinku.', 'Enter the email address of your account. Firebase will send you a message with a link to set a new password.') + '</p>' +
    '<div class="field-row"><label for="r-email">Email</label><input id="r-email" class="input" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false"></div><div id="r-err"></div>';
  m.setFoot('<button type="button" class="btn" id="r-back">' + both('Nazad', 'Back') + '</button><button type="button" class="btn primary" id="r-go">' + icon('mail') + both('Pošalji link', 'Send link') + '</button>');
  L.applyAttrs(m.root);
  var email = $(m.root, '#r-email'), err = $(m.root, '#r-err'), go = $(m.root, '#r-go');
  email.value = prefill || '';
  $(m.root, '#r-back').addEventListener('click', function () { renderOut(m, mode, opts); });
  function send() {
    var em = email.value.trim();
    if (!em) { err.innerHTML = authError({ code: 'MISSING_EMAIL' }); email.focus(); return; }
    go.disabled = true;
    err.innerHTML = '';
    A.reset(em).then(function () {
      go.disabled = false;
      err.innerHTML = '<div class="banner ok">' + icon('check') + '<div>' + both('Ako nalog postoji, poruka sa linkom je poslata na ' + esc(em) + '. Proveri i neželjenu poštu.', 'If an account exists, a message with a link was sent to ' + esc(em) + '. Check your spam folder too.') + '</div></div>';
    }).catch(function (e) {
      go.disabled = false;
      err.innerHTML = authError(e);
    });
  }
  go.addEventListener('click', send);
  email.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });
  setTimeout(function () { email.focus(); }, 60);
}

function renderIn(m, tab, opts) {
  var u = A.user();
  if (!u) { renderOut(m, 'in', opts); return; }
  m.view = 'in';
  m.setCls('wide');
  m.setHead('Moj nalog', 'My account', '<span class="eyebrow">' + esc(u.email) + '</span>');
  m.body.innerHTML =
    '<div class="acct-head"><span class="avatar" aria-hidden="true">' + initial(u) + '</span><div><b id="ac-name">' + esc(u.name || u.email.split('@')[0]) + '</b><div class="help">' + esc(u.email) + '</div></div></div>' +
    '<div class="seg" role="group" aria-label="Nalog / Account"><button type="button" data-tab="history" aria-pressed="' + (tab === 'history') + '">' + icon('clock').replace('<svg', '<svg width="16" height="16" style="stroke:currentColor;fill:none;stroke-width:2;vertical-align:-3px;margin-right:6px"') + both('Moji rezultati', 'My results') + '</button><button type="button" data-tab="settings" aria-pressed="' + (tab === 'settings') + '">' + both('Podešavanja', 'Settings') + '</button></div>' +
    '<div id="ac-pane"></div>';
  m.setFoot('<button type="button" class="btn" id="ac-out">' + icon('logout') + both('Odjavi se', 'Sign out') + '</button><button type="button" class="btn" id="ac-quiz">' + icon('plus') + both('Moji kvizovi (autor)', 'My quizzes (author)') + '</button><button type="button" class="btn primary" id="ac-join">' + icon('join') + both('Uđi u sobu', 'Join a room') + '</button>');
  L.applyAttrs(m.root);
  m.body.querySelectorAll('[data-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      m.body.querySelectorAll('[data-tab]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      pane(m, b.getAttribute('data-tab'));
    });
  });
  $(m.root, '#ac-out').addEventListener('click', function () {
    A.signOut();
    m.close();
    L.toast('Odjavljen si.', 'You have been signed out.');
  });
  $(m.root, '#ac-quiz').addEventListener('click', function () { m.close(); L.openCreate(); });
  $(m.root, '#ac-join').addEventListener('click', function () { m.close(); L.openJoin(); });
  pane(m, tab);
}

function pane(m, tab) {
  var host = $(m.root, '#ac-pane');
  if (!host) return;
  if (tab === 'settings') settingsPane(m, host);
  else historyPane(m, host);
}

function historyPane(m, host) {
  host.innerHTML = '<div class="center"><span class="spin"></span></div>';
  S.history().then(function (rows) {
    if (m.closed || !$(m.root, '#ac-pane')) return;
    if (!rows.length) {
      host.innerHTML = '<div class="center"><p>' + both('Još nema rezultata. Kad završiš test dok si prijavljen, pojaviće se ovde.', 'No results yet. When you finish a test while signed in, it will show up here.') + '</p>' +
        '<a class="btn" href="' + L.base + 'biblioteka.html">' + icon('book') + both('Otvori biblioteku', 'Open the library') + '</a></div>';
      return;
    }
    var sum = rows.reduce(function (t, r) { return t + (r.max ? r.score / r.max : 0); }, 0);
    var best = rows.reduce(function (t, r) { return Math.max(t, pct(r.score, r.max)); }, 0);
    var codes = {};
    rows.forEach(function (r) { codes[r.code] = true; });
    host.innerHTML =
      '<div class="stats">' +
      '<div><span class="big">' + rows.length + '</span><span class="help">' + both('pokušaja', 'attempts') + '</span></div>' +
      '<div><span class="big">' + Math.round(100 * sum / rows.length) + '%</span><span class="help">' + both('prosek', 'average') + '</span></div>' +
      '<div><span class="big">' + best + '%</span><span class="help">' + both('najbolji', 'best') + '</span></div>' +
      '<div><span class="big">' + Object.keys(codes).length + '</span><span class="help">' + both('različitih testova', 'different tests') + '</span></div></div>' +
      '<div class="hist-list">' + rows.map(histHtml).join('') + '</div>';
    L.applyAttrs(host);
    host.querySelectorAll('details.hist').forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open && !d.__done) { d.__done = true; fillReview(d, rows); } });
    });
    host.querySelectorAll('[data-again]').forEach(function (b) {
      b.addEventListener('click', function () { var c = b.getAttribute('data-again'); m.close(); L.openJoin(c); });
    });
    host.querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!confirm(tr('Obrisati ovaj rezultat iz istorije?', 'Delete this result from your history?'))) return;
        b.disabled = true;
        S.removeHistory(b.getAttribute('data-del')).then(function () { historyPane(m, host); }).catch(function () {
          b.disabled = false;
          L.toast('Nije uspelo. Proveri vezu.', 'Failed. Check your connection.');
        });
      });
    });
  }).catch(function (e) {
    if (m.closed) return;
    host.innerHTML = e && e.denied
      ? errBanner('Prijava je istekla. Odjavi se pa se prijavi ponovo.', 'Your sign-in has expired. Sign out and sign in again.')
      : errBanner('Server nije dostupan. Proveri vezu i pokušaj ponovo.', 'The server is unreachable. Check your connection and try again.');
  });
}

function histHtml(r) {
  var p = pct(r.score, r.max);
  var title = both(esc(r.title || r.code), esc(r.titleEn || r.title || r.code));
  return '<details class="hist" data-id="' + esc(r.id) + '"><summary>' +
    '<div class="hist-main"><b>' + title + '</b><div class="meta"><span class="code-chip">' + esc(r.code) + '</span><span class="help">' + esc(when(r.at)) + '</span></div></div>' +
    '<div class="hist-score"><span class="bar" aria-hidden="true"><i style="width:' + p + '%"></i></span><b>' + r.score + ' / ' + r.max + '</b><span class="help">' + p + '%</span></div></summary>' +
    '<div class="hist-body" data-review></div>' +
    '<div class="row" style="padding:0 14px 14px"><button type="button" class="btn small" data-again="' + esc(r.code) + '">' + icon('refresh') + both('Pokušaj ponovo', 'Try again') + '</button>' +
    '<button type="button" class="btn small danger" data-del="' + esc(r.id) + '">' + icon('trash') + both('Obriši', 'Delete') + '</button></div></details>';
}

function fillReview(d, rows) {
  var host = $(d, '[data-review]');
  var r = rows.filter(function (x) { return x.id === d.getAttribute('data-id'); })[0];
  if (!r) return;
  host.innerHTML = '<div class="center"><span class="spin"></span></div>';
  S.get(r.code).then(function (quiz) {
    if (!quiz) {
      host.innerHTML = '<p class="help">' + both('Ovaj kviz više ne postoji, pa pregled odgovora nije dostupan.', 'This quiz no longer exists, so the answer review is not available.') + '</p>';
      return;
    }
    if (!quiz.settings.showAnswers) {
      host.innerHTML = '<p class="help">' + both('Autor kviza je isključio prikaz tačnih odgovora.', 'The quiz author has turned off the display of correct answers.') + '</p>';
      return;
    }
    host.innerHTML = U.reviewHtml(quiz, r.answers, L.lessonByQuiz(r.code));
    L.renderMath(host);
  }).catch(function () {
    host.innerHTML = errBanner('Pregled nije mogao da se učita.', 'The review could not be loaded.');
  });
}

function settingsPane(m, host) {
  var u = A.user();
  host.innerHTML =
    '<div class="stack" style="display:grid;gap:18px">' +
    '<div class="field-row"><label for="s-name">' + both('Korisničko ime', 'Username') + '</label>' +
    '<div class="row" style="flex-wrap:nowrap"><input id="s-name" class="input" type="text" maxlength="32" autocomplete="nickname" style="flex:1;min-width:0"><button type="button" class="btn" id="s-save">' + both('Sačuvaj', 'Save') + '</button></div>' +
    '<p class="help">' + both('Ovo ime se podrazumevano upisuje kad uđeš u sobu.', 'This name is filled in by default when you join a room.') + '</p></div>' +
    '<div id="s-err"></div>' +
    '<div class="field-row"><label>' + both('Email', 'Email') + '</label><div class="help">' + esc(u.email) + '</div></div>' +
    '<div class="field-row"><label>' + both('Lozinka', 'Password') + '</label><div><button type="button" class="btn small" id="s-reset">' + icon('mail') + both('Pošalji link za novu lozinku', 'Email me a password-reset link') + '</button></div></div>' +
    '<div class="danger-zone"><b>' + both('Brisanje naloga', 'Delete account') + '</b><p class="help">' + both('Briše nalog, istoriju rezultata i sve kvizove koje si napravio zajedno sa odgovorima na njih. Ovo se ne može poništiti.', 'Deletes your account, your results history and every quiz you created together with its answers. This cannot be undone.') + '</p>' +
    '<button type="button" class="btn small danger" id="s-del">' + icon('trash') + both('Obriši nalog', 'Delete account') + '</button></div></div>';
  L.applyAttrs(host);
  var nm = $(host, '#s-name'), err = $(host, '#s-err');
  nm.value = u.name || '';
  $(host, '#s-save').addEventListener('click', function () {
    var v = nm.value.trim();
    if (!v) { err.innerHTML = errBanner('Upiši korisničko ime.', 'Enter a username.'); return; }
    err.innerHTML = '';
    A.updateName(v).then(function () {
      L.toast('Sačuvano.', 'Saved.');
      try { localStorage.setItem('lav-name', v); } catch (e) {}
      var h = $(m.root, '#ac-name');
      if (h) h.textContent = v;
      var av = $(m.root, '.avatar');
      if (av) av.textContent = v.charAt(0).toUpperCase();
    }).catch(function (e) { err.innerHTML = authError(e); });
  });
  $(host, '#s-reset').addEventListener('click', function () {
    A.reset(u.email).then(function () {
      L.toast('Link je poslat na ' + u.email + '.', 'A link was sent to ' + u.email + '.');
    }).catch(function (e) { err.innerHTML = authError(e); });
  });
  $(host, '#s-del').addEventListener('click', function () {
    if (!confirm(tr('Obrisati nalog, istoriju i sve tvoje kvizove? Ovo se ne može poništiti.', 'Delete your account, history and all your quizzes? This cannot be undone.'))) return;
    var b = $(host, '#s-del');
    b.disabled = true;
    S.wipeAccount().then(function () { return A.removeAccount(); }).then(function () {
      m.close();
      L.toast('Nalog je obrisan.', 'Your account has been deleted.');
    }).catch(function (e) {
      b.disabled = false;
      err.innerHTML = e && e.code ? authError(e) : errBanner('Nije uspelo. Proveri vezu i pokušaj ponovo.', 'Failed. Check your connection and try again.');
    });
  });
}

L.account = { open: open };
})();
