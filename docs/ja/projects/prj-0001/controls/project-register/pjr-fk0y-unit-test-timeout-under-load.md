---
specdojo:
  id: prj-0001:pjr-fk0y-unit-test-timeout-under-load
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:04:17Z"
  due_on: "2026-11-30"
---

# PJR-FK0Y 負荷で時間切れになる単体テストを直す

## 1. 概要

統合のときの全件テストの負荷で 5 秒の上限を超える catalogless-target.test.ts と grade-per-document.test.ts を、上限の延長かテストの軽量化で安定させる

## 2. 入力

- 統合の commit の hook は npm test で単体と統合の全件を流す。その負荷で catalogless-target.test.ts が 2 回、grade-per-document.test.ts の excludes an exhausted stage from retries and reports it が 1 回、Test timed out in 5000ms で落ち、run が waiting になった
- どちらも単独では通る（grade-per-document.test.ts は 32 件で約 8 秒、catalogless-target.test.ts の各テストは約 0.4 秒）
- 上限を延ばすか、テストを軽くするか、両方かは executor が決めてよい

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
