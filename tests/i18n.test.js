/* Prueft, dass Deutsch und Englisch dieselben Texte haben und jeder im Code
   verwendete Schluessel existiert.   node tests/i18n.test.js */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = src.indexOf('const I18N = {'), b = src.indexOf('\n};', a) + 3;
const I18N = new Function(src.slice(a, b) + '\nreturn I18N;')();
let bad = 0;
const de = Object.keys(I18N.de), en = Object.keys(I18N.en);
de.filter(k => !(k in I18N.en)).forEach(k => { console.log('fehlt in EN: ' + k); bad++; });
en.filter(k => !(k in I18N.de)).forEach(k => { console.log('fehlt in DE: ' + k); bad++; });
de.forEach(k => { if(typeof I18N.de[k] !== typeof I18N.en[k]){ console.log('Typ unterschiedlich: ' + k); bad++; } });
const code = src.slice(b);
const NOT_KEYS = new Set('cfg clock club created date done error groups id innerHTML matches name objectStore onabort oncomplete onerror players seeds shift str teams textContent dataset value result length'.split(' '));
const used = new Set();
(code.match(/\b(?:t|tt|T\(\))\.([a-zA-Z_]\w*)/g) || []).forEach(m => used.add(m.replace(/^.*\./, '')));
used.forEach(k => { if(!NOT_KEYS.has(k) && !(k in I18N.de)){ console.log('nicht definiert: ' + k); bad++; } });
['fair', 'perf', 'random', 'manual'].forEach(s => ['', '_ko'].forEach(x => { if(!I18N.de['seedHint_' + s + x]){ console.log('fehlt: seedHint_' + s + x); bad++; } }));
['h2h', 'wins', 'pts'].forEach(k => { if(!I18N.de['crit_' + k]){ console.log('fehlt: crit_' + k); bad++; } });
['errTeams', 'errGroups', 'errGroupSmall', 'errAdv', 'errBest', 'errQual'].forEach(k => { if(!I18N.de[k]){ console.log('fehlt: ' + k); bad++; } });
if(bad){ console.log(bad + ' Probleme'); process.exit(1); }
console.log('Texte vollstaendig: ' + de.length + ' Schluessel in DE und EN.');
