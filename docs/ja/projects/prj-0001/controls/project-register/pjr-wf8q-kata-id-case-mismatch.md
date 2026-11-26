---
specdojo:
  id: prj-0001:pjr-wf8q-kata-id-case-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-26T12:39:02Z"
  due_on: "2026-11-30"
---

# PJR-WF8Q 型の ID 表記の食い違いを直す（rulebook の大文字と schema の小文字、imp 系 sample の古い ID）

## 1. 概要

rulebook は based_on などに大文字の PJR-XXXX を求めるが schema は小文字しか許さず、imp-interface-140 の検査が落ちた。imp-business・imp-test・imp-operations の sample は古い ID の cr-2026-004 のまま。

## 2. 入力

- T-KATA-REVIEW-ALL-imp-interface-sample-140 で lint-fm-changed が `based_on` の大文字の PJR-C4A1 で落ちた（2026-11-26）
- imp-business・imp-test・imp-operations の sample が cr-2026-004 を参照している
- 担当 DEV・期限 2026-11-30 は indie の指示（2026-11-26）

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
