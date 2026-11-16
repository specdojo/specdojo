---
specdojo:
  id: prj-0001:pjr-nht7-worktree-cleanup-outside-lifecycle-lock
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
  registered_at: "2026-11-16T13:06:20Z"
  derived_from:
    - PJR-30SA
  commit_type: fix
  commit_scope: exec
---

# PJR-NHT7 統合の後の worktree の片付けが登録簿のロックの中で走り、記帳と specdojo git を長く待たせる

## 1. 課題内容

runner が統合の後の git worktree remove を exec-lifecycle のロックの中で行うため、遅いファイルシステムでは片付けの間ずっと記帳と specdojo git が待たされる

## 2. 入力

- 2026-11-16、PJR-1Y1M の統合の後の git worktree remove に 23 分以上かかった。その間の CPU 時間は 4 秒で、ほとんどがディスクの待ちだった（共有フォルダの bind mount、PJR-TATP）
- その間、specdojo git -- worktree add が exec-lifecycle のロックの空きを 25 分待った
- removeWorktree は src/exec/run/register-worktree.ts の finalizeRegisterWorktreeRun の中で呼ばれ、lifecycleLock.runExclusive の中にある

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
