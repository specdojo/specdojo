---
specdojo:
  id: prj-0001:pjr-3w2n-exec-run-split-shared
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-14T13:49:03Z"
  due_on: null
---

# PJR-3W2N exec-run.ts の共通部と agent の pipeline を分ける

## 1. 概要

src/exec-run.ts（8,584 行）のうち、実行モードに共通の型・agent の解決・worker pool・再試行と、executor / reporter の pipeline（runAgentPipeline・runReporterStage）を別のモジュールへ移す。動作は変えない

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
