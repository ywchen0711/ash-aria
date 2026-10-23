// ASH ARIA — Act IV episodes: one story for each companion, in a place of their own (three floors, a moment half way,
// a guardian at the end and the weapon only they can carry); and the Ashtide Abyss, ten floors down beneath Tidewatch.
import { spot } from './side.js?v=5';

const L = (sp, zh, en) => [sp, zh, en];
// id, who, town, giver look, giver speaker, title, hint (they are missing), offer, start, mid, before the guardian, guardian, after, reward
const EP = [
  { id: 'rowan', who: 'rowan', town: 'tidewatch', look: 'merchant', sp: 'clerk', when: (A) => A.count('jobs_done') >= 12, title: ['最後的灰路', 'The Last Ash Road'],
    hint: ['公會長只見送過十二封信以上的信使。', 'The Guildmaster only meets couriers who have delivered at least twelve letters.'],
    offer: [L('clerk', '公會長要我交給你一個包裹。收件人寫著：「給走完灰路的人」。', 'The Guildmaster asked me to give you a parcel. It\'s addressed: "To whoever walks the Ash Road to its end."'), L('rowan', '灰路的盡頭……是瑟恩等我的那個路口。', 'The end of the Ash Road… the crossroads where Seren waited for me.'), L('clerk', '寄件人的名字被灰潮吃掉了。只剩下一個字：「洛」。', 'The Ashtide has eaten the sender\'s name. Only one character is left: "Ro—".')],
    start: [L('rowan', '灰路……我十五歲第一次走這條路的時候，腳一直在抖。', 'The Ash Road… the first time I walked it, at fifteen, my legs wouldn\'t stop shaking.'), L('rowan', '我爸也是信使。他在這條路上失蹤的時候，我五歲。', 'My father was a courier too. He vanished on this road when I was five.')],
    mid: [[null, '路邊的灰裡，插著一根褪色的信使旗。旗桿上刻著一行字。', 'In the ash at the roadside stands a faded courier\'s flag. A line is carved into the pole.'], [null, '「給我的兒子洛恩：信使不是不會害怕的人，是怕了還繼續走的人。」', '"For my son Rowan: a courier isn\'t someone who isn\'t afraid. It\'s someone who\'s afraid and keeps walking."'], L('rowan', '……爸。', '…Dad.')],
    pre: [[null, '路的盡頭，站著一個提燈的影子。它的背上，背著一袋送不出去的信。', 'At the end of the road stands a shadow with a lantern. On its back is a sack of letters that were never delivered.'], L('rowan', '你就是那些沒送到的信，變成的東西吧。', 'You\'re what all the undelivered letters turned into, aren\'t you.')],
    foe: 'e_roadkeeper',
    after: [[null, '影子散成了無數張信紙，像雪一樣落下。每一張，都飛向了某個方向。', 'The shadow scatters into countless sheets of letter-paper, falling like snow. Each one flies off in some direction.'], L('rowan', '……全部送出去了。', '…All delivered.'), [null, '包裹裡，是一把舊的信使短刀。刀柄上刻著：「送達」。', 'In the parcel is an old courier\'s knife. On the hilt is carved one word: "Delivered".'], L('rowan', '爸，你的最後一件，我收到了。', 'Dad. Your last delivery — I got it.')],
    reward: 'delivered' },
  { id: 'edmund', who: 'edmund', town: 'nikko', look: 'man', sp: 'butler', title: ['齒輪伯爵的地下工坊', 'Gearwick\'s Underground Workshop'],
    hint: ['（管家在找一位「伯爵大人的老對手」。）', '(The butler is looking for "His Lordship\'s old rival".)'],
    offer: [L('butler', '艾德蒙大人！伯爵大人從鐘樓掉下來之後，在尼可鎮的地下蓋了一座工坊。', 'Master Edmund! After His Lordship fell from the belfry, he built a workshop beneath Nikko.'), L('butler', '他說要做一台「讓掌聲看得見的機器」。三天前，機器失控了，伯爵大人被困在裡面……', 'He said he would build "a machine that lets you see applause". Three days ago it went out of control, and His Lordship is trapped inside…'), L('edmund', '……那個笨蛋。走吧。', '…The idiot. Let\'s go.')],
    start: [L('edmund', '到處都是燈泡。……我懂了，他想讓聲音變成光。在沒有聲音的世界裡，掌聲就是光。', 'Light bulbs everywhere. …I see. He wants to turn sound into light. In a world without sound, applause becomes light.'), L('edmund', '這個想法……其實很好。', 'That idea… is actually rather good.')],
    mid: [[null, '牆上貼著一張發黃的獎狀：「發明大賽　第二名　吉爾維克」。旁邊用紅筆寫著：「明年一定要贏艾德蒙」。', 'A yellowed certificate is pinned to the wall: "Inventors\' Fair — Second Place — Gearwick." Beside it, in red ink: "Beat Edmund next year."'], L('edmund', '……他把它留了二十年。', '…He\'s kept it for twenty years.')],
    pre: [L('gearwick', '艾、艾德蒙！別過來！三號機「掌聲」只要感覺到有人在，就會開始「表演」！', 'E-Edmund! Stay back! Mk III "Applause" starts "performing" the moment it senses anyone!'), L('edmund', '那就讓它表演給我們看。看完了，我們再鼓掌。', 'Then let it perform for us. When it\'s done, we\'ll applaud.')],
    foe: 'e_gearmk3',
    after: [L('gearwick', '我的三號機……', 'My Mk III…'), L('edmund', '吉爾維克，你的光，風琴城用得上。共鳴爐把聲音放大，你的機器把聲音變成光——聽不見的人，就看得見了。', 'Gearwick, Sularis could use your light. My furnace makes sound louder; your machine turns it into light. Those who can\'t hear could see it.'), L('gearwick', '……你、你是在邀請我嗎？我才不要跟你合作！……什麼時候開始？', '…A-are you inviting me? I\'d never work with you! …When do we start?'), L('gearwick', '這把長槍給你。本來是要在發明大賽上打敗你用的。', 'Take this lance. I built it to beat you at the inventors\' fair.')],
    reward: 'resonancelance' },
  { id: 'sai', who: 'sai', town: 'crumbleton', look: 'man', sp: 'barg', title: ['回音寺的深處', 'The Depths of the Echo Temple'],
    hint: ['巴爾格在等他的師弟。', 'Barg is waiting for his little brother.'],
    offer: [L('barg', '師弟。回音寺的地底，有師父留下的最後一個回音。', 'Little brother. Deep beneath the Echo Temple, the Master left one last echo.'), L('barg', '我胸口的星靈說，只有聽得見寂靜的人，才能走到那裡。……我們一起去。', 'The Astral in my chest says only someone who can hear silence can reach it. …We go together.')],
    start: [L('sai', '這裡的回音……全都是拳聲。一千年來，每一個在這裡修行的人留下的拳聲。', 'The echoes here… they\'re all fist-strikes. A thousand years of everyone who trained here.'), L('barg', '我聽得見。真的聽得見。……師父的拳聲，在最底下。', 'I can hear them. I really can. …The Master\'s is at the very bottom.')],
    mid: [L('barg', '師弟。那天我裝上晶石之心，不是因為想變強。', 'Little brother. The day I put in the crystal heart, it wasn\'t because I wanted strength.'), L('barg', '是因為師父說我「聽不見」。我很怕，怕自己一輩子都聽不見。', 'It was because the Master said I "couldn\'t hear". I was so afraid I never would.'), L('sai', '……現在呢？', '…And now?'), L('barg', '現在世界安靜了，我才發現，我一直都聽得見。只是太吵了。', 'Now the world\'s gone quiet, I realise I could always hear. It was just too loud.')],
    pre: [[null, '最深處，一個老人的影子在打拳。一拳，一拳，像心跳。', 'In the deepest hall, the shadow of an old man is striking the air. One blow, then another, like a heartbeat.'], L('sai', '師父……！', 'Master…!'), [null, '影子轉過身，擺出了架式。', 'The shadow turns, and takes up a stance.']],
    foe: 'e_master',
    after: [[null, '影子收起了拳，對兩個人點了點頭。然後，它把拳頭輕輕貼在賽伊的胸口。', 'The shadow lowers its fists and nods to them both. Then it lays one fist gently against Sai\'s chest.'], L('sai', '……「拳不是用來打人的，是用來聽的。」', '…"A fist is not for striking people. It is for listening."'), L('barg', '師父最後的回音……給你了。', 'The Master\'s last echo… is yours now.')],
    reward: 'masterfist' },
  { id: 'kiriyu', who: 'kiriyu', town: 'nikko', look: 'man', sp: 'man', title: ['霞鳴之祠', 'The Shrine of Kasumei'],
    hint: ['（一個年輕的刀匠在找桐生師父。）', '(A young smith is looking for Master Kiriyu.)'],
    offer: [L('man', '師父！霞之國的祠堂深處，霞鳴大人的歌……還有一點點沒被吸乾。可是祠堂被灰色的東西佔據了。', 'Master! Deep in the Kasumi shrine, a little of Lady Kasumei\'s song is still left undrained. But something grey has taken the shrine.'), L('kiriyu', '……霞鳴的歌回來，美奈就會醒。帶路吧。', '…If Kasumei\'s song returns, Mina will wake. Lead the way.')],
    start: [L('kiriyu', '老頭子的眼睛，已經看不見了。可是祠堂的路，我閉著眼睛也走得到。', 'These old eyes see nothing now. But I could walk the shrine path with my eyes closed.'), L('kiriyu', '……呵，本來就閉著了。', '…Heh. They are closed.')],
    mid: [[null, '一棵枯掉的櫻花樹。樹下，放著一雙小小的木屐。', 'A withered cherry tree. Beneath it lies a pair of small wooden sandals.'], L('kiriyu', '……這是廉的。他小時候，總是在這裡等我下工。', '…These are Ren\'s. When he was little, he always waited here for me to finish work.'), L('kiriyu', '我那時候老是說「等一下」。等一下，等一下……一等就是一輩子。', 'I always said "in a minute". In a minute, in a minute… and a lifetime went by.')],
    pre: [[null, '祠堂的中央，一個由灰霧纏住的星靈，在痛苦地唱著斷斷續續的歌。', 'At the heart of the shrine, an Astral bound in grey mist sings a broken, painful song.'], L('kiriyu', '霞鳴大人。老頭子來替妳斬斷這些霧了。', 'Lady Kasumei. This old man has come to cut away the mist.')],
    foe: 'e_kasumei',
    after: [[null, '灰霧散去。霞鳴的歌，第一次完整地響起——那是一首關於春天的歌。', 'The grey mist clears. For the first time, Kasumei\'s song rings out whole — a song about spring.'], [null, '遠方，霞之國的方向，枯掉的櫻花樹冒出了一顆花苞。', 'Far off, toward Kasumi, a bud appears on the withered cherry tree.'], L('kiriyu', '（霞鳴的聲音）……刀匠。這把刀，帶著我的歌走吧。等世界的聲音回來，你的妻子會在花下等你。', '(Kasumei\'s voice) …Swordsmith. Carry my song in this blade. When the world\'s sound returns, your wife will be waiting for you beneath the blossom.')],
    reward: 'kasumeiblade' },
  { id: 'galan', who: 'galan', town: 'r_wildhut', look: 'oldwoman', sp: 'ringmaster', title: ['灰色的帳篷', 'The Grey Big Top'],
    hint: ['團長奶奶在等那個吹哨子的男孩。', 'The old ringmaster is waiting for the boy with the whistle.'],
    offer: [L('ringmaster', '（她寫）荒原的東邊，灰潮裡有一頂灰色的帳篷。我記得……那是我的。', '(She writes) East of the Wildlands, in the Ashtide, there is a grey big top. I remember… it was mine.'), L('galan', '我們的馬戲團！奶奶，我去把大家帶回來！', 'Our circus! Grandma, I\'ll go and bring everyone back!')],
    start: [L('galan', '帳篷裡面……什麼都是灰色的。鞦韆、球、小丑的鼻子。', 'Inside the tent… everything\'s grey. The trapeze, the balls, the clown\'s nose.'), L('galan', '可是我聞得到。爆米花的味道。……大家還在這裡。', 'But I can smell it. Popcorn. …Everyone\'s still here.')],
    mid: [[null, '灰色的觀眾席上，坐著一排灰色的動物。大象、猴子、熊。牠們一動也不動。', 'In the grey stands sits a row of grey animals. An elephant, monkeys, a bear. Not one of them moves.'], L('galan', '嗶——！', 'Phweeet—!'), [null, '哨音響起的瞬間，大象的耳朵，輕輕動了一下。', 'The instant the whistle sounds, the elephant\'s ear twitches, just slightly.'], L('galan', '大家都聽得見！牠們只是忘了怎麼動！', 'They can all hear it! They\'ve just forgotten how to move!')],
    pre: [[null, '舞台中央，一隻灰色的獅子守著一個空空的鐵籠。', 'At the centre of the ring, a grey lion guards an empty iron cage.'], L('galan', '雷歐……你是雷歐吧？你以前最喜歡跳火圈了。', 'Leo… you\'re Leo, aren\'t you? You used to love jumping through the ring of fire.')],
    foe: 'e_lion',
    after: [L('galan', '雷歐，回家了。', 'Leo. Time to come home.'), [null, '嘉藍吹了開場的哨音。灰色的帳篷，一塊一塊地，恢復了紅色和黃色。', 'Galan blows the opening whistle. Piece by piece, the grey big top turns red and yellow again.'], [null, '動物們從觀眾席上站了起來，一隻一隻跟在獅子的後面，走出了帳篷。', 'The animals rise from the stands and, one by one, follow the lion out of the tent.'], L('galan', '奶奶看到一定會很高興！……這個哨子，是奶奶以前用的。她說要給我。', 'Grandma will be so happy! …This whistle was the one she used to use. She said I should have it.')],
    reward: 'ringwhistle' },
  { id: 'selene', who: 'selene', town: 'tidewatch', look: 'man', sp: 'man', title: ['沉默的燈塔', 'The Silent Lighthouse'],
    hint: ['（漁夫們在等一個守鐘騎士。）', '(The fishermen are waiting for a Bell Warden.)'],
    offer: [L('man', '（手語）南風鎮的燈塔，還站在海上。可是燈滅了，鐘也不響。晚上的船，一艘一艘撞上礁石。', '(signing) The Southwind lighthouse is still standing out at sea. But the light\'s gone out and the bell is silent. Ship after ship strikes the rocks at night.'), L('selene', '……那是我的燈塔。我去點燈。', '…That\'s my lighthouse. I\'ll light it.')],
    start: [L('selene', '燈塔的樓梯，一共三百二十一階。我小時候每天數一遍。', 'The lighthouse stair has three hundred and twenty-one steps. I counted them every day as a child.'), L('selene', '那時候，鐘裡的星靈會在我數到一百的時候，輕輕響一聲。像在說「加油」。', 'Back then, the Astral in the bell would ring softly when I reached a hundred. As if to say "keep going".')],
    mid: [[null, '第一百階。牆上，刻著一個小孩的字：「瑟琳娜，七歲」。', 'Step one hundred. On the wall, in a child\'s carving: "Selene, age seven."'], L('selene', '……我以為守鐘，就是守住規則。', '…I thought guarding the bell meant guarding the rules.'), L('selene', '可是鐘不是規則。鐘是叫人回家的聲音。', 'But a bell isn\'t a rule. A bell is the sound that calls people home.')],
    pre: [[null, '塔頂。鐘還掛在那裡，可是它被灰色的鏽包住了，像一個在睡覺的人。', 'The top of the tower. The bell still hangs there, but it\'s wrapped in grey rust, like someone sleeping.'], L('selene', '醒醒。今天，換我叫你。', 'Wake up. Today, it\'s my turn to call you.')],
    foe: 'e_beaconbell',
    after: [[null, '鏽掉落了。瑟琳娜握住鐘繩，用力一拉——', 'The rust falls away. Selene takes the bell rope and pulls with all her strength—'], [null, '沒有聲音。可是燈塔的燈，亮了。一道光，掃過整片黑色的海。', 'There is no sound. But the lighthouse lamp blazes. A beam of light sweeps across the whole black sea.'], L('selene', '……聽不見也沒關係。看得見，就能回家。', '…It doesn\'t matter if they can\'t hear it. If they can see it, they can find their way home.'), [null, '鐘的下面，掛著一把劍。劍柄上刻著燈塔的形狀。', 'Hanging beneath the bell is a sword, its hilt carved in the shape of a lighthouse.']],
    reward: 'beacon' },
  { id: 'regis', who: 'regis', town: 'colosseum', look: 'oldman', sp: 'oldman', title: ['雲之巢', 'The Cloud Nest'],
    hint: ['（一個老牧人說，他只跟雲鯨的牧人說話。）', '(An old herder says he\'ll only speak to a cloud-whale herder.)'],
    offer: [L('oldman', '雷吉斯？你還活著啊。……聽著，寧波斯醒了以後，天上出現了一個「雲之巢」。', 'Regis? Still alive, then. …Listen. Since Nimbus woke, a "cloud nest" has appeared in the sky.'), L('oldman', '那是雲鯨生孩子的地方。可是巢的上面，有一團不肯散的風暴。', 'It\'s where cloud whales give birth. But above the nest is a storm that won\'t break.'), L('regis', '……寧波斯要當媽媽了？', '…Nimbus is going to be a mother?')],
    start: [L('regis', '我當了三十年的牧人，從來沒看過雲之巢。傳說只有被雲鯨信任的人，才找得到。', 'Thirty years a herder and I never once saw a cloud nest. Legend says only those the whales trust can find one.'), L('regis', '……寧波斯，謝謝妳帶我來。', '…Nimbus. Thank you for bringing me.')],
    mid: [[null, '雲的縫隙裡，有一顆小小的、發著光的蛋。寧波斯低下頭，輕輕碰了碰雷吉斯的手。', 'In a gap in the clouds lies a small, glowing egg. Nimbus lowers her head and gently nudges Regis\'s hand.'], L('regis', '我退休的那天，她在天上叫了一整晚。我以為她在生氣。', 'The day I retired, she called all night across the sky. I thought she was angry.'), L('regis', '……原來她是在說「不要走」。', '…She was saying "don\'t go".')],
    pre: [[null, '巢的上方，一團漆黑的風暴睜開了眼睛。', 'Above the nest, a pitch-black storm opens its eyes.'], L('regis', '天候輪轉起來吧。今天的天氣——晴天！', 'Spin, Weather Wheel. Today\'s forecast: clear skies!')],
    foe: 'e_stormcalf',
    after: [[null, '風暴散開了。陽光照進雲之巢，蛋裂開了一條縫。', 'The storm breaks. Sunlight pours into the cloud nest, and the egg cracks open.'], [null, '一隻小小的雲鯨，搖搖晃晃地游了出來，在雷吉斯的頭上繞了一圈。', 'A tiny cloud whale wobbles out and swims one circle round Regis\'s head.'], L('regis', '……哈。歡迎來到這個世界，小傢伙。雖然現在有點安靜。', '…Ha. Welcome to the world, little one. It\'s a bit quiet at the moment.'), [null, '寧波斯吐出了一片發光的雲，在雷吉斯的手裡變成了一副牌。', 'Nimbus breathes out a glowing cloud, and in Regis\'s hand it becomes a deck of cards.']],
    reward: 'nimbuscloud' },
  { id: 'nightcrow', who: 'nightcrow', town: 'colosseum', look: 'man', sp: 'bookie', title: ['總管的密室', 'The Overseer\'s Vault'],
    hint: ['莊家說，有一個情報只賣給戴面具的人。', 'The bookie says there\'s a piece of information he\'ll only sell to someone in a mask.'],
    offer: [L('bookie', '（寫著）熔晶所的總管在鐘樓睡著了。可是他的密室還在——裡面有一本「賣進熔晶所的孩子」的名冊。', '(writing) The Foundry\'s overseer fell asleep on the belfry. But his vault is still there — and in it, a register of "children sold to the Foundry".'), L('nightcrow', '……我弟弟的名字，在那裡面。', '…My brother\'s name is in it.')],
    start: [L('nightcrow', '我弟弟被賣掉的時候，八歲。他的嗓子很好——熔晶所說，好嗓子的孩子，可以拿來「調音」。', 'My brother was eight when they sold him. He had a beautiful voice. The Foundry said children with good voices were useful for "tuning".'), L('nightcrow', '我戴上面具，是因為我不想讓任何人看到，我在哭。', 'I wear the mask because I don\'t want anyone to see me cry.')],
    mid: [[null, '一排鐵架上，放著上百個小小的音叉。每一個，都綁著一張寫了名字的紙條。', 'Row upon row of iron shelves hold hundreds of tiny tuning forks. Each one is tied with a slip of paper bearing a name.'], L('nightcrow', '……這些都是孩子的名字。', '…These are all children\'s names.'), [null, '灰羽飛上最高的那一層，叼下了一個音叉。紙條上寫著：「凱」。', 'Greyfeather flies to the top shelf and brings down one tuning fork. The slip says: "Kai".']],
    pre: [[null, '密室的最深處，總管的機甲還在運轉。它在保護那本名冊。', 'In the depths of the vault, the overseer\'s engine is still running. It is guarding the register.'], L('nightcrow', '灰羽，我們上。', 'Greyfeather. With me.')],
    foe: 'e_overseer',
    after: [[null, '名冊的最後一頁寫著：「凱，轉送至希望村孤兒院。狀態：存活」。', 'The last page of the register reads: "Kai. Transferred to the Hopehaven orphanage. Status: alive."'], L('nightcrow', '……希望村。瑟琳娜照顧的那些孩子裡……', '…Hopehaven. Among the children Selene looks after…'), [null, '夜鴉摘下了面具。她在哭，可是她沒有遮住臉。', 'Nightcrow takes off her mask. She is crying, and she does not hide her face.'], [null, '灰羽在她的肩上，把一根自己的羽毛，放進了她的手裡。', 'Perched on her shoulder, Greyfeather places one of its own feathers into her hand.']],
    reward: 'greyfeather' },
  { id: 'lili', who: 'lili', town: 'crumbleton', look: 'sage', sp: 'archivist', title: ['沉沒的書庫', 'The Sunken Archive'],
    hint: ['（一個薩瑪的管理員，在找見習抄寫員。）', '(A Samar archivist is looking for the apprentice scribe.)'],
    offer: [L('archivist', '莉莉！薩瑪的書庫燒掉的那天，地下室沉進了地底。「最初的樂譜」少了最後一頁——那一頁，還在地下室裡。', 'Lili! The day Samar\'s archive burned, its cellar sank into the ground. The First Score is missing its last page — and that page is still down there.'), L('lili', '最後一頁！我抄了五年都不知道結尾是什麼！', 'The last page! Five years I\'ve been copying it, and I never knew how it ends!')],
    start: [L('lili', '書架都泡在水裡……可是書還在！墨水都沒有化開！', 'The shelves are underwater… but the books are still here! The ink hasn\'t even run!'), L('lili', '薩瑪的書，是用會唱歌的墨水寫的。所以它們不怕水。', 'Samar\'s books are written in ink that sings. That\'s why water can\'t hurt them.')],
    mid: [L('lili', '老師以前說，抄書的人不是在抄字，是在抄一個人的心。', 'Teacher always said a scribe isn\'t copying words. She\'s copying someone\'s heart.'), L('lili', '我以前不懂。……現在我好像懂了。寫下最初樂譜的人，一定很喜歡這個世界。', 'I never understood. …I think I do now. Whoever wrote the First Score must have loved this world very much.')],
    pre: [[null, '最深處的書架上，一隻墨黑的野獸，正在一頁一頁地吞書。', 'On the deepest shelf, an ink-black beast is swallowing books page by page.'], L('lili', '不准吃！那是最後一頁！', 'Don\'t you DARE! That\'s the last page!')],
    foe: 'e_pagebeast',
    after: [[null, '墨獸散成了墨水，吞下去的書頁一張張飛回了書架。最後一頁，落在莉莉的手上。', 'The beast dissolves into ink, and the swallowed pages fly back to the shelves. The last page lands in Lili\'s hands.'], L('lili', '……這一頁是空白的。', '…This page is blank.'), L('lili', '只寫了一行小字：「接下來，由聽到這首歌的人來寫。」', 'There\'s only one tiny line: "From here on, it will be written by whoever hears this song."'), L('lili', '……那就是我們！', '…That\'s us!'), [null, '空白頁的旁邊，夾著一支很老的羽毛筆。', 'Tucked beside the blank page is a very old quill.']],
    reward: 'firstquill' },
  { id: 'bolo', who: 'bolo', town: 'tidewatch', look: 'sage', sp: 'scholar', title: ['百獸之庫', 'The Bestiary Vault'],
    hint: ['（一個老學者在找「看一眼就學得會的那個人」。）', '(An old scholar is looking for "the one who learns anything at a glance".)'],
    offer: [L('scholar', '波洛老兄！你五十年前寫的《百獸圖鑑》原稿，藏在潮望鎮海底的圖書庫裡。可是裡面的魔物圖畫……活過來了。', 'Bolo, old friend! The original of your Bestiary from fifty years ago is kept in Tidewatch\'s undersea library. But the monster drawings inside it… have come alive.'), L('bolo', '我年輕時畫得那麼差，活過來也是很醜的魔物吧。呵呵，走吧。', 'I drew so badly when I was young, they\'ll be ugly monsters if they came alive. Ho-ho. Let\'s go.')],
    start: [L('bolo', '這些是我畫的……沒錯，那隻腳畫錯了。那隻顏色也不對。', 'These are my drawings… yes, I got that one\'s legs wrong. And that one\'s colour.'), L('bolo', '可是牠們每一隻，我都是在牠們面前，花了好幾天畫下來的。', 'But every one of them, I drew sitting in front of it for days on end.')],
    mid: [L('bolo', '莉莉問過我，為什麼要研究魔物。', 'Lili once asked me why I study monsters.'), L('bolo', '因為大家都怕的東西，總要有個人去好好地看清楚。看清楚了，就不那麼可怕了。', 'Because someone has to look properly at the things everyone fears. Once you see them clearly, they aren\'t so frightening.'), L('bolo', '……加入沉默教團的那段日子，我怕的是聲音本身。是莉莉讓我又看清楚了。', '…In my days with the Silent Order, what I feared was sound itself. It was Lili who made me see clearly again.')],
    pre: [[null, '圖書庫的中央，一隻由好多張圖畫拼成的合成獸，正在對著波洛咆哮。', 'In the middle of the library, a chimera stitched together from many drawings roars at Bolo.'], L('bolo', '這是我畫的最後一隻……什麼都想畫進去，結果畫成了怪物。', 'This was the last one I drew… I tried to fit everything in, and it turned into a monster.')],
    foe: 'e_chimera',
    after: [L('bolo', '好了，好了。我重新畫你一次。這次，畫得好一點。', 'There, there. I\'ll draw you again. Better this time.'), [null, '合成獸安靜下來，變回了一張紙。紙上的牠，看起來有點開心。', 'The chimera grows quiet and turns back into a sheet of paper. In the drawing, it looks rather happy.'], [null, '原稿的封面裡，夾著一根老舊的手杖。上面刻滿了魔物的名字。', 'Inside the cover of the original is an old walking staff, carved all over with the names of monsters.']],
    reward: 'bestiary' },
  { id: 'moka', who: 'moka', town: 'r_frostvale', look: 'moka', sp: 'fox', title: ['雪狐的試煉', 'The Trial of the Snow Fox'],
    hint: ['雪狐們在等狐巫回來。', 'The snow foxes are waiting for their shrine maiden.'],
    offer: [L('fox', '嗚嗚——♪', 'Awoo-oo♪'), L('moka', '雪狐們說，神社的後山，九尾大人醒了。九尾大人只跟通過試煉的狐巫說話。', 'The foxes say Lady Nine-Tails has woken on the mountain behind the shrine. She only speaks to shrine maidens who pass her trial.'), L('moka', '摩卡……一直都沒有通過。可是這次，一定要！', 'Moka… has never passed. But this time she has to!')],
    start: [L('moka', '試煉很簡單：一直唱歌，唱到山頂。中間不能停。', 'The trial is simple: sing all the way to the top. You mustn\'t stop.'), L('moka', '可是這個世界沒有聲音了……摩卡唱歌，誰聽得到呢？', 'But the world has no sound now… if Moka sings, who will hear?')],
    mid: [L('moka', '……摩卡懂了。', '…Moka understands.'), L('moka', '以前摩卡唱歌，是為了讓九尾大人聽。可是試煉真正要的，是就算沒有人聽，也繼續唱下去。', 'Moka used to sing so Lady Nine-Tails would hear. But what the trial really wants is to keep singing even when no one is listening.'), [null, '摩卡唱了起來。沒有聲音，可是她的尾巴，跟著節奏一下一下地擺。', 'Moka begins to sing. There\'s no sound, but her tail sways in time, beat after beat.']],
    pre: [[null, '山頂。一隻巨大的、有九條尾巴的雪狐，靜靜地看著摩卡。', 'The summit. A vast snow fox with nine tails watches Moka in silence.'], L('moka', '九尾大人！摩卡唱到山頂了！', 'Lady Nine-Tails! Moka sang all the way to the top!'), [null, '九尾的眼睛亮了起來。牠要看的，是摩卡的力量。', 'The Nine-Tails\' eyes kindle. Now she wants to see Moka\'s strength.']],
    foe: 'e_foxgod',
    after: [[null, '九尾低下頭，用鼻子碰了碰摩卡的額頭。', 'The Nine-Tails bows her head and touches Moka\'s brow with her nose.'], L('moka', '……九尾大人說，摩卡合格了。她說，摩卡的歌，她一直都聽得見。', '…Lady Nine-Tails says Moka has passed. She says she could always hear Moka\'s songs.'), [null, '九尾的一條尾巴化成了火，落在摩卡的手上，變成了一把長槍。', 'One of the Nine-Tails\' tails turns to flame, falls into Moka\'s hands, and becomes a spear.']],
    reward: 'foxfire' },
  { id: 'uma', who: 'uma', town: 'r_frostvale', look: 'oldman', sp: 'jon', title: ['山之心', 'The Heart of the Mountain'],
    hint: ['（約恩說，他有話要對石像說。）', '(Jon says he has something to tell the stone guardian.)'],
    offer: [L('jon', '（寫著）烏瑪。你守護瓦里昂一千年了。你知道是誰造了你嗎？', '(writing) Uma. You\'ve guarded Valion for a thousand years. Do you know who made you?'), L('uma', '……轟？', '…Boom?'), L('jon', '（寫著）礦坑最深處的熔岩後面，有一座更老的石像。那是第一個守護者。他在等你。', '(writing) Behind the lava at the very bottom of the mine is an older statue still. The first guardian. He has been waiting for you.')],
    start: [L('moka', '（摩卡跟來了）烏瑪說，牠想起來了。一千年前，牠是被一首歌叫醒的——就是艾莉雅的那首歌。', '(Moka has come along) Uma says it remembers now. A thousand years ago, it was woken by a song — that same song of Aria\'s.'), L('uma', '轟。', 'Boom.')],
    mid: [[null, '熔岩的光照在牆上。牆上刻滿了石像的畫：一個、兩個、十個……每一個都在守護著什麼。', 'Lava-light plays across the walls. They\'re carved with statues — one, two, ten… each guarding something.'], [null, '烏瑪伸出石頭手指，摸了摸最後一幅畫。那是一尊小小的石像，站在一隻冰封的星靈前面。', 'Uma reaches out a stone finger and touches the last carving: a small statue standing before a frozen Astral.'], L('uma', '……轟。（牠的聲音，好像在笑。）', '…Boom. (It sounds almost as if it\'s laughing.)')],
    pre: [[null, '山的中心。一尊巨大的石像睜開了眼睛。它要看看，這個晚輩夠不夠格繼承守護的名字。', 'The heart of the mountain. A colossal statue opens its eyes. It wants to see whether this younger one is worthy of the name of guardian.']],
    foe: 'e_firstgolem',
    after: [[null, '最初的守護者跪了下來，從胸口取出了一塊發光的石頭，放在烏瑪的手裡。', 'The First Guardian kneels, takes a glowing stone from its chest, and places it in Uma\'s hand.'], [null, '然後，它慢慢地變回了山壁。', 'Then, slowly, it becomes part of the mountain again.'], L('uma', '……', '…'), L('moka', '烏瑪說：「我會守護大家，像它守護我一樣。」', 'Uma says: "I will guard everyone, the way it guarded me."')],
    reward: 'millheart' },
  { id: 'kagami', who: 'kagami', town: 'hopehaven', look: 'girl', sp: 'katie', title: ['鏡子的盡頭', 'The Mirror\'s End'],
    hint: ['（凱蒂在找一個「長得像每一個人的人」。）', '(Katie is looking for "the person who looks like everyone".)'],
    offer: [L('katie', '（手語）鏡哥哥！村子外面的湖，結冰以後變成了一面好大的鏡子。我在裡面看到一個人——他長得跟你一模一樣，可是是他自己的樣子。', '(signing) Kagami! The lake outside the village froze into a huge mirror. I saw someone in it — someone who looked exactly like you, but in his own way.'), L('kagami', '……我自己的樣子？', '…My own way?')],
    start: [L('kagami', '這裡的每一面鏡子，都照出一個我。可是每一個我，都在模仿別人。', 'Every mirror here shows a me. But every me is copying someone else.'), L('kagami', '洛恩的走路方式。瑟琳娜握劍的手。嘉藍的笑。……我是用大家拼起來的。', 'Rowan\'s walk. The way Selene grips her sword. Galan\'s laugh. …I\'m made of everyone, pieced together.')],
    mid: [L('kagami', '以前我覺得，沒有自己的樣子很可怕。', 'I used to think it was frightening, not having a shape of my own.'), L('kagami', '可是……如果我是用大家拼起來的，那我走到哪裡，大家就跟到哪裡。', 'But… if I\'m made of everyone, then wherever I go, everyone comes with me.'), L('kagami', '……這樣，好像也不錯。', '…That doesn\'t seem so bad.')],
    pre: [[null, '湖的中央，一個由無數鏡片組成的女王，舉起了手。所有的鏡子，都對準了鏡。', 'At the centre of the lake, a queen made of countless shards of mirror raises her hand. Every mirror turns toward Kagami.'], [null, '「你沒有自己的臉。留在這裡，成為我的一部分吧。」', '"You have no face of your own. Stay here, and become part of me."'], L('kagami', '我有。我的臉，是大家的臉。', 'I do. My face is everyone\'s face.')],
    foe: 'e_mirrorqueen',
    after: [[null, '女王碎成了光。湖面上，倒映出一個人——不是在模仿誰，只是站在那裡，微微地笑著。', 'The queen shatters into light. On the lake\'s surface stands a reflection — not copying anyone, simply standing there, smiling slightly.'], L('kagami', '……那是我？', '…Is that me?'), L('katie', '（手語）是你！你笑的時候，右邊的嘴角會先翹起來。那是只有你才會的！', '(signing) It\'s you! When you smile, the right corner of your mouth goes up first. Only you do that!'), [null, '湖面上的倒影，把一件衣服遞了出來。', 'The reflection on the lake holds out a garment.']],
    reward: 'ownface' },
];

