// ASH ARIA — party members: levels, stats, equipment, Astrals and the spells they teach. No DOM.
import { CHARS, GEAR, SPELLS, ASTRALS, canEquip } from './data.js?v=2';

export const MAX_LV = 70;
export const expFor = (lv) => (lv <= 1 ? 0 : Math.round(6 * Math.pow(lv - 1, 2.55) + 20 * (lv - 1)));
const START_EQ = {
  aria: { weapon: 'broadsword', armor: 'leatherarmor', helm: 'hairband' }, rowan: { weapon: 'dirk', armor: 'leatherarmor', helm: 'bandana' },
  edmund: { weapon: 'javelin', shield: 'buckler', armor: 'leatherarmor' }, sai: { weapon: 'metalknuckle', armor: 'kungfu' },
  kiriyu: { weapon: 'ashura', armor: 'ironarmor', helm: 'ironhelm' }, galan: { armor: 'leatherarmor' }, selene: { weapon: 'mithrilblade', armor: 'ironarmor', shield: 'heavyshield' },
  regis: { weapon: 'cards', armor: 'silkrobe', helm: 'plumedhat' }, nightcrow: { weapon: 'kunai', armor: 'ninjagear' }, lili: { weapon: 'brush', armor: 'silkrobe', helm: 'magushat' },
  bolo: { weapon: 'rod', armor: 'silkrobe', helm: 'magushat' }, moka: { weapon: 'mithrilpike', armor: 'kungfu' }, uma: {}, kagami: { armor: 'whiterobe' },
  leopold: { weapon: 'regal', armor: 'mithrilmail', shield: 'goldshield', helm: 'mithrilhelm' },
};
export function newMember(id, lv = 1) {
  const c = CHARS[id];
  const m = { id, lv: 1, xp: 0, hp: 1, mp: 0, eq: { weapon: null, shield: null, helm: null, armor: null, relic1: null, relic2: null, ...(START_EQ[id] || {}) }, spells: [], learn: {}, astral: null, bonus: { str: 0, mag: 0, spd: 0, vit: 0, hp: 0, mp: 0 }, ferals: [] };
  learnByLevel(m);
  levelTo(m, lv);
  m.hp = maxhp(m); m.mp = maxmp(m);
  return m;
}
function learnByLevel(m) { for (const [l, s] of Object.entries(CHARS[m.id].spells || {})) if (+l <= m.lv && !m.spells.includes(s)) m.spells.push(s); }
// level ups: the equipped Astral's bonus is added at each new level
export function levelTo(m, lv) {
  const ups = [];
  while (m.lv < Math.min(lv, MAX_LV)) {
    m.lv++; const b = m.astral && ASTRALS[m.astral] ? ASTRALS[m.astral].bonus : {}, c = CHARS[m.id];
    for (const s of ['str', 'mag', 'spd', 'vit']) if (b[s]) m.bonus[s] += b[s];
    if (b.hp) m.bonus.hp += Math.round(c.hpg * b.hp * 3); if (b.mp) m.bonus.mp += Math.max(1, Math.round(c.mpg * b.mp * 3));
    const before = m.spells.length; learnByLevel(m); ups.push({ lv: m.lv, spells: m.spells.slice(before) });
  }
  if (m.xp < expFor(m.lv)) m.xp = expFor(m.lv);
  return ups;
}
export function gainXp(m, n) {
  m.xp += n * (hasFx(m, 'doublexp') ? 2 : 1); const ups = [];
  while (m.lv < MAX_LV && m.xp >= expFor(m.lv + 1)) { const oh = maxhp(m), om = maxmp(m); ups.push(...levelTo(m, m.lv + 1)); if (m.hp > 0) { m.hp += maxhp(m) - oh; m.mp += maxmp(m) - om; } }
  return ups;
}
// AP from a battle: the equipped Astral teaches its spells; returns the spells learned
export function gainAp(m, ap) {
  const out = []; const A = m.astral && ASTRALS[m.astral]; if (!A || !ap) return out;
  for (const [s, rate] of Object.entries(A.teach)) {
    if (m.spells.includes(s) || !rate) continue;
    m.learn[s] = Math.min(100, (m.learn[s] || 0) + rate * ap);
    if (m.learn[s] >= 100) { m.spells.push(s); delete m.learn[s]; out.push(s); }
  }
  return out;
}

