(function () {
'use strict';

var L = window.LAV;
var S = L.store;
var MB = L.mathbox;
var esc = L.esc;
var both = L.both;
var tr = L.tr;
var icon = L.icon;

function locHtml(x) {
  if (x == null) return '';
  if (typeof x === 'string') return esc(x);
  return both(esc(x.sr || ''), esc(x.en || x.sr || ''));
}
function locText(x) { return L.loc(x); }
function ptsLabel(n) {
  return both(n + (n === 1 ? ' poen' : ' poena'), n + (n === 1 ? ' point' : ' points'));
}
function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function range(n) { var o = []; for (var i = 0; i < n; i++) o.push(i); return o; }
function $(el, sel) { return el.querySelector(sel); }
function copyText(text, srMsg, enMsg) {
  var done = function () { L.toast(srMsg, enMsg); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
  else {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
    done();
  }
}
function roomLink(code) { return L.base + 'index.html?room=' + code; }

function sha256(str) {
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  return Promise.resolve(sha256Js(str));
}
function sha256Js(msg) {
  var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  var utf = unescape(encodeURIComponent(msg));
  var bytes = [];
  for (var i = 0; i < utf.length; i++) bytes.push(utf.charCodeAt(i));
  var bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (var s = 56; s >= 0; s -= 8) bytes.push(s >= 32 ? 0 : (bitLen >>> s) & 0xff);
  function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
  for (var off = 0; off < bytes.length; off += 64) {
    var w = [];
    for (var t = 0; t < 16; t++) w[t] = (bytes[off + t * 4] << 24) | (bytes[off + t * 4 + 1] << 16) | (bytes[off + t * 4 + 2] << 8) | bytes[off + t * 4 + 3];
    for (t = 16; t < 64; t++) {
      var s0 = rr(w[t - 15], 7) ^ rr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      var s1 = rr(w[t - 2], 17) ^ rr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }
    var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (t = 0; t < 64; t++) {
      var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
      var ch = (e & f) ^ (~e & g);
      var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
      var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
      var mj = (a & b) ^ (a & c) ^ (b & c);
      var t2 = (S0 + mj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
}

var stack = [];
function openModal(o) {
  o = o || {};
  var prevFocus = document.activeElement;
  var root = document.createElement('div');
  root.className = 'modal-root';
  root.innerHTML =
    '<div class="modal ' + (o.cls || '') + '" role="dialog" aria-modal="true">' +
    '<div class="modal-head"><div><p class="msub"></p><h2></h2></div><button type="button" class="modal-x" data-aria-sr="Zatvori" data-aria-en="Close">' + icon('close') + '</button></div>' +
    '<div class="modal-body"></div><div class="modal-foot" hidden></div></div>';
  document.body.appendChild(root);
  document.body.style.overflow = 'hidden';
  var m = {
    root: root,
    el: root.firstChild,
    sub: $(root, '.msub'),
    title: $(root, 'h2'),
    body: $(root, '.modal-body'),
    foot: $(root, '.modal-foot'),
    timers: [],
    closed: false,
    onClose: o.onClose || null,
    setHead: function (sr, en, sub) {
      m.title.innerHTML = both(esc(sr), esc(en));
      m.sub.innerHTML = sub || '';
      m.sub.hidden = !sub;
    },
    setCls: function (cls) { m.el.className = 'modal ' + cls; },
    setFoot: function (html) {
      m.foot.innerHTML = html || '';
      m.foot.hidden = !html;
    },
    close: function () {
      if (m.closed) return;
      m.closed = true;
      m.timers.forEach(clearInterval);
      MB.close();
      if (m.onClose) m.onClose();
      root.remove();
      stack = stack.filter(function (x) { return x !== m; });
      if (!stack.length) document.body.style.overflow = '';
      if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) {} }
    }
  };
  $(root, '.modal-x').addEventListener('click', function () { m.close(); });
  root.addEventListener('pointerdown', function (e) { if (e.target === root) root.__down = true; else root.__down = false; });
  root.addEventListener('click', function (e) { if (e.target === root && root.__down && o.dismiss !== false) m.close(); });
  stack.push(m);
  L.applyAttrs(root);
  return m;
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && stack.length && !e.defaultPrevented) stack[stack.length - 1].close();
});

function localBanner() {
  if (S.remote) return '';
  return '<div class="banner">' + icon('info') + '<div>' + both(
    '<b>Lokalni režim.</b> Ova stranica još nije povezana sa serverom, pa se kvizovi i odgovori čuvaju samo na ovom uređaju. Autor mora da poveže Firebase da bi sobe radile između uređaja.',
    '<b>Local mode.</b> This site is not connected to a server yet, so quizzes and answers are stored only on this device. The author needs to connect Firebase for rooms to work across devices.') + '</div></div>';
}
function errBanner(sr, en) {
  return '<div class="banner bad" role="alert">' + icon('info') + '<div>' + both(sr, en) + '</div></div>';
}

function normText(s) {
  return String(s == null ? '' : s).trim().toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
}
function parseNum(s) {
  var t = String(s).replace(/\s/g, '').replace(',', '.');
  var m = t.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(.*)$/i);
  if (!m) return null;
  return { n: parseFloat(m[1]), rest: m[2] };
}
function matchText(q, s) {
  var alts = String(q.correct == null ? '' : q.correct).split('|').map(function (x) { return x.trim(); }).filter(Boolean);
  if (!normText(s)) return false;
  if (q.numeric) {
    var got = parseNum(s);
    if (!got || isNaN(got.n)) return false;
    var units = String(q.unit || '').split('|').map(function (u) { return normText(u).replace(/\s/g, ''); }).filter(Boolean);
    var rest = normText(got.rest).replace(/\s/g, '');
    if (rest && (units.length ? units.indexOf(rest) < 0 : /\d/.test(rest) || rest.length > 14)) return false;
    var tol = (q.tol == null ? 1 : q.tol) / 100;
    return alts.some(function (a) {
      var want = parseNum(a);
      if (!want) return false;
      if (want.n === 0) return Math.abs(got.n) < 1e-9;
      return Math.abs(got.n - want.n) <= Math.abs(want.n) * tol + 1e-12;
    });
  }
  var ns = normText(s);
  return alts.some(function (a) { return normText(a) === ns; });
}
function grade(q, a) {
  if (a == null || a === '') return false;
  if (q.type === 'choice') return Number(a) === Number(q.correct);
  if (q.type === 'bool') return a === q.correct || String(a) === String(q.correct);
  if (q.type === 'multi') {
    var want = (q.correct || []).map(Number).sort().join(',');
    var got = (Array.isArray(a) ? a : []).map(Number).sort().join(',');
    return !!got && want === got;
  }
  return matchText(q, a);
}
function answered(q, a) {
  if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
  if (q.type === 'bool') return a === true || a === false;
  if (q.type === 'choice') return a !== null && a !== undefined && a !== '';
  return !!String(a == null ? '' : a).trim();
}
function ansHtml(q, a) {
  if (!answered(q, a)) return '<span class="help">' + both('bez odgovora', 'no answer') + '</span>';
  if (q.type === 'choice') return locHtml(q.options[a]);
  if (q.type === 'multi') return a.map(function (i) { return locHtml(q.options[i]); }).join(', ');
  if (q.type === 'bool') return a ? both('Tačno', 'True') : both('Netačno', 'False');
  return esc(a);
}
function correctHtml(q) {
  if (q.type === 'choice') return locHtml(q.options[q.correct]);
  if (q.type === 'multi') return (q.correct || []).map(function (i) { return locHtml(q.options[i]); }).join(', ');
  if (q.type === 'bool') return q.correct ? both('Tačno', 'True') : both('Netačno', 'False');
  var alts = String(q.correct).split('|').map(function (x) { return x.trim(); }).filter(Boolean);
  return esc(alts.join('  /  ')) + (q.unit ? ' ' + esc(String(q.unit).split('|')[0]) : '');
}
function typeLabel(t) {
  return { choice: both('Jedan tačan odgovor', 'Single choice'), multi: both('Više tačnih odgovora', 'Several correct'), bool: both('Tačno / netačno', 'True / false'), text: both('Upisan odgovor', 'Typed answer') }[t];
}
function modeLabel(v) {
  return { off: both('isključeno', 'off'), optional: both('opciono', 'optional'), required: both('obavezno', 'required') }[v];
}

function openJoin(prefill) {
  var m = openModal({ cls: 'compact' });
  m.setHead('Pridruži se sobi', 'Join a room');
  var savedName = '';
  try { savedName = localStorage.getItem('lav-name') || ''; } catch (e) {}
  m.body.innerHTML =
    localBanner() +
    '<div class="field-row"><label for="j-code">' + both('Kod sobe', 'Room code') + '</label>' +
    '<input id="j-code" class="input code" type="text" maxlength="8" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text" data-ph-sr="KOD" data-ph-en="CODE"></div>' +
    '<div class="field-row"><label for="j-name">' + both('Korisničko ime', 'Username') + '</label>' +
    '<input id="j-name" class="input" type="text" maxlength="32" autocomplete="nickname" data-ph-sr="Kako da te zovemo?" data-ph-en="What should we call you?">' +
    '<p class="help">' + both('Ovo ime će autor kviza videti uz tvoje odgovore.', 'The quiz author will see this name next to your answers.') + '</p></div>' +
    '<div id="j-err"></div>';
  m.setFoot('<button type="button" class="btn" id="j-cancel">' + both('Otkaži', 'Cancel') + '</button><button type="button" class="btn primary" id="j-go">' + icon('join') + both('Uđi u sobu', 'Enter room') + '</button>');
  L.applyAttrs(m.root);
  var codeEl = $(m.root, '#j-code'), nameEl = $(m.root, '#j-name'), errEl = $(m.root, '#j-err'), go = $(m.root, '#j-go');
  codeEl.value = (prefill || '').toUpperCase();
  nameEl.value = savedName;
  codeEl.addEventListener('input', function () { codeEl.value = codeEl.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
  $(m.root, '#j-cancel').addEventListener('click', function () { m.close(); });
  function submit() {
    var code = codeEl.value.trim().toUpperCase();
    var name = nameEl.value.trim();
    if (!code) { errEl.innerHTML = errBanner('Upiši kod sobe.', 'Enter the room code.'); codeEl.focus(); return; }
    if (!name) { errEl.innerHTML = errBanner('Upiši korisničko ime.', 'Enter a username.'); nameEl.focus(); return; }
    errEl.innerHTML = '';
    go.disabled = true;
    S.get(code).then(function (quiz) {
      go.disabled = false;
      if (m.closed) return;
      if (!quiz) { errEl.innerHTML = errBanner('Soba sa tim kodom ne postoji.', 'No room with that code exists.'); return; }
      if (!quiz.settings.open) { errEl.innerHTML = errBanner('Ova soba je zatvorena.', 'This room is closed.'); return; }
      try { localStorage.setItem('lav-name', name); } catch (e) {}
      renderPlayer(m, code, quiz, name);
    }).catch(function () {
      go.disabled = false;
      errEl.innerHTML = errBanner('Server nije dostupan. Proveri vezu i pokušaj ponovo.', 'The server is unreachable. Check your connection and try again.');
    });
  }
  go.addEventListener('click', submit);
  m.root.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); submit(); } });
  setTimeout(function () { (codeEl.value ? nameEl : codeEl).focus(); }, 60);
  return m;
}

