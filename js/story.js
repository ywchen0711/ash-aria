// ASH ARIA — the story: who stands where, what they say, and what happens. The four acts live in story1.js (起),
// story2.js (承) and story3.js (轉・合); this file holds the shared kit, the chapter cards, the opening and the ending.
import { act1 } from './story1.js?v=1';
import { act2 } from './story2.js?v=1';
import { act34 } from './story3.js?v=1';
import { shopList } from './data.js?v=1';

// people who speak but never fight
export const SPEAKERS = {
  jon: ['約恩', 'Jon'], elder: ['長老', 'Elder'], guard: ['衛兵', 'Guard'], captain: ['衛兵隊長', 'Guard Captain'], vissek: ['維瑟克', 'Vissek'], emperor: ['加爾文皇帝', 'Emperor Galvane'],
  kross: ['克洛斯隊長', 'Captain Kross'], barg: ['巴爾格', 'Barg'], soldier: ['帝國兵', 'Imperial Soldier'], messenger: ['傳令兵', 'Messenger'], octa: ['章魚大王歐克塔', 'Octa the Great'],
  merchant: ['商人', 'Merchant'], villager: ['村民', 'Villager'], woman: ['女人', 'Woman'], man: ['男人', 'Man'], child: ['孩子', 'Child'], oldman: ['老人', 'Old Man'], hunter: ['獵人', 'Hunter'],
  mina: ['美奈', 'Mina'], ren: ['廉', 'Ren'], ramus: ['萊姆斯', 'Ramus'], orwell: ['歐威爾公爵', 'Duke Orwell'], mariel: ['歌姬瑪莉兒', 'Mariel the Diva'], director: ['導演', 'Director'],
  astralElder: ['星靈長老', 'Astral Elder'], tobin: ['托賓爺爺', 'Grandpa Tobin'], seren: ['瑟恩', 'Seren'], father: ['老人', 'The Old Man'], katie: ['凱蒂', 'Katie'], bookie: ['莊家', 'Bookie'],
  thief: ['盜賊', 'Thief'], liar: ['雨城的人', 'Rainholder'], general: ['將軍', 'General'], zealot: ['狂信者', 'Zealot'], fisher: ['漁夫', 'Fisherman'], valion: ['瓦里昂', 'Valion'],
  kirisa: ['綺霜', 'Kirisa'], astral: ['星靈', 'Astral'],   hart: ['哈特', 'Hart'], gale: ['蓋爾', 'Gale'], uma: ['烏瑪', 'Uma'], fox: ['雪狐', 'Snow Fox'], innkeeper: ['旅店老闆', 'Innkeeper'],
};

