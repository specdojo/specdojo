---
specdojo:
  id: prj-0001:pjr-q4cd-untangle-schedule-dashboard-cycle
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
  registered_at: "2026-10-21T22:08:53Z"
  derived_from:
    - PJR-T30J
---

# PJR-Q4CD schedule から dashboard への import を外し、3 機能をまたぐ循環をほどく

## 1. 概要

PJR-T30J で、schedule → dashboard → exec → schedule と schedule → dashboard → routine → exec → schedule の 2 組の循環が見つかった。どちらも schedule/strategy-generate-scope.ts から dashboard/timeline-build.ts への import 1 か所を通るため、これを外して 2 組をほどき、依存の向きを ESLint で検査する

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
