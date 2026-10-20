// ASH ARIA — the story: who stands where, what they say, and what happens. The four acts live in story1.js (起),
// story2.js (承) and story3.js (轉・合); this file holds the shared kit, the chapter cards, the opening and the ending.
import { act1 } from './story1.js?v=4';
import { act2 } from './story2.js?v=4';
import { act34 } from './story3.js?v=4';
import { shopList } from './data.js?v=4';
import { side, SIDE_SPEAKERS, setPlaceNames } from './side.js?v=4';
import { episodes } from './episodes.js?v=4';
import { interludes } from './interludes.js?v=4';

// people who speak but never fight
export const SPEAKERS = {
  jon: ['敲鐘人約恩', 'Jon the Bell-Ringer'], elder: ['長老', 'Elder'], guard: ['衛兵', 'Guard'], captain: ['衛兵隊長', 'Guard Captain'], orsay: ['歐瑟', 'Orsay'], vissek: ['歐瑟', 'Orsay'],
  kalan: ['卡蘭', 'Kalan'], kross: ['卡蘭', 'Kalan'], gearwick: ['齒輪伯爵', 'Count Gearwick'], barg: ['巴爾格', 'Barg'], soldier: ['聖詠院守衛', 'Choir Warden'], messenger: ['傳令', 'Messenger'],
  merchant: ['商人', 'Merchant'], villager: ['村民', 'Villager'], woman: ['女人', 'Woman'], man: ['男人', 'Man'], child: ['孩子', 'Child'], oldman: ['老人', 'Old Man'], hunter: ['獵人', 'Hunter'],
  mina: ['美奈', 'Mina'], ren: ['廉', 'Ren'], ramus: ['聆聽者伊倫', 'Ilun the Listener'], orwell: ['歐威爾公爵', 'Duke Orwell'], director: ['舞台監督', 'Stage Manager'],
  astralElder: ['星靈長老', 'Astral Elder'], tobin: ['托賓爺爺', 'Grandpa Tobin'], seren: ['瑟恩', 'Seren'], father: ['團長奶奶', 'The Old Ringmaster'], katie: ['凱蒂', 'Katie'], bookie: ['莊家', 'Bookie'],
  thief: ['盜賊', 'Thief'], liar: ['雨城的人', 'Rainholder'], general: ['聖詠院長老', 'Choir Elder'], zealot: ['沉默教徒', 'Hushed Zealot'], fisher: ['漁夫', 'Fisherman'], valion: ['瓦里昂', 'Valion'],
  kirisa: ['霜鈴', 'Rimebell'], astral: ['星靈', 'Astral'], hart: ['哈特', 'Hart'], gale: ['蓋爾', 'Gale'], uma: ['烏瑪', 'Uma'], fox: ['雪狐', 'Snow Fox'], innkeeper: ['旅店老闆', 'Innkeeper'],
};

