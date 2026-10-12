---
specdojo:
  id: prj-0001:pjr-bjtc-job-review-not-run-blocks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-12T09:51:26Z"
---

# PJR-BJTC Job Run の review で executor の not_run が統合を止める

## 1. 課題内容

Job Run の review（mode: review）でも、executor が実行しなかった任意の確認を not_run と記録すると edit と同じ規則で run が止まり、verdict が complete-with-findings でも統合されない。review では verdict で統合を判断し、not_run では止めない

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
