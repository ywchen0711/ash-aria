// ASH ARIA — Act I 起 · Embers: Frostvale, Sularis, Mt. Kolan, the Dawnline, the three rivers, the battle on the snow,
// Rainhold and the opera.
const ch = (A) => A.S.ch;
const SC = { A: 'c6a_done', B: 'c6b_done', C: 'c6c_done' };

// ---------------------------------------------------------------- the three rivers: whose story next?
export async function scenario(A) {
  const left = [['A', ['洛恩的故事', 'Rowan\'s story']], ['B', ['賽伊的故事', 'Sai\'s story']], ['C', ['艾莉雅的故事', 'Aria\'s story']]].filter(([k]) => !A.flag(SC[k]));
  if (!left.length) return chapter7(A);
  let k = left[0][0];
  if (left.length > 1) {
    A.S.ch = 6; await A.talk([[null, '急流把同伴們沖散到了三個地方……', 'The rapids have scattered the friends to three places…']]);
    const i = await A.menu(left.map(([, n]) => A.T(...n)), { x: 70, y: 70, w: 120, title: A.T('接下來看誰的故事？', 'Whose story next?'), cancel: false });
    k = left[i][0];
  }
  if (k === 'A') { A.setParty(['rowan']); await A.chapter(61); A.warp('southwind', 12, 18, 'up'); A.goal('潛入被帝國占領的南風鎮，查出帝國的動向。', 'Slip into Imperial-occupied Southwind and find out what the Empire is up to.'); }
  if (k === 'B') { A.setParty(['sai']); await A.chapter(62); A.world(41, 27, 'up', 'b'); A.goal('河岸邊有帝國的營地。偷偷靠近看看。', 'There is an Imperial camp by the river. Sneak up and take a look.'); }
  if (k === 'C') {
    A.setParty(['aria', 'edmund', 'owen']); await A.chapter(63);
    await A.talk([
      ['owen', '雷鳴河的北支流會流回霜石鎮附近。我們從那裡上岸。', 'The north branch of the Thunder River runs back near Frostvale. We\'ll land there.'],
      ['edmund', '賽伊那小子……一定沒事的。他從小就比我會游泳。', 'Sai will be fine. He always swam better than me.'],
      ['aria', '……艾德蒙，你在發抖。', '…Edmund, you\'re shaking.'],
      ['edmund', '是嗎？大概是河水太冷了吧。', 'Am I? The water must be cold.'],
      ['octa', '哼哼哼！又是你們這些小鬼！上次那筆帳，本大王要連本帶利討回來！', 'Hmm-hmm-hmm! You brats again! I\'ll take back what you owe me — with interest!'],
    ]);
    await A.battle(['octa'], { boss: true, bg: 'water', lvUp: 3 });
    await A.talk([['octa', '今、今天就先放過你們！記住了，本大王的名字是——歐克塔！', 'I-I\'ll let you off today! Remember my name — Octa the Great!']]);
    A.warp('frostvale', 12, 18, 'up');
    A.goal('到霜石鎮的長老之家，說服長老一起對抗帝國。', 'Go to the Elder\'s Hall in Frostvale and convince the elder to stand against the Empire.');
  }
}
// ---------------------------------------------------------------- chapter 7: everyone together, the battle on the snow
async function chapter7(A) {
  A.free();
  for (const id of ['aria', 'rowan', 'edmund', 'sai', 'selene', 'kiriyu', 'galan']) if (A.member(id)) await A.join(id, { silent: true });
  A.leave('owen', { gone: true });
  await A.chapter(7);
  A.warp('frostvale', 19, 15, 'up');
  await A.talk([
    [null, '三條河流，在霜石鎮匯合了。', 'Three rivers meet again in Frostvale.'],
    ['edmund', '賽伊！你這傢伙，跑到哪裡去了！', 'Sai! Where on earth have you been?'],
    ['sai', '海底。說來話長。這位是桐生，這個野孩子是嘉藍。', 'Under the sea. Long story. This is Kiriyu, and the wild one is Galan.'],
    ['galan', '嘉藍！嘉藍好！', 'Galan! Galan good!'],
    ['rowan', '……這位是瑟琳娜。她以前是帝國的將軍。', '…This is Selene. She used to be an Imperial general.'],
    ['kiriyu', '帝國的人……！', 'One of the Empire\'s…!'],
    ['selene', '我不會求你原諒。可是那天在霞之國下毒的命令，我也反對過——所以我才被關起來。', 'I won\'t ask you to forgive me. But I opposed the order to poison Kasumi. That is why they chained me up.'],
    ['kiriyu', '……哼。用劍來證明吧。', '…Hmph. Prove it with your sword.'],
    ['elder', '你們看——雪原上，帝國的大軍來了。', 'Look — out on the snowfield. The Imperial army is coming.'],
    ['aria', '他們要的是瓦里昂……冰封在礦坑裡的星靈。', 'They want Valion… the Astral frozen in the mine.'],
    ['rowan', '那就守住礦坑的入口。分三隊，在山崖上擋住他們！', 'Then we hold the mine. Three teams, on the cliffs!'],
  ]);
  const waves = [[['heavytrooper', 'trooper'], ['第一隊：守住左邊的山崖！', 'Team one: hold the left cliff!']], [['magitek2', 'hound'], ['第二隊：守住右邊的山崖！', 'Team two: hold the right cliff!']], [['heavytrooper', 'hound', 'hound'], ['第三隊：守住礦坑的入口！', 'Team three: hold the mine entrance!']]];
  for (const [foes, line] of waves) { await A.talk([[null, ...line]]); await A.pickParty(4); await A.battle(foes, { bg: 'snow' }); }
  await A.talk([
    ['kross', '區區一群叛徒，竟敢阻擋帝國……！維瑟克大人說得沒錯，這種事就該由我親自動手！', 'A rabble of traitors, defying the Empire…! Lord Vissek was right. I\'ll see to this myself!'],
    [null, '最後的戰鬥。選出四個人吧。', 'The last fight. Choose four.'],
  ]);
  await A.pickParty(4);
  await A.battle(['kross'], { boss: true, bg: 'snow' });
  await A.talk([
    ['kross', '不可能……我竟然輸給……', 'Impossible… beaten by…'],
    [null, '帝國軍撤退了。', 'The Imperial army falls back.'],
    ['aria', '……瓦里昂在叫我。', '…Valion is calling me.'],
    ['rowan', '艾莉雅，等一下！上次妳碰到牠的時候——', 'Aria, wait! Last time you touched it—'],
  ]);
  A.warp('mine_2', ...M_END.mine_2, 'up');
  await A.talk([
    [null, '冰塊裡的星靈，和艾莉雅之間，有什麼在共鳴。', 'Something hums between the Astral in the ice and Aria.'],
    ['valion', '（……孩子。妳終於回來了。妳體內流著的，是我們的血……）', '(…Child. At last you return. Our blood runs in you…)'],
    ['aria', '我……我是什麼？', 'I… what am I?'],
  ]);
  A.quake(1.5); A.scene((g) => { g.fillStyle = 'rgba(255,200,255,0.7)'; g.fillRect(0, 0, 768, 720); });
  await A.sleep(1.2); A.scene(null);
  await A.talk([
    [null, '光芒散去時——艾莉雅變成了一團發光的、像野獸一樣的身影。', 'When the light fades, Aria has become a glowing, beast-like shape.'],
    [null, '她發出一聲不像人類的尖叫，衝破了礦坑的屋頂，往西南方的天空飛走了。', 'She lets out a scream that is not human, bursts through the roof of the mine, and flies off into the south-western sky.'],
    ['rowan', '艾莉雅——！！', 'ARIA—!!'],
    ['edmund', '……她往雨城的方向飛去了。南風鎮南邊的堤道已經能通行了。', '…She flew toward Rainhold. The causeway south of Southwind is open now.'],
    ['rowan', '我要去找她。我答應過要保護她的。', 'I\'m going after her. I promised I\'d protect her.'],
    ['selene', '……你對誰都這麼說嗎？', '…Do you say that to everyone?'],
  ]);
  A.leave('aria'); A.set('sw_open'); A.set('east_bridge'); A.set('c7_done');
  A.warp('frostvale', 12, 2, 'down');
  await A.chapter(8);
  A.goal('艾莉雅往西南方飛走了。經過南風鎮南方的堤道，前往雨城拉斯特。', 'Aria flew south-west. Cross the causeway south of Southwind and head for Rainhold.');
}
export let M_END = {};

