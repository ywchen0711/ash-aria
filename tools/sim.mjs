// node tools/sim.mjs — quick balance check: a fight-only party against each zone and the main bosses
import { newMember, maxhp, maxmp } from '../js/party.js?v=2';
import { GEAR, canEquip } from '../js/data.js?v=2';
// the best gear a player could have bought or found by this level
export const tierFor = (lv) => Math.max(1, Math.min(8, 1 + Math.floor(lv / 9)));
export function gearUp(m) {
  const tier = tierFor(m.lv), score = (k) => (GEAR[k].power || 0) * 2 + (GEAR[k].def || 0) + (GEAR[k].mdef || 0);
  for (const slot of ['weapon', 'shield', 'helm', 'armor']) {
    const best = Object.keys(GEAR).filter((k) => GEAR[k].slot === slot && GEAR[k].tier <= tier && canEquip(m.id, k)).sort((a, b) => score(b) - score(a))[0];
    if (best) m.eq[slot] = best;
  }
  m.hp = maxhp(m); m.mp = maxmp(m); return m;
}
import { createBattle, tick, perform, enemyAct, foesOf, isAuto, autoAct } from '../js/battle.js?v=2';
import { encounter } from '../js/monsters.js?v=2';
export function fight(lv, zone, ids, foes, smart = false) {
  const party = ids.map((id) => gearUp(newMember(id, lv)));
  const B = createBattle(party, foes || encounter(zone), { bag: {} });
  let t = 0;
  while (!B.over && t < 900) {
    const r = tick(B, 0.1); t += 0.1;
    for (const u of r.foes) enemyAct(B, u);
    for (const u of r.ready) {
      if (isAuto(u)) { autoAct(B, u); continue; }
      const f = foesOf(B, u)[0]; if (!f) continue;
      // a little sense: heal the weakest when someone is low, otherwise attack
      const low = B.party.filter((p) => p.hp > 0).sort((a, b) => a.hp / a.maxhp - b.hp / b.maxhp)[0];
      if (smart && low && low.hp < low.maxhp * 0.35 && u.m.spells.includes('cure') && u.mp >= 5) perform(B, u, { kind: 'magic', id: u.m.spells.includes('cura') && u.mp >= 25 ? 'cura' : 'cure', targets: [low] });
      else perform(B, u, { kind: 'fight', targets: [f] });
    }
    for (const d of r.due) perform(B, d.u, d.action);
  }
  return { over: B.over, t: Math.round(t) };
}
if (process.argv[1] && process.argv[1].endsWith('sim.mjs')) {
  const P = ['rowan', 'edmund', 'sai', 'selene'];
  for (const [lv, z] of [[3, 'north'], [6, 'desert'], [10, 'kolan'], [14, 'southwind'], [18, 'trench'], [24, 'empire'], [30, 'samar'], [36, 'isle'], [44, 'ruin'], [58, 'spire']]) {
    let w = 0, T = 0; for (let i = 0; i < 20; i++) { const r = fight(lv, z, P); if (r.over === 'win') w++; T += r.t; }
    console.log(z.padEnd(10), 'lv', lv, 'win', w, '/20  avg', Math.round(T / 20), 's');
  }
  for (const [lv, b] of [[6, 'ironshell'], [12, 'barg'], [14, 'octa'], [15, 'tunneldrill'], [18, 'ferry'], [20, 'kross'], [28, 'no128'], [33, 'vissek1'], [38, 'starcore'], [44, 'hopefiend'], [60, 'reddragon'], [64, 'tower1'], [68, 'god3']]) {
    let w = 0, T = 0; for (let i = 0; i < 10; i++) { const r = fight(lv, null, P, [b], true); if (r.over === 'win') w++; T += r.t; }
    console.log('boss', b.padEnd(12), 'lv', lv, 'win', w, '/10  avg', Math.round(T / 10), 's');
  }
}
