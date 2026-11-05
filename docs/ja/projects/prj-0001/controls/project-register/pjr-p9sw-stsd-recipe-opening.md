---
specdojo:
  id: prj-0001:pjr-p9sw-stsd-recipe-opening
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T13:05:02Z"
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-F1FD
  approach: recipe-maintenance
  targets:
    - specdojo:stsd-recipe
---

# PJR-P9SW stsd-recipe の「概要」の手順を目的・適用範囲に分ける

## 1. 概要

stsd-recipe の「概要」の節を、新しい冒頭（頭書き・目的・適用範囲）の書き方に合わせる

## 2. 入力

- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）

## 3. 完了条件

- [[specdojo:stsd-recipe]] の「概要」の節が、頭書き・目的・適用範囲の書き方の手順（何を問い、どこに書くか）に分かれている。
- 「概要」への参照が残っていない。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 概要の節を頭書き・目的・適用範囲に分ける | BA   | open | -    |
| 2   | 参照を直し、検査を通す                   | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-recipe]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: 従う規則
