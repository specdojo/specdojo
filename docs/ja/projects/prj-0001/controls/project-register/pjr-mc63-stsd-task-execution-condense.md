---
specdojo:
  id: prj-0001:pjr-mc63-stsd-task-execution-condense
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-04T23:38:43Z"
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-Q9AW
  approach: condense
  targets:
    - prj-0001:stsd-task-execution
---

# PJR-MC63 stsd-task-execution の冗長さを condense で直す

## 1. 概要

stsd の試行（3APD）の段 4。磨き込んだ stsd-task-execution の冗長な箇所を condense で直し、Kata が原因のものを記録する

## 2. 入力

- condense は書き足しの最後の edit の後、review の前に置く（PJR-CYG0）。Kata が原因の記録は、段 5 の手入れか作り直しかの判断の材料にする

## 3. 完了条件

- [[stsd-task-execution]] の冗長な箇所を、`vp-arc-conciseness` に沿って直している（繰り返し・表と本文の二重の説明・図をなぞる文など）。判断に要る背景・制約・例外・完了条件は残している。
- result の `condense_records` と本文の表に、直した箇所と残した箇所を、原因（document または kata の種類と場所）付きで記録している。
- 意味を変えていない。状態・遷移・イベントの数と名前が condense の前後で同じである。
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書く。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | 冗長な箇所を洗い出し、直すか残すかを決める | BA   | open | -    |
| 2   | 成果物を直し、検査を通す                   | BA   | open | -    |
| 3   | result に記録を書く                        | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[stsd-task-execution]]: 対象の成果物
- [[specdojo:stsd-rulebook]]: stsd の書き方の規範
