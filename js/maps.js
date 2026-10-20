// ASH ARIA — the geometry of the world: two world maps (before and after the Fall), towns, castles, dungeons and set pieces.
// Maps are rows of characters; TILE says what each character is. The story (story.js) adds the people and events.

export const TILE = {
  '.': 'grass', ',': 'path', F: 'flowers', T: 'tree', w: 'water', _: 'stone', '=': 'wood', r: 'carpet', '#': 'wall', ':': 'floor',
  d: 'door', c: 'counter', B: 'bed', t: 'table', o: 'barrel', k: 'throne', p: 'pillar', S: 'statue', g: 'grave', '|': 'fence', V: 'crack',
  '<': 'stairsup', '>': 'stairsdown', A: 'altar', L: 'lava', '~': 'sea', m: 'miasma', ' ': 'void', f: 'forest', h: 'hills', '^': 'mountain',
  s: 'sand', v: 'swamp', b: 'bridge', x: 'rock', C: 'castle', O: 'town', H: 'village', D: 'cave', W: 'tower', Q: 'shrine', Z: 'darkcastle',
  '*': 'snowfield', a: 'ash', j: 'deadtree', i: 'ice', M: 'metal', e: 'deck', K: 'crystal', E: 'machine', X: 'cwall',
};
export const WALK = new Set(['grass', 'path', 'flowers', 'stone', 'wood', 'carpet', 'floor', 'door', 'stairsup', 'stairsdown', 'sand', 'swamp', 'lava', 'forest', 'hills', 'bridge',
  'castle', 'town', 'village', 'cave', 'tower', 'shrine', 'darkcastle', 'snowfield', 'ash', 'ice', 'metal', 'deck', 'crystal', 'miasma', 'deadtree']);
