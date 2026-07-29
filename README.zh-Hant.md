# copic-color

> 版本 v1.0｜最後更新 2026-07-29

**繁體中文** ｜ [English](README.md) ｜ [日本語](README.ja.md)

**COPIC 色號 → CSS** 對照的唯讀參考 WebApp。它不是又一面色票牆——358 色是依
**Copic Color System 的三軸**瀏覽的，因為 COPIC 的色號本身就是那三個軸：
`BV02` ＝ 色系 `BV` ＋ Blending Group `0`（飽和層級 0–9）＋ Intensity Value `2`（明度層級 000–9）。
選一個色系，矩陣就把那套體系原樣攤開。

第二頁（`sets.html`）回答的是實際的購買問題：**該買哪一盒？** 選一個套組 → 只留下它收錄的色 →
橫向掃其他套組，表頭直接寫「相對基準組還缺幾色」。

- **358 色**、17 個色系、4 條產品線（Sketch 358／Classic 214／Ciao 180／Copic Ink 358）
- **62 組套組**——編號組（12／24／36／72）與主題組（Sea & Sky、Color Fusion、Doodle Kit…）
- **最接近色比對器**（`nearestCOPIC`，CIEDE2000）：給任一 RGB，回答最接近的是哪支筆。
  限定產品線後**只推薦那條線真的有出的色**——手上買不到的筆推薦了也沒用。
- 一鍵複製 hex／`rgb()`／`var(--copic-…)`／utility class；整份 `.css` 匯出
- light／dark 主題、三語（zh-Hant／en／ja）、零後端

```bash
npm install && npm start        # → http://localhost:3000/apps/copic-color/
```

## 準確度

hex 取自官方 COPIC 型錄色塊的向量填色。**型錄自己就聲明「印刷色與實際墨水的顏色不同」**，
故一律視為螢幕近似值、非官方規格。要精準對色請以實體 COPIC 色票為準。

COPIC 是酒精性**染料**、不是顏料：原廠不公布耐光度，也沒有 Colour Index 色料編號。
那些欄位是空的，因為**資料不存在，不是漏抽**。

## 資料

`public/apps/copic-color/data/copic-*.js` 是**建置產物**，由家族美術色材領域庫 `db_artcolor`
（System of Record）匯出。**app 本身不連任何資料庫**——資料檔進版控，clone 下來只要 `npm install` 就能跑。

本 app 屬於 **nodeapp WebApp 家族**，共同規範見
[nodeapp-webapp-family](https://github.com/scottgfhong310/nodeapp-webapp-family)。

MIT 授權。COPIC 為 Too Marker Products Inc. 的商標；本專案是非官方的參考工具，與該公司無隸屬或背書關係。
