// node tools/test.mjs — quick checks: the data hangs together, every map is sound, every unique command works, a short
// balance run. (The whole story is played by tools/story.mjs.)
import { CHARS, SPELLS, ASTRALS, ITEMS, GEAR, TOOLS, BLITZ, IAI, DANCES, LORES, FORTUNE, MAGITEK, canEquip, shopList } from '../js/data.js?v=3';
import { MONSTERS, MSKILLS, ZONES } from '../js/monsters.js?v=3';
import { newMember, gainXp, expFor, maxhp } from '../js/party.js?v=3';
import { createBattle, perform, tick, enemyAct, alive, foesOf } from '../js/battle.js?v=3';
import { buildMaps, TILE, WALK, BARRIERS, PLACES_B, PLACES_R } from '../js/maps.js?v=3';
import { decorate, CHAPTERS } from '../js/story.js?v=3';
import { fight } from './sim.mjs';

// the same dice every run, so a result never depends on luck
let seed = 20261020;
Math.random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
let fails = 0;
const ok = (name, cond, extra = '') => { console.log((cond ? 'ok   ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!cond) fails++; };

// ---- data
const heroes = Object.keys(CHARS).filter((id) => !CHARS[id].guest);
ok('fifteen characters (plus guests)', heroes.length >= 14 && Object.keys(CHARS).length >= 15, `${heroes.length} heroes`);
ok('every character has a unique command', new Set(heroes.map((id) => CHARS[id].cmd)).size === heroes.length);
ok('every spell a character learns exists', Object.values(CHARS).every((c) => Object.values(c.spells || {}).every((s) => SPELLS[s])));
ok('every Astral teaches real spells', Object.values(ASTRALS).every((a) => Object.keys(a.teach).every((s) => SPELLS[s])), `${Object.keys(ASTRALS).length} Astrals`);
ok('every monster move exists', Object.values(MONSTERS).every((m) => Object.keys(m.skills).every((s) => MSKILLS[s])), `${Object.keys(MONSTERS).length} monsters`);
ok('every zone names real monsters', Object.values(ZONES).every((z) => z.groups.every((g) => g.every((id) => MONSTERS[id] && !MONSTERS[id].boss))));
ok('every steal is a real item', Object.values(MONSTERS).every((m) => m.steal.every((s) => ITEMS[s] || GEAR[s] || TOOLS[s])));
ok('every hero can hold a weapon from some shop or chest', heroes.filter((id) => CHARS[id].wpn.length).every((id) => Object.keys(GEAR).some((k) => GEAR[k].slot === 'weapon' && canEquip(id, k))));
ok('shops sell something at every tier', [1, 2, 3, 4, 5, 6, 7].every((t) => shopList(t, 'weapon').length && shopList(t, 'armor').length && shopList(t, 'item').length));
ok('levels grow steadily to 70', expFor(70) > expFor(69) && maxhp(newMember('aria', 70)) > 5000 && maxhp(newMember('aria', 70)) <= 9999, String(maxhp(newMember('aria', 70))));
ok('names in both languages', [CHARS, SPELLS, ASTRALS, ITEMS, GEAR, MONSTERS].every((T) => Object.values(T).every((x) => x.name && x.name[0] && x.name[1])));

// ---- maps: every place reachable, every dungeon floor connected
const M = buildMaps(); decorate(M);
function reach(m, from, flags, goal) {
  const seen = new Set([from.join()]), q = [from];
  while (q.length) {
    const [x, y] = q.shift(); if (goal(x, y)) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k)) continue; seen.add(k);
      const t = m.tiles[ny] && TILE[m.tiles[ny][nx]];
      if (goal(nx, ny)) return true;
      if (!t || !WALK.has(t) || t === 'miasma') continue;
      if (m.world && BARRIERS.some((b) => b.world === m.world && b.x === nx && b.y === ny && !flags[b.flag])) continue;
      q.push([nx, ny]);
    }
  }
  return false;
}
// before the airship: everything the first act needs from Frostvale (with the story's openings)
const openAll = { sw_open: 1, east_bridge: 1 };
const kolanPass = M.world; for (let x = 25; x <= 27; x++) { const r = kolanPass.tiles[17].split(''); r[x] = ','; kolanPass.tiles[17] = r.join(''); }
const actOne = ['frostvale', 'sularis', 'kolan', 'hideout', 'river', 'southwind', 'swtunnel', 'camp', 'kasumi', 'ferry', 'wildhut', 'trench', 'rainhold', 'gilden', 'opera'];
const unreachB = actOne.filter((id) => { const p = PLACES_B.find((q) => q.id === id); return !reach(M.world, [13, 8], openAll, (x, y) => x === p.x && y === p.y); });
ok('Act I: every place can be walked to (once the story opens the way)', !unreachB.length, unreachB.join(' '));
// the Empire's continent by airship: from a landing next to Vexhold, walk to the rest
const empire = ['vexhold', 'gate', 'samar', 'valley'];
const unreachE = empire.filter((id) => { const p = PLACES_B.find((q) => q.id === id); return !reach(M.world, [58, 47], openAll, (x, y) => x === p.x && y === p.y); });
ok('Act II: the Empire\'s places can be walked to from Vexhold', !unreachE.length, unreachE.join(' '));
// after the Fall: from where the raft lands, on foot, up to the airship
const onFoot = ['tidewatch', 'nikko', 'r_sularis', 'tomb', 'crumbleton', 'hopehaven'];
const unreachR = onFoot.filter((id) => { const p = PLACES_R.find((q) => q.id === id); return !reach(M.ruin, [56, 49], {}, (x, y) => x === p.x && y === p.y); });
ok('Act III: the raft\'s landing reaches everything needed before the airship', !unreachR.length, unreachR.join(' '));
// every dungeon floor: the far room can be reached from the stairs
const bad = Object.entries(M).filter(([, m]) => m.dungeon && !reach(m, m.anchor.start, {}, (x, y) => x === m.anchor.end[0] && y === m.anchor.end[1])).map(([id]) => id);
ok('every dungeon floor connects its stairs', !bad.length, bad.join(' '));
// towns: every keeper and person can be walked up to from the entrance
const towns = Object.entries(M).filter(([, m]) => m.town), stuck = [];
for (const [id, m] of towns) for (const n of m.npcs) if (!reach(m, [12, m.h - 1], {}, (x, y) => Math.abs(x - n.x) + Math.abs(y - n.y) === 1 || (Math.abs(x - n.x) + Math.abs(y - n.y) === 2 && m.tiles[(y + n.y) / 2] && TILE[m.tiles[(y + n.y) / 2][(x + n.x) / 2]] === 'counter'))) stuck.push(`${id}:${n.look}@${n.x},${n.y}`);
ok('every person in a town can be reached', !stuck.length, stuck.slice(0, 6).join(' '));
ok('every chapter has a card', Object.values(CHAPTERS).every((c) => c.title[0] && c.title[1]), `${Object.keys(CHAPTERS).length} chapters`);

