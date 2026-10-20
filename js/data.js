// ASH ARIA — the data: characters and their unique commands, magic, Astrals, items, tools, equipment. No DOM (node tests load it).
// Names are [中文, English].

// ---------------------------------------------------------------- elements and statuses
export const ELEMENTS = ['fire', 'ice', 'bolt', 'wind', 'earth', 'water', 'holy', 'poison'];
export const EL_NAME = { fire: ['火', 'Fire'], ice: ['冰', 'Ice'], bolt: ['雷', 'Bolt'], wind: ['風', 'Wind'], earth: ['地', 'Earth'], water: ['水', 'Water'], holy: ['聖', 'Holy'], poison: ['毒', 'Poison'] };
export const STATUS = {
  poison: ['中毒', 'Poison'], sleep: ['睡眠', 'Sleep'], blind: ['失明', 'Blind'], silence: ['沉默', 'Silence'], slow: ['減速', 'Slow'], stop: ['停止', 'Stop'],
  haste: ['加速', 'Haste'], protect: ['護盾', 'Protect'], shell: ['魔障', 'Shell'], regen: ['再生', 'Regen'], astral: ['幻化', 'Astral'],
};
export const BAD = ['poison', 'sleep', 'blind', 'silence', 'slow', 'stop'];

// ---------------------------------------------------------------- the cast
// cmd: the unique command; wpn: weapon kinds; arm: armour class (heavy wears all, light wears light and robes, robe only robes)
// base: Lv 1 stats; hpg / mpg: growth per level. spells: learned by level (only the two born with magic)
const C = (zh, en, job, look, cmd, wpn, arm, base, hpg, mpg, extra = {}) => ({ name: [zh, en], job, look, cmd, wpn, arm, base, hpg, mpg, ...extra });
export const CHARS = {
  aria:   C('艾莉雅', 'Aria', ['半星靈的少女', 'Half-Astral'], 'aria', 'astralize', ['sword', 'rod'], 'heavy', { hp: 52, mp: 24, str: 31, mag: 39, spd: 33, vit: 28 }, 38, 7, { spells: { 1: 'fire', 3: 'cure', 7: 'antidote', 12: 'drain', 18: 'fira', 25: 'warp', 33: 'cura', 40: 'firaga', 46: 'arise' }, row: 'front' }),
  rowan:  C('洛恩', 'Rowan', ['寶藏獵人', 'Treasure Hunter'], 'rowan', 'steal', ['dagger', 'sword'], 'light', { hp: 48, mp: 12, str: 37, mag: 28, spd: 40, vit: 31 }, 40, 4),
  edmund: C('艾德蒙', 'Edmund', ['沙漠之王', 'Desert King'], 'edmund', 'tools', ['spear', 'sword'], 'heavy', { hp: 55, mp: 13, str: 39, mag: 29, spd: 30, vit: 34 }, 44, 4),
  sai:    C('賽伊', 'Sai', ['武僧', 'Monk'], 'sai', 'blitz', ['knuckle'], 'light', { hp: 60, mp: 10, str: 46, mag: 25, spd: 33, vit: 38 }, 50, 3),
  kiriyu: C('桐生', 'Kiriyu', ['霞之國的武士', 'Samurai of Kasumi'], 'kiriyu', 'iai', ['katana'], 'heavy', { hp: 62, mp: 10, str: 44, mag: 23, spd: 28, vit: 36 }, 48, 3),
  galan:  C('嘉藍', 'Galan', ['荒原的野孩子', 'Wild Child'], 'galan', 'feral', [], 'light', { hp: 56, mp: 15, str: 42, mag: 35, spd: 38, vit: 30 }, 45, 5),
  selene: C('瑟琳娜', 'Selene', ['前帝國將軍', 'Former General'], 'selene', 'runeblade', ['sword', 'rod'], 'heavy', { hp: 50, mp: 22, str: 36, mag: 38, spd: 34, vit: 31 }, 39, 7, { spells: { 1: 'blizzard', 4: 'cure', 9: 'protect', 14: 'blizzara', 20: 'shell', 27: 'haste', 34: 'blizzaga', 42: 'holy' } }),
  regis:  C('雷吉斯', 'Regis', ['飛空艇船長', 'Airship Captain'], 'regis', 'fortune', ['card'], 'light', { hp: 54, mp: 14, str: 38, mag: 30, spd: 35, vit: 32 }, 42, 4),
  nightcrow: C('夜鴉', 'Nightcrow', ['刺客', 'Assassin'], 'nightcrow', 'throw', ['dagger', 'ninja'], 'light', { hp: 52, mp: 14, str: 41, mag: 27, spd: 42, vit: 30 }, 41, 4),
  lili:   C('莉莉', 'Lili', ['小畫家', 'Little Painter'], 'lili', 'sketch', ['brush', 'rod'], 'robe', { hp: 40, mp: 30, str: 24, mag: 44, spd: 33, vit: 24 }, 32, 9),
  bolo:   C('波洛', 'Bolo', ['老魔導師', 'Old Mage'], 'bolo', 'lore', ['rod'], 'robe', { hp: 44, mp: 32, str: 26, mag: 42, spd: 26, vit: 26 }, 34, 9),
  moka:   C('摩卡', 'Moka', ['雪狐族勇士', 'Snow Fox'], 'moka', 'dance', ['spear'], 'light', { hp: 50, mp: 20, str: 36, mag: 36, spd: 36, vit: 30 }, 40, 6),
  uma:    C('烏瑪', 'Uma', ['冰洞的雪人', 'Yeti'], 'uma', 'berserk', [], 'none', { hp: 80, mp: 0, str: 55, mag: 15, spd: 30, vit: 45 }, 62, 0),
  kagami: C('鏡', 'Kagami', ['模仿師', 'Mimic'], 'kagami', 'mimic', [], 'robe', { hp: 50, mp: 20, str: 34, mag: 34, spd: 34, vit: 30 }, 40, 5),
  leopold: C('李奧帕德', 'Leopold', ['帝國將軍', 'Imperial General'], 'leopold', 'command', ['sword'], 'heavy', { hp: 70, mp: 20, str: 50, mag: 32, spd: 34, vit: 42 }, 55, 5),
  // guests: they fight beside you for a while
  hart:   C('哈特', 'Hart', ['帝國兵', 'Imperial Trooper'], 'imperial', 'magitek', ['sword'], 'heavy', { hp: 60, mp: 0, str: 40, mag: 30, spd: 30, vit: 36 }, 30, 0, { guest: true }),
  gale:   C('蓋爾', 'Gale', ['帝國兵', 'Imperial Trooper'], 'imperial', 'magitek', ['sword'], 'heavy', { hp: 60, mp: 0, str: 40, mag: 30, spd: 30, vit: 36 }, 30, 0, { guest: true }),
  owen:   C('歐文', 'Owen', ['黎明軍的領袖', 'Leader of the Dawnline'], 'owen', 'pray', ['rod'], 'robe', { hp: 58, mp: 20, str: 30, mag: 36, spd: 28, vit: 34 }, 42, 5, { guest: true }),
};
export const GUESTS = ['hart', 'gale', 'owen', 'leopold'];
export const CHAR_ORDER = Object.keys(CHARS);
// what each unique command is called, and what it does
export const CMD = {
  astralize: [['幻化', 'Astralize'], ['化為星靈形態：魔法與攻擊大幅提升，持續回復。一場戰鬥一次。', 'Turn Astral: magic and attack soar, with regeneration. Once per battle.']],
  steal: [['竊取', 'Steal'], ['偷取敵人身上的道具。戴上強奪手套會變成「強奪」：攻擊同時偷。', 'Take an item from a foe. With the Mugger\'s Glove it becomes Mug: strike and steal at once.']],
  tools: [['機工', 'Tools'], ['使用買來的機械道具。', 'Use the machines you have bought.']],
  blitz: [['拳技', 'Blitz'], ['選擇拳技，再用方向鍵輸入招式。', 'Choose a blitz, then enter its directions.']],
  iai: [['居合', 'Iai'], ['蓄力的段數越高越強；蓄力中時間會繼續走。', 'The longer the charge, the stronger the cut; time runs while charging.']],
  feral: [['野性', 'Feral'], ['化身為學過的魔物，自動戰鬥。打倒魔物時會學到新的野性。', 'Become a beast you have learned and fight on instinct. Galan learns new ones from the monsters he beats.']],
  runeblade: [['封魔', 'Runeblade'], ['舉劍吸收下一個魔法，轉為自己的 MP。', 'Raise the blade to swallow the next spell cast and turn it into MP.']],
  fortune: [['命運輪', 'Fortune'], ['轉動三個轉輪，按確定鍵停下；對齊圖案就發動效果。', 'Spin three reels and stop each with OK; line up the symbols for an effect.']],
  throw: [['投擲', 'Throw'], ['投出手裡劍、忍術卷軸或武器。', 'Throw stars, ninja scrolls or weapons.']],
  sketch: [['描繪', 'Sketch'], ['畫下一個敵人，畫作會使出那個敵人的招式。', 'Paint a foe; the painting uses that foe\'s moves.']],
  lore: [['青魔', 'Lore'], ['施展從敵人身上學到的招式。只要看過一次就會學會。', 'Cast moves learned from monsters: seeing one once is enough.']],
  dance: [['狐舞', 'Dance'], ['跳出依地形學會的舞，之後會一直跳下去。', 'Dance a dance learned from the land; Moka keeps dancing after that.']],
  berserk: [['狂怒', 'Berserk'], ['烏瑪不聽指揮，自己戰鬥。', 'Uma takes no orders and fights on his own.']],
  mimic: [['模仿', 'Mimic'], ['重現同伴上一個行動，不花 MP。', 'Repeat the last thing an ally did, at no MP cost.']],
  command: [['軍令', 'Command'], ['號令全隊：全員攻擊力提升並發動攻擊。', 'Rally the party: everyone hits harder, then the general charges.']],
  magitek: [['魔導', 'Magitek'], ['魔導甲的光束兵器。', 'The Magitek Armour\'s beam weapons.']],
  pray: [['祈禱', 'Pray'], ['為全隊祈禱，回復 HP。', 'A prayer that heals the party.']],
};
// the beams of the Magitek Armour (the opening chapter)
export const MAGITEK = {
  firebeam: { name: ['火焰光束', 'Fire Beam'], kind: 'dmg', power: 9, target: 'one', el: 'fire' },
  icebeam:  { name: ['冰凍光束', 'Ice Beam'], kind: 'dmg', power: 9, target: 'one', el: 'ice' },
  boltbeam: { name: ['雷光束', 'Bolt Beam'], kind: 'dmg', power: 9, target: 'one', el: 'bolt' },
  heal:     { name: ['治療之力', 'Heal Force'], kind: 'heal', power: 14, target: 'party' },
};

