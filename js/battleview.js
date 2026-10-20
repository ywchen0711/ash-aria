// ASH ARIA — the battle screen: side view (monsters left, party right), the ATB window, every command's menu, the spoils.
// The rules live in battle.js; this file shows them and asks the player what to do. Time stops while a menu is open ("wait").
import { T, EN } from './i18n.js?v=3';
import { CHARS, CMD, SPELLS, ITEMS, GEAR, ASTRALS, BLITZ, IAI, TOOLS, REELS, REEL_ICON, DANCES, LORES, MAGITEK, STATUS } from './data.js?v=3';
import { MONSTERS } from './monsters.js?v=3';
import * as BT from './battle.js?v=3';
import { person, monster, backdrop } from './art.js?v=3';
import * as UI from './ui.js?v=3';
import { gainXp, gainAp, bagAdd, hasFx } from './party.js?v=3';
const { box, text, menu, S: SC, VW } = UI;

const nm = (u) => BT.unitName(u, EN);
const EL_COL = { fire: '#ff6a2a', ice: '#80d8ff', bolt: '#ffff60', wind: '#a0ffb0', earth: '#c8a060', water: '#4a9aff', holy: '#ffffff', poison: '#a060ff' };

// ---------------------------------------------------------------- drawing
function layout(B) {
  // monsters: a loose grid on the left; bosses take more room
  const ms = B.mons, n = ms.length;
  ms.forEach((u, i) => {
    const big = u.mon.size >= 1.5, sz = Math.min(96, 46 * u.mon.size);
    const col = n <= 2 ? i : i % 3, row = n <= 2 ? 0 : Math.floor(i / 3);
    u.sz = sz; u.cx = n === 1 ? 72 : 30 + col * (n <= 2 ? 64 : 44) + row * 18; u.cy = (n <= 3 ? 104 : 74 + row * 52) + (big ? 6 : 0) - (n === 2 ? (i ? -10 : 10) : 0);
  });
  B.party.forEach((u, i) => { u.cx = 200 + i * 7 + (u.row === 'back' ? 14 : 0); u.cy = 52 + i * 26; });
}
function drawBattle(G, B, g, dt) {
  B.anim = (B.anim || 0) + dt;
  B.shake = Math.max(0, (B.shake || 0) - dt);
  const sx = B.shake > 0 ? (Math.random() - 0.5) * 8 : 0;
  g.save(); g.translate(sx, 0);
  if (G.hd) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 0, VW * SC, 160 * SC); }
  else g.drawImage(backdrop(B.bg, 256 * SC, 160 * SC), 0, 0);
  layout(B);
  // monsters
  for (const u of B.mons) {
    if (u.gone) continue;
    if (!BT.alive(u)) { u.fade = (u.fade ?? 1) - dt * 2; if (u.fade <= 0) { u.gone = true; continue; } }
    const flash = u.flash > 0 && Math.floor(u.flash * 20) % 2 === 0; if (u.flash > 0) u.flash -= dt;
    const img = monster(u.mon.art, u.mon.col, flash || u.flash > 0, u.sz), bob = u.st.stop || u.st.sleep ? 0 : Math.sin(B.anim * 2.4 + u.slot) * 1.2;
    g.save(); g.globalAlpha = BT.alive(u) ? 1 : Math.max(0, u.fade);
    if (!BT.alive(u)) { g.filter = 'brightness(2) sepia(1) hue-rotate(-50deg)'; }
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(u.cx * SC, (u.cy + 2) * SC, u.sz * 0.36 * SC, u.sz * 0.08 * SC, 0, 0, 7); g.fill();
    g.drawImage(img, (u.cx - u.sz / 2) * SC, (u.cy - u.sz + bob) * SC, u.sz * SC, u.sz * SC);
    g.restore();
    if (u.st.sleep) text('Zzz', u.cx + u.sz * 0.3, u.cy - u.sz, { color: '#a8d0ff', size: 7 * SC });
    if (B.cursor === u && Math.floor(B.anim * 4) % 2 === 0) text('▼', u.cx - 3, u.cy - u.sz - 8, { color: '#ffe080' });
  }
  // the party, facing left; the one acting steps forward
  for (const u of B.party) {
    const look = u.feral ? null : CHARS[u.id].look, step = B.acting === u ? -14 : 0, kneel = BT.alive(u) && u.hp < u.maxhp / 4;
    const x = u.cx + step, y = u.cy;
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse((x + 8) * SC, (y + 16) * SC, 9 * SC, 2 * SC, 0, 0, 7); g.fill();
    g.save();
    if (!BT.alive(u)) { g.globalAlpha = 0.55; g.translate((x + 8) * SC, (y + 12) * SC); g.rotate(-Math.PI / 2); g.drawImage(person(look || 'man', 'left', 0), -8 * SC, -12 * SC, 16 * SC * 1.25, 16 * SC * 1.25); }
    else if (u.feral) { const d = MONSTERS[u.feral]; g.drawImage(monster(d.art, d.col, false, 30), (x - 8) * SC, (y - 12) * SC, 30 * SC, 30 * SC); }
    else {
      if (u.st.astral) { g.shadowColor = '#ff80ff'; g.shadowBlur = 18; }
      g.drawImage(person(look, 'left', (B.acting === u || (u.atb >= 100 && Math.floor(B.anim * 3) % 2)) ? 1 : 0), x * SC, (y - 4 + (kneel ? 3 : 0)) * SC, 16 * SC * 1.25, 16 * SC * 1.25);
    }
    g.restore();
    if (u.charge && Math.floor(B.anim * 6) % 2) text('✦', x - 6, y - 6, { color: '#ffe080', size: 7 * SC });
    if (B.runic === u) text('⚔', x - 6, y + 2, { color: '#80d8ff', size: 7 * SC });
    if (B.cursor === u && Math.floor(B.anim * 4) % 2 === 0) text('◀', x + 22, y + 2, { color: '#ffe080' });
    if (B.turn === u) text('▶', x - 10, y + 2, { color: '#ffffff', size: 7 * SC });
  }
  // flashes and sparkles
  for (const f of B.fx) {
    f.t += dt; const k = f.t / f.dur; if (k >= 1) continue;
    const r = (6 + k * 26) * (f.big ? 1.6 : 1);
    const gr = g.createRadialGradient(f.x * SC, f.y * SC, 0, f.x * SC, f.y * SC, r * SC); gr.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - k)})`); gr.addColorStop(0.4, hexA(f.col, 0.7 * (1 - k))); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(f.x * SC, f.y * SC, r * SC, 0, 7); g.fill();
  }
  B.fx = B.fx.filter((f) => f.t < f.dur);
  // numbers
  for (const p of B.pops) { p.t += dt; g.globalAlpha = Math.max(0, 1 - Math.max(0, p.t - 0.6) / 0.5); text(String(p.n), p.x, p.y - Math.min(p.t, 0.3) * 30 + (p.t > 0.3 ? 0 : 0), { align: 'center', color: p.col, size: (p.small ? 7 : 9) * SC }); g.globalAlpha = 1; }
  B.pops = B.pops.filter((p) => p.t < 1.1);
  g.restore();
  // the window: enemies on the left, the party's HP and ATB on the right
  box(2, 162, 92, 76);
  const names = []; for (const u of B.mons) if (BT.alive(u)) { const k = T(u.mon.name); if (!names.includes(k)) names.push(k); }
  names.slice(0, 5).forEach((n, i) => text(n.slice(0, EN ? 12 : 6), 10, 170 + i * 13, { size: 7 * SC }));
  box(94, 162, 160, 76);
  B.party.forEach((u, i) => {
    const y = 169 + i * 16, col = !BT.alive(u) ? '#ff6a6a' : u.hp < u.maxhp / 4 ? '#ffd040' : '#fff';
    text((B.turn === u ? '▶' : '') + T(CHARS[u.id].name).slice(0, EN ? 8 : 4), 102, y, { color: col, size: 7 * SC });
    text(`${u.hp}`, 186, y, { align: 'right', color: col, size: 7 * SC });
    text(`${u.mp}`, 208, y, { align: 'right', color: '#a8c8ff', size: 6 * SC });
    const st = Object.keys(u.st).filter((k) => STATUS[k] && !['protect', 'shell', 'regen', 'haste'].includes(k))[0];
    // ATB gauge
    g.fillStyle = '#222'; g.fillRect(212 * SC, (y + 2) * SC, 36 * SC, 4 * SC);
    g.fillStyle = u.charge ? '#ffe080' : u.atb >= 100 ? '#ffffff' : u.st.haste ? '#80ff80' : u.st.slow ? '#ff8080' : '#c8a040';
    g.fillRect(212 * SC, (y + 2) * SC, 36 * SC * (u.charge ? 1 : Math.min(1, u.atb / 100)), 4 * SC);
    if (st) text(T(STATUS[st]).slice(0, 2), 230, y - 6, { color: '#c8a0ff', size: 5 * SC });
  });
}
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// ---------------------------------------------------------------- showing what happened
async function play(G, B, ev, actor) {
  if (!ev.length) return;
  B.acting = actor || null;
  let shown = false;
  for (const e of ev) {
    const t = e.t || e.u;
    if (e.kind === 'cast' || e.kind === 'summon') { await UI.flash(T(e.name), 0.75); shown = true; G.sfx(e.kind === 'summon' ? 'spell' : 'spell'); if (e.kind === 'summon') { for (const m of B.mons) if (BT.alive(m)) B.fx.push({ x: m.cx, y: m.cy - m.sz / 2, t: 0, dur: 0.9, col: ASTRALS[e.id].look[0], big: true }); B.shake = 0.4; await UI.sleep(0.4); } continue; }
    if (e.kind === 'msg') { await UI.flash(T(e.text), 0.7); continue; }
    if (e.kind === 'steal') { G.sfx('chest'); await UI.flash(T(['偷到了', 'Stole ']) + T((ITEMS[e.item] || GEAR[e.item] || TOOLS[e.item]).name) + T(['！', '!']), 1); continue; }
    if (e.kind === 'runic') { pop(B, t, `+${e.n}MP`, '#80d8ff'); await UI.flash(T(['封魔劍吸收了魔法！', 'The Runeblade swallows the spell!']), 0.8); continue; }
    if (e.kind === 'charge') { await UI.flash(T([`蓄力中……（${e.level} 段）`, `Charging… (level ${e.level})`]), 0.6); continue; }
    if (e.kind === 'escape') { G.sfx('door'); await UI.flash(T(['逃走了！', 'Escaped!']), 0.8); continue; }
    if (!t) continue;
    if (e.kind === 'dmg') { pop(B, t, e.n, e.poison ? '#c080ff' : e.crit ? '#ffd040' : '#ffffff'); if (t.side === 1) t.flash = 0.3; else B.shake = 0.18; B.fx.push({ x: t.cx + (t.side === 0 ? 10 : 0), y: t.cy - (t.side === 1 ? t.sz / 2 : -6), t: 0, dur: 0.35, col: e.weak ? '#ffd040' : '#ffffff' }); G.sfx(e.death ? 'kill' : 'hit'); if (e.weak) pop(B, t, T(['弱點！', 'WEAK!']), '#ffd040', true); }
    else if (e.kind === 'heal') { pop(B, t, e.n, '#7fff8a'); G.sfx('heal'); }
    else if (e.kind === 'mp') pop(B, t, `${e.n}MP`, '#80c8ff');
    else if (e.kind === 'miss') pop(B, t, 'Miss', '#c0c0c0');
    else if (e.kind === 'status') pop(B, t, T(STATUS[e.st] || (e.st === 'runic' ? ['封魔', 'Runic'] : e.st === 'rally' ? ['士氣', 'Rally'] : [e.st, e.st])), '#ffc0ff', true);
    else if (e.kind === 'cure') pop(B, t, T(['治癒', 'Cured']), '#7fff8a', true);
    else if (e.kind === 'revive') { pop(B, t, T(['復活', 'Revived']), '#7fff8a', true); G.sfx('heal'); }
    else if (e.kind === 'down') { if (t.side === 1) G.sfx('kill'); }
    if (e.kind === 'dmg' && e.el) B.fx.push({ x: t.cx, y: t.cy - 10, t: 0, dur: 0.5, col: EL_COL[e.el] || '#fff' });
    await UI.sleep(ev.length > 6 ? 0.08 : 0.16);
  }
  await UI.sleep(shown ? 0.25 : 0.35);
  B.acting = null;
}
function pop(B, t, n, col, small) {
  const x = t.side === 1 ? t.cx : t.cx + 10, y = t.side === 1 ? t.cy - t.sz * 0.55 : t.cy - 4;
  const same = B.pops.filter((p) => Math.abs(p.x - x) < 4 && p.t < 0.5).length;
  B.pops.push({ x, y: y - same * 9, n, col, t: 0, small });
}

// ---------------------------------------------------------------- the player's choices
async function chooseTarget(B, side, opts = {}) {
  const list = (side === 'foe' ? B.mons : B.party).filter((u) => opts.dead ? true : BT.alive(u));
  if (!list.length) return null;
  if (side === 'foe' && list.length === 1) return [list[0]];
  const i = await menu(list.map((u) => ({ label: nm(u), right: side === 'ally' ? `${u.hp}` : '' })), { x: side === 'foe' ? 4 : 140, y: 120, title: T(['目標', 'Target']), onMove: (it, k) => { B.cursor = list[k]; }, start: 0 });
  B.cursor = null;
  if (i < 0) return null;
  return [list[i]];
}
async function targetsFor(B, target, opts) {
  if (target === 'one') return chooseTarget(B, 'foe');
  if (target === 'ally') return chooseTarget(B, 'ally');
  if (target === 'dead') return chooseTarget(B, 'ally', { dead: true });
  return [];
}
// Sai's blitz: the directions pressed after choosing it
function blitzInput() {
  return new Promise((resolve) => {
    let keys = '', t = 0;
    const close = UI.custom({
      tick(dt) { t += dt; if (t > 6) { close(); resolve(keys); } },
      draw() { box(40, 70, 176, 44); text(T(['輸入方向，按確定發動', 'Enter the directions, then OK']), 128, 78, { align: 'center', size: 7 * SC }); text(keys.split('').map((k) => ({ u: '↑', d: '↓', l: '←', r: '→' })[k]).join(' ') || '…', 128, 94, { align: 'center', color: '#ffe080' }); },
      key(k) { if (['up', 'down', 'left', 'right'].includes(k)) { if (keys.length < 10) keys += k[0]; } else if (k === 'ok') { close(); resolve(keys); } else if (k === 'back') { close(); resolve(null); } },
    });
  });
}
// Regis's reels: they spin; OK stops one at a time
function reels(rng) {
  return new Promise((resolve) => {
    const out = [], pos = [0, 0, 0].map(() => Math.floor(rng() * REELS.length)); let t = 0;
    const close = UI.custom({
      tick(dt) { t += dt; for (let i = out.length; i < 3; i++) pos[i] = Math.floor(t * (9 + i * 2) + i * 2) % REELS.length; if (t > 12 && out.length < 3) this.key('ok'); },
      draw() {
        box(64, 64, 128, 52); text(T(['天候輪', 'Weather Wheel']), 128, 70, { align: 'center', color: '#ffe080', size: 7 * SC });
        for (let i = 0; i < 3; i++) { box(76 + i * 36, 82, 32, 28); text(REEL_ICON[out[i] || REELS[pos[i]]], 92 + i * 36, 89, { align: 'center', size: 12 * SC, color: out[i] ? '#ffffff' : '#c8c8c8' }); }
      },
      key(k) { if (k !== 'ok') return; out.push(REELS[pos[out.length]]); if (out.length === 3) { setTimeout(() => { close(); resolve(out); }, 450); } },
    });
  });
}
const cmdName = (c) => T(CMD[c] ? CMD[c][0] : c);
async function commandFor(G, B, u) {
  const m = u.m, S = G.S;
  const cmds = [];
  if (G.flag('magitekArmour') && (u.id === 'aria' || u.id === 'hart' || u.id === 'gale')) cmds.push(['magitek', cmdName('magitek')]);
  else {
    cmds.push(['fight', T(['攻擊', 'Fight'])]);
    const c = CHARS[u.id].cmd;
    if (c === 'steal' && m && hasFx(m, 'mug')) cmds.push(['steal', T(['強奪', 'Mug'])]);
    else if (c !== 'berserk') cmds.push([c, cmdName(c)]);
    if (m.spells.length && c !== 'magitek' && u.id !== 'uma') cmds.push(['magic', T(['魔法', 'Magic'])]);
    if (m.astral && ASTRALS[m.astral] && !u.summoned) cmds.push(['summon', T(['召喚', 'Summon'])]);
  }
  cmds.push(['item', T(['道具', 'Item'])]);
  cmds.push(['defend', T(['防禦', 'Defend'])], ['row', T(['換排', 'Row'])]);
  if (!B.boss && !B.opts.noEscape) cmds.push(['escape', T(['逃跑', 'Run'])]);
  for (;;) {
    const i = await menu(cmds.map(([, l]) => l), { x: 4, y: 162, w: 90, title: T(CHARS[u.id].name), cancel: false, rows: 5 });
    const k = cmds[i][0];
    const act = await subCommand(G, B, u, k);
    if (act) return act;
  }
}
async function subCommand(G, B, u, k) {
  const m = u.m, S = G.S, bag = G.bag;
  const T1 = (list, title, opts = {}) => menu(list, { x: 96, y: 96, w: 158, rows: 7, title, ...opts });
  if (k === 'fight') { const t = await chooseTarget(B, 'foe'); return t && { kind: 'fight', targets: t }; }
  if (['defend', 'row', 'escape', 'astralize', 'runeblade', 'mimic', 'command', 'pray'].includes(k)) {
    if (k === 'astralize' && u.astralized) { await UI.flash(T(['這場戰鬥已經幻化過了', 'Already transformed this battle']), 0.8); return null; }
    return { kind: k };
  }
  if (k === 'steal') { const t = await chooseTarget(B, 'foe'); return t && { kind: hasFx(m, 'mug') ? 'fight' : 'steal', targets: t }; }
  if (k === 'magic') {
    const list = m.spells.filter((s) => SPELLS[s]);
    const cost = (s) => (hasFx(m, 'halfmp') ? Math.ceil(SPELLS[s].mp / 2) : SPELLS[s].mp);
    const i = await T1(list.map((s) => ({ label: T(SPELLS[s].name), right: String(cost(s)), disabled: u.mp < cost(s) || u.st.silence })), T(['魔法', 'Magic']), { cols: 1 }); if (i < 0) return null;
    const sp = SPELLS[list[i]]; const t = await targetsFor(B, sp.target === 'dead' ? 'dead' : sp.kind === 'revive' ? 'dead' : sp.target); if (!t) return null;
    return { kind: 'magic', id: list[i], targets: t };
  }
  if (k === 'summon') { const A = ASTRALS[m.astral]; if (u.mp < A.summon.mp) { await UI.flash(T(['MP 不足', 'Not enough MP']), 0.7); return null; } const t = await targetsFor(B, A.summon.target); if (!t) return null; return { kind: 'summon', id: m.astral, targets: t }; }
  if (k === 'item') {
    const list = Object.keys(bag).filter((x) => ITEMS[x] && ITEMS[x].use && ITEMS[x].use !== 'tent' && ITEMS[x].use !== 'warp');
    if (!list.length) { await UI.flash(T(['沒有可用的道具', 'No items to use']), 0.7); return null; }
    const i = await T1(list.map((x) => ({ label: T(ITEMS[x].name), right: `×${bag[x]}` })), T(['道具', 'Items'])); if (i < 0) return null;
    const it = ITEMS[list[i]]; if (it.use === 'smoke' || it.target === 'party') return { kind: 'item', id: list[i], targets: [] };
    const t = await chooseTarget(B, 'ally', { dead: true }); return t && { kind: 'item', id: list[i], targets: t };
  }
  if (k === 'tools') {
    const list = (S.tools || []).filter((x) => TOOLS[x]); if (!list.length) { await UI.flash(T(['沒有機械道具（到商店買吧）', 'No tools (buy some in shops)']), 0.8); return null; }
    const i = await T1(list.map((x) => T(TOOLS[x].name)), cmdName('tools')); if (i < 0) return null;
    const t = await targetsFor(B, TOOLS[list[i]].target); if (!t) return null; return { kind: 'tools', id: list[i], targets: t };
  }
  if (k === 'blitz') {
    const list = BLITZ.filter((b) => u.lv >= b.lv);
    const i = await T1(list.map((b) => ({ label: T(b.name), right: b.keys.split('').map((c) => ({ u: '↑', d: '↓', l: '←', r: '→' })[c]).join('') })), cmdName('blitz')); if (i < 0) return null;
    const keys = await blitzInput(); if (keys === null) return null;
    const bz = list[i]; let t = []; if (bz.target === 'one' || bz.kind === 'hits') { t = await chooseTarget(B, 'foe'); if (!t) return null; }
    return { kind: 'blitz', id: bz.id, keys, targets: t };
  }
  if (k === 'iai') {
    const list = IAI.filter((z) => u.lv >= z.lv);
    const i = await T1(list.map((z, j) => ({ label: `${j + 1} ${T(z.name)}`, right: `${(1.5 * (j + 1)).toFixed(1)}s` })), cmdName('iai')); if (i < 0) return null;
    const z = list[i]; let t = []; if (z.kind === 'hits') { t = await chooseTarget(B, 'foe'); if (!t) return null; }
    return { kind: 'iai', level: i + 1, targets: t };
  }
  if (k === 'feral') {
    const list = (m.ferals || []).filter((x) => MONSTERS[x]); if (!list.length) { await UI.flash(T(['還沒學到野性（打倒魔物就會學到）', 'No ferals yet (beat monsters to learn them)']), 0.9); return null; }
    const i = await T1(list.map((x) => T(MONSTERS[x].name)), cmdName('feral')); if (i < 0) return null; return { kind: 'feral', id: list[i] };
  }
  if (k === 'fortune') { const r = await reels(Math.random); return { kind: 'fortune', reels: r, targets: [] }; }
  if (k === 'throw') {
    const list = Object.keys(bag).filter((x) => (ITEMS[x] && ITEMS[x].throw) || (GEAR[x] && GEAR[x].slot === 'weapon'));
    if (!list.length) { await UI.flash(T(['沒有可以投擲的東西', 'Nothing to throw']), 0.7); return null; }
    const i = await T1(list.map((x) => ({ label: T((ITEMS[x] || GEAR[x]).name), right: `×${bag[x]}` })), cmdName('throw')); if (i < 0) return null;
    const it = ITEMS[list[i]]; const t = it && it.all ? [] : await chooseTarget(B, 'foe'); if (!t) return null; return { kind: 'throw', id: list[i], targets: t };
  }
  if (k === 'sketch') { const t = await chooseTarget(B, 'foe'); return t && { kind: 'sketch', targets: t }; }
  if (k === 'lore') {
    const list = (S.lores || []).filter((x) => LORES[x]); if (!list.length) { await UI.flash(T(['還沒學到青魔法（看敵人使用就會學會）', 'No lores yet (watch a monster use one)']), 0.9); return null; }
    const i = await T1(list.map((x) => ({ label: T(LORES[x].name), right: String(LORES[x].mp), disabled: u.mp < LORES[x].mp })), cmdName('lore')); if (i < 0) return null;
    const L = LORES[list[i]]; const t = await targetsFor(B, L.target); if (!t) return null; return { kind: 'lore', id: list[i], targets: t };
  }
  if (k === 'dance') {
    const list = (S.dances || []).filter((x) => DANCES[x]); if (!list.length) { await UI.flash(T(['還沒學到舞（在各種地形戰鬥就會學會）', 'No dances yet (fight on different ground to learn them)']), 0.9); return null; }
    const i = await T1(list.map((x) => T(DANCES[x].name)), cmdName('dance')); if (i < 0) return null; return { kind: 'dance', id: list[i] };
  }
  if (k === 'magitek') {
    const list = Object.keys(MAGITEK); const i = await T1(list.map((x) => T(MAGITEK[x].name)), cmdName('magitek')); if (i < 0) return null;
    const bm = MAGITEK[list[i]]; const t = await targetsFor(B, bm.target); if (!t) return null; return { kind: 'magitek', id: list[i], targets: t };
  }
  return null;
}

// ---------------------------------------------------------------- the battle itself
const TERRAIN = { field: 'field', wild: 'field', forest: 'forest', desert: 'desert', snow: 'snow', cave: 'cave', dark: 'cave', water: 'water', ruin: 'ruin', castle: 'castle', empire: 'castle', tower: 'castle', sky: 'field', ship: 'field' };
// G: { S, members(), bag, flag, sfx, music, setScene, nextFrame, hd }; foes: monster ids; opts: { bg, boss, music, noEscape, canLose, endAfter }
export async function runBattle(G, foes, opts = {}) {
  const S = G.S, members = G.members().filter((m) => m);
  const B = BT.createBattle(members, foes, { bag: G.bag, bg: opts.bg || 'field', boss: opts.boss, lvUp: opts.lvUp, dances: S.dances });
  B.fx = []; B.pops = []; B.opts = opts;
  G.music(opts.music || (B.boss ? 'boss' : 'battle'));
  G.setScene({ battle: true, draw: (g, dt) => drawBattle(G, B, g, dt) });
  if (B.preempt) await UI.flash(T(['先制攻擊！', 'You strike first!']), 0.8);
  const ctx = { gil: () => S.gil, spend: (n) => { S.gil = Math.max(0, S.gil - n); } };
  let clock = 0;
  while (!B.over) {
    const dt = await G.nextFrame();
    clock += dt;
    if (opts.endAfter && clock > opts.endAfter) { B.over = 'scripted'; break; }
    const r = BT.tick(B, dt);
    if (r.ev.length) await play(G, B, r.ev);
    for (const d of r.due) { if (B.over) break; await play(G, B, BT.perform(B, d.u, d.action, ctx), d.u); }
    for (const u of r.foes) { if (B.over) break; await play(G, B, BT.enemyAct(B, u), u); }
    // party members whose gauge is full, in order
    for (const u of B.party) {
      if (B.over || !BT.alive(u) || u.atb < 100 || u.charge || u.st.sleep || u.st.stop) continue;
      if (BT.isAuto(u)) { await play(G, B, BT.autoAct(B, u), u); continue; }
      B.turn = u;
      const act = await commandFor(G, B, u);
      B.turn = null;
      if (!BT.alive(u) || B.over) continue;
      await play(G, B, BT.perform(B, u, act, ctx), u);
      if (u.id === 'moka' && act.kind === 'dance') u.dancing = act.id;
    }
  }
  const result = B.over;
  await UI.sleep(0.4);
  // clean up statuses that end with the battle
  for (const u of B.party) { u.m.st = {}; if (u.hp <= 0) u.hp = 0; }
  if (result === 'win') await spoils(G, B);
  G.setScene(null);
  return result;
}
async function spoils(G, B) {
  const S = G.S, rw = BT.rewards(B);
  G.music('win');
  S.gil += rw.gil;
  const lines = [T([`得到 ${rw.exp} 經驗值、${rw.gil} 金幣、${rw.ap} AP。`, `Won ${rw.exp} EXP, ${rw.gil} gil and ${rw.ap} AP.`])];
  for (const u of B.party) {
    if (!BT.alive(u) || CHARS[u.id].guest && u.id !== 'leopold') continue;
    for (const up of gainXp(u.m, rw.exp)) {
      lines.push(T([`${T(CHARS[u.id].name)}升到了 ${up.lv} 級！`, `${T(CHARS[u.id].name)} reaches level ${up.lv}!`]));
      for (const s of up.spells) lines.push(T([`${T(CHARS[u.id].name)}學會了「${SPELLS[s].name[0]}」！`, `${T(CHARS[u.id].name)} learns ${SPELLS[s].name[1]}!`]));
      if (u.id === 'sai') for (const b of BLITZ) if (b.lv === up.lv) lines.push(T([`賽伊學會了拳技「${b.name[0]}」！`, `Sai learns the blitz ${b.name[1]}!`]));
      if (u.id === 'kiriyu') IAI.forEach((z, j) => { if (z.lv === up.lv) lines.push(T([`桐生學會了居合第 ${j + 1} 段「${z.name[0]}」！`, `Kiriyu learns iai level ${j + 1}: ${z.name[1]}!`])); });
    }
    for (const s of gainAp(u.m, rw.ap)) lines.push(T([`${T(CHARS[u.id].name)}從星晶學會了「${SPELLS[s].name[0]}」！`, `${T(CHARS[u.id].name)} learns ${SPELLS[s].name[1]} from the Astral!`]));
  }
  // those waiting on the airship (or back at camp) learn from watching: half the experience
  for (const id of S.roster) { if (B.party.some((u) => u.id === id)) continue; const m = S.members[id]; if (m && !CHARS[id].guest) gainXp(m, Math.floor(rw.exp / 2)); }
  for (const it of rw.drops) { bagAdd(S.bag, it); lines.push(T([`得到了${T((ITEMS[it] || GEAR[it] || TOOLS[it]).name)}。`, `Found ${T((ITEMS[it] || GEAR[it] || TOOLS[it]).name)}.`])); }
  const galan = B.party.find((u) => u.id === 'galan');
  if (galan) for (const f of rw.ferals) { galan.m.ferals.push(f); lines.push(T([`嘉藍學會了野性「${MONSTERS[f].name[0]}」！`, `Galan learns the feral ${MONSTERS[f].name[1]}!`])); }
  if (B.party.some((u) => u.id === 'bolo' && BT.alive(u))) for (const l of rw.lores) if (!(S.lores || []).includes(l)) { (S.lores = S.lores || []).push(l); lines.push(T([`波洛學會了青魔法「${LORES[l].name[0]}」！`, `Bolo learns the lore ${LORES[l].name[1]}!`])); }
  if (B.party.some((u) => u.id === 'moka' && BT.alive(u))) { const d = TERRAIN[B.bg] || 'field'; if (!(S.dances || []).includes(d)) { (S.dances = S.dances || []).push(d); lines.push(T([`摩卡學會了「${DANCES[d].name[0]}」！`, `Moka learns the ${DANCES[d].name[1]}!`])); } }
  for (const s of rw.sketches) { S.sketches = S.sketches || []; if (!S.sketches.includes(s)) S.sketches.push(s); }
  await UI.says(lines);
}
