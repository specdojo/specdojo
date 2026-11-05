---
specdojo:
  id: prj-0001:pjr-swre-stsd-sample-opening
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
  registered_at: "2026-11-05T13:04:22Z"
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-YSST
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
---

# PJR-SWRE stsd-sample を新しい冒頭の章立てと図の表示名に合わせる

## 1. 概要

stsd-sample を、頭書き・目的・適用範囲の冒頭と、状態名と値の 2 行の表示名に合わせる

## 2. 入力

- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）
- 状態遷移図の表示名は、状態一覧に値がある場合は「状態名`<br>`値」、値が - の場合は状態名だけとする。`state_id` は英小文字・数字・アンダースコアのため、表示には状態一覧の値を使う。Mermaid の lint で通ることを確かめた（2026-11-05 利用者が決定）

## 3. 完了条件

- [[specdojo:stsd-sample]] が、H1 直下の 1〜2 行の頭書き、「1. 目的」「2. 適用範囲」、3 章以降の順になっている。これまでの「概要」の内容は、意味を変えずに目的か適用範囲へ移している。
- 状態遷移図の表示名が、値がある状態は`状態名<br>値`になっている。分割した 2 図で共有する状態も同じ表示名である。
- 状態・遷移・遷移 ID の数と名前は変えていない。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                         | 担当 | 状態 | メモ |
| --- | ---------------------------- | ---- | ---- | ---- |
| 1   | 冒頭を目的・適用範囲に分ける | BA   | open | -    |
| 2   | 図の表示名を直し、検査を通す | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-sample]]: 手入れの対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 従う規則
