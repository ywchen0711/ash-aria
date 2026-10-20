// ASH ARIA — battles with the Active Time Battle gauge. No DOM: the battle screen (battleview.js) and the node tests drive it.
//
// Everyone's ATB gauge fills with speed (haste ×1.5, slow ×0.5). A full party gauge waits for a command; a full monster gauge
// acts at once. In "wait" mode time stops while a menu is open. Actions return events for the screen to play.
import { SPELLS, ITEMS, GEAR, ASTRALS, BLITZ, IAI, TOOLS, FORTUNE, DANCES, LORES, CHARS, STATUS, BAD, MAGITEK } from './data.js?v=4';
import { MONSTERS, MSKILLS } from './monsters.js?v=4';
import { atk, defense, mdefense, mag, str, spd, maxhp, maxmp, resists, weaponEl, hasFx, bagTake, bagAdd } from './party.js?v=4';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const alive = (u) => u.hp > 0;
export const ATB_RATE = 0.62;
const DUR = { sleep: 15, stop: 9, slow: 30, haste: 40, protect: 45, shell: 45, regen: 40, astral: 26, rally: 30, defend: 99 };

// ---------------------------------------------------------------- the fighters
function partyUnit(m, i) {
  const u = { side: 0, m, id: m.id, slot: i, lv: m.lv, st: {}, atb: 0, row: m.row || CHARS[m.id].row || 'front', summoned: false, astralized: false, ferals: m.ferals || [] };
  Object.defineProperty(u, 'hp', { get: () => m.hp, set: (v) => { m.hp = clamp(Math.round(v), 0, u.maxhp); } });
  Object.defineProperty(u, 'mp', { get: () => m.mp, set: (v) => { m.mp = clamp(Math.round(v), 0, u.maxmp); } });
  refreshUnit(u);
  if (hasFx(m, 'haste')) u.st.haste = DUR.haste;
  return u;
}
export function refreshUnit(u) {
  const m = u.m; Object.assign(u, { maxhp: maxhp(m), maxmp: maxmp(m), atk: atk(m), def: defense(m), mdef: mdefense(m), mag: mag(m), str: str(m), spd: spd(m), el: weaponEl(m), res: resists(m) });
}
function monUnit(id, i, opts = {}) {
  const d = MONSTERS[id], lvUp = opts.lvUp || 0, k = lvUp ? Math.pow((d.lv + lvUp) / d.lv, 1.6) : 1;
  return { side: 1, mon: d, id, slot: i, name: d.name, lv: d.lv + lvUp, hp: Math.round(d.hp * k), maxhp: Math.round(d.hp * k), mp: d.mp, maxmp: d.mp, atk: Math.round(d.atk * Math.sqrt(k)), def: d.def, mdef: d.mdef,
    mag: Math.round(d.mag * Math.sqrt(k)), str: 0, spd: d.spd, st: {}, atb: 0, weak: [...d.weak], absorb: d.absorb, immune: d.immune, stolen: false, boss: d.boss, undead: d.undead, row: 'front' };
}
export function createBattle(members, foes, opts = {}) {
  const rng = opts.rng || Math.random;
  const party = members.map((m, i) => partyUnit(m, i));
  const mons = foes.map((f, i) => monUnit(typeof f === 'string' ? f : f.id, i, { lvUp: opts.lvUp || (f && f.lvUp) || 0 }));
  // name the twins: Frost Bat A, Frost Bat B
  const by = {}; for (const u of mons) (by[u.id] = by[u.id] || []).push(u);
  for (const list of Object.values(by)) list.forEach((u, i) => { u.tag = list.length > 1 ? 'ABCDEFGH'[i] : ''; });
  const B = { party, mons, t: 0, over: null, rng, opts, bag: opts.bag || {}, loot: [], gilBonus: 0, runic: null, lastParty: null, seenLores: new Set(), sketches: new Set(),
    learnedFerals: [], dances: opts.dances || [], bg: opts.bg || 'field', boss: mons.some((u) => u.boss), ready: [], turns: 0, preempt: false, back: false };
  // a first strike now and then; an ambush puts the party on the back foot
  const roll = rng();
  for (const u of party) u.atb = opts.boss ? 30 + rng() * 40 : roll < 0.08 ? 100 : 20 + rng() * 60;
  for (const u of mons) u.atb = roll < 0.08 || opts.boss ? rng() * 30 : roll > 0.94 ? 90 : rng() * 50;
  B.preempt = roll < 0.08 && !opts.boss;
  return B;
}
export const units = (B) => [...B.party, ...B.mons];
export const foesOf = (B, u) => (u.side === 0 ? B.mons : B.party).filter(alive);
export const friendsOf = (B, u) => (u.side === 0 ? B.party : B.mons).filter(alive);
export const unitName = (u, en) => (u.side === 0 ? CHARS[u.id].name[en ? 1 : 0] : u.name[en ? 1 : 0] + (u.tag || ''));

