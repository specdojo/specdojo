---
specdojo:
  id: prj-0001:pjr-eakn-stsd-mermaid-rulebook-split
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
  registered_at: "2026-11-05T10:45:09Z"
  derived_from:
    - PJR-3APD
    - PJR-00NY
  depends_on:
    - PJR-KBS6
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-mermaid-rulebook
---

# PJR-EAKN stsd の図の rulebook に、分割した図の初期点と終了点の扱いを足す

## 1. 概要

3APD の段 6。図を分割したときに各図へ初期点を置くか、終了点を置かない境界の書き方を stsd-mermaid-rulebook に足し、stsd-rulebook とそろえる

## 2. 入力

- PJR-Q9AW の磨き込みで、16 遷移を通常系と例外系の 2 図に分けた。初期点を各分割図に置くかが明示されていないため、初期点は通常系に置き、例外系は共有状態でつないだ
- 終了点を置かない境界の書き方は、先に PJR-KBS6 で stsd-rulebook に足す内容とそろえる

## 3. 完了条件

- [[specdojo:stsd-mermaid-rulebook]] の図の分割の規則に、分割したそれぞれの図に初期点を置くか、どの図に置くかを足している。
- 終了点を置かない場合の書き方を、[[specdojo:stsd-rulebook]] に足した内容（PJR-KBS6）とそろえ、同じ説明を 2 つの rulebook で繰り返さず、片方からもう片方を参照している。
- 足した規則が、[[stsd-task-execution]] の 2 つの図の書き方で満たせるか確かめ、満たせない場合はどこが違うかを個票の対応結果に書いている（成果物は変えない）。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------ | ---- | ---- | ---- |
| 1   | 分割と初期点・終了点の規則を読み、足りない点を整理する | BA   | open | -    |
| 2   | 規則を足し、検査を通す                                 | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-mermaid-rulebook]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: そろえる先