function renderPlayer(m, code, quiz, name) {
  var qs = quiz.questions;
  var order = range(qs.length);
  if (quiz.settings.shuffleQ) order = shuffle(order);
  var optOrder = {};
  qs.forEach(function (q, i) {
    if (q.type === 'choice' || q.type === 'multi') optOrder[i] = quiz.settings.shuffleO ? shuffle(range(q.options.length)) : range(q.options.length);
  });
  var boxes = {};
  var lesson = L.lessonByQuiz(code);
  m.setCls('wide');
  m.setHead(locText(quiz.title) || 'Kviz', locText(quiz.title) || 'Quiz', '<span class="code-chip">' + esc(code) + '</span> · ' + esc(name));
  m.title.innerHTML = locHtml(quiz.title);

  var html = localBanner() +
    '<div class="qp-progress" aria-hidden="true"><i id="qp-bar"></i></div>' +
    '<div id="qp-warn"></div><div class="qlist" id="qp-list">';
  order.forEach(function (qi, pos) {
    var q = qs[qi];
    html += '<section class="qq" data-qi="' + qi + '"><div class="qq-top"><span class="qq-n">' + both('Pitanje ' + (pos + 1) + ' od ' + qs.length, 'Question ' + (pos + 1) + ' of ' + qs.length) +
      '</span><span class="qq-pts">' + ptsLabel(q.points) + '</span></div>' +
      '<div class="qq-text">' + locHtml(q.text) + '</div>';
    if (q.formula !== 'off') {
      html += '<div class="qq-block"><div class="qq-label"><span>' + both('Formula', 'Formula') + '</span><em>' + (q.formula === 'required' ? both('obavezno', 'required') : both('opciono', 'optional')) + '</em></div><div class="fbox" data-fbox="' + qi + '"></div></div>';
    }
    html += '<div class="qq-block"><div class="qq-label"><span>' + both('Odgovor', 'Answer') + '</span>' + (q.type === 'multi' ? '<em>' + both('izaberi sve tačne', 'select all that apply') + '</em>' : '') + '</div>';
    if (q.type === 'choice' || q.type === 'multi') {
      html += '<div class="qq-opts">';
      optOrder[qi].forEach(function (oi) {
        html += '<label class="qq-opt"><input type="' + (q.type === 'multi' ? 'checkbox' : 'radio') + '" name="a' + qi + '" value="' + oi + '"><span>' + locHtml(q.options[oi]) + '</span></label>';
      });
      html += '</div>';
    } else if (q.type === 'bool') {
      html += '<div class="qq-opts"><label class="qq-opt"><input type="radio" name="a' + qi + '" value="1"><span>' + both('Tačno', 'True') + '</span></label>' +
        '<label class="qq-opt"><input type="radio" name="a' + qi + '" value="0"><span>' + both('Netačno', 'False') + '</span></label></div>';
    } else {
      html += '<input class="input" type="text" name="a' + qi + '" autocomplete="off" autocapitalize="off" spellcheck="false"' + (q.numeric ? ' inputmode="decimal"' : '') + ' data-ph-sr="' + (q.numeric ? 'Upiši broj' : 'Upiši odgovor') + '" data-ph-en="' + (q.numeric ? 'Enter a number' : 'Enter your answer') + '">';
    }
    html += '</div>';
    if (q.working !== 'off') {
      html += '<div class="qq-block"><div class="qq-label"><span>' + both('Postupak', 'Working') + '</span><em>' + (q.working === 'required' ? both('obavezno', 'required') : both('opciono', 'optional')) + '</em></div>' +
        '<textarea class="textarea" name="w' + qi + '" rows="3" data-ph-sr="Objasni kako si došao do odgovora" data-ph-en="Explain how you got the answer"></textarea></div>';
    }
    html += '</section>';
  });
  html += '</div>';
  m.body.innerHTML = html;
  m.body.scrollTop = 0;
  L.applyAttrs(m.body);
  L.renderMath(m.body);

  qs.forEach(function (q, qi) {
    if (q.formula === 'off') return;
    var host = $(m.body, '[data-fbox="' + qi + '"]');
    boxes[qi] = MB.create(host, { onChange: updateProgress });
  });

  function readAnswers() {
    return qs.map(function (q, qi) {
      var sec = $(m.body, '.qq[data-qi="' + qi + '"]');
      var a = null;
      if (q.type === 'choice') {
        var r = sec.querySelector('input[type=radio]:checked');
        a = r ? Number(r.value) : null;
      } else if (q.type === 'multi') {
        a = Array.prototype.map.call(sec.querySelectorAll('input[type=checkbox]:checked'), function (c) { return Number(c.value); }).sort(function (x, y) { return x - y; });
      } else if (q.type === 'bool') {
        var rb = sec.querySelector('input[type=radio]:checked');
        a = rb ? rb.value === '1' : null;
      } else {
        a = sec.querySelector('input[type=text]').value.trim();
      }
      var w = sec.querySelector('textarea');
      return { a: a, t: q.type, f: boxes[qi] ? boxes[qi].get() : '', w: w ? w.value.trim() : '' };
    });
  }
  var bar = $(m.body, '#qp-bar');
  function updateProgress() {
    var ans = readAnswers();
    var n = 0;
    ans.forEach(function (x, i) { if (answered(qs[i], x.a)) n++; });
    bar.style.width = (qs.length ? n / qs.length * 100 : 0) + '%';
    $(m.root, '#qp-count').innerHTML = both(n + ' od ' + qs.length + ' odgovoreno', n + ' of ' + qs.length + ' answered');
  }
  m.setFoot('<span class="help" id="qp-count" style="margin-right:auto"></span><button type="button" class="btn primary" id="qp-send">' + icon('check') + both('Pošalji odgovore', 'Submit answers') + '</button>');
  updateProgress();
  m.body.addEventListener('input', updateProgress);
  m.body.addEventListener('change', updateProgress);

  var send = $(m.root, '#qp-send');
  var warned = false;
  send.addEventListener('click', function () {
    var ans = readAnswers();
    var warn = $(m.body, '#qp-warn');
    m.body.querySelectorAll('.qq').forEach(function (s) { s.classList.remove('miss'); });
    var blockers = [];
    var empty = [];
    qs.forEach(function (q, qi) {
      if (q.formula === 'required' && !ans[qi].f) blockers.push(qi);
      else if (q.working === 'required' && !ans[qi].w) blockers.push(qi);
      if (!answered(q, ans[qi].a)) empty.push(qi);
    });
    if (blockers.length) {
      blockers.forEach(function (qi) { $(m.body, '.qq[data-qi="' + qi + '"]').classList.add('miss'); });
      warn.innerHTML = errBanner('Neka pitanja traže formulu ili postupak. Popuni obeležena pitanja.', 'Some questions need a formula or working. Fill in the highlighted questions.');
      $(m.body, '.qq[data-qi="' + blockers[0] + '"]').scrollIntoView({ block: 'center', behavior: L.reduce ? 'auto' : 'smooth' });
      return;
    }
    if (empty.length && !warned) {
      warned = true;
      empty.forEach(function (qi) { $(m.body, '.qq[data-qi="' + qi + '"]').classList.add('miss'); });
      warn.innerHTML = '<div class="banner">' + icon('info') + '<div>' + both(empty.length + ' pitanja je bez odgovora. Klikni ponovo na „Pošalji odgovore” ako želiš da pošalješ ipak.', empty.length + ' question(s) have no answer. Press “Submit answers” again to send anyway.') + '</div></div>';
      $(m.body, '.qq[data-qi="' + empty[0] + '"]').scrollIntoView({ block: 'center', behavior: L.reduce ? 'auto' : 'smooth' });
      return;
    }
    warn.innerHTML = '';
    var score = 0, max = 0;
    qs.forEach(function (q, qi) {
      max += q.points;
      if (grade(q, ans[qi].a)) score += q.points;
    });
    var payload = {
      name: name,
      at: Date.now(),
      score: score,
      max: max,
      answers: ans.map(function (x) { return { a: x.a == null ? '' : x.a, t: x.t, f: x.f, w: x.w }; })
    };
    send.disabled = true;
    S.submit(code, payload).then(function () {
      showPlayerResult(m, code, quiz, name, ans, score, max, lesson);
    }).catch(function () {
      send.disabled = false;
      warn.innerHTML = errBanner('Odgovori nisu poslati jer server nije dostupan. Tvoji odgovori su i dalje ovde: pokušaj ponovo.', 'The answers were not sent because the server is unreachable. Your answers are still here: try again.');
      warn.scrollIntoView({ block: 'center' });
    });
  });
}

