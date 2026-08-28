---
specdojo:
  id: prj-0001:pjr-ez9g-sch-strategy-bootstrap-human-review
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T01:11:57Z"
  due_on: null
  register_events:
    - v: 1
      id: reg_4d56d315bf6760ed77f32470787b273b
      ts: "2026-08-12T01:18:15Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(prj-0001): register bootstrap/refine-pass quality improvement proposals"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: "sch-strategy: bootstrap後にhuman review ゲートを追加"
        - field: description
          from: ""
          to: "cdfd-overview/cdfd-initのbootstrap完了後、cross_deliverable_passesでhuman review（approach: bootstrap-finalize流用、after_gate: G-DATA-FLOW-bootstrap-pass、before_phase_set: retrofit-pass）を挟み、Kata・代表成果物の品質を8成果物への複製前に確認する。次回sch-strategy-data-flow.yaml改訂時に反映する。適用前にcross_deliverable_passes x execution:humanの組み合わせをdry-runで検証すること。"
        - field: type
          from: ""
          to: note
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-12"
        - field: due
          from: ""
          to: "-"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 3648966bca821bf8da59d6b3d185e95f8666f7cd
---

# PJR-EZ9G sch-strategy: bootstrap後にhuman review ゲートを追加

## 1. メモ

cdfd-overview/cdfd-initのbootstrap完了後、cross_deliverable_passesでhuman review（approach: bootstrap-finalize流用、after_gate: G-DATA-FLOW-bootstrap-pass、before_phase_set: retrofit-pass）を挟み、Kata・代表成果物の品質を8成果物への複製前に確認する。次回sch-strategy-data-flow.yaml改訂時に反映する。適用前にcross_deliverable_passes x execution:humanの組み合わせをdry-runで検証すること。

## 2. 背景・文脈

retrofit-pass-2・refine-pass-2 完了後の状況確認で、次の2点が課題として挙がった。

- bootstrap で作成した代表成果物（`cdfd-overview` / `cdfd-init`）と Kata（rulebook / recipe / sample / template）一式の品質が低く、以後の retrofit-pass・refine-pass で十分な成果物にならない。Kata は bootstrap 後に凍結され、以後の approach（retrofit / fully-guided）では編集対象にならないため、bootstrap の時点でしか品質を直す機会がない。
- 現行の `sch-strategy-data-flow.yaml` には、bootstrap の直後に品質を確認する場が無く、Kata の欠陥が他8成果物の retrofit-pass へそのまま複製されてから、retrofit-pass-2・refine-pass-2 という追加のやり直しサイクルで初めて是正される構造になっていた。

この構造上の課題への対応として、bootstrap 完了後・retrofit-pass 開始前に human review ゲートを挟む設計を提案した。設計は既存の `cross_deliverable_passes` 機構（本プロジェクトの `data-flow-dedup` と同じ仕組み）を流用し、`after_gate: G-DATA-FLOW-bootstrap-pass`（`after_phase_sets: [overview-bootstrap-pass, area-bootstrap-pass]`）、`before_phase_set: retrofit-pass`、`approach: bootstrap-finalize` とする。対象は `cdfd-overview` / `cdfd-init` の成果物と Kata 一式で、10成果物すべての retrofit-pass がこの review を待つ。

合わせて、bootstrap 自体の仕上げ品質を上げるテンプレート改善（[[prj-0001:pjr-sdxb-bootstrap]]）と、refine-pass（`fully-guided`）が rulebook 不適合を直さない問題への対応（[[prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook]]）を別途 todo として起票済み。

## 3. フォローアップ

次回 `sch-strategy-data-flow.yaml` の改訂時に、本メモの設計を反映する。

- `phase_gates` に `G-DATA-FLOW-bootstrap-pass`（scope: `dct-data-flow`, `after_phase_sets: [overview-bootstrap-pass, area-bootstrap-pass]`）を追加する。
- `cross_deliverable_passes` に `bootstrap-kata-review`（`after_gate: G-DATA-FLOW-bootstrap-pass`, `before_phase_set: retrofit-pass`, `execution: human`, `mode: review`, `approach: bootstrap-finalize`, `scope.local_ids: [cdfd-overview, cdfd-init]`）を追加する。
- 適用前に、`cross_deliverable_passes` と `execution: human` の組み合わせが `schedule build` / `exec plan` で意図どおり解決されるかを、検証用の小さい track か `--dry-run` で確認する。想定外の挙動があれば、本チケットへ追記のうえ設計を見直す。
- 差し戻し（`bootstrap-finalize` の確定判断で否認）が発生した場合の運用（`cdfd-overview-005/006` または `cdfd-init-005` を reopen して bootstrap をやり直す）を、適用時に `sch-strategy-data-flow.yaml` のコメントとして明記する。

## 4. 関連ドキュメント

- 適用対象: [[prj-0001:sch-strategy-data-flow]]
- `cross_deliverable_passes` の定義: [[specdojo:schedule-design-guide]]
- `approach` の定義（`bootstrap` / `bootstrap-finalize`）: [[specdojo:ryu-guide]]
- 流用する human result テンプレート（`docs/` 外参照なし、`id` 未登録のため相対パス表記）: `docs/ja/specdojo/templates/xer-human-bootstrap-finalize-template.md`
- 対になる todo: [[prj-0001:pjr-sdxb-bootstrap]]、[[prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook]]