// ---------------------------------------------------------------- time
const canAct = (u) => alive(u) && !u.st.sleep && !u.st.stop && !u.charge;
// advance the clock; returns { ready: party units whose gauge just filled, foes: monsters ready to act, due: charged actions, ev: poison / regen }
export function tick(B, dt) {
  const out = { ready: [], foes: [], due: [], ev: [] }; if (B.over) return out;
  B.t += dt;
  for (const u of units(B)) {
    if (!alive(u)) { u.atb = 0; continue; }
    // statuses wear off
    for (const k of Object.keys(u.st)) { if (typeof u.st[k] === 'number' && k !== 'blind' && k !== 'silence' && k !== 'poison') { u.st[k] -= dt; if (u.st[k] <= 0) { delete u.st[k]; if (k === 'astral') out.ev.push({ kind: 'msg', u, text: ['幻化解除了', 'Astral form fades'] }); } } }
    // poison and regeneration every few seconds
    u.dot = (u.dot || 0) + dt;
    if (u.dot >= 4) {
      u.dot = 0;
      if (u.st.poison) { const n = Math.max(1, Math.round(u.maxhp * (u.boss ? 0.02 : 0.06))); u.hp = Math.max(1, u.hp - n); out.ev.push({ kind: 'dmg', t: u, n, poison: true }); }
      if (u.st.regen || u.st.astral) { const n = Math.max(1, Math.round(u.maxhp * 0.05)); u.hp += n; out.ev.push({ kind: 'heal', t: u, n }); }
    }
    // a charging iai cuts when ready
    if (u.charge) { u.charge.t -= dt * (u.st.haste ? 1.5 : u.st.slow ? 0.5 : 1); if (u.charge.t <= 0) { out.due.push({ u, action: u.charge.action }); u.charge = null; } continue; }
    if (!canAct(u) || u.atb >= 100) continue;
    const mul = u.st.haste ? 1.5 : u.st.slow ? 0.5 : 1;
    u.atb = Math.min(100, u.atb + (u.spd + 20) * ATB_RATE * mul * dt);
    if (u.atb >= 100) (u.side === 0 ? out.ready : out.foes).push(u);
  }
  return out;
}

