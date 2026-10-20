// ASH ARIA — Act II 承 · The Silent Chorale: the Choir's capital, the Crystal Foundry, the Origin Gate, the trial,
// the burning archive of Samar, the Astral Valley, the Sky Belfry and the three bells of the Final Rest.
const ch = (A) => A.S.ch;

let ISLE_START = [1, 1];
export function act2(M, K) {
  const { npc, trig, chat } = K;
  ISLE_START = M.isle.anchor.start;
  // ================================================================ Vexhold, the Choir's capital
  const vx = M.vexhold;
  vx.gate = (A) => (ch(A) < 10 ? [[null, '聖詠院的首都。城門的守衛會檢查每個人的「音準」。', 'The Choir\'s capital. The gate wardens check everyone\'s "pitch".']] : null);
  vx.warps.push(
    { x: 12, y: 0, to: 'arcanum', when: (A) => !A.flag('c11_done') }, { x: 13, y: 0, to: 'arcanum', when: (A) => !A.flag('c11_done') },
    { x: 12, y: 0, to: 'palace', at: [10, 12], when: (A) => A.flag('c12_done') && !A.flag('c13_done') }, { x: 13, y: 0, to: 'palace', at: [10, 12], when: (A) => A.flag('c12_done') && !A.flag('c13_done') },
  );
  M.arcanum.exitTo = ['vexhold', 12, 1];
  M.arcanum.gate = (A) => (A.flag('c11_done') ? [[null, '熔晶所的入口塌了。', 'The Foundry\'s entrance has caved in.']] : null);
  vx.onEnter = async (A) => {
    if (ch(A) === 10 && !A.flag('c10_in')) {
      A.set('c10_in');
      await A.talk([
        [null, '聖詠都威克斯。城中央的蒸汽管風琴日夜不停地演奏，每一個音都準得沒有一點誤差。', 'Vexhold, the Choir\'s capital. The steam organ at its heart plays day and night, every note perfectly, exactly in tune.'],
        [null, '街上的人們在同一個拍子上走路，在同一個拍子上微笑。', 'People walk the streets on the same beat, and smile on the same beat.'],
        ['rowan', '……大家看起來都很幸福。幸福得有點可怕。', '…Everyone looks happy. Frighteningly happy.'],
        ['aria', '這首聖詠的低音裡……有星靈在哭。從北邊傳來的。', 'In the bass of that chorale… there are Astrals crying. From the north.'],
        ['edmund', '城北的熔晶所。聖詠院把星靈熔成鐘的晶石的地方。', 'The Crystal Foundry, north of the city. Where the Choir melts Astrals into bell-crystal.'],
      ]);
      await A.chapter(11);
      A.goal('潛入聖詠都北邊的熔晶所（從城北的大門進去）。', 'Infiltrate the Crystal Foundry north of the city (through the north gate).');
    }
    if (ch(A) === 13 && !A.flag('c13_in')) {
      A.set('c13_in');
      await A.talk([
        [null, '星門打開以後，聖詠都的鐘聲變得忽大忽小。管風琴走了一個音。人們第一次在街上停下腳步。', 'Since the Gate opened, the capital\'s bells have wavered, loud then soft. The organ has slipped a note. For the first time, people stop in the street.'],
        ['soldier', '你們就是打開星門的「不合調者」吧。審判官大人傳喚你們到聖詠院大殿。', 'You are the out-of-tune ones who opened the Gate. The Magistrate summons you to the Great Hall of the Choir.'],
        ['edmund', '審判？我們會被判「重新調音」吧。', 'A trial? They\'ll sentence us to be "retuned", surely.'],
        ['aria', '……我想去。我想知道，聖詠院裡有沒有人願意聽。', '…I want to go. I want to know if anyone in the Choir is willing to listen.'],
      ]);
      A.goal('從城北的大門前往聖詠院大殿，接受審判。', 'Go through the north gate to the Great Hall of the Choir and stand trial.');
    }
  };
  vx.npcs.push(
    chat(10, 9, 'imperial', [[null, [['soldier', '聖詠萬歲。……其實我小時候很喜歡亂唱歌。現在不行了。', 'Glory to the Chorale. …I used to love singing out of tune when I was little. Not allowed any more.']]], [(A) => ch(A) >= 13, [['soldier', '管風琴走音的那天，我女兒笑了。好久沒聽到她那樣笑了。', 'The day the organ slipped a note, my daughter laughed. I hadn\'t heard her laugh like that in ages.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '聖詠都的燈從來不會熄滅。靠的是熔晶所做的「鐘晶」。', 'The capital\'s lamps never go out. They run on the "bell-crystal" the Foundry makes.']]]]),
    chat(24, 9, 'man', [[null, [['man', '大指揮者歐瑟？他是個很溫柔的人。每年冬天，他都親自去孤兒院唱搖籃曲。', 'High Conductor Orsay? A very gentle man. Every winter he goes to the orphanage himself to sing lullabies.']]]]),
    chat(10, 15, 'child', [[null, [['child', '審判官雷歐娜大人是大指揮者的妹妹喔！她判案的時候，連一個字都不會聽錯！', 'Magistrate Leona is the High Conductor\'s sister! When she judges a case, she never mishears a single word!']]]]),
    npc(6, 3, 'nightcrow', async (A) => {
      if (A.hasMember('nightcrow') || A.flag('nightcrow_gone')) return;
      await A.talk([['nightcrow', '……我是賞金獵人。我在追一個把孩子賣進熔晶所的男人。順路的話，付錢我就跟你們走。一千五百金幣。', '…I\'m a bounty hunter. I\'m tracking a man who sells children to the Foundry. If our roads run together, pay me and I\'ll walk with you. Fifteen hundred gil.']]);
      const i = await A.ask('要雇用夜鴉嗎？（1500 金幣）', 'Hire Nightcrow? (1500 gil)', [['雇用', 'Hire'], ['不用', 'No']]);
      if (i !== 0) return;
      if (A.S.gil < 1500) return A.talk([['nightcrow', '……錢不夠。', '…Not enough.']]);
      A.gil(-1500);
      await A.talk([['nightcrow', '契約成立。灰羽，走了。', 'A deal. Greyfeather, come.'], [null, '（夜鴉的「投擲」可以丟出手裡劍、卷軸和武器。她的老鷹「灰羽」會撲向攻擊她的敵人。）', '(Nightcrow\'s Throw hurls stars, scrolls and weapons. Her hawk Greyfeather dives at anyone who strikes her.)']]);
      await A.join('nightcrow', { force: false });
    }, { when: (A) => ch(A) >= 13 && ch(A) <= 14 && !A.hasMember('nightcrow') }),
  );
  // ================================================================ the Crystal Foundry (chapter 11)
  const ar3 = M.arcanum_3;
  ar3.triggers.push(trig(...K.endRoom(ar3), async (A) => {
    await A.talk([['aria', '有好幾首歌……被硬塞進了同一個身體裡……', 'Several songs… forced into one body…']]);
    await A.battle(['no128'], { boss: true, bg: 'empire' });
    await A.talk([
      [null, '熔晶所的最深處。熔爐的旁邊，一排排的玻璃槽裡，關著等待熔化的星靈。', 'The Foundry\'s heart. Beside the furnace, row after row of glass tanks hold Astrals waiting to be melted.'],
      ['aria', '……還活著。牠們還活著！', '…They\'re alive. They\'re still alive!'],
      ['kirisa', '（……孩子……我們已經太虛弱了，回不了家。把我們帶走吧。化為星晶的我們，還能為妳唱歌。）', '(…Child… we are too weak to go home. Take us with you. As crystals, we can still sing for you.)'],
      ['kalan', '……果然是妳，艾莉雅大人。', '…So it is you, Lady Aria.'],
      ['rowan', '卡蘭……！', 'Kalan…!'],
      ['kalan', '大指揮者命令我，在熔晶所等妳。他知道妳一定會來救牠們。', 'The High Conductor ordered me to wait for you here. He knew you would come to save them.'],
      ['aria', '你要抓我回去嗎？', 'Are you taking me back?'],
      ['kalan', '……我的工作，是保護妳。從妳五歲那年起，從來都是。', '…My task is to protect you. Ever since you were five. It always has been.'],
      ['kalan', '北邊的礦車通道沒有人守。快走。', 'The ore-cart tunnel to the north is unguarded. Go.'],
      ['soldier', '（噹噹噹！）熔晶所有入侵者！敲響警鐘！', '(CLANG CLANG!) Intruders in the Foundry! Ring the alarm bell!'],
      ['selene', '警鐘交給我。我的吸音劍，可以讓那口鐘發不出聲音。', 'Leave the alarm bell to me. My Hushblade can stop that bell making a sound.'],
      ['rowan', '瑟琳娜，一起走！', 'Selene, come with us!'],
      ['selene', '鐘一響，整座城的守衛都會來。總得有人讓它安靜。……我們在星門會合。守鐘的人，最會等了。', 'If that bell rings, every warden in the city will come. Someone has to keep it quiet. …We meet at the Gate. Bell Wardens are good at waiting.'],
    ]);
    A.scene((g) => { g.fillStyle = 'rgba(180,220,255,0.5)'; g.fillRect(0, 0, 768, 720); }); await A.sleep(0.6); A.scene(null);
    await A.astral('kirisa'); await A.astral('ifrion'); await A.astral('zona'); await A.astral('carbuncle');
    A.leave('selene'); A.set('selene_gone'); A.set('c11_done');
    await A.talk([
      [null, '一行人搭上運送礦石的礦車，衝出了熔晶所。身後的警鐘，一聲都沒有響。', 'The party leaps onto an ore cart and hurtles out of the Foundry. Behind them, the alarm bell never makes a sound.'],
      ['aria', '熔晶所裡還有好多星靈……就算救出來，世界上也沒有地方讓牠們安全地活著。', 'There are so many Astrals left in the Foundry… and even if we free them, there\'s nowhere in this world they\'d be safe.'],
      ['sai', '星靈的故鄉，在「始源之門」的另一邊。門就在聖詠都東北邊的山裡。', 'The Astrals\' homeland lies beyond the Origin Gate. It\'s in the mountains north-east of the capital.'],
      ['aria', '我是星歌唱出來的孩子。也許……我能打開它。讓牠們回家。', 'I\'m a child the Star Song sang into being. Maybe… I can open it. And let them go home.'],
    ]);
    A.warp('vexhold', 12, 1, 'down');
    await A.chapter(12);
    A.goal('前往聖詠都東北方山中的始源之門。', 'Go to the Origin Gate in the mountains north-east of the capital.');
  }, { when: (A) => ch(A) === 11 }));
  // ================================================================ the Origin Gate (chapter 12)
  M.gate.gate = (A) => (!A.flag('c11_done') ? [[null, '一道刻滿五線譜的大門，緊緊地封閉著。', 'A great door carved all over with musical staves, sealed tight.']] : A.flag('c12_done') ? [[null, '始源之門已經打開了。裡面只剩下風聲。', 'The Origin Gate stands open. Only the wind is left inside.']] : null);
  M.gate.triggers.push(trig(M.gate.anchor.start[0] - 2, M.gate.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      ['selene', '……你們好慢。', '…You took your time.'],
      ['rowan', '瑟琳娜！妳沒事！', 'Selene! You\'re all right!'],
      ['selene', '警鐘一整晚都沒響。守衛們以為是鐘壞了，還在拿鎚子敲。', 'The alarm bell didn\'t ring all night. The guards thought it was broken and kept whacking it with hammers.'],
      ['rowan', '……謝謝。那時候，我很怕又要有一個人，停在半路上。', '…Thank you. Back there, I was so afraid someone else would be left halfway.'],
      ['selene', '我又不是信。……走吧。', 'I\'m not a letter. …Let\'s go.'],
    ]);
    A.unset('selene_gone');
    await A.join('selene');
  }, { when: (A) => A.flag('selene_gone') && ch(A) === 12 }));
  const g2 = M.gate_2;
  g2.triggers.push(trig(...K.endRoom(g2), async (A) => {
    await A.talk([['edmund', '門前有守衛……是一千年前留下的巨像！', 'Something guards the Gate… a colossus from a thousand years ago!']]);
    await A.battle(['gateguard'], { boss: true, bg: 'cave' });
    await A.talk([
      [null, '巨大的門。門的另一邊，傳來無數的聲音，像遙遠的合唱。', 'The great Gate. From the other side come countless voices, like a far-off choir.'],
      ['aria', '……我是艾莉雅。星歌的最後一個音。', '…I am Aria. The last note of the Star Song.'],
      ['aria', '請打開吧。讓大家回家。', 'Please open. Let them all go home.'],
      [null, '艾莉雅唱出一個音。門開了。', 'Aria sings a single note. The Gate opens.'],
    ]);
    A.quake(2); A.scene((g) => { g.fillStyle = 'rgba(255,240,200,0.75)'; g.fillRect(0, 0, 768, 720); }); await A.sleep(1.2); A.scene(null);
    await A.talk([
      [null, '世界各地的鐘裡，被困住的星靈們聽見了那個音。牠們掙脫了鐘，像流星一樣，一隻一隻飛進門裡。', 'In bells all across the world, trapped Astrals hear that note. They break free and fly through the Gate one by one, like shooting stars.'],
      ['galan', '好漂亮……！', 'So pretty…!'],
      ['aria', '……？', '…?'],
      [null, '可是，風變小了。河水的聲音也變小了。整個世界，好像少了一點什麼。', 'But the wind grows softer. So does the sound of the river. The whole world seems to be missing something.'],
      ['ramus', '（……星靈就是星歌的音符。音符離開了這個世界，歌就變小了。）', '(…Astrals are the notes of the Star Song. When the notes leave this world, the song grows smaller.)'],
      ['orsay', '謝謝妳，艾莉雅。妳替我做了我做不到的事。', 'Thank you, Aria. You\'ve done what I could not.'],
      ['aria', '爸爸……！你是故意讓我來的？', 'Father…! You meant for me to come here?'],
      ['orsay', '我只是相信妳的溫柔。妳和我一樣，看不得任何東西受苦。', 'I simply trusted your kindness. You\'re like me. You can\'t bear to see anything suffer.'],
      ['orsay', '星歌已經很累了。讓它慢慢地，安靜下來吧。', 'The Star Song is so very tired. Let it grow quiet, slowly.'],
    ]);
    A.set('c12_done');
    A.warp('gate', ...M.gate.anchor.start, 'down');
    await A.chapter(13);
    A.goal('回到聖詠都威克斯看看。', 'Return to Vexhold.');
  }, { when: (A) => ch(A) === 12 && !A.flag('c12_done') }));
  // ================================================================ the Great Hall and the trial (chapter 13)
  const pl = M.palace;
  pl.exitTo = ['vexhold', 12, 1]; pl.exitable = true; pl.entry = [10, 12, 'up'];
  pl.npcs.push(
    npc(12, 2, 'leopold', (A) => trial(A), { when: (A) => !A.flag('c13_done') }),
    npc(12, 4, 'imperial', [['soldier', '肅靜。審判官大人要開庭了。', 'Silence. The Magistrate is about to open the court.']], { when: (A) => !A.flag('c13_done') }),
    chat(4, 4, 'imperial', [[null, [['general', '我是聖詠院的長老。……老實說，管風琴走音的那天，我鬆了一口氣。', 'I am an elder of the Choir. …Honestly, the day the organ slipped a note, I felt relieved.']]]], { move: false }),
    chat(20, 7, 'imperial', [[null, [['soldier', '大指揮者今天不在大殿。聽說他去了東方的山谷。', 'The High Conductor isn\'t in the Hall today. They say he\'s gone to the valley in the east.']]]], { move: false }),
    chat(5, 11, 'woman', [[null, [['woman', '雷歐娜大人只聽真話。好好回答她的問題吧。', 'Lady Leona only listens to the truth. Answer her questions well.']]]], { move: false }),
  );
  // ================================================================ Samar, the archive village (chapter 14)
  const sm = M.samar;
  sm.gate = (A) => (ch(A) < 14 ? [[null, '森林深處的小村子。門上寫著：「書庫重地，閒人勿入」。', 'A little village deep in the forest. The sign on the gate reads: "Archive grounds. No visitors."']] : null);
  sm.npcs.push(
    npc(6, 3, 'bolo', async (A) => {
      if (ch(A) === 14 && !A.flag('c14_fire')) {
        await A.talk([
          ['bolo', '呵呵，客人？我是波洛，研究魔物的老頭子。薩瑪的書庫裡，有全世界最多的魔物圖鑑。', 'Ho-ho, visitors? I\'m Bolo, an old man who studies monsters. Samar\'s archive holds more bestiaries than anywhere in the world.'],
          ['lili', '還有「最初的樂譜」！星歌第一次被寫下來的樂譜！我每天都在抄它！', 'And the First Score! The very first time the Star Song was ever written down! I copy it out every day!'],
          ['bolo', '莉莉，那是祕密。', 'Lili, that\'s a secret.'],
          ['leopold', '……最初的樂譜。聖詠院找它找了兩百年。哥哥說，那是「一切錯誤的開始」。', '…The First Score. The Choir has searched for it for two hundred years. My brother calls it "the beginning of every mistake".'],
          ['villager', '失火了！書庫著火了！是聖詠院的人放的！', 'FIRE! The archive is burning! The Choir set it!'],
          ['bolo', '……樂譜！莉莉！莉莉呢？', '…The Score! Lili! Where\'s Lili?'],
          ['villager', '我看到莉莉衝進書庫了！她說要把樂譜救出來！', 'I saw Lili run into the archive! She said she\'d save the Score!'],
          ['bolo', '那個傻孩子！', 'That foolish child!'],
        ]);
        A.set('c14_fire');
        A.warp('burning', ...M.burning.anchor.start, 'up');
        A.goal('衝進燃燒的書庫，救出莉莉！', 'Rush into the burning archive and save Lili!');
        return;
      }
      return A.talk([['bolo', '書可以重抄。可是抄書的人，只有一個。', 'Books can be copied again. But there is only one of the girl who copies them.']]);
    }, { when: (A) => !A.hasMember('bolo') }),
    npc(4, 3, 'lili', null, { when: (A) => !A.flag('c14_fire') }),
    chat(10, 9, 'man', [[null, [['man', '薩瑪的人什麼都抄。歌、故事、食譜，還有吵架的內容。', 'Samar folk write down everything. Songs, stories, recipes, even what people said in arguments.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '東邊的山谷裡，有好多沒有回家的星靈。牠們不肯走，說要陪著這個世界。', 'There are lots of Astrals in the valley to the east that didn\'t go home. They won\'t leave — they say they\'ll stay with this world.']]]]),
  );
  M.burning.exitTo = ['samar', 12, 10];
  const b2 = M.burning_2;
  b2.triggers.push(trig(...K.endRoom(b2), async (A) => {
    await A.talk([['rowan', '火在動……是火焰的魔物！', 'The fire is moving… it\'s a fire monster!']]);
    await A.battle(['flamelord'], { boss: true, bg: 'dark' });
    await A.talk([
      ['lili', '咳咳……樂譜沒事！你們看！', '*cough* The Score\'s safe! Look!'],
      ['bolo', '莉莉！你這個傻孩子……', 'Lili! You foolish child…'],
      ['lili', '老師，你剛才用了那隻冰鳥的招式吧？你明明說只是研究，不會用的！', 'Teacher, you just used that ice-bird\'s move, didn\'t you? You said you only studied them, you\'d never use them!'],
      ['bolo', '……唉。看來是瞞不住了。看過一次的招式，我就學得會。', '…Sigh. No hiding it now. Any move I see once, I can learn.'],
      ['aria', '這份樂譜……在唱歌。很小聲，可是在唱。', 'This score… it\'s singing. Very softly, but it\'s singing.'],
      ['lili', '真的嗎？我抄了五年，從來沒聽過！', 'Really? I\'ve copied it for five years and never heard it!'],
      ['bolo', '我跟你們去。星靈們藏身的山谷，我知道路。', 'I\'ll come with you. I know the way to the valley where the Astrals hide.'],
      ['lili', '我也要去！樂譜要跟我在一起才安全！', 'Me too! The Score\'s only safe with me!'],
      [null, '（莉莉的「謄錄」：把敵人抄進書裡，書頁會使出那個敵人的招式。波洛的「識技」：只要看過魔物使用識技，就會學會。）', '(Lili\'s Transcribe copies a foe into her book, and the page uses that foe\'s moves. Bolo\'s Studied Arts: he learns any technique he sees a monster use.)'],
    ]);
    await A.join('bolo'); await A.join('lili');
    if (A.hasMember('nightcrow')) { await A.talk([['nightcrow', '……我追的男人往北逃了。契約到此為止。', '…The man I\'m hunting fled north. Our contract ends here.'], ['lili', '那隻鳥好帥！', 'That bird is so cool!'], ['nightcrow', '……牠叫灰羽。', '…Her name is Greyfeather.']]); A.leave('nightcrow', { gone: true }); }
    A.set('nightcrow_met');
    A.setParty(['aria', 'leopold', 'bolo', 'rowan']);
    A.set('c14_done');
    A.warp('samar', 12, 10, 'down');
    await A.chapter(15);
    A.goal('前往東方的星靈之谷，和留下來的星靈談和。', 'Go to the Astral Valley in the east and make peace with the Astrals who stayed.');
  }, { when: (A) => ch(A) === 14 && !A.flag('c14_done') }));
  // ================================================================ the Astral Valley (chapter 15)
  M.valley.gate = (A) => (ch(A) < 15 ? [[null, '山谷的入口被一層發光的霧擋住了。', 'A glowing mist blocks the mouth of the valley.']] : null);
  const v2 = M.valley_2;
  v2.triggers.push(trig(...K.endRoom(v2), async (A) => {
    await A.talk([
      ['astralElder', '……人類。還有，星歌的孩子。', '…Humans. And the child of the Song.'],
      ['leopold', '星靈的長老。我是聖詠院的審判官雷歐娜。聖詠院對你們做的事，是我們的罪。我是來認罪的。', 'Elder of the Astrals. I am Leona, Magistrate of the Choir. What the Choir did to you is our crime. I have come to confess it.'],
      ['astralElder', '……認罪的人類，我還是第一次見到。', '…A human who confesses. That is a first.'],
      ['aria', '你們為什麼不回家？門已經開了。', 'Why didn\'t you go home? The Gate is open.'],
      ['astralElder', '因為我們走了，這個世界的歌就停了。我們想陪著它，到最後一個音。', 'Because if we leave, this world\'s song stops. We want to stay with it, to the very last note.'],
      ['orsay', '……多麼溫柔啊。所以，讓我來送你們最後一程吧。', '…How gentle. Then let me see you off, to the end.'],
      ['leopold', '哥哥……！', 'Brother…!'],
      [null, '歐瑟身後，站著一排穿白袍、沒有臉的歌者——「沉默聖歌隊」。卡蘭也在他身邊。', 'Behind Orsay stands a row of white-robed, faceless singers: the Silent Chorus. Kalan stands at his side.'],
      ['orsay', '卡蘭，把艾莉雅帶過來。她不該看到接下來的事。', 'Kalan, bring Aria here. She shouldn\'t see what happens next.'],
      ['kalan', '……', '…'],
      ['kalan', '……恕我拒絕，大指揮者。', '…I must refuse, High Conductor.'],
      [null, '卡蘭轉過身，舉劍擋在艾莉雅的面前。', 'Kalan turns and raises his sword in front of Aria.'],
      ['orsay', '……是嗎。你也累了啊，卡蘭。', '…I see. You\'re tired too, Kalan.'],
    ]);
    await A.battle(['vissek1'], { boss: true, bg: 'forest', music: 'vissek' });
    await A.talk([
      ['orsay', '……很好的聲音。可是，聲音總會停的。', '…A fine sound. But every sound must stop.'],
      [null, '沉默聖歌隊張開了嘴。沒有任何聲音——山谷裡的星靈，卻一隻接一隻凝固成了結晶。', 'The Silent Chorus opens its mouths. There is no sound at all — yet one by one the Astrals in the valley freeze into crystal.'],
      [null, '那首無聲的歌，朝艾莉雅湧了過去——卡蘭擋在她的面前。', 'The soundless song surges toward Aria — and Kalan stands in its way.'],
      ['aria', '卡蘭！！', 'KALAN!!'],
      ['kalan', '……艾莉雅大人。我一直……都很喜歡聽妳唱歌。', '…Lady Aria. I always… loved to hear you sing.'],
      ['kalan', '妳小時候，偷偷在花園裡唱……走音的那種……那是我聽過……最好的……', 'When you were little, you\'d sing in the garden when no one was listening… all out of tune… it was the best thing… I ever…'],
      [null, '卡蘭的劍，落在了雪白的花上。', 'Kalan\'s sword falls among the white flowers.'],
      ['orsay', '……睡吧，卡蘭。你辛苦了。', '…Sleep, Kalan. You\'ve worked so hard.'],
      ['leopold', '哥哥！你連他都——！', 'Brother! Even him—!'],
      ['orsay', '雷歐娜。妳小時候也很怕打雷。等一切結束，就再也不會有雷聲了。', 'Leona. You were afraid of thunder when you were small. When this is over, there will never be thunder again.'],
      [null, '大地劇烈搖晃。遠方的海面上，一座巨大的鐘樓連著它腳下的土地，升上了天空。', 'The ground heaves. Far out over the sea, a vast belfry rises into the sky, with the land beneath it.'],
      ['bolo', '天空鐘樓……傳說中，三口最古老的鐘就在那上面。', 'The Sky Belfry… the legend says the three oldest bells hang up there.'],
      ['astralElder', '……孩子。把妳唱進這個世界的那個音，在這裡。帶著它……去阻止他……', '…Child. The note that sang you into this world is here. Take it… and stop him…'],
    ]);
    A.quake(2);
    await A.astral('maduin'); await A.astral('shoat'); await A.astral('fenrir');
    await A.talk([
      ['leopold', '……我要回聖詠都。那裡還有很多相信哥哥的人，我得讓他們知道真相。', '…I\'m going back to the capital. There are still so many who believe in my brother. They need to know the truth.'],
      ['leopold', '艾莉雅。卡蘭用命保護的歌，不要讓它停下來。', 'Aria. The song Kalan gave his life to protect — don\'t let it stop.'],
    ]);
    A.leave('leopold', { gone: true }); A.set('c15_done'); A.free();
    await A.talk([['regis', '追一座飛上天的鐘樓？哈，寧波斯最喜歡追風了。回她背上去吧！', 'Chase a belfry into the sky? Ha — Nimbus loves chasing the wind. Back on her back!']]);
    A.warp('valley', ...M.valley.anchor.start, 'down');
    A.goal('回到雲鯨身邊，飛向天空鐘樓。（騎上雲鯨就會出發）', 'Return to the cloud whale and fly to the Sky Belfry. (Mounting her sets off.)');
  }, { when: (A) => ch(A) === 15 && !A.flag('c15_done') }));
  // ================================================================ the sky battle and the Sky Belfry (chapters 16 and 17)
  M.world.onBoard = (A) => (A.flag('c15_done') && !A.flag('c16_sky') ? skyBattle : null);
  const i1 = M.isle;
  i1.gate = (A) => [[null, '只有雲鯨才能到達。', 'Only the cloud whale can reach it.']];
  i1.triggers.push(trig(i1.anchor.start[0] - 2, i1.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      ['nightcrow', '……又見面了。', '…We meet again.'],
      ['rowan', '夜鴉！妳怎麼會在這裡？', 'Nightcrow! What are you doing here?'],
      ['nightcrow', '我追的男人，是熔晶所的總管。他逃到了這座鐘樓上。', 'The man I\'ve been hunting is the Foundry\'s overseer. He fled up to this belfry.'],
      ['nightcrow', '聖詠院出錢要我殺你們。我拒絕了。……這次，我不收錢。', 'The Choir offered to pay me to kill you. I refused. …This time, I won\'t take payment.'],
    ]);
    await A.join('nightcrow');
  }, { when: (A) => !A.hasMember('nightcrow') && A.flag('c16_sky') }));
  const i3 = M.isle_3;
  i3.triggers.push(trig(...K.endRoom(i3), async (A) => {
    await A.talk([['edmund', '這個脈動……是大鐘的心臟！整座鐘樓都是靠它浮起來的！', 'This pulse… it\'s the heart of the great bell! The whole belfry floats on it!']]);
    await A.battle(['starcore'], { boss: true, bg: 'sky' });
    A.warp('pillars', 11, 12, 'up');
  }, { when: (A) => ch(A) === 16 }));
  const pi = M.pillars;
  pi.npcs.push(npc(11, 6, 'emperor', null, { when: (A) => !A.flag('c17_emperor') }), npc(12, 4, 'vissek', null, { when: (A) => !A.flag('c17_done') }));
  pi.onEnter = async (A) => {
    if (A.flag('c17_done')) return;
    await A.chapter(17);
    await A.talk([
      [null, '三口巨大的鐘。破曉、暮光、永夜——一千年來，它們從來沒有同時響過。', 'Three colossal bells. Dawn, Dusk and Night. In a thousand years, they have never once rung together.'],
      ['gearwick', '大、大指揮者！等一下！您說的終止符……該不會連機器的聲音也會消失吧？', 'H-High Conductor! Wait! This Final Rest of yours… it won\'t silence the sound of machines too, will it?'],
      ['orsay', '所有的聲音，吉爾維克。齒輪、蒸汽、心跳。全部。', 'Every sound, Gearwick. Gears, steam, heartbeats. All of it.'],
      ['gearwick', '那、那我的發明就沒有人聽得到了！沒有掌聲的發明家，還算什麼發明家！', 'B-but then no one will ever hear my inventions! What is an inventor without applause?!'],
      ['edmund', '……吉爾維克。', '…Gearwick.'],
      ['gearwick', '艾德蒙！不准用那種同情的眼神看我！我、我要阻止他——用我的最終兵器！', 'Edmund! Don\'t you look at me with pity! I — I shall stop him — with my ultimate weapon!'],
      [null, '齒輪伯爵衝向鐘樓的齒輪，卻被巨鐘轉動的風一口氣吹出了鐘樓。', 'Count Gearwick charges at the belfry\'s gears — and the wind of the turning bells blows him clean off the tower.'],
      ['gearwick', '我會回來的——！', 'I shall return—!'],
      ['aria', '爸爸。拜託你，停下來。', 'Father. Please. Stop.'],
      ['orsay', '艾莉雅。妳知道嗎？那天鐘晚了三分鐘。三分鐘，我聽著媽媽叫我的名字，一聲比一聲小。', 'Aria. Do you know? That day, the bell was three minutes late. For three minutes I listened to my mother call my name, each time softer than the last.'],
      ['orsay', '有聲音，就會有最後一聲。我只是不想再有人，聽見那最後一聲。', 'Where there is sound, there is a last sound. I only want no one ever to hear that last sound again.'],
      ['rowan', '那你就讓所有人，連第一聲都聽不到嗎？', 'So you\'ll make sure nobody hears even the first one?'],
      ['orsay', '……是的。這是我能給的，最溫柔的禮物。', '…Yes. It is the gentlest gift I have to give.'],
    ]);
    A.set('c17_emperor');
    await A.battle(['vissek2'], { boss: true, bg: 'sky', music: 'vissek', endAfter: 28, canLose: true });
    A.heal();
    await A.talk([
      ['orsay', '……你們的聲音很好聽。所以，到此為止吧。', '…Your voices are lovely. So let this be where they end.'],
      [null, '歐瑟舉起指揮棒——三口巨鐘，第一次同時響了。', 'Orsay raises his baton — and for the first time, the three great bells ring together.'],
    ]);
    A.quake(3); A.scene((g) => { g.fillStyle = 'rgba(230,230,240,0.55)'; g.fillRect(0, 0, 768, 720); });
    await A.talk([
      [null, '終止符。那不是聲音，是聲音的反面。風停在半空，海浪停在浪尖。', 'The Final Rest. It is not a sound but the opposite of one. The wind stops in mid-air; waves stop at their crests.'],
      ['aria', '……我知道了。世界會完全安靜下來。誰也擋不住。', '…I understand now. The world is going to fall completely silent. No one can stop it.'],
      ['rowan', '艾莉雅？妳要做什麼？', 'Aria? What are you doing?'],
      ['aria', '可是，如果有一個音還留著——沉默就不是完全的。', 'But if even one note is left behind — the silence won\'t be complete.'],
      ['aria', '洛恩。這次換我送東西給你們。……一定要收到喔。', 'Rowan. This time I\'m the one making a delivery. …Make sure you receive it.'],
      [null, '艾莉雅唱出了一個音。她的身體化成了一條細細的、發光的歌，散進了整個世界。', 'Aria sings a single note. Her body becomes a thin, shining thread of song, and scatters across the whole world.'],
      ['orsay', '……艾莉雅？', '…Aria?'],
      ['regis', '鐘樓要塌了！快回寧波斯身上！', 'The belfry\'s coming down! Back onto Nimbus!'],
    ]);
    if (A.hasMember('nightcrow')) {
      const i = await A.ask('夜鴉還沒有回來。要等她嗎？', 'Nightcrow hasn\'t come back. Wait for her?', [['等她', 'Wait'], ['不等了', 'Leave now']]);
      if (i === 0) { await A.talk([['regis', '……來了！灰羽抓著她的領子飛回來了！', '…There she is! Greyfeather\'s carrying her back by the collar!'], ['nightcrow', '……多謝。', '…Thanks.']]); A.set('nightcrow_alive'); }
      else { await A.talk([[null, '夜鴉的身影，消失在崩落的鐘樓之中。', 'Nightcrow vanishes into the collapsing belfry.']]); A.leave('nightcrow', { gone: true }); }
    }
    A.scene(null);
    await A.talk([
      [null, '寧波斯在沒有聲音的天空中翻滾，跌進了灰色的雲裡。', 'Nimbus tumbles through a soundless sky and falls into the grey clouds.'],
      ['rowan', '瑟琳娜，抓住我的手——！', 'Selene, take my hand—!'],
      ['selene', '洛恩——！', 'Rowan—!'],
      [null, '……', '…'],
      [null, '── 第二幕　完 ──', '── End of Act II ──'],
    ]);
    A.set('c17_done');
    return fall(A);
  };
}

