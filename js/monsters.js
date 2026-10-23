// ASH ARIA — monsters and bosses, and the zones they live in. No DOM.
// Stats come from the level (see stats()); each monster only says how it differs.
import { LORES } from './data.js?v=5';

// ---------------------------------------------------------------- monster moves (lores are moves too: Bolo learns them by seeing them)
const MS = (zh, en, kind, power, target, extra = {}) => ({ name: [zh, en], kind, power, target, ...extra });
export const MSKILLS = {
  attack:   MS('攻擊', 'Attack', 'phys', 1, 'one'),
  bite:     MS('咬', 'Bite', 'phys', 1.35, 'one'),
  slash:    MS('利爪', 'Rend', 'phys', 1.55, 'one'),
  tackle:   MS('衝撞', 'Tackle', 'phys', 1.25, 'one'),
  tailwhip: MS('甩尾', 'Tail Sweep', 'phys', 0.75, 'all'),
  rush:     MS('狂暴衝鋒', 'Rampage', 'phys', 2.1, 'one'),
  fang:     MS('毒牙', 'Venom Fang', 'phys', 1.1, 'one', { add: 'poison' }),
  fireball: MS('火球', 'Fireball', 'dmg', 5, 'one', { el: 'fire' }),
  flames:   MS('火焰吐息', 'Flame Breath', 'dmg', 7, 'all', { el: 'fire' }),
  frost:    MS('冰霜', 'Frost', 'dmg', 5, 'one', { el: 'ice' }),
  blizzard: MS('暴風雪', 'Snowstorm', 'dmg', 6.5, 'all', { el: 'ice' }),
  spark:    MS('電擊', 'Spark', 'dmg', 5.5, 'one', { el: 'bolt' }),
  storm:    MS('雷暴', 'Thunderstorm', 'dmg', 7, 'all', { el: 'bolt' }),
  gust:     MS('狂風', 'Gale', 'dmg', 6, 'all', { el: 'wind' }),
  tremor:   MS('地鳴', 'Tremor', 'dmg', 7, 'all', { el: 'earth' }),
  splash:   MS('水砲', 'Water Gun', 'dmg', 5.5, 'one', { el: 'water' }),
  holybeam: MS('聖光', 'Holy Ray', 'dmg', 9, 'one', { el: 'holy' }),
  darkwave: MS('暗黑波動', 'Dark Wave', 'dmg', 8, 'all'),
  spores:   MS('睡眠孢子', 'Sleep Spores', 'status', 0.45, 'all', { add: 'sleep' }),
  dust:     MS('黑煙', 'Black Smoke', 'status', 0.5, 'all', { add: 'blind' }),
  hush:     MS('靜寂之歌', 'Hush', 'status', 0.5, 'all', { add: 'silence' }),
  slowgas:  MS('遲緩氣體', 'Lethargy', 'status', 0.55, 'all', { add: 'slow' }),
  drainbite:MS('吸血', 'Blood Drain', 'drain', 5, 'one'),
  heal:     MS('治療', 'Heal', 'healself', 8, 'self'),
  beam:     MS('炎之詠唱', 'Fire Canticle', 'dmg', 6, 'one', { el: 'fire' }),
  icebeam:  MS('冰之詠唱', 'Ice Canticle', 'dmg', 6, 'one', { el: 'ice' }),
  boltbeam: MS('雷之詠唱', 'Thunder Canticle', 'dmg', 6, 'one', { el: 'bolt' }),
  missile:  MS('蒸汽砲', 'Steam Cannon', 'phys', 2.4, 'one'),
  laser:    MS('共鳴砲', 'Resonance Cannon', 'dmg', 13, 'all'),
  ink:      MS('迷眼噴霧', 'Blinding Spray', 'status', 0.7, 'all', { add: 'blind' }),
  tentacle: MS('纏繞', 'Coil', 'phys', 1.3, 'one', { add: 'slow' }),
  wheel:    MS('輾壓', 'Wheel', 'phys', 1.8, 'all'),
  soulcall: MS('灰眠', 'Grey Sleep', 'kill', 0.18, 'one'),
  laugh:    MS('靜默的手勢', 'Gesture of Silence', 'status', 0.5, 'all', { add: 'silence' }),
  meteor:   MS('星落', 'Starfall', 'dmg', 19, 'all'),
  ultima:   MS('終焉和弦', 'Last Chord', 'dmg', 22, 'all', { pierce: true }),
  hyperdrive: MS('急板', 'Presto', 'dmg', 24, 'one', { pierce: true }),
  firaga:   MS('劫火', 'Inferno', 'dmg', 26, 'one', { el: 'fire' }),
  blizzaga: MS('絕對零度', 'Absolute Zero', 'dmg', 26, 'one', { el: 'ice' }),
  thundaga: MS('天雷', 'Heaven\'s Bolt', 'dmg', 26, 'one', { el: 'bolt' }),
  havoc:    MS('破滅之翼', 'Ruin Wing', 'phys', 1.6, 'all'),
  heartless:MS('搖籃曲', 'Lullaby of Rest', 'gravity', 0.6, 'all'),
  goner:    MS('終止符', 'Final Rest', 'dmg', 20, 'all', { pierce: true }),
};
for (const [k, v] of Object.entries(LORES)) MSKILLS[k] = { ...v, lore: k };

