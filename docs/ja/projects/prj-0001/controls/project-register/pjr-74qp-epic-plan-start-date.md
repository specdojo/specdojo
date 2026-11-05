---
specdojo:
  id: prj-0001:pjr-74qp-epic-plan-start-date
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-05T23:58:10Z"
  derived_from:
    - PJR-PE19
---

# PJR-74QP 全体計画の epic の開始日を子の todo の着手から求める

## 1. 概要

epic は run で流さず着手の記録がないため、dashboard の全体計画の開始日がすべて未定になる。子の todo の最初の着手などから開始日を求める

## 2. 入力

- 由来: PJR-PE19 の統合後に orchestrator が dashboard build を実行した。epic 3 件（PJR-3APD・PJR-GEZN・PJR-GQN3）とも開始日が未定、稼働日数が - で、ガントに期間が出ない（2026-11-06）
- 原因の見立て: PE19 は開始日を epic 自身の着手 event から取るが、epic は exec run --register の対象外で start が記帳されない（2026-11-06）
- `_UNDECIDED_:` 開始日の求め方（子の todo（`derived_from` が epic）の最初の start、子がなければ epic の `registered_at` など）。利用者の確認が要る（2026-11-06）

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
