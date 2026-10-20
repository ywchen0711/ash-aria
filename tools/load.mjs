// node tools/load.mjs — build every map and put the story on it (catches mistakes without a browser)
import { buildMaps } from '../js/maps.js?v=1';
import { decorate, CHAPTERS } from '../js/story.js?v=1';
const M = buildMaps();
decorate(M);
let n = 0, npcs = 0, trig = 0;
for (const m of Object.values(M)) { n++; npcs += m.npcs.length; trig += m.triggers.length; }
console.log('maps', n, 'npcs', npcs, 'triggers', trig, 'chapters', Object.keys(CHAPTERS).length);
