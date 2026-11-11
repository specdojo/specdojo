---
specdojo:
  id: prj-0001:pjr-v681-bes-task-ready-selected-refine-grade
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-11T11:57:32Z"
  derived_from:
    - PJR-2GD6
    - PJR-T88P
  commit_type: docs
  commit_scope: register
  approach: fully-guided
  targets:
    - prj-0001:bes-task-ready-selected
---

# PJR-V681 代表の bes-task-ready-selected を、grade の指摘で磨き込む

## 1. 概要

grade（reps5-20261111）needs-work 88 の指摘（並列の要求の対応付けの項目・範囲の前提・残った目印）を直す

## 2. 入力

- 代表の確定の段の材料で、bes は needs-work 88（major 3）だった。indie が 2026-11-11 に推奨の進め方（再実行）を承認した

## 3. 完了条件

- 代表の [[prj-0001:bes-task-ready-selected]] を、確定した型 [[specdojo:bes-rulebook]] と [[specdojo:bes-sample]] に合わせ、grade（run id `reps5-20261111`、needs-work 88）の指摘を直している。
  - 並列の要求を実行の記録と対応付ける項目を決め、実行の記録の正本（schema・業務データ辞書）で確かめて書いている。正本にない場合は `_UNDECIDED_` のまま理由を書く。
  - このイベントを使うタスクの流れの範囲を、業務の承認が要る前提として `_ASSUMPTION_` に明示している（承認は確定の段で人が行う。executor が承認済みとしない）。
  - 残っている `_TODO_` を、確定した型の範囲で解消している。決められないものは `_UNDECIDED_` か `_ASSUMPTION_` にして理由を書く。
  - そのほかの grade の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 冗長さを整理し、実装・schema・リファレンスと同じことを書かず正本を参照する方針（PJR-2GD6）を保っている。
- 型と、ほかの成果物とカタログを変えていない。
- grade で pass になっている（grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

## 4. 作業内容

| No  | 作業                                       | 担当         | 状態 | メモ |
| --- | ------------------------------------------ | ------------ | ---- | ---- |
| 1   | grade の指摘を読み、代表を直す             | executor     | open | -    |
| 2   | 検査を流し、決めた点と理由を対応結果に書く | executor     | open | -    |
| 3   | 統合の後に grade を流し、pass を確かめる   | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:bes-task-ready-selected]]
- [[specdojo:bes-rulebook]]
- [[prj-0001:pjr-2gd6-business-specs-reps]]