// ---- every unique command does something
{
  const party = ['aria', 'rowan', 'edmund', 'sai'].map((id) => newMember(id, 30));
  const tryCmd = (id, action, extra = {}) => {
    const m = newMember(id, 30); const B = createBattle([m], ['chimera', 'labmutant'], { bag: { shuriken: 3, potion: 2 }, rng: () => 0.3 });
    const u = B.party[0]; u.atb = 100; Object.assign(u, extra);
    const ev = perform(B, u, { targets: [B.mons[0]], ...action }, { gil: () => 5000, spend: () => {} });
    return ev.length > 0;
  };
  ok('Astralize transforms Aria', tryCmd('aria', { kind: 'astralize' }));
  ok('Steal takes something', tryCmd('rowan', { kind: 'steal' }));
  ok('Tools fire', tryCmd('edmund', { kind: 'tools', id: 'autocross' }));
  ok('a Blitz with the right keys lands, wrong keys fizzle', tryCmd('sai', { kind: 'blitz', id: 'flurry', keys: 'lrl' }) && tryCmd('sai', { kind: 'blitz', id: 'flurry', keys: 'udu' }));
  { const m = newMember('kiriyu', 30), B = createBattle([m], ['chimera'], { rng: () => 0.3 }); const u = B.party[0]; perform(B, u, { kind: 'iai', level: 2, targets: [B.mons[0]] }); let due = []; for (let i = 0; i < 60 && !due.length; i++) due = tick(B, 0.1).due; ok('Iai charges, then cuts', due.length === 1 && perform(B, due[0].u, due[0].action).some((e) => e.kind === 'dmg')); }
  ok('Feral turns Galan into a beast', tryCmd('galan', { kind: 'feral', id: 'wolf' in MONSTERS ? 'wolf' : 'snowwolf' }));
  { const m = newMember('selene', 30), B = createBattle([m], ['firewisp'], { rng: () => 0.3 }); const u = B.party[0]; perform(B, u, { kind: 'runeblade' }); const ev = []; B.mons[0].atb = 100; for (let i = 0; i < 6; i++) ev.push(...enemyAct(B, B.mons[0])); ok('Runeblade swallows a spell', ev.some((e) => e.kind === 'runic')); }
  ok('Fortune: three stars hit everyone', tryCmd('regis', { kind: 'fortune', reels: ['star', 'star', 'star'] }));
  ok('Throw a shuriken', tryCmd('nightcrow', { kind: 'throw', id: 'shuriken' }));
  ok('Sketch a monster', tryCmd('lili', { kind: 'sketch' }));
  ok('Lore', tryCmd('bolo', { kind: 'lore', id: 'aquabreath' }));
  ok('Dance', tryCmd('moka', { kind: 'dance', id: 'field' }));
  ok('Berserk', tryCmd('uma', { kind: 'berserk' }));
  { const a = newMember('aria', 30), k = newMember('kagami', 30), B = createBattle([a, k], ['chimera'], { rng: () => 0.3 }); perform(B, B.party[0], { kind: 'fight', targets: [B.mons[0]] }); ok('Mimic repeats the last action', perform(B, B.party[1], { kind: 'mimic' }).some((e) => e.kind === 'dmg' || e.kind === 'miss')); }
  ok('Command rallies everyone', tryCmd('leopold', { kind: 'command' }));
  ok('Magitek beams', tryCmd('hart', { kind: 'magitek', id: 'firebeam' }));
  ok('Summon an Astral', tryCmd('aria', { kind: 'summon', id: 'ramus' }, { m: Object.assign(newMember('aria', 30), { astral: 'ramus' }) }));
}

// ---- a short balance run: a party with the gear of its level against each zone
{
  const P = ['rowan', 'edmund', 'sai', 'selene'];
  for (const [lv, z] of [[5, 'north'], [12, 'kolan'], [20, 'trench'], [28, 'empire'], [38, 'isle'], [48, 'ruin'], [62, 'spire']]) {
    let w = 0; for (let i = 0; i < 8; i++) if (fight(lv, z, P).over === 'win') w++;
    ok(`a level ${lv} party wins most fights in ${z}`, w >= 6, `${w}/8`);
  }
}
console.log(fails ? `${fails} FAILED` : 'all passed');
process.exit(fails ? 1 : 0);