function showPlayerResult(m, code, quiz, name, ans, score, max, lesson) {
  var qs = quiz.questions;
  var show = quiz.settings.showAnswers;
  var html = '<div class="done-score"><span class="eyebrow">' + both('Odgovori su poslati', 'Answers sent') + '</span>';
  if (show) {
    html += '<span class="big">' + score + ' / ' + max + '</span><p>' + both('Bodovi za konačne odgovore. Formule i postupak pregleda autor kviza.', 'Points for the final answers. The quiz author reviews formulas and working.') + '</p>';
  } else {
    html += '<p>' + both('Autor kviza je isključio prikaz rezultata. Hvala na učešću, ' + esc(name) + '.', 'The quiz author has turned off result display. Thank you for taking part, ' + esc(name) + '.') + '</p>';
  }
  html += '</div>';
  if (show) {
    html += '<div class="qlist">';
    qs.forEach(function (q, qi) {
      var ok = grade(q, ans[qi].a);
      html += '<section class="qq ' + (ok ? 'ok' : 'no') + '"><div class="qq-top"><span class="qq-n">' + both('Pitanje ' + (qi + 1), 'Question ' + (qi + 1)) + '</span><span class="tag ' + (ok ? '' : 'plain') + '" style="' + (ok ? 'background:var(--good);color:#fff' : 'color:var(--bad);border-color:var(--bad)') + '">' + (ok ? both('Tačno', 'Correct') : both('Netačno', 'Wrong')) + '</span></div>' +
        '<div class="qq-text">' + locHtml(q.text) + '</div>' +
        '<div class="qq-fb"><div><b>' + both('Tvoj odgovor: ', 'Your answer: ') + '</b>' + ansHtml(q, ans[qi].a) + '</div>' +
        (ok ? '' : '<div><b>' + both('Tačan odgovor: ', 'Correct answer: ') + '</b>' + correctHtml(q) + '</div>');
      if (q.explain) html += '<div>' + locHtml(q.explain) + '</div>';
      if (q.ref && lesson) html += '<a href="' + L.lessonUrl(lesson.slug) + '#' + esc(q.ref) + '">' + both('Pogledaj u lekciji →', 'Review in the lesson →') + '</a>';
      html += '</div></section>';
    });
    html += '</div>';
  }
  m.body.innerHTML = html;
  m.body.scrollTop = 0;
  L.renderMath(m.body);
  var foot = '<button type="button" class="btn" id="pr-close">' + both('Zatvori', 'Close') + '</button>';
  if (lesson && location.pathname.indexOf(lesson.slug) < 0) foot += '<a class="btn" href="' + L.lessonUrl(lesson.slug) + '">' + both('Nazad na lekciju', 'Back to the lesson') + '</a>';
  foot += '<button type="button" class="btn primary" id="pr-again">' + icon('refresh') + both('Pokušaj ponovo', 'Try again') + '</button>';
  m.setFoot(foot);
  $(m.root, '#pr-close').addEventListener('click', function () { m.close(); });
  $(m.root, '#pr-again').addEventListener('click', function () { m.close(); openJoin(code); });
}

