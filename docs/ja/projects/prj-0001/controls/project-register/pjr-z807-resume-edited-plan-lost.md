---
specdojo:
  id: prj-0001:pjr-z807-resume-edited-plan-lost
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-01T12:30:43Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-RKHR
---

# PJR-Z807 executor から再開したとき、直した plan が統合で元の plan に置き換わる

## 1. 課題内容

exec resume --resume-from executor で worktree の plan を直して再開すると、executor は直した plan を読むが、統合の commit には再生成した元の plan が入り、追加の指示が履歴に残らない

## 2. 入力

- T-DATA-FLOW-USAGE-cdfd-overview-010 を worktree の plan に追加の指示を足して --resume-from executor で再開したところ、統合時に runner が Discarding regenerated files in worktree: …-plan.md と出力し、統合された plan に追加の指示が残らなかった（2026-11-01）
- exec-operation-guide は、worktree の編集済み plan を executor と reporter へ渡すと書いている。今回の経緯は orchestrator が result に追記した（ad2da9ee0）

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