// chapter cards: act, number, title
const AC = { 1: ['第一幕　起・餘燼', 'Act I · Embers'], 2: ['第二幕　承・暴風', 'Act II · The Storm'], 3: ['第三幕　轉・崩壞', 'Act III · The Fall'], 4: ['第四幕　合・輓歌', 'Act IV · Requiem'] };
const CH = (act, zh, en, tzh, ten) => ({ act: AC[act], no: [zh, en], title: [tzh, ten], short: [`${zh} ${tzh}`, `${en}: ${ten}`] });
export const CHAPTERS = {
  1: CH(1, '第一章', 'Chapter 1', '冰原上的鋼鐵', 'Steel on the Ice'),
  2: CH(1, '第二章', 'Chapter 2', '無名的少女', 'The Girl With No Past'),
  3: CH(1, '第三章', 'Chapter 3', '沙中之城', 'The Castle in the Sand'),
  4: CH(1, '第四章', 'Chapter 4', '克蘭山的拳', 'The Fists of Mt. Kolan'),
  5: CH(1, '第五章', 'Chapter 5', '黎明的火種', 'Embers of the Dawn'),
  6: CH(1, '第六章', 'Chapter 6', '三條河流', 'Three Rivers'),
  61: CH(1, '第六章 A', 'Chapter 6A', '洛恩・占領下的港口', 'Rowan: The Occupied Port'),
  62: CH(1, '第六章 B', 'Chapter 6B', '賽伊・霞之國的悲劇', 'Sai: The Fall of Kasumi'),
  63: CH(1, '第六章 C', 'Chapter 6C', '艾莉雅・回到北方', 'Aria: Back to the North'),
  7: CH(1, '第七章', 'Chapter 7', '雪原上的守城戰', 'The Battle on the Snow'),
  8: CH(1, '第八章', 'Chapter 8', '雨中的騙子之城', 'The City of Liars'),
  9: CH(1, '第九章', 'Chapter 9', '灰燼詠嘆調', 'Ash Aria'),
  10: CH(2, '第十章', 'Chapter 10', '鋼鐵的帝都', 'The Iron Capital'),
  11: CH(2, '第十一章', 'Chapter 11', '魔導研究所', 'The Arcanum'),
  12: CH(2, '第十二章', 'Chapter 12', '打開星門', 'Opening the Gate'),
  13: CH(2, '第十三章', 'Chapter 13', '皇帝的晚宴', 'The Emperor\'s Banquet'),
  14: CH(2, '第十四章', 'Chapter 14', '隱村薩瑪', 'Samar, the Hidden Village'),
  15: CH(2, '第十五章', 'Chapter 15', '星靈之谷的背叛', 'Betrayal in the Valley'),
  16: CH(2, '第十六章', 'Chapter 16', '浮空大陸', 'The Floating Isle'),
  17: CH(2, '第十七章', 'Chapter 17', '三柱之間', 'Between the Pillars'),
  18: CH(3, '第十八章', 'Chapter 18', '一年後', 'One Year Later'),
  19: CH(3, '第十九章', 'Chapter 19', '碎裂的世界', 'A World in Pieces'),
  20: CH(3, '第二十章', 'Chapter 20', '第一個同伴', 'The First Friend'),
  21: CH(4, '第二十一章', 'Chapter 21', '沉沙之城', 'The Sunken Castle'),
  22: CH(4, '第二十二章', 'Chapter 22', '輓歌', 'Requiem'),
  33: CH(4, '第三十三章', 'Chapter 33', '審判之塔', 'The Spire of Judgement'),
  34: CH(4, '終章', 'Finale', '灰燼詠嘆調', 'Ash Aria'),
};

// ---------------------------------------------------------------- the kit the acts use
const fn = (talk) => (typeof talk === 'function' ? talk : (A) => A.talk(talk));
export const K = {
  // a person on a map: when (A) => shown?; move: wanders
  npc: (x, y, look, talk, o = {}) => ({ x, y, look, dir: o.dir || 'down', talk: talk && fn(talk), ...o }),
  // something that happens when the party steps inside a rectangle (once: only the first time)
  trig: (x, y, w, h, run, o = {}) => ({ x, y, w, h, run, once: true, ...o }),
  // the far room of a dungeon floor (where bosses wait), as a 3x3 rectangle
  endRoom(m) { const [x, y] = m.anchor.end; return [x - 1, y - 1, 3, 3]; },
  setTile(m, x, y, c) { const r = m.tiles[y].split(''); r[x] = c; m.tiles[y] = r.join(''); },
  // shopkeepers and innkeepers in every town, selling that town's tier
  keepers(m) {
    for (const sp of Object.values(m.spots || {})) {
      if (['item', 'weapon', 'armor', 'relic', 'tools'].includes(sp.kind)) m.npcs.push({ x: sp.keeper[0], y: sp.keeper[1], look: sp.kind === 'item' ? 'merchant' : sp.kind === 'tools' ? 'miner' : 'man', dir: 'down', keeper: true, talk: (A) => A.shop(sp.kind, m.tier) });
      if (sp.kind === 'inn') m.npcs.push({ x: sp.keeper[0], y: sp.keeper[1], look: 'innkeep', dir: 'down', keeper: true, talk: (A) => A.inn(40 + m.tier * 30) });
    }
  },
  // townsfolk who say a different line depending on how far the story has gone: [[when, lines], ...] (the last match wins)
  chat: (x, y, look, table, o = {}) => ({ x, y, look, dir: o.dir || 'down', move: o.move !== false, when: o.when, talk: async (A) => { let lines = null; for (const [w, l] of table) if (!w || w(A)) lines = l; if (lines) await A.talk(lines); } }),
  shops: shopList,
};

