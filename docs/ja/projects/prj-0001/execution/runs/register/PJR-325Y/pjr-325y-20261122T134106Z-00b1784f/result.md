---
specdojo:
  id: prj-0001:xer-pjr-325y-20261122t134106z-00b1784f
  type: exec-result
  task_id: PJR-325Y
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-325Y/pjr-325y-20261122T134106Z-00b1784f/plan.md
  started_at: "2026-11-22T13:41:07.644Z"
  completed_at: "2026-11-22T13:49:51.092Z"
  agent: opus-executor
  block_reason: "integrate failed: project: git commit failed: test: error: unknown option '--reserve'; FAIL  /unit/ tests/src/docs/yaml-tables.test.ts > typed YAML display pages > renders tables and the entire folded…"
---

# Edit Result

## 1. 実施内容

- PJR-76N9 の決まりを sample と rulebook の作成標準、第 3 波の strategy の 2 段の説明、template 6 件（cnd・cxd・cpd・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy）、共通レビュー観点（網羅種別 stakeholder と観点 4 件）に入れ、個票の作業内容と対応結果を書いた。カタログの `done_criteria` は直す行がなかった。track の作り直しと型の grade は完了条件どおりオーケストレーターに残した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-3.yaml`: 変更、+4 / -0 行
- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: 変更、+8 / -8 行
- `docs/ja/specdojo/standards/rulebook-authoring-standard.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/standards/sample-authoring-standard.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/templates/cnd-template.md`: 変更、+13 / -23 行
- `docs/ja/specdojo/templates/cpd-template.md`: 変更、+4 / -10 行
- `docs/ja/specdojo/templates/cxd-template.md`: 変更、+9 / -9 行
- `docs/ja/specdojo/templates/sysd-critical-flows-template.md`: 変更、+5 / -13 行
- `docs/ja/specdojo/templates/sysd-cross-cutting-policy-template.md`: 変更、+11 / -16 行
- `docs/ja/specdojo/templates/sysd-index-template.md`: 変更、+4 / -20 行

## 3. 申し送り

- track の作り直し: `sch-strategy-kata-wave-3.yaml` の `rulebook-maintenance` と `sample-maintenance` の段の説明を変えたため、オーケストレーターが `kata-wave-3` の track を作り直す。tsp-index で流している試しへの反映の要否も判断する。
- 型の grade: 統合の後に、直した template（cnd・cxd・cpd・sysd-index・sysd-critical-flows・sysd-cross-cutting-policy）と、sample・rulebook の作成標準を grade する。
- rulebook に残る役割の記述: cnd-rulebook の 6.1（「誰がどの利用場面で配置・結合の何を判断するかを示します」）と 6.6 の見出し「検証・承認前の確認」、sysd-cross-cutting-policy-rulebook の本文要件（概要の「誰がどの判断に使うか」）、prj-issues-and-approach-rulebook の導入部（承認者）は、第 3〜6 波と kata-slim-3 で直す。prj-issues-and-approach-template は rulebook が承認者を必須にしているため今回は直さず、rulebook と合わせて直す。
- sample に残る役割の列: cnd-sample の Person の「判断・確認の責務」列などは、型の波の sample の段で直す。
- 迷って決めたこと: 未決事項やメモの表の「担当ロール」「判断者」列は、文書の作業の割り当てなので登録簿で追うものとして外した。cnd-template の「検証・承認前の確認」の節は、中身が承認と記録の参照だけだったため節ごと外した。カタログの「〜を承認できること」の `done_criteria` は、承認の記録を求めていないため残した。
- CHANGELOG に書く事項（個票の 5.5 にも記載）: 区分は Changed。行の文案は「sample と rulebook の作成標準、C4 図と SYSD の template、共通レビュー観点で、文書の役割の割り当てと承認の進み具合を本文に求めないようにした（RACI・体制など役割を扱う文書は対象外）」。
- 保護された設定の変更は無い。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
