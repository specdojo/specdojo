---
specdojo:
  id: prj-0001:pjr-0fct-test-unit-rerun-after-fix
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T07:24:10Z"
  due_on: "2026-08-31"
---

# PJR-0FCT test:unitの1回限定規約に修正後の再実行例外を追加する

## 1. 概要

xep-common-conventions-template.md の「test:unit は1回だけ実行する」規約が、失敗を修正した後の再検証まで禁止すると解釈され、executor が失敗を抱えたまま終了し reporter も完了を確認できずブロックする事象が PJR-K4TA で発生した。無条件の二重実行を防ぐ意図は維持しつつ、失敗を修正した場合は再実行して最終状態を確認する例外を明記する。

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
