// ASH ARIA — interludes: a quiet moment half way through each dungeon of the main story, between the people who are
// actually there at that point. They fire once, on the floor's middle room, while the story is still on its way through.
const L = (sp, zh, en) => [sp, zh, en];
const ch = (A) => A.S.ch;
// map (the floor), when, lines
const IN = [
  ['mine', (A) => ch(A) === 1, [
    L('gale', '哈特，你有沒有覺得……艾莉雅大人一路上都在聽什麼？', 'Hart, haven\'t you noticed… Lady Aria\'s been listening to something the whole way down?'),
    L('hart', '她是空心之子。她聽的是星靈。', 'She\'s a Hollow Child. She listens for Astrals.'),
    L('gale', '可是剛才走過那條地下水的時候，她笑了一下。水裡又沒有星靈。', 'But when we passed that underground stream just now, she smiled. There aren\'t any Astrals in water.'),
    L('aria', '……水在唱歌。很小聲。', '…The water was singing. Very softly.'),
    L('hart', '……專心任務吧。', '…Let\'s keep our minds on the mission.')]],
  ['kolan_2', (A) => ch(A) === 4, [
    L('edmund', '洛恩，你包包裡那封舊信，我認識你三年了，從來沒看你拿出來過。', 'Rowan, that old letter in your bag — I\'ve known you three years and never once seen you take it out.'),
    L('rowan', '……有些信，拿出來就得送。', '…Some letters, once you take them out, you have to deliver them.'),
    L('aria', '它在哭。那封信。', 'It\'s crying. That letter.'),
    L('rowan', '信不會哭。', 'Letters don\'t cry.'),
    L('aria', '可是你會。', 'But you do.'),
    L('edmund', '……好了好了，山洞裡回音很大，這種話小聲一點說。', '…All right, all right. The echoes in these caves are loud. Say things like that more quietly.')]],
  ['river_2', (A) => ch(A) === 5 && !A.flag('c5_river'), [
    L('owen', '艾莉雅，妳知道嗎？歐瑟小時候，最喜歡對著鳥唱歌。', 'Aria, did you know? When Orsay was a boy, he loved singing to the birds.'),
    L('owen', '他唱得很難聽。鳥都被他嚇飛了。可是他每天都去唱。', 'He sang terribly. He frightened every bird away. But he went and sang to them every day.'),
    L('aria', '……爸爸從來沒有在我面前唱過歌。只有搖籃曲。', '…Father never sang in front of me. Only lullabies.'),
    L('owen', '那天之後，他只唱搖籃曲了。讓人睡著的歌，不會帶來失去。', 'After that day he only sang lullabies. A song that puts people to sleep can\'t bring loss.'),
    L('sai', '……可是，鳥也聽不到了。', '…But then the birds can\'t hear it either.')]],
  ['swtunnel_2', (A) => ch(A) === 61, [
    L('selene', '你為什麼要當信使？', 'Why did you become a courier?'),
    L('rowan', '因為信使不用做決定。信寫好了，地址寫好了。我只要走路。', 'Because couriers don\'t have to make decisions. The letter\'s written, the address is written. All I do is walk.'),
    L('selene', '……我也是。守鐘騎士只要照著規則敲鐘，就不會錯。', '…Same for me. A Bell Warden only has to ring the bell by the rules, and she can never be wrong.'),
    L('selene', '可是那天，我第一次自己做了決定。好可怕。', 'But that day I made a decision of my own for the first time. It was terrifying.'),
    L('rowan', '……後悔嗎？', '…Do you regret it?'),
    L('selene', '不。可怕，但是不後悔。', 'No. Terrifying, but no regrets.')]],
  ['ferry_2', (A) => ch(A) === 62 && !A.flag('c6b_ferry'), [
    L('sai', '桐生先生，你的眼睛……', 'Master Kiriyu, your eyes…'),
    L('kiriyu', '三年前開始看不清楚。現在，只看得到光和影子。', 'Three years ago they started to blur. Now I see only light and shadow.'),
    L('kiriyu', '可是我發現，眼睛看不見以後，刀的聲音反而更清楚了。好的刀，在出鞘的時候會唱歌。', 'But I\'ve found that since my eyes failed, I hear a blade more clearly. A good blade sings as it leaves the sheath.'),
    L('sai', '……我師父也說過一樣的話。拳頭是用來聽的。', '…My master said the same. A fist is for listening.'),
    L('kiriyu', '呵。那我們兩個，都是靠耳朵活著的人了。', 'Heh. Then we\'re both men who live by our ears.')]],
  ['trench_2', (A) => ch(A) === 62 && !A.flag('c6b_trench'), [
    L('galan', '海底好暗喔。馬戲團的帳篷裡，晚上也這麼暗。表演開始之前，大家都屏住呼吸。', 'It\'s so dark under the sea. The big top was this dark at night too. Before a show, everyone held their breath.'),
    L('galan', '然後團長奶奶吹哨子——燈一下子全亮了！', 'Then Grandma blew her whistle — and all the lights came on at once!'),
    L('sai', '……你很想她吧。', '…You miss her, don\'t you.'),
    L('galan', '嗯。可是我不哭。奶奶說，馴獸師哭的話，動物會害怕。', 'Yeah. But I don\'t cry. Grandma said if the tamer cries, the animals get scared.'),
    L('kiriyu', '……在這裡哭沒關係。這裡沒有動物。只有兩個老頭子。', '…You may cry here. There are no animals. Only two old men.'),
    L('sai', '我才二十六歲。', 'I\'m only twenty-six.')]],
  ['raintower_2', (A) => ch(A) === 8, [
    L('rowan', '……奇怪。艾莉雅的臉，我想不起來了。', '…Strange. I can\'t remember Aria\'s face.'),
    L('selene', '是霧。雨城的霧會偷走記憶。……我也想不起燈塔的鐘聲了。', 'It\'s the fog. Rainhold\'s fog steals memories. …I can\'t remember the lighthouse bell either.'),
    L('sai', '那就說出來。說出來的東西，霧就偷不走。', 'Then say it out loud. What you say out loud, the fog can\'t steal.'),
    L('rowan', '……她沒有影子。她會在奇怪的地方笑。她說我的信在哭。', '…She has no shadow. She smiles at strange moments. She said my letter was crying.'),
    L('rowan', '她第一次說「不」的時候，聲音在發抖。可是她說了。', 'The first time she said "no", her voice was shaking. But she said it.'),
    L('selene', '……想起來了嗎？', '…Do you remember now?'),
    L('rowan', '嗯。全部。', 'Yes. All of it.')]],
  ['arcanum_2', (A) => ch(A) === 11, [
    [null, '熔爐的窗口裡，一隻小小的星靈正在慢慢地融化成金色的液體。', 'Through the furnace window, a small Astral is slowly melting into golden liquid.'],
    L('aria', '……牠在唱歌。最後一首。', '…It\'s singing. Its last song.'),
    L('edmund', '艾莉雅，別看了。', 'Aria, don\'t look.'),
    L('aria', '不。我要聽完。總要有人聽完牠的歌。', 'No. I\'m going to listen to the end. Someone has to hear its song to the end.'),
    [null, '那首歌停了。艾莉雅閉上眼睛，嘴唇動了一下——她在跟著唱最後一個音。', 'The song stops. Aria closes her eyes, and her lips move: she is singing its last note along with it.'],
    L('rowan', '……走吧。去救還活著的。', '…Let\'s go. Let\'s save the ones still alive.')]],
  ['gate_2', (A) => ch(A) === 12 && !A.flag('c12_done'), [
    L('aria', '門的另一邊，是星靈的家。……那我呢？我的家在哪裡？', 'The other side of the Gate is the Astrals\' home. …And me? Where\'s my home?'),
    L('selene', '燈塔的守鐘人說過：家就是有人在等你回去的地方。', 'The lighthouse wardens have a saying: home is wherever someone is waiting for you to come back.'),
    L('rowan', '那妳的家，應該有很多個。霜石鎮的約恩、雪狐神社的摩卡……', 'Then you must have a lot of homes. Jon in Frostvale, Moka at the fox shrine…'),
    L('edmund', '蘇拉斯也算一個。學徒們一直在問，那個聽得懂風琴的女孩什麼時候回來。', 'Count Sularis as one. The apprentices keep asking when the girl who understood the organ is coming back.'),
    L('aria', '……那我開門的時候，要記得回來。', '…Then when I open the Gate, I\'ll remember to come back.')]],
  ['burning', (A) => ch(A) === 14 && !A.flag('c14_done'), [
    L('leopold', '艾莉雅。我小時候，哥哥每天晚上都會唱搖籃曲給我聽。', 'Aria. When I was little, my brother sang me a lullaby every night.'),
    L('aria', '……也唱給我聽。同一首。', '…He sang it to me too. The same one.'),
    L('leopold', '那首歌的最後一句，他總是不唱。我問他為什麼，他說「因為唱完了，就結束了」。', 'He never sang the last line. When I asked him why, he said, "Because once it\'s sung, it\'s over."'),
    L('aria', '最後一句是什麼？', 'What is the last line?'),
    L('leopold', '……我不知道。我們兩個，都沒有聽過那首歌的結尾。', '…I don\'t know. Neither of us has ever heard how that song ends.')]],
  ['valley', (A) => ch(A) === 15 && !A.flag('c15_done'), [
    L('bolo', '這種白色的花，叫「留音花」。據說它會把聽到的聲音，存在花瓣裡。', 'These white flowers are called echo-blooms. They say they store every sound they hear in their petals.'),
    L('aria', '……那這片花海，聽了好多好多年的歌。', '…Then this whole field has been listening to songs for years and years.'),
    L('leopold', '如果哥哥讓世界安靜了，這些花裡的聲音，會變成最後的聲音。', 'If my brother silences the world, the sounds inside these flowers will become the last sounds there are.'),
    L('rowan', '那就別讓它們變成最後的。', 'Then let\'s not let them be the last.')]],
  ['isle_2', (A) => ch(A) === 16, [
    [null, '天空鐘樓的走廊。風很大，可是一行人停了下來。', 'A corridor of the Sky Belfry. The wind is fierce, but the party stops.'],
    L('edmund', '……各位。如果明天世界真的安靜了，有沒有什麼話，想趁現在說？', '…Everyone. If the world really does go silent tomorrow, is there anything you\'d like to say while you still can?'),
    L('selene', '我想說，謝謝。那天在地下室，有人沒有把我當成「信」。', 'I want to say thank you. That day in the cellar, someone didn\'t treat me like a "letter".'),
    L('sai', '我想說，我好想吃蘇拉斯的烤餅。', 'I want to say I\'m dying for some Sularis flatbread.'),
    L('rowan', '……現在說這個？', '…You\'re saying that NOW?'),
    L('aria', '我想說……我很喜歡大家的聲音。每一個人的。', 'I want to say… I love all your voices. Every single one.'),
    L('aria', '所以我會記住的。不管發生什麼事。', 'So I\'ll remember them. No matter what happens.')]],
  ['r_sularis', (A) => !A.flag('sularis_up'), [
    L('edmund', '洛恩。這一年，你夢到過她嗎？', 'Rowan. This past year, did you ever dream about her?'),
    L('rowan', '……每天。夢裡她都在對我說話，可是沒有聲音。', '…Every night. In the dream she\'s always talking to me, but there\'s no sound.'),
    L('edmund', '我也夢到過。夢裡她在風琴室，對著三百根管子，一根一根地聽。', 'I dreamed of her too. In the dream she\'s in the organ hall, listening to the three hundred pipes one by one.'),
    L('edmund', '醒來以後，我就開始造共鳴爐了。……也許她也在夢裡，給了我一封信。', 'When I woke I started building the resonance furnace. …Maybe she gave me a letter in that dream as well.')]],
  ['tomb_2', (A) => !A.flag('goldwing'), [
    L('regis', '雲鯨老了以後，會自己游到這裡來。牠們知道，這裡是最後的地方。', 'When cloud whales grow old they swim here on their own. They know this is the last place.'),
    L('regis', '寧波斯還年輕。牠不該在這裡。', 'Nimbus is still young. She doesn\'t belong here.'),
    L('rowan', '那就帶她回去。', 'Then let\'s take her home.'),
    L('regis', '……你這小子，說得好像寄包裹一樣簡單。', '…The way you talk, kid, you\'d think it was as simple as posting a parcel.'),
    L('rowan', '寄包裹也不簡單喔。', 'Posting a parcel isn\'t simple either, you know.')]],
  ['dream_2', (A) => !A.hasMember('kiriyu'), [
    [null, '廢墟的牆上，掛著一把沒有完成的刀。刀身上，刻著兩個名字：「美奈」「廉」。', 'On a ruined wall hangs an unfinished blade. Two names are carved on it: "Mina", "Ren".'],
    L('rowan', '……桐生先生一直在打這把刀。', '…Master Kiriyu has been forging this blade all along.'),
    L('rowan', '他說過，在失明之前，要鍛出一把能斬斷沉默的刀。', 'He said that before he went blind, he would forge a blade that could cut through silence.')]],
  ['phoenixcave_2', (A) => !A.flag('letter_done'), [
    L('rowan', '這封信，我放在包包裡九年了。紙都黃了，邊角都磨圓了。', 'I\'ve carried this letter in my bag nine years. The paper\'s gone yellow, the corners are worn round.'),
    L('rowan', '我一直以為，只要不送，瑟恩就還在等。只要還在等，就還沒結束。', 'I always thought that as long as I didn\'t deliver it, Seren would still be waiting. And as long as she was waiting, it wasn\'t over.'),
    L('rowan', '……跟歐瑟有點像吧。不唱最後一句，歌就不會結束。', '…A bit like Orsay, isn\'t it. Don\'t sing the last line, and the song never ends.')]],
  ['culttower_2', (A) => !A.hasMember('bolo'), [
    [null, '塔的牆上，寫滿了同一句話：「安靜才是救贖」。字跡有好幾千種。', 'The tower walls are covered with the same sentence: "Silence is salvation." In thousands of different hands.'],
    L('lili', '……這裡面，有老師的字。', '…Teacher\'s handwriting is in here.'),
    L('lili', '老師的字，「救」那一筆總是寫得特別長。他說那是要伸手去拉住別人。', 'Teacher always makes one stroke of "salvation" extra long. He says it\'s a hand reaching out to pull someone up.'),
    L('lili', '可是這裡的「救」……那一筆，好短。', 'But here… that stroke is so short.')]],
  ['icecave', (A) => !A.hasMember('uma'), [
    L('moka', '這個冰洞，就是一千年前艾莉雅……不，是星歌，第一次唱歌的地方喔。', 'This Ice Cavern is where, a thousand years ago, Aria… no, the Star Song, sang for the very first time.'),
    L('moka', '雪狐族的傳說是這樣說的：「冰會記得歌。等歌的孩子回來，冰就會融化。」', 'That\'s what the snow foxes\' legend says: "The ice remembers the song. When the song\'s child returns, the ice will melt."'),
    L('rowan', '……冰還沒融化。', '…The ice hasn\'t melted.'),
    L('moka', '所以她還沒回來。可是，她會回來的。', 'So she hasn\'t come back yet. But she will.')]],
  ['spire_3', (A) => !A.flag('final_done'), [
    [null, '塔的半路。窗外，看得到整個安靜的世界。', 'Halfway up the tower. Through the window, the whole silent world lies spread out.'],
    L('selene', '……從這裡看，好美。安靜的世界，原來這麼美。', '…From up here it\'s beautiful. A silent world is this beautiful, after all.'),
    L('rowan', '嗯。所以歐瑟才會想要它吧。', 'Yes. That\'s probably why Orsay wants it.'),
    L('selene', '可是我還是想聽見。聽見海浪、聽見風、聽見孩子們吵架。', 'But I still want to hear. The waves, the wind, the children squabbling.'),
    L('rowan', '還有艾莉雅說「不」的聲音。', 'And Aria\'s voice saying "no".'),
    L('selene', '……對。尤其是那個。', '…Yes. That most of all.')]],
];
export function interludes(M, K) {
  for (const [id, when, lines] of IN) {
    const m = M[id]; if (!m || !m.anchor || !m.anchor.mid) continue;
    const [x, y] = m.anchor.mid;
    m.triggers.push(K.trig(x - 1, y - 1, 3, 3, async (A) => { await A.talk(lines); }, { when }));
  }
}
