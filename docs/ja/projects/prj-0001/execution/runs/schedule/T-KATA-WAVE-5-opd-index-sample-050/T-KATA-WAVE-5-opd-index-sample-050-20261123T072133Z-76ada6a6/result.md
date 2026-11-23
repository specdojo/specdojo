---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-index-sample-050-20261123t072133z-76ada6a6
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-index-sample-050/T-KATA-WAVE-5-opd-index-sample-050-20261123T072133Z-76ada6a6/plan.md
  started_at: "2026-11-23T07:21:50.830Z"
  completed_at: "2026-11-23T07:40:51.702Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-sample
---

# Edit Result

## 1. 実施内容

- sample 文書 `docs/ja/specdojo/samples/opd-index-sample.md` を、`opd-index-rulebook` の全 12 章の構成に従って大幅に拡充・再構成しました。
- grade による指摘事項（F001〜F025）に基づき、駄菓子屋きぬやの文脈（単一店舗・タブレット 1 台）に即した SLO・SLA・KPI、体制・責任分界（RACI）、および主要な運用ポリシーを記述しました。
- 担当ロールの表記を `Role code`（`PO`、`OPS` 等）に統一し、技術的前提に矛盾しない測定手段や目標値へ修正しました。
- `_UNDECIDED_` を用いて、オフライン時の運用や RTO/RPO など、後続の成果物で決定すべき事項を明示しました。
- `prettier` および `markdownlint` による整形・検査を完了しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opd-index-sample.md`: `opd-index-rulebook` の構成に従い、概要、SLO/SLA/KPI、体制・責任分界（RACI）、運用ポリシー（インシデント対応、変更管理、定期運用、問い合わせ対応）、および関連ドキュメントの導線を、駄菓子屋の文脈で追記・修正しました。また、`_UNDECIDED_` を用いて未決事項を明示しました。

## 3. 申し送り

- `PO` が決める未決事項（`_UNDECIDED_` のまま残した値）: オフライン時の記録方法、営業時間内の稼働率の目標、RTO/RPO とバックアップの保管期間、営業時間外の緊急連絡手段。
- 既存の sample にない値を仮置きした: P1 の連絡期限 15 分と紙の控えへの切替判断 30 分、監査ログの保管 1 年、死活監視の閾値 5 分、問い合わせの応答目標。上位の nfr が決まる段で見直しが要る。
- rulebook の変更案: `opd-index-rulebook` の記述ガイドの良い例（「監視の稼働率集計」「Ops Lead へ連絡」）が SaaS 前提の書き方で、sample-authoring-standard の Role code 規約と食い違う。Role code（`OPS` など）の例に置き換える。
- 隣の sample の申し送り: `opd-monitoring-sample`・`opd-incident-management-sample`・`opd-access-control-sample`・`opr-index-sample` は SaaS 前提の題材（Ops Lead、#ops、API 5xx など）と、本文冒頭の「参照:」行が残っている。本書の導線の表では、これらの分冊を「予定」として id で仮置きした。
- 上位の `nfr-availability-sample`・`nfr-operations-sample` は目標値のない最小例なので `based_on` はつながず、本文の参照にとどめた。nfr が厚くなったら `based_on` と `_UNDECIDED_` の値を揃える。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していないため）

## 4. 進め方と実践の型の適用

`opd-index-rulebook` の全 12 章の構成に従い、`docs/ja/specdojo/samples/opd-index-sample.md` を、駄菓子屋きぬやの文脈と `Role code` を用いて大幅に拡充・再構成しました。`grade` による指摘（F001〜F025）を解消し、`_UNDECIDED_` を用いて未決事項を明示することで、成果物としての完成度を高めました。
