# copic-color — Session context

COPIC 色號 → CSS（hex / `var(--copic-…)` / `rgb()` / `.copic-bg-…`）對照的**唯讀參考**雙頁 WebApp：
**依 Copic Color System 三軸瀏覽**（色系 chips → Blending Group × Intensity 矩陣）、
最接近色比對器、套組收錄對照（`sets.html`）、一鍵複製四種格式、整份 `.css` 匯出。
358 色 / 17 色系 / 4 條產品線 / 62 組套組。

本 app 屬於 **nodeapp WebApp 家族**；共同規範與流程在
<https://github.com/scottgfhong310/nodeapp-webapp-family>（`DESIGN_GUIDELINES.md` 規範、`WORKFLOW.md` 流程）。**改動前請先讀那兩份，照其中 canon 做。**

## 結構

```
app.js                                # Express 入口：port 3000；/ → 302 /apps/copic-color/
                                      # 唯讀，無 API、無上傳；**不連任何資料庫**
public/apps/copic-color/
├─ index.html · copic-color.css · copic-color.js · copic-color-lib.js   # 主頁：三軸瀏覽
├─ sets.html · sets.css · sets.js     # 第二頁：套組收錄對照
├─ colour-detail.js                   # 兩頁共用的色票明細 Modal（碰 DOM，故不在 lib）
├─ data/copic-colors.js               # window.COPIC_META / COPIC_FAMILIES / COPIC_COLORS（358）
├─ data/copic-sets.js                 # window.COPIC_SETS（62 組）
├─ materialize-dark.css · side-tool.css · side-tool.js · filter-clear.css · filter-clear.js
└─ i18n.js · locales/{zh-Hant,en,ja}.js
```

無 `routes/`、無 `public/upload/`——唯讀參考 app，資料是烘進前端的靜態 registry。

## 執行 / 驗證

```bash
npm install && node app.js            # → http://localhost:3000/apps/copic-color/
```

驗證（preview 實跑）：`/` 302、資產 200、`copic-*.js` 200、API 404 回 JSON、
17 個色系 chips、三軸矩陣渲染（BV 應為 4 列 × 10 欄、16 色）、
灰階/無彩/螢光自動切一維、搜尋切一維、點色票開明細（四種複製格式 ＋ 色號分解 ＋ 產品線 ＋ 套組）、
最接近色 Modal（限定產品線後只出該線的色）、`sets.html` 深連結 `?set=`、
CSS 匯出/下載、i18n 三語、主題切換（**色票保留真實顏色、只有外殼跟主題**）。

## 本 app 的 canon 重點

- **三軸瀏覽是這支的招牌**：COPIC 的色號**可分解**（`BV02` = 色系 ＋ Blending Group ＋ Intensity），
  所以矩陣不是我們發明的版面，是把它原本的體系畫出來。FC 是平面色彩牆、CDA 是系列/正典雙軸——
  三支各自扣住該品牌的特有事實。
- **灰階（C/N/T/W）、無彩（A）、螢光（F）沒有 bg/iv**——不在那套編號裡，UI 自動改一維色票列。
  **這是資料的事實，不是缺漏**，別想辦法「補齊」。
- **可嵌入 lib** `copic-color-lib.js`（`window.CopicColorLib`）：`axisGrid`（三軸矩陣）/
  `parseCode`（純由色號推導，供交叉驗證）/ `filter` / `sortColors` / `isAchromatic`（**用官方色系判定，
  不用飽和度猜**）/ `hexToRgb` / `rgbToHsl` / `rgbToLab` / `deltaE`（ΔE00）/ `deltaEBand` /
  **`nearestCOPIC`**（`opts.line` 可限定產品線）/ `pickTextColor` / `setIndex`／`colorsInSet`／
  `setsOfColor`／`columnGaps`／`assortmentMatrix` / `buildCss`，**純邏輯不碰 DOM**。
- **色彩科學核心與 FC／CDA 兩支 lib 逐字相同**——家族三支比對器必須用同一把尺，
  否則「最接近的筆」在不同 app 會給出不同答案。
- **色票不隨主題重著色**（§4.7）；色塊上文字黑白由 `pickTextColor` 依對比自動選。
- **hex 是螢幕近似值**：型錄**自己聲明**印刷色與實際墨水不同。耐光度與顏料欄一律空
  （酒精染料非顏料，原廠不公布）。

## 兩個踩過的坑（改 CSS 前先看）

- **Materialize 會蓋掉色塊上的字色**：`materialize-dark.css` 有一條 `span` 的顏色規則，
  把 `pickTextColor` 算出、寫在父元素 inline style 的字色蓋掉（實測 span 算出 `#eee`，
  淺色格變成白字白底、整格看不見）。故 `.cp-cell .c-code` 等一律 `color: inherit`。
  FC／CDA 沒踩到，是因為它們把文字直接放在元素上、沒有子 span。
- **`--bg` 曾在深色模式被蓋掉（已於共用件根治）**：`materialize-dark.css` 的
  `html.dark-mode body`（特異性 0,1,1）贏過單純的 `html, body`（0,0,1），深色時 body 變成它的
  `#121212`；本頁多處以 `var(--bg)` 當 sticky 表頭／側欄的遮罩底色，不一致就會出現接縫。
  **2026-07-29 已改在權威共用件解決**——該規則改為 `background: var(--bg, var(--mz-bg))`，
  app 有宣告 `--bg` 就採用它。本 app 因此**不需要**在自己的 CSS 裡繞過。
  同一顆也曾讓 `faber-castell-color`／`caran-dache-color`／`color-palette` 的 sticky 標頭出現接縫。

## 複製件登記（共用件改版時回來同步）

| 檔案 | 來源（以此為準） |
|---|---|
| `materialize-dark.css` | 家族 repo `nodeapp-webapp-family/materialize-dark.css` |
| `side-tool.css`、`side-tool.js` | 家族 §5.5 正統版 |
| `filter-clear.css`、`filter-clear.js` | 家族 §5.12 篩選框「清除」× 鈕 utility |
| `i18n.js` | 家族 repo `nodeapp-webapp-family/i18n.js`（權威版，byte-identical） |
| `data/copic-*.js` | **由 `db_artcolor` 匯出**（`My Projects/Art Colour/export/a3-export.js`）。<br>`--check` 逐位元組比對、不一致回非 0。**不要手改這兩個檔** |

> 為什麼長這樣（三軸決策、資料來源與抽取、兩層模型在本 app 的落點）見 [DESIGN.md](DESIGN.md)。