// ---------------------------------------------------------------- magic
// kind: dmg / heal / revive / esuna / status (adds one) / buff (adds to allies) / drain / osmose / gravity (a fraction of HP) / kill / warp
// target: one / all (foes) / ally / party / self. power for dmg and heal; el the element
const SP = (zh, en, mp, kind, power, target, extra = {}) => ({ name: [zh, en], mp, kind, power, target, ...extra });
export const SPELLS = {
  fire:     SP('火焰', 'Fire', 4, 'dmg', 4.2, 'one', { el: 'fire' }),
  fira:     SP('烈焰', 'Fira', 20, 'dmg', 12, 'one', { el: 'fire' }),
  firaga:   SP('煉獄', 'Firaga', 51, 'dmg', 30, 'one', { el: 'fire' }),
  blizzard: SP('冰霜', 'Blizzard', 5, 'dmg', 4.4, 'one', { el: 'ice' }),
  blizzara: SP('冰河', 'Blizzara', 21, 'dmg', 12.5, 'one', { el: 'ice' }),
  blizzaga: SP('絕對零度', 'Blizzaga', 52, 'dmg', 31, 'one', { el: 'ice' }),
  thunder:  SP('雷擊', 'Thunder', 6, 'dmg', 4.6, 'one', { el: 'bolt' }),
  thundara: SP('雷霆', 'Thundara', 22, 'dmg', 13, 'one', { el: 'bolt' }),
  thundaga: SP('天雷', 'Thundaga', 53, 'dmg', 32, 'one', { el: 'bolt' }),
  poison:   SP('毒霧', 'Poison', 3, 'dmg', 3, 'one', { el: 'poison', add: 'poison' }),
  bio:      SP('腐蝕', 'Bio', 26, 'dmg', 16, 'one', { el: 'poison', add: 'poison' }),
  aero:     SP('旋風', 'Aero', 18, 'dmg', 7, 'all', { el: 'wind' }),
  quake:    SP('大地震', 'Quake', 50, 'dmg', 24, 'all', { el: 'earth' }),
  flood:    SP('海嘯', 'Flood', 48, 'dmg', 22, 'all', { el: 'water' }),
  meteor:   SP('星落', 'Meteor', 62, 'dmg', 30, 'all'),
  flare:    SP('核爆', 'Flare', 45, 'dmg', 38, 'one', { pierce: true }),
  ultima:   SP('終焉', 'Ultima', 80, 'dmg', 52, 'all', { pierce: true }),
  holy:     SP('神聖', 'Holy', 40, 'dmg', 33, 'one', { el: 'holy' }),
  drain:    SP('吸收', 'Drain', 15, 'drain', 9, 'one'),
  osmose:   SP('吸魔', 'Osmose', 1, 'osmose', 2.2, 'one'),
  demi:     SP('重力', 'Demi', 33, 'gravity', 0.25, 'one'),
  graviga:  SP('黑洞', 'Graviga', 48, 'gravity', 0.5, 'all'),
  doom:     SP('死之宣告', 'Death', 35, 'kill', 0.7, 'one'),
  cure:     SP('治癒', 'Cure', 5, 'heal', 5.5, 'ally'),
  cura:     SP('大治癒', 'Cura', 25, 'heal', 18, 'ally'),
  curaga:   SP('完全治癒', 'Curaga', 40, 'heal', 36, 'ally'),
  cureAll:  SP('治癒之雨', 'Healing Rain', 30, 'heal', 14, 'party'),
  raise:    SP('復甦', 'Raise', 30, 'revive', 0.25, 'ally'),
  arise:    SP('完全復甦', 'Arise', 60, 'revive', 1, 'ally'),
  antidote: SP('解毒', 'Purify', 3, 'esuna', 0, 'ally', { only: ['poison'] }),
  esuna:    SP('淨化', 'Esuna', 15, 'esuna', 0, 'ally'),
  regen:    SP('再生', 'Regen', 10, 'buff', 0, 'ally', { add: 'regen' }),
  protect:  SP('護盾', 'Protect', 10, 'buff', 0, 'ally', { add: 'protect' }),
  shell:    SP('魔障', 'Shell', 10, 'buff', 0, 'ally', { add: 'shell' }),
  haste:    SP('加速', 'Haste', 10, 'buff', 0, 'ally', { add: 'haste' }),
  hasteAll: SP('全體加速', 'Haste All', 38, 'buff', 0, 'party', { add: 'haste' }),
  slow:     SP('減速', 'Slow', 5, 'status', 0.8, 'one', { add: 'slow' }),
  stop:     SP('停止', 'Stop', 10, 'status', 0.6, 'one', { add: 'stop' }),
  sleep:    SP('沉睡', 'Sleep', 5, 'status', 0.75, 'one', { add: 'sleep' }),
  silence:  SP('沉默', 'Silence', 8, 'status', 0.75, 'one', { add: 'silence' }),
  blind:    SP('黑暗', 'Blind', 4, 'status', 0.8, 'one', { add: 'blind' }),
  warp:     SP('瞬移', 'Warp', 20, 'warp', 0, 'self'),
};