// ---------------------------------------------------------------- damage
const variance = (B) => 0.9 + B.rng() * 0.2;
const astral = (u) => (u.st.astral ? 1 : 0);
// physical: attack × level curve, defence takes a share, back row halves, protect cuts a third
function physical(B, a, t, power = 1, o = {}) {
  if (!o.sure && t.st && !t.st.sleep && !t.st.stop) {
    const evade = clamp(0.04 + (t.spd - a.spd) / 220, 0.01, 0.2) + (a.st.blind ? 0.45 : 0);
    if (B.rng() < evade) return { miss: true };
  }
  let n = a.atk * (0.55 + a.lv / 14) * power * variance(B);
  if (a.side === 0 && a.m && hasFx(a.m, 'hpblade')) n *= 0.5 + a.hp / a.maxhp;
  if (a.side === 0 && a.m && hasFx(a.m, 'both')) n *= 1.2;
  if (a.st.astral) n *= 1.5; if (a.st.rally) n *= 1.25;
  if (!o.pierce) n *= (255 - t.def) / 256;
  if (a.row === 'back' && !o.ranged) n *= 0.5; if (t.row === 'back' && !o.ranged) n *= 0.5;
  if (t.st.protect) n *= 0.66; if (t.st.defend) n *= 0.5;
  if (t.st.sleep) n *= 1.25;
  let crit = false; if (!o.nocrit && B.rng() < 1 / 32) { crit = true; n *= 2; }
  return elemental({ n, crit }, t, o.el || null);
}
function magical(B, a, t, power, o = {}) {
  let n = power * ((a.side === 0 ? (o.stat === 'str' ? a.str : a.mag) : a.mag) / 7 + a.lv / 2 + 4) * variance(B);
  if (a.st.astral) n *= 2;
  if (a.side === 0 && a.m && hasFx(a.m, 'magboost')) n *= 1.25; if (a.side === 0 && a.m && hasFx(a.m, 'both')) n *= 1.2;
  if (!o.pierce) n *= (255 - t.mdef) / 256;
  if (t.st.shell) n *= 0.66;
  if (o.split) n *= 0.5;
  return elemental({ n }, t, o.el || null);
}
function elemental(r, t, el) {
  if (el) {
    const absorb = t.side === 1 ? t.absorb.includes(el) : false, immune = t.side === 1 ? t.immune.includes(el) : false;
    const weak = t.side === 1 ? t.weak.includes(el) : false, res = t.side === 0 && t.res.includes(el);
    if (absorb) { r.absorb = true; } else if (immune) { r.n = 0; r.immune = true; } else if (weak) { r.n *= 2; r.weak = true; } else if (res) r.n *= 0.5;
  }
  r.n = Math.min(9999, Math.max(r.immune ? 0 : 1, Math.round(r.n)));
  return r;
}
// apply a damage result to a target: absorbing heals; a hit wakes a sleeper
function hurt(B, t, r, ev, extra = {}) {
  if (r.miss) { ev.push({ kind: 'miss', t }); return 0; }
  if (r.absorb) { t.hp += r.n; ev.push({ kind: 'heal', t, n: r.n, absorb: true }); return 0; }
  t.hp -= r.n; delete t.st.sleep;
  ev.push({ kind: 'dmg', t, n: r.n, crit: r.crit, weak: r.weak, ...extra });
  if (!alive(t)) { t.st = {}; t.charge = null; ev.push({ kind: 'down', t }); }
  return r.n;
}
function heal(B, a, t, power, ev, o = {}) {
  if (!alive(t) && !o.revive) return;
  if (t.undead && t.side === 1) { hurt(B, t, { n: Math.round(power * (a.mag / 7 + a.lv / 2 + 4)) }, ev); return; }
  const n = power >= 99 ? t.maxhp : Math.round(power * ((o.stat === 'str' ? a.str : a.mag) / 7 + a.lv / 2 + 4) * (a.st.astral ? 1.5 : 1) * (0.95 + B.rng() * 0.1) * (o.split ? 0.6 : 1));
  const got = Math.min(t.maxhp - t.hp, n); t.hp += got; ev.push({ kind: 'heal', t, n: got });
}
// a status sticks by chance: a higher level resists, bosses shrug off the worst, a Ribbon blocks everything bad
function addStatus(B, a, t, st, chance, ev) {
  if (!alive(t)) return false;
  if (BAD.includes(st)) {
    if (t.side === 0 && t.m && (hasFx(t.m, 'guardall') || (st === 'poison' && hasFx(t.m, 'guardpoison')) || (st === 'silence' && hasFx(t.m, 'guardsilence')))) { ev.push({ kind: 'miss', t }); return false; }
    if (t.boss && ['sleep', 'stop', 'silence'].includes(st)) { ev.push({ kind: 'miss', t }); return false; }
    const p = clamp(chance * (1 - (t.lv - a.lv) / 70), 0.05, 0.95);
    if (B.rng() > p) { ev.push({ kind: 'miss', t }); return false; }
  }
  t.st[st] = DUR[st] || true;
  if (st === 'haste') delete t.st.slow; if (st === 'slow') delete t.st.haste;
  if (st === 'stop' || st === 'sleep') t.charge = null;
  ev.push({ kind: 'status', t, st });
  return true;
}
// instant death: never for bosses (or the guarded); undead are healed instead
function kill(B, a, t, chance, ev) {
  if (!alive(t)) return;
  if (t.boss || (t.side === 0 && t.m && hasFx(t.m, 'guarddoom'))) { ev.push({ kind: 'miss', t }); return; }
  if (B.rng() < clamp(chance * (1 - (t.lv - a.lv) / 60), 0.05, 0.95)) { const n = t.hp; t.hp = 0; t.st = {}; ev.push({ kind: 'dmg', t, n, death: true }); ev.push({ kind: 'down', t }); }
  else ev.push({ kind: 'miss', t });
}

