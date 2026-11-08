---
specdojo:
  id: prj-0001:pjr-stm9-business-specs-reps-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:37:07Z"
  block_reason: "parent validation failed: lint-fm"
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
  - `sf-task-execution`・`ifx-cmd-ai-provider-cli`（PJR-V6RB）と `clis-exec-commands`（PJR-8J47 で `uis-exec-commands` から付け替える）
- 各対象の段が、作成 → 磨き込み（fully-guided）→ 冗長さの整理（condense）→ agent の review → 確定（人）の順になっている。`approach_rules` の `intent` は、対象がまだない成果物を型から作る `author-deliverable` を基本とし、生成の結果がこの並びにならない場合は、どの intent を選んだかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 書き込みの前に `--dry-run` で差分を確かめ、`schedule build --project prj-0001 --track business-specs-reps` で `sch-track-business-specs-reps.yaml` を作っている。
- ほかの track の strategy・track と `sch-milestones.yaml` のうち business-specs-reps と関係のない項目を変えていない。
- `specdojo exec validate --project prj-0001 --schedule-only`・`npm run validate:schema`・`npm run lint:md` が通っている。
- schedule のタスクの実行（`exec run --auto`）はこの項目では行わない。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                                                   |
| --- | -------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------- |
| 1   | 対象の 8 件と型の grade を確かめ、`--dry-run` で strategy を生成する | DEV  | done | scope 8 件、Kata grade（bdd/bes 評価済み）と実装エビデンスを確認       |
| 2   | strategy を書き込み、track を作る                                    | DEV  | done | sch-strategy (40 tasks, 11 milestones) と sch-track を生成・反映       |
| 3   | 検査を流し、選んだ intent と理由を対応結果に書く                     | DEV  | done | schedule validate, validate:schema, lint:md 全て pass。選定理由を記載 |

## 5. 対応結果

- 成果物:
  - `docs/ja/projects/prj-0001/schedule/sch-strategy-business-specs-reps.yaml`（新規作成: 40 tasks, 11 milestones）
  - `docs/ja/projects/prj-0001/schedule/sch-track-business-specs-reps.yaml`（新規作成: 40 tasks）
  - `docs/ja/projects/prj-0001/schedule/sch-milestones.yaml`（更新: `business-specs-reps` 由来の phase gates 3件 + group milestones 8件の計 11件を追加）
- 対象 8 件のスコープ定義:
  - `bdd-register-entry` (`dct-data-model-bdd.yaml`)
  - `ccd-project-planning` (`dct-data-model-ccd.yaml`)
  - `cdt-register-type` (`dct-data-model-cdt.yaml`)
  - `br-task-selection-strategy` (`dct-business-model-br.yaml`)
  - `bes-task-ready-selected` (`dct-business-model-bes.yaml`)
  - `sf-task-execution` (`dct-system-functions.yaml`, PJR-V6RB)
  - `ifx-cmd-ai-provider-cli` (`dct-external-interface-specs.yaml`, PJR-V6RB)
  - `clis-exec-commands` (`dct-external-interface-specs.yaml`, PJR-8J47)
- 各成果物の段の構成:
  - 全 8 件において、要求された「作成 → 磨き込み（fully-guided） → 冗長さの整理（condense） → agent の review → 確定（人）」の 5 段構成（計 40 タスク）を実現した。
- 選定した intent と理由:
  - 実装エビデンスが存在する 6 件（`bdd-register-entry`, `ccd-project-planning`, `cdt-register-type`, `sf-task-execution`, `ifx-cmd-ai-provider-cli`, `clis-exec-commands`）:
    - 選定 intent: `reflect-implementation`（→ approach: `retrofit`）
    - 理由: 親 epic（[[prj-0001:pjr-2gd6-business-specs-reps|PJR-2GD6]]）の方針「実装と同じことを 2 回書かない」「実装参照に寄せる」に従い、既存の実装エビデンス（`evidence_refs`）からドラフトを作成するアプローチを採用した。`retrofit` profile により、`retrofit-pass`（作成） → `refine-pass`（磨き込み: fully-guided） → `condense-pass`（整理） → `retrofit-review-pass`（agent review: 実装照合） → `finalize-pass`（確定: 人）が導出され、完了条件の並びを満たす。また、YAML サンプル等で Kata grade が未評価の成果物であっても実装エビデンスにより安定して生成できる。
  - 実装エビデンスが存在しない純粋な仕様・ルール 2 件（`br-task-selection-strategy`, `bes-task-ready-selected`）:
    - 選定 intent: `author-deliverable`（→ approach: `freeform`）
    - 理由: 実装エビデンスを持たず新規に型から書き起こす仕様であるため `author-deliverable` を指定した。Kata grade の一部が不足していたため、`bdd-rulebook.md`（pass: 90点）および `bes-sample.md`（fail: 50点）の評価を実施した上で、`freeform` approach を採用した。`freeform` profile により、`freeform-pass`（作成） → `refine-pass`（磨き込み: fully-guided） → `condense-pass`（整理） → `review-pass`（agent review） → `finalize-pass`（確定: 人）が導出され、完了条件の並びを満たす。
- 他 track との分離:
  - `sch-milestones.yaml` において他 track（planning 等）の差分が混入しないよう、`business-specs-reps` 由来の 11 件のみを厳格にマージした。
  - カタログ本体（`dct-*.yaml`）および `tml-index.yaml` は変更していない。
- 検証結果:
  - `specdojo exec validate --project prj-0001 --schedule-only`: OK (passed)
  - `npm run validate:schema`: OK (passed, strategy/track/milestones 全て schema 適合)
  - `npm run lint:md`: OK (passed)
- CHANGELOG に書く事項:
  - なし（プロジェクト内部のスケジュール策定作業のため）
- 残課題:
  - なし（後続のスケジュールタスク実行は別個票にて実施予定）

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 規範: [[specdojo:schedule-design-guide]]
- 先行: [[prj-0001:pjr-v6rb-catalog-add-sf-uis-ifx-reps]]、[[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