// ---------------------------------------------------------------- stats
const gear = (m) => Object.values(m.eq).filter(Boolean).map((k) => GEAR[k]).filter(Boolean);
export const hasFx = (m, fx) => gear(m).some((g) => g.fx === fx);
const gst = (m, k) => gear(m).reduce((s, g) => s + ((g.st && g.st[k]) || 0), 0);
export const str = (m) => Math.min(128, CHARS[m.id].base.str + Math.floor(m.lv * 0.36) + m.bonus.str + gst(m, 'st'));
export const mag = (m) => Math.min(128, CHARS[m.id].base.mag + Math.floor(m.lv * 0.36) + m.bonus.mag + gst(m, 'ma'));
export const spd = (m) => Math.min(128, CHARS[m.id].base.spd + Math.floor(m.lv * 0.16) + m.bonus.spd + gst(m, 'sp'));
export const vit = (m) => Math.min(128, CHARS[m.id].base.vit + Math.floor(m.lv * 0.3) + m.bonus.vit + gst(m, 'vi'));
export function maxhp(m) { const c = CHARS[m.id], l = m.lv - 1; return Math.min(9999, Math.round((c.base.hp + l * c.hpg + Math.floor(l * l * 0.8) + m.bonus.hp) * (hasFx(m, 'hp') ? 1.25 : 1))); }
export function maxmp(m) { const c = CHARS[m.id], l = m.lv - 1; if (!c.base.mp) return 0; return Math.min(999, Math.round((c.base.mp + l * c.mpg + Math.floor(l * l * 0.04) + m.bonus.mp) * (hasFx(m, 'mp30') ? 1.3 : 1))); }
// attack: the weapon plus strength (no weapon: strength alone, fists for Galan and Uma grow with level)
export function atk(m) {
  const w = m.eq.weapon && GEAR[m.eq.weapon];
  const bare = m.id === 'galan' || m.id === 'uma' || m.id === 'kagami' ? 10 + m.lv * 2.2 : 4;
  return Math.round((w ? w.power : bare) + str(m));
}
export const defense = (m) => Math.min(220, gear(m).reduce((s, g) => s + (g.def || 0), 0) + Math.floor(vit(m) / 3));
export const mdefense = (m) => Math.min(220, gear(m).reduce((s, g) => s + (g.mdef || 0), 0) + Math.floor(mag(m) / 4));
export const resists = (m) => [...new Set(gear(m).flatMap((g) => g.res || []))];
export const weaponEl = (m) => { const w = m.eq.weapon && GEAR[m.eq.weapon]; return (w && w.el) || null; };
export const alive = (m) => m.hp > 0;
export function healFull(m) { m.hp = maxhp(m); m.mp = maxmp(m); m.st = {}; }
export function clampHp(m) { m.hp = Math.min(m.hp, maxhp(m)); m.mp = Math.min(m.mp, maxmp(m)); }

// ---------------------------------------------------------------- the bag
export const bagAdd = (bag, k, n = 1) => { bag[k] = (bag[k] || 0) + n; };
export const bagTake = (bag, k, n = 1) => { if ((bag[k] || 0) < n) return false; bag[k] -= n; if (!bag[k]) delete bag[k]; return true; };
// put a piece on (it must be in the bag); the old one goes back
export function equip(m, slot, k, bag) {
  if (k && (!bag[k] || !canEquip(m.id, k))) return false;
  const old = m.eq[slot]; if (old) bagAdd(bag, old);
  if (k) bagTake(bag, k);
  m.eq[slot] = k || null; clampHp(m); return true;
}
// best gear from the bag for each slot (by power / defence), used by "Optimum"
export function optimum(m, bag) {
  for (const [slot] of [['weapon'], ['shield'], ['helm'], ['armor']]) {
    const score = (k) => (k ? (GEAR[k].power || 0) * 2 + (GEAR[k].def || 0) + (GEAR[k].mdef || 0) : -1);
    const cands = Object.keys(bag).filter((k) => GEAR[k] && GEAR[k].slot === slot && canEquip(m.id, k));
    const best = cands.sort((a, b) => score(b) - score(a))[0];
    if (best && score(best) > score(m.eq[slot])) equip(m, slot, best, bag);
  }
}
export const spellOk = (s) => !!SPELLS[s];