// ---------------------------------------------------------------- a generic effect: spells, summons, blitzes, lores, dances, tools all come here
// fx: { kind, power, target, el, add, also, pierce, hits, stat }   targets: units already chosen
export function applyFx(B, a, fx, targets, ev, o = {}) {
  const many = targets.length > 1, split = many && fx.target === 'one';
  for (const t of targets) {
    switch (fx.kind) {
      case 'phys': hurt(B, t, physical(B, a, t, fx.power, { el: fx.el || (a.side === 0 ? a.el : null), pierce: fx.pierce, ranged: true }), ev); if (fx.add && alive(t)) addStatus(B, a, t, fx.add, 0.5, ev); break;
      case 'hits': for (let h = 0; h < (fx.hits || 1); h++) { const tt = many ? t : alive(t) ? t : foesOf(B, a)[0]; if (!tt) break; hurt(B, tt, physical(B, a, tt, fx.power, { el: fx.el || a.el, pierce: fx.pierce, ranged: true, sure: o.sure }), ev); } break;
      case 'dmg': { const r = magical(B, a, t, fx.power, { el: fx.el, pierce: fx.pierce, stat: o.stat, split }); hurt(B, t, r, ev); if (fx.add && alive(t)) addStatus(B, a, t, fx.add, 0.6, ev); break; }
      case 'drain': { const r = magical(B, a, t, fx.power, { stat: o.stat }); if (t.undead) { a.hp -= r.n; ev.push({ kind: 'dmg', t: a, n: r.n }); break; } const n = Math.min(r.n, t.hp); hurt(B, t, { n }, ev); const got = Math.min(a.maxhp - a.hp, n); a.hp += got; ev.push({ kind: 'heal', t: a, n: got }); break; }
      case 'osmose': { const n = Math.min(t.mp, Math.round(fx.power * (a.mag / 7 + a.lv / 2 + 4))); t.mp -= n; a.mp += n; ev.push({ kind: 'mp', t: a, n }); break; }
      case 'gravity': if (t.boss) { ev.push({ kind: 'miss', t }); break; } hurt(B, t, { n: Math.max(1, Math.floor(t.hp * fx.power)) }, ev); break;
      case 'kill': kill(B, a, t, fx.power, ev); if (fx.fallback && alive(t)) hurt(B, t, magical(B, a, t, fx.fallback, { stat: 'str' }), ev); break;
      case 'heal': heal(B, a, t, fx.power, ev, { split: many && fx.target !== 'party', stat: o.stat }); break;
      case 'healhp': { const n = Math.min(a.hp, 9999); const got = Math.min(t.maxhp - t.hp, n); t.hp += got; ev.push({ kind: 'heal', t, n: got }); break; }
      case 'healself': heal(B, a, a, fx.power, ev); break;
      case 'revive': if (!alive(t)) { t.hp = Math.max(1, Math.round(t.maxhp * fx.power)); t.atb = 0; ev.push({ kind: 'revive', t }); } else if (fx.power >= 1) heal(B, a, t, 99, ev); break;
      case 'esuna': for (const s of fx.only || BAD) delete t.st[s]; ev.push({ kind: 'cure', t }); break;
      case 'status': addStatus(B, a, t, fx.add, fx.power, ev); break;
      case 'buff': addStatus(B, a, t, fx.add, 1, ev); if (fx.also) addStatus(B, a, t, fx.also, 1, ev); break;
      case 'weak': { const el = ['fire', 'ice', 'bolt', 'water'][Math.floor(B.rng() * 4)]; if (!t.weak.includes(el)) t.weak.push(el); ev.push({ kind: 'msg', u: t, text: [`弱點：${({ fire: '火', ice: '冰', bolt: '雷', water: '水' })[el]}`, `Weak to ${el}`] }); break; }
      case 'revenge': hurt(B, t, { n: Math.min(a.side === 1 ? Math.round(t.maxhp * 0.5) : 9999, Math.max(1, a.maxhp - a.hp)) }, ev); break;
      case 'pepup': if (t !== a) { t.hp = t.maxhp; t.mp = t.maxmp; ev.push({ kind: 'heal', t, n: t.maxhp }); a.hp = 0; a.mp = 0; ev.push({ kind: 'down', t: a }); } break;
      case 'exploder': { const n = a.hp; hurt(B, t, { n }, ev); a.hp = 0; ev.push({ kind: 'down', t: a }); break; }
      case 'gil': { const cost = Math.min(o.gil ? o.gil() : 0, a.lv * 30); if (o.spend) o.spend(cost); hurt(B, t, { n: Math.max(1, Math.round(cost * 2 / targets.length)) }, ev); break; }
      case 'dice': { const d = [1 + Math.floor(B.rng() * 6), 1 + Math.floor(B.rng() * 6)]; ev.push({ kind: 'msg', u: a, text: [`擲出 ${d.join('、')}`, `Rolled ${d.join(' and ')}`] }); hurt(B, t, { n: Math.min(9999, d[0] * d[1] * a.lv * 2 * (d[0] === d[1] ? d[0] : 1)) }, ev); break; }
      default: break;
    }
  }
}
// who a target spec means: 'one' (the chosen), 'all' foes, 'ally' (chosen), 'party' (all friends), 'self', 'random'
function resolve(B, a, target, chosen) {
  if (target === 'all') return foesOf(B, a);
  if (target === 'party') return (a.side === 0 ? B.party : B.mons).filter((u) => alive(u) || target === 'dead');
  if (target === 'self') return [a];
  if (target === 'random') { const all = units(B).filter(alive); return [all[Math.floor(B.rng() * all.length)]]; }
  const t = chosen && chosen.length ? chosen : target === 'ally' ? [a] : foesOf(B, a).slice(0, 1);
  return t.filter((u) => alive(u) || target === 'dead' || target === 'ally');
}

