---
specdojo:
  id: prj-0001:pjr-dt3q-transient-git-retry-not-idempotent
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T09:33:16Z"
  due_on: null
---

# PJR-DT3Q git の一時的な失敗の再試行が worktree の作成で失敗する

## 1. 課題内容

src/exec/worktree.ts は dubious ownership などの一時的な git の失敗を再試行する。git worktree add -b は最初の試みで worktree と branch を作ったうえで失敗を返すことがあり、再試行が branch がすでにあるで失敗して run が waiting になる。2026-10-17 の PJR-MX4F で起きた

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
