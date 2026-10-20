// node tools/story.mjs [seed] — plays the whole story without a browser: every chapter in order, on the real maps, with
// the real scripts. It checks that each place can be reached (on foot, or by airship once there is one), fights the story
// battles and a fair number of random ones, buys gear in each town, and reports the party's level chapter by chapter.
import { buildMaps, TILE, WALK, BARRIERS, LANDABLE } from '../js/maps.js?v=2';
import { decorate, opening, CHAPTERS } from '../js/story.js?v=2';
import { CHARS, ITEMS, GEAR, TOOLS, SPELLS, canEquip, shopList } from '../js/data.js?v=2';
import { newMember, healFull, gainXp, gainAp, bagAdd, bagTake, maxhp, maxmp, equip, levelTo, optimum } from '../js/party.js?v=2';
import { createBattle, tick, perform, enemyAct, foesOf, isAuto, autoAct, rewards, alive } from '../js/battle.js?v=2';
import { encounter, ZONES, MONSTERS } from '../js/monsters.js?v=2';

let seed = +(process.argv[2] || 1);
Math.random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const M = buildMaps(); decorate(M);
const log = [], problems = [];
const S = { v: 1, ch: 0, flags: {}, members: {}, roster: [], party: [], gil: 0, bag: {}, world: 'b', tools: [], astrals: {}, lores: [], dances: [], sketches: [], playTime: 0 };
let cur = null, pos = [0, 0], wpos = [0, 0], forced = [], battles = 0, lost = 0, randoms = 0, pending = [];
const avgLv = () => { const ms = S.roster.map((id) => S.members[id]).filter((m) => m && !CHARS[m.id].guest); return ms.length ? ms.reduce((s, m) => s + m.lv, 0) / ms.length : 1; };
const party = () => S.party.map((id) => S.members[id]).filter(Boolean);

