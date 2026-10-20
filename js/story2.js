// ASH ARIA — Act II 承 · The Storm: the Empire, the Arcanum, the Astral Gate, the banquet, Samar, the Astral Valley,
// the Floating Isle and the Pillars.
const ch = (A) => A.S.ch;

let ISLE_START = [1, 1];
export function act2(M, K) {
  const { npc, trig, chat } = K;
  ISLE_START = M.isle.anchor.start;
  // ================================================================ Vexhold
  const vx = M.vexhold;
  vx.gate = (A) => (ch(A) < 10 ? [[null, '帝國的首都。城門有重兵把守。', 'The Imperial capital. The gates are heavily guarded.']] : null);
  vx.warps.push(
    { x: 12, y: 0, to: 'arcanum', when: (A) => !A.flag('c11_done') }, { x: 13, y: 0, to: 'arcanum', when: (A) => !A.flag('c11_done') },
    { x: 12, y: 0, to: 'palace', at: [10, 12], when: (A) => A.flag('c12_done') && !A.flag('c13_done') }, { x: 13, y: 0, to: 'palace', at: [10, 12], when: (A) => A.flag('c12_done') && !A.flag('c13_done') },
  );
  M.arcanum.exitTo = ['vexhold', 12, 1];
  M.arcanum.gate = (A) => (A.flag('c11_done') ? [[null, '研究所的入口塌了。', 'The Arcanum\'s entrance has caved in.']] : null);
  vx.onEnter = async (A) => {
    if (ch(A) === 10 && !A.flag('c10_in')) {
      A.set('c10_in');
      await A.talk([
        [null, '帝都威克斯。蒸汽的煙囪遮住了天空，街上的人穿著漂亮的衣服。', 'Vexhold, the Imperial capital. Steam stacks hide the sky; the people in the streets wear fine clothes.'],
        ['rowan', '這裡的人，知道他們的燈是用什麼點亮的嗎？', 'Do these people know what lights their lamps?'],
        ['aria', '……我聞到了。同胞的哭聲。從北邊傳來的。', '…I can smell it. My own kind, crying. From the north.'],
        ['edmund', '城北的魔導研究所。帝國把星靈關在那裡。', 'The Arcanum, north of the city. That\'s where the Empire keeps the Astrals.'],
      ]);
      await A.chapter(11);
      A.goal('潛入帝都北邊的魔導研究所（從城北的大門進去）。', 'Infiltrate the Arcanum north of the city (through the north gate).');
    }
    if (ch(A) === 13 && !A.flag('c13_in')) {
      A.set('c13_in');
      await A.talk([
        [null, '帝都的一半成了廢墟。從星門飛出的星靈，把憤怒傾倒在這座城上。', 'Half the capital lies in ruins. The Astrals that burst from the Gate poured their fury onto this city.'],
        ['soldier', '你們……就是黎明軍的人吧。皇帝陛下想見你們。他說，他想要和平。', 'You… you\'re the Dawnline, aren\'t you. His Majesty wishes to see you. He says he wants peace.'],
        ['edmund', '和平？在燒了半個大陸之後？', 'Peace? After burning half a continent?'],
        ['aria', '……我想聽聽看。', '…I want to hear what he has to say.'],
      ]);
      A.goal('從城北的大門前往宮殿，參加皇帝的晚宴。', 'Go through the north gate to the palace for the Emperor\'s banquet.');
    }
  };
  vx.npcs.push(
    chat(10, 9, 'imperial', [[null, [['soldier', '帝國萬歲。……其實我只是想回家種田。', 'Long live the Empire. …Honestly, I just want to go home and farm.']]], [(A) => ch(A) >= 13, [['soldier', '星靈們從天上落下來，像火一樣……', 'The Astrals fell from the sky like fire…']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '帝都的燈從來不會熄滅。好像是靠什麼「星晶」發電的。', 'The lamps of the capital never go out. Something called "crystals" powers them.']]]]),
    chat(24, 9, 'man', [[null, [['man', '維瑟克大人？他以前是個溫柔的人。第一次注入星晶之後，就變成那樣了。', 'Lord Vissek? He used to be a gentle man. After they first put the crystal in him, he became… that.']]]]),
    chat(10, 15, 'child', [[null, [['child', '李奧帕德將軍是好人喔！他會陪我們玩！', 'General Leopold is nice! He plays with us!']]]]),
    npc(6, 3, 'nightcrow', async (A) => {
      if (A.hasMember('nightcrow') || A.flag('nightcrow_gone')) return;
      await A.talk([['nightcrow', '……我是刺客。只要付錢，我就工作。一千五百金幣。', '…I am an assassin. Pay me and I work. Fifteen hundred gil.']]);
      const i = await A.ask('要雇用夜鴉嗎？（1500 金幣）', 'Hire Nightcrow? (1500 gil)', [['雇用', 'Hire'], ['不用', 'No']]);
      if (i !== 0) return;
      if (A.S.gil < 1500) return A.talk([['nightcrow', '……錢不夠。', '…Not enough.']]);
      A.gil(-1500);
      await A.talk([['nightcrow', '契約成立。灰牙，走了。', 'A deal. Ashfang, come.'], [null, '（夜鴉的「投擲」可以丟出手裡劍、忍術卷軸和武器。他的狼「灰牙」會擋住攻擊並反咬。）', '(Nightcrow\'s Throw hurls stars, ninja scrolls and weapons. His wolf Ashfang blocks blows and bites back.)']]);
      await A.join('nightcrow', { force: false });
    }, { when: (A) => ch(A) >= 13 && ch(A) <= 14 && !A.hasMember('nightcrow') }),
  );
  // ================================================================ the Arcanum (chapter 11)
  const ar3 = M.arcanum_3;
  ar3.triggers.push(trig(...K.endRoom(ar3), async (A) => {
    await A.talk([['aria', '有什麼東西……被做成了怪物……', 'Something… has been turned into a monster…']]);
    await A.battle(['no128'], { boss: true, bg: 'empire' });
    await A.talk([
      [null, '研究所的最深處。一排排的玻璃槽裡，泡著被抽乾的星靈。', 'The Arcanum\'s heart. Row after row of glass tanks, each holding a drained Astral.'],
      ['aria', '……還活著。牠們還活著！', '…They\'re alive. They\'re still alive!'],
      ['kirisa', '……孩子……我們已經回不去了。把我們帶走吧。化為星晶的我們，還能為妳戰鬥。', '…Child… we cannot go home now. Take us. As crystals we can still fight for you.'],
      ['vissek', '嘻嘻嘻……真感人。瑟琳娜將軍，辛苦妳了。把他們帶到這裡，任務完成了呢。', 'Hee-hee-hee… how touching. General Selene, well done. You\'ve brought them right to me, just as planned.'],
      ['rowan', '……瑟琳娜？', '…Selene?'],
      ['selene', '他在說謊！洛恩，我——', 'He\'s lying! Rowan, I—'],
      ['rowan', '……', '…'],
      ['selene', '……你不相信我。', '…You don\'t believe me.'],
      ['selene', '好。那我就用行動證明。', 'Fine. Then I\'ll prove it.'],
      [null, '瑟琳娜舉起劍——一道光包住了她和維瑟克，兩人一起消失了。', 'Selene raises her sword — light swallows her and Vissek, and both of them vanish.'],
      ['rowan', '瑟琳娜！！', 'SELENE!!'],
      ['edmund', '她用自己的魔力，把維瑟克和他的手下一起傳送走了……為了讓我們逃走。', 'She used her own magic to send Vissek and his men away… so we could escape.'],
    ]);
    A.scene((g) => { g.fillStyle = 'rgba(180,220,255,0.5)'; g.fillRect(0, 0, 768, 720); }); await A.sleep(0.6); A.scene(null);
    await A.astral('kirisa'); await A.astral('ifrion'); await A.astral('zona'); await A.astral('carbuncle');
    A.leave('selene'); A.set('selene_gone'); A.set('c11_done');
    await A.talk([
      [null, '一行人搭上運送礦石的礦車，衝出了研究所。', 'The party jumps onto an ore cart and hurtles out of the Arcanum.'],
      ['aria', '只要星靈還被關著，帝國就會一直變強。……一千年前封閉的星門，就在帝都東北邊的山裡。', 'As long as the Astrals are caged, the Empire grows stronger. …The Gate sealed a thousand years ago lies in the mountains north-east of the capital.'],
      ['aria', '如果打開星門，同胞們就能回來。我身上有星靈的血，也許……我能打開它。', 'If we open it, my kind can come home. I have Astral blood… perhaps I can open it.'],
    ]);
    A.warp('vexhold', 12, 1, 'down');
    await A.chapter(12);
    A.goal('前往帝都東北方山中的星門。', 'Go to the Astral Gate in the mountains north-east of the capital.');
  }, { when: (A) => ch(A) === 11 }));
  // ================================================================ the Astral Gate (chapter 12)
  M.gate.gate = (A) => (!A.flag('c11_done') ? [[null, '一道刻滿古代文字的大門，緊緊地封閉著。', 'A great door carved with ancient script, sealed tight.']] : A.flag('c12_done') ? [[null, '星門已經打開了。裡面只剩下風聲。', 'The Gate stands open. Only the wind is left inside.']] : null);
  M.gate.triggers.push(trig(M.gate.anchor.start[0] - 2, M.gate.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      ['selene', '……我等你們很久了。', '…I\'ve been waiting for you.'],
      ['rowan', '瑟琳娜！妳沒事！', 'Selene! You\'re all right!'],
      ['selene', '維瑟克被我丟到了帝國的另一頭。現在，他應該已經走回來了。', 'I threw Vissek to the far end of the Empire. He\'ll have walked back by now.'],
      ['rowan', '……對不起。我那時候，懷疑了妳。', '…I\'m sorry. Back there, I doubted you.'],
      ['selene', '我知道。所以我才要你看清楚——我是誰。', 'I know. That\'s why I wanted you to see clearly who I am.'],
    ]);
    A.unset('selene_gone');
    await A.join('selene');
  }, { when: (A) => A.flag('selene_gone') && ch(A) === 12 }));
  const g2 = M.gate_2;
  g2.triggers.push(trig(...K.endRoom(g2), async (A) => {
    await A.talk([['edmund', '門前有守衛……是一千年前留下的巨像！', 'Something guards the Gate… a colossus from a thousand years ago!']]);
    await A.battle(['gateguard'], { boss: true, bg: 'cave' });
    await A.talk([
      [null, '巨大的門。門的另一邊，傳來無數的聲音。', 'The great Gate. From the other side come countless voices.'],
      ['aria', '……我是艾莉雅。人類與星靈的孩子。', '…I am Aria. Child of a human and an Astral.'],
      ['aria', '同胞們，請聽我說。人類不全是壞人。有人救了我，有人說要保護我。', 'Please, listen to me. Not all humans are cruel. Someone saved me. Someone promised to protect me.'],
      [null, '門開了。', 'The Gate opens.'],
    ]);
    A.quake(2); A.scene((g) => { g.fillStyle = 'rgba(255,240,200,0.75)'; g.fillRect(0, 0, 768, 720); }); await A.sleep(1.2); A.scene(null);
    await A.talk([
      [null, '一千年的憤怒，像暴風一樣從門裡湧出。數十隻星靈呼嘯著越過一行人的頭頂，往帝都飛去。', 'A thousand years of fury pours out of the Gate like a storm. Dozens of Astrals howl over the party\'s heads, toward the capital.'],
      ['aria', '等等！不是這樣的！', 'Wait! Not like this!'],
      ['vissek', '嘻嘻嘻嘻！謝謝妳，小怪物！門開了，星靈自己飛出來了！我只要等著撿就好了！', 'Hee-hee-hee-hee! Thank you, little monster! The Gate is open and the Astrals have come out by themselves! All I have to do is pick them up!'],
      ['rowan', '維瑟克！', 'Vissek!'],
      ['vissek', '別急，別急。下次見面的時候，我會送你們一份大禮。嘻嘻嘻！', 'Patience, patience. Next time we meet I\'ll have a lovely present for you. Hee-hee-hee!'],
    ]);
    A.set('c12_done');
    A.warp('gate', ...M.gate.anchor.start, 'down');
    await A.chapter(13);
    A.goal('星靈襲擊了帝都。回到帝都威克斯看看。', 'The Astrals have struck the capital. Return to Vexhold.');
  }, { when: (A) => ch(A) === 12 && !A.flag('c12_done') }));
  // ================================================================ the palace and the banquet (chapter 13)
  const pl = M.palace;
  pl.exitTo = ['vexhold', 12, 1]; pl.exitable = true; pl.entry = [10, 12, 'up'];
  pl.npcs.push(
    npc(12, 2, 'emperor', (A) => banquet(A), { when: (A) => !A.flag('c13_done') }),
    npc(12, 3, 'leopold', [['leopold', '我是李奧帕德。陛下說的和平，我願意用性命擔保。', 'I am Leopold. I stake my life on the peace His Majesty speaks of.']], { when: (A) => !A.flag('c13_done') }),
    chat(4, 4, 'imperial', [[null, [['general', '我是帝國的將軍。……老實說，我也受夠戰爭了。', 'I am a general of the Empire. …Honestly, I\'ve had enough of war too.']]]], { move: false }),
    chat(20, 7, 'imperial', [[null, [['soldier', '維瑟克大人今天被關在牢裡。陛下說，他做得太過火了。', 'Lord Vissek is locked up today. His Majesty says he went too far.']]]], { move: false }),
    chat(5, 11, 'woman', [[null, [['woman', '晚宴的菜很好吃喔。皇帝陛下一定會問你們問題，好好回答吧。', 'The banquet food is wonderful. His Majesty is sure to ask you questions — answer well.']]]], { move: false }),
  );
  // ================================================================ Samar (chapter 14)
  const sm = M.samar;
  sm.gate = (A) => (ch(A) < 14 ? [[null, '森林深處的小村子。村民說「這裡沒什麼好看的」，把門關上了。', 'A little village deep in the forest. "Nothing to see here," say the villagers, and shut the gate.']] : null);
  sm.npcs.push(
    npc(6, 3, 'bolo', async (A) => {
      if (ch(A) === 14 && !A.flag('c14_fire')) {
        await A.talk([
          ['bolo', '魔法？哈哈，這個村子的人怎麼會魔法呢。我只是個種菜的老頭。', 'Magic? Ha-ha, nobody in this village knows magic. I\'m just an old man who grows vegetables.'],
          ['lili', '爺爺又在說謊了。', 'Grandpa\'s lying again.'],
          ['bolo', '莉莉！', 'Lili!'],
          ['leopold', '老先生，我們不是來抓人的。星靈們逃到了這附近，我們想和牠們談和。', 'Sir, we have not come to arrest anyone. The Astrals fled near here. We wish to make peace with them.'],
          ['villager', '失火了！村口的房子著火了！', 'FIRE! The house by the gate is on fire!'],
          ['bolo', '……那是空屋。可是……莉莉！莉莉呢？', '…That house is empty. But… Lili! Where\'s Lili?'],
          ['villager', '我看到莉莉跑進去了！她說要去救裡面的小貓！', 'I saw Lili run inside! She said there was a kitten in there!'],
          ['bolo', '那個傻孩子！', 'That foolish child!'],
        ]);
        A.set('c14_fire');
        A.warp('burning', ...M.burning.anchor.start, 'up');
        A.goal('衝進燃燒的房子，救出莉莉！', 'Rush into the burning house and save Lili!');
        return;
      }
      return A.talk([['bolo', '這個村子，是一千年前魔導師的後裔住的地方。我們假裝不會魔法，是怕再被人利用。', 'This village is home to the descendants of the mages of a thousand years ago. We pretend we have no magic so no one can use us again.']]);
    }, { when: (A) => !A.hasMember('bolo') }),
    npc(4, 3, 'lili', null, { when: (A) => !A.flag('c14_fire') }),
    chat(10, 9, 'man', [[null, [['man', '魔法？沒聽過。……你剛才看到我手上冒火？你看錯了。', 'Magic? Never heard of it. …You saw fire in my hand just now? You\'re mistaken.']]]]),
    chat(15, 15, 'woman', [[null, [['woman', '東邊的山谷裡，有很多會發光的鳥飛進去。', 'Lots of glowing birds have been flying into the valley to the east.']]]]),
  );
  M.burning.exitTo = ['samar', 12, 10];
  const b2 = M.burning_2;
  b2.triggers.push(trig(...K.endRoom(b2), async (A) => {
    await A.talk([['rowan', '火在動……是火焰的魔物！', 'The fire is moving… it\'s a fire monster!']]);
    await A.battle(['flamelord'], { boss: true, bg: 'dark' });
    await A.talk([
      ['lili', '咳咳……小貓沒事！你們看！', '*cough* The kitten\'s all right! Look!'],
      ['bolo', '莉莉！你這個傻孩子……', 'Lili! You foolish child…'],
      ['lili', '爺爺，你剛才用了魔法吧？我看到了，冰的魔法！', 'Grandpa, you used magic just now, didn\'t you? I saw it — ice magic!'],
      ['bolo', '……唉。看來是瞞不住了。', '…Sigh. No hiding it now.'],
      ['bolo', '我跟你們去。星靈們藏身的山谷，我知道路。', 'I\'ll come with you. I know the way to the valley where the Astrals hide.'],
      ['lili', '我也要去！我要把星靈畫下來！', 'Me too! I want to paint the Astrals!'],
      [null, '（莉莉的「描繪」：畫下一個敵人，畫作會使出那個敵人的招式。波洛的「青魔」：只要看過敵人使用青魔法就會學會。）', '(Lili\'s Sketch paints a foe, and the painting uses that foe\'s moves. Bolo\'s Lore: he learns any lore he sees a monster use.)'],
    ]);
    await A.join('bolo'); await A.join('lili');
    if (A.hasMember('nightcrow')) { await A.talk([['nightcrow', '……我的契約到此為止。', '…My contract ends here.'], ['lili', '那隻狗好可愛！', 'That doggy\'s so cute!'], ['nightcrow', '……是狼。', '…It\'s a wolf.']]); A.leave('nightcrow', { gone: true }); }
    A.set('nightcrow_met');
    A.setParty(['aria', 'leopold', 'bolo', 'rowan']);
    A.set('c14_done');
    A.warp('samar', 12, 10, 'down');
    await A.chapter(15);
    A.goal('前往東方的星靈之谷，和星靈談和。', 'Go to the Astral Valley in the east and make peace with the Astrals.');
  }, { when: (A) => ch(A) === 14 && !A.flag('c14_done') }));
  // ================================================================ the Astral Valley (chapter 15)
  M.valley.gate = (A) => (ch(A) < 15 ? [[null, '山谷的入口被一層發光的霧擋住了。', 'A glowing mist blocks the mouth of the valley.']] : null);
  const v2 = M.valley_2;
  v2.triggers.push(trig(...K.endRoom(v2), async (A) => {
    await A.talk([
      ['astralElder', '……人類。還有，人類與星靈的孩子。', '…Humans. And a child of human and Astral.'],
      ['leopold', '星靈的長老。我是帝國的將軍李奧帕德。我代表皇帝，請求和平。', 'Elder of the Astrals. I am Leopold, a general of the Empire. On behalf of the Emperor, I ask for peace.'],
      ['astralElder', '帝國殺了我們的同胞，榨乾我們的血。現在要我們相信？', 'The Empire slaughtered our kin and drained our blood. And now you ask us to trust you?'],
      ['aria', '我也不相信帝國。可是，我相信這個人。', 'I don\'t trust the Empire either. But I trust this man.'],
      ['astralElder', '……好。我們願意談。', '…Very well. We will talk.'],
      ['vissek', '嘻嘻嘻嘻嘻！談完了嗎？那就輪到我了！', 'Hee-hee-hee-hee-hee! All done talking? Then it\'s MY turn!'],
      ['leopold', '維瑟克！陛下命令你待在牢裡——', 'Vissek! His Majesty ordered you to stay in your cell—'],
      ['vissek', '陛下命令我「跟在你們後面，等星靈全部聚在一起」。和平？那是給你們這些傻瓜看的戲！', 'His Majesty ordered me to "follow you until the Astrals were all in one place." Peace? That was a play for fools like you!'],
    ]);
    await A.battle(['vissek1'], { boss: true, bg: 'forest', music: 'vissek' });
    await A.talk([
      ['vissek', '嘻……嘻嘻……好痛好痛。可是，我已經贏了喔。', 'Hee… hee-hee… ow, ow. But I\'ve already won, you know.'],
      [null, '維瑟克舉起雙手。山谷裡的星靈一隻接一隻發出尖叫，化成了石頭般的結晶。', 'Vissek raises his hands. One by one the Astrals in the valley shriek and turn to stone-like crystal.'],
      ['leopold', '住手——！', 'STOP—!'],
      ['vissek', '將軍大人，你太礙事了。', 'General, you\'re in the way.'],
      [null, '一道光穿過了李奧帕德的胸口。', 'A beam of light pierces Leopold\'s chest.'],
      ['leopold', '……孩子們……對不起……我……被騙了……', '…Children… I\'m sorry… I was… deceived…'],
      ['aria', '李奧帕德將軍！', 'General Leopold!'],
      ['vissek', '嘻嘻嘻！星晶，星晶，好多星晶！有了這麼多力量，就能喚醒「三柱」了！', 'Hee-hee-hee! Crystals, crystals, so many crystals! With all this power I can wake the Three Pillars!'],
      [null, '大地劇烈搖晃。遠方的海面上，一塊巨大的陸地升上了天空。', 'The ground heaves. Far out over the sea, a vast slab of land rises into the sky.'],
      ['bolo', '浮空大陸……傳說中，三柱神像就沉睡在那上面。', 'The Floating Isle… the legend says the Three Pillars sleep upon it.'],
      ['astralElder', '……孩子。妳父親瑪杜因的星晶，在這裡。帶著他……去阻止那個瘋子……', '…Child. Your father Maduin\'s crystal is here. Take him… and stop that madman…'],
    ]);
    A.quake(2);
    await A.astral('maduin'); await A.astral('shoat'); await A.astral('fenrir');
    A.leave('leopold', { gone: true }); A.set('c15_done'); A.free();
    await A.talk([['regis', '要追上那塊飛上天的大陸？哈，這可是一場大賭局。回飛空艇去吧！', 'Chasing a continent into the sky? Ha — now that\'s a gamble. Back to the airship!']]);
    A.warp('valley', ...M.valley.anchor.start, 'down');
    A.goal('回到飛空艇，飛向浮空大陸。（登上飛空艇就會出發）', 'Return to the airship and fly to the Floating Isle. (Boarding sets off.)');
  }, { when: (A) => ch(A) === 15 && !A.flag('c15_done') }));
  // ================================================================ the sky battle and the Floating Isle (chapters 16 and 17)
  M.world.onBoard = (A) => (A.flag('c15_done') && !A.flag('c16_sky') ? skyBattle : null);
  const i1 = M.isle;
  i1.gate = (A) => [[null, '只有飛空艇才能到達。', 'Only an airship can reach it.']];
  i1.triggers.push(trig(i1.anchor.start[0] - 2, i1.anchor.start[1] - 2, 5, 5, async (A) => {
    await A.talk([
      ['nightcrow', '……又見面了。', '…We meet again.'],
      ['rowan', '夜鴉！你怎麼會在這裡？', 'Nightcrow! What are you doing here?'],
      ['nightcrow', '帝國雇我來殺你們。我拒絕了。……這次，我自己付錢給自己。', 'The Empire hired me to kill you. I refused. …This time I\'m paying myself.'],
    ]);
    await A.join('nightcrow');
  }, { when: (A) => !A.hasMember('nightcrow') && A.flag('c16_sky') }));
  const i3 = M.isle_3;
  i3.triggers.push(trig(...K.endRoom(i3), async (A) => {
    await A.talk([['edmund', '這股力量……是大陸的核心！', 'This power… it\'s the heart of the isle!']]);
    await A.battle(['starcore'], { boss: true, bg: 'sky' });
    A.warp('pillars', 11, 12, 'up');
  }, { when: (A) => ch(A) === 16 }));
  const pi = M.pillars;
  pi.npcs.push(npc(11, 6, 'emperor', null, { when: (A) => !A.flag('c17_emperor') }), npc(12, 4, 'vissek', null, { when: (A) => !A.flag('c17_done') }));
  pi.onEnter = async (A) => {
    if (A.flag('c17_done')) return;
    await A.chapter(17);
    await A.talk([
      [null, '三尊巨大的神像。破曉、暮光、永夜——千年來，它們互相制衡，守護著這個世界的平衡。', 'Three colossal statues. Dawn, Dusk and Night. For a thousand years they have held each other in balance, keeping the world whole.'],
      ['emperor', '來得正好。看吧，三柱的力量。只要掌握它，朕就是這個世界的神。', 'You come in good time. Behold the power of the Pillars. With it, I become the god of this world.'],
      ['vissek', '陛下，陛下。神只能有一個喔。', 'Your Majesty, Your Majesty. There can only be one god, you know.'],
      ['emperor', '……什麼？', '…What?'],
      ['vissek', '你老了。你只想統治世界。可是我呢——我想毀了它！', 'You\'re old. You only want to RULE the world. Me? I want to DESTROY it!'],
      [null, '維瑟克的魔法貫穿了皇帝。', 'Vissek\'s magic runs the Emperor through.'],
      ['emperor', '你……你這個……怪物……', 'You… you… monster…'],
      ['vissek', '是你們造出來的怪物喔。嘻嘻嘻嘻嘻嘻！', 'A monster YOU made. Hee-hee-hee-hee-hee-hee!'],
      ['aria', '維瑟克！住手！', 'Vissek! Stop!'],
      ['vissek', '你們知道嗎？一切終將毀滅。生命、愛、希望、夢想——全都會消失。既然如此，那它們有什麼意義？', 'Do you know? Everything ends. Life, love, hope, dreams — it all disappears. So what is the point of any of it?'],
      ['vissek', '毀滅，才是唯一真實的東西！讓我來推它一把吧！', 'Destruction is the only thing that\'s real! Let me give it a little push!'],
    ]);
    A.set('c17_emperor');
    await A.battle(['vissek2'], { boss: true, bg: 'sky', music: 'vissek', endAfter: 28, canLose: true });
    A.heal();
    await A.talk([
      ['vissek', '嘻嘻嘻……你們贏不了的。看好了——', 'Hee-hee-hee… you can\'t win. Now watch—'],
      [null, '維瑟克伸出手——三尊神像緩緩地，轉向了錯誤的方向。', 'Vissek reaches out — and slowly, the three statues turn the wrong way.'],
    ]);
    A.quake(3); A.scene((g) => { g.fillStyle = 'rgba(255,60,40,0.45)'; g.fillRect(0, 0, 768, 720); });
    await A.talk([
      [null, '平衡崩壞了。大地裂開，海水沸騰，天空被染成了血紅色。', 'The balance breaks. The earth splits, the seas boil, and the sky turns blood red.'],
      ['regis', '大陸要塌了！快回船上！', 'The isle is falling apart! Back to the ship!'],
    ]);
    if (A.hasMember('nightcrow')) {
      const i = await A.ask('夜鴉還沒有回來。要等他嗎？', 'Nightcrow hasn\'t come back. Wait for him?', [['等他', 'Wait'], ['不等了', 'Leave now']]);
      if (i === 0) { await A.talk([['regis', '……來了！他抓住了繩梯！', '…There he is! He\'s got the ladder!'], ['nightcrow', '……多謝。', '…Thanks.']]); A.set('nightcrow_alive'); }
      else { await A.talk([[null, '夜鴉的身影，消失在崩落的大地之中。', 'Nightcrow vanishes into the crumbling earth.']]); A.leave('nightcrow', { gone: true }); }
    }
    A.scene(null);
    await A.talk([
      [null, '黑隼號在崩塌的天空中燃燒，碎裂。', 'The Blackhawk burns and breaks apart in the collapsing sky.'],
      ['rowan', '瑟琳娜，抓住我的手——！', 'Selene, take my hand—!'],
      ['selene', '洛恩——！', 'Rowan—!'],
      [null, '……', '…'],
      [null, '── 第二幕　完 ──', '── End of Act II ──'],
    ]);
    A.set('c17_done');
    return fall(A);
  };
}

