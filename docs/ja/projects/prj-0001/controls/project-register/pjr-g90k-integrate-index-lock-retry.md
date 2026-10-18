---
specdojo:
  id: prj-0001:pjr-g90k-integrate-index-lock-retry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T16:42:24Z"
  derived_from:
    - PJR-RY4C
---

# PJR-G90K 統合の git 操作が index.lock の一時的な取り合いで待たずに失敗する

## 1. 課題内容

2026-10-19 01:32 と 01:41 に、PJR-EVAX の統合が git restore failed: Unable to create .git/index.lock で失敗した。並行の run の統合や記帳と同じ時刻に重なったためで、ロックはすぐに外れる一時的なものだった。runner の統合の git 操作は index.lock を待たずに失敗し、run を waiting にする。並行の run が多い夜間の自動実行では起こりやすい

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
