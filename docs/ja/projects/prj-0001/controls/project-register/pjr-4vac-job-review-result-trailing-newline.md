---
specdojo:
  id: prj-0001:pjr-4vac-job-review-result-trailing-newline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-12T09:14:18Z"
---

# PJR-4VAC Job Run の review の result が末尾改行を欠き commit 前の検査で統合が止まる

## 1. 課題内容

Job Run の review の後に runner が verdict を書き込む fillIncompleteJobReviewResult と overrideJobReviewDecision が result を整形せず末尾改行を欠くため、review の記録の commit が markdownlint の MD047 で失敗し、すべての Job Run が統合されない

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
