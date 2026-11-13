---
specdojo:
  id: prj-0001:pjr-c8j8-docs-site-kata-sidebar-auto
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T21:50:28Z"
  commit_type: feat
  commit_scope: docs-site
---

# PJR-C8J8 文書サイトの型のメニューを、型の文書から自動で作る

## 1. 概要

sidebar-config.ts に型の文書を手で足す決まりを、rulebook・recipe・sample・template の frontmatter や置き場所から自動で作る形に変え、足し忘れで develop のテストが落ちないようにする

## 2. 入力

- 2026-11-14 の kata-wave-1 で、初期整備が作った recipe・template を型のメニューに足し忘れ、tests/packages/docs-site/sidebar-kata.test.ts が develop で落ちて、後に続くタスクの親の検証がすべて止まった（cxd・ifx-index など 3 回）
- 段の説明に「メニューにも足す」と書いても守られなかった。executor が足した場合も、develop の直しと sidebar-config.ts でぶつかった

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
