// node tools/dbg.mjs <boss> <level> — log one fight against a boss
import { newMember } from '../js/party.js?v=3';
import { createBattle, tick, perform, enemyAct, foesOf, unitName } from '../js/battle.js?v=3';
import { gearUp } from './sim.mjs';
const [boss = 'god3', lv = 68] = process.argv.slice(2);
const party = ['rowan', 'edmund', 'sai', 'selene'].map((id) => gearUp(newMember(id, +lv)));
console.log(party.map((m) => `${m.id} hp ${m.hp}`).join(' | '));
const B = createBattle(party, [boss], { bag: {} });
console.log('boss hp', B.mons[0].hp, 'spd', B.mons[0].spd, 'mag', B.mons[0].mag, 'party mdef', B.party.map((u) => u.mdef).join(','), 'def', B.party.map((u) => u.def).join(','));
let t = 0;
const show = (ev) => ev.filter((e) => e.kind === 'dmg' || e.kind === 'cast' || e.kind === 'down').map((e) => e.kind === 'cast' ? `[${e.name[1]}]` : `${unitName(e.t, true)}:${e.kind === 'down' ? 'DOWN' : e.n}`).join(' ');
while (!B.over && t < 300) {
  const r = tick(B, 0.1); t += 0.1;
  for (const u of r.foes) console.log(t.toFixed(1), 'BOSS', show(enemyAct(B, u)));
  for (const u of r.ready) { const f = foesOf(B, u)[0]; if (f) perform(B, u, { kind: 'fight', targets: [f] }); }
}
console.log(B.over, Math.round(t), 'boss hp left', B.mons[0].hp);
