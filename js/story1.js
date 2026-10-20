// ASH ARIA — Act I 起 · The Ashtide's Song: Frostvale's cracked bell, the wind-organ city of Sularis, the Echo Temple,
// the valley of the Unsung, the three rivers, the High Conductor on the snow, Rainhold and the Grand Concert.
const ch = (A) => A.S.ch;
const SC = { A: 'c6a_done', B: 'c6b_done', C: 'c6c_done' };

// ---------------------------------------------------------------- the three rivers: whose story next?
export async function scenario(A) {
  const left = [['A', ['洛恩的故事', 'Rowan\'s story']], ['B', ['賽伊的故事', 'Sai\'s story']], ['C', ['艾莉雅的故事', 'Aria\'s story']]].filter(([k]) => !A.flag(SC[k]));
  if (!left.length) return chapter7(A);
  let k = left[0][0];
  if (left.length > 1) {
    A.S.ch = 6; await A.talk([[null, '瀑布把大家沖散到了三個地方……', 'The falls have scattered everyone to three different places…']]);
    const i = await A.menu(left.map(([, n]) => A.T(...n)), { x: 70, y: 70, w: 120, title: A.T('接下來看誰的故事？', 'Whose story next?'), cancel: false });
    k = left[i][0];
  }
  if (k === 'A') { A.setParty(['rowan']); await A.chapter(61); A.warp('southwind', 12, 18, 'up'); A.goal('南風鎮的燈塔鐘出了事。進鎮看看。', 'Something is wrong with Southwind\'s lighthouse bell. Go into town.'); }
  if (k === 'B') { A.setParty(['sai']); await A.chapter(62); A.world(41, 27, 'up', 'b'); A.goal('河岸邊有聖詠院的營地，傳出奇怪的低鳴聲。偷偷靠近看看。', 'There is a Choir camp on the riverbank, and a strange drone is coming from it. Sneak closer.'); }
  if (k === 'C') {
    A.setParty(['aria', 'edmund', 'owen']); await A.chapter(63);
    await A.talk([
      ['owen', '雷鳴河的北支流會流回霜石鎮附近。我們從那裡上岸。', 'The north branch of the Thunder River runs back toward Frostvale. We land there.'],
      ['edmund', '賽伊和洛恩那兩個……一定沒事的。一個用拳頭聽水，一個連瀑布都能送信過去。', 'Sai and Rowan will be fine. One listens to water with his fists, and the other could deliver a letter down a waterfall.'],
      ['aria', '……歐文爺爺。爸爸——歐瑟，他為什麼要讓世界安靜？', '…Grandpa Owen. Father — Orsay. Why does he want the world to go quiet?'],
      ['owen', '因為他是我教過最溫柔的孩子。溫柔的人，最受不了失去。', 'Because he was the gentlest child I ever taught. The gentle are the ones who cannot bear to lose.'],
      ['gearwick', '哈哈哈！找到了！聖詠院首席發明家——齒輪伯爵吉爾維克，華麗登場！', 'Ha-ha-HA! Found you! The Choir\'s First Inventor — Count Gearwick — makes his magnificent entrance!'],
      ['edmund', '又是你。你的蒸汽螃蟹不是在瀑布摔爛了嗎？', 'You again. Didn\'t your steam crab smash itself to bits on the falls?'],
      ['gearwick', '這是二號機！更大！更亮！更有品味！', 'This is Mark Two! Bigger! Shinier! More TASTEFUL!'],
    ]);
    await A.battle(['octa'], { boss: true, bg: 'water', lvUp: 3 });
    await A.talk([['gearwick', '我、我的鍋爐……！艾德蒙，這筆帳我記下了！', 'M-my boiler…! Edmund, I shan\'t forget this!'], ['edmund', '你每次都這麼說。', 'You say that every time.']]);
    A.warp('frostvale', 12, 18, 'up');
    A.goal('到霜石鎮的長老之家，警告長老聖詠院要來了。', 'Go to the Elder\'s Hall in Frostvale and warn the elder that the Choir is coming.');
  }
}
// ---------------------------------------------------------------- chapter 7: everyone together — and the High Conductor himself
async function chapter7(A) {
  A.free();
  for (const id of ['aria', 'rowan', 'edmund', 'sai', 'selene', 'kiriyu', 'galan']) if (A.member(id)) await A.join(id, { silent: true });
  A.leave('owen', { gone: true });
  await A.chapter(7);
  A.warp('frostvale', 19, 15, 'up');
  await A.talk([
    [null, '三條河流，在霜石鎮匯合了。', 'Three rivers meet again in Frostvale.'],
    ['edmund', '賽伊！你這傢伙，到底跑到哪裡去了？', 'Sai! Where on earth did you get to?'],
    ['sai', '沼澤裡的一口鐘裡面。說來話長。這位是桐生先生，這個吹哨子的是嘉藍。', 'Inside a bell in a swamp. Long story. This is Master Kiriyu, and the one with the whistle is Galan.'],
    ['galan', '嗶——！大家好！我會叫狼過來跟你們握手喔！', 'Phweeet! Hi everyone! I can make a wolf come and shake your hand!'],
    ['rowan', '……這位是瑟琳娜。南風鎮燈塔的守鐘騎士。', '…This is Selene. Bell Warden of the Southwind lighthouse.'],
    ['kiriyu', '守鐘騎士……聖詠院的人。', 'A Bell Warden… one of the Choir\'s.'],
    ['selene', '曾經是。他們要我親手把燈塔裡的星靈榨乾。我拒絕了。', 'I was. They ordered me to drain the Astral in my own lighthouse. I refused.'],
    ['kiriyu', '……老頭子的眼睛不好了。妳的劍，就讓我用耳朵來聽聽看吧。', '…These old eyes are failing. I shall listen to your sword instead, then.'],
    ['elder', '你們看——雪原上。白色的旗子，是聖詠院的大軍。', 'Look — out on the snow. White banners. The Choir\'s army.'],
    ['aria', '他們要的是瓦里昂……還有我。', 'They want Valion… and me.'],
    ['rowan', '那就守住礦坑。分三隊，在山崖上擋住他們！', 'Then we hold the mine. Three teams, on the cliffs!'],
  ]);
  const waves = [[['heavytrooper', 'trooper'], ['第一隊：守住左邊的山崖！', 'Team one: hold the left cliff!']], [['magitek2', 'hound'], ['第二隊：守住右邊的山崖！', 'Team two: hold the right cliff!']], [['heavytrooper', 'hound', 'hound'], ['第三隊：守住礦坑的入口！', 'Team three: hold the mine entrance!']]];
  for (const [foes, line] of waves) { await A.talk([[null, ...line]]); await A.pickParty(4); await A.battle(foes, { bg: 'snow' }); }
  await A.talk([
    ['kalan', '艾莉雅大人。請跟我回去。', 'Lady Aria. Please come back with me.'],
    ['aria', '卡蘭……從我五歲起，你就一直站在我身後。', 'Kalan… you\'ve stood behind me since I was five.'],
    ['kalan', '所以我比誰都清楚，外面的世界會傷害妳。……失禮了。', 'Which is why I know better than anyone how the world outside will hurt you. …Forgive me.'],
    [null, '最後的戰鬥。選出四個人吧。', 'The last fight. Choose four.'],
  ]);
  await A.pickParty(4);
  await A.battle(['kross'], { boss: true, bg: 'snow' });
  await A.talk([
    ['kalan', '……我輸了。', '…I am beaten.'],
    [null, '雪停了。風也停了。整片雪原，忽然安靜得聽不見任何聲音。', 'The snow stops. The wind stops. The whole snowfield falls so quiet that nothing can be heard at all.'],
    ['orsay', '辛苦你了，卡蘭。接下來交給我吧。', 'Thank you, Kalan. I\'ll take it from here.'],
    ['aria', '……爸爸。', '…Father.'],
    ['orsay', '妳長大了，艾莉雅。可是妳的手好冷。跑了這麼遠，一定很累吧。', 'You\'ve grown, Aria. But your hands are so cold. You\'ve run such a long way. You must be tired.'],
    ['rowan', '你就是大指揮者歐瑟？', 'You\'re High Conductor Orsay?'],
    ['orsay', '我只是一個想讓大家好好休息的人。……信使先生，你好像也很累了。', 'I\'m only a man who wants everyone to rest. …You look tired too, Mr. Courier.'],
    ['aria', '我不回去。鐘在吃星靈。你知道的，對不對？', 'I\'m not going back. The bells are eating the Astrals. You know that, don\'t you?'],
    ['orsay', '我知道。那是為了讓星歌，可以安安靜靜地結束。', 'I know. It is so the Star Song can come to a quiet end.'],
    ['orsay', '來，像小時候一樣。我唱，妳睡。', 'Come. Just like when you were little. I sing, and you sleep.'],
    [null, '歐瑟輕輕地哼起一首沒有聲音的歌。', 'Orsay softly hums a song that makes no sound.'],
  ]);
  A.scene((g) => { g.fillStyle = 'rgba(220,220,240,0.7)'; g.fillRect(0, 0, 768, 720); });
  await A.sleep(1.2); A.scene(null);
  await A.talk([
    [null, '礦坑深處，瓦里昂的歌停了。艾莉雅的眼睛慢慢闔上，倒進了歐瑟的懷裡。', 'Deep in the mine, Valion\'s song stops. Aria\'s eyes slowly close, and she falls into Orsay\'s arms.'],
    ['rowan', '放開她——！', 'Let her go—!'],
    [null, '洛恩想往前衝，腳卻一步也動不了。所有人都動不了。', 'Rowan tries to charge, but his feet will not move. Nobody can move.'],
    ['orsay', '別擔心，她只是睡著了。我會照顧她的——我一直都是這樣做的。', 'Don\'t worry. She\'s only sleeping. I will look after her. I always have.'],
    ['kalan', '……', '…'],
    [null, '歐瑟抱著艾莉雅，消失在往西南方的雪霧裡。', 'Orsay carries Aria away into the snow-mist to the south-west.'],
    ['rowan', '……又是這樣。我又一次，什麼都沒有送到。', '…Again. Once again, I didn\'t get anything where it needed to go.'],
    ['edmund', '洛恩。聖詠院的大音樂會就要在金鍍城舉行了。如果歐瑟要用艾莉雅做什麼——一定是在那裡。', 'Rowan. The Choir\'s Grand Concert is about to be held in Gilden. If Orsay means to use Aria for something, it will be there.'],
    ['selene', '南風鎮南邊的堤道已經能通行了。路上會經過雨城。', 'The causeway south of Southwind is open now. The road passes through Rainhold.'],
    ['sai', '雨城的塔頂，住著一隻聽得見所有歌的老星靈。也許牠知道艾莉雅為什麼特別。', 'At the top of Rainhold\'s tower lives an old Astral that can hear every song. It may know why Aria is special.'],
    ['rowan', '……走吧。這一次，我一定要送到。', '…Let\'s go. This time, I\'m going to deliver.'],
  ]);
  A.leave('aria'); A.set('sw_open'); A.set('east_bridge'); A.set('c7_done');
  A.warp('frostvale', 12, 2, 'down');
  await A.chapter(8);
  A.goal('經過南風鎮南方的堤道，前往雨城拉斯特，找塔頂的老星靈。', 'Cross the causeway south of Southwind and go to Rainhold, to the old Astral at the top of the tower.');
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
  fv.gate = (A) => (ch(A) === 2 || ch(A) === 3 && !A.flag('c3_done') ? [[null, '霜石鎮的衛兵和聖詠院的騎士還在找「沒有影子的女孩」。現在不能回去。', 'Frostvale\'s guards and a Choir knight are still hunting "the girl with no shadow". You can\'t go back yet.']] : null);
  fv.npcs.push(
    npc(12, 18, 'guard', [['guard', '聖詠院的騎士大人說了，一個人都不准出鎮！', 'The Choir knight says nobody leaves town!']], { when: (A) => ch(A) === 2 }),
    npc(13, 18, 'guard', [['guard', '往南的路封鎖了！', 'The south road is closed!']], { when: (A) => ch(A) === 2 }),
    npc(6, 2, 'oldman', async (A) => {
      if (ch(A) >= 7) return A.talk([['jon', '鎮上的鐘還是裂的。可是你們守住了礦坑……這樣就夠了。艾莉雅那孩子，一定要帶她回來。', 'The town bell is still cracked. But you held the mine, and that is enough. Bring that girl back. You must.']]);
      return A.talk([['jon', '礦坑的路，往北走就是了。小心點。', 'The mine is north. Be careful.']]);
    }, { when: (A) => ch(A) >= 2 }),
    chat(10, 9, 'miner', [[null, [['man', '鎮上的鐘裂了以後，灰霧每天晚上都往這邊爬近一點。', 'Ever since the town bell cracked, the grey mist creeps a little closer every night.']]], [(A) => ch(A) >= 7, [['man', '你們守住了這個鎮。謝謝。……就算鐘是裂的，我們也不會再讓人挖走礦坑裡的那位了。', 'You saved this town. Thank you. Cracked bell or not, we won\'t let anyone dig up the one in the mine again.']]]], { when: (A) => ch(A) >= 3 }),
    chat(15, 3, 'woman', [[null, [['woman', '聖詠院說，只要把冰裡的星靈熔進鐘裡，鐘就會修好。可是雪狐神社的人說，那是在殺牠。', 'The Choir says the bell will mend if they melt the Astral in the ice into it. The fox shrine says that is killing it.']]]], { when: (A) => ch(A) >= 3 }),
    chat(14, 15, 'child', [[null, [['child', '雪狐會唱歌喔！真的！晚上在礦坑附近就聽得到！', 'The snow foxes sing! Really! You can hear them near the mine at night!']]]], { when: (A) => ch(A) >= 3 }),
    npc(19, 15, 'oldman', async (A) => {
      if (ch(A) === 63 && !A.flag(SC.C)) {
        await A.talk([
          ['elder', '聖詠院的女孩……竟然有臉回來。', 'The Choir\'s girl… you dare come back?'],
          ['owen', '長老，她已經不是聖詠院的人了。那天在礦坑，是她拒絕了命令，瓦里昂才沒有被熔掉。', 'Elder, she is no longer the Choir\'s. That day in the mine she refused her orders. That is why Valion was never melted down.'],
          ['aria', '我以前……只是爸爸的樂器。他叫我聽哪裡有星靈，我就聽。', 'I used to be… only my father\'s instrument. He told me where to listen for Astrals, and I listened.'],
          ['aria', '可是現在，我想用自己的耳朵聽。如果我能保護這個鎮，我想試試看。', 'But now I want to listen with my own ears. If I can protect this town, I want to try.'],
          ['elder', '……哼。聖詠院的大軍遲早會來搶瓦里昂。那時候，就看妳的了。', '…Hmph. The Choir\'s army will come for Valion sooner or later. When it does, we\'ll see what you\'re made of.'],
        ]);
        A.set(SC.C); return scenario(A);
      }
      return A.talk([['elder', ch(A) >= 7 ? '那孩子被抱走的時候，雪原安靜得像墳場。去把她帶回來吧。' : '霜石鎮不屬於任何國家。也不屬於任何一首歌。', ch(A) >= 7 ? 'When they carried that girl away, the snow was as quiet as a graveyard. Go and bring her back.' : 'Frostvale belongs to no nation. And to no one\'s song.']]);
    }, { when: (A) => ch(A) >= 3 }),
  );
  fv.onEnter = async (A) => {
    if (ch(A) === 1 && !A.flag('c1_guards')) {
      A.set('c1_guards');
      await A.talk([
        ['guard', '聖詠院的人！雪狐神社說了，礦坑裡的那位誰都不准碰！', 'The Choir! The fox shrine says no one touches the one in the mine!'],
        ['hart', '鎮上的鐘裂了，灰潮就快到了。我們是來救你們的。讓開！', 'Your bell is cracked and the Ashtide is coming. We\'re here to save you. Out of the way!'],
      ]);
      await A.battle(['guard', 'guard'], { bg: 'snow' });
      await A.talk([['gale', '礦坑在鎮的北邊。艾莉雅大人，請帶路。', 'The mine is north of town. Lady Aria, lead the way.'], [null, '（聖詠槍是會唱歌的長槍。戰鬥中選擇「聖詠槍」就能使用。）', '(The Choir Lances sing as they strike. Choose Choir Lance in battle to use them.)']]);
    }
    if (ch(A) === 61 && A.flag('c6a_tunnel') && !A.flag(SC.A)) { A.set(SC.A); await A.talk([['rowan', '……霜石鎮。大家還沒到啊。', '…Frostvale. Nobody else is here yet.'], ['selene', '那我們就等。守鐘的人最會等了。', 'Then we wait. Bell Wardens are good at waiting.']]); return scenario(A); }
    if (ch(A) === 62 && A.flag('c6b_trench') && !A.flag(SC.B)) { A.set(SC.B); await A.talk([['sai', '總算回到北方了。艾德蒙應該也到了吧。', 'North at last. Edmund should be here by now.']]); return scenario(A); }
  };
  // ================================================================ the mine (chapters 1, 2 and 7)
  const mine2 = M.mine_2, [mx, my] = mine2.anchor.end;
  mine2.npcs.push(npc(mx, my - 1, 'astral', [['valion', '……', '…']], { when: (A) => ch(A) >= 1 }));
  mine2.triggers.push(trig(...K.endRoom(mine2), async (A) => {
    if (ch(A) !== 1) return;
    await A.talk([['gale', '有東西過來了！', 'Something\'s coming!']]);
    await A.battle(['ironshell'], { boss: true, bg: 'cave' });
    await A.talk([
      ['hart', '就是這個……冰裡的星靈，瓦里昂。艾莉雅大人，請「聽」一下牠還有多少力量。', 'There it is… the Astral in the ice. Valion. Lady Aria, please "listen" to how much strength it has left.'],
      ['aria', '……是。', '…Yes.'],
      [null, '艾莉雅把手貼在冰上。冰的深處，有一首很老、很慢的歌。', 'Aria lays her hand on the ice. Deep inside it is a song — very old, and very slow.'],
      ['valion', '（……孩子。妳聽得見我。那就看吧。）', '(…Child. You can hear me. Then look.)'],
      [null, '——無數的鐘。鐘的裡面，星靈一隻一隻被熔成了光。每多一口鐘，世界的歌就小一點。', '— Countless bells. Inside each one, Astrals melting into light, one after another. With every new bell, the world\'s song grows a little fainter.'],
      ['valion', '（星歌快要死了。而妳……是星歌在灰潮裡生下的、最後一個孩子。）', '(The Star Song is dying. And you… are the last child the Song bore in the Ashtide.)'],
      ['gale', '艾莉雅大人？您在發抖……', 'Lady Aria? You\'re shaking…'],
      ['hart', '開始挖吧。熔鐘爐已經在等了。', 'Start digging. The melting furnace is waiting.'],
      ['aria', '……不要。', '…No.'],
      ['hart', '什麼？艾莉雅大人，這是大指揮者的命令——', 'What? Lady Aria, this is the High Conductor\'s order—'],
      ['aria', '我說，不要。', 'I said no.'],
    ]);
    A.scene((g) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, 768, 720); }); A.quake(1);
    await A.talk([['hart', '冰、冰從地底下——！', 'The ice — from under the ground—!'], [null, '……', '…']]);
    A.scene(null); A.unset('magitekArmour'); A.leave('hart', { gone: true }); A.leave('gale', { gone: true });
    await A.chapter(2);
    A.warp('frostvale', 7, 3, 'left');
    await A.talk([
      ['jon', '醒了嗎？妳在礦坑裡昏倒了三天。那兩個聖詠院守衛……被封在冰裡了。還活著，只是醒不過來。', 'Awake? You\'ve been out for three days. Those two Choir Wardens are sealed in the ice. Alive — they just won\'t wake.'],
      ['jon', '我是約恩，鎮上的敲鐘人。……孩子，妳知道嗎？妳站在燈底下，卻沒有影子。', 'I\'m Jon, the town bell-ringer. …Child, did you know? You stand right under the lamp, and you cast no shadow.'],
      ['aria', '……爸爸說，那是因為我是在灰潮裡出生的。「空心之子」。', '…Father says it\'s because I was born in the Ashtide. A "Hollow Child".'],
      ['jon', '空心？胡說。我敲了四十年的鐘，空心的東西是什麼聲音，我最清楚。妳不是。', 'Hollow? Nonsense. I\'ve rung bells for forty years. I know what hollow sounds like. You\'re not it.'],
      ['jon', '妳的名字呢？', 'And your name?'],
      ['aria', '……艾莉雅。', '…Aria.'],
      ['guard', '（砰砰砰！）約恩！聖詠院的騎士卡蘭大人來了！把那個女孩交出來！', '(BANG BANG!) Jon! Sir Kalan of the Choir is here! Hand over the girl!'],
      ['jon', '糟了。聽著，從後面出去，往北躲進礦坑。今天剛好有個信使來送信——叫洛恩，我拜託他在礦坑裡接妳。', 'Blast. Listen — out the back, north into the mine. A courier came with the post today. Name\'s Rowan. I\'ve asked him to meet you in there.'],
      ['aria', '……為什麼要幫我？', '…Why are you helping me?'],
      ['jon', '因為那天，礦坑裡傳出來的歌，是我這輩子聽過最好聽的。', 'Because the song that came out of that mine was the most beautiful thing I\'ve ever heard.'],
    ]);
    A.goal('從約恩家出去，往北躲進礦坑。信使洛恩會在那裡等妳。', 'Leave Jon\'s house and flee north into the mine. Rowan the courier will be waiting.');
  }, { when: (A) => ch(A) === 1 }));
  // chapter 2: Rowan in the mine, then the guard captain and the fox shrine maiden
  M.mine.triggers.push(trig(...[M.mine.anchor.start[0] - 2, M.mine.anchor.start[1] - 2, 5, 5], async (A) => {
    if (ch(A) !== 2 || A.hasMember('rowan')) return;
    await A.talk([
      ['rowan', '妳就是艾莉雅？約恩叫我來的。我叫洛恩，灰路信使。', 'You\'re Aria? Jon sent me. I\'m Rowan — courier of the Ash Roads.'],
      ['aria', '……灰路？', '…The Ash Roads?'],
      ['rowan', '鐘聲照不到的路。灰潮旁邊的小路。別人不敢走，所以信要靠我們送。', 'The roads the bells can\'t reach — the narrow ways along the Ashtide. Nobody else dares walk them, so we carry the post.'],
      ['rowan', '今天起，多送一件「行李」。把妳安全送到山的那一邊，是我的工作。', 'As of today, I\'ve got one more parcel. Getting you safely over the mountains is my job.'],
      ['aria', '……你的包包裡，有一封很舊的信。', '…There\'s a very old letter in your bag.'],
      ['rowan', '妳聽得見？……那是一封沒送到的信。別管它。', 'You can hear that? …It\'s a letter that never got delivered. Never mind it.'],
    ]);
    await A.join('rowan');
    A.give('letter');
    A.goal('穿過礦坑逃出去。', 'Escape through the mine.');
  }, { when: (A) => ch(A) === 2 }));
  mine2.triggers.push(trig(...K.endRoom(mine2), async (A) => {
    if (ch(A) !== 2) return;
    await A.talk([['captain', '找到了！沒有影子的女孩，還有郵差！全部抓起來！', 'There! The girl with no shadow — and the postman! Seize them!'], ['rowan', '是信使！差很多的！', 'Courier! There\'s a difference!']]);
    await A.battle(['guard', 'guard', 'guard'], { bg: 'cave' });
    await A.talk([
      ['fox', '嗚——嗚嗚——♪', 'Awoo — oo-oo — ♪'],
      ['moka', '雪狐神社的狐巫摩卡，參上！是妳救了瓦里昂大人吧？', 'Moka, shrine maiden of the snow-fox shrine, at your service! You\'re the one who saved Lord Valion, aren\'t you?'],
      ['rowan', '……狐、狐狸在說話？', '…The fox is talking?'],
      ['moka', '狐巫本來就會說話啦！快，衛兵隊長要來了，摩卡唱歌幫你們！', 'Of course shrine maidens talk! Quick, the guard captain\'s coming. Moka will sing for you!'],
    ]);
    await A.join('moka');
    await A.battle(['captain', 'guard'], { boss: true, bg: 'cave' });
    await A.talk([
      ['moka', '從這條秘道出去，就能到鎮南的雪原。往西南走，沙漠裡有座蘇拉斯風琴城。', 'This secret path leads to the snowfield south of town. Go south-west — there\'s a wind-organ city in the desert called Sularis.'],
      ['rowan', '蘇拉斯的工匠首領艾德蒙，我常幫他送零件。那個人不靠星靈，也擋住了灰潮。', 'I deliver parts to Sularis\'s master artificer, Edmund, all the time. He keeps the Ashtide out without using a single Astral.'],
      ['moka', '摩卡要回去守著瓦里昂大人了。艾莉雅……妳的歌，和冰裡的那首好像。', 'Moka has to go back and watch over Lord Valion. Aria… your song sounds just like the one in the ice.'],
      ['aria', '……我的歌？我從來沒有唱過歌。', '…My song? I\'ve never sung anything.'],
      ['moka', '那妳以後一定要唱給摩卡聽喔。', 'Then one day you have to sing for Moka.'],
    ]);
    A.leave('moka', { gone: true }); A.set('c2_done');
    A.S.ch = 3; await A.chapter(3);
    A.world(15, 9, 'down', 'b');
    A.goal('往西南方走，前往沙漠中的蘇拉斯風琴城。', 'Head south-west to Sularis, the wind-organ city in the desert.');
  }, { when: (A) => ch(A) === 2 }));
  // ================================================================ Sularis, the wind-organ city
  const su = M.sularis;
  su.gate = (A) => (A.flag('c3_done') && !A.flag('c4_done') ? [[null, '蘇拉斯被自己捲起的沙暴包住了。風琴還在響，可是連城牆都看不見。', 'Sularis is wrapped in a sandstorm of its own making. The organ still plays, but you can\'t even see the walls.']] : null);
  su.npcs.push(
    npc(5, 3, 'edmund', async (A) => {
      if (ch(A) === 3 && !A.flag('c3_done')) {
        await A.talk([
          ['edmund', '洛恩！我的齒輪呢？上個月就該到了！', 'Rowan! Where are my gears? They were due last month!'],
          ['rowan', '在包包裡。順便送來了一位客人。', 'In the bag. I brought a guest as well.'],
          ['edmund', '妳好。我是艾德蒙，這座城的工匠頭子。……妳在聽什麼？', 'Hello. I\'m Edmund, head craftsman of this city. …What are you listening to?'],
          ['aria', '風。風穿過管子……在唱歌。', 'The wind. It goes through the pipes… and sings.'],
          ['edmund', '聽得出來？蘇拉斯的大風琴，把沙漠的風變成歌。灰潮怕這首歌，所以我們不需要星靈。', 'You can hear that? Sularis\'s great organ turns the desert wind into song. The Ashtide fears it, so we have no need of Astrals.'],
          ['edmund', '聖詠院說這是「不合調」。他們想要每一座城都買他們的鐘。', 'The Choir calls it "out of tune". They want every city to buy their bells.'],
          ['soldier', '首領！城外有聖詠院的機甲！帶頭的是……齒輪伯爵！', 'Chief! Choir Engines outside the walls! And leading them… Count Gearwick!'],
          ['edmund', '……那個騙子。艾莉雅，躲到後面去。', '…That fraud. Aria, get behind me.'],
          ['gearwick', '艾德蒙！我的老對手！聽說你這裡藏了一個沒有影子的女孩？', 'Edmund! My old rival! I hear you\'re hiding a girl with no shadow?'],
          ['edmund', '這裡只有沙子，還有你上次輸給我的發明大賽獎盃。', 'There\'s only sand here. And the trophy you lost to me at the inventors\' fair.'],
          ['gearwick', '那是評審不懂藝術！今天我就用聖詠院最新的機甲，把你的破風琴拆成廢鐵！', 'The judges had no taste! Today the Choir\'s newest Engines will reduce your wretched organ to scrap!'],
        ]);
        A.scene((g) => { g.fillStyle = 'rgba(255,170,60,0.3)'; g.fillRect(0, 0, 768, 720); });
        await A.talk([['edmund', '……好啊。各位，幫我爭取三分鐘！', '…Fine. Everyone, buy me three minutes!']]);
        await A.join('edmund', { silent: true });
        await A.battle(['magitek', 'magitek'], { boss: true, bg: 'desert' });
        A.scene(null); A.quake(1.5);
        await A.talk([
          [null, '艾德蒙拉下城牆上的大拉桿。蘇拉斯所有的管子同時打開——', 'Edmund pulls the great lever on the wall. Every pipe in Sularis opens at once—'],
          [null, '「沙暴賦格」。風琴的低音捲起了整片沙漠，沙牆把城和機甲隔開了。', 'The "Sandstorm Fugue". The organ\'s bass lifts the whole desert, and a wall of sand closes between the city and the Engines.'],
          ['gearwick', '看、看不見了！咳咳！我的鬍子裡全是沙！', 'I c-can\'t see! Cough! My moustache is full of sand!'],
          ['edmund', '蘇拉斯的風琴，可不只會唱搖籃曲。哈！', 'Sularis\'s organ sings more than lullabies. Ha!'],
          ['edmund', '艾莉雅，我也跟你們走。齒輪伯爵會來，就表示聖詠院真的很想要妳。', 'Aria, I\'m coming with you. If Gearwick came, the Choir must want you very badly.'],
          ['edmund', '往東翻過克蘭山，有座回音寺。再過去，就是被聖詠院放逐的「無聲者」住的山谷。', 'East over Mt. Kolan is the Echo Temple. Beyond it lies the valley of the Unsung — the people the Choir cast out.'],
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
    chat(10, 3, 'guard', [[null, [['guard', '首領十年沒睡好覺了。他說風琴只要停一個小節，灰潮就會進來。', 'The chief hasn\'t slept properly in ten years. He says if the organ stops for even one bar, the Ashtide gets in.']]]]),
    chat(15, 9, 'man', [[null, [['man', '我們的風琴有三百根管子。每根都是首領親手調的音。', 'Our organ has three hundred pipes. The chief tuned every one by hand.']]]]),
    chat(10, 15, 'miner', [[null, [['man', '齒輪伯爵以前也是蘇拉斯的學徒。他和首領吵架以後就跑去聖詠院了。', 'Count Gearwick was once an apprentice here. He ran off to the Choir after a row with the chief.']]], [(A) => A.flag('c4_done'), [['man', '機巧店的零件，只有首領會用。', 'Only the chief knows what to do with the gadget shop\'s parts.']]]]),
  );
  for (const n of su.npcs) if (n.keeper) n.when = (A) => A.flag('c4_done');
  // ================================================================ Mt. Kolan and the Echo Temple
  const k3 = M.kolan_3, [kx, ky] = k3.anchor.end;
  k3.warps.push({ x: kx, y: ky, world: [28, 17], when: (A) => A.flag('c4_done') });
  k3.triggers.push(trig(...K.endRoom(k3), async (A) => {
    await A.talk([
      [null, '山洞的盡頭，是一座刻在岩壁裡的寺。寺裡迴盪著一聲又一聲的拳響。', 'At the end of the caves is a temple carved into the rock. Fist-strikes echo through it, one after another.'],
      ['barg', '……回音石，交出來。', '…The Echo Stone. Hand it over.'],
      ['sai', '巴爾格師兄。你胸口那顆發光的東西是什麼？', 'Brother Barg. What is that glowing thing in your chest?'],
      ['barg', '聖詠院給的「晶石之心」。裝上它以後，我聽得見一百里外的心跳。師父教了我十年都做不到的事，它一天就做到了。', 'A crystal heart, a gift from the Choir. With it I can hear a heartbeat a hundred leagues away. What the master failed to teach me in ten years, it gave me in a day.'],
      ['sai', '那顆晶石裡……是星靈的聲音。你聽見的，是牠在哭。', 'Inside that crystal… is an Astral\'s voice. What you hear is it crying.'],
      ['barg', '閉嘴！', 'Silence!'],
      ['edmund', '那位拳僧，需要幫忙嗎？', 'Monk, would you like a hand?'],
      ['sai', '……拜託了。我是賽伊。我們用拳頭來聽他吧！', '…Please. I\'m Sai. Let\'s listen to him with our fists!'],
    ]);
    await A.join('sai');
    await A.talk([[null, '（賽伊的「拳鳴」：選擇招式，再用方向鍵敲出右邊顯示的節奏，最後按確定。）', '(Sai\'s Fist Echo: pick a move, beat out the rhythm shown beside it with the arrows, then press OK.)']]);
    await A.battle(['barg'], { boss: true, bg: 'cave' });
    await A.talk([
      [null, '巴爾格胸口的晶石，裂開了一條細細的縫。', 'A thin crack runs across the crystal in Barg\'s chest.'],
      ['barg', '……好吵……好吵啊……！', '…So loud… it\'s so loud…!'],
      [null, '巴爾格抱著頭，從後山的懸崖跳了下去，消失在雲裡。', 'Clutching his head, Barg leaps from the cliff behind the temple and vanishes into the clouds.'],
      ['sai', '師兄……', 'Brother…'],
      ['aria', '他胸口裡的星靈……在說「謝謝」。', 'The Astral in his chest… said "thank you".'],
      ['sai', '妳聽得見？……師父說過，有一天會有一個「用耳朵打拳」的人來到寺裡。也許就是妳。', 'You can hear it? …The master once said that someone who "fights with their ears" would come to the temple one day. Perhaps it\'s you.'],
      ['sai', '我也去。我想知道，聖詠院為什麼要把星靈裝進人的胸口。', 'I\'m coming too. I want to know why the Choir puts Astrals inside people\'s chests.'],
    ]);
    A.set('c4_done');
    for (let x = 25; x <= 27; x++) A.setTile(x, 17, ',', 'world');
    A.world(28, 17, 'right', 'b');
    await A.chapter(5);
    A.goal('往東北方前往無聲者之谷。', 'Head north-east to the Valley of the Unsung.');
  }, { when: (A) => ch(A) === 4 }));
  // ================================================================ the Valley of the Unsung
  const hd = M.hideout;
  hd.npcs.push(
    npc(5, 3, 'owen', async (A) => {
      if (ch(A) === 5 && !A.flag('c5_owen')) {
        await A.talk([
          ['owen', '歡迎來到無聲者之谷。這裡沒有鐘。我們是被聖詠院判為「不合調」的人。', 'Welcome to the Valley of the Unsung. There are no bells here. We are the people the Choir judged "out of tune".'],
          ['owen', '我是歐文。……啊，妳就是艾莉雅。妳長得好像他小時候。', 'I am Owen. …Ah, so you are Aria. You look so like him when he was small.'],
          ['aria', '……他？', '…Him?'],
          ['owen', '歐瑟。聖詠院的大指揮者。妳的「父親」。很久以前，他是我的學生。', 'Orsay. High Conductor of the Choir. Your "father". Long ago, he was my student.'],
          ['owen', '他七歲那年，村子被灰潮吞沒了。鐘晚了三分鐘才敲響。', 'When he was seven, the Ashtide swallowed his village. The bell rang three minutes too late.'],
          ['owen', '他在灰色的霧裡，聽著家人的聲音一個一個安靜下來。從那天起，他再也不相信歌了。', 'In the grey mist he listened to his family\'s voices fall silent, one by one. Since that day he has never believed in song.'],
          ['aria', '……爸爸從來沒有說過。他只說，等一切結束，大家就能好好休息。', '…Father never told me. He only said that when it\'s all over, everyone will finally get to rest.'],
          ['owen', '是的。他要的不是統治世界。他要的，是讓整首星歌停下來——演奏「終止符」。', 'Yes. He does not want to rule the world. He wants the whole Star Song to stop — to play the "Final Rest".'],
          ['rowan', '歌停了，會怎麼樣？', 'And if the song stops?'],
          ['owen', '世界會睡著。不會痛，不會哭，也不會再醒來。', 'The world goes to sleep. No pain. No tears. And no waking.'],
        ]);
        for (;;) {
          const i = await A.ask('歐文：「艾莉雅，妳願意和無聲者一起，阻止妳的父親嗎？」', 'Owen: "Aria, will you stand with the Unsung and stop your father?"', [['我願意', 'I will'], ['讓我想一想', 'Let me think']]);
          if (i === 0) break;
          await A.talk([['owen', '……沒關係。他是妳的父親。這是只有妳能做的選擇。', '…That is all right. He is your father. Only you can choose this.']]);
        }
        await A.talk([
          ['aria', '……我不想讓世界睡著。我想知道，自己的聲音聽起來是什麼樣子。', '…I don\'t want the world to sleep. I want to know what my own voice sounds like.'],
          ['owen', '謝謝妳。', 'Thank you.'],
          ['messenger', '長老！聖詠院的部隊找到山谷了！他們帶著鐘——要把這裡「調音」！', 'Elder! The Choir\'s soldiers have found the valley! They\'ve brought a bell — they mean to "tune" this place!'],
          ['owen', '……來得真快。我們從雷鳴河乘木筏往下游走。', '…So soon. We take rafts down the Thunder River.'],
          ['rowan', '我得去一趟南風鎮。我有一封要送去燈塔的信……也順便看看聖詠院在那裡做什麼。', 'I need to go to Southwind. I\'ve a letter for the lighthouse — and I\'ll see what the Choir is up to there.'],
          ['aria', '洛恩……', 'Rowan…'],
          ['rowan', '別擔心。信使最守時了。我一定會回來。', 'Don\'t worry. Couriers are always on time. I\'ll be back.'],
        ]);
        A.leave('rowan'); A.set('c5_owen');
        A.setParty(['aria', 'edmund', 'sai', 'owen']);
        await A.join('owen', { silent: true });
        A.goal('從山谷南方的河口（雷鳴河）坐木筏往下游。', 'Take a raft down the Thunder River, at the river mouth south of the valley.');
        return;
      }
      return A.talk([['owen', '沒有鐘的地方，也有歌。', 'Even where there are no bells, there is song.']]);
    }, { when: (A) => ch(A) <= 5 }),
    chat(10, 3, 'soldier', [[null, [['man', '我天生聽不見高音，聖詠院就說我「不合調」。在這裡，沒有人在乎。', 'I was born unable to hear high notes, so the Choir called me "out of tune". Here, nobody cares.']]]]),
    chat(15, 9, 'woman', [[null, [['woman', '沒有鐘，灰潮每年都會來。我們學會了在霧來的時候，大聲地一起唱歌。', 'Without a bell the Ashtide comes every year. We\'ve learned to sing together, loudly, when the mist arrives.']]]]),
  );
  M.river.gate = (A) => (!A.flag('c5_owen') ? [[null, '湍急的河流。需要木筏才能下去。', 'A rushing river. You\'d need a raft.']] : A.flag('c5_river') ? [[null, '木筏已經不在了。', 'The raft is gone.']] : null);
  const r3 = M.river_3;
  r3.triggers.push(trig(...K.endRoom(r3), async (A) => {
    if (A.flag('c5_river')) return;
    await A.talk([
      ['gearwick', '哈哈哈！雷鳴河是我的試驗場！看我的蒸汽螃蟹一號機！', 'Ha-ha-HA! The Thunder River is my proving ground! Behold my Steamcrab, Mark One!'],
      ['sai', '一隻……冒煙的螃蟹？', 'A… smoking crab?'],
      ['gearwick', '是「蒸汽動力水陸兩用甲殼戰車」！給我記清楚！', 'It is a "Steam-Powered Amphibious Carapace Chariot"! Get it RIGHT!'],
    ]);
    await A.battle(['octa'], { boss: true, bg: 'water' });
    await A.talk([
      ['gearwick', '可、可惡……鍋爐壓力太高了……要爆了！', 'C-curses… the boiler pressure\'s too high… it\'s going to blow!'],
      [null, '蒸汽螃蟹炸開了。熱浪掀翻了木筏，木筏衝向了瀑布——', 'The steamcrab bursts. The blast flips the raft, and the raft shoots toward the falls—'],
      ['edmund', '賽伊——！', 'SAI—!'],
      ['sai', '別管我！去北方！我們在霜石鎮會合——', 'Never mind me! Go north! We meet in Frostvale—'],
    ]);
    A.set('c5_river');
    return scenario(A);
  }, { when: (A) => ch(A) === 5 && !A.flag('c5_river') }));
  // ================================================================ 6A: Southwind's lighthouse bell (Rowan)
  const sw = M.southwind;
  K.setTile(sw, 21, 15, '>');
  sw.warps.push({ x: 21, y: 15, to: 'swtunnel' });
  M.swtunnel.exitTo = null;
  sw.npcs.push(
    npc(19, 18, 'imperial', [['soldier', '這裡是聖詠院的調音所。閒雜人等不准進入！', 'This is the Choir\'s tuning house. No civilians!']], { when: (A) => ch(A) === 61 && !A.flag('c6a_disguise') }),
    npc(5, 2, 'merchant', async (A) => {
      if (ch(A) === 61 && !A.flag('c6a_disguise')) {
        await A.talk([
          ['merchant', '信使先生！太好了，這箱調音叉要送進聖詠院的調音所。可是我怕得不敢去……', 'Mr. Courier! Thank goodness. This crate of tuning forks has to go into the Choir\'s tuning house, but I\'m too scared to take it…'],
          ['rowan', '（……正好。有了送貨單，就能光明正大地走進去。）', '(…Perfect. With a delivery slip, I can walk right in through the front.)'],
          ['rowan', '交給我。信使的通行證，連聖詠院都得放行。', 'Leave it to me. Even the Choir has to let a courier\'s pass through.'],
        ]);
        A.set('c6a_disguise');
        A.goal('帶著送貨單，從調音所（右下的宅邸）走進地下室。', 'With the delivery slip, walk into the tuning house (the manor, bottom right) and down to the cellar.');
        return;
      }
      return A.talk([['merchant', '生意人，生意人。', 'Business is business.']]);
    }),
    chat(10, 9, 'imperial', [[(A) => ch(A) === 61, [['soldier', '聽說地下室關著一個守鐘騎士。她拒絕「榨音」，被判了不合調。', 'They say there\'s a Bell Warden locked in the cellar. She refused to "press" the bell, so they judged her out of tune.']]], [(A) => ch(A) !== 61, [['man', '港口的船，可以到很遠的地方。', 'Ships from this port go a long way.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '燈塔的鐘聲越來越小了。聖詠院說，要「榨」出最後的力量才夠用。', 'The lighthouse bell grows fainter every day. The Choir says they must "press" out the last of its strength.']]], [(A) => ch(A) >= 7, [['woman', '燈塔的鐘，又響回原來的聲音了。', 'The lighthouse bell rings with its old voice again.']]]]),
    chat(24, 9, 'sailor', [[null, [['man', '往南的堤道被封住了。往雨城的路走不通。', 'The causeway south is closed. You can\'t get to Rainhold.']]], [(A) => A.flag('sw_open'), [['man', '堤道開了！往南就是雨城和金鍍城。', 'The causeway is open! South lies Rainhold, and Gilden.']]]]),
  );
  M.swtunnel.triggers.push(trig(M.swtunnel.anchor.start[0] - 2, M.swtunnel.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      [null, '地下室的盡頭，一個穿著燈塔制服的女騎士被鐵鍊鎖在牆上。', 'At the end of the cellar, a woman knight in a lighthouse uniform hangs in chains.'],
      ['soldier', '不合調者瑟琳娜。明天就要送去聖詠都「重新調音」了。', 'Selene, out of tune. Tomorrow she goes to the capital to be "retuned".'],
      ['rowan', '（守衛走了。）……妳是燈塔的守鐘騎士？我有一封給燈塔的信。', '(The guard leaves.) …You\'re the lighthouse Bell Warden? I\'ve a letter for the lighthouse.'],
      ['selene', '……是寄給上一任守鐘人的吧。她三年前就走了。', '…For the warden before me, I expect. She passed three years ago.'],
      ['selene', '他們要我「榨音」——把燈塔鐘裡的星靈榨到一滴不剩。那隻星靈，從我小時候就在唱歌給我聽。', 'They ordered me to "press" the bell — to squeeze the Astral inside it until nothing was left. That Astral has sung to me since I was a child.'],
      ['selene', '我這輩子從沒違抗過命令。那是第一次。', 'I had never disobeyed an order in my life. That was the first time.'],
      ['rowan', '……我放妳出去。', '…I\'ll get you out.'],
      ['selene', '為什麼？你只是個送信的。', 'Why? You only carry letters.'],
      ['rowan', '因為我曾經有一封信，沒能送到。從那天起我就決定，再也不讓重要的東西停在半路上。', 'Because once there was a letter I couldn\'t deliver. Since that day I\'ve sworn never to let anything important stop halfway.'],
      ['selene', '……奇怪的人。好吧，我欠你一次。', '…What a strange man. Fine. I owe you one.'],
      ['selene', '我的劍叫「吸音劍」。敵人的魔法一碰到它，聲音就會消失在劍裡。', 'My blade is a Hushblade. When an enemy\'s spell touches it, its sound vanishes into the steel.'],
    ]);
    await A.join('selene');
    A.goal('從地下道逃出南風鎮。', 'Escape Southwind through the tunnels.');
  }, { when: (A) => ch(A) === 61 && !A.hasMember('selene') }));
  const st2 = M.swtunnel_2;
  st2.triggers.push(trig(...K.endRoom(st2), async (A) => {
    await A.talk([['selene', '有東西在挖隧道……！', 'Something is tunnelling…!'], ['gearwick', '哈哈哈！別想從地底下溜走！齒輪伯爵的鑽地機，地下也是我的舞台！', 'Ha-ha-HA! No slipping away underground! With Gearwick\'s Burrower, the earth itself is my stage!'], ['rowan', '他到底有幾台機器……', 'How many machines does he HAVE…']]);
    await A.battle(['tunneldrill'], { boss: true, bg: 'cave' });
    A.set('c6a_tunnel');
    await A.talk([['rowan', '出去之後往北走，回霜石鎮。大家說好在那裡會合。', 'Once we\'re out we head north, back to Frostvale. That\'s where we agreed to meet.'], ['selene', '我還沒說要跟你走。……算了，順路。', 'I never said I was coming with you. …Never mind. It\'s on the way.']]);
    A.world(14, 26, 'down', 'b');
    A.goal('往北回到霜石鎮。', 'Go north, back to Frostvale.');
  }, { when: (A) => ch(A) === 61 && !A.flag('c6a_tunnel') }));
  // ================================================================ 6B: the silencing engine, Kasumi, the Drowned Bell, the Wildlands, the trench (Sai)
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
      ['sai', '（河上架著一台巨大的機器，像一口倒過來的鐘……它在吸著什麼。）', '(A huge machine straddles the river, like an upturned bell… it\'s drinking something in.)'],
      ['soldier', '大指揮者，消音機已經接上了。霞之國的守護星靈「霞鳴」的歌，正順著河水流過來。', 'High Conductor, the silencing engine is connected. The song of Kasumi\'s guardian Astral, Kasumei, is flowing to us down the river.'],
      ['orsay', '很好。霞鳴的歌停了以後，霞之國的人會睡著。不會痛的。', 'Good. When Kasumei\'s song stops, the people of Kasumi will fall asleep. It won\'t hurt.'],
      ['soldier', '可是……他們還會醒來嗎？', 'But… will they ever wake?'],
      ['orsay', '為什麼要醒來呢？醒著的人，只會一直失去。', 'Why should they? Those who are awake only go on losing.'],
      ['sai', '（那個說話溫柔的人……就是大指揮者？）', '(That soft-spoken man… is the High Conductor?)'],
      ['orsay', '……那邊的拳僧先生。偷聽是不好的習慣喔。', '…Monk, over there. Eavesdropping is a bad habit, you know.'],
    ]);
    await A.battle(['trooper', 'trooper', 'hound'], { bg: 'field' });
    await A.talk([
      [null, '歐瑟的身影消失在帳篷之間。河上的機器還在低鳴。', 'Orsay slips away between the tents. The machine on the river is still droning.'],
      ['sai', '機器的管子……一路通往東南的沼澤。得先去通知霞之國！', 'The machine\'s pipes run all the way to the swamp in the south-east. First I have to warn Kasumi!'],
    ]);
    A.set('c6b_camp');
    A.goal('往東北方的霞之國趕去！', 'Hurry north-east to Kasumi!');
  };
  const ka = M.kasumi;
  ka.npcs.push(
    npc(19, 3, 'woman', [['mina', '……', '…']], { when: (A) => ch(A) === 62 && !A.flag('c6b_kasumi'), dir: 'up' }),
    npc(21, 3, 'child', [['ren', '……', '…']], { when: (A) => ch(A) === 62 && !A.flag('c6b_kasumi'), dir: 'up' }),
    npc(5, 3, 'kiriyu', null, { when: (A) => !A.hasMember('kiriyu') && ch(A) <= 62 }),
    chat(10, 9, 'guard', [[null, [['guard', '霞之國的刀，是為了守護霞鳴大人而鍛的。', 'The swords of Kasumi are forged to protect Lady Kasumei.']]], [(A) => A.flag('c6b_kasumi'), [['guard', '……城裡的人，大半都還在灰眠裡。', '…Most of the castle still lies in the grey sleep.']]]]),
  );
  ka.onEnter = async (A) => {
    if (ch(A) !== 62 || !A.flag('c6b_camp') || A.flag('c6b_kasumi')) return;
    await A.talk([
      [null, '城裡的人一個接一個倒下。不是死了——他們的臉上沒有表情，像是被灰色的霧蓋住了。', 'All through the castle, people are falling. Not dead — their faces are blank, as if covered by grey mist.'],
      ['kiriyu', '美奈！廉！', 'Mina! Ren!'],
      ['mina', '……老頭子……你的眼睛……看得見我嗎……廉說……想看爺爺鍛刀……', '…Old man… your eyes… can you see me…? Ren said… he wanted to watch Grandpa forge a sword…'],
      ['kiriyu', '別說話……我看得見。我看得見！', 'Don\'t talk… I can see you. I can see you!'],
      [null, '……', '…'],
      ['kiriyu', '……美奈？……廉？', '…Mina? …Ren?'],
      ['sai', '這是「灰眠」。霞鳴的歌被吸走了，大家就……睡著了。', 'This is the grey sleep. Kasumei\'s song has been drained away, and so everyone has… gone to sleep.'],
      ['sai', '機器的源頭在東南的沼澤。只要關掉它，也許還來得及。', 'The machine\'s source is in the swamp to the south-east. If we shut it down, there may still be time.'],
      ['kiriyu', '……老頭子的眼睛已經快看不見了。可是我還聽得見刀的聲音。', '…These old eyes are nearly gone. But I can still hear a blade.'],
      ['kiriyu', '我是刀匠桐生。在失明之前，我要鍛出一把能斬斷沉默的刀。——先從那台機器開始。', 'I am Kiriyu the swordsmith. Before I lose my sight, I will forge a blade that can cut through silence. Starting with that machine.'],
    ]);
    await A.join('kiriyu');
    await A.talk([[null, '（桐生的「居合」：選擇段數之後，刀會在鞘中蓄勢。段數越高，蓄得越久，斬擊越強。）', '(Kiriyu\'s Iai: pick a level and the blade gathers in its sheath. The higher the level, the longer it gathers and the stronger the cut.)']]);
    await A.talk([['soldier', '還有醒著的人！讓他們也安靜下來！', 'Some are still awake! Make them quiet too!']]);
    await A.battle(['trooper', 'trooper', 'commander'], { bg: 'castle' });
    await A.talk([
      ['sai', '往東南走，穿過渡口就是沉鐘沼澤。', 'South-east, past the landing, lies the Drowned Bell marsh.'],
      ['kiriyu', '……沉鐘。傳說一百年前，有一口鐘因為響得太晚，被人們丟進了沼澤。', '…The Drowned Bell. They say a hundred years ago a bell rang too late, and the people threw it into the marsh.'],
    ]);
    A.set('c6b_kasumi');
    A.goal('往東南方的沉鐘沼澤去。', 'Head south-east to the Drowned Bell marsh.');
  };
  M.ferry.gate = (A) => (!A.flag('c6b_kasumi') ? [[null, '霧氣籠罩的沼澤。水底傳來很低、很低的鐘聲。', 'A fog-wrapped marsh. A very low bell tolls from under the water.']] : null);
  const f3 = M.ferry_3;
  f3.triggers.push(trig(...K.endRoom(f3), async (A) => {
    if (A.flag('c6b_ferry')) return;
    await A.talk([
      ['sai', '機器的管子……全都接在這口鐘上。', 'The machine\'s pipes… they all run into this bell.'],
      ['kiriyu', '它在吞霞鳴的歌。——它自己也在哭。', 'It is swallowing Kasumei\'s song. And it is weeping too.'],
    ]);
    await A.battle(['ferry'], { boss: true, bg: 'dark', music: 'boss' });
    await A.talk([
      [null, '沉鐘裂開了。被吞下去的歌像光一樣，順著河往上游流回去。', 'The Drowned Bell splits open. The swallowed song flows back upriver like light.'],
      [null, '霧裡，傳來一個女人的聲音。', 'From the fog comes a woman\'s voice.'],
      ['mina', '（老頭子。廉醒了喔。我……還要再睡一下。）', '(Old man. Ren is awake. I… need to sleep a little longer.)'],
      ['mina', '（不要等我。去把那把刀鍛完。等世界的聲音回來，我就會醒了。）', '(Don\'t wait for me. Go and finish that blade. When the world\'s sound comes back, I\'ll wake.)'],
      ['kiriyu', '美奈……！', 'Mina…!'],
      ['kiriyu', '……………………', '…………'],
      ['sai', '桐生先生……', 'Master Kiriyu…'],
      ['kiriyu', '走吧。她要我把刀鍛完。', 'Let us go. She wants me to finish the blade.'],
      [null, '裂開的鐘裡，躺著一支小小的銀哨子。上面刻著：「嘉藍」。', 'In the split bell lies a small silver whistle. Carved on it: "Galan".'],
    ]);
    A.set('c6b_ferry'); A.give('coin');
    A.astral('phantom');
    A.world(48, 30, 'right', 'b');
    A.goal('穿過荒原。荒原小屋的人也許知道哨子的主人，和回西邊的路。', 'Cross the Wildlands. The folk at the Wildlands Hut may know whose whistle this is — and the way west.');
  }, { when: (A) => ch(A) === 62 && !A.flag('c6b_ferry') }));
  const wh = M.wildhut;
  wh.npcs.push(
    chat(10, 9, 'oldman', [[null, [['hunter', '荒原上有個男孩，每天都對著魔物吹口哨，可是吹不出聲音。他說他的哨子掉進沼澤裡了。', 'There\'s a boy out on the Wildlands who whistles at the beasts every day — but no sound comes out. Says his whistle fell into the swamp.']]],
      [(A) => A.hasMember('galan'), [['hunter', '要回西邊大陸，就走東南海岸的海蛇洞窟。洞窟在海底，一路通到南風鎮附近。', 'To get back west, take the Serpent Trench on the south-east coast. It runs under the sea all the way to Southwind.']]]]),
    npc(15, 9, 'galan', async (A) => {
      if (!A.has('coin')) return A.talk([['galan', '……（他把手指放在嘴邊，用力地吹。沒有聲音。）', '…(He puts his fingers to his lips and blows hard. No sound comes out.)']]);
      A.take('coin');
      await A.talk([
        ['galan', '我的哨子！！在哪裡找到的？', 'My whistle!! Where did you find it?'],
        ['sai', '在沼澤裡的一口鐘裡面。', 'Inside a bell, in the swamp.'],
        ['galan', '嗶——！……聽到了嗎？團長奶奶說，只要這支哨子響，馬戲團的大家就會回來。', 'Phweeet—! …Did you hear? Grandma — the ringmaster — said that as long as this whistle sounds, everyone in the circus will come back.'],
        ['kiriyu', '馬戲團……？', 'The circus…?'],
        ['galan', '灰潮把帳篷吞掉了。只剩我，還有一隻狼。狼跑到荒原去了，可是牠聽得到哨子。', 'The Ashtide ate the big tent. There was only me left, and one wolf. The wolf ran off into the Wildlands, but it can hear the whistle.'],
        ['galan', '我跟你們走！我會讓魔物變成朋友，然後學牠們打架！', 'I\'m coming with you! I make friends with the monsters and then fight like them!'],
      ]);
      await A.join('galan');
      await A.talk([[null, '（嘉藍的「馴獸」：打倒魔物之後，嘉藍會和牠們交上朋友，模仿牠們的動作自動戰鬥。在荒原戰鬥一定交得到朋友。）', '(Galan\'s Beastcall: after beating monsters Galan befriends them and fights on his own, mimicking their moves. On the Wildlands he always makes a friend.)']]);
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
  // ================================================================ Rainhold, the city of foggy memories (chapter 8)
  const rh = M.rainhold;
  rh.warps.push({ x: 12, y: 0, to: 'raintower' }, { x: 13, y: 0, to: 'raintower' });
  M.raintower.exitTo = ['rainhold', 12, 1];
  M.rainhold.gate = (A) => (ch(A) < 8 ? [[null, '霧和雨永遠不停的城鎮。城門關著。', 'A town where the fog and rain never stop. The gates are shut.']] : null);
  const FOG = [[['liar', '這座城從來不下雨。……咦，我剛才說了什麼？', 'It never rains in this town. …Eh? What did I just say?']], [['liar', '我有一個女兒。還是兒子？……霧太濃了，我想不起來。', 'I have a daughter. Or was it a son? …The fog\'s too thick. I can\'t remember.']], [['liar', '塔頂的老星靈？牠會把你最想忘掉的事，唱給你聽。', 'The old Astral at the top of the tower? It sings you the thing you most want to forget.']], [['liar', '昨天，一個穿白衣服的男人抱著一個女孩，從城外走過去。……還是前天？', 'Yesterday a man in white walked past the town, carrying a girl. …Or was it the day before?']], [['liar', '小偷？這裡沒有小偷。（他的手伸向你的錢包，然後忘了自己要做什麼。）', 'Thieves? No thieves here. (His hand drifts toward your purse — then he forgets what he was doing.)']]];
  FOG.forEach((l, i) => rh.npcs.push(K.chat([10, 15, 10, 15, 24][i], [3, 3, 9, 15, 9][i], ['thief', 'man', 'woman', 'oldman', 'thief'][i], [[null, l]])));
  const rt3 = M.raintower_3;
  rt3.triggers.push(trig(...K.endRoom(rt3), async (A) => {
    if (A.flag('c8_done')) return;
    await A.talk([['thief', '塔頂的星靈是我們的！聖詠院出了好價錢！', 'The Astral up top is ours! The Choir\'s paying good money!']]);
    await A.battle(['thiefking'], { boss: true, bg: 'castle' });
    await A.talk([
      [null, '塔頂。一隻長著很多耳朵的老星靈，靜靜地坐在雨裡。', 'The top of the tower. An old Astral with many ears sits quietly in the rain.'],
      ['ramus', '……我是伊倫，聆聽者。我聽得見世界上所有的歌。包括那個被抱走的孩子。', '…I am Ilun, the Listener. I hear every song in the world. Including that of the child who was carried away.'],
      ['rowan', '艾莉雅！她在哪裡？', 'Aria! Where is she?'],
      ['ramus', '金鍍城。三天後的大音樂會上，她會站在舞台中央唱歌。', 'Gilden. At the Grand Concert, three days from now, she will stand at the centre of the stage and sing.'],
      ['ramus', '十七年前，星歌在灰潮的最深處，生下了最後一個音。那個音變成了一個嬰兒——就是艾莉雅。', 'Seventeen years ago, in the deepest part of the Ashtide, the Star Song gave birth to its last note. That note became a baby — Aria.'],
      ['ramus', '她的聲音，是星歌本身的聲音。所以她沒有影子——她不是被光照出來的，而是被歌唱出來的。', 'Her voice is the voice of the Star Song itself. That is why she has no shadow: she was not cast by light. She was sung.'],
      ['selene', '那歐瑟要她唱什麼？', 'Then what does Orsay want her to sing?'],
      ['ramus', '「終止符」的前奏。只有星歌自己的聲音，才能讓星歌開始結束。', 'The prelude to the Final Rest. Only the Star Song\'s own voice can make the Star Song begin to end.'],
      ['rowan', '……不會讓他得逞的。', '…We won\'t let him.'],
      ['ramus', '那就帶上我的耳朵吧。化為星晶的我，還能幫你們聽。', 'Then take my ears with you. As a crystal, I can still listen for you.'],
    ]);
    A.scene((g) => { g.fillStyle = 'rgba(255,255,160,0.6)'; g.fillRect(0, 0, 768, 720); }); await A.sleep(0.8); A.scene(null);
    await A.astral('ramus'); await A.astral('sylph'); await A.astral('unicorn');
    A.set('c8_done');
    await A.talk([
      ['edmund', '大音樂會在月光音樂廳。聖詠院的人不會讓我們這種「不合調」的人進去的。', 'The Grand Concert is in the Moonlight Hall. The Choir will never let out-of-tune folk like us through the door.'],
      ['sai', '我聽說音樂會的天燈表演，是請一個退休的雲鯨牧人負責的。叫雷吉斯。', 'I heard the concert\'s sky-lantern show is run by a retired cloud-whale herder. Regis, his name is.'],
    ]);
    await A.chapter(9);
    A.goal('前往西南方的金鍍城，找到雲鯨牧人雷吉斯。', 'Go to Gilden in the south-west and find Regis, the cloud-whale herder.');
  }, { when: (A) => ch(A) === 8 && !A.flag('c8_done') }));
  // ================================================================ Gilden and the Grand Concert (chapter 9)
  const gd = M.gilden;
  gd.npcs.push(
    npc(6, 3, 'regis', async (A) => {
      if (ch(A) === 9 && !A.flag('c9_letter')) {
        await A.talk([
          ['regis', '……天燈的事？我只是個放燈的老頭子。去找別人吧。', '…The lanterns? I\'m just an old man who flies lights. Ask someone else.'],
          ['rowan', '雷吉斯先生。我們要救一個被聖詠院帶走的女孩。她今晚會在音樂會上唱歌。', 'Mr. Regis. We\'re trying to rescue a girl the Choir took. She\'s singing at the concert tonight.'],
          ['regis', '……那個沒有影子的孩子？', '…The child with no shadow?'],
          ['regis', '我在後台看到她了。眼睛是睜著的，可是裡面什麼都沒有。……跟我的寧波斯睡著的時候一樣。', 'I saw her backstage. Her eyes are open, but there\'s nothing in them. …Just like my Nimbus when she fell asleep.'],
          ['edmund', '寧波斯？', 'Nimbus?'],
          ['regis', '我的雲鯨。灰雲裡睡了三年了，現在只會在天上慢慢地漂。我負責天燈，就是為了每晚能飛上去看她。', 'My cloud whale. She\'s been asleep in the grey clouds three years now. She just drifts. I do the lanterns so I can fly up and see her every night.'],
          ['regis', '……好吧。穿上這個。你們今晚是天燈工人。', '…All right. Put these on. Tonight, you\'re lantern crew.'],
        ]);
        A.set('c9_letter');
        A.goal('前往南方的月光音樂廳。和舞台監督說話，開始演出。', 'Go to the Moonlight Concert Hall in the south. Talk to the stage manager to begin.');
        return;
      }
      return A.talk([['regis', '寧波斯，今晚的燈很亮喔。', 'Nimbus, the lanterns are bright tonight.']]);
    }, { when: (A) => !A.hasMember('regis') }),
    npc(9, 3, 'king', [['orwell', '我是歐威爾公爵，這次大音樂會的贊助人。聖詠院說，今晚會誕生「新時代的聲音」。', 'I am Duke Orwell, patron of the Grand Concert. The Choir says tonight we shall hear "the voice of a new age".']]),
    chat(10, 9, 'woman', [[null, [['woman', '金鍍城是有錢人的城。這裡的鐘是純金做的，一天要熔掉三隻星靈。', 'Gilden is a city for the rich. Its bell is solid gold, and it melts three Astrals a day.']]]]),
    chat(15, 15, 'man', [[null, [['man', '今晚的曲目叫《灰燼詠嘆調》。聽說唱完以後，全世界都會變得很安靜。', 'Tonight\'s piece is called "Ash Aria". They say that once it\'s sung, the whole world will become very quiet.']]]]),
  );
  const op = M.opera;
  op.entry = [12, 15, 'up']; op.exitable = true;
  op.gate = (A) => (ch(A) < 9 ? [[null, '今天沒有演出。', 'No performance today.']] : null);
  op.npcs.push(
    npc(13, 11, 'man', async (A) => {
      if (ch(A) === 9 && A.flag('c9_letter') && !A.flag('c9_done')) return concert(A);
      return A.talk([['director', '音樂會永不落幕！', 'The music never ends!']]);
    }),
    npc(13, 3, 'aria', null, { when: (A) => !A.flag('c9_done') }),
  );
  // the cloud whale's back
  M.deck.entry = [11, 5, 'up'];
}

// ---------------------------------------------------------------- the Grand Concert: answering Aria with a counter-melody
const LYRICS = [
  { q: ['艾莉雅：「♪ 睡吧，灰燼裡的一切……」', 'Aria: "♪ Sleep now, all things in the ashes…"'], a: [['♪ 可是灰燼裡還有火', '♪ but embers still burn there'], ['♪ 好的，我們睡吧', '♪ yes, let us sleep'], ['♪ 誰在唱歌？', '♪ who is singing?']], ok: 0 },
  { q: ['艾莉雅：「♪ 聲音只會帶來失去……」', 'Aria: "♪ Sound only brings loss…"'], a: [['♪ 所以閉上耳朵吧', '♪ so close your ears'], ['♪ 也帶來了妳的名字', '♪ it brought us your name too'], ['♪ 失去也沒關係', '♪ loss doesn\'t matter']], ok: 1 },
  { q: ['艾莉雅：「♪ 如果世界明天就要安靜……」', 'Aria: "♪ If the world grows quiet tomorrow…"'], a: [['♪ 今晚，就大聲地唱吧', '♪ then tonight, sing out loud'], ['♪ 那就安靜吧', '♪ then let it be quiet'], ['♪ 我們會忘記一切', '♪ we will forget it all']], ok: 0 },
];
async function concert(A) {
  await A.talk([
    ['director', '天燈工人？快快快，燈要升起來了！', 'Lantern crew? Quick, quick, the lights are going up!'],
    [null, '音樂廳裡坐滿了人。舞台中央，穿著白色禮服的艾莉雅，睜著空空的眼睛。', 'The hall is packed. At the centre of the stage stands Aria in a white gown, her eyes open and empty.'],
    [null, '包廂裡，歐瑟舉起了指揮棒。', 'In his box, Orsay raises his baton.'],
    ['aria', '♪ ……………', '♪ …………'],
    [null, '艾莉雅開始唱了。那是一首很美、很冷的歌。聽的人一個接一個，垂下了頭。', 'Aria begins to sing. It is a lovely, cold song. One by one, the listeners bow their heads.'],
    ['ramus', '（她在唱終止符的前奏。用你們的聲音回應她——唱「對位旋律」！）', '(She is singing the prelude to the Final Rest. Answer her with your own voices — sing a counter-melody!)'],
    ['rowan', '我、我不會唱歌啊！', 'I — I can\'t sing!'],
    ['selene', '我也不會。可是守鐘的人都知道一件事：鐘聲是用來叫醒人的。', 'Neither can I. But every Bell Warden knows one thing: a bell is for waking people up.'],
  ]);
  A.music('opera');
  for (;;) {
    let ok = true;
    for (const L of LYRICS) {
      const i = await A.menu(L.a.map((x) => A.T(...x)), { x: 40, y: 100, w: 176, title: A.T(...L.q), cancel: false });
      if (i !== L.ok) { ok = false; break; }
      await A.talk([['rowan', `「${L.a[L.ok][0]}」`, `"${L.a[L.ok][1]}"`]]);
    }
    if (ok) break;
    await A.talk([[null, '歌聲被艾莉雅的旋律吞了下去。再試一次！', 'The melody swallows your voices. Try again!']]);
  }
  await A.talk([
    [null, '兩條旋律在音樂廳裡交纏。艾莉雅的歌，停了一拍。', 'Two melodies twine through the hall. Aria\'s song falters for a single beat.'],
    ['aria', '……洛恩……？', '…Rowan…?'],
    ['orsay', '……原來如此。妳交到朋友了啊，艾莉雅。', '…I see. You\'ve made friends, Aria.'],
    ['gearwick', '哈哈哈！趁亂行動是發明家的美德！音樂廳的大鐘，由齒輪伯爵收下了！', 'Ha-ha-HA! Seizing the moment is an inventor\'s virtue! The Hall\'s great bell is mine — Count Gearwick\'s!'],
    ['edmund', '他要從天花板偷鐘！快上去！', 'He\'s stealing the bell through the ceiling! Get up there!'],
  ]);
  await A.battle(['rafterrat', 'rafterrat', 'rafterrat'], { bg: 'castle' });
  await A.battle(['octa2'], { boss: true, bg: 'castle' });
  await A.talk([
    ['gearwick', '我、我的管風琴機……音準全跑掉了……！', 'M-my Organ Engine… it\'s gone completely out of tune…!'],
    [null, '大鐘從屋頂掉了下來，砸穿了舞台。灰塵和天燈一起飛上了夜空。', 'The great bell crashes from the roof straight through the stage. Dust and lanterns fly up into the night.'],
    ['rowan', '艾莉雅！', 'Aria!'],
    ['aria', '洛恩……我剛才，好像在一個很安靜的地方……可是我聽到了你們。', 'Rowan… I was somewhere very quiet just now… but I heard you.'],
    ['regis', '這邊！抓住燈繩！', 'This way! Grab the lantern rope!'],
    [null, '屋頂的破洞外，一隻巨大的雲鯨緩緩游過月亮。', 'Beyond the hole in the roof, a vast cloud whale glides slowly across the moon.'],
    ['regis', '……寧波斯？妳醒了？', '…Nimbus? You\'re awake?'],
    ['aria', '剛才的歌……她也聽到了。', 'That song just now… she heard it too.'],
  ]);
  A.warp('deck', 11, 5, 'up');
  await A.talk([
    [null, '雲鯨寧波斯的背上，風很大，很安靜。', 'On the back of Nimbus the cloud whale, the wind is strong, and everything is quiet.'],
    ['regis', '三年了……她第一次自己游起來。', 'Three years… and this is the first time she\'s swum on her own.'],
    ['aria', '對不起。我剛才唱的歌，讓很多人睡著了。', 'I\'m sorry. The song I sang made a lot of people fall asleep.'],
    ['rowan', '妳最後唱的那一句不一樣。那一句，叫醒了一隻鯨魚。', 'The last line you sang was different. That line woke a whale.'],
    ['regis', '……我對聖詠院沒興趣。可是能叫醒寧波斯的歌，我想再多聽幾次。', '…I\'ve no interest in the Choir. But a song that can wake Nimbus — I\'d like to hear it a few more times.'],
    ['regis', '寧波斯會載你們去任何地方。她只聽我的口令——所以，我也跟著。', 'Nimbus will carry you anywhere. She only listens to me, mind — so I\'m coming too.'],
    [null, '（雷吉斯的「天候輪」：三格天候轉輪轉動時，按確定鍵一格一格停下。對齊三個相同的天候圖案，就會颳起那種天氣。）', '(Regis\'s Weather Wheel: the three rings spin; press OK to stop them one by one. Line up three of the same sign and that weather blows in.)'],
  ]);
  await A.join('regis');
  await A.join('aria');
  A.set('c9_done');
  A.airship('blackhawk', [16, 47]);
  A.world(17, 47, 'down', 'b');
  await A.talk([[null, '── 第一幕　完 ──', '── End of Act I ──']]);
  await A.chapter(10);
  A.goal('騎上雲鯨（走到牠旁邊按確定），飛往東南方聖詠院的本土，前往聖詠都威克斯。', 'Mount the cloud whale (stand beside her and press OK) and fly south-east to the Choir\'s homeland and its capital, Vexhold.');
}
