# copic-color — 設計決議（DESIGN）

> 版本 v1.0｜最後更新 2026-07-29

「怎麼用」歸 [README](README.md)、家族共同規範歸
[nodeapp-webapp-family](https://github.com/scottgfhong310/nodeapp-webapp-family)；本檔只記**為什麼長這樣**。

本 app 是 `faber-castell-color` / `caran-dache-color` 的第三個同類（皆為「色號 → CSS 對照」唯讀參考）。
共同者（唯讀無 API、色票不著色、lib↔控制器邊界、CSS 單一真相）指回 FC 的 DESIGN.md 精神即可；
本檔只寫 **COPIC 特有**的取捨。

## 1. 為什麼是三軸，而不是又一面色彩牆

三支色彩 app 的版面各自不同，不是為了變化，而是**各自扣住該品牌的特有事實**：

| app | 版面 | 扣住的事實 |
|---|---|---|
| `faber-castell-color` | 平面色彩牆 ＋ 套組頁 | 色號是流水號，資訊在「哪些套組收了它」 |
| `caran-dache-color` | 系列／正典雙軸 ＋ 跨系列色帶 | **同一色碼在不同系列是不同顏色** |
| `copic-color` | **色系 × Blending Group × Intensity 三軸** | **色號本身可分解** |

COPIC 的 `BV02` 不是流水號，是三個座標：色系 `BV`、Blending Group `0`（飽和層級 0–9）、
Intensity Value `2`（明度層級 000–9 共 12 級）。官方色卡自己就印著這套系統與一個 Color Wheel。

所以矩陣**不是我們發明的版面，是把它原本的體系畫出來**。做成平面色彩牆的話，
這支 app 就只是「另一個 358 色的 FC」，沒有存在理由。

**Color Wheel 沒有做**（雖然最搶眼）：SVG 環狀佈局工程量大，且小尺寸與手機上不好用；
矩陣同樣完整表達那三個軸，而且可捲、可搜尋、格子可點。

## 2. 不在三軸裡的色系怎麼辦

灰階（`C`/`N`/`T`/`W`）、無彩（`A`：0／100／110）、螢光（`F`）**不在那套編號裡**——
它們的色號是 `C-1`、`100`、`FYG2` 這種另一套形制。UI 偵測到該色系沒有 bg/iv 就**自動改成一維色票列**，
並在標題明說「此色系不在 Blending Group / Intensity 的編號體系內」。

**不硬套**。硬把 `C-1` 塞進某個 bg/iv 格子是替來源發明結構，那比留白更糟。

同理，`isAchromatic()` **用官方色系判定，不用飽和度猜**——FC 那支因為沒有官方分群才需要
以 HSL 飽和度 0.17 當界線（FC DESIGN §7）；COPIC 自己講了哪些是灰，就不該再猜。

## 3. 資料來自 DB，不是本 repo 的產生器

`data/copic-*.js` 是**建置產物**，由家族美術色材領域庫 `db_artcolor` 匯出
（`My Projects/Art Colour/export/a3-export.js`，未納版控）。與 FC／CDA 的現況一致。

- **app 本身不連任何資料庫**：資料檔進版控，clone 下來 `npm install && npm start` 就能跑。
  DB 坐在 build 的後面，不坐在 app 的下面。
- **不要手改 `data/copic-*.js`**——匯出器的 `--check` 會逐位元組比對，不一致回非 0。
- 抽取過程（型錄全文無字型物件、自寫 macOS Vision OCR、五個官方數字交叉驗證）
  記在治理文件 `ARTCOLOR_DOMAIN_GOVERNANCE.md` 的 A4／A4b／A4c 各節，不重複於此。

## 4. `nearestCOPIC` 為什麼要能限定產品線

家族三支 lib 都提供「最接近某顏色的筆」比對器，度量一律 **CIEDE2000（ΔE00）**——
三支必須用同一把尺，否則同一個顏色在不同 app 會得到不同答案（色彩科學核心因此**逐字相同**）。

COPIC 特有的是 `opts.line`：Sketch 有 358 色、Classic 214、Ciao 180。
**推薦一支使用者手上那條線根本沒出的筆是沒有意義的**，所以限定產品線後只從那條線的色裡挑。
FC 的 `nearestFC` 預設只比 `ag`（不推薦 Black Edition 那條 hobby 線）是同一種考量。

## 5. 套組頁：為什麼預設只比同產品線

形制沿用 `faber-castell-color/sets.html`（家族第一支雙頁 app 收斂出來的）：
選一個基準組 → 只留下它收錄的色 → 橫向掃其他組 → 表頭寫「相對基準組還缺幾色」。

差別在規模：COPIC 有 **62 組**（FC 是 40）。全部並排會寬到不能用，
故**預設只比同一條產品線**——拿 Sketch 的套組去比 Ciao 的套組，本來就不是會發生的購買決策。
要全比也可以，選單切一下。

**一個順帶的正確性佐證**：以 `Ciao 36 Colors Set A` 為基準時，`Ciao 72 Colors Set A` 的差額顯示 **0**
（完全涵蓋）。型錄的說明文字正是「72 Set A is a combination of 36 Color Set A and B」——
兩個獨立來源（色片矩陣 vs 說明文字）吻合。

## 6. 12 組套組標記為「收錄不完整」

Doodle Kit／Doodle Pack 與兩組 5 色組的零售內容物**不只有麥克筆**（另含 Copic Multiliner、
atyouSpica Glitter Pen、或入門指南）。依領域治理文件 §2 的範圍紅線，非色筆品項不入資料，
但**不能假裝那個套組就只有這些東西**——故 `complete: false`，UI 以 `＊` 標示並在頁尾說明。

`Copic Wide` 這條產品線**沒有建**：官方色卡沒有列它的收錄色數，無資料可載，**不臆測**。

## 7. hex 的準確度聲明比 FC／CDA 更強

FC 與 CDA 的來源是**官方色卡**（colour chart），本 app 的來源是**官方型錄**（catalogue），
而該型錄自己印著：

> Printed colors in this color listing are different from actual colors of marker ink.

**來源自述不準，就不能假裝它準。** 故資料的 `verify_level` 標為「近似值」，
UI 與 README 的聲明都比另兩支更明確。日後若取得官方色見本，應重取 hex 並降級這段聲明。

耐光度與顏料索引**一律留空**：COPIC 是酒精性染料（dye）不是顏料（pigment），
原廠不公布耐光度、也沒有 Colour Index 編號。**空白是資料的事實，不是抽取漏掉。**

## 8. 未做的（已知範圍，非缺陷）

- **App icon**：尚未設計（FC／CDA 都有專屬 icon，本 app 暫用預設）。
- **官方色見本重取 hex**：見 §7。
- **色名的 zh/ja 在地化**：COPIC 官方色名只有英文一種，型錄未提供其他語言；
  UI 三語只涵蓋介面字串，**色名是資料、不翻譯**（與 FC 同一慣例）。