// where the airship may land
export const LANDABLE = new Set(['grass', 'path', 'flowers', 'sand', 'snowfield', 'ash', 'hills', 'swamp']);
export function rng(s) { let a = s >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const grid = (w, h, ch) => Array.from({ length: h }, () => Array(w).fill(ch));
const rows = (g) => g.map((r) => r.join(''));
const N = (zh, en) => [zh, en];

// ---------------------------------------------------------------- the two worlds
export const WW = 80, WH = 56;
// every place on the world maps: id (= the map it leads to), where, the icon, the name
export const PLACES_B = [
  { id: 'frostvale', x: 13, y: 6, icon: 'O', name: N('霜石鎮', 'Frostvale') },
  { id: 'sularis', x: 9, y: 19, icon: 'C', name: N('蘇拉斯風琴城', 'Sularis') },
  { id: 'kolan', x: 22, y: 17, icon: 'D', name: N('克蘭山', 'Mt. Kolan') },
  { id: 'hideout', x: 33, y: 12, icon: 'H', name: N('無聲者之谷', 'Valley of the Unsung') },
  { id: 'river', x: 35, y: 16, icon: 'D', name: N('雷鳴河', 'Thunder River') },
  { id: 'southwind', x: 16, y: 29, icon: 'O', name: N('南風鎮', 'Southwind') },
  { id: 'swtunnel', x: 13, y: 25, icon: 'D', name: N('南風地下道', 'Southwind Tunnels') },
  { id: 'camp', x: 40, y: 25, icon: 'Z', name: N('聖詠院營地', 'Choir Camp') },
  { id: 'kasumi', x: 45, y: 21, icon: 'C', name: N('霞之國', 'Kasumi') },
  { id: 'ferry', x: 43, y: 30, icon: 'D', name: N('沉鐘沼澤', 'Drowned Bell Marsh') },
  { id: 'wildhut', x: 52, y: 29, icon: 'H', name: N('荒原小屋', 'Wildlands Hut') },
  { id: 'trench', x: 55, y: 35, icon: 'D', name: N('海蛇洞窟', 'Serpent Trench') },
  { id: 'rainhold', x: 24, y: 41, icon: 'O', name: N('雨城拉斯特', 'Rainhold') },
  { id: 'gilden', x: 8, y: 44, icon: 'O', name: N('金鍍城', 'Gilden') },
  { id: 'opera', x: 16, y: 49, icon: 'W', name: N('月光音樂廳', 'Moonlight Concert Hall') },
  { id: 'vexhold', x: 58, y: 45, icon: 'Z', name: N('聖詠都威克斯', 'Vexhold') },
  { id: 'gate', x: 71, y: 40, icon: 'D', name: N('始源之門', 'Origin Gate') },
  { id: 'samar', x: 69, y: 51, icon: 'H', name: N('書庫村薩瑪', 'Samar') },
  { id: 'valley', x: 75, y: 46, icon: 'D', name: N('星靈之谷', 'Astral Valley') },
];
export const PLACES_R = [
  { id: 'solitary', x: 71, y: 21, icon: 'H', name: N('燈塔孤島', 'Lighthouse Isle') },
  { id: 'tidewatch', x: 57, y: 48, icon: 'O', name: N('潮望鎮', 'Tidewatch') },
  { id: 'nikko', x: 38, y: 33, icon: 'O', name: N('尼可鎮', 'Nikko') },
  { id: 'hopehaven', x: 50, y: 29, icon: 'H', name: N('希望村', 'Hopehaven') },
  { id: 'crumbleton', x: 30, y: 31, icon: 'O', name: N('傾城', 'Crumbleton') },
  { id: 'r_sularis', x: 9, y: 19, icon: 'D', name: N('沉沙之城', 'The Sunken City') },
  { id: 'tomb', x: 24, y: 44, icon: 'D', name: N('雲鯨之墓', 'The Whale\'s Graveyard') },
  { id: 'dream', x: 45, y: 21, icon: 'Z', name: N('霞之國廢墟', 'Ruins of Kasumi') },
  { id: 'phoenixcave', x: 6, y: 9, icon: 'D', name: N('回音洞窟', 'Echo Cave') },
  { id: 'r_wildhut', x: 53, y: 25, icon: 'H', name: N('荒原老屋', 'The Ringmaster\'s Hut') },
  { id: 'colosseum', x: 18, y: 40, icon: 'C', name: N('鬥技場', 'Colosseum') },
  { id: 'culttower', x: 67, y: 50, icon: 'W', name: N('沉默教團之塔', 'Tower of the Silent Order') },
  { id: 'r_frostvale', x: 13, y: 6, icon: 'O', name: N('霜石鎮', 'Frostvale') },
  { id: 'wormbelly', x: 14, y: 21, icon: 'D', name: N('鏡蟲之穴', 'The Mirror Worm\'s Lair') },
  { id: 'spire', x: 40, y: 26, icon: 'Z', name: N('安息之塔', 'Tower of Rest') },
  { id: 'lair1', x: 23, y: 9, icon: 'D', name: N('赤之獸的巢', 'Den of the Crimson Discord') },
  { id: 'lair2', x: 6, y: 4, icon: 'D', name: N('霜之獸的巢', 'Den of the Rime Discord') },
  { id: 'lair3', x: 66, y: 41, icon: 'D', name: N('嵐之獸的巢', 'Den of the Gale Discord') },
  { id: 'lair4', x: 30, y: 21, icon: 'D', name: N('岩之獸的巢', 'Den of the Stone Discord') },
  { id: 'lair5', x: 12, y: 50, icon: 'D', name: N('光之獸的巢', 'Den of the Light Discord') },
  { id: 'lair6', x: 47, y: 35, icon: 'D', name: N('骸之獸的巢', 'Den of the Bone Discord') },
  { id: 'lair7', x: 74, y: 44, icon: 'D', name: N('金之獸的巢', 'Den of the Gold Discord') },
  { id: 'lair8', x: 36, y: 6, icon: 'D', name: N('空之獸的巢', 'Den of the Void Discord') },
];
// the world before the Fall
function buildBalance() {
  const R = rng(1983), t = grid(WW, WH, '~');
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < WW && y < WH) t[y][x] = c; };
  const get = (x, y) => (t[y] && t[y][x]) || '~';
  const blob = (cx, cy, rx, ry, c = '.') => { for (let y = cy - ry - 2; y <= cy + ry + 2; y++) for (let x = cx - rx - 2; x <= cx + rx + 2; x++) { const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + (R() - 0.5) * 0.18; if (d < 1) set(x, y, c); } };
  // the great northern continent, the southwestern lands and the Empire
  blob(22, 13, 20, 11); blob(14, 25, 9, 7); blob(32, 24, 12, 8); blob(47, 24, 10, 9); blob(54, 32, 6, 5);
  blob(14, 45, 12, 8); blob(24, 40, 5, 4);
  blob(60, 46, 16, 8); blob(72, 42, 6, 5);
  // ground cover: snow in the north, the Sularis desert, forests and hills from noise
  const nz = (x, y) => (Math.sin(x * 0.41 + 1.3) + Math.sin(y * 0.33 + 0.4) + Math.sin((x + y) * 0.21 + 2.1) + Math.sin((x - y) * 0.29)) / 4 + (R() - 0.5) * 0.3;
  for (let y = 0; y < WH; y++) for (let x = 0; x < WW; x++) {
    if (get(x, y) !== '.') continue;
    const n = nz(x, y);
    if (y < 11 && x < 34) t[y][x] = n > 0.42 ? 'f' : '*';
    else if (x < 19 && y >= 13 && y <= 23) t[y][x] = n > 0.55 ? 'h' : 's';
    else if (n > 0.4) t[y][x] = 'f'; else if (n < -0.5) t[y][x] = 'h';
  }
  // the Wildlands are open grass; the Empire's plains are scrub
  for (let y = 22; y < 36; y++) for (let x = 47; x < 60; x++) if (['f', 'h'].includes(get(x, y))) t[y][x] = '.';
  // Mt. Kolan: a ridge dividing west from east; only the mountain's caves cross it
  for (let y = 3; y < 30; y++) for (let x = 25; x <= 27; x++) if (get(x, y) !== '~') t[y][x] = '^';
  // the Thunder River runs from the hideout's hills to the southern sea, walling off the east
  let rx = 36; for (let y = 13; y < 34; y++) { set(rx, y, '~'); set(rx + 1, y, '~'); if (y % 4 === 0 && rx < 39) rx++; }
  // a ridge from the river to the eastern sea keeps the north-east quiet
  for (let x = 37; x < 56; x++) for (const y of [14, 15]) if (get(x, y) !== '~') t[y][x] = '^';
  // mountains ringing the Empire's capital plain, and the Astral Gate range
  for (let x = 46; x < 76; x++) if (get(x, 38) !== '~') set(x, 38, '^');
  for (let y = 39; y < 46; y++) for (let x = 68; x < 70; x++) if (get(x, y) !== '~') set(x, y, '^');
  // a straight road south from Frostvale, and the causeway from Southwind to the south-west (closed until the Frostvale battle)
  for (let y = 7; y < 29; y++) if (!['~'].includes(get(15, y)) && get(15, y) !== '^') set(15, y, ',');
  for (let y = 30; y < 38; y++) set(16, y, 'b');
  for (let x = 16; x < 24; x++) set(x, 38, ',');
  // keep the places on open ground
  for (const p of PLACES_B) { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const c = get(p.x + dx, p.y + dy); if (c !== '~' && c !== '^' && c !== 'b') set(p.x + dx, p.y + dy, c === 's' || c === '*' ? c : '.'); } set(p.x, p.y, p.icon); }
  // the bridge over the Thunder River (opened by the story)
  set(38, 21, 'b'); set(39, 21, 'b');
  // the east side of Kolan (where the mountain's caves come out)
  set(28, 17, '.'); set(29, 17, '.'); set(28, 18, '.');
  return rows(t);
}
// the world after the Fall: the same lands, scorched and broken, with the Spire at the centre
function buildRuin(balance) {
  const R = rng(1994), t = balance.map((r) => r.split(''));
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < WW && y < WH) t[y][x] = c; };
  const get = (x, y) => (t[y] && t[y][x]) || '~';
  // places of the old world are gone; the land burns
  for (let y = 0; y < WH; y++) for (let x = 0; x < WW; x++) {
    const c = get(x, y);
    if ('CDOHWZ'.includes(c)) t[y][x] = 'a';
    else if (c === '.' || c === 'F' || c === ',') t[y][x] = R() < 0.08 ? 'j' : 'a';
    else if (c === 'f') t[y][x] = 'j';
    else if (c === 'b') t[y][x] = ',';
  }
  // the land broke: rifts of sea, and new land rose where the river was
  for (let y = 13; y < 34; y++) for (let x = 35; x < 41; x++) if (get(x, y) === '~') t[y][x] = 'a';
  for (const [x0, y0, dx, dy, n] of [[4, 28, 1, 0, 9], [30, 4, 0, 1, 5], [60, 52, 1, 0, 8], [8, 12, 1, 1, 6]]) for (let k = 0; k < n; k++) set(x0 + dx * k, y0 + dy * k, '~');
  // the Spire on its crater
  for (let y = 18; y < 34; y++) for (let x = 32; x < 48; x++) { const d = Math.hypot(x - 40, (y - 26) * 1.2); if (d < 3.2) set(x, y, 'm'); else if (d < 7 && get(x, y) !== '~') set(x, y, R() < 0.3 ? 'x' : 'a'); }
  // a land bridge from the Empire to the old heartland (the sea fell back)
  for (let y = 33; y < 43; y++) for (let x = 43; x < 50; x++) set(x, y, 'a');
  for (let x = 46; x < 76; x++) if (get(x, 38) === '^' && (x === 50 || x === 51 || x === 57)) set(x, 38, 'a');
  // the Kolan ridge is broken in two places
  for (const y of [11, 12, 22, 23]) for (let x = 25; x <= 27; x++) set(x, y, 'a');
  // the river's ridge collapsed
  for (let x = 44; x < 47; x++) for (const y of [14, 15]) set(x, y, 'a');
  // the Solitary Isle, far out to sea
  for (let y = 18; y < 25; y++) for (let x = 68; x < 75; x++) if (Math.hypot(x - 71, (y - 21) * 1.2) < 3.6) set(x, y, 'a');
  for (const p of PLACES_R) { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const c = get(p.x + dx, p.y + dy); if (!['~', 'm', '^'].includes(c)) set(p.x + dx, p.y + dy, c === '*' ? '*' : 'a'); } set(p.x, p.y, p.icon); }
  return rows(t);
}
// blocks that open with the story: { x, y, flag, tile, world }
export const BARRIERS = [
  { world: 'b', x: 16, y: 30, flag: 'sw_open', tile: 'rock' },
  { world: 'b', x: 38, y: 21, flag: 'east_bridge', tile: 'sea', under: 'b' },
  { world: 'b', x: 39, y: 21, flag: 'east_bridge', tile: 'sea', under: 'b' },
];
// monsters by place on the world map
export function worldZone(world, x, y) {
  if (world === 'b') {
    if (y < 11 && x < 34) return 'north';
    if (x < 19 && y >= 13 && y <= 23) return 'desert';
    if (x < 25 && y < 34) return y > 24 ? 'southwind' : 'kolan';
    if (x < 36 && y < 34) return 'river';
    if (x >= 46 && y < 37) return 'wild';
    if (x < 46 && y < 37) return 'camp';
    if (y >= 37 && x < 30) return 'rain';
    if (x >= 64) return 'samar';
    return 'empire';
  }
  if (Math.hypot(x - 40, y - 26) < 9) return 'spire';
  if (y < 12) return 'icecave';
  if (y > 40 && x > 44) return 'ruinsouth';
  return 'ruin';
}

