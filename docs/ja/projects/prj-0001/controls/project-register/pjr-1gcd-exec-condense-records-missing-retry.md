---
specdojo:
  id: prj-0001:pjr-1gcd-exec-condense-records-missing-retry
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-14T22:52:38Z"
  derived_from:
    - PJR-52EE
  commit_type: fix
  commit_scope: exec
---

# PJR-1GCD condense_records がない executor の結果を executor の段からやり直す

## 1. 概要

condense_records 欠落を reporter の失敗ではなく executor の失敗として扱う

## 2. 入力

- 2026-11-15 の夜間に bes-index-080 で、qwen が `condense_records` を出さず reporter で止まった。reporter の再実行では直らず、orchestrator が opus で executor の段から手でやり直した

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