// chapter cards. The story keeps its own fine-grained steps (S.ch); the player sees twelve chapters, three to an act,
// and a card only when the chapter changes (the three rivers of chapter 3 each get a part card of their own)
const AC = { 1: ['第一幕　起・灰潮之歌', 'Act I · The Ashtide\'s Song'], 2: ['第二幕　承・沉默的聖詠', 'Act II · The Silent Chorale'], 3: ['第三幕　轉・長寂', 'Act III · The Long Silence'], 4: ['第四幕　合・回音', 'Act IV · Echoes'] };
const NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const CH = (act, k, tzh, ten, part) => ({ act: AC[act], k, no: [k === 12 ? '終章' : `第${NUM[k]}章`, k === 12 ? 'Finale' : `Chapter ${k}`], title: [tzh, ten], part, short: [`${k === 12 ? '終章' : `第${NUM[k]}章`} ${tzh}`, `${k === 12 ? 'Finale' : `Chapter ${k}`}: ${ten}`] });
const C1 = ['霜石鎮的裂鐘', 'The Cracked Bell of Frostvale'], C2 = ['風琴與回音', 'Organ and Echo'], C3 = ['三條河流', 'Three Rivers'], C4 = ['雪原上的指揮者', 'The Conductor on the Snow'];
const C5 = ['大音樂會', 'The Grand Concert'], C6 = ['聖詠都', 'The City of the Chorale'], C7 = ['始源之門', 'The Origin Gate'], C8 = ['白花之谷', 'The Valley of White Flowers'];
const C9 = ['終止符', 'The Final Rest'], C10 = ['長寂', 'The Long Silence'], C11 = ['八個音', 'Eight Notes'], C12 = ['灰燼詠嘆調', 'Ash Aria'];
export const CHAPTERS = {
  1: CH(1, 1, ...C1), 2: CH(1, 1, ...C1),
  3: CH(1, 2, ...C2), 4: CH(1, 2, ...C2),
  5: CH(1, 3, ...C3), 6: CH(1, 3, ...C3),
  61: CH(1, 3, ...C3, ['洛恩・燈塔的鐘', 'Rowan: The Lighthouse Bell']), 62: CH(1, 3, ...C3, ['賽伊・霞鳴之刀', 'Sai: The Blade of Kasumei']), 63: CH(1, 3, ...C3, ['艾莉雅・回到北方', 'Aria: Back to the North']),
  7: CH(1, 4, ...C4),
  8: CH(1, 5, ...C5), 9: CH(1, 5, ...C5),
  10: CH(2, 6, ...C6), 11: CH(2, 6, ...C6),
  12: CH(2, 7, ...C7), 13: CH(2, 7, ...C7),
  14: CH(2, 8, ...C8), 15: CH(2, 8, ...C8),
  16: CH(2, 9, ...C9), 17: CH(2, 9, ...C9),
  18: CH(3, 10, ...C10), 19: CH(3, 10, ...C10), 20: CH(3, 10, ...C10), 21: CH(3, 10, ...C10),
  22: CH(4, 11, ...C11),
  33: CH(4, 12, ...C12), 34: CH(4, 12, ...C12),
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
    [null, '艾瑟蘭是一個會唱歌的世界。風、海浪、火焰、心跳——萬物都是一首巨大的歌「星歌」的一部分。', 'Etheran is a world that sings. Wind, waves, fire, heartbeats — everything is part of one vast song: the Star Song.'],
    [null, '歌的音符化成了有生命的「星靈」，沉睡在大地深處的結晶裡。', 'Its notes took living form as Astrals, asleep in crystal deep beneath the earth.'],
    [null, '世界的邊緣，有一片吞噬一切的灰色霧海——「灰潮」。被它吞沒的東西，會失去顏色、聲音，最後連記憶都會消失。', 'At the edge of the world lies a grey sea of mist that devours everything: the Ashtide. Whatever it swallows loses its colour, then its sound, and at last even its memory.'],
    [null, '只有鐘聲能擋住灰潮。於是聖詠院把星靈挖出來，熔進鐘裡。鐘越來越多——星歌，越來越小聲。', 'Only the sound of bells holds the Ashtide back. So the Choir digs up Astrals and melts them into bells. The bells grow ever more numerous — and the Star Song grows ever fainter.'],
    ['hart', '……就是這裡。北方的礦鎮，霜石鎮。鎮上的鐘裂了。', '…This is it. The mining town in the north, Frostvale. Their bell has cracked.'],
    ['gale', '礦坑深處，冰封著一隻很老的星靈。熔進新的鐘裡，就夠這個鎮用一百年了。', 'Deep in the mine, a very old Astral lies frozen. Melt it into a new bell, and this town is safe for a hundred years.'],
    ['hart', '艾莉雅大人會「聽」出牠在哪裡。我們只要負責挖。', 'Lady Aria will "listen" for where it lies. All we have to do is dig.'],
    ['gale', '……她是大指揮者的女兒吧？為什麼總是不說話？', '…She\'s the High Conductor\'s daughter, isn\'t she? Why does she never speak?'],
    ['hart', '她是「空心之子」，在灰潮裡出生的。大指揮者說，她是世界上最好的樂器。樂器不需要說話。', 'She\'s a Hollow Child, born in the Ashtide. The High Conductor says she\'s the finest instrument in the world. Instruments don\'t need to talk.'],
    ['aria', '……', '…'],
  ]);
  A.goal('前往霜石鎮北邊的礦坑，找到冰封的星靈。', 'Head to the mine north of Frostvale and find the frozen Astral.');
}