// ---------------------------------------------------------------- Astrals: summon once per battle; teach spells as they gain AP; a level-up bonus
// teach: { spell: rate } — rate × AP earned = % learned. bonus: what a level gained while equipped adds
const AS = (zh, en, look, summon, teach, bonus, story) => ({ name: [zh, en], look, summon, teach, bonus, story });
export const ASTRALS = {
  ramus:    AS('萊姆斯', 'Ramus', ['#ffe060', '#5a6ac8'], { name: ['審判之雷', 'Judgement Bolt'], mp: 25, kind: 'dmg', power: 16, target: 'all', el: 'bolt' }, { thunder: 10, poison: 5, thundara: 2 }, { vit: 1 }, ['雨城頂端的老星靈。看著艾莉雅長大的人之一。', 'The old Astral atop Rainhold, who watched over Aria as a child.']),
  kirisa:   AS('綺霜', 'Kirisa', ['#bfe8ff', '#4a8ad8'], { name: ['鑽石星塵', 'Diamond Dust'], mp: 27, kind: 'dmg', power: 17, target: 'all', el: 'ice' }, { blizzard: 10, cure: 4 }, {}, ['被冰封在研究所的冰之少女。', 'The ice maiden frozen in the Arcanum.']),
  ifrion:   AS('伊芙利翁', 'Ifrion', ['#ff6a30', '#5a1a10'], { name: ['地獄之焰', 'Hellfire'], mp: 26, kind: 'dmg', power: 17, target: 'all', el: 'fire' }, { fire: 10, drain: 1 }, { str: 1 }, ['和綺霜互相看不順眼的炎魔。', 'A flame fiend who never got along with Kirisa.']),
  sylph:    AS('希兒芙', 'Sylphie', ['#a0ffb0', '#3a8a5a'], { name: ['輕風', 'Whispering Wind'], mp: 30, kind: 'drain', power: 10, target: 'all' }, { cure: 10, regen: 5, aero: 2 }, { spd: 1 }, ['愛惡作劇的風之精靈。', 'A mischievous spirit of the wind.']),
  golem:    AS('磐岩', 'Banrock', ['#c8a070', '#5a4030'], { name: ['大地之壁', 'Earth Wall'], mp: 33, kind: 'buff', add: 'protect', target: 'party' }, { protect: 10, shell: 5 }, { vit: 2 }, ['守護山脈千年的岩之巨人。', 'A giant of stone who guarded the mountains for a thousand years.']),
  unicorn:  AS('獨角獸', 'Unicorn', ['#ffffff', '#c8a0ff'], { name: ['淨化之角', 'Healing Horn'], mp: 30, kind: 'esuna', target: 'party' }, { esuna: 8, cura: 4, antidote: 10 }, { mp: 0.1 }, ['只對心靈純淨的人顯現。', 'Shows itself only to the pure of heart.']),
  carbuncle: AS('卡邦', 'Carbon', ['#40d0a0', '#ff4060'], { name: ['紅寶石之光', 'Ruby Light'], mp: 36, kind: 'buff', add: 'shell', target: 'party' }, { shell: 10, haste: 3, slow: 6 }, {}, ['額頭上有紅寶石的小星靈。', 'A little Astral with a ruby on its brow.']),
  leviath:  AS('利維安', 'Leviath', ['#3a8ad8', '#c0f0ff'], { name: ['大海嘯', 'Tidal Wave'], mp: 39, kind: 'dmg', power: 22, target: 'all', el: 'water' }, { flood: 1, blizzara: 3 }, { hp: 0.1 }, ['在海底洞窟沉睡的海龍。', 'A sea dragon asleep in the Serpent Trench.']),
  phantom:  AS('幻影', 'Phantom', ['#a0a0c8', '#3a3a5a'], { name: ['消失', 'Vanish'], mp: 38, kind: 'buff', add: 'haste', target: 'party' }, { blind: 5, sleep: 5, stop: 2 }, {}, ['冥河渡船上的一縷亡魂。', 'A lost soul from the Ferry of the Departed.']),
  maduin:   AS('瑪杜因', 'Maduin', ['#ff80c0', '#3a2a5a'], { name: ['混沌波動', 'Chaos Wave'], mp: 33, kind: 'dmg', power: 19, target: 'all' }, { fira: 3, blizzara: 3, thundara: 3 }, { mag: 1 }, ['艾莉雅的父親。', 'Aria\'s father.']),
  valion:   AS('瓦里昂', 'Valion', ['#e0f0ff', '#8a9ab8'], { name: ['冰霜咆哮', 'Frost Roar'], mp: 45, kind: 'dmg', power: 25, target: 'all', el: 'ice' }, { firaga: 1, blizzaga: 1, thundaga: 1 }, { mag: 2 }, ['冰封在霜石鎮礦坑裡的古老星靈。一切的開始。', 'The ancient Astral frozen in Frostvale\'s mine, where everything began.']),
  shoat:    AS('石眼', 'Gorgon', ['#8a7a6a', '#40ff40'], { name: ['石化之眼', 'Petrifying Eye'], mp: 35, kind: 'status', add: 'stop', power: 0.7, target: 'all' }, { bio: 8, stop: 5 }, {}, ['目光能把東西變成石頭的魔物。', 'A creature whose gaze turns things to stone.']),
  quetza:   AS('羽蛇', 'Quetza', ['#40c080', '#ffd040'], { name: ['雷光羽翼', 'Thunder Wing'], mp: 40, kind: 'dmg', power: 24, target: 'all', el: 'bolt' }, { thundara: 5, haste: 5 }, { spd: 2 }, ['在天空盤旋的羽蛇。', 'A feathered serpent of the high winds.']),
  starlet:  AS('星露', 'Starlet', ['#ffd0e0', '#ff80a0'], { name: ['星之吻', 'Cosmic Kiss'], mp: 45, kind: 'heal', power: 40, target: 'party' }, { curaga: 2, cureAll: 3, regen: 10 }, { hp: 0.1 }, ['把愛分給每一個人的星靈。', 'An Astral who shares her love with everyone.']),
  fenrir:   AS('芬里爾', 'Fenrir', ['#a0a8c0', '#2a2a3a'], { name: ['月下幻影', 'Moon Phantom'], mp: 46, kind: 'buff', add: 'regen', target: 'party' }, { warp: 10, stop: 3 }, { hp: 0.1 }, ['在月光下奔跑的大狼。', 'The great wolf who runs beneath the moon.']),
  terrato:  AS('泰拉托', 'Terrato', ['#a07a3a', '#4a3a20'], { name: ['地殼崩裂', 'Earth Aura'], mp: 52, kind: 'dmg', power: 28, target: 'all', el: 'earth' }, { quake: 3, graviga: 1 }, { hp: 0.3 }, ['大地之王。只在世界崩壞之後醒來。', 'The lord of the earth, who woke only when the world broke.']),
  alexis:   AS('亞歷克斯', 'Alexis', ['#f0f0ff', '#a0a8d0'], { name: ['神聖審判', 'Divine Justice'], mp: 76, kind: 'dmg', power: 36, target: 'all', el: 'holy' }, { holy: 2, esuna: 10, arise: 1 }, {}, ['化為城堡的聖騎士星靈。', 'A holy knight Astral who became a castle.']),
  phoenix:  AS('不死鳥', 'Phoenix', ['#ff8030', '#ffe060'], { name: ['重生之火', 'Rebirth Flame'], mp: 70, kind: 'revive', power: 1, target: 'party' }, { arise: 2, raise: 10, curaga: 2 }, {}, ['洛恩追尋的傳說星晶。', 'The legendary Astral Rowan has been searching for.']),
  bahamut:  AS('巴哈姆特', 'Bahamut', ['#4a4a6a', '#ff4040'], { name: ['億萬火焰', 'Mega Flare'], mp: 86, kind: 'dmg', power: 42, target: 'all', pierce: true }, { flare: 2 }, { hp: 0.5 }, ['龍之王。打倒八龍的證明。', 'The king of dragons, won by besting the Eight.']),
  raiden:   AS('雷電', 'Raiden', ['#c0c0ff', '#2a2a5a'], { name: ['斬鐵劍', 'Zantetsuken'], mp: 80, kind: 'kill', power: 0.6, target: 'all' }, { quick: 1 }, { str: 2 }, ['只為武士顯現的雷神。', 'The thunder god who answers only a true warrior.']),
  ragnarok: AS('諸神黃昏', 'Ragnarok', ['#8a1a2a', '#ffd040'], { name: ['黃昏之劍', 'Twilight Blade'], mp: 70, kind: 'dmg', power: 34, target: 'one', pierce: true }, { ultima: 1 }, { str: 1 }, ['化為一把劍的星靈。', 'An Astral who became a sword.']),
  crusader: AS('十字軍', 'Crusader', ['#ff4040', '#2a2a2a'], { name: ['終末之刻', 'End of Days'], mp: 88, kind: 'dmg', power: 40, target: 'all' }, { meteor: 1, ultima: 1 }, { mp: 0.5 }, ['審判之塔的守護者之一。', 'One of the guardians of the Spire.']),
  zona:     AS('宙納', 'Zona', ['#c040ff', '#2a0a3a'], { name: ['重力深淵', 'Abyss'], mp: 44, kind: 'gravity', power: 0.4, target: 'all' }, { demi: 5, osmose: 8 }, {}, ['在研究所裡被當成實驗品的小星靈。', 'A small Astral the Arcanum used for experiments.']),
  odin:     AS('奧丁', 'Odin', ['#8a8aa0', '#ffd040'], { name: ['永恆之槍', 'Gungnir'], mp: 60, kind: 'dmg', power: 30, target: 'all' }, { meteor: 1, doom: 2 }, { spd: 1 }, ['古城地下沉睡的騎士王。', 'A knight-king asleep beneath an old castle.']),
};
export const ASTRAL_ORDER = Object.keys(ASTRALS);
SPELLS.quick = SP('時空疾走', 'Quick', 99, 'buff', 0, 'self', { add: 'haste' });