function authed() {
  try { return sessionStorage.getItem('lav-auth') === '1'; } catch (e) { return false; }
}
function openCreate() {
  if (authed()) { openDashboard(); return; }
  var m = openModal({ cls: 'compact' });
  m.setHead('Napravi kviz', 'Create a quiz');
  m.body.innerHTML =
    localBanner() +
    '<p>' + both('Upiši lozinku autora da bi napravio kviz i video odgovore.', 'Enter the author password to create a quiz and see the answers.') + '</p>' +
    '<div class="field-row"><label for="p-pw">' + both('Lozinka', 'Password') + '</label>' +
    '<input id="p-pw" class="input" type="password" autocomplete="current-password" data-ph-sr="Lozinka" data-ph-en="Password"></div><div id="p-err"></div>';
  m.setFoot('<button type="button" class="btn" id="p-cancel">' + both('Otkaži', 'Cancel') + '</button><button type="button" class="btn primary" id="p-go">' + icon('lock') + both('Nastavi', 'Continue') + '</button>');
  L.applyAttrs(m.root);
  var pw = $(m.root, '#p-pw'), err = $(m.root, '#p-err');
  $(m.root, '#p-cancel').addEventListener('click', function () { m.close(); });
  function go() {
    sha256(pw.value).then(function (h) {
      if (h === String(L.config.creatorPasswordHash || '').toLowerCase()) {
        try { sessionStorage.setItem('lav-auth', '1'); } catch (e) {}
        m.close();
        openDashboard();
      } else {
        err.innerHTML = errBanner('Pogrešna lozinka.', 'Wrong password.');
        pw.select();
      }
    });
  }
  $(m.root, '#p-go').addEventListener('click', go);
  pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
  setTimeout(function () { pw.focus(); }, 60);
}

function openDashboard() {
  var m = openModal({ cls: 'wide' });
  function show() {
    m.setCls('wide');
    m.setHead('Moji kvizovi', 'My quizzes', '<span class="eyebrow">' + both('Prostor autora', 'Author space') + '</span>');
    m.body.innerHTML = localBanner() + '<div class="row sp"><button type="button" class="btn primary" id="d-new">' + icon('plus') + both('Novi kviz', 'New quiz') + '</button>' +
      '<div class="row"><button type="button" class="btn small" id="d-refresh">' + icon('refresh') + both('Osveži', 'Refresh') + '</button><button type="button" class="btn small" id="d-lock">' + icon('lock') + both('Zaključaj', 'Lock') + '</button></div></div>' +
      '<div id="d-list"><div class="center"><span class="spin"></span></div></div>';
    m.setFoot('');
    $(m.root, '#d-new').addEventListener('click', function () { openBuilder(m, null, show); });
    $(m.root, '#d-refresh').addEventListener('click', load);
    $(m.root, '#d-lock').addEventListener('click', function () {
      try { sessionStorage.removeItem('lav-auth'); } catch (e) {}
      m.close();
    });
    load();
  }
  function load() {
    var host = $(m.root, '#d-list');
    if (!host) return;
    S.list().then(function (rows) {
      if (m.closed) return;
      var created = rows.filter(function (r) { return !r.builtin; });
      var lessons = rows.filter(function (r) { return r.builtin; });
      var html = '<h3 class="lab-l" style="margin-top:6px">' + both('Moji kvizovi', 'My quizzes') + '</h3>';
      html += created.length ? '<div class="qlist">' + created.map(rowHtml).join('') + '</div>' : '<p class="help">' + both('Još nema kvizova. Pritisni „Novi kviz”.', 'No quizzes yet. Press “New quiz”.') + '</p>';
      html += '<h3 class="lab-l" style="margin-top:14px">' + both('Testovi uz lekcije', 'Lesson tests') + '</h3><div class="qlist">' + lessons.map(rowHtml).join('') + '</div>';
      host.innerHTML = html;
      L.applyAttrs(host);
      host.querySelectorAll('[data-count]').forEach(function (el) {
        var c = el.getAttribute('data-count');
        S.subCount(c).then(function (n) { el.innerHTML = both(n + (n === 1 ? ' odgovor' : ' odgovora'), n + (n === 1 ? ' answer' : ' answers')); }).catch(function () { el.textContent = '–'; });
      });
      host.querySelectorAll('[data-act]').forEach(function (b) {
        b.addEventListener('click', function () { rowAction(b.getAttribute('data-act'), b.getAttribute('data-code'), rows); });
      });
    }).catch(function () {
      host.innerHTML = errBanner('Server nije dostupan. Proveri vezu i pokušaj ponovo.', 'The server is unreachable. Check your connection and try again.');
    });
  }
  function rowHtml(r) {
    var q = r.quiz;
    var open = q.settings.open;
    var acts = '<button type="button" class="btn small" data-act="results" data-code="' + r.code + '">' + both('Odgovori', 'Answers') + '</button>';
    if (r.builtin) {
      acts += '<button type="button" class="btn small" data-act="dup" data-code="' + r.code + '">' + icon('dup') + both('Dupliraj', 'Duplicate') + '</button>';
    } else {
      acts += '<button type="button" class="btn small" data-act="edit" data-code="' + r.code + '">' + icon('edit') + both('Uredi', 'Edit') + '</button>' +
        '<button type="button" class="btn small" data-act="toggle" data-code="' + r.code + '">' + (open ? both('Zatvori sobu', 'Close room') : both('Otvori sobu', 'Open room')) + '</button>';
    }
    acts += '<button type="button" class="btn small" data-act="link" data-code="' + r.code + '">' + icon('link') + both('Link', 'Link') + '</button>';
    if (!r.builtin) acts += '<button type="button" class="btn small danger" data-act="delete" data-code="' + r.code + '">' + icon('trash') + '</button>';
    return '<div class="qrow"><div><h3>' + locHtml(q.title) + '</h3><div class="meta"><span class="code-chip">' + r.code + '</span>' +
      '<span class="tag plain">' + both(q.questions.length + ' pitanja', q.questions.length + ' questions') + '</span>' +
      '<span class="tag plain" data-count="' + r.code + '">…</span>' +
      (r.builtin ? '<span class="tag">' + both('Lekcija', 'Lesson') + '</span>' : '') +
      (!open ? '<span class="tag plain" style="color:var(--bad)">' + both('zatvorena', 'closed') + '</span>' : '') +
      '</div></div><div class="acts">' + acts + '</div></div>';
  }
  function rowAction(act, code, rows) {
    var row = rows.filter(function (r) { return r.code === code; })[0];
    if (act === 'results') openResults(m, code, row.quiz, show);
    else if (act === 'edit') openBuilder(m, { code: code, quiz: row.quiz }, show);
    else if (act === 'dup') openBuilder(m, { code: null, quiz: row.quiz, copy: true }, show);
    else if (act === 'link') copyText(roomLink(code), 'Link do sobe kopiran', 'Room link copied');
    else if (act === 'toggle') {
      S.patch(code, { 'settings/open': !row.quiz.settings.open }).then(load).catch(function () { L.toast('Nije uspelo. Proveri vezu.', 'Failed. Check your connection.'); });
    } else if (act === 'delete') {
      if (confirm(tr('Obrisati kviz ' + code + ' i sve odgovore? Ovo se ne može poništiti.', 'Delete quiz ' + code + ' and all its answers? This cannot be undone.'))) {
        S.remove(code).then(load).catch(function () { L.toast('Nije uspelo. Proveri vezu.', 'Failed. Check your connection.'); });
      }
    }
  }
  show();
}

