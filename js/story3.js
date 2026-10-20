// ASH ARIA — Act III 轉 · The Long Silence (the lighthouse isle, Tidewatch, Nikko) and Act IV 合 · Echoes (finding everyone
// again, the eight Discordant Beasts that swallowed Aria's notes, the Colosseum, the Tower of Rest and the last lullaby).
import { ITEMS, GEAR } from './data.js?v=3';
const ch = (A) => A.S.ch;
const has = (A, id) => A.hasMember(id);

// ---------------------------------------------------------------- the Long Silence: one year later, Rowan alone
export async function actThree(A) {
  A.S.world = 'r'; A.airship(null);
  const lv = Math.round(A.avgLv());
  A.S.roster = ['rowan'];
  A.catchUp('rowan', lv);
  A.setParty(['rowan']);
  A.heal();
  await A.chapter(18);
  A.warp('solitary', 11, 6, 'up');
  await A.talk([
    [null, '……', '…'],
    [null, '沒有風聲。沒有浪聲。洛恩睜開眼睛，世界安靜得像一張白紙。', 'No wind. No waves. Rowan opens his eyes, and the world is as quiet as a blank page.'],
    ['tobin', '（老人的嘴在動，卻沒有聲音。他從口袋裡拿出一枚貝殼，貼在洛恩的耳邊。）', '(The old man\'s lips move, but there is no sound. He takes a shell from his pocket and holds it to Rowan\'s ear.)'],
    ['tobin', '……聽得到嗎？這是記憶貝。只有它，還會留著一點點聲音。', '…Can you hear me? This is a memory shell. Only these still keep a little sound.'],
    ['tobin', '你睡了一整年。我是托賓，這座燈塔的看守人。', 'You\'ve slept a whole year. I\'m Tobin, keeper of this lighthouse.'],
    ['rowan', '……一年？……大家呢？艾莉雅呢？', '…A year? …Where is everyone? Where\'s Aria?'],
    ['tobin', '我不知道。三口鐘響的那天，世界的聲音全部停了。風、海、鳥、人說話的聲音。', 'I don\'t know. The day the three bells rang, every sound in the world stopped. Wind, sea, birds, people\'s voices.'],
    ['tobin', '大指揮者在世界中心蓋了一座「安息之塔」。每天夜裡，塔會照出「寂光」，讓一座城鎮的人睡去。', 'The High Conductor built a Tower of Rest at the centre of the world. Every night it shines its Quiet Light, and the people of one more town fall asleep.'],
    ['tobin', '而灰潮……也在偷我的記憶。我已經想不起我太太的臉了。', 'And the Ashtide… is stealing my memories. I can no longer remember my wife\'s face.'],
    ['tobin', '洛恩，拜託你。去沙灘幫我撿記憶貝。貝殼裡還留著從前的聲音，聽了，也許我能多記得一點。', 'Rowan, please. Gather memory shells from the beach for me. They still hold sounds from before. Hearing them, perhaps I can remember a little more.'],
  ]);
  A.goal('到島南邊的沙灘撿記憶貝（面向海按確定），拿回來給托賓爺爺聽。亮晶晶的貝殼比較好。', 'Gather memory shells on the beach in the south of the island (face the sea and press OK) and bring them to Grandpa Tobin. The bright ones are the best.');
  A.set('tobin_hp', 26);
}

