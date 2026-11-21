---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-atc-sample-040-20261121t161547z-31b28f23
  type: exec-result
  task_id: T-KATA-WAVE-3-atc-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-atc-sample-040/T-KATA-WAVE-3-atc-sample-040-20261121T161547Z-31b28f23/plan.md
  started_at: "2026-11-21T16:15:53.188Z"
  completed_at: "2026-11-21T16:22:18.419Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-rulebook
---

# Edit Result

## 1. 実施内容

- atc-rulebook を簡潔化しました。
- 全体方針として、検証コマンドと期待結果（F002 への対応）、recipe および template が未決であること、および ready 化の判断者が `_UNDECIDED_` であることを明記しました（F001、F004 への対応）。
- 経過措置として存在していたサンプル章を削除し、記述ガイドの内容を自己完結的な形式に整えました。
- F003 に関しては、指定サンプル `docs/ja/specdojo/samples/atc-sample.md` との構成不整合について、後続の `sample-maintenance` タスクへ申し送りを行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/atc-rulebook.md`: rulebook の簡潔化を実施しました。具体的には、検証手順の追記、未決事項（recipe/template）および ready 化の判断者に関する記述の追加、およびサンプル章の削除を行いました。

## 3. 申し送り

- F003（sample `docs/ja/specdojo/samples/atc-sample.md` が rulebook の本文要件である章構成・トレース表・条件・ケース表に準拠していない問題）は、本タスクでは sample 側を変更しない方針のため未解消です。後続の `sample-maintenance` において、本文要件の 6 章構成、`trace_key`、`case_id` 形式、および `relations.verifies` に沿った記述への拡充を行ってください。
- F003（sample docs/ja/specdojo/samples/atc-sample.md が rulebook の本文要件の章構成・トレース表・条件・ケース表に未準拠）は本段で sample を変更しない方針のため未解消。後続の sample-maintenance で、本文要件の 6 章構成・`trace_key`・`case_id` 形式・relations.verifies に沿って厚くする。
- recipe・template の要否は未判断のまま（template は PJR-WYTX、recipe は QE が ready 化判断時に決める）。ready 昇格は人が判断する。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook のみで、plan・result・個票などの履歴蓄積ファイルを変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` がなく、rulebook は markdown 対象のため）

## 4. 進め方と実践の型の適用

F001, F002, F004 の指摘に基づき、rulebook 内に検証手順、未決の recipe/template、および ready 化の判断者（`_UNDECIDED_`）の記述を追加しました。また、rulebook 内のサンプル章を削除し、記述ガイドの構成を整理しました。F003 については、sample 側の責務として後続タスクへ申し送っています。