// ---------------------------------------------------------------- the bestiary
// [id, 中文, English, level, art, [colour, colour2], options]
// options: hp (multiplier), weak / absorb / immune (elements), skills ({ move: weight }), steal [common, rare], drop, size, boss, undead, ap, gil
const M = [
  // ---- Frostvale and the north (Lv 1-6)
  ['frostbat', '冰蝙蝠', 'Frost Bat', 1, 'frostbat', ['#7aa0d8', '#e0f0ff'], { size: 1.25, weak: ['fire'], skills: { bite: 2 }, steal: ['potion'] }],
  ['minerat', '礦坑鼠', 'Mine Rat', 2, 'minerat', ['#8a7a6a', '#e0c8a8'], { size: 1.25, skills: { bite: 3 }, steal: ['potion', 'antidote'] }],
  ['snowwolf', '雪狼', 'Snow Wolf', 3, 'wolf', ['#c8d0e0', '#6a7a9a'], { weak: ['fire'], absorb: ['ice'], skills: { bite: 3, frost: 1 }, steal: ['potion'] }],
  ['slimeice', '冰史萊姆', 'Ice Slime', 3, 'iceslime', ['#a0d8ff', '#ffffff'], { size: 1.15, weak: ['fire'], immune: ['ice'], skills: { frost: 2 }, steal: ['antidote'] }],
  ['guard', '霜石鎮衛兵', 'Frostvale Guard', 3, 'frostguard', ['#8a96a8', '#5a3a2a'], { size: 1.3, skills: { slash: 1 }, steal: ['potion', 'buckler'] }],
  ['ironshell', '鐵殼蟹', 'Ironshell', 5, 'ironshell', ['#8a9ab0', '#ffd040'], { boss: true, hp: 7, size: 1.95, skills: { slash: 3, splash: 2 }, counter: 'tackle', steal: ['potion', 'mithrilknife'], ap: 3 }],
  ['captain', '衛兵隊長', 'Guard Captain', 6, 'frostcaptain', ['#8a96a8', '#d83a3a'], { size: 1.6, boss: true, hp: 5, skills: { slash: 3, heal: 1 }, steal: ['hipotion', 'ironhelm'], ap: 3 }],
  // ---- the Sularis desert (Lv 4-9)
  ['sandcrawl', '沙蠍', 'Sand Scorpion', 4, 'scorpion', ['#d8b060', '#8a5a2a'], { skills: { slash: 2, fang: 1 }, steal: ['antidote'] }],
  ['cactrot', '針帽仙人掌', 'Spinecap', 6, 'cactus', ['#5aa83a', '#ffd040'], { hp: 0.6, skills: { tackle: 2 }, ap: 3, gil: 3, steal: ['potion', 'gem'] }],
  ['dunebird', '沙丘禿鷹', 'Dune Vulture', 6, 'bird', ['#a0703a', '#f0d0a0'], { weak: ['wind'], skills: { slash: 2, gust: 1 }, steal: ['potion'] }],
  ['sandworm', '沙蟲', 'Sand Worm', 7, 'worm', ['#c8a070', '#8a5a3a'], { hp: 1.5, weak: ['water'], skills: { bite: 2, tremor: 1 }, steal: ['hipotion'] }],
  ['magitek', '聖詠機甲', 'Choir Engine', 7, 'mech', ['#6a7a6a', '#d8d040'], { hp: 1.6, weak: ['bolt'], skills: { beam: 2, missile: 1, attack: 1 }, steal: ['potion', 'ether'] }],
  // ---- Mt Kolan (Lv 8-12)
  ['cragbat', '岩蝙蝠', 'Crag Bat', 8, 'bat', ['#6a5a4a', '#c8a080'], { skills: { bite: 2, drainbite: 1 }, steal: ['eyedrop'] }],
  ['harpy', '鷹身女妖', 'Harpy', 9, 'bird', ['#c86a8a', '#ffe0e0'], { weak: ['bolt'], skills: { slash: 2, gust: 1 }, steal: ['potion', 'plumedhat'] }],
  ['rockgolem', '岩石魔像', 'Rock Golem', 10, 'golem', ['#8a7a6a', '#40ff90'], { hp: 1.8, weak: ['water'], skills: { tackle: 2, tremor: 1 }, steal: ['hipotion'] }],
  ['monkimp', '山魈', 'Mountain Imp', 9, 'imp', ['#8a5a3a', '#f0c060'], { skills: { slash: 2, goblinpunch: 1 }, steal: ['echo'] }],
  ['barg', '巴爾格', 'Barg', 12, 'brawler', ['#c8783a', '#3a2a1a'], { boss: true, hp: 7, size: 1.3, skills: { rush: 2, gust: 2, tailwhip: 1 }, steal: ['hipotion', 'mithrilclaw'], ap: 5 }],
  // ---- Thunder River, the Dawnline hideout (Lv 10-14)
  ['riverfrog', '河蛙', 'River Frog', 10, 'frog', ['#4aa060', '#f0e070'], { weak: ['ice'], absorb: ['water'], skills: { splash: 2, tackle: 1 }, steal: ['echo'] }],
  ['pterodon', '翼龍', 'Pterodon', 12, 'bird', ['#a06a4a', '#ffd040'], { weak: ['wind'], skills: { flames: 1, slash: 2 }, steal: ['potion'] }],
  ['nautilus', '鸚鵡螺', 'Nautilus', 11, 'shell', ['#d8a070', '#8a4a2a'], { weak: ['bolt'], skills: { splash: 2, aquabreath: 0.4 }, steal: ['hipotion'] }],
  ['octa', '齒輪伯爵的蒸汽蟹', 'Gearwick\'s Steamcrab', 13, 'steamcrab', ['#b8763a', '#ffd060'], { boss: true, hp: 7, size: 1.7, weak: ['fire', 'bolt'], skills: { tentacle: 3, ink: 2 }, steal: ['hipotion', 'ether'], ap: 6 }],
  // ---- Southwind and the tunnels (Lv 11-15)
  ['trooper', '聖詠衛兵', 'Choir Warden', 11, 'soldier', ['#7a5a3a', '#a8a8a8'], { skills: { slash: 2, fireball: 1 }, steal: ['potion', 'ironarmor'] }],
  ['commander', '聖詠隊長', 'Choir Captain', 14, 'knight', ['#5a3a6a', '#ffd040'], { hp: 1.5, skills: { slash: 2, heal: 1 }, steal: ['hipotion', 'ironhelm'] }],
  ['hound', '軍犬', 'War Hound', 12, 'wolf', ['#5a4a3a', '#d83a3a'], { skills: { bite: 3 }, steal: ['potion'] }],
  ['tunneldrill', '齒輪伯爵的鑽地機', 'Gearwick\'s Burrower', 15, 'drill', ['#8a6a3a', '#ff6a2a'], { boss: true, hp: 7, size: 1.6, weak: ['bolt', 'water'], skills: { missile: 2, wheel: 2, beam: 1 }, steal: ['hipotion', 'drill'], ap: 7 }],
  // ---- the camp, Kasumi, the ferry, the Wildlands (Lv 12-18)
  ['ghostsoldier', '灰眠之人', 'Grey Sleeper', 14, 'ghost', ['#8a9ab0', '#e0f0ff'], { undead: true, weak: ['fire', 'holy'], skills: { slash: 2, soulcall: 0.3 }, steal: ['phoenix'] }],
  ['wraith', '怨靈', 'Wraith', 15, 'ghost', ['#5a6a8a', '#a0ffd0'], { undead: true, weak: ['fire', 'holy'], skills: { drainbite: 2, hush: 1 }, steal: ['echo'] }],
  ['bonedog', '骸骨犬', 'Bone Hound', 15, 'bonehound', ['#e8e0d0', '#ff5a3a'], { undead: true, weak: ['fire', 'holy'], skills: { bite: 2, condemn: 0.3 }, steal: ['phoenix'] }],
  ['ferry', '沉鐘', 'The Drowned Bell', 18, 'bell', ['#3a4a5a', '#a0ffd0'], { boss: true, hp: 6.5, size: 2, undead: true, weak: ['fire', 'holy'], skills: { wheel: 3, soulcall: 1, darkwave: 1 }, steal: ['phoenix', 'hipotion'], ap: 8 }],
  ['wildboar', '荒原野豬', 'Wild Boar', 14, 'boar', ['#8a5a3a', '#f0e0c0'], { skills: { tackle: 2, rush: 1 }, steal: ['potion'] }],
  ['leafer', '跳葉兔', 'Leafer', 13, 'hare', ['#5aa83a', '#f0f0a0'], { skills: { tackle: 2 }, steal: ['potion'] }],
  ['vulture', '荒原禿鷹', 'Wild Vulture', 15, 'bird', ['#6a4a3a', '#d8b080'], { weak: ['wind'], skills: { slash: 2, gust: 1 }, steal: ['eyedrop'] }],
  ['stray', '流浪貓妖', 'Stray Cat', 14, 'cat', ['#f0a040', '#ffffff'], { skills: { slash: 3 }, steal: ['potion', 'gem'] }],
  ['rhinox', '犀牛魔', 'Rhinox', 17, 'rhino', ['#7a7a8a', '#d8d8e0'], { hp: 1.5, skills: { rush: 2, tremor: 1 }, steal: ['hipotion'] }],
  // ---- the Serpent Trench (Lv 15-19)
  ['seadevil', '海魔', 'Sea Devil', 16, 'fish', ['#3a6ab8', '#c0f0ff'], { weak: ['bolt'], absorb: ['water'], skills: { splash: 2, bite: 1 }, steal: ['hipotion'] }],
  ['anemone', '海葵', 'Anemone', 16, 'plant', ['#ff6aa0', '#ffe0f0'], { weak: ['fire'], skills: { spores: 1, fang: 2 }, steal: ['echo'] }],
  ['eel', '電鰻', 'Volt Eel', 17, 'snake', ['#3a8aa8', '#ffff60'], { absorb: ['bolt'], skills: { spark: 2, storm: 1 }, steal: ['ether'] }],
  // ---- the cliffs of Frostvale (Lv 16-20)
  ['heavytrooper', '聖詠斧兵', 'Choir Halberdier', 18, 'soldier', ['#4a4a5a', '#d83a3a'], { hp: 1.3, skills: { slash: 2, missile: 1 }, steal: ['hipotion', 'mithrilmail'] }],
  ['magitek2', '聖詠機甲 二型', 'Choir Engine Mk II', 19, 'mech', ['#5a6a8a', '#40e0ff'], { hp: 1.6, weak: ['bolt'], skills: { icebeam: 2, boltbeam: 2, missile: 1 }, steal: ['ether'] }],
  ['kross', '卡蘭', 'Kalan', 20, 'kalan', ['#3a2a4a', '#ffd040'], { boss: true, hp: 9, size: 1.3, skills: { slash: 3, fireball: 2, heal: 1 }, steal: ['hipotion', 'regal'], ap: 10 }],
  // ---- Rainhold (Lv 18-22)
  ['thief', '雨城盜賊', 'Rainhold Thief', 18, 'rogue', ['#5a4a6a', '#a0a0a0'], { skills: { slash: 2 }, steals: true, steal: ['hipotion', 'mithrilknife'] }],
  ['gutterrat', '溝鼠', 'Gutter Rat', 18, 'rat', ['#5a5a5a', '#c8a8a8'], { skills: { fang: 2 }, steal: ['antidote'] }],
  ['rainslime', '雨史萊姆', 'Rain Slime', 19, 'slime', ['#5a8ab8', '#c0e0ff'], { absorb: ['water'], weak: ['bolt'], skills: { splash: 2 }, steal: ['ether'] }],
  ['gargoyle', '石像鬼', 'Gargoyle', 21, 'demon', ['#6a6a7a', '#ffd040'], { hp: 1.3, skills: { slash: 2, stonegaze: 0.4 }, steal: ['hipotion'] }],
  ['thiefking', '雨城盜賊團長', 'Thief Lord', 22, 'rogue', ['#2a2a3a', '#ff4040'], { boss: true, hp: 8, skills: { slash: 3, dust: 1, fireball: 1 }, steal: ['ether', 'airlancet'], ap: 10 }],
  // ---- the opera rafters (Lv 20-23)
  ['rafterrat', '屋頂老鼠', 'Rafter Rat', 20, 'rat', ['#8a6a5a', '#f0d0c0'], { skills: { bite: 2 }, steal: ['potion'] }],
  ['octa2', '齒輪伯爵的管風琴機', 'Gearwick\'s Organ Engine', 23, 'organ', ['#6a4a2a', '#e0b040'], { boss: true, hp: 8, size: 1.7, weak: ['fire'], skills: { tentacle: 3, ink: 2, splash: 1 }, steal: ['ether', 'hipotion'], ap: 10 }],
  // ---- the Empire (Lv 21-28)
  ['sentry', '聖詠都哨兵', 'Vexhold Sentry', 22, 'soldier', ['#3a3a4a', '#ffd040'], { skills: { slash: 2, fireball: 1 }, steal: ['hipotion', 'ironhelm'] }],
  ['flyer', '機械飛鳥', 'Sky Drone', 23, 'drone', ['#8a8a9a', '#ff4040'], { weak: ['bolt'], skills: { laser: 0.3, beam: 2 }, steal: ['ether'] }],
  ['chimera', '合成獸', 'Chimera', 25, 'beast', ['#8a3a5a', '#ffd040'], { hp: 1.4, skills: { flames: 1, bite: 2, blizzard: 1 }, steal: ['hipotion'] }],
  ['labmutant', '熔渣怪', 'Slag Ooze', 24, 'slime', ['#a040c0', '#40ff90'], { skills: { fang: 2, slowgas: 1 }, steal: ['remedy'] }],
  ['proto', '熔晶所原型機', 'Foundry Prototype', 26, 'mech', ['#c0c0d0', '#c040ff'], { hp: 1.6, weak: ['bolt'], skills: { laser: 1, missile: 2 }, steal: ['ether', 'mithrilshield'] }],
  ['no128', '融合星靈', 'Fused Astral', 27, 'demon', ['#5a3a7a', '#40ff90'], { boss: true, hp: 9, size: 1.7, skills: { bite: 2, fang: 1, fireball: 1, darkwave: 1 }, steal: ['ether', 'rune'], ap: 12 }],
  ['gateguard', '守門巨像', 'Gate Colossus', 28, 'golem', ['#c8c8e0', '#40c0ff'], { boss: true, hp: 10, size: 1.9, skills: { tackle: 2, laser: 1, mightyguard: 0.6 }, steal: ['ether', 'goldshield'], ap: 14 }],
  // ---- Samar and the Astral Valley (Lv 26-33)
  ['firewisp', '火焰精', 'Fire Wisp', 27, 'wisp', ['#ff8030', '#ffe060'], { absorb: ['fire'], weak: ['ice', 'water'], skills: { fireball: 2, flames: 1 }, steal: ['ether'] }],
  ['flamelord', '火焰之主', 'Flame Lord', 30, 'wisp', ['#ff4020', '#ffd040'], { boss: true, hp: 10, size: 1.8, absorb: ['fire'], weak: ['ice', 'water'], skills: { flames: 2, fireball: 2, exploder: 0.2 }, steal: ['ether', 'flametongue'], ap: 15 }],
  ['dryad', '樹精', 'Dryad', 28, 'dryad', ['#3a8a3a', '#ffa0d0'], { weak: ['fire'], skills: { spores: 1, whitewind: 0.2, fang: 2 }, steal: ['remedy'] }],
  ['valleywolf', '谷狼', 'Valley Wolf', 29, 'wolf', ['#6a7a5a', '#ffd040'], { skills: { bite: 3, gust: 1 }, steal: ['hipotion'] }],
  ['wyvern', '飛龍', 'Wyvern', 31, 'dragon', ['#5a8a5a', '#f0d070'], { hp: 1.4, weak: ['ice'], skills: { flames: 1, slash: 2 }, steal: ['hipotion'] }],
  ['vissek1', '歐瑟', 'Orsay', 33, 'conductor', ['#e0e0f0', '#c040ff'], { boss: true, hp: 7, size: 1.3, skills: { fireball: 2, frost: 2, spark: 2, laugh: 1 }, steal: ['ether', 'goldhairpin'], ap: 18 }],
  // ---- the Floating Isle (Lv 31-38)
  ['skyray', '天空鰩', 'Sky Ray', 32, 'ray', ['#8ab0e0', '#ffffff'], { skills: { gust: 2, storm: 1 }, steal: ['ether'] }],
  ['behemoth', '灰角巨獸', 'Ashhorn', 36, 'beast', ['#5a3a6a', '#ffd040'], { hp: 2, skills: { rush: 2, meteor: 0.2, bite: 2 }, steal: ['xpotion', 'hipotion'] }],
  ['naga', '那伽', 'Naga', 34, 'snake', ['#3a8a6a', '#ffd040'], { skills: { spark: 2, quasar: 0.15 }, steal: ['ether'] }],
  ['apparatus', '鐘樓機兵', 'Belfry Sentinel', 35, 'mech', ['#c8b060', '#40ffff'], { hp: 1.5, weak: ['bolt'], skills: { laser: 1, missile: 2, bigguard: 0.2 }, steal: ['turbo'] }],
  ['skyguard', '聖詠飛艇', 'Choir Skyship', 36, 'skyship', ['#c8c8f0', '#4060ff'], { boss: true, hp: 10, size: 1.9, skills: { havoc: 1, storm: 2, slash: 2 }, steal: ['turbo', 'thunderblade'], ap: 20 }],
  ['starcore', '大鐘之心', 'Heart of the Great Bell', 38, 'core', ['#ffd040', '#ff4040'], { boss: true, hp: 10, size: 2, skills: { meteor: 0.3, laser: 2, attack: 1 }, steal: ['turbo', 'aegis'], ap: 24 }],
  ['vissek2', '歐瑟', 'Orsay', 40, 'conductor', ['#e0e0f0', '#c040ff'], { boss: true, hp: 40, size: 1.3, skills: { firaga: 2, blizzaga: 2, thundaga: 2, laugh: 1 }, steal: ['xpotion'], ap: 0, unwinnable: true }],
  // ---- the world of ruin: the Solitary Isle and the south (Lv 33-42)
  ['crawler', '廢墟爬蟲', 'Ruin Crawler', 34, 'scorpion', ['#5a4a3a', '#ff6040'], { skills: { slash: 2, fang: 1 }, steal: ['hipotion'] }],
  ['peeper', '偷窺眼', 'Peeper', 35, 'eye', ['#a080c0', '#ff4040'], { skills: { stonegaze: 1, darkwave: 1 }, steal: ['remedy'] }],
  ['ashbird', '灰燼鳥', 'Ash Bird', 36, 'bird', ['#5a5a5a', '#ff8030'], { absorb: ['fire'], skills: { flames: 1, slash: 2 }, steal: ['ether'] }],
  ['dunefiend', '沙魔', 'Dune Fiend', 37, 'worm', ['#a07a4a', '#ff4040'], { hp: 1.6, weak: ['water'], skills: { tremor: 2, bite: 2 }, steal: ['xpotion'] }],
  ['bomb', '炸彈怪', 'Bomb', 36, 'bomb', ['#ff6020', '#ffe060'], { absorb: ['fire'], weak: ['ice'], skills: { fireball: 2, exploder: 0.5 }, steal: ['firescroll'] }],
  // ---- recruiting quests: the sunken castle, Hopehaven, the tomb, the dream, the phoenix cave, the tower (Lv 38-50)
  ['tentaclex', '沙之巨蛇', 'Sand Serpent', 36, 'serpent', ['#c8a060', '#a04a2a'], { boss: true, hp: 3.5, size: 1.8, skills: { tentacle: 3, ink: 1, drainbite: 1 }, steal: ['turbo'], ap: 20 }],
  ['darkknight', '黑騎士', 'Dark Knight', 40, 'knight', ['#2a2a3a', '#c040ff'], { hp: 1.4, skills: { slash: 3, darkwave: 1 }, steal: ['xpotion', 'diamondshield'] }],
  ['hopefiend', '灰潮巨獸', 'Ash Behemoth', 42, 'beast', ['#7a3a2a', '#ffd040'], { boss: true, hp: 10, size: 1.9, skills: { rush: 2, flames: 1, gust: 1 }, steal: ['turbo', 'diamondvest'], ap: 24 }],
  ['tombghost', '墓之守', 'Tomb Warden', 41, 'ghost', ['#c8c8a0', '#ffd040'], { undead: true, weak: ['fire', 'holy'], skills: { soulcall: 0.3, drainbite: 2 }, steal: ['phoenix'] }],
  ['tombking', '鯨墓的守墓人', 'Graveyard Keeper', 42, 'lord', ['#c8a040', '#ffffff'], { boss: true, hp: 6.5, size: 1.7, undead: true, weak: ['holy'], skills: { slash: 2, darkwave: 1, condemn: 0.5 }, steal: ['turbo', 'crystalhelm'], ap: 25 }],
  ['nightmare', '灰燼鍛冶師', 'Ash Smith', 45, 'smith', ['#5a2a6a', '#ff60ff'], { boss: true, hp: 12, size: 1.8, undead: true, weak: ['holy'], skills: { spores: 1, drainbite: 2, darkwave: 2, roulette: 0.3 }, steal: ['turbo', 'aura'], ap: 26 }],
  ['dreamshade', '夢之影', 'Dream Shade', 43, 'ghost', ['#3a2a5a', '#a080ff'], { undead: true, weak: ['holy'], skills: { hush: 1, darkwave: 1 }, steal: ['remedy'] }],
  ['phoenixwyrm', '火山龍', 'Lava Wyrm', 45, 'dragon', ['#a02a10', '#ffb030'], { hp: 1.5, absorb: ['fire'], weak: ['ice', 'water'], skills: { flames: 2, slash: 2 }, steal: ['xpotion'] }],
  ['phoenixguard', '回音的守護者', 'Echo Guardian', 46, 'golem', ['#c03a10', '#ffe060'], { boss: true, hp: 12, size: 1.8, absorb: ['fire'], weak: ['ice'], skills: { flames: 2, tremor: 2, attack: 1 }, steal: ['turbo', 'flameshield'], ap: 26 }],
  ['zealot', '沉默教徒', 'Hushed Zealot', 46, 'mage', ['#c03a3a', '#ffffff'], { skills: { fireball: 1, spark: 1, frost: 1 }, steal: ['ether'] }],
  ['magicpot', '魔法壺', 'Magic Urn', 44, 'urn', ['#c8a040', '#40ffd0'], { hp: 0.4, skills: { heal: 3, whitewind: 1 }, steal: ['elixir'], ap: 10 }],
  ['colossus', '鬥技場冠軍', 'Colosseum Champion', 48, 'knight', ['#ffd040', '#c03a3a'], { boss: true, hp: 12, skills: { slash: 3, rush: 1 }, steal: ['xpotion'], ap: 26 }],
  ['sandworm2', '鏡廳之蟲', 'Mirror Worm', 45, 'worm', ['#d8a060', '#ff4040'], { boss: true, hp: 12, size: 2, weak: ['water'], skills: { tremor: 2, bite: 2 }, steal: ['turbo'], ap: 24 }],
  ['icebone', '冰洞骸骨', 'Ice Bones', 43, 'skeleton', ['#c0e0ff', '#40a0ff'], { undead: true, weak: ['fire', 'holy'], absorb: ['ice'], skills: { frost: 2, blizzard: 1 }, steal: ['hipotion'] }],
  // ---- the eight dragons (Lv 55-65)
  ['reddragon', '不協之獸・赤', 'Discord: Crimson', 56, 'dragon', ['#c82a1a', '#ffd040'], { boss: true, hp: 8, size: 2, absorb: ['fire'], weak: ['ice'], skills: { flames: 3, firaga: 1 }, steal: ['xpotion', 'flametongue'], ap: 40, dragon: true }],
  ['icedragon', '不協之獸・霜', 'Discord: Rime', 56, 'wolf', ['#a0d8ff', '#ffffff'], { boss: true, hp: 8, size: 2, absorb: ['ice'], weak: ['fire'], skills: { blizzard: 3, blizzaga: 1 }, steal: ['xpotion', 'icebrand'], ap: 40, dragon: true }],
  ['stormdragon', '不協之獸・嵐', 'Discord: Gale', 58, 'bird', ['#a0c8a0', '#ffff80'], { boss: true, hp: 8, size: 2, absorb: ['wind'], skills: { gust: 3, storm: 2 }, steal: ['xpotion', 'tempest'], ap: 40, dragon: true }],
  ['earthdragon', '不協之獸・岩', 'Discord: Stone', 58, 'golem', ['#8a6a3a', '#40c040'], { boss: true, hp: 8, size: 2, absorb: ['earth'], skills: { tremor: 3, quasar: 0.5 }, steal: ['xpotion', 'goldarmor'], ap: 40, dragon: true }],
  ['holydragon', '不協之獸・光', 'Discord: Light', 60, 'angel', ['#f0f0ff', '#ffd040'], { boss: true, hp: 8, size: 2, absorb: ['holy'], skills: { holybeam: 3, heal: 1 }, steal: ['xpotion', 'holylance'], ap: 40, dragon: true }],
  ['deaddragon', '不協之獸・骸', 'Discord: Bone', 60, 'bonedragon', ['#c8c0b0', '#40ff60'], { boss: true, hp: 8, size: 2, undead: true, weak: ['holy', 'fire'], skills: { condemn: 1, darkwave: 2, drainbite: 1 }, steal: ['xpotion', 'ribbon'], ap: 40, dragon: true }],
  ['golddragon', '不協之獸・金', 'Discord: Gold', 62, 'serpent', ['#ffd040', '#ffffff'], { boss: true, hp: 8, size: 2, absorb: ['bolt'], skills: { storm: 2, thundaga: 1, grandtrain: 0.2 }, steal: ['xpotion', 'crystalmail'], ap: 40, dragon: true }],
  ['skydragon', '不協之獸・空', 'Discord: Void', 64, 'dragon', ['#4a6ad8', '#ff80ff'], { boss: true, hp: 9, size: 2, skills: { havoc: 2, gust: 2, meteor: 0.4 }, steal: ['xpotion', 'genjiglove'], ap: 40, dragon: true }],
  // ---- the Spire of Judgement (Lv 55-66)
  ['spirebeast', '塔之獸', 'Tower Beast', 56, 'beast', ['#3a2a3a', '#ff4040'], { hp: 1.6, skills: { rush: 2, meteor: 0.2, bite: 2 }, steal: ['xpotion'] }],
  ['spiremage', '沉默聖歌隊', 'Silent Chorister', 57, 'mage', ['#2a1a3a', '#c040ff'], { skills: { firaga: 1, blizzaga: 1, thundaga: 1, grandtrain: 0.1 }, steal: ['turbo'] }],
  ['spireknight', '塔之騎士', 'Tower Knight', 58, 'knight', ['#5a5a6a', '#ff2020'], { hp: 1.4, skills: { slash: 3, attack: 1 }, steal: ['xpotion', 'crystalshield'] }],
  ['spiremech', '安息機兵', 'Rest Engine', 59, 'mech', ['#2a2a2a', '#ff2020'], { hp: 1.6, weak: ['bolt'], skills: { laser: 2, missile: 2 }, steal: ['turbo'] }],
  ['oldgod', '最初的沉默', 'The First Silence', 72, 'core', ['#1a1a2a', '#ffffff'], { boss: true, hp: 20, size: 2, skills: { ultima: 1, meteor: 1, condemn: 1, heal: 0.5 }, steal: ['megalixir', 'paladinshield'], ap: 80 }],
  ['tower1', '破曉之鐘的守衛', 'Warden of the Dawn Bell', 62, 'statue', ['#c0a060', '#ff4040'], { boss: true, hp: 12, size: 1.8, skills: { rush: 2, tremor: 2, meteor: 0.3 }, steal: ['xpotion'], ap: 40 }],
  ['tower2', '暮光之鐘的守衛', 'Warden of the Dusk Bell', 62, 'statue', ['#6060c0', '#40ffff'], { boss: true, hp: 11, size: 1.8, skills: { firaga: 1, blizzaga: 1, thundaga: 1, quasar: 0.5 }, steal: ['turbo'], ap: 40 }],
  ['tower3', '永夜之鐘的守衛', 'Warden of the Night Bell', 62, 'statue', ['#e0e0f0', '#ff80c0'], { boss: true, hp: 11, size: 1.8, skills: { holybeam: 2, heal: 1, heartless: 0.3 }, steal: ['elixir'], ap: 40 }],
  ['god1', '大指揮者歐瑟', 'Orsay, High Conductor', 66, 'conductor', ['#ffffff', '#c040ff'], { boss: true, hp: 7, size: 1.5, skills: { firaga: 1, blizzaga: 1, thundaga: 1, laugh: 1, hyperdrive: 0.5 }, steal: ['megalixir'], ap: 0 }],
  ['god2', '歐瑟・沉默聖歌', 'Orsay, Silent Hymn', 68, 'angel', ['#e0d0ff', '#ff4080'], { boss: true, hp: 7, size: 2, skills: { havoc: 1, heartless: 0.3, meteor: 1, holybeam: 1, attack: 1.5 }, steal: ['megalixir'], ap: 0 }],
  ['god3', '歐瑟・安息安魂曲', 'Orsay, Requiem of Rest', 70, 'requiem', ['#ffffff', '#ff2060'], { boss: true, hp: 4.5, size: 2.2, skills: { goner: 0.5, ultima: 0.5, heartless: 0.3, meteor: 1, laugh: 0.6, attack: 2 }, steal: ['megalixir'], ap: 0 }],
];
// elites: bounty marks, episode guardians and the beasts of the abyss — renamed, recoloured and much tougher versions
// of the creatures above: [id, base, zh, en, level, art (null = the base's), colours, options]
const ELITE = [
  ['b_ratking', 'minerat', '灰鬚鼠王', 'Greybeard Rat King', 14, null, ['#6a6a7a', '#c8e8ff'], { hp: 6, size: 1.6 }],
  ['b_cragqueen', 'cragbat', '岩窟女王', 'Crag Queen', 17, null, ['#4a3a5a', '#ff6a8a'], { hp: 6, size: 1.6 }],
  ['b_rivermaw', 'riverfrog', '濁流之顎', 'Maw of the Current', 19, null, ['#3a6a4a', '#ff8a3a'], { hp: 6, size: 1.7 }],
  ['b_tunnelworm', 'sandworm', '地底饕客', 'Tunnel Glutton', 21, null, ['#6a5a4a', '#ffd040'], { hp: 6, size: 1.7 }],
  ['b_mourner', 'wraith', '啜泣的鐘魂', 'Weeping Bell-Ghost', 24, 'bell', ['#3a4a6a', '#a0c8ff'], { hp: 6, size: 1.5 }],
  ['b_abysseel', 'eel', '深淵電鰻', 'Abyssal Eel', 26, null, ['#2a3a6a', '#80ffff'], { hp: 6, size: 1.7 }],
  ['b_rooftop', 'thiefking', '屋頂上的影子', 'Shadow on the Roof', 28, null, ['#3a2a2a', '#ffd040'], { hp: 6, size: 1.5 }],
  ['b_lavahound', 'hound', '熔岩獵犬', 'Lava Hound', 30, null, ['#8a2a1a', '#ffb030'], { hp: 5, size: 1.7, weak: ['ice', 'water'] }],
  ['b_alpha', 'valleywolf', '白花狼王', 'Alpha of the White Flowers', 35, null, ['#e8e8f0', '#ff8ab0'], { hp: 7, size: 1.8 }],
  ['b_bonewhale', 'tombghost', '骨鯨', 'Bone Whale', 48, 'bonedragon', ['#d8d0c0', '#80c8ff'], { hp: 6, size: 1.9 }],
  ['b_dreamblade', 'darkknight', '夢中的劍士', 'Swordsman in the Dream', 50, 'kalan', ['#4a3a5a', '#ff60ff'], { hp: 6, size: 1.5 }],
  ['b_moltenheart', 'phoenixwyrm', '熔心', 'Molten Heart', 50, 'core', ['#ff6a20', '#ffe060'], { hp: 6, size: 1.7, absorb: ['fire'] }],
  ['b_cantor', 'spiremage', '無聲的唱詩班長', 'Voiceless Cantor', 52, null, ['#e8e8f0', '#8a3ab8'], { hp: 6, size: 1.6 }],
  ['b_rimebeast', 'behemoth', '千年冰獸', 'Thousand-Year Rime Beast', 52, null, ['#a0d0f0', '#ffffff'], { hp: 6, size: 1.9, absorb: ['ice'], weak: ['fire'] }],
  ['b_mirrorme', 'thiefking', '鏡中的自己', 'The Self in the Mirror', 54, 'rogue', ['#8a8aa8', '#c8f0ff'], { hp: 6, size: 1.5 }],
  ['b_crimsonpup', 'reddragon', '赤之獸的幼崽', 'Whelp of the Crimson Discord', 55, null, ['#e84a2a', '#ffe060'], { hp: 4, size: 1.6 }],
  ['b_rubblegiant', 'rockgolem', '崩岩巨人', 'Rubble Giant', 57, null, ['#6a5a4a', '#ff8a3a'], { hp: 7, size: 2 }],
  ['b_bonegeneral', 'icebone', '骸骨將軍', 'Bone General', 59, null, ['#e8e0c8', '#ff3a3a'], { hp: 7, size: 1.8 }],
  ['b_goldserpent', 'tentaclex', '金色海蛇', 'Golden Sea-Serpent', 61, null, ['#ffd040', '#40c0ff'], { hp: 5, size: 1.9 }],
  ['b_voideye', 'peeper', '虛空之眼', 'Eye of the Void', 63, null, ['#2a2a4a', '#ff40ff'], { hp: 7, size: 1.8 }],
  // episode guardians
  ['e_roadkeeper', 'tombking', '灰路的守路人', 'Keeper of the Ash Road', 50, 'lord', ['#5a5a6a', '#ffd070'], { hp: 7, size: 1.8 }],
  ['e_gearmk3', 'octa2', '吉爾維克三號機・掌聲', 'Gearwick Mk III "Applause"', 50, 'organ', ['#8a5a2a', '#ffd040'], { hp: 7, size: 1.9, weak: ['bolt'] }],
  ['e_master', 'barg', '師父的回音', 'Echo of the Master', 50, 'brawler', ['#e8dcc0', '#80e8ff'], { hp: 7, size: 1.6 }],
  ['e_kasumei', 'flamelord', '被吸乾的霞鳴', 'Kasumei, Drained', 52, 'angel', ['#f0c8d8', '#ff80b0'], { hp: 7, size: 1.9, absorb: [], weak: ['holy'] }],
  ['e_lion', 'behemoth', '灰色的獅子', 'The Grey Lion', 50, 'beast', ['#8a8070', '#ffd040'], { hp: 7, size: 1.9 }],
  ['e_beaconbell', 'ferry', '燈塔的沉默之鐘', 'Silent Bell of the Lighthouse', 50, 'bell', ['#8a6a3a', '#80ffff'], { hp: 7, size: 1.9 }],
  ['e_stormcalf', 'skyray', '風暴之子', 'Child of the Storm', 52, 'ray', ['#4a5a8a', '#ffff80'], { hp: 7, size: 1.9, absorb: ['wind', 'bolt'] }],
  ['e_overseer', 'proto', '熔晶所總管的機甲', 'The Overseer\'s Engine', 52, 'mech', ['#5a5a6a', '#ff4040'], { hp: 7, size: 1.8, weak: ['bolt', 'water'] }],
  ['e_pagebeast', 'magicpot', '吞書的墨獸', 'The Ink Beast That Ate the Books', 52, 'urn', ['#2a2a3a', '#c0f0ff'], { hp: 7, size: 1.7 }],
  ['e_chimera', 'chimera', '紙頁合成獸', 'Chimera of Pages', 52, 'beast', ['#e8e0c8', '#3a2a1a'], { hp: 7, size: 1.9 }],
  ['e_foxgod', 'valleywolf', '九尾雪狐', 'Nine-Tailed Snow Fox', 50, 'wolf', ['#f4f4fc', '#a0d0ff'], { hp: 7, size: 1.8, absorb: ['ice'], weak: ['fire'] }],
  ['e_firstgolem', 'gateguard', '最初的守護者', 'The First Guardian', 52, 'golem', ['#9a8a78', '#40ff90'], { hp: 8, size: 2 }],
  ['e_mirrorqueen', 'spiremage', '鏡之女王', 'Queen of Mirrors', 54, 'angel', ['#c8c8e0', '#ffffff'], { hp: 7, size: 1.9 }],
  // the abyss
  ['x_warden', 'spireknight', '灰潮的守門人', 'Warden of the Ashtide', 68, 'statue', ['#4a4a5a', '#c8c8d8'], { hp: 9, size: 2 }],
  ['x_mother', 'oldgod', '灰潮之母', 'Mother of the Ashtide', 70, 'requiem', ['#3a3a44', '#d8d8e8'], { hp: 5, size: 2.1 }],
];
for (const [id, base, zh, en, lv, art, col, o] of ELITE) {
  const b = M.find((m) => m[0] === base); if (!b) throw new Error('elite base ' + base);
  M.push([id, zh, en, lv, art || b[4], col, { ...(b[6] || {}), boss: true, elite: true, ...o }]);
}
const lvStat = (L) => ({
  hp: Math.round(26 + L * 14 + L * L * 1.65),
  mp: Math.round(10 + L * 8),
  atk: Math.round(10 + L * 3.1),
  mag: Math.round(5 + L * 1.05),
  def: Math.min(190, Math.round(6 + L * 2.15)),
  mdef: Math.min(180, Math.round(4 + L * 1.95)),
  spd: Math.round(22 + L * 0.26),
  exp: Math.round(Math.pow(L, 1.55) * 2.0 + 6),
  gil: Math.round(L * 11 + 14),
  ap: 1 + Math.floor(L / 14),
});
export const MONSTERS = {};
for (const [id, zh, en, lv, art, col, o = {}] of M) {
  const s = lvStat(lv);
  MONSTERS[id] = {
    id, name: [zh, en], lv, art, col, size: o.size || (o.boss ? 1.5 : 1), boss: !!o.boss, undead: !!o.undead,
    hp: Math.round(s.hp * (o.hp || 1)), mp: s.mp, atk: s.atk, mag: s.mag, def: s.def, mdef: s.mdef, spd: s.spd + (o.boss ? 4 : 0),
    exp: Math.round(s.exp * (o.boss ? 6 : 1)), gil: Math.round(s.gil * (o.gil || 1) * (o.boss ? 5 : 1)), ap: o.ap ?? s.ap,
    weak: o.weak || [], absorb: o.absorb || [], immune: o.immune || [], skills: o.skills || { attack: 1 }, counter: o.counter || null,
    steal: o.steal || [], drop: o.drop || null, unwinnable: !!o.unwinnable, dragon: !!o.dragon, steals: !!o.steals,
  };
}
export const MONSTER_ORDER = M.map((m) => m[0]);

