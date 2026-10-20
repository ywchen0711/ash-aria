// beasts.js — monsters as shaded pixel sprites.
// A creature is a stack of simple volumes (ellipsoids, tapered limbs, bevelled plates) in unit coordinates.
// Each sprite is rasterised at its real on-screen pixel size, lit from the upper left and quantised
// to a five-step colour ramp (shadows lean violet, lights lean gold), with a dark contour wherever one
// part overlaps another and a one-pixel outline around the whole silhouette. Details (eyes, teeth,
// cracks) are placed pixel by pixel afterwards so they stay crisp at any size.

// ---------------------------------------------------------------- colour
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgbHex(r, g, b) { return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function toHSL([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  }
  return [h, s, l];
}
function fromHSL(h, s, l) {
  h = ((h % 360) + 360) % 360; const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgbHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
const towards = (h, t, k) => { let d = ((t - h + 540) % 360) - 180; return h + d * k; };
const RAMPS = new Map();
// five shades of a colour: 0 deepest shadow … 4 highlight
function ramp(hex) {
  if (RAMPS.has(hex)) return RAMPS.get(hex);
  const [h, s, l] = toHSL(hexRGB(hex));
  const up = Math.min(0.2, (0.97 - l) * 0.75), dn = Math.min(0.3, l * 0.7);
  const out = [-1, -0.55, 0, 0.55, 1].map((t) => {
    const hh = s < 0.06 ? h : t < 0 ? towards(h, 255, -t * 0.12) : towards(h, 50, t * 0.1);
    const ss = s < 0.06 ? s : clamp(s * (t < 0 ? 1 - t * 0.12 : 1 - t * 0.18), 0, 1);
    return fromHSL(hh, ss, clamp(l + (t < 0 ? t * dn : t * up), 0.03, 0.98));
  });
  RAMPS.set(hex, out); return out;
}
const mix = (a, b, t) => { const A = hexRGB(a), B = hexRGB(b); return rgbHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); };
const lum = (hex) => { const [r, g, b] = hexRGB(hex); return (0.3 * r + 0.59 * g + 0.11 * b) / 255; };
const shift = (hex, dl) => { const [h, s, l] = toHSL(hexRGB(hex)); return fromHSL(h, s, clamp(l + dl, 0.03, 0.97)); };

const NAMED = {
  bone: '#e4d8bc', horn: '#e8dcc0', claw: '#f2ecdc', metal: '#a4acbc', iron: '#626a7a', gold: '#e0b040', bronze: '#b8803a',
  dark: '#2e2836', flesh: '#d8a08a', wood: '#8a5a34', leaf: '#4a9a3a', moss: '#5a8a3a', cloth: '#5a4a6a', skin: '#e8c0a0',
  sand: '#c8a46a', stone: '#8a8478', ice: '#bfe4ff', fire: '#ff8a2a', white: '#f4f2ee', glass: '#9ad8f0', rust: '#a05a2a', ink: '#1c1824',
};
const GLOSSY = new Set(['metal', 'iron', 'gold', 'bronze', 'glass', 'ice']);
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const L = (() => { const v = [-0.55, -0.7, 0.62], n = Math.hypot(...v); return v.map((x) => x / n); })();
const HV = (() => { const v = [L[0], L[1], L[2] + 1], n = Math.hypot(...v); return v.map((x) => x / n); })();

// ---------------------------------------------------------------- shapes
// every shape is f(x, y) -> height (>= 0 inside, < 0 outside) plus a bounding box
function ellShape(cx, cy, rx, ry, rot = 0, hs = 1) {
  const c = Math.cos(rot), s = Math.sin(rot), R = Math.max(rx, ry), H = Math.min(rx, ry) * hs;
  return { box: [cx - R, cy - R, cx + R, cy + R], H, f(x, y) { const dx = x - cx, dy = y - cy, u = (dx * c + dy * s) / rx, v = (-dx * s + dy * c) / ry, d = u * u + v * v; return d > 1 ? -1 : Math.sqrt(1 - d) * H; } };
}
function capShape(segs, hs = 1) {
  let x0 = 9, y0 = 9, x1 = -9, y1 = -9, H = 0;
  for (const [ax, ay, bx, by, ra, rb] of segs) { const r = Math.max(ra, rb); x0 = Math.min(x0, ax - r, bx - r); y0 = Math.min(y0, ay - r, by - r); x1 = Math.max(x1, ax + r, bx + r); y1 = Math.max(y1, ay + r, by + r); H = Math.max(H, r * hs); }
  return {
    box: [x0, y0, x1, y1], H,
    f(x, y) {
      let best = -1;
      for (const [ax, ay, bx, by, ra, rb] of segs) {
        const vx = bx - ax, vy = by - ay, ll = vx * vx + vy * vy || 1e-9, t = clamp(((x - ax) * vx + (y - ay) * vy) / ll, 0, 1);
        const r = ra + (rb - ra) * t, dx = x - ax - vx * t, dy = y - ay - vy * t, d2 = dx * dx + dy * dy;
        if (d2 < r * r) best = Math.max(best, Math.sqrt(r * r - d2) * hs);
      }
      return best;
    },
  };
}
function polyShape(pts, b = 0.03, hs = 1) {
  let x0 = 9, y0 = 9, x1 = -9, y1 = -9;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return {
    box: [x0, y0, x1, y1], H: b * hs,
    f(x, y) {
      let inside = false, d = 9;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
        const vx = xj - xi, vy = yj - yi, ll = vx * vx + vy * vy || 1e-9, t = clamp(((x - xi) * vx + (y - yi) * vy) / ll, 0, 1);
        d = Math.min(d, Math.hypot(x - xi - vx * t, y - yi - vy * t));
      }
      if (!inside) return -1;
      const k = Math.min(d, b); return Math.sqrt(b * b - (b - k) * (b - k)) * hs;
    },
  };
}

// ---------------------------------------------------------------- the painter handed to every design
function painter(c1, c2) {
  const parts = [], ops = [];
  let hq = null;
  const eyeCol = lum(c2) > 0.45 ? c2 : '#ffe27a';
  const colOf = (m) => m === 'a' ? c1 : m === 'b' ? c2 : m === 'A' ? shift(c1, -0.14) : m === 'L' ? shift(c1, 0.12) : m === 'B' ? shift(c2, -0.16) : m === 'e' ? eyeCol : NAMED[m] || m;
  const add = (shape, m, o = {}) => { parts.push({ shape, col: colOf(m), gloss: o.gloss ?? GLOSSY.has(m), o, z: parts.length }); return P; };
  const P = {
    c1, c2, eyeCol, colOf,
    // hand-finished look: cast shadows between parts, a cool rim light, surface textures (fur, scale, stone, facet)
    hq: (o = {}) => { hq = { rim: '#a8d0ff', shadow: true, ...o }; return P; },
    get HQ() { return hq; },
    // ellipsoid
    e: (x, y, rx, ry, m = 'a', o = {}) => add(ellShape(x, y, rx, ry, o.r || 0, o.h ?? 1), m, o),
    // tapered limb from (x1,y1, radius r1) to (x2,y2, radius r2)
    c: (x1, y1, x2, y2, r1, r2, m = 'a', o = {}) => add(capShape([[x1, y1, x2, y2, r1, r2]], o.h ?? 1), m, o),
    // a chain of [x, y, r] joints (tails, necks, tentacles)
    k: (pts, m = 'a', o = {}) => { const s = []; for (let i = 1; i < pts.length; i++) s.push([pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], pts[i - 1][2], pts[i][2]]); return add(capShape(s, o.h ?? 1), m, o); },
    // bevelled plate
    p: (pts, m = 'a', o = {}) => add(polyShape(pts, o.b ?? 0.03, o.h ?? 1), m, o),
    // mirror a builder around the centre line: fn(side, X) with X(dx) = 0.5 + side * dx
    sym: (fn, cx = 0.5) => { for (const s of [-1, 1]) fn(s, (dx) => cx + s * dx); return P; },
    // ---- pixel details (drawn after shading)
    eye: (x, y, r = 0.03, kind = 'glow', col) => { ops.push({ t: 'eye', x, y, r, kind, col: col ? colOf(col) : eyeCol }); return P; },
    line: (x1, y1, x2, y2, col = 'ink', w = 1, bg = false) => { ops.push({ t: 'line', x1, y1, x2, y2, col: colOf(col), w, bg }); return P; },
    dot: (x, y, col = 'white', s = 1) => { ops.push({ t: 'dot', x, y, col: colOf(col), s }); return P; },
    teeth: (x1, y1, x2, y2, n = 4, col = 'claw', dir = 1) => { ops.push({ t: 'teeth', x1, y1, x2, y2, n, col: colOf(col), dir }); return P; },
    arc: (cx, cy, r, a0, a1, col = 'ink', ry, bg = false) => { ops.push({ t: 'arc', cx, cy, r, ry: ry ?? r, a0, a1, col: colOf(col), bg }); return P; },
  };
  return { P, parts, ops };
}

