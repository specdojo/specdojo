---
specdojo:
  id: prj-0001:pjr-sbnb-ifx-index-schema-rename
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-15T09:33:55Z"
  depends_on:
    - PJR-QJ41
  commit_type: refactor
  commit_scope: schema
---

# PJR-SBNB ifx-index の schema のファイル名を古い略号 esil から ifx-index に改める

## 1. 概要

esil.schema.yaml を ifx-index の名前へ改め、参照をそろえる。他プロジェクト向けの互換も扱う

## 2. 入力

- indie の指摘（2026-11-15）: ifx-index の schema が docs/specdojo/schemas/v1/esil.schema.yaml で、改名前の略号（ESIL: 外部システム連携一覧）のまま
- PJR-QJ41（ifx-index を Markdown にする）で YAML の正本がなくなる場合は、schema を残すかどうかもあわせて決める。そのため PJR-QJ41 の後に流す

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
