---
specdojo:
  id: prj-0001:pjr-tc62-item-commit-type-scope
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
  registered_at: "2026-10-31T02:42:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
---

# PJR-TC62 個票に commit の type と scope を持たせる

## 1. 概要

プロダクトのリポジトリの commit の type と scope を項目ごとに選べるよう、個票に commit_type と commit_scope を持たせ、register add と update で指定できるようにする

## 2. 入力

- PJR-BNMV の決定: type は個票の `commit_type`、任意の scope は `commit_scope` に持ち、register add / update の --commit-type / --commit-scope で指定する。指定がなければ項目の type から決め（issue は fix、todo・change-request は feat）、この対応も設定で変えられるようにする

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