// ---------------------------------------------------------------- doing things
// action: { kind, id, targets, keys (blitz), level (iai), reels (fortune), item }
export function perform(B, a, action, ctx = {}) {
  const ev = []; if (B.over || !alive(a)) return ev;
  const T = action.targets || [];
  a.atb = 0; delete a.st.defend;
  if (B.runic === a) B.runic = null;
  const k = action.kind;
  const say = (zh, en) => ev.push({ kind: 'msg', u: a, text: [zh, en] });
  if (k === 'fight') {
    const t = T[0] && alive(T[0]) ? T[0] : foesOf(B, a)[0]; if (!t) return ev;
    let hits = a.side === 0 && a.m && hasFx(a.m, 'twohand') ? 2 : 1, power = 1;
    if (a.side === 0 && a.m && hasFx(a.m, 'quad')) { hits = 4; power = 0.5; }
    if (a.side === 0 && a.m && hasFx(a.m, 'jump')) power *= 2;
    if (a.side === 0 && a.m && (hasFx(a.m, 'dice') || hasFx(a.m, 'dice2'))) { applyFx(B, a, { kind: 'dice' }, [t], ev); return finish(B, a, action, ev); }
    for (let h = 0; h < hits; h++) { const tt = alive(t) ? t : foesOf(B, a)[0]; if (!tt) break; hurt(B, tt, physical(B, a, tt, power, { el: a.el }), ev); counter(B, a, tt, ev); }
    if (a.side === 0 && a.m && hasFx(a.m, 'mug') && a.id === 'rowan') steal(B, a, t, ev, true);
  } else if (k === 'magic' || k === 'lore') {
    const sp = k === 'magic' ? SPELLS[action.id] : LORES[action.id];
    const cost = k === 'magic' && a.side === 0 && a.m && hasFx(a.m, 'halfmp') ? Math.ceil(sp.mp / 2) : sp.mp;
    if (a.st.silence) { say('被沉默了，無法施法！', 'Silenced — the spell fails!'); return finish(B, a, action, ev); }
    if (!ctx.free) { if (a.mp < cost) { say('MP 不足', 'Not enough MP'); return finish(B, a, action, ev); } a.mp -= cost; }
    ev.push({ kind: 'cast', u: a, name: sp.name, el: sp.el });
    if (sp.kind === 'warp') { if (B.boss) say('無法逃離！', 'Can\'t escape!'); else { B.over = 'escape'; ev.push({ kind: 'escape' }); } return finish(B, a, action, ev); }
    if (a.side === 1 && B.runic && alive(B.runic) && ['dmg', 'status', 'drain', 'gravity', 'kill', 'osmose'].includes(sp.kind)) return runic(B, a, sp, ev, action);
    applyFx(B, a, sp, resolve(B, a, sp.target, T), ev);
  } else if (k === 'item') {
    const it = ITEMS[action.id]; if (!bagTake(B.bag, action.id)) return finish(B, a, action, ev);
    ev.push({ kind: 'cast', u: a, name: it.name });
    const tg = it.target === 'party' ? B.party : T.length ? T : [a];
    for (const t of tg) {
      if (it.use === 'heal') { if (alive(t)) { const got = Math.min(t.maxhp - t.hp, it.amt); t.hp += got; ev.push({ kind: 'heal', t, n: got }); } }
      else if (it.use === 'mp') { const got = Math.min(t.maxmp - t.mp, it.amt); t.mp += got; ev.push({ kind: 'mp', t, n: got }); }
      else if (it.use === 'full') { if (alive(t) || it.target === 'party') { if (!alive(t)) t.hp = 1; t.hp = t.maxhp; t.mp = t.maxmp; ev.push({ kind: 'heal', t, n: t.maxhp }); } }
      else if (it.use === 'revive') { if (!alive(t)) { t.hp = Math.max(1, Math.round(t.maxhp * it.amt)); ev.push({ kind: 'revive', t }); } else ev.push({ kind: 'miss', t }); }
      else if (it.use === 'cure') { for (const s of it.st) delete t.st[s]; ev.push({ kind: 'cure', t }); }
      else if (it.use === 'smoke') { if (B.boss) say('無法逃離！', 'Can\'t escape!'); else { B.over = 'escape'; ev.push({ kind: 'escape' }); } }
    }
  } else if (k === 'defend') { a.st.defend = DUR.defend; say('防禦', 'Defend'); }
  else if (k === 'row') { a.row = a.row === 'back' ? 'front' : 'back'; if (a.m) a.m.row = a.row; say(a.row === 'back' ? '退到後排' : '站到前排', a.row === 'back' ? 'Back row' : 'Front row'); }
  else if (k === 'escape') {
    if (B.boss) { say('無法逃離！', 'Can\'t escape!'); }
    else { const p = clamp(0.5 + (avg(B.party, 'spd') - avg(B.mons, 'spd')) / 60, 0.25, 0.95); if (B.rng() < p) { B.over = 'escape'; ev.push({ kind: 'escape' }); } else say('沒能逃掉！', 'Couldn\'t get away!'); }
  } else if (k === 'astralize') {
    if (a.astralized) say('已經用過了', 'Already used'); else { a.astralized = true; a.st.astral = DUR.astral; ev.push({ kind: 'status', t: a, st: 'astral' }); }
  } else if (k === 'summon') {
    const A = ASTRALS[action.id], s = A.summon;
    if (a.summoned) say('這場戰鬥已經召喚過了', 'Already summoned this battle');
    else if (a.mp < s.mp) say('MP 不足', 'Not enough MP');
    else { a.mp -= s.mp; a.summoned = true; ev.push({ kind: 'summon', u: a, id: action.id, name: s.name }); applyFx(B, a, s, resolve(B, a, s.target, T), ev); }
  } else if (k === 'steal') steal(B, a, T[0] || foesOf(B, a)[0], ev, false);
  else if (k === 'tools') { const tl = TOOLS[action.id]; ev.push({ kind: 'cast', u: a, name: tl.name }); applyFx(B, a, { ...tl, power: tl.kind === 'dmg' ? tl.power * (a.lv * 0.6 + 8) / (a.mag / 7 + a.lv / 2 + 4) : tl.power }, resolve(B, a, tl.target, T), ev, { stat: 'mag' }); }
  else if (k === 'blitz') {
    const bz = BLITZ.find((x) => x.id === action.id);
    if (!bz || action.keys !== bz.keys) { say('招式失敗了……', 'The blitz fizzles…'); return finish(B, a, action, ev); }
    ev.push({ kind: 'cast', u: a, name: bz.name, el: bz.el });
    applyFx(B, a, bz, bz.kind === 'hits' ? (T.length ? T : foesOf(B, a).slice(0, 1)) : resolve(B, a, bz.target || 'one', T), ev, { stat: 'str' });
  } else if (k === 'iai') {
    // the charge itself: the cut comes later (tick → due → perform with kind 'iaicut')
    const lv = clamp(action.level || 1, 1, IAI.length);
    a.charge = { t: 1.5 * lv, action: { kind: 'iaicut', level: lv, targets: T } }; ev.push({ kind: 'charge', u: a, level: lv });
    return ev;
  } else if (k === 'iaicut') {
    const z = IAI[action.level - 1]; ev.push({ kind: 'cast', u: a, name: z.name });
    applyFx(B, a, z, z.kind === 'hits' ? (T.filter(alive).length ? T.filter(alive) : foesOf(B, a).slice(0, 1)) : resolve(B, a, z.target || 'one', T), ev, { stat: 'str' });
  } else if (k === 'feral') {
    a.feral = action.id; ev.push({ kind: 'msg', u: a, text: [`化身為${MONSTERS[action.id].name[0]}！`, `Becomes a ${MONSTERS[action.id].name[1]}!`] });
    feralMove(B, a, ev);
  } else if (k === 'runeblade') { B.runic = a; ev.push({ kind: 'status', t: a, st: 'runic' }); }
  else if (k === 'fortune') {
    const r = action.reels || [], same = r[0] === r[1] && r[1] === r[2], pair = !same && (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]);
    const f = same ? FORTUNE[r[0]] : pair ? FORTUNE.pair : FORTUNE.none;
    ev.push({ kind: 'cast', u: a, name: f.name });
    if (same && r[0] === 'skull' && B.rng() < 0.25) { say('命運反過來咬了你一口！', 'Fate bites back!'); applyFx(B, a, { kind: 'dmg', power: 10 }, B.party.filter(alive), ev); }
    else applyFx(B, a, f, resolve(B, a, f.target, T), ev, { gil: ctx.gil, spend: ctx.spend });
  } else if (k === 'throw') {
    const id = action.id, it = ITEMS[id] || GEAR[id]; if (!bagTake(B.bag, id)) return finish(B, a, action, ev);
    ev.push({ kind: 'cast', u: a, name: it.name, el: it.el });
    if (ITEMS[id] && it.all) applyFx(B, a, { kind: 'dmg', power: it.throw * 1.8, el: it.el }, foesOf(B, a), ev, { stat: 'str' });
    else { const t = T[0] && alive(T[0]) ? T[0] : foesOf(B, a)[0]; const power = ITEMS[id] ? it.throw : (it.power || 20) * 1.6; hurt(B, t, physical(B, { ...a, atk: power + a.str }, t, 1.3, { ranged: true, el: it.el }), ev); }
  } else if (k === 'sketch') {
    const t = T[0] && alive(T[0]) ? T[0] : foesOf(B, a)[0];
    if (!t || t.side !== 1 || B.rng() < 0.12) { say('畫歪了……', 'The sketch went wrong…'); return finish(B, a, action, ev); }
    B.sketches.add(t.id); const sk = pickSkill(B, t, true), s = MSKILLS[sk];
    ev.push({ kind: 'cast', u: a, name: [`${t.name[0]}的畫像：${s.name[0]}`, `${t.name[1]} sketch: ${s.name[1]}`] });
    monsterMove(B, { ...a, side: 0, atk: a.atk, mag: a.mag + 10 }, s, ev, a);
  } else if (k === 'dance') {
    a.dancing = action.id; dance(B, a, ev);
  } else if (k === 'mimic') {
    const last = B.lastParty; if (!last || last.a === a) { say('沒有可以模仿的動作', 'Nothing to mimic'); return finish(B, a, action, ev); }
    ev.push({ kind: 'msg', u: a, text: ['模仿！', 'Mimic!'] });
    const act = { ...last.action, targets: (last.action.targets || []).filter(alive) };
    if (act.kind === 'iai') act.kind = 'iaicut';
    if (['item', 'throw', 'iai'].includes(act.kind) || (act.kind === 'summon' && a.summoned)) { say('模仿不出來……', 'Can\'t copy that…'); return finish(B, a, action, ev); }
    const ev2 = perform(B, { ...a, summoned: false, astralized: false, m: a.m, get hp() { return a.hp; }, set hp(v) { a.hp = v; }, get mp() { return 999; }, set mp(v) {} }, act, { ...ctx, free: true, mimic: true });
    ev.push(...ev2);
    return finish(B, a, action, ev, true);
  } else if (k === 'command') {
    for (const t of B.party.filter(alive)) { t.st.rally = DUR.rally; ev.push({ kind: 'status', t, st: 'rally' }); }
    const t = foesOf(B, a)[0]; if (t) hurt(B, t, physical(B, a, t, 1.5), ev);
  } else if (k === 'berserk') {
    if (B.rng() < 0.22) { ev.push({ kind: 'cast', u: a, name: ['雪崩之吼', 'Avalanche Roar'], el: 'ice' }); applyFx(B, a, { kind: 'dmg', power: 9, el: 'ice' }, foesOf(B, a), ev, { stat: 'str' }); }
    else { const fs = foesOf(B, a), t = fs[Math.floor(B.rng() * fs.length)]; if (t) hurt(B, t, physical(B, a, t, 1.2), ev); }
  } else if (k === 'magitek') {
    const bm = MAGITEK[action.id]; ev.push({ kind: 'cast', u: a, name: bm.name, el: bm.el });
    applyFx(B, { ...a, mag: a.mag + 20 }, bm, resolve(B, a, bm.target, T), ev);
  } else if (k === 'pray') {
    ev.push({ kind: 'cast', u: a, name: ['祈禱', 'Pray'] }); applyFx(B, a, { kind: 'heal', power: 6, target: 'party' }, B.party.filter(alive), ev);
  } else if (k === 'skill') {             // a monster's move (or a feral beast's)
    monsterMove(B, a, MSKILLS[action.id], ev, null, T);
  }
  return finish(B, a, action, ev);
}
const avg = (list, k) => list.reduce((s, u) => s + u[k], 0) / Math.max(1, list.length);
function finish(B, a, action, ev, mimicked) {
  if (a.side === 0 && !mimicked && !['defend', 'row', 'escape', 'mimic'].includes(action.kind) && a.id !== 'kagami') B.lastParty = { a, action };
  if (a.side === 0) B.turns++;
  check(B);
  return ev;
}
// Selene's sword swallows the spell
function runic(B, caster, sp, ev, action) {
  const s = B.runic; B.runic = null;
  const gain = Math.min(s.maxmp - s.mp, sp.mp || 12); s.mp += gain;
  ev.push({ kind: 'runic', t: s, n: gain });
  return finish(B, caster, action, ev);
}
function counter(B, a, t, ev) {
  if (!alive(t) || !alive(a)) return;
  if (t.side === 1 && t.mon.counter && B.rng() < 0.5) { ev.push({ kind: 'msg', u: t, text: ['反擊！', 'Counter!'] }); monsterMove(B, t, MSKILLS[t.mon.counter], ev, null, [a]); }
  else if (t.side === 0 && t.m && hasFx(t.m, 'counter') && B.rng() < 0.4) { ev.push({ kind: 'msg', u: t, text: ['反擊！', 'Counter!'] }); hurt(B, a, physical(B, t, a, 1), ev); }
}
function steal(B, a, t, ev, mug) {
  if (!t || t.side !== 1) return;
  if (t.stolen || !t.mon.steal.length) { ev.push({ kind: 'msg', u: a, text: ['什麼都沒有', 'Nothing to steal'] }); return; }
  const p = clamp(0.5 + (a.lv - t.lv) * 0.025 + (mug ? 0.1 : 0), 0.15, 0.95);
  if (B.rng() > p) { ev.push({ kind: 'msg', u: a, text: ['偷竊失敗', 'Couldn\'t steal'] }); return; }
  const rare = t.mon.steal[1] && B.rng() < 1 / 6; const it = rare ? t.mon.steal[1] : t.mon.steal[0];
  t.stolen = true; bagAdd(B.bag, it); B.loot.push(it);
  ev.push({ kind: 'steal', u: a, t, item: it });
}

