---
specdojo:
  id: prj-0001:pjr-hcnx-stsd-recipe-transition-id-renumber
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