function blankQ() {
  return { type: 'choice', text: '', options: ['', ''], correct: 0, numeric: false, tol: 1, unit: '', formula: 'off', working: 'off', points: 1, explain: '' };
}
function cloneQuiz(q) {
  var t = L.lang();
  function flat(x) { return typeof x === 'object' && x ? (x[t] || x.sr || x.en || '') : (x || ''); }
  return {
    title: flat(q.title),
    settings: { shuffleQ: q.settings.shuffleQ, shuffleO: q.settings.shuffleO, showAnswers: q.settings.showAnswers, open: true },
    questions: q.questions.map(function (x) {
      return {
        type: x.type, text: flat(x.text), options: x.options.map(flat),
        correct: Array.isArray(x.correct) ? x.correct.slice() : x.correct,
        numeric: x.numeric, tol: x.tol, unit: x.unit, formula: x.formula, working: x.working, points: x.points, explain: flat(x.explain)
      };
    })
  };
}

function openBuilder(m, ctx, back) {
  var editing = ctx && ctx.code ? ctx.code : null;
  var draft;
  if (ctx && ctx.quiz) {
    draft = cloneQuiz(ctx.quiz);
    if (ctx.copy) draft.title = draft.title + ' (' + tr('kopija', 'copy') + ')';
  } else draft = { title: '', settings: { shuffleQ: false, shuffleO: false, showAnswers: true, open: true }, questions: [blankQ()] };
  var createdAt = ctx && ctx.quiz && editing ? ctx.quiz.createdAt : Date.now();

  m.setCls('wide');
  m.setHead(editing ? 'Uredi kviz' : (ctx && ctx.copy ? 'Dupliraj kviz' : 'Novi kviz'), editing ? 'Edit quiz' : (ctx && ctx.copy ? 'Duplicate quiz' : 'New quiz'));
  m.body.innerHTML = localBanner() + '<div class="qb-top" id="qb-top"></div><div class="qlist" id="qb-list"></div>' +
    '<div class="row"><button type="button" class="btn" id="qb-add">' + icon('plus') + both('Dodaj pitanje', 'Add question') + '</button></div><div id="qb-err"></div>';
  m.setFoot('<button type="button" class="btn" id="qb-back">' + both('Nazad', 'Back') + '</button><button type="button" class="btn primary" id="qb-save">' + icon('check') + both('Sačuvaj kviz', 'Save quiz') + '</button>');
  var top = $(m.root, '#qb-top'), list = $(m.root, '#qb-list'), errEl = $(m.root, '#qb-err');

  function renderTop() {
    var s = draft.settings;
    top.innerHTML =
      '<div class="field-row"><label for="qb-title">' + both('Naslov kviza', 'Quiz title') + '</label><input id="qb-title" class="input" type="text" maxlength="90" data-f="title" data-ph-sr="Na primer: Test iz magnetizma" data-ph-en="For example: Magnetism test"></div>' +
      '<div class="qb-set">' +
      '<label class="check"><input type="checkbox" data-s="shuffleQ"' + (s.shuffleQ ? ' checked' : '') + '>' + both('Pomešaj redosled pitanja', 'Shuffle question order') + '</label>' +
      '<label class="check"><input type="checkbox" data-s="shuffleO"' + (s.shuffleO ? ' checked' : '') + '>' + both('Pomešaj ponuđene odgovore', 'Shuffle answer options') + '</label>' +
      '<label class="check"><input type="checkbox" data-s="showAnswers"' + (s.showAnswers ? ' checked' : '') + '>' + both('Posle slanja pokaži rezultat i tačne odgovore', 'After submitting, show the score and correct answers') + '</label>' +
      '</div>';
    $(top, '#qb-title').value = draft.title;
    L.applyAttrs(top);
  }
  function qHtml(q, i) {
    var n = draft.questions.length;
    var h = '<div class="qcard" data-card="' + i + '"><div class="qcard-h"><b>' + both('Pitanje ' + (i + 1), 'Question ' + (i + 1)) + '</b><div class="icons">' +
      '<button type="button" class="icon-btn" data-act="up" data-q="' + i + '"' + (i === 0 ? ' disabled' : '') + ' aria-label="↑">' + icon('up') + '</button>' +
      '<button type="button" class="icon-btn" data-act="down" data-q="' + i + '"' + (i === n - 1 ? ' disabled' : '') + ' aria-label="↓">' + icon('down') + '</button>' +
      '<button type="button" class="icon-btn" data-act="dup" data-q="' + i + '" aria-label="Duplicate">' + icon('dup') + '</button>' +
      '<button type="button" class="icon-btn" data-act="del" data-q="' + i + '"' + (n === 1 ? ' disabled' : '') + ' aria-label="Delete">' + icon('trash') + '</button></div></div><div class="qcard-b">' +
      '<div class="grid2"><div class="field-row"><label>' + both('Vrsta odgovora', 'Answer type') + '</label><select class="select" data-q="' + i + '" data-f="type">' +
      ['choice', 'multi', 'bool', 'text'].map(function (t) {
        var names = { choice: ['Izbor: jedan tačan', 'Choice: one correct'], multi: ['Izbor: više tačnih', 'Choice: several correct'], bool: ['Tačno / netačno', 'True / false'], text: ['Upisan odgovor', 'Typed answer'] }[t];
        return '<option value="' + t + '"' + (q.type === t ? ' selected' : '') + '>' + esc(tr(names[0], names[1])) + '</option>';
      }).join('') + '</select></div>' +
      '<div class="field-row"><label>' + both('Broj poena', 'Points') + '</label><input class="input" type="number" min="1" max="20" step="1" value="' + q.points + '" data-q="' + i + '" data-f="points"></div></div>' +
      '<div class="field-row"><label>' + both('Tekst pitanja', 'Question text') + '</label><textarea class="textarea" rows="2" data-q="' + i + '" data-f="text"></textarea></div>';
    if (q.type === 'choice' || q.type === 'multi') {
      h += '<div class="field-row"><label>' + both('Ponuđeni odgovori (označi tačne)', 'Options (mark the correct ones)') + '</label><div class="qlist" style="gap:8px">';
      q.options.forEach(function (o, j) {
        var checked = q.type === 'multi' ? (q.correct || []).indexOf(j) >= 0 : q.correct === j;
        h += '<div class="opt-edit"><input type="' + (q.type === 'multi' ? 'checkbox' : 'radio') + '" name="c' + i + '" data-q="' + i + '" data-c="' + j + '"' + (checked ? ' checked' : '') + '>' +
          '<input class="input" type="text" value="' + esc(o) + '" data-q="' + i + '" data-o="' + j + '" maxlength="200">' +
          '<button type="button" class="icon-btn" data-act="rmopt" data-q="' + i + '" data-o="' + j + '"' + (q.options.length <= 2 ? ' disabled' : '') + ' aria-label="Remove">' + icon('close') + '</button></div>';
      });
      h += '</div>' + (q.options.length < 8 ? '<div><button type="button" class="btn small" data-act="addopt" data-q="' + i + '">' + icon('plus') + both('Dodaj odgovor', 'Add option') + '</button></div>' : '') + '</div>';
    } else if (q.type === 'bool') {
      h += '<div class="field-row"><label>' + both('Tačan odgovor je', 'The correct answer is') + '</label><div class="row">' +
        '<label class="check"><input type="radio" name="b' + i + '" data-q="' + i + '" data-bool="1"' + (q.correct === true ? ' checked' : '') + '>' + both('Tačno', 'True') + '</label>' +
        '<label class="check"><input type="radio" name="b' + i + '" data-q="' + i + '" data-bool="0"' + (q.correct === false ? ' checked' : '') + '>' + both('Netačno', 'False') + '</label></div></div>';
    } else {
      h += '<div class="field-row"><label>' + both('Tačan odgovor', 'Correct answer') + '</label><input class="input" type="text" value="' + esc(q.correct == null ? '' : q.correct) + '" data-q="' + i + '" data-f="correct" maxlength="120">' +
        '<p class="help">' + both('Više prihvaćenih odgovora razdvoji znakom |  (na primer: 0,4 | 0.4).', 'Separate several accepted answers with |  (for example: 0.4 | 0,4).') + '</p></div>' +
        '<div class="row"><label class="check"><input type="checkbox" data-q="' + i + '" data-f="numeric"' + (q.numeric ? ' checked' : '') + '>' + both('Odgovor je broj (prihvati zarez i tačku)', 'The answer is a number (accept comma or dot)') + '</label></div>';
      if (q.numeric) {
        h += '<div class="grid2"><div class="field-row"><label>' + both('Tolerancija (%)', 'Tolerance (%)') + '</label><input class="input" type="number" min="0" max="50" step="0.5" value="' + q.tol + '" data-q="' + i + '" data-f="tol"></div>' +
          '<div class="field-row"><label>' + both('Jedinica (neobavezno)', 'Unit (optional)') + '</label><input class="input" type="text" value="' + esc(q.unit) + '" data-q="' + i + '" data-f="unit" maxlength="30" placeholder="N | newton"></div></div>';
      }
    }
    h += '<div class="grid2"><div class="field-row"><label>' + both('Polje za formulu', 'Formula box') + '</label><select class="select" data-q="' + i + '" data-f="formula">' +
      ['off', 'optional', 'required'].map(function (v) {
        var nm = { off: ['Isključeno', 'Off'], optional: ['Opciono', 'Optional'], required: ['Obavezno', 'Required'] }[v];
        return '<option value="' + v + '"' + (q.formula === v ? ' selected' : '') + '>' + esc(tr(nm[0], nm[1])) + '</option>';
      }).join('') + '</select></div>' +
      '<div class="field-row"><label>' + both('Postupak (kako je došao do odgovora)', 'Working (how they got the answer)') + '</label><select class="select" data-q="' + i + '" data-f="working">' +
      ['off', 'optional', 'required'].map(function (v) {
        var nm = { off: ['Isključeno', 'Off'], optional: ['Opciono', 'Optional'], required: ['Obavezno', 'Required'] }[v];
        return '<option value="' + v + '"' + (q.working === v ? ' selected' : '') + '>' + esc(tr(nm[0], nm[1])) + '</option>';
      }).join('') + '</select></div></div>' +
      '<div class="field-row"><label>' + both('Objašnjenje posle slanja (neobavezno)', 'Explanation after submitting (optional)') + '</label><textarea class="textarea" rows="2" data-q="' + i + '" data-f="explain"></textarea></div>';
    h += '</div></div>';
    return h;
  }
  function renderList() {
    var st = m.body.scrollTop;
    list.innerHTML = draft.questions.map(qHtml).join('');
    draft.questions.forEach(function (q, i) {
      var card = $(list, '[data-card="' + i + '"]');
      $(card, '[data-f="text"]').value = q.text;
      var ex = $(card, '[data-f="explain"]');
      if (ex) ex.value = q.explain;
    });
    L.applyAttrs(list);
    m.body.scrollTop = st;
  }
  renderTop();
  renderList();

  top.addEventListener('input', function (e) {
    if (e.target.getAttribute('data-f') === 'title') draft.title = e.target.value;
  });
  top.addEventListener('change', function (e) {
    var k = e.target.getAttribute('data-s');
    if (k) draft.settings[k] = e.target.checked;
  });
  function qAt(e) { return draft.questions[+e.target.getAttribute('data-q')]; }
  list.addEventListener('input', function (e) {
    var t = e.target, q = qAt(e);
    if (!q) return;
    var f = t.getAttribute('data-f');
    if (f === 'text' || f === 'explain' || f === 'unit') q[f] = t.value;
    else if (f === 'correct') q.correct = t.value;
    else if (f === 'points') q.points = Math.max(1, Math.min(20, parseInt(t.value, 10) || 1));
    else if (f === 'tol') q.tol = Math.max(0, parseFloat(t.value) || 0);
    else if (t.hasAttribute('data-o')) q.options[+t.getAttribute('data-o')] = t.value;
  });
  list.addEventListener('change', function (e) {
    var t = e.target, q = qAt(e);
    if (!q) return;
    var f = t.getAttribute('data-f');
    if (f === 'type') {
      q.type = t.value;
      if (q.type === 'choice') { if (!q.options || q.options.length < 2) q.options = ['', '']; q.correct = typeof q.correct === 'number' ? q.correct : 0; if (q.correct >= q.options.length) q.correct = 0; }
      else if (q.type === 'multi') { if (!q.options || q.options.length < 2) q.options = ['', '']; q.correct = Array.isArray(q.correct) ? q.correct : (typeof q.correct === 'number' ? [q.correct] : []); }
      else if (q.type === 'bool') q.correct = q.correct === false ? false : true;
      else q.correct = typeof q.correct === 'string' ? q.correct : '';
      renderList();
    } else if (f === 'formula' || f === 'working') q[f] = t.value;
    else if (f === 'numeric') { q.numeric = t.checked; renderList(); }
    else if (t.hasAttribute('data-c')) {
      var j = +t.getAttribute('data-c');
      if (q.type === 'multi') {
        var set = (q.correct || []).slice();
        var at = set.indexOf(j);
        if (t.checked && at < 0) set.push(j);
        if (!t.checked && at >= 0) set.splice(at, 1);
        q.correct = set;
      } else q.correct = j;
    } else if (t.hasAttribute('data-bool')) q.correct = t.getAttribute('data-bool') === '1';
  });
  list.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var i = +b.getAttribute('data-q');
    var act = b.getAttribute('data-act');
    var qs = draft.questions;
    if (act === 'up' && i > 0) { var t = qs[i]; qs[i] = qs[i - 1]; qs[i - 1] = t; }
    else if (act === 'down' && i < qs.length - 1) { var u = qs[i]; qs[i] = qs[i + 1]; qs[i + 1] = u; }
    else if (act === 'dup') qs.splice(i + 1, 0, JSON.parse(JSON.stringify(qs[i])));
    else if (act === 'del' && qs.length > 1) qs.splice(i, 1);
    else if (act === 'addopt') qs[i].options.push('');
    else if (act === 'rmopt') {
      var o = +b.getAttribute('data-o'), q = qs[i];
      q.options.splice(o, 1);
      if (q.type === 'choice') { if (q.correct === o) q.correct = 0; else if (q.correct > o) q.correct--; }
      else q.correct = (q.correct || []).filter(function (x) { return x !== o; }).map(function (x) { return x > o ? x - 1 : x; });
    } else return;
    renderList();
  });
  $(m.root, '#qb-add').addEventListener('click', function () {
    draft.questions.push(blankQ());
    renderList();
    var cards = list.querySelectorAll('.qcard');
    cards[cards.length - 1].scrollIntoView({ block: 'start', behavior: L.reduce ? 'auto' : 'smooth' });
  });
  $(m.root, '#qb-back').addEventListener('click', function () { back(); });

  function build() {
    var problems = [];
    var title = draft.title.trim();
    if (!title) problems.push([null, 'Upiši naslov kviza.', 'Enter a quiz title.']);
    var out = [];
    draft.questions.forEach(function (q, i) {
      var nq = { type: q.type, text: q.text.trim(), formula: q.formula, working: q.working, points: q.points, explain: q.explain.trim() };
      var tag = 'Pitanje ' + (i + 1) + ': ';
      var tagEn = 'Question ' + (i + 1) + ': ';
      if (!nq.text) problems.push([i, tag + 'upiši tekst pitanja.', tagEn + 'enter the question text.']);
      if (q.type === 'choice' || q.type === 'multi') {
        var map = {}, opts = [];
        q.options.forEach(function (o, j) { if (o.trim()) { map[j] = opts.length; opts.push(o.trim()); } });
        if (opts.length < 2) problems.push([i, tag + 'potrebna su bar dva ponuđena odgovora.', tagEn + 'at least two options are needed.']);
        nq.options = opts;
        if (q.type === 'choice') {
          if (map[q.correct] == null) problems.push([i, tag + 'označi tačan odgovor.', tagEn + 'mark the correct option.']);
          nq.correct = map[q.correct] == null ? 0 : map[q.correct];
        } else {
          var cs = (q.correct || []).filter(function (x) { return map[x] != null; }).map(function (x) { return map[x]; }).sort(function (a, b) { return a - b; });
          if (!cs.length) problems.push([i, tag + 'označi bar jedan tačan odgovor.', tagEn + 'mark at least one correct option.']);
          nq.correct = cs;
        }
      } else if (q.type === 'bool') {
        nq.correct = q.correct === true;
      } else {
        nq.correct = String(q.correct == null ? '' : q.correct).trim();
        if (!nq.correct) problems.push([i, tag + 'upiši tačan odgovor.', tagEn + 'enter the correct answer.']);
        nq.numeric = !!q.numeric;
        if (q.numeric) { nq.tol = q.tol; nq.unit = (q.unit || '').trim(); }
      }
      out.push(nq);
    });
    return { title: title, problems: problems, questions: out };
  }
  $(m.root, '#qb-save').addEventListener('click', function () {
    var b = build();
    if (b.problems.length) {
      errEl.innerHTML = '<div class="banner bad" role="alert">' + icon('info') + '<div><ul class="plain" style="margin:0">' + b.problems.map(function (p) { return '<li>' + both(esc(p[1]), esc(p[2])) + '</li>'; }).join('') + '</ul></div></div>';
      errEl.scrollIntoView({ block: 'center', behavior: L.reduce ? 'auto' : 'smooth' });
      return;
    }
    errEl.innerHTML = '';
    var btn = $(m.root, '#qb-save');
    btn.disabled = true;
    var quiz = { title: b.title, createdAt: createdAt, settings: { shuffleQ: !!draft.settings.shuffleQ, shuffleO: !!draft.settings.shuffleO, showAnswers: !!draft.settings.showAnswers, open: ctx && ctx.quiz && editing ? ctx.quiz.settings.open : true }, questions: b.questions };
    var codeP = editing ? Promise.resolve(editing) : S.newCode();
    codeP.then(function (code) { return S.save(code, quiz).then(function () { return code; }); }).then(function (code) {
      showSaved(m, code, quiz, back);
    }).catch(function () {
      btn.disabled = false;
      errEl.innerHTML = errBanner('Kviz nije sačuvan jer server nije dostupan. Proveri vezu i pokušaj ponovo.', 'The quiz was not saved because the server is unreachable. Check your connection and try again.');
    });
  });
}

