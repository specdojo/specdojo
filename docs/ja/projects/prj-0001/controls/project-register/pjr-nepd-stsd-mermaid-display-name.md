---
specdojo:
  id: prj-0001:pjr-nepd-stsd-mermaid-display-name
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T13:03:06Z"
  completed_at: "2026-11-05T16:29:47Z"
  conclusion: 表示名を状態名`<br>`値の 2 行にする定義・規則・例にし、stsd-rulebook への参照を新しい章に直した
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-F1FD
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-mermaid-rulebook
---

# PJR-NEPD stsd-mermaid-rulebook の表示名を状態名と値の 2 行にする

## 1. 概要

状態遷移図の表示名を、値がある場合は「状態名`<br>`値」にする規則へ変え、stsd-rulebook の新しい章立て（概要から目的・適用範囲へ）への参照を直す

## 2. 入力

- 状態遷移図の表示名は、状態一覧に値がある場合は「状態名`<br>`値」、値が - の場合は状態名だけとする。`state_id` は英小文字・数字・アンダースコアのため、表示には状態一覧の値を使う。Mermaid の lint で通ることを確かめた（2026-11-05 利用者が決定）
- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）

## 3. 完了条件

- [[specdojo:stsd-mermaid-rulebook]] の表示名の定義と規則が、値がある状態は `state "状態名<br>値" as state_id`、値が `-` の状態は `state "状態名" as state_id` となっている。表示名の 1 行目は状態一覧の状態名、2 行目は状態一覧の値と一致させる、と書いている。分割図で共有する状態も同じ表示名にする。
- 規則の例（コードブロック）が新しい表示名になっている。
- [[specdojo:stsd-rulebook]] の「概要」への参照を、新しい章（目的・適用範囲）への参照に直している。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 表示名の定義・規則・例を直す             | BA   | open | -    |
| 2   | stsd-rulebook への参照を直し、検査を通す | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-mermaid-rulebook]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: そろえる先