const SHELLS = [[['亮晶晶的記憶貝', 'a bright memory shell'], 14], [['普通的貝殼', 'an ordinary shell'], 6], [['碎掉的貝殼', 'a cracked shell'], -9]];
export function act34(M, K) {
  const { npc, trig, chat } = K;
  // ================================================================ the lighthouse isle (chapter 18)
  const so = M.solitary;
  so.entry = [11, 6, 'up'];
  so.npcs.push(npc(12, 5, 'tobin', async (A) => {
    if (A.flag('tobin_end')) return A.talk([['tobin', A.flag('tobin_alive') ? '去吧，洛恩。木筏就在沙灘上。這次，一定要送到。' : '（老人對你微笑，像對一個陌生人那樣。）', A.flag('tobin_alive') ? 'Go on, Rowan. The raft is on the beach. This time, deliver it.' : '(The old man smiles at you, the way one smiles at a stranger.)']]);
    const shell = A.S.flags.fish;
    if (!shell) return A.talk([['tobin', '……我太太，叫什麼名字來著……', '…My wife. What was her name, again…']]);
    delete A.S.flags.fish; A.S.flags.tobin_hp += SHELLS[shell - 1][1]; A.inc('fed');
    await A.talk([['rowan', `爺爺，我撿到了${A.T(...SHELLS[shell - 1][0])}。`, `Grandpa, I found ${A.T(...SHELLS[shell - 1][0])}.`], ['tobin', shell === 1 ? '……是浪的聲音。我和她，在這個沙灘上……想起來了。' : shell === 2 ? '……風的聲音。謝謝你……' : '……（貝殼裡只有沙沙的雜音。老人搖了搖頭。）', shell === 1 ? '…The sound of waves. She and I, on this very beach… I remember now.' : shell === 2 ? '…The sound of wind. Thank you…' : '…(There is only a hiss of static in the shell. The old man shakes his head.)']]);
    if (A.count('fed') < 4) return;
    A.set('tobin_end');
    if (A.S.flags.tobin_hp >= 50) {
      A.set('tobin_alive');
      await A.talk([
        ['tobin', '洛恩，謝謝你。我想起來了……全部。包括一件，我本來想帶進墳墓的事。', 'Rowan, thank you. I remember… all of it. Including something I meant to take to my grave.'],
        ['tobin', '十七年前，我在灰潮的邊上撿到一個嬰兒。她沒有影子，哭的聲音……像一首歌。', 'Seventeen years ago, at the edge of the Ashtide, I found a baby. She had no shadow, and when she cried… it sounded like a song.'],
        ['tobin', '我害怕。我把她交給了聖詠院。……那個孩子，就是艾莉雅吧。', 'I was afraid. I gave her to the Choir. …That child was Aria, wasn\'t she.'],
        ['rowan', '……爺爺。', '…Grandpa.'],
        ['tobin', '我在地下室造了一艘木筏。本來想自己出海，去向她道歉。你替我去吧。', 'I built a raft in the cellar. I meant to sail out myself and apologise to her. Go in my place.'],
      ]);
      return cliff(A);
    }
    await A.talk([
      ['tobin', '……你是……誰？……對不起，我好像……在等一個人……', '…Who… are you? …I\'m sorry, I think… I\'m waiting for someone…'],
      [null, '灰潮帶走了托賓爺爺最後的記憶。他坐在燈塔下，安靜地看著海。', 'The Ashtide takes the last of Grandpa Tobin\'s memories. He sits beneath the lighthouse, quietly watching the sea.'],
      [null, '他的枕頭底下，壓著一張紙條：「十七年前，我在灰潮邊撿到一個沒有影子的嬰兒，交給了聖詠院。對不起。」', 'Under his pillow is a note: "Seventeen years ago I found a baby with no shadow at the edge of the Ashtide, and gave her to the Choir. I am sorry."'],
    ]);
    return cliff(A);
  }));
  for (let x = 11; x <= 17; x++) so.checks[`${x},13`] = async (A) => {
    if (A.flag('tobin_end')) return;
    if (A.S.flags.fish) return A.talk([[null, '已經撿到一枚貝殼了。先拿回去給爺爺吧。', 'You already have a shell. Bring it to Grandpa first.']]);
    const r = Math.random(), f = r < 0.4 ? 1 : r < 0.8 ? 2 : 3;
    A.S.flags.fish = f;
    await A.talk([[null, `洛恩撿到了${A.T(...SHELLS[f - 1][0])}。`, `Rowan finds ${A.T(...SHELLS[f - 1][0])}.`]]);
  };
  so.triggers.push(trig(7, 2, 8, 2, async (A) => {
    await A.talk([
      [null, '海崖。灰色的天空下，大海靜止得像一面鏡子。', 'The cliff. Under the grey sky the sea lies as still as a mirror.'],
      ['rowan', '……又一次。我又一次，什麼都沒送到。', '…Again. Once again, I didn\'t deliver a thing.'],
      [null, '腳邊的石縫裡，有一枚小小的、發光的貝殼。', 'In a crack of rock at his feet lies a small, glowing shell.'],
      [null, '洛恩把它撿起來。貝殼裡，有人在哼歌。', 'Rowan picks it up. Inside the shell, someone is humming.'],
      ['aria', '（♪ ……一定要收到喔……♪）', '(♪ …make sure you receive it… ♪)'],
      ['rowan', '……艾莉雅？', '…Aria?'],
      ['rowan', '……收到了。這次，我收到了。', '…I got it. This time, I got it.'],
      ['rowan', '妳在這個世界的某個地方，對不對？等我。換我去找妳。', 'You\'re somewhere in this world, aren\'t you? Wait for me. Now it\'s my turn to find you.'],
    ]);
    A.give('bandana');
    await A.talk([[null, A.flag('tobin_alive') ? '洛恩把托賓爺爺的木筏推下了海。' : '洛恩在地下室找到了托賓爺爺留下的木筏，上面刻著：「給那個孩子。」', A.flag('tobin_alive') ? 'Rowan pushes Grandpa Tobin\'s raft out to sea.' : 'In the cellar Rowan finds the raft Grandpa Tobin left behind. Carved on it: "For that child."']]);
    await A.chapter(19);
    A.world(56, 49, 'up', 'r');
    A.goal('前往附近的潮望鎮。', 'Go to the nearby town of Tidewatch.');
  }, { when: (A) => A.flag('cliff_ready') }));
  async function cliff(A) { A.set('cliff_ready'); A.goal('到島北邊的海崖去。', 'Go to the cliff at the north of the island.'); }
  // ================================================================ Tidewatch (chapter 19)
  const tw = M.tidewatch;
  tw.onEnter = async (A) => {
    if (ch(A) === 19 && !A.flag('c19_in')) {
      A.set('c19_in');
      await A.talk([
        [null, '潮望鎮。人們用手勢說話。孩子們在地上畫畫，代替笑聲。', 'Tidewatch. People talk in hand signs. Children draw on the ground instead of laughing.'],
        [null, '遠方的天空，一道蒼白的光從世界中心的塔上照下來，照在一座山頭的村子上。', 'Far off, a pale light falls from the tower at the world\'s centre onto a hilltop village.'],
        ['man', '（手語）……又來了。寂光。昨天是東邊的村子，今天是那座山。被照到的人，就睡著了。', '(signing) …There it goes again. The Quiet Light. Yesterday the village to the east, today that hill. Whoever it touches falls asleep.'],
        ['woman', '（手語）有人說，那樣也好。睡著了，就不用再害怕了。', '(signing) Some say it\'s for the best. Asleep, you don\'t have to be afraid any more.'],
        ['rowan', '（貝殼在手裡微微發熱。靠近它的時候，大家的聲音好像能聽見一點點。）', '(The shell is warm in his hand. When people come near it, their voices can almost be heard.)'],
      ]);
      A.goal('在鎮上打聽消息。聽說北方的尼可鎮，有人在造「讓聲音回來的機器」。', 'Ask around town. They say someone in Nikko, to the north, is building "a machine to bring sound back".');
    }
  };
  tw.npcs.push(
    chat(10, 9, 'man', [[null, [['man', '（手語）北邊的尼可鎮，有個工匠每天在打鐵。可是沒有人聽得到他在敲什麼。', '(signing) Up north in Nikko there\'s a craftsman hammering every day. Only nobody can hear what he\'s hammering.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '（手語）我的丈夫在鐘響那天出海，再也沒有回來。……可是，我還在等。等哪天聽到他叫我。', '(signing) My husband went to sea the day the bells rang. He never came back. …But I\'m still waiting. For the day I hear him call my name.']]]]),
    chat(24, 9, 'child', [[null, [['child', '（在地上畫了一個大大的嘴巴，和很多音符。）', '(draws a big open mouth on the ground, and lots of musical notes.)']]]]),
    npc(10, 15, 'sailor', async (A) => {
      if (A.flag('got_leviath') || !A.flag('sularis_up')) return A.talk([['fisher', '（手語）海裡有一隻很大的鯨。以前，我們在網裡撈得到牠的歌。', '(signing) There\'s a great whale in the sea. We used to catch its song in our nets.']]);
      await A.talk([['fisher', '你們要去那座塔？……這是我在網裡撈到的。會發光的石頭，裡面有鯨的歌。拿去吧。', 'You\'re going to that tower? …I pulled this out of my nets. A glowing stone, with a whale\'s song inside. Take it.']]);
      A.set('got_leviath'); await A.astral('leviath');
    }),
  );
  // ================================================================ Nikko: Edmund, Regis (chapters 20, 22)
  const nk = M.nikko;
  nk.npcs.push(
    npc(6, 3, 'edmund', async (A) => {
      if (has(A, 'edmund')) return;
      await A.talk([
        [null, '鎮中央，一個男人對著一座巨大的爐子，揮著沒有聲音的鐵鎚。', 'In the middle of town, a man swings a soundless hammer at an enormous furnace.'],
        ['rowan', '……艾德蒙？', '…Edmund?'],
        ['edmund', '（他回頭。看到洛恩手裡的貝殼，眼睛睜得好大。）……洛恩？我、我聽得見你？', '(He turns. When he sees the shell in Rowan\'s hand, his eyes go wide.) …Rowan? I — I can hear you?'],
        ['rowan', '是這枚貝殼。裡面有艾莉雅的聲音。', 'It\'s this shell. Aria\'s voice is inside it.'],
        ['edmund', '……艾莉雅。她最後唱的那個音，就是這個吧。', '…Aria. That last note she sang — this is it, isn\'t it.'],
        ['edmund', '我在造「共鳴爐」。只要有一點點聲音，爐子就能把它放大。可是我缺一樣東西——蘇拉斯的大風琴。', 'I\'m building a resonance furnace. Give it the tiniest sound and it amplifies it. But I\'m missing one thing — Sularis\'s great organ.'],
        ['edmund', '鐘響的那天，沙漠把整座城吞了下去。風琴還在沙底下。', 'The day the bells rang, the desert swallowed the whole city. The organ is still under the sand.'],
        ['rowan', '那就去把它挖出來。我是信使，沙底下也送得到。', 'Then let\'s dig it out. I\'m a courier. I can deliver under sand too.'],
        ['edmund', '……哈。你一點都沒變。洛恩，你活著，真好。', '…Ha. You haven\'t changed a bit. Rowan, I\'m so glad you\'re alive.'],
      ]);
      await A.join('edmund'); A.free(); await A.chapter(21);
      A.goal('前往西方沙漠的「沉沙之城」，修好大風琴，讓蘇拉斯重新唱歌。', 'Go to the Sunken City in the western desert, mend the great organ, and make Sularis sing again.');
    }),
    npc(7, 3, 'regis', async (A) => {
      if (has(A, 'regis')) return;
      await A.talk([
        ['regis', '……（他坐在酒館裡，一直看著天空。）', '…(He sits in the tavern, staring at the sky.)'],
        ['edmund', '雷吉斯！寧波斯呢？', 'Regis! Where\'s Nimbus?'],
        ['regis', '……掉進灰雲裡了。鐘響那天，她又睡著了。現在漂在西南方的「雲鯨之墓」，跟那些再也不會醒來的鯨魚一起。', '…Fell into the grey clouds. The day the bells rang, she fell asleep again. Now she drifts over the Whale\'s Graveyard to the south-west, with all the whales who\'ll never wake.'],
        ['rowan', '上次，是艾莉雅的歌叫醒她的。', 'Last time it was Aria\'s song that woke her.'],
        [null, '洛恩把貝殼放在雷吉斯的手心。貝殼裡的哼唱，輕輕地響著。', 'Rowan sets the shell in Regis\'s palm. The humming inside it sounds softly.'],
        ['regis', '……哈。被一個信使說教了。……好吧，我去墓場叫她起床。', '…Ha. Lectured by a postman. …All right. I\'ll go to the graveyard and wake her.'],
      ]);
      await A.join('regis');
      A.set('regis_back');
      A.goal('前往西南方的雲鯨之墓，叫醒雲鯨寧波斯。', 'Go to the Whale\'s Graveyard in the south-west and wake Nimbus the cloud whale.');
    }, { when: (A) => A.flag('sularis_up') }),
    chat(15, 15, 'oldman', [[null, [['oldman', '（手語）鐘響那天，我在山上看到一尊石像。它把一個孩子護在懷裡，然後就再也不動了。', '(signing) The day the bells rang, I saw a stone statue on the mountain. It held a child in its arms, and then it never moved again.']]], [(A) => A.flag('sularis_up'), [['oldman', '那尊石像的胸口，掉出了這顆石頭……給你們吧。', 'This stone fell out of that statue\'s chest… take it.'], (A) => A.astral('golem')]]]),
  );
  M.r_sularis.gate = (A) => (!has(A, 'edmund') ? [[null, '沙底下傳來很低的風琴聲。……不，是你的錯覺。這個世界沒有聲音。', 'A low organ note rises from under the sand. …No. You imagined it. This world has no sound.']] : null);
  const rs2 = M.r_sularis_2;
  rs2.triggers.push(trig(...K.endRoom(rs2), async (A) => {
    await A.talk([['edmund', '風琴的管子被什麼東西纏住了……是沙蛇！', 'Something\'s wrapped round the organ pipes… a sand serpent!']]);
    await A.battle(['tentaclex'], { boss: true, bg: 'castle' });
    await A.talk([
      ['edmund', '洛恩，把貝殼放在風琴的吹口上！', 'Rowan, put the shell to the organ\'s mouthpiece!'],
      [null, '艾莉雅的哼唱流進了三百根管子。沙漠的風，第一次在一年之後——唱起了歌。', 'Aria\'s humming flows into three hundred pipes. For the first time in a year, the desert wind sings.'],
      [null, '轟隆隆隆……蘇拉斯推開了沙子，重新見到了天空。風琴聲傳到的地方，人們聽見了彼此的聲音。', 'RRRUMBLE… Sularis shoulders off the sand and sees the sky again. Wherever the organ\'s voice reaches, people can hear each other.'],
      ['edmund', '……聽到了嗎？是聲音。是聲音啊！', '…Do you hear it? It\'s sound. It\'s SOUND!'],
      ['edmund', '城的地下室裡，有兩顆古老的星晶。拿去吧。', 'There are two ancient crystals in the city cellar. Take them.'],
    ]);
    await A.astral('alexis'); await A.astral('odin');
    A.set('sularis_up');
    await A.chapter(22);
    A.goal('找回散落各地的同伴（任何順序都可以）。尼可鎮的酒館裡，好像有個一直看著天空的人。', 'Find your scattered friends — in any order. There seems to be someone in the Nikko tavern who never stops staring at the sky.');
    A.warp('sularis', 12, 18, 'up');
  }, { when: (A) => !A.flag('sularis_up') }));
  for (const p of [M.ruin.places.find((q) => q.id === 'r_sularis')]) p.to = (A) => (A.flag('sularis_up') ? 'sularis' : null);
  for (const n of M.sularis.npcs) if (n.keeper) { const base = n.talk; n.talk = (A) => (A.flag('sularis_up') ? A.shop(n.look === 'miner' ? 'tools' : n.look === 'merchant' ? 'item' : 'weapon', 6) : base(A)); }
  M.sularis.exitTo = null;
  // ================================================================ the Whale's Graveyard: Nimbus
  M.tomb.gate = (A) => (!A.flag('regis_back') ? [[null, '巨大的骨頭像拱門一樣立在灰雲下。這裡是雲鯨死去的地方。', 'Vast bones rise like arches beneath the grey clouds. This is where the cloud whales come to die.']] : null);
  const tb3 = M.tomb_3;
  tb3.triggers.push(trig(...K.endRoom(tb3), async (A) => {
    await A.talk([['regis', '守墓人……牠以為寧波斯也死了。', 'The graveyard\'s keeper… it thinks Nimbus is dead too.']]);
    await A.battle(['tombking'], { boss: true, bg: 'dark' });
    await A.talk([
      [null, '鯨骨的盡頭，灰色的雲裡，漂著一隻巨大的、安靜的雲鯨。', 'Beyond the last bones, in the grey cloud, drifts a vast and silent cloud whale.'],
      ['regis', '寧波斯……我年輕的時候，跟著妳飛遍了整片天空。妳老是比我先找到風。', 'Nimbus… when I was young I flew the whole sky with you. You always found the wind before I did.'],
      ['regis', '後來我老了，退休了。我一直在想，如果那天我沒有離開妳……', 'Then I grew old and retired. I\'ve always wondered — if I hadn\'t left you that day…'],
      ['regis', '……起床了，老姑娘。這次，我們要飛到一個有聲音的天空。', '…Wake up, old girl. This time we\'re flying to a sky with sound in it.'],
      [null, '雷吉斯吹響了牧人的號角。貝殼裡的哼唱跟著號角一起響——雲鯨的眼睛，慢慢地張開了。', 'Regis blows the herder\'s horn. The humming in the shell sounds along with it — and slowly, the whale opens her eyes.'],
    ]);
    A.set('goldwing');
    A.airship('goldwing', [24, 46]);
    A.world(25, 46, 'down', 'r');
    A.goal('有了雲鯨，就能去世界的任何地方。找回同伴、打倒吞下艾莉雅之音的八隻不協之獸，然後前往世界中心的安息之塔。', 'With the cloud whale you can go anywhere. Find your friends, beat the eight Discordant Beasts that swallowed Aria\'s notes, then head for the Tower of Rest at the centre of the world.');
  }, { when: (A) => !A.flag('goldwing') }));
  // ================================================================ Crumbleton: Sai (and Barg), Lili
  const cr = M.crumbleton;
  cr.npcs.push(
    npc(6, 3, 'sai', async (A) => {
      await A.talk([
        [null, '傾城的空地上，賽伊和一群孩子赤腳站在地上。他用力地跺腳——孩子們跟著跺腳。', 'In an empty lot in Crumbleton, Sai stands barefoot with a group of children. He stamps hard — and the children stamp with him.'],
        ['rowan', '賽伊！', 'Sai!'],
        ['sai', '……洛恩？我聽得見你！……是那枚貝殼？', '…Rowan? I can hear you! …Is it that shell?'],
        ['sai', '這些孩子，從出生就聽不見。可是他們能從腳底感覺到節奏。世界安靜了以後，我發現……他們比我們都更懂得聽。', 'These children were born deaf. But they can feel rhythm through the soles of their feet. Since the world went quiet, I\'ve learned… they listen better than any of us.'],
        ['barg', '……還有我。', '…And me.'],
        ['rowan', '巴爾格！', 'Barg!'],
        ['barg', '晶石之心裂掉以後，裡面的星靈每天都在對我說話。世界安靜了，我反而聽得見牠了。', 'After my crystal heart cracked, the Astral inside it talked to me every day. When the world went quiet, I could finally hear it.'],
        ['barg', '牠說：「去教孩子們聽。」所以我在這裡，給師弟打下手。', 'It said: "Go and teach the children to listen." So here I am, helping my little brother.'],
        ['sai', '……師父一定很高興。洛恩，我跟你走。孩子們就交給師兄了。', '…The master would be so glad. Rowan, I\'m coming with you. I\'ll leave the children to my brother.'],
      ]);
      await A.join('sai'); A.quake(0.8);
      await A.talk([['child', '（一個孩子把一顆發光的石頭放在賽伊的手心，用力地跺了兩下腳。那是「謝謝」。）', '(A child presses a glowing stone into Sai\'s palm and stamps twice, hard. That means "thank you".)']]);
      await A.astral('terrato');
    }, { when: (A) => !has(A, 'sai') }),
    npc(15, 15, 'lili', async (A) => {
      await A.talk([
        ['lili', '……我在抄樂譜。一遍又一遍。我怕，要是沒有人記得，星歌就真的不見了。', '…I\'m copying the Score. Over and over. I\'m scared that if no one remembers it, the Star Song will really be gone.'],
        ['lili', '波洛老師……加入了「沉默教團」。他們說，大指揮者是對的，安靜才是救贖。老師才不是那種人！', 'Teacher Bolo… joined the Silent Order. They say the High Conductor was right, that silence is salvation. Teacher isn\'t like that!'],
        ['lili', '我要用「最初的樂譜」把老師帶回來。帶我一起去！', 'I\'m going to bring him back with the First Score. Take me with you!'],
      ]);
      await A.join('lili');
      A.goal('（莉莉）沉默教團的高塔在東南方。去把波洛老師帶回來。', '(Lili) The Silent Order\'s tower is in the south-east. Bring Teacher Bolo back.');
    }, { when: (A) => !has(A, 'lili') }),
    chat(10, 9, 'woman', [[null, [['woman', '（手語）傾城的房子都歪了。可是那個拳僧來了以後，孩子們每天都在跳舞。', '(signing) Every house in Crumbleton leans. But since that monk came, the children dance every day.']]]]),
  );
  // ================================================================ Hopehaven: Selene
  const hh = M.hopehaven;
  hh.npcs.push(
    npc(6, 3, 'selene', async (A) => {
      if (!A.flag('hope_visit')) {
        A.set('hope_visit');
        return A.talk([
          [null, '村子中央，瑟琳娜搖著一隻小小的手鈴。鈴沒有聲音，可是孤兒們都看著她的手。', 'In the middle of the village, Selene rings a little handbell. It makes no sound, but the orphans all watch her hand.'],
          ['selene', '……洛恩。你還活著。', '…Rowan. You\'re alive.'],
          ['selene', '鐘響那天，這個村子的大人全都睡著了。只剩下這些孩子。我留下來照顧他們。', 'The day the bells rang, every adult in this village fell asleep. Only the children were left. I stayed to look after them.'],
          ['selene', '每天晚上，我都搖這個鈴。就算聽不見，我也想讓他們記得——鈴響的時候，就是有人在叫你。', 'Every night I ring this bell. Even if they can\'t hear it, I want them to remember: when a bell rings, it means someone is calling you.'],
          ['selene', '……可是，我拿不起劍了。我守了一輩子的鐘，最後是鐘讓世界安靜的。', '…But I can\'t lift my sword any more. I guarded bells my whole life, and in the end it was bells that silenced the world.'],
          ['selene', '對不起。我不能跟你走。', 'I\'m sorry. I can\'t go with you.'],
          [null, '（等找回更多同伴之後，再回來看看瑟琳娜吧。）', '(Come back to see Selene once you\'ve found more of your friends.)'],
        ]);
      }
      return A.talk([['selene', '孩子們今天很乖。', 'The children were good today.']]);
    }, { when: (A) => !has(A, 'selene') }),
    chat(15, 9, 'girl', [[null, [['katie', '（手語）瑟琳娜姊姊每天晚上都會搖鈴。我們看著她的手，就知道「要睡覺了」。', '(signing) Every night Selene rings her bell. We watch her hand and know it\'s time to sleep.']]]]),
    chat(10, 15, 'child', [[null, [['child', '（手語）有一隻好大的灰色怪物，常常在村子外面走來走去。瑟琳娜姊姊說不要出去。', '(signing) There\'s a huge grey monster that walks around outside the village. Selene says we mustn\'t go out.']]]]),
  );
  hh.onEnter = async (A) => {
    if (!A.flag('hope_visit') || has(A, 'selene') || A.S.roster.length < 6) return;
    await A.talk([
      ['child', '（孩子們尖叫著跑過來——沒有聲音，只有張大的嘴。）', '(The children run toward you screaming — no sound, only open mouths.)'],
      ['selene', '灰潮巨獸……！孩子們，躲到屋子裡！……我、我得去……', 'The Ash Behemoth…! Children, get inside! …I… I have to…'],
      ['rowan', '瑟琳娜，交給我們！', 'Selene, leave it to us!'],
    ]);
    await A.battle(['hopefiend'], { boss: true, bg: 'ruin' });
    await A.talk([
      ['selene', '……我看到了。你們為了保護這些孩子，拚了命地戰鬥。', '…I saw it. You fought with everything you had, to protect these children.'],
      ['selene', '鐘可以讓人睡著，也可以叫醒人。我想做後面那一種。', 'A bell can put people to sleep, or wake them up. I want to be the second kind.'],
      [null, '瑟琳娜握起了劍。她搖了一下手鈴——洛恩手裡的貝殼，跟著發出了清脆的一聲。', 'Selene takes up her sword. She rings her handbell once — and the shell in Rowan\'s hand rings clear along with it.'],
      ['katie', '（手語）瑟琳娜姊姊，一定要回來喔！', '(signing) Selene, you have to come back!'],
      ['selene', '嗯。我答應妳。', 'I will. I promise.'],
    ]);
    await A.join('selene'); A.set('aria_back');
    await A.astral('starlet'); await A.astral('quetza');
  };
  // ================================================================ Kiriyu's forge in the ruins of Kasumi
  const dr = M.dream;
  dr.triggers.push(trig(dr.anchor.start[0] - 2, dr.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      [null, '霞之國的廢墟。老刀匠桐生倒在鍛刀爐前，手裡還握著鐵鎚，沉沉地睡著。', 'The ruins of Kasumi. Kiriyu the old swordsmith lies before his forge, hammer still in hand, deep asleep.'],
      ['sai', '桐生先生！醒醒！……叫不醒。是灰眠。', 'Master Kiriyu! Wake up! …He won\'t. It\'s the grey sleep.'],
      [null, '灰色的霧從爐子裡冒出來。……有什麼東西，在他的夢裡打鐵。', 'Grey mist seeps from the forge. …Something is hammering inside his dream.'],
    ]);
  }, { when: (A) => !has(A, 'kiriyu') }));
  const dr3 = M.dream_3;
  dr3.triggers.push(trig(...K.endRoom(dr3), async (A) => {
    await A.talk([
      [null, '夢的最深處。開滿櫻花的院子裡，美奈坐在廊下，廉在旁邊玩。', 'The deepest dream. In a courtyard full of cherry blossom, Mina sits on the veranda while Ren plays beside her.'],
      ['mina', '老頭子，留在這裡吧。這裡什麼都看得見，也沒有人會再睡著。', 'Stay here, old man. Here you can see everything, and no one falls asleep any more.'],
      ['ren', '爺爺，鍛刀給我看！', 'Grandpa, show me how you forge a sword!'],
      ['kiriyu', '……我好想留下來。', '…I want so much to stay.'],
      ['kiriyu', '可是美奈，妳說過——要我把刀鍛完。等世界的聲音回來，妳就會醒。……真正的妳，在等的是那個。', 'But Mina, you told me — finish the blade. When the world\'s sound comes back, you\'ll wake. …The real you is waiting for that.'],
      ['kiriyu', '在我夢裡打鐵的傢伙，出來吧！', 'You, hammering away in my dream — show yourself!'],
    ]);
    await A.battle(['nightmare'], { boss: true, bg: 'dark' });
    await A.talk([
      ['kiriyu', '……灰燼鍛冶師。原來，是我自己心裡那個想放棄的我。', '…The Ash Smith. So it was the part of me that wanted to give up.'],
      [null, '桐生醒了過來。他的眼睛已經幾乎看不見了，可是他的手，準確地握住了爐裡的刀坯。', 'Kiriyu wakes. His eyes can barely see now, but his hand closes unerringly on the blade-blank in the forge.'],
      ['kiriyu', '這把刀，叫「斷寂」。斬斷沉默的刀。……老頭子最後的作品，就交給你們了。', 'This blade is called Silencebreaker. A sword to cut through silence. …An old man\'s last work, and I give it to you.'],
    ]);
    await A.join('kiriyu'); await A.astral('raiden');
  }, { when: (A) => !has(A, 'kiriyu') }));
  // ================================================================ the Echo Cave: Rowan's undelivered letter
  const pc3 = M.phoenixcave_3;
  pc3.triggers.push(trig(...K.endRoom(pc3), async (A) => {
    await A.talk([['rowan', '回音洞窟……這裡的回音，據說能留住一百年。', 'The Echo Cave… they say an echo can linger here for a hundred years.']]);
    await A.battle(['phoenixguard'], { boss: true, bg: 'cave' });
    await A.talk([
      [null, '洞窟的最深處，有一個女孩的聲音，一直在重複同一句話。', 'In the depths of the cave, a girl\'s voice repeats the same words over and over.'],
      ['seren', '（……洛恩，信到了嗎？我在灰路的盡頭等你……洛恩，信到了嗎？……）', '(…Rowan, did the letter arrive? I\'m waiting at the end of the Ash Road… Rowan, did the letter arrive?…)'],
      ['rowan', '……瑟恩。', '…Seren.'],
      ['rowan', '我十五歲那年，第一次送信。收信人是灰路盡頭的瑟恩。我在路上貪玩，晚了一天。', 'When I was fifteen I carried my first letter. It was for Seren, at the end of the Ash Road. I dawdled on the way. I was a day late.'],
      ['rowan', '那天晚上，灰潮來了。她一直在路口等我。', 'That night the Ashtide came. She was waiting for me at the crossroads.'],
      [null, '洛恩從包包裡拿出那封泛黃的信，放在回音最響的地方。', 'Rowan takes the yellowed letter from his bag and sets it where the echo is loudest.'],
      ['rowan', '瑟恩，信送到了。……對不起，晚了九年。', 'Seren, your letter\'s here. …Sorry. I\'m nine years late.'],
      ['seren', '（……收到了。謝謝你，洛恩。不要再為了我停在路上了。去送下一封吧。）', '(…I\'ve got it. Thank you, Rowan. Don\'t stop on the road for me any more. Go and deliver the next one.)'],
      [null, '回音，第一次安靜了下來。洞窟深處，一顆燃燒的星晶亮了起來。', 'For the first time, the echo falls quiet. Deep in the cave, a burning crystal flares into light.'],
      ['rowan', '……下一封信的收件人，是艾莉雅。', '…The next letter is addressed to Aria.'],
    ]);
    A.take('letter'); A.set('letter_done'); await A.astral('phoenix');
  }, { when: (A) => !A.flag('letter_done') }));
  // ================================================================ the old hut on the Wildlands: Galan
  const wh = M.r_wildhut;
  wh.npcs.push(
    npc(15, 9, 'galan', async (A) => {
      await A.talk([['galan', '嗶——！嗶——！……是你們！你們聽得到我的哨子？', 'Phweet! Phweet! …It\'s you! You can hear my whistle?'], ['rowan', '貝殼在旁邊的時候，聽得到。', 'With the shell nearby, we can.'], ['galan', '太好了！我跟你們走！可是……先陪我去看看老屋裡的奶奶。', 'Yay! I\'m coming with you! But… first come and see Grandma in the old hut.']]);
      await A.join('galan');
    }, { when: (A) => !has(A, 'galan') }),
    npc(6, 3, 'oldwoman', async (A) => {
      if (!has(A, 'galan') || A.flag('galan_father')) return A.talk([['father', '……我以前，是馬戲團的團長。帳篷、獅子、走鋼索的女孩……我什麼都不記得了。', '…I was a circus ringmaster once. The big tent, the lions, the girl on the tightrope… I don\'t remember any of it.']]);
      A.set('galan_father');
      await A.talk([
        ['galan', '……團長奶奶。', '…Grandma.'],
        ['father', '你是誰？……對不起，孩子。灰潮把我的記憶都拿走了。', 'Who are you? …I\'m sorry, child. The Ashtide took all my memories.'],
        [null, '嘉藍把哨子放在嘴邊，吹了一聲。貝殼讓那一聲，在小屋裡響了起來。', 'Galan puts the whistle to his lips and blows once. The shell lets that one note ring out in the little hut.'],
        ['father', '……這個聲音。', '…That sound.'],
        ['father', '開場的哨音。每天晚上，有個小男孩會吹這一聲，然後所有的動物都會跑進場子裡……', 'The opening whistle. Every night a little boy would blow it, and every animal would run into the ring…'],
        ['father', '我不記得他的名字。可是……我記得，他吹得很好。', 'I don\'t remember his name. But… I remember he blew it beautifully.'],
        ['galan', '……嗯。他會一直吹下去的。', '…Mm. He\'ll keep blowing it. Always.'],
      ]);
    }),
  );
  // ================================================================ the Colosseum: Nightcrow, the betting, the First Silence
  const co = M.colosseum;
  const BETS = { mithrilblade: ['icebrand', ['chimera', 'chimera']], flametongue: ['crystalsword', ['behemoth']], diamondvest: ['genjiarmor', ['spireknight']], crystalsword: ['ragnarok', ['spireknight', 'spiremage']], murasame: ['strato', ['darkknight', 'darkknight']], elixir: ['offering', ['behemoth', 'behemoth']], ribbon: ['heroring', ['spirebeast', 'spirebeast']], goldarmor: ['crystalmail', ['dunefiend', 'darkknight']] };
  co.npcs.push(
    npc(5, 3, 'man', async (A) => {
      if (A.flag('nightcrow_alive') && !has(A, 'nightcrow')) {
        await A.talk([
          ['bookie', '（手語）今天的挑戰者，是一個戴面具、帶著老鷹的女人。她說，她只跟「有聲音的人」打。', '(signing) Today\'s challenger is a masked woman with a hawk. She says she only fights "people with a voice".'],
          ['nightcrow', '……你們聽得到我？……讓我看看，你們這一年有沒有變強。', '…You can hear me? …Show me whether you\'ve grown stronger this past year.'],
        ]);
        await A.battle(['colossus'], { boss: true, bg: 'castle' });
        await A.talk([['nightcrow', '……合格。我追的那個男人，最後在鐘樓上睡著了。我的賞金，再也領不到了。', '…You pass. The man I was hunting fell asleep on that belfry. I\'ll never collect the bounty now.'], ['nightcrow', '所以，我想找一份新的工作。灰羽，我們走。', 'So I\'m looking for new work. Greyfeather, let\'s go.'], ['lili', '是那隻鳥！', 'It\'s the bird!']]);
        await A.join('nightcrow');
        return;
      }
      if (A.count('dragons') >= 8 && !A.flag('oldgod')) {
        const i = await A.ask('莊家：「找回了八個音的人們……安息之塔的地底，沉睡著比沉默更古老的東西。要挑戰嗎？」', 'Bookie: "You who found all eight notes… beneath the Tower of Rest sleeps something older than silence itself. Will you face it?"', [['挑戰', 'Fight'], ['算了', 'Not now']]);
        if (i !== 0) return;
        await A.pickParty(4);
        await A.battle(['oldgod'], { boss: true, bg: 'dark', music: 'final' });
        A.set('oldgod'); return A.item('paladinshield');
      }
      // betting: put up a piece of gear, win something better
      const can = Object.keys(BETS).filter((k) => A.has(k));
      if (!can.length) return A.talk([['bookie', '想下注嗎？拿好東西來。（可以下注的東西會在選單裡出現）', 'Fancy a wager? Bring something good. (Anything you can bet will show up in the menu.)']]);
      const i = await A.menu(can.map((k) => A.T(...nameOf(k))), { x: 40, y: 60, w: 176, title: A.T('要押什麼？', 'What do you bet?') }); if (i < 0) return;
      const k = can[i], [prize, foes] = BETS[k];
      await A.talk([['bookie', `押${A.T(...nameOf(k))}，贏了就給你${A.T(...nameOf(prize))}。`, `Bet the ${A.T(...nameOf(k))}; win and the ${A.T(...nameOf(prize))} is yours.`]]);
      await A.pickParty(1);
      A.take(k);
      const r = await A.battle(foes, { bg: 'castle', noEscape: true, canLose: true });
      A.heal();
      if (r === 'win') { if (prize === 'ragnarok') await A.astral('ragnarok'); else await A.item(prize); } else await A.talk([['bookie', '哎呀，可惜了。', 'Oh, bad luck.']]);
    }),
  );
  // ================================================================ the Tower of the Silent Order: Bolo
  const ct4 = M.culttower_4;
  ct4.triggers.push(trig(...K.endRoom(ct4), async (A) => {
    await A.talk([
      ['zealot', '（手語）安靜才是救贖。大指揮者是對的。', '(signing) Silence is salvation. The High Conductor was right.'],
      ['bolo', '……安靜才是救贖。對……這樣，就不會再失去任何東西了……', '…Silence is salvation. Yes… that way, nothing more can ever be lost…'],
      ['lili', '老師！你在說什麼傻話！', 'Teacher! What nonsense are you saying?'],
      [null, '莉莉翻開「最初的樂譜」，用盡全力唱出了第一行。貝殼讓那一行，在塔裡響了起來。', 'Lili opens the First Score and sings its first line with all her strength. The shell makes that line ring through the tower.'],
      ['bolo', '……莉莉？……莉莉！妳還活著！我以為書庫燒掉的那天……我以為什麼都不剩了……', '…Lili? …Lili! You\'re alive! I thought the day the archive burned… I thought nothing was left…'],
      ['zealot', '（手語）叛徒！讓他們安靜！', '(signing) Traitor! Silence them!'],
    ]);
    await A.battle(['flamelord', 'zealot'], { boss: true, bg: 'tower', lvUp: 16 });
    await A.talk([['bolo', '老糊塗了。莉莉，對不起。老師跟妳回家——回去抄書。', 'I\'m a foolish old man. Lili, I\'m sorry. Your teacher\'s coming home with you — to copy books.']]);
    await A.join('bolo');
  }, { when: (A) => !has(A, 'bolo') }));
  // ================================================================ Frostvale and the Ice Cavern: Moka, Uma, Valion
  const rf = M.r_frostvale;
  rf.warps.push({ x: 12, y: 0, to: 'icecave' }, { x: 13, y: 0, to: 'icecave' });
  M.icecave.exitTo = ['r_frostvale', 12, 1];
  rf.npcs.push(
    npc(6, 3, 'moka', async (A) => {
      await A.talk([
        ['moka', '是你們！摩卡聽到了！貝殼裡的聲音……是艾莉雅的歌！', 'It\'s you! Moka heard it! The voice in that shell… it\'s Aria\'s song!'],
        ['moka', '冰洞的最深處，守護瓦里昂大人的石像醒了，在裡面亂跑。它以前從來不會動的！', 'Deep in the Ice Cavern, the stone guardian that watches over Lord Valion has woken up and is rampaging about. It never used to move!'],
        [null, '（摩卡的「風土歌」：在不同的地形戰鬥就能學會新的歌。開始唱歌之後，她會一直唱下去。）', '(Moka\'s Land Song: fighting on different ground teaches new songs. Once she starts singing she keeps going.)'],
      ]);
      await A.join('moka');
    }, { when: (A) => !has(A, 'moka') }),
    npc(10, 3, 'oldman', [['jon', '（手語）……那孩子沒有影子，所以灰潮找不到她。她一定還在某個地方唱著。我敲了四十年的鐘，這點我很確定。', '(signing) …That girl has no shadow, so the Ashtide can\'t find her. She\'s still singing somewhere. I rang bells for forty years. Of that much I\'m sure.']]),
  );
  const ic2 = M.icecave_2;
  ic2.triggers.push(trig(...K.endRoom(ic2), async (A) => {
    await A.talk([['uma', '轟——！', 'BOOOM—!'], ['moka', '是烏瑪！守護石像烏瑪！他……他其實是好孩子！只是被骨頭怪物嚇壞了！', 'It\'s Uma! Uma the stone guardian! He… he\'s really a good boy! The bone monsters just scared him silly!']]);
    await A.battle(['icebone', 'icebone', 'icebone'], { bg: 'snow' });
    await A.talk([['uma', '……轟。（烏瑪用石頭手指，輕輕碰了碰洛恩手裡的貝殼。）', '…Boom. (Uma gently touches the shell in Rowan\'s hand with one stone finger.)'], ['moka', '烏瑪說，一千年前，就是這首歌把他叫醒的。他要跟大家一起去找唱歌的人！', 'Uma says a thousand years ago it was this very song that woke him. He\'s coming with everyone to find the singer!'], [null, '（烏瑪不聽指揮，自己會戰鬥。）', '(Uma takes no orders — it fights on its own.)']]);
    await A.join('uma');
    await A.talk([['valion', '（……歌的孩子的朋友們。她就在世界的每一個角落。我的力量，也借給你們吧。）', '(…Friends of the Song\'s child. She is in every corner of the world. Take my power, too.)']]);
    await A.astral('valion');
  }, { when: (A) => !has(A, 'uma') }));
  // ================================================================ the Mirror Worm: Kagami
  const wb2 = M.wormbelly_2;
  wb2.triggers.push(trig(...K.endRoom(wb2), async (A) => {
    await A.talk([[null, '巨蟲的肚子裡，是一座鏡子砌成的大廳。每一面鏡子裡，都有一個人在模仿你。', 'Inside the great worm is a hall built of mirrors. In every mirror, someone is copying you.'], ['kagami', '……', '…'], ['kagami', '「……」（鏡模仿了你的表情。）', '"…" (Kagami copies your expression.)']]);
    await A.battle(['sandworm2'], { boss: true, bg: 'dark' });
    await A.talk([['kagami', '我是鏡。我只會模仿。我沒有自己的臉，也沒有自己的聲音。', 'I am Kagami. All I can do is copy. I have no face of my own, and no voice of my own.'], ['kagami', '……可是，我想模仿你們的旅行。也許走到最後，我會找到自己的樣子。', '…But I would like to copy your journey. Perhaps at the end of it I\'ll find a shape of my own.'], [null, '（鏡的「映照」：重現同伴上一個行動，而且不用花 MP。）', '(Kagami\'s Reflect repeats an ally\'s last action — at no MP cost.)']]);
    await A.join('kagami');
  }, { when: (A) => !has(A, 'kagami') }));
  // ================================================================ the eight Discordant Beasts (each swallowed one of Aria's notes)
  const DR = ['reddragon', 'icedragon', 'stormdragon', 'earthdragon', 'holydragon', 'deaddragon', 'golddragon', 'skydragon'];
  const NOTES = [['Do', 'Do'], ['Re', 'Re'], ['Mi', 'Mi'], ['Fa', 'Fa'], ['Sol', 'Sol'], ['La', 'La'], ['Si', 'Ti'], ['高音 Do', 'high Do']];
  DR.forEach((d, i) => {
    const m = M['lair' + (i + 1)];
    m.gate = (A) => (!A.flag('goldwing') ? [[null, '洞裡傳出走了調的低吼。現在還不是時候。', 'An out-of-tune growl rumbles from within. Not yet.']] : null);
    m.triggers.push(trig(...K.endRoom(m), async (A) => {
      await A.talk([[null, '吞下了一個音的不協之獸，在黑暗裡發出走調的吼叫。', 'A Discordant Beast that swallowed a note howls out of tune in the dark.']]);
      await A.battle([d], { boss: true, bg: m.bg });
      A.set('dragon_' + d); A.inc('dragons');
      await A.talk([[null, `不協之獸倒下了。牠的身體裡，飄出了一個發光的音——「${A.T(...NOTES[i])}」。（${A.count('dragons')} / 8）`, `The Discordant Beast falls. From its body floats a shining note — "${A.T(...NOTES[i])}". (${A.count('dragons')} / 8)`], ['rowan', '……貝殼在發熱。是艾莉雅的一部分。', '…The shell is getting warm. It\'s a piece of Aria.']]);
      if (A.count('dragons') === 8) { await A.talk([[null, '八個音全部回到了貝殼裡。貝殼裡的哼唱，變成了一整段旋律。', 'All eight notes have come home to the shell. The humming inside has become a whole melody.']]); await A.astral('bahamut'); }
    }, { when: (A) => !A.flag('dragon_' + d) }));
  });
  // ================================================================ the Tower of Rest
  M.spire.gate = (A) => (!A.flag('aria_back') || A.S.roster.length < 6 ? [[null, '塔的入口被一層蒼白的寂靜封住了。一個人的聲音，穿不過去。……也許要很多人的聲音才行。', 'A pale silence seals the Tower\'s entrance. One voice can\'t get through. …Perhaps it would take many voices.']] : null);
  M.spire.onEnter = async (A) => {
    if (A.flag('spire_in')) return;
    A.set('spire_in');
    await A.chapter(33);
    await A.talk([
      ['rowan', '……這座塔，是用睡著的鐘堆起來的。', '…This tower is built from sleeping bells.'],
      ['selene', '每一口鐘裡，都有一個再也不會醒來的城鎮。', 'In every bell is a town that will never wake.'],
      ['rowan', '歐瑟就在最頂端。選四個人跟我上去吧。', 'Orsay is at the very top. Pick four and let\'s climb.'],
      [null, '（塔裡有三尊守鐘的石像。打倒它們，歐瑟的力量就會變弱。中途有存檔點。）', '(Three stone bell-wardens stand in the Tower. Beat them and Orsay weakens. There are save points on the way.)'],
    ]);
    await A.pickParty(4, ['rowan']);
    A.goal('登上安息之塔的頂端。', 'Climb to the top of the Tower of Rest.');
  };
  [['spire_2', 'tower1'], ['spire_3', 'tower2'], ['spire_4', 'tower3']].forEach(([id, boss]) => {
    const m = M[id];
    m.triggers.push(trig(...K.endRoom(m), async (A) => {
      await A.talk([[null, '守鐘的石像睜開了眼睛。', 'The stone bell-warden opens its eyes.']]);
      await A.battle([boss], { boss: true, bg: 'tower' });
      A.set('statue_' + boss);
    }, { when: (A) => !A.flag('statue_' + boss) }));
  });
  const sp5 = M.spire_5;
  sp5.triggers.push(trig(...K.endRoom(sp5), async (A) => { A.warp('throne', 10, 8, 'up'); }));
  const th = M.throne;
  th.entry = [10, 8, 'up'];
  th.npcs.push(npc(10, 1, 'vissek', null, { when: (A) => !A.flag('final_done') }));
  th.onEnter = finale;
}
const nameOf = (k) => (ITEMS[k] || GEAR[k] || { name: [k, k] }).name;