// ---------------------------------------------------------------- the opening
export async function opening(A) {
  A.setParty(['aria', 'hart', 'gale'], true, 4);
  A.set('magitekArmour');
  A.S.gil = 300; A.give('potion', 4); A.give('phoenix', 1);
  await A.chapter(1);
  A.warp('frostvale', 12, 18, 'up');
  await A.talk([
    [null, '一千年前，人類與星靈之間爆發了「晶滅戰爭」。', 'A thousand years ago, humans and the Astrals waged the War of the Shattering.'],
    [null, '戰爭燒盡了半個世界。星靈封閉了通往牠們世界的星門，魔法從人間消失了。', 'It burned half the world. The Astrals sealed their gate, and magic vanished from the land.'],
    [null, '一千年後——人們用蒸氣與齒輪重建了文明。', 'A thousand years on, people have rebuilt the world with steam and gears.'],
    [null, '可是，有一個帝國在地底找到了失落的力量……', 'But one Empire has dug up a lost power from deep beneath the earth…'],
    ['hart', '……就是這裡。北方的礦都，霜石鎮。', '…This is it. The mining town in the north, Frostvale.'],
    ['gale', '聽說礦坑深處挖出了一隻冰封的星靈。真的假的？', 'They say the miners dug up a frozen Astral down there. You believe that?'],
    ['hart', '不管真的假的，命令就是命令。把牠帶回帝國。', 'True or not, orders are orders. We bring it back to the Empire.'],
    ['gale', '……那個女孩呢？她聽得懂嗎？', '…And the girl? Does she even understand us?'],
    ['hart', '她頭上戴著「縛心冠」。她什麼都不會想，只會照命令行動。', 'She\'s wearing a Thrall Crown. She doesn\'t think. She just does as she\'s told.'],
    ['hart', '聽說她一個人就燒死了五十個帝國兵。別惹她。', 'I heard she burned fifty of our own men alive once. Don\'t get on her bad side.'],
    ['aria', '……', '…'],
  ]);
  A.goal('前往霜石鎮北邊的礦坑，找到冰封的星靈。', 'Head to the mine north of Frostvale and find the frozen Astral.');
}

