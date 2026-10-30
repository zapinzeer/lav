(function () {
'use strict';
var L = window.LAV;
var classes = window.LAV_CLASSES, lessons = window.LAV_LESSONS;
var list = document.getElementById('t-list');

function counts(code) {
  var q = window.LAV_QUIZZES && window.LAV_QUIZZES[code];
  if (!q) return null;
  var adv = (q.advanced || []).length;
  return { easy: q.questions.length, adv: adv, all: q.questions.length + adv };
}

function row(l) {
  var n = counts(l.quiz);
  return '<div class="trow"><div class="trow-main"><b>' + L.both(L.esc(l.title.sr), L.esc(l.title.en)) + '</b>' +
    '<span class="help">' + (n ? L.both(n.all + ' pitanja (' + n.easy + ' osnovnih, ' + n.adv + ' produbljenih)', n.all + ' questions (' + n.easy + ' basic, ' + n.adv + ' in depth)') : '…') + '</span></div>' +
    '<div class="trow-act"><button type="button" class="btn small" data-prev="' + l.quiz + '">' + L.both('Pogledaj pitanja', 'View questions') + '</button>' +
    '<button type="button" class="btn small primary" data-host="' + l.quiz + '">' + L.both('Pokreni', 'Host') + '</button></div></div>';
}

function draw() {
  list.innerHTML = Object.keys(classes).map(function (k) {
    var ls = lessons.filter(function (l) { return l.cls === k; });
    if (!ls.length) return '';
    var c = classes[k];
    return '<div class="tgroup"><h3><span class="tag ' + (c.color === 'copper' ? '' : c.color) + '">' + L.both(L.esc(c.sr), L.esc(c.en)) + '</span></h3>' + ls.map(row).join('') + '</div>';
  }).join('');
  L.applyAttrs(list);
}

list.addEventListener('click', function (e) {
  var p = e.target.closest('[data-prev]'), h = e.target.closest('[data-host]');
  if (!p && !h) return;
  var b = p || h;
  b.disabled = true;
  L.loadQuiz().then(function () {
    b.disabled = false;
    if (p) window.LAV.host.preview(p.getAttribute('data-prev'));
    else window.LAV.host.start(h.getAttribute('data-host'));
  }).catch(function () {
    b.disabled = false;
    L.toast('Kviz se nije učitao. Proveri vezu.', 'The quiz did not load. Check your connection.');
  });
});

var codeEl = document.getElementById('t-code');
codeEl.addEventListener('input', function () { codeEl.value = codeEl.value.replace(/[^0-9]/g, ''); });
function join() { L.openJoin(codeEl.value); }
document.getElementById('t-join').addEventListener('click', join);
codeEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); join(); } });

function mine() {
  var box = document.getElementById('t-mine');
  var items = [];
  try { items = JSON.parse(localStorage.getItem('lav-host') || '[]'); } catch (e) {}
  if (!items.length) { box.hidden = true; return; }
  box.hidden = false;
  document.getElementById('t-mine-list').innerHTML = items.map(function (x) {
    var l = L.lessonByQuiz(x.quiz);
    return '<div class="trow"><div class="trow-main"><b><span class="code-chip">' + L.esc(x.sid) + '</span> ' + (l ? L.both(L.esc(l.title.sr), L.esc(l.title.en)) : L.esc(x.quiz)) + '</b><span class="help">' + L.esc(L.fmtTime(x.created)) + '</span></div>' +
      '<div class="trow-act"><button type="button" class="btn small primary" data-open="' + L.esc(x.sid) + '">' + L.both('Otvori', 'Open') + '</button><button type="button" class="btn small" data-forget="' + L.esc(x.sid) + '">' + L.both('Ukloni', 'Remove') + '</button></div></div>';
  }).join('');
  L.applyAttrs(box);
}
document.getElementById('t-mine').addEventListener('click', function (e) {
  var o = e.target.closest('[data-open]'), f = e.target.closest('[data-forget]');
  if (o) L.loadQuiz().then(function () { window.LAV.host.open(o.getAttribute('data-open')); });
  if (f) {
    var sid = f.getAttribute('data-forget');
    if (window.LAV_FP) window.LAV_FP.finish(sid);
    try { localStorage.setItem('lav-host', JSON.stringify(JSON.parse(localStorage.getItem('lav-host') || '[]').filter(function (x) { return x.sid !== sid; }))); } catch (er) {}
    mine();
  }
});

(function () {
  var sid = '';
  try { sid = (new URLSearchParams(location.search).get('resume') || '').replace(/[^0-9]/g, ''); } catch (e) {}
  if (!sid) return;
  L.loadQuiz().then(function () {
    var hs = null;
    try { hs = JSON.parse(localStorage.getItem('lav-hs') || 'null'); } catch (e) {}
    if (hs && hs.sid === sid) return window.LAV.quiz.resume();
    if (window.LAV.host.mine().some(function (x) { return x.sid === sid; })) return window.LAV.host.open(sid);
    var m = window.LAV_FP && window.LAV_FP.current();
    if (m && m.role === 'host') L.toast('Ovu sobu otvori na uređaju na kome je napravljena.', 'Open this room on the device where it was created.');
    else L.openJoin(sid);
  }).catch(function () {});
})();

draw();
mine();
L.loadData().then(draw).catch(function () {});
})();
