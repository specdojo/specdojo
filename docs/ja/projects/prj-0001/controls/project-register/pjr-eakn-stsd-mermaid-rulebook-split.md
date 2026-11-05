---
specdojo:
  id: prj-0001:pjr-eakn-stsd-mermaid-rulebook-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
