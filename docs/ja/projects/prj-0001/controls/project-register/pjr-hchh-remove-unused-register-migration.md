---
specdojo:
  id: prj-0001:pjr-hchh-remove-unused-register-migration
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
  registered_at: "2026-11-21T14:01:58Z"
  derived_from:
    - PJR-GV43
---

# PJR-HCHH register migrate の削除で呼ばれなくなった移行の関数を消す

## 1. 概要

PJR-GV43 で register migrate を消したため、src/register/migrate-timestamps.ts と register.ts の migrateEmbeddedRegisterEvents・migrateRegisterEventsFromGit に呼び出し元がない。使われていないことを確かめて消す

## 2. 入力

- PJR-GV43 の対応結果の残課題（2026-11-21）: migrate-timestamps.ts と migrateEmbeddedRegisterEvents・migrateRegisterEventsFromGit は、register migrate の削除で呼び出し元がなくなった。別の項目で削除を判断する
- 利用者の決定（2026-11-21、indie）: 夜の間に流す

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
