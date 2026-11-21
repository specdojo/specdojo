---
specdojo:
  id: prj-0001:pjr-325y-kata-strategy-no-role-assignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-21T08:23:42Z"
  derived_from:
    - PJR-76N9
---

# PJR-325Y 型の整備の strategy に、文書に役割の割り当てを書かない決まりを足す

## 1. 概要

第 3〜6 波と kata-slim-3 の strategy の段の説明に PJR-76N9 の決まりを足し、track を作り直す。sample と rulebook の作成標準にも足す

## 2. 入力

- PJR-76N9 の決定（2026-11-21、indie）: 成果物と sample の本文に、文書の役割の割り当てと承認の進み具合を書かない。rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直す。文書の中身として役割が要る型（RACI・体制など）は対象外
- 第 3 波（kata-wave-3）は 2026-11-21 から tsp-index で試しを流している。ほかの波の strategy はまだ無い
- 2026-11-21、直した cnd-specdojo を grade すると pass 93 だったが、minor の指摘 7 件の多くが、概要に作成担当・確認者・最終判断者の役割を書く、Person の表に「判断・確認の責務」の列を足す、ready の前の確認と PO の承認記録を書く、を求めた。型の template（cnd-template の列と「検証・承認前の確認」の節）とカタログの `done_criteria` が役割と承認の記述を求めているため。この todo の範囲に、template・`done_criteria`・grade の観点を含める

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