// ---------------------------------------------------------------- towns: up to six buildings around two streets
// buildings: [{ kind: inn | item | weapon | armor | relic | tools | house | pub | save | chapel | hall, name? }]
const SLOT = [[2, 1], [16, 1], [2, 7], [16, 7], [2, 13], [16, 13]];
export function makeTown(o) {
  const W = 26, H = 20, t = grid(W, H, o.ground || '.');
  const edge = o.edge || 'T';
  for (let x = 0; x < W; x++) { t[0][x] = edge; t[H - 1][x] = edge; } for (let y = 0; y < H; y++) { t[y][0] = edge; t[y][W - 1] = edge; }
  for (let y = 0; y < H; y++) { t[y][12] = ','; t[y][13] = ','; }
  for (const y of [6, 12, 18]) for (let x = 1; x < W - 1; x++) t[y][x] = ',';
  if (!o.north) { t[0][12] = edge; t[0][13] = edge; }
  const spots = { };
  (o.buildings || []).forEach((b, i) => {
    if (!b) return;
    const [x, y] = SLOT[i], bw = 8, bh = 5;
    for (let j = 0; j < bh; j++) for (let k = 0; k < bw; k++) t[y + j][x + k] = j === 0 || j === bh - 1 || k === 0 || k === bw - 1 ? '#' : '=';
    t[y + bh - 1][x + 3] = 'd';
    const k = b.kind;
    if (k === 'inn') { t[y + 1][x + 1] = 'B'; t[y + 1][x + 2] = 'B'; t[y + 1][x + 5] = 'B'; t[y + 1][x + 6] = 'B'; }
    if (['item', 'weapon', 'armor', 'relic', 'tools'].includes(k)) for (let q = 1; q <= 6; q++) t[y + 2][x + q] = 'c';
    if (k === 'house') { t[y + 1][x + 6] = 'B'; t[y + 2][x + 1] = 't'; t[y + 1][x + 1] = 'o'; }
    if (k === 'pub') { t[y + 2][x + 2] = 't'; t[y + 2][x + 5] = 't'; t[y + 1][x + 6] = 'o'; t[y + 1][x + 1] = 'c'; }
    if (k === 'save' || k === 'chapel') { t[y + 1][x + 3] = k === 'save' ? 'K' : 'A'; t[y + 1][x + 1] = 'p'; t[y + 1][x + 6] = 'p'; }
    if (k === 'hall') { t[y + 1][x + 3] = 'k'; for (let q = 1; q <= 6; q++) t[y + 3][x + q] = 'r'; }
    spots[i] = { x, y, keeper: ['item', 'weapon', 'armor', 'relic', 'tools'].includes(k) ? [x + 3, y + 1] : k === 'inn' ? [x + 4, y + 2] : k === 'pub' ? [x + 1, y + 2] : [x + 4, y + 2], door: [x + 3, y + bh - 1], kind: k, name: b.name };
  });
  for (const [x, y, c] of o.deco || []) t[y][x] = c;
  return { w: W, h: H, tiles: rows(t), theme: o.theme || 'town', look: o.look, music: o.music || 'town', town: true, name: o.name, tier: o.tier || 1, spots, npcs: [], chests: [], warps: [], checks: {}, triggers: [], bg: o.bg || 'field' };
}

