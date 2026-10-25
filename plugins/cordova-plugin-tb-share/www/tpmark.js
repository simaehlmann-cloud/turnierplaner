/* TpMark: kurzer Wert im iOS-Schluesselbund.
   TpMark.get(key, ok(wert | ''), fehler)  /  TpMark.set(key, wert, ok, fehler) */
var exec = require('cordova/exec');
module.exports = {
  get: function(key, ok, err){ exec(ok, err, 'TpMark', 'get', [String(key)]); },
  set: function(key, value, ok, err){ exec(ok, err, 'TpMark', 'set', [String(key), String(value)]); }
};
