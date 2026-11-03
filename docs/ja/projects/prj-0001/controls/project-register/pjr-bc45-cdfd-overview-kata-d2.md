---
specdojo:
  id: prj-0001:pjr-bc45-cdfd-overview-kata-d2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-03T02:39:38Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-6QTK
  commit_type: docs
  commit_scope: samples
---

# PJR-BC45 全体概要の sample と template の図を D2 の縦の流れにする

## 1. 概要

cdfd-overview の sample と template の概念データフローと凡例を Mermaid から D2 の縦の流れにし、データストアの色を G 案に合わせる

## 2. 入力

- PJR-6QTK の後も、cdfd-overview の sample と template の図は Mermaid の横向きのまま。全体概要は D2 の縦の流れで書いている（2026-11-03）
- 利用者の判断: sample と template の図を D2 にし、縦の流れにする。データストアの色と凡例も見直す（2026-11-03）
- 利用者の判断: rulebook の「凡例で記法を宣言しなければ Mermaid」という既定は変えず、sample と template の凡例で D2 を宣言する。詳細の CDFD の sample・template は今回含めない（2026-11-03）
- cdfd-d2-rulebook には direction: down と、データストアの色の G 案（マスタ・構成 #e8f5e9 / #43a047、トランザクションと物理保管 #c8e6c9 / #2e7d32）がすでに定めてある（2026-11-03）

## 3. 完了条件

- [[specdojo:cdfd-overview-sample]] の「概念データフロー（概要）」の図が D2（`direction: down`）で書かれている。ノード・線・ラベルの中身と、データストアの区分で分ける方式は変えない。変えるのは記法・向き・色・配置だけ。戻りの線は `a <- b` で書き、プロセスグループの並びを上から下へ読める順にそろえる
- sample の「凡例（本プロダクト共通）」が D2 の縦の流れになっている。物理保管はマスタ・構成データとトランザクションデータの横に並べ、凡例の文章で記法に D2（[[specdojo:cdfd-d2-rulebook]]）を選ぶと宣言し、形状・線種と色の意味を書いている
- データストアの色が [[specdojo:cdfd-d2-rulebook]] の G 案（マスタ・構成データ `#e8f5e9` / `#43a047`、トランザクションデータと物理保管 `#c8e6c9` / `#2e7d32`）に合い、`classes` で塗っている。ノードごとの `style` は使わない。配置のための非表示の線は使ってよい
- [[specdojo:cdfd-overview-template]] の概念データフローと凡例の雛形が、sample と同じ D2 の縦の流れ・色・凡例の形になっている
- 全体概要の凡例（[[prj-0001:cdfd-overview]] の「凡例（本プロダクト共通）」）と、色と凡例の形がそろっている
- rulebook・recipe・[[specdojo:cdfd-d2-rulebook]]・全体概要・詳細の CDFD の Kata は変えない。sample と template の status は ready のまま
- 本文の文章（目的・表など）は、図の記法を説明する箇所だけを D2 に合わせ、ほかは変えない
- sample の 2 つの図を `d2 --layout elk` で SVG に出力し、並びと大きさを個票の対応結果に記録する
- 未決の点は executor が決め、理由を個票の対応結果に記録する
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | sample の図と凡例を D2 の縦の流れにする        | BA   | open | -    |
| 2   | template の雛形を sample に合わせる            | BA   | open | -    |
| 3   | SVG で並びと大きさを確かめ、対応結果に記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-overview-sample]]
- [[specdojo:cdfd-overview-template]]
- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:cdfd-overview]]
