---
specdojo:
  id: prj-0001:pjr-tatp-devcontainer-named-volumes
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: OPS
  registered_at: "2026-10-11T22:10:19Z"
---

# PJR-TATP worktrees と node_modules を共有フォルダから named volume へ移す

## 1. 概要

ワークスペース全体が virtiofs の bind mount 上にあり、16 個の node_modules と exec の worktree（計 8GB 程度）がファイル I/O を遅くしている。worktrees/ と各 node_modules を Docker の named volume へ移し、routine cron と exec のパス解決への影響を設計する

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
