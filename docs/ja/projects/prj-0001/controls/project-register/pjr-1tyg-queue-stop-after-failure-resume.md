---
specdojo:
  id: prj-0001:pjr-1tyg-queue-stop-after-failure-resume
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-25T21:58:24Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-32PN
---

# PJR-1TYG exec stop の前に失敗したタスクがあると、列が再開できない状態で終わる

## 1. 課題内容

exec stop で止めたループの段が、止める前に失敗したタスクがあると failed になり、列が completed_with_failures で終わる。同じ exec queue run で止めた段から再開できない。

## 2. 入力

- 2026-11-25 夜、kra-night2 と kra-night3 の列で観測（止める前に止まったタスクがあり、どちらも `completed_with_failures` で終わった）。
- PJR-32PN の完了条件「同じ exec queue run で止めた段から再開できる」は、失敗が無い場合は確かめ済み。

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
