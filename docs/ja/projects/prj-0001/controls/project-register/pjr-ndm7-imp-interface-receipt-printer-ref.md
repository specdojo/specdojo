---
specdojo:
  id: prj-0001:pjr-ndm7-imp-interface-receipt-printer-ref
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-26T21:00:58Z"
  due_on: "2026-11-30"
---

# PJR-NDM7 imp-interface-sample の印字の波及先を ifx-cmd-sample の参照にする

## 1. 概要

imp-interface-sample の影響詳細一覧の確定済みレシートの印字で、波及先が一覧にない仮の ID ifx-cmd-receipt-printer になっている。ifx-index-sample は変えず、波及先を ifx-cmd-sample の参照にする。

## 2. 入力

- T-KATA-REVIEW-ALL-imp-interface-sample-150 の R5-4 で、波及先 ifx-cmd-receipt-printer が ifx-index-sample にない仮の ID と指摘された（2026-11-26）
- R5-4 は、ready の ifx-index-sample を変えず、本書の波及先を ifx-cmd-sample の参照に寄せる案 (b) にする（indie の判断、2026-11-26）
- R5-1（照会 API 停止時の障害波及を高にした直し）は 150 の直しのまま確定し、追加の作業はしない（indie の判断、2026-11-26）
- 担当 BA・期限 2026-11-30 は indie の指示（2026-11-26）

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
