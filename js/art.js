import { beast, BEASTS } from './beasts.js?v=2';
// ASH ARIA — all the graphics, drawn in code: 16px tiles, little 4-direction people, outlined monsters, battle backdrops.
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const cache = new Map();
const memo = (key, fn) => { let v = cache.get(key); if (!v) { v = fn(); cache.set(key, v); } return v; };
export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  if (f >= 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; } else { r *= 1 + f; g *= 1 + f; b *= 1 + f; }
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}
let seed = 1; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

// ---------------------------------------------------------------- tiles (16x16)
const THEMES = {
  town:   { floor: '#5aa83a', floor2: '#4e9a32', wall: '#8e8a96', wall2: '#5e5a68', top: '#c05a3a' },
  castle: { floor: '#9a9488', floor2: '#8a847a', wall: '#7a7a88', wall2: '#55556a', top: '#a0a0b0' },
  cave:   { floor: '#7a6448', floor2: '#6a563c', wall: '#4a3a2a', wall2: '#2e2418', top: '#6a5440' },
  tower:  { floor: '#8a8070', floor2: '#7a7060', wall: '#6a5a6a', wall2: '#463a46', top: '#8a7a8a' },
  dark:   { floor: '#4a3a5a', floor2: '#3e304e', wall: '#2a1a3a', wall2: '#140a1e', top: '#5a3a6a' },
  shrine: { floor: '#c8d0e0', floor2: '#b8c0d4', wall: '#7a8ab0', wall2: '#4a5a80', top: '#a0b0d8' },
  snow:   { floor: '#e8eef8', floor2: '#c8d4e8', wall: '#8a9ab0', wall2: '#5a6a80', top: '#f4f8ff' },
  desert: { floor: '#e0c088', floor2: '#c8a870', wall: '#c89a5a', wall2: '#8a6a3a', top: '#e8c890' },
  empire: { floor: '#6a6e74', floor2: '#55595e', wall: '#4a4e58', wall2: '#2e3238', top: '#7a7e88' },
  ruin:   { floor: '#7a6a5a', floor2: '#6a5a4a', wall: '#5a4a44', wall2: '#3a2e2a', top: '#8a6a5a' },
  ship:   { floor: '#a87a4a', floor2: '#8a5a32', wall: '#6a4a2a', wall2: '#4a3018', top: '#c89a6a' },
  opera:  { floor: '#8a2a3a', floor2: '#6a1a2a', wall: '#c8a060', wall2: '#8a6a30', top: '#e0c080' },
};
function tileCanvas(id, theme, frame) {
  return memo(`t:${id}:${theme}:${frame}`, () => {
    const c = mk(16, 16), g = c.getContext('2d'), th = THEMES[theme] || THEMES.town;
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    seed = id.split('').reduce((s, ch) => s * 31 + ch.charCodeAt(0), 7) % 99991 + 1;
    const speck = (base, dark, n) => { R(0, 0, 16, 16, base); for (let i = 0; i < n; i++) R(Math.floor(rnd() * 16), Math.floor(rnd() * 16), 1, 1, dark); };
    const grass = () => { speck('#5aa83a', '#4a9030', 14); for (let i = 0; i < 4; i++) { const x = Math.floor(rnd() * 14), y = Math.floor(rnd() * 13); R(x, y, 1, 2, '#3e8a2a'); R(x + 1, y + 1, 1, 2, '#3e8a2a'); } };
    const ground = theme === 'snow' ? () => { speck('#eef2fa', '#c8d4e8', 10); R(3, 9, 3, 1, '#ffffff'); }
      : theme === 'desert' ? () => speck('#e8d090', '#d0b070', 16)
        : theme === 'ruin' ? () => { speck('#8a7a62', '#6a5a48', 18); R(4, 6, 3, 1, '#9a8a6a'); }
          : grass;
    const indoor = ['town', 'snow', 'desert', 'ruin'].includes(theme);
    const under = () => { if (indoor) { R(0, 0, 16, 16, '#b08050'); for (let y = 0; y < 16; y += 4) R(0, y, 16, 1, '#8a6038'); } else R(0, 0, 16, 16, th.floor); };
    switch (id) {
      case 'grass': grass(); break;
      case 'snowfield': speck('#eef2fa', '#c8d4e8', 10); R(3, 9, 3, 1, '#ffffff'); R(10, 4, 2, 1, '#d8e0f0'); break;
      case 'ash': speck('#7a6e62', '#5a5048', 20); R(5, 5, 2, 1, '#9a8a7a'); R(11, 12, 3, 1, '#4a4038'); break;
      case 'ice': R(0, 0, 16, 16, '#a8d8f0'); R(2, 3, 6, 1, '#e0f8ff'); R(9, 10, 5, 1, '#e0f8ff'); R(0, 15, 16, 1, '#80b8d8'); break;
      case 'metal': R(0, 0, 16, 16, '#6a6e74'); R(0, 0, 16, 1, '#8a8e94'); R(0, 8, 16, 1, '#4a4e54'); R(2, 2, 1, 1, '#9a9ea4'); R(13, 2, 1, 1, '#9a9ea4'); R(2, 13, 1, 1, '#9a9ea4'); R(13, 13, 1, 1, '#9a9ea4'); break;
      case 'deck': R(0, 0, 16, 16, '#a87a4a'); for (let x = 0; x < 16; x += 4) R(x, 0, 1, 16, '#7a5232'); R(3, 5, 1, 1, '#5a3a20'); R(11, 10, 1, 1, '#5a3a20'); break;
      case 'flowers': ground(); for (let i = 0; i < 5; i++) { const x = 1 + Math.floor(rnd() * 13), y = 1 + Math.floor(rnd() * 13); R(x, y, 2, 2, ['#ff7ab0', '#fff07a', '#ffffff'][i % 3]); } break;
      case 'path': if (theme === 'snow') speck('#c8c0b0', '#a8a090', 14); else if (theme === 'ruin') speck('#9a8a72', '#7a6a58', 18); else speck('#c8a870', '#b09058', 18); break;
      case 'sand': speck('#e8d090', '#d0b070', 16); R(3, 10, 4, 1, '#d8bc78'); R(9, 4, 5, 1, '#d8bc78'); break;
      case 'swamp': speck('#5a6a3a', '#4a5a2e', 18); R(3, 4, 5, 2, '#7a5aa0'); R(9, 10, 4, 2, '#7a5aa0'); break;
      case 'forest': ground(); for (const [x, y] of [[1, 2], [8, 0], [4, 8], [10, 8]]) { const leaf = theme === 'snow' ? '#2e5a4a' : theme === 'ruin' ? '#4a4a2a' : '#2e7a2a'; R(x + 2, y + 6, 2, 3, '#6a4a2a'); R(x, y + 1, 6, 5, leaf); R(x + 1, y, 4, 7, leaf); R(x + 1, y, 3, 1, theme === 'snow' ? '#ffffff' : '#4aa040'); } break;
      case 'tree': ground(); R(7, 10, 3, 5, '#6a4a2a'); R(2, 2, 12, 9, '#2e7a2a'); R(4, 1, 8, 11, '#2e7a2a'); R(4, 3, 4, 3, '#4aa040'); break;
      case 'deadtree': ground(); R(7, 5, 2, 10, '#4a3a2a'); R(4, 6, 3, 1, '#4a3a2a'); R(9, 3, 3, 1, '#4a3a2a'); R(4, 4, 1, 3, '#4a3a2a'); R(11, 1, 1, 3, '#4a3a2a'); break;
      case 'hills': ground(); for (const [x, y] of [[1, 4], [7, 9]]) { g.fillStyle = theme === 'snow' ? '#dce4f0' : theme === 'ruin' ? '#8a7a62' : '#7ab04a'; g.beginPath(); g.ellipse(x + 4, y + 4, 5, 3.5, 0, Math.PI, 0); g.fill(); R(x, y + 4, 9, 1, '#4a6a3a'); } break;
      case 'mountain': ground(); g.fillStyle = theme === 'ruin' ? '#6a4a3a' : '#8a7a6a'; g.beginPath(); g.moveTo(0, 15); g.lineTo(8, 1); g.lineTo(16, 15); g.fill(); g.fillStyle = '#6a5a4a'; g.beginPath(); g.moveTo(8, 1); g.lineTo(16, 15); g.lineTo(10, 15); g.fill(); g.fillStyle = theme === 'ruin' ? '#a05a3a' : '#f4f4f4'; g.beginPath(); g.moveTo(8, 1); g.lineTo(5.5, 5.5); g.lineTo(10.5, 5.5); g.fill(); break;
      case 'sea': R(0, 0, 16, 16, theme === 'ruin' ? '#3a4a6a' : '#2a5ac8'); R(frame ? 2 : 6, 4, 4, 1, theme === 'ruin' ? '#6a7a9a' : '#6a9aff'); R(frame ? 9 : 11, 10, 4, 1, theme === 'ruin' ? '#6a7a9a' : '#6a9aff'); R(frame ? 12 : 1, 13, 3, 1, '#4a7ae8'); break;
      case 'water': R(0, 0, 16, 16, '#3a7ae0'); R(frame ? 3 : 8, 5, 4, 1, '#8ab8ff'); R(frame ? 10 : 2, 11, 4, 1, '#8ab8ff'); break;
      case 'bridge': R(0, 0, 16, 16, '#2a5ac8'); R(0, 2, 16, 12, '#a8784a'); for (let x = 1; x < 16; x += 4) R(x, 2, 1, 12, '#7a5232'); R(0, 2, 16, 1, '#c8986a'); R(0, 13, 16, 1, '#5a3a20'); break;
      case 'rock': ground(); g.fillStyle = '#7a7a7a'; g.beginPath(); g.ellipse(8, 9, 7, 6, 0, 0, 7); g.fill(); g.fillStyle = '#9a9a9a'; g.beginPath(); g.ellipse(6, 7, 3, 2, 0, 0, 7); g.fill(); R(4, 13, 9, 1, '#4a4a4a'); break;
      case 'miasma': R(0, 0, 16, 16, '#3a1a4a'); for (let i = 0; i < 6; i++) R(Math.floor(rnd() * 14), Math.floor(rnd() * 14), 3, 2, frame ? '#6a2a7a' : '#5a1a6a'); break;
      case 'void': R(0, 0, 16, 16, '#000'); break;
      case 'floor': { if (indoor) { ground(); break; } R(0, 0, 16, 16, th.floor); R(0, 0, 16, 1, th.floor2); R(0, 0, 1, 16, th.floor2); R(8, 8, 8, 1, th.floor2); R(8, 8, 1, 8, th.floor2); break; }
      case 'wall': if (theme === 'cave') { R(0, 0, 16, 16, th.wall2); for (const [x, y, w, h] of [[1, 1, 7, 6], [9, 0, 6, 5], [0, 8, 6, 7], [7, 7, 8, 8]]) { R(x, y, w, h, th.wall); R(x, y, w, 1, th.top); R(x, y + h - 1, w, 1, shade(th.wall2, -0.3)); } break; }
        if (theme === 'empire') { R(0, 0, 16, 16, th.wall); for (let x = 0; x < 16; x += 8) R(x, 0, 1, 16, th.wall2); R(0, 0, 16, 2, th.top); R(3, 6, 2, 2, '#9a9ea8'); R(11, 6, 2, 2, '#9a9ea8'); R(0, 13, 16, 1, '#ff6a2a'); break; }
        R(0, 0, 16, 16, th.wall); for (let y = 0; y < 16; y += 4) { R(0, y, 16, 1, th.wall2); for (let x = (y / 4) % 2 ? 0 : 4; x < 16; x += 8) R(x, y, 1, 4, th.wall2); } R(0, 0, 16, 2, th.top); break;
      case 'cwall': R(0, 0, 16, 16, '#6a6a78'); R(0, 0, 16, 4, '#8a8a98'); for (let x = 0; x < 16; x += 4) R(x, 0, 2, 2, '#4a4a58'); for (let y = 6; y < 16; y += 5) R(0, y, 16, 1, '#4a4a58'); break;
      case 'crack': R(0, 0, 16, 16, th.wall); for (let y = 0; y < 16; y += 4) R(0, y, 16, 1, th.wall2); R(0, 0, 16, 2, th.top); g.strokeStyle = '#1a1010'; g.lineWidth = 1; g.beginPath(); g.moveTo(5, 2); g.lineTo(9, 7); g.lineTo(6, 11); g.lineTo(10, 15); g.stroke(); break;
      case 'wood': R(0, 0, 16, 16, '#b08050'); for (let y = 0; y < 16; y += 4) R(0, y, 16, 1, '#8a6038'); R(5, 0, 1, 4, '#8a6038'); R(11, 4, 1, 4, '#8a6038'); R(3, 8, 1, 4, '#8a6038'); R(13, 12, 1, 4, '#8a6038'); break;
      case 'stone': R(0, 0, 16, 16, theme === 'ruin' ? '#8a7e72' : '#a8a49a'); R(0, 0, 16, 1, '#8a867c'); R(0, 0, 1, 16, '#8a867c'); R(8, 8, 8, 1, '#8a867c'); R(8, 8, 1, 8, '#8a867c'); break;
      case 'carpet': R(0, 0, 16, 16, '#b82a3a'); R(0, 0, 2, 16, '#f0c040'); R(14, 0, 2, 16, '#f0c040'); break;
      case 'door': R(0, 0, 16, 16, th.wall); R(2, 1, 12, 15, '#7a4a20'); R(3, 2, 10, 14, '#a8682a'); R(7, 2, 1, 14, '#7a4a20'); R(10, 9, 2, 2, '#f0d040'); break;
      case 'counter': R(0, 0, 16, 16, '#b08050'); R(0, 3, 16, 10, '#8a5a30'); R(0, 3, 16, 2, '#c89060'); R(0, 12, 16, 1, '#5a3a20'); break;
      case 'table': R(0, 0, 16, 16, '#b08050'); R(1, 3, 14, 9, '#8a5a30'); R(1, 3, 14, 2, '#c89060'); R(2, 12, 2, 3, '#5a3a20'); R(12, 12, 2, 3, '#5a3a20'); break;
      case 'bed': R(0, 0, 16, 16, '#b08050'); R(1, 1, 14, 14, '#7a4a20'); R(2, 2, 12, 5, '#ffffff'); R(2, 7, 12, 8, '#4a7ad8'); R(2, 7, 12, 1, '#6a9aff'); break;
      case 'barrel': under(); g.fillStyle = '#9a6a3a'; g.beginPath(); g.ellipse(8, 9, 6, 7, 0, 0, 7); g.fill(); R(2, 5, 12, 1, '#5a3a20'); R(2, 12, 12, 1, '#5a3a20'); g.fillStyle = '#c89060'; g.beginPath(); g.ellipse(8, 3.5, 5, 2, 0, 0, 7); g.fill(); break;
      case 'throne': R(0, 0, 16, 16, '#b82a3a'); R(3, 1, 10, 13, '#c8a030'); R(4, 2, 8, 6, '#d83a4a'); R(4, 9, 8, 4, '#d83a4a'); R(3, 14, 2, 2, '#8a6a10'); R(11, 14, 2, 2, '#8a6a10'); break;
      case 'pillar': under(); R(4, 0, 8, 16, '#d8d4c8'); R(4, 0, 2, 16, '#ffffff'); R(10, 0, 2, 16, '#a8a498'); R(3, 0, 10, 2, '#e8e4d8'); R(3, 14, 10, 2, '#a8a498'); break;
      case 'statue': under(); R(3, 12, 10, 4, '#8a8a8a'); R(6, 2, 4, 10, '#b0b0b0'); R(5, 1, 6, 4, '#c0c0c0'); R(4, 5, 8, 2, '#b0b0b0'); break;
      case 'grave': ground(); R(5, 4, 6, 9, '#9a9a9a'); R(6, 3, 4, 1, '#9a9a9a'); R(7, 6, 2, 4, '#6a6a6a'); R(6, 7, 4, 1, '#6a6a6a'); R(4, 13, 8, 1, '#5a5a5a'); break;
      case 'fence': ground(); R(0, 6, 16, 2, '#c89060'); R(0, 11, 16, 2, '#c89060'); for (let x = 1; x < 16; x += 5) R(x, 3, 2, 12, '#a8784a'); break;
      case 'stairsdown': under(); for (let i = 0; i < 4; i++) R(2 + i, 2 + i * 3, 12 - i * 2, 3, shade('#555555', -i * 0.2)); R(6, 12, 4, 3, '#000'); break;
      case 'stairsup': under(); for (let i = 0; i < 4; i++) R(2, 12 - i * 3, 12, 3, shade('#b0a890', i * 0.15)); R(2, 12, 12, 1, '#6a6050'); break;
      case 'lava': R(0, 0, 16, 16, '#c83a10'); R(frame ? 2 : 7, 4, 5, 2, '#ffb030'); R(frame ? 9 : 3, 11, 5, 2, '#ff7a20'); break;
      case 'altar': under(); R(2, 6, 12, 8, '#e8e8f0'); R(2, 6, 12, 2, '#ffffff'); R(6, 1, 4, 5, '#ffd040'); R(7, 0, 2, 2, '#fff8c0'); break;
      case 'crystal': under(); R(6, 2, 4, 12, '#80e0ff'); R(5, 5, 6, 6, '#a0f0ff'); R(7, 3, 1, 9, '#ffffff'); R(4, 14, 8, 2, '#4a6a8a'); break;
      case 'machine': R(0, 0, 16, 16, '#4a4e58'); R(1, 1, 14, 14, '#6a6e78'); R(3, 3, 10, 5, '#1a2a3a'); R(4, 4, 3, 1, '#40ff90'); R(4, 6, 6, 1, '#40c0ff'); R(3, 10, 2, 2, '#ff4040'); R(7, 10, 2, 2, '#ffd040'); break;
      // world-map places
      case 'castle': ground(); R(2, 5, 12, 10, '#d8d8e0'); R(1, 2, 4, 6, '#c8c8d4'); R(11, 2, 4, 6, '#c8c8d4'); R(1, 1, 4, 2, '#3a5ad8'); R(11, 1, 4, 2, '#3a5ad8'); R(6, 3, 4, 4, '#c8c8d4'); R(6, 2, 4, 1, '#d84a3a'); R(6, 10, 4, 5, '#5a3a20'); break;
      case 'town': ground(); for (const [x, y, col] of [[1, 6, '#d84a3a'], [8, 2, '#3a7ad8'], [9, 9, '#d8a03a']]) { R(x, y + 3, 6, 4, '#f0e0c0'); g.fillStyle = col; g.beginPath(); g.moveTo(x - 1, y + 3); g.lineTo(x + 3, y); g.lineTo(x + 7, y + 3); g.fill(); } break;
      case 'village': ground(); for (const [x, y] of [[2, 5], [9, 7]]) { R(x, y + 3, 5, 4, '#e0d0a8'); g.fillStyle = '#8a6a3a'; g.beginPath(); g.moveTo(x - 1, y + 3); g.lineTo(x + 2.5, y); g.lineTo(x + 6, y + 3); g.fill(); } break;
      case 'cave': ground(); g.fillStyle = '#7a6a5a'; g.beginPath(); g.moveTo(0, 15); g.lineTo(8, 2); g.lineTo(16, 15); g.fill(); g.fillStyle = '#1a1010'; g.beginPath(); g.ellipse(8, 12, 4, 4, 0, Math.PI, 0); g.fill(); R(4, 12, 8, 3, '#1a1010'); break;
      case 'tower': ground(); R(5, 2, 6, 13, '#a8a0b8'); R(4, 1, 8, 2, '#8a80a0'); R(7, 5, 2, 2, '#2a2040'); R(6, 11, 4, 4, '#3a2a20'); break;
      case 'shrine': ground(); R(2, 7, 12, 8, '#e8eef8'); g.fillStyle = '#7a9ae0'; g.beginPath(); g.moveTo(1, 7); g.lineTo(8, 1); g.lineTo(15, 7); g.fill(); break;
      case 'darkcastle': R(0, 0, 16, 16, '#3a1a4a'); R(2, 5, 12, 10, '#2a2a3a'); R(1, 1, 4, 7, '#1a1a2a'); R(11, 1, 4, 7, '#1a1a2a'); R(6, 2, 4, 5, '#1a1a2a'); R(3, 2, 2, 2, '#ff3a3a'); R(12, 2, 2, 2, '#ff3a3a'); R(6, 10, 4, 5, '#ff5a2a'); break;
      default: R(0, 0, 16, 16, '#f0f'); break;
    }
    return c;
  });
}
export const tile = tileCanvas;

