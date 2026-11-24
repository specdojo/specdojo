---
specdojo:
  id: prj-0001:xer-pjr-325y-20261122t141253z-d2176bc0
  type: exec-result
  task_id: PJR-325Y
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-325Y/pjr-325y-20261122T141253Z-d2176bc0/plan.md
  started_at: "2026-11-22T14:13:32.231Z"
  completed_at: "2026-11-22T14:22:46.400Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- PJR-76N9 の決まりを sample と rulebook の作成標準、第 3 波の strategy の 2 段の説明、template 6 件（cnd・cxd・cpd・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy）、共通レビュー観点（網羅種別 `stakeholder` と観点 4 件）に入れ、YAML の表示ページの fixture `specdojo--pm-review-viewpoints.md.snap` を新しい出力に合わせた。カタログの `done_criteria` は直す行がなかった。個票の作業内容と対応結果を書いた。track の作り直しと型の grade は完了条件どおり orchestrator に残した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml`: 変更、+4 / -0 行
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: 変更、+7 / -7 行
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md`: 変更、+3 / -0 行
- `docs/ja/specdojo/standards/sample-authoring-standard.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/templates/cnd-template.md`: 変更、+13 / -23 行
- `docs/ja/specdojo/templates/cpd-template.md`: 変更、+6 / -6 行
- `docs/ja/specdojo/templates/cxd-template.md`: 変更、+9 / -9 行
- `docs/ja/specdojo/templates/sysd-critical-flows-template.md`: 変更、+6 / -14 行
- `docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md`: 変更、+13 / -24 行
- `docs/ja/specdojo/templates/sysd-index-template.md`: 変更、+11 / -21 行
- `tests/fixtures/yaml-pages/specdojo--pm-review-viewpoints.md.snap`: 変更、+12 / -12 行

## 3. 申し送り

- track の作り直し: `sch-strategy-kata-wave-3.yaml` の `rulebook-maintenance` と `sample-maintenance` の段の説明を変えたため、orchestrator が `kata-wave-3` の track を作り直す。tsp-index で流している試しへの反映の要否も判断する。
- 型の grade: 統合の後に、直した template 6 件（cnd・cxd・cpd・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy）と、sample・rulebook の作成標準を orchestrator が grade する。
- 迷って決めたこと: 未決事項やメモの表の「担当ロール」「判断者」列は文書の作業の割り当てとして外した。cnd-template の「検証・承認前の確認」と sysd-critical-flows-template の「承認対象と公開前条件」は承認の記録の参照だけだったため節ごと外した。運用の一次対応・ルールの Owner・例外の判断者・SSOT の更新責任は文書の中身として残した。カタログの `done_criteria` の「〜を承認できること」、RACI、受入テストの承認者は対象外として直さなかった。
- rulebook と sample に残る役割の記述: cnd-rulebook の 6.1 と「検証・承認前の確認」、sysd-cross-cutting-policy-rulebook の概要、prj-issues-and-approach-rulebook の承認者、prj-issues-and-approach-template・stsd-template・cdfd-template の「誰が……判断するか」、cnd-sample の Person の「判断・確認の責務」列などは、第 3〜6 波と kata-slim-3 で直す。
- CHANGELOG に書く事項（個票の 5.5 にも記載）: 区分は Changed。文案は「sample と rulebook の作成標準、C4 図と SYSD の template、共通レビュー観点で、文書の役割の割り当てと承認の進み具合を本文に求めないようにした（RACI・体制など役割を扱う文書は対象外）」。
- 保護された設定の変更は無い。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