// ---------------------------------------------------------------- fighting (the party plays sensibly: heals when hurt, casts its best spell when it can)
function bestSpell(u, B) {
  const sp = u.m.spells.map((s) => SPELLS[s]).filter((s) => s && s.kind === 'dmg' && u.mp >= s.mp);
  return sp.sort((a, b) => b.power - a.power)[0];
}
function fightSim(foes, opts = {}) {
  const B = createBattle(party(), foes, { bag: S.bag, boss: opts.boss, lvUp: opts.lvUp, bg: opts.bg });
  let t = 0;
  while (!B.over && t < 900) {
    const r = tick(B, 0.1); t += 0.1;
    if (opts.endAfter && t > opts.endAfter) { B.over = 'scripted'; break; }
    for (const u of r.foes) enemyAct(B, u);
    for (const d of r.due) perform(B, d.u, d.action);
    for (const u of r.ready) {
      if (!alive(u) || B.over) continue;
      if (isAuto(u)) { autoAct(B, u); continue; }
      const f = foesOf(B, u); if (!f.length) continue;
      const low = B.party.filter(alive).sort((a, b) => a.hp / a.maxhp - b.hp / b.maxhp)[0];
      const healer = ['cura', 'cure'].find((s) => u.m.spells.includes(s) && u.mp >= SPELLS[s].mp);
      const dead = B.party.find((p) => !alive(p));
      if (dead && S.bag.phoenix) { perform(B, u, { kind: 'item', id: 'phoenix', targets: [dead] }); continue; }
      if (low && low.hp < low.maxhp * 0.4 && healer) { perform(B, u, { kind: 'magic', id: healer, targets: [low] }); continue; }
      if (low && low.hp < low.maxhp * 0.3 && (S.bag.hipotion || S.bag.potion)) { perform(B, u, { kind: 'item', id: S.bag.hipotion ? 'hipotion' : 'potion', targets: [low] }); continue; }
      if (u.m.astral && !u.summoned && opts.boss && u.mp >= 40) { perform(B, u, { kind: 'summon', id: u.m.astral, targets: [f[0]] }); continue; }
      const sp = bestSpell(u, B);
      if (sp && u.mp > u.maxmp * 0.3) { perform(B, u, { kind: 'magic', id: Object.keys(SPELLS).find((k) => SPELLS[k] === sp), targets: [f[0]] }); continue; }
      perform(B, u, { kind: 'fight', targets: [f[0]] });
    }
  }
  return B;
}
function spoils(B) {
  const rw = rewards(B); S.gil += rw.gil;
  for (const u of B.party) if (alive(u) && !CHARS[u.id].guest) { gainXp(u.m, rw.exp); gainAp(u.m, rw.ap); }
  for (const id of S.roster) if (!B.party.some((u) => u.id === id) && !CHARS[id].guest) gainXp(S.members[id], Math.floor(rw.exp / 2));
  // the party resting between fights (inns, tents, cure spells)
  for (const m of party()) { if (m.hp <= 0) m.hp = 1; m.hp = Math.min(maxhp(m), m.hp + Math.round(maxhp(m) * 0.5)); m.mp = Math.min(maxmp(m), m.mp + Math.round(maxmp(m) * 0.3)); }
}
function grind(zone, n) {
  if (!zone || !ZONES[zone]) return;
  for (let i = 0; i < n; i++) { const B = fightSim(encounter(zone)); randoms++; if (B.over === 'win') spoils(B); else for (const m of party()) healFull(m); }
}
// ---------------------------------------------------------------- the fake engine
const A = {
  T: (zh, en) => (Array.isArray(zh) ? zh[0] : zh), get S() { return S; },
  flag: (k) => !!S.flags[k], set: (k, v = true) => { S.flags[k] = v; }, unset: (k) => { delete S.flags[k]; }, count: (k) => S.flags[k] || 0, inc: (k) => { S.flags[k] = (S.flags[k] || 0) + 1; },
  async say() {}, async talk(lines) { for (const l of lines) if (typeof l === 'function') await l(A); },
  async ask(zh, en, opts) { return forced.length ? forced.shift() : 0; },
  async menu(items) { if (forced.length) return forced.shift(); const i = items.findIndex((it) => !(it && it.disabled)); return Math.max(0, i); },
  goal: (zh) => { S.goal = zh; },
  async chapter(n) { S.ch = n; log.push(`ch ${String(n).padEnd(3)} lv ${avgLv().toFixed(1).padStart(5)}  party ${S.party.map((id) => `${id}:${S.members[id].lv}`).join(' ')}  gil ${S.gil}  battles ${battles} (+${randoms} random)`); },
  has: (it) => (S.bag[it] || 0) > 0, give: (it, n = 1) => bagAdd(S.bag, it, n), take: (it, n = 1) => bagTake(S.bag, it, n), gil: (n) => { S.gil = Math.max(0, S.gil + n); },
  async item(it, n = 1) { bagAdd(S.bag, it, n); }, async tool(id) { if (!S.tools.includes(id)) S.tools.push(id); }, async astral(id) { if (!(id in S.astrals)) S.astrals[id] = null; },
  member: (id) => S.members[id], hasMember: (id) => S.roster.includes(id), inParty: (id) => S.party.includes(id),
  async join(id, o = {}) {
    if (!S.members[id]) S.members[id] = newMember(id, o.lv || Math.max(1, Math.round(avgLv()) + (o.plus || 0)));
    if (!CHARS[id].guest && S.members[id].lv < Math.round(avgLv()) - 2) levelTo(S.members[id], Math.round(avgLv()) - 2);
    healFull(S.members[id]);
    if (!S.roster.includes(id)) S.roster.push(id);
    if (!S.party.includes(id) && (S.party.length < 4 || o.force)) S.party.push(id);
  },
  leave(id, o = {}) { S.party = S.party.filter((x) => x !== id); if (o.gone) S.roster = S.roster.filter((x) => x !== id); },
  setParty(ids, lock = true, lv) { for (const id of ids) { if (!S.members[id]) S.members[id] = newMember(id, lv || Math.max(1, Math.round(avgLv()))); if (!S.roster.includes(id) && !CHARS[id].guest) S.roster.push(id); healFull(S.members[id]); } S.party = ids.slice(0, 4); S.lock = lock; },
  free() { S.lock = false; },
  catchUp(id, lv) { const m = S.members[id]; if (m && m.lv < lv) { levelTo(m, lv); healFull(m); } }, avgLv: () => avgLv(),
  async battle(foes, opts = {}) {
    battles++;
    for (let tries = 0; tries < 4; tries++) {
      for (const m of party()) healFull(m);
      const B = fightSim(foes, opts);
      if (B.over === 'win') { spoils(B); return 'win'; }
      if (opts.canLose) return B.over;
      // a player who loses comes back a little stronger: a few more fights first
      grind(cur && (cur.enc || null) || zoneNear(), 6);
    }
    lost++; problems.push(`lost ${foes.join('+')} in ch ${S.ch} at lv ${avgLv().toFixed(1)} (${S.party.join(',')})`);
    return 'win';
  },
  warp(id, x, y) { setMap(id, x, y); const p = runEnter(); pending.push(p); return p; },
  world(x, y, dir, w) { if (w) S.world = w; setMap(S.world === 'r' ? 'ruin' : 'world', x, y); wpos = [x, y]; },
  async fade() {}, scene() {}, quake() {}, async sleep() {}, music() {}, sfx() {},
  setTile(x, y, c, id) { const m = M[id || cur.id]; const r = m.tiles[y].split(''); r[x] = c; m.tiles[y] = r.join(''); },
  airship(kind, at) { S.ship = kind ? { kind, world: S.world, x: at ? at[0] : pos[0], y: at ? at[1] : pos[1] } : null; },
  heal() { for (const id of S.roster) healFull(S.members[id]); },
  async inn() {}, async shop() {}, async saveHere() {},
  async pickParty(n, must = []) {
    // a sensible player: the strongest, but always someone who heals and someone who casts
    const pool = S.roster.filter((id) => S.members[id] && id !== 'uma');
    const heals = (id) => S.members[id].spells.some((s) => ['cura', 'curaga', 'cureAll'].includes(s));
    const pick = [...must];
    const healer = pool.filter((id) => !pick.includes(id) && heals(id)).sort((a, b) => S.members[b].lv - S.members[a].lv)[0]; if (healer && pick.length < n) pick.push(healer);
    for (const id of pool.sort((a, b) => S.members[b].lv - S.members[a].lv)) if (pick.length < n && !pick.includes(id)) pick.push(id);
    S.party = pick.slice(0, n);
  },
  async ending() { S.flags.ENDED = true; },
  reload() {}, get mapId() { return cur && cur.id; }, get pos() { return pos; },
};
function zoneNear() { return S.world === 'r' ? 'ruin' : 'empire'; }
function setMap(id, x, y) { cur = M[id]; if (!cur) throw new Error('no map ' + id); pos = [x, y]; }
async function runEnter() { if (cur.onEnter) await cur.onEnter(A); }
// ---------------------------------------------------------------- moving about
const tileOf = (m, x, y) => (m.tiles[y] && m.tiles[y][x] !== undefined ? TILE[m.tiles[y][x]] : null);
function walkable(m, x, y) {
  const t = tileOf(m, x, y); if (!t || !WALK.has(t)) return false;
  if (t === 'miasma' && m.world) return false;
  if (m.world && BARRIERS.some((b) => b.world === m.world && b.x === x && b.y === y && !S.flags[b.flag])) return false;
  return true;
}
function reach(m, from, goal) {
  const seen = new Set([from.join()]), q = [from];
  while (q.length) {
    const [x, y] = q.shift();
    if (goal(x, y)) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k)) continue; seen.add(k); if (goal(nx, ny) || walkable(m, nx, ny)) q.push([nx, ny]); }
  }
  return false;
}
async function enter(id) {
  const W = M[S.world === 'r' ? 'ruin' : 'world'], p = W.places.find((q) => q.id === id);
  if (!p) { problems.push(`no place ${id} in world ${S.world}`); return; }
  while (pending.length) await pending.shift();
  const onFoot = reach(W, wpos, (x, y) => x === p.x && y === p.y);
  const byShip = S.ship && S.ship.world === S.world;
  if (!onFoot && !byShip) problems.push(`ch ${S.ch}: can't reach ${id} from ${cur && cur.id} ${pos} (no airship)`);
  grind((W.world === 'b' ? zoneAt('b', p.x, p.y) : zoneAt('r', p.x, p.y)), byShip && !onFoot ? 1 : 3);
  const to = p.to && p.to(A);
  const m = M[to || id];
  const gate = !to && m.gate && m.gate(A);
  if (gate) { problems.push(`ch ${S.ch}: ${id} is closed: ${gate[0][1]}`); return; }
  shopping(m);
  wpos = [p.x, p.y];
  if (m.dungeon) setMap(to || id, ...m.anchor.start); else if (m.entry) setMap(to || id, m.entry[0], m.entry[1]); else setMap(to || id, 12, m.h - 1);
  await runEnter();
}
import { worldZone } from '../js/maps.js?v=2';
const zoneAt = (w, x, y) => worldZone(w, x, y);
// walk through a dungeon's floors to the far room of the given floor, fighting on the way, then set off what waits there
async function dungeon(base, toFloor) {
  const floors = [base, ...Array.from({ length: 6 }, (_, i) => `${base}_${i + 2}`)].filter((k) => M[k]);
  for (let f = 0; f < floors.length; f++) {
    const m = M[floors[f]];
    if (!reach(m, m.anchor.start, (x, y) => x === m.anchor.end[0] && y === m.anchor.end[1])) problems.push(`${floors[f]}: end not reachable`);
    setMap(floors[f], ...m.anchor.start);
    // open the chests on the way, and put on anything better
    for (const c of m.chests) { if (S.flags['chest_' + c.id]) continue; S.flags['chest_' + c.id] = true; if (c.gold) S.gil += c.gold; else if (TOOLS[c.item]) { if (!S.tools.includes(c.item)) S.tools.push(c.item); } else bagAdd(S.bag, c.item); }
    for (const id of S.roster) if (S.members[id] && !CHARS[id].guest) optimum(S.members[id], S.bag);
    await steps(m, m.anchor.start, 2);
    grind(m.enc, 4);
    await steps(m, m.anchor.end, 0);
    if (f + 1 === (toFloor || floors.length)) return;
  }
}
// step into the triggers around a spot (r = how far around), the way walking would
async function steps(m, [x, y], r) {
  for (let k = 0; k < m.triggers.length; k++) {
    const q = m.triggers[k];
    const inside = x + r >= q.x && x - r < q.x + (q.w || 1) && y + r >= q.y && y - r < q.y + (q.h || 1);
    const key = 'tr_' + (m.base || m.id) + (m.floor || '') + '_' + k;
    if (inside && (!q.when || q.when(A)) && !(q.once && S.flags[key])) { if (q.once) S.flags[key] = true; await q.run(A); if (cur !== m) return; }
  }
}
async function talk(mapId, pred) {
  while (pending.length) await pending.shift();
  const m = M[mapId]; if (cur !== m) { problems.push(`talk on ${mapId} but we are in ${cur.id}`); return; }
  const n = m.npcs.find((q) => pred(q) && (!q.when || q.when(A)));
  if (!n) { problems.push(`ch ${S.ch}: nobody matching on ${mapId}`); return; }
  if (!reach(m, pos, (x, y) => Math.abs(x - n.x) + Math.abs(y - n.y) === 1 || (m.tiles[y] && TILE[m.tiles[y][x]] === 'counter' && Math.abs(x - n.x) + Math.abs(y - n.y) <= 2))) problems.push(`ch ${S.ch}: can't walk up to ${n.look} on ${mapId}`);
  await n.talk(A);
}
const at = (x, y) => (n) => n.x === x && n.y === y;
const look = (l) => (n) => n.look === l;
// gear from the shops of the town just entered
function shopping(m) {
  if (!m.town) return;
  for (const kind of ['weapon', 'armor']) {
    const list = shopList(m.tier, kind);
    for (const id of S.party) {
      const mem = S.members[id]; if (!mem || CHARS[id].guest) continue;
      for (const slot of kind === 'weapon' ? ['weapon'] : ['shield', 'helm', 'armor']) {
        const score = (k) => (k ? (GEAR[k].power || 0) * 2 + (GEAR[k].def || 0) + (GEAR[k].mdef || 0) : 0);
        const best = list.filter((k) => GEAR[k].slot === slot && canEquip(id, k) && GEAR[k].price <= S.gil * 0.6).sort((a, b) => score(b) - score(a))[0];
        if (best && score(best) > score(mem.eq[slot])) { S.gil -= GEAR[best].price; bagAdd(S.bag, best); equip(mem, slot, best, S.bag); }
      }
    }
  }
  const need = Math.max(0, 8 - (S.bag.potion || 0)); if (S.gil > need * 60) { S.gil -= need * 50; bagAdd(S.bag, m.tier >= 3 ? 'hipotion' : 'potion', need); }
  if ((S.bag.phoenix || 0) < 3 && S.gil > 1500) { S.gil -= 1000; bagAdd(S.bag, 'phoenix', 2); }
  // the Astrals go to whoever has none
  for (const a of Object.keys(S.astrals)) if (!S.astrals[a]) { const who = S.party.find((id) => !S.members[id].astral && !CHARS[id].guest && id !== 'uma'); if (who) { S.members[who].astral = a; S.astrals[a] = who; } }
}

