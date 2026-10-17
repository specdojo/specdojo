---
specdojo:
  id: prj-0001:pjr-bhmh-pinned-agent-rate-limit-policy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-17T23:11:40Z"
  due_on: null
---

# PJR-BHMH agent を指定した実行で、上限のときに待つか代わりの agent へ切り替えるかを選べるようにする

## 1. 概要

exec run --register などで --executor-by により agent を指定した実行は、上限に達すると waiting で止まり、人が --resume するまで再開しない。解ける時刻まで待って同じ agent で再開する（wait）か、指定した代わりの agent へ切り替えて続ける（fallback）かを、コマンドの引数と exec-defaults の既定で選べるようにする

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
