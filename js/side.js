// ASH ARIA — side stories: the Courier Guild's deliveries (each a little story told in two towns) and the bounty boards
// (named beasts that lie in wait in places the party has already been). Optional, but this is where much of the world lives.
import { TILE, WALK } from './maps.js?v=4';

export const SIDE_SPEAKERS = {
  clerk: ['信使公會', 'Courier Guild'], hunter2: ['賞金榜', 'Bounty Board'], marta: ['礦工瑪塔', 'Marta the Miner'], timo: ['學徒提莫', 'Timo the Apprentice'],
  sailor2: ['水手卡爾', 'Karl the Sailor'], hana: ['刀匠之女小花', 'Hana, the Smith\'s Daughter'], fog: ['雨城的老人', 'Old Man of Rainhold'], liesel: ['莉瑟爾', 'Liesel'],
  butler: ['齒輪伯爵的管家', 'Gearwick\'s Butler'], gearwick: ['齒輪伯爵', 'Count Gearwick'], deserter: ['逃兵', 'Deserter'], warden2: ['年輕的守衛', 'Young Warden'],
  scholar: ['老學者', 'Old Scholar'], archivist: ['薩瑪的管理員', 'Samar Archivist'], banker: ['銀行家奧托', 'Otto the Banker'], founder: ['鑄鐘師', 'Bell-Founder'],
  waiting: ['等待的女人', 'The Waiting Woman'], husband: ['造船的男人', 'The Boatbuilder'], katie: ['凱蒂', 'Katie'], deafkid: ['傾城的孩子', 'Child of Crumbleton'],
  fighter: ['鬥士', 'Fighter'], owner: ['鬥技場老闆', 'Colosseum Owner'], ringmaster: ['團長奶奶', 'The Old Ringmaster'], barg: ['巴爾格', 'Barg'],
};

const st = (A) => ({ 61: 6.1, 62: 6.2, 63: 6.3 }[A.S.ch] ?? A.S.ch);
const before = (n) => (A) => st(A) >= n && !A.flag('c17_done');
const after = (A) => A.flag('goldwing');
const S_ = (sp, zh, en) => [sp, zh, en];

