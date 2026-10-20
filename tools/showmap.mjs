// node tools/showmap.mjs [world|ruin|<map id>] — print a map as text
import { buildMaps } from '../js/maps.js?v=1';
const M = buildMaps(), id = process.argv[2] || 'world';
const m = M[id]; if (!m) { console.log('no map', id, Object.keys(M).join(' ')); process.exit(1); }
console.log(m.tiles.map((r, y) => String(y).padStart(2) + ' ' + r).join('\n'));
