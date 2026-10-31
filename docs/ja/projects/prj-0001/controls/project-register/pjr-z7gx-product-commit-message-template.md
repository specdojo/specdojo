---
specdojo:
  id: prj-0001:pjr-z7gx-product-commit-message-template
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
  registered_at: "2026-10-31T02:42:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
  depends_on:
    - PJR-TC62
---

# PJR-Z7GX プロダクトのリポジトリの commit と merge commit の書式を設定で選べるようにする

## 1. 概要

repos[] の commit_subject_template と merge_message_template で、プロダクトのリポジトリへ exec が積む commit の 1 行目と merge commit のメッセージを運用に合わせられるようにする

## 2. 入力

- PJR-BNMV の決定: commit の 1 行目は `repos[].commit_subject_template`（例: {type}({scope}): {title}）、merge commit は `repos[].merge_message_template`（既定は Merge branch '{branch}' into {target} に Refs を付けたもの）。本文の末尾の Refs: `<project-id>`:`<ID>` は常に付ける。設定がなければ今と同じ
- 対象はプロダクトのリポジトリだけ。SpecDojo の記録のリポジトリの記帳の commit（exec(register ...)）は変えない

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
