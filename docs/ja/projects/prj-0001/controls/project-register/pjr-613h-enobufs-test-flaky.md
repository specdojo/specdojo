---
specdojo:
  id: prj-0001:pjr-613h-enobufs-test-flaky
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T09:13:21Z"
  due_on: null
---

# PJR-613H ENOBUFS のテストが負荷によって失敗する

## 1. 課題内容

tests/src/exec/worktree.test.ts の reports ENOBUFS のテストは、子プロセスに 64 KB を書かせて maxBuffer 1 KB で止められることを確かめる。負荷が高いと子プロセスが止められる前に書き終えて終了コード 0 になり、status が null でなくなって失敗する

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
