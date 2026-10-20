// ASH ARIA — the engine: title, chapters, walking the two worlds, towns and dungeons, the airship, talking, menus, shops,
// inns, saving, battles (battleview.js) and the ending. The story (story.js) drives everything through the script API `A`.
import { T, EN, setLang } from './i18n.js?v=4';
import { CHARS, ITEMS, SPELLS, GEAR, ASTRALS, TOOLS, SLOTS, FX, canEquip, shopList, CMD } from './data.js?v=4';
import { newMember, maxhp, maxmp, atk, defense, mdefense, str, mag, spd, vit, healFull, bagAdd, bagTake, equip, optimum, expFor, alive, hasFx, levelTo } from './party.js?v=4';
import { tile, person, airship as shipSprite } from './art.js?v=4';
import { buildMaps, TILE, WALK, LANDABLE, BARRIERS, worldZone, placeOf, PLACES_B, PLACES_R } from './maps.js?v=4';
import { encounter, MONSTERS } from './monsters.js?v=4';
import { runBattle } from './battleview.js?v=4';
import { decorate, SPEAKERS, CHAPTERS, ending as endingLines, opening } from './story.js?v=4';
import { music, sfx, toggleMute, isMuted, unlock } from './audio.js?v=4';
import * as UI from './ui.js?v=4';
const { say, says, ask, menu, box, text, S: SC, VW, VH } = UI;

const canvas = document.getElementById('game'), g = canvas.getContext('2d');
canvas.width = VW * SC; canvas.height = VH * SC; g.imageSmoothingEnabled = false;
UI.setCtx(g);
// HD-2D: a WebGL diorama under the 2D canvas; if it fails the game keeps the flat look
const glCanvas = document.getElementById('gl'), screenEl = document.getElementById('screen');
let HDR = null, hdScale = 1, slowT = 0, hdPref = (() => { try { return localStorage.getItem('aa.hd') !== '0'; } catch (e) { return true; } })();
const hdOn = () => !!HDR && hdPref;
function hdRender(st) { try { HDR.render(st); } catch (e) { console.error(e); window.__err = String(e.stack || e); HDR = null; fitScreen(); } }
function fitScreen() {
  const wr = document.getElementById('wrap').getBoundingClientRect(), s = Math.max(0.5, Math.min(wr.width / VW, wr.height / VH));
  const w = Math.floor(VW * s), h = Math.floor(VH * s); screenEl.style.width = w + 'px'; screenEl.style.height = h + 'px';
  if (HDR) { let dpr = Math.min(2, window.devicePixelRatio || 1); if (w * h * dpr * dpr > 2.4e6) dpr = Math.sqrt(2.4e6 / (w * h)); HDR.resize(w, h, Math.max(0.5, dpr * hdScale)); }
  glCanvas.style.display = hdOn() ? 'block' : 'none';
}
addEventListener('resize', fitScreen); fitScreen(); try { new ResizeObserver(fitScreen).observe(document.getElementById('wrap')); } catch (e) { /* ignore */ }
if (!/fx=low/.test(location.search)) import('./hd.js?v=4').then((m) => { try { HDR = m.create(glCanvas); } catch (e) { HDR = null; } fitScreen(); }).catch(() => {});
function setHD(on) { hdPref = on; try { localStorage.setItem('aa.hd', on ? '1' : '0'); } catch (e) { /* ignore */ } fitScreen(); }
const hdLabel = () => T('畫面：', 'Graphics: ') + (hdPref ? 'HD-2D' : T('經典', 'Classic'));

const MAPS = buildMaps();
decorate(MAPS);
const KEY = 'aa.save.v1', GAME = 'ash-aria';

// ---------------------------------------------------------------- state
let S = null;
let MAP = null, mapId = null, tilesNow = null;
const P = { x: 0, y: 0, dir: 'down', moving: null, frame: 0, trail: [] };
let mode = 'title', scene = null, running = 0, ftime = 0, fade = 0, npcState = new Map(), flying = false;
const nameOf = (id) => (CHARS[id] ? T(CHARS[id].name) : SPEAKERS[id] ? T(SPEAKERS[id]) : id);
const partyM = () => S.party.map((id) => S.members[id]).filter(Boolean);
const leader = () => partyM().find(alive) || partyM()[0];

// ---------------------------------------------------------------- saving
function save() { try { S.playTime = Math.round(S.playTime || 0); localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } if (cloud) try { cloud.touch(GAME, KEY); } catch (e) { /* ignore */ } }
const load = () => { try { const d = JSON.parse(localStorage.getItem(KEY)); return d && d.v === 1 ? d : null; } catch (e) { return null; } };
let cloud = null;
(async () => { try { cloud = await import('/save.js'); if (await cloud.pull(GAME, KEY) && mode === 'title') titleMenu(); } catch (e) { cloud = null; } })();

