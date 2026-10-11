---
specdojo:
  id: prj-0001:pjr-86q5-product-worktree-deps-not-installed
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T13:43:19Z"
---

# PJR-86Q5 プロダクトリポジトリの worktree に依存が導入されない

## 1. 課題内容

worktree 準備はプロジェクト側の依存だけを導入し、プロダクト worktree では npm ci を行わない。executor の sandbox では npm も実行できないため、プロダクトのビルドや検証を exec 内で確認できない

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
