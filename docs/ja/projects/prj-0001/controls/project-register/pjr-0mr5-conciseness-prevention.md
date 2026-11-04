---
specdojo:
  id: prj-0001:pjr-0mr5-conciseness-prevention
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
  registered_at: "2026-11-04T11:47:47Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CYG0
  depends_on:
    - PJR-CYG0
  commit_type: feat
  commit_scope: exec
---

# PJR-0MR5 書かないことの規則を edit plan へ載せて冗長さを予防する

## 1. 概要

PJR-CYG0 の決定に沿って、繰り返し・表と本文の二重の説明・図をなぞる文・目的に要らない背景・正本の再掲を書かない規則を edit plan の共通の規約の断片に定め、vp-arc-conciseness の材料に種類の一覧を書き足す

## 2. 入力

- PJR-CYG0 の決定内容（予防の層）を実装の正本とする。規則の正本は grade の観点 vp-arc-conciseness とし、2 か所に基準を持たない（2026-11-04）
- 今は recipe-guided の edit plan に一般的な 1 行があるだけで、draft・fully-guided・retrofit・bootstrap の edit plan には冗長さを避ける指示がない（2026-11-04）

## 3. 完了条件

- 書かないことの規則を、edit だけの共通の規約（`xep-common-conventions-template.md`。PJR-Y431 で分けたもの）に定める。種類は、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲の 5 つ。直し方は、削る・まとめる・参照に置き換えるの 3 つ。下限として、判断に要る背景・制約・例外・完了条件は残し、長さだけでは削らない。
- 規則の要点（3 行以内）を、plan の本文へ写される範囲（`plan-essentials`）に入れる。
- 5 つの種類と下限の言葉を、grade の観点 `vp-arc-conciseness` の `check` と `evidence` にそろえる。足りない種類（図をなぞる文、目的に要らない背景）を `evidence` に書き足し、観点の一覧から作る生成物を作り直す。
- `xep-recipe-guided-template.md` の「冗長な記述や内容の重複を避け、簡潔でわかりやすく記載する」の 1 行を消し、共通の規則に任せる。
- 単体テストで、`draft`・`fully-guided`・`retrofit`・`bootstrap`・`*-maintenance` の edit plan に規則が載り、review の plan に載らないことを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。親の検証として `test-integration` を通す。
- CHANGELOG の未公開の版の節（Unreleased）に書き、公開済みの版の節は変えない。
- 範囲の外: `condense` の段（PJR-1BRQ）、指摘の原因の振り分け（PJR-SJBV）、grade の採点の仕組みの変更、既にある grade の結果の評価のし直し。
- 規則の文言と、要点に入れる行の選び方は executor が決め、理由を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 規則と要点を edit だけの共通の規約に書く                          | ARC  | open | -    |
| 2   | `vp-arc-conciseness` に種類と下限の言葉をそろえ、生成物を作り直す | ARC  | open | -    |
| 3   | `recipe-guided` の 1 行を消す                                     | ARC  | open | -    |
| 4   | テストを足し、検査を通す                                          | ARC  | open | -    |
| 5   | CHANGELOG と対応結果を書く                                        | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:pm-review-viewpoints]]: 規則の正本とする `vp-arc-conciseness`
- PJR-Y431: 規則を書く edit だけのファイルを作る
- PJR-CYG0: 冗長さを 3 層で直す決定