// ---------------------------------------------------------------- rasteriser
function render(design, c1, c2, N) {
  const { P, parts, ops } = painter(c1, c2);
  design(P, c1, c2);
  const n2 = N * N, own = new Int16Array(n2).fill(-1), base = new Int16Array(n2).fill(-1), lvl = new Int8Array(n2), col = new Array(n2), flatC = new Array(n2);
  const NX = new Float32Array(n2), NY = new Float32Array(n2), NZ = new Float32Array(n2), HT = new Float32Array(n2), Z = new Int16Array(n2);
  const e = 0.6 / N;
  parts.forEach((pt, k) => {
    const { shape, o } = pt, [bx0, by0, bx1, by1] = shape.box;
    const i0 = clamp(Math.floor(bx0 * N) - 1, 0, N - 1), i1 = clamp(Math.ceil(bx1 * N) + 1, 0, N - 1), j0 = clamp(Math.floor(by0 * N) - 1, 0, N - 1), j1 = clamp(Math.ceil(by1 * N) + 1, 0, N - 1);
    const z = o.under ? k - 4000 : k;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const x = (i + 0.5) / N, y = (j + 0.5) / N, h = shape.f(x, y);
      if (h < 0) continue;
      const q = j * N + i;
      if (o.over) { if (own[q] < 0) continue; if (o.clip !== undefined && base[q] !== o.clip) continue; col[q] = pt; if (o.flat) flatC[q] = pt.col; else flatC[q] = null; continue; }
      if (o.under && own[q] >= 0) continue;
      const fx = (xx, yy) => Math.max(0, shape.f(xx, yy));
      let nx = -(fx(x + e, y) - fx(x - e, y)) / (2 * e), ny = -(fx(x, y + e) - fx(x, y - e)) / (2 * e);
      if (o.flatten) { nx *= o.flatten; ny *= o.flatten; }
      const nl = Math.hypot(nx, ny, 1);
      own[q] = k; base[q] = k; col[q] = pt; flatC[q] = o.flat ? pt.col : null; HT[q] = h; Z[q] = z;
      NX[q] = nx / nl; NY[q] = ny / nl; NZ[q] = 1 / nl;
    }
  });
  // light every pixel
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const q = j * N + i; if (own[q] < 0) continue;
    const pt = col[q], o = pt.o, src = parts[own[q]];
    let v;
    if (o.glow || src.o.glow) { const H = (o.glow ? pt : src).shape.H || 1; v = 0.5 + 0.55 * clamp(HT[q] / H, 0, 1); }
    else {
      let nx = NX[q], ny = NY[q], nz = NZ[q];
      if (o.facet || src.o.facet) { nx = Math.round(nx * 2.2) / 2.2; ny = Math.round(ny * 2.2) / 2.2; const l = Math.hypot(nx, ny, 0.8); nx /= l; ny /= l; nz = 0.8 / l; }
      const d = nx * L[0] + ny * L[1] + nz * L[2];
      v = 0.16 + 0.9 * Math.max(0, d) + (NX[q] > 0.6 && NY[q] > -0.3 ? 0.1 : 0);
      if (o.dim || src.o.dim) v -= 0.2;
      if (pt.gloss) { const sp = NX[q] * HV[0] + NY[q] * HV[1] + NZ[q] * HV[2]; if (sp > 0.965) v = 1.2; }
    }
    if (!(o.nodither)) v += (BAYER[(j & 3) * 4 + (i & 3)] / 16 - 0.47) * 0.09;
    lvl[q] = v < 0.33 ? 0 : v < 0.53 ? 1 : v < 0.75 ? 2 : v < 0.95 ? 3 : 4;
  }
  const HQ = P.HQ, hash = (a, b) => { const t = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return t - Math.floor(t); };
  if (HQ) {
    // surface textures: short strokes along the fur, rows of scales, speckled stone
    const u = 48 / N;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const q = j * N + i; if (own[q] < 0 || flatC[q]) continue;
      const o = col[q].o, tx = o.tex; if (!tx) continue;
      if (tx === 'fur') {
        const a = o.fd ?? Math.PI / 2, dx = Math.cos(a), dy = Math.sin(a), along = (i * dx + j * dy) * u, across = (i * -dy + j * dx) * u;
        const r = hash(Math.round(across), Math.floor(along / 3)), r2 = hash(Math.round(across) + 17, Math.floor(along / 2) + 5);
        if (r < 0.26 && lvl[q] > 0) lvl[q]--; else if (r2 < 0.08 && lvl[q] < 4 && lvl[q] > 1) lvl[q]++;
      } else if (tx === 'scale') {
        const row = Math.floor(j * u / 2.5), off = row % 2 ? 1.5 : 0;
        if (Math.floor(j * u) % 3 === 0 && (Math.floor(i * u + off) % 3) === 0 && lvl[q] > 0) lvl[q]--;
      } else if (tx === 'stone') {
        const r = hash(i, j); if (r < 0.1 && lvl[q] > 0) lvl[q]--; else if (r > 0.94 && lvl[q] < 4) lvl[q]++;
      } else if (tx === 'plate') {
        if (Math.floor(i * u) % 7 === 0 && lvl[q] > 0) lvl[q]--;
      }
    }
    // cast shadows: a part in front darkens what lies just below-right of it
    if (HQ.shadow) {
      const sd = Math.max(1, Math.round(N / 30)), copy = lvl.slice();
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const q = j * N + i; if (own[q] < 0 || flatC[q]) continue;
        const me = parts[own[q]]; if (me.o.glow || col[q].o.glow) continue;
        for (let d = 1; d <= sd + 1; d++) {
          const ii = i - d, jj = j - d; if (ii < 0 || jj < 0) break;
          const qq = jj * N + ii, k = own[qq]; if (k < 0 || k === own[q]) continue;
          const ot = parts[k];
          if (Z[qq] > Z[q] && !ot.o.soft && !ot.o.glow && (ot.o.g === undefined || ot.o.g !== me.o.g)) { copy[q] = Math.max(0, lvl[q] - 1); break; }
        }
      }
      lvl.set(copy);
    }
  }
  // contours: a pixel touching a part stacked above it (from another group) goes to the deepest shade
  const out = new Array(n2);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const q = j * N + i; if (own[q] < 0) continue;
    const me = parts[own[q]];
    let edge = false;
    if (!me.o.noline) for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue;
      const qq = jj * N + ii, k = own[qq]; if (k < 0 || k === own[q]) continue;
      const ot = parts[k];
      if (Z[qq] > Z[q] && !ot.o.soft && (ot.o.g === undefined || ot.o.g !== me.o.g)) { edge = true; break; }
    }
    const pt = col[q];
    out[q] = flatC[q] || ramp(pt.col)[edge ? 0 : lvl[q]];
    if (edge && flatC[q]) out[q] = ramp(pt.col)[0];
    // rim light along the lower-right silhouette, as if from the cave's cold light behind
    if (HQ && HQ.rim && !edge && !flatC[q] && !pt.o.glow) {
      const open = (ii, jj) => ii >= N || jj >= N || own[jj * N + ii] < 0;
      if ((open(i + 1, j) || open(i + 1, j + 1)) && NX[q] > -0.1) out[q] = mix(out[q], HQ.rim, 0.42);
    }
  }
  // outline around the silhouette
  const INK = '#0e0a14';
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const q = j * N + i; if (own[q] >= 0) continue;
    let k = -1;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const kk = own[jj * N + ii]; if (kk >= 0 && !parts[kk].o.nooutline) { k = jj * N + ii; break; } }
    if (k >= 0) out[q] = mix(ramp(col[k].col)[0], INK, 0.6);
  }
  // pixel details
  let bg = false;
  const put = (i, j, c) => { i = Math.round(i); j = Math.round(j); if (i >= 0 && j >= 0 && i < N && j < N && !(bg && out[j * N + i])) out[j * N + i] = c; };
  const PX = (u) => u * N - 0.5;
  const under = (i, j) => { i = clamp(Math.round(i), 0, N - 1); j = clamp(Math.round(j), 0, N - 1); const q = j * N + i; return own[q] >= 0 ? ramp(col[q].col) : ramp('#2e2836'); };
  for (const op of ops) {
    bg = !!op.bg;
    if (op.t === 'dot') { const s = Math.max(1, Math.round(op.s * N / 64)); for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) put(PX(op.x) + a, PX(op.y) + b, op.col); }
    else if (op.t === 'line') {
      const x1 = PX(op.x1), y1 = PX(op.y1), x2 = PX(op.x2), y2 = PX(op.y2), st = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1)));
      for (let s = 0; s <= st; s++) { const x = x1 + ((x2 - x1) * s) / st, y = y1 + ((y2 - y1) * s) / st; put(x, y, op.col); if (op.w > 1 && N > 56) put(x, y + 1, op.col); }
    } else if (op.t === 'arc') {
      const st = Math.max(6, Math.ceil(op.r * N * Math.abs(op.a1 - op.a0)) * 2);
      for (let s = 0; s <= st; s++) { const a = op.a0 + ((op.a1 - op.a0) * s) / st; put(PX(op.cx + Math.cos(a) * op.r), PX(op.cy + Math.sin(a) * op.ry), op.col); }
    } else if (op.t === 'teeth') {
      const n = op.n, x1 = PX(op.x1), y1 = PX(op.y1), x2 = PX(op.x2), y2 = PX(op.y2), tl = Math.max(1, Math.round(N / 40));
      for (let s = 0; s < n; s++) { const t = n === 1 ? 0.5 : s / (n - 1), x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; for (let a = 0; a < tl; a++) put(x, y + a * op.dir, op.col); }
    } else if (op.t === 'eye') {
      const cx = PX(op.x), cy = PX(op.y), w = Math.max(1, Math.round(op.r * N)), sh = under(cx, cy);
      if (op.kind === 'cute') {
        const h = w + 1;
        for (let a = -Math.floor(w / 2) - 0; a < Math.ceil(w / 2) + 0; a++) for (let b = 0; b < h; b++) put(cx + a, cy + b - Math.floor(h / 2), '#1a1222');
        put(cx - Math.floor(w / 2) + (w > 2 ? 1 : 0), cy - Math.floor(h / 2) + (h > 2 ? 1 : 0), '#ffffff');
      } else if (op.kind === 'round') {
        // a big round eye: dark rim, coloured iris, black slit pupil, white glint
        const r = Math.max(1.2, op.r * N);
        for (let a = -Math.ceil(r) - 1; a <= Math.ceil(r) + 1; a++) for (let b = -Math.ceil(r) - 1; b <= Math.ceil(r) + 1; b++) { const d = Math.hypot(a, b); if (d <= r + 0.6) put(cx + a, cy + b, d > r - 0.5 ? '#1a1222' : mix(op.col, '#ffffff', b < 0 ? 0.2 : 0)); }
        for (let b = -Math.floor(r * 0.7); b <= Math.floor(r * 0.7); b++) put(cx, cy + b, '#1a1222');
        put(cx - Math.round(r * 0.45), cy - Math.round(r * 0.45), '#ffffff');
      } else if (op.kind === 'hollow') {
        // dark sockets with a pinprick of light
        for (let a = 0; a < w + 1; a++) for (let b = 0; b < Math.max(1, w); b++) put(cx + a - Math.floor(w / 2), cy + b, '#120c18');
        put(cx, cy + Math.floor(w / 2), op.col);
      } else {
        // a narrow glowing slit, with a dark brow above it
        const h = Math.max(1, Math.round(w * 0.55));
        for (let a = -1; a <= w; a++) put(cx + a - Math.floor(w / 2), cy - 1, sh[0]);
        for (let a = 0; a < w; a++) for (let b = 0; b < h; b++) put(cx + a - Math.floor(w / 2), cy + b, b === 0 && a < w - 1 && w > 1 ? mix(op.col, '#ffffff', 0.55) : op.col);
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- creature designs (all face right, toward the party)
const D = {};
// ---- small things
D.slime = (P) => {
  P.e(0.5, 0.68, 0.34, 0.25, 'a', { h: 1.3, g: 1 }).c(0.5, 0.3, 0.5, 0.58, 0.035, 0.2, 'a', { g: 1, h: 1.2 });
  P.e(0.58, 0.76, 0.16, 0.08, 'L', { over: 1 }).e(0.37, 0.5, 0.04, 0.07, '#ffffff', { over: 1, flat: 1, r: -0.4 }).e(0.33, 0.62, 0.025, 0.03, '#ffffff', { over: 1, flat: 1 });
  P.e(0.5, 0.92, 0.3, 0.025, 'A', { under: 1 });
  P.eye(0.44, 0.63, 0.05, 'cute').eye(0.62, 0.63, 0.05, 'cute').line(0.5, 0.74, 0.56, 0.74, 'ink');
};
D.bat = (P) => {
  P.sym((s, X) => {
    P.p([[X(0.08), 0.44], [X(0.24), 0.24], [X(0.36), 0.18], [X(0.47), 0.26], [X(0.44), 0.4], [X(0.47), 0.56], [X(0.38), 0.5], [X(0.33), 0.62], [X(0.25), 0.54], [X(0.17), 0.62], [X(0.1), 0.54]], 'A', { b: 0.025 });
    P.line(X(0.1), 0.43, X(0.36), 0.19, 'ink').line(X(0.12), 0.45, X(0.38), 0.5, 'ink').line(X(0.12), 0.45, X(0.25), 0.54, 'ink').line(X(0.12), 0.45, X(0.44), 0.4, 'ink');
    P.p([[X(0.04), 0.35], [X(0.12), 0.18], [X(0.12), 0.34]], 'a', { b: 0.02 });
  });
  P.e(0.5, 0.52, 0.12, 0.14).e(0.5, 0.36, 0.1, 0.085, 'a', { g: 2 }).e(0.5, 0.56, 0.065, 0.08, 'b', { over: 1 });
  P.c(0.45, 0.64, 0.44, 0.72, 0.02, 0.012, 'A').c(0.55, 0.64, 0.56, 0.72, 0.02, 0.012, 'A');
  P.eye(0.46, 0.35, 0.025).eye(0.55, 0.35, 0.025).dot(0.48, 0.42, 'claw').dot(0.53, 0.42, 'claw');
};
D.rat = (P) => {
  P.k([[0.22, 0.72, 0.03], [0.1, 0.7, 0.022], [0.05, 0.58, 0.016], [0.1, 0.46, 0.01]], '#d89aa0');
  P.c(0.36, 0.78, 0.34, 0.9, 0.04, 0.03, 'a', { dim: 1 }).c(0.64, 0.74, 0.66, 0.9, 0.03, 0.025, 'a', { dim: 1 });
  P.e(0.7, 0.44, 0.065, 0.075, 'a', { dim: 1 });
  P.e(0.44, 0.7, 0.25, 0.17).e(0.3, 0.72, 0.13, 0.14, 'a', { g: 3 });
  P.e(0.47, 0.8, 0.18, 0.07, 'b', { over: 1 });
  P.e(0.66, 0.46, 0.07, 0.08).e(0.665, 0.47, 0.04, 0.05, '#d8909a', { over: 1 });
  P.e(0.72, 0.6, 0.13, 0.1, 'a', { r: 0.3, g: 4 }).c(0.74, 0.6, 0.9, 0.67, 0.08, 0.03, 'a', { g: 4 });
  P.c(0.3, 0.8, 0.28, 0.91, 0.06, 0.03).c(0.66, 0.72, 0.7, 0.9, 0.035, 0.025);
  P.e(0.29, 0.92, 0.05, 0.02, '#d89aa0').e(0.72, 0.91, 0.04, 0.02, '#d89aa0').e(0.91, 0.67, 0.022, 0.02, '#e08a9a');
  P.eye(0.77, 0.56, 0.03, 'glow', '#ff5a4a').teeth(0.86, 0.71, 0.88, 0.71, 2, 'claw').line(0.88, 0.63, 0.97, 0.6, 'ink').line(0.88, 0.66, 0.97, 0.67, 'ink');
};
D.hare = (P) => {
  P.e(0.56, 0.22, 0.05, 0.17, 'a', { r: -0.25, dim: 1 }).e(0.64, 0.2, 0.055, 0.18, 'a', { r: 0.2 }).e(0.645, 0.22, 0.025, 0.13, 'b', { over: 1, r: 0.2 });
  P.e(0.42, 0.7, 0.24, 0.2).e(0.26, 0.64, 0.07, 0.07, 'b').e(0.36, 0.82, 0.13, 0.09, 'a', { g: 5 });
  P.e(0.6, 0.5, 0.15, 0.14, 'a', { g: 6 }).e(0.7, 0.55, 0.08, 0.07, 'a', { g: 6 }).e(0.6, 0.58, 0.1, 0.07, 'b', { over: 1 });
  P.c(0.56, 0.74, 0.6, 0.9, 0.035, 0.03).e(0.4, 0.92, 0.09, 0.025, 'A').e(0.62, 0.92, 0.05, 0.022, 'A');
  P.p([[0.42, 0.42], [0.3, 0.3], [0.22, 0.4], [0.32, 0.48]], 'leaf', { b: 0.02 }).line(0.42, 0.42, 0.25, 0.38, '#2a5a2a');
  P.eye(0.67, 0.47, 0.035, 'cute').dot(0.77, 0.55, '#e08a9a');
};
D.frog = (P) => {
  P.e(0.3, 0.76, 0.16, 0.14, 'a', { dim: 1 });
  P.e(0.48, 0.66, 0.3, 0.2).e(0.66, 0.54, 0.18, 0.13, 'a', { g: 7 }).e(0.6, 0.76, 0.2, 0.09, 'b', { over: 1 });
  P.e(0.63, 0.4, 0.07, 0.07, 'a', { g: 7 }).e(0.76, 0.42, 0.065, 0.065, 'a', { g: 7 });
  P.e(0.28, 0.8, 0.17, 0.13).c(0.36, 0.88, 0.5, 0.92, 0.04, 0.03).c(0.72, 0.7, 0.76, 0.9, 0.04, 0.03);
  P.e(0.46, 0.56, 0.06, 0.04, 'A', { over: 1 }).e(0.34, 0.66, 0.04, 0.03, 'A', { over: 1 });
  P.eye(0.64, 0.39, 0.045, 'round', '#f0d050').eye(0.77, 0.41, 0.04, 'round', '#f0d050').line(0.7, 0.62, 0.84, 0.58, 'ink');
};
D.cactus = (P) => {
  P.c(0.3, 0.6, 0.24, 0.42, 0.055, 0.045, 'a', { dim: 1 }).c(0.24, 0.45, 0.24, 0.36, 0.045, 0.04, 'a', { dim: 1 });
  P.c(0.5, 0.9, 0.5, 0.36, 0.13, 0.12, 'a', { h: 1.1 });
  P.c(0.64, 0.66, 0.78, 0.6, 0.055, 0.05).c(0.78, 0.62, 0.78, 0.46, 0.05, 0.045);
  for (const x of [0.43, 0.5, 0.57]) P.line(x, 0.4, x, 0.86, 'A');
  P.e(0.5, 0.32, 0.18, 0.08, 'b', { h: 0.8 });
  for (let i = 0; i < 7; i++) P.c(0.34 + i * 0.053, 0.29, 0.31 + i * 0.06, 0.2 - Math.sin(i / 2) * 0.03, 0.02, 0.006, 'b');
  for (const [x, y] of [[0.4, 0.5], [0.6, 0.55], [0.42, 0.7], [0.58, 0.78], [0.78, 0.5], [0.24, 0.4], [0.5, 0.62]]) P.dot(x, y, 'claw');
  P.eye(0.46, 0.46, 0.03, 'hollow', '#ffe080').eye(0.56, 0.46, 0.03, 'hollow', '#ffe080');
  P.e(0.5, 0.93, 0.2, 0.03, 'sand', { under: 1 });
};
D.wisp = (P) => {
  P.p([[0.5, 0.06], [0.58, 0.3], [0.7, 0.16], [0.72, 0.42], [0.82, 0.36], [0.78, 0.6], [0.66, 0.8], [0.5, 0.86], [0.34, 0.8], [0.22, 0.6], [0.2, 0.36], [0.3, 0.44], [0.3, 0.18], [0.42, 0.34]], 'a', { b: 0.14, glow: 1 });
  P.e(0.5, 0.6, 0.18, 0.18, 'b', { glow: 1, g: 9, soft: 1 }).e(0.5, 0.64, 0.09, 0.1, '#ffffff', { glow: 1, soft: 1 });
  P.eye(0.43, 0.56, 0.04, 'hollow', '#ffffff').eye(0.57, 0.56, 0.04, 'hollow', '#ffffff').line(0.46, 0.68, 0.54, 0.68, 'ink');
};
D.bomb = (P) => {
  P.p([[0.34, 0.2], [0.42, 0.04], [0.48, 0.18], [0.56, 0.02], [0.6, 0.2], [0.7, 0.1], [0.68, 0.3], [0.3, 0.3]], 'b', { b: 0.06, glow: 1 });
  P.e(0.5, 0.56, 0.32, 0.31, 'a', { glow: 0, h: 1.1 }).e(0.42, 0.44, 0.1, 0.07, 'b', { over: 1, r: -0.5 });
  P.p([[0.34, 0.5], [0.46, 0.53], [0.44, 0.58], [0.34, 0.56]], 'ink', { b: 0.01, flat: 1 }).p([[0.56, 0.53], [0.68, 0.5], [0.68, 0.56], [0.58, 0.58]], 'ink', { b: 0.01, flat: 1 });
  P.dot(0.41, 0.55, 'b').dot(0.62, 0.55, 'b');
  P.p([[0.36, 0.68], [0.64, 0.68], [0.58, 0.78], [0.42, 0.78]], 'ink', { b: 0.01, flat: 1 }).teeth(0.4, 0.69, 0.6, 0.69, 5, 'b').teeth(0.44, 0.77, 0.56, 0.77, 3, 'b', -1);
};
D.eye = (P) => {
  for (let i = 0; i < 5; i++) { const x = 0.32 + i * 0.09; P.k([[x, 0.66, 0.035], [x + Math.sin(i * 2) * 0.06, 0.8, 0.025], [x - 0.02, 0.94, 0.01]], 'A', { dim: i % 2 }); }
  P.e(0.5, 0.48, 0.28, 0.27, 'a', { h: 1.2 });
  P.e(0.53, 0.47, 0.18, 0.16, '#f0ece4', { over: 1 }).e(0.56, 0.47, 0.1, 0.1, 'b', { over: 1 }).e(0.57, 0.47, 0.035, 0.07, 'ink', { over: 1, flat: 1 });
  P.e(0.5, 0.31, 0.24, 0.1, 'A', { over: 1 }).e(0.5, 0.64, 0.22, 0.07, 'A', { over: 1 });
  P.dot(0.52, 0.43, 'white').line(0.38, 0.45, 0.44, 0.48, '#c04050').line(0.4, 0.52, 0.45, 0.5, '#c04050');
};
D.urn = (P) => {
  P.c(0.5, 0.92, 0.5, 0.82, 0.14, 0.1, 'gold').e(0.5, 0.6, 0.26, 0.24, 'a', { gloss: 1 }).c(0.5, 0.36, 0.5, 0.24, 0.11, 0.13, 'a', { gloss: 1 });
  P.sym((s, X) => P.k([[X(0.14), 0.32], [X(0.32), 0.3, 0.02], [X(0.36), 0.5, 0.02]].map((p) => [p[0], p[1], p[2] ?? 0.02]), 'gold'));
  P.e(0.5, 0.23, 0.13, 0.04, 'ink', { flat: 1 }).e(0.5, 0.18, 0.1, 0.08, 'b', { glow: 1 });
  P.e(0.5, 0.6, 0.26, 0.045, 'gold', { over: 1 }).e(0.5, 0.48, 0.24, 0.02, 'B', { over: 1 });
  P.eye(0.44, 0.22, 0.03, 'glow', '#ffffff').eye(0.56, 0.22, 0.03, 'glow', '#ffffff');
  for (let i = 0; i < 4; i++) P.dot(0.33 + i * 0.11, 0.6, 'b');
};
D.drone = (P) => {
  P.sym((s, X) => { P.c(X(0.18), 0.28, X(0.4), 0.42, 0.02, 0.02, 'iron'); P.e(X(0.16), 0.26, 0.14, 0.025, 'metal', { soft: 1 }); });
  P.c(0.5, 0.72, 0.5, 0.92, 0.015, 0.006, 'iron').e(0.5, 0.52, 0.22, 0.2, 'a', { gloss: 1, h: 1.1 });
  P.e(0.56, 0.52, 0.12, 0.12, 'iron', { over: 1 }).e(0.58, 0.52, 0.07, 0.07, 'b', { over: 1, glow: 1 });
  P.e(0.5, 0.36, 0.22, 0.04, 'A', { over: 1 }).e(0.5, 0.68, 0.18, 0.04, 'A', { over: 1 });
  P.dot(0.56, 0.5, 'white').dot(0.36, 0.52, 'b').dot(0.66, 0.4, 'b');
};
// ---- beasts on four legs
function quad(P, o = {}) {
  const leg = o.leg || 1, bulk = o.bulk || 1, A = o.legCol || 'a';
  P.c(0.32, 0.66, 0.29, 0.9, 0.05 * leg, 0.035 * leg, A, { dim: 1 }).c(0.6, 0.64, 0.62, 0.9, 0.045 * leg, 0.035 * leg, A, { dim: 1 });
  if (o.tail) o.tail();
  P.e(0.42, 0.6, 0.25 * bulk, 0.15 * bulk).e(0.6, 0.56, 0.13 * bulk, 0.15 * bulk, 'a', { g: 10 }).e(0.27, 0.6, 0.11 * bulk, 0.13 * bulk, 'a', { g: 10 });
  if (o.belly) P.e(0.47, 0.7, 0.2, 0.06, o.belly, { over: 1 });
  if (o.back) P.e(0.42, 0.5, 0.24, 0.06, o.back, { over: 1 });
  P.c(0.27, 0.66, 0.34, 0.92, 0.07 * leg, 0.04 * leg, A).c(0.64, 0.64, 0.68, 0.92, 0.055 * leg, 0.042 * leg, A);
  P.e(0.35, 0.93, 0.05 * leg, 0.022, o.paw || 'A').e(0.69, 0.93, 0.05 * leg, 0.022, o.paw || 'A');
}
D.wolf = (P) => {
  quad(P, { back: 'b', belly: 'L', tail: () => P.k([[0.2, 0.56, 0.06], [0.1, 0.5, 0.05], [0.05, 0.38, 0.035], [0.08, 0.3, 0.015]]) });
  P.c(0.6, 0.56, 0.7, 0.42, 0.1, 0.08, 'a', { g: 10 });
  P.p([[0.66, 0.36], [0.65, 0.25], [0.73, 0.33]], 'A', { b: 0.025, dim: 1 });
  P.e(0.73, 0.41, 0.1, 0.09, 'a', { g: 11 }).c(0.76, 0.43, 0.94, 0.47, 0.07, 0.04, 'a', { g: 11 }).c(0.76, 0.49, 0.9, 0.52, 0.045, 0.024, 'A');
  P.e(0.84, 0.47, 0.08, 0.025, 'L', { over: 1 });
  P.p([[0.69, 0.35], [0.7, 0.23], [0.78, 0.33]], 'a', { b: 0.025 }).p([[0.71, 0.33], [0.715, 0.27], [0.75, 0.32]], 'A', { over: 1, b: 0.01 });
  for (let i = 0; i < 4; i++) P.p([[0.6 + i * 0.03, 0.62], [0.58 + i * 0.03, 0.74], [0.63 + i * 0.03, 0.66]], 'L', { b: 0.02 });
  P.e(0.94, 0.455, 0.02, 0.018, 'ink', { flat: 1 }).eye(0.79, 0.39, 0.03).teeth(0.82, 0.505, 0.9, 0.495, 3);
};
D.boar = (P) => {
  quad(P, { bulk: 1.15, leg: 0.85, belly: 'b', tail: () => P.k([[0.16, 0.54, 0.02], [0.1, 0.5, 0.015], [0.1, 0.44, 0.012]]) });
  for (let i = 0; i < 7; i++) P.p([[0.2 + i * 0.07, 0.48 - Math.sin(i / 2.2) * 0.04], [0.26 + i * 0.07, 0.34 - Math.sin(i / 2) * 0.05], [0.3 + i * 0.07, 0.48 - Math.sin(i / 2) * 0.05]], 'A', { b: 0.02 });
  P.e(0.72, 0.58, 0.14, 0.14, 'a', { g: 11 }).c(0.74, 0.6, 0.9, 0.66, 0.1, 0.07, 'a', { g: 11 }).e(0.93, 0.66, 0.025, 0.055, '#c88a7a', { g: 11 });
  P.p([[0.68, 0.46], [0.66, 0.34], [0.76, 0.46]], 'A', { b: 0.02 });
  P.k([[0.84, 0.72, 0.02], [0.9, 0.68, 0.016], [0.9, 0.58, 0.008]], 'horn');
  P.eye(0.78, 0.53, 0.025, 'glow', '#ff6a3a').dot(0.93, 0.64, 'ink').dot(0.93, 0.68, 'ink');
};
D.rhino = (P) => {
  quad(P, { bulk: 1.15, leg: 1.1, belly: 'L', tail: () => P.k([[0.16, 0.56, 0.02], [0.08, 0.6, 0.012]]) });
  for (const x of [0.34, 0.46, 0.58]) P.p([[x - 0.06, 0.44], [x + 0.05, 0.44], [x + 0.04, 0.6], [x - 0.05, 0.6]], 'b', { over: 1, b: 0.015 });
  P.e(0.74, 0.56, 0.13, 0.12, 'a', { g: 11 }).c(0.74, 0.58, 0.9, 0.62, 0.1, 0.07, 'a', { g: 11 });
  P.p([[0.84, 0.56], [0.93, 0.32], [0.95, 0.58]], 'horn', { b: 0.03 }).p([[0.75, 0.46], [0.8, 0.38], [0.82, 0.48]], 'horn', { b: 0.02 });
  P.p([[0.66, 0.46], [0.62, 0.36], [0.7, 0.44]], 'A', { b: 0.02 });
  P.eye(0.75, 0.53, 0.025).line(0.84, 0.66, 0.9, 0.66, 'ink');
};
D.cat = (P) => {
  quad(P, { leg: 0.8, belly: 'b', paw: 'b', tail: () => P.k([[0.2, 0.58, 0.035], [0.08, 0.5, 0.03], [0.06, 0.3, 0.028], [0.14, 0.18, 0.025]]) });
  for (const x of [0.32, 0.42, 0.52]) P.line(x, 0.46, x - 0.02, 0.56, 'A');
  P.e(0.72, 0.42, 0.12, 0.11, 'a', { g: 11 }).e(0.8, 0.47, 0.06, 0.05, 'b', { over: 1 });
  P.p([[0.63, 0.36], [0.62, 0.2], [0.72, 0.31]], 'a', { b: 0.025 }).p([[0.75, 0.31], [0.82, 0.18], [0.83, 0.34]], 'a', { b: 0.025 }).p([[0.77, 0.31], [0.81, 0.24], [0.815, 0.33]], '#e08a9a', { over: 1, b: 0.01 });
  P.eye(0.74, 0.4, 0.035, 'round', '#9ae04a').eye(0.84, 0.41, 0.025, 'round', '#9ae04a').dot(0.86, 0.47, '#e08a9a').line(0.84, 0.49, 0.95, 0.47, 'claw').line(0.84, 0.5, 0.95, 0.53, 'claw');
};
D.beast = (P) => {
  quad(P, { bulk: 1.2, leg: 1.25, belly: 'L', paw: 'claw', tail: () => P.k([[0.18, 0.52, 0.045], [0.08, 0.44, 0.035], [0.05, 0.3, 0.025], [0.1, 0.2, 0.05]]) });
  P.k([[0.6, 0.52, 0.16], [0.72, 0.42, 0.15]], 'A', { g: 12, h: 0.8 });
  for (let i = 0; i < 6; i++) P.p([[0.52 + i * 0.04, 0.36 - i * 0.015], [0.48 + i * 0.05, 0.2 - i * 0.01], [0.58 + i * 0.04, 0.32]], 'A', { b: 0.02, g: 12 });
  P.e(0.8, 0.44, 0.11, 0.1, 'a').c(0.82, 0.46, 0.94, 0.5, 0.07, 0.05, 'a', { g: 13 }).c(0.8, 0.52, 0.92, 0.56, 0.05, 0.035, 'A');
  P.k([[0.78, 0.36, 0.035], [0.72, 0.22, 0.028], [0.6, 0.14, 0.018], [0.52, 0.18, 0.008]], 'horn').k([[0.84, 0.36, 0.028], [0.86, 0.24, 0.02], [0.8, 0.16, 0.008]], 'horn', { dim: 1 });
  P.eye(0.85, 0.41, 0.035).teeth(0.86, 0.53, 0.93, 0.52, 3).teeth(0.86, 0.555, 0.92, 0.555, 2, 'claw', -1);
};
D.bonehound = (P) => {
  P.c(0.32, 0.66, 0.29, 0.9, 0.025, 0.02, 'a', { dim: 1 }).c(0.6, 0.64, 0.62, 0.9, 0.025, 0.02, 'a', { dim: 1 });
  P.k([[0.22, 0.56, 0.02], [0.12, 0.48, 0.016], [0.06, 0.38, 0.012]], 'a');
  P.k([[0.22, 0.56, 0.028], [0.62, 0.54, 0.03]], 'a');
  for (let i = 0; i < 5; i++) P.arc(0.36 + i * 0.05, 0.6, 0.08 - i * 0.004, -0.3, 2.6, 'a').arc(0.36 + i * 0.05, 0.6, 0.075, 0.3, 2.4, 'A');
  P.e(0.26, 0.6, 0.07, 0.06).c(0.27, 0.64, 0.34, 0.92, 0.03, 0.02).c(0.64, 0.6, 0.68, 0.92, 0.028, 0.02);
  P.e(0.35, 0.93, 0.04, 0.02, 'a').e(0.69, 0.93, 0.04, 0.02, 'a');
  P.c(0.62, 0.54, 0.7, 0.42, 0.03, 0.03).e(0.75, 0.4, 0.09, 0.075).c(0.77, 0.42, 0.92, 0.46, 0.05, 0.03).c(0.76, 0.48, 0.88, 0.52, 0.03, 0.018);
  P.e(0.76, 0.39, 0.035, 0.03, 'ink', { flat: 1, over: 1 }).eye(0.765, 0.39, 0.025, 'glow');
  P.teeth(0.8, 0.475, 0.9, 0.465, 4).teeth(0.8, 0.5, 0.86, 0.5, 3, 'claw', -1);
  P.e(0.62, 0.62, 0.05, 0.05, 'b', { glow: 1, soft: 1 });
};
// ---- winged things
D.bird = (P) => {
  P.p([[0.5, 0.42], [0.66, 0.14], [0.78, 0.1], [0.74, 0.22], [0.82, 0.24], [0.7, 0.36], [0.62, 0.48]], 'A', { dim: 1, b: 0.02 });
  P.p([[0.24, 0.62], [0.04, 0.72], [0.08, 0.62], [0.02, 0.6], [0.2, 0.54]], 'A', { b: 0.02 });
  P.c(0.5, 0.74, 0.48, 0.88, 0.018, 0.014, 'horn').c(0.58, 0.72, 0.6, 0.88, 0.018, 0.014, 'horn');
  P.e(0.48, 0.58, 0.2, 0.14, 'a', { r: -0.35 }).e(0.54, 0.64, 0.12, 0.07, 'b', { over: 1, r: -0.3 });
  P.c(0.62, 0.5, 0.72, 0.36, 0.07, 0.05, 'b', { g: 14 }).e(0.74, 0.32, 0.075, 0.065, 'a', { g: 14 });
  P.p([[0.8, 0.28], [0.92, 0.34], [0.88, 0.4], [0.8, 0.36]], 'horn', { b: 0.02 });
  P.p([[0.5, 0.5], [0.34, 0.12], [0.22, 0.06], [0.14, 0.18], [0.04, 0.22], [0.12, 0.3], [0.04, 0.38], [0.16, 0.42], [0.1, 0.5], [0.3, 0.6]], 'a', { b: 0.025 });
  for (let i = 0; i < 4; i++) P.line(0.16 + i * 0.05, 0.22 + i * 0.07, 0.36 + i * 0.03, 0.2 + i * 0.07, 'A');
  P.teeth(0.46, 0.88, 0.62, 0.88, 4, 'horn', 1).eye(0.77, 0.3, 0.025).dot(0.86, 0.33, 'ink');
};
D.ray = (P) => {
  P.k([[0.3, 0.56, 0.02], [0.14, 0.62, 0.012], [0.02, 0.6, 0.005]], 'A');
  P.p([[0.24, 0.52], [0.44, 0.3], [0.62, 0.14], [0.6, 0.36], [0.82, 0.44], [0.6, 0.6], [0.56, 0.8], [0.42, 0.62]], 'a', { b: 0.08 });
  P.p([[0.42, 0.62], [0.56, 0.8], [0.6, 0.6], [0.5, 0.56]], 'b', { over: 1, b: 0.02 });
  P.c(0.76, 0.42, 0.88, 0.36, 0.025, 0.012, 'a').c(0.76, 0.46, 0.88, 0.5, 0.025, 0.012, 'a');
  for (let i = 0; i < 4; i++) P.dot(0.44 + i * 0.05, 0.4 + i * 0.02, 'b');
  P.eye(0.7, 0.42, 0.025);
};
D.fish = (P) => {
  P.p([[0.16, 0.5], [0.02, 0.34], [0.06, 0.52], [0.02, 0.7]], 'A', { b: 0.03 });
  P.p([[0.38, 0.32], [0.48, 0.12], [0.58, 0.3]], 'A', { b: 0.02 });
  P.e(0.46, 0.52, 0.32, 0.22).e(0.5, 0.64, 0.24, 0.08, 'b', { over: 1 });
  P.k([[0.6, 0.32, 0.012], [0.7, 0.14, 0.01], [0.86, 0.14, 0.008]], 'A').e(0.88, 0.17, 0.035, 0.035, 'b', { glow: 1 });
  P.p([[0.64, 0.5], [0.94, 0.48], [0.92, 0.62], [0.66, 0.66]], 'ink', { b: 0.01, flat: 1 });
  P.teeth(0.68, 0.51, 0.9, 0.5, 6).teeth(0.68, 0.64, 0.9, 0.61, 6, 'claw', -1);
  P.p([[0.4, 0.6], [0.3, 0.76], [0.46, 0.68]], 'A', { b: 0.02 });
  for (let i = 0; i < 4; i++) P.arc(0.26 + i * 0.08, 0.46, 0.06, -1, 1, 'A');
  P.eye(0.68, 0.42, 0.035, 'round', P.eyeCol);
};
D.snake = (P, c1, c2, o = {}) => {
  P.k([[0.14, 0.86, 0.08], [0.36, 0.92, 0.09], [0.66, 0.88, 0.09], [0.82, 0.8, 0.07]], 'a', { dim: 1 });
  P.k([[0.82, 0.8, 0.075], [0.62, 0.74, 0.09], [0.42, 0.74, 0.095], [0.36, 0.6, 0.085], [0.44, 0.44, 0.075], [0.58, 0.34, 0.065]], 'a', { g: 15 });
  P.k([[0.36, 0.62, 0.04], [0.44, 0.46, 0.036], [0.58, 0.36, 0.03]], 'b', { over: 1 });
  for (let i = 0; i < 6; i++) P.arc(0.3 + i * 0.1, 0.8, 0.05, 3.6, 5.8, 'A');
  if (o.crest) for (let i = 0; i < 5; i++) P.p([[0.44 + i * 0.04, 0.4 - i * 0.04], [0.36 + i * 0.05, 0.24 - i * 0.04], [0.5 + i * 0.04, 0.34 - i * 0.04]], 'b', { b: 0.02, under: 1 });
  P.e(0.66, 0.3, 0.12, 0.09, 'a', { g: 15, r: 0.15 }).c(0.7, 0.32, 0.86, 0.36, 0.07, 0.035, 'a', { g: 15 });
  P.p([[0.74, 0.38], [0.94, 0.38], [0.9, 0.46], [0.74, 0.42]], 'ink', { b: 0.01, flat: 1 }).k([[0.92, 0.42, 0.006], [0.98, 0.44, 0.004]], '#e04a5a');
  P.teeth(0.8, 0.385, 0.84, 0.385, 2);
  P.eye(0.72, 0.27, 0.035);
};
D.serpent = (P, c1, c2) => D.snake(P, c1, c2, { crest: 1 });
D.dragon = (P) => {
  P.p([[0.46, 0.4], [0.56, 0.08], [0.72, 0.04], [0.68, 0.16], [0.8, 0.18], [0.72, 0.26], [0.76, 0.32], [0.6, 0.4]], 'A', { dim: 1, b: 0.02 });
  P.k([[0.3, 0.66, 0.08], [0.16, 0.7, 0.06], [0.06, 0.62, 0.04], [0.04, 0.5, 0.025], [0.08, 0.42, 0.01]]);
  P.p([[0.08, 0.44], [0.0, 0.38], [0.04, 0.48]], 'b', { b: 0.015 });
  P.c(0.36, 0.7, 0.32, 0.92, 0.06, 0.04, 'a', { dim: 1 }).c(0.6, 0.68, 0.64, 0.9, 0.04, 0.03, 'a', { dim: 1 });
  P.e(0.44, 0.62, 0.22, 0.16, 'a', { r: -0.2 }).e(0.48, 0.7, 0.16, 0.07, 'b', { over: 1, r: -0.25 });
  for (let i = 0; i < 4; i++) P.arc(0.4 + i * 0.05, 0.7, 0.045, 0.2, 2.9, 'B');
  P.k([[0.56, 0.56, 0.09], [0.64, 0.42, 0.07], [0.7, 0.3, 0.06]], 'a', { g: 16 }).k([[0.6, 0.58, 0.04], [0.67, 0.44, 0.032], [0.72, 0.33, 0.028]], 'b', { over: 1 });
  P.e(0.74, 0.26, 0.085, 0.07, 'a', { g: 16 }).c(0.76, 0.28, 0.92, 0.3, 0.055, 0.035, 'a', { g: 16 }).c(0.76, 0.33, 0.88, 0.37, 0.035, 0.02, 'A');
  P.k([[0.72, 0.2, 0.025], [0.64, 0.1, 0.018], [0.58, 0.08, 0.006]], 'horn').k([[0.76, 0.2, 0.02], [0.74, 0.1, 0.012], [0.7, 0.06, 0.004]], 'horn', { dim: 1 });
  P.c(0.3, 0.66, 0.36, 0.92, 0.08, 0.04).c(0.6, 0.66, 0.66, 0.8, 0.04, 0.03).c(0.66, 0.8, 0.72, 0.84, 0.03, 0.02);
  P.e(0.37, 0.93, 0.06, 0.022, 'claw');
  P.p([[0.44, 0.5], [0.3, 0.12], [0.2, 0.02], [0.18, 0.16], [0.08, 0.14], [0.12, 0.26], [0.02, 0.28], [0.1, 0.38], [0.06, 0.46], [0.26, 0.54]], 'a', { b: 0.02 });
  P.line(0.44, 0.5, 0.2, 0.03, 'A').line(0.4, 0.48, 0.09, 0.15, 'A').line(0.38, 0.5, 0.03, 0.29, 'A').line(0.36, 0.52, 0.07, 0.46, 'A');
  P.eye(0.77, 0.24, 0.028).teeth(0.8, 0.325, 0.9, 0.32, 4).dot(0.91, 0.28, 'ink');
};
D.bonedragon = (P) => {
  P.p([[0.46, 0.4], [0.56, 0.08], [0.72, 0.04], [0.6, 0.4]], '#5a4a5a', { dim: 1, b: 0.01 });
  for (let i = 0; i < 4; i++) P.line(0.48, 0.4, 0.52 + i * 0.06, 0.06 + i * 0.02, 'a');
  P.k([[0.3, 0.62, 0.025], [0.14, 0.68, 0.02], [0.04, 0.58, 0.015], [0.06, 0.46, 0.01]]);
  P.k([[0.28, 0.6, 0.035], [0.58, 0.56, 0.035], [0.66, 0.42, 0.03], [0.72, 0.3, 0.028]]);
  for (let i = 0; i < 6; i++) P.arc(0.34 + i * 0.045, 0.6, 0.1 - i * 0.006, 0.1, 2.6, 'a').arc(0.34 + i * 0.045, 0.61, 0.09 - i * 0.006, 0.4, 2.3, 'A');
  P.e(0.44, 0.66, 0.08, 0.08, 'b', { glow: 1, soft: 1 });
  P.e(0.26, 0.62, 0.07, 0.06).c(0.28, 0.66, 0.34, 0.92, 0.03, 0.02).c(0.6, 0.6, 0.66, 0.9, 0.025, 0.018);
  P.e(0.74, 0.26, 0.085, 0.07).c(0.76, 0.28, 0.92, 0.3, 0.05, 0.03).c(0.76, 0.34, 0.88, 0.38, 0.03, 0.018);
  P.e(0.75, 0.25, 0.035, 0.03, 'ink', { over: 1, flat: 1 }).eye(0.755, 0.25, 0.025);
  P.k([[0.72, 0.2, 0.022], [0.64, 0.1, 0.015], [0.58, 0.08, 0.005]]);
  P.p([[0.44, 0.5], [0.3, 0.12], [0.2, 0.02], [0.26, 0.54]], '#5a4a5a', { b: 0.01 });
  for (let i = 0; i < 4; i++) P.line(0.44, 0.5, 0.06 + i * 0.06, 0.1 + i * 0.1, 'a');
  P.teeth(0.8, 0.33, 0.9, 0.325, 4).teeth(0.8, 0.355, 0.88, 0.355, 3, 'claw', -1);
};
D.demon = (P) => {
  P.sym((s, X) => {
    P.p([[X(0.12), 0.4], [X(0.3), 0.08], [X(0.44), 0.02], [X(0.4), 0.18], [X(0.46), 0.26], [X(0.36), 0.32], [X(0.4), 0.42], [X(0.26), 0.44]], 'A', { b: 0.02, dim: s > 0 ? 0 : 1 });
    P.line(X(0.14), 0.4, X(0.42), 0.04, 'ink').line(X(0.14), 0.4, X(0.42), 0.22, 'ink');
  });
  P.k([[0.6, 0.8, 0.03], [0.76, 0.86, 0.022], [0.86, 0.78, 0.012]], 'a', { dim: 1 }).p([[0.85, 0.72], [0.94, 0.78], [0.86, 0.84]], 'A', { b: 0.015 });
  P.c(0.42, 0.72, 0.36, 0.92, 0.06, 0.04).c(0.58, 0.72, 0.64, 0.92, 0.06, 0.04);
  P.p([[0.32, 0.32], [0.68, 0.32], [0.62, 0.74], [0.38, 0.74]], 'a', { b: 0.08 });
  P.e(0.43, 0.46, 0.06, 0.05, 'L', { over: 1 }).e(0.57, 0.46, 0.06, 0.05, 'L', { over: 1 }).line(0.5, 0.52, 0.5, 0.68, 'A');
  for (let i = 0; i < 3; i++) P.line(0.44, 0.56 + i * 0.05, 0.56, 0.56 + i * 0.05, 'A');
  P.sym((s, X) => { P.e(X(0.18), 0.36, 0.08, 0.07); P.c(X(0.18), 0.4, X(0.22), 0.6, 0.05, 0.04); P.e(X(0.22), 0.64, 0.05, 0.045, 'a'); P.teeth(X(0.19), 0.68, X(0.25), 0.68, 3, 'claw'); });
  P.e(0.5, 0.26, 0.1, 0.1, 'a', { g: 17 });
  P.sym((s, X) => P.k([[X(0.08), 0.2, 0.025], [X(0.14), 0.1, 0.018], [X(0.12), 0.02, 0.006]], 'horn'));
  P.e(0.42, 0.93, 0.06, 0.02, 'claw').e(0.62, 0.93, 0.06, 0.02, 'claw');
  P.eye(0.45, 0.25, 0.03).eye(0.55, 0.25, 0.03).p([[0.44, 0.31], [0.56, 0.31], [0.53, 0.34], [0.47, 0.34]], 'ink', { b: 0.005, flat: 1 }).teeth(0.45, 0.31, 0.55, 0.31, 3);
  P.e(0.5, 0.44, 0.04, 0.04, 'b', { glow: 1, soft: 1 });
};
D.imp = (P) => {
  P.sym((s, X) => { P.p([[X(0.18), 0.48], [X(0.36), 0.24], [X(0.42), 0.4], [X(0.3), 0.5]], 'A', { b: 0.015, dim: 1 }); });
  P.k([[0.6, 0.78, 0.022], [0.8, 0.8, 0.016], [0.86, 0.68, 0.01]], 'a').p([[0.86, 0.62], [0.92, 0.68], [0.84, 0.72]], 'A', { b: 0.01 });
  P.c(0.44, 0.74, 0.42, 0.9, 0.04, 0.03).c(0.56, 0.74, 0.6, 0.9, 0.04, 0.03);
  P.e(0.5, 0.66, 0.15, 0.14).e(0.5, 0.7, 0.09, 0.07, 'b', { over: 1 });
  P.e(0.5, 0.42, 0.17, 0.15, 'a', { g: 18 });
  P.sym((s, X) => { P.p([[X(0.13), 0.38], [X(0.32), 0.28], [X(0.24), 0.44]], 'a', { b: 0.02, g: 18 }); P.k([[X(0.08), 0.32, 0.02], [X(0.11), 0.22, 0.012], [X(0.08), 0.16, 0.004]], 'horn'); });
  P.c(0.64, 0.62, 0.74, 0.54, 0.035, 0.03).k([[0.74, 0.54, 0.008], [0.78, 0.3, 0.008]], 'wood').p([[0.76, 0.3], [0.8, 0.22], [0.82, 0.32]], 'metal', { b: 0.01 });
  P.eye(0.44, 0.4, 0.035, 'round', P.eyeCol).eye(0.57, 0.4, 0.035, 'round', P.eyeCol).p([[0.42, 0.49], [0.6, 0.49], [0.56, 0.54], [0.46, 0.54]], 'ink', { b: 0.005, flat: 1 }).teeth(0.44, 0.49, 0.58, 0.49, 4);
  P.e(0.42, 0.92, 0.05, 0.02, 'A').e(0.61, 0.92, 0.05, 0.02, 'A');
};
// ---- shells and many legs
D.crab = (P, c1, c2, o = {}) => {
  P.sym((s, X) => { for (let i = 0; i < 3; i++) P.k([[X(0.2 + i * 0.05), 0.68, 0.025], [X(0.36 + i * 0.03), 0.78, 0.022], [X(0.4 + i * 0.03), 0.92, 0.01]], 'A', { dim: 1 }); });
  P.sym((s, X) => {
    P.k([[X(0.22), 0.62, 0.05], [X(0.36), 0.5, 0.045], [X(0.4), 0.36, 0.04]], 'a');
    P.c(X(0.33), 0.3, X(0.4), 0.06, 0.055, 0.014, 'a', { gloss: !o.steam });
    P.c(X(0.42), 0.3, X(0.47), 0.15, 0.035, 0.01, 'A');
    P.e(X(0.38), 0.33, 0.09, 0.08, 'a', { r: s * 0.3, gloss: !o.steam });
    P.teeth(X(0.395), 0.22, X(0.405), 0.12, 3, 'claw');
  });
  P.e(0.5, 0.62, 0.3, 0.18, 'a', { h: 1.1, gloss: !o.steam });
  P.e(0.5, 0.56, 0.26, 0.06, 'L', { over: 1 }).arc(0.5, 0.64, 0.28, 3.4, 6.0, 'A', 0.12);
  for (const x of [0.32, 0.5, 0.68]) P.e(x, 0.68, 0.04, 0.03, 'b', { over: 1 });
  if (o.steam) {
    P.c(0.36, 0.48, 0.34, 0.2, 0.045, 0.05, 'iron').e(0.34, 0.18, 0.06, 0.025, 'iron').e(0.3, 0.08, 0.07, 0.05, '#e8e8f0', { glow: 1, soft: 1, nooutline: 1 }).e(0.2, 0.04, 0.05, 0.035, '#e8e8f0', { glow: 1, soft: 1, nooutline: 1 });
    P.e(0.6, 0.5, 0.06, 0.06, 'gold').e(0.6, 0.5, 0.04, 0.04, '#f4f0e0', { over: 1, flat: 1 }).line(0.6, 0.5, 0.62, 0.47, 'ink');
    for (let i = 0; i < 7; i++) P.dot(0.24 + i * 0.087, 0.62 + Math.sin(i / 2) * 0.02, 'claw');
  } else {
    P.k([[0.44, 0.46, 0.012], [0.42, 0.36, 0.01]], 'a').k([[0.56, 0.46, 0.012], [0.58, 0.36, 0.01]], 'a');
    P.e(0.42, 0.34, 0.03, 0.03, 'ink', { flat: 1 }).e(0.58, 0.34, 0.03, 0.03, 'ink', { flat: 1 }).eye(0.42, 0.335, 0.025).eye(0.58, 0.335, 0.025);
  }
};
D.steamcrab = (P, c1, c2) => D.crab(P, c1, c2, { steam: 1 });
D.scorpion = (P) => {
  for (let i = 0; i < 3; i++) P.k([[0.4 + i * 0.08, 0.7, 0.02], [0.36 + i * 0.1, 0.8, 0.016], [0.32 + i * 0.1, 0.92, 0.008]], 'A', { dim: 1 });
  const seg = [[0.28, 0.66, 0.07, 0.06], [0.18, 0.56, 0.06, 0.055], [0.15, 0.43, 0.055, 0.05], [0.2, 0.31, 0.05, 0.045], [0.3, 0.23, 0.045, 0.04]];
  seg.forEach(([x, y, a, b]) => P.e(x, y, a, b, 'a', { gloss: 1 }));
  P.k([[0.34, 0.2, 0.04], [0.44, 0.22, 0.025], [0.48, 0.3, 0.006]], 'b');
  P.e(0.5, 0.7, 0.24, 0.1, 'a', { gloss: 1 });
  for (let i = 0; i < 4; i++) P.line(0.34 + i * 0.09, 0.62, 0.32 + i * 0.09, 0.78, 'A');
  for (let i = 0; i < 3; i++) P.k([[0.42 + i * 0.08, 0.74, 0.022], [0.44 + i * 0.1, 0.82, 0.018], [0.48 + i * 0.1, 0.92, 0.008]], 'A');
  P.k([[0.68, 0.68, 0.035], [0.78, 0.6, 0.03], [0.82, 0.52, 0.03]], 'a').e(0.86, 0.46, 0.07, 0.05, 'a', { r: -0.4, gloss: 1 }).p([[0.86, 0.42], [0.98, 0.34], [0.94, 0.44]], 'a', { b: 0.02 }).p([[0.9, 0.48], [0.99, 0.48], [0.92, 0.52]], 'A', { b: 0.015 });
  P.eye(0.7, 0.66, 0.025).eye(0.66, 0.65, 0.02);
};
D.shell = (P) => {
  for (let i = 0; i < 5; i++) P.k([[0.66, 0.6 + i * 0.03, 0.03], [0.78 + i * 0.02, 0.7 + i * 0.04, 0.025], [0.84 + i * 0.03, 0.86 - i * 0.03 + i * i * 0.01, 0.012]], 'b', { dim: i % 2 });
  P.e(0.44, 0.54, 0.32, 0.32, 'a', { h: 1.2 });
  for (let r = 0.28; r > 0.04; r -= 0.06) P.arc(0.38 + (0.28 - r) * 0.4, 0.52, r, -2.6, 2.2, 'A');
  for (let i = 0; i < 6; i++) P.line(0.44 + Math.cos(i - 2) * 0.3, 0.54 + Math.sin(i - 2) * 0.3, 0.44 + Math.cos(i - 2) * 0.12, 0.54 + Math.sin(i - 2) * 0.12, 'L');
  P.e(0.7, 0.56, 0.08, 0.14, 'ink', { over: 1, flat: 1 }).eye(0.71, 0.52, 0.035, 'round', P.eyeCol);
};
D.worm = (P) => {
  P.e(0.32, 0.92, 0.28, 0.06, 'sand', { under: 1 });
  const s = [[0.3, 0.86, 0.11], [0.32, 0.72, 0.11], [0.38, 0.58, 0.105], [0.46, 0.46, 0.1], [0.56, 0.36, 0.095], [0.66, 0.3, 0.09]];
  s.forEach(([x, y, r]) => P.e(x, y, r, r * 0.92, 'a'));
  s.forEach(([x, y, r]) => P.e(x - r * 0.25, y + r * 0.3, r * 0.6, r * 0.25, 'b', { over: 1 }));
  for (let i = 0; i < 5; i++) P.p([[0.26 + i * 0.08, 0.84 - i * 0.12], [0.18 + i * 0.08, 0.76 - i * 0.12], [0.24 + i * 0.08, 0.72 - i * 0.12]], 'A', { b: 0.015 });
  P.e(0.74, 0.28, 0.1, 0.12, 'a').e(0.8, 0.28, 0.06, 0.1, 'ink', { flat: 1 });
  for (let i = 0; i < 7; i++) { const a = -1.4 + i * 0.47; P.c(0.8 + Math.cos(a) * 0.075, 0.28 + Math.sin(a) * 0.1, 0.8 + Math.cos(a) * 0.04, 0.28 + Math.sin(a) * 0.05, 0.012, 0.004, 'claw', { soft: 1 }); }
  P.e(0.81, 0.28, 0.025, 0.04, 'b', { glow: 1, soft: 1 });
};
D.plant = (P) => {
  P.p([[0.48, 0.86], [0.2, 0.74], [0.08, 0.8], [0.3, 0.88]], 'leaf', { b: 0.02 }).p([[0.52, 0.86], [0.8, 0.76], [0.92, 0.84], [0.7, 0.9]], 'leaf', { b: 0.02 });
  P.k([[0.5, 0.92, 0.05], [0.46, 0.7, 0.04], [0.54, 0.52, 0.035], [0.56, 0.42, 0.03]], 'leaf');
  for (let i = 0; i < 6; i++) { const a = -2.6 + i * 0.6; P.e(0.58 + Math.cos(a) * 0.17, 0.34 + Math.sin(a) * 0.13, 0.09, 0.05, 'b', { r: a }); }
  P.e(0.6, 0.36, 0.17, 0.15, 'a', { h: 1.1 }).p([[0.6, 0.38], [0.86, 0.3], [0.84, 0.46]], 'ink', { b: 0.01, flat: 1 });
  P.teeth(0.66, 0.37, 0.84, 0.32, 4).teeth(0.66, 0.4, 0.82, 0.44, 4, 'claw', -1);
  for (const [x, y] of [[0.5, 0.28], [0.56, 0.24], [0.5, 0.42]]) P.dot(x, y, 'L');
  P.k([[0.42, 0.7, 0.012], [0.28, 0.6, 0.01], [0.22, 0.46, 0.008], [0.28, 0.4, 0.006]], 'leaf').k([[0.52, 0.62, 0.012], [0.72, 0.62, 0.01], [0.82, 0.54, 0.006]], 'leaf');
};
D.dryad = (P) => {
  P.k([[0.5, 0.9, 0.12], [0.5, 0.6, 0.09], [0.5, 0.4, 0.07]], 'wood');
  for (let i = 0; i < 4; i++) P.line(0.44 + i * 0.04, 0.9, 0.46 + i * 0.03, 0.46, '#5a3a20');
  P.sym((s, X) => P.k([[X(0.06), 0.46, 0.04], [X(0.22), 0.36, 0.03], [X(0.32), 0.16, 0.02]], 'wood'));
  P.e(0.5, 0.18, 0.3, 0.16, 'leaf').e(0.3, 0.26, 0.14, 0.1, 'leaf').e(0.72, 0.24, 0.14, 0.1, 'leaf');
  for (const [x, y] of [[0.36, 0.14], [0.6, 0.1], [0.7, 0.24], [0.28, 0.28], [0.48, 0.24]]) P.e(x, y, 0.035, 0.035, 'b');
  P.e(0.5, 0.4, 0.09, 0.1, 'a', { g: 19 }).eye(0.46, 0.39, 0.025, 'glow', '#c8ff80').eye(0.55, 0.39, 0.025, 'glow', '#c8ff80');
  P.e(0.5, 0.94, 0.3, 0.035, 'wood', { under: 1 });
};
// ---- people and armour
function humanoid(P, o = {}) {
  const skin = o.skin || 'skin', arm = o.arm || 'a', leg = o.leg || 'A';
  if (o.cape) P.p([[0.36, 0.36], [0.64, 0.36], [0.74, 0.9], [0.2, 0.92]], o.cape, { b: 0.04, dim: 1 });
  P.c(0.36, 0.42, 0.3, 0.6, 0.05, 0.04, arm, { dim: 1 });
  P.c(0.44, 0.68, 0.42, 0.9, 0.055, 0.045, leg).c(0.56, 0.68, 0.58, 0.9, 0.055, 0.045, leg);
  P.e(0.42, 0.92, 0.065, 0.03, o.boot || 'iron').e(0.6, 0.92, 0.065, 0.03, o.boot || 'iron');
  P.p([[0.35, 0.38], [0.65, 0.38], [0.61, 0.72], [0.39, 0.72]], o.body || 'a', { b: 0.06, gloss: o.gloss });
  if (o.tabard) P.p([[0.42, 0.42], [0.58, 0.42], [0.58, 0.86], [0.42, 0.86]], o.tabard, { b: 0.02 });
  P.e(0.5, 0.68, 0.13, 0.025, o.belt || 'wood', { over: 1 });
  P.e(0.5, 0.3, 0.09, 0.09, o.head || skin, { g: 20, gloss: o.gloss });
  P.c(0.64, 0.42, 0.7, 0.6, 0.05, 0.04, arm).e(0.71, 0.62, 0.035, 0.035, o.hand || arm);
  if (o.pads) P.e(0.35, 0.4, 0.075, 0.055, o.pads, { gloss: 1 }).e(0.65, 0.4, 0.075, 0.055, o.pads, { gloss: 1 });
}
D.soldier = (P) => {
  P.c(0.74, 0.08, 0.72, 0.92, 0.012, 0.012, 'wood').p([[0.72, 0.1], [0.75, -0.02], [0.78, 0.1]], 'metal', { b: 0.015 });
  P.e(0.75, 0.16, 0.035, 0.04, 'bronze');
  humanoid(P, { body: 'a', tabard: 'b', pads: 'metal', head: 'metal', gloss: 1, hand: 'iron' });
  P.e(0.5, 0.31, 0.08, 0.025, 'ink', { over: 1, flat: 1 }).eye(0.47, 0.31, 0.02).eye(0.54, 0.31, 0.02);
  P.p([[0.46, 0.22], [0.5, 0.08], [0.54, 0.22]], 'b', { b: 0.02 });
  P.e(0.5, 0.5, 0.03, 0.035, 'gold', { over: 1 });
};
D.knight = (P, c1, c2, o = {}) => {
  if (o.long) P.c(0.8, 0.0, 0.72, 0.62, 0.012, 0.022, 'metal').p([[0.66, 0.6], [0.8, 0.6], [0.78, 0.64], [0.68, 0.64]], 'gold', { b: 0.01 });
  humanoid(P, { body: 'a', cape: 'b', pads: 'a', head: 'a', gloss: 1, arm: 'a', leg: 'A', boot: 'A', belt: 'b', hand: 'a' });
  P.e(0.5, 0.31, 0.075, 0.02, 'ink', { over: 1, flat: 1 }).eye(0.47, 0.305, 0.02).eye(0.54, 0.305, 0.02);
  P.k([[0.42, 0.24, 0.02], [0.36, 0.14, 0.014], [0.36, 0.08, 0.004]], 'b').k([[0.58, 0.24, 0.02], [0.64, 0.14, 0.014], [0.64, 0.08, 0.004]], 'b');
  P.e(0.5, 0.5, 0.06, 0.07, 'L', { over: 1 }).line(0.5, 0.44, 0.5, 0.56, 'b').line(0.46, 0.49, 0.54, 0.49, 'b');
  if (!o.long) { P.p([[0.66, 0.64], [0.9, 0.12], [0.94, 0.16], [0.72, 0.66]], 'metal', { b: 0.015 }).p([[0.64, 0.6], [0.74, 0.64], [0.72, 0.67], [0.62, 0.63]], 'gold', { b: 0.01 }); P.e(0.28, 0.6, 0.1, 0.14, 'A', { gloss: 1 }).e(0.28, 0.6, 0.04, 0.05, 'b', { over: 1 }); }
};
D.kalan = (P, c1, c2) => { D.knight(P, c1, c2, { long: 1 }); P.e(0.5, 0.18, 0.07, 0.04, 'L', { over: 1 }); };
D.rogue = (P) => {
  P.p([[0.34, 0.34], [0.66, 0.34], [0.74, 0.88], [0.24, 0.9]], 'A', { b: 0.04, dim: 1 });
  humanoid(P, { body: 'a', head: 'a', leg: 'A', boot: 'ink', belt: 'b', arm: 'a', hand: 'skin' });
  P.e(0.52, 0.32, 0.06, 0.06, 'ink', { over: 1, flat: 1 }).eye(0.5, 0.31, 0.02).eye(0.56, 0.31, 0.02);
  P.p([[0.4, 0.4], [0.62, 0.38], [0.58, 0.44], [0.38, 0.46]], 'b', { b: 0.01 }).p([[0.4, 0.42], [0.28, 0.52], [0.34, 0.44]], 'b', { b: 0.01 });
  P.p([[0.7, 0.62], [0.86, 0.5], [0.88, 0.53], [0.72, 0.66]], 'metal', { b: 0.01 }).p([[0.3, 0.58], [0.2, 0.7], [0.23, 0.72], [0.32, 0.62]], 'metal', { b: 0.01, dim: 1 });
};
D.mage = (P) => {
  P.c(0.78, 0.06, 0.74, 0.92, 0.014, 0.014, 'wood').e(0.79, 0.08, 0.05, 0.05, 'bronze').e(0.79, 0.12, 0.02, 0.015, 'ink', { flat: 1 });
  P.p([[0.4, 0.3], [0.6, 0.3], [0.74, 0.9], [0.26, 0.9]], 'a', { b: 0.16 });
  P.p([[0.46, 0.34], [0.54, 0.34], [0.58, 0.9], [0.42, 0.9]], 'b', { b: 0.02 });
  P.c(0.38, 0.38, 0.28, 0.6, 0.05, 0.07, 'a', { dim: 1 }).c(0.62, 0.38, 0.72, 0.56, 0.05, 0.07, 'a');
  P.p([[0.36, 0.34], [0.5, 0.04], [0.64, 0.34], [0.5, 0.38]], 'a', { b: 0.04 });
  P.e(0.52, 0.28, 0.07, 0.07, 'ink', { over: 1, flat: 1 }).eye(0.5, 0.27, 0.02).eye(0.56, 0.27, 0.02);
  P.line(0.44, 0.56, 0.56, 0.56, 'gold').line(0.43, 0.66, 0.57, 0.66, 'gold');
};
D.brawler = (P) => {
  P.c(0.42, 0.66, 0.38, 0.9, 0.07, 0.055, 'b').c(0.6, 0.66, 0.64, 0.9, 0.07, 0.055, 'b');
  P.e(0.38, 0.92, 0.07, 0.03, 'ink').e(0.66, 0.92, 0.07, 0.03, 'ink');
  P.c(0.3, 0.38, 0.2, 0.6, 0.075, 0.06, 'a', { dim: 1 }).e(0.2, 0.64, 0.07, 0.06, 'a', { dim: 1 });
  P.p([[0.26, 0.3], [0.74, 0.3], [0.64, 0.68], [0.38, 0.68]], 'a', { b: 0.1 });
  P.e(0.42, 0.42, 0.08, 0.06, 'L', { over: 1 }).e(0.58, 0.42, 0.08, 0.06, 'L', { over: 1 }).line(0.5, 0.48, 0.5, 0.64, 'A');
  P.e(0.5, 0.67, 0.15, 0.035, 'b', { over: 1 });
  P.e(0.5, 0.42, 0.045, 0.05, '#80e8ff', { glow: 1, soft: 1 });
  P.e(0.52, 0.24, 0.08, 0.08, 'a', { g: 21 }).p([[0.46, 0.17], [0.62, 0.14], [0.56, 0.2]], 'ink', { b: 0.01 });
  P.c(0.7, 0.36, 0.82, 0.54, 0.075, 0.06).e(0.84, 0.58, 0.075, 0.065).line(0.8, 0.56, 0.88, 0.56, 'A');
  P.eye(0.55, 0.23, 0.025, 'glow', '#ffffff').line(0.52, 0.29, 0.58, 0.29, 'ink');
};
D.ghost = (P, c1, c2, o = {}) => {
  P.p([[0.5, 0.1], [0.68, 0.18], [0.72, 0.4], [0.74, 0.62], [0.66, 0.78], [0.56, 0.72], [0.48, 0.92], [0.38, 0.76], [0.24, 0.88], [0.26, 0.66], [0.28, 0.4], [0.34, 0.18]], 'a', { b: 0.12 });
  P.p([[0.36, 0.2], [0.64, 0.2], [0.62, 0.42], [0.38, 0.42]], 'ink', { b: 0.06, over: 1 });
  P.c(0.3, 0.4, 0.18, 0.56, 0.04, 0.03, 'a', { dim: 1 }).c(0.7, 0.42, 0.84, 0.52, 0.04, 0.03);
  P.teeth(0.82, 0.54, 0.88, 0.52, 3, 'A');
  P.eye(0.45, 0.3, 0.035, 'glow', c2).eye(0.57, 0.3, 0.035, 'glow', c2);
  for (let i = 0; i < 3; i++) P.line(0.36 + i * 0.1, 0.55, 0.32 + i * 0.12, 0.82, 'A');
  if (o.hammer) { P.c(0.84, 0.54, 0.9, 0.2, 0.015, 0.015, 'wood').p([[0.8, 0.12], [0.98, 0.12], [0.98, 0.26], [0.8, 0.26]], 'iron', { b: 0.03 }).e(0.89, 0.19, 0.07, 0.03, 'fire', { over: 1, glow: 1 }); }
};
D.smith = (P, c1, c2) => D.ghost(P, c1, c2, { hammer: 1 });
D.skeleton = (P) => {
  P.c(0.68, 0.64, 0.86, 0.1, 0.012, 0.012, 'metal');
  P.c(0.44, 0.66, 0.42, 0.9, 0.02, 0.016).c(0.56, 0.66, 0.58, 0.9, 0.02, 0.016).e(0.42, 0.92, 0.05, 0.02).e(0.6, 0.92, 0.05, 0.02);
  P.c(0.5, 0.36, 0.5, 0.64, 0.02, 0.02);
  for (let i = 0; i < 4; i++) P.arc(0.5, 0.42 + i * 0.05, 0.12 - i * 0.012, 0.15, 2.99, 'a', 0.04).arc(0.5, 0.425 + i * 0.05, 0.11 - i * 0.012, 0.3, 2.84, 'A', 0.04);
  P.e(0.5, 0.64, 0.1, 0.04);
  P.c(0.38, 0.38, 0.32, 0.6, 0.02, 0.018, 'a', { dim: 1 }).c(0.62, 0.38, 0.68, 0.6, 0.02, 0.018);
  P.e(0.3, 0.56, 0.08, 0.12, 'A', { dim: 1 }).e(0.3, 0.56, 0.03, 0.04, 'b', { over: 1 });
  P.e(0.36, 0.38, 0.05, 0.03).e(0.64, 0.38, 0.05, 0.03);
  P.e(0.5, 0.24, 0.1, 0.1).c(0.5, 0.3, 0.52, 0.36, 0.06, 0.05, 'a');
  P.e(0.46, 0.24, 0.03, 0.035, 'ink', { over: 1, flat: 1 }).e(0.56, 0.24, 0.03, 0.035, 'ink', { over: 1, flat: 1 }).dot(0.46, 0.25, 'b').dot(0.56, 0.25, 'b');
  P.teeth(0.46, 0.33, 0.56, 0.33, 4, 'ink');
};
// ---- constructs
D.golem = (P) => {
  P.c(0.38, 0.66, 0.34, 0.9, 0.09, 0.08, 'A').c(0.62, 0.66, 0.66, 0.9, 0.09, 0.08, 'A');
  P.c(0.24, 0.36, 0.14, 0.62, 0.09, 0.08, 'a', { dim: 1 }).e(0.13, 0.7, 0.1, 0.09, 'a', { dim: 1 });
  P.p([[0.2, 0.26], [0.42, 0.18], [0.66, 0.22], [0.8, 0.34], [0.7, 0.64], [0.5, 0.72], [0.3, 0.64]], 'a', { b: 0.12 });
  P.e(0.5, 0.48, 0.08, 0.08, 'b', { glow: 1, soft: 1 });
  P.line(0.5, 0.48, 0.38, 0.3, 'b').line(0.5, 0.48, 0.66, 0.6, 'b').line(0.5, 0.48, 0.34, 0.6, 'B');
  P.e(0.3, 0.26, 0.12, 0.09, 'L').e(0.72, 0.28, 0.12, 0.09, 'L');
  P.e(0.5, 0.2, 0.09, 0.08, 'a', { g: 22 }).eye(0.47, 0.2, 0.025, 'glow', 'b').eye(0.55, 0.2, 0.025, 'glow', 'b');
  P.c(0.76, 0.36, 0.84, 0.6, 0.09, 0.08).e(0.86, 0.68, 0.1, 0.09);
  P.e(0.32, 0.36, 0.05, 0.03, 'moss', { over: 1 }).e(0.7, 0.24, 0.05, 0.02, 'moss', { over: 1 });
  P.e(0.34, 0.92, 0.1, 0.03, 'A').e(0.66, 0.92, 0.1, 0.03, 'A');
};
D.statue = (P) => {
  P.sym((s, X) => { P.p([[X(0.14), 0.5], [X(0.2), 0.16], [X(0.46), 0.02], [X(0.34), 0.2], [X(0.42), 0.24], [X(0.3), 0.34], [X(0.34), 0.44], [X(0.24), 0.56]], 'A', { b: 0.04, dim: 1 }); P.line(X(0.18), 0.48, X(0.42), 0.06, 'a'); });
  P.p([[0.14, 0.86], [0.86, 0.86], [0.9, 0.96], [0.1, 0.96]], 'stone', { b: 0.03 });
  P.p([[0.34, 0.3], [0.66, 0.3], [0.74, 0.86], [0.26, 0.86]], 'a', { b: 0.18 });
  for (let i = 0; i < 5; i++) P.line(0.4 + i * 0.05, 0.62, 0.32 + i * 0.09, 0.84, 'A');
  P.sym((s, X) => P.e(X(0.18), 0.32, 0.08, 0.06, 'a'));
  P.e(0.5, 0.2, 0.09, 0.1, 'a').p([[0.4, 0.13], [0.6, 0.13], [0.56, 0.2], [0.44, 0.2]], 'A', { b: 0.01, over: 1 }).eye(0.46, 0.19, 0.025, 'glow', 'b').eye(0.55, 0.19, 0.025, 'glow', 'b');
  P.p([[0.42, 0.11], [0.5, 0.02], [0.58, 0.11]], 'L', { b: 0.02 });
  P.sym((s, X) => P.c(X(0.18), 0.34, X(0.16), 0.52, 0.05, 0.045)); P.sym((s, X) => P.c(X(0.16), 0.52, X(0.08), 0.5, 0.045, 0.04));
  P.c(0.5, 0.34, 0.5, 0.4, 0.015, 0.015, 'iron');
  P.p([[0.4, 0.42], [0.6, 0.42], [0.66, 0.64], [0.34, 0.64]], 'bronze', { b: 0.12, gloss: 1 }).e(0.5, 0.42, 0.1, 0.03, 'bronze', { gloss: 1 });
  P.e(0.5, 0.65, 0.17, 0.035, 'B', { gloss: 1 }).e(0.5, 0.67, 0.13, 0.02, 'ink', { flat: 1 }).e(0.5, 0.69, 0.025, 0.025, 'b', { glow: 1 });
  P.sym((s, X) => { P.c(X(0.2), 0.48, X(0.18), 0.6, 0.045, 0.04); P.c(X(0.18), 0.6, X(0.3), 0.6, 0.04, 0.035); });
};
D.mech = (P) => {
  P.c(0.36, 0.6, 0.28, 0.78, 0.035, 0.03, 'iron', { dim: 1 }).c(0.28, 0.78, 0.34, 0.92, 0.03, 0.025, 'iron', { dim: 1 });
  for (let i = 0; i < 4; i++) P.c(0.24 + i * 0.06, 0.38, 0.24 + i * 0.06, 0.12 + i * 0.03, 0.025, 0.025, 'bronze', { gloss: 1 });
  for (let i = 0; i < 4; i++) P.e(0.24 + i * 0.06, 0.12 + i * 0.03, 0.025, 0.012, 'ink', { flat: 1 });
  P.p([[0.24, 0.32], [0.74, 0.3], [0.8, 0.5], [0.7, 0.66], [0.3, 0.66], [0.22, 0.5]], 'a', { b: 0.06, gloss: 1 });
  P.e(0.66, 0.42, 0.08, 0.07, 'glass', { gloss: 1 }).e(0.66, 0.42, 0.05, 0.04, 'b', { over: 1, glow: 1 });
  P.line(0.3, 0.48, 0.56, 0.48, 'A').line(0.3, 0.56, 0.58, 0.56, 'A');
  for (let i = 0; i < 5; i++) P.dot(0.3 + i * 0.07, 0.36, 'L');
  P.c(0.76, 0.52, 0.92, 0.54, 0.035, 0.03, 'iron').e(0.94, 0.54, 0.02, 0.035, 'ink', { flat: 1 });
  P.c(0.56, 0.64, 0.66, 0.78, 0.045, 0.035, 'iron').c(0.66, 0.78, 0.6, 0.92, 0.035, 0.03, 'iron');
  P.p([[0.5, 0.9], [0.72, 0.9], [0.72, 0.95], [0.5, 0.95]], 'A', { b: 0.015 }).p([[0.2, 0.9], [0.4, 0.9], [0.4, 0.95], [0.2, 0.95]], 'A', { b: 0.015, dim: 1 });
  P.dot(0.3, 0.62, 'b').dot(0.36, 0.62, 'b');
};
D.drill = (P) => {
  P.c(0.2, 0.84, 0.66, 0.84, 0.09, 0.09, 'iron');
  for (let i = 0; i < 7; i++) P.e(0.18 + i * 0.08, 0.84, 0.03, 0.03, 'metal', { over: 1 });
  P.p([[0.14, 0.44], [0.62, 0.4], [0.7, 0.74], [0.12, 0.76]], 'a', { b: 0.06, gloss: 1 });
  P.c(0.26, 0.42, 0.24, 0.16, 0.04, 0.05, 'iron').e(0.22, 0.08, 0.07, 0.05, '#cfc8c8', { glow: 1, soft: 1, nooutline: 1 });
  P.e(0.44, 0.48, 0.07, 0.06, 'glass', { gloss: 1 }).dot(0.42, 0.46, 'white');
  P.p([[0.64, 0.4], [0.98, 0.58], [0.64, 0.76]], 'metal', { b: 0.08, gloss: 1 });
  for (let i = 0; i < 4; i++) P.line(0.66 + i * 0.07, 0.42 + i * 0.04, 0.7 + i * 0.07, 0.74 - i * 0.04, 'iron');
  P.e(0.62, 0.58, 0.04, 0.18, 'b');
  for (let i = 0; i < 4; i++) P.dot(0.2 + i * 0.1, 0.7, 'b');
};
D.organ = (P) => {
  for (let i = 0; i < 4; i++) P.k([[0.3 + i * 0.12, 0.72, 0.03], [0.22 + i * 0.16, 0.82, 0.025], [0.18 + i * 0.18, 0.94, 0.012]], 'iron', { dim: i % 2 });
  P.p([[0.14, 0.4], [0.86, 0.4], [0.82, 0.76], [0.18, 0.76]], 'wood', { b: 0.04 });
  for (let i = 0; i < 8; i++) { const h = [0.3, 0.22, 0.14, 0.06, 0.06, 0.14, 0.22, 0.3][i]; P.c(0.2 + i * 0.086, 0.42, 0.2 + i * 0.086, h + 0.04, 0.032, 0.032, 'b', { gloss: 1 }); P.e(0.2 + i * 0.086, h + 0.035, 0.032, 0.012, 'ink', { flat: 1 }); P.e(0.2 + i * 0.086, 0.36, 0.02, 0.01, 'ink', { flat: 1 }); }
  P.p([[0.2, 0.6], [0.8, 0.6], [0.8, 0.7], [0.2, 0.7]], 'white', { b: 0.01 });
  for (let i = 0; i < 12; i++) P.line(0.22 + i * 0.05, 0.6, 0.22 + i * 0.05, 0.66, 'ink');
  P.e(0.5, 0.5, 0.06, 0.05, 'gold', { gloss: 1 }).e(0.5, 0.5, 0.035, 0.03, 'glass', { over: 1, glow: 1 });
  P.e(0.32, 0.5, 0.03, 0.03, 'fire', { glow: 1 }).e(0.68, 0.5, 0.03, 0.03, 'fire', { glow: 1 });
  P.e(0.1, 0.12, 0.06, 0.04, '#e8e8f0', { glow: 1, soft: 1, nooutline: 1 }).e(0.88, 0.06, 0.06, 0.04, '#e8e8f0', { glow: 1, soft: 1, nooutline: 1 });
};
D.skyship = (P) => {
  P.e(0.46, 0.3, 0.38, 0.18, 'a', { h: 0.9 });
  for (let i = 0; i < 5; i++) P.arc(0.46, 0.3, 0.3 - i * 0.06, -1.3, 1.3, 'A', 0.17);
  P.p([[0.06, 0.3], [0.0, 0.16], [0.14, 0.28]], 'b', { b: 0.02 }).p([[0.06, 0.32], [0.0, 0.44], [0.14, 0.34]], 'b', { b: 0.02 });
  for (const x of [0.3, 0.46, 0.62]) P.c(x, 0.44, x, 0.56, 0.008, 0.008, 'iron');
  P.p([[0.2, 0.56], [0.76, 0.56], [0.7, 0.72], [0.28, 0.72]], 'wood', { b: 0.04 });
  for (let i = 0; i < 6; i++) P.c(0.3 + i * 0.07, 0.72, 0.3 + i * 0.07, 0.86 - (i % 2) * 0.04, 0.022, 0.022, 'bronze', { gloss: 1 });
  for (let i = 0; i < 5; i++) P.dot(0.32 + i * 0.09, 0.62, 'b');
  P.c(0.76, 0.62, 0.92, 0.6, 0.03, 0.025, 'iron').sym((s, X) => P.e(X(0.36), 0.56, 0.02, 0.07, 'metal'), 0.46);
  P.e(0.46, 0.3, 0.05, 0.05, 'gold').line(0.46, 0.26, 0.46, 0.34, 'b').line(0.42, 0.3, 0.5, 0.3, 'b');
};
D.bell = (P) => {
  for (const x of [0.22, 0.78]) for (let i = 0; i < 6; i++) P.e(x + Math.sin(i) * 0.01, 0.02 + i * 0.05, 0.016, 0.026, 'iron', { g: 23 });
  P.e(0.5, 0.14, 0.08, 0.06, 'a').p([[0.3, 0.2], [0.7, 0.2], [0.74, 0.5], [0.86, 0.74], [0.14, 0.74], [0.26, 0.5]], 'a', { b: 0.16 });
  P.e(0.5, 0.74, 0.37, 0.06, 'A', { gloss: 1 }).e(0.5, 0.76, 0.3, 0.035, 'ink', { flat: 1 });
  P.e(0.5, 0.34, 0.2, 0.02, 'L', { over: 1 }).e(0.5, 0.62, 0.31, 0.02, 'L', { over: 1 });
  P.e(0.5, 0.8, 0.06, 0.05, 'b', { glow: 1 }).eye(0.5, 0.8, 0.03, 'glow', '#ffffff');
  P.line(0.6, 0.22, 0.56, 0.4, 'ink').line(0.56, 0.4, 0.62, 0.52, 'ink').line(0.62, 0.52, 0.58, 0.66, 'ink');
  for (let i = 0; i < 6; i++) P.k([[0.2 + i * 0.12, 0.74, 0.016], [0.18 + i * 0.12 + Math.sin(i) * 0.03, 0.86, 0.012], [0.22 + i * 0.12, 0.96, 0.006]], '#3a7a5a');
  P.e(0.36, 0.44, 0.06, 0.04, '#3a7a5a', { over: 1 }).e(0.7, 0.56, 0.05, 0.03, '#3a7a5a', { over: 1 });
};
D.core = (P) => {
  P.p([[0.5, 0.1], [0.7, 0.46], [0.5, 0.9], [0.3, 0.46]], 'a', { b: 0.2, glow: 1 });
  P.e(0.5, 0.5, 0.11, 0.13, 'b', { glow: 1, soft: 1 }).e(0.5, 0.5, 0.045, 0.055, '#ffffff', { glow: 1, soft: 1 });
  P.line(0.5, 0.14, 0.5, 0.86, 'L').line(0.34, 0.46, 0.66, 0.46, 'L');
  const plate = (pts) => P.p(pts.map(([x, y]) => [0.5 + (x - 0.5) * 0.92, 0.5 + (y - 0.5) * 0.92]), 'gold', { b: 0.03, gloss: 1 });
  plate([[0.12, 0.2], [0.3, 0.12], [0.34, 0.24], [0.2, 0.34]]); plate([[0.7, 0.12], [0.9, 0.22], [0.82, 0.34], [0.68, 0.24]]);
  plate([[0.08, 0.6], [0.24, 0.58], [0.26, 0.76], [0.1, 0.74]]); plate([[0.76, 0.58], [0.92, 0.6], [0.9, 0.76], [0.74, 0.76]]);
  plate([[0.3, 0.86], [0.42, 0.82], [0.44, 0.94], [0.32, 0.96]]); plate([[0.58, 0.82], [0.7, 0.86], [0.68, 0.96], [0.56, 0.94]]);
  for (const [x, y] of [[0.22, 0.24], [0.79, 0.23], [0.17, 0.67], [0.83, 0.67]]) P.dot(x, y, 'b');
  P.arc(0.5, 0.5, 0.44, 0, 6.3, 'b', 0.12, true).arc(0.5, 0.5, 0.36, 0, 6.3, 'B', 0.42, true);
};
// ---- the great ones
D.lord = (P) => {
  P.p([[0.34, 0.3], [0.66, 0.3], [0.8, 0.94], [0.18, 0.94]], 'ink', { b: 0.06 });
  P.p([[0.4, 0.34], [0.6, 0.34], [0.7, 0.94], [0.3, 0.94]], 'cloth', { b: 0.04 });
  P.c(0.84, 0.0, 0.84, 0.92, 0.014, 0.014, 'bone').k([[0.84, 0.06, 0.018], [0.7, 0.04, 0.02], [0.56, 0.1, 0.012]], 'bone');
  P.c(0.36, 0.36, 0.22, 0.56, 0.05, 0.04, 'ink', { dim: 1 }).k([[0.2, 0.58, 0.006], [0.2, 0.66, 0.006]], 'iron').e(0.2, 0.72, 0.05, 0.06, 'b', { glow: 1 }).e(0.2, 0.68, 0.05, 0.015, 'iron');
  P.c(0.64, 0.36, 0.8, 0.5, 0.05, 0.04, 'ink');
  P.e(0.5, 0.22, 0.11, 0.12, 'bone').e(0.5, 0.26, 0.08, 0.06, 'ink', { over: 1, flat: 1 });
  P.p([[0.38, 0.14], [0.42, 0.02], [0.46, 0.1], [0.5, 0.0], [0.54, 0.1], [0.58, 0.02], [0.62, 0.14]], 'a', { b: 0.02, gloss: 1 });
  P.eye(0.46, 0.24, 0.025, 'glow', 'b').eye(0.55, 0.24, 0.025, 'glow', 'b');
  for (let i = 0; i < 3; i++) P.e(0.5, 0.48 + i * 0.12, 0.05, 0.04, 'a', { over: 1, gloss: 1 });
};
D.angel = (P) => {
  for (let k = 0; k < 3; k++) P.sym((s, X) => P.p([[X(0.1), 0.46], [X(0.2 + k * 0.08), 0.06 + k * 0.1], [X(0.48 - k * 0.02), 0.0 + k * 0.12], [X(0.4), 0.18 + k * 0.1], [X(0.14), 0.5]], k === 1 ? 'L' : 'a', { b: 0.03, dim: k === 2 ? 1 : 0, under: 1 }));
  P.e(0.5, 0.14, 0.15, 0.04, 'b', { glow: 1, under: 1 }).e(0.5, 0.14, 0.11, 0.022, 'ink', { flat: 1 });
  P.p([[0.42, 0.3], [0.58, 0.3], [0.68, 0.94], [0.32, 0.94]], 'white', { b: 0.16 });
  for (let i = 0; i < 4; i++) P.line(0.46 + i * 0.03, 0.4, 0.4 + i * 0.07, 0.92, '#c8c0d8');
  P.c(0.42, 0.34, 0.32, 0.5, 0.035, 0.03, 'white').c(0.58, 0.34, 0.68, 0.5, 0.035, 0.03, 'white');
  P.e(0.5, 0.24, 0.07, 0.08, 'gold', { gloss: 1 }).line(0.46, 0.24, 0.54, 0.24, 'ink');
  P.e(0.5, 0.5, 0.04, 0.04, 'b', { glow: 1, soft: 1 });
};
D.conductor = (P, c1, c2) => {
  P.p([[0.38, 0.32], [0.62, 0.32], [0.74, 0.94], [0.56, 0.86], [0.44, 0.94], [0.26, 0.94]], 'a', { b: 0.14 });
  P.p([[0.44, 0.34], [0.56, 0.34], [0.56, 0.7], [0.44, 0.7]], 'ink', { b: 0.02 });
  P.line(0.5, 0.38, 0.5, 0.68, 'b');
  P.c(0.4, 0.36, 0.3, 0.56, 0.045, 0.035, 'a', { dim: 1 }).e(0.29, 0.58, 0.03, 0.03, 'skin', { dim: 1 });
  P.c(0.6, 0.36, 0.74, 0.3, 0.045, 0.035, 'a').e(0.76, 0.29, 0.03, 0.03, 'skin');
  P.k([[0.78, 0.28, 0.006], [0.94, 0.12, 0.004]], 'white').e(0.94, 0.12, 0.025, 0.025, 'b', { glow: 1, soft: 1 });
  P.e(0.5, 0.36, 0.09, 0.03, 'b', { over: 1 });
  P.e(0.5, 0.22, 0.075, 0.09, 'skin', { g: 24 }).p([[0.42, 0.18], [0.5, 0.1], [0.6, 0.16], [0.6, 0.3], [0.56, 0.2], [0.44, 0.22], [0.4, 0.3]], '#eeeef4', { b: 0.02 });
  P.line(0.46, 0.23, 0.48, 0.23, 'ink').line(0.53, 0.23, 0.55, 0.23, 'ink');
  for (let i = 0; i < 5; i++) P.arc(0.5, 1.05, 0.62 + i * 0.035, -2.75, -0.4, 'B', 0.62 + i * 0.035, true);
  for (const [x, y] of [[0.16, 0.34], [0.26, 0.2], [0.84, 0.46], [0.1, 0.56]]) { P.e(x, y, 0.025, 0.02, 'b', { glow: 1, soft: 1 }); P.line(x + 0.02, y, x + 0.02, y - 0.08, 'b'); }
};
D.requiem = (P) => {
  for (let i = 0; i < 6; i++) P.sym((s, X) => P.c(X(0.18 + i * 0.05), 0.5, X(0.2 + i * 0.06), 0.06 + i * 0.05, 0.025, 0.02, 'gold', { gloss: 1, under: 1 }));
  P.e(0.5, 0.2, 0.26, 0.05, 'b', { glow: 1, under: 1 });
  P.p([[0.34, 0.3], [0.66, 0.3], [0.86, 0.96], [0.14, 0.96]], 'a', { b: 0.3 });
  for (let i = 0; i < 5; i++) P.line(0.44 + i * 0.03, 0.4, 0.26 + i * 0.12, 0.94, 'A');
  for (const [x, y] of [[0.3, 0.7], [0.5, 0.78], [0.7, 0.7], [0.4, 0.56], [0.6, 0.56]]) { P.p([[x - 0.04, y + 0.04], [x - 0.025, y - 0.03], [x + 0.025, y - 0.03], [x + 0.04, y + 0.04]], 'bronze', { b: 0.02, gloss: 1 }); P.e(x, y + 0.045, 0.012, 0.012, 'ink', { flat: 1 }); }
  P.e(0.5, 0.26, 0.09, 0.11, 'white').p([[0.43, 0.24], [0.48, 0.22], [0.48, 0.26]], 'ink', { b: 0.01, flat: 1 }).p([[0.52, 0.22], [0.57, 0.24], [0.52, 0.26]], 'ink', { b: 0.01, flat: 1 });
  P.line(0.5, 0.3, 0.5, 0.37, 'b').line(0.46, 0.36, 0.42, 0.42, 'b').line(0.54, 0.36, 0.58, 0.42, 'b');
  P.e(0.5, 0.48, 0.05, 0.05, 'b', { glow: 1, soft: 1 });
};
// ---- the Frostvale mines, redrawn in the hand-finished style (P.hq)
D.minerat = (P) => {
  P.hq();
  const pink = '#d08a92', fur = { tex: 'fur', fd: Math.PI * 0.94 };
  P.k([[0.28, 0.76, 0.034], [0.14, 0.83, 0.028], [0.05, 0.75, 0.022], [0.04, 0.61, 0.016], [0.1, 0.51, 0.011], [0.18, 0.49, 0.007]], pink, { tex: 'scale' });
  P.c(0.62, 0.72, 0.64, 0.88, 0.03, 0.022, 'A', { dim: 1 }).e(0.66, 0.905, 0.035, 0.016, pink, { dim: 1 });
  P.e(0.42, 0.84, 0.06, 0.05, 'A', { dim: 1 });
  P.e(0.73, 0.43, 0.062, 0.075, 'a', { dim: 1, r: 0.3 }).e(0.732, 0.435, 0.035, 0.048, pink, { over: 1, dim: 1, r: 0.3 });
  P.e(0.3, 0.69, 0.16, 0.16, 'a', { g: 3, ...fur }).e(0.45, 0.65, 0.22, 0.17, 'a', { g: 3, ...fur }).e(0.58, 0.6, 0.14, 0.14, 'a', { g: 3, ...fur });
  P.e(0.47, 0.77, 0.19, 0.06, 'b', { over: 1, tex: 'fur', fd: Math.PI });
  for (let i = 0; i < 5; i++) { const y = 0.56 - Math.sin(i / 1.6) * 0.06; P.p([[0.21 + i * 0.075, y], [0.19 + i * 0.075, y - 0.075], [0.265 + i * 0.075, y - 0.01]], 'A', { b: 0.012, g: 3 }); }
  P.p([[0.33, 0.52], [0.29, 0.3], [0.385, 0.46]], '#8ad8ff', { b: 0.05, glow: 1, soft: 1 }).p([[0.4, 0.49], [0.43, 0.2], [0.485, 0.47]], '#8ad8ff', { b: 0.05, glow: 1, soft: 1 }).p([[0.49, 0.48], [0.575, 0.3], [0.555, 0.5]], '#8ad8ff', { b: 0.05, glow: 1, soft: 1 });
  P.line(0.432, 0.29, 0.445, 0.42, 'white').line(0.305, 0.34, 0.325, 0.44, 'white');
  P.e(0.3, 0.8, 0.1, 0.09, 'a', fur).c(0.3, 0.86, 0.36, 0.915, 0.03, 0.02, 'a').e(0.37, 0.93, 0.07, 0.02, pink);
  P.e(0.71, 0.58, 0.13, 0.11, 'a', { r: 0.35, g: 4, ...fur }).c(0.75, 0.61, 0.93, 0.68, 0.085, 0.03, 'a', { g: 4, ...fur });
  P.e(0.78, 0.665, 0.08, 0.032, 'L', { over: 1 }).e(0.935, 0.68, 0.022, 0.02, pink, { gloss: 1 });
  P.e(0.64, 0.45, 0.075, 0.085, 'a', { r: -0.2 }).e(0.645, 0.455, 0.045, 0.055, pink, { over: 1, r: -0.2 });
  P.c(0.66, 0.68, 0.72, 0.88, 0.04, 0.025, 'a', fur).e(0.745, 0.91, 0.045, 0.02, pink);
  P.teeth(0.72, 0.935, 0.79, 0.935, 3, 'claw');
  P.eye(0.79, 0.57, 0.035, 'glow', '#ff4a3a');
  P.dot(0.875, 0.715, '#f0e0a0').dot(0.895, 0.715, '#f0e0a0');
  P.line(0.89, 0.64, 0.99, 0.6, 'claw').line(0.89, 0.66, 0.99, 0.67, 'claw').line(0.88, 0.665, 0.97, 0.725, 'claw');
};
D.frostbat = (P) => {
  P.hq();
  P.sym((s, X) => {
    const dim = s < 0 ? 1 : 0, sh = [X(0.12), 0.44], el = [X(0.26), 0.27], tips = [[X(0.4), 0.09], [X(0.47), 0.28], [X(0.46), 0.48]];
    P.p([[X(0.1), 0.5], sh, el, tips[0], [X(0.41), 0.22], tips[1], [X(0.43), 0.39], tips[2], [X(0.38), 0.5], [X(0.33), 0.61], [X(0.27), 0.54], [X(0.2), 0.64], [X(0.13), 0.57]], '#9cc0ec', { b: 0.02, dim });
    P.k([[...sh, 0.022], [...el, 0.018]], 'A', { dim }); for (const t of tips) P.k([[...el, 0.015], [...t, 0.005]], 'A', { dim });
    P.p([[el[0], el[1] - 0.01], [X(0.24), 0.18], [X(0.29), 0.26]], 'claw', { b: 0.008 });
    for (const [dx, y] of [[0.33, 0.61], [0.2, 0.64], [0.38, 0.5]]) P.p([[X(dx - 0.012), y - 0.01], [X(dx + 0.012), y - 0.01], [X(dx), y + 0.07]], 'ice', { b: 0.008, facet: 1 });
    P.p([[X(0.025), 0.33], [X(0.1), 0.1], [X(0.115), 0.34]], 'a', { b: 0.02 }).p([[X(0.045), 0.31], [X(0.095), 0.16], [X(0.1), 0.31]], '#e8a0b8', { over: 1, b: 0.01 });
    P.c(X(0.05), 0.64, X(0.06), 0.74, 0.018, 0.01, 'A').teeth(X(0.045), 0.745, X(0.075), 0.745, 2, 'claw');
  });
  P.e(0.5, 0.53, 0.12, 0.14, 'a', { tex: 'fur' }).e(0.5, 0.575, 0.08, 0.09, 'b', { over: 1, tex: 'fur' });
  P.e(0.5, 0.36, 0.105, 0.09, 'a', { g: 2, tex: 'fur' });
  P.p([[0.48, 0.355], [0.5, 0.33], [0.52, 0.355], [0.5, 0.385]], 'A', { b: 0.01 });
  P.p([[0.44, 0.405], [0.56, 0.405], [0.535, 0.45], [0.465, 0.45]], 'ink', { b: 0.008, flat: 1 }).teeth(0.462, 0.405, 0.538, 0.405, 2, 'white');
  P.eye(0.455, 0.345, 0.032, 'glow', '#c8f4ff').eye(0.548, 0.345, 0.032, 'glow', '#c8f4ff');
  for (const [x, y] of [[0.08, 0.72], [0.9, 0.7], [0.18, 0.86], [0.8, 0.88], [0.5, 0.86]]) P.dot(x, y, '#d8f4ff');
};
D.iceslime = (P) => {
  P.hq({ rim: '#f0fbff' });
  P.e(0.5, 0.925, 0.37, 0.04, '#cfeeff', { under: 1 });
  P.e(0.5, 0.7, 0.35, 0.235, 'a', { h: 1.3, g: 1, gloss: 1 }).c(0.5, 0.33, 0.5, 0.6, 0.03, 0.2, 'a', { g: 1, h: 1.25, gloss: 1 });
  P.c(0.23, 0.78, 0.21, 0.885, 0.04, 0.024, 'a', { g: 1 }).c(0.75, 0.8, 0.78, 0.9, 0.034, 0.02, 'a', { g: 1 });
  P.e(0.5, 0.865, 0.29, 0.055, 'A', { over: 1 });
  P.p([[0.6, 0.6], [0.69, 0.68], [0.645, 0.83], [0.55, 0.76]], '#e6f7ff', { over: 1, facet: 1 });
  for (const [x, y, r] of [[0.35, 0.79, 0.024], [0.42, 0.84, 0.014], [0.7, 0.58, 0.016]]) P.e(x, y, r, r, 'L', { over: 1 });
  P.p([[0.37, 0.47], [0.38, 0.25], [0.46, 0.42]], 'ice', { b: 0.03, facet: 1 }).p([[0.45, 0.4], [0.5, 0.06], [0.56, 0.39]], 'ice', { b: 0.04, facet: 1 }).p([[0.55, 0.43], [0.64, 0.24], [0.64, 0.47]], 'ice', { b: 0.03, facet: 1 }).p([[0.3, 0.55], [0.27, 0.42], [0.36, 0.52]], 'ice', { b: 0.02, facet: 1 });
  P.e(0.62, 0.71, 0.05, 0.06, '#ffffff', { over: 1, glow: 1 });
  P.e(0.35, 0.55, 0.035, 0.09, '#ffffff', { over: 1, flat: 1, r: -0.5 }).e(0.31, 0.68, 0.02, 0.025, '#ffffff', { over: 1, flat: 1 });
  P.eye(0.43, 0.65, 0.055, 'cute').eye(0.6, 0.65, 0.055, 'cute');
  P.line(0.47, 0.75, 0.5, 0.77, 'ink').line(0.5, 0.77, 0.55, 0.74, 'ink').dot(0.5, 0.775, 'white');
  for (const [x, y] of [[0.1, 0.6], [0.9, 0.5], [0.16, 0.36], [0.86, 0.78]]) P.dot(x, y, '#ffffff');
};
D.frostguard = (P, c1, c2, o = {}) => {
  P.hq({ rim: '#c8dcff' });
  const fur = '#d8ccb8', hood = o.captain ? '#5a4a3a' : '#8a6a4a', scarf = '#b83a3a';
  if (o.captain) P.p([[0.36, 0.38], [0.64, 0.38], [0.76, 0.9], [0.22, 0.92]], scarf, { b: 0.05, dim: 1, tex: 'plate' });
  if (o.captain) P.p([[0.72, 0.56], [0.9, 0.08], [0.95, 0.1], [0.77, 0.58]], 'metal', { b: 0.02, gloss: 1 }).p([[0.69, 0.53], [0.8, 0.58], [0.79, 0.61], [0.68, 0.56]], 'gold', { b: 0.01, gloss: 1 });
  else P.c(0.76, 0.06, 0.73, 0.94, 0.011, 0.011, 'wood').p([[0.745, 0.08], [0.765, -0.03], [0.79, 0.08], [0.77, 0.11]], 'metal', { b: 0.012 }).e(0.765, 0.13, 0.022, 0.02, scarf);
  P.c(0.36, 0.42, 0.3, 0.6, 0.045, 0.04, 'a', { dim: 1 }).e(0.29, 0.62, 0.03, 0.03, 'b', { dim: 1 });
  P.c(0.285, 0.64, 0.285, 0.68, 0.006, 0.006, 'iron').p([[0.245, 0.68], [0.325, 0.68], [0.335, 0.79], [0.235, 0.79]], 'iron', { b: 0.012 }).e(0.285, 0.735, 0.03, 0.04, '#ffd070', { glow: 1 }).e(0.285, 0.675, 0.042, 0.012, 'iron');
  P.c(0.44, 0.7, 0.43, 0.88, 0.05, 0.045, 'A').c(0.57, 0.7, 0.58, 0.88, 0.05, 0.045, 'A');
  P.e(0.43, 0.92, 0.065, 0.035, 'b').e(0.59, 0.92, 0.065, 0.035, 'b').e(0.43, 0.86, 0.06, 0.024, fur, { tex: 'fur' }).e(0.585, 0.86, 0.06, 0.024, fur, { tex: 'fur' });
  P.p([[0.33, 0.38], [0.67, 0.38], [0.7, 0.8], [0.3, 0.8]], 'a', { b: 0.1, tex: 'plate' });
  P.e(0.5, 0.8, 0.2, 0.035, fur, { tex: 'fur' }).e(0.5, 0.6, 0.165, 0.025, 'b', { over: 1 }).e(0.5, 0.6, 0.022, 0.022, 'gold', { over: 1, gloss: 1 });
  P.e(0.35, 0.41, 0.08, 0.055, fur, { tex: 'fur', dim: 1 }).e(0.65, 0.41, 0.085, 0.058, fur, { tex: 'fur' }).e(0.65, 0.4, 0.06, 0.035, 'iron', { gloss: 1 }).e(0.35, 0.4, 0.055, 0.032, 'iron', { gloss: 1, dim: 1 });
  P.p([[0.42, 0.355], [0.58, 0.355], [0.565, 0.42], [0.435, 0.42]], scarf, { b: 0.015 }).p([[0.55, 0.4], [0.6, 0.4], [0.62, 0.55], [0.57, 0.56]], scarf, { b: 0.012 });
  P.e(0.5, 0.31, 0.075, 0.08, hood, { tex: 'fur' }).e(0.5, 0.3, 0.055, 0.06, 'skin');
  P.e(0.5, 0.25, 0.075, 0.06, 'iron', { gloss: 1 }).e(0.5, 0.275, 0.12, 0.022, 'iron', { gloss: 1 }).e(0.5, 0.3, 0.05, 0.016, '#3a2a2a', { over: 1, flat: 1 });
  if (o.captain) P.k([[0.5, 0.2, 0.012], [0.47, 0.1, 0.03], [0.4, 0.06, 0.02]], scarf, { tex: 'fur' });
  P.eye(0.478, 0.3, 0.018, 'glow', '#fff4d0').eye(0.525, 0.3, 0.018, 'glow', '#fff4d0').dot(0.5, 0.33, '#c86a5a');
  P.e(0.62, 0.34, 0.03, 0.02, '#ffffff', { glow: 1, soft: 1, nooutline: 1 });
  P.c(0.64, 0.42, 0.72, 0.56, 0.05, 0.04, 'a').e(0.745, 0.575, 0.036, 0.036, 'b');
};
D.frostcaptain = (P, c1, c2) => D.frostguard(P, c1, c2, { captain: 1 });
D.ironshell = (P) => {
  P.hq({ rim: '#b8d8ff' });
  P.sym((s, X) => { for (let i = 0; i < 3; i++) { const y = 0.66 + i * 0.05, kx = X(0.36 + i * 0.035), ky = y - 0.07 + i * 0.025; P.k([[X(0.22 + i * 0.03), y, 0.032], [kx, ky, 0.027], [X(0.44 + i * 0.02), 0.95, 0.007]], 'A', { dim: i !== 1 ? 1 : 0, tex: 'plate' }); P.e(kx, ky, 0.026, 0.023, 'L', { dim: i !== 1 ? 1 : 0 }); } });
  P.k([[0.3, 0.6, 0.04], [0.2, 0.52, 0.034], [0.17, 0.42, 0.03]], 'a', { tex: 'plate' }).e(0.17, 0.36, 0.06, 0.05, 'a', { gloss: 1, r: -0.3 });
  P.c(0.14, 0.34, 0.11, 0.22, 0.028, 0.008, 'a').c(0.2, 0.33, 0.22, 0.23, 0.022, 0.007, 'A');
  P.k([[0.68, 0.6, 0.06], [0.83, 0.49, 0.055], [0.86, 0.36, 0.05]], 'a', { tex: 'plate' });
  P.e(0.83, 0.25, 0.17, 0.14, 'a', { gloss: 1, r: 0.35, tex: 'stone' }).e(0.8, 0.28, 0.09, 0.05, 'L', { over: 1, r: 0.35 });
  P.c(0.74, 0.18, 0.76, 0.03, 0.07, 0.016, 'a', { gloss: 1 }).c(0.92, 0.19, 0.97, 0.05, 0.05, 0.012, 'A');
  P.teeth(0.785, 0.14, 0.772, 0.06, 4, 'claw').teeth(0.912, 0.16, 0.935, 0.08, 3, 'claw');
  P.e(0.5, 0.6, 0.31, 0.2, 'a', { h: 1.2, gloss: 1, tex: 'stone' });
  P.e(0.5, 0.53, 0.27, 0.07, 'L', { over: 1 }).e(0.42, 0.455, 0.13, 0.03, '#e8f4ff', { over: 1 });
  P.arc(0.5, 0.62, 0.29, 3.3, 6.12, 'A', 0.12).arc(0.5, 0.69, 0.27, 3.4, 6.02, 'A', 0.1);
  for (let i = 0; i < 7; i++) { const a = 3.45 + i * 0.4; P.dot(0.5 + Math.cos(a) * 0.29, 0.62 + Math.sin(a) * 0.12 - 0.02, 'claw'); }
  for (const [x, y] of [[0.3, 0.58], [0.34, 0.62], [0.68, 0.57]]) P.e(x, y, 0.022, 0.018, 'stone', { tex: 'stone' });
  P.k([[0.44, 0.44, 0.015], [0.42, 0.31, 0.011]], 'A').k([[0.56, 0.44, 0.015], [0.58, 0.31, 0.011]], 'A');
  P.e(0.42, 0.29, 0.037, 0.037, 'b', { glow: 1 }).e(0.58, 0.29, 0.037, 0.037, 'b', { glow: 1 }).dot(0.425, 0.29, 'ink').dot(0.585, 0.29, 'ink');
  for (const [x, l] of [[0.27, 0.07], [0.35, 0.1], [0.45, 0.06], [0.57, 0.09], [0.66, 0.06], [0.73, 0.08]]) P.p([[x - 0.016, 0.755], [x + 0.016, 0.755], [x, 0.755 + l]], 'ice', { b: 0.01, facet: 1 });
  P.p([[0.44, 0.7], [0.56, 0.7], [0.535, 0.77], [0.465, 0.77]], 'A', { b: 0.015 }).teeth(0.46, 0.77, 0.54, 0.77, 4, 'claw');
};
// old names kept as aliases
Object.assign(D, { rabbit: D.hare, octopus: D.steamcrab, train: D.bell, clown: D.conductor, godvissek: D.requiem });

const CACHE = new Map();
export const BEASTS = Object.keys(D);
// a creature as an N×N canvas (N = its on-screen size in game pixels)
export function beast(art, col, N = 48, flash = false) {
  N = Math.max(16, Math.round(N));
  const key = `${art}:${col.join()}:${N}:${flash}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const px = render(D[art] || D.slime, col[0], col[1], N);
  const c = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!c) return px;
  c.width = c.height = N; const g = c.getContext('2d'), img = g.createImageData(N, N);
  for (let q = 0; q < N * N; q++) {
    if (!px[q]) continue;
    const [r, gg, b] = flash ? [255, 255, 255] : hexRGB(px[q]);
    img.data[q * 4] = r; img.data[q * 4 + 1] = gg; img.data[q * 4 + 2] = b; img.data[q * 4 + 3] = flash ? 220 : 255;
  }
  g.putImageData(img, 0, 0); CACHE.set(key, c); return c;
}
