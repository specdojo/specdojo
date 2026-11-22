---
specdojo:
  id: prj-0001:pjr-tn50-kata-wave-3-stc-index-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T05:40:48Z"
  derived_from:
    - PJR-ABY4
---

# PJR-TN50 第 3 波の stc-index の型を grade の指摘に沿って直す

## 1. 概要

第 3 波の 090 で stc-index の型（rulebook pass 96（minor 2）、sample needs-work 94（major 1・minor 4））が合格に届かなかったため、grade の指摘を直して評価し直す

## 2. 入力

- 2026-11-22、T-KATA-WAVE-3-stc-index-sample-090 の review で、型の評価は rulebook pass 96（minor 2）、sample needs-work 94（major 1・minor 4） だった。指摘は docs/ja/projects/prj-0001/execution/grade/results/specdojo.stc-index-rulebook.yaml と specdojo.stc-index-sample.yaml にある。
- 合格は、機械的な「未解決の `_TODO_` / `_ASSUMPTION_`」の指摘（PJR-7C9X）を除いて、rulebook と sample に blocker と major がないこととする（indie の判断、2026-11-22）。
- `_TODO_` は sample に残さない。`_ASSUMPTION_` は docs/ja/specdojo/standards/sample-authoring-standard.md に従って残してよい。

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