// ---------------------------------------------------------------- the unique command tables
// Sai's blitzes: the directions to press (u d l r), learned by level
export const BLITZ = [
  { id: 'flurry',  lv: 1,  name: ['連環拳', 'Flurry'], keys: 'lrl', kind: 'hits', power: 1.1, hits: 3 },
  { id: 'chiwave', lv: 6,  name: ['氣功波', 'Chi Wave'], keys: 'dld', kind: 'dmg', power: 8, target: 'one', el: 'holy' },
  { id: 'gale',    lv: 11, name: ['疾風腳', 'Gale Kick'], keys: 'udud', kind: 'dmg', power: 7, target: 'all', el: 'wind' },
  { id: 'ironbody',lv: 16, name: ['金剛身', 'Iron Body'], keys: 'dduu', kind: 'heal', power: 12, target: 'party' },
  { id: 'quake',   lv: 23, name: ['震天掌', 'Quake Palm'], keys: 'lurdl', kind: 'dmg', power: 16, target: 'all', el: 'earth' },
  { id: 'phoenix', lv: 31, name: ['鳳凰拳', 'Phoenix Fist'], keys: 'rdlurd', kind: 'revive', power: 0.5, target: 'party' },
  { id: 'soulfire',lv: 40, name: ['魂炎爆', 'Soul Flare'], keys: 'uldruld', kind: 'dmg', power: 30, target: 'one', el: 'fire', pierce: true },
  { id: 'heaven',  lv: 52, name: ['天地無雙', 'Heaven Strike'], keys: 'lrlrudud', kind: 'hits', power: 2.4, hits: 6 },
];
// Kiriyu's iai: the charge level, learned by level; each level takes another 1.5 s of charging
export const IAI = [
  { lv: 1,  name: ['一閃', 'Flash'], kind: 'hits', power: 2.2, hits: 1 },
  { lv: 8,  name: ['迅', 'Swift'], kind: 'hits', power: 1.2, hits: 2 },
  { lv: 14, name: ['斬鐵', 'Ironcut'], kind: 'hits', power: 2.8, hits: 1, pierce: true },
  { lv: 20, name: ['疾風四連', 'Fourfold'], kind: 'hits', power: 1.3, hits: 4 },
  { lv: 27, name: ['心之刃', 'Heartblade'], kind: 'heal', power: 14, target: 'party' },
  { lv: 34, name: ['月影', 'Moonshade'], kind: 'status', add: 'stop', power: 0.8, target: 'all' },
  { lv: 42, name: ['嵐', 'Tempest'], kind: 'dmg', power: 26, target: 'all', el: 'wind' },
  { lv: 50, name: ['終之太刀', 'Final Blade'], kind: 'kill', power: 0.9, target: 'all' },
];
// Edmund's tools: bought in shops, used as often as he likes
export const TOOLS = {
  autocross: { name: ['連弩', 'Autocrossbow'], kind: 'dmg', power: 6, target: 'all', price: 250, tier: 1 },
  drill:     { name: ['鑽頭', 'Drill'], kind: 'dmg', power: 12, target: 'one', pierce: true, price: 3000, tier: 3 },
  flamer:    { name: ['噴火器', 'Flamethrower'], kind: 'dmg', power: 11, target: 'all', el: 'fire', price: 1800, tier: 2 },
  noise:     { name: ['催眠音叉', 'Noisemaker'], kind: 'status', add: 'sleep', power: 0.7, target: 'all', price: 1200, tier: 2 },
  bioblast:  { name: ['毒霧噴射', 'Bio Blaster'], kind: 'dmg', power: 8, target: 'all', el: 'poison', add: 'poison', price: 1500, tier: 2 },
  debil:     { name: ['弱點鏡', 'Weakfinder'], kind: 'weak', target: 'one', price: 2500, tier: 3 },
  chainsaw:  { name: ['鏈鋸', 'Chainsaw'], kind: 'kill', power: 0.3, target: 'one', fallback: 14, price: 6000, tier: 4 },
  airanchor: { name: ['空氣錨', 'Air Anchor'], kind: 'dmg', power: 30, target: 'one', price: 9000, tier: 5 },
};
// Regis's reels: what three of a kind (or two) does
export const REELS = ['star', 'sword', 'heart', 'shield', 'skull', 'coin'];
export const REEL_ICON = { star: '★', sword: '⚔', heart: '♥', shield: '◆', skull: '☠', coin: '$' };
export const FORTUNE = {
  star:   { name: ['七彩星爆', 'Starburst'], kind: 'dmg', power: 40, target: 'all', pierce: true },
  sword:  { name: ['千劍', 'Thousand Swords'], kind: 'hits', power: 1.4, hits: 8 },
  heart:  { name: ['命運之愛', 'Lucky Heart'], kind: 'heal', power: 99, target: 'party' },
  shield: { name: ['女神之盾', 'Goddess Shield'], kind: 'buff', add: 'protect', also: 'shell', target: 'party' },
  skull:  { name: ['命運反噬', 'Ill Fate'], kind: 'kill', power: 0.95, target: 'all' },
  coin:   { name: ['一擲千金', 'Gold Rain'], kind: 'gil', power: 1, target: 'all' },
  pair:   { name: ['小勝', 'Small Win'], kind: 'dmg', power: 9, target: 'one' },
  none:   { name: ['擲骰', 'Dice'], kind: 'dice', target: 'one' },
};
// Moka's dances: one per kind of ground, learned by fighting there with Moka; each has four steps chosen at random
export const DANCES = {
  field:  { name: ['草原之舞', 'Meadow Waltz'], steps: [['春風', 'Spring Breeze', 'heal', 10, 'party'], ['風之刃', 'Wind Slash', 'dmg', 9, 'all', 'wind'], ['花吹雪', 'Petal Storm', 'dmg', 12, 'all', 'wind'], ['陽光', 'Sunshine', 'esuna', 0, 'party']] },
  forest: { name: ['森林之舞', 'Forest Suite'], steps: [['樹精之吻', 'Dryad Kiss', 'heal', 12, 'party'], ['藤蔓', 'Vines', 'status', 0.6, 'all', null, 'slow'], ['毒蘑菇', 'Toadstool', 'dmg', 10, 'all', 'poison'], ['森之歌', 'Forest Song', 'buff', 0, 'party', null, 'regen']] },
  desert: { name: ['沙漠之舞', 'Desert Aria'], steps: [['沙暴', 'Sandstorm', 'dmg', 11, 'all', 'wind'], ['海市蜃樓', 'Mirage', 'status', 0.6, 'all', null, 'blind'], ['仙人掌刺', 'Cactus Sting', 'dmg', 14, 'one'], ['地鳴', 'Rumble', 'dmg', 12, 'all', 'earth']] },
  snow:   { name: ['雪原之舞', 'Snowman Jazz'], steps: [['雪崩', 'Avalanche', 'dmg', 13, 'all', 'ice'], ['冰之息', 'Frost Breath', 'dmg', 11, 'all', 'ice'], ['雪之子守歌', 'Snow Lullaby', 'status', 0.6, 'all', null, 'sleep'], ['暖爐', 'Hearth', 'heal', 11, 'party']] },
  cave:   { name: ['洞窟之舞', 'Cave Polka'], steps: [['落石', 'Rockfall', 'dmg', 12, 'all', 'earth'], ['蝙蝠群', 'Bat Swarm', 'drain', 8, 'all'], ['黑暗', 'Darkness', 'status', 0.7, 'all', null, 'blind'], ['鐘乳石', 'Stalactite', 'dmg', 15, 'one']] },
  water:  { name: ['水邊之舞', 'Water Rondo'], steps: [['浪花', 'Spray', 'dmg', 11, 'all', 'water'], ['漩渦', 'Whirlpool', 'dmg', 13, 'all', 'water'], ['清流', 'Clear Stream', 'heal', 12, 'party'], ['水之膜', 'Bubble', 'buff', 0, 'party', null, 'shell']] },
  ruin:   { name: ['廢墟之舞', 'Ruin Requiem'], steps: [['塵埃', 'Dust', 'status', 0.6, 'all', null, 'blind'], ['崩落', 'Collapse', 'dmg', 16, 'all', 'earth'], ['亡魂之歌', 'Wraith Song', 'drain', 10, 'all'], ['希望', 'Hope', 'heal', 16, 'party']] },
  castle: { name: ['城堡之舞', 'Castle Minuet'], steps: [['騎士之禮', 'Knight\'s Bow', 'buff', 0, 'party', null, 'protect'], ['劍之舞', 'Sword Dance', 'dmg', 14, 'one'], ['燭火', 'Candlelight', 'dmg', 11, 'all', 'fire'], ['宮廷之歌', 'Court Song', 'heal', 13, 'party']] },
};
// Bolo's lores: monsters use these; seeing one teaches it (MP cost when Bolo casts it)
export const LORES = {
  aquabreath: { name: ['水之吐息', 'Aqua Breath'], mp: 22, kind: 'dmg', power: 13, target: 'all', el: 'water' },
  condemn:    { name: ['末日宣告', 'Condemn'], mp: 20, kind: 'kill', power: 0.5, target: 'one' },
  roulette:   { name: ['命運輪盤', 'Roulette'], mp: 10, kind: 'kill', power: 1, target: 'random' },
  whitewind:  { name: ['白色之風', 'White Wind'], mp: 28, kind: 'healhp', target: 'party' },
  stonegaze:  { name: ['石化視線', 'Stone Gaze'], mp: 15, kind: 'status', add: 'stop', power: 0.7, target: 'one' },
  revenge:    { name: ['復仇', 'Revenge'], mp: 31, kind: 'revenge', target: 'one' },
  pepup:      { name: ['捨身', 'Pep Up'], mp: 25, kind: 'pepup', target: 'ally' },
  bigguard:   { name: ['大防禦', 'Big Guard'], mp: 50, kind: 'buff', add: 'protect', also: 'shell', target: 'party' },
  forcefield: { name: ['力場', 'Force Field'], mp: 24, kind: 'buff', add: 'regen', target: 'party' },
  quasar:     { name: ['類星體', 'Quasar'], mp: 50, kind: 'dmg', power: 26, target: 'all' },
  grandtrain: { name: ['大列車', 'Grand Train'], mp: 64, kind: 'dmg', power: 34, target: 'all', pierce: true },
  exploder:   { name: ['自爆', 'Exploder'], mp: 1, kind: 'exploder', target: 'one' },
  goblinpunch:{ name: ['哥布林拳', 'Goblin Punch'], mp: 2, kind: 'dmg', power: 6, target: 'one' },
  mightyguard:{ name: ['堅守', 'Mighty Guard'], mp: 40, kind: 'buff', add: 'shell', target: 'party' },
};