// ---------------------------------------------------------------- the High Conductor at the top of the Tower of Rest
async function finale(A) {
  if (A.flag('final_done')) return;
  await A.chapter(34);
  const lines = [
    ['orsay', '……你們來了。這座塔的頂端，是全世界最安靜的地方。', '…You came. The top of this tower is the quietest place in the world.'],
    ['orsay', '我只想問你們一件事。為什麼還要聲音？聲音只會帶來失去。最後一聲，總是最痛的。', 'I only want to ask you one thing. Why do you still want sound? Sound only brings loss. And the last sound always hurts the most.'],
    ['orsay', '告訴我，你們寧願痛，也要聽見的理由。', 'Tell me why you would rather hurt, and hear.'],
  ];
  const answers = {
    rowan: ['因為我還有信要送。收件人，叫艾莉雅。', 'Because I\'ve still got a letter to deliver. It\'s addressed to Aria.'],
    selene: ['因為鐘聲是用來叫醒人的。不是用來讓人睡著的。', 'Because a bell is for waking people. Not for putting them to sleep.'],
    edmund: ['因為沙漠的風，本來就會唱歌。我只是把它聽完而已。', 'Because the desert wind has always sung. I just listen to the end of the song.'],
    sai: ['因為那些聽不見的孩子，比誰都更想跳舞。', 'Because the children who can\'t hear want to dance more than anyone.'],
    kiriyu: ['因為我太太說，等聲音回來，她就會醒。', 'Because my wife said that when the sound comes back, she\'ll wake.'],
    galan: ['因為奶奶記得我的哨音！', 'Because Grandma remembers my whistle!'],
    regis: ['因為寧波斯的歌，我還沒聽夠。', 'Because I haven\'t heard enough of Nimbus\'s song.'],
    nightcrow: ['……因為灰羽叫我的時候，我想聽見。', '…Because when Greyfeather calls me, I want to hear it.'],
    lili: ['因為樂譜是寫給人唱的！不是寫給人收著的！', 'Because a score is written to be sung! Not to be kept in a drawer!'],
    bolo: ['因為學生在叫我「老師」。老頭子活著，就是為了這個。', 'Because my student calls me "teacher". That\'s what an old man lives for.'],
    moka: ['因為雪狐的歌，要唱給下一隻小狐狸聽！', 'Because the foxes\' songs have to be sung to the next little fox!'],
    uma: ['轟！', 'BOOM!'],
    kagami: ['……因為我想模仿你們的「明天」。明天，一定有聲音。', '…Because I want to copy your "tomorrow". And tomorrow will surely have sound.'],
  };
  await A.talk(lines);
  for (const id of A.S.roster) if (answers[id]) await A.talk([[id, ...answers[id]]]);
  const notes = Math.min(8, A.count('dragons'));
  await A.talk([
    ['orsay', '……是嗎。你們都是很溫柔的人。可是溫柔的人，最受不了失去。', '…I see. You are all such gentle people. But the gentle are the ones who cannot bear to lose.'],
    ['rowan', '所以我們才要把她找回來。', 'That\'s why we came to bring her back.'],
    [null, notes >= 8 ? '洛恩舉起貝殼。八個音從貝殼裡飛出來，大家一起唱出了那段旋律——' : `洛恩舉起貝殼。${notes} 個音從貝殼裡飛出來，大家用自己的聲音，補上了缺少的部分——`, notes >= 8 ? 'Rowan raises the shell. Eight notes fly out of it, and everyone sings the melody together—' : `Rowan raises the shell. ${notes} notes fly out of it, and everyone fills in the missing ones with their own voices—`],
    [null, '歌聲裡，一個沒有影子的女孩，慢慢地有了形狀。', 'In the song, a girl with no shadow slowly takes shape.'],
    ['aria', notes >= 8 ? '……洛恩。我收到了。大家的歌，全部都收到了。' : '……洛恩？……你們是……我好像……認識你們……', notes >= 8 ? '…Rowan. I got it. I got every one of your songs.' : '…Rowan? …You all… I think… I know you…'],
    ['orsay', '……艾莉雅。', '…Aria.'],
    ['aria', '爸爸。我現在，有自己的聲音了。所以我要用它，對你說「不」。', 'Father. I have my own voice now. So I\'m going to use it to tell you "no".'],
  ]);
  A.catchUp('aria', Math.round(A.avgLv()));
  await A.join('aria');
  if (notes >= 8) A.set('aria_whole');
  const forms = ['god1', 'god2', 'god3'];
  for (let i = 0; i < forms.length; i++) {
    await A.talk([[null, '（選出四個人迎戰。）', '(Choose four to face him.)']]);
    await A.pickParty(4);
    await A.battle([forms[i]], { boss: true, bg: 'tower', music: 'final' });
    if (i < 2) { A.heal(); await A.talk([[null, '……同伴們的聲音，讓倒下的人又站了起來。', '…Their friends\' voices lift the fallen to their feet again.']]); }
    if (i < 2) await A.talk([['orsay', i === 0 ? '……還不夠安靜嗎？那就讓沉默聖歌，為你們唱完最後一段。' : '那就由我自己，成為終止符吧——', i === 0 ? '…Not quiet enough yet? Then let the Silent Hymn sing you its final verse.' : 'Then I shall become the Final Rest myself—']]);
  }
  await A.talk([
    ['orsay', '……好吵啊。可是……為什麼，這麼溫暖……', '…So noisy. And yet… why is it so warm…'],
    ['aria', '爸爸，你累了吧。從七歲那天起，你就一直醒著。', 'Father, you\'re tired, aren\'t you. Ever since you were seven, you\'ve never stopped keeping watch.'],
    ['aria', '這次換我唱。你睡吧。', 'This time I\'ll sing. You sleep.'],
    [null, '艾莉雅唱起了一首搖籃曲。那是歐瑟以前每天晚上，唱給她聽的那一首。', 'Aria sings a lullaby. The very one Orsay used to sing to her every night.'],
    ['orsay', '……三分鐘。……原來，鐘聲響起來的時候……是這樣的聲音啊……', '…Three minutes. …So this is what it sounds like… when the bell finally rings…'],
    [null, '大指揮者歐瑟，安心地睡著了。', 'Orsay, the High Conductor, falls peacefully asleep.'],
  ]);
  A.set('final_done');
  return A.ending();
}
