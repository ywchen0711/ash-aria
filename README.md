# 灰燼詠嘆調 · Ash Aria

向《Final Fantasy VI》致敬的原創 JRPG。十五位各有專屬指令的角色、ATB 即時回合戰鬥、星晶（召喚與學習魔法），
以及一個真的會崩壞的世界。故事分成起・承・轉・合四幕，完整的劇情設定與百小時規劃寫在 [STORY.md](STORY.md)。

An original JRPG in tribute to Final Fantasy VI: fifteen heroes with their own battle commands, Active Time Battles,
Astrals that summon and teach magic, and a world that really does break. The story runs in four acts; the full
story bible and a 100-hour plan are in [STORY.md](STORY.md).

**Play:** https://ywchen0711.github.io/ash-aria/

## 操作 Controls

方向鍵 / WASD 移動 · Z / 空白 / Enter 確定、對話 · X / Esc 選單、取消 · M 音樂。手機有方向鍵與按鈕。
戰鬥中選單打開時時間會停止（等待模式）。

Arrows / WASD move · Z / Space / Enter confirm and talk · X / Esc menu and cancel · M music. Touch pad on phones.
Time stops while a battle menu is open (wait mode).

## 十五個專屬指令 The fifteen commands

| 角色 Hero | 指令 Command | |
|---|---|---|
| 艾莉雅 Aria | 幻化 Astralize | 變身星靈，魔力倍增、持續回復 |
| 洛恩 Rowan | 竊取 Steal / 強奪 Mug | 偷敵人的道具 |
| 艾德蒙 Edmund | 機工 Tools | 連弩、鑽頭、噴火器……買來的機械 |
| 賽伊 Sai | 拳技 Blitz | 用方向鍵輸入招式 |
| 桐生 Kiriyu | 居合 Iai | 蓄力越久越強（8 段） |
| 嘉藍 Galan | 野性 Feral | 化身學過的魔物 |
| 瑟琳娜 Selene | 封魔 Runeblade | 吸收魔法轉為 MP |
| 雷吉斯 Regis | 命運輪 Fortune | 三格轉輪，按確定鍵停下 |
| 夜鴉 Nightcrow | 投擲 Throw | 手裡劍、忍術卷軸、武器；狼會擋刀 |
| 莉莉 Lili | 描繪 Sketch | 畫下敵人，畫作使出敵人的招式 |
| 波洛 Bolo | 青魔 Lore | 看過一次就學會敵人的招式 |
| 摩卡 Moka | 狐舞 Dance | 依地形學會的舞 |
| 烏瑪 Uma | 狂怒 Berserk | 不聽指揮，自己戰鬥 |
| 鏡 Kagami | 模仿 Mimic | 重現同伴上一個行動 |
| 李奧帕德 Leopold | 軍令 Command | 全隊攻擊力提升（客串） |

## 技術 How it's made

純 JavaScript ES 模組，不需要建置。畫面是 256×240 的像素圖（所有圖都是程式畫的），底下可以疊一層 three.js 的 HD-2D
立體透視（`?fx=low` 或選單裡可以關掉）。

Plain ES modules, no build step. Every graphic is drawn in code on a 256×240 canvas, with an optional three.js HD-2D diorama
underneath (turn it off in the menu or with `?fx=low`).

| 檔案 File | 內容 |
|---|---|
| `js/data.js` | 角色、魔法、星晶、道具、裝備、各指令的表 |
| `js/monsters.js` | 105 種魔物與頭目、出現區域 |
| `js/party.js` | 等級、能力、裝備、星晶學習 |
| `js/battle.js` | ATB 戰鬥規則（沒有畫面，node 也能跑） |
| `js/battleview.js` | 戰鬥畫面與每個指令的選單 |
| `js/maps.js` | 兩個世界地圖（崩壞前／崩壞後）、城鎮與迷宮產生器、手繪場景 |
| `js/story*.js` | 四幕的劇情腳本 |
| `js/game.js` | 遊戲引擎：移動、選單、商店、存檔、飛空艇 |

## 測試 Tests

```
npm test            # node tools/test.mjs：資料、地圖可達、每個指令、平衡
npm run story       # node tools/story.mjs：從開頭自動玩到結局（約 5 分鐘）
```

`tools/story.mjs` plays the whole story on the real maps with the real scripts: it walks (or flies) to every place,
fights every story battle and a fair number of random ones, buys gear, and reports the party's level chapter by chapter.