// ---------------------------------------------------------------- people (16x16, 4 directions, 2 walking frames)
export const LOOKS = {
  aria:      { skin: '#f6d8c0', hair: '#7ad8b8', cloth: '#c83a4a', cloth2: '#5a3a6a', style: 'pony' },
  rowan:     { skin: '#e8b890', hair: '#6a4a2a', cloth: '#3a6ab8', cloth2: '#5a5a6a', style: 'bandana', band: '#4a8ae8' },
  edmund:    { skin: '#f0c8a0', hair: '#f0d070', cloth: '#8a5a2a', cloth2: '#3a3a4a', style: 'headband', band: '#80c8e8' },
  sai:       { skin: '#e8b080', hair: '#f0d070', cloth: '#5a8a3a', cloth2: '#3a3a3a', style: 'headband', band: '#d83a3a' },
  kiriyu:    { skin: '#e8c0a0', hair: '#a8a8a8', cloth: '#3a4a8a', cloth2: '#8a8a9a', style: 'topknot' },
  galan:     { skin: '#d89a6a', hair: '#3a3a5a', cloth: '#c83a3a', cloth2: '#f0c040', style: 'wild' },
  selene:    { skin: '#f6d8c0', hair: '#f0e090', cloth: '#3a6a9a', cloth2: '#e0e0e8', style: 'long' },
  regis:     { skin: '#f0d0b0', hair: '#e0e0f0', cloth: '#5a7aa8', cloth2: '#d8d8e0', style: 'beard' },
  nightcrow: { skin: '#e8b890', hair: '#1a1a24', cloth: '#1a1a24', cloth2: '#3a3a4a', style: 'mask' },
  lili:      { skin: '#f6d8c0', hair: '#c86a3a', cloth: '#e8a040', cloth2: '#3a8ad8', style: 'beret', small: true },
  bolo:      { skin: '#e8c0a0', hair: '#e8e8e8', cloth: '#5a6ab8', cloth2: '#f0c040', style: 'beard' },
  moka:      { fox: '#f0f0f8', fox2: '#c8d0e8' },
  uma:       { yeti: '#a8a090' },
  kagami:    { skin: '#c8b0d0', hair: '#5a2a8a', cloth: '#8a3ab8', cloth2: '#f0c040', style: 'hood' },
  leopold:   { skin: '#f6d8c0', hair: '#d8d8e8', cloth: '#2a2a3a', cloth2: '#c8a040', style: 'long', cape: '#8a2a3a' },
  vissek:    { skin: '#f6e8e0', hair: '#eeeef4', cloth: '#f0f0f8', cloth2: '#8a3ab8', style: 'regal', cape: '#3a2a4a' },
  emperor:   { skin: '#f0c8a0', hair: '#c86a2a', cloth: '#6a3a2a', cloth2: '#d8a040', style: 'beard', cape: '#3a2a2a' },
  soldier:   { skin: '#e8b890', hair: '#3a2a1a', cloth: '#7a5a3a', cloth2: '#a8a8a8', style: 'helmet' },
  imperial:  { skin: '#e8b890', hair: '#3a2a1a', cloth: '#e8e8f0', cloth2: '#c8a040', style: 'helmet' },
  guard:     { skin: '#e8b890', hair: '#5a3a1a', cloth: '#8a96a8', cloth2: '#d83a3a', style: 'helmet' },
  man:       { skin: '#f0c090', hair: '#6a4a2a', cloth: '#5a8a3a', cloth2: '#8a6a3a', style: 'short' },
  woman:     { skin: '#f6d0a8', hair: '#a8582a', cloth: '#d86a8a', cloth2: '#f0f0f0', style: 'long' },
  oldman:    { skin: '#e8c0a0', hair: '#e0e0e0', cloth: '#8a7a6a', cloth2: '#5a4a3a', style: 'beard' },
  oldwoman:  { skin: '#e8c0a0', hair: '#d0d0d0', cloth: '#6a5a8a', cloth2: '#f0f0f0', style: 'long' },
  child:     { skin: '#f6d0a8', hair: '#d8a040', cloth: '#3aa0d8', cloth2: '#f0f0f0', style: 'short', small: true },
  girl:      { skin: '#f6d0a8', hair: '#8a3a2a', cloth: '#f07ab0', cloth2: '#f0f0f0', style: 'long', small: true },
  merchant:  { skin: '#f0c090', hair: '#2a2a2a', cloth: '#f0f0f0', cloth2: '#3a8a3a', style: 'apron' },
  innkeep:   { skin: '#f0c090', hair: '#8a4a2a', cloth: '#d8a060', cloth2: '#f0f0f0', style: 'apron' },
  nun:       { skin: '#f6d0a8', hair: '#2a2a3a', cloth: '#2a2a3a', cloth2: '#f0f0f0', style: 'nun' },
  sage:      { skin: '#f0d0b0', hair: '#f0f0f0', cloth: '#e8e8f8', cloth2: '#7a9ae0', style: 'wizard' },
  miner:     { skin: '#e8b080', hair: '#4a3a2a', cloth: '#8a6a3a', cloth2: '#ffd040', style: 'helmet' },
  sailor:    { skin: '#e8b080', hair: '#2a2a2a', cloth: '#f0f0f0', cloth2: '#3a5ad8', style: 'bandana', band: '#3a5ad8' },
  thief:     { skin: '#e8b890', hair: '#2a2a2a', cloth: '#4a4a5a', cloth2: '#8a2a2a', style: 'bandana', band: '#3a3a3a' },
  diva:      { skin: '#f6d8c0', hair: '#f0e090', cloth: '#f0f0ff', cloth2: '#c8a0ff', style: 'princess' },
  owen:      { skin: '#e8c0a0', hair: '#d0d0d0', cloth: '#6a4a8a', cloth2: '#d8b040', style: 'beard' },
  seren:     { skin: '#f6d8c0', hair: '#c8784a', cloth: '#f0f0f0', cloth2: '#a0c8f0', style: 'long' },
  tobin:     { skin: '#e8c0a0', hair: '#e0e0e0', cloth: '#5a6a8a', cloth2: '#8a6a3a', style: 'beard' },
  ghost:     { skin: '#c0d8e8', hair: '#8aa0c0', cloth: '#a0b8d0', cloth2: '#c0d8e8', style: 'short', ghost: true },
  astral:    { skin: '#f0e0ff', hair: '#ffffff', cloth: '#c8a0ff', cloth2: '#ffffff', style: 'long', glow: true },
};
export function person(look, dir, frame) {
  return memo(`p:${look}:${dir}:${frame}`, () => {
    const L = LOOKS[look] || LOOKS.man, c = mk(16, 16), g = c.getContext('2d');
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    if (L.fox) {                // Moka: a little white snow fox standing up
      const b = frame ? 1 : 0;
      R(3, 10, 3, 2, L.fox2); R(1, 8 - b, 3, 3, L.fox); R(0, 7 - b, 2, 2, '#ffffff');
      R(5, 7, 6, 6, L.fox); R(6, 13, 2, 2, L.fox2); R(9, 13 - b, 2, 2, L.fox2);
      R(5, 2, 7, 5, L.fox); R(5, 0, 2, 3, L.fox); R(10, 0, 2, 3, L.fox); R(6, 1, 1, 1, '#ffb0c0'); R(10, 1, 1, 1, '#ffb0c0');
      if (dir !== 'up') { R(6, 4, 1, 1, '#1a1424'); R(10, 4, 1, 1, '#1a1424'); R(8, 5, 1, 1, '#1a1424'); R(7, 9, 3, 1, '#d83a3a'); }
    } else if (L.yeti) {        // Uma: the stone guardian
      const b = frame ? 1 : 0;
      R(2, 3, 12, 11, L.yeti); R(1, 6, 2, 6, L.yeti); R(13, 6 - b, 2, 6, L.yeti); R(3, 14, 4, 2, '#d0d0d0'); R(9, 14, 4, 2, '#d0d0d0');
      R(4, 1, 8, 4, L.yeti); if (dir !== 'up') { R(5, 4, 6, 3, '#8a9ab0'); R(6, 5, 1, 1, '#1a1424'); R(9, 5, 1, 1, '#1a1424'); R(7, 7, 2, 1, '#f0f0f0'); }
    } else {
      const sm = L.small ? 1 : 0, out = '#1a1424', step = frame ? 1 : -1, ly = 12;
      if (L.cape && dir !== 'down') R(3, 8, 10, 7, L.cape);
      if (dir === 'left' || dir === 'right') { R(6 + step, ly, 2, 3, L.cloth2); R(8 - step, ly, 2, 3, shade(L.cloth2, -0.25)); }
      else { R(5, ly, 2, 3 - (frame ? 1 : 0), L.cloth2); R(9, ly, 2, 3 - (frame ? 0 : 1), L.cloth2); }
      R(5, 15, 2, 1, '#3a2a1a'); R(9, 15, 2, 1, '#3a2a1a');
      const robe = ['wizard', 'nun', 'king', 'princess', 'hood', 'clown'].includes(L.style);
      R(4, 8, 8, robe ? 7 : 5, L.cloth); R(4, 8, 1, robe ? 7 : 5, shade(L.cloth, -0.25)); R(11, 8, 1, robe ? 7 : 5, shade(L.cloth, -0.25));
      if (L.style === 'apron') R(5, 9, 6, 5, '#f8f8f8'); else R(4, 11, 8, 1, L.cloth2);
      if (L.cape && dir === 'down') { R(3, 8, 1, 6, L.cape); R(12, 8, 1, 6, L.cape); }
      const arm = dir === 'left' || dir === 'right' ? 0 : step;
      R(3, 9 + (arm > 0 ? 1 : 0), 1, 3, L.skin); R(12, 9 + (arm < 0 ? 1 : 0), 1, 3, L.skin);
      const hy = 1 + sm;
      R(4, hy + 1, 8, 6, L.skin); R(5, hy, 6, 8, L.skin);
      const hairTop = () => { R(4, hy, 8, 3, L.hair); R(5, hy - 1, 6, 1, L.hair); };
      const face = () => {
        if (dir === 'up') { R(4, hy, 8, 6, L.hair); return; }
        if (dir === 'down') { R(6, hy + 4, 1, 2, out); R(9, hy + 4, 1, 2, out); R(7, hy + 6, 2, 1, '#d87070'); }
        else { const ex = dir === 'left' ? 5 : 10; R(ex, hy + 4, 1, 2, out); R(dir === 'left' ? 4 : 11, hy + 3, 1, 4, L.hair); }
      };
      switch (L.style) {
        case 'pony': hairTop(); R(3, hy + 2, 2, 5, L.hair); R(11, hy + 2, 2, 5, L.hair); if (dir === 'left' || dir === 'right') R(dir === 'left' ? 11 : 2, hy + 3, 3, 7, L.hair); else if (dir === 'down') R(12, hy + 4, 2, 6, L.hair); R(6, hy - 1, 4, 1, '#ff6a8a'); face(); if (dir === 'up') R(7, hy + 5, 2, 6, L.hair); break;
        case 'bandana': hairTop(); face(); R(4, hy, 8, 2, L.band); R(dir === 'left' ? 11 : 3, hy + 1, 2, 2, L.band); break;
        case 'regal': hairTop(); R(3, hy + 1, 2, 4, L.hair); R(11, hy + 1, 2, 4, L.hair); face(); break;
        case 'headband': hairTop(); R(3, hy - 1, 3, 2, L.hair); R(10, hy - 1, 3, 2, L.hair); face(); R(4, hy + 2, 8, 1, L.band); if (dir !== 'down') R(dir === 'left' ? 12 : 2, hy + 2, 2, 3, L.band); break;
        case 'topknot': face(); R(4, hy, 8, 2, L.hair); R(7, hy - 3, 2, 3, L.hair); if (dir !== 'up') R(6, hy + 6, 4, 1, L.hair); break;
        case 'wild': hairTop(); R(2, hy - 1, 3, 4, L.hair); R(11, hy - 1, 3, 4, L.hair); R(5, hy - 3, 2, 2, L.hair); R(9, hy - 3, 2, 2, L.hair); R(3, hy + 3, 2, 4, L.hair); R(11, hy + 3, 2, 4, L.hair); face(); break;
        case 'mask': R(4, hy, 8, 7, L.cloth); R(5, hy - 1, 6, 1, L.cloth); if (dir === 'down') { R(5, hy + 3, 6, 2, L.skin); R(6, hy + 3, 1, 1, out); R(9, hy + 3, 1, 1, out); } else if (dir !== 'up') { const ex = dir === 'left' ? 4 : 9; R(ex, hy + 3, 3, 2, L.skin); R(ex + 1, hy + 3, 1, 1, out); } R(dir === 'left' ? 12 : 2, hy + 1, 2, 1, '#8a2a2a'); break;
        case 'beret': hairTop(); R(3, hy + 2, 2, 5, L.hair); R(11, hy + 2, 2, 5, L.hair); face(); R(3, hy - 2, 9, 3, L.cloth2); R(10, hy - 3, 2, 1, L.cloth2); break;
        case 'hood': face(); R(3, hy - 1, 10, 4, L.cloth); R(3, hy + 2, 2, 6, L.cloth); R(11, hy + 2, 2, 6, L.cloth); if (dir === 'down') R(5, hy + 2, 6, 1, shade(L.cloth, -0.4)); break;
        case 'clown': R(4, hy + 1, 8, 6, '#ffffff'); R(5, hy, 6, 8, '#ffffff'); if (dir !== 'up') { R(6, hy + 4, 1, 2, out); R(9, hy + 4, 1, 2, out); R(6, hy + 3, 1, 1, '#d83a8a'); R(9, hy + 3, 1, 1, '#d83a8a'); R(6, hy + 6, 4, 1, '#d83a3a'); } R(3, hy - 1, 4, 3, L.cloth); R(9, hy - 1, 4, 3, L.cloth2); R(2, hy - 3, 2, 2, L.cloth); R(12, hy - 3, 2, 2, L.cloth2); R(1, hy - 4, 1, 1, '#ffd040'); R(14, hy - 4, 1, 1, '#ffd040'); break;
        case 'helmet': face(); R(4, hy - 1, 8, 4, L.cloth); R(4, hy - 1, 8, 1, shade(L.cloth, 0.3)); R(7, hy - 2, 2, 1, L.cloth2); if (dir === 'up') R(4, hy, 8, 6, L.cloth); break;
        case 'princess': hairTop(); R(3, hy + 2, 2, 8, L.hair); R(11, hy + 2, 2, 8, L.hair); R(6, hy - 1, 4, 1, '#ffd040'); R(7, hy - 2, 2, 1, '#ffd040'); face(); break;
        case 'wizard': face(); R(3, hy + 1, 10, 2, L.cloth); R(5, hy - 2, 6, 3, L.cloth); R(7, hy - 4, 3, 2, L.cloth); if (dir !== 'up') { R(5, hy + 6, 6, 3, L.hair); R(6, hy + 9, 4, 1, L.hair); } break;
        case 'king': hairTop(); R(4, hy - 2, 8, 2, '#ffd040'); R(4, hy - 3, 1, 1, '#ffd040'); R(7, hy - 3, 2, 1, '#ffd040'); R(11, hy - 3, 1, 1, '#ffd040'); face(); if (dir !== 'up') R(5, hy + 6, 6, 2, L.hair); break;
        case 'beard': hairTop(); face(); if (dir !== 'up') R(5, hy + 6, 6, 3, L.hair); break;
        case 'nun': face(); R(4, hy - 1, 8, 3, L.cloth); R(3, hy + 1, 2, 8, L.cloth); R(11, hy + 1, 2, 8, L.cloth); R(5, hy + 1, 6, 1, '#f0f0f0'); break;
        case 'long': hairTop(); R(3, hy + 2, 2, 7, L.hair); R(11, hy + 2, 2, 7, L.hair); face(); break;
        case 'apron': hairTop(); face(); break;
        default: hairTop(); face(); break;
      }
    }
    // outline
    const img = g.getImageData(0, 0, 16, 16), d = img.data, o = new Uint8ClampedArray(d);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const i = (y * 16 + x) * 4; if (d[i + 3]) continue;
      const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X >= 0 && X < 16 && Y >= 0 && Y < 16 && d[(Y * 16 + X) * 4 + 3]; });
      if (near) { o[i] = 26; o[i + 1] = 20; o[i + 2] = 36; o[i + 3] = 255; }
    }
    if (L.ghost || L.glow) for (let i = 3; i < o.length; i += 4) if (o[i]) o[i] = L.ghost ? 150 : 230;
    g.putImageData(new ImageData(o, 16, 16), 0, 0);
    return c;
  });
}
// Nimbus the cloud whale on the world map, swimming right; her tail beats between the two frames
export function airship(frame) {
  return memo(`ship:${frame}`, () => {
    const c = mk(24, 20), g = c.getContext('2d'), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    const ink = '#2a3458', body = '#b8d0f0', light = '#e8f4ff', belly = '#d8e8ff', shadow = '#8aa0c8';
    R(5, 3, 13, 1, ink); R(4, 4, 16, 1, ink); R(3, 5, 1, 9, ink); R(20, 5, 2, 1, ink); R(22, 6, 1, 7, ink); R(4, 14, 1, 1, ink); R(5, 15, 15, 1, ink); R(20, 13, 2, 2, ink);
    R(4, 5, 16, 9, body); R(20, 6, 2, 7, body); R(5, 4, 13, 1, body); R(5, 14, 15, 1, shadow);
    R(6, 5, 10, 1, light); R(5, 6, 4, 1, light); R(8, 11, 12, 3, belly);
    for (let x = 9; x < 20; x += 2) R(x, 12, 1, 2, shadow);
    R(1, 7, 3, 4, body); R(1, 6, 1, 1, ink); R(1, 11, 1, 1, ink);
    if (frame) { R(0, 3, 3, 4, body); R(0, 2, 3, 1, ink); } else { R(0, 11, 3, 4, body); R(0, 15, 3, 1, ink); }
    R(18, 8, 1, 1, '#1a1424'); R(17, 7, 1, 1, light); R(15, 10, 6, 1, shadow);
    R(10, 14, 3, 2, shadow); R(11, 16, 2, 1, ink);
    R(frame ? 3 : 13, 17, 5, 2, '#ffffff'); R(frame ? 15 : 5, 18, 4, 1, '#f0f4ff');
    return c;
  });
}

