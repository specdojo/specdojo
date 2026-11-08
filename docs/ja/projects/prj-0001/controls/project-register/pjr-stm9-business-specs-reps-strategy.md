---
specdojo:
  id: prj-0001:pjr-stm9-business-specs-reps-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:37:07Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-V6RB
    - PJR-RZ9Q
    - PJR-HQVE
    - PJR-6MCW
    - PJR-PJYJ
    - PJR-8J47
  approach: strategy-planning
  targets:
    - track:business-specs-reps
---

# PJR-STM9 業務仕様の代表の schedule（business-specs-reps）を作る

## 1. 概要

代表 8 件を対象にした sch-strategy-business-specs-reps.yaml を作り、作成・磨き込み・condense・review・確定（人）の段で schedule build する

## 2. 入力

- 対象: bdd-register-entry・ccd-project-planning・cdt-register-type・br-task-selection-strategy・bes-task-ready-selected と、PJR-V6RB でカタログに足す sf・uis・ifx の各 1 件（indie が決定）。
- agent の review の段を残す（indie が決定）。段の並びは schedule strategy generate --dry-run で先に確かめる。

## 3. 完了条件

- `docs/ja/projects/prj-0001/schedule/sch-strategy-business-specs-reps.yaml` を、`schedule strategy generate --project prj-0001 --track business-specs-reps` で作っている。対象（`scope.catalogs[].local_ids`）は次の 8 件だけである。
  - `bdd-register-entry`・`ccd-project-planning`・`cdt-register-type`・`br-task-selection-strategy`・`bes-task-ready-selected`
  - PJR-V6RB でカタログに足した sf・uis・ifx-cmd の各 1 件（個票の対応結果で `local_id` を確かめる）
- 各対象の段が、作成 → 磨き込み（fully-guided）→ 冗長さの整理（condense）→ agent の review → 確定（人）の順になっている。`approach_rules` の `intent` は、対象がまだない成果物を型から作る `author-deliverable` を基本とし、生成の結果がこの並びにならない場合は、どの intent を選んだかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 書き込みの前に `--dry-run` で差分を確かめ、`schedule build --project prj-0001 --track business-specs-reps` で `sch-track-business-specs-reps.yaml` を作っている。
- ほかの track の strategy・track と `sch-milestones.yaml` のうち business-specs-reps と関係のない項目を変えていない。
- `specdojo exec validate --project prj-0001 --schedule-only`・`npm run validate:schema`・`npm run lint:md` が通っている。
- schedule のタスクの実行（`exec run --auto`）はこの項目では行わない。

## 4. 作業内容

| No  | 作業                                                                 | 担当   | 状態 | メモ |
| --- | -------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 対象の 8 件と型の grade を確かめ、`--dry-run` で strategy を生成する | _TODO_ | open | -    |
| 2   | strategy を書き込み、track を作る                                    | _TODO_ | open | -    |
| 3   | 検査を流し、選んだ intent と理由を対応結果に書く                     | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 規範: [[specdojo:schedule-design-guide]]
- 先行: [[prj-0001:pjr-v6rb-catalog-add-sf-uis-ifx-reps]]、[[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