// ---------------------------------------------------------------- maps
const worldMap = () => (S.world === 'r' ? 'ruin' : 'world');
function enterMap(id, x, y, dir) {
  mapId = id; MAP = MAPS[id]; tilesNow = MAP.tiles.map((r) => r.split(''));
  for (const [k, v] of Object.entries((S.mapEdits || {})[id] || {})) { const [tx, ty] = k.split(',').map(Number); if (tilesNow[ty]) tilesNow[ty][tx] = v; }
  P.x = x; P.y = y; P.dir = dir || P.dir; P.moving = null; P.trail = Array.from({ length: 8 }, () => [x, y, P.dir]);
  S.map = id; S.x = x; S.y = y; S.dir = P.dir;
  if (MAP.world) S.world = MAP.world;
  npcState = new Map(); enteredAt = ftime;
  music(MAP.music || 'field');
  if (MAP.onEnter) runScript(MAP.onEnter);
}
const tileAt = (x, y) => { if (!tilesNow || y < 0 || x < 0 || y >= MAP.h || x >= MAP.w) return null; return TILE[tilesNow[y][x]] || 'void'; };
const npcsHere = () => (MAP.npcs || []).filter((n) => !n.when || n.when(A));
function npcAt(x, y) { for (const n of npcsHere()) { const s = npcState.get(n) || n; if (s.x === x && s.y === y) return n; } return null; }
const chestAt = (x, y) => (MAP.chests || []).find((c) => c.x === x && c.y === y && (!c.when || c.when(A)));
function barrierAt(x, y) { if (!MAP.world) return null; const b = BARRIERS.find((q) => q.world === MAP.world && q.x === x && q.y === y); return b && !S.flags[b.flag] ? b : null; }
const shipHere = (x, y) => S.ship && MAP.world && S.ship.world === MAP.world && S.ship.x === x && S.ship.y === y && !flying;
function walkable(x, y) {
  if (flying) return x >= 0 && y >= 0 && x < MAP.w && y < MAP.h;
  const t = tileAt(x, y);
  if (t === null) return !MAP.world && !MAP.dungeon && (!MAP.set || !!MAP.exitable);
  if (barrierAt(x, y)) return false;
  if (!WALK.has(t)) return false;
  if (t === 'miasma' && MAP.world && !S.flags.spire_open) return false;
  if (npcAt(x, y) || chestAt(x, y)) return false;
  if (shipHere(x, y)) return false;
  return true;
}
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// ---------------------------------------------------------------- the script API (used by story.js)
const ABORT = new Error('abort');
const A = {
  T, menu, sfx, music, sleep: UI.sleep,
  get S() { return S; },
  flag: (k) => !!S.flags[k], set: (k, v = true) => { S.flags[k] = v; }, unset: (k) => { delete S.flags[k]; }, count: (k) => S.flags[k] || 0, inc: (k) => { S.flags[k] = (S.flags[k] || 0) + 1; },
  // one line: [speaker, 中文, English]; the speaker's name goes in front
  say: (who, zh, en) => say((who ? nameOf(who) + T('：', ': ') : '') + T(zh, en)),
  async talk(lines) { for (const l of lines) { if (typeof l === 'function') { await l(A); continue; } const [who, zh, en] = l; await say((who ? nameOf(who) + T('：', ': ') : '') + T(zh, en)); } },
  ask: (zh, en, opts) => ask(T(zh, en), opts.map((o) => T(...o))),
  goal: (zh, en) => { S.goal = [zh, en]; },
  chapter: (n) => { const was = CHAPTERS[S.ch], c = CHAPTERS[n]; S.ch = n; if (was && c && was.k === c.k && !c.part) return Promise.resolve(); return chapterCard(n); },
  has: (it) => (S.bag[it] || 0) > 0, give: (it, n = 1) => bagAdd(S.bag, it, n), take: (it, n = 1) => bagTake(S.bag, it, n), gil: (n) => { S.gil = Math.max(0, S.gil + n); },
  async item(it, n = 1) { bagAdd(S.bag, it, n); sfx('chest'); const nmI = T((ITEMS[it] || GEAR[it] || TOOLS[it]).name); await say(T(`得到了${nmI}${n > 1 ? `×${n}` : ''}！`, `Received ${nmI}${n > 1 ? ` ×${n}` : ''}!`)); },
  async tool(id) { S.tools = S.tools || []; if (!S.tools.includes(id)) S.tools.push(id); sfx('chest'); await say(T(`得到了機械道具「${TOOLS[id].name[0]}」！`, `Received the tool ${TOOLS[id].name[1]}!`)); },
  async astral(id) { S.astrals = S.astrals || {}; if (S.astrals[id] !== undefined) return; S.astrals[id] = null; sfx('levelup'); music('item'); await say(T(`得到了星晶「${ASTRALS[id].name[0]}」！（在選單的「星晶」裝備，就能召喚、學習魔法）`, `Received the Astral ${ASTRALS[id].name[1]}! (Equip it under Astrals in the menu to summon it and learn its magic.)`)); },
  member: (id) => S.members[id], hasMember: (id) => S.roster.includes(id), inParty: (id) => S.party.includes(id),
  // someone joins: they come in at about the party's level
  async join(id, o = {}) {
    if (!S.members[id]) { const lv = o.lv || Math.max(1, Math.round(avgLv()) + (o.plus || 0)); S.members[id] = newMember(id, lv); }
    const m = S.members[id];
    if (!CHARS[id].guest && m.lv < Math.round(avgLv()) - 2) levelTo(m, Math.round(avgLv()) - 2);     // time has passed: they kept training
    healFull(m);
    if (!S.roster.includes(id)) S.roster.push(id);
    if (!S.party.includes(id) && (S.party.length < 4 || o.force)) { if (S.party.length >= 4) S.party.pop(); S.party.push(id); }
    if (!o.silent) { sfx('levelup'); music('item'); await say(T(`${nameOf(id)}成為了同伴！`, `${nameOf(id)} joins the party!`)); }
  },
  leave(id, o = {}) { S.party = S.party.filter((x) => x !== id); if (o.gone) S.roster = S.roster.filter((x) => x !== id); },
  // set who is in the party (for the split stories); lock: no changing until free()
  setParty(ids, lock = true, lv) { for (const id of ids) { if (!S.members[id]) S.members[id] = newMember(id, lv || Math.max(1, Math.round(avgLv()))); if (!S.roster.includes(id) && !CHARS[id].guest) S.roster.push(id); healFull(S.members[id]); } S.party = ids.slice(0, 4); S.lock = lock; },
  free() { S.lock = false; },
  catchUp(id, lv) { const m = S.members[id]; if (m && m.lv < lv) { levelTo(m, lv); healFull(m); } },
  avgLv: () => avgLv(),
  async battle(foes, opts = {}) {
    const r = await runBattle(G, foes, { bg: opts.bg || MAP.bg || 'field', ...opts });
    if (r === 'lose' && !opts.canLose) { await wipe(); throw ABORT; }
    music(MAP.music || 'field');
    return r;
  },
  warp(id, x, y, dir) { fade = 1; enterMap(id, x, y, dir); },
  world(x, y, dir = 'down', w) { if (w) S.world = w; fade = 1; enterMap(worldMap(), x, y, dir); },
  async fade(s = 1) { fade = s; await UI.sleep(s * 0.6); },
  scene(draw) { scene = draw ? { draw } : null; },
  setTile(x, y, c, id = mapId) { if (id === mapId) tilesNow[y][x] = c; S.mapEdits = S.mapEdits || {}; (S.mapEdits[id] = S.mapEdits[id] || {})[`${x},${y}`] = c; },
  airship(kind, at) { S.ship = kind ? { kind, world: S.world, x: at ? at[0] : P.x, y: at ? at[1] : P.y } : null; },
  heal() { for (const id of S.roster) healFull(S.members[id]); },
  inn, shop, saveHere: () => saveOffer(), pickParty: (n, must) => formation(n, must),
  ending: () => ending(),
  reload: () => { if (MAP) enterMap(mapId, P.x, P.y, P.dir); },
  get mapId() { return mapId; }, get pos() { return [P.x, P.y]; },
  quake: (s = 0.6) => { shakeT = s; },
};
const avgLv = () => { const ms = S.roster.map((id) => S.members[id]).filter((m) => m && !CHARS[m.id].guest); return ms.length ? ms.reduce((s, m) => s + m.lv, 0) / ms.length : 1; };
let shakeT = 0;
async function runScript(fn) {
  running++;
  try { await fn(A); } catch (e) { if (e !== ABORT) { console.error(e); window.__err = String(e.stack || e); } }
  finally { running--; }
}

// ---------------------------------------------------------------- what battles need
let frameWaiters = [];
const G = {
  get hd() { return hdOn(); }, get S() { return S; }, get bag() { return S.bag; },
  members: () => partyM(), flag: (k) => !!S.flags[k], sfx, music,
  setScene: (s) => { scene = s; }, nextFrame: () => new Promise((r) => frameWaiters.push(r)),
};