// ---------------------------------------------------------------- dungeons: rooms and corridors from a seed, floor after floor
function makeFloor(seed, opts = {}) {
  const W = opts.w || 28, H = opts.h || 20, R = rng(seed), t = grid(W, H, '#'), rooms = [];
  const cw = Math.floor((W - 2) / 3), chh = Math.floor((H - 2) / 2);
  for (let cy = 0; cy < 2; cy++) for (let cx = 0; cx < 3; cx++) {
    const w = 4 + Math.floor(R() * (cw - 5)), h = 3 + Math.floor(R() * (chh - 4)), x = 1 + cx * cw + 1 + Math.floor(R() * Math.max(1, cw - w - 1)), y = 1 + cy * chh + 1 + Math.floor(R() * Math.max(1, chh - h - 1));
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) t[y + j][x + i] = ':';
    rooms.push({ x, y, w, h, cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2) });
  }
  const dig = (a, b) => { let x = a.cx, y = a.cy; const go = (tx, ty) => { while (x !== tx) { x += Math.sign(tx - x); t[y][x] = ':'; } while (y !== ty) { y += Math.sign(ty - y); t[y][x] = ':'; } }; if (R() < 0.5) { go(b.cx, y); go(b.cx, b.cy); } else { go(x, b.cy); go(b.cx, b.cy); } };
  const order = R() < 0.5 ? [0, 1, 2, 5, 4, 3] : [3, 4, 5, 2, 1, 0];
  for (let i = 0; i < 5; i++) dig(rooms[order[i]], rooms[order[i + 1]]);
  if (R() < 0.7) dig(rooms[order[0]], rooms[order[5]]); if (R() < 0.5) dig(rooms[1], rooms[4]);
  if (opts.lava) for (let i = 0; i < 8; i++) { const r = rooms[Math.floor(R() * 6)]; const x = r.x + Math.floor(R() * r.w), y = r.y + Math.floor(R() * r.h); if (t[y][x] === ':' && R() < 0.6) t[y][x] = 'L'; }
  if (opts.water) for (let i = 0; i < 10; i++) { const r = rooms[Math.floor(R() * 6)]; const x = r.x + Math.floor(R() * r.w), y = r.y + Math.floor(R() * r.h); if (t[y][x] === ':' && x !== r.cx && y !== r.cy) t[y][x] = 'w'; }
  return { W, H, t, start: rooms[order[0]], end: rooms[order[5]], mid: [rooms[order[1]], rooms[order[2]], rooms[order[3]], rooms[order[4]]] };
}
// a dungeon of several floors: '<' back up (the first floor's leads outside), '>' down; a save crystal half way,
// chests, and the last floor's far room holds the boss (a trigger the story fills in)
export function makeDungeon(id, o) {
  const out = {}, floors = o.floors || 2;
  for (let f = 1; f <= floors; f++) {
    const d = makeFloor((o.seed || 7) + f * 131, { w: o.w, h: o.h, lava: o.lava, water: o.water }), key = f === 1 ? id : `${id}_${f}`;
    // stairs go in a room's top row with solid wall behind them (as close to the middle as possible)
    const nook = (r) => { const xs = []; for (let x = r.x; x < r.x + r.w; x++) if (d.t[r.y - 1][x] === '#') xs.push(x); xs.sort((a, b) => Math.abs(a - r.cx) - Math.abs(b - r.cx)); return xs.length ? [xs[0], r.y] : [r.cx, r.cy]; };
    [d.start.cx, d.start.cy] = nook(d.start);
    d.t[d.start.cy][d.start.cx] = '<';
    if (f < floors) { [d.end.cx, d.end.cy] = nook(d.end); d.t[d.end.cy][d.end.cx] = '>'; }
    const chests = [];
    (o.chests && o.chests[f] || []).forEach((c, i) => { const r = d.mid[i % 4], x = r.x + (i % 2 ? r.w - 1 : 0), y = r.y + (i >= 2 ? r.h - 1 : 0); chests.push({ x, y, ...c, id: `${key}_${i}` }); });
    if (f === Math.ceil(floors / 2) || f === floors) { const r = d.mid[f === floors ? 3 : 1]; if (d.t[r.cy][r.cx] === ':') d.t[r.cy][r.cx] = 'K'; }
    const warps = [{ x: d.start.cx, y: d.start.cy, to: f === 1 ? 'world' : (f === 2 ? id : `${id}_${f - 1}`), end: true }];
    if (f < floors) warps.push({ x: d.end.cx, y: d.end.cy, to: `${id}_${f + 1}` });
    out[key] = { w: d.W, h: d.H, tiles: rows(d.t), theme: o.theme || 'cave', look: o.look, music: o.music || 'dungeon', dungeon: true, enc: o.enc, bg: o.bg || 'cave', name: o.name, floor: floors > 1 ? f : 0,
      exitPlace: o.exitPlace || id, chests, warps, checks: {}, triggers: [], npcs: [], anchor: { start: [d.start.cx, d.start.cy], end: [d.end.cx, d.end.cy] }, last: f === floors, base: id };
  }
  return out;
}

