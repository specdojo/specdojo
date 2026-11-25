---
specdojo:
  id: prj-0001:xer-pjr-2q0g-20261125t131106z-482bc096
  type: exec-result
  task_id: PJR-2Q0G
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-2Q0G/pjr-2q0g-20261125T131106Z-482bc096/plan.md
  started_at: "2026-11-25T13:11:08.004Z"
  completed_at: "2026-11-25T13:27:38.635Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- grade が LLM を使わずに大きさの指標（sample との比・前回の grade からの増え方・運用と検証の章の割合）を測って grade result の `size_metrics` に記録し、`grade_rubric.size_limits` の上限を超えると `vp-arc-conciseness` に minor か major の finding を付けるようにした。executor が削れる箇所を示さない場合は note に下げて減点しない。rubric は `grade-rubric-v3`。観点の check と evidence、schema、review-guide、command-reference、個票の対応結果を更新し、単体テストを足した。

## 2. 変更ファイル

- `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml`: 変更、+31 / -3 行
- `docs/ja/specdojo/guides/review-guide.md`: 変更、+9 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+4 / -2 行
- `docs/specdojo/schemas/v1/grade-result.schema.yaml`: 変更、+19 / -0 行
- `docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml`: 変更、+45 / -0 行
- `src/grade/apply.ts`: 変更、+11 / -2 行
- `src/grade/plan.ts`: 変更、+70 / -8 行
- `src/grade/targets.ts`: 変更、+37 / -0 行
- `src/review/types.ts`: 変更、+21 / -0 行
- `src/shared/grade-result.ts`: 変更、+26 / -0 行
- `src/grade/size-metrics.ts`: 追加、+280 / -0 行
- `tests/src/grade/size-metrics.test.ts`: 追加、+413 / -0 行

## 3. 申し送り

- 上限の数値は PJR-8S4T と PJR-CPZH・PJR-Y5AC の実測から決めた（sample との比は minor 1.5・major 2.5、前回からの比は minor 1.3・major 1.8、運用・検証の章の割合は minor 20%・major 30%、それぞれ最小の量あり）。根拠の表は個票の「指標と上限」にある。
- 決めた内容: 指標の finding は、executor が `vp-arc-conciseness` で削れる箇所を minor 以上で示した場合だけ減点し、示さない場合は note にする（判断に要る記述まで削らせないため）。新しい観点にせず `vp-arc-conciseness` に付けた。sample との比は成果物だけで求める。YAML とインライン方式には指標を足していない。
- rubric の id を `grade-rubric-v2` から `grade-rubric-v3` に改めた。`grade list --rubric-outdated` と `rubric_outdated: true` の定期 routine で v2 の結果が順に評価し直される（agent の利用枠を使う）。
- 前回からの増え方は、前回の結果に `size_metrics` がある場合だけ求める。v3 で 1 回 grade した後から効く。
- 実際の grade（agent の起動）は executor から流せないため流していない。統合の後に orchestrator が grade を流し、膨らんだ文書の点数と finding を確かめ、必要なら `size_limits` を見直す。
- 今の sld-sample は PJR-8S4T で見直した後の版のため、捕まえないこと（対照）を確かめた。捕まえるのは PJR-8S4T の前の版（運用・検証の章 29%）である。
- `src/grade/apply.ts` の `applyGradeSubmission` と `src/grade/plan.ts` の `renderGradePlanWithEmbedding` は変更前から ESLint の `max-lines-per-function` の warn があり、今回 1〜2 行増えた（error ではない）。
- 保護された設定の変更は不要だった。CHANGELOG の文案は個票の「CHANGELOG に書く事項」にある（区分: 変更）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