export function act1(M, K) {
  const { npc, trig, chat } = K;
  M_END = { mine_2: M.mine_2.anchor.end };
  // ================================================================ Frostvale
  const fv = M.frostvale;
  for (const n of fv.npcs) if (n.keeper) n.when = (A) => ch(A) >= 3;
  fv.warps.push({ x: 12, y: 0, to: 'mine' }, { x: 13, y: 0, to: 'mine' });
  M.mine.exitTo = ['frostvale', 12, 1];
  fv.gate = (A) => (ch(A) === 2 || ch(A) === 3 && !A.flag('c3_done') ? [[null, '霜石鎮的衛兵還在找「帝國的魔女」。現在不能回去。', 'Frostvale\'s guards are still hunting "the Empire\'s witch". You can\'t go back yet.']] : null);
  fv.npcs.push(
    npc(12, 18, 'guard', [['guard', '魔女在哪裡！一個都不准出鎮！', 'Where\'s the witch? Nobody leaves town!']], { when: (A) => ch(A) === 2 }),
    npc(13, 18, 'guard', [['guard', '往南的路封鎖了！', 'The south road is closed!']], { when: (A) => ch(A) === 2 }),
    npc(6, 2, 'oldman', async (A) => {
      if (ch(A) >= 7) return A.talk([['jon', '艾莉雅……我在報紙上看到了。不管妳變成什麼樣子，妳都是那個在我家醒來的孩子。', 'Aria… I read the papers. Whatever you become, you\'re still the girl who woke up in my house.']]);
      return A.talk([['jon', '礦坑的路，往北走就是了。小心點。', 'The mine is north. Be careful.']]);
    }, { when: (A) => ch(A) >= 2 }),
    chat(10, 9, 'miner', [[null, [['man', '礦坑深處挖出了一隻冰封的怪物。從那天起，鎮上就不太平了。', 'The miners dug up a frozen monster deep in the mine. The town hasn\'t been at peace since.']]], [(A) => ch(A) >= 7, [['man', '你們守住了這個鎮。謝謝。', 'You saved this town. Thank you.']]]], { when: (A) => ch(A) >= 3 }),
    chat(15, 3, 'woman', [[null, [['woman', '霜石鎮靠著挖煤和鐵活下去。帝國想要的，卻是那隻冰裡的東西。', 'Frostvale lives on coal and iron. But what the Empire wants is that thing in the ice.']]]], { when: (A) => ch(A) >= 3 }),
    chat(14, 15, 'child', [[null, [['child', '雪狐會說話喔！真的！我在礦坑附近看過！', 'The snow foxes can talk! Really! I saw one near the mine!']]]], { when: (A) => ch(A) >= 3 }),
    npc(19, 15, 'oldman', async (A) => {
      if (ch(A) === 63 && !A.flag(SC.C)) {
        await A.talk([
          ['elder', '帝國的魔女……竟然有臉回來。', 'The Empire\'s witch… you dare come back?'],
          ['owen', '長老，她不是帝國的人了。她被縛心冠控制，殺了很多人——可是那不是她的意思。', 'Elder, she is no longer the Empire\'s. The Thrall Crown made her kill — it was never her will.'],
          ['aria', '……我什麼都不記得。可是，我記得那些人看著我的眼神。', '…I don\'t remember any of it. But I remember the way people looked at me.'],
          ['aria', '如果我的力量能保護這個鎮，我想試試看。', 'If my power can protect this town, I want to try.'],
          ['elder', '……哼。帝國的大軍遲早會來搶那隻星靈。那時候，就看妳的了。', '…Hmph. The Empire will come for that Astral sooner or later. When it does, we\'ll see what you\'re made of.'],
        ]);
        A.set(SC.C); return scenario(A);
      }
      return A.talk([['elder', ch(A) >= 7 ? '那孩子飛走的時候，哭得像個嬰兒。去找她吧。' : '霜石鎮不屬於任何國家。', ch(A) >= 7 ? 'When that girl flew off she was crying like a baby. Go and find her.' : 'Frostvale belongs to no nation.']]);
    }, { when: (A) => ch(A) >= 3 }),
  );
  fv.onEnter = async (A) => {
    if (ch(A) === 1 && !A.flag('c1_guards')) {
      A.set('c1_guards');
      await A.talk([
        ['guard', '帝國的魔導甲！擋住他們！', 'Imperial Magitek Armour! Stop them!'],
        ['hart', '哼，礦工也想擋魔導甲？讓開！', 'Miners against Magitek? Out of the way!'],
      ]);
      await A.battle(['guard', 'guard'], { bg: 'snow' });
      await A.talk([['gale', '礦坑在鎮的北邊。走吧。', 'The mine is north of town. Move.'], [null, '（魔導甲的光束很強。戰鬥中選擇「魔導」就能使用。）', '(The Magitek beams are strong. Choose Magitek in battle to use them.)']]);
    }
    if (ch(A) === 61 && A.flag('c6a_tunnel') && !A.flag(SC.A)) { A.set(SC.A); await A.talk([['rowan', '……霜石鎮。大家還沒到啊。', '…Frostvale. The others aren\'t here yet.'], ['selene', '我們等吧。', 'Then we wait.']]); return scenario(A); }
    if (ch(A) === 62 && A.flag('c6b_trench') && !A.flag(SC.B)) { A.set(SC.B); await A.talk([['sai', '總算回到北方了。哥哥應該也到了吧。', 'North at last. My brother should be here by now.']]); return scenario(A); }
  };
  // ================================================================ the mine (chapters 1, 2 and 7)
  const mine2 = M.mine_2, [mx, my] = mine2.anchor.end;
  mine2.npcs.push(npc(mx, my - 1, 'astral', [['valion', '……', '…']], { when: (A) => ch(A) >= 1 }));
  mine2.triggers.push(trig(...K.endRoom(mine2), async (A) => {
    if (ch(A) !== 1) return;
    await A.talk([['gale', '有東西過來了！', 'Something\'s coming!']]);
    await A.battle(['ironshell'], { boss: true, bg: 'cave' });
    await A.talk([
      ['hart', '就是這個……冰裡的星靈。', 'That\'s it… the Astral in the ice.'],
      ['gale', '牠……在發光？', 'Is it… glowing?'],
      ['aria', '……！', '…!'],
    ]);
    A.scene((g) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, 768, 720); }); A.quake(1);
    await A.talk([['hart', '哇啊啊啊——！', 'Aaaargh—!'], [null, '……', '…']]);
    A.scene(null); A.unset('magitekArmour'); A.leave('hart', { gone: true }); A.leave('gale', { gone: true });
    await A.chapter(2);
    A.warp('frostvale', 7, 3, 'left');
    await A.talk([
      ['jon', '醒了嗎？妳在礦坑裡昏倒了三天。', 'Awake? You\'ve been out for three days. They found you in the mine.'],
      ['jon', '妳頭上戴著的那個東西，我拆掉了。那叫「縛心冠」，是帝國用來控制人心的道具。', 'I took that thing off your head. A Thrall Crown — the Empire uses them to control people\'s minds.'],
      ['aria', '……我……想不起來。什麼都想不起來。', '…I… can\'t remember. I can\'t remember anything.'],
      ['jon', '縛心冠會讓人失去記憶。慢慢就會想起來的。妳記得自己的名字嗎？', 'The crown steals memories. They\'ll come back, slowly. Do you remember your name?'],
      ['aria', '……艾莉雅。', '…Aria.'],
      ['guard', '（砰砰砰！）開門！把帝國的魔女交出來！', '(BANG BANG!) Open up! Hand over the Imperial witch!'],
      ['jon', '糟了。聽著，從後面出去，往北走，躲進礦坑。我有個朋友叫洛恩，他會在礦坑裡接妳。', 'Blast. Listen — out the back, go north, hide in the mine. A friend of mine called Rowan will meet you there.'],
      ['aria', '……為什麼要幫我？', '…Why are you helping me?'],
      ['jon', '因為妳的眼睛，看起來好害怕。', 'Because your eyes look so frightened.'],
    ]);
    A.goal('從約恩家出去，往北躲進礦坑。洛恩會在那裡等妳。', 'Leave Jon\'s house and flee north into the mine. Rowan will be waiting.');
  }, { when: (A) => ch(A) === 1 }));
  // chapter 2: Rowan in the mine, then the guard captain and the snow foxes
  M.mine.triggers.push(trig(...[M.mine.anchor.start[0] - 2, M.mine.anchor.start[1] - 2, 5, 5], async (A) => {
    if (ch(A) !== 2 || A.hasMember('rowan')) return;
    await A.talk([
      ['rowan', '妳就是艾莉雅？約恩叫我來的。我叫洛恩，是個寶藏獵人。', 'You\'re Aria? Jon sent me. I\'m Rowan — treasure hunter.'],
      ['aria', '……寶藏獵人？', '…Treasure hunter?'],
      ['rowan', '小偷？才不是。是寶藏獵人。差很多的。', 'Thief? No. Treasure hunter. Big difference.'],
      ['rowan', '我在一個叫「黎明軍」的地方做事。我們在對抗帝國。妳的力量……帝國一定會想搶回去。', 'I work for the Dawnline. We fight the Empire. And your power… they\'ll want it back.'],
      ['rowan', '別擔心。我會保護妳的。', 'Don\'t worry. I\'ll protect you.'],
    ]);
    await A.join('rowan');
    A.goal('穿過礦坑逃出去。', 'Escape through the mine.');
  }, { when: (A) => ch(A) === 2 }));
  mine2.triggers.push(trig(...K.endRoom(mine2), async (A) => {
    if (ch(A) !== 2) return;
    await A.talk([['captain', '找到了！魔女和小偷！全部抓起來！', 'There! The witch and the thief! Seize them!'], ['rowan', '我說了，是寶藏獵人！', 'Treasure hunter, I said!']]);
    await A.battle(['guard', 'guard', 'guard'], { bg: 'cave' });
    await A.talk([
      ['fox', '嗚——！', 'Awoooo—!'],
      ['moka', '雪狐族的勇士摩卡，參上！人類，往後退！這些衛兵交給我們！', 'Moka, warrior of the snow foxes, at your service! Stand back, humans! Leave the guards to us!'],
      ['rowan', '……狐、狐狸在說話？', '…The fox is talking?'],
      ['moka', '你才是會說話的人類呢！快，隊長要來了！', 'And you\'re a talking human! Quick, here comes their captain!'],
    ]);
    await A.join('moka');
    await A.battle(['captain', 'guard'], { boss: true, bg: 'cave' });
    await A.talk([
      ['moka', '從這條秘道出去，就能到鎮南的雪原。往西南走，沙漠裡有座蘇拉斯城。', 'This secret path comes out on the snowfield south of town. Go south-west — there\'s a castle in the desert called Sularis.'],
      ['rowan', '蘇拉斯的國王是我的老朋友。他表面上對帝國低頭，其實在幫我們。', 'Sularis\'s king is an old friend of mine. He bows to the Empire in public, but he\'s on our side.'],
      ['moka', '摩卡要回去守護族人了。艾莉雅，妳的眼睛……和那隻冰裡的星靈好像。', 'Moka must go back to the clan. Aria… your eyes look just like the Astral\'s in the ice.'],
    ]);
    A.leave('moka', { gone: true }); A.set('c2_done');
    A.S.ch = 3; await A.chapter(3);
    A.world(15, 9, 'down', 'b');
    A.goal('往西南方走，前往沙漠中的蘇拉斯城。', 'Head south-west to Sularis Castle in the desert.');
  }, { when: (A) => ch(A) === 2 }));
  // ================================================================ Sularis
  const su = M.sularis;
  su.gate = (A) => (A.flag('c3_done') && !A.flag('c4_done') ? [[null, '蘇拉斯城潛入了沙漠底下，看不見了。', 'Sularis Castle has burrowed beneath the sand and is nowhere to be seen.']] : null);
  su.npcs.push(
    npc(5, 3, 'edmund', async (A) => {
      if (ch(A) === 3 && !A.flag('c3_done')) {
        await A.talk([
          ['edmund', '洛恩！你這個小偷！', 'Rowan! You thief!'],
          ['rowan', '寶藏獵人。陛下，好久不見。', 'Treasure hunter. Long time no see, Your Majesty.'],
          ['edmund', '這位美麗的小姐是？', 'And who is this lovely lady?'],
          ['aria', '……我是艾莉雅。', '…I\'m Aria.'],
          ['edmund', '艾莉雅……帝國的晶騎士？傳聞說妳能用魔法。', 'Aria… the Empire\'s Crystal Knight? They say you can use magic.'],
          ['aria', '魔法……我不知道。我只知道，我和其他人不一樣。', 'Magic… I don\'t know. All I know is that I\'m not like other people.'],
          ['edmund', '不一樣又怎樣？我也和其他國王不一樣——我會修引擎。', 'So? I\'m not like other kings either. I can fix an engine.'],
          ['soldier', '陛下！帝國的使者維瑟克大人到了！', 'Your Majesty! The Imperial envoy, Lord Vissek, has arrived!'],
          ['edmund', '……來得真快。艾莉雅，躲到後面去。', '…That was fast. Aria, hide in the back.'],
          ['vissek', '嘻嘻嘻……蘇拉斯的國王陛下，日安。我在找一個女孩，一個戴著漂亮頭冠的女孩。', 'Hee-hee-hee… Good day, King of Sularis. I\'m looking for a girl. A girl with a pretty little crown.'],
          ['edmund', '這裡只有沙子。和很多很多的沙子。', 'There\'s only sand here. A great deal of sand.'],
          ['vissek', '是嗎？那我就……把這座城燒了，看看沙子底下藏著什麼！嘻嘻嘻嘻嘻！', 'Is that so? Then I\'ll just… burn the castle and see what\'s under the sand! Hee-hee-hee-hee!'],
        ]);
        A.scene((g) => { g.fillStyle = 'rgba(255,90,20,0.35)'; g.fillRect(0, 0, 768, 720); });
        await A.talk([['edmund', '你瘋了！……衛兵，啟動引擎！', 'You\'re mad! …Guards, start the engines!']]);
        await A.join('edmund', { silent: true });
        await A.battle(['magitek', 'magitek'], { boss: true, bg: 'desert' });
        A.scene(null); A.quake(1.5);
        await A.talk([
          [null, '轟隆隆隆……整座蘇拉斯城開始往沙漠底下沉。', 'RRRRUMBLE… the whole of Sularis Castle sinks beneath the desert.'],
          ['vissek', '城、城堡潛進沙裡了？！可惡——！', 'The castle went UNDER the sand?! Curse you—!'],
          ['edmund', '蘇拉斯的城堡，是全世界最好的潛沙艇。哈哈！', 'Sularis Castle is the finest sand-submarine in the world. Ha!'],
          ['edmund', '艾莉雅，我也加入你們。帝國的瘋子不會就此罷休的。', 'Aria, I\'m coming with you. That madman won\'t stop here.'],
          ['edmund', '往東翻過克蘭山，就是黎明軍的基地。而且……我的弟弟就住在那座山上。', 'East over Mt. Kolan is the Dawnline\'s hideout. And… my brother lives on that mountain.'],
        ]);
        await A.join('edmund');
        await A.tool('autocross');
        A.set('c3_done');
        A.world(11, 21, 'right', 'b');
        await A.chapter(4);
        A.goal('往東前往克蘭山，穿過山洞到東邊去。', 'Go east to Mt. Kolan and through its caves to the other side.');
        return;
      }
      return A.talk([['edmund', '……', '…']]);
    }, { when: (A) => !A.hasMember('edmund') }),
    chat(10, 3, 'guard', [[null, [['guard', '陛下很受女孩子歡迎。可是他從來沒有認真過。', 'His Majesty is very popular with the ladies. Not that he\'s ever been serious.']]]]),
    chat(15, 9, 'man', [[null, [['man', '國王有個雙胞胎弟弟。十年前，他們擲硬幣決定誰繼承王位……', 'The king has a twin brother. Ten years ago they tossed a coin to decide who would take the throne…']]]]),
    chat(10, 15, 'miner', [[null, [['man', '城堡的引擎是國王親自設計的。地底下也能跑。', 'The king designed the castle\'s engines himself. It can run underground.']]], [(A) => A.flag('c4_done'), [['man', '機械店賣的東西，只有國王會用。', 'Only the king knows how to use what the tool shop sells.']]]]),
  );
  for (const n of su.npcs) if (n.keeper) n.when = (A) => A.flag('c4_done');
  // ================================================================ Mt. Kolan
  const k3 = M.kolan_3, [kx, ky] = k3.anchor.end;
  k3.warps.push({ x: kx, y: ky, world: [28, 17], when: (A) => A.flag('c4_done') });
  k3.triggers.push(trig(...K.endRoom(k3), async (A) => {
    await A.talk([
      ['barg', '……蘇拉斯的國王？哈，來找你弟弟的嗎？', '…The King of Sularis? Ha, come looking for your brother?'],
      ['edmund', '你是誰？', 'Who are you?'],
      ['barg', '我是巴爾格。師父的徒弟——曾經是。師父把奧義傳給了那個小子，不傳給我。所以我殺了師父。', 'I am Barg. The master\'s pupil — once. He passed his secret art to that boy, not to me. So I killed him.'],
      ['sai', '巴爾格！！', 'BARG!!'],
      ['edmund', '……賽伊？', '…Sai?'],
      ['sai', '哥哥？……之後再說。先打倒這個傢伙！', 'Brother? …Later. First, this one!'],
    ]);
    await A.join('sai');
    await A.talk([[null, '（賽伊的「拳技」：選擇招式，再用方向鍵輸入右邊顯示的方向，最後按確定。）', '(Sai\'s Blitz: pick a move, then press the directions shown beside it, then OK.)']]);
    await A.battle(['barg'], { boss: true, bg: 'cave' });
    await A.talk([
      ['barg', '……師父……我……', '…Master… I…'],
      ['sai', '他到最後都想把奧義傳給你。只是你不肯等。', 'He meant to teach you too, in the end. You just wouldn\'t wait.'],
      ['edmund', '十年了。你一點都沒變。', 'Ten years. You haven\'t changed a bit.'],
      ['sai', '你也是。還是那麼愛搭訕。……那枚硬幣，你還留著嗎？', 'Nor have you. Still flirting with everyone. …Do you still have the coin?'],
      ['edmund', '當然。（兩面都是正面的硬幣。那天，我讓你贏了。）', 'Of course. (The coin with two heads. That day, I let you win.)'],
      ['sai', '黎明軍的事，我在山上聽說了。我也去。', 'I\'ve heard about the Dawnline up here. I\'m coming too.'],
    ]);
    A.set('c4_done');
    for (let x = 25; x <= 27; x++) A.setTile(x, 17, ',', 'world');
    A.world(28, 17, 'right', 'b');
    await A.chapter(5);
    A.goal('往東北方前往黎明軍基地。', 'Head north-east to the Dawnline Hideout.');
  }, { when: (A) => ch(A) === 4 }));
  // ================================================================ the Dawnline Hideout
  const hd = M.hideout;
  hd.npcs.push(
    npc(5, 3, 'owen', async (A) => {
      if (ch(A) === 5 && !A.flag('c5_owen')) {
        await A.talk([
          ['owen', '歡迎來到黎明軍的基地。我是歐文。', 'Welcome to the Dawnline. I am Owen.'],
          ['owen', '艾莉雅，我聽說了妳的事。帝國把星靈的力量注入人體，造出晶騎士。可是妳不一樣——妳天生就會魔法。', 'Aria, I have heard about you. The Empire forces Astral power into people to make Crystal Knights. But you are different. You were born with magic.'],
          ['aria', '……我是怪物嗎？', '…Am I a monster?'],
          ['owen', '妳是希望。或者是武器。決定權在妳自己。', 'You are a hope. Or a weapon. That is for you to decide.'],
        ]);
        for (;;) {
          const i = await A.ask('歐文：「艾莉雅，妳願意加入黎明軍嗎？」', 'Owen: "Aria, will you join the Dawnline?"', [['加入', 'Join'], ['再想一想', 'Let me think']]);
          if (i === 0) break;
          await A.talk([['owen', '……沒關係。我會等。這是只有妳能做的選擇。', '…That is all right. I will wait. Only you can choose this.']]);
        }
        await A.talk([
          ['aria', '……我想知道自己是什麼。如果能找到答案，我願意戰鬥。', '…I want to know what I am. If fighting will help me find out, I will fight.'],
          ['owen', '謝謝妳。', 'Thank you.'],
          ['messenger', '報告！帝國的部隊發現了基地！他們正往這裡來！', 'Sir! The Imperial army has found the hideout! They\'re on their way!'],
          ['owen', '……來得真快。我們沿雷鳴河而下，到南方去。', '…So soon. We\'ll take the Thunder River south.'],
          ['rowan', '我去南風鎮。那裡被帝國占領了，我去打探他們的動向。', 'I\'ll go to Southwind. The Empire holds it now — I\'ll find out what they\'re planning.'],
          ['aria', '洛恩……', 'Rowan…'],
          ['rowan', '別擔心，我一定會回來保護妳的。', 'Don\'t worry. I\'ll be back to protect you.'],
        ]);
        A.leave('rowan'); A.set('c5_owen');
        A.setParty(['aria', 'edmund', 'sai', 'owen']);
        await A.join('owen', { silent: true });
        A.goal('從基地南方的河口（雷鳴河）坐木筏往下游。', 'Take a raft down the Thunder River, at the river mouth south of the hideout.');
        return;
      }
      return A.talk([['owen', '黎明終會到來。', 'The dawn will come.']]);
    }, { when: (A) => ch(A) <= 5 }),
    chat(10, 3, 'soldier', [[null, [['man', '我們只有一百個人。帝國有十萬大軍。可是我們有一樣東西他們沒有——那就是理由。', 'We are a hundred. The Empire has a hundred thousand. But we have something they don\'t — a reason.']]]]),
    chat(15, 9, 'woman', [[null, [['woman', '我的村子被魔導甲燒了。我加入黎明軍，是為了讓別人不要再經歷一樣的事。', 'Magitek burned my village. I joined so no one else has to live through that.']]]]),
  );
  M.river.gate = (A) => (!A.flag('c5_owen') ? [[null, '湍急的河流。需要木筏才能下去。', 'A rushing river. You\'d need a raft.']] : A.flag('c5_river') ? [[null, '木筏已經不在了。', 'The raft is gone.']] : null);
  const r3 = M.river_3;
  r3.triggers.push(trig(...K.endRoom(r3), async (A) => {
    if (A.flag('c5_river')) return;
    await A.talk([
      ['octa', '哼哼哼！河是本大王的地盤！想過去，先過本大王這一關！', 'Hmm-hmm-hmm! This river is MY turf! You want past, you go through Octa the Great!'],
      ['sai', '一隻章魚？', 'An octopus?'],
      ['octa', '是「大王」！章魚大王！', '"The GREAT"! Octa the GREAT!'],
    ]);
    await A.battle(['octa'], { boss: true, bg: 'water' });
    await A.talk([
      ['octa', '可、可惡……本大王只是今天狀態不好！', 'C-curses… I\'m just having an off day!'],
      [null, '歐克塔一甩觸手——木筏翻了。', 'Octa flails a tentacle — and the raft flips.'],
      ['edmund', '賽伊——！', 'SAI—!'],
      ['sai', '別管我！去北方！我們在霜石鎮會合——', 'Never mind me! Go north! We\'ll meet in Frostvale—'],
    ]);
    A.set('c5_river');
    return scenario(A);
  }, { when: (A) => ch(A) === 5 && !A.flag('c5_river') }));
  // ================================================================ 6A: Southwind under occupation (Rowan)
  const sw = M.southwind;
  K.setTile(sw, 21, 15, '>');
  sw.warps.push({ x: 21, y: 15, to: 'swtunnel' });
  M.swtunnel.exitTo = null;
  sw.npcs.push(
    npc(19, 18, 'imperial', [['soldier', '這裡是帝國軍的司令部。閒雜人等不准進入！', 'This is Imperial headquarters. No civilians!']], { when: (A) => ch(A) === 61 && !A.flag('c6a_disguise') }),
    npc(5, 2, 'merchant', async (A) => {
      if (ch(A) === 61 && !A.flag('c6a_disguise')) {
        await A.talk([
          ['merchant', '帝國軍的人只跟商人買東西。他們說商人是「有用的平民」。', 'The Imperials only deal with merchants. "Useful civilians," they call us.'],
          ['rowan', '（……商人的衣服。借一下。）', '(…A merchant\'s clothes. I\'ll just borrow these.)'],
          [null, '洛恩換上了商人的衣服。', 'Rowan changes into the merchant\'s clothes.'],
          ['merchant', '咦？我的外套呢？', 'Eh? Where\'s my coat?'],
        ]);
        A.set('c6a_disguise');
        A.goal('穿著商人的衣服，從司令部（右下的宅邸）的地下室潛入。', 'Dressed as a merchant, slip into the basement of the headquarters (the manor, bottom right).');
        return;
      }
      return A.talk([['merchant', '生意人，生意人。', 'Business is business.']]);
    }),
    chat(10, 9, 'imperial', [[(A) => ch(A) === 61, [['soldier', '聽說地下室關著一個帝國的叛徒。是個女將軍喔。', 'They say there\'s an Imperial traitor locked in the basement. A woman general.']]], [(A) => ch(A) !== 61, [['man', '港口的船，可以到很遠的地方。', 'Ships from this port go a long way.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '南風鎮被帝國占領之後，大家都不敢說真話了。', 'Since the Empire took Southwind, nobody dares say what they think.']]], [(A) => ch(A) >= 7, [['woman', '帝國軍撤走了。終於可以好好呼吸了。', 'The Imperials have pulled out. We can finally breathe.']]]]),
    chat(24, 9, 'sailor', [[null, [['man', '往南的堤道被封住了。往雨城的路走不通。', 'The causeway south is closed. You can\'t get to Rainhold.']]], [(A) => A.flag('sw_open'), [['man', '堤道開了！往南就是雨城和金鍍城。', 'The causeway is open! South lies Rainhold, and Gilden.']]]]),
  );
  M.swtunnel.triggers.push(trig(M.swtunnel.anchor.start[0] - 2, M.swtunnel.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      [null, '地下室的盡頭，一個金髮的女人被鐵鍊鎖在牆上。', 'At the end of the cellar, a woman with golden hair hangs in chains.'],
      ['soldier', '叛徒瑟琳娜。明天就要被送回帝都處刑了。', 'Selene the traitor. She goes back to the capital tomorrow — to be executed.'],
      ['rowan', '（士兵走了。）……妳是帝國的將軍？', '(The soldier leaves.) …You\'re an Imperial general?'],
      ['selene', '曾經是。我反對在霞之國的河裡下毒，所以被關在這裡。', 'I was. I opposed poisoning Kasumi\'s river, so they chained me here.'],
      ['rowan', '……我放妳出去。', '…I\'ll get you out.'],
      ['selene', '為什麼？我是帝國的人。', 'Why? I\'m one of them.'],
      ['rowan', '因為，我曾經沒能救一個人。從那天起，我就決定再也不讓那種事發生。', 'Because once, I couldn\'t save someone. Since that day I swore it would never happen again.'],
      ['rowan', '我會保護妳。', 'I\'ll protect you.'],
      ['selene', '……我不需要被保護。可是，我欠你一次。', '…I don\'t need protecting. But I owe you one.'],
      ['selene', '我會用「封魔」：用劍吸收敵人的魔法。', 'I can use the Runeblade: my sword swallows the enemy\'s magic.'],
    ]);
    await A.join('selene');
    A.goal('從地下道逃出南風鎮。', 'Escape Southwind through the tunnels.');
  }, { when: (A) => ch(A) === 61 && !A.hasMember('selene') }));
  const st2 = M.swtunnel_2;
  st2.triggers.push(trig(...K.endRoom(st2), async (A) => {
    await A.talk([['selene', '有東西在挖隧道……是帝國的鑽機！', 'Something is tunnelling… an Imperial drill!']]);
    await A.battle(['tunneldrill'], { boss: true, bg: 'cave' });
    A.set('c6a_tunnel');
    await A.talk([['rowan', '出去之後往北走，回霜石鎮。大家說好在那裡會合。', 'Once we\'re out we head north, back to Frostvale. That\'s where we said we\'d meet.']]);
    A.world(14, 26, 'down', 'b');
    A.goal('往北回到霜石鎮。', 'Go north, back to Frostvale.');
  }, { when: (A) => ch(A) === 61 && !A.flag('c6a_tunnel') }));
  // ================================================================ 6B: the camp, Kasumi, the ferry, the Wildlands, the trench (Sai)
  const cp = M.camp;
  cp.entry = [8, 11, 'up']; cp.exitable = true;
  cp.npcs.push(
    npc(18, 8, 'vissek', null, { when: (A) => ch(A) === 62 && !A.flag('c6b_camp') }),
    npc(16, 8, 'imperial', null, { when: (A) => ch(A) === 62 && !A.flag('c6b_camp') }),
    npc(5, 7, 'imperial', [['soldier', '……', '…']], { when: (A) => ch(A) === 62 }),
  );
  cp.onEnter = async (A) => {
    if (ch(A) !== 62 || A.flag('c6b_camp')) return;
    await A.talk([
      ['sai', '（帳篷後面有人在說話……）', '(Voices behind the tent…)'],
      ['soldier', '維瑟克大人，霞之國的城門太堅固，再這樣下去要拖到冬天了。', 'Lord Vissek, Kasumi\'s gates are too strong. At this rate we\'ll be here till winter.'],
      ['vissek', '那就別打了。把這個倒進河裡。', 'Then stop fighting. Pour this into the river.'],
      ['soldier', '這、這是……毒？可是河的下游有平民——', 'Th-this is… poison? But there are civilians downstream—'],
      ['vissek', '平民也會喝水嘛。嘻嘻嘻嘻！喝了，就都安靜了！', 'Civilians drink water too. Hee-hee-hee-hee! One sip and they\'ll all be nice and quiet!'],
      ['sai', '你這傢伙——！！', 'You BASTARD—!!'],
      ['vissek', '哎呀，有老鼠。抓起來。', 'Oh dear, a rat. Seize him.'],
    ]);
    await A.battle(['trooper', 'trooper', 'hound'], { bg: 'field' });
    await A.talk([
      [null, '維瑟克的身影消失在帳篷之間——毒已經倒進了河裡。', 'Vissek slips away between the tents — and the poison is already in the river.'],
      ['sai', '來不及了……！得去通知霞之國！', 'Too late…! I have to warn Kasumi!'],
    ]);
    A.set('c6b_camp');
    A.goal('往東北方的霞之國趕去！', 'Hurry north-east to Kasumi!');
  };
  const ka = M.kasumi;
  ka.npcs.push(
    npc(19, 3, 'woman', [['mina', '……', '…']], { when: (A) => ch(A) === 62 && !A.flag('c6b_kasumi'), dir: 'up' }),
    npc(21, 3, 'child', [['ren', '……', '…']], { when: (A) => ch(A) === 62 && !A.flag('c6b_kasumi'), dir: 'up' }),
    npc(5, 3, 'kiriyu', null, { when: (A) => !A.hasMember('kiriyu') && ch(A) <= 62 }),
    chat(10, 9, 'guard', [[null, [['guard', '霞之國的武士，寧死不降。', 'A samurai of Kasumi dies before he surrenders.']]], [(A) => A.flag('c6b_kasumi'), [['guard', '……城裡的人，大半都沒有醒來。', '…Most of the castle never woke up.']]]]),
  );
  ka.onEnter = async (A) => {
    if (ch(A) !== 62 || !A.flag('c6b_camp') || A.flag('c6b_kasumi')) return;
    await A.talk([
      [null, '城裡的人一個接一個倒下。井水，河水，全都被下了毒。', 'All through the castle, people are collapsing. The wells, the river — all poisoned.'],
      ['kiriyu', '美奈！廉！', 'Mina! Ren!'],
      ['mina', '……老公……你回來了……廉他……剛才還在說……想跟爸爸……一起看櫻花……', '…Dear… you\'re back… Ren was just saying… he wanted to see the cherry blossoms… with his father…'],
      ['kiriyu', '別說話……我去找大夫……', 'Don\'t talk… I\'ll fetch a healer…'],
      [null, '……', '…'],
      ['kiriyu', '……美奈？……廉？', '…Mina? …Ren?'],
      [null, '那一天，霞之國的櫻花還沒有開。', 'That day, the cherry trees of Kasumi had not yet bloomed.'],
      ['sai', '……是帝國的維瑟克。我親眼看到他把毒倒進河裡。', '…It was Vissek of the Empire. I saw him pour the poison myself.'],
      ['kiriyu', '……維瑟克。', '…Vissek.'],
      ['kiriyu', '我是霞之國的武士，桐生。這把刀，從今天起只為復仇而拔。', 'I am Kiriyu, samurai of Kasumi. From today, this blade is drawn only for vengeance.'],
    ]);
    await A.join('kiriyu');
    await A.talk([[null, '（桐生的「居合」：選擇段數之後開始蓄力。段數越高，蓄得越久，斬擊越強。）', '(Kiriyu\'s Iai: pick a level and he starts charging. The higher the level, the longer the charge and the stronger the cut.)']]);
    await A.talk([['soldier', '霞之國的殘兵！殺了他們！', 'Kasumi stragglers! Kill them!']]);
    await A.battle(['trooper', 'trooper', 'commander'], { bg: 'castle' });
    await A.talk([
      ['sai', '帝國的大軍要來了。往東南走，冥河渡口那裡可以渡河。', 'More of them are coming. South-east — we can cross at the Mournwater Landing.'],
      ['kiriyu', '……冥河渡口。傳說那裡的船，會載亡魂去彼岸。', '…The Mournwater. They say the ferry there carries the dead to the other shore.'],
    ]);
    A.set('c6b_kasumi');
    A.goal('往東南方的冥河渡口去。', 'Head south-east to the Mournwater Landing.');
  };
  M.ferry.gate = (A) => (!A.flag('c6b_kasumi') ? [[null, '霧氣籠罩的渡口。沒有船。', 'A fog-wrapped landing. There is no boat.']] : null);
  const f3 = M.ferry_3;
  f3.triggers.push(trig(...K.endRoom(f3), async (A) => {
    if (A.flag('c6b_ferry')) return;
    await A.talk([
      ['sai', '這艘船……自己在動。', 'This boat… it\'s moving by itself.'],
      ['kiriyu', '亡魂的船。它不會讓活人離開的。', 'The ship of the dead. It will not let the living leave.'],
    ]);
    await A.battle(['ferry'], { boss: true, bg: 'dark', music: 'boss' });
    await A.talk([
      [null, '渡船停了下來。霧裡，一個女人和一個小男孩站在船頭。', 'The ferry stops. In the fog, a woman and a little boy stand at the bow.'],
      ['ren', '爸爸！我們要去看櫻花了喔！', 'Daddy! We\'re going to see the cherry blossoms!'],
      ['mina', '老公，不要難過。我們會在那邊等你。很久很久以後再來喔。', 'Don\'t be sad, dear. We\'ll wait for you over there. Come — but not for a long, long time.'],
      ['kiriyu', '美奈……廉……！', 'Mina… Ren…!'],
      [null, '渡船載著他們，消失在霧的彼岸。', 'The ferry carries them away into the far shore of the fog.'],
      ['kiriyu', '……………………', '…………'],
      ['sai', '桐生……', 'Kiriyu…'],
      ['kiriyu', '走吧。他們要我活下去。', 'Let us go. They want me to live.'],
    ]);
    A.set('c6b_ferry');
    A.astral('phantom');
    A.world(48, 30, 'right', 'b');
    A.goal('穿過荒原。荒原小屋的獵人也許知道回西邊的路。', 'Cross the Wildlands. The hunter at the Wildlands Hut may know a way west.');
  }, { when: (A) => ch(A) === 62 && !A.flag('c6b_ferry') }));
  const wh = M.wildhut;
  wh.npcs.push(
    chat(10, 9, 'oldman', [[null, [['hunter', '荒原上有個野孩子，跟魔物一起長大。他最愛吃乾肉——店裡就有賣。', 'There\'s a wild boy out on the Wildlands, raised among the beasts. Loves dried meat — they sell it in the shop.']]],
      [(A) => A.hasMember('galan'), [['hunter', '要回西邊大陸，就走東南海岸的海蛇洞窟。洞窟在海底，一路通到南風鎮附近。', 'To get back west, take the Serpent Trench on the south-east coast. It runs under the sea all the way to Southwind.']]]]),
    npc(15, 9, 'galan', async (A) => {
      if (!A.has('meat')) return A.talk([['galan', '……咕嚕嚕。（他盯著你的背包。他好像餓了。）', '…Grrrrowl. (He stares at your bag. He looks hungry.)']]);
      A.take('meat');
      await A.talk([
        ['galan', '肉！好吃！嘉藍，喜歡你們！', 'Meat! Yummy! Galan likes you!'],
        ['sai', '你叫嘉藍？你的爸爸媽媽呢？', 'You\'re Galan? Where are your mum and dad?'],
        ['galan', '爸爸……說嘉藍是惡魔。把嘉藍丟在荒原。', 'Daddy… said Galan is a demon. Left Galan on the Wildlands.'],
        ['kiriyu', '……', '…'],
        ['galan', '嘉藍跟你們走！嘉藍會變成魔物戰鬥！', 'Galan comes with you! Galan fights like the beasts!'],
      ]);
      await A.join('galan');
      await A.talk([[null, '（嘉藍的「野性」：打倒魔物之後，嘉藍會學會牠的動作，化身為那隻魔物自動戰鬥。在荒原戰鬥一定學得會。）', '(Galan\'s Feral: after beating monsters he learns their moves and fights as them on his own. On the Wildlands he always learns them.)']]);
      A.goal('前往東南海岸的海蛇洞窟，回到西邊的大陸。', 'Go to the Serpent Trench on the south-east coast to get back to the western continent.');
    }, { when: (A) => A.flag('c6b_ferry') && !A.hasMember('galan') }),
  );
  M.trench.gate = (A) => (!A.hasMember('galan') && ch(A) <= 62 ? [[null, '海浪拍打著洞口。裡面很深、很暗。', 'Waves pound the cave mouth. It\'s deep and dark inside.']] : null);
  const t2 = M.trench_2;
  t2.triggers.push(trig(...K.endRoom(t2), async (A) => {
    if (A.flag('c6b_trench')) return;
    await A.talk([[null, '洞窟的盡頭，有光從頭頂照下來。是西邊大陸的海岸。', 'At the end of the trench, light shines from above. It\'s the coast of the western continent.']]);
    A.set('c6b_trench');
    A.world(20, 28, 'up', 'b');
    A.goal('往北回霜石鎮。', 'Go north to Frostvale.');
  }, { when: (A) => ch(A) === 62 && !A.flag('c6b_trench') }));
  t2.warps.push({ x: t2.anchor.end[0], y: t2.anchor.end[1], world: [20, 28], when: (A) => A.flag('c6b_trench') });
  // ================================================================ Rainhold (chapter 8)
  const rh = M.rainhold;
  rh.warps.push({ x: 12, y: 0, to: 'raintower' }, { x: 13, y: 0, to: 'raintower' });
  M.raintower.exitTo = ['rainhold', 12, 1];
  M.rainhold.gate = (A) => (ch(A) < 8 ? [[null, '雨下個不停的城鎮。城門關著。', 'A town where the rain never stops. The gates are shut.']] : null);
  const LIE = [[['liar', '這座城從來不下雨。', 'It never rains in this town.']], [['liar', '我是全世界最誠實的人。', 'I am the most honest man in the world.']], [['liar', '城北的塔？那裡什麼都沒有。絕對沒有發光的女孩。', 'The tower north of town? There\'s nothing there. Certainly no glowing girl.']], [['liar', '我昨天騎著飛龍去了月亮。', 'Yesterday I rode a dragon to the moon.']], [['liar', '小偷？這裡沒有小偷。（他的手伸向你的錢包。）', 'Thieves? No thieves here. (His hand drifts toward your purse.)']]];
  LIE.forEach((l, i) => rh.npcs.push(K.chat([10, 15, 10, 15, 24][i], [3, 3, 9, 15, 9][i], ['thief', 'man', 'woman', 'oldman', 'thief'][i], [[null, l]])));
  const rt3 = M.raintower_3;
  rt3.triggers.push(trig(...K.endRoom(rt3), async (A) => {
    if (A.flag('c8_done')) return;
    await A.talk([['thief', '塔頂的寶物是我們的！', 'The treasure up top is ours!']]);
    await A.battle(['thiefking'], { boss: true, bg: 'castle' });
    await A.talk([
      [null, '塔頂。一隻蒼老的星靈躺在那裡，身旁蜷縮著一團發光的身影。', 'The top of the tower. An old Astral lies there, and beside it a glowing shape is curled up tight.'],
      ['rowan', '艾莉雅！', 'Aria!'],
      ['ramus', '……噓。她睡著了。我是萊姆斯。很久以前，我認識這孩子的父親。', '…Hush. She\'s sleeping. I am Ramus. Long ago, I knew this child\'s father.'],
      ['ramus', '二十年前，一個人類女子迷路走進了星靈的世界。她叫瑪德琳。她和我們的同胞瑪杜因相愛了。', 'Twenty years ago a human woman wandered into the Astral world. Her name was Madeline. She fell in love with one of us — Maduin.'],
      ['ramus', '他們生下了一個女孩。帝國找到了她們，殺了母親，帶走了孩子。', 'They had a daughter. The Empire found them, killed the mother, and took the child.'],
      ['ramus', '這孩子是人類，也是星靈。她害怕的是自己。', 'The child is human, and Astral. What she fears is herself.'],
      ['aria', '……洛恩？……我……我好害怕。我不知道自己是什麼。', '…Rowan? …I… I\'m so scared. I don\'t know what I am.'],
      ['rowan', '妳是艾莉雅。這樣就夠了。', 'You\'re Aria. That\'s enough.'],
      ['ramus', '我的時間不多了。帝國把我的同胞抓去研究所，榨乾成「星晶」。', 'I don\'t have long. The Empire takes my kind to its Arcanum and drains us into crystals.'],
      ['ramus', '把我也帶走吧。化為星晶的我，還能幫助你們。', 'Take me with you. As a crystal, I can still help you.'],
    ]);
    A.scene((g) => { g.fillStyle = 'rgba(255,255,160,0.6)'; g.fillRect(0, 0, 768, 720); }); await A.sleep(0.8); A.scene(null);
    await A.astral('ramus'); await A.astral('sylph'); await A.astral('unicorn');
    await A.join('aria');
    A.set('c8_done');
    await A.talk([
      ['edmund', '要阻止帝國，就得進到帝國的本土。可是大海的那一邊，只有飛空艇才能到。', 'To stop the Empire we have to reach its homeland. And across that sea, only an airship can take us.'],
      ['rowan', '世界上只有一艘飛空艇。船長是個叫雷吉斯的賭徒。聽說他最近常去金鍍城。', 'There is only one airship in the world. Its captain is a gambler called Regis. Word is he\'s been hanging around Gilden.'],
    ]);
    await A.chapter(9);
    A.goal('前往西南方的金鍍城，打聽飛空艇船長雷吉斯的消息。', 'Go to Gilden in the south-west and find out about the airship captain Regis.');
  }, { when: (A) => ch(A) === 8 && !A.flag('c8_done') }));
  // ================================================================ Gilden and the opera (chapter 9)
  const gd = M.gilden;
  gd.npcs.push(
    npc(6, 3, 'king', async (A) => {
      if (ch(A) === 9 && !A.flag('c9_letter')) {
        await A.talk([
          ['orwell', '我是歐威爾公爵，月光歌劇院的老闆。你們要找雷吉斯？……那個混蛋送來了這封信。', 'I am Duke Orwell, owner of the Moonlight Opera. You want Regis? …That scoundrel sent me this letter.'],
          [null, '「今晚，我將帶走歌姬瑪莉兒。她將成為我的新娘。——雷吉斯」', '"Tonight I shall take the diva Mariel. She will be my bride. — Regis"'],
          ['edmund', '只要他來綁架歌姬，我們就能找到他的飛空艇。', 'If he comes to kidnap the diva, we\'ll find his airship.'],
          ['orwell', '可是我不能讓瑪莉兒冒險……咦？這位小姐……', 'But I can\'t put Mariel at risk… Hm? This young lady…'],
          ['orwell', '妳和瑪莉兒長得一模一樣！', 'You look exactly like Mariel!'],
          ['selene', '……我？', '…Me?'],
          ['rowan', '讓瑟琳娜代替歌姬上台。雷吉斯來綁人的時候，我們就跟上他的船。', 'Selene takes the diva\'s place. When Regis comes for her, we follow him onto his ship.'],
          ['selene', '我是軍人，不是歌手！', 'I\'m a soldier, not a singer!'],
          ['aria', '……我想聽瑟琳娜唱歌。', '…I\'d like to hear Selene sing.'],
          ['selene', '…………好吧。只唱一次。', '…………Fine. Just once.'],
        ]);
        A.set('c9_letter'); A.give('letter');
        A.goal('前往南方的月光歌劇院。和導演說話，開始演出。', 'Go to the Moonlight Opera House in the south. Talk to the director to begin.');
        return;
      }
      return A.talk([['orwell', '藝術就是人生！', 'Art is life!']]);
    }),
    chat(10, 9, 'woman', [[null, [['woman', '金鍍城是有錢人的城。窮人連城門都進不來。', 'Gilden is a city for the rich. The poor can\'t even get through the gates.']]]]),
    chat(15, 15, 'man', [[null, [['man', '月光歌劇院今晚上演《灰燼詠嘆調》。那是一齣關於戰爭和愛的戲。', 'Tonight the Moonlight Opera plays "Ash Aria" — an opera about war and love.']]]]),
  );
  const op = M.opera;
  op.entry = [12, 15, 'up']; op.exitable = true;
  op.gate = (A) => (ch(A) < 9 ? [[null, '今天沒有演出。', 'No performance today.']] : null);
  op.npcs.push(
    npc(13, 11, 'man', async (A) => {
      if (ch(A) === 9 && A.flag('c9_letter') && !A.flag('c9_done')) return opera(A);
      return A.talk([['director', '藝術永不落幕！', 'Art never closes!']]);
    }),
    npc(13, 3, 'diva', null, { when: (A) => !A.flag('c9_done') }),
  );
  // the Blackhawk's deck: the gamble
  M.deck.entry = [11, 5, 'up'];
}

// ---------------------------------------------------------------- the opera
const LYRICS = [
  { q: ['（第一段）「在灰燼裡……」', '(Verse one) "Among the ashes…"'], a: [['我仍然歌唱', 'I still sing'], ['我早已睡去', 'I fell asleep'], ['我等著誰', 'I wait for someone']], ok: 0 },
  { q: ['（第二段）「星光落下的夜晚……」', '(Verse two) "On the night the starlight fell…"'], a: [['誰也沒有回來', 'no one came home'], ['我數著你的名字', 'I counted your name'], ['月亮哭泣著', 'the moon was weeping']], ok: 1 },
  { q: ['（第三段）「如果世界明天就要結束……」', '(Verse three) "If the world should end tomorrow…"'], a: [['今晚，我也要愛你', 'tonight I\'ll love you still'], ['我也不後悔', 'I would not regret'], ['就讓我化為灰燼', 'let me turn to ash']], ok: 0 },
];
async function opera(A) {
  await A.talk([
    ['director', '妳就是代替瑪莉兒的女孩？太好了，臉完全一樣！', 'You\'re the stand-in for Mariel? Perfect — the very same face!'],
    ['director', '歌詞記住了嗎？這是劇本。唱錯了就從頭再來！', 'Have you learned the words? Here\'s the libretto. Get it wrong and we start again!'],
    [null, '《灰燼詠嘆調》', '"Ash Aria"'],
    [null, '在灰燼裡，我仍然歌唱。星光落下的夜晚，我數著你的名字。如果世界明天就要結束——今晚，我也要愛你。', 'Among the ashes, I still sing. On the night the starlight fell, I counted your name. If the world should end tomorrow — tonight I\'ll love you still.'],
    ['selene', '（……我要唱這個？）', '(…I have to sing THIS?)'],
  ]);
  A.music('opera');
  for (;;) {
    let ok = true;
    for (const L of LYRICS) {
      const i = await A.menu(L.a.map((x) => A.T(...x)), { x: 40, y: 100, w: 176, title: A.T(...L.q), cancel: false });
      if (i !== L.ok) { ok = false; break; }
      await A.talk([['selene', `「${L.a[L.ok][0]}……」`, `"${L.a[L.ok][1]}…"`]]);
    }
    if (ok) break;
    await A.talk([['director', '停停停！唱錯了！從頭再來！', 'Stop, stop, STOP! Wrong words! From the top!']]);
  }
  await A.talk([
    [null, '歌聲響徹了整座歌劇院。觀眾全都屏住了呼吸。', 'The song fills the whole house. The audience holds its breath.'],
    ['rowan', '……', '…'],
    ['edmund', '洛恩，你的臉好紅。', 'Rowan, your face is bright red.'],
    ['octa', '哼哼哼！好一首歌！本大王要從天花板上丟下四噸重的大鐵塊，讓這場戲更精彩！', 'Hmm-hmm-hmm! Lovely song! I shall make it even better — by dropping a four-tonne weight from the rafters!'],
    ['rowan', '是那隻章魚！快上去阻止牠！', 'It\'s that octopus! Get up there and stop it!'],
  ]);
  await A.battle(['rafterrat', 'rafterrat', 'rafterrat'], { bg: 'castle' });
  await A.battle(['octa2'], { boss: true, bg: 'castle' });
  await A.talk([
    ['octa', '本、本大王的完美計畫……！', 'M-my perfect plan…!'],
    [null, '就在這時——屋頂的天窗被打開了。一個穿著黑色長大衣的男人從繩梯上跳了下來。', 'Just then the skylight bursts open. A man in a long black coat drops down on a rope ladder.'],
    ['regis', '晚安，歌姬小姐。我是來娶妳的。', 'Good evening, my diva. I\'ve come to marry you.'],
    ['selene', '……什麼？', '…What?'],
    ['regis', '來吧，我的新娘！', 'Come, my bride!'],
    [null, '雷吉斯抱起瑟琳娜，攀上繩梯，飛空艇「黑隼號」升上了夜空。', 'Regis sweeps Selene up the ladder, and the airship Blackhawk climbs into the night sky.'],
    ['rowan', '快抓住繩梯！', 'Grab the ladder!'],
  ]);
  A.warp('deck', 11, 5, 'up');
  await A.talk([
    ['regis', '……等一下。妳不是瑪莉兒。', '…Hold on. You\'re not Mariel.'],
    ['selene', '我是瑟琳娜。前帝國將軍。', 'I\'m Selene. A former Imperial general.'],
    ['regis', '而你們這群是……偷渡客？', 'And you lot are… stowaways?'],
    ['edmund', '雷吉斯船長，我們需要你的飛空艇。帝國在把星靈榨乾，總有一天，連天空都會被他們占領。', 'Captain Regis, we need your airship. The Empire is draining the Astrals dry. One day they\'ll own the sky itself.'],
    ['regis', '我對帝國沒興趣。我只對賭博有興趣。', 'I\'m not interested in the Empire. I\'m interested in gambling.'],
    ['edmund', '那就賭一把。這枚硬幣——正面，你就加入我們。反面，我們就下船，而且瑟琳娜嫁給你。', 'Then let\'s gamble. This coin — heads, you join us. Tails, we get off, and Selene marries you.'],
    ['selene', '喂！', 'Hey!'],
    ['regis', '……有意思。好，我賭了。', '…Interesting. All right, I\'m in.'],
    [null, '叮——硬幣在空中翻轉。', 'Ting — the coin spins through the air.'],
    ['edmund', '正面。', 'Heads.'],
    ['regis', '……哈。哈哈哈！我輸了。……這是兩面都是正面的硬幣吧？', '…Ha. Ha-ha-ha! I lose. …That coin has two heads, doesn\'t it?'],
    ['edmund', '你說呢？', 'What do you think?'],
    ['regis', '好，我喜歡你們。黑隼號是你們的了——不過船長還是我。', 'All right. I like you. The Blackhawk is yours — but I\'m still the captain.'],
    [null, '（雷吉斯的「命運輪」：三個轉輪轉動時，按確定鍵一個一個停下。對齊三個相同圖案就會發動強力效果。）', '(Regis\'s Fortune: the three reels spin; press OK to stop them one by one. Three of a kind sets off something powerful.)'],
  ]);
  await A.join('regis');
  A.set('c9_done');
  A.airship('blackhawk', [16, 47]);
  A.world(17, 47, 'down', 'b');
  await A.talk([[null, '── 第一幕　完 ──', '── End of Act I ──']]);
  await A.chapter(10);
  A.goal('搭上飛空艇（走到船旁邊按確定），飛往東南方的帝國本土，前往帝都威克斯。', 'Board the airship (stand beside it and press OK) and fly south-east to the Empire\'s homeland and its capital, Vexhold.');
}
