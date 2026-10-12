---
specdojo:
  id: prj-0001:pjr-he9r-per-project-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T12:48:45Z"
  due_on: "2026-10-31"
---

# PJR-HE9R project ごとに parent_validations を足せるようにする

## 1. 概要

exec-defaults.yaml は project 間で共有され、プロダクトリポジトリ向けの { id, repo } を足すと、その repos を持たない project の run で検証が failed になる。exec-defaults を複製せずに、project ごとに親 runner の検証を足せるようにする（`projects.<id>.run` での追加や、exec-defaults の引き継ぎなど）

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