// ---------------------------------------------------------------- the walkthrough
async function run() {
  await opening(A); await runEnter();
  // 1-2
  await dungeon('mine');                                     // the frozen Astral → chapter 2 in Jon's house
  setMap('mine', ...M.mine.anchor.start); await dungeon('mine');   // Rowan at the entrance, the captain at the end
  // 3-5
  await enter('sularis'); await talk('sularis', look('edmund'));
  await enter('kolan'); await dungeon('kolan');
  await enter('hideout'); await talk('hideout', look('owen'));
  await enter('river'); await dungeon('river');              // → choose Rowan's story
  // 6A
  await talk('southwind', look('merchant')); setMap('swtunnel', ...M.swtunnel.anchor.start); await dungeon('swtunnel');
  await enter('frostvale');                                  // → Sai's story
  // 6B
  await enter('camp'); await enter('kasumi'); await enter('ferry'); await dungeon('ferry');
  S.bag.meat = 1; await enter('wildhut'); await talk('wildhut', look('galan'));
  await enter('trench'); await dungeon('trench');
  await enter('frostvale');                                  // → Aria's story (Gearwick, then the elder)
  await talk('frostvale', at(19, 15));                       // → chapter 7, the battle on the snow → chapter 8
  // 8-9
  await enter('southwind'); await enter('rainhold'); setMap('raintower', ...M.raintower.anchor.start); await dungeon('raintower');
  await enter('gilden'); await talk('gilden', at(6, 3));
  await enter('opera'); forced.push(0, 1, 0); await talk('opera', at(13, 11));
  // 10-13
  await enter('vexhold'); setMap('arcanum', ...M.arcanum.anchor.start); await dungeon('arcanum');
  await enter('gate'); await dungeon('gate');
  await enter('vexhold'); setMap('palace', 10, 12); await talk('palace', look('leopold'));
  // 14-17
  await enter('samar'); await talk('samar', look('bolo')); await dungeon('burning');
  await enter('valley'); await dungeon('valley');
  await M.world.onBoard(A)(A);                               // the sky battle → the isle
  await dungeon('isle');                                     // → the Pillars → the Fall → the Solitary Isle
  // 18: bring Grandpa Tobin four bright memory shells
  for (let i = 0; i < 4; i++) { S.flags.fish = 1; await talk('solitary', look('tobin')); }
  setMap('solitary', 10, 3); await steps(M.solitary, [10, 3], 0);
  // 19-21
  await enter('tidewatch'); await enter('nikko'); await talk('nikko', look('edmund'));
  await enter('r_sularis'); await dungeon('r_sularis');
  // 22: the airship, then everyone
  await enter('nikko'); await talk('nikko', look('regis'));
  await enter('tomb'); await dungeon('tomb');
  await enter('crumbleton'); await talk('crumbleton', look('sai')); await talk('crumbleton', look('lili'));
  await enter('hopehaven'); await talk('hopehaven', look('selene'));
  await enter('dream'); await dungeon('dream');
  await enter('phoenixcave'); await dungeon('phoenixcave');
  S.bag.meat = 1; await enter('r_wildhut'); await talk('r_wildhut', look('galan')); await talk('r_wildhut', at(6, 3));
  await enter('colosseum'); await talk('colosseum', at(5, 3));
  await enter('culttower'); await dungeon('culttower');
  await enter('r_frostvale'); await talk('r_frostvale', look('moka')); setMap('icecave', ...M.icecave.anchor.start); await dungeon('icecave');
  await enter('wormbelly'); await dungeon('wormbelly');
  await enter('hopehaven');                                  // the Ash Behemoth attacks; Selene takes up her sword
  for (let i = 1; i <= 8; i++) { await enter('lair' + i); await dungeon('lair' + i); }
  await enter('spire'); await dungeon('spire');              // the statues, then the throne → the ending
}
await run().catch((e) => { problems.push('CRASH ' + (e.stack || e)); });
while (pending.length) await pending.shift();
console.log(log.join('\n'));
console.log(`roster ${S.roster.length}: ${S.roster.map((id) => `${id}:${S.members[id].lv}`).join(' ')}`);
console.log(`story battles ${battles}, random battles ${randoms}, story battles lost even after more fighting: ${lost}`);
console.log(`astrals ${Object.keys(S.astrals).length}, ended: ${!!S.flags.ENDED}`);
console.log(problems.length ? 'PROBLEMS:\n  ' + problems.join('\n  ') : 'no problems');
process.exit(problems.length ? 1 : 0);
