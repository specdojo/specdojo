---
specdojo:
  id: prj-0001:pjr-fs9a-stsd-rulebook-transition-id-renumber
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-06T11:53:13Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-FS9A stsd-rulebook の遷移 ID を確定までは振り直せるようにする

## 1. 概要

遷移 ID は status が draft のあいだは通し番号に振り直してよく、確定（ready）した後は振り直さず欠番を残す規則にする

## 2. 入力

- 利用者のレビュー: `T-<nn>` の番号は下書きのあいだの追加・削除で欠番が出る。欠番を気にしない（A）、略号にする（B）、確定までは振り直してよい（C）を比べ、C とする。確定（status: ready）した後は振り直さず欠番を残し、外からの参照を変えない（2026-11-06 indie が決定）

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
