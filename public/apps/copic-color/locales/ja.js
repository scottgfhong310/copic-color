/* 日本語（ja） */
I18n.register('ja', {
  'title.page': 'COPIC カラーコード → CSS',
  'app.title': 'COPIC カラーコード → CSS',
  'app.sub': 'カラーシステムの三軸で閲覧。色見本は公式カタログからの採取で、画面上の近似値です（公式仕様ではありません）',

  'search.placeholder': '色番号または色名…',
  'search.empty': '該当する色がありません',

  'family.all': 'すべて',

  'tool.layout': 'レイアウト切替：三軸マトリクス / 全色見本',
  'tool.nearest': '最も近い COPIC 色を探す',
  'tool.sets': 'セット収録対照（別タブ）',
  'tool.css': 'CSS 全体を表示 / コピー',
  'tool.download': 'copic_colors.css をダウンロード',
  'tool.mode': 'ライト / ダーク切替',
  'tool.lang': '言語',

  'axis.explain': '縦軸＝ブレンディンググループ（彩度 0–9）、横軸＝インテンシティ（明度 000–9）',
  'axis.noGrid': 'このカラーファミリーは番号体系の外のため、一覧表示に切り替えます',

  'css.title': 'CSS 変数 + ユーティリティクラス',
  'css.sub': '色、<code>:root</code> 変数とユーティリティクラスを含む',
  'css.copy': 'すべてコピー',
  'css.download': '.css をダウンロード',

  'nearest.title': '最も近い COPIC 色を探す',
  'nearest.hint': 'CIEDE2000（ΔE00）で比較します。製品ラインを指定すると、そのラインに実際にある色だけを提案します。',
  'nearest.allLines': '全 358 色（Sketch / Copic Ink）',
  'nearest.placeholder': '#RRGGBB',

  'detail.close': '閉じる',
  'detail.lines': '製品ライン',
  'detail.sets': '収録セット',
  'detail.parse': 'カラーナンバーの構成',
  'detail.family': 'カラーファミリー',
  'detail.bg': 'ブレンディンググループ',
  'detail.iv': 'インテンシティ',
  'detail.noSet': '収録セットなし',
  'note.approx': 'hex は公式カタログから採取した画面上の近似値です。カタログ自身が印刷色と実際のインクは異なると明記しています',

  'sets.title': 'COPIC セット収録対照',
  'sets.sub': 'セットを一つ選ぶ → その色だけ残す → 横に見て他のセットの網羅状況を確認',
  'sets.gapRow': '基準セットに対する不足色数',
  'sets.incomplete': '＊ 製品にはマーカー以外（Multiliner／Glitter Pen／ガイドブック）も含まれます。ここではマーカーのみ記録',
  'sets.back': '色見本へ戻る',
  'sets.rowLine': '製品ライン',
  'sets.rowSubset': 'サブシリーズ',
  'sets.rowIndex': '番号',
  'sets.colColour': '色',
  'sets.tabN': '{n} セット',
  'sets.pickHint': 'ヘッダーのサイズをクリックすると、そのセットの色だけが残ります',
  'sets.showingN': '{n} 色',
  'sets.clear': '選択を解除',
  'sets.gapTip': 'このセットには基準セットの色があと {n} 色足りません',
  'sets.gapSelf': '基準セット自身',
  'sets.foot': 'サイズをクリック＝そのセットの色だけを残す（再クリックで解除）。左端の色番号をクリックすると詳細。上のタブで製品ラインを絞り込み、再クリックで 3 ライン並列に戻ります。',

  'toast.copied': 'コピーしました',
  'toast.copyFail': 'コピーに失敗しました（localhost または HTTPS が必要）',
  'toast.lang': '{name} に切り替えました',
  'toast.downloaded': 'ダウンロード：{n}'
}, '日本語');
