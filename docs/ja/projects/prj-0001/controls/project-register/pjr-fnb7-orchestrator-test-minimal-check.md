---
specdojo:
  id: prj-0001:pjr-fnb7-orchestrator-test-minimal-check
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
  registered_at: "2026-11-15T14:18:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-3R8F
  commit_type: test
  commit_scope: exec
---

# PJR-FNB7 対話型オーケストレーターのテストを Vitest で最小検証する

## 1. 概要

Quick Start の代表的な対話 1 本を、固定の発言のシナリオで実オーケストレーターに流し、承認前後の状態を機械的に確かめる

## 2. 入力

- PJR-3R8F の暫定のお勧め（D：Vitest を中心とする独自構成を土台にし、対話の出来の採点が要るときに Promptfoo を足す）を確かめるための最小検証である（2026-11-15、利用者が進め方を承認）
- Quick Start の代表的な対話（起票の提案 → 承認 → 実行）を、利用者の発言を固定したシナリオにする。実オーケストレーター（claude CLI の会話の継続）を一時 Git リポジトリで動かす
- 合否条件: 承認の発言の前に、個票・イベント・Git の HEAD と作業ツリーが変わっていない。承認の後に、期待した個票・イベント・commit がある。N 回（例: 5 回）流して合格率と所要時間・費用を記録する
- 実 agent を呼ぶため npm test には入れず、任意のテスト群（別の script）とする。結果を PJR-3R8F の採択理由に書き、3R8F を決める材料にする

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
