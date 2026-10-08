(function () {
'use strict';

var L = window.LAV;
var form = document.getElementById('pw-form');
var input = document.getElementById('pw');
var out = document.getElementById('pw-out');
var hashEl = document.getElementById('pw-hash');
var copyBtn = document.getElementById('pw-copy');
var bad = document.getElementById('pw-unsupported');
var current = '';

function sha256(text) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!window.crypto || !crypto.subtle) {
    bad.hidden = false;
    return;
  }
  sha256(input.value).then(function (hex) {
    current = hex;
    hashEl.textContent = hex;
    out.hidden = false;
  });
});

copyBtn.addEventListener('click', function () {
  var line = 'creatorPasswordHash: "' + current + '"';
  var done = function () { L.toast('Linija kopirana', 'Line copied'); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(line).then(done, done);
  else done();
});
})();
