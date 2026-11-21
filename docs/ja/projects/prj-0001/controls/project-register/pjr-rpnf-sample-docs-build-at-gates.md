---
specdojo:
  id: prj-0001:pjr-rpnf-sample-docs-build-at-gates
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  registered_at: "2026-11-21T23:03:49Z"
  derived_from:
    - PJR-50RQ
---

# PJR-RPNF sample の executor がタスクごとに docs:build を流し、メモリーと時間を使う

## 1. 概要

sample の作成規則の最終チェックが docs:build を求めるため、型の executor が 1 件ごとに 5〜6GB と数分を使う。タスクごとのチェックから外し、波の区切りと release の前に 1 回流す運用にする。

## 2. 入力

- 2026-11-21 の夜、型の executor の docs:build（5.8GB）でコンテナのメモリーと swap が尽きかけた。
- runner は executor が `not_run` と報告した検証を、親の検証が肩代わりしない限り失敗にする（src/exec/reporter.ts）。docs:build は親の検証に入っていない。
- docs:build は deploy の workflow（.github/workflows/deploy.yml）で流れる。check:release には入っていない。
- タスクごとのチェックから外し、区切りで 1 回流す案（A）は indie の決定（2026-11-22）。

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
