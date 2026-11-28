---
specdojo:
  id: prj-0001:pjr-avcb-note-close-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-28T07:20:46Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CA6G
---

# PJR-AVCB note を done で close できるように rulebook と CLI を直す

## 1. 概要

PJR-CA6G の決定に沿って、register close で note を done にできるようにし、pjr-rulebook と登録簿運用ガイドとオーケストレーター本文の note の扱いを直す

## 2. 入力

- PJR-CA6G で note を done で close できるようにすると決めた（indie、2026-11-28）。rejected・deferred は note に使わない
- 今は src/register/update.ts が note の close を拒んでいる
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

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
