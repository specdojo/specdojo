---
specdojo:
  id: prj-0001:pjr-6y05-grade-jobs-drop-agy-grader
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-21T22:55:36Z"
  derived_from:
    - PJR-XA6Y
---

# PJR-6Y05 grade の job が使えなくなった agy の評価者を固定している

## 1. 概要

job-grade-kata と job-grade-deliverable が grade run に --by agy-expert-executor を固定で渡しており、agy を名簿から外したため流すと止まる。評価者を job の入力にする。

## 2. 入力

- agy の member は PJR-N6FQ で名簿から外した（2026-11-21）。
- 評価者は未定。routine（rtn-grade-kata・rtn-grade-recheck・rtn-grade-deliverable-recheck）はすべて enabled: false。
- job の評価者の変更は indie の依頼（2026-11-22）。

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
