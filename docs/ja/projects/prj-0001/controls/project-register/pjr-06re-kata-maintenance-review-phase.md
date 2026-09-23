---
specdojo:
  id: prj-0001:pjr-06re-kata-maintenance-review-phase
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-23T05:17:29Z"
  due_on: "2026-11-14"
---

# PJR-06RE kata 保守タスクへ review フェーズを追加する

## 1. 概要

PJR-2ZVS の決定のうち schedule 経路を実装する。sch-strategy-launch.yaml の recipe-consolidate / rulebook-consolidate / sample-consolidate / template-consolidate へ review フェーズを追加し、既存の xrp-\*-maintenance テンプレートを使う。owner ロールは各 edit タスクの owner を踏襲し、観点セットに vp-qe-kata-conformance を必ず含める。

## 2. 完了条件

- `sch-strategy-launch.yaml` の `recipe-consolidate` / `rulebook-consolidate` / `sample-consolidate` / `template-consolidate` に review フェーズが追加されている。
- 各 review フェーズが既存の `xrp-recipe-maintenance-template` / `xrp-rulebook-maintenance-template` / `xrp-sample-maintenance-template` / `xrp-template-maintenance-template` を使う。新しいテンプレートを作らない。
- owner ロールは各 edit タスクの owner を踏襲している。
- 観点セットに `vp-qe-kata-conformance` が含まれている。
- `specdojo schedule build --track <track> --force` が通り、生成された Schedule に review タスクが現れる。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                           |
| --- | ---------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | 4 タスクへ review フェーズを追加する           | ARC  | open | `mode: review` の phase を足す |
| 2   | 観点セットへ `vp-qe-kata-conformance` を含める | ARC  | open | role セットの確認              |
| 3   | `schedule build --force` で生成結果を確認する  | ARC  | open | review タスクの出現を確認      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- `docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml`
- `docs/ja/specdojo/exec-templates/xrp-rulebook-maintenance-template.md`