// ---------------------------------------------------------------- deliveries: from, to, when, title, the request, the delivery, reward
const J = (id, from, to, when, title, ask, done, gil, item, o = {}) => ({ id, from, to, when, title, ask, done, gil, item, ...o });
export const JOBS = [
  // ---- before the Fall
  J('scarf', 'frostvale', 'sularis', before(4), ['給學徒兒子的圍巾', 'A Scarf for an Apprentice'],
    [S_('marta', '我兒子提莫在蘇拉斯當風琴學徒。沙漠晚上很冷吧？我織了一條圍巾……他會不會嫌土？', 'My boy Timo is apprenticed to the organ-makers in Sularis. The desert gets cold at night, doesn\'t it? I knitted him a scarf… will he think it\'s embarrassing?')],
    [S_('timo', '媽寄來的？……圍巾上有礦坑的煤灰味。', 'From Mum? …It smells of coal dust from the mine.'), S_('timo', '其他學徒都在笑我。可是……我今天晚上就要圍著它調音。', 'The other apprentices are laughing at me. But… I\'m wearing it to tune pipes tonight.'), S_('timo', '等一下，我寫封回信。可以幫我帶回去嗎？', 'Wait — I\'ll write back. Could you take it to her?')], 300, 'potion'),
  J('pipe', 'sularis', 'frostvale', (A) => before(4)(A) && A.count('job_scarf') === 2, ['學徒的第一根管子', 'The Apprentice\'s First Pipe'],
    [S_('timo', '這是我第一根自己調好音的風琴管。很小，只能發一個音。請交給霜石鎮的瑪塔。', 'This is the first organ pipe I ever tuned myself. It\'s tiny — it only plays one note. Please give it to Marta in Frostvale.')],
    [S_('marta', '……一根管子？', '…A pipe?'), [null, '瑪塔對著管子吹了一口氣。一個清亮的音，在雪裡飄開。', 'Marta blows into the pipe. One clear note drifts out over the snow.'], S_('marta', '這是「Fa」。他小時候，老是把 Fa 唱成 Mi。……這孩子，長大了。', 'That\'s an F. When he was little he always sang F as E. …My boy has grown up.')], 400, 'ether'),
  J('jon', 'frostvale', 'hideout', before(5), ['敲鐘人的舊信', 'The Bell-Ringer\'s Old Letter'],
    [S_('jon', '無聲者之谷的歐文，是我年輕時的朋友。四十年沒寫信了……幫我送這封吧。', 'Owen of the Unsung was a friend of mine when we were young. Forty years since I last wrote… take this for me, would you?')],
    [S_('villager', '歐文長老出門了。我先替他收著。……信封上寫著「給那個說鐘聲沒必要的傻瓜」？', 'Elder Owen is away. I\'ll keep it for him. …The envelope says "To the fool who said bells weren\'t needed"?'), S_('villager', '長老常說，北方有個敲鐘的傻瓜，跟他吵了一整個夏天。原來是真的。', 'The Elder often talks about a bell-ringing fool up north who argued with him one whole summer. So it\'s true.')], 500, 'ether'),
  J('unsungpipe', 'hideout', 'sularis', before(5), ['給沒有鐘的山谷一根風琴管', 'An Organ Pipe for a Valley Without Bells'],
    [S_('woman', '灰潮來的時候，我們只能大聲唱歌。可是孩子們的聲音太小了。蘇拉斯能不能借我們一根風琴管？', 'When the Ashtide comes we can only sing as loud as we can. But the children\'s voices are so small. Could Sularis lend us one organ pipe?')],
    [S_('timo', '無聲者之谷的請求？首領說過，風琴是用來讓人活下去的，不是拿來賣的。', 'A request from the Unsung? The chief always says organs are for keeping people alive, not for selling.'), S_('timo', '這根給他們。下次灰潮來的時候，讓孩子們對著它唱，聲音會大十倍。', 'Give them this one. Next time the Ashtide comes, have the children sing into it — their voices will be ten times louder.')], 700),
  J('love1', 'southwind', 'kasumi', before(7), ['水手的情書（一）', 'The Sailor\'s Love Letter (I)'],
    [S_('sailor2', '霞之國刀匠的女兒小花……去年她來港口買魚，我就……咳。幫我送這封信。別偷看！', 'Hana, the swordsmith\'s daughter in Kasumi… she came to the harbour for fish last year and I… ahem. Deliver this letter. No peeking!')],
    [S_('hana', '南風鎮的水手？那個把魚錢算錯三次的人？', 'The sailor from Southwind? The one who got my change wrong three times?'), S_('hana', '……信上的字好醜。可是，寫了好多。', '…His handwriting is awful. But he wrote so much.')], 500),
  J('love2', 'kasumi', 'southwind', (A) => before(7)(A) && A.count('job_love1') === 2, ['刀匠之女的回信（二）', 'The Smith\'s Daughter Replies (II)'],
    [S_('hana', '這是回信。你跟他說……春天櫻花開的時候，可以來霞之國看看。只是看看喔！', 'Here\'s my reply. Tell him… when the cherry trees bloom in spring, he may come and visit Kasumi. Just to look, mind!')],
    [S_('sailor2', '她……她回信了？！', 'She… she wrote back?!'), S_('sailor2', '「春天，可以來看看。」……我要去學怎麼把錢算對！', '"In spring, you may come and look." …I\'m going to learn to count change properly!')], 600),
  J('love3', 'southwind', 'kasumi', (A) => before(7)(A) && A.count('job_love2') === 2, ['一枚戒指（三）', 'A Ring (III)'],
    [S_('sailor2', '春天到了。我自己不敢去……這枚戒指，是用我十年的薪水打的。請幫我問她。', 'It\'s spring. I don\'t dare go myself… this ring cost me ten years\' wages. Please, ask her for me.')],
    [S_('hana', '……笨蛋。這種事要自己來問啊。', '…Idiot. You\'re supposed to ask this sort of thing yourself.'), S_('hana', '告訴他：答案是「好」。可是要他自己來接我。', 'Tell him: the answer is "yes". But he has to come and fetch me himself.'), [null, '（之後，南風鎮的港口多了一對總是在吵架的夫妻。）', '(After that, the Southwind harbour gained a married couple who never stopped bickering.)']], 1200, 'amulet'),
  J('meat', 'wildhut', 'frostvale', before(7), ['獵人的乾肉', 'The Hunter\'s Dried Meat'],
    [S_('hunter', '霜石鎮的雪狐神社，冬天食物不夠。這些乾肉送去給狐巫吧。', 'The snow-fox shrine in Frostvale runs short of food in winter. Take this dried meat to the shrine maiden.')],
    [S_('fox', '嗚嗚♪', 'Awoo♪'), S_('child', '狐狸們在跳舞！牠們說謝謝！……我覺得是這個意思。', 'The foxes are dancing! They\'re saying thank you! …I think that\'s what it means.')], 600, 'potion'),
  J('lyrics', 'frostvale', 'southwind', before(7), ['給燈塔的歌詞', 'Lyrics for a Lighthouse'],
    [S_('child', '神社的狐巫說，燈塔的鐘裡有一隻很寂寞的星靈。我寫了一首歌給牠！可以幫我送去嗎？', 'The shrine maiden says there\'s a lonely Astral in the lighthouse bell. I wrote it a song! Can you take it there?')],
    [S_('man', '給燈塔鐘的……歌？好吧，我唸給它聽。', 'A song… for the lighthouse bell? All right. I\'ll read it to it.'), [null, '他唸完最後一句的時候，燈塔的鐘，自己輕輕地響了一聲。', 'As he reads the last line, the lighthouse bell rings once, softly, all by itself.'], S_('man', '……我在這裡守了二十年，第一次聽到它這樣響。', '…I\'ve kept this lighthouse twenty years. That\'s the first time I\'ve heard it ring like that.')], 900, 'whitecape'),
  J('fog1', 'rainhold', 'gilden', before(9), ['不記得女兒的父親', 'A Father Who Can\'t Remember'],
    [S_('fog', '我有一個女兒，住在金鍍城。叫莉瑟爾……對，莉瑟爾。霧太濃了，我記不得她的臉。', 'I have a daughter in Gilden. Liesel… yes, Liesel. The fog\'s so thick, I can\'t remember her face.'), S_('fog', '可是我記得，我很愛她。這件事，我一定要趁還記得的時候寫下來。', 'But I remember that I love her. I have to write that down while I still remember it.')],
    [S_('liesel', '爸爸寫的？……他已經五年沒有認出我了。', 'From Father? …He hasn\'t recognised me in five years.'), S_('liesel', '「我記不得妳的臉。可是我記得，我很愛妳。」……', '"I can\'t remember your face. But I remember that I love you."…'), S_('liesel', '請等我一下。我要畫一張自己的畫像，讓他放在枕頭旁邊。', 'Please wait. I\'m going to paint a portrait of myself for him to keep by his pillow.')], 1500),
  J('fog2', 'gilden', 'rainhold', (A) => before(9)(A) && A.count('job_fog1') === 2, ['女兒的畫像', 'The Daughter\'s Portrait'],
    [S_('liesel', '畫好了。背面寫了我的名字，寫了好大好大。', 'It\'s finished. I wrote my name on the back — very, very big.')],
    [S_('fog', '……這是誰？好漂亮的姑娘。', '…Who\'s this? What a lovely girl.'), S_('fog', '背面寫著……莉瑟爾。', 'On the back it says… Liesel.'), S_('fog', '我想起來了。她小時候，最怕打雷。……謝謝你們。', 'Now I remember. When she was small she was terribly afraid of thunder. …Thank you.')], 1000, 'remedy'),
  J('organorder', 'gilden', 'sularis', before(9), ['公爵的訂單', 'The Duke\'s Order'],
    [S_('orwell', '我要訂一座蘇拉斯的風琴！放在我的浴室裡！錢不是問題！', 'I wish to order a Sularis organ! For my bathroom! Money is no object!')],
    [S_('timo', '……浴室？', '…A bathroom?'), S_('timo', '首領說，蘇拉斯的風琴只為兩種東西而做：擋住灰潮，和讓人開心。', 'The chief says Sularis organs are made for two things only: holding back the Ashtide, and making people happy.'), S_('timo', '如果在浴室裡唱歌會讓公爵開心……好吧，我們做一座最小的。', 'If singing in the bath makes the Duke happy… fine. We\'ll make him the smallest one we can.')], 1500),
  J('fan1', 'gilden', 'vexhold', before(10), ['寄給齒輪伯爵的粉絲信', 'A Fan Letter for Count Gearwick'],
    [S_('child', '我最喜歡齒輪伯爵了！蒸汽螃蟹好帥！這是我畫的伯爵，可以送給他嗎？', 'I love Count Gearwick! The steam crab is SO cool! I drew the Count — can you give it to him?')],
    [S_('butler', '伯爵大人的……粉絲信？二十年來第一封。', 'A… fan letter for His Lordship? The first in twenty years.'), S_('gearwick', '什麼？！給我看！……哼、哼哼……畫得還不錯嘛，鬍子的角度很有品味！', 'What?! Show me! …Hmph. Hm-hm… not bad at all. The angle of the moustache is most tasteful!'), S_('gearwick', '你們等著！本伯爵要親筆回信！', 'Wait right there! I shall reply in my own hand!')], 1200),
  J('fan2', 'vexhold', 'gilden', (A) => before(10)(A) && A.count('job_fan1') === 2, ['伯爵的親筆回信', 'The Count\'s Reply'],
    [S_('butler', '伯爵大人寫了……十四頁。其中十二頁在誇獎自己。剩下兩頁是蒸汽螃蟹的設計圖。', 'His Lordship has written… fourteen pages. Twelve of them in praise of himself. The other two are blueprints for the steam crab.')],
    [S_('child', '設計圖！是真的設計圖！', 'Blueprints! Real blueprints!'), S_('child', '我長大要當發明家！要做出比伯爵更大、更亮、更有品味的螃蟹！', 'When I grow up I\'m going to be an inventor! I\'ll build a crab bigger, shinier and more TASTEFUL than the Count\'s!')], 1500),
  J('desert1', 'vexhold', 'hideout', before(10), ['逃兵的請求', 'A Deserter\'s Request'],
    [S_('deserter', '（小聲）我是聖詠院的守衛。我……走音了。被發現的話會被「重新調音」。無聲者之谷，會收留我嗎？', '(whispering) I\'m a Choir warden. I… sing off-key. If they find out I\'ll be "retuned". Would the Unsung take me in?')],
    [S_('woman', '走音？那你來對地方了。我們這裡，沒有一個人唱得準。', 'Off-key? Then you\'ve found the right place. Not one of us here can sing in tune.'), S_('woman', '跟他說，山谷的門一直開著。', 'Tell him the valley\'s door is always open.')], 1000, 'ether', { n: 2 }),
  J('desert2', 'hideout', 'vexhold', before(10), ['給當守衛的兒子', 'To a Son Who Became a Warden'],
    [S_('woman', '我的兒子當了聖詠院的守衛。他離家的時候說，我們這種人唱的歌，是噪音。', 'My son joined the Choir\'s wardens. When he left home he said that our kind of singing was just noise.'), S_('woman', '幫我告訴他……山谷的歌，還在唱。他小時候最喜歡的那首。', 'Tell him for me… the valley\'s song is still being sung. The one he loved when he was little.')],
    [S_('warden2', '……媽媽寫的？', '…From Mother?'), [null, '年輕的守衛讀著信，嘴唇動了起來。他在無聲地唱著一首歌。', 'The young warden reads, and his lips begin to move. He is silently singing a song.'], S_('warden2', '我明天就辭職。', 'I\'m resigning tomorrow.')], 1800),
  J('book', 'vexhold', 'samar', before(14), ['借了四十年的書', 'A Book Forty Years Overdue'],
    [S_('scholar', '我年輕時在薩瑪借了一本書，一直沒還。現在還，應該不會被罵吧？', 'When I was young I borrowed a book from Samar and never returned it. They won\'t scold me if I give it back now, surely?')],
    [S_('archivist', '……逾期四十年。罰金是一萬四千六百金幣。', '…Forty years overdue. The fine is fourteen thousand six hundred gil.'), S_('archivist', '開玩笑的。書回來了就好。書比罰金重要多了。', 'Only joking. What matters is that the book came home. A book is worth far more than a fine.')], 1500, 'wisdom'),
  J('lullaby', 'samar', 'rainhold', before(14), ['抄下來的搖籃曲', 'A Copied Lullaby'],
    [S_('archivist', '雨城有個老人，寫信來問一首搖籃曲的歌詞。他太太以前常唱。我們在書庫裡找到了。', 'An old man in Rainhold wrote asking for the words of a lullaby his wife used to sing. We found it in the archive.')],
    [S_('fog', '……♪ 霧裡的燈，一盞一盞……', '…♪ Lamps in the fog, one by one…'), S_('fog', '對，就是這首。她唱到這一句的時候，總會停下來笑。', 'Yes, this is it. Whenever she reached this line she\'d stop and laugh.'), S_('fog', '我現在想起來了——她笑的時候，左邊有一個酒窩。', 'Now I remember — when she laughed, she had a dimple on the left.')], 1500, 'speedbangle'),
  J('ore1', 'kasumi', 'frostvale', before(7), ['刀匠學徒要的礦石', 'Ore for an Apprentice Smith'],
    [S_('man', '我是桐生師父的學徒。師父說，北方霜石鎮的礦坑，有一種會唱歌的鐵。想向礦工們買一點。', 'I\'m Master Kiriyu\'s apprentice. The Master says the Frostvale mines yield an iron that sings. I\'d like to buy some from the miners.')],
    [S_('marta', '會唱歌的鐵？你說星鐵吧。挖的時候會「叮」一聲的那種。', 'Iron that sings? You mean star-iron. The kind that goes "ting" when you dig it out.'), S_('marta', '這一塊給他。不用錢——跟他說，打出好刀來，給我們看看就好。', 'Give him this piece. No charge — tell him to forge a good blade and show us, that\'s all.')], 900),
  J('ore2', 'frostvale', 'kasumi', (A) => before(7)(A) && A.count('job_ore1') === 2, ['一塊星鐵', 'A Lump of Star-Iron'],
    [S_('marta', '星鐵在這裡。路上小心，它在晚上會自己發光。', 'Here\'s the star-iron. Careful on the road — it glows by itself at night.')],
    [S_('man', '……真的在唱。', '…It really is singing.'), S_('man', '師父說過，刀是用來守護的，不是用來砍的。這塊鐵，我要打成一把守護霞之國的刀。', 'The Master always said a blade is for protecting, not for cutting. I\'ll forge this iron into a blade that protects Kasumi.')], 1100, 'kotetsu'),
  J('drawings', 'southwind', 'gilden', before(9), ['孩子們的畫', 'The Children\'s Drawings'],
    [S_('child', '我們聽說金鍍城的音樂會好漂亮！可是我們進不去……這些畫，可以貼在音樂廳的門口嗎？', 'We heard Gilden\'s concerts are so beautiful! But we can\'t go in… could these drawings be put up by the concert hall door?')],
    [S_('director', '漁村孩子們畫的……音樂會？畫裡的人都在笑，而且每個人都在唱歌。', 'A concert… drawn by the fishing-village children? Everyone in these pictures is smiling, and every one of them is singing.'), S_('director', '我會貼在後台。比門口更好的地方——讓上台的人第一眼就看到。', 'I\'ll put them up backstage. Better than the door: the first thing every performer sees before going on.')], 800),
  J('candle', 'rainhold', 'vexhold', before(10), ['還回去的燭台', 'The Returned Candlesticks'],
    [S_('thief', '……這是我以前從聖詠院偷的燭台。上次被你們打敗之後，我一直睡不好。幫我還回去吧。', '…These candlesticks I once stole from the Choir. Since you beat me that time I haven\'t slept well. Take them back for me.')],
    [S_('soldier', '燭台？……這是十年前失竊的那一對！附了一張紙條：「對不起。燭台很亮，可是我的心很暗。」', 'Candlesticks? …These are the pair stolen ten years ago! There\'s a note: "Sorry. The candlesticks were bright, but my heart was dark."'), S_('soldier', '……這小偷還挺會寫的。', '…For a thief, he writes rather well.')], 1500),
  J('brother1', 'wildhut', 'gilden', before(9), ['給銀行家弟弟', 'To a Banker Brother'],
    [S_('hunter', '我弟弟在金鍍城當銀行家。三十年前我們吵了一架，就沒再說過話。……我老了，想跟他說一聲對不起。', 'My younger brother is a banker in Gilden. Thirty years ago we had a row and never spoke again. …I\'m old now. I want to tell him I\'m sorry.')],
    [S_('banker', '……哥哥寫的？', '…From my brother?'), S_('banker', '那天吵架，是因為我欠他一百金幣。我一直以為，他是因為錢才不理我。', 'That row was because I owed him a hundred gil. All these years I thought he wouldn\'t speak to me because of the money.'), S_('banker', '等我一下。我要寫回信——還有，連本帶利還他。', 'Wait a moment. I\'m writing back — and repaying him, with interest.')], 800),
  J('brother2', 'gilden', 'wildhut', (A) => before(9)(A) && A.count('job_brother1') === 2, ['連本帶利', 'With Interest'],
    [S_('banker', '一百金幣，三十年的利息……我算了一下，是兩千五百金幣。全部交給他。', 'A hundred gil, with thirty years\' interest… by my reckoning, two thousand five hundred. Give him all of it.')],
    [S_('hunter', '這個笨蛋……我才不要錢。', 'The fool… I don\'t want money.'), S_('hunter', '……可是信，我收下了。下個月，他說要來荒原看我。我得把小屋打掃一下。', '…But the letter, I\'ll keep. He says he\'s coming to see me on the Wildlands next month. I\'d better tidy the hut.'), S_('hunter', '錢你們拿去吧。他知道我一定會這麼說。', 'You take the money. He knew I\'d say that.')], 2500),
  J('notes', 'samar', 'kasumi', before(14), ['沼澤的觀察筆記', 'Notes on the Marsh'],
    [S_('archivist', '我們的學者研究了沉鐘沼澤的魔物，寫了一本筆記。霞之國的衛兵說不定用得上。', 'One of our scholars studied the creatures of the Drowned Bell marsh and wrote a book of notes. Kasumi\'s guards might find it useful.')],
    [S_('guard', '「沼澤的幽靈怕火，也怕被叫名字。」……叫名字？', '"The marsh ghosts fear fire, and also being called by name." …By name?'), S_('guard', '原來如此。灰眠的人變成的幽靈……還記得自己的名字。我會告訴大家。', 'I see. The ghosts that were people in the grey sleep… still remember their names. I\'ll tell everyone.')], 1400),
  J('blossom', 'kasumi', 'samar', before(14), ['壓花', 'A Pressed Blossom'],
    [S_('hana', '薩瑪的書庫在編一本《四季之書》。這是霞之國的第一朵櫻花，壓好了。', 'Samar\'s archive is compiling a Book of Seasons. This is the first cherry blossom of Kasumi, pressed and dried.')],
    [S_('archivist', '……真美。我會把它放在「春」的第一頁。', '…Beautiful. I\'ll put it on the very first page of "Spring".'), S_('archivist', '一千年後打開這本書的人，也會知道霞之國的春天是什麼顏色。', 'Whoever opens this book a thousand years from now will still know the colour of spring in Kasumi.')], 1400),
  J('apology', 'vexhold', 'frostvale', before(10), ['鑄鐘師的道歉', 'The Bell-Founder\'s Apology'],
    [S_('founder', '我是聖詠院的鑄鐘師。霜石鎮那件事……是我建議要熔掉礦坑裡的星靈的。我想道歉。', 'I\'m a bell-founder of the Choir. That business in Frostvale… it was my idea to melt the Astral in the mine. I want to apologise.')],
    [S_('elder', '……哼。道歉信？', '…Hmph. A letter of apology?'), S_('elder', '跟他說，想道歉就自己來。來聽聽我們那口裂掉的鐘——裂了，還是在響。', 'Tell him if he wants to apologise he can come himself. Let him hear our cracked bell. Cracked, and still it rings.')], 1600, 'charmbangle'),
  // ---- after the Fall (the world is silent; people write instead of speak)
  J('wait1', 'tidewatch', 'nikko', after, ['等待的女人的信', 'The Waiting Woman\'s Letter'],
    [S_('waiting', '（她在紙上寫著）我的丈夫在鐘響那天出海。尼可鎮的人，有沒有見過一個左手少一根手指的水手？', '(She writes on paper) My husband went to sea the day the bells rang. Has anyone in Nikko seen a sailor missing a finger on his left hand?')],
    [S_('husband', '（他看完信，手在發抖）……我的左手，少一根手指。', '(He reads it, and his hands tremble) …I\'m missing a finger on my left hand.'), S_('husband', '我以為她死了。我在這裡造船，想造一艘能開回去的船——可是我太怕了，怕回去只剩下空屋。', 'I thought she was dead. I\'ve been building boats here, meaning to build one that could sail me home — but I was too afraid of finding an empty house.'), S_('husband', '我寫回信。不，我要自己去。', 'I\'ll write back. No — I\'ll go myself.')], 3000),
  J('wait2', 'nikko', 'tidewatch', (A) => after(A) && A.count('job_wait1') === 2, ['先到的回信', 'The Reply That Arrived First'],
    [S_('husband', '我的船還要三天才能下水。可以先幫我把這封信送到嗎？我不想讓她再多等一天。', 'My boat won\'t be in the water for three more days. Could you take this letter ahead? I don\'t want her to wait even one more day.')],
    [S_('waiting', '（她讀完，把信貼在胸口，站了很久）', '(She reads it, presses it to her chest, and stands there a long time)'), S_('waiting', '（她寫）「三天。」我等了一年。三天，算什麼。', '(writing) "Three days." I\'ve waited a year. What are three days.')], 3000, 'xpotion', { n: 2 }),
  J('katie', 'hopehaven', 'crumbleton', after, ['凱蒂的畫', 'Katie\'s Drawing'],
    [S_('katie', '（手語）傾城有一群聽不見的孩子，在跟拳僧叔叔學跳舞。我畫了我們的村子給他們看！', '(signing) In Crumbleton there are children who can\'t hear, learning to dance from the monk. I drew our village to show them!')],
    [S_('deafkid', '（孩子們圍著畫，用力地跺了兩下腳）', '(The children gather round the drawing and stamp twice, hard)'), [null, '跺兩下，是「謝謝」。他們在紙的背面，畫了一排腳印。', 'Two stamps means "thank you". On the back of the paper they draw a row of footprints.']], 2500),
  J('feet', 'crumbleton', 'hopehaven', (A) => after(A) && A.count('job_katie') === 2, ['一排腳印', 'A Row of Footprints'],
    [S_('deafkid', '（一個孩子把畫交給你，指了指希望村的方向）', '(A child hands you the drawing and points toward Hopehaven)')],
    [S_('katie', '（手語）腳印……是節奏！照著踩，就是一支舞！', '(signing) The footprints… they\'re a rhythm! Step on them in order and it\'s a dance!'), [null, '那天晚上，希望村的孩子們踩著腳印跳舞。沒有聲音，可是每個人都在笑。', 'That night, the children of Hopehaven dance along the footprints. There is no sound, but every one of them is smiling.']], 2500, 'remedy', { n: 2 }),
  J('parts', 'nikko', 'sularis', (A) => after(A) && A.flag('sularis_up'), ['共鳴爐的零件', 'Parts for the Resonance Furnace'],
    [S_('man', '（寫著）艾德蒙首領的共鳴爐少一個齒輪。我做好了，請送到蘇拉斯。', '(writing) Chief Edmund\'s resonance furnace is missing a gear. I\'ve made one — please take it to Sularis.')],
    [S_('timo', '這個齒輪……刻了字。「給讓聲音回來的人」。', 'This gear… has words carved on it. "For the ones bringing sound back."'), S_('timo', '裝上去了！共鳴爐的聲音……又傳得更遠了一點！', 'It\'s fitted! The furnace\'s sound carries… a little further again!')], 3500),
  J('schedule', 'sularis', 'tidewatch', (A) => after(A) && A.flag('sularis_up'), ['風琴的時刻表', 'The Organ\'s Timetable'],
    [S_('timo', '蘇拉斯的風琴每天黃昏會彈一小時。風往東吹的日子，潮望鎮也聽得到。把時刻表貼到潮望鎮去！', 'Sularis\'s organ plays for an hour every dusk. On days the wind blows east, Tidewatch can hear it too. Post this timetable in Tidewatch!')],
    [S_('man', '（手語）黃昏……一小時……聽得到聲音？', '(signing) Dusk… an hour… we can hear sound?'), [null, '那天黃昏，潮望鎮的人全都爬上了屋頂，面向西方。', 'That dusk, everyone in Tidewatch climbs onto the rooftops and faces west.']], 3500),
  J('handbell', 'r_frostvale', 'hopehaven', after, ['敲鐘人的手鈴', 'The Bell-Ringer\'s Handbell'],
    [S_('jon', '（寫著）聽說希望村有個守鐘騎士，每天晚上搖手鈴給孤兒們看。這是我的手鈴，四十年了。給她吧。', '(writing) I hear there\'s a Bell Warden in Hopehaven who rings a handbell for the orphans every night. This is my handbell — forty years old. Give it to her.')],
    [S_('katie', '（手語）新的鈴！這個鈴……把手的地方磨得好亮。', '(signing) A new bell! This one… the handle is worn so shiny.'), [null, '四十年的手，在把手上留下了形狀。孩子們輪流握著它，好像在跟一個陌生的老人握手。', 'Forty years of a hand have shaped that handle. The children take turns holding it, as if shaking hands with an old man they\'ve never met.']], 3000),
  J('prize', 'colosseum', 'nikko', after, ['鬥士的獎金', 'A Fighter\'s Prize Money'],
    [S_('fighter', '（寫著）我在鬥技場贏了一場。獎金寄給尼可鎮的媽媽。別跟她說我在打架，說我在……做生意。', '(writing) I won a bout at the Colosseum. Send the prize money to my mother in Nikko. Don\'t tell her I fight — say I\'m in… business.')],
    [S_('oldwoman', '（寫著）做生意？哼，他從小就不會說謊。', '(writing) Business? Hmph. He never could lie, even as a boy.'), S_('oldwoman', '（寫著）跟他說：錢收到了，下次贏了，記得回家吃飯。', '(writing) Tell him: money received. Next time he wins, he\'s to come home for dinner.')], 3500),
  J('stage1', 'r_wildhut', 'colosseum', after, ['團長奶奶的請求', 'The Ringmaster\'s Request'],
    [S_('ringmaster', '（她慢慢地寫）我想再開一次馬戲團。只要一個晚上就好。鬥技場……能不能借我們一個場子？', '(She writes slowly) I want to open the circus once more. Just for one night. Could the Colosseum… lend us a ring?')],
    [S_('owner', '（寫著）馬戲團？在沒有聲音的世界裡？', '(writing) A circus? In a world without sound?'), S_('owner', '（寫著）……沒有聲音，可是有光、有動物、有人在飛。好。鬥技場休息一晚。', '(writing) …No sound, but there\'ll be lights, animals, people flying. Very well. The Colosseum closes for one night.')], 3000),
  J('stage2', 'colosseum', 'r_wildhut', (A) => after(A) && A.count('job_stage1') === 2, ['一晚的舞台', 'A Stage for One Night'],
    [S_('owner', '（寫著）場地準備好了。把這張邀請函交給團長。', '(writing) The arena is ready. Give this invitation to the ringmaster.')],
    [S_('ringmaster', '（她讀著邀請函，眼睛亮了起來）', '(She reads the invitation, and her eyes light up)'), [null, '那一晚，鬥技場的觀眾席坐滿了人。開場的時候，一個男孩吹響了哨子——每個人都覺得自己聽見了。', 'That night the Colosseum stands are full. When the show opens, a boy blows a whistle — and every single person feels they heard it.']], 4000, 'xpotion', { n: 2 }),
  J('whalestone', 'tidewatch', 'r_frostvale', after, ['鯨歌的碎片', 'A Shard of Whalesong'],
    [S_('fisher', '（寫著）網裡撈到一塊石頭，貼在耳朵上，聽得到鯨的歌。雪狐神社的狐巫，也許知道怎麼用它。', '(writing) I netted a stone. Hold it to your ear and you can hear a whale singing. The fox shrine maiden might know what to do with it.')],
    [S_('jon', '（寫著）狐巫出門了。我先把它放在神社的祭壇上。', '(writing) The shrine maiden is away. I\'ll put it on the shrine altar for now.'), [null, '石頭放上祭壇的瞬間，冰洞深處，傳來一聲很長很長的回應。', 'The moment the stone touches the altar, from deep in the Ice Cavern comes a long, long answering call.']], 3500, 'turbo'),
  J('medicine', 'hopehaven', 'nikko', after, ['孤兒院的藥', 'Medicine for the Orphanage'],
    [S_('katie', '（手語）小湯姆發燒了。尼可鎮的藥店，有沒有藥？', '(signing) Little Tom has a fever. Does the apothecary in Nikko have any medicine?')],
    [S_('merchant', '（寫著）發燒的藥？有。這帖給孩子，不用錢。', '(writing) Fever medicine? Yes. This dose is for the child — no charge.'), S_('merchant', '（寫著）鐘響之後，我學到一件事：聽不到別人說話，就更要看別人的臉。', '(writing) Since the bells rang, I\'ve learned one thing: when you can\'t hear people, you have to watch their faces all the more.')], 3000, 'remedy', { n: 3 }),
  J('bargletter', 'crumbleton', 'r_frostvale', after, ['巴爾格的信', 'Barg\'s Letter'],
    [S_('barg', '霜石鎮……的敲鐘人。聖詠院用我的晶石之心，找到了很多星靈。其中一隻，就是被你們藏在礦坑裡的那位。', 'The bell-ringer… of Frostvale. The Choir used my crystal heart to find many Astrals. One of them was the one you hid in your mine.'), S_('barg', '我不會寫漂亮的字。幫我送這封道歉信。', 'I can\'t write fine words. Take this apology for me.')],
    [S_('jon', '（寫著）……字真的很醜。可是寫了三遍「對不起」。', '(writing) …The handwriting really is awful. But he wrote "sorry" three times.'), S_('jon', '（寫著）跟他說：鐘裂了，還是會響。人也是。', '(writing) Tell him: a cracked bell still rings. So do people.')], 3500),
  J('vibration', 'sularis', 'crumbleton', (A) => after(A) && A.flag('sularis_up'), ['一根會震動的管子', 'A Pipe That Hums'],
    [S_('timo', '傾城的拳僧在教聽不見的孩子。這根低音管，摸著它就能感覺到聲音的震動。送去給他們！', 'The monk in Crumbleton is teaching children who can\'t hear. Hold this bass pipe and you can feel the shaking of the sound. Take it to them!')],
    [S_('deafkid', '（一個孩子把手貼在管子上。他的眼睛睜得好大）', '(A child lays both hands on the pipe. His eyes go very wide)'), [null, '他第一次「摸」到了聲音。他笑著跺腳，跺了好久好久。', 'For the first time in his life, he touches a sound. He laughs and stamps, on and on and on.']], 3500, 'muscle'),
];
// which world each delivery belongs to: letters still on the road when the world fell silent are lost with it
{ let r = false; for (const j of JOBS) { if (j.id === 'wait1') r = true; j.w = r ? 'r' : 'b'; } }
const here = (A, j) => j.w === (A.S.world === 'r' ? 'r' : 'b');
// ---------------------------------------------------------------- bounties: the beast, where it waits (map, floor), when, reward
const H = (id, foe, map, title, line, when, gil, item) => ({ id, foe, map, title, line, when, gil, item });
export const HUNTS = [
  H('ratking', 'b_ratking', 'mine', ['灰鬚鼠王', 'The Greybeard Rat King'], ['礦坑深處有一隻背上長滿冰晶的大老鼠，把礦工的便當全吃光了。', 'Deep in the mines a huge rat with ice crystals all over its back has eaten every miner\'s lunch.'], before(7), 1500, 'sprintshoes'),
  H('cragqueen', 'b_cragqueen', 'kolan', ['岩窟女王', 'The Crag Queen'], ['克蘭山的洞窟裡，有一隻會把回音吃掉的大蝙蝠。', 'In the caves of Mt. Kolan lives a great bat that eats echoes.'], before(7), 2000, 'bracer'),
  H('rivermaw', 'b_rivermaw', 'ferry', ['濁流之顎', 'Maw of the Muddy Water'], ['沉鐘沼澤的泥水裡，有東西會一口吞下整艘小船。', 'Something in the muddy water of the Drowned Bell marsh swallows whole boats in one gulp.'], before(7), 2500, 'ether'),
  H('tunnelworm', 'b_tunnelworm', 'swtunnel', ['地底饕客', 'The Tunnel Glutton'], ['南風地下道裡，有一條把貨物連箱子一起吃掉的巨蟲。', 'In the Southwind Tunnels there\'s a giant worm that eats cargo, crates and all.'], before(7), 3000, 'hipotion'),
  H('mourner', 'b_mourner', 'ferry', ['啜泣的鐘魂', 'The Weeping Bell-Ghost'], ['沉鐘沼澤裡，有個幽靈每天晚上都在數鐘聲，數到一百就會發狂。', 'In the Drowned Bell marsh a ghost counts bell-strokes every night — and goes mad when it reaches a hundred.'], before(7), 3500, 'whitecape'),
  H('abysseel', 'b_abysseel', 'trench', ['深淵電鰻', 'The Abyssal Eel'], ['海蛇洞窟最深處，有一條會讓整片海發光的電鰻。', 'At the bottom of the Serpent Trench is an eel that lights up the whole sea.'], before(7), 4000, 'earring'),
  H('rooftop', 'b_rooftop', 'raintower', ['屋頂上的影子', 'The Shadow on the Roof'], ['雨城之塔的屋頂上，有一個偷走別人記憶的盜賊。', 'On the roof of Rainhold Tower lurks a thief who steals people\'s memories.'], before(8), 5000, 'safetybit'),
  H('lavahound', 'b_lavahound', 'kolan', ['熔岩獵犬', 'The Lava Hound'], ['克蘭山的地底熱泉裡，有一隻身上流著熔岩的獵犬。', 'In the hot springs deep under Mt. Kolan prowls a hound with lava running through its veins.'], before(7), 7000, 'blackbelt'),
  H('alpha', 'b_alpha', 'valley', ['白花狼王', 'The Alpha of the White Flowers'], ['星靈之谷的白花底下，睡著一隻很老的狼王。', 'Beneath the white flowers of the Astral Valley sleeps a very old wolf-king.'], before(15), 9000, 'crystalorb'),
  H('bonewhale', 'b_bonewhale', 'tomb', ['骨鯨', 'The Bone Whale'], ['雲鯨之墓裡，有一副骨頭還在游泳。', 'In the Whale\'s Graveyard, one skeleton is still swimming.'], after, 12000, 'xpotion'),
  H('dreamblade', 'b_dreamblade', 'dream', ['夢中的劍士', 'The Swordsman in the Dream'], ['霞之國的廢墟裡，有一個只在夢裡出現的劍士，會向醒著的人挑戰。', 'In the ruins of Kasumi, a swordsman who appears only in dreams challenges anyone awake.'], after, 13000, 'genjiglove'),
  H('moltenheart', 'b_moltenheart', 'phoenixcave', ['熔心', 'The Molten Heart'], ['回音洞窟的熔岩裡，有東西在跳動，像一顆心臟。', 'Something in the lava of the Echo Cave beats like a heart.'], after, 14000, 'turbo'),
  H('cantor', 'b_cantor', 'culttower', ['無聲的唱詩班長', 'The Voiceless Cantor'], ['沉默教團之塔裡，有個指揮沒有聲音的合唱團的人。', 'In the Silent Order\'s tower is one who conducts a choir that makes no sound.'], after, 15000, 'goldhairpin'),
  H('rimebeast', 'b_rimebeast', 'icecave', ['千年冰獸', 'The Thousand-Year Rime Beast'], ['冰洞的最深處，有一隻比石像烏瑪還老的野獸。', 'In the deepest part of the Ice Cavern lives a beast older even than Uma the stone guardian.'], after, 15000, 'iceshield'),
  H('mirrorme', 'b_mirrorme', 'wormbelly', ['鏡中的自己', 'The Self in the Mirror'], ['鏡廳裡，有一面鏡子照出的人會走出來。', 'In the Hall of Mirrors there is one mirror whose reflection steps out.'], after, 16000, 'hermesheels'),
  H('crimsonpup', 'b_crimsonpup', 'lair1', ['赤之獸的幼崽', 'Whelp of the Crimson Discord'], ['赤之獸的巢裡，還有一隻小的。不過「小」只是相對的。', 'In the Crimson Discord\'s den there\'s a little one too. "Little" being relative.'], after, 18000, 'flametongue'),
  H('rubblegiant', 'b_rubblegiant', 'lair4', ['崩岩巨人', 'The Rubble Giant'], ['岩之獸的巢附近，有一座會走路的山。', 'Near the Stone Discord\'s den there\'s a mountain that walks.'], after, 20000, 'diamondarmor'),
  H('bonegeneral', 'b_bonegeneral', 'lair6', ['骸骨將軍', 'The Bone General'], ['骸之獸的巢裡，有一具骷髏還在指揮已經不存在的軍隊。', 'In the Bone Discord\'s den a skeleton still commands an army that no longer exists.'], after, 22000, 'heroring'),
  H('goldserpent', 'b_goldserpent', 'lair7', ['金色海蛇', 'The Golden Sea-Serpent'], ['金之獸的巢穴，連著一片金色的海。海裡有一條蛇。', 'The Gold Discord\'s den opens onto a golden sea. In that sea is a serpent.'], after, 24000, 'elixir'),
  H('voideye', 'b_voideye', 'lair8', ['虛空之眼', 'The Eye of the Void'], ['空之獸的巢穴裡，有一隻眼睛一直在看著你。', 'In the Void Discord\'s den, an eye is always watching you.'], after, 26000, 'ribbon'),
];

