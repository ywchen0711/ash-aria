# 灰燼詠嘆調 · Ash Aria

一個關於「歌」與「沉默」的原創 JRPG。世界靠一首看不見的歌「星歌」活著，鐘聲擋住吞噬一切的灰潮——
而鐘，是用星靈熔成的。一位溫柔的指揮者，想讓整個世界安靜地睡去。十五位各有專屬指令的同伴、ATB 即時回合戰鬥、
星晶（召喚與學習魔法），故事分成起・承・轉・合四幕。完整的劇情設定寫在 [STORY.md](STORY.md)。

An original JRPG about song and silence. The world lives on an unseen song; bells hold back the all-devouring Ashtide —
and the bells are made by melting down Astrals. A gentle conductor wants the whole world to fall peacefully asleep.
Fifteen companions with their own battle commands, Active Time Battles, Astrals that summon and teach magic, and a story
in four acts. The full story bible is in [STORY.md](STORY.md).

**Play:** https://ywchen0711.github.io/ash-aria/

## 操作 Controls

方向鍵 / WASD 移動 · Z / 空白 / Enter 確定、對話 · X / Esc 選單、取消 · M 音樂。手機有方向鍵與按鈕。
戰鬥中選單打開時時間會停止（等待模式）。

Arrows / WASD move · Z / Space / Enter confirm and talk · X / Esc menu and cancel · M music. Touch pad on phones.
Time stops while a battle menu is open (wait mode).

## 十五個專屬指令 The fifteen commands

| 角色 Hero | 指令 Command | |
|---|---|---|
| 艾莉雅 Aria | 回音化 Echo Form | 化為歌的形態，魔力倍增、持續回復 |
| 洛恩 Rowan | 妙手 Pilfer | 偷敵人的東西；也會一點急救魔法 |
| 艾德蒙 Edmund | 機巧 Gadgets | 連弩、岩鑽、火風箱……自製的機械 |
| 賽伊 Sai | 拳鳴 Fist Echo | 用方向鍵敲出招式的節奏 |
| 桐生 Kiriyu | 居合 Iai | 刀在鞘中蓄勢，越久越強（8 段） |
| 嘉藍 Galan | 馴獸 Beastcall | 模仿交上朋友的魔物 |
| 瑟琳娜 Selene | 吸音劍 Hushblade | 讓魔法的聲音消失在劍裡，轉為 MP |
| 雷吉斯 Regis | 天候輪 Weather Wheel | 三格天候轉輪，按確定鍵停下 |
| 夜鴉 Nightcrow | 投擲 Throw | 手裡劍、卷軸、武器；老鷹灰羽會反擊 |
| 莉莉 Lili | 謄錄 Transcribe | 把敵人抄進書裡，書頁使出敵人的招式 |
| 波洛 Bolo | 識技 Studied Arts | 看過一次就學會魔物的招式 |
| 摩卡 Moka | 風土歌 Land Song | 依地形學會的歌 |
| 烏瑪 Uma | 暴走 Rampage | 守護石像，不聽指揮自己戰鬥 |
| 鏡 Kagami | 映照 Reflect | 重現同伴上一個行動 |
| 雷歐娜 Leona | 審判 Verdict | 全隊攻擊力提升（客串） |

## 技術 How it's made

純 JavaScript ES 模組，不需要建置。畫面是 256×240 的像素圖（所有圖都是程式畫的；魔物由立體光影算出來再量化成像素），底下可以疊一層 three.js 的 HD-2D
立體透視（`?fx=low` 或選單裡可以關掉）。

Plain ES modules, no build step. Every graphic is drawn in code on a 256×240 canvas, with an optional three.js HD-2D diorama
underneath (turn it off in the menu or with `?fx=low`).

| 檔案 File | 內容 |
|---|---|
| `js/data.js` | 角色、魔法、星晶、道具、裝備、各指令的表 |
| `js/monsters.js` | 105 種魔物與頭目、出現區域 |
| `js/beasts.js` | 魔物的像素畫：用立體形狀、打光、五階色帶與描邊畫出每一隻 |
| `js/party.js` | 等級、能力、裝備、星晶學習 |
| `js/battle.js` | ATB 戰鬥規則（沒有畫面，node 也能跑） |
| `js/battleview.js` | 戰鬥畫面與每個指令的選單 |
| `js/maps.js` | 兩個世界地圖（崩壞前／崩壞後）、城鎮與迷宮產生器、手繪場景 |
| `js/story*.js` | 四幕的劇情腳本 |
| `js/game.js` | 遊戲引擎：移動、選單、商店、存檔、雲鯨 |

## 測試 Tests

```
npm test            # node tools/test.mjs：資料、地圖可達、每個指令、平衡
npm run story       # node tools/story.mjs：從開頭自動玩到結局（約 5 分鐘）
```

`tools/story.mjs` plays the whole story on the real maps with the real scripts: it walks (or flies) to every place,
fights every story battle and a fair number of random ones, buys gear, and reports the party's level chapter by chapter.