// ---------------------------------------------------------------- set pieces drawn by hand
const art = (lines) => lines.map((l) => l.padEnd(lines[0].length, ' '));
export const SETS = {
  // the opera house: the stage, the seats, the dressing room, and the rafters above
  opera: { theme: 'opera', look: 'opera', music: 'opera', name: N('月光音樂廳', 'Moonlight Concert Hall'), tiles: art([
    '############################',
    '#==========================#',
    '#=pp=====rrrrrrrrrr=====pp=#',
    '#=======rrrrrrrrrrrr=======#',
    '#======rrrrrrrrrrrrrr======#',
    '########rrrrrrrrrrrr########',
    '#::::::#,,,,,,,,,,,,#::::::#',
    '#:t::t:#,,,,,,,,,,,,#:B::o:#',
    '#::::::d,,,,,,,,,,,,d::::::#',
    '########,,,,,,,,,,,,########',
    '#tttt,tttt,,,,,tttt,tttt####',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,K#',
    '#tttt,tttt,,,,,tttt,tttt####',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#tttt,tttt,,,,,tttt,tttt,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '############dd##############',
  ]) },
  // the imperial camp by the river
  camp: { theme: 'empire', look: 'empire', music: 'empire', name: N('聖詠院營地', 'Choir Camp'), enc: 'camp', bg: 'field', tiles: art([
    '....T....T.....T....T.....',
    '.|||||||||||||||||||||||..',
    '.|MMMMMM......MMMMMM...|..',
    '.|M#==#M......M#==#M...|..',
    '.|M#==#M..E...M#==#M...|..',
    '.|M##d#M......M##d#M...|..',
    '.|......,,,,,,,........|.~',
    '.|..o...,....,....o....|~~',
    '.|......,....,.........~~~',
    '.|.E....,,,,,,.....E..~~~~',
    '.|....................~~~~',
    '.|||||||,,|||||||||||~~~~~',
    '........,,.........~~~~~~~',
  ]) },
  // the throne hall and banquet of the Emperor
  palace: { theme: 'castle', look: 'empire', music: 'empire', name: N('聖詠院大殿', 'Great Hall of the Choir'), tiles: art([
    '##########################',
    '#pp:::::::::k::::::::::pp#',
    '#::::::::rrrrrr::::::::::#',
    '#p:::::::rrrrrr:::::::::p#',
    '#::tttttt:rrrr:tttttt::::#',
    '#::tttttt:rrrr:tttttt::::#',
    '#p::::::::rrrr::::::::::p#',
    '#:::::::::rrrr:::::::::::#',
    '#pp:::::::rrrr:::::::::pp#',
    '#########:rrrr:###########',
    '#:::::::#:rrrr:#:::::::::#',
    '#:B:::o:d:rrrr:d::::::K::#',
    '#:::::::#:rrrr:#:::::::::#',
    '##########dd##############',
  ]) },
  // the three Pillars on the Floating Isle
  pillars: { theme: 'shrine', look: 'shrine', music: 'vissek', name: N('三鐘之間', 'Hall of Three Bells'), tiles: art([
    '                          ',
    '   ____________________   ',
    '  __S______S_______S___   ',
    '  ____________________    ',
    '   ____rrrrrrrrrr_____    ',
    '   _____rrrrrrrr______    ',
    '    _____rrrrrr______     ',
    '     _____rrrr_____       ',
    '      ____rrrr____        ',
    '       ___rrrr___         ',
    '        __rrrr__          ',
    '         _rrrr_           ',
    '          rrrr            ',
  ]) },
  // the Solitary Isle: Tobin's house, the beach, the cliff
  solitary: { theme: 'ruin', look: 'ruin', music: 'ruin', name: N('燈塔孤島', 'Lighthouse Isle'), tiles: art([
    '~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~^^^^^^^^~~~~~~~~~',
    '~~~~~~^^aaaaaa^^~~~~~~~~',
    '~~~~~^aaaaaaaaaa^~~~~~~~',
    '~~~~~aaaaj###aaaa~~~~~~~',
    '~~~~aaaaaa#=B#aaaaa~~~~~',
    '~~~~aajaaa#=t#aaaaaa~~~~',
    '~~~~aaaaaa#d##aaaaaaa~~~',
    '~~~~aaaaaaaaaaaaajaaaa~~',
    '~~~~~aaaaaaaaaaaaaaaaa~~',
    '~~~~~~ssssssaaaaaaaaa~~~',
    '~~~~~~~sssssssssaaaa~~~~',
    '~~~~~~~~~~~sssssss~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~',
  ]) },
  // the god's throne at the top of the Spire
  throne: { theme: 'dark', look: 'dark', music: 'final', name: N('塔頂', 'The Summit'), tiles: art([
    '  ##################  ',
    '  #mmmmmmmkmmmmmmm#   ',
    '  #mmmmmm_____mmmm#   ',
    '  #mmmmm_______mmm#   ',
    '  #mmmm____r____mm#   ',
    '  #mmm_____r_____m#   ',
    '  #mm______r______#   ',
    '  #m_______r______#   ',
    '  #________r______#   ',
    '  ##########<######   ',
  ]) },
  // the cloud whale's back
  deck: { theme: 'ship', look: 'ship', music: 'airship', name: N('雲鯨之背', 'Nimbus\'s Back'), tiles: art([
    '                        ',
    '   eeeeeeeeeeeeeeeee    ',
    '  eeeeeeeeeeeeeeeeeee   ',
    ' eeeepeeeeeeeeeeepeeee  ',
    ' eeeeeeeeeeEeeeeeeeeeee ',
    ' eeeeeeeeeeeeeeeeeeeeee ',
    '  eeeeeeeee<eeeeeeeeee  ',
    '   eeeeeeeeeeeeeeeeee   ',
    '                        ',
  ]) },
};

