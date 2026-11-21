---
specdojo:
  id: prj-0001:pjr-r8q3-dependabot-major-evaluation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-20T14:16:17Z"
  derived_from:
    - PJR-P318
---

# PJR-R8Q3 Dependabot の major の更新を評価して上げるかを決める（TypeScript 7・vitest 5 ほか）

## 1. 概要

TypeScript 7・vitest 5・@types/node 26・markdown-it 15・actions/checkout と setup-node 7 の major の更新を、1 つずつ試して上げるかを決める

## 2. 入力

- 利用者の決定（2026-11-20、案 A）: major の更新は minor・patch と分け、担当 DEV が 1 つずつ評価する。期限は未定。今晩の列には入れない
- orchestrator の調べ（2026-11-20）: #36 に TypeScript 6.0.3→7.0.2、vitest 4.1.12→5.1.0、@types/node 25.9.8→26.6.6（ルート）。#40 は markdown-it 14.3.3→15.0.3（docs-site の配る依存）。#35 は actions/checkout と actions/setup-node の 5→7
- orchestrator の見立て（2026-11-20）: TypeScript 7 と vitest 5 は型の検査とテストの動きが変わるおそれがある。package.json・lockfile・.github/workflows は保護された設定のため、変更は案として個票に書き、反映は利用者の承認のもとで行う

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
