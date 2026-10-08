(function () {
'use strict';
var L = window.LAV;
var classes = window.LAV_CLASSES;
var lessons = window.LAV_LESSONS;
var current = 'all';
var query = '';

function plain(s) {
  return String(s).toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[̀-ͯ]/g, '');
}
lessons.forEach(function (l) {
  l.hay = plain([l.title.sr, l.title.en, l.summary.sr, l.summary.en, classes[l.cls].sr, classes[l.cls].en].join(' '));
});

var chips = document.getElementById('chips');
function buildChips() {
  var html = '<button type="button" class="chip" data-cls="all" aria-pressed="true">' + L.both('Sve', 'All') + '<small>' + lessons.length + '</small></button>';
  Object.keys(classes).forEach(function (k) {
    var n = lessons.filter(function (l) { return l.cls === k; }).length;
    html += '<button type="button" class="chip" data-cls="' + k + '" aria-pressed="false">' + L.both(L.esc(classes[k].sr), L.esc(classes[k].en)) + '<small>' + n + '</small></button>';
  });
  chips.innerHTML = html;
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    setClass(b.getAttribute('data-cls'), true);
  });
}
function setClass(c, push) {
  current = c;
  chips.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cls') === c ? 'true' : 'false'); });
  if (push) {
    try { history.replaceState(null, '', c === 'all' ? location.pathname + location.search : '#' + c); } catch (e) {}
  }
  draw();
}

function card(l) {
  var c = classes[l.cls];
  var tags = [];
  if (l.tags.indexOf('3d') >= 0) tags.push(L.both('3D', '3D'));
  if (l.tags.indexOf('animation') >= 0) tags.push(L.both('animacije', 'animations'));
  if (l.tags.indexOf('lab') >= 0) tags.push(L.both('vežba', 'lab'));
  return '<a class="lcard ' + (c.color === 'copper' ? '' : c.color) + '" href="' + L.lessonUrl(l.slug) + '">' +
    '<div class="lcard-top"><span class="tag ' + (c.color === 'copper' ? '' : c.color) + '">' + L.both(L.esc(c.sr), L.esc(c.en)) + '</span>' +
    '<span class="eyebrow">' + L.both(L.esc(L.fmtDate(l.date, 'sr')), L.esc(L.fmtDate(l.date, 'en'))) + '</span></div>' +
    '<h3>' + L.both(L.esc(l.title.sr), L.esc(l.title.en)) + '</h3>' +
    '<p>' + L.both(L.esc(l.summary.sr), L.esc(l.summary.en)) + '</p>' +
    '<div class="lcard-foot"><span><b>' + l.minutes + '</b> min</span>' + tags.map(function (t) { return '<span>· ' + t + '</span>'; }).join('') + '<span class="sp"></span><span>' + L.both('test ', 'test ') + '<b>' + l.quiz + '</b></span></div></a>';
}

function draw() {
  var q = plain(query.trim());
  var rows = lessons.filter(function (l) { return (current === 'all' || l.cls === current) && (!q || l.hay.indexOf(q) >= 0); });
  document.getElementById('lessons').innerHTML = rows.map(card).join('');
  document.getElementById('empty').hidden = rows.length > 0;
}

buildChips();
var h = location.hash.replace('#', '');
setClass(classes[h] ? h : 'all', false);
document.getElementById('q').addEventListener('input', function (e) { query = e.target.value; draw(); });
window.addEventListener('hashchange', function () {
  var k = location.hash.replace('#', '');
  setClass(classes[k] ? k : 'all', false);
});
})();
