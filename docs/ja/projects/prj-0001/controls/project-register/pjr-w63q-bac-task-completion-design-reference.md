---
specdojo:
  id: prj-0001:pjr-w63q-bac-task-completion-design-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-15T12:21:57Z"
  commit_type: docs
  commit_scope: bac
  approach: fully-guided
  targets:
    - bac-task-completion
---

# PJR-W63Q bac-task-completion に、受入の条件を満たす設計の参照を足す

## 1. 概要

evidence_refs の実装と設計の文書を参照に足し、未決の目印を片付ける

## 2. 入力

- T-KATA-WAVE-2-bac-task-completion-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 95 点で完了条件 3/4、型は pass
- 主な指摘: 受入の条件を実装で満たせることを確かめる設計の参照がない（DC-003、ARC）。本文に未決の目印が 2 か所ある

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 受入の条件ごとに、それを満たす実装と設計の文書（evidence_refs の実装、cdsd・stsd など）への参照があり、ARC が満たせることを確かめられる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | BA   | open | -    |
| 2   | grade し直して結果を書く            | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
