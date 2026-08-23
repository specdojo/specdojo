---
specdojo:
  id: prj-0001:pjr-q828-reporter-revalidation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T13:04:00Z"
  due_on: "2026-08-31"
---

# PJR-Q828 reporterが解消済みの検証失敗を再評価できない問題を解消する

## 1. 概要

reporter は executor の evidence.json に記録された検証結果のみを読み、worktree を再検証しない。そのため失敗の原因が解消されていても評価は変わらず、正当な理由でブロックし続ける。PJR-K4TA と PJR-JT1Y の2回連続でオーケストレーターによる代行記入が必要になった。失敗原因が実行環境に起因する場合や解消済みの場合に reporter が再検証できる手段、または再検証済みであることを reporter へ伝える手段を用意する。関連して PJR-0FCT の再実行例外と PJR-QVGX のsandbox制約も同じ詰まりに寄与している。

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
