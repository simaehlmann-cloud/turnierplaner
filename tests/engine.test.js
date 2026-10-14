/* Automatische Tests der Turnier-Engine (ohne Browser).
 *   node tests/engine.test.js            -> prueft die Engine in index.html
 * Die Engine steht in index.html zwischen den Markern ENGINE-START / ENGINE-END. */
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const file = process.argv[2] || path.join(__dirname, '..', 'index.html');
const src = fs.readFileSync(file, 'utf8');
const a = src.indexOf('const Engine = (function(){'), b = src.indexOf('/* ENGINE-END */');
if(a < 0 || b < 0) throw new Error('Engine-Marker nicht gefunden');
const Engine = new Function(src.slice(a, b) + '\nreturn Engine;')();

// reproduzierbarer Zufall
let seed = 1; Engine.setRandom(() => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; });
let n = 0; Engine.setUid(() => 'm' + (++n));

const CFG = { mode: 'groups', fields: 2, start: '10:00', dur: 10, brk: 2, koDur: 12, koPause: 5, legs: 1,
  score: 'goals', bestOf: true, sets: 3, pW: 3, pD: 1, pL: 0, tb: ['diff', 'for', 'h2h'], gCount: 2, adv: 2, best: 0,
  p3: true, place: false, refs: 'none', refList: [], seed: 'fair' };
const mkTeams = k => Array.from({ length: k }, (_, i) => ({ id: 'T' + (i + 1), name: 'Team ' + (i + 1), str: 5 - (i % 5), act: true }));
function mkT(k, cfg){
  const t = { cfg: Object.assign({}, CFG, cfg), teams: mkTeams(k), groups: [], seeds: [], matches: [] };
  const d = Engine.draw(t.teams, t.cfg); t.groups = d.groups; t.seeds = d.seeds;
  const err = Engine.validate(t); if(err) throw new Error('validate: ' + JSON.stringify(err));
  Engine.build(t); return t;
}
// Ergebnisse eintragen: staerkeres Team (kleinere Nummer) gewinnt, bei Gleichstand Heimsieg
function playAll(t, guard){
  for(let loop = 0; loop < 50; loop++){
    const A = Engine.analyze(t); let did = false;
    t.matches.forEach(m => {
      if(A.st[m.id] !== 'open' || m.res) return;
      if(guard && !guard(m)) return;
      const [h, a] = A.teams[m.id];
      const nh = +h.slice(1), na = +a.slice(1);
      m.res = nh < na ? { h: 2, a: 0 } : { h: 0, a: 1 }; did = true;
    });
    if(!did) return Engine.analyze(t);
  }
}
let tests = 0;
function test(name, fn){ fn(); tests++; console.log('  ok  ' + name); }

test('Kreismethode: jeder gegen jeden genau einmal', () => {
  for(let k = 2; k <= 9; k++){
    const ids = Array.from({ length: k }, (_, i) => i);
    const pairs = [].concat(...Engine.roundRobin(ids)).map(p => p.slice().sort().join('-'));
    assert.strictEqual(pairs.length, k * (k - 1) / 2);
    assert.strictEqual(new Set(pairs).size, pairs.length);
  }
});
test('Setzliste 8', () => assert.deepStrictEqual(Engine.seedOrder(8), [1, 8, 4, 5, 2, 7, 3, 6]));

test('Gruppenphase: kein Team doppelt im Zeitfenster, Felder <= F', () => {
  [[8, 2, 2], [10, 2, 3], [12, 3, 2], [9, 3, 1], [16, 4, 4], [7, 2, 2]].forEach(([k, g, f]) => {
    const t = mkT(k, { gCount: g, fields: f });
    Engine.bySlot(t.matches).forEach(sm => {
      assert.ok(sm.length <= f, 'zu viele Spiele im Fenster');
      const ids = [].concat(...sm.filter(m => m.ph === 'g').map(m => [m.h, m.a]));
      assert.strictEqual(new Set(ids).size, ids.length, 'Team doppelt');
      assert.deepStrictEqual(sm.map(m => m.f), sm.map((_, i) => i), 'Felder luekenlos');
    });
    const gm = t.matches.filter(m => m.ph === 'g');
    const exp = t.groups.reduce((s, gr) => s + gr.ids.length * (gr.ids.length - 1) / 2, 0);
    assert.strictEqual(gm.length, exp);
  });
});

