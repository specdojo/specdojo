---
specdojo:
  id: prj-0001:pjr-6sfb-stsd-deliverable-opening
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
  registered_at: "2026-11-05T13:09:19Z"
  derived_from:
    - PJR-3APD
    - PJR-VNT1
  depends_on:
    - PJR-SWRE
    - PJR-P9SW
  approach: fully-guided
  targets:
    - prj-0001:stsd-deliverable
---

# PJR-6SFB stsd-deliverable の冒頭と図の表示名を新しい Kata に合わせる

## 1. 概要

stsd-deliverable の「概要」を頭書き・目的・適用範囲に分け、状態遷移図の表示名を状態名と値の 2 行にする。内容は変えない

## 2. 入力

- PJR-VNT1 の決定に合わせて手入れした stsd の Kata（PJR-F1FD・PJR-NEPD・PJR-YSST・PJR-SWRE・PJR-P9SW）に合わせる。状態・遷移・条件などの中身は schedule の磨き込み・condense・review を通った内容を保つ

## 3. 完了条件

- [[stsd-deliverable]] の冒頭が、H1 直下の 1〜2 行の頭書き、「1. 目的」「2. 適用範囲」になっている。これまでの「概要」の内容は、意味を変えずに目的か適用範囲へ移している（落とさない、足さない）。
- 状態遷移図の表示名が、値がある状態は`状態名<br>値`、値が `-` の状態は状態名だけになっている。2 行目の値は状態一覧の値と一致する。分割図で共有する状態は同じ表示名である。
- 状態・遷移・遷移 ID・条件の数と中身は変えていない（schedule の磨き込み・condense・review を通った内容を保つ）。章番号が変わったことによる本文中の章の参照は、章のタイトルで直している。
- `stsd-deliverable` 以外の成果物と Kata は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ |
| --- | ------------------------------------ | ---- | ---- | ---- |
| 1   | 冒頭を頭書き・目的・適用範囲に分ける | BA   | open | -    |
| 2   | 図の表示名を直し、検査を通す         | BA   | open | -    |

## 5. 対応結果

- 実施内容: [[prj-0001:stsd-deliverable|ステータス定義（成果物）]] の冒頭を頭書き・目的・適用範囲へ再構成し、図の表示名 3 件を `状態名<br>値` にした。本文に番号による章参照はなかった。
- 確かめたこと（orchestrator）: 編集の前後で状態一覧・遷移表・図の矢印が一致し、図の表示名がすべて状態一覧と一致する。変更は対象文書のみ。markdownlint と Prettier に合格。
- 残課題: review の指摘（`T-02` の承認者・受入条件、降格・復帰・廃止の扱い、値検証の根拠）は内容保持の条件により未解消で、確定の段（人）の材料として申し送る。

## 6. 関連ドキュメント

- [[stsd-deliverable]]: 対象の成果物
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: 手入れした Kata（PJR-VNT1）
