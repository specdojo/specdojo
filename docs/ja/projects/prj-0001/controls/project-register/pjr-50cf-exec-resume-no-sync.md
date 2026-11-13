---
specdojo:
  id: prj-0001:pjr-50cf-exec-resume-no-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-13T14:08:05Z"
---

# PJR-50CF exec resume が worktree を統合先の新しい commit に同期しない

## 1. 課題内容

統合先で直した不具合が、再開した schedule のタスクの worktree に入らず、同じ親の検証で落ち続けた

## 2. 入力

- 2026-11-14 の kata-wave-1 でも起きた。develop の直しを再開したタスクに入れるため orchestrator が worktree の branch へ手で develop を merge したが、executor が同じファイル（sidebar-config.ts）を直していると merge が止まり、黙って失敗していた。再開のときに統合先と同期し、ぶつかったら知らせる必要がある

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