// ---------------------------------------------------------------- the banquet's questions
const QUESTIONS = [
  [['皇帝：「你們為什麼要和帝國作對？」', 'Emperor: "Why do you stand against the Empire?"'], [[['為了自由', 'For freedom'], 1], [['為了報仇', 'For revenge'], 0], [['因為你們是壞人', 'Because you\'re evil'], -1]]],
  [['皇帝：「維瑟克在霞之國做的事，朕深感遺憾。」', 'Emperor: "I deeply regret what Vissek did at Kasumi."'], [[['道歉不能讓死去的人回來', 'Sorry won\'t bring the dead back'], 0], [['那就請您懲罰他', 'Then punish him'], 1], [['您真的遺憾嗎？', 'Do you, really?'], -1]]],
  [['皇帝：「黎明軍的歐文，近來可好？」', 'Emperor: "And how is Owen of the Dawnline?"'], [[['他很好', 'He is well'], 1], [['不能告訴你', 'I can\'t tell you'], 0], [['他在霜石鎮', 'He\'s in Frostvale'], -1]]],
  [['皇帝：「星靈們，現在在哪裡？」', 'Emperor: "Where are the Astrals now?"'], [[['我們也不知道', 'We don\'t know either'], 1], [['在東方的山谷', 'In the valley to the east'], -1], [['牠們不想見您', 'They don\'t want to see you'], 0]]],
  [['皇帝：「最後一個問題。朕，可以信任你們嗎？」', 'Emperor: "One last question. May I trust you?"'], [[['可以', 'Yes'], 1], [['那要看陛下', 'That depends on you'], 0], [['不行', 'No'], -1]]],
];
async function banquet(A) {
  if (A.flag('c13_done')) return;
  await A.talk([
    ['emperor', '歡迎。朕是加爾文。坐吧，今天沒有國王，沒有叛軍，只有客人。', 'Welcome. I am Galvane. Sit — tonight there are no kings and no rebels, only guests.'],
    ['emperor', '維瑟克已經被朕關進了牢裡。他做得太過分了。', 'I have put Vissek in chains. He went too far.'],
  ]);
  let score = 0;
  for (const [q, opts] of QUESTIONS) {
    const i = await A.menu(opts.map(([o]) => A.T(...o)), { x: 30, y: 96, w: 196, title: A.T(...q), cancel: false });
    score += opts[i][1];
  }
  await A.talk([
    ['emperor', score >= 4 ? '……好。你們是值得信任的人。' : score >= 1 ? '……嗯。你們很誠實。' : '……哼。年輕人總是這麼不客氣。', score >= 4 ? '…Good. You are people I can trust.' : score >= 1 ? '…Hm. You are honest, at least.' : '…Hmph. The young are always so rude.'],
    ['emperor', '朕想和星靈談和。李奧帕德將軍會和你們一起去。聽說牠們逃到了薩瑪村附近。', 'I wish to make peace with the Astrals. General Leopold will go with you. They say the Astrals fled near the village of Samar.'],
    ['leopold', '請多指教。我只帶劍，不帶謊言。', 'A pleasure. I carry a sword, not lies.'],
  ]);
  if (score >= 4) await A.item('goldhairpin'); else if (score >= 2) await A.item('hermesheels'); else await A.item('xpotion', 2);
  await A.talk([[null, '其他同伴留在飛空艇上待命。艾莉雅、洛恩和李奧帕德前往薩瑪村。', 'The others stay with the airship. Aria, Rowan and Leopold set out for Samar.'], [null, '（帝都的酒館裡有個刺客。付錢就能雇用他。）', '(There\'s an assassin in the capital\'s pub. He can be hired.)']]);
  A.setParty(['aria', 'rowan', 'leopold']);
  await A.join('leopold', { silent: true });
  A.set('c13_done');
  A.warp('vexhold', 12, 1, 'down');
  await A.chapter(14);
  A.goal('前往帝都東南方森林裡的隱村薩瑪。', 'Go to Samar, the hidden village in the forest south-east of the capital.');
}
// ---------------------------------------------------------------- the sky battle (boarding after the valley)
async function skyBattle(A) {
  await A.chapter(16);
  A.warp('deck', 11, 5, 'up');
  await A.talk([
    ['regis', '抓緊了！浮空大陸就在前面——帝國的空軍也來了！', 'Hold on! The Floating Isle is just ahead — and here comes the Imperial air fleet!'],
    [null, '（在甲板上迎擊。選出四個人。）', '(Fight them off on deck. Choose four.)'],
  ]);
  await A.pickParty(4);
  await A.battle(['flyer', 'flyer', 'flyer'], { bg: 'ship' });
  await A.battle(['skyguard'], { boss: true, bg: 'sky' });
  await A.talk([['regis', '突破了！大家跳下去！', 'We\'re through! Everybody jump!']]);
  A.set('c16_sky');
  A.warp('isle', ...ISLE_START, 'up');
  A.goal('前往浮空大陸的中心。', 'Make your way to the heart of the Floating Isle.');
}
// ---------------------------------------------------------------- after the Pillars: the Fall (Act III starts in story3.js)
import { actThree } from './story3.js?v=1';
async function fall(A) { return actThree(A); }
