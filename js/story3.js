// ASH ARIA — Act III 轉 · The Fall (the Solitary Isle, Tidewatch, Nikko) and Act IV 合 · Requiem (finding everyone again,
// the eight dragons, the Colosseum, the Spire of Judgement and the god on his throne).
import { ITEMS, GEAR } from './data.js?v=1';
const ch = (A) => A.S.ch;
const has = (A, id) => A.hasMember(id);

// ---------------------------------------------------------------- the Fall: one year later, Selene alone
export async function actThree(A) {
  A.S.world = 'r'; A.airship(null);
  const lv = Math.round(A.avgLv());
  A.S.roster = ['selene'];
  A.catchUp('selene', lv);
  A.setParty(['selene']);
  A.heal();
  await A.chapter(18);
  A.warp('solitary', 11, 6, 'up');
  await A.talk([
    [null, '……', '…'],
    ['tobin', '……醒了嗎？妳睡了整整一年喔，瑟琳娜。', '…Awake? You\'ve been asleep a whole year, Selene.'],
    ['selene', '……一年？……大家呢？洛恩呢？', '…A year? …Where is everyone? Where\'s Rowan?'],
    ['tobin', '我不知道。我在海邊撿到妳的時候，只有妳一個人。', 'I don\'t know. When I found you on the beach, you were alone.'],
    ['tobin', '那一天，世界壞掉了。天空變成了紅色，大地裂成了好幾塊。維瑟克在世界中心蓋了一座塔，自稱是神。', 'That day the world broke. The sky turned red and the land cracked into pieces. Vissek built a tower at the centre of the world and calls himself a god.'],
    ['tobin', '從塔上射下來的「審判之光」，會把反抗他的城鎮燒成灰。人們已經不敢抬頭看天空了。', 'The Light of Judgement shoots down from his tower and burns any town that defies him. People no longer dare to look up at the sky.'],
    ['tobin', '咳、咳……這座島上只剩下我們兩個了。我的身體也……不行了。', '*cough, cough*… There\'s only the two of us left on this island. And my body is… failing.'],
    ['selene', '爺爺！', 'Grandpa!'],
    ['tobin', '如果……能吃點新鮮的魚，也許會好一點……', 'Perhaps… if I had some fresh fish, I\'d feel better…'],
  ]);
  A.goal('到島南邊的沙灘抓魚（面向海按確定），拿回來給托賓爺爺吃。動作快的魚比較好。', 'Catch fish on the beach in the south of the island (face the sea and press OK), and bring them to Grandpa Tobin. The quick fish are the good ones.');
  A.set('tobin_hp', 26);
}

