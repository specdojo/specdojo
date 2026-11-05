---
specdojo:
  id: prj-0001:pjr-f1fd-stsd-rulebook-opening
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
  registered_at: "2026-11-05T13:02:31Z"
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-VNT1
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-F1FD stsd-rulebook の冒頭を頭書きと目的・適用範囲に分け、図の表示名を状態名と値にする

## 1. 概要

stsd-rulebook の本文構成を、頭書き・目的・適用範囲・状態一覧・状態遷移図・遷移の説明・今後の検討メモにする。図の表示名の規則も状態名と値の 2 行に合わせる

## 2. 入力

- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）
- 状態遷移図の表示名は、状態一覧に値がある場合は「状態名`<br>`値」、値が - の場合は状態名だけとする。`state_id` は英小文字・数字・アンダースコアのため、表示には状態一覧の値を使う。Mermaid の lint で通ることを確かめた（2026-11-05 利用者が決定）

## 3. 完了条件

- [[specdojo:stsd-rulebook]] の本文構成の表が、頭書き（H1 直下の 1〜2 行。章にしない）・1. 目的・2. 適用範囲・3. 状態一覧・4. 状態遷移図・5. 遷移の説明・6. 今後の検討メモになっている。
- 「目的」には状態を管理する目的と利用者、「適用範囲」には対象・スコープ（AS-IS / TO-BE）、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない場合の到達点と理由を書く、と記述ガイドにある。これまで「概要」に書くとしていた規則（状態が一つの対象の根拠、終了点の省略の理由など）は、すべて目的か適用範囲へ移り、「概要」への参照が残っていない。
- 状態遷移図の表示名の規則（値がある場合は`状態名<br>値`、値が `-` の場合は状態名だけ）を、図の rulebook への参照で示し、同じ説明を 2 か所に書いていない。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | 本文構成と記述ガイドを新しい冒頭に直す         | BA   | open | -    |
| 2   | 概要への参照を目的・適用範囲へ移し、検査を通す | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-rulebook]]: 手入れの対象
- [[specdojo:cdfd-uc-rulebook]]: 合わせる冒頭の形