function showSaved(m, code, quiz, back) {
  m.setCls('mid');
  m.setHead('Kviz je sačuvan', 'Quiz saved');
  m.body.innerHTML = localBanner() +
    '<p>' + both('Podeli ovaj kod. Učenici ga upisuju posle dugmeta „Pridruži se”.', 'Share this code. Students enter it after pressing “Join room”.') + '</p>' +
    '<div class="code-big" id="sv-code">' + esc(code) + '</div>' +
    '<div class="row"><button type="button" class="btn" id="sv-copy">' + icon('copy') + both('Kopiraj kod', 'Copy code') + '</button>' +
    '<button type="button" class="btn" id="sv-link">' + icon('link') + both('Kopiraj link', 'Copy link') + '</button></div>';
  m.setFoot('<button type="button" class="btn" id="sv-list">' + both('Moji kvizovi', 'My quizzes') + '</button><button type="button" class="btn primary" id="sv-res">' + both('Otvori odgovore', 'Open answers') + '</button>');
  $(m.root, '#sv-copy').addEventListener('click', function () { copyText(code, 'Kod kopiran: ' + code, 'Code copied: ' + code); });
  $(m.root, '#sv-link').addEventListener('click', function () { copyText(roomLink(code), 'Link kopiran', 'Link copied'); });
  $(m.root, '#sv-list').addEventListener('click', function () { back(); });
  $(m.root, '#sv-res').addEventListener('click', function () { S.get(code).then(function (q) { openResults(m, code, q, back); }); });
}