// ---------------------------------------------------------------- inns, shops, saving
async function inn(price = 60) {
  const cost = price;
  if (await ask(T(`歡迎光臨。住一晚 ${cost} 金幣，要休息嗎？`, `Welcome. A night is ${cost} gil. Will you stay?`), [T('住宿', 'Stay'), T('不用', 'No')]) !== 0) return;
  if (S.gil < cost) return say(T('哎呀，金幣不夠呢。', 'Oh dear, not enough gil.'));
  S.gil -= cost; fade = 1.6; music('inn');
  A.heal(); await UI.sleep(1.4);
  await say(T('早安！昨晚睡得好嗎？', 'Good morning! Did you sleep well?'));
  music(MAP.music);
}
async function saveOffer() {
  if (await ask(T('要記錄冒險嗎？', 'Save your progress?'), [T('記錄', 'Save'), T('不用', 'No')]) === 0) { S.savePoint = { map: mapId, x: P.x, y: P.y, dir: P.dir }; save(); sfx('ok'); music('save'); await say(T('已經記錄了。', 'Saved.')); }
}
const priceOf = (k) => (ITEMS[k] || GEAR[k] || TOOLS[k] || {}).price || 0;
const nameItem = (k) => T((ITEMS[k] || GEAR[k] || TOOLS[k]).name);
async function shop(kind, tier) {
  const list = shopList(tier, kind); if (kind === 'item' && (mapId === 'wildhut' || mapId === 'r_wildhut')) list.push('meat');
  const hello = { item: ['道具店', 'Item shop'], weapon: ['武器店', 'Weapon shop'], armor: ['防具店', 'Armour shop'], relic: ['飾品店', 'Relic shop'], tools: ['機械店', 'Tool shop'] }[kind];
  for (;;) {
    const i = await ask(T(`${hello[0]}：「歡迎光臨！」`, `${hello[1]}: "Welcome!"`), [T('買', 'Buy'), T('賣', 'Sell'), T('離開', 'Leave')]);
    if (i === 0) {
      const ii = await menu(list.map((k) => ({ label: nameItem(k) + (kind === 'tools' && (S.tools || []).includes(k) ? T(' (有)', ' (owned)') : ''), right: `${priceOf(k)}` })), { x: 8, y: 8, w: 240, rows: 9, title: `${S.gil} G`, info: (it, sel) => gearInfo(list[sel]) });
      if (ii < 0) continue;
      const k = list[ii], p = priceOf(k);
      if (kind === 'tools' && (S.tools || []).includes(k)) { await say(T('已經有了。', 'You already have that.')); continue; }
      if (S.gil < p) { await say(T('金幣不夠。', 'Not enough gil.')); continue; }
      S.gil -= p; sfx('ok');
      if (kind === 'tools') { (S.tools = S.tools || []).push(k); continue; }
      bagAdd(S.bag, k);
      if (GEAR[k]) {
        const who = S.party.filter((id) => canEquip(id, k));
        if (who.length && await ask(T('要現在裝備嗎？', 'Equip it now?'), [T('好', 'Yes'), T('不用', 'No')]) === 0) {
          const wi = await menu(who.map((id) => ({ label: nameOf(id) })), { x: 140, y: 40 }); if (wi >= 0) { const m = S.members[who[wi]], it = GEAR[k]; equip(m, it.slot === 'relic' ? (m.eq.relic1 ? 'relic2' : 'relic1') : it.slot, k, S.bag); }
        }
      }
    } else if (i === 1) {
      const items = Object.keys(S.bag).filter((k) => (ITEMS[k] && !ITEMS[k].key && (ITEMS[k].price || ITEMS[k].sell)) || GEAR[k]);
      if (!items.length) { await say(T('沒有可以賣的東西。', 'Nothing to sell.')); continue; }
      const sell = (k) => (ITEMS[k] && ITEMS[k].sell) || Math.max(1, Math.floor(priceOf(k) / 2) || 500);
      const ii = await menu(items.map((k) => ({ label: `${nameItem(k)} ×${S.bag[k]}`, right: `${sell(k)}` })), { x: 8, y: 8, w: 240, rows: 9, title: `${S.gil} G` }); if (ii < 0) continue;
      const k = items[ii]; bagTake(S.bag, k); S.gil += sell(k); sfx('ok');
    } else return;
  }
}
function gearInfo(k) {
  const it = GEAR[k]; if (!it) { const i2 = ITEMS[k] || TOOLS[k]; if (i2) { box(8, 196, 240, 40); text(itemDesc(k), 16, 204, { size: 7 * SC }); } return; }
  box(8, 160, 240, 76); let x = 16;
  for (const id of S.party) { const can = canEquip(id, k), m = S.members[id]; text(nameOf(id).slice(0, EN ? 6 : 3), x, 168, { color: can ? '#fff' : '#666', size: 7 * SC }); if (can) { const slot = it.slot === 'relic' ? 'relic1' : it.slot, cur = m.eq[slot] && GEAR[m.eq[slot]], d = it.slot === 'weapon' ? (it.power - (cur ? cur.power : 0)) : (it.def || 0) - (cur && cur.def || 0); text(it.slot === 'relic' ? '★' : `${d >= 0 ? '+' : ''}${d}`, x, 180, { color: d > 0 ? '#7fff8a' : '#ccc', size: 7 * SC }); } x += 58; }
  text(gearLine(k), 16, 198, { size: 7 * SC, color: '#ffe080' }); if (it.fx) text(T(FX[it.fx]), 16, 212, { size: 7 * SC });
}
const gearLine = (k) => { const it = GEAR[k]; const p = []; if (it.power) p.push(T(`攻擊 ${it.power}`, `Atk ${it.power}`)); if (it.def) p.push(T(`防 ${it.def}`, `Def ${it.def}`)); if (it.mdef) p.push(T(`魔防 ${it.mdef}`, `M.Def ${it.mdef}`)); if (it.el) p.push(T('屬性', 'Elem') + ':' + it.el); if (it.st) p.push(Object.entries(it.st).map(([s, v]) => `${{ st: T('力', 'Str'), ma: T('魔', 'Mag'), sp: T('速', 'Spd'), vi: T('體', 'Vit') }[s]}+${v}`).join(' ')); return p.join('  '); };
function itemDesc(k) {
  const it = ITEMS[k], tl = TOOLS[k];
  if (tl) return T('機械道具：', 'Tool: ') + T(tl.name);
  if (!it) return '';
  return { heal: T(`回復 ${it.amt >= 9999 ? '全部' : it.amt} HP`, `Restores ${it.amt >= 9999 ? 'all' : it.amt} HP`), mp: T(`回復 ${it.amt} MP`, `Restores ${it.amt} MP`), full: T('HP、MP 全滿', 'Fully restores HP and MP'), revive: T('讓倒下的同伴復活', 'Revives a fallen ally'), cure: T('治療異常狀態', 'Cures ailments'), tent: T('在世界地圖或存檔點讓全隊回復', 'Rest the party on the world map or at a save point'), warp: T('離開迷宮', 'Escape a dungeon'), smoke: T('逃離戰鬥', 'Escape a battle') }[it.use] || (it.throw ? T('夜鴉可以投擲', 'Nightcrow can throw it') : it.key ? T('重要的東西', 'A key item') : '');
}

