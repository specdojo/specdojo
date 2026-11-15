---
specdojo:
  id: prj-0001:pjr-2c9w-stsd-task-execution-rework-actor-authority
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:22:46Z"
  depends_on:
    - PJR-M495
    - PJR-T4G3
  commit_type: docs
  commit_scope: stsd
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-2C9W stsd-task-execution を grade の指摘で手直しする（担当者の権限と引き継ぎ、記録の再生の順序）

## 1. 概要

最新の grade の指摘と M495・T4G3 の結果を取り込み、権限と引き継ぎ、再生の順序の規則を定める

## 2. 入力

- T-BUSINESS-SPECS-KATA-2-stsd-task-execution-140 と T-STSD-PILOT-stsd-task-execution-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 79 点で完了条件 0/5
- 主な指摘: 補足の記録や再開で actor が替わるときの権限、claim の持ち主と最新の記録者のどちらに権限があるか、同じ時刻の記録の再生の順序が定まっていない。PJR-M495・T4G3 の結果を取り込む

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 担当者の権限と引き継ぎ（補足の記録や再開で actor が替わるとき）、claim の持ち主と最新の記録者のどちらに権限があるか、同じ時刻の記録の再生の順序を、PJR-M495・T4G3 の実装の結果に合わせて定めている。
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
