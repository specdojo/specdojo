---
specdojo:
  id: prj-0001:pjr-2cqr-routine-state-running-shows-previous-result
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-10-15T21:39:09Z"
  due_on: null
---

# PJR-2CQR 実行中の routine が前回の結果のまま表示される

## 1. 課題内容

routine run は開始時に routine-state.json の last_run だけを更新し、前回の last_result と last_reason を残す。実行中の routine list は今回の開始時刻と前回の結果（failure など）を並べて表示するため、実行中の Run が失敗したように見える

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
