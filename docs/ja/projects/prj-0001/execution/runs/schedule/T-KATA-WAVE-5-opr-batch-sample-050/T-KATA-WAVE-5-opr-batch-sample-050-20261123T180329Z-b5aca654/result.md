---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opr-batch-sample-050-20261123t180329z-b5aca654
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-batch-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-batch-sample-050/T-KATA-WAVE-5-opr-batch-sample-050-20261123T180329Z-b5aca654/plan.md
  started_at: "2026-11-23T18:03:31.965Z"
  completed_at: "2026-11-23T22:40:26.133Z"
  agent: opus-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-batch-sample
---

# Edit Result

## 1. 実施内容

- `opr-batch-sample` を、Frontmatter の `rulebook` が opr-rulebook を指す形で、opr-rulebook の 12 章構成に沿った駄菓子屋の完成例として厚くした。
- 再実行のコマンド・入力・前提の確認・完了の条件を示した。
- 利用者が決める値は `_UNDECIDED_` のまま残し、推測で埋めていない。
- 今回の試行では成果物を編集していない。前回の試行の内容が plan の完了条件を満たすことを確認した。
- 前回 `test-docs` が失敗した原因の `tests/src/grade/grade.test.ts` の期待値は、コミット 9b4aa29c60 で修正済みだった。該当テストを単体で実行して通ることを確認した（1 passed, 68 skipped）。
- runner の検証では、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。ほかの検査は変更種別により非適用になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-batch-sample.md`: バッチ再実行の運用手順の sample を、opr-rulebook の 12 章構成に合わせて加筆した。Frontmatter の `rulebook` は opr-rulebook を指す。再実行のコマンド・入力・前提の確認・完了の条件を駄菓子屋の販売管理の値で示した。性能・保管期間・営業時間外の連絡手段など利用者が決める値は `_UNDECIDED_`、前提は `_ASSUMPTION_` で残した。文書の役割の割り当てと承認の進み具合は PJR-76N9 に従い本文に足していない。

## 3. 申し送り

- grade の F008（Ops Lead 以外の責任の定義）と F002（PO の承認に必要な情報）は、文書の役割の割り当てと承認の進み具合を本文に求める指摘である。PJR-76N9 に従い sample には足していない。rulebook 側で合わせて直すか判断する必要がある。
- sample に `_UNDECIDED_` で残した値（利用者が決める）: RTO/RPO とバックアップの保管期間、夜間バックアップの開始時刻と所要時間、営業時間外の緊急連絡手段、障害記録・点検記録の保管期間。
- sample に残した `_ASSUMPTION_`: バックアップの取得中も店頭の記録を続けられる。ホスティング環境が手動取得のコマンド（例 `backup run --target sales-db --date &lt;closing_date&gt;`）を持つ。
- PJR-76N9 に従い、grade の F008（Ops Lead 以外の責任の定義）と F002（PO の承認に必要な情報）が求める文書の役割の割り当てと承認の進み具合は本文に足していない。手順の実施者・判断者は手順の中身として書いてある。
- 前回の試行で申し送った tests/src/grade/grade.test.ts の期待値の修正は、コミット 9b4aa29c60 で対応済みのため、別に起票する必要はない。

## 4. 進め方と実践の型の適用

fully-guided。既存の sample を基礎に、opr-rulebook と opr-sample を形式の参照として使い、rulebook の必須章と禁止事項に合わせて加筆した。sample の業務内容は転記していない。裏付けのない具体値は `_UNDECIDED_` または `_ASSUMPTION_` として残した。