// ---------------------------------------------------------------- the ending: everyone's epilogue (only those who came back)
export function ending(A) {
  const has = (id) => A.hasMember(id), out = [];
  const L = (zh, en) => out.push([zh, en]);
  L('── 審判之塔崩塌了 ──', '── The Spire falls ──');
  L('魔法隨著維瑟克一起，從這個世界上消失了。', 'Magic leaves the world with Vissek.');
  L('星晶一顆一顆化為光點，飛回了星空。', 'One by one the Astrals turn to light and fly home to the stars.');
  L('「艾莉雅！妳的身體……！」', '"Aria! You\'re fading—!"');
  L('艾莉雅：「……不，我還在這裡。」', 'Aria: "…No. I\'m still here."');
  L('艾莉雅：「星靈的力量消失了，可是我沒有消失。因為……我現在是人了。」', 'Aria: "The Astral in me is gone, but I\'m not. Because… now I\'m human."');
  L('── 艾莉雅 ──', '── Aria ──');
  L('她回到希望村，和孩子們一起種下了第一片麥田。', 'She went back to Hopehaven and planted the first wheat field with the children.');
  if (has('rowan')) { L('── 洛恩 ──', '── Rowan ──'); L('他不再說「我會保護妳」。他說：「我們一起走吧。」瑟琳娜笑了。', 'He stopped saying "I\'ll protect you." He said, "Let\'s go on together." Selene smiled.'); }
  if (has('edmund') || has('sai')) { L('── 艾德蒙與賽伊 ──', '── Edmund & Sai ──'); L('兄弟倆又擲了一次硬幣。這一次，誰也沒有看結果。', 'The brothers tossed the coin once more. This time, neither of them looked.'); }
  if (has('kiriyu')) { L('── 桐生 ──', '── Kiriyu ──'); L('霞之國的櫻花又開了。他在妻兒的墓前，第一次笑著說了「我回來了」。', 'The cherry trees of Kasumi bloomed again. At his family\'s grave he said "I\'m home" — and smiled.'); }
  if (has('galan')) { L('── 嘉藍 ──', '── Galan ──'); L('他每個月都會去荒原的老屋，陪那個不認得他的老人吃一頓飯。', 'Every month he visits the old hut on the Wildlands and shares a meal with the old man who doesn\'t know him.'); }
  if (has('regis')) { L('── 雷吉斯 ──', '── Regis ──'); L('金翼號飛過了重生的天空。「芙蕾雅，妳看。這個世界還不錯吧。」', 'The Goldwing flew through a sky reborn. "Look, Freya. Not a bad world after all."'); }
  if (A.flag('nightcrow_alive') && has('nightcrow')) { L('── 夜鴉 ──', '── Nightcrow ──'); L('他沒有留下來。可是莉莉的畫裡，總有一隻灰色的狼。', 'He didn\'t stay. But in every painting Lili makes, there is a grey wolf.'); }
  if (has('lili') || has('bolo')) { L('── 莉莉與波洛 ──', '── Lili & Bolo ──'); L('莉莉畫了一幅好大的畫：十五個人站在晨光裡。波洛說那是他看過最好的魔法。', 'Lili painted a huge picture: fifteen people standing in the dawn. Bolo said it was the best magic he had ever seen.'); }
  if (has('moka') || has('uma')) { L('── 摩卡與烏瑪 ──', '── Moka & Uma ──'); L('霜石鎮的孩子們又可以在雪地上和雪狐一起玩了。', 'Frostvale\'s children play in the snow with the foxes again.'); }
  if (has('kagami')) { L('── 鏡 ──', '── Kagami ──'); L('沒有人知道鏡去了哪裡。也許，鏡現在正模仿著你。', 'No one knows where Kagami went. Perhaps, right now, Kagami is copying you.'); }
  if (has('selene')) { L('── 瑟琳娜 ──', '── Selene ──'); L('她在孤島的海崖上種了一朵花，給托賓爺爺，也給那個想要放棄的自己。', 'On the Solitary Isle\'s cliff she planted a flower — for Grandpa Tobin, and for the girl who almost gave up.'); }
  L('── 灰燼詠嘆調 ──', '── Ash Aria ──');
  L('在註定毀滅的世界裡，我們依然選擇去愛、去保護、去活。', 'In a world bound to end, we still choose to love, to protect, and to live.');
  L('這就是我們的詠嘆調。', 'This is our aria.');
  L(`遊玩時間 ${Math.floor((A.S.playTime || 0) / 3600)} 小時 ${Math.floor((A.S.playTime || 0) / 60) % 60} 分`, `Play time ${Math.floor((A.S.playTime || 0) / 3600)}h ${Math.floor((A.S.playTime || 0) / 60) % 60}m`);
  L(`找回的同伴 ${A.S.roster.length} 人`, `Friends found: ${A.S.roster.length}`);
  return out;
}

// ---------------------------------------------------------------- putting it all on the maps
export function decorate(M) {
  for (const m of Object.values(M)) if (m.town) K.keepers(m);
  act1(M, K);
  act2(M, K);
  act34(M, K);
}