// ---------------------------------------------------------------- the trial's questions
const QUESTIONS = [
  [['雷歐娜：「被告。你們為什麼要打開始源之門？」', 'Leona: "Defendants. Why did you open the Origin Gate?"'], [[['為了讓星靈回家', 'To let the Astrals go home'], 1], [['為了對抗聖詠院', 'To defy the Choir'], 0], [['我們沒有錯', 'We did nothing wrong'], -1]]],
  [['雷歐娜：「熔晶所的星靈，是你們放走的嗎？」', 'Leona: "Did you free the Astrals in the Foundry?"'], [[['是的', 'Yes'], 1], [['不能告訴妳', 'We can\'t say'], 0], [['是牠們自己逃的', 'They escaped on their own'], -1]]],
  [['雷歐娜：「你們知道，沒有鐘，灰潮會吞掉多少人嗎？」', 'Leona: "Do you know how many people the Ashtide will swallow without the bells?"'], [[['知道。所以要找別的方法', 'Yes. So we must find another way'], 1], [['那是聖詠院的問題', 'That\'s the Choir\'s problem'], -1], [['蘇拉斯沒有鐘也活得好好的', 'Sularis manages without them'], 0]]],
  [['雷歐娜：「大指揮者——我的哥哥，在你們眼裡是什麼樣的人？」', 'Leona: "The High Conductor — my brother. What kind of man is he, in your eyes?"'], [[['一個很溫柔、很悲傷的人', 'A very gentle, very sad man'], 1], [['一個瘋子', 'A madman'], -1], [['我們不認識他', 'We don\'t really know him'], 0]]],
  [['雷歐娜：「最後一個問題。你們要的世界，有什麼聲音？」', 'Leona: "Last question. In the world you want, what sounds are there?"'], [[['有人叫你名字的聲音', 'Someone calling your name'], 1], [['很多很多的聲音', 'All sorts of sounds'], 0], [['沒有鐘聲就好', 'Anything but bells'], -1]]],
];
async function trial(A) {
  if (A.flag('c13_done')) return;
  await A.talk([
    ['leopold', '我是聖詠院審判官，雷歐娜。我不聽音準，只聽真話。', 'I am Leona, Magistrate of the Choir. I do not listen for pitch. I listen for truth.'],
    ['leopold', '被告：洛恩、艾莉雅，以及同行者。罪名：打開始源之門，擾亂星歌。開庭。', 'Defendants: Rowan, Aria, and companions. Charge: opening the Origin Gate and disturbing the Star Song. This court is in session.'],
  ]);
  let score = 0;
  for (const [q, opts] of QUESTIONS) {
    const i = await A.menu(opts.map(([o]) => A.T(...o)), { x: 30, y: 96, w: 196, title: A.T(...q), cancel: false });
    score += opts[i][1];
  }
  await A.talk([
    ['leopold', score >= 4 ? '……你們說的，每一句都是真的。' : score >= 1 ? '……你們很誠實。雖然不太會說話。' : '……哼。無禮。可是，不是謊話。', score >= 4 ? '…Every word you said was true.' : score >= 1 ? '…You are honest. If not very eloquent.' : '…Hmph. Rude. But not lies.'],
    ['leopold', '判決：無罪。', 'Verdict: not guilty.'],
    ['soldier', '審、審判官大人！大指揮者不會允許——', 'M-Magistrate! The High Conductor will never allow—'],
    ['leopold', '這座大殿裡，只有我的判決算數。……而且，我也想知道真相。', 'In this Hall, only my verdict counts. …And I want to know the truth as well.'],
    ['leopold', '哥哥最近常常去東邊的星靈之谷。聽說還有星靈留在那裡。我和你們一起去，經過薩瑪村。', 'My brother often goes to the Astral Valley in the east of late. They say some Astrals still remain there. I\'ll go with you — by way of Samar.'],
    ['leopold', '請多指教。我只帶劍和法典，不帶謊言。', 'A pleasure. I carry a sword and the law, and no lies.'],
  ]);
  if (score >= 4) await A.item('goldhairpin'); else if (score >= 2) await A.item('hermesheels'); else await A.item('xpotion', 2);
  await A.talk([[null, '其他同伴留在雲鯨身邊待命。艾莉雅、洛恩和雷歐娜前往薩瑪村。', 'The others stay with the cloud whale. Aria, Rowan and Leona set out for Samar.'], [null, '（聖詠都的酒館裡有個賞金獵人。付錢就能雇用她。）', '(There\'s a bounty hunter in the capital\'s tavern. She can be hired.)']]);
  A.setParty(['aria', 'rowan', 'leopold']);
  await A.join('leopold', { silent: true });
  A.set('c13_done');
  A.warp('vexhold', 12, 1, 'down');
  await A.chapter(14);
  A.goal('前往聖詠都東南方森林裡的書庫村薩瑪。', 'Go to Samar, the archive village in the forest south-east of the capital.');
}
// ---------------------------------------------------------------- the sky battle (mounting the whale after the valley)
async function skyBattle(A) {
  await A.chapter(16);
  A.warp('deck', 11, 5, 'up');
  await A.talk([
    ['regis', '抓緊了！天空鐘樓就在前面——聖詠院的飛艇也來了！', 'Hold on! The Sky Belfry is just ahead — and here come the Choir\'s skyships!'],
    [null, '（在雲鯨的背上迎擊。選出四個人。）', '(Fight them off on the whale\'s back. Choose four.)'],
  ]);
  await A.pickParty(4);
  await A.battle(['flyer', 'flyer', 'flyer'], { bg: 'ship' });
  await A.battle(['skyguard'], { boss: true, bg: 'sky' });
  await A.talk([['regis', '突破了！寧波斯，靠過去！大家跳！', 'We\'re through! Nimbus, bring us in! Everybody jump!']]);
  A.set('c16_sky');
  A.warp('isle', ...ISLE_START, 'up');
  A.goal('前往天空鐘樓的中心。', 'Make your way to the heart of the Sky Belfry.');
}
// ---------------------------------------------------------------- after the bells: the Long Silence (Act III starts in story3.js)
import { actThree } from './story3.js?v=3';
async function fall(A) { return actThree(A); }
