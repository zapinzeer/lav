(function () {
'use strict';
var L = window.LAV, S = L.store, Qz = L.quiz, U = Qz.ui;
var esc = L.esc, both = L.both, icon = L.icon;
var FP = window.LAV_FP || null;
function $(el, sel) { return el.querySelector(sel); }
var locHtml = U.locHtml;

function mine() {
  try { var a = JSON.parse(localStorage.getItem('lav-host') || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}
function remember(sid, quiz) {
  var a = mine().filter(function (x) { return x.sid !== sid; });
  a.unshift({ sid: sid, quiz: quiz, created: Date.now() });
  try { localStorage.setItem('lav-host', JSON.stringify(a.slice(0, 12))); } catch (e) {}
}
function forget(sid) {
  if (FP) FP.finish(sid);
  try { localStorage.setItem('lav-host', JSON.stringify(mine().filter(function (x) { return x.sid !== sid; }))); } catch (e) {}
}

function fullQuiz(code) {
  return S.get(code).then(function (q) { return S.full(q); });
}
function lessonTitle(code) {
  var l = L.lessonByQuiz(code);
  return l ? both(esc(l.title.sr), esc(l.title.en)) : esc(code);
}

function optLine(ok, html) {
  return '<div class="pv-opt' + (ok ? ' ok' : '') + '"><span class="pv-mark">' + (ok ? '✓' : '') + '</span><span>' + html + '</span></div>';
}
function previewHtml(quiz) {
  var easy = quiz.easyCount == null ? quiz.questions.length : quiz.easyCount;
  return '<div class="qlist">' + quiz.questions.map(function (q, i) {
    var h = '<section class="qq pv"><div class="qq-top"><span class="qq-n">' + both('Pitanje ' + (i + 1) + ' od ' + quiz.questions.length, 'Question ' + (i + 1) + ' of ' + quiz.questions.length) + '</span>' +
      '<span class="pv-tags">' + (i >= easy ? '<span class="tag violet">' + both('produbljeno', 'in depth') + '</span>' : '<span class="tag plain">' + both('osnovno', 'basic') + '</span>') +
      '<span class="tag plain">' + U.typeLabel(q.type) + '</span><span class="qq-pts">' + U.ptsLabel(q.points) + '</span></span></div>' +
      '<div class="qq-text">' + locHtml(q.text) + '</div><div class="pv-opts">';
    if (q.type === 'choice') q.options.forEach(function (o, oi) { h += optLine(oi === Number(q.correct), locHtml(o)); });
    else if (q.type === 'multi') q.options.forEach(function (o, oi) { h += optLine((q.correct || []).map(Number).indexOf(oi) >= 0, locHtml(o)); });
    else if (q.type === 'bool') h += optLine(q.correct === true, both('Tačno', 'True')) + optLine(q.correct === false, both('Netačno', 'False'));
    else h += '<div class="pv-opt ok"><span class="pv-mark">✓</span><span>' + both('Tačan odgovor: ', 'Correct answer: ') + '<b>' + U.correctHtml(q) + '</b>' + (q.numeric ? ' <span class="help">' + both('(tolerancija ' + q.tol + ' %)', '(tolerance ' + q.tol + ' %)') + '</span>' : '') + '</span></div>';
    h += '</div>';
    if (q.explain) h += '<div class="pv-exp">' + locHtml(q.explain) + '</div>';
    return h + '</section>';
  }).join('') + '</div>';
}

function openPreview(code) {
  var m = U.openModal({ cls: 'wide' });
  m.setHead('Pitanja testa', 'Questions of the test', '<span class="code-chip">' + esc(code) + '</span>');
  m.body.innerHTML = '<div class="center"><span class="spin"></span></div>';
  m.setFoot('<button type="button" class="btn" id="pv-close">' + both('Zatvori', 'Close') + '</button><button type="button" class="btn primary" id="pv-host">' + icon('join') + both('Pokreni ovaj test', 'Host this test') + '</button>');
  L.applyAttrs(m.root);
  $(m.root, '#pv-close').addEventListener('click', function () { m.close(); });
  $(m.root, '#pv-host').addEventListener('click', function () { m.close(); openSetup(code); });
  fullQuiz(code).then(function (q) {
    if (m.closed) return;
    if (!q) { m.body.innerHTML = U.errBanner('Test nije pronađen.', 'The test was not found.'); return; }
    var easy = q.easyCount || 0;
    m.body.innerHTML = '<div class="row sp"><div class="qp-title">' + locHtml(q.title) + '</div></div>' +
      '<div class="stat-row"><div class="stat"><b>' + q.questions.length + '</b><span>' + both('pitanja', 'questions') + '</span></div>' +
      '<div class="stat"><b>' + easy + '</b><span>' + both('osnovnih', 'basic') + '</span></div>' +
      '<div class="stat"><b>' + (q.questions.length - easy) + '</b><span>' + both('produbljenih', 'in depth') + '</span></div>' +
      '<div class="stat"><b>' + q.questions.reduce(function (t, x) { return t + x.points; }, 0) + '</b><span>' + both('bodova', 'points') + '</span></div></div>' +
      '<p class="help">' + both('Ovo su sva pitanja koja će učesnici dobiti, sa tačnim odgovorima. Učesnici ih ne vide pre početka.', 'These are all the questions the participants will get, with the correct answers. Participants do not see them before the start.') + '</p>' +
      previewHtml(q);
    L.applyAttrs(m.body);
    L.renderMath(m.body);
  }).catch(function (e) { m.body.innerHTML = U.errBanner('Pitanja se nisu učitala.', 'The questions could not be loaded.', e); });
}

function roomErr(e, sr, en) {
  if (e && e.code && !e.detail) e.detail = e.code;
  if (e && e.anonOff) return U.errBanner('Sobe trenutno ne rade: anonimna prijava nije uključena u Firebase konzoli. Javi to autoru sajta.', 'Rooms are not available right now: anonymous sign-in is not switched on in the Firebase console. Tell the site author.', e);
  if (e && (e.code === 'API_KEY_INVALID' || e.code === 'API_KEY_BLOCKED')) return U.errBanner('Ključ za Firebase nije ispravan ili je blokiran. Javi to autoru sajta.', 'The Firebase key is invalid or blocked. Tell the site author.', e);
  if (e && e.denied) return U.errBanner(sr + ' Možda pravila baze nisu objavljena.', en + ' The database rules may not be published.', e);
  return U.errBanner(sr + ' Proveri vezu pa probaj ponovo.', en + ' Check your connection and try again.', e);
}

function openSetup(code) {
  var m = U.openModal({ cls: 'compact' });
  m.setHead('Pokreni test', 'Host a test', '<span class="code-chip">' + esc(code) + '</span>');
  m.body.innerHTML = U.localBanner() + '<div class="qp-title">' + lessonTitle(code) + '</div>' +
    '<p class="help" id="su-n"></p>' +
    '<label class="switch" for="su-secure" style="margin-top:12px"><input type="checkbox" id="su-secure" checked><span>' + both('Zaštićeni režim: biblioteka i lekcije su zaključane do 30 minuta dok test traje', 'Secure mode: the library and lessons are locked for up to 30 minutes while the test is in progress') + '</span></label>' +
    '<label class="switch" for="su-show" style="margin-top:8px"><input type="checkbox" id="su-show" checked><span>' + both('Učesnik posle slanja vidi svoj rezultat i tačne odgovore', 'After submitting, the participant sees their score and the correct answers') + '</span></label>' +
    '<div id="su-err"></div>';
  m.setFoot('<button type="button" class="btn" id="su-prev">' + both('Pogledaj pitanja', 'View the questions') + '</button><button type="button" class="btn primary" id="su-go">' + icon('join') + both('Napravi sobu', 'Create the room') + '</button>');
  L.applyAttrs(m.root);
  fullQuiz(code).then(function (q) {
    if (q && !m.closed) $(m.root, '#su-n').innerHTML = both(q.questions.length + ' pitanja (' + q.easyCount + ' osnovnih i ' + (q.questions.length - q.easyCount) + ' produbljenih).', q.questions.length + ' questions (' + q.easyCount + ' basic and ' + (q.questions.length - q.easyCount) + ' in depth).');
  });
  $(m.root, '#su-prev').addEventListener('click', function () { openPreview(code); });
  $(m.root, '#su-go').addEventListener('click', function () {
    var b = $(m.root, '#su-go');
    b.disabled = true;
    S.sessionCreate(code, { secure: $(m.root, '#su-secure').checked, showAnswers: $(m.root, '#su-show').checked }).then(function (r) {
      remember(r.sid, code);
      if (FP) FP.begin({ role: 'host', sid: r.sid, quiz: code, secure: r.info.secure });
      m.close();
      openPanel(r.sid);
    }).catch(function (e) {
      b.disabled = false;
      $(m.root, '#su-err').innerHTML = roomErr(e, 'Soba nije napravljena.', 'The room was not created.');
    });
  });
}

function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
function when(ts) { return ts ? L.fmtTime(ts) : ''; }

function openPanel(sid) {
  var m = U.openModal({ cls: 'wide', dismiss: false });
  m.setHead('Soba za test', 'Test room', '<span class="code-chip">' + esc(sid) + '</span>');
  m.body.innerHTML = '<div class="center"><span class="spin"></span></div>';
  L.applyAttrs(m.root);
  var info = null, players = [], results = [], quiz = null, open = {};
  var busy = false;

  function stateBadge() {
    var t = { lobby: both('čeka se početak', 'waiting to start'), live: both('test traje', 'in progress'), ended: both('završen', 'ended') }[info.state];
    return '<span class="tag ' + (info.state === 'live' ? 'green' : info.state === 'ended' ? 'plain' : 'violet') + '">' + t + '</span>';
  }

  function questionStats() {
    if (!quiz || !results.length) return '';
    var rows = quiz.questions.map(function (q, i) {
      var ok = 0, wrong = 0, blank = 0;
      results.forEach(function (r) {
        var a = r.answers[i] ? r.answers[i].a : null;
        if (!U.answered(q, a)) blank++; else if (U.grade(q, a)) ok++; else wrong++;
      });
      return { i: i, q: q, ok: ok, wrong: wrong, blank: blank, p: pct(ok, results.length) };
    });
    rows.sort(function (a, b) { return a.p - b.p; });
    return '<h3 class="hs-h">' + both('Pitanja od najtežeg do najlakšeg', 'Questions from hardest to easiest') + '</h3><div class="hs-qs">' + rows.map(function (r) {
      return '<div class="hs-q"><div class="hs-qt"><b>' + (r.i + 1) + '.</b> ' + locHtml(r.q.text) + '</div><div class="hs-qb"><span class="hs-bar"><i style="width:' + r.p + '%"></i></span><b>' + r.p + '%</b><span class="help">' + both(r.ok + ' tačno · ' + r.wrong + ' netačno · ' + r.blank + ' bez odgovora', r.ok + ' right · ' + r.wrong + ' wrong · ' + r.blank + ' blank') + '</span></div></div>';
    }).join('') + '</div>';
  }

  function detail(r) {
    var h = '<div class="hs-det">';
    quiz.questions.forEach(function (q, i) {
      var a = r.answers[i] ? r.answers[i].a : null;
      var isOk = U.answered(q, a) && U.grade(q, a);
      var st = !U.answered(q, a) ? 'blank' : isOk ? 'ok' : 'no';
      h += '<div class="sa ' + (st === 'ok' ? 'ok' : st === 'no' ? 'no' : '') + '"><div class="qt">' + (i + 1) + '. ' + locHtml(q.text) + '</div><dl><div><dt>' + both('Odgovor', 'Answer') + '</dt><dd>' + U.ansHtml(q, a) + ' <span class="tag ' + (isOk ? '' : 'plain') + '" style="' + (isOk ? 'background:var(--good);color:#fff' : st === 'no' ? 'color:var(--bad);border-color:var(--bad)' : '') + '">' + (isOk ? both('tačno', 'right') : st === 'no' ? both('netačno', 'wrong') : both('prazno', 'blank')) + '</span></dd></div>' +
        (isOk ? '' : '<div><dt>' + both('Tačno je', 'Correct') + '</dt><dd>' + U.correctHtml(q) + '</dd></div>') + '</dl></div>';
    });
    return h + '</div>';
  }

  function table() {
    var byId = {};
    results.forEach(function (r) { byId[r.id] = r; });
    var rows = players.filter(function (p) { return !byId[p.id]; });
    var head = '<tr><th>' + both('Učesnik', 'Participant') + '</th><th class="n good">' + both('Tačno', 'Right') + '</th><th class="n bad">' + both('Netačno', 'Wrong') + '</th><th class="n">' + both('Prazno', 'Blank') + '</th><th class="n">' + both('Bodovi', 'Score') + '</th><th class="n">%</th><th class="n">' + both('Izlazaka', 'Left page') + '</th></tr>';
    var body = results.slice().sort(function (a, b) { return (b.max ? b.score / b.max : 0) - (a.max ? a.score / a.max : 0) || a.at - b.at; }).map(function (r) {
      return '<tr class="hs-row" data-id="' + esc(r.id) + '" tabindex="0"><td><b>' + esc(r.name) + '</b>' + (r.auto ? ' <span class="help">' + both('(poslato automatski)', '(sent automatically)') + '</span>' : '') + '</td><td class="n good">' + r.correct + '</td><td class="n bad">' + r.wrong + '</td><td class="n">' + r.blank + '</td><td class="n">' + r.score + '/' + r.max + '</td><td class="n">' + pct(r.score, r.max) + '%</td><td class="n' + (r.blur ? ' warnc' : '') + '">' + r.blur + '</td></tr>' +
        (open[r.id] ? '<tr class="hs-detrow"><td colspan="7">' + detail(r) + '</td></tr>' : '');
    }).join('');
    body += rows.map(function (p) {
      var t = p.state === 'testing' ? both('odgovara…', 'answering…') : p.state === 'done' ? both('poslao', 'submitted') : both('u čekaonici', 'in the lobby');
      return '<tr class="hs-wait"><td>' + esc(p.name) + '</td><td colspan="5" class="help">' + t + '</td><td class="n' + (p.blur ? ' warnc' : '') + '">' + p.blur + '</td></tr>';
    }).join('');
    return '<div class="hs-scroll"><table class="hs-tbl"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  function draw() {
    if (m.closed) return;
    if (!info) {
      m.body.innerHTML = '<div class="center"><p>' + both('Ova soba više ne postoji.', 'This room no longer exists.') + '</p></div>';
      m.setFoot('<button type="button" class="btn primary" id="hp-x">' + both('Zatvori', 'Close') + '</button>');
      $(m.root, '#hp-x').addEventListener('click', function () { m.close(); });
      return;
    }
    var scroll = m.body.scrollTop;
    var finished = results.length;
    var avg = finished ? results.reduce(function (t, r) { return t + (r.max ? r.score / r.max : 0); }, 0) / finished : 0;
    var rc = results.reduce(function (t, r) { t.c += r.correct; t.w += r.wrong; t.b += r.blank; return t; }, { c: 0, w: 0, b: 0 });
    var link = L.base + 'testovi.html?room=' + sid;
    var h = U.localBanner() +
      '<div class="hs-top"><div><span class="eyebrow">' + both('Kod za pridruživanje', 'Join code') + '</span><div class="hs-code" id="hp-code" role="button" tabindex="0" style="cursor:pointer" data-aria-sr="Kopiraj kod" data-aria-en="Copy code" data-title-on>' + esc(sid) + '</div>' +
      '<p class="help">' + both('Učesnici upisuju kod preko dugmeta „Pridruži se” na bilo kojoj stranici, ili otvore link. Prijava nije potrebna.', 'Participants enter the code with the “Join” button on any page, or open the link. No login needed.') + '</p>' +
      '<input class="input" id="hp-url" type="text" readonly value="' + esc(link) + '" aria-label="link" style="font-size:.85rem;max-width:380px"></div>' +
      '<div class="hs-meta"><div class="qp-title">' + lessonTitle(info.quiz) + '</div><div class="row">' + stateBadge() + '<span class="help">' + info.n + ' ' + both('pitanja', 'questions') + '</span></div>' +
      '<div class="row"><button type="button" class="btn small" id="hp-copy">' + icon('copy') + both('Kopiraj kod', 'Copy code') + '</button><button type="button" class="btn small" id="hp-link">' + icon('copy') + both('Kopiraj link', 'Copy link') + '</button><button type="button" class="btn small" id="hp-prev">' + both('Pitanja i odgovori', 'Questions and answers') + '</button></div></div></div>';
    if (info.state === 'lobby') {
      h += '<h3 class="hs-h">' + both('U čekaonici (' + players.length + ')', 'In the lobby (' + players.length + ')') + '</h3>' +
        (players.length ? '<div class="hs-chips">' + players.map(function (p) { return '<span class="hs-chip">' + esc(p.name) + '<button type="button" class="hs-x" data-kick="' + esc(p.id) + '" aria-label="remove">×</button></span>'; }).join('') + '</div>' : '<p class="help">' + both('Još niko nije ušao. Podeli kod.', 'Nobody has joined yet. Share the code.') + '</p>') +
        '<label class="switch" for="hp-secure" style="margin-top:14px"><input type="checkbox" id="hp-secure"' + (info.secure ? ' checked' : '') + '><span>' + both('Zaštićeni režim (biblioteka je zaključana)', 'Secure mode (the library is locked)') + '</span></label>' +
        '<label class="switch" for="hp-show" style="margin-top:6px"><input type="checkbox" id="hp-show"' + (info.showAnswers ? ' checked' : '') + '><span>' + both('Učesnik vidi rezultat posle slanja', 'Participants see their result after submitting') + '</span></label>';
    } else {
      h += '<div class="stat-row" style="margin-top:14px"><div class="stat"><b>' + players.length + '</b><span>' + both('učesnika', 'participants') + '</span></div>' +
        '<div class="stat"><b>' + finished + '</b><span>' + both('poslalo', 'submitted') + '</span></div>' +
        '<div class="stat good"><b>' + rc.c + '</b><span>' + both('tačnih ukupno', 'right in total') + '</span></div>' +
        '<div class="stat bad"><b>' + rc.w + '</b><span>' + both('netačnih ukupno', 'wrong in total') + '</span></div>' +
        '<div class="stat"><b>' + (finished ? Math.round(avg * 100) + '%' : '–') + '</b><span>' + both('prosek', 'average') + '</span></div></div>';
      h += '<h3 class="hs-h">' + both('Rezultati', 'Results') + '</h3>' + (players.length || results.length ? '<p class="help">' + both('Klikni na učesnika da vidiš koja pitanja je pogodio, a koja pogrešio.', 'Click a participant to see which questions they got right and wrong.') + '</p>' + table() : '<p class="help">' + both('Još niko nije ušao.', 'Nobody has joined.') + '</p>') + questionStats();
    }
    m.body.innerHTML = h;
    m.body.scrollTop = scroll;
    L.applyAttrs(m.body);
    L.renderMath(m.body);
    bind();
    foot();
  }

  function foot() {
    var f = '';
    if (info.state === 'lobby') f = '<button type="button" class="btn danger" id="hp-del">' + icon('trash') + both('Obriši sobu', 'Delete the room') + '</button><button type="button" class="btn primary" id="hp-start"' + (players.length ? '' : ' disabled') + '>' + icon('check') + both('Pokreni test', 'Start the test') + '</button>';
    else if (info.state === 'live') f = '<button type="button" class="btn small" id="hp-csv">' + icon('download') + 'CSV</button><button type="button" class="btn danger" id="hp-end">' + both('Završi test za sve', 'End the test for everyone') + '</button>';
    else f = '<button type="button" class="btn small" id="hp-csv">' + icon('download') + 'CSV</button><button type="button" class="btn danger" id="hp-del">' + icon('trash') + both('Obriši sobu', 'Delete the room') + '</button><button type="button" class="btn" id="hp-x">' + both('Zatvori', 'Close') + '</button>';
    m.setFoot(f);
    L.applyAttrs(m.root);
    var b;
    if ((b = $(m.root, '#hp-start'))) b.addEventListener('click', function () { patch({ state: 'live', started: Date.now() }); });
    if ((b = $(m.root, '#hp-end'))) b.addEventListener('click', function () {
      if (!confirm(L.tr('Završiti test za sve? Odgovori koji su već upisani biće poslati automatski.', 'End the test for everyone? Answers already entered will be sent automatically.'))) return;
      patch({ state: 'ended', ended: Date.now() });
    });
    if ((b = $(m.root, '#hp-del'))) b.addEventListener('click', function () {
      if (!confirm(L.tr('Obrisati sobu i sve rezultate? Ovo se ne može poništiti.', 'Delete the room and all results? This cannot be undone.'))) return;
      S.sessionDelete(sid).then(function () { forget(sid); m.close(); }).catch(function () { L.toast('Nije uspelo.', 'Failed.'); });
    });
    if ((b = $(m.root, '#hp-x'))) b.addEventListener('click', function () { m.close(); });
    if ((b = $(m.root, '#hp-csv'))) b.addEventListener('click', csv);
  }

  function bind() {
    var b;
    function copyCode() { U.copyText(sid, 'Kod kopiran: ' + sid, 'Code copied: ' + sid); }
    if ((b = $(m.root, '#hp-copy'))) b.addEventListener('click', copyCode);
    if ((b = $(m.root, '#hp-code'))) {
      b.addEventListener('click', copyCode);
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyCode(); } });
    }
    if ((b = $(m.root, '#hp-url'))) b.addEventListener('focus', function () { b.select(); });
    if ((b = $(m.root, '#hp-link'))) b.addEventListener('click', function () { U.copyText(L.base + 'testovi.html?room=' + sid, 'Link kopiran.', 'Link copied.'); });
    if ((b = $(m.root, '#hp-prev'))) b.addEventListener('click', function () { openPreview(info.quiz); });
    if ((b = $(m.root, '#hp-secure'))) b.addEventListener('change', function (e) { patch({ secure: e.target.checked }, true); });
    if ((b = $(m.root, '#hp-show'))) b.addEventListener('change', function (e) { patch({ showAnswers: e.target.checked }, true); });
    m.body.querySelectorAll('[data-kick]').forEach(function (x) {
      x.addEventListener('click', function () { S.sessionKick(sid, x.getAttribute('data-kick')).then(load).catch(function () {}); });
    });
    m.body.querySelectorAll('.hs-row').forEach(function (r) {
      function tog() { var id = r.getAttribute('data-id'); open[id] = !open[id]; draw(); }
      r.addEventListener('click', tog);
      r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } });
    });
  }

  function patch(obj, quiet) {
    if (busy) return;
    busy = true;
    S.sessionPatch(sid, obj).then(function () {
      busy = false;
      Object.keys(obj).forEach(function (k) { info[k] = obj[k]; });
      if (FP) { if (obj.state === 'live') FP.touch({ at: Date.now() }); else if (obj.state === 'ended') FP.finish(sid); else if (obj.secure != null) FP.touch({ secure: obj.secure }); }
      if (!quiet) draw();
      load();
    }).catch(function (e) {
      busy = false;
      L.toast('Nije uspelo: proveri da li su pravila baze objavljena.', 'Failed: check that the database rules are published.');
    });
  }

  function csv() {
    var head = ['name', 'right', 'wrong', 'blank', 'score', 'max', 'percent', 'left_page', 'submitted_at'];
    quiz.questions.forEach(function (q, i) { head.push('Q' + (i + 1)); });
    var lines = [head.map(U.csvCell).join(',')];
    results.forEach(function (r) {
      var row = [r.name, r.correct, r.wrong, r.blank, r.score, r.max, pct(r.score, r.max), r.blur, new Date(r.at).toISOString()];
      quiz.questions.forEach(function (q, i) {
        var a = r.answers[i] ? r.answers[i].a : null;
        row.push(!U.answered(q, a) ? '' : U.grade(q, a) ? 1 : 0);
      });
      lines.push(row.map(U.csvCell).join(','));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'lav-test-' + sid + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var last = '';
  function load() {
    if (m.closed || busy) return;
    S.sessionInfo(sid).then(function (inf) {
      if (m.closed) return;
      if (!inf) { info = null; if (FP) FP.finish(sid); draw(); return; }
      info = inf;
      return Promise.all([S.sessionPlayers(sid), inf.state === 'lobby' ? Promise.resolve([]) : S.sessionResults(sid), quiz ? Promise.resolve(quiz) : fullQuiz(inf.quiz)]).then(function (r) {
        if (m.closed) return;
        players = r[0]; results = r[1]; quiz = r[2];
        var sig = JSON.stringify([info, players, results.map(function (x) { return [x.id, x.score, x.blur]; })]);
        if (sig !== last) { last = sig; draw(); }
      });
    }).catch(function (e) {
      if (!info) m.body.innerHTML = e && e.denied && !e.anonOff
        ? U.errBanner('Ne možeš da vidiš ovu sobu. Otvori je na uređaju na kome je napravljena.', 'You cannot see this room. Open it on the device where it was created.', e)
        : roomErr(e, 'Soba se nije otvorila.', 'The room could not be opened.');
    });
  }
  load();
  m.timers.push(setInterval(load, 3000));
  L.onLang(function () { if (info && !m.closed) draw(); });
}

L.host = { mine: mine, forget: forget, preview: openPreview, start: openSetup, open: openPanel };
})();