// ---------------------------------------------------------------- where they live: zone → groups (each a list of ids)
export const ZONES = {
  north:     { lv: 2, groups: [['frostbat', 'frostbat'], ['snowwolf'], ['slimeice', 'frostbat'], ['minerat', 'minerat', 'frostbat'], ['snowwolf', 'slimeice']] },
  mine:      { lv: 3, groups: [['minerat', 'minerat'], ['frostbat', 'minerat'], ['slimeice', 'slimeice'], ['guard', 'guard']] },
  desert:    { lv: 6, groups: [['sandcrawl', 'sandcrawl'], ['dunebird', 'sandcrawl'], ['sandworm'], ['cactrot'], ['dunebird', 'dunebird', 'sandcrawl']] },
  kolan:     { lv: 9, groups: [['cragbat', 'cragbat', 'cragbat'], ['harpy', 'cragbat'], ['rockgolem'], ['monkimp', 'monkimp'], ['harpy', 'monkimp']] },
  river:     { lv: 11, groups: [['riverfrog', 'riverfrog'], ['pterodon'], ['nautilus', 'riverfrog'], ['pterodon', 'nautilus']] },
  southwind: { lv: 12, groups: [['trooper', 'trooper'], ['hound', 'hound', 'trooper'], ['commander', 'trooper'], ['hound', 'hound']] },
  camp:      { lv: 13, groups: [['trooper', 'trooper', 'hound'], ['commander', 'hound'], ['magitek']] },
  ferry:     { lv: 15, groups: [['ghostsoldier', 'ghostsoldier'], ['wraith', 'bonedog'], ['wraith', 'wraith', 'ghostsoldier']] },
  wild:      { lv: 15, groups: [['wildboar'], ['leafer', 'leafer', 'leafer'], ['vulture', 'leafer'], ['stray', 'stray'], ['rhinox'], ['wildboar', 'vulture']] },
  trench:    { lv: 17, groups: [['seadevil', 'seadevil'], ['anemone', 'seadevil'], ['eel'], ['eel', 'anemone']] },
  cliffs:    { lv: 18, groups: [['heavytrooper', 'trooper'], ['magitek2'], ['heavytrooper', 'hound', 'hound']] },
  rain:      { lv: 20, groups: [['thief', 'thief'], ['gutterrat', 'gutterrat', 'rainslime'], ['gargoyle'], ['thief', 'gargoyle'], ['rainslime', 'rainslime']] },
  rafters:   { lv: 21, groups: [['rafterrat', 'rafterrat', 'rafterrat'], ['rafterrat', 'rafterrat']] },
  empire:    { lv: 23, groups: [['sentry', 'sentry'], ['flyer', 'flyer'], ['chimera'], ['sentry', 'flyer']] },
  lab:       { lv: 25, groups: [['labmutant', 'labmutant'], ['proto'], ['chimera', 'labmutant'], ['proto', 'sentry']] },
  gate:      { lv: 27, groups: [['chimera', 'labmutant'], ['proto', 'flyer'], ['firewisp', 'firewisp']] },
  samar:     { lv: 28, groups: [['firewisp', 'firewisp'], ['dryad', 'valleywolf'], ['valleywolf', 'valleywolf'], ['dryad', 'dryad']] },
  valley:    { lv: 31, groups: [['wyvern'], ['valleywolf', 'dryad'], ['wyvern', 'valleywolf'], ['firewisp', 'dryad', 'valleywolf']] },
  isle:      { lv: 35, groups: [['skyray', 'skyray'], ['naga', 'skyray'], ['apparatus'], ['behemoth'], ['naga', 'apparatus']] },
  ruinsouth: { lv: 36, groups: [['crawler', 'crawler'], ['peeper', 'crawler'], ['ashbird', 'ashbird'], ['bomb', 'bomb'], ['dunefiend']] },
  ruin:      { lv: 41, groups: [['darkknight'], ['peeper', 'ashbird'], ['bomb', 'darkknight'], ['dunefiend', 'crawler'], ['magicpot']] },
  tomb:      { lv: 42, groups: [['tombghost', 'tombghost'], ['tombghost', 'darkknight'], ['magicpot', 'tombghost']] },
  dream:     { lv: 44, groups: [['dreamshade', 'dreamshade'], ['dreamshade', 'tombghost'], ['wraith', 'dreamshade']] },
  phoenix:   { lv: 45, groups: [['phoenixwyrm'], ['bomb', 'phoenixwyrm'], ['ashbird', 'bomb', 'bomb']] },
  cult:      { lv: 46, groups: [['zealot', 'zealot'], ['magicpot', 'zealot'], ['zealot', 'zealot', 'zealot']] },
  icecave:   { lv: 43, groups: [['icebone', 'icebone'], ['snowwolf', 'icebone'], ['icebone', 'slimeice']] },
  abyss:     { lv: 62, groups: [['spirebeast', 'spireknight'], ['spiremage', 'spiremage', 'spireknight'], ['spiremech', 'darkknight'], ['spirebeast', 'spirebeast'], ['darkknight', 'darkknight', 'spiremage']] },
  spire:     { lv: 58, groups: [['spirebeast'], ['spiremage', 'spireknight'], ['spiremech', 'spiremage'], ['spireknight', 'spireknight'], ['spirebeast', 'spiremage']] },
};
// a group for a zone; monsters in the ruin come a little stronger the further the party has got (scale: levels to add)
export function encounter(zone, rng = Math.random) { const Z = ZONES[zone]; if (!Z) return []; return Z.groups[Math.floor(rng() * Z.groups.length)]; }