export function episodes(M, K) {
  const { npc, trig } = K, taken = {};
  const T = (id) => (taken[id] = taken[id] || (M[id].npcs || []).map((n) => [n.x, n.y]));
  for (const e of EP) {
    const key = 'ep_' + e.id, base = M[key];
    if (!base || !M[e.town]) continue;
    const [x, y] = spot(M[e.town], T(e.town));
    M[e.town].npcs.push(npc(x, y, e.look, async (A) => {
      if (A.flag(key)) return A.talk([[e.sp, '（謝謝你們。）', '(Thank you.)']]);
      if (!A.hasMember(e.who) || (e.when && !e.when(A))) return A.talk([[e.sp, ...e.hint]]);
      await A.talk(e.offer);
      const i = await A.ask(`要前往「${A.T(...e.title)}」嗎？`, `Set out for "${A.T(...e.title)}"?`, [['出發', 'Go'], ['之後再說', 'Later']]);
      if (i !== 0) return;
      await A.pickParty(4, [e.who]);
      A.warp(key, ...base.anchor.start, 'down');
    }, { episode: e.id, when: (A) => A.flag('goldwing') }));
    base.triggers.push(trig(base.anchor.start[0] - 2, base.anchor.start[1] - 2, 5, 5, async (A) => { await A.talk(e.start); }, { when: (A) => !A.flag(key) }));
    const m2 = M[key + '_2'], [mx, my] = m2.anchor.mid;
    m2.triggers.push(trig(mx - 1, my - 1, 3, 3, async (A) => { await A.talk(e.mid); }, { when: (A) => !A.flag(key) }));
    const m3 = M[key + '_3'];
    m3.triggers.push(trig(...K.endRoom(m3), async (A) => {
      await A.talk(e.pre);
      await A.battle([e.foe], { boss: true, bg: m3.bg });
      await A.talk(e.after);
      await A.item(e.reward);
      A.set(key); A.inc('episodes');
    }, { when: (A) => !A.flag(key) }));
  }
  // the Ashtide Abyss: ten floors down beneath Tidewatch, for those who found all eight notes
  const tw = M.tidewatch, deep = M.ashdeep;
  if (tw && deep) {
    const [x, y] = spot(tw, T('tidewatch'));
    tw.npcs.push(npc(x, y, 'oldman', async (A) => {
      if (A.flag('abyss_done')) return A.talk([['oldman', '（寫著）深淵安靜下來了。灰潮……好像退了一點。', '(writing) The abyss has gone quiet. The Ashtide… seems to have drawn back a little.']]);
      if (A.count('dragons') < 8) return A.talk([['oldman', '（寫著）港口底下有一道裂縫，一直通到灰潮的最深處。只有找回全部八個音的人，才走得下去。', '(writing) Beneath the harbour is a crack that runs all the way down to the bottom of the Ashtide. Only those who have found all eight notes can walk it.']]);
      await A.talk([['oldman', '（寫著）八個音……你們找齊了。下面是灰潮的源頭，「灰潮之母」住的地方。要去嗎？', '(writing) All eight notes… you found them. Down there is the source of the Ashtide, where the Mother of the Ashtide dwells. Will you go?']]);
      const i = await A.ask('要下到灰潮深淵嗎？（十層）', 'Descend into the Ashtide Abyss? (ten floors)', [['下去', 'Descend'], ['之後再說', 'Later']]);
      if (i !== 0) return;
      await A.pickParty(4);
      A.warp('ashdeep', ...deep.anchor.start, 'down');
    }, { abyss: true, when: (A) => A.flag('goldwing') }));
    const m5 = M.ashdeep_5;
    m5.triggers.push(trig(...K.endRoom(m5), async (A) => {
      await A.talk([[null, '第五層。一尊巨大的石像擋住了往下的路。它的臉，是一口沒有舌頭的鐘。', 'The fifth floor. A colossal statue bars the way down. Its face is a bell with no clapper.']]);
      await A.battle(['x_warden'], { boss: true, bg: 'tower', music: 'boss' });
      A.set('abyss_warden');
    }, { when: (A) => !A.flag('abyss_warden') }));
    const m10 = M.ashdeep_10;
    m10.triggers.push(trig(...K.endRoom(m10), async (A) => {
      await A.talk([
        [null, '深淵的最底部。灰色的霧，從一個巨大的、像搖籃一樣的形狀裡，一直一直地湧出來。', 'The very bottom of the abyss. Grey mist pours endlessly from a vast shape like a cradle.'],
        [null, '那是灰潮之母。世界上所有被遺忘的東西，最後都會回到這裡。', 'It is the Mother of the Ashtide. Everything the world has ever forgotten comes back here in the end.'],
        ['rowan', '……她也在哭。', '…She\'s crying too.'],
      ]);
      await A.battle(['x_mother'], { boss: true, bg: 'dark', music: 'final' });
      await A.talk([[null, '灰潮之母安靜了下來。霧，第一次停止了湧出。', 'The Mother of the Ashtide falls quiet. For the first time, the mist stops pouring out.'], [null, '在她消失的地方，留下了一顆小小的、溫暖的星。', 'Where she was, a small, warm star remains.']]);
      await A.item('megalixir', 3); await A.astral('ragnarok');
      A.set('abyss_done');
    }, { when: (A) => !A.flag('abyss_done') }));
  }
}
export const EPISODES = EP;
