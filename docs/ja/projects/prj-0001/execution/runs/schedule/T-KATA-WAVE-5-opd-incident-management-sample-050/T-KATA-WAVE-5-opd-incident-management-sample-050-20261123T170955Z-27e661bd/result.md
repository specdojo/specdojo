---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-incident-management-sample-050-20261123t170955z-27e661bd
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-incident-management-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-incident-management-sample-050/T-KATA-WAVE-5-opd-incident-management-sample-050-20261123T170955Z-27e661bd/plan.md
  started_at: "2026-11-23T17:09:57.725Z"
  completed_at: "2026-11-23T17:20:33.502Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opd-incident-management-sample
---

# Edit Result

## 1. 実施内容

- opd-incident-management-sample をきぬやの共通サンプル文脈に沿って書き直しました。
- 優先度区分を店頭販売の停滞や在庫確認不能といった業務影響と対応させ、周知の対象を役割名（利用者、家族利用者代表など）に統一しました。
- 停止判断の主体や対象、周知の手段・タイミングを明記し、`opd-index` からの期限情報の再掲を避けて参照へ置き換えました。
- 関連ドキュメントの導線に `opr-index` を追加し、既存の `opd-access-control-sample` 等と整合性をとりました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-incident-management-sample.md`: 共通サンプル文脈（駄菓子屋きぬや）に合わせて、優先度区分、停止判断、周知方針、および関連ドキュメントの導線を具体化・修正しました。

## 3. 申し送り

- F003・F011（復旧の期限を数値で示す）は、利用者が決める値のため推測で埋めず、未決事項の表に `_UNDECIDED_: 優先度ごとの復旧の期限`（判断者 `PO`）として残しています。
- オフライン時の記録方法と営業時間外の緊急連絡手段は、`opd-index-sample` の未決事項を引き継ぎ、本書への影響と決まるまでの扱いを未決事項の表に記載しました（F008・F017 対応）。
- F004 に関して、`rulebook` の `based_on` は NFR・SAC・BR・Issue のみを載せる決まりに従い空のままとしています。`opd-index` への依存は、概要や導線の表の『差分元』で行っています。
- F009・F010 に対応し、P1 の期限等は再掲せず `opd-index` の各項目の参照として記述しました。
- 既存の `参照: ../rulebooks/opd-rulebook.md` は、frontmatter での宣言ルールに従い削除し、H1 を他の sample と揃えました。
- 導線の表の状態は、他の sample と合わせ `'予定'` としています。
- F003・F011（復旧の期限を数値で示す）は、利用者が決める値のため推測で埋めず、未決事項の表に `_UNDECIDED_: 優先度ごとの復旧の期限`（判断者 `PO`、決まるまでは障害記録に復旧までの時間を残すだけ）として残した。PO が期限を決める必要がある。
- オフライン時の記録方法と営業時間外の緊急連絡手段は opd-index-sample の未決事項を引き継ぎ、本書への影響と決まるまでの扱いを未決事項の表に書いた（F008・F017 対応）。
- F004: rulebook の `based_on` は nfr・sac・br・issue だけを載せる決まりなので、`based_on` は空のままにした。opd-index への依存は概要の章・各節の冒頭・導線の表の『差分元』の行で示した。
- F009・F010: P1 の 30 分などの期限は再掲せず『opd-index の一次連絡の期限』『opd-index の切替の期限』として参照した。
- 既存の『参照: ../rulebooks/opd-rulebook.md』の行は、rulebook の対応は frontmatter で宣言し本文に置かないため削除した。H1 はほかの opd sample と揃えて『駄菓子屋きぬや 販売管理システム 運用方針・設計（障害対応）』にした。
- 導線の表の状態は、すでにある opd-access-control-sample・opd-index-sample と揃えて『予定』にした（sample の中の世界では未作成として扱う）。
- rulebook の変更案: なし（今回の指摘はすべて文書側の原因だった）。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

既存の `opd-incident-management-sample.md` をベースに、`opd-rulebook.md` の構成および `sample` 記述標準に従って、共通サンプル文脈（駄菓子屋きぬや）への書き換えと詳細化を行いました。判断の必要のある値については `_UNDECIDED_` として残すことで、完成例としての形式を維持しつつ、推測による不整合を防いでいます。