// ---------------------------------------------------------------- monsters
// a monster as a shaded pixel sprite N game-pixels wide (see beasts.js); flash = white silhouette for the hit blink
export function monster(art, col, flash = false, N = 48) { return beast(art, col, N, flash); }
export const ARTS = BEASTS;

// ---------------------------------------------------------------- battle backdrops (side view: the land fades to a horizon)
const BG = {
  field: [['#3a7ae0', '#a8d0ff'], '#4a9a3a', '#6a8ac8'], forest: [['#2a5a3a', '#7ab07a'], '#3a7a2a', '#2a5a2a'], desert: [['#e08a3a', '#ffe0a0'], '#d8b06a', '#c8784a'],
  snow: [['#8aa0c8', '#e8f0ff'], '#e0e8f4', '#a8b8d8'], cave: [['#1a1410', '#3a2a1e'], '#4a3a2a', null], castle: [['#2a2a3a', '#4a4a5a'], '#5a5a6a', null],
  empire: [['#3a3a44', '#6a6a78'], '#4a4e58', null], water: [['#3a6ab8', '#a8d8f0'], '#3a6a9a', '#2a5a8a'], ruin: [['#5a1a1a', '#c86a3a'], '#6a5a4a', '#4a2a2a'],
  dark: [['#140a1e', '#3a1a4a'], '#2a1a3a', null], sky: [['#4a8ae8', '#e0f0ff'], '#c8d8f0', '#ffffff'], ship: [['#4a8ae8', '#c0e0ff'], '#a87a4a', null],
  tower: [['#2a0a1a', '#8a2a3a'], '#3a2a3a', null], wild: [['#5a8ad8', '#c8e0ff'], '#8aa04a', '#6a8a3a'],
};
export function backdrop(kind, w, h) {
  return memo(`bg:${kind}:${w}:${h}`, () => {
    const c = mk(w, h), g = c.getContext('2d'), [sky, ground, hill] = BG[kind] || BG.field;
    let gr = g.createLinearGradient(0, 0, 0, h * 0.6); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    if (hill) { g.fillStyle = hill; g.beginPath(); g.moveTo(0, h * 0.6); for (let x = 0; x <= w; x += w / 10) g.lineTo(x, h * 0.48 + Math.sin(x * 0.03 + 1) * h * 0.05); g.lineTo(w, h * 0.6); g.fill(); }
    if (['cave', 'dark', 'tower'].includes(kind)) { g.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 12; i++) { const x = (i / 12) * w; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + w / 24, h * (0.1 + (i % 3) * 0.05)); g.lineTo(x + w / 12, 0); g.fill(); } }
    if (['castle', 'empire'].includes(kind)) { g.fillStyle = 'rgba(255,255,255,.07)'; for (let x = w * 0.06; x < w; x += w / 7) g.fillRect(x, h * 0.06, w * 0.04, h * 0.54); }
    if (kind === 'ruin') { g.fillStyle = 'rgba(255,220,180,.25)'; g.beginPath(); g.arc(w * 0.8, h * 0.18, h * 0.08, 0, 7); g.fill(); }
    if (kind === 'sky' || kind === 'ship') { g.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse((i * 0.21 + 0.05) * w, h * (0.15 + (i % 3) * 0.1), w * 0.08, h * 0.03, 0, 0, 7); g.fill(); } }
    gr = g.createLinearGradient(0, h * 0.6, 0, h); gr.addColorStop(0, ground); gr.addColorStop(1, shade(ground, -0.5)); g.fillStyle = gr; g.fillRect(0, h * 0.6, w, h * 0.4);
    return c;
  });
}