// ---------------------------------------------------------------- the field menu
async function fieldMenu() {
  const opts = [['items', T('道具', 'Items')], ['magic', T('魔法', 'Magic')], ['astral', T('星晶', 'Astrals')], ['equip', T('裝備', 'Equip')], ['status', T('狀態', 'Status')]];
  if (!S.lock && S.roster.length > 1) opts.push(['party', T('隊伍', 'Party')]);
  opts.push(['system', T('系統', 'System')]);
  const close = UI.panel(() => {
    box(150, 8, 98, 54); text(`${S.gil} G`, 240, 14, { align: 'right' }); text(fmtTime(S.playTime || 0), 240, 28, { align: 'right', size: 7 * SC, color: '#aaa' });
    text(chapterLabel(), 156, 44, { size: 6 * SC, color: '#ffe080' });
    if (S.goal) { const lines = UI.wrap(T('目標：', 'Goal: ') + T(S.goal), 226); box(8, 178, 240, 18 + lines.length * 12); lines.forEach((l, i) => text(l, 16, 186 + i * 12, { size: 7 * SC })); }
    partyStrip(70, 8);
  });
  try {
    for (;;) {
      const i = await menu(opts.map((o) => o[1]), { x: 8, y: 8, w: 60 });
      if (i < 0) return;
      const k = opts[i][0];
      if (k === 'items') await itemMenu(); else if (k === 'magic') await magicMenu(); else if (k === 'astral') await astralMenu(); else if (k === 'equip') await equipMenu();
      else if (k === 'status') await statusMenu(); else if (k === 'party') await formation(4); else if (k === 'system') { if (await systemMenu()) return; }
    }
  } finally { close(); }
}
const fmtTime = (s) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}`;
const chapterLabel = () => { const c = CHAPTERS[S.ch]; return c ? T(c.short || c.title) : ''; };
function partyStrip(x, y) {
  partyM().forEach((m, i) => {
    const yy = y + i * 36; box(x, yy, 78, 34);
    g.drawImage(person(CHARS[m.id].look, 'down', 0), (x + 4) * SC, (yy + 6) * SC, 16 * SC, 16 * SC);
    text(nameOf(m.id).slice(0, EN ? 7 : 4), x + 24, yy + 5, { size: 7 * SC }); text(`Lv${m.lv}`, x + 72, yy + 5, { size: 6 * SC, align: 'right', color: '#ffe080' });
    text(`${m.hp}/${maxhp(m)}`, x + 24, yy + 16, { size: 6 * SC, color: m.hp <= 0 ? '#ff6a6a' : '#fff' }); text(`${m.mp}`, x + 72, yy + 24, { size: 6 * SC, align: 'right', color: '#a8c8ff' });
  });
}
const pickMember = (title, ids = S.party) => menu(ids.map((id) => ({ label: nameOf(id), right: `${S.members[id].hp}/${maxhp(S.members[id])}` })), { x: 80, y: 8, title });
async function itemMenu() {
  for (;;) {
    const keys = Object.keys(S.bag); if (!keys.length) return say(T('沒有任何道具。', 'You have no items.'));
    const i = await menu(keys.map((k) => ({ label: nameItem(k), right: `×${S.bag[k]}` })), { x: 60, y: 8, w: 188, rows: 10, info: (it, sel) => { box(60, 176, 188, 24); text(itemDesc(keys[sel]) || gearLine(keys[sel]) || '', 66, 183, { size: 6 * SC }); } });
    if (i < 0) return;
    const k = keys[i], it = ITEMS[k];
    if (GEAR[k]) { await equipMenu(); continue; }
    if (!it || !it.use || ['smoke'].includes(it.use)) continue;
    if (it.use === 'tent') { if (!MAP.world && tileAt(P.x, P.y) !== 'crystal') { await say(T('只能在世界地圖或存檔點使用。', 'Only on the world map or at a save point.')); continue; } bagTake(S.bag, k); fade = 1.5; music('inn'); A.heal(); await UI.sleep(1.2); music(MAP.music); continue; }
    if (it.use === 'warp') { if (!MAP.dungeon) { await say(T('只能在迷宮裡使用。', 'Only inside a dungeon.')); continue; } bagTake(S.bag, k); return exitDungeon(); }
    const targets = it.target === 'party' ? S.party : null; let ids = targets;
    if (!ids) { const w = await pickMember(T('給誰用？', 'On whom?')); if (w < 0) continue; ids = [S.party[w]]; }
    bagTake(S.bag, k); sfx('heal');
    for (const id of ids) { const m = S.members[id];
      if (it.use === 'heal' && m.hp > 0) m.hp = Math.min(maxhp(m), m.hp + it.amt);
      if (it.use === 'mp') m.mp = Math.min(maxmp(m), m.mp + it.amt);
      if (it.use === 'full') { if (m.hp <= 0 && it.target !== 'party') continue; m.hp = maxhp(m); m.mp = maxmp(m); }
      if (it.use === 'revive' && m.hp <= 0) m.hp = Math.max(1, Math.round(maxhp(m) * it.amt));
    }
  }
}
async function magicMenu() {
  const ids = S.party.filter((id) => S.members[id].spells.length); if (!ids.length) return say(T('沒有人會魔法。（裝備星晶就能學會）', 'Nobody knows magic yet. (Equip an Astral to learn some.)'));
  const ci = await pickMember(T('誰施法？', 'Who casts?'), ids); if (ci < 0) return;
  const c = S.members[ids[ci]];
  for (;;) {
    const sp = c.spells.filter((s) => SPELLS[s]);
    const si = await menu(sp.map((s) => ({ label: T(SPELLS[s].name), right: String(SPELLS[s].mp), disabled: c.mp < SPELLS[s].mp || !['heal', 'revive', 'esuna', 'warp'].includes(SPELLS[s].kind) })), { x: 90, y: 8, w: 158, rows: 10, cols: 1, title: `MP ${c.mp}/${maxmp(c)}` });
    if (si < 0) return;
    const s = SPELLS[sp[si]];
    if (s.kind === 'warp') { if (!MAP.dungeon) { await say(T('只能在迷宮裡使用。', 'Only inside a dungeon.')); continue; } c.mp -= s.mp; return exitDungeon(); }
    let ids2 = s.target === 'party' ? S.party : null;
    if (!ids2) { const ti = await pickMember(T('對誰施法？', 'On whom?')); if (ti < 0) continue; ids2 = [S.party[ti]]; }
    c.mp -= s.mp; sfx('heal');
    for (const id of ids2) { const m = S.members[id];
      if (s.kind === 'heal' && m.hp > 0) m.hp = Math.min(maxhp(m), m.hp + Math.round(s.power * (mag(c) / 7 + c.lv / 2 + 4) * (ids2.length > 1 ? 0.6 : 1)));
      if (s.kind === 'revive' && m.hp <= 0) m.hp = Math.max(1, Math.round(maxhp(m) * s.power));
    }
  }
}
async function astralMenu() {
  const owned = Object.keys(S.astrals || {}); if (!owned.length) return say(T('還沒有星晶。', 'You have no Astrals yet.'));
  for (;;) {
    const mi = await pickMember(T('誰要裝備星晶？', 'Who equips an Astral?'), S.party.filter((id) => !CHARS[id].guest && id !== 'uma')); if (mi < 0) return;
    const ids = S.party.filter((id) => !CHARS[id].guest && id !== 'uma'), m = S.members[ids[mi]];
    const list = [null, ...owned];
    const ai = await menu(list.map((a) => a ? { label: T(ASTRALS[a].name) + (S.astrals[a] && S.astrals[a] !== m.id ? `（${nameOf(S.astrals[a])}）` : ''), right: m.astral === a ? '★' : '' } : { label: T('（卸下）', '(none)') }), { x: 90, y: 8, w: 158, rows: 10, title: nameOf(m.id), info: (it, sel) => astralInfo(list[sel], m) });
    if (ai < 0) continue;
    const a = list[ai];
    if (m.astral) S.astrals[m.astral] = null;
    if (a) { if (S.astrals[a]) S.members[S.astrals[a]].astral = null; S.astrals[a] = m.id; }
    m.astral = a; sfx('ok');
  }
}
function astralInfo(a, m) {
  box(8, 150, 240, 86); if (!a) return;
  const A2 = ASTRALS[a];
  text(`${T(A2.summon.name)}  MP ${A2.summon.mp}`, 16, 156, { color: '#ffe080', size: 7 * SC });
  Object.entries(A2.teach).forEach(([s, r], i) => { if (!SPELLS[s]) return; const pct = m.spells.includes(s) ? '★' : `${Math.floor(m.learn[s] || 0)}%`; text(`${T(SPELLS[s].name)} ×${r}  ${pct}`, 16 + (i % 2) * 116, 170 + Math.floor(i / 2) * 12, { size: 7 * SC }); });
  const b = Object.entries(A2.bonus).map(([k, v]) => ({ str: T('力', 'Str'), mag: T('魔', 'Mag'), spd: T('速', 'Spd'), vit: T('體', 'Vit'), hp: 'HP', mp: 'MP' })[k] + (k === 'hp' || k === 'mp' ? `+${Math.round(v * 100)}%` : `+${v}`)).join(' ');
  if (b) text(T('升級加成 ', 'Level bonus ') + b, 16, 210, { size: 7 * SC, color: '#a8ffb0' });
  text(T(A2.story), 16, 222, { size: 6 * SC, color: '#aaa' });
}
async function equipMenu() {
  const mi = await pickMember(T('誰的裝備？', 'Whose equipment?'), S.party.filter((id) => id !== 'uma')); if (mi < 0) return;
  const ids = S.party.filter((id) => id !== 'uma'), m = S.members[ids[mi]];
  for (;;) {
    const close = UI.panel(() => { box(8, 150, 240, 86); text(`${nameOf(m.id)}  Lv ${m.lv}`, 16, 156, { color: '#ffe080' }); text(`${T('攻擊', 'Attack')} ${atk(m)}   ${T('防禦', 'Defence')} ${defense(m)}   ${T('魔防', 'M.Def')} ${mdefense(m)}`, 16, 172, { size: 7 * SC }); text(`${T('力', 'Str')} ${str(m)}  ${T('魔', 'Mag')} ${mag(m)}  ${T('速', 'Spd')} ${spd(m)}  ${T('體', 'Vit')} ${vit(m)}`, 16, 186, { size: 7 * SC }); });
    const opts = [...SLOTS.map(([k, zh, en]) => ({ label: T(zh, en), right: m.eq[k] ? nameItem(m.eq[k]) : '—' })), { label: T('最強裝備', 'Optimum') }];
    const si = await menu(opts, { x: 8, y: 8, w: 240, rows: 7 });
    close(); if (si < 0) return;
    if (si === SLOTS.length) { optimum(m, S.bag); sfx('ok'); continue; }
    const slot = SLOTS[si][0], want = slot.startsWith('relic') ? 'relic' : slot;
    const cands = Object.keys(S.bag).filter((k) => GEAR[k] && GEAR[k].slot === want && canEquip(m.id, k));
    const ii = await menu([{ label: T('（卸下）', '(remove)') }, ...cands.map((k) => ({ label: nameItem(k), right: `×${S.bag[k]}` }))], { x: 60, y: 30, w: 188, rows: 8, info: (it, sel) => { if (sel > 0) gearInfo(cands[sel - 1]); } });
    if (ii < 0) continue;
    equip(m, slot, ii === 0 ? null : cands[ii - 1], S.bag); sfx('ok');
  }
}
async function statusMenu() {
  const mi = await pickMember(T('看誰的狀態？', 'Whose status?'), S.party); if (mi < 0) return;
  const m = S.members[S.party[mi]], c = CHARS[m.id];
  const close = UI.panel(() => {
    g.fillStyle = '#05040c'; g.fillRect(6 * SC, 6 * SC, 244 * SC, 228 * SC);
    box(8, 8, 240, 224);
    g.drawImage(person(c.look, 'down', Math.floor(ftime * 2) % 2), 16 * SC, 14 * SC, 32 * SC, 32 * SC);
    text(nameOf(m.id), 56, 16, { color: '#ffe080' }); text(T(c.job), 56, 30, { color: '#aaa', size: 7 * SC });
    text(`${T('專屬指令', 'Command')}：${T(CMD[c.cmd][0])}`, 140, 16, { size: 7 * SC });
    const rowsS = [[T('等級', 'Level'), m.lv], ['HP', `${m.hp}/${maxhp(m)}`], ['MP', `${m.mp}/${maxmp(m)}`], [T('力量', 'Strength'), str(m)], [T('魔力', 'Magic'), mag(m)], [T('速度', 'Speed'), spd(m)], [T('體力', 'Vitality'), vit(m)],
      [T('攻擊', 'Attack'), atk(m)], [T('防禦', 'Defence'), defense(m)], [T('魔防', 'M.Defence'), mdefense(m)], [T('經驗值', 'EXP'), m.xp], [T('下一級', 'Next'), Math.max(0, expFor(m.lv + 1) - m.xp)]];
    rowsS.forEach(([k, v], i) => { text(k, 18, 52 + i * 12, { size: 7 * SC }); text(String(v), 120, 52 + i * 12, { align: 'right', size: 7 * SC }); });
    SLOTS.forEach(([k], i) => text(m.eq[k] ? nameItem(m.eq[k]) : '—', 130, 52 + i * 11, { color: '#ccc', size: 7 * SC }));
    text(T('星晶', 'Astral') + '：' + (m.astral ? T(ASTRALS[m.astral].name) : '—'), 130, 122, { size: 7 * SC, color: '#ffe080' });
    UI.wrap(T(CMD[c.cmd][1]), 106).slice(0, 4).forEach((l, i) => text(l, 130, 150 + i * 10, { size: 6 * SC, color: '#ccc' }));
    text(T('魔法', 'Magic'), 18, 200, { color: '#ffe080', size: 7 * SC });
    UI.wrap(m.spells.map((s) => T(SPELLS[s].name)).join(' ') || '—', 186).slice(0, 2).forEach((l, i) => text(l, 50, 200 + i * 11, { size: 6 * SC }));
    if (c.cmd === 'feral') text(`${T('野性', 'Ferals')} ${m.ferals.length}`, 130, 136, { size: 7 * SC });
    if (c.cmd === 'lore') text(`${T('青魔法', 'Lores')} ${(S.lores || []).length}`, 130, 136, { size: 7 * SC });
    if (c.cmd === 'dance') text(`${T('舞', 'Dances')} ${(S.dances || []).length}/8`, 130, 136, { size: 7 * SC });
    if (c.cmd === 'tools') text(`${T('機械', 'Tools')} ${(S.tools || []).length}`, 130, 136, { size: 7 * SC });
  });
  await UI.waitKey(); close();
}
// choose who fights (n at most); must: ids that have to be in
async function formation(n = 4, must = []) {
  if (S.lock) { await say(T('現在不能更換隊伍。', 'The party can\'t be changed right now.')); return; }
  const roster = S.roster.filter((id) => S.members[id]);
  let pick = S.party.filter((id) => roster.includes(id)).slice(0, n);
  for (const id of must) if (!pick.includes(id)) pick.unshift(id);
  pick = pick.slice(0, n);
  for (;;) {
    const i = await menu([...roster.map((id) => ({ label: `${pick.includes(id) ? '⚔ ' : '　'}${nameOf(id)}`, right: `Lv${S.members[id].lv}` })), { label: T('決定', 'Done') }], { x: 40, y: 8, w: 176, rows: 10, title: T(`選擇出戰的同伴（最多 ${n} 人）`, `Choose who fights (up to ${n})`) });
    if (i < 0 || i === roster.length) { if (!pick.length) continue; S.party = pick; return pick; }
    const id = roster[i];
    if (pick.includes(id)) { if (must.includes(id)) { await say(T('這個人一定要在隊伍裡。', 'They must be in the party.')); continue; } pick = pick.filter((x) => x !== id); }
    else if (pick.length < n) pick.push(id); else await say(T(`最多 ${n} 人。`, `Up to ${n} only.`));
  }
}
async function systemMenu() {
  const canSave = MAP.world || tileAt(P.x, P.y) === 'crystal';
  const opts = [T('記錄', 'Save') + (canSave ? '' : T('（世界地圖或存檔點）', ' (world map / save point)')), T('音樂：' + (isMuted() ? '關' : '開'), 'Music: ' + (isMuted() ? 'off' : 'on')), EN ? '中文' : 'English', T('回到標題', 'Title screen'), ...(HDR ? [hdLabel()] : [])];
  const i = await menu(opts.map((l, k) => ({ label: l, disabled: k === 0 && !canSave })), { x: 70, y: 60, w: 178 });
  if (i === 0) { S.savePoint = { map: mapId, x: P.x, y: P.y, dir: P.dir }; save(); music('save'); await say(T('已經記錄了。', 'Saved.')); }
  if (i === 1) toggleMute();
  if (i === 2) { save(); setLang(EN ? 'zh' : 'en'); }
  if (i === 3 && await ask(T('回到標題畫面？（沒記錄的進度會消失）', 'Return to the title? (Unsaved progress is lost)'), [T('是', 'Yes'), T('否', 'No')]) === 0) { titleMenu(); return true; }
  if (i === 4) setHD(!hdPref);
  return false;
}

// ---------------------------------------------------------------- moving about
function tryMove(dir) {
  P.dir = dir;
  const [dx, dy] = DIRS[dir], nx = P.x + dx, ny = P.y + dy;
  if (!walkable(nx, ny)) return;
  P.trail.unshift([P.x, P.y, P.dir]); P.trail.length = Math.min(P.trail.length, 8);
  P.moving = { fx: P.x, fy: P.y, t: 0 }; P.x = nx; P.y = ny; P.frame ^= 1;
}
const speed = () => (flying ? 0.07 : partyM().some((m) => hasFx(m, 'sprint')) ? 0.12 : 0.17);
async function arrived() {
  S.x = P.x; S.y = P.y; S.dir = P.dir;
  if (flying) return;
  const t = tileAt(P.x, P.y);
  if (t === null) { const side = P.y < 0 ? 'up' : P.x < 0 ? 'left' : P.x >= MAP.w ? 'right' : 'down'; return leaveTown(side); }
  if (MAP.world) { const p = MAP.places.find((q) => q.x === P.x && q.y === P.y); if (p) return enterPlace(p); }
  const w = (MAP.warps || []).find((q) => q.x === P.x && q.y === P.y && (!q.when || q.when(A)));
  if (w) {
    sfx('door'); fade = 0.6;
    if (w.world) { const [wx, wy] = w.world; S.world = w.worldId || S.world; return enterMap(worldMap(), wx, wy, 'down'); }
    if (w.to === 'world') return exitDungeon();
    const m = MAPS[w.to]; const [x, y] = w.at || (w.end ? m.anchor.end : m.anchor.start);
    return enterMap(w.to, x, y, P.dir);
  }
  // step-on events
  const tkey = (q) => 'tr_' + (MAP.base || mapId) + (MAP.floor || '') + '_' + MAP.triggers.indexOf(q);
  const tr = (MAP.triggers || []).find((q) => P.x >= q.x && P.x < q.x + (q.w || 1) && P.y >= q.y && P.y < q.y + (q.h || 1) && (!q.when || q.when(A)) && !(q.once && S.flags[tkey(q)]));
  if (tr) { if (tr.once) S.flags[tkey(tr)] = true; return runScript(tr.run); }
  if (t === 'lava') { fade = 0.25; for (const m of partyM()) if (m.hp > 1) m.hp = Math.max(1, m.hp - Math.ceil(maxhp(m) * 0.03)); }
  // monsters
  const zone = MAP.world ? worldZone(MAP.world, P.x, P.y) : MAP.enc;
  if (zone && !window.__noEnc && !S.flags.noEnc && !partyM().some((m) => hasFx(m, 'noenc'))) {
    const fewer = partyM().some((m) => hasFx(m, 'fewer'));
    S.steps -= (t === 'forest' || t === 'hills' ? 1.4 : 1) * (fewer ? 0.5 : 1);
    if (S.steps <= 0) {
      S.steps = 14 + Math.random() * 24;
      const group = encounter(zone);
      if (group.length) {
        const bg = MAP.world ? (t === 'sand' ? 'desert' : t === 'snowfield' ? 'snow' : t === 'forest' ? 'forest' : MAP.world === 'r' ? 'ruin' : zone === 'wild' ? 'wild' : 'field') : MAP.bg;
        await runScript(async () => { await A.battle(group, { bg }); });
      }
    }
  }
}
async function enterPlace(p) {
  const to = p.to && p.to(A); if (to) { sfx('door'); fade = 0.6; const tm = MAPS[to]; return tm.entry ? enterMap(to, tm.entry[0], tm.entry[1], tm.entry[2] || 'up') : enterMap(to, 12, tm.h - 1, 'up'); }
  const m = MAPS[p.id]; if (!m) return;
  if (p.gate && !p.gate(A)) return;
  const gate = m.gate && m.gate(A);
  if (gate) { P.x = P.trail[0][0]; P.y = P.trail[0][1]; await runScript(async () => { await A.talk(gate); }); return; }
  sfx('door'); fade = 0.6;
  if (m.dungeon) { const [x, y] = m.anchor.start; return enterMap(p.id, x, y, 'down'); }
  if (m.entry) return enterMap(p.id, m.entry[0], m.entry[1], m.entry[2] || 'up');
  if (m.town && P.dir === 'down' && m.tiles[0][12] !== m.tiles[0][0]) return enterMap(p.id, 12, 0, 'down');
  return enterMap(p.id, 12, m.h - 1, 'up');
}
// out of a town by its edge: to the world map beside the place
function leaveTown(side = 'down') {
  if (MAP.exitTo) { fade = 0.6; return enterMap(MAP.exitTo[0], MAP.exitTo[1], MAP.exitTo[2], 'down'); }
  const p = placeOf(MAP.id); if (!p) return;
  S.world = PLACES_R.includes(p) ? 'r' : 'b';
  const W = MAPS[worldMap()], ok = (x, y) => { const t = TILE[W.tiles[y] && W.tiles[y][x]]; return t && WALK.has(t) && t !== 'miasma' && !W.places.some((q) => q.x === x && q.y === y); };
  const [dx, dy] = DIRS[side];
  if (ok(p.x + dx, p.y + dy)) return enterMap(worldMap(), p.x + dx, p.y + dy, side);
  for (const d of ['down', 'up', 'left', 'right']) { const [ex, ey] = DIRS[d]; if (ok(p.x + ex, p.y + ey)) return enterMap(worldMap(), p.x + ex, p.y + ey, d); }
  return enterMap(worldMap(), p.x, p.y + 1, 'down');
}
function exitDungeon() {
  fade = 1;
  if (MAP.exitTo) { const [id, x, y] = MAP.exitTo; return enterMap(id, x, y, 'down'); }
  const base = MAPS[MAP.base || mapId], ex = base && base.exitTo; if (ex) return enterMap(ex[0], ex[1], ex[2], 'down');
  const p = placeOf(MAP.exitPlace || MAP.base || mapId); if (!p) return;
  S.world = PLACES_R.includes(p) ? 'r' : 'b';
  enterMap(worldMap(), p.x, p.y + 1, 'down');
}
async function check() {
  const [dx, dy] = DIRS[P.dir], fx = P.x + dx, fy = P.y + dy;
  // the airship: board it
  if (MAP.world && shipHere(fx, fy)) { if (MAP.onBoard && MAP.onBoard(A)) return runScript(MAP.onBoard(A)); flying = true; S.ship.on = true; P.x = fx; P.y = fy; music('airship'); return; }
  let n = npcAt(fx, fy);
  if (!n && tileAt(fx, fy) === 'counter') n = npcAt(fx + dx, fy + dy);
  if (n && n.talk) { const st = npcState.get(n); if (st) st.dir = { up: 'down', down: 'up', left: 'right', right: 'left' }[P.dir]; return runScript(n.talk); }
  const c = chestAt(fx, fy);
  if (c) return runScript(async () => {
    if (S.flags['chest_' + c.id]) return say(T('寶箱是空的。', 'The chest is empty.'));
    S.flags['chest_' + c.id] = true; sfx('chest');
    if (c.gold) { S.gil += c.gold; return say(T(`打開了寶箱。得到了 ${c.gold} 金幣！`, `Inside the chest: ${c.gold} gil!`)); }
    if (TOOLS[c.item]) return A.tool(c.item);
    bagAdd(S.bag, c.item, c.n || 1); return say(T(`打開了寶箱。得到了${nameItem(c.item)}${c.n > 1 ? ` ×${c.n}` : ""}！`, `Inside the chest: ${nameItem(c.item)}${c.n > 1 ? ` ×${c.n}` : ""}!`));
  });
  const ck = MAP.checks && (MAP.checks[`${fx},${fy}`] || MAP.checks[`${P.x},${P.y}`]);
  if (ck) return runScript(ck);
  if (tileAt(fx, fy) === 'crystal' || tileAt(P.x, P.y) === 'crystal') return runScript(async () => { const i = await ask(T('一顆溫暖發光的水晶。', 'A crystal glowing with warm light.'), [T('記錄', 'Save'), T('用帳篷休息', 'Rest (Tent)'), T('離開', 'Leave')]); if (i === 0) { S.savePoint = { map: mapId, x: P.x, y: P.y, dir: P.dir }; save(); music('save'); await say(T('已經記錄了。', 'Saved.')); } else if (i === 1) { if (!bagTake(S.bag, 'tent')) await say(T('沒有帳篷。', 'You have no Tent.')); else { fade = 1.5; music('inn'); A.heal(); await UI.sleep(1.2); music(MAP.music); } } });
}
// landing the airship (OK while flying): on a place it goes in; on open ground the party steps out
function land() {
  const p = MAP.places.find((q) => q.x === P.x && q.y === P.y);
  const t = tileAt(P.x, P.y);
  if (!p && !LANDABLE.has(t)) { sfx('hurt'); return; }
  flying = false; S.ship = { ...S.ship, world: MAP.world, x: P.x, y: P.y, on: false };
  music(MAP.music);
  // step off beside the ship
  for (const d of ['down', 'left', 'right', 'up']) { const [dx, dy] = DIRS[d]; if (walkable(P.x + dx, P.y + dy) && !p) { P.x += dx; P.y += dy; P.trail = Array.from({ length: 8 }, () => [P.x, P.y, d]); return; } }
  if (p) { S.ship.x = P.x; S.ship.y = P.y + 1 < MAP.h ? P.y : P.y; enterPlace(p); }
}

// ---------------------------------------------------------------- the party wiped out
async function wipe() {
  scene = null; music('sad');
  await say(T('全隊倒下了……', 'The party has fallen…'));
  mode = 'over'; overT = 0;
}
let overT = 0;
function drawOver() { g.fillStyle = '#000'; g.fillRect(0, 0, VW * SC, VH * SC); text('GAME OVER', 128, 100, { align: 'center', size: 16 * SC, color: '#ff6a6a' }); if (overT > 1.5 && Math.floor(ftime * 2) % 2) text(T('按確定鍵回到標題', 'Press OK for the title'), 128, 150, { align: 'center', size: 7 * SC, color: '#aaa' }); }

// ---------------------------------------------------------------- chapter cards and the ending
let cardT = 0, cardDone = null;
function chapterCard(n) { mode = 'card'; cardT = 0; return new Promise((r) => { cardDone = r; }); }
function drawCard() {
  const C = CHAPTERS[S.ch] || { title: ['', ''], act: ['', ''] }; g.fillStyle = '#000'; g.fillRect(0, 0, VW * SC, VH * SC);
  const a = Math.min(1, cardT / 0.8); g.globalAlpha = a;
  text(T(C.act || ['', '']), 128, 70, { align: 'center', size: 8 * SC, color: '#a89ac8' });
  text(T(C.no || ['', '']), 128, 92, { align: 'center', size: 10 * SC, color: '#ffe080' });
  text(T(C.title), 128, 114, { align: 'center', size: 13 * SC });
  if (C.part) text(T(C.part), 128, 136, { align: 'center', size: 8 * SC, color: '#c8d8f0' });
  if (cardT > 1.5 && Math.floor(ftime * 2) % 2) text(T('按確定鍵', 'Press OK'), 128, 180, { align: 'center', size: 7 * SC, color: '#aaa' });
  g.globalAlpha = 1;
}
let endT = 0, endLines = [];
async function ending() { endLines = endingLines(A); music('ending'); mode = 'ending'; endT = 0; S.cleared = true; save(); throw ABORT; }
function drawEnding() {
  g.fillStyle = '#000'; g.fillRect(0, 0, VW * SC, VH * SC);
  let y = 250 - endT * 13;
  for (const l of endLines) { const s = T(l); for (const w of UI.wrap(s, 220)) { if (y > -20 && y < 260) text(w, 128, y, { align: 'center', color: s.startsWith('──') ? '#ffe080' : '#fff', size: 7 * SC }); y += 12; } y += 14; }
  if (y < 0) { text(T('灰燼詠嘆調', 'ASH ARIA'), 128, 96, { align: 'center', size: 16 * SC, color: '#ffe080' }); text(T('── 完 ──', '── THE END ──'), 128, 130, { align: 'center', size: 9 * SC }); if (Math.floor(ftime * 2) % 2) text(T('按確定鍵回到標題', 'Press OK for the title'), 128, 170, { align: 'center', size: 7 * SC, color: '#aaa' }); }
}

// ---------------------------------------------------------------- the title
function titleMenu() {
  mode = 'title'; scene = null; UI.stack.length = 0; music('aria'); flying = false;
  const has = !!load();
  (async () => {
    const opts = [...(has ? [T('繼續', 'Continue')] : []), T('新的遊戲', 'New Game'), EN ? '中文' : 'English', T('音樂：', 'Music: ') + (isMuted() ? T('關', 'off') : T('開', 'on')), ...(HDR ? [hdLabel()] : [])];
    const i = await menu(opts, { x: 88, y: 150, cancel: false });
    const k = has ? i : i + 1;
    if (k === 0) { S = load(); const sp = S.savePoint || { map: S.map, x: S.x, y: S.y, dir: S.dir }; mode = 'field'; flying = false; if (!sp.map || !MAPS[sp.map]) { runScript(opening); return; } enterMap(sp.map, sp.x, sp.y, sp.dir || 'down'); return; }
    if (k === 1) {
      if (has && await ask(T('要開始新的遊戲嗎？原本的記錄會被覆蓋。', 'Start a new game? Your save will be overwritten.'), [T('開始', 'Start'), T('取消', 'Cancel')]) !== 0) return titleMenu();
      S = { v: 1, ch: 0, flags: {}, members: {}, roster: [], party: [], gil: 0, bag: {}, steps: 20, world: 'b', tools: [], astrals: {}, lores: [], dances: [], sketches: [], playTime: 0 };
      mode = 'field';
      runScript(opening);
      return;
    }
    if (k === 2) return setLang(EN ? 'zh' : 'en');
    if (k === 4) { setHD(!hdPref); return titleMenu(); }
    toggleMute(); titleMenu();
  })();
}

// ---------------------------------------------------------------- drawing
const T16 = 16 * SC;
const PLACE_TILES = ['castle', 'town', 'village', 'cave', 'tower', 'shrine', 'darkcastle'];
function visTile(x, y) {
  let tn = tileAt(x, y);
  if (tn === null) { if (MAP.world) tn = 'sea'; else if (MAP.dungeon || MAP.set) return null; else tn = MAP.tiles[0][0] === 'j' ? 'deadtree' : MAP.tiles[0][0] === '#' ? 'wall' : 'tree'; }
  const b = barrierAt(x, y); if (b) tn = b.tile;
  if (PLACE_TILES.includes(tn) && !MAP.world) tn = 'floor';
  if (tn === 'miasma' && MAP.world && S.flags.spire_open) tn = 'ash';
  return tn;
}
const camPos = () => [P.moving ? P.moving.fx + (P.x - P.moving.fx) * P.moving.t : P.x, P.moving ? P.moving.fy + (P.y - P.moving.fy) * P.moving.t : P.y];
function fieldSprites(camX, camY) {
  const out = [];
  for (const c of MAP.chests || []) { if (c.when && !c.when(A)) continue; out.push({ x: c.x, y: c.y, chest: !!S.flags['chest_' + c.id] }); }
  for (const n of npcsHere()) {
    let st = npcState.get(n); if (!st) { st = { x: n.x, y: n.y, dir: n.dir || 'down', hx: n.x, hy: n.y, t: Math.random() * 3 }; npcState.set(n, st); }
    if (n.move && !running && !UI.busy()) { st.t -= 1 / 60; if (st.t <= 0) { st.t = 1.5 + Math.random() * 3; const ds = Object.keys(DIRS), d = ds[Math.floor(Math.random() * 4)], [dx, dy] = DIRS[d], nx = st.x + dx, ny = st.y + dy; st.dir = d; if (Math.abs(nx - st.hx) <= 2 && Math.abs(ny - st.hy) <= 2 && tileAt(nx, ny) && WALK.has(tileAt(nx, ny)) && !(nx === P.x && ny === P.y) && !npcAt(nx, ny) && !chestAt(nx, ny)) { st.x = nx; st.y = ny; } } }
    if (n.mon) { const md = MONSTERS[n.mon]; out.push({ x: st.x, y: st.y, img: monsterImg(md), size: 1.6 * (md.size > 1.4 ? 1.3 : 1), mon: true }); }
    else out.push({ x: st.x, y: st.y, img: person(n.look, st.dir, Math.floor(ftime * 2 + n.x) % 2) });
  }
  if (S.ship && MAP.world && S.ship.world === MAP.world && !flying) out.push({ x: S.ship.x, y: S.ship.y, img: shipSprite(Math.floor(ftime * 4) % 2), size: 1.5, lift: 0.3 });
  if (flying) { out.push({ x: camX, y: camY, img: shipSprite(Math.floor(ftime * 6) % 2), size: 1.6, lift: 0.9 }); return out; }
  const ids = S.party.filter((id) => S.members[id] && S.members[id].hp > 0), followers = Math.min(ids.length - 1, 3);
  const pos = (k) => { if (k === 0) return [camX, camY, P.dir]; const to = P.trail[k - 1]; if (!to) return null; const from = P.trail[k] || to, t = P.moving ? P.moving.t : 1; return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, from === to ? to[2] : from[2]]; };
  for (let k = followers; k >= 0; k--) { const q = pos(k); if (!q) continue; const [x, y, d] = q; out.push({ x, y: y - 0.01 * k, img: person(CHARS[ids[k] || ids[0] || 'aria'].look, k === 0 ? P.dir : d, P.moving ? P.frame : 0) }); }
  return out;
}
import { monster as monsterArt } from './art.js?v=4';
const monsterImg = (md) => monsterArt(md.art, md.col);
function hdMap() {
  const kind = MAP.world ? 'world' : MAP.town ? 'town' : ['cave', 'tower', 'dark', 'shrine', 'castle'].includes(MAP.theme) ? MAP.theme : 'town';
  const key = mapId + '|' + JSON.stringify((S.mapEdits || {})[mapId] || 0) + (MAP.world ? '|' + BARRIERS.map((b) => +!!S.flags[b.flag]).join('') + (S.flags.spire_open ? 1 : 0) : '');
  return { key, w: MAP.w, h: MAP.h, theme: MAP.theme || 'town', kind, look: MAP.look, at: visTile, margin: MAP.world ? 9 : MAP.dungeon || MAP.set ? 1 : 8, dungeon: !!(MAP.dungeon || MAP.set) && MAP.theme !== 'ship', town: !!MAP.town };
}
function drawField(dt) {
  const [camX, camY] = camPos();
  if (hdOn()) hdRender({ t: ftime, camX, camY, sprites: fieldSprites(camX, camY), map: hdMap(), battle: !!(scene && scene.battle) });
  else {
    const ox = VW / 2 - 8 - camX * 16, oy = VH / 2 - 8 - camY * 16, frame = Math.floor(ftime * 2) % 2, theme = MAP.theme || 'town';
    g.fillStyle = MAP.world ? '#2a5ac8' : '#000'; g.fillRect(0, 0, VW * SC, VH * SC);
    const x0 = Math.floor(-ox / 16) - 1, y0 = Math.floor(-oy / 16) - 1;
    for (let y = y0; y < y0 + 17; y++) for (let x = x0; x < x0 + 18; x++) { const tn = visTile(x, y); if (tn === null) continue; g.drawImage(tile(tn, theme, frame), Math.round((ox + x * 16) * SC), Math.round((oy + y * 16) * SC), T16, T16); }
    for (const sp of fieldSprites(camX, camY).sort((a, b) => a.y - b.y)) {
      const X = (ox + sp.x * 16) * SC, Y = (oy + sp.y * 16) * SC;
      if (sp.chest !== undefined) { g.fillStyle = '#5a3a1a'; g.fillRect(X + 2 * SC, Y + 5 * SC, 12 * SC, 9 * SC); g.fillStyle = sp.chest ? '#2a1a0a' : '#c8782a'; g.fillRect(X + 3 * SC, Y + 6 * SC, 10 * SC, sp.chest ? 3 * SC : 7 * SC); }
      else { const s = sp.size || 1; g.drawImage(sp.img, X + (8 - 8 * s) * SC, Y - (2 + (sp.lift || 0) * 10 + 16 * (s - 1)) * SC, T16 * s, T16 * s * (sp.img.height / sp.img.width)); }
    }
  }
  if (MAP.rain || (mapId === 'rainhold')) for (let i = 0; i < 80; i++) { const x = (i * 97 + ftime * 300) % 256, y = (i * 53 + ftime * 500) % 240; g.fillStyle = 'rgba(180,200,255,0.45)'; g.fillRect(x * SC, y * SC, SC, 5 * SC); }
  if (MAP.world) { const p = MAP.places.find((q) => Math.abs(q.x - P.x) + Math.abs(q.y - P.y) <= 1); if (p) { box(8, 8, Math.max(72, UI.measure(T(p.name)) + 24), 24); text(T(p.name), 18, 14); } if (flying) { box(8, 214, 240, 22); text(T('確定鍵：降落 · 方向鍵：飛行', 'OK: land · arrows: fly'), 16, 220, { size: 7 * SC }); } }
  else if (MAP.name && ftime - enteredAt < 2.2) { box(8, 8, Math.max(80, UI.measure(T(MAP.name)) + 24), 24); text(T(MAP.name) + (MAP.floor ? ` ${MAP.floor}F` : ''), 18, 14); }
}
let enteredAt = 0;
function drawTitle() {
  const W = VW * SC, H = VH * SC, hd = hdOn();
  if (hd) {
    const TM = MAPS.frostvale, at = (x, y) => { const r = TM.tiles[y], t = r && x >= 0 && x < TM.w ? TILE[r[x]] : 'tree'; return PLACE_TILES.includes(t) ? 'floor' : t || 'tree'; };
    const crew = ['aria', 'rowan', 'edmund', 'sai', 'kiriyu', 'galan', 'selene', 'regis', 'nightcrow', 'lili', 'bolo', 'moka', 'uma', 'kagami'];
    const cx = 12, cy = 12, sprites = crew.map((id, i) => ({ x: cx - 7 + i, y: cy + (i % 2) * 0.2, img: person(CHARS[id].look, 'down', Math.floor(ftime * 2 + i) % 2) }));
    g.clearRect(0, 0, W, H);
    hdRender({ t: ftime, camX: cx + Math.sin(ftime * 0.12) * 0.8, camY: cy - 0.6, sprites, title: true, map: { key: 'title', w: TM.w, h: TM.h, theme: 'snow', kind: 'town', look: 'snow', at, margin: 8, town: true } });
    let gr = g.createLinearGradient(0, 0, 0, H * 0.45); gr.addColorStop(0, 'rgba(10,8,24,0.9)'); gr.addColorStop(1, 'rgba(10,8,24,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H * 0.45);
    gr = g.createLinearGradient(0, H * 0.6, 0, H); gr.addColorStop(0, 'rgba(10,8,24,0)'); gr.addColorStop(1, 'rgba(10,8,24,0.85)'); g.fillStyle = gr; g.fillRect(0, H * 0.6, W, H * 0.4);
  } else {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0a0818'); gr.addColorStop(1, '#4a1a2a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 80; i++) { const x = (i * 97 + ftime * 8) % VW, y = (i * 53 + ftime * 14) % 240; g.fillStyle = `rgba(255,${180 + (i % 4) * 15},120,${0.25 + 0.5 * Math.abs(Math.sin(ftime + i))})`; g.fillRect(x * SC, y * SC, SC, SC); }
  }
  g.save(); g.shadowColor = 'rgba(255,120,60,0.8)'; g.shadowBlur = 20; text(T('灰燼詠嘆調', 'ASH ARIA'), 128, 40, { align: 'center', size: 24 * SC, color: '#ffe0b0' }); g.restore();
  text(T('ASH ARIA', '灰燼詠嘆調'), 128, 76, { align: 'center', size: 9 * SC, color: '#ffffff' });
  if (!hd) ['aria', 'rowan', 'edmund', 'sai', 'kiriyu', 'galan', 'selene', 'regis', 'nightcrow', 'lili', 'bolo', 'moka', 'uma', 'kagami'].forEach((id, i) => g.drawImage(person(CHARS[id].look, 'down', Math.floor(ftime * 2 + i) % 2), (16 + i * 16) * SC, 112 * SC, T16, T16));
  text('© ' + T('像素遊樂場', 'Pixel Playground'), 128, 228, { align: 'center', size: 6 * SC, color: '#999' });
}

// ---------------------------------------------------------------- the loop
let last = performance.now(), lastRaf = performance.now(), idleSave = 0;
const rafLoop = () => { lastRaf = performance.now(); frame(); requestAnimationFrame(rafLoop); };
setInterval(() => { if (performance.now() - lastRaf > 150) frame(); }, 33);
function frame() {
  const now = performance.now(), dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ftime += dt;
  if (S && mode === 'field') S.playTime = (S.playTime || 0) + dt;
  const waiters = frameWaiters; frameWaiters = []; for (const w of waiters) w(dt);
  if (hdOn() && (mode === 'field' || mode === 'title') && document.visibilityState === 'visible') { slowT = dt > 0.04 ? slowT + dt : Math.max(0, slowT - dt); if (slowT > 2 && hdScale > 0.5) { hdScale *= 0.8; slowT = 0; fitScreen(); } }
  g.imageSmoothingEnabled = false;
  if (hdOn() && mode === 'field') g.clearRect(0, 0, VW * SC, VH * SC);
  shakeT = Math.max(0, shakeT - dt);
  g.save(); if (shakeT > 0) g.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8);
  if (mode === 'title') drawTitle();
  else if (mode === 'card') { cardT += dt; drawCard(); }
  else if (mode === 'ending') { endT += dt; drawEnding(); }
  else if (mode === 'over') { overT += dt; drawOver(); }
  else if (mode === 'field' && MAP) {
    if (P.moving) { P.moving.t += dt / speed(); if (P.moving.t >= 1) { P.moving = null; if (!running) arrived(); } }
    if (!P.moving && !running && !UI.busy() && !(scene && scene.battle)) { const d = heldDir(); if (d) tryMove(d); }
    if (!(scene && scene.battle) || hdOn()) drawField(dt);
    if (scene) scene.draw(g, dt);
  } else if (mode === 'field') { g.fillStyle = '#000'; g.fillRect(0, 0, VW * SC, VH * SC); }
  g.restore();
  if (fade > 0) { g.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; g.fillRect(0, 0, VW * SC, VH * SC); fade -= dt * 1.6; }
  UI.tickUI(dt); UI.drawUI();
}

// ---------------------------------------------------------------- input
const held = new Set(), order = [];
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
  z: 'ok', Z: 'ok', Enter: 'ok', ' ': 'ok', x: 'back', X: 'back', Escape: 'back', Backspace: 'back', m: 'mute', M: 'mute' };
function heldDir() { for (let i = order.length - 1; i >= 0; i--) if (held.has(order[i])) return order[i]; return null; }
function press(k) {
  unlock();
  if (k === 'mute') { toggleMute(); return; }
  if (UI.busy()) { UI.key(k); return; }
  if (mode === 'card' && k === 'ok' && cardT > 0.8) { mode = 'field'; if (cardDone) { const d = cardDone; cardDone = null; d(); } return; }
  if (mode === 'ending' && k === 'ok' && endT > 30) { titleMenu(); return; }
  if (mode === 'over' && k === 'ok' && overT > 1.5) { titleMenu(); return; }
  if (mode !== 'field' || running || P.moving || scene) return;
  if (k === 'ok') { if (flying) land(); else check(); } else if (k === 'back') runScript(fieldMenu);
}
addEventListener('keydown', (e) => { const k = KEYMAP[e.key]; if (!k) return; e.preventDefault(); if (['up', 'down', 'left', 'right'].includes(k)) { if (!held.has(k)) { held.add(k); order.push(k); if (UI.busy()) UI.key(k); } } else if (!e.repeat) press(k); });
addEventListener('keyup', (e) => { const k = KEYMAP[e.key]; if (k) { held.delete(k); const i = order.indexOf(k); if (i >= 0) order.splice(i, 1); } });
for (const b of document.querySelectorAll('[data-k]')) {
  const k = b.dataset.k, dir = ['up', 'down', 'left', 'right'].includes(k);
  const on = (e) => { e.preventDefault(); unlock(); if (dir) { held.add(k); order.push(k); if (UI.busy()) UI.key(k); } else press(k); b.classList.add('on'); };
  const off = (e) => { e.preventDefault(); if (dir) { held.delete(k); const i = order.indexOf(k); if (i >= 0) order.splice(i, 1); } b.classList.remove('on'); };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
}
let rep = 0; setInterval(() => { const d = heldDir(); if (d && UI.busy()) { rep++; if (rep > 4) UI.key(d); } else rep = 0; }, 90);

titleMenu();
requestAnimationFrame(rafLoop);
window.__aa = { get S() { return S; }, set S(v) { S = v; }, A, G, MAPS, enterMap, press, get mode() { return mode; }, set mode(v) { mode = v; }, get map() { return mapId; }, get P() { return P; }, save, get running() { return running; }, get busy() { return UI.busy(); }, runScript, clearUI: () => { UI.stack.length = 0; }, setHD, get flying() { return flying; }, set flying(v) { flying = v; } };