const FISH = [[['又大又活潑的魚', 'a big, lively fish'], 14], [['普通的魚', 'an ordinary fish'], 6], [['游得很慢的魚', 'a slow, sickly fish'], -9]];
export function act34(M, K) {
  const { npc, trig, chat } = K;
  // ================================================================ the Solitary Isle (chapter 18)
  const so = M.solitary;
  so.entry = [11, 6, 'up'];
  so.npcs.push(npc(12, 5, 'tobin', async (A) => {
    if (A.flag('tobin_end')) return A.talk([['tobin', A.flag('tobin_alive') ? '去吧，瑟琳娜。木筏就在沙灘上。' : '……', A.flag('tobin_alive') ? 'Go on, Selene. The raft is on the beach.' : '…']]);
    const fish = A.S.flags.fish;
    if (!fish) return A.talk([['tobin', '咳、咳……', '*cough, cough*…']]);
    delete A.S.flags.fish; A.S.flags.tobin_hp += FISH[fish - 1][1]; A.inc('fed');
    await A.talk([['selene', `爺爺，我抓到了${A.T(...FISH[fish - 1][0])}。`, `Grandpa, I caught ${A.T(...FISH[fish - 1][0])}.`], ['tobin', fish === 1 ? '真好吃……身體暖起來了。' : fish === 2 ? '謝謝妳……' : '……嗯……（他吃得很勉強）', fish === 1 ? 'Delicious… I feel warmer.' : fish === 2 ? 'Thank you…' : '…Mm… (he struggles to eat it)']]);
    if (A.count('fed') < 4) return;
    A.set('tobin_end');
    if (A.S.flags.tobin_hp >= 50) {
      A.set('tobin_alive');
      await A.talk([
        ['tobin', '瑟琳娜，謝謝妳。我好多了。', 'Selene, thank you. I\'m much better.'],
        ['tobin', '其實……我在地下室造了一艘木筏。我本來想自己出海，去找我的孫女。', 'Truth is… I built a raft in the cellar. I meant to sail off myself, to find my granddaughter.'],
        ['tobin', '妳拿去吧。去找妳的同伴。我會在這裡等，等世界變好。', 'You take it. Go find your friends. I\'ll wait here, for the world to get better.'],
      ]);
      return cliff(A);
    }
    await A.talk([
      ['tobin', '……瑟琳娜……對不起……我好像……撐不下去了……', '…Selene… I\'m sorry… I don\'t think… I can hold on…'],
      ['tobin', '妳……一定要……活下去……', 'You… must… live…'],
      [null, '托賓爺爺，在一個安靜的午後，睡著了。再也沒有醒來。', 'Grandpa Tobin fell asleep one quiet afternoon. He never woke again.'],
    ]);
    return cliff(A);
  }));
  for (let x = 11; x <= 17; x++) so.checks[`${x},13`] = async (A) => {
    if (A.flag('tobin_end')) return;
    if (A.S.flags.fish) return A.talk([[null, '已經抓到一條魚了。先拿回去給爺爺吧。', 'You already have a fish. Bring it to Grandpa first.']]);
    const r = Math.random(), f = r < 0.4 ? 1 : r < 0.8 ? 2 : 3;
    A.S.flags.fish = f;
    await A.talk([[null, `瑟琳娜抓到了${A.T(...FISH[f - 1][0])}。`, `Selene catches ${A.T(...FISH[f - 1][0])}.`]]);
  };
  so.triggers.push(trig(7, 2, 8, 2, async (A) => {
    await A.talk([
      [null, '海崖。紅色的天空下，大海一望無際。', 'The cliff. Under the red sky the sea goes on forever.'],
      ['selene', '……大家都不在了。洛恩也是。', '…They\'re all gone. Rowan too.'],
      ['selene', '我活下來，又有什麼意義……', 'What is the point of my surviving…'],
      [null, '一隻海鳥搖搖晃晃地飛了過來，停在瑟琳娜的腳邊。', 'A seabird flutters unsteadily over and lands at Selene\'s feet.'],
      [null, '牠的翅膀上，綁著一條藍色的頭巾。', 'Around its wing is tied a blue bandana.'],
      ['selene', '……這是……洛恩的頭巾……', '…This is… Rowan\'s bandana…'],
      ['selene', '他還活著。他還活著……！', 'He\'s alive. He\'s ALIVE…!'],
      ['selene', '洛恩，我一直說「我不需要被保護」。現在換我來找你了。', 'Rowan, I always said "I don\'t need protecting." Now it\'s my turn to find you.'],
    ]);
    A.give('bandana');
    await A.talk([[null, A.flag('tobin_alive') ? '瑟琳娜把托賓爺爺的木筏推下了海。' : '瑟琳娜在地下室找到了托賓爺爺留下的木筏，和一張紙條：「給瑟琳娜。活下去。」', A.flag('tobin_alive') ? 'Selene pushes Grandpa Tobin\'s raft out to sea.' : 'In the cellar Selene finds the raft Grandpa Tobin left behind, and a note: "For Selene. Live."']]);
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
        [null, '潮望鎮。房子一半倒塌了，人們低著頭走路。', 'Tidewatch. Half the houses have fallen; the people walk with their heads down.'],
        [null, '遠方的天空，一道白光從世界中心的塔上射出，燒掉了一座山頭。', 'Far off, a white beam lances from the tower at the world\'s centre and burns away a hilltop.'],
        ['man', '……又來了。審判之光。昨天是東邊的村子，今天是那座山。', '…There it goes again. The Light of Judgement. Yesterday the village to the east, today that mountain.'],
        ['woman', '反抗維瑟克的人，都被燒掉了。現在大家只希望，下一個不是自己。', 'Everyone who stood against Vissek was burned. Now all anyone hopes is that they aren\'t next.'],
      ]);
      A.goal('在鎮上打聽消息。聽說北方的尼可鎮有個盜賊頭子，在找「會飛的東西」。', 'Ask around town. They say a thief chief in Nikko, to the north, is looking for "something that flies".');
    }
  };
  tw.npcs.push(
    chat(10, 9, 'man', [[null, [['man', '北邊的尼可鎮，有一群盜賊在幫人搬東西過裂谷。帶頭的叫傑瑞。', 'Up north in Nikko, a band of thieves ferries people across the rifts. Their boss is called Jerry.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '我的丈夫在世界崩壞的那天出海，再也沒有回來。……可是，我還在等。', 'My husband went to sea the day the world broke. He never came back. …But I\'m still waiting.']]]]),
    chat(24, 9, 'child', [[null, [['child', '大人們說，世界就要結束了。……那我還要不要寫功課？', 'The grown-ups say the world is ending. …So do I still have to do my homework?']]]]),
    npc(10, 15, 'sailor', async (A) => {
      if (A.flag('got_leviath') || !A.flag('sularis_up')) return A.talk([['fisher', '海裡有一隻巨大的海龍。牠在海底睡覺，不會傷人。', 'There is a huge sea dragon in the deep. It sleeps on the sea floor and harms no one.']]);
      await A.talk([['fisher', '你們在對抗那座塔？……這是我在網裡撈到的。會發光的石頭。拿去吧。', 'You\'re fighting that tower? …I pulled this out of my nets. A glowing stone. Take it.']]);
      A.set('got_leviath'); await A.astral('leviath');
    }),
  );
  // ================================================================ Nikko: Edmund, Regis (chapters 20, 22)
  const nk = M.nikko;
  nk.npcs.push(
    npc(6, 3, 'edmund', async (A) => {
      if (has(A, 'edmund')) return;
      await A.talk([
        ['thief', '老大，有個女人在找你。', 'Boss, some woman\'s looking for you.'],
        ['edmund', '我是傑瑞，盜賊團的老大。小姐有什麼事——', 'I\'m Jerry, chief of this band. What can I do for you, miss—'],
        ['selene', '……艾德蒙？', '…Edmund?'],
        ['edmund', '噓！噓噓噓！小聲一點！', 'Shh! Shhh! Keep your voice down!'],
        ['edmund', '（小聲）這些盜賊知道一條路，能回到蘇拉斯城。城堡卡在沙底下，出不來了。我假扮成盜賊頭子，就是要讓他們帶我回去。', '(whispering) These thieves know a way back to Sularis. The castle is stuck under the sand. I\'m posing as their chief so they\'ll lead me there.'],
        ['selene', '……你一點都沒變。', '…You haven\'t changed a bit.'],
        ['edmund', '妳也是。還是那麼漂亮。……瑟琳娜，妳活著，真好。', 'Nor have you. Still beautiful. …Selene, I\'m so glad you\'re alive.'],
        ['selene', '……嗯。', '…Mm.'],
      ]);
      await A.join('edmund'); A.free(); await A.chapter(21);
      A.goal('前往西方沙漠的「沉沙之城」，讓蘇拉斯城浮上來。', 'Go to the Sunken Sularis in the western desert and bring the castle back up.');
    }),
    npc(7, 3, 'regis', async (A) => {
      if (has(A, 'regis')) return;
      await A.talk([
        ['regis', '……（喝醉了）……世界都完了。飛空艇也沒了。還有什麼好賭的……', '…(drunk)… The world\'s finished. The airship\'s gone. What\'s left to bet on…'],
        ['edmund', '雷吉斯，你還有一艘飛空艇。芙蕾雅的「金翼號」。', 'Regis, you still have an airship. Freya\'s Goldwing.'],
        ['regis', '……她死了。她的船，跟她一起埋在西南方的墓裡。', '…She\'s dead. Her ship\'s buried with her, in the tomb to the south-west.'],
        ['selene', '那就去把它挖出來。你不是賭徒嗎？賭一次，世界還有救。', 'Then let\'s dig it out. Aren\'t you a gambler? Bet once more that the world can be saved.'],
        ['regis', '……哈。被將軍大人說教了。……好吧，我賭。', '…Ha. Lectured by the general. …All right. I\'m in.'],
      ]);
      await A.join('regis');
      A.set('regis_back');
      A.goal('前往西南方的芙蕾雅之墓，找到飛空艇「金翼號」。', 'Go to Freya\'s Tomb in the south-west and find the airship Goldwing.');
    }, { when: (A) => A.flag('sularis_up') }),
    chat(15, 15, 'oldman', [[null, [['oldman', '世界崩壞那天，我在山上看到一隻岩石巨人，牠把一個孩子護在懷裡。', 'The day the world broke, I saw a stone giant on the mountain. It was sheltering a child in its arms.']]], [(A) => A.flag('sularis_up'), [['oldman', '那個岩石巨人化成了石頭……這顆石頭給你們吧。', 'That stone giant turned into a stone… take it.'], (A) => A.astral('golem')]]]),
  );
  M.r_sularis.gate = (A) => (!has(A, 'edmund') ? [[null, '流沙底下傳來機器的聲音。', 'The sound of machinery rises from beneath the quicksand.']] : null);
  const rs2 = M.r_sularis_2;
  rs2.triggers.push(trig(...K.endRoom(rs2), async (A) => {
    await A.talk([['edmund', '引擎被什麼東西纏住了……是觸手！', 'Something has the engine… tentacles!']]);
    await A.battle(['tentaclex'], { boss: true, bg: 'castle' });
    await A.talk([
      ['edmund', '引擎啟動！蘇拉斯城，上浮！', 'Engines on! Sularis, surface!'],
      [null, '轟隆隆隆……一年來第一次，蘇拉斯城見到了天空。', 'RRRUMBLE… for the first time in a year, Sularis Castle sees the sky.'],
      ['edmund', '城堡的地下室裡，有一顆古老的星晶。拿去吧。', 'There\'s an ancient Astral crystal in the castle cellar. Take it.'],
    ]);
    await A.astral('alexis'); await A.astral('odin');
    A.set('sularis_up');
    await A.chapter(22);
    A.goal('找回散落各地的同伴（任何順序都可以）。尼可鎮的酒館裡，好像有個喝醉的船長。', 'Find your scattered friends — in any order. There seems to be a drunken captain in the pub at Nikko.');
    A.warp('sularis', 12, 18, 'up');
  }, { when: (A) => !A.flag('sularis_up') }));
  for (const p of [M.ruin.places.find((q) => q.id === 'r_sularis')]) p.to = (A) => (A.flag('sularis_up') ? 'sularis' : null);
  for (const n of M.sularis.npcs) if (n.keeper) { const base = n.talk; n.talk = (A) => (A.flag('sularis_up') ? A.shop(n.look === 'miner' ? 'tools' : n.look === 'merchant' ? 'item' : 'weapon', 6) : base(A)); }
  M.sularis.exitTo = null;
  // ================================================================ Freya's Tomb: the Goldwing
  M.tomb.gate = (A) => (!A.flag('regis_back') ? [[null, '一座沉默的墓。門上刻著「芙蕾雅」。', 'A silent tomb. On the door is carved "Freya".']] : null);
  const tb3 = M.tomb_3;
  tb3.triggers.push(trig(...K.endRoom(tb3), async (A) => {
    await A.talk([['regis', '墓的守衛……芙蕾雅，妳到死都這麼難搞。', 'The tomb has a guardian… Freya, you were trouble right to the end.']]);
    await A.battle(['tombking'], { boss: true, bg: 'dark' });
    await A.talk([
      [null, '墓的最深處，一艘金色的飛空艇靜靜地停在那裡。', 'In the deepest chamber, a golden airship rests in silence.'],
      ['regis', '芙蕾雅……我們以前比賽，看誰的船飛得比較快。妳總是贏。', 'Freya… we used to race to see whose ship was faster. You always won.'],
      ['regis', '然後有一天，妳的船在試飛的時候墜毀了。我一直在想，如果那天我陪妳一起飛……', 'Then one day your ship went down on a test flight. I\'ve always wondered — if I\'d flown with you that day…'],
      ['regis', '……我借妳的船一下。這次，我要飛到一個妳會喜歡的天空。', '…I\'m borrowing your ship. This time I\'ll fly to a sky you\'d have loved.'],
      [null, '飛空艇「金翼號」，起飛。', 'The airship Goldwing takes flight.'],
    ]);
    A.set('goldwing');
    A.airship('goldwing', [24, 46]);
    A.world(25, 46, 'down', 'r');
    A.goal('有了飛空艇，就能去世界的任何地方。找回所有同伴，然後前往世界中心的審判之塔。', 'With an airship you can go anywhere. Find all your friends, then head for the Spire of Judgement at the centre of the world.');
  }, { when: (A) => !A.flag('goldwing') }));
  // ================================================================ Crumbleton: Sai, Lili
  const cr = M.crumbleton;
  cr.npcs.push(
    npc(6, 3, 'sai', async (A) => {
      await A.talk([
        ['sai', '……嗯？是你們……我現在……有點忙……', '…Hm? Oh, it\'s you… I\'m a bit… busy right now…'],
        ['edmund', '賽伊！你在做什麼？', 'Sai! What are you doing?'],
        ['sai', '這間房子快倒了。裡面還有個孩子。我撐著屋頂，等她出去……撐了好一陣子了。', 'This house is about to fall. There\'s a child still inside. I\'m holding up the roof till she gets out… I\'ve been at it a while.'],
        ['child', '叔叔……我的腳卡住了……', 'Mister… my foot\'s stuck…'],
        ['selene', '我來！', 'I\'ve got her!'],
        [null, '瑟琳娜把孩子拉了出來。下一秒，屋頂轟然倒塌。', 'Selene pulls the child free. A heartbeat later, the roof crashes down.'],
        ['sai', '呼……好險。哥哥，好久不見。', 'Phew… close one. Long time no see, brother.'],
      ]);
      await A.join('sai'); A.quake(0.8);
      await A.talk([['child', '謝謝！這是我在瓦礫裡撿到的石頭，會發光喔！', 'Thank you! I found this stone in the rubble — it glows!']]);
      await A.astral('terrato');
    }, { when: (A) => !has(A, 'sai') }),
    npc(15, 15, 'lili', async (A) => {
      await A.talk([
        ['lili', '……我在畫畫。畫世界崩壞之前的樣子。我怕忘記。', '…I\'m painting. Painting the world the way it was before. I\'m scared I\'ll forget.'],
        ['lili', '爺爺他……加入了崇拜維瑟克的教團。他說，維瑟克是神。爺爺才不是那種人！', 'Grandpa… joined the cult that worships Vissek. He says Vissek is a god. Grandpa isn\'t like that!'],
        ['lili', '我要去把爺爺帶回來。帶我一起去！', 'I\'m going to bring Grandpa back. Take me with you!'],
      ]);
      await A.join('lili');
      A.goal('（莉莉）教團的高塔在東南方。去把波洛爺爺帶回來。', '(Lili) The cult\'s tower is in the south-east. Bring Grandpa Bolo back.');
    }, { when: (A) => !has(A, 'lili') }),
    chat(10, 9, 'woman', [[null, [['woman', '傾城的房子都歪了。可是我們還住在這裡。不然，還能去哪裡呢？', 'Every house in Crumbleton leans. But we still live here. Where else would we go?']]]]),
  );
  // ================================================================ Hopehaven: Aria
  const hh = M.hopehaven;
  hh.npcs.push(
    npc(6, 3, 'aria', async (A) => {
      if (!A.flag('hope_visit')) {
        A.set('hope_visit');
        return A.talk([
          ['aria', '……大家。你們還活著。', '…Everyone. You\'re alive.'],
          ['aria', '世界崩壞的那天，這個村子的大人全都死了。只剩下這些孩子。我留下來照顧他們。', 'The day the world broke, every adult in this village died. Only the children were left. I stayed to look after them.'],
          ['aria', '……可是，我拿不起劍了。每次拿起劍，手就會發抖。', '…But I can\'t lift a sword any more. Every time I try, my hands shake.'],
          ['aria', '我以前不懂什麼是「愛」。可是和這些孩子在一起……我好像，開始懂了。', 'I never understood what "love" was. But with these children… I think I\'m starting to.'],
          ['aria', '對不起。我不能跟你們走。', 'I\'m sorry. I can\'t go with you.'],
          [null, '（等找回更多同伴之後，再回來看看艾莉雅吧。）', '(Come back to see Aria once you\'ve found more of your friends.)'],
        ]);
      }
      return A.talk([['aria', '孩子們今天很乖。', 'The children were good today.']]);
    }, { when: (A) => !has(A, 'aria') }),
    chat(15, 9, 'girl', [[null, [['katie', '艾莉雅姊姊每天晚上都會唱歌給我們聽。是一首關於灰燼的歌。', 'Every night Aria sings to us. A song about ashes.']]]]),
    chat(10, 15, 'child', [[null, [['child', '有一隻好大的怪物，常常在村子外面走來走去。艾莉雅姊姊說不要出去。', 'There\'s a huge monster that walks around outside the village. Aria says we mustn\'t go out.']]]]),
  );
  hh.onEnter = async (A) => {
    if (!A.flag('hope_visit') || has(A, 'aria') || A.S.roster.length < 6) return;
    await A.talk([
      ['child', '怪物！怪物來了！', 'The monster! The monster\'s here!'],
      ['aria', '孩子們，躲到屋子裡！……我、我得去……', 'Children, get inside! …I… I have to…'],
      ['rowan', '艾莉雅，交給我們！', 'Aria, leave it to us!'],
    ]);
    await A.battle(['hopefiend'], { boss: true, bg: 'ruin' });
    await A.talk([
      ['aria', '……我看到了。你們為了保護這些孩子，拚了命地戰鬥。', '…I saw it. You fought with everything you had, to protect these children.'],
      ['aria', '我也想保護他們。不是因為我是武器——是因為我愛他們。', 'I want to protect them too. Not because I\'m a weapon — because I love them.'],
      [null, '艾莉雅握起了劍。她的手，不再發抖了。', 'Aria takes up her sword. Her hands no longer shake.'],
      ['katie', '艾莉雅姊姊，一定要回來喔！', 'Aria, you have to come back!'],
      ['aria', '嗯。我答應妳。', 'I will. I promise.'],
    ]);
    await A.join('aria'); A.set('aria_back');
    await A.astral('starlet'); await A.astral('quetza');
  };
  // ================================================================ the Castle of Nightmares: Kiriyu
  const dr = M.dream;
  dr.triggers.push(trig(dr.anchor.start[0] - 2, dr.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      [null, '霞之國的廢墟。桐生倒在城門口，沉沉地睡著。', 'The ruins of Kasumi. Kiriyu lies at the castle gate, deep asleep.'],
      ['sai', '桐生！醒醒！……叫不醒。', 'Kiriyu! Wake up! …He won\'t wake.'],
      [null, '一股黑色的霧從他的身上冒出來。……有東西，鑽進了他的夢裡。', 'A black mist seeps from his body. …Something has crawled inside his dreams.'],
    ]);
  }, { when: (A) => !has(A, 'kiriyu') }));
  const dr3 = M.dream_3;
  dr3.triggers.push(trig(...K.endRoom(dr3), async (A) => {
    await A.talk([
      [null, '夢的最深處。櫻花樹下，桐生的妻子和兒子在等他。', 'The deepest dream. Under a cherry tree, Kiriyu\'s wife and son are waiting for him.'],
      ['mina', '老公，留在這裡吧。這裡沒有戰爭，沒有痛苦。', 'Stay here, dear. There\'s no war here, no pain.'],
      ['ren', '爸爸，陪我看櫻花！', 'Daddy, watch the blossoms with me!'],
      ['kiriyu', '……我好想留下來。', '…I want so much to stay.'],
      ['kiriyu', '可是美奈，妳說過，要我很久很久以後再去。……而且，真正的妳，不會要我逃走。', 'But Mina, you told me to come only after a long, long time. …And the real you would never want me to run away.'],
      ['kiriyu', '夢魔，現出原形吧！', 'Dreamwraith, show yourself!'],
    ]);
    await A.battle(['nightmare'], { boss: true, bg: 'dark' });
    await A.talk([
      ['kiriyu', '……美奈，廉。再見了。', '…Mina. Ren. Farewell.'],
      ['kiriyu', '我不再為復仇拔刀了。從今天起，這把刀，是為了守護還活著的人。', 'I no longer draw for vengeance. From today, this blade protects those still living.'],
    ]);
    await A.join('kiriyu'); await A.astral('raiden');
  }, { when: (A) => !has(A, 'kiriyu') }));
  // ================================================================ the Phoenix Cave: Rowan
  const pc3 = M.phoenixcave_3;
  pc3.triggers.push(trig(...K.endRoom(pc3), async (A) => {
    await A.talk([['selene', '洛恩一定在這裡。他說過，他在找「不死鳥」……', 'Rowan must be here. He said he was searching for the Phoenix…']]);
    await A.battle(['phoenixguard'], { boss: true, bg: 'cave' });
    await A.talk([
      ['rowan', '……瑟琳娜？', '…Selene?'],
      ['selene', '洛恩！', 'Rowan!'],
      ['rowan', '妳收到頭巾了？……我綁在受傷的海鳥身上，希望牠能飛到有人的地方。', 'You got the bandana? …I tied it to a wounded gull, hoping it would reach someone.'],
      ['rowan', '我一直在找不死鳥的星晶。傳說它能讓死去的人醒來。我想讓瑟恩醒來……那個我沒能保護的人。', 'I\'ve been searching for the Phoenix crystal. They say it can wake the dead. I wanted to wake Seren… the one I couldn\'t protect.'],
      [null, '洞窟深處，一顆燃燒的星晶亮了起來。一個女孩的身影浮現在火光裡。', 'Deep in the cave a burning crystal flares up. A girl\'s shape appears in the firelight.'],
      ['seren', '洛恩……謝謝你，一直記著我。', 'Rowan… thank you for never forgetting me.'],
      ['seren', '可是，不要再為了我停下腳步了。去愛現在在你身邊的人吧。', 'But don\'t stop your life for me any more. Love the one beside you now.'],
      ['rowan', '瑟恩……', 'Seren…'],
      ['seren', '再見了。', 'Goodbye.'],
      ['rowan', '……瑟琳娜。我以前總是說「我會保護妳」。', '…Selene. I always used to say "I\'ll protect you."'],
      ['selene', '我知道。', 'I know.'],
      ['rowan', '其實，我是怕又失去一個人。……我們一起走吧。', 'The truth is, I was afraid of losing someone again. …Let\'s go on together.'],
      ['selene', '……嗯。', '…Mm.'],
    ]);
    await A.join('rowan'); await A.astral('phoenix');
  }, { when: (A) => !has(A, 'rowan') }));
  // ================================================================ the old hut on the Wildlands: Galan
  const wh = M.r_wildhut;
  wh.npcs.push(
    npc(15, 9, 'galan', async (A) => {
      if (!A.has('meat')) return A.talk([['galan', '……咕嚕嚕。（嘉藍餓了。小屋的店裡有賣乾肉。）', '…Grrrowl. (Galan is hungry. The hut\'s shop sells dried meat.)']]);
      A.take('meat');
      await A.talk([['galan', '肉！是你們！嘉藍好想你們！', 'Meat! It\'s you! Galan missed you!']]);
      await A.join('galan');
    }, { when: (A) => !has(A, 'galan') }),
    npc(6, 3, 'oldman', async (A) => {
      if (!has(A, 'galan') || A.flag('galan_father')) return A.talk([['father', '……我有個兒子。他出生的那天，他媽媽死了。我說他是惡魔……', '…I had a son. His mother died the day he was born. I called him a demon…']]);
      A.set('galan_father');
      await A.talk([
        ['galan', '……爸爸？', '…Daddy?'],
        ['father', '你是誰？……我不認得你。', 'Who are you? …I don\'t know you.'],
        ['father', '我有個兒子。十三年前，我把他丟在荒原上。我是個糟糕的父親。', 'I had a son. Thirteen years ago I left him on the Wildlands. I was a terrible father.'],
        ['father', '如果他還活著……我希望他過得好。希望他有很多朋友，每天都吃得飽飽的。', 'If he\'s still alive… I hope he\'s doing well. I hope he has lots of friends and plenty to eat every day.'],
        ['galan', '……嗯。他過得很好。他有很多朋友。', '…Mm. He\'s doing well. He has lots of friends.'],
        ['sai', '嘉藍，你不告訴他嗎？', 'Galan, aren\'t you going to tell him?'],
        ['galan', '不用了。爸爸開心就好。', 'No. Daddy\'s happy. That\'s enough.'],
      ]);
    }),
  );
  // ================================================================ the Colosseum: Nightcrow, the betting, the Old God
  const co = M.colosseum;
  const BETS = { mithrilblade: ['icebrand', ['chimera', 'chimera']], flametongue: ['crystalsword', ['behemoth']], diamondvest: ['genjiarmor', ['spireknight']], crystalsword: ['ragnarok', ['spireknight', 'spiremage']], murasame: ['strato', ['darkknight', 'darkknight']], elixir: ['offering', ['behemoth', 'behemoth']], ribbon: ['heroring', ['spirebeast', 'spirebeast']], goldarmor: ['crystalmail', ['dunefiend', 'darkknight']] };
  co.npcs.push(
    npc(5, 3, 'man', async (A) => {
      if (A.flag('nightcrow_alive') && !has(A, 'nightcrow')) {
        await A.talk([
          ['bookie', '今天的挑戰者，是一個戴面具的人。他說，他只跟「黎明的人」打。', 'Today\'s challenger is a masked man. He says he only fights "people of the dawn".'],
          ['nightcrow', '……讓我看看，你們這一年有沒有變強。', '…Show me whether you\'ve grown stronger this past year.'],
        ]);
        await A.battle(['colossus'], { boss: true, bg: 'castle' });
        await A.talk([['nightcrow', '……合格。灰牙，我們走。', '…You pass. Ashfang, let\'s go.'], ['lili', '是那隻狼！', 'It\'s the wolf!']]);
        await A.join('nightcrow');
        return;
      }
      if (A.count('dragons') >= 8 && !A.flag('oldgod')) {
        const i = await A.ask('莊家：「打倒了八龍的勇者們……審判之塔的地下，沉睡著比神更古老的東西。要挑戰嗎？」', 'Bookie: "Slayers of the Eight Dragons… beneath the Spire sleeps something older than any god. Will you face it?"', [['挑戰', 'Fight'], ['算了', 'Not now']]);
        if (i !== 0) return;
        await A.pickParty(4);
        await A.battle(['oldgod'], { boss: true, bg: 'dark', music: 'final' });
        A.set('oldgod'); return A.item('paladinshield');
      }
      // betting: put up a piece of gear, win something better
      const can = Object.keys(BETS).filter((k) => A.has(k));
      if (!can.length) return A.talk([['bookie', '想下注嗎？拿好東西來。（可以下注：秘銀劍、火炎劍、鑽石背心、水晶劍、村雨、靈藥、緞帶、黃金鎧甲）', 'Fancy a wager? Bring something good. (Bets taken: Mithril Blade, Flametongue, Diamond Vest, Crystal Sword, Murasame, Elixir, Ribbon, Gold Armour)']]);
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
  // ================================================================ the Tower of Zealots: Bolo
  const ct4 = M.culttower_4;
  ct4.triggers.push(trig(...K.endRoom(ct4), async (A) => {
    await A.talk([
      ['zealot', '維瑟克大人是神！毀滅是救贖！', 'Lord Vissek is god! Destruction is salvation!'],
      ['bolo', '……毀滅是救贖。對，沒錯……', '…Destruction is salvation. Yes, that\'s right…'],
      ['lili', '爺爺！你在說什麼傻話！', 'Grandpa! What nonsense are you saying?'],
      ['bolo', '……莉莉？……莉莉！妳還活著！我以為妳死了……我以為世界上什麼都不剩了……', '…Lili? …Lili! You\'re alive! I thought you were dead… I thought there was nothing left in the world…'],
      ['zealot', '叛徒！把他們燒掉！', 'Traitor! Burn them!'],
    ]);
    await A.battle(['flamelord', 'zealot'], { boss: true, bg: 'tower', lvUp: 16 });
    await A.talk([['bolo', '老糊塗了。莉莉，對不起。爺爺跟妳回家。', 'I\'m a foolish old man. Lili, I\'m sorry. Grandpa\'s coming home with you.']]);
    await A.join('bolo');
  }, { when: (A) => !has(A, 'bolo') }));
  // ================================================================ Frostvale and the Ice Cavern: Moka, Uma, Valion
  const rf = M.r_frostvale;
  rf.warps.push({ x: 12, y: 0, to: 'icecave' }, { x: 13, y: 0, to: 'icecave' });
  M.icecave.exitTo = ['r_frostvale', 12, 1];
  rf.npcs.push(
    npc(6, 3, 'moka', async (A) => {
      await A.talk([
        ['moka', '是你們！摩卡一直在等！雪狐族都躲到冰洞裡了，冰洞深處有個好大的雪人在搗亂。', 'It\'s you! Moka\'s been waiting! The snow foxes are hiding in the Ice Cavern, and a huge yeti deep inside is making trouble.'],
        ['moka', '還有……那隻冰裡的星靈，瓦里昂，也還在冰洞的最深處。', 'And… the Astral in the ice, Valion, is still at the very bottom of the cavern.'],
        [null, '（摩卡的「狐舞」：在不同的地形戰鬥就能學會新的舞。開始跳舞之後，她會一直跳下去。）', '(Moka\'s Dance: fighting on different ground teaches new dances. Once she starts dancing she keeps going.)'],
      ]);
      await A.join('moka');
    }, { when: (A) => !has(A, 'moka') }),
    npc(10, 3, 'oldman', [['jon', '艾莉雅……妳回來了嗎？……我老了，眼睛不好。不過我知道，那個孩子一定還活著。', 'Aria… is that you? …I\'m old, my eyes are poor. But I know that girl is still alive somewhere.']]),
  );
  const ic2 = M.icecave_2;
  ic2.triggers.push(trig(...K.endRoom(ic2), async (A) => {
    await A.talk([['uma', '吼喔喔喔喔——！', 'ROOOOAAARRR—!'], ['moka', '是烏瑪！他……他其實是好人！只是被骨頭怪物嚇壞了！', 'It\'s Uma! He… he\'s really nice! The bone monsters just scared him silly!']]);
    await A.battle(['icebone', 'icebone', 'icebone'], { bg: 'snow' });
    await A.talk([['uma', '……吼。（烏瑪拍了拍摩卡的頭。）', '…Roar. (Uma pats Moka on the head.)'], ['moka', '烏瑪說，他要跟大家一起去！', 'Uma says he\'s coming with everyone!'], [null, '（烏瑪不聽指揮，自己會戰鬥。）', '(Uma takes no orders — he fights on his own.)']]);
    await A.join('uma');
    await A.talk([['valion', '（……人類與星靈的孩子，和她的朋友們。我的力量，也借給你們吧。）', '(…The child of human and Astral, and her friends. Take my power, too.)']]);
    await A.astral('valion');
  }, { when: (A) => !has(A, 'uma') }));
  // ================================================================ the Quicksand: Kagami
  const wb2 = M.wormbelly_2;
  wb2.triggers.push(trig(...K.endRoom(wb2), async (A) => {
    await A.talk([[null, '沙蟲的胃裡，有個穿著長袍的人正在模仿沙蟲的動作。', 'In the sandworm\'s stomach, someone in a long robe is copying the worm\'s movements.'], ['kagami', '……', '…'], ['kagami', '「……」（鏡模仿了你的表情。）', '"…" (Kagami copies your expression.)']]);
    await A.battle(['sandworm2'], { boss: true, bg: 'dark' });
    await A.talk([['kagami', '我是鏡。我模仿一切。……我也想模仿，你們的旅行。', 'I am Kagami. I copy everything. …I would like to copy your journey, too.'], [null, '（鏡的「模仿」：重現同伴上一個行動，而且不用花 MP。）', '(Kagami\'s Mimic repeats an ally\'s last action — at no MP cost.)']]);
    await A.join('kagami');
  }, { when: (A) => !has(A, 'kagami') }));
  // ================================================================ the eight dragons
  const DR = ['reddragon', 'icedragon', 'stormdragon', 'earthdragon', 'holydragon', 'deaddragon', 'golddragon', 'skydragon'];
  DR.forEach((d, i) => {
    const m = M['lair' + (i + 1)];
    m.gate = (A) => (!A.flag('goldwing') ? [[null, '巨大的咆哮聲從洞裡傳出來。現在還不是時候。', 'A colossal roar rumbles from within. Not yet.']] : null);
    m.triggers.push(trig(...K.endRoom(m), async (A) => {
      await A.talk([[null, '封印被解開的古龍，從沉睡中醒來了。', 'An ancient dragon, its seal broken, wakes from its sleep.']]);
      await A.battle([d], { boss: true, bg: m.bg });
      A.set('dragon_' + d); A.inc('dragons');
      await A.talk([[null, `打倒了古龍！（${A.count('dragons')} / 8）`, `The dragon falls! (${A.count('dragons')} / 8)`]]);
      if (A.count('dragons') === 8) { await A.talk([[null, '八龍全部倒下了。龍之王，認同了你們。', 'All eight have fallen. The king of dragons acknowledges you.']]); await A.astral('bahamut'); }
    }, { when: (A) => !A.flag('dragon_' + d) }));
  });
  // ================================================================ the Spire of Judgement
  M.spire.gate = (A) => (!A.flag('aria_back') ? [[null, '塔的入口被一層紅色的光封住了。……也許，需要一個流著星靈之血的人。', 'A red light seals the Spire\'s entrance. …Perhaps it needs someone with Astral blood.']] : null);
  M.spire.onEnter = async (A) => {
    if (A.flag('spire_in')) return;
    A.set('spire_in');
    await A.chapter(33);
    await A.talk([
      ['aria', '……這座塔，是用崩壞的城鎮和星靈的屍骨堆起來的。', '…This tower is built from broken towns and the bones of Astrals.'],
      ['rowan', '維瑟克就在最頂端。選四個人跟我上去吧。', 'Vissek is at the very top. Pick four and let\'s climb.'],
      [null, '（塔裡有三尊守護神像。打倒它們，維瑟克的力量就會變弱。中途有存檔點。）', '(Three guardian statues stand in the Spire. Beat them and Vissek weakens. There are save points on the way.)'],
    ]);
    await A.pickParty(4, ['aria']);
    A.goal('登上審判之塔的頂端。', 'Climb to the top of the Spire of Judgement.');
  };
  [['spire_2', 'tower1'], ['spire_3', 'tower2'], ['spire_4', 'tower3']].forEach(([id, boss]) => {
    const m = M[id];
    m.triggers.push(trig(...K.endRoom(m), async (A) => {
      await A.talk([[null, '神像睜開了眼睛。', 'The statue opens its eyes.']]);
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

// ---------------------------------------------------------------- the god on his throne
async function finale(A) {
  if (A.flag('final_done')) return;
  await A.chapter(34);
  const lines = [
    ['vissek', '嘻嘻嘻……你們來了。來看看我的世界吧。很美吧？一切都在慢慢地壞掉。', 'Hee-hee-hee… you came. Look at my world. Isn\'t it lovely? Everything slowly falling apart.'],
    ['vissek', '你們為什麼還要戰鬥？反正一切都會消失。愛會消失，生命會消失，記憶會消失。', 'Why do you keep fighting? Everything will vanish anyway. Love vanishes, life vanishes, memory vanishes.'],
    ['vissek', '告訴我，你們活下去的理由是什麼？', 'Tell me — what is your reason to go on living?'],
  ];
  const answers = {
    aria: ['因為我愛那些孩子。愛不會因為會消失，就沒有意義。', 'Because I love those children. Love doesn\'t lose its meaning just because it ends.'],
    rowan: ['因為還有我想一起走下去的人。', 'Because there\'s someone I want to walk on with.'],
    selene: ['因為有人在海崖上，給了我一條頭巾。', 'Because on a cliff, someone gave me a bandana.'],
    edmund: ['因為我是國王。我的子民還在等明天。', 'Because I\'m a king. My people are waiting for tomorrow.'],
    sai: ['因為師父教我的拳，是用來保護人的。', 'Because the fists my master taught me are for protecting people.'],
    kiriyu: ['因為我答應過妻兒，要很久很久以後再去見他們。', 'Because I promised my wife and son I\'d see them only after a long, long time.'],
    galan: ['因為嘉藍，還想和大家一起吃肉！', 'Because Galan wants to eat meat with everyone some more!'],
    regis: ['因為我想飛到一個她會喜歡的天空。', 'Because I want to fly to a sky she\'d have loved.'],
    nightcrow: ['……因為，有個孩子在畫我的狼。', '…Because a child is painting my wolf.'],
    lili: ['因為我還想畫好多好多的畫！', 'Because I want to paint lots and lots more pictures!'],
    bolo: ['因為孫女笑了。老頭子活著，就是為了這個。', 'Because my granddaughter smiled. That\'s what an old man lives for.'],
    moka: ['因為雪地上的孩子們，還想跟雪狐玩！', 'Because the children in the snow still want to play with the foxes!'],
    uma: ['吼！', 'ROAR!'],
    kagami: ['……因為，我想模仿你們的「明天」。', '…Because I want to copy your "tomorrow".'],
  };
  await A.talk(lines);
  for (const id of A.S.roster) if (answers[id]) await A.talk([[id, ...answers[id]]]);
  await A.talk([
    ['vissek', '……愛？明天？哈……哈哈哈哈哈！真是無聊的答案！', '…Love? Tomorrow? Ha… ha-ha-ha-ha-ha! What boring answers!'],
    ['vissek', '那就讓我把那些無聊的東西，全部變成灰燼吧！', 'Then let me turn every boring little thing into ash!'],
    ['aria', '就算變成灰燼——我們也會在灰燼裡歌唱！', 'Even in the ashes — we will sing!'],
  ]);
  const forms = ['god1', 'god2', 'god3'];
  for (let i = 0; i < forms.length; i++) {
    await A.talk([[null, '（選出四個人迎戰。）', '(Choose four to face him.)']]);
    await A.pickParty(4);
    await A.battle([forms[i]], { boss: true, bg: 'tower', music: 'final' });
    if (i < 2) { A.heal(); await A.talk([[null, '……同伴們的聲音，讓倒下的人又站了起來。', '…Their friends\' voices lift the fallen to their feet again.']]); }
    if (i < 2) await A.talk([['vissek', i === 0 ? '嘻……嘻嘻……這只是開始！看看我真正的樣子吧！' : '還不夠嗎？那就讓我成為真正的神——！', i === 0 ? 'Hee… hee-hee… That was only the start! Behold my true form!' : 'Still not enough? Then I shall become a TRUE god—!']]);
  }
  await A.talk([
    ['vissek', '……為什麼……為什麼你們……要活……', '…Why… why do you… go on living…'],
    ['aria', '因為，我們想活。', 'Because we want to.'],
    [null, '虛無之神，化為了灰燼。', 'The god of nothing crumbles to ash.'],
  ]);
  A.set('final_done');
  return A.ending();
}