test('Auslosung fair: Staerke ausgeglichen, Groessen ausgeglichen', () => {
  const t = { cfg: Object.assign({}, CFG, { gCount: 3 }), teams: mkTeams(12) };
  const d = Engine.draw(t.teams, t.cfg);
  const sizes = d.groups.map(g => g.ids.length).sort();
  assert.deepStrictEqual(sizes, [4, 4, 4]);
  const str = id => t.teams.find(x => x.id === id).str;
  const sums = d.groups.map(g => g.ids.reduce((s, id) => s + str(id), 0));
  assert.ok(Math.max(...sums) - Math.min(...sums) <= 3, 'Staerkesummen ' + sums);
});
test('Auslosung Leistungsgruppen: Gruppe A die staerksten', () => {
  const t = { cfg: Object.assign({}, CFG, { gCount: 2, seed: 'perf' }), teams: mkTeams(10) };
  const d = Engine.draw(t.teams, t.cfg);
  const str = id => t.teams.find(x => x.id === id).str;
  assert.ok(Math.min(...d.groups[0].ids.map(str)) >= Math.max(...d.groups[1].ids.map(str)));
});
test('Passive Teams werden nicht ausgelost', () => {
  const teams = mkTeams(6); teams[2].act = false;
  const d = Engine.draw(teams, Object.assign({}, CFG, { mode: 'league' }));
  assert.strictEqual(d.groups[0].ids.length, 5); assert.ok(!d.groups[0].ids.includes('T3'));
});

