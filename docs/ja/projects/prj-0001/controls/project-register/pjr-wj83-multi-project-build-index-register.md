---
specdojo:
  id: prj-0001:pjr-wj83-multi-project-build-index-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-11T11:09:50Z"
---

# PJR-WJ83 project が複数あると specdojo build の index build が他 project の登録簿の欠落で失敗する

## 1. 課題内容

--project なしの specdojo build は current_project の登録簿しか生成しないが、index build は全 project の generated/pjr-index.md を要求するため、生成物のない新しい worktree では project が複数あると必ず失敗する

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
