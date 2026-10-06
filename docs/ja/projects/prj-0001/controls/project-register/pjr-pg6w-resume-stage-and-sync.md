---
specdojo:
  id: prj-0001:pjr-pg6w-resume-stage-and-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-06T10:18:08Z"
  due_on: null
---

# PJR-PG6W register の resume は executor 段へ戻れず、executor 段の再開でも統合先を取り込まない

## 1. 課題内容

親検証の失敗後の resume は reporter 段から始まり、executor に直させる経路がない（--force-restart は worktree ごと捨てる）。executor 段から再開するときは統合先を merge しないため、保護された設定を人が develop へ適用する手順と噛み合わず、手で merge する必要がある。PJR-27Y0 で両方が起きた。

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
