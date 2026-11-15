---
specdojo:
  id: prj-0001:pjr-d948-bds-sample-rework-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: UX
  registered_at: "2026-11-15T12:22:02Z"
  commit_type: docs
  commit_scope: kata
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
---

# PJR-D948 bds の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

帳票の sample を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-bds-progress-report-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.bds-sample）の major の指摘を取り込む。rulebook は変えない

## 3. 完了条件

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | UX   | open | -    |
| 2   | grade し直して結果を書く            | UX   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