test('2 Gruppen, je 2 weiter: Kreuzspiele A1-B2 / B1-A2, Finale + Platz 3', () => {
  const t = mkT(8, {});
  const ko = t.matches.filter(m => m.ph === 'ko');
  assert.deepStrictEqual(ko.map(m => m.lbl.k), ['sf', 'sf', 'p3', 'f']);
  const sf = ko.filter(m => m.lbl.k === 'sf');
  sf.forEach(m => assert.notStrictEqual(m.hs.g, m.as.g, 'Halbfinale aus derselben Gruppe'));
  const A = playAll(t);
  assert.ok(A.rankDone, 'Endstand fertig');
  assert.strictEqual(A.rank.length, 8);
  assert.deepStrictEqual(A.rank.slice(0, 4).map(r => r.pos), [1, 2, 3, 4]);
  // Finale nach Halbfinale und Platz 3, Finale allein im letzten Fenster
  const fin = ko.find(m => m.lbl.k === 'f');
  assert.ok(fin.slot > Math.max(...ko.filter(m => m !== fin).map(m => m.slot)));
  assert.ok(Math.min(...ko.map(m => m.slot)) > Math.max(...t.matches.filter(m => m.ph === 'g').map(m => m.slot)));
});
test('3 Gruppen, 2 weiter + Freilose (6 Teams im Baum)', () => {
  const t = mkT(12, { gCount: 3 });
  const ko = t.matches.filter(m => m.ph === 'ko');
  const first = ko.filter(m => m.kr === 1);
  first.forEach(m => { if(m.hs.t === 'g' && m.as.t === 'g') assert.notStrictEqual(m.hs.g, m.as.g); });
  const A = playAll(t);
  assert.ok(A.rankDone);
  assert.strictEqual(new Set(A.rank.map(r => r.id)).size, 12);
});
test('Beste Dritte: 3 Gruppen x 2 + 2 beste Dritte = Viertelfinale', () => {
  const t = mkT(12, { gCount: 3, best: 2 });
  const ko = t.matches.filter(m => m.ph === 'ko');
  assert.strictEqual(ko.filter(m => m.lbl.k === 'qf').length, 4);
  const A = playAll(t);
  assert.ok(A.rankDone); assert.strictEqual(A.rank.length, 12);
});
test('Platzierungsspiele bei 2 Gruppen', () => {
  const t = mkT(10, { place: true });
  const pl = t.matches.filter(m => m.lbl && m.lbl.k === 'pl');
  assert.deepStrictEqual(pl.map(m => m.lbl.p), [5, 7, 9]);
  const A = playAll(t);
  assert.ok(A.rankDone);
  assert.deepStrictEqual(A.rank.map(r => r.pos), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
test('Reiner K.o. mit 5, 6, 7, 11 Teams (Freilose)', () => {
  [5, 6, 7, 11].forEach(k => {
    const t = mkT(k, { mode: 'ko', p3: k >= 4 });
    const A = playAll(t);
    assert.ok(A.rankDone, 'k=' + k);
    assert.strictEqual(new Set(A.rank.map(r => r.id)).size, k);
    assert.strictEqual(A.rank[0].id, 'T1', 'Favorit gewinnt');
    // Freilose: genau P-K Teams ohne Erstrundenspiel
    const first = t.matches.filter(m => m.kr === 1).length;
    let P = 1; while(P < k) P *= 2;
    assert.strictEqual(first, k - P / 2);
  });
});
test('Liga mit Hin- und Rueckrunde', () => {
  const t = mkT(5, { mode: 'league', legs: 2, fields: 1 });
  assert.strictEqual(t.matches.length, 20);
  const A = playAll(t);
  assert.ok(A.rankDone);
  assert.strictEqual(A.tables[0][0].id, 'T1');
  assert.strictEqual(A.tables[0][0].pts, 24);
});

test('Direkter Vergleich vor Tordifferenz', () => {
  const t = mkT(3, { mode: 'league', tb: ['h2h', 'diff', 'for'] });
  const ms = t.matches;
  const set = (x, y, gh, ga) => { const m = ms.find(m => (m.h === x && m.a === y) || (m.h === y && m.a === x)); m.res = m.h === x ? { h: gh, a: ga } : { h: ga, a: gh }; };
  // T1 schlaegt T2 1:0, T2 schlaegt T3 9:0, T3 schlaegt T1 1:0 -> alle 3 Pkt;
  // direkter Vergleich unter dreien: alle 3 Pkt -> Differenz im Mini-Turnier: T2 +8
  set('T1', 'T2', 1, 0); set('T2', 'T3', 9, 0); set('T3', 'T1', 1, 0);
  let A = Engine.analyze(t);
  assert.strictEqual(A.tables[0][0].id, 'T2');
  // Zwei punktgleich: T1 vor T3 trotz schlechterer Differenz, wenn T1 gegen T3 gewann
  const t2 = mkT(4, { mode: 'league', tb: ['h2h', 'diff', 'for'] });
  const s2 = (x, y, gh, ga) => { const m = t2.matches.find(m => (m.h === x && m.a === y) || (m.h === y && m.a === x)); m.res = m.h === x ? { h: gh, a: ga } : { h: ga, a: gh }; };
  s2('T1', 'T3', 1, 0); s2('T1', 'T2', 0, 5); s2('T1', 'T4', 0, 0); s2('T3', 'T2', 0, 0); s2('T3', 'T4', 9, 0); s2('T2', 'T4', 0, 0);
  A = Engine.analyze(t2);
  const order = A.tables[0].map(r => r.id);
  assert.ok(order.indexOf('T1') < order.indexOf('T3'), order.join());
  // gleiche Situation mit Tordifferenz zuerst: T3 vor T1
  t2.cfg.tb = ['diff', 'for', 'h2h'];
  A = Engine.analyze(t2);
  const o2 = A.tables[0].map(r => r.id);
  assert.ok(o2.indexOf('T3') < o2.indexOf('T1'), o2.join());
});
test('Saetze: Tabelle nach Saetzen und Baellen, kein Unentschieden', () => {
  const t = mkT(3, { mode: 'league', score: 'sets', pW: 2, pD: 1, pL: 0, tb: ['diff', 'pdiff', 'h2h'] });
  const A0 = Engine.analyze(t);
  t.matches[0].res = { sets: [[25, 20], [20, 25], [15, 10]] };
  const o = Engine.outcome(t.cfg, t.matches[0].res);
  assert.deepStrictEqual([o.h, o.a, o.ph, o.pa, o.win], [2, 1, 60, 55, 'h']);
  const A = Engine.analyze(t);
  const top = A.tables[0][0];
  assert.strictEqual(top.id, t.matches[0].h); assert.strictEqual(top.sw, 2); assert.strictEqual(top.pts, 2);
});
test('Entscheidung bei Gleichstand im K.o. (Neunmeter)', () => {
  const t = mkT(4, { mode: 'ko', p3: false });
  const sf = t.matches.filter(m => m.lbl.k === 'sf');
  sf[0].res = { h: 1, a: 1, dec: 'a', ph: 3, pa: 4 };
  sf[1].res = { h: 2, a: 0 };
  const A = Engine.analyze(t);
  const fin = t.matches.find(m => m.lbl.k === 'f');
  assert.strictEqual(A.st[fin.id], 'open');
  assert.strictEqual(A.teams[fin.id][0], A.teams[sf[0].id][1]);
});
test('Passives Team: Gruppenspiele entfallen, im K.o. kampflos', () => {
  const t = mkT(8, {});
  const victim = t.groups[0].ids[1];
  t.teams.find(x => x.id === victim).act = false;
  let A = Engine.analyze(t);
  t.matches.filter(m => m.ph === 'g' && (m.h === victim || m.a === victim)).forEach(m => assert.strictEqual(A.st[m.id], 'void'));
  A = playAll(t);
  assert.ok(A.rankDone);
  // ausgefallenes Team steht am Tabellenende und erreicht die Finalrunde nicht
  const tb = A.tables[0];
  assert.strictEqual(tb[tb.length - 1].id, victim);
  const koTeams = [].concat(...t.matches.filter(m => m.ph === 'ko').map(m => A.teams[m.id]));
  assert.ok(!koTeams.includes(victim), 'passives Team in der Finalrunde');
  // auch wenn es vor dem Ausfall alles gewonnen hat
  const t3 = mkT(8, {});
  const star = t3.groups[0].ids[0];
  t3.matches.filter(m => m.ph === 'g' && m.g === 0).forEach(m => { m.res = m.h === star ? { h: 5, a: 0 } : m.a === star ? { h: 0, a: 5 } : { h: 1, a: 1 }; });
  t3.teams.find(x => x.id === star).act = false;
  const A3b = Engine.analyze(t3);
  assert.strictEqual(A3b.tables[0][3].id, star);
  const t2 = mkT(4, { mode: 'ko', p3: false });
  const sf = t2.matches.filter(m => m.lbl.k === 'sf');
  const A2 = Engine.analyze(t2);
  const out = A2.teams[sf[0].id][1];
  t2.teams.find(x => x.id === out).act = false;
  const A3 = Engine.analyze(t2);
  assert.strictEqual(A3.st[sf[0].id], 'wo');
  assert.strictEqual(A3.out[sf[0].id].win, 'h');
});
test('Zeiten: Pause vor Finalrunde, Verzug', () => {
  const t = mkT(8, { fields: 2, dur: 10, brk: 2, koDur: 12, koPause: 5 });
  const T = Engine.slotTimes(t);
  assert.strictEqual(Engine.fmtTime(T[0].start), '10:00');
  assert.strictEqual(Engine.fmtTime(T[1].start), '10:12');
  const firstKo = T.findIndex(x => x.ko);
  assert.strictEqual(T[firstKo].start - T[firstKo - 1].start, 10 + 2 + 5);
  t.shift = { 2: 7 };
  const T2 = Engine.slotTimes(t);
  assert.strictEqual(T2[1].start, T[1].start); assert.strictEqual(T2[2].start, T[2].start + 7); assert.strictEqual(T2[5].start, T[5].start + 7);
});
test('Schiedsrichter: Teams pfeifen nie ihr eigenes Fenster, Personen nie doppelt', () => {
  const t = mkT(10, { refs: 'teams', fields: 2 });
  Engine.bySlot(t.matches.filter(m => m.ph === 'g')).forEach(sm => {
    const playing = new Set([].concat(...sm.map(m => [m.h, m.a])));
    const refs = sm.map(m => m.ref && m.ref.id).filter(Boolean);
    refs.forEach(r => assert.ok(!playing.has(r)));
    assert.strictEqual(new Set(refs).size, refs.length);
    assert.strictEqual(refs.length, sm.length, 'jedes Spiel hat einen Schiri');
  });
  const t2 = mkT(8, { refs: 'persons', refList: ['Anna', 'Ben', 'Cem'], fields: 3 });
  Engine.bySlot(t2.matches).forEach(sm => { const r = sm.map(m => m.ref && m.ref.n).filter(Boolean); assert.strictEqual(new Set(r).size, r.length); });
});
test('Gruppenphase: moeglichst keine Spiele direkt hintereinander', () => {
  const t = mkT(10, { gCount: 2, fields: 2 });
  const slots = Engine.bySlot(t.matches.filter(m => m.ph === 'g'));
  let b2b = 0;
  for(let i = 1; i < slots.length; i++){
    const prev = new Set([].concat(...slots[i - 1].map(m => [m.h, m.a])));
    slots[i].forEach(m => { if(prev.has(m.h)) b2b++; if(prev.has(m.a)) b2b++; });
  }
  console.log('      (direkt hintereinander bei 10 Teams/2 Feldern: ' + b2b + ' von ' + t.matches.filter(m => m.ph === 'g').length * 2 + ' Einsaetzen)');
  assert.ok(b2b <= 6);
});
console.log('\n' + tests + ' Tests bestanden.');
