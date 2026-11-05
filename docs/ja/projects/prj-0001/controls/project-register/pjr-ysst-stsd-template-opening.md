---
specdojo:
  id: prj-0001:pjr-ysst-stsd-template-opening
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
  registered_at: "2026-11-05T13:03:41Z"
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-NEPD
  approach: template-maintenance
  targets:
    - specdojo:stsd-template
---

# PJR-YSST stsd-template を新しい冒頭の章立てと図の表示名に合わせる

## 1. 概要

stsd-template を、頭書き・目的・適用範囲の冒頭と、状態名と値の 2 行の表示名に合わせる

## 2. 入力

- 業務仕様の冒頭は、H1 直下の 1〜2 行の頭書き、「1. 目的」（状態を管理する目的と利用者）、「2. 適用範囲」（対象・スコープ、正本の管理場所、状態変更を起こす業務範囲、終了点を置かない理由）に分け、3 章以降は状態一覧・状態遷移図・遷移の説明・今後の検討メモの順とする（PJR-VNT1、cdfd の形に合わせる）
- 状態遷移図の表示名は、状態一覧に値がある場合は「状態名`<br>`値」、値が - の場合は状態名だけとする。`state_id` は英小文字・数字・アンダースコアのため、表示には状態一覧の値を使う。Mermaid の lint で通ることを確かめた（2026-11-05 利用者が決定）

## 3. 完了条件

- [[specdojo:stsd-template]] が、H1 直下の頭書きの記入欄、「1. 目的」「2. 適用範囲」の記入欄、3 章以降の状態一覧・状態遷移図・遷移の説明・今後の検討メモの順になっている。`_DELIVERABLE_OVERVIEW_` は頭書きか適用範囲の記入の指示で 1 回だけ使い、同じことを 2 か所に書かせない。
- 状態遷移図の雛形の表示名が`状態名<br>値`の形になっている。
- 変えるのは対象の Kata だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ |
| --- | ---------------------------------- | ---- | ---- | ---- |
| 1   | 冒頭の記入欄を新しい章立てに直す   | BA   | open | -    |
| 2   | 図の雛形の表示名を直し、検査を通す | BA   | open | -    |

## 5. 対応結果

- 実施内容: executor（sol）が [[specdojo:stsd-template]] を、H1 直下の頭書きの記入欄、「1. 目的」「2. 適用範囲」の記入欄（対象・スコープ、状態の正本、業務範囲、終了点を置かない場合）、3 章以降の順に直した（d48a348e4）。`_DELIVERABLE_OVERVIEW_` は頭書きの指示で 1 回だけ使う。図の雛形の表示名を `状態名<br>値` にした。
- orchestrator の確認: 変わった Kata は `stsd-template` だけで、親の検証はすべて通った。
- 残課題: なし。

## 6. 関連ドキュメント

- [[specdojo:stsd-template]]: 手入れの対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 従う規則
