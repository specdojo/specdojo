---
specdojo:
  id: prj-0001:pjr-t4g3-exec-block-after-actor-switch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-14T22:53:22Z"
  derived_from:
    - PJR-52EE
  commit_type: fix
  commit_scope: exec
---

# PJR-T4G3 claim した agent と別の agent の段で失敗しても blocked にする

## 1. 概要

pipeline の失敗時は claim した actor に依らず blocked へ遷移させる

## 2. 入力

- 2026-11-15 の夜間に dct-index-080 と sysd-cross-cutting-policy-080 で、agy-gpt-oss-executor が claim したあと別の agent が段を進め、失敗時の block が「task is being worked on by another actor」で弾かれ doing のまま残った

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
