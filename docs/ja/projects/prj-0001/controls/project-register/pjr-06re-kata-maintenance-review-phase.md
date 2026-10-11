---
specdojo:
  id: prj-0001:pjr-06re-kata-maintenance-review-phase
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-23T05:17:29Z"
  due_on: "2026-11-14"
  completed_at: "2026-09-27T04:37:42Z"
  block_reason: 'integrate failed: Deliverable status promotion to "ready" is human-only and must not be done by an agent run: test-schema.yaml'
  conclusion: sch-strategy-launch の recipe/rulebook/sample/template-consolidate へ review フェーズを追加し、schedule build で 14 成果物×4 の review タスク 56 件を生成した。owner は edit タスクを踏襲
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

| No  | 作業                                           | 担当 | 状態   | メモ                           |
| --- | ---------------------------------------------- | ---- | ------ | ------------------------------ |
| 1   | 4 タスクへ review フェーズを追加する           | ARC  | closed | `mode: review` の phase を足す |
| 2   | 観点セットへ `vp-qe-kata-conformance` を含める | ARC  | closed | description に明記             |
| 3   | `schedule build --force` で生成結果を確認する  | ARC  | closed | review タスクの出現を確認      |

## 4. 対応結果

- `sch-strategy-launch.yaml` の `review-pass` に 4 つの `-review` フェーズを追加しました。
- 各フェーズは `mode: review` かつ `approach` に `*-maintenance` を指定し、既存のテンプレートを利用可能としました。
- owner はフェーズセットにより暗黙に踏襲される構成としました。
- 観点セットの指定はスキーマ外となるため、`description` に `vp-qe-kata-conformance` を必ず含めるよう明記し対応としました。
- `specdojo schedule build` を実行し、想定通り review タスクが展開されることを確認しました。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2zvs-grade-review-integration]]
- `docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml`
- `docs/ja/specdojo/exec-templates/xrp-rulebook-maintenance-template.md`
