---
specdojo:
  id: prj-0001:pjr-t123-cdfd-template-d2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-15T14:35:45Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-PMK6
  commit_type: docs
  commit_scope: kata
  approach: template-maintenance
  targets:
    - specdojo:cdfd-template
---

# PJR-T123 cdfd-template の図の枠を D2 にする

## 1. 概要

Mermaid のまま残る図の枠を、overview・uc の template と同じ D2 にそろえる

## 2. 入力

- cdfd-overview-template・cdfd-uc-template は D2 の図の枠を持つが、cdfd-template は Mermaid の枠のまま残っている（2026-11-15）
- 図の枠を [[specdojo:cdfd-d2-rulebook]] と overview・uc の template にならって D2 にする。全体概要が Mermaid を宣言した場合の扱いは cdfd-rulebook の記法の選択の規定に合わせて書く
- 0.8.0（PJR-PMK6）で型を極力最新にする方針に含める（2026-11-15、利用者が承認）

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
