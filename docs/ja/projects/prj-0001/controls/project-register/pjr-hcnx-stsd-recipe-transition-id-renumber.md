---
specdojo:
  id: prj-0001:pjr-hcnx-stsd-recipe-transition-id-renumber
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-06T12:33:02Z"
  due_on: null
  derived_from:
    - PJR-3APD
    - PJR-FS9A
  depends_on:
    - PJR-FS9A
  approach: recipe-maintenance
  targets:
    - specdojo:stsd-recipe
---

# PJR-HCNX stsd-recipe の遷移 ID の手順を確定前の振り直しに合わせる

## 1. 概要

stsd-recipe の作成手順の、更新時に常に既存 ID を保つ記述を、PJR-FS9A の規則（確定前は振り直し可、確定後は不変、振り直しの記録）に合わせる

## 2. 入力

- PJR-FS9A の確認で、stsd-recipe の「全体の作成手順」に、更新では常に既存 ID を保つ記述が残っていると分かった。FS9A の executor も後続対応として記録した（2026-11-06）
- 遷移 ID は確定前（status: draft）は図と表の順に振り直してよく、確定後は振り直さない（PJR-FS9A、C 案、2026-11-06 indie が決定）

## 3. 完了条件

- [[specdojo:stsd-recipe]] の作成手順と問いが、[[specdojo:stsd-rulebook]] の遷移 ID の規則に合っている。確定前（`status: draft`）は遷移の追加・削除・並べ替えに合わせて図と表の順に `T-01` から振り直してよく、振り直したときは旧 ID と新 ID の対応を作業の記録に残す。確定（`status: ready`）した後は既存 ID を保ち、削除した ID を再利用しない。
- 更新時に常に既存 ID を保つという記述が、確定後に限る形になっているか、上の規則への参照に置き換わっている。
- 遷移 ID 以外の手順・問い・例は変えていない。
- 変えるのは `stsd-recipe` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ |
| --- | ------------------------------------ | ---- | ---- | ---- |
| 1   | 遷移 ID の手順と問いを規則に合わせる | BA   | open | -    |
| 2   | 検査を通す                           | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-recipe]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: 遷移 ID の規則（PJR-FS9A）