// ---------------------------------------------------------------- every map in the game
const TOWNS = {
  frostvale: { name: N('霜石鎮', 'Frostvale'), theme: 'snow', look: 'snow', ground: '*', edge: 'T', music: 'snow', tier: 1, bg: 'snow', north: true,
    buildings: [{ kind: 'house', name: N('約恩的家', 'Jon\'s House') }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'hall', name: N('長老之家', 'Elder\'s Hall') }] },
  sularis: { name: N('蘇拉斯風琴城', 'Sularis'), theme: 'castle', look: 'castle', ground: '_', edge: '#', music: 'castle', tier: 1, bg: 'desert',
    buildings: [{ kind: 'hall', name: N('風琴室', 'Organ Hall') }, { kind: 'item' }, { kind: 'inn' }, { kind: 'weapon' }, { kind: 'house', name: N('工坊', 'Workshop') }, { kind: 'tools' }] },
  hideout: { name: N('無聲者之谷', 'Valley of the Unsung'), theme: 'cave', look: 'cave', ground: ':', edge: '#', music: 'dawn', tier: 2, bg: 'cave',
    buildings: [{ kind: 'hall', name: N('長老之家', 'Elder\'s House') }, { kind: 'item' }, { kind: 'inn' }, { kind: 'armor' }] },
  southwind: { name: N('南風鎮', 'Southwind'), theme: 'town', ground: '.', edge: 'T', music: 'town', tier: 2, bg: 'field',
    buildings: [{ kind: 'pub' }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'house', name: N('富商的宅邸', 'Merchant\'s Manor') }] },
  kasumi: { name: N('霞之國', 'Kasumi'), theme: 'castle', look: 'castle', ground: '_', edge: '#', music: 'castle', tier: 2, bg: 'castle',
    buildings: [{ kind: 'hall', name: N('天守', 'Keep') }, { kind: 'house', name: N('桐生的家', 'Kiriyu\'s Home') }, { kind: 'save' }, { kind: 'house' }] },
  wildhut: { name: N('荒原小屋', 'Wildlands Hut'), theme: 'town', ground: '.', edge: 'T', music: 'field', tier: 2, bg: 'wild',
    buildings: [{ kind: 'house', name: N('獵人小屋', 'Hunter\'s Hut') }, { kind: 'item' }, null, { kind: 'inn' }] },
  rainhold: { north: true, name: N('雨城拉斯特', 'Rainhold'), theme: 'castle', look: 'castle', ground: '_', edge: '#', music: 'dungeon', tier: 3, bg: 'castle', enc: 'rain',
    buildings: [{ kind: 'pub' }, { kind: 'house' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'item' }, { kind: 'relic' }] },
  gilden: { name: N('金鍍城', 'Gilden'), theme: 'town', ground: '.', edge: 'T', music: 'town', tier: 3, bg: 'field',
    buildings: [{ kind: 'house', name: N('歐威爾公爵的宅邸', 'Duke Orwell\'s Manor') }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'relic' }] },
  vexhold: { north: true, name: N('聖詠都威克斯', 'Vexhold'), theme: 'empire', look: 'empire', ground: 'M', edge: '#', music: 'empire', tier: 4, bg: 'empire',
    buildings: [{ kind: 'pub' }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'relic' }] },
  samar: { name: N('書庫村薩瑪', 'Samar'), theme: 'town', ground: '.', edge: 'T', music: 'town', tier: 4, bg: 'forest',
    buildings: [{ kind: 'house', name: N('波洛的家', 'Bolo\'s House') }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'relic' }] },
  // after the Fall
  tidewatch: { name: N('潮望鎮', 'Tidewatch'), theme: 'ruin', look: 'ruin', ground: 'a', edge: 'j', music: 'ruin', tier: 5, bg: 'ruin',
    buildings: [{ kind: 'pub' }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'relic' }] },
  nikko: { name: N('尼可鎮', 'Nikko'), theme: 'ruin', look: 'ruin', ground: 'a', edge: 'j', music: 'ruin', tier: 5, bg: 'ruin',
    buildings: [{ kind: 'pub' }, { kind: 'item' }, { kind: 'tools' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'weapon' }] },
  hopehaven: { name: N('希望村', 'Hopehaven'), theme: 'ruin', look: 'ruin', ground: 'a', edge: 'j', music: 'hope', tier: 5, bg: 'ruin',
    buildings: [{ kind: 'house', name: N('孤兒們的家', 'The Children\'s House') }, { kind: 'house' }, { kind: 'inn' }, { kind: 'item' }] },
  crumbleton: { name: N('傾城', 'Crumbleton'), theme: 'ruin', look: 'ruin', ground: 'a', edge: 'j', music: 'ruin', tier: 5, bg: 'ruin',
    buildings: [{ kind: 'house', name: N('快要倒塌的房子', 'The Leaning House') }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'relic' }] },
  r_wildhut: { name: N('荒原老屋', 'The Ringmaster\'s Hut'), theme: 'ruin', look: 'ruin', ground: 'a', edge: 'j', music: 'ruin', tier: 6, bg: 'ruin',
    buildings: [{ kind: 'house', name: N('老人的家', 'The Old Man\'s House') }, { kind: 'item' }] },
  r_frostvale: { name: N('霜石鎮', 'Frostvale'), theme: 'snow', look: 'snow', ground: '*', edge: 'T', music: 'snow', tier: 6, bg: 'snow', north: true,
    buildings: [{ kind: 'house' }, { kind: 'item' }, { kind: 'weapon' }, { kind: 'armor' }, { kind: 'inn' }, { kind: 'relic' }] },
  colosseum: { name: N('鬥技場', 'Colosseum'), theme: 'castle', look: 'castle', ground: '_', edge: '#', music: 'castle', tier: 7, bg: 'castle',
    buildings: [{ kind: 'hall', name: N('競技場', 'The Arena') }, { kind: 'item' }, { kind: 'relic' }, { kind: 'inn' }] },
};
const DUNGEONS = {
  mine:      { name: N('霜石礦坑', 'Frostvale Mines'), floors: 2, theme: 'cave', enc: 'mine', seed: 11, bg: 'cave', exitPlace: 'frostvale', chests: { 1: [{ item: 'potion' }, { gold: 150 }], 2: [{ item: 'phoenix' }, { item: 'sprintshoes' }] } },
  kolan:     { name: N('克蘭山', 'Mt. Kolan'), floors: 3, theme: 'cave', enc: 'kolan', seed: 23, bg: 'cave', chests: { 1: [{ item: 'potion' }, { item: 'buckler' }], 2: [{ gold: 500 }, { item: 'ether' }], 3: [{ item: 'mithrilclaw' }, { item: 'phoenix' }] } },
  river:     { name: N('雷鳴河', 'Thunder River'), floors: 3, theme: 'cave', look: 'cave', enc: 'river', seed: 31, bg: 'water', water: true, chests: { 1: [{ item: 'potion' }], 2: [{ item: 'echo' }, { gold: 700 }], 3: [{ item: 'ether' }] } },
  swtunnel:  { name: N('南風地下道', 'Southwind Tunnels'), floors: 2, theme: 'cave', enc: 'southwind', seed: 41, bg: 'cave', chests: { 1: [{ item: 'hipotion' }, { gold: 900 }], 2: [{ item: 'mithrilvest' }, { item: 'ether' }] } },
  ferry:     { name: N('沉鐘沼澤', 'Drowned Bell Marsh'), floors: 3, theme: 'dark', look: 'dark', enc: 'ferry', seed: 53, bg: 'dark', music: 'sad', chests: { 1: [{ item: 'phoenix' }], 2: [{ item: 'kotetsu' }, { gold: 1200 }], 3: [{ item: 'whitecape' }] } },
  trench:    { name: N('海蛇洞窟', 'Serpent Trench'), floors: 2, theme: 'cave', enc: 'trench', seed: 61, bg: 'water', water: true, chests: { 1: [{ item: 'hipotion' }, { gold: 1500 }], 2: [{ item: 'trident' }] } },
  raintower: { name: N('雨城之塔', 'Rainhold Tower'), floors: 3, theme: 'tower', look: 'tower', enc: 'rain', seed: 71, bg: 'castle', exitPlace: 'rainhold', chests: { 1: [{ item: 'ether' }, { gold: 2000 }], 2: [{ item: 'bards' }, { item: 'hipotion' }], 3: [{ item: 'regal' }, { item: 'charmbangle' }] } },
  arcanum:   { name: N('熔晶所', 'The Crystal Foundry'), floors: 3, theme: 'empire', look: 'empire', enc: 'lab', seed: 83, bg: 'empire', exitPlace: 'vexhold', music: 'empire', chests: { 1: [{ item: 'ether' }, { gold: 3000 }], 2: [{ item: 'rune' }, { item: 'remedy' }], 3: [{ item: 'goldhairpin' }, { item: 'hipotion' }] } },
  gate:      { name: N('始源之門', 'Origin Gate'), floors: 2, theme: 'cave', look: 'cave', enc: 'gate', seed: 97, bg: 'cave', lava: true, chests: { 1: [{ item: 'ether' }, { item: 'goldshield' }], 2: [{ item: 'flametongue' }, { gold: 4000 }] } },
  burning:   { name: N('燃燒的書庫', 'The Burning Archive'), floors: 2, theme: 'tower', look: 'dark', enc: 'samar', seed: 101, bg: 'dark', lava: true, exitPlace: 'samar', chests: { 1: [{ item: 'ether' }], 2: [{ item: 'firerod' }] } },
  valley:    { name: N('星靈之谷', 'Astral Valley'), floors: 2, theme: 'cave', look: 'cave', enc: 'valley', seed: 109, bg: 'forest', chests: { 1: [{ item: 'hipotion' }, { item: 'icerod' }], 2: [{ item: 'thunderrod' }, { item: 'turbo' }] } },
  isle:      { name: N('天空鐘樓', 'The Sky Belfry'), floors: 3, theme: 'shrine', look: 'shrine', enc: 'isle', seed: 127, bg: 'sky', music: 'vissek', chests: { 1: [{ item: 'turbo' }, { item: 'diamondshield' }], 2: [{ item: 'murasame' }, { item: 'xpotion' }], 3: [{ item: 'hermesheels' }] } },
  // after the Fall
  r_sularis: { name: N('沉沙之城', 'The Sunken City'), floors: 2, theme: 'castle', look: 'cave', enc: 'ruinsouth', seed: 151, bg: 'castle', chests: { 1: [{ item: 'xpotion' }, { item: 'goldhelm' }], 2: [{ item: 'airanchor' }] } },
  tomb:      { name: N('雲鯨之墓', 'The Whale\'s Graveyard'), floors: 3, theme: 'dark', look: 'dark', enc: 'tomb', seed: 163, bg: 'dark', music: 'sad', chests: { 1: [{ item: 'turbo' }], 2: [{ item: 'crystalsword' }, { item: 'xpotion' }], 3: [{ item: 'trumps' }] } },
  dream:     { name: N('霞之國廢墟', 'Ruins of Kasumi'), floors: 3, theme: 'dark', look: 'dark', enc: 'dream', seed: 173, bg: 'dark', music: 'sad', chests: { 1: [{ item: 'aura' }], 2: [{ item: 'xpotion' }, { item: 'genjishield' }], 3: [{ item: 'redcap' }] } },
  phoenixcave: { name: N('回音洞窟', 'Echo Cave'), floors: 3, theme: 'cave', look: 'cave', enc: 'phoenix', seed: 181, bg: 'cave', lava: true, chests: { 1: [{ item: 'xpotion' }, { item: 'valiance' }], 2: [{ item: 'sasuke' }, { item: 'turbo' }], 3: [{ item: 'growegg' }] } },
  culttower: { name: N('沉默教團之塔', 'Tower of the Silent Order'), floors: 4, theme: 'tower', look: 'tower', enc: 'cult', seed: 191, bg: 'tower', chests: { 1: [{ item: 'magusrod' }], 2: [{ item: 'circlet' }, { item: 'xpotion' }], 3: [{ item: 'davincibrush' }], 4: [{ item: 'minerva' }] } },
  icecave:   { name: N('冰洞', 'Ice Cavern'), floors: 2, theme: 'snow', look: 'cave', enc: 'icecave', seed: 197, bg: 'snow', exitPlace: 'r_frostvale', chests: { 1: [{ item: 'iceshield' }, { item: 'xpotion' }], 2: [{ item: 'moogle' }] } },
  wormbelly: { name: N('鏡廳', 'Hall of Mirrors'), floors: 2, theme: 'dark', look: 'dark', enc: 'ruin', seed: 211, bg: 'dark', chests: { 1: [{ item: 'turbo' }], 2: [{ item: 'offering' }] } },
  spire:     { name: N('安息之塔', 'Tower of Rest'), floors: 5, theme: 'dark', look: 'dark', enc: 'spire', seed: 223, bg: 'tower', music: 'final', w: 30, h: 22, chests: { 1: [{ item: 'megalixir' }, { item: 'forcearmor' }], 2: [{ item: 'atma' }, { item: 'xpotion' }], 3: [{ item: 'paladinshield' }, { item: 'megalixir' }], 4: [{ item: 'lightbringer' }, { item: 'heroring' }], 5: [{ item: 'regalcrown' }] } },
};
for (let i = 1; i <= 8; i++) DUNGEONS['lair' + i] = { name: PLACES_R.find((p) => p.id === 'lair' + i).name, floors: 1, theme: i === 2 ? 'snow' : 'cave', look: 'cave', enc: 'ruin', seed: 300 + i * 17, bg: i === 2 ? 'snow' : 'cave', lava: i === 1, chests: { 1: [{ item: 'xpotion' }] } };

