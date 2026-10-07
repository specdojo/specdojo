---
specdojo:
  id: prj-0001:pjr-vx97-git-diff-dubious-ownership-retry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-07T22:18:25Z"
  due_on: null
---

# PJR-VX97 一時的な dubious ownership で git diff が失敗し、再試行されない

## 1. 課題内容

worktree で Git が一時的に dubious ownership を返すとき、git diff は「fatal: detected dubious ownership」ではなく「warning: Not a git repository. Use --no-index ...」を出して失敗する。exec-worktree.ts の再試行は前者の文言だけを検出するため、git diff は再試行されず、再開前の統合先の取り込みが拒否される。PJR-EZAF の再開（2026-10-08）で発生した。

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
