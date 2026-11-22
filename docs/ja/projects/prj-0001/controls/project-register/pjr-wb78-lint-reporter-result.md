---
specdojo:
  id: prj-0001:pjr-wb78-lint-reporter-result
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-22T03:13:28Z"
  derived_from:
    - PJR-G3TT
---

# PJR-WB78 reporter が書いた result を、書き込む前に lint していない

## 1. 概要

reporter の出力で lint に落ちる語（中国語の字など）が result に入り、親の検証や統合の commit で止まる。runner が result を書く前に lint し、落ちたら reporter をやり直すか直す。

## 2. 入力

- 2026-11-22、QTZ7 の result に reporter（gemma）が中国語の簡体字（U+4E2A）を書き、lint-md で止まった。G3TT ではバッククォートのエスケープで止まった。
- 利用者の承認（2026-11-22、indie）で起票した。

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
