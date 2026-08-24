---
specdojo:
  id: prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-24T11:34:30Z"
  due_on: "2026-08-31"
---

# PJR-XGJK 実践の型の宣言をrulebook frontmatterへ移行する

## 1. 概要

PJR-3N21 の決定に従い、実践の型の要否と所在の正本を rulebook frontmatter へ一本化する。成果物カタログ208件から型宣言を削除して rulebook の宣言のみを残し、要否を rulebook 側へ移す。src/kata.ts の解決をカタログ優先から rulebook 正本へ変更し、kind が generated の成果物には型を適用しない導出を実装する。schema と検証も決定内容に合わせる。PJR-K4TA と PJR-JT1Y で導入した要否の4状態と判断基準は意味を変えず、置き場所のみを移す。

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