// ---------------------------------------------------------------- items
// use: heal (HP) / mp / both / full / revive / cure (statuses) / tent / warp / smoke; throw: power for Nightcrow's Throw
export const ITEMS = {
  potion:    { name: ['藥水', 'Potion'], use: 'heal', amt: 120, price: 50, target: 'ally' },
  hipotion:  { name: ['高級藥水', 'Hi-Potion'], use: 'heal', amt: 600, price: 300, target: 'ally' },
  xpotion:   { name: ['全效藥水', 'X-Potion'], use: 'heal', amt: 9999, price: 1500, target: 'ally' },
  ether:     { name: ['乙太', 'Ether'], use: 'mp', amt: 60, price: 800, target: 'ally' },
  turbo:     { name: ['高級乙太', 'Turbo Ether'], use: 'mp', amt: 200, price: 3000, target: 'ally' },
  elixir:    { name: ['靈藥', 'Elixir'], use: 'full', price: 0, target: 'ally' },
  megalixir: { name: ['萬能靈藥', 'Megalixir'], use: 'full', price: 0, target: 'party' },
  phoenix:   { name: ['鳳凰之尾', 'Phoenix Down'], use: 'revive', amt: 0.25, price: 500, target: 'dead' },
  antidote:  { name: ['解毒劑', 'Antidote'], use: 'cure', st: ['poison'], price: 30, target: 'ally' },
  eyedrop:   { name: ['眼藥水', 'Eyedrops'], use: 'cure', st: ['blind'], price: 30, target: 'ally' },
  echo:      { name: ['回聲草', 'Echo Herb'], use: 'cure', st: ['silence'], price: 120, target: 'ally' },
  remedy:    { name: ['萬能藥', 'Remedy'], use: 'cure', st: BAD, price: 1000, target: 'ally' },
  tent:      { name: ['帳篷', 'Tent'], use: 'tent', price: 1200, field: true },
  warpstone: { name: ['傳送石', 'Warp Stone'], use: 'warp', price: 700 },
  smoke:     { name: ['煙霧彈', 'Smoke Bomb'], use: 'smoke', price: 300 },
  shuriken:  { name: ['手裡劍', 'Shuriken'], throw: 30, price: 30 },
  fuma:      { name: ['風魔手裡劍', 'Fuma Shuriken'], throw: 70, price: 500 },
  firescroll:{ name: ['火遁卷軸', 'Fire Scroll'], throw: 9, el: 'fire', all: true, price: 500 },
  waterscroll:{ name: ['水遁卷軸', 'Water Scroll'], throw: 9, el: 'water', all: true, price: 500 },
  boltscroll:{ name: ['雷遁卷軸', 'Bolt Scroll'], throw: 9, el: 'bolt', all: true, price: 500 },
  gem:       { name: ['星之碎片', 'Star Fragment'], price: 0, sell: 2000 },
  meat:      { name: ['乾肉', 'Dried Meat'], use: 'heal', amt: 200, price: 150, target: 'ally' },
  bandana:   { name: ['洛恩的頭巾', 'Rowan\'s Bandana'], key: true, price: 0 },
  coin:      { name: ['兩面都是正面的硬幣', 'Two-Headed Coin'], key: true, price: 0 },
  letter:    { name: ['預告信', 'The Ransom Note'], key: true, price: 0 },
};
export const BATTLE_ITEMS = ['potion', 'hipotion', 'xpotion', 'ether', 'turbo', 'elixir', 'megalixir', 'phoenix', 'antidote', 'eyedrop', 'echo', 'remedy', 'smoke'];

