---
specdojo:
  id: prj-0001:pjr-pejq-cdsd-execution-rework-deferred-stores
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:21:53Z"
  commit_type: docs
  commit_scope: cdsd
  approach: fully-guided
  targets:
    - cdsd-execution
---

# PJR-PEJQ cdsd-execution を grade の指摘で手直しする（後回しの 4 つのデータストア）

## 1. 概要

最新の grade の指摘を取り込み、4 つのデータストアと検証の基準を書く

## 2. 入力

- T-BUSINESS-SPECS-KATA-2-cdsd-execution-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 65 点で完了条件 0/3
- 主な指摘: 実行状態・plan と result・evidence・worktree の 4 つのデータストアが `_TODO_` のまま。技術的な制約と正本・派生の区別、検証の合否の基準がない

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 実行状態・plan と result・evidence・worktree の 4 つのデータストアについて、役割・内容・正本と派生の区別・技術的な制約・検証の合否の基準を書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | ARC  | open | -    |
| 2   | grade し直して結果を書く            | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