// ---------------------------------------------------------------- putting them on the maps
const FREE = new Set(['grass', 'path', 'stone', 'snowfield', 'ash', 'metal', 'floor', 'sand']);
export function spot(m, taken) {
  const ok = (x, y) => { const t = TILE[(m.tiles[y] || '')[x]]; return t && FREE.has(t) && WALK.has(t) && !taken.some(([a, b]) => Math.abs(a - x) + Math.abs(b - y) < 2) && !(m.warps || []).some((w) => w.x === x && w.y === y); };
  for (const [x, y] of [[7, 10], [19, 10], [12, 12], [8, 16], [18, 16], [12, 6], [5, 10], [21, 12], [9, 12], [16, 12], [4, 16], [22, 16], [12, 17]]) if (ok(x, y)) { taken.push([x, y]); return [x, y]; }
  for (let y = 4; y < m.h - 2; y++) for (let x = 3; x < m.w - 3; x++) if (ok(x, y)) { taken.push([x, y]); return [x, y]; }
  return [12, 12];
}
const RECIP = { marta: 'woman', timo: 'man', hana: 'girl', sailor2: 'sailor', fog: 'oldman', liesel: 'woman', butler: 'man', gearwick: 'emperor', deserter: 'imperial', warden2: 'imperial', scholar: 'sage', archivist: 'sage', banker: 'merchant', founder: 'man', waiting: 'woman', husband: 'man', katie: 'girl', deafkid: 'child', fighter: 'man', owner: 'man', ringmaster: 'oldwoman', barg: 'man', fox: 'moka', jon: 'oldman', elder: 'oldman', guard: 'guard', villager: 'woman', woman: 'woman', man: 'man', child: 'child', soldier: 'imperial', director: 'man', orwell: 'king', hunter: 'oldman', thief: 'thief', merchant: 'merchant', oldwoman: 'oldwoman', fisher: 'sailor' };
export function side(M, K) {
  const { npc } = K, taken = {};
  const T = (id) => (taken[id] = taken[id] || (M[id].npcs || []).map((n) => [n.x, n.y]));
  // the Courier Guild: a clerk in every town that sends or receives post
  const towns = [...new Set(JOBS.flatMap((j) => [j.from, j.to]))];
  for (const id of towns) {
    const m = M[id]; if (!m) continue;
    const [x, y] = spot(m, T(id));
    m.npcs.push(npc(x, y, 'sailor', (A) => guild(A, id), { guild: true, dir: 'down' }));
  }
  // each delivery's recipient waits in the destination town while the letter is on its way
  for (const j of JOBS) {
    const m = M[j.to]; if (!m) continue;
    const who = j.done.find((l) => l[0])?.[0] || 'man', [x, y] = spot(m, T(j.to));
    m.npcs.push(npc(x, y, RECIP[who] || 'man', async (A) => {
      await A.talk([[null, `（送來了「${A.T(...j.title)}」）`, `(You deliver "${A.T(...j.title)}")`], ...j.done]);
      A.set('job_' + j.id, 2); A.inc('jobs_done');
      if (j.gil) { A.gil(j.gil); await A.talk([[null, `得到了 ${j.gil} 金幣。`, `Received ${j.gil} gil.`]]); }
      if (j.item) await A.item(j.item, j.n || 1);
      if (A.count('jobs_done') === 12) await A.talk([['clerk', '（公會傳來口信）你已經送了十二封信了。公會長想見你。', '(Word from the Guild) You\'ve delivered twelve letters. The Guildmaster would like to see you.']]);
    }, { job: j.id, when: (A) => A.count('job_' + j.id) === 1 && here(A, j) }));
  }
  // bounty boards in the taverns of both worlds
  for (const id of ['southwind', 'rainhold', 'vexhold', 'tidewatch', 'nikko', 'colosseum']) {
    const m = M[id]; if (!m) continue;
    const [x, y] = spot(m, T(id));
    m.npcs.push(npc(x, y, 'thief', (A) => bounty(A), { bounty: true, dir: 'down' }));
  }
  // and the marks themselves, lying in wait half way across a floor they have already crossed
  for (const h of HUNTS) {
    const m = M[h.map]; if (!m) continue;
    const [mx, my] = m.anchor.mid;
    m.triggers.push(K.trig(mx - 1, my - 1, 3, 3, async (A) => {
      await A.talk([[null, `「${A.T(...h.title)}」出現了！`, `${A.T(...h.title)} appears!`]]);
      const r = await A.battle([h.foe], { boss: true, bg: m.bg, canLose: true });
      if (r !== 'win') { A.heal(); return A.talk([[null, '……撤退了。準備好再來吧。（賞金還在榜上）', '…You fall back. Come again when you\'re ready. (The bounty stays posted.)']]); }
      A.set('hunt_' + h.id, 2); A.inc('hunts_done'); A.gil(h.gil);
      await A.talk([[null, `打倒了「${A.T(...h.title)}」！賞金 ${h.gil} 金幣。`, `${A.T(...h.title)} is down! Bounty: ${h.gil} gil.`]]);
      if (h.item) await A.item(h.item);
    }, { once: false, when: (A) => A.count('hunt_' + h.id) === 1, hunt: h.id }));
  }
}
async function guild(A, town) {
  const open = JOBS.filter((j) => j.from === town && !A.flag('job_' + j.id) && j.when(A) && here(A, j));
  const carrying = JOBS.filter((j) => A.count('job_' + j.id) === 1 && here(A, j));
  await A.talk([['clerk', `這裡是信使公會。目前有 ${open.length} 件委託。（已經送達 ${A.count('jobs_done')} 件）`, `Courier Guild. ${open.length} request(s) waiting here. (Delivered so far: ${A.count('jobs_done')})`]]);
  if (carrying.length) await A.talk([['clerk', `你身上還有：${carrying.map((j) => `${A.T(...j.title)}（送到${A.T(...placeName(j.to))}）`).join('、')}`, `You're carrying: ${carrying.map((j) => `${A.T(...j.title)} (to ${A.T(...placeName(j.to))})`).join(', ')}`]]);
  if (!open.length) return;
  const i = await A.menu([...open.map((j) => `${A.T(...j.title)} → ${A.T(...placeName(j.to))}`), A.T('不用了', 'Not now')], { x: 14, y: 60, w: 228, title: A.T('要接哪一件？', 'Which one will you take?') });
  if (i < 0 || i >= open.length) return;
  if (carrying.length >= 4) return A.talk([['clerk', '你已經帶著四封信了。先送掉一些吧。', 'You\'re already carrying four. Deliver some first.']]);
  const j = open[i];
  await A.talk([...j.ask, ['clerk', `收件地點：${A.T(...placeName(j.to))}。路上小心。`, `Destination: ${A.T(...placeName(j.to))}. Safe travels.`]]);
  A.set('job_' + j.id, 1);
}
async function bounty(A) {
  const open = HUNTS.filter((h) => !A.flag('hunt_' + h.id) && h.when(A)), active = HUNTS.filter((h) => A.count('hunt_' + h.id) === 1);
  await A.talk([['hunter2', `賞金榜上貼著 ${open.length} 張新的告示。（已經討伐 ${A.count('hunts_done')} 隻）`, `${open.length} new notice(s) on the bounty board. (Hunted so far: ${A.count('hunts_done')})`]]);
  if (active.length) await A.talk([['hunter2', `接下的委託：${active.map((h) => `${A.T(...h.title)}（${A.T(...placeName(h.map))}）`).join('、')}`, `Taken: ${active.map((h) => `${A.T(...h.title)} (${A.T(...placeName(h.map))})`).join(', ')}`]]);
  if (!open.length) return;
  const i = await A.menu([...open.map((h) => `${A.T(...h.title)}　${h.gil}G`), A.T('不用了', 'Not now')], { x: 14, y: 60, w: 228, title: A.T('要接哪一張？', 'Which notice will you take?') });
  if (i < 0 || i >= open.length) return;
  const h = open[i];
  await A.talk([['hunter2', ...h.line], ['hunter2', `地點：${A.T(...placeName(h.map))}。牠會在迷宮的半路上等你。`, `Where: ${A.T(...placeName(h.map))}. It waits half way through.`]]);
  A.set('hunt_' + h.id, 1);
}
let NAMES = {};
export function setPlaceNames(M) { for (const [id, m] of Object.entries(M)) if (m.name) NAMES[id] = m.name; }
const placeName = (id) => NAMES[id] || [id, id];