// ---------------------------------------------------------------- the ending: everyone's epilogue (only those who came back)
export function ending(A) {
  const has = (id) => A.hasMember(id), out = [], whole = A.flag('aria_whole');
  const L = (zh, en) => out.push([zh, en]);
  L('── 安息之塔的鐘，一口一口地醒了過來 ──', '── One by one, the bells of the Tower of Rest wake ──');
  L('風有了聲音。海浪有了聲音。世界上的每一個人，都同時聽見了自己的心跳。', 'The wind has a voice again. So do the waves. Everyone in the world hears their own heartbeat at the same moment.');
  L('灰潮還在世界的邊緣。可是人們不再需要把星靈熔進鐘裡了——大家學會了一起唱歌。', 'The Ashtide still waits at the edge of the world. But no one needs to melt Astrals into bells any more. People have learned to sing together.');
  L('── 艾莉雅 ──', '── Aria ──');
  if (whole) L('她記得每一個人的名字，每一首歌。她在燈下站著——腳邊，第一次有了一道淡淡的影子。', 'She remembers every name and every song. She stands beneath a lamp, and for the first time a faint shadow falls at her feet.');
  else L('她不記得大家了。可是每天晚上，同伴們輪流唱歌給她聽，一首一首地，把她的記憶唱回來。', 'She doesn\'t remember any of them. But every night her friends take turns singing to her, and song by song, they sing her memories back.');
  L('她在歐瑟睡著的塔頂種了一片花。每年冬天，她都會去那裡唱搖籃曲。', 'She planted flowers at the top of the tower where Orsay sleeps. Every winter she goes there to sing him a lullaby.');
  if (has('rowan')) { L('── 洛恩 ──', '── Rowan ──'); L('他又開始送信了。現在，他的包包裡沒有送不到的信。', 'He went back to carrying the post. These days there\'s no letter in his bag that won\'t get delivered.'); }
  L(A.flag('tobin_alive') ? '燈塔的托賓爺爺，終於見到了那個他撿到的嬰兒。他說了一聲「對不起」，她回了一聲「謝謝」。' : '燈塔的托賓爺爺不記得任何人了。可是艾莉雅每個月都去看他，唱一首海浪的歌——他總會跟著打拍子。', A.flag('tobin_alive') ? 'Grandpa Tobin of the lighthouse finally met the baby he once found. He said "I\'m sorry"; she said "thank you".' : 'Grandpa Tobin of the lighthouse remembers no one. But every month Aria visits and sings him a song of the waves, and he always taps along.');
  if (has('selene')) { L('── 瑟琳娜 ──', '── Selene ──'); L('希望村有了一口新的鐘。那口鐘裡沒有星靈，只有孩子們每天輪流去敲。', 'Hopehaven has a new bell. There is no Astral inside it — only the children, who take turns ringing it every day.'); }
  if (has('edmund')) { L('── 艾德蒙 ──', '── Edmund ──'); L('共鳴爐完成了。發明大賽上，齒輪伯爵坐在第一排，用力地鼓掌。……然後說明年一定要贏。', 'The resonance furnace is finished. At the inventors\' fair, Count Gearwick sits in the front row and claps his hardest. …Then swears he\'ll win next year.'); }
  if (has('sai')) { L('── 賽伊 ──', '── Sai ──'); L('回音寺重建了。寺裡最受歡迎的課，是巴爾格教的「用腳底聽」。', 'The Echo Temple was rebuilt. Its most popular class is Barg\'s "Listening Through Your Feet".'); }
  if (has('kiriyu')) { L('── 桐生 ──', '── Kiriyu ──'); L('聲音回來的那個早上，美奈醒了。她說的第一句話是：「刀，鍛好了嗎？」他看不見她的臉，可是他笑了。', 'The morning the sound returned, Mina woke. Her first words were: "Is the blade finished?" He couldn\'t see her face, but he smiled.'); }
  if (has('galan')) { L('── 嘉藍 ──', '── Galan ──'); L('流浪馬戲團又開張了。開場的哨音一響，團長奶奶總會說：「這孩子吹得真好。」', 'The travelling circus opened again. Whenever the opening whistle sounds, the old ringmaster always says: "That boy blows it beautifully."'); }
  if (has('regis')) { L('── 雷吉斯 ──', '── Regis ──'); L('寧波斯在有聲音的天空裡唱歌。漁夫們說，最近網裡撈到的歌，比魚還多。', 'Nimbus sings in a sky full of sound. The fishermen say their nets haul in more songs than fish these days.'); }
  if (A.flag('nightcrow_alive') && has('nightcrow')) { L('── 夜鴉 ──', '── Nightcrow ──'); L('她摘下了面具。熔晶所的孤兒名冊上，她一個一個地找，最後找到了弟弟的名字——他還活著。', 'She took off her mask. She searched the Foundry\'s orphan registers name by name, and at last found her brother\'s. He is alive.'); }
  if (has('lili') || has('bolo')) { L('── 莉莉與波洛 ──', '── Lili & Bolo ──'); L('薩瑪書庫重建了。莉莉在「最初的樂譜」後面，加上了新的一頁：這趟旅行的歌。', 'Samar\'s archive was rebuilt. After the last page of the First Score, Lili added a new one: the song of this journey.'); }
  if (has('moka') || has('uma')) { L('── 摩卡與烏瑪 ──', '── Moka & Uma ──'); L('霜石鎮的鐘修好了——用的是約恩敲了四十年的那口舊鐘。烏瑪每天幫忙拉鐘繩。', 'Frostvale\'s bell was mended — the old one Jon rang for forty years. Uma pulls the bell rope every day.'); }
  if (has('kagami')) { L('── 鏡 ──', '── Kagami ──'); L('沒有人知道鏡去了哪裡。可是有人說，在某面鏡子裡，看見了一個不是在模仿任何人的笑臉。', 'No one knows where Kagami went. But someone says that in a certain mirror they saw a smile that wasn\'t copying anyone at all.'); }
  L('── 灰燼詠嘆調 ──', '── Ash Aria ──');
  L('聲音會帶來失去。可是我們寧願聽見，也不要安靜地遺忘。', 'Sound brings loss. But we would rather hear it than quietly forget.');
  L('這就是我們的詠嘆調。', 'This is our aria.');
  L(`找回的音 ${Math.min(8, A.count('dragons'))} / 8`, `Notes found: ${Math.min(8, A.count('dragons'))} / 8`);
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
  setPlaceNames(M); side(M, K); episodes(M, K); interludes(M, K);
}
Object.assign(SPEAKERS, SIDE_SPEAKERS, { oldwoman: ['老婦人', 'Old Woman'] });