function csvCell(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"'; }

function openResults(m, code, quiz, back) {
  var qs = quiz.questions;
  var lesson = L.lessonByQuiz(code);
  var subsData = [];
  var openIds = {};
  var filter = '';
  m.timers.forEach(clearInterval);
  m.timers = [];
  m.setCls('wide');
  m.setHead('Odgovori', 'Answers', '<span class="code-chip">' + esc(code) + '</span>');
  m.body.innerHTML = localBanner() +
    '<div class="row sp"><div><div class="qp-title">' + locHtml(quiz.title) + '</div></div><div class="row">' +
    '<button type="button" class="btn small" id="r-refresh">' + icon('refresh') + both('Osveži', 'Refresh') + '</button>' +
    '<button type="button" class="btn small" id="r-csv">' + icon('download') + 'CSV</button></div></div>' +
    '<div class="stat-row" id="r-stats"></div>' +
    '<div class="field-row"><input class="input" type="search" id="r-search" data-ph-sr="Pretraži po korisničkom imenu" data-ph-en="Search by username"></div>' +
    '<div class="sub-list" id="r-list"><div class="center"><span class="spin"></span></div></div>';
  m.setFoot('<button type="button" class="btn" id="r-back">' + both('Nazad', 'Back') + '</button>');
  L.applyAttrs(m.root);
  $(m.root, '#r-back').addEventListener('click', function () { back(); });

  function subHtml(s) {
    var h = '<details class="sub" data-id="' + esc(s.id) + '"' + (openIds[s.id] ? ' open' : '') + '><summary><span class="who">' + esc(s.name) + '</span><span class="when">' + esc(L.fmtTime(s.at)) + '</span><span class="sc">' + s.score + '/' + s.max + '</span></summary><div class="sub-body">';
    qs.forEach(function (q, qi) {
      var a = s.answers[qi] || { a: null, f: '', w: '' };
      var ok = grade(q, a.a);
      h += '<div class="sa ' + (ok ? 'ok' : 'no') + '"><div class="qt">' + (qi + 1) + '. ' + locHtml(q.text) + '</div><dl>' +
        '<div><dt>' + both('Odgovor', 'Answer') + '</dt><dd>' + ansHtml(q, a.a) + ' <span class="tag ' + (ok ? '' : 'plain') + '" style="' + (ok ? 'background:var(--good);color:#fff' : 'color:var(--bad);border-color:var(--bad)') + '">' + (ok ? both('tačno', 'correct') : both('netačno', 'wrong')) + '</span></dd></div>';
      if (!ok) h += '<div><dt>' + both('Tačno je', 'Correct') + '</dt><dd>' + correctHtml(q) + '</dd></div>';
      if (q.formula !== 'off') h += '<div><dt>' + both('Formula', 'Formula') + '</dt><dd>' + (a.f ? '<div class="fm" data-tex="' + esc(a.f) + '"></div>' : '<span class="help">' + both('nije napisana', 'not written') + '</span>') + '</dd></div>';
      if (q.working !== 'off') h += '<div><dt>' + both('Postupak', 'Working') + '</dt><dd>' + (a.w ? '<div class="wk">' + esc(a.w) + '</div>' : '<span class="help">' + both('nije napisan', 'not written') + '</span>') + '</dd></div>';
      h += '</dl></div>';
    });
    h += '<div class="row"><button type="button" class="btn small danger" data-del="' + esc(s.id) + '">' + icon('trash') + both('Obriši ovaj odgovor', 'Delete this answer') + '</button></div></div></details>';
    return h;
  }
  function draw() {
    var host = $(m.root, '#r-list');
    if (!host) return;
    var rows = subsData.filter(function (s) { return !filter || s.name.toLowerCase().indexOf(filter) >= 0; });
    var avg = subsData.length ? subsData.reduce(function (t, s) { return t + (s.max ? s.score / s.max : 0); }, 0) / subsData.length : 0;
    $(m.root, '#r-stats').innerHTML =
      '<div class="stat"><b>' + subsData.length + '</b><span>' + both('odgovora', 'answers') + '</span></div>' +
      '<div class="stat"><b>' + (subsData.length ? Math.round(avg * 100) + '%' : '–') + '</b><span>' + both('prosek', 'average') + '</span></div>' +
      '<div class="stat"><b>' + qs.length + '</b><span>' + both('pitanja', 'questions') + '</span></div>';
    if (!rows.length) {
      host.innerHTML = '<div class="center"><p>' + (subsData.length ? both('Nema rezultata pretrage.', 'No matches.') : both('Još niko nije poslao odgovore. Podeli kod ' + esc(code) + '.', 'Nobody has submitted yet. Share the code ' + esc(code) + '.')) + '</p></div>';
      return;
    }
    host.innerHTML = rows.slice().reverse().map(subHtml).join('');
    host.querySelectorAll('.fm').forEach(function (el) { MB.render(el, el.getAttribute('data-tex'), false); });
    host.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () { openIds[d.getAttribute('data-id')] = d.open; });
    });
    host.querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!confirm(tr('Obrisati ovaj odgovor?', 'Delete this answer?'))) return;
        S.removeSub(code, b.getAttribute('data-del')).then(load).catch(function () { L.toast('Nije uspelo.', 'Failed.'); });
      });
    });
  }
  function load() {
    S.subs(code).then(function (rows) {
      if (m.closed) return;
      var sig = JSON.stringify(rows.map(function (r) { return r.id; }));
      var same = load.sig === sig;
      load.sig = sig;
      subsData = rows;
      if (!same || !$(m.root, '#r-list .sub')) draw();
    }).catch(function () {
      var host = $(m.root, '#r-list');
      if (host && !subsData.length) host.innerHTML = errBanner('Server nije dostupan. Proveri vezu i pokušaj ponovo.', 'The server is unreachable. Check your connection and try again.');
    });
  }
  $(m.root, '#r-refresh').addEventListener('click', function () { load.sig = null; load(); });
  $(m.root, '#r-search').addEventListener('input', function (e) { filter = e.target.value.trim().toLowerCase(); draw(); });
  $(m.root, '#r-csv').addEventListener('click', function () {
    var head = ['username', 'time', 'score', 'max'];
    qs.forEach(function (q, i) { head.push('Q' + (i + 1) + ' answer', 'Q' + (i + 1) + ' formula', 'Q' + (i + 1) + ' working'); });
    var lines = [head.map(csvCell).join(',')];
    subsData.forEach(function (s) {
      var row = [s.name, new Date(s.at).toISOString(), s.score, s.max];
      qs.forEach(function (q, i) {
        var a = s.answers[i] || {};
        var txt = '';
        if (answered(q, a.a)) {
          if (q.type === 'choice') txt = locText(q.options[a.a]);
          else if (q.type === 'multi') txt = a.a.map(function (x) { return locText(q.options[x]); }).join('; ');
          else if (q.type === 'bool') txt = a.a ? 'true' : 'false';
          else txt = a.a;
        }
        row.push(txt, a.f || '', a.w || '');
      });
      lines.push(row.map(csvCell).join(','));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'lav-' + code + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
  MB.needKatex().then(load);
  m.timers.push(setInterval(load, 6000));
}

L.quiz = { openJoin: openJoin, openCreate: openCreate, grade: grade };
})();
