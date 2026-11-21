---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-etc-sample-040-20261121t134648z-553e1eb5
  type: exec-result
  task_id: T-KATA-WAVE-3-etc-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-etc-sample-040/T-KATA-WAVE-3-etc-sample-040-20261121T134648Z-553e1eb5/plan.md
  started_at: "2026-11-21T13:47:01.717Z"
  completed_at: "2026-11-21T13:53:44.809Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-rulebook
---

# Edit Result

## 1. 実施内容

- `etc-rulebook.md` を、grade による指摘事項および `done_criteria` に基づいて簡潔に整えました。
- F001 に対応し、`perspective_key` の宣言場所を「見出し直下の行」として定義しました。
- F002 に対応し、階層構造を H4 までのルールに適合するよう修正しました。
- F003 に対応し、山括弧付きのプレースholder をインラインコード形式に修正しました。
- F005 に対応し、章構成表の「実行運用メモ」の名称を統一しました。
- 完成例の章を削除し、見出しの深さを H4 までに制限しました。
- 対応する sample (`docs/ja/specdojo/samples/etc-sample.md`) が本書の要件（章構成、`trace_key`、条件・ケース表、`perspective_key` の宣言）を満たしていない問題（F004）については、後続の `sample-maintenance` へ `_UNDECIDED_` として申し送りました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/etc-rulebook.md`: rulebook の章構成を簡潔にし、F001〜F003、F005 の指摘事項（`perspective_key` の宣言場所の規定、見出しレベルの調整、インラインコードの使用、および章名称の統一）を反映しました。また、F004 に関連する sample の不備については、後続のメンテナンス工程へ申し送りを行いました。

## 3. 申し送り

- F004: `docs/ja/specdojo/samples/etc-sample.md` は rulebook の本文要件（章 1〜7、`trace_key`、条件・ケース表、`perspective_key` の宣言行）に合っていない。後続の sample の見直しで揃え、独自の章構成と「責任者」の観点をやめる。rulebook には `_UNDECIDED_` として記録した。
- `recipe`・`template` の要否は未判断のまま（template は PJR-WYTX で扱う）。
- result の `進め方と実践の型の適用` に記録する内容: 根拠には `rulebook-authoring-standard`、`etc-index-rulebook` の「ケース表の共通カラム」（`perspective_key` は見出し直下に宣言する）、同じ wave で直した `utc-rulebook` の構成を使った。F001・F002・F003・F005 は修正で解消し、F004 は sample の段へ申し送った。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

`rulebook-authoring-standard` に基づき、既存の `etc-rulebook.md` を整理しました。作業にあたっては、`etc-index-rulebook` の構成（ケース表の共通カラム定義）と、同一の wave で更新された `utc-rulebook` を参照し、整合性を確保しました。F001 から F003、F005 の指摘事項については、記述ルール（見出し直下での `perspective_key` 宣言、H4 以内の階層構造、インラインコードの適用、章名称の統一）を適切に反映しました。一方で、F004 で指摘された sample 側の構造的欠陥については、rulebook 側での対応は行わず、後続の作業へ申し送る形をとっています。