// ---------------------------------------------------------------- monsters and the automatic fighters
function pickSkill(B, u, noAttack) {
  const sk = { ...u.mon.skills }; if (noAttack && Object.keys(sk).length > 1) delete sk.attack;
  if (u.hp < u.maxhp * 0.3 && sk.heal) return 'heal';
  const entries = Object.entries(sk).filter(([, w]) => w > 0), total = entries.reduce((s, [, w]) => s + w, 0);
  let r = B.rng() * total; for (const [k, w] of entries) { r -= w; if (r <= 0) return k; }
  return entries.length ? entries[0][0] : 'attack';
}
function monsterMove(B, a, s, ev, painter, chosen) {
  if (!s) s = MSKILLS.attack;
  if (s.lore && a.side === 1) B.seenLores.add(s.lore);
  if (s.kind !== 'phys' || s !== MSKILLS.attack) ev.push({ kind: 'cast', u: painter || a, name: s.name, el: s.el, monster: a.side === 1 });
  // Selene swallows monster magic
  if (a.side === 1 && B.runic && alive(B.runic) && !['phys', 'healself'].includes(s.kind)) { const r = B.runic; B.runic = null; const gain = Math.min(r.maxmp - r.mp, 15); r.mp += gain; ev.push({ kind: 'runic', t: r, n: gain }); return; }
  const tg = s.target === 'self' ? [a] : s.target === 'all' ? foesOf(B, a) : s.target === 'random' ? [units(B).filter(alive)[Math.floor(B.rng() * units(B).filter(alive).length)]]
    : s.target === 'party' ? friendsOf(B, a) : s.target === 'ally' ? [friendsOf(B, a)[Math.floor(B.rng() * friendsOf(B, a).length)]]
      : chosen && chosen.filter(alive).length ? chosen.filter(alive) : [targetFor(B, a)];
  if (s.kind === 'phys') for (const t of tg) { if (!t) continue; hurt(B, t, physical(B, a, t, s.power, { el: s.el }), ev); if (s.add && alive(t)) addStatus(B, a, t, s.add, 0.45, ev); if (a.side === 1) interceptCounter(B, a, t, ev); }
  else applyFx(B, a, s, tg.filter(Boolean), ev);
}
// Nightcrow's wolf Ashfang jumps in front of attacks on him; the Black Belt counters
function interceptCounter(B, a, t, ev) {
  if (t.side === 0 && t.id === 'nightcrow' && alive(t) && alive(a) && B.rng() < 0.3) { ev.push({ kind: 'msg', u: t, text: ['灰牙撲了上去！', 'Ashfang leaps in!'] }); hurt(B, a, physical(B, { ...t, atk: t.atk + 30 }, a, 1), ev); }
}
// monsters pick on the front row more often
function targetFor(B, a) {
  const fs = foesOf(B, a); if (!fs.length) return null;
  const w = fs.map((u) => (u.row === 'back' ? 1 : 2)), sum = w.reduce((s, x) => s + x, 0);
  let r = B.rng() * sum; for (let i = 0; i < fs.length; i++) { r -= w[i]; if (r <= 0) return fs[i]; } return fs[0];
}
export function enemyAct(B, u) {
  const ev = []; if (!alive(u) || B.over) return ev;
  u.atb = 0;
  if (u.st.blind && B.rng() < 0.3) { ev.push({ kind: 'msg', u, text: ['看不清楚……', 'Can\'t see…'] }); return ev; }
  monsterMove(B, u, MSKILLS[pickSkill(B, u)], ev);
  check(B);
  return ev;
}
// Galan as a beast: the beast's moves with Galan's strength
function feralMove(B, a, ev) {
  const d = MONSTERS[a.feral]; const sk = pickSkill(B, { mon: d, hp: a.hp, maxhp: a.maxhp });
  monsterMove(B, { ...a, side: 0, mag: a.mag + 6 }, MSKILLS[sk], ev, a);
}
function dance(B, a, ev) {
  const D = DANCES[a.dancing]; const st = D.steps[Math.floor(B.rng() * D.steps.length)];
  const [zh, en, kind, power, target, el, add] = st;
  ev.push({ kind: 'cast', u: a, name: [`${D.name[0]}：${zh}`, `${D.name[1]}: ${en}`], el });
  applyFx(B, a, { kind, power, target, el, add }, resolve(B, a, target, []), ev);
}
// those who fight on their own: Uma, Galan as a beast, Moka once dancing
export const isAuto = (u) => u.side === 0 && (u.id === 'uma' || !!u.feral || !!u.dancing);
export function autoAct(B, u) {
  const ev = []; if (!alive(u) || B.over) return ev;
  u.atb = 0;
  if (u.id === 'uma') return perform(B, u, { kind: 'berserk' });
  if (u.feral) feralMove(B, u, ev); else if (u.dancing) dance(B, u, ev);
  check(B); return ev;
}

// ---------------------------------------------------------------- the end
export function check(B) {
  if (B.over) return B.over;
  if (!B.mons.some(alive)) B.over = 'win';
  else if (!B.party.some(alive)) B.over = 'lose';
  return B.over;
}
// the spoils: experience (every living member gets all of it), gil, AP, a drop now and then; Galan learns the beasts he fought
export function rewards(B) {
  const mons = B.mons;
  const exp = mons.reduce((s, u) => s + u.mon.exp, 0), gil = mons.reduce((s, u) => s + u.mon.gil, 0) + B.gilBonus, ap = mons.reduce((s, u) => s + u.mon.ap, 0);
  const drops = [];
  for (const u of mons) if (!u.stolen && u.mon.steal.length && B.rng() < (u.boss ? 0.6 : 0.12)) drops.push(u.mon.steal[0]);
  const galan = B.party.find((u) => u.id === 'galan' && alive(u)), ferals = [];
  if (galan) for (const u of mons) if (!u.boss && !galan.ferals.includes(u.id) && !ferals.includes(u.id) && B.rng() < (B.bg === 'wild' ? 1 : 0.4)) ferals.push(u.id);
  return { exp, gil, ap, drops, ferals, lores: [...B.seenLores], sketches: [...B.sketches] };
}
