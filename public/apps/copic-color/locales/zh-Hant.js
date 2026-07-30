/* 繁體中文（zh-Hant） */
I18n.register('zh-Hant', {
  'title.page': 'COPIC 色號 → CSS',
  'app.title': 'COPIC 色號 → CSS',
  'app.sub': '依 Copic Color System 三軸瀏覽；色票取自官方型錄，為螢幕近似值、非官方規格',

  'search.placeholder': '色號或色名…',
  'search.empty': '找不到符合的顏色',

  'family.all': '全部',

  'tool.layout': '切換版面：三軸矩陣 / 全部色票',
  'tool.nearest': '找最接近的 COPIC 色',
  'tool.sets': '套組收錄對照（另開分頁）',
  'tool.css': '檢視 / 複製整份 CSS',
  'tool.download': '下載 copic_colors.css',
  'tool.mode': '切換 light / dark',
  'tool.lang': '語言',

  'axis.explain': '縱軸 Blending Group（飽和層級 0–9）、橫軸 Intensity（明度層級 000–9）',
  'axis.noGrid': '此色系不在 Blending Group / Intensity 的編號體系內，改以色票列呈現',

  'css.title': 'CSS 變數 + utility classes',
  'css.sub': '色，含 <code>:root</code> 變數與 utility classes',
  'css.copy': '複製全部',
  'css.download': '下載 .css',

  'nearest.title': '找最接近的 COPIC 色',
  'nearest.hint': '以 CIEDE2000（ΔE00）比對。限定產品線後，只會推薦那條線真的有出的色——手上沒有的筆別推薦。',
  'nearest.allLines': '全部 358 色（Sketch / Copic Ink）',
  'nearest.placeholder': '#RRGGBB',

  'band.very': '極接近',
  'band.close': '接近',
  'band.noticeable': '可辨差異',
  'band.far': '差異大',

  'detail.close': '關閉',
  'detail.lines': '產品線',
  'detail.sets': '收錄於套組',
  'detail.parse': '色號分解',
  'detail.family': '色系',
  'detail.bg': 'Blending Group',
  'detail.iv': 'Intensity',
  'detail.noSet': '不在任何已收錄的套組裡',
  'note.approx': 'hex 取自官方型錄、為螢幕近似值；型錄自述印刷色與實際墨水不同',

  'sets.title': 'COPIC 套組收錄對照',
  'sets.sub': '選一個套組 → 只留下它收錄的色 → 橫向看其他套組有沒有涵蓋',
  'sets.gapRow': '相對基準組還缺幾色',
  'sets.incomplete': '＊ 該產品另含非色筆品項（Multiliner／Glitter Pen／指南），此處只記色筆',
  'sets.back': '回色票頁',
  'sets.rowLine': '產品線',
  'sets.rowSubset': '子系列',
  'sets.rowIndex': '序號',
  'sets.colColour': '色',
  'sets.tabN': '{n} 組',
  'sets.pickHint': '點欄位下方的尺寸，就只留下該套組的色',
  'sets.showingN': '{n} 色',
  'sets.clear': '清除選擇',
  'sets.gapTip': '相對基準組，這一欄還缺 {n} 色',
  'sets.gapSelf': '基準組本身',
  'sets.foot': '點欄位的尺寸＝只留下該套組收錄的色（再點一次取消）；點左欄的色號開明細。上方切換產品線＝只留那一段，再點一次回到三線並排。',

  'toast.copied': '已複製',
  'toast.copyFail': '複製失敗（需 localhost 或 HTTPS）',
  'toast.lang': '已切換為 {name}',
  'toast.downloaded': '已下載：{n}'
}, '繁體中文');