export function buildMaps() {
  const balance = buildBalance(), ruin = buildRuin(balance);
  const M = {
    world: { w: WW, h: WH, tiles: balance, theme: 'town', world: 'b', music: 'field', places: PLACES_B, npcs: [], chests: [], warps: [], checks: {}, triggers: [] },
    ruin: { w: WW, h: WH, tiles: ruin, theme: 'ruin', look: 'ruinworld', world: 'r', music: 'ruin', places: PLACES_R, npcs: [], chests: [], warps: [], checks: {}, triggers: [] },
  };
  for (const [id, o] of Object.entries(TOWNS)) M[id] = { ...makeTown(o), id };
  for (const [id, o] of Object.entries(DUNGEONS)) Object.assign(M, makeDungeon(id, o));
  for (const [id, o] of Object.entries(SETS)) M[id] = { w: o.tiles[0].length, h: o.tiles.length, tiles: o.tiles, theme: o.theme, look: o.look, music: o.music, name: o.name, set: true, enc: o.enc, bg: o.bg || 'castle', npcs: [], chests: [], warps: [], checks: {}, triggers: [], id };
  for (const [id, m] of Object.entries(M)) if (!m.id) m.id = id;
  return M;
}
// the world-map place that a map belongs to (towns and the first floor of a dungeon)
export const placeOf = (id) => PLACES_B.find((p) => p.id === id) || PLACES_R.find((p) => p.id === id) || null;