// ---------------------------------------------------------------- equipment
// slot: weapon / shield / helm / armor / relic. kind: what can wear it (weapon kinds; light / heavy / robe for armour)
// power (weapons), def + mdef (armour), stats (st ma sp vi), el (element of the blow), fx (a special power), tier (1-8: when shops sell it)
const W = (zh, en, kind, power, price, tier, extra = {}) => ({ name: [zh, en], slot: 'weapon', kind, power, price, tier, ...extra });
const A = (zh, en, slot, kind, def, mdef, price, tier, extra = {}) => ({ name: [zh, en], slot, kind, def, mdef, price, tier, ...extra });
const R = (zh, en, fx, price, tier, extra = {}) => ({ name: [zh, en], slot: 'relic', fx, price, tier, ...extra });
export const GEAR = {
  // swords
  dirk:      W('短刀', 'Dirk', 'dagger', 12, 150, 1),
  mithrilknife: W('秘銀匕首', 'Mithril Knife', 'dagger', 30, 300, 2),
  guardian:  W('守護短劍', 'Guardian', 'dagger', 59, 1200, 4, { fx: 'guard' }),
  airlancet: W('風之刃', 'Air Lancet', 'dagger', 76, 3000, 5, { el: 'wind' }),
  swordbreaker: W('斷劍', 'Swordbreaker', 'dagger', 109, 8000, 7),
  valiance:  W('勇者之刃', 'Valiance', 'dagger', 150, 0, 8),
  broadsword:W('長劍', 'Broadsword', 'sword', 18, 200, 1),
  mithrilblade: W('秘銀劍', 'Mithril Blade', 'sword', 38, 450, 2),
  regal:     W('王者之劍', 'Regal Cutlass', 'sword', 54, 800, 3),
  rune:      W('符文劍', 'Runeblade', 'sword', 65, 1500, 4, { st: { ma: 2 } }),
  flametongue: W('火炎劍', 'Flametongue', 'sword', 108, 7000, 5, { el: 'fire' }),
  icebrand:  W('冰河劍', 'Icebrand', 'sword', 108, 7000, 5, { el: 'ice' }),
  thunderblade: W('雷神劍', 'Thunder Blade', 'sword', 108, 7000, 5, { el: 'bolt' }),
  crystalsword: W('水晶劍', 'Crystal Sword', 'sword', 167, 15000, 6),
  enhancer:  W('強化之劍', 'Enhancer', 'sword', 135, 10000, 6, { st: { ma: 7 } }),
  atma:      W('灰燼之劍', 'Ash Requiem', 'sword', 225, 0, 8, { fx: 'hpblade' }),
  lightbringer: W('光之劍', 'Lightbringer', 'sword', 255, 0, 8, { el: 'holy' }),
  // spears
  javelin:   W('標槍', 'Javelin', 'spear', 20, 250, 1),
  mithrilpike: W('秘銀長槍', 'Mithril Pike', 'spear', 50, 800, 2),
  trident:   W('三叉戟', 'Trident', 'spear', 93, 1700, 4, { el: 'water' }),
  stoutspear:W('剛之槍', 'Stout Spear', 'spear', 112, 5000, 5),
  partisan:  W('戰戟', 'Partisan', 'spear', 150, 13000, 6),
  holylance: W('聖槍', 'Holy Lance', 'spear', 194, 0, 7, { el: 'holy' }),
  dragonhorn:W('龍角槍', 'Dragon Horn', 'spear', 231, 0, 8),
  // knuckles
  metalknuckle: W('鐵拳套', 'Metal Knuckle', 'knuckle', 18, 150, 1),
  mithrilclaw: W('秘銀爪', 'Mithril Claw', 'knuckle', 41, 800, 2),
  kaiser:    W('皇帝拳套', 'Kaiser Knuckles', 'knuckle', 83, 1000, 4),
  poisonclaw:W('毒爪', 'Poison Claw', 'knuckle', 95, 2500, 5, { el: 'poison' }),
  firefang:  W('火之牙', 'Fire Fang', 'knuckle', 112, 5000, 5, { el: 'fire' }),
  dragonclaw:W('龍爪', 'Dragon Claw', 'knuckle', 188, 0, 7),
  tigerfang: W('虎牙', 'Tiger Fang', 'knuckle', 215, 0, 8),
  // katanas
  ashura:    W('阿修羅', 'Ashura', 'katana', 57, 1500, 1),
  kotetsu:   W('虎徹', 'Kotetsu', 'katana', 66, 800, 2),
  forged:    W('鍛刀', 'Forged', 'katana', 76, 1200, 3),
  tempest:   W('嵐', 'Tempest', 'katana', 101, 3000, 4, { el: 'wind' }),
  murasame:  W('村雨', 'Murasame', 'katana', 110, 6000, 5),
  aura:      W('氣刃', 'Aura', 'katana', 162, 12000, 6),
  strato:    W('天叢雲', 'Strato', 'katana', 199, 0, 7),
  masamune2: W('正宗', 'Masamune', 'katana', 230, 0, 8),
  // rods and brushes
  rod:       W('魔杖', 'Rod', 'rod', 30, 300, 1, { st: { ma: 1 } }),
  firerod:   W('火炎之杖', 'Flame Rod', 'rod', 79, 3000, 3, { el: 'fire', st: { ma: 2 } }),
  icerod:    W('冰之杖', 'Ice Rod', 'rod', 79, 3000, 3, { el: 'ice', st: { ma: 2 } }),
  thunderrod:W('雷之杖', 'Thunder Rod', 'rod', 79, 3000, 3, { el: 'bolt', st: { ma: 2 } }),
  gravityrod:W('重力之杖', 'Gravity Rod', 'rod', 120, 13000, 6, { st: { ma: 4 } }),
  punisher:  W('懲戒之杖', 'Punisher', 'rod', 150, 0, 7, { st: { ma: 6 } }),
  magusrod:  W('賢者之杖', 'Magus Rod', 'rod', 168, 0, 8, { st: { ma: 9 } }),
  brush:     W('畫筆', 'Brush', 'brush', 40, 1500, 2, { st: { ma: 1 } }),
  chocobrush:W('羽毛筆', 'Feather Brush', 'brush', 60, 3000, 4, { st: { ma: 2 } }),
  rainbowbrush: W('彩虹筆', 'Rainbow Brush', 'brush', 103, 9000, 6, { st: { ma: 4 } }),
  davincibrush: W('名匠之筆', 'Maestro Brush', 'brush', 160, 0, 8, { st: { ma: 7 } }),
  // cards and ninja blades
  cards:     W('紙牌', 'Cards', 'card', 30, 1000, 2),
  darts:     W('飛鏢', 'Darts', 'card', 49, 2500, 4),
  doomdarts: W('死神飛鏢', 'Doom Darts', 'card', 70, 6000, 5),
  trumps:    W('王牌', 'Trump Cards', 'card', 112, 12000, 6),
  dice:      W('骰子', 'Dice', 'card', 1, 5000, 5, { fx: 'dice' }),
  fixeddice: W('灌鉛骰子', 'Fixed Dice', 'card', 1, 0, 8, { fx: 'dice2' }),
  kunai:     W('苦無', 'Kunai', 'ninja', 81, 1800, 3),
  kodachi:   W('小太刀', 'Kodachi', 'ninja', 93, 3200, 4),
  sakura:    W('櫻花刃', 'Blossom', 'ninja', 112, 7000, 5),
  hayate:    W('疾風', 'Hayate', 'ninja', 132, 10000, 6),
  sasuke:    W('佐助之刃', 'Sasuke', 'ninja', 164, 0, 7),
  // shields
  buckler:   A('圓盾', 'Buckler', 'shield', 'light', 16, 10, 200, 1),
  heavyshield: A('重盾', 'Heavy Shield', 'shield', 'heavy', 22, 14, 400, 2),
  mithrilshield: A('秘銀盾', 'Mithril Shield', 'shield', 'light', 27, 18, 1200, 3),
  goldshield:A('黃金盾', 'Gold Shield', 'shield', 'heavy', 34, 23, 2500, 4),
  aegis:     A('神盾', 'Aegis', 'shield', 'heavy', 46, 52, 7000, 6),
  diamondshield: A('鑽石盾', 'Diamond Shield', 'shield', 'light', 40, 39, 3500, 5),
  flameshield: A('火焰盾', 'Flame Shield', 'shield', 'heavy', 41, 28, 0, 6, { res: ['fire'] }),
  iceshield: A('冰之盾', 'Ice Shield', 'shield', 'heavy', 42, 28, 0, 6, { res: ['ice'] }),
  crystalshield: A('水晶盾', 'Crystal Shield', 'shield', 'light', 50, 34, 7000, 7),
  genjishield: A('源氏之盾', 'Genji Shield', 'shield', 'heavy', 54, 40, 0, 7),
  paladinshield: A('聖騎士之盾', 'Paladin Shield', 'shield', 'heavy', 59, 59, 0, 8, { res: ['fire', 'ice', 'bolt', 'wind', 'earth', 'water', 'poison'] }),
  // helmets and hats
  leatherhat:A('皮帽', 'Leather Hat', 'helm', 'robe', 11, 7, 50, 1),
  hairband:  A('髮帶', 'Hair Band', 'helm', 'robe', 12, 9, 150, 1),
  plumedhat: A('羽毛帽', 'Plumed Hat', 'helm', 'robe', 14, 12, 250, 2),
  ironhelm:  A('鐵盔', 'Iron Helmet', 'helm', 'heavy', 18, 13, 1000, 2),
  bandana:   A('頭巾', 'Bandana', 'helm', 'light', 16, 12, 800, 2),
  magushat:  A('魔導帽', 'Magus Hat', 'helm', 'robe', 15, 19, 600, 3, { st: { ma: 2 } }),
  bards:     A('吟遊詩人之帽', 'Bard\'s Hat', 'helm', 'robe', 19, 21, 3000, 4),
  greenberet:A('綠色貝雷帽', 'Green Beret', 'helm', 'light', 23, 21, 3000, 4),
  mithrilhelm: A('秘銀頭盔', 'Mithril Helm', 'helm', 'heavy', 24, 16, 2000, 4),
  tiara:     A('頭冠', 'Tiara', 'helm', 'robe', 22, 30, 3000, 5),
  goldhelm:  A('黃金頭盔', 'Gold Helmet', 'helm', 'heavy', 29, 19, 4000, 5),
  crystalhelm: A('水晶頭盔', 'Crystal Helm', 'helm', 'heavy', 36, 33, 10000, 6),
  circlet:   A('星之冠', 'Circlet', 'helm', 'robe', 30, 40, 7000, 6, { st: { ma: 3 } }),
  genjihelm: A('源氏之盔', 'Genji Helmet', 'helm', 'heavy', 40, 37, 0, 7),
  redcap:    A('紅帽子', 'Red Cap', 'helm', 'light', 30, 26, 0, 7, { st: { st: 3, sp: 2 } }),
  regalcrown:A('王者之冠', 'Regal Crown', 'helm', 'heavy', 44, 44, 0, 8, { st: { st: 3, ma: 3, sp: 3, vi: 3 } }),
  // armour
  leatherarmor: A('皮甲', 'Leather Armour', 'armor', 'light', 28, 19, 150, 1),
  cottonrobe:A('棉布長袍', 'Cotton Robe', 'armor', 'robe', 25, 21, 200, 1),
  ironarmor: A('鐵鎧', 'Iron Armour', 'armor', 'heavy', 40, 27, 700, 2),
  silkrobe:  A('絲綢長袍', 'Silk Robe', 'armor', 'robe', 32, 29, 600, 2),
  kungfu:    A('武道服', 'Kung Fu Suit', 'armor', 'light', 38, 28, 1000, 2),
  mithrilvest: A('秘銀背心', 'Mithril Vest', 'armor', 'light', 45, 32, 1200, 3),
  mithrilmail: A('秘銀鎖甲', 'Mithril Mail', 'armor', 'heavy', 51, 33, 3500, 3),
  ninjagear: A('忍者裝束', 'Ninja Gear', 'armor', 'light', 52, 40, 1100, 4),
  whiterobe: A('白色長袍', 'White Robe', 'armor', 'robe', 47, 50, 2200, 4),
  goldarmor: A('黃金鎧甲', 'Gold Armour', 'armor', 'heavy', 64, 41, 10000, 5),
  powersash: A('力量腰帶', 'Power Sash', 'armor', 'light', 60, 43, 5000, 5, { st: { st: 7 } }),
  lumiarobe: A('光明長袍', 'Luminous Robe', 'armor', 'robe', 60, 68, 6000, 5),
  diamondvest: A('鑽石背心', 'Diamond Vest', 'armor', 'light', 65, 54, 12000, 6),
  diamondarmor: A('鑽石鎧甲', 'Diamond Armour', 'armor', 'heavy', 70, 57, 15000, 6),
  crystalmail: A('水晶鎧甲', 'Crystal Mail', 'armor', 'heavy', 72, 59, 17000, 7),
  genjiarmor:A('源氏之鎧', 'Genji Armour', 'armor', 'heavy', 90, 80, 0, 7),
  minerva:   A('女神禮服', 'Minerva Bustier', 'armor', 'robe', 88, 85, 0, 8, { res: ['fire', 'ice', 'bolt', 'holy'] }),
  forcearmor:A('力場鎧甲', 'Force Armour', 'armor', 'heavy', 99, 70, 0, 8),
  // relics
  sprintshoes: R('疾風靴', 'Sprint Shoes', 'sprint', 1200, 1),
  amulet:    R('護身符', 'Amulet', 'guardpoison', 5000, 3),
  whitecape: R('白色披風', 'White Cape', 'guardsilence', 5000, 3),
  goldhairpin: R('金髮夾', 'Gold Hairpin', 'halfmp', 8000, 5),
  hermesheels: R('赫密斯之靴', 'Hermes Sandals', 'haste', 7000, 5),
  ribbon:    R('緞帶', 'Ribbon', 'guardall', 0, 7),
  genjiglove:R('源氏手套', 'Genji Glove', 'twohand', 0, 6),
  offering:  R('奉納', 'Master\'s Scroll', 'quad', 0, 7),
  mugglove:  R('強奪手套', 'Mugger\'s Glove', 'mug', 0, 4),
  earring:   R('魔力耳環', 'Earring', 'magboost', 5000, 5),
  heroring:  R('勇者戒指', 'Hero Ring', 'both', 0, 7),
  blackbelt: R('黑帶', 'Black Belt', 'counter', 5000, 4),
  charmbangle: R('避魔手環', 'Charm Bangle', 'fewer', 4000, 4),
  moogle:    R('雪狐護符', 'Fox Charm', 'noenc', 0, 6),
  growegg:   R('成長之蛋', 'Growth Egg', 'doublexp', 0, 7),
  crystalorb:R('水晶球', 'Crystal Orb', 'mp30', 10000, 6),
  dragonhorn2: R('龍之角', 'Dragon Horn', 'jump', 0, 7),
  safetybit: R('安全別針', 'Safety Bit', 'guarddoom', 6000, 5),
  bracer:    R('力量手環', 'Bracer', 'str', 3000, 3, { st: { st: 6 } }),
  speedbangle: R('速度手環', 'Speed Bangle', 'spd', 3000, 3, { st: { sp: 6 } }),
  wisdom:    R('智慧手環', 'Wisdom Bangle', 'mag', 3000, 3, { st: { ma: 6 } }),
  muscle:    R('體力腰帶', 'Muscle Belt', 'hp', 4000, 4),
};
export const FX = {
  guard: ['偶爾擋下攻擊', 'Sometimes parries'], hpblade: ['威力隨 HP 增加', 'Stronger the more HP you have'], dice: ['擲兩顆骰子', 'Rolls two dice'], dice2: ['擲三顆骰子', 'Rolls three dice'],
  sprint: ['走路速度加快', 'Walk faster'], guardpoison: ['防止中毒', 'Prevents poison'], guardsilence: ['防止沉默', 'Prevents silence'], halfmp: ['MP 消耗減半', 'Halves MP cost'],
  haste: ['戰鬥開始時加速', 'Haste in battle'], guardall: ['防止所有異常狀態', 'Blocks all bad statuses'], twohand: ['兩手各拿一把武器（攻擊兩次）', 'Strike twice'],
  quad: ['一次攻擊四下（威力減半）', 'Four strikes at half power'], mug: ['竊取變成強奪', 'Steal becomes Mug'], magboost: ['魔法威力 +25%', 'Magic +25%'],
  both: ['攻擊與魔法 +20%', 'Attack and magic +20%'], counter: ['被打時有時反擊', 'Sometimes counters'], fewer: ['遇敵率減半', 'Halves encounters'],
  noenc: ['不會遇到敵人', 'No random battles'], doublexp: ['經驗值加倍', 'Double EXP'], mp30: ['MP +30%', 'MP +30%'], jump: ['攻擊時跳躍（威力加倍）', 'Attacks leap (double power)'],
  guarddoom: ['防止即死', 'Prevents instant death'], str: ['力量 +6', 'Strength +6'], spd: ['速度 +6', 'Speed +6'], mag: ['魔力 +6', 'Magic +6'], hp: ['HP +25%', 'HP +25%'],
};
export const SLOTS = [['weapon', '武器', 'Weapon'], ['shield', '盾', 'Shield'], ['helm', '頭', 'Head'], ['armor', '身體', 'Body'], ['relic1', '飾品1', 'Relic 1'], ['relic2', '飾品2', 'Relic 2']];
const ARM_OK = { heavy: ['heavy', 'light', 'robe'], light: ['light', 'robe'], robe: ['robe'], none: [] };
export function canEquip(id, k) {
  const it = GEAR[k], ch = CHARS[id]; if (!it || !ch) return false;
  if (it.slot === 'weapon') return ch.wpn.includes(it.kind);
  if (it.slot === 'relic') return id !== 'uma' || ['ribbon', 'muscle', 'bracer'].includes(k);
  return (ARM_OK[ch.arm] || []).includes(it.kind);
}

// ---------------------------------------------------------------- shops by tier (each town sells its tier and the one below)
export function shopList(tier, kind) {
  if (kind === 'item') {
    const base = ['potion', 'antidote', 'eyedrop', 'phoenix', 'tent', 'smoke'];
    if (tier >= 2) base.push('echo', 'shuriken', 'warpstone');
    if (tier >= 3) base.push('hipotion', 'ether', 'remedy');
    if (tier >= 4) base.push('fuma', 'firescroll', 'waterscroll', 'boltscroll');
    if (tier >= 5) base.push('xpotion', 'turbo');
    return base;
  }
  if (kind === 'tools') return Object.keys(TOOLS).filter((k) => TOOLS[k].tier <= tier);
  const slots = kind === 'weapon' ? ['weapon'] : kind === 'armor' ? ['shield', 'helm', 'armor'] : ['relic'];
  return Object.keys(GEAR).filter((k) => GEAR[k].price > 0 && slots.includes(GEAR[k].slot) && GEAR[k].tier <= tier && GEAR[k].tier >= tier - 1);
}
